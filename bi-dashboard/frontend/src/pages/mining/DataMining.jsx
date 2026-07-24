import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ScatterChart, Scatter, Cell } from 'recharts';
import { getInsights, getFeatureImportance } from '../../api/mining.api';

const COLORS = ['#2563eb', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function DataMining() {
  const [insights, setInsights] = useState(null);
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('insights');

  useEffect(() => {
    Promise.all([getInsights(), getFeatureImportance()])
      .then(([i, f]) => { setInsights(i.data); setFeatures(f.data || []); })
      .catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-body"><p>Loading...</p></div>;

  return (
    <div>
      <div className="page-header">
        <div><h1>Data Mining</h1><div className="subtitle">Pattern extraction and feature analysis</div></div>
      </div>
      <div className="page-body">
        <div className="tabs">
          <button className={`tab ${tab === 'insights' ? 'active' : ''}`} onClick={() => setTab('insights')}>Pattern Insights</button>
          <button className={`tab ${tab === 'features' ? 'active' : ''}`} onClick={() => setTab('features')}>Feature Importance</button>
        </div>

        {tab === 'insights' && insights && (
          <div className="stats-grid">
            {insights.insights?.map((ins, i) => (
              <div key={i} className="card">
                <div className="card-header">{ins.label}</div>
                <div className="card-body">
                  <div className="metric-row"><span className="label">Count</span><span className="value">{ins.count} ({ins.percentage}%)</span></div>
                  {ins.avgStudyHours !== undefined && <div className="metric-row"><span className="label">Avg Study Hours</span><span className="value">{ins.avgStudyHours?.toFixed(1)}</span></div>}
                  {ins.avgProductivity !== undefined && <div className="metric-row"><span className="label">Avg Productivity</span><span className="value">{ins.avgProductivity?.toFixed(1)}</span></div>}
                  {ins.avgFocusScore !== undefined && <div className="metric-row"><span className="label">Avg Focus</span><span className="value">{ins.avgFocusScore?.toFixed(1)}</span></div>}
                  {ins.avgPhoneUsage !== undefined && <div className="metric-row"><span className="label">Avg Phone Usage</span><span className="value">{ins.avgPhoneUsage?.toFixed(1)}h</span></div>}
                  {ins.avgGrade !== undefined && <div className="metric-row"><span className="label">Avg Grade</span><span className="value">{ins.avgGrade?.toFixed(1)}</span></div>}
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'features' && (
          <>
            <div className="card" style={{ marginBottom: '1rem' }}>
              <div className="card-header">Feature Importance for Productivity</div>
              <div className="card-body">
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={features}>
                    <XAxis dataKey="feature" fontSize={10} angle={-30} textAnchor="end" height={80} />
                    <YAxis fontSize={12} />
                    <Tooltip />
                    <Bar dataKey="importance" radius={[4, 4, 0, 0]}>
                      {features.map((f, i) => <Cell key={i} fill={f.direction === 'positive' ? '#22c55e' : '#ef4444'} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="card">
              <div className="card-header">Feature Details</div>
              <div className="card-body">
                <div className="table-wrapper">
                  <table>
                    <thead><tr><th>Feature</th><th>Importance</th><th>Direction</th><th>Strength</th></tr></thead>
                    <tbody>
                      {features.map((f, i) => (
                        <tr key={i}>
                          <td>{f.feature}</td>
                          <td>{f.importance.toFixed(3)}</td>
                          <td><span className={`badge ${f.direction === 'positive' ? 'badge-success' : 'badge-danger'}`}>{f.direction}</span></td>
                          <td><span className={`badge ${f.importance > 0.5 ? 'badge-success' : f.importance > 0.3 ? 'badge-warning' : 'badge-info'}`}>
                            {f.importance > 0.5 ? 'Strong' : f.importance > 0.3 ? 'Moderate' : 'Weak'}
                          </span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
