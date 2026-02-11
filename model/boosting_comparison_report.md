# AdaBoost vs Gradient Boosting vs Random Forest: Capstone Report Supplement

## 1. AdaBoost (Adaptive Boosting)
- **Principle:** Sequentially combines multiple weak learners (typically shallow decision trees) to form a strong classifier. Each new model focuses more on instances misclassified by previous models by adjusting sample weights.
- **Strengths:** Simple, robust to overfitting, effective for moderately complex data, interpretable.
- **Limitations:** Sensitive to noisy data and outliers, less effective for highly complex relationships.

## 2. Gradient Boosting
- **Principle:** Builds an ensemble of weak learners in a stage-wise fashion, where each new model fits the residual errors (gradients) of the combined previous models. Uses gradient descent to minimize a loss function.
- **Strengths:** High predictive power, handles complex non-linear relationships, flexible (can optimize different loss functions).
- **Limitations:** Computationally intensive, prone to overfitting if not tuned, less interpretable.

## 3. Random Forest
- **Principle:** Constructs a large number of decision trees on random subsets of data and features, then aggregates their predictions (majority vote for classification).
- **Strengths:** Robust to overfitting, handles high-dimensional data, less sensitive to outliers, provides feature importance.
- **Limitations:** Less interpretable than single trees, can be slower for very large datasets.

---

## Model Comparison Table

| Model              | Accuracy | Precision | Recall | F1-score | Overfitting Risk | Interpretability | Training Speed |
|--------------------|----------|-----------|--------|----------|------------------|------------------|---------------|
| Random Forest      | High     | High      | High   | High     | Low              | Medium           | Fast          |
| AdaBoost           | Medium   | Medium    | Medium | Medium   | Medium           | High             | Fast          |
| Gradient Boosting  | High     | High      | High   | High     | High             | Low              | Slow          |

*Note: Actual metrics are in model_comparison.txt*

---

## Why Random Forest for Deployment?
- **Consistent Performance:** Delivers high accuracy and generalizes well to unseen data.
- **Robustness:** Less sensitive to noise and outliers compared to boosting methods.
- **Interpretability:** Provides feature importance, aiding agronomic insights.
- **Speed:** Faster inference and training compared to Gradient Boosting.
- **Simplicity:** Easier to maintain and less prone to overfitting with default settings.

---

## Academic Explanation (for Viva/Report)

Ensemble methods like AdaBoost, Gradient Boosting, and Random Forest enhance predictive performance by combining multiple base learners. AdaBoost focuses on correcting previous errors by reweighting samples, while Gradient Boosting optimizes a loss function using gradient descent, fitting new models to the residuals. Random Forest, in contrast, leverages bagging and feature randomness to build an ensemble of de-correlated trees, reducing variance and overfitting risk.

In our experiments, Random Forest consistently achieved the best balance of accuracy, robustness, and interpretability, making it the preferred choice for deployment in the Smart Crop Advisory System. Boosting models, while powerful, were either more sensitive to noise (AdaBoost) or required more computational resources and careful tuning (Gradient Boosting). Thus, Random Forest is selected for production, with boosting models included for comprehensive comparison and justification.

---

*For detailed metrics and plots, see model/model_comparison.txt and model/plots/.*
