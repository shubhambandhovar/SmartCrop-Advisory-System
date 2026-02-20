# Research & Model Analytics Dashboard Architecture

## 1. Overview and Rationale
The "Research & Model Analytics Dashboard" serves as the **Explainable AI (XAI)** core of the Smart Crop Advisory System. In an academic/capstone setting and real-world agricultural deployments, relying on a "black box" model is unacceptable. The interactive analytics mode brings complete transparency, allowing examiners, data scientists, and agricultural experts to evaluate *why* the model makes specific decisions and verify its statistical integrity.

### Why Interactive over Static Images?
- **Real-world Insight:** Interactive plots natively provide exact metrics through tooltips, which static PNGs cannot do. (e.g., hovering over the confusion matrix cell to see exact misclassification numbers).
- **Scalability:** The dashboard queries JSON data asynchronously. If the dataset scales or training is rerun, the dashboard dynamically updates without developers needing to manually open images or rerun visualization scripts.
- **Viva Demonstration:** Capstone examiners prefer live, navigable systems. Demonstrating an interactive dashboard highlights full-stack engineering proficiency alongside Machine Learning competence.

## 2. Architecture Flow

1. **Training Phase (Backend - `generate_dashboard_data.py`):**
   - The ML pipeline trains the Supervised (Random Forest, AdaBoost, etc.) and Unsupervised (K-Means) models.
   - Using the `generate_dashboard_data.py` routine, heavyweight processing (like calculating global SHAP impacts, performing PCA for 7-dimensional clustering, and rendering the 22x22 confusion matrix) is extracted.
   - This aggregated summary is cached into a highly optimized JSON file: `dashboard_data.json`.
   
2. **API Layer (Backend - `dev_routes.py`):**
   - The Flask backend exposes endpoints (e.g., `/dev/feature-importance`, `/dev/shap-summary`).
   - Instead of sending massive datasets or processing expensive ML artifacts for every HTTP GET request, it directly serves the pre-calculated, lightweight arrays from the JSON cache. This ensures `<50ms` response times.

3. **Presentation Layer (Frontend - React + Recharts):**
   - The `/research-dashboard` route mounts and makes asynchronous `axios` calls concurrently to gather all Dev metrics via `Promise.all()`.
   - Dedicated React components (e.g., `<ShapSummary />`, `<ClusterVisualization />`) ingest these arrays and utilize the `recharts` library and CSS grids to output SVG-based data visualizations. 

## 3. Explaining the Dashboard Metrics

### Data Imbalance (Class Distribution)
Shows if certain crops dominate the dataset (e.g., Rice having too many samples). We highlight this because our underlying training code uses SMOTE to dynamically synthesize minority samples to balance exactly this distribution.

### Correlation Heatmap
Highlights multi-collinearity. For example, high Temperature and high Humidity might be positively correlated. Examiners look for this to verify that developers understand feature interactions.

### Stratified K-Fold CV Stability
Demonstrates that the Random Forest's 99%+ accuracy isn't a fluke. A stable line across the 5 folds with a tight Standard Deviation proves model stability regardless of how the training data was split.

### PCA Cluster Visualization (K-Means)
Reduces the 7-dimensional dataset (N,P,K, etc.) into 2 Principal Components. It scatters the samples and overlays centroids (Red Stars) so examiners can visually grasp how the Unsupervised Model groups similar agronomic environments.

### Feature Importance & SHAP
- **Random Forest Feature Importance:** Gini reduction built directly into Scikit-Learn.
- **SHAP Global Impact:** A game-theoretic estimation of exactly how much (on average) each feature shifts the output probability. This proves that the feature `Rainfall` and `Humidity` drive decisions, which aligns biologically with real-world farming.
