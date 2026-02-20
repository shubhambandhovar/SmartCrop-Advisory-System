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
import ElbowMethodChart from '../components/research/ElbowMethodChart';

import BoxplotChart from '../components/research/BoxplotChart';
import KMeansCountsChart from '../components/research/KMeansCountsChart';
import ClusterMapChart from '../components/research/ClusterMapChart';
import AdaBoostChart from '../components/research/AdaBoostChart';
import GBChart from '../components/research/GBChart';
import ShapLocalChart from '../components/research/ShapLocalChart';
import ScalerVisualization from '../components/research/ScalerVisualization';

import SimulationPanel from '../components/research/SimulationPanel';
import DevWrapper from '../components/research/DevWrapper';
import { logicExplanations } from '../components/research/LogicExplanations';

export default function ResearchDashboard() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [data, setData] = useState({});

    // Developer Features
    const [devMode, setDevMode] = useState(true); // By default true for this demonstration as requested
    const [simulatedData, setSimulatedData] = useState(null);

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
                    'shap-local': 'shap_local',
                    'scaler-params': 'scaler_params'
                };

                const promises = Object.entries(endpointMap).map(([ep, key]) =>
                    api.get(`/dev/${ep}`).then(res => ({ key, value: res.data }))
                );

                const results = await Promise.all(promises);
                const aggregated = {};
                results.forEach(res => {
                    aggregated[res.key] = res.value;
                });

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

    const handleSimulation = (simData) => {
        setSimulatedData(simData);
    };

    const handleResetSimulation = () => {
        setSimulatedData(null);
    };

    if (loading) return (
        <div style={{ padding: '4rem', textAlign: 'center' }}>
            <div className="loader"></div>
            <h3>Loading comprehensive model analytics...</h3>
            <p style={{ color: '#666' }}>Fetching correlation matrices, feature scaling, and cluster density from the backend data lake.</p>
        </div>
    );
    if (error) return <div style={{ padding: '2rem', color: 'red', textAlign: 'center' }}>{error}</div>;

    // Use simulated data if active, otherwise production data
    const activeData = simulatedData ? {
        ...data,
        model_comparison: {
            labels: ["Simulated Model"],
            accuracy: [simulatedData.accuracy]
        },
        cross_validation: {
            folds: ["Fold 1", "Fold 2", "Fold 3", "Fold 4", "Fold 5"],
            accuracies: Array(5).fill(simulatedData.cv_mean).map(v => v + (Math.random() * 0.02 - 0.01)),
            mean: simulatedData.cv_mean,
            std: simulatedData.cv_std
        },
        feature_importance: {
            features: simulatedData.features,
            importances: simulatedData.feature_importances
        }
    } : data;

    const getExpl = (componentKey) => logicExplanations[componentKey] || logicExplanations.AlgorithmExplain;

    return (
        <div className="research-dashboard">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h1 style={{ margin: 0 }}>Research Dashboard</h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <label style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#333' }}>Developer Mode</label>
                    <input
                        type="checkbox"
                        checked={devMode}
                        onChange={(e) => setDevMode(e.target.checked)}
                        style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                    />
                </div>
            </div>

            {devMode && (
                <SimulationPanel
                    onSimulate={handleSimulation}
                    onReset={handleResetSimulation}
                    isSimulating={!!simulatedData}
                />
            )}

            <div className="research-grid">
                <div className="chart-card">
                    <DevWrapper devMode={devMode} {...getExpl("ModelComparisonChart")}>
                        <ModelComparisonChart data={activeData.model_comparison} />
                    </DevWrapper>
                </div>
                <div className="chart-card">
                    <DevWrapper devMode={devMode} {...getExpl("CrossValidationChart")}>
                        <CrossValidationChart data={activeData.cross_validation} />
                    </DevWrapper>
                </div>

                <div className="chart-card wide">
                    <DevWrapper devMode={devMode} {...getExpl("ClassDistributionChart")}>
                        <ClassDistributionChart data={activeData.class_distribution} />
                    </DevWrapper>
                </div>

                {activeData.scaler_params ? (
                    <div className="chart-card wide" style={{ minHeight: '350px' }}>
                        <DevWrapper devMode={devMode} {...getExpl("ScalerVisualization")}>
                            <ScalerVisualization data={activeData.scaler_params} />
                        </DevWrapper>
                    </div>
                ) : null}
                <div className="chart-card wide">
                    <DevWrapper devMode={devMode} {...getExpl("BoxplotChart")}>
                        <BoxplotChart data={activeData.boxplot_features} />
                    </DevWrapper>
                </div>

                <div className="chart-card">
                    <DevWrapper devMode={devMode} {...getExpl("AdaBoostChart")}>
                        <AdaBoostChart data={activeData.feature_importance_adaboost} />
                    </DevWrapper>
                </div>
                <div className="chart-card">
                    <DevWrapper devMode={devMode} {...getExpl("GBChart")}>
                        <GBChart data={activeData.feature_importance_gb} />
                    </DevWrapper>
                </div>
                <div className="chart-card wide">
                    <DevWrapper devMode={devMode} {...getExpl("FeatureImportanceChart")}>
                        <FeatureImportanceChart data={activeData.feature_importance} />
                    </DevWrapper>
                </div>

                <div className="chart-card wide">
                    <DevWrapper devMode={devMode} {...getExpl("ShapSummary")}>
                        <ShapSummary data={activeData.shap_summary} />
                    </DevWrapper>
                </div>
                <div className="chart-card wide">
                    <DevWrapper devMode={devMode} {...getExpl("ShapLocalChart")}>
                        <ShapLocalChart data={activeData.shap_local} />
                    </DevWrapper>
                </div>

                <div className="chart-card wide">
                    <DevWrapper devMode={devMode} {...getExpl("CorrelationHeatmap")}>
                        <CorrelationHeatmap data={activeData.correlation_matrix} />
                    </DevWrapper>
                </div>
                <div className="chart-card wide">
                    <DevWrapper devMode={devMode} {...getExpl("ClusterMapChart")}>
                        <ClusterMapChart data={activeData.cluster_map} />
                    </DevWrapper>
                </div>

                <div className="chart-card wide">
                    <DevWrapper devMode={devMode} {...getExpl("ClusterVisualization")}>
                        <ClusterVisualization data={activeData.cluster_visualization} />
                    </DevWrapper>
                </div>
                <div className="chart-card">
                    <DevWrapper devMode={devMode} {...getExpl("ElbowMethodChart")}>
                        <ElbowMethodChart />
                    </DevWrapper>
                </div>
                <div className="chart-card">
                    <DevWrapper devMode={devMode} {...getExpl("KMeansCountsChart")}>
                        <KMeansCountsChart data={activeData.kmeans_counts} />
                    </DevWrapper>
                </div>
                <div className="chart-card">
                    <DevWrapper devMode={devMode} {...getExpl("MembershipScoreChart")}>
                        <MembershipScoreChart data={activeData.membership_scores} clusterMap={activeData.cluster_map} />
                    </DevWrapper>
                </div>
                <div className="chart-card wide">
                    <DevWrapper devMode={devMode} {...getExpl("ConfusionMatrix")}>
                        <ConfusionMatrix data={activeData.confusion_matrix} />
                    </DevWrapper>
                </div>
            </div>

            <StaticArtifacts />
        </div>
    );
}
