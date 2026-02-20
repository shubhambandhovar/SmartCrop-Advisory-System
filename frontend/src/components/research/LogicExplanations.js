export const logicExplanations = {
    ModelComparisonChart: {
        title: "Model Accuracy Comparison",
        plainText: "This visualization shows the accuracy scores of various machine learning models evaluated on the test set. It helps us select the most robust algorithm.",
        code: `    models = {
        "Logistic Regression": LogisticRegression(max_iter=1000),
        "Decision Tree": DecisionTreeClassifier(random_state=42),
        "Random Forest": RandomForestClassifier(n_estimators=200, random_state=42),
        "AdaBoost": build_adaboost(),
        "Gradient Boosting": Gradient BoostingClassifier(...)
    }
    
    for name, model in models.items():
        model.fit(X_train_scaled, y_train)
        preds = model.predict(X_test_scaled)
        acc = accuracy_score(y_test, preds)
        results[name] = acc
        
    plt.figure(figsize=(9, 5))
    sns.barplot(x=list(results.keys()), y=list(results.values()), color="seagreen")
    plt.savefig(os.path.join(PLOTS_DIR, "model_accuracy_comparison.png"))`,
        math: "\\text{Accuracy} = \\frac{\\text{Number of Correct Predictions}}{\\text{Total Number of Predictions}}"
    },
    CrossValidationChart: {
        title: "Stratified K-Fold CV",
        plainText: "Displays the model's accuracy across different sub-samples (folds) of the training data ensuring stability.",
        code: `    print("Performing Stratified K-Fold Cross Validation on Random Forest...")
    skf = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
    cv_scores = cross_val_score(rf_model, X_train_scaled, y_train, cv=skf, scoring='accuracy')
    mean_acc = cv_scores.mean()
    std_acc = cv_scores.std()
    print(f"Stratified CV Mean Accuracy: {mean_acc:.4f} (+/- {std_acc:.4f})")`,
        math: "\\text{CV Mean Accuracy} = \\frac{1}{k} \\sum_{i=1}^{k} \\text{Accuracy}_i"
    },
    ClassDistributionChart: {
        title: "Class Imbalance Distribution",
        plainText: "Shows how many samples exist for each crop label in the dataset.",
        code: `    class_counts = df['label'].value_counts()
    dashboard_data["class_distribution"] = {
        "labels": class_counts.index.tolist(),
        "counts": class_counts.values.tolist()
    }`,
        math: "\\text{Distribution} = \\frac{N_{class}}{\\sum N_{total}}"
    },
    ScalerVisualization: {
        title: "Standard Scaler Validation",
        plainText: "Demonstrates how features like Rainfall and pH are standardized so they have a mean of 0 and a variance of 1.",
        code: `    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    dashboard_data["scaler_params"] = {
        "features": list(FEATURE_COLUMNS),
        "means": scaler.mean_.tolist(),
        "variances": scaler.var_.tolist()
    }`,
        math: "z = \\frac{x - \\mu}{\\sigma}"
    },
    BoxplotChart: {
        title: "Feature Distribution Span (Boxplots)",
        plainText: "Displays the IQR, min, max, and median for all continuous features to identify spread and outliers.",
        code: `def plot_eda(df: pd.DataFrame) -> None:
    numeric_cols = df.select_dtypes(include=[np.number]).columns
    
    plt.figure(figsize=(12, 7))
    sns.boxplot(data=df[numeric_cols])
    plt.title("Boxplot of Features")
    plt.xlabel("Features")
    plt.ylabel("Value")
    plt.xticks(rotation=30)
    plt.tight_layout()
    plt.savefig(os.path.join(PLOTS_DIR, "boxplot_features.png"))
    plt.close()`,
        math: "\\text{IQR} = Q_3 - Q_1"
    },
    FeatureImportanceChart: {
        title: "Random Forest Feature Importances",
        plainText: "Measures how much each feature contributed to reducing Gini impurity across all decision trees in the ensemble model.",
        code: `    if hasattr(model, "feature_importances_"):
        feature_importances[name] = model.feature_importances_
        
    for name, importances in feature_importances.items():
        plt.figure(figsize=(9, 5))
        indices = np.argsort(importances)[::-1]
        plt.bar(range(len(importances)), importances[indices], align="center")
        ordered_features = np.array(FEATURE_COLUMNS)[indices]
        plt.xticks(range(len(importances)), ordered_features, rotation=45)
        filename = f"feature_importance_{name.replace(' ', '_').lower()}.png"
        plt.savefig(os.path.join(PLOTS_DIR, filename))`,
        math: "\\text{Importance}_j = \\sum_{t \\in \\text{Trees}} \\Delta I(t, j)"
    },
    AdaBoostChart: {
        title: "AdaBoost Feature Importances",
        plainText: "Shows feature importances based on AdaBoost's sequential learning mechanism, penalizing misclassifications heavily.",
        code: `    def build_adaboost() -> AdaBoostClassifier:
        stump = DecisionTreeClassifier(max_depth=1, random_state=42)
        return AdaBoostClassifier(estimator=stump, n_estimators=100, learning_rate=0.5, random_state=42)
        
    models["AdaBoost"] = build_adaboost()
    # Feature importances extracted via model.feature_importances_ and saved as plot.`,
        math: "w_{i}^{(m+1)} = w_{i}^{(m)} \\exp(\\alpha_m I(y_i \\neq G_m(x_i)))"
    },
    GBChart: {
        title: "Gradient Boosting Feature Importances",
        plainText: "Gradient Boosting analyzes which features minimize residual loss functions during sequential tree building.",
        code: `    models["Gradient Boosting"] = GradientBoostingClassifier(n_estimators=150, learning_rate=0.1, random_state=42)
    # Feature importances extracted via model.feature_importances_ and saved as feature_importance_gradient_boosting.png.`,
        math: "F_m(x) = F_{m-1}(x) + \\nu \\gamma_m h_m(x)"
    },
    ShapSummary: {
        title: "Global SHAP Summary",
        plainText: "Uses Shapley Additive Explanations (Game Theory) to explain the global impact each feature has on model predictions.",
        code: `    print("Generating SHAP plots for Explainability...")
    explainer = shap.TreeExplainer(rf_model)
    shap_values = explainer.shap_values(X_test_scaled)
    
    # Global Summary Plot
    plt.figure(figsize=(10, 8))
    sv_summary = shap_values[0] if isinstance(shap_values, list) else shap_values
    shap.summary_plot(sv_summary, X_test_scaled, feature_names=FEATURE_COLUMNS, show=False)
    plt.title("SHAP Feature Importance (Global Explainability - Class 0)")
    plt.savefig(os.path.join(PLOTS_DIR, "shap_summary.png"))`,
        math: "\\phi_i(v) = \\sum_{S \\subseteq N \\setminus \\{i\\}} \\frac{|S|! (n - |S| - 1)!}{n!} (v(S \\cup \\{i\\}) - v(S))"
    },
    ShapLocalChart: {
        title: "Local SHAP Waterfall",
        plainText: "Explains precisely why ONE specific prediction was made, breaking down the exact push/pull feature impacts.",
        code: `    # Local explainability for a single prediction
    single_instance = X_test_scaled[0]
    pred_class_idx = np.argmax(rf_model.predict_proba([single_instance])[0])
    
    shap.plots.waterfall(shap.Explanation(
        values=sv, 
        base_values=bv, 
        data=single_instance, 
        feature_names=FEATURE_COLUMNS
    ), show=False)
    
    plt.savefig(os.path.join(PLOTS_DIR, "shap_local.png"))`,
        math: "f(x) = g(x') = \\phi_0 + \\sum_{i=1}^M \\phi_i x'_i"
    },
    CorrelationHeatmap: {
        title: "Pearson Correlation Heatmap",
        plainText: "Evaluates the linear relationship between all numeric features to detect multi-collinearity.",
        code: `def plot_eda(df: pd.DataFrame) -> None:
    numeric_cols = df.select_dtypes(include=[np.number]).columns
    
    plt.figure(figsize=(10, 8))
    sns.heatmap(df[numeric_cols].corr(), annot=True, cmap="coolwarm")
    plt.title("Correlation Matrix")
    plt.xlabel("Features")
    plt.ylabel("Features")
    plt.tight_layout()
    plt.savefig(os.path.join(PLOTS_DIR, "correlation.png"))`,
        math: "r = \\frac{\\sum (x_i - \\bar{x})(y_i - \\bar{y})}{\\sqrt{\\sum (x_i - \\bar{x})^2 \\sum (y_i - \\bar{y})^2}}"
    },
    ClusterMapChart: {
        title: "Cluster-Label Distribution Map",
        plainText: "Heatmap evaluating how accurately unsupervised KMeans clustered the known true crop labels together without being told the labels.",
        code: `    df_clustered["cluster"] = clusters
    cluster_map = (
        df_clustered.groupby("cluster")["label"]
        .value_counts(normalize=True)
        .unstack(fill_value=0)
        .to_dict("index")
    )
    
    cluster_map_df = pd.DataFrame(cluster_map).T.fillna(0)
    sns.heatmap(cluster_map_df, annot=True, fmt=".2f", cmap="YlGnBu")
    plt.savefig(os.path.join(PLOTS_DIR, "cluster_map_heatmap.png"))`
    },
    ClusterVisualization: {
        title: "PCA Dimension Reduction",
        plainText: "Condenses highly dimensional crop environments down to 2 dimensions for easy visual assessment of K-Means clusters.",
        code: `    from sklearn.decomposition import PCA
    pca = PCA(n_components=2)
    X_pca = pca.fit_transform(X_full_scaled)
    
    plt.figure(figsize=(10, 7))
    scatter = plt.scatter(X_pca[:, 0], X_pca[:, 1], c=clusters, cmap="tab20", alpha=0.7)
    plt.title(f"KMeans Clusters (n={n_clusters})")
    plt.xlabel("Principal Component 1")
    plt.ylabel("Principal Component 2")
    plt.savefig(os.path.join(PLOTS_DIR, "kmeans_clusters.png"))`,
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
    optimal_k = kn.knee
    print(f"Optimal K found via Elbow Method: {optimal_k}")
    
    plt.plot(K_range, inertias, 'bx-')
    plt.vlines(optimal_k, plt.ylim()[0], plt.ylim()[1], linestyles='dashed', colors='red')
    plt.savefig(os.path.join(PLOTS_DIR, "kmeans_elbow.png"))`,
        math: "\\text{Inertia} = \\sum_{i=1}^{n} \\min_{\\mu_j \\in C} (||x_i - \\mu_j||^2)"
    },
    KMeansCountsChart: {
        title: "K-Means Cluster Counts",
        plainText: "Evaluates standard size density of generated clusters. Important for discovering if K-Means created a massive super-cluster or cleanly distributed environments.",
        code: `    # Save a countplot of cluster assignments
    plt.figure(figsize=(8, 5))
    sns.countplot(x=clusters)
    plt.title("KMeans Cluster Counts")
    plt.xlabel("Cluster")
    plt.ylabel("Count")
    plt.tight_layout()
    plt.savefig(os.path.join(PLOTS_DIR, "kmeans_cluster_counts.png"))`
    },
    MembershipScoreChart: {
        title: "Fuzzy Membership & Confidence",
        plainText: "Converts hard model probability distributions into soft clustering membership degrees indicating confidence margins.",
        code: `# Frontend interprets Probability Matrix from the Prediction API Endpoint
# prediction_routes.py mapping:
probabilities = model.predict_proba(features_scaled)[0]
top_3_idx = np.argsort(probabilities)[::-1][:3]
confidence_scores = [probabilities[idx] * 100 for idx in top_3_idx]`
    },
    ConfusionMatrix: {
        title: "Model Confusion Matrix",
        plainText: "Evaluates exact True Positives vs False Positives/Negatives to detect if the model routinely 'confuses' similar crops (like Apple vs Orange).",
        code: `    from sklearn.metrics import confusion_matrix
    import seaborn as sns
    import matplotlib.pyplot as plt
    
    preds = best_model.predict(X_test_scaled)
    cm = confusion_matrix(y_test, preds)
    
    # Typically plotted via sns.heatmap(cm, annot=True)
    # Stored and mapped to frontend dashboard visualization`
    },
    AlgorithmExplain: {
        title: "Model Explanation Logic",
        plainText: "This visualization was generated directly by the backend inference engine.",
        code: `# Fallback for generic logic components.`
    }
};
