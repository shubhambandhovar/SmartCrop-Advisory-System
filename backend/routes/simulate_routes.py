import os
import numpy as np
import pandas as pd
from flask import Blueprint, request, jsonify
from sklearn.ensemble import AdaBoostClassifier, GradientBoostingClassifier, RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.preprocessing import StandardScaler, MinMaxScaler
from sklearn.cluster import KMeans
from sklearn.metrics import accuracy_score, f1_score
from imblearn.over_sampling import SMOTE
from sklearn.model_selection import train_test_split, StratifiedKFold, cross_val_score

simulate_bp = Blueprint('simulate', __name__)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, "../../dataset/Crop_recommendation.csv")
FEATURE_COLUMNS = ["N", "P", "K", "temperature", "humidity", "ph", "rainfall"]

def load_dataset() -> pd.DataFrame:
    if not os.path.exists(DATA_PATH):
        raise FileNotFoundError(f"Dataset not found at {DATA_PATH}")
    df = pd.read_csv(DATA_PATH)
    return df

@simulate_bp.route('/', methods=['POST'])
def simulate_model():
    """
    Simulate training a model without saving any artifacts.
    This demonstrates the effect of hyperparameters on the model's performance.
    """
    try:
        data = request.json
        model_type = data.get('model_type', 'Random Forest')
        n_estimators = int(data.get('n_estimators', 100))
        max_depth = data.get('max_depth', None)
        if max_depth: max_depth = int(max_depth)
        learning_rate = float(data.get('learning_rate', 0.1))
        n_clusters = int(data.get('n_clusters', 22))
        use_smote = bool(data.get('use_smote', False))
        scaling_method = data.get('scaling_method', 'Standard')

        df = load_dataset().dropna().copy()
        
        # 1. Preprocessing (Outlier capping)
        numeric_cols = df.select_dtypes(include=[np.number]).columns
        for col in numeric_cols:
            q1 = df[col].quantile(0.25)
            q3 = df[col].quantile(0.75)
            iqr = q3 - q1
            lower = q1 - 1.5 * iqr
            upper = q3 + 1.5 * iqr
            df[col] = np.clip(df[col], lower, upper)

        X = df[FEATURE_COLUMNS]
        y = df["label"]

        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42, stratify=y
        )

        # 2. SMOTE optionally
        if use_smote:
            smote = SMOTE(random_state=42)
            X_train, y_train = smote.fit_resample(X_train, y_train)

        # 3. Scaling
        if scaling_method == 'MinMax':
            scaler = MinMaxScaler()
        else:
            scaler = StandardScaler()
            
        X_train_scaled = scaler.fit_transform(X_train)
        X_test_scaled = scaler.transform(X_test)

        # 4. Model Selection
        if model_type == 'Random Forest':
            model = RandomForestClassifier(n_estimators=n_estimators, max_depth=max_depth, random_state=42)
        elif model_type == 'AdaBoost':
            stump = DecisionTreeClassifier(max_depth=max_depth or 1, random_state=42)
            try:
                model = AdaBoostClassifier(estimator=stump, n_estimators=n_estimators, learning_rate=learning_rate, random_state=42)
            except TypeError:
                model = AdaBoostClassifier(base_estimator=stump, n_estimators=n_estimators, learning_rate=learning_rate, random_state=42)
        elif model_type == 'Gradient Boosting':
            model = GradientBoostingClassifier(n_estimators=n_estimators, max_depth=max_depth or 3, learning_rate=learning_rate, random_state=42)
        elif model_type == 'Decision Tree':
            model = DecisionTreeClassifier(max_depth=max_depth, random_state=42)
        elif model_type == 'Logistic Regression':
            model = LogisticRegression(max_iter=1000, random_state=42)
        else:
            return jsonify({"error": "Unsupported model type"}), 400

        # 5. Training
        model.fit(X_train_scaled, y_train)
        preds = model.predict(X_test_scaled)

        # 6. Evaluation
        acc = accuracy_score(y_test, preds)
        f1 = f1_score(y_test, preds, average='weighted', zero_division=0)
        
        # Cross validation
        skf = StratifiedKFold(n_splits=3, shuffle=True, random_state=42) # 3 for speed
        cv_scores = cross_val_score(model, X_train_scaled, y_train, cv=skf, scoring='accuracy')

        feature_importances = []
        if hasattr(model, "feature_importances_"):
            feature_importances = model.feature_importances_.tolist()
            
        # 7. KMeans simulation
        X_full_scaled = scaler.transform(X)
        kmeans = KMeans(n_clusters=n_clusters, random_state=42, n_init=5)
        kmeans.fit(X_full_scaled)
        inertia = kmeans.inertia_

        return jsonify({
            "accuracy": acc,
            "f1_score": f1,
            "cv_mean": cv_scores.mean(),
            "cv_std": cv_scores.std(),
            "feature_importances": feature_importances,
            "features": FEATURE_COLUMNS,
            "kmeans_inertia": inertia
        })

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500
