import React, { useState, useEffect } from 'react';
import api from '../services/api';
import '../Research.css';

import ClassDistributionChart from '../components/research/ClassDistributionChart';
import CorrelationHeatmap from '../components/research/CorrelationHeatmap';
import ModelComparisonChart from '../components/research/ModelComparisonChart';
import CrossValidationChart from '../components/research/CrossValidationChart';
import FeatureImportanceChart from '../components/research/FeatureImportanceChart';
import ClusterVisualization from '../components/research/ClusterVisualization';
import MembershipScoreChart from '../components/research/MembershipScoreChart';
import ShapSummary from '../components/research/ShapSummary';
import ConfusionMatrix from '../components/research/ConfusionMatrix';
import StaticArtifacts from '../components/research/StaticArtifacts';

import BoxplotChart from '../components/research/BoxplotChart';
import KMeansCountsChart from '../components/research/KMeansCountsChart';
import ClusterMapChart from '../components/research/ClusterMapChart';
import AdaBoostChart from '../components/research/AdaBoostChart';
import GBChart from '../components/research/GBChart';
import ShapLocalChart from '../components/research/ShapLocalChart';

export default function ResearchDashboard() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [data, setData] = useState({});

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const endpointMap = {
                    'class-distribution': 'class_distribution',
                    'correlation-matrix': 'correlation_matrix',
                    'model-comparison': 'model_comparison',
                    'cross-validation': 'cross_validation',
                    'feature-importance': 'feature_importance',
                    'cluster-visualization': 'cluster_visualization',
                    'membership-scores': 'membership_scores',
                    'shap-summary': 'shap_summary',
                    'confusion-matrix': 'confusion_matrix',
                    'boxplot-features': 'boxplot_features',
                    'kmeans-counts': 'kmeans_counts',
                    'cluster-map': 'cluster_map',
                    'feature-importance-adaboost': 'feature_importance_adaboost',
                    'feature-importance-gb': 'feature_importance_gb',
                    'shap-local': 'shap_local'
                };

                const promises = Object.entries(endpointMap).map(([ep, key]) =>
                    api.get(`/dev/${ep}`).then(res => ({ key, value: res.data }))
                );

                const results = await Promise.all(promises);
                const aggregated = {};
                results.forEach(res => {
                    aggregated[res.key] = res.value;
                });

                console.log("Dashboard Aggregated Data Keys:", Object.keys(aggregated));
                setData(aggregated);
                setLoading(false);
            } catch (err) {
                console.error("Dashboard fetch error:", err);
                setError("Failed to load dashboard metrics. Ensure backend logic is running.");
                setLoading(false);
            }
        };

        fetchAllData();
    }, []);

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading comprehensive model analytics...</div>;
    if (error) return <div style={{ padding: '2rem', color: 'red', textAlign: 'center' }}>{error}</div>;

    return (
        <div className="research-dashboard">
            <div className="research-grid">
                <div className="chart-card"><ModelComparisonChart data={data.model_comparison} /></div>
                <div className="chart-card"><CrossValidationChart data={data.cross_validation} /></div>

                <div className="chart-card wide"><ClassDistributionChart data={data.class_distribution} /></div>
                <div className="chart-card wide"><BoxplotChart data={data.boxplot_features} /></div>

                <div className="chart-card"><AdaBoostChart data={data.feature_importance_adaboost} /></div>
                <div className="chart-card"><GBChart data={data.feature_importance_gb} /></div>
                <div className="chart-card wide"><FeatureImportanceChart data={data.feature_importance} /></div>

                <div className="chart-card wide"><ShapSummary data={data.shap_summary} /></div>
                <div className="chart-card wide"><ShapLocalChart data={data.shap_local} /></div>

                <div className="chart-card wide"><CorrelationHeatmap data={data.correlation_matrix} /></div>
                <div className="chart-card wide"><ClusterMapChart data={data.cluster_map} /></div>

                <div className="chart-card wide"><ClusterVisualization data={data.cluster_visualization} /></div>
                <div className="chart-card"><KMeansCountsChart data={data.kmeans_counts} /></div>
                <div className="chart-card"><MembershipScoreChart data={data.membership_scores} /></div>
                <div className="chart-card wide"><ConfusionMatrix data={data.confusion_matrix} /></div>
            </div>

            <StaticArtifacts />
        </div>
    );
}
