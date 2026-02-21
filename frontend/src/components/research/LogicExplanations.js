export const logicExplanations = {
    ModelComparisonChart: {
        title: "Model Accuracy Comparison",
        plainText: "This visualization shows the accuracy scores of various machine learning models evaluated on the test set. It helps us select the most robust algorithm.",
        code: `    models = {
        "Logistic Regression": LogisticRegression(max_iter=1000),
        "Decision Tree": DecisionTreeClassifier(random_state=42),
        "Random Forest": RandomForestClassifier(n_estimators=200, random_state=42),
        "AdaBoost": build_adaboost(),
        "Gradient Boosting": GradientBoostingClassifier(n_estimators=150, learning_rate=0.1, random_state=42),
    }

    results = {}
    for name, model in models.items():
        model.fit(X_train_scaled, y_train)
        preds = model.predict(X_test_scaled)
        acc = accuracy_score(y_test, preds)
        results[name] = acc
        print(f"{name} Accuracy: {acc:.4f}")`,
        math: "\\text{Accuracy} = \\frac{\\text{Number of Correct Predictions}}{\\text{Total Number of Predictions}}"
    },
    CrossValidationChart: {
        title: "Stratified K-Fold CV",
        plainText: "Displays the model's accuracy across different sub-samples (folds) of the training data ensuring stability.",
        code: `    print("Performing Stratified K-Fold Cross Validation on Random Forest...")
    skf = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
    # Perform cross-validation to ensure model stability across different random splits.
    # Stratification ensures preserving class distribution, particularly important for imbalanced agricultural datasets.
    cv_scores = cross_val_score(rf_model, X_train_scaled, y_train, cv=skf, scoring='accuracy')
    mean_acc = cv_scores.mean()
    std_acc = cv_scores.std()`,
        math: "\\text{CV Mean Accuracy} = \\frac{1}{k} \\sum_{i=1}^{k} \\text{Accuracy}_i"
    },
    ClassDistributionChart: {
        title: "Class Imbalance Distribution",
        plainText: "Shows how many samples exist for each crop label in the dataset.",
        code: `    # Load dataset
    df = pd.read_csv(DATA_PATH)
    y = df['label']

    # 1. Data Imbalance (Class Distribution)
    class_counts = y.value_counts().to_dict()
    class_distribution = {
        "labels": list(class_counts.keys()),
        "counts": list(class_counts.values())
    }`,
        math: "\\text{Distribution} = \\frac{N_{class}}{\\sum N_{total}}"
    },
    ScalerVisualization: {
        title: "Standard Scaler Validation",
        plainText: "Demonstrates how features like Rainfall and pH are standardized so they have a mean of 0 and a variance of 1.",
        code: `    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    joblib.dump(scaler, os.path.join(ARTIFACTS_DIR, "scaler.pkl"))`,
        math: "z = \\frac{x - \\mu}{\\sigma}"
    },
    BoxplotChart: {
        title: "Feature Distribution Span (Boxplots)",
        plainText: "Displays the IQR, min, max, and median for all continuous features to identify spread and outliers.",
        code: `    boxplot_data = []
    for col in numeric_cols:
        q1 = df[col].quantile(0.25)
        median = df[col].median()
        q3 = df[col].quantile(0.75)
        iqr = q3 - q1
        min_val = max(df[col].min(), q1 - 1.5 * iqr)
        max_val = min(df[col].max(), q3 + 1.5 * iqr)
        boxplot_data.append({
            "feature": col, "min": float(min_val), "q1": float(q1),
            "median": float(median), "q3": float(q3), "max": float(max_val)
        })`,
        math: "\\text{IQR} = Q_3 - Q_1"
    },
    FeatureImportanceChart: {
        title: "Random Forest Feature Importances",
        plainText: "Measures how much each feature contributed to reducing Gini impurity across all decision trees in the ensemble model.",
        code: `    rf_model = joblib.load(os.path.join(MODELS_DIR, "rf_model.pkl"))
    importances = rf_model.feature_importances_
    indices = np.argsort(importances)[::-1]
    sorted_features = np.array(FEATURE_COLUMNS)[indices]
    sorted_importances = importances[indices]
    feature_importance = {
        "features": sorted_features.tolist(), 
        "importances": sorted_importances.tolist()
    }`,
        math: "\\text{Importance}_j = \\sum_{t \\in \\text{Trees}} \\Delta I(t, j)"
    },
    AdaBoostChart: {
        title: "AdaBoost Feature Importances",
        plainText: "Shows feature importances based on AdaBoost's sequential learning mechanism, penalizing misclassifications heavily.",
        code: `    def build_adaboost() -> AdaBoostClassifier:
        stump = DecisionTreeClassifier(max_depth=1, random_state=42)
        return AdaBoostClassifier(estimator=stump, n_estimators=100, learning_rate=0.5, random_state=42)
        
    ada = build_adaboost()
    ada.fit(X_scaled, y)
    ada_imp = ada.feature_importances_`,
        math: "w_{i}^{(m+1)} = w_{i}^{(m)} \\exp(\\alpha_m I(y_i \\neq G_m(x_i)))"
    },
    GBChart: {
        title: "Gradient Boosting Feature Importances",
        plainText: "Gradient Boosting analyzes which features minimize residual loss functions during sequential tree building.",
        code: `    gb = GradientBoostingClassifier(n_estimators=150, learning_rate=0.1, random_state=42)
    gb.fit(X_scaled, y)
    gb_imp = gb.feature_importances_`,
        math: "F_m(x) = F_{m-1}(x) + \\nu \\gamma_m h_m(x)"
    },
    ShapSummary: {
        title: "Global SHAP Summary",
        plainText: "Uses Shapley Additive Explanations (Game Theory) to explain the global impact each feature has on model predictions.",
        code: `    explainer = shap.TreeExplainer(rf_model)
    shap_values = explainer.shap_values(sample_X)
    
    # Determine the correct format of shap_values
    if isinstance(shap_values, list):
        sv_summary = shap_values[0]
    elif hasattr(shap_values, 'shape') and len(shap_values.shape) == 3:
        sv_summary = shap_values[:, :, 0]
    else:
        sv_summary = shap_values

    mean_abs_shap = np.abs(sv_summary).mean(axis=0)`,
        math: "\\phi_i(v) = \\sum_{S \\subseteq N \\setminus \\{i\\}} \\frac{|S|! (n - |S| - 1)!}{n!} (v(S \\cup \\{i\\}) - v(S))"
    },
    ShapLocalChart: {
        title: "Local SHAP Waterfall",
        plainText: "Explains precisely why ONE specific prediction was made, breaking down the exact push/pull feature impacts.",
        code: `    single_instance = X_scaled[0]
    pred_class_idx = np.argmax(rf_model.predict_proba([single_instance])[0])
    
    explainer_local = shap.TreeExplainer(rf_model)
    sv_local = explainer_local.shap_values(single_instance)
    
    if isinstance(sv_local, list):
        sv = sv_local[pred_class_idx]
        bv = explainer_local.expected_value[pred_class_idx]
    else:
        sv = sv_local
        bv = explainer_local.expected_value`,
        math: "f(x) = g(x') = \\phi_0 + \\sum_{i=1}^M \\phi_i x'_i"
    },
    CorrelationHeatmap: {
        title: "Pearson Correlation Heatmap",
        plainText: "Evaluates the linear relationship between all numeric features to detect multi-collinearity.",
        code: `    numeric_cols = df.select_dtypes(include=[np.number]).columns
    corr_matrix = df[numeric_cols].corr()
    correlation_data = {
        "features": list(corr_matrix.columns),
        "values": corr_matrix.values.tolist()
    }`,
        math: "r = \\frac{\\sum (x_i - \\bar{x})(y_i - \\bar{y})}{\\sqrt{\\sum (x_i - \\bar{x})^2 \\sum (y_i - \\bar{y})^2}}"
    },
    ClusterMapChart: {
        title: "Cluster-Label Distribution Map",
        plainText: "Heatmap evaluating how accurately unsupervised KMeans clustered the known true crop labels together without being told the labels.",
        code: `    cluster_map = (
        df_clustered.groupby("cluster")["label"]
        .value_counts(normalize=True)
        .unstack(fill_value=0)
        .to_dict("index")
    )
    
    cm_df = pd.DataFrame(cluster_map).T.fillna(0)
    cm_matrix = cm_df.values.tolist()`,
        math: "P(class \mid cluster)"
    },
    ClusterVisualization: {
        title: "PCA Dimension Reduction",
        plainText: "Condenses highly dimensional crop environments down to 2 dimensions for easy visual assessment of K-Means clusters.",
        code: `    from sklearn.decomposition import PCA
    pca = PCA(n_components=2)
    X_pca = pca.fit_transform(X_scaled)

    # Convert clusters to simple dict mapped by cluster ID
    clusters = kmeans.predict(X_scaled)
    # centroids
    centroids_pca = pca.transform(kmeans.cluster_centers_)`,
        math: "\\min_{W} || X - X W W^T ||_F^2"
    },
    ElbowMethodChart: {
        title: "Inertia Elbow Optimization",
        plainText: "Calculates Sum of Squared Distances (Inertia) across varying K clusters to detect the optimal mathematical 'knee' where variance drops sharply.",
        code: `    inertias = []
    K_range = range(1, 31)
    for k in K_range:
        km = KMeans(n_clusters=k, random_state=42, n_init=10)
        km.fit(X_full_scaled)
        inertias.append(km.inertia_)
        
    from kneed import KneeLocator
    kn = KneeLocator(list(K_range), inertias, curve='convex', direction='decreasing')
    optimal_k = kn.knee`,
        math: "\\text{Inertia} = \\sum_{i=1}^{n} \\min_{\\mu_j \\in C} (||x_i - \\mu_j||^2)"
    },
    KMeansCountsChart: {
        title: "K-Means Cluster Counts",
        plainText: "Evaluates standard size density of generated clusters. Important for discovering if K-Means created a massive super-cluster or cleanly distributed environments.",
        code: `    unique, counts = np.unique(clusters, return_counts=True)
    kmeans_counts = {
        "clusters": [f"Cluster {int(c)}" for c in unique.tolist()],
        "counts": [int(c) for c in counts.tolist()]
    }`,
        math: "N_k = \\text{count}(\\{x_i : x_i \\in C_k\\})"
    },
    MembershipScoreChart: {
        title: "Fuzzy Membership (Soft Clustering)",
        plainText: "Implements a hybrid weighted ensemble combining Random Forest supervised probabilities with Unsupervised K-Means fuzzy clustering. The formula uses inverse distance to probabilistically weight the empirical label distributions discovered within physical sub-clusters.",
        code: `def compute_fuzzy_membership_scores(distances, cluster_map, all_labels):
    score_crop = {label: 0.0 for label in all_labels}
    
    # Calculate inverse distances. Epsilon avoids div-by-zero.
    with np.errstate(divide='ignore'):
        inv_distances = 1.0 / (distances + 1e-6)
        
    for cluster_id, inv_dist in enumerate(inv_distances):
        prob_map = cluster_map.get(cluster_id, {})
            
        # Accumulate the scores for each crop
        for label in all_labels:
            proportion = float(prob_map.get(label, 0.0))
            score_crop[label] += float(inv_dist) * proportion # ∝ (1 / d) * P(crop|C)
            
    # Normalize scores so that the total sum = 1
    total_score = sum(score_crop.values())
    if total_score > 0:
        for label in score_crop:
            score_crop[label] = float(score_crop[label] / total_score)
            
    return score_crop`,
        math: "\\text{Score}_{crop} \\propto \\sum_{k=1}^{K} \\left( \\frac{1}{d_k} \\right) \\times P(\\text{crop} \\mid C_k)"
    },
    ConfusionMatrix: {
        title: "Model Confusion Matrix",
        plainText: "Evaluates exact True Positives vs False Positives/Negatives to detect if the model routinely 'confuses' similar crops (like Apple vs Orange).",
        code: `    from sklearn.metrics import confusion_matrix
    
    preds = rf_model.predict(X_scaled)
    # Using small subset of classes to avoid massive grid if necessary
    cm = confusion_matrix(y, preds, labels=rf_model.classes_)
    
    confusion_matrix_data = {
        "classes": list(rf_model.classes_),
        "matrix": cm.tolist()
    }`,
        math: "C_{i,j} = \\text{count of instances in class } i \\text{ predicted as class } j"
    },
    AlgorithmExplain: {
        title: "Model Explanation Logic",
        plainText: "This visualization was generated directly by the backend inference engine.",
        code: `# Fallback for generic logic components.`
    }
};
