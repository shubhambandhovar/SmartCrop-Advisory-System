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
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.tree import DecisionTreeClassifier


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
    plt.tight_layout()
    plt.savefig(os.path.join(PLOTS_DIR, "correlation.png"))
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

    if best_model is not None:
        print(f"Best model by accuracy: {best_name} ({best_acc:.4f})")

    try:
        plt.figure(figsize=(9, 5))
        sns.barplot(x=list(results.keys()), y=list(results.values()), color="seagreen")
        plt.ylabel("Accuracy")
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

    print("Training pipeline completed successfully.")


if __name__ == "__main__":
    train()
