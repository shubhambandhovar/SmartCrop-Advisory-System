import os
import joblib
import numpy as np
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
from imblearn.over_sampling import SMOTE
from sklearn.cluster import KMeans
from sklearn.ensemble import AdaBoostClassifier, GradientBoostingClassifier, RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report
from sklearn.model_selection import train_test_split, StratifiedKFold, cross_val_score
from sklearn.preprocessing import StandardScaler
from sklearn.tree import DecisionTreeClassifier
import shap


BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, "../dataset/Crop_recommendation.csv")
ARTIFACTS_DIR = BASE_DIR
PLOTS_DIR = os.path.join(BASE_DIR, "plots")
os.makedirs(PLOTS_DIR, exist_ok=True)

FEATURE_COLUMNS = ["N", "P", "K", "temperature", "humidity", "ph", "rainfall"]


def generate_synthetic_data(path: str, n_rows: int = 1500) -> pd.DataFrame:
    """Create a fallback dataset when the source CSV is missing or invalid."""
    print("Generating synthetic data...")
    rng = np.random.default_rng(42)
    crops = [
        "rice", "maize", "chickpea", "kidneybeans", "pigeonpeas", "mothbeans",
        "mungbean", "blackgram", "lentil", "pomegranate", "banana", "mango",
        "grapes", "watermelon", "muskmelon", "apple", "orange", "papaya",
        "coconut", "cotton", "jute", "coffee",
    ]

    n_classes = len(crops)
    samples_per_class = max(30, n_rows // n_classes)

    rows = []
    for idx, crop in enumerate(crops):
        shift = idx / n_classes
        for _ in range(samples_per_class):
            rows.append(
                {
                    "N": np.clip(rng.normal(60 + 35 * shift, 18), 0, 140),
                    "P": np.clip(rng.normal(45 + 25 * shift, 12), 5, 145),
                    "K": np.clip(rng.normal(40 + 30 * shift, 14), 5, 210),
                    "temperature": np.clip(rng.normal(24 + 8 * shift, 3.5), 8, 45),
                    "humidity": np.clip(rng.normal(58 + 30 * shift, 8), 12, 100),
                    "ph": np.clip(rng.normal(6.0 + 0.8 * shift, 0.45), 3.5, 9.5),
                    "rainfall": np.clip(rng.normal(80 + 180 * shift, 35), 10, 350),
                    "label": crop,
                }
            )

    df = pd.DataFrame(rows)
    df.to_csv(path, index=False)
    print(f"Synthetic dataset saved to: {path}")
    return df


def load_dataset() -> pd.DataFrame:
    if not os.path.exists(DATA_PATH):
        return generate_synthetic_data(DATA_PATH)

    try:
        df = pd.read_csv(DATA_PATH)
    except Exception:
        return generate_synthetic_data(DATA_PATH)

    required = set(FEATURE_COLUMNS + ["label"])
    if df.empty or not required.issubset(df.columns):
        return generate_synthetic_data(DATA_PATH)

    return df


def plot_eda(df: pd.DataFrame) -> None:
    numeric_cols = df.select_dtypes(include=[np.number]).columns
    if len(numeric_cols) == 0:
        return

    plt.figure(figsize=(10, 8))
    sns.heatmap(df[numeric_cols].corr(), annot=True, cmap="coolwarm")
    plt.title("Correlation Matrix")
    plt.xlabel("Features")
    plt.ylabel("Features")
    plt.tight_layout()
    plt.savefig(os.path.join(PLOTS_DIR, "correlation.png"))
    plt.close()

    # Boxplot for all features
    plt.figure(figsize=(12, 7))
    sns.boxplot(data=df[numeric_cols])
    plt.title("Boxplot of Features")
    plt.xlabel("Features")
    plt.ylabel("Value")
    plt.xticks(rotation=30)
    plt.tight_layout()
    plt.savefig(os.path.join(PLOTS_DIR, "boxplot_features.png"))
    plt.close()


def build_adaboost() -> AdaBoostClassifier:
    stump = DecisionTreeClassifier(max_depth=1, random_state=42)
    try:
        return AdaBoostClassifier(estimator=stump, n_estimators=100, learning_rate=0.5, random_state=42)
    except TypeError:
        return AdaBoostClassifier(base_estimator=stump, n_estimators=100, learning_rate=0.5, random_state=42)


def train() -> None:
    df = load_dataset().dropna().copy()

    # Cap extreme numeric values to reduce outlier impact while preserving rows.
    numeric_cols = df.select_dtypes(include=[np.number]).columns
    for col in numeric_cols:
        q1 = df[col].quantile(0.25)
        q3 = df[col].quantile(0.75)
        iqr = q3 - q1
        lower = q1 - 1.5 * iqr
        upper = q3 + 1.5 * iqr
        df[col] = np.clip(df[col], lower, upper)

    plot_eda(df)

    X = df[FEATURE_COLUMNS]
    y = df["label"]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    if (y_train.value_counts().max() / y_train.value_counts().min()) > 1.5:
        print("Imbalance detected. Applying SMOTE on training split...")
        smote = SMOTE(random_state=42)
        X_train, y_train = smote.fit_resample(X_train, y_train)

    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    joblib.dump(scaler, os.path.join(ARTIFACTS_DIR, "scaler.pkl"))

    models = {
        "Logistic Regression": LogisticRegression(max_iter=1000),
        "Decision Tree": DecisionTreeClassifier(random_state=42),
        "Random Forest": RandomForestClassifier(n_estimators=200, random_state=42),
        "AdaBoost": build_adaboost(),
        "Gradient Boosting": GradientBoostingClassifier(n_estimators=150, learning_rate=0.1, random_state=42),
    }

    results = {}
    reports = {}
    feature_importances = {}

    best_name = None
    best_model = None
    best_acc = -1.0

    print("Training supervised models...")
    for name, model in models.items():
        model.fit(X_train_scaled, y_train)
        preds = model.predict(X_test_scaled)
        acc = accuracy_score(y_test, preds)
        results[name] = acc
        reports[name] = classification_report(y_test, preds, zero_division=0)
        print(f"{name} Accuracy: {acc:.4f}")

        if hasattr(model, "feature_importances_"):
            feature_importances[name] = model.feature_importances_

        if acc > best_acc:
            best_acc = acc
            best_name = name
            best_model = model

    comparison_path = os.path.join(ARTIFACTS_DIR, "model_comparison.txt")
    with open(comparison_path, "w", encoding="utf-8") as f:
        f.write("MODEL COMPARISON RESULTS\n\n")
        for name in models:
            f.write(f"{name} Accuracy: {results[name]:.4f}\n")
            f.write(reports[name])
            f.write("\n" + "-" * 50 + "\n")

    # Preserve existing contract: save RF metrics/model artifacts expected by backend.
    rf_model = models["Random Forest"]
    rf_preds = rf_model.predict(X_test_scaled)
    with open(os.path.join(ARTIFACTS_DIR, "rf_metrics.txt"), "w", encoding="utf-8") as f:
        f.write(classification_report(y_test, rf_preds, zero_division=0))

    joblib.dump(rf_model, os.path.join(ARTIFACTS_DIR, "rf_model.pkl"))

    print("Performing Stratified K-Fold Cross Validation on Random Forest...")
    skf = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
    # Perform cross-validation to ensure model stability across different random splits.
    # Stratification ensures preserving class distribution, particularly important for imbalanced agricultural datasets.
    cv_scores = cross_val_score(rf_model, X_train_scaled, y_train, cv=skf, scoring='accuracy')
    mean_acc = cv_scores.mean()
    std_acc = cv_scores.std()

    cv_output_path = os.path.join(ARTIFACTS_DIR, "cross_validation_results.txt")
    with open(cv_output_path, "w", encoding="utf-8") as f:
        f.write("Stratified K-Fold Cross Validation (k=5) Results\n")
        f.write("----------------------------------------------\n")
        f.write("Model: Random Forest Classifier\n")
        f.write("Explanation: Stratification ensures that each fold maintains the same class distribution as the original dataset. This is critical for imbalanced agricultural data to prevent folds that might lack certain rare crop instances.\n\n")
        f.write(f"Fold Accuracies: {np.round(cv_scores, 4).tolist()}\n")
        f.write(f"Mean Accuracy: {mean_acc:.4f}\n")
        f.write(f"Standard Deviation: {std_acc:.4f}\n")
    print(f"Stratified CV Mean Accuracy: {mean_acc:.4f} (+/- {std_acc:.4f})")

    print("Generating SHAP plots for Explainability...")
    try:
        explainer = shap.TreeExplainer(rf_model)
        # Calculate SHAP values for the test set
        shap_values = explainer.shap_values(X_test_scaled)
        
        # Determine the correct format of shap_values (older vs newer shap versions)
        is_list = isinstance(shap_values, list)
        is_3d = hasattr(shap_values, 'shape') and len(shap_values.shape) == 3
        
        # Summary Plot (Global)
        plt.figure(figsize=(10, 8))
        
        # For a clean global explanation, we use a bar plot type or take class 0
        if is_list:
            sv_summary = shap_values[0]
        elif is_3d:
            sv_summary = shap_values[:, :, 0]
        else:
            sv_summary = shap_values
            
        shap.summary_plot(sv_summary, X_test_scaled, feature_names=FEATURE_COLUMNS, show=False)
        plt.title("SHAP Feature Importance (Global Explainability - Class 0)")
        plt.tight_layout()
        plt.savefig(os.path.join(PLOTS_DIR, "shap_summary.png"))
        plt.close()

        # Local explainability for a single prediction
        plt.figure(figsize=(10, 6))
        single_instance = X_test_scaled[0]
        pred_class_idx = np.argmax(rf_model.predict_proba([single_instance])[0])
        
        if is_list:
            sv = shap_values[pred_class_idx][0]
            bv = explainer.expected_value[pred_class_idx]
        elif is_3d:
            sv = shap_values[0, :, pred_class_idx]
            bv = explainer.expected_value[pred_class_idx]
        else:
            sv = shap_values[0]
            bv = explainer.expected_value[0] if isinstance(explainer.expected_value, (list, np.ndarray)) else explainer.expected_value

        shap.plots.waterfall(shap.Explanation(
            values=sv, 
            base_values=bv, 
            data=single_instance, 
            feature_names=FEATURE_COLUMNS
        ), show=False)

        plt.title(f"SHAP Local Explanation for Predicted Class: {rf_model.classes_[pred_class_idx]}")
        plt.tight_layout()
        plt.savefig(os.path.join(PLOTS_DIR, "shap_local.png"))
        plt.close()
    except Exception as exc:
        import traceback
        print("SHAP exception:")
        traceback.print_exc()

    if best_model is not None:
        print(f"Best model by accuracy: {best_name} ({best_acc:.4f})")

    try:
        plt.figure(figsize=(9, 5))
        sns.barplot(x=list(results.keys()), y=list(results.values()), color="seagreen")
        plt.ylabel("Accuracy")
        plt.xlabel("Model")
        plt.title("Model Accuracy Comparison")
        plt.xticks(rotation=20)
        plt.ylim(0, 1)
        plt.tight_layout()
        plt.savefig(os.path.join(PLOTS_DIR, "model_accuracy_comparison.png"))
        plt.close()
    except Exception as exc:
        print(f"Could not generate accuracy plot: {exc}")

    for name, importances in feature_importances.items():
        try:
            plt.figure(figsize=(9, 5))
            indices = np.argsort(importances)[::-1]
            plt.bar(range(len(importances)), importances[indices], align="center")
            ordered_features = np.array(FEATURE_COLUMNS)[indices]
            plt.xticks(range(len(importances)), ordered_features, rotation=45)
            plt.title(f"Feature Importances: {name}")
            plt.xlabel("Features")
            plt.ylabel("Importance")
            plt.tight_layout()
            filename = f"feature_importance_{name.replace(' ', '_').lower()}.png"
            plt.savefig(os.path.join(PLOTS_DIR, filename))
            plt.close()
        except Exception as exc:
            print(f"Could not generate feature importance plot for {name}: {exc}")

    print("Training K-Means...")
    X_full_scaled = scaler.transform(X)
    n_clusters = y.nunique()
    kmeans = KMeans(n_clusters=n_clusters, random_state=42, n_init=10)
    clusters = kmeans.fit_predict(X_full_scaled)
    joblib.dump(kmeans, os.path.join(ARTIFACTS_DIR, "kmeans.pkl"))

    df_clustered = df.copy()
    df_clustered["cluster"] = clusters
    cluster_map = (
        df_clustered.groupby("cluster")["label"]
        .value_counts(normalize=True)
        .unstack(fill_value=0)
        .to_dict("index")
    )

    joblib.dump(cluster_map, os.path.join(ARTIFACTS_DIR, "cluster_map.pkl"))

    # Visualize cluster_map as a heatmap for interpretability
    try:
        import pandas as pd
        cluster_map_df = pd.DataFrame(cluster_map).T.fillna(0)
        plt.figure(figsize=(min(18, 2+0.5*len(cluster_map_df.columns)), 1+0.4*len(cluster_map_df)))
        sns.heatmap(cluster_map_df, annot=True, fmt=".2f", cmap="YlGnBu")
        plt.title("Cluster-Label Distribution Heatmap")
        plt.xlabel("Label (Crop)")
        plt.ylabel("Cluster")
        plt.tight_layout()
        plt.savefig(os.path.join(PLOTS_DIR, "cluster_map_heatmap.png"))
        plt.close()
    except Exception as exc:
        print(f"Could not generate cluster_map heatmap: {exc}")

    # Visualize KMeans clusters using first two principal components (if >2 features)
    try:
        from sklearn.decomposition import PCA
        pca = PCA(n_components=2)
        X_pca = pca.fit_transform(X_full_scaled)
        plt.figure(figsize=(10, 7))
        scatter = plt.scatter(X_pca[:, 0], X_pca[:, 1], c=clusters, cmap="tab20", alpha=0.7)
        plt.title(f"KMeans Clusters (n={n_clusters})")
        plt.xlabel("Principal Component 1")
        plt.ylabel("Principal Component 2")
        legend1 = plt.legend(*scatter.legend_elements(), title="Cluster")
        plt.gca().add_artist(legend1)
        plt.tight_layout()
        plt.savefig(os.path.join(PLOTS_DIR, "kmeans_clusters.png"))
        plt.close()
    except Exception as exc:
        print(f"Could not generate KMeans cluster plot: {exc}")

    # Save a countplot of cluster assignments
    try:
        plt.figure(figsize=(8, 5))
        sns.countplot(x=clusters)
        plt.title("KMeans Cluster Counts")
        plt.xlabel("Cluster")
        plt.ylabel("Count")
        plt.tight_layout()
        plt.savefig(os.path.join(PLOTS_DIR, "kmeans_cluster_counts.png"))
        plt.close()
    except Exception as exc:
        print(f"Could not generate KMeans cluster count plot: {exc}")

    print("Training pipeline completed successfully.")


if __name__ == "__main__":
    train()
