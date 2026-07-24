import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { getClusterHistory, runClustering } from '../../api/clustering.api';
import { useAuth } from '../../context/AuthContext';

const COLORS = ['#ef4444', '#f59e0b', '#2563eb', '#22c55e'];

export default function ClusteringView() {
  const [clusters, setClusters] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [k, setK] = useState(4);
  const { user } = useAuth();

  const fetchClusters = async () => {
    try {
      const { data } = await getClusterHistory();
      setClusters(data || []);
      if (data.length && !selected) setSelected(data[0]);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  useEffect(() => { fetchClusters(); }, []);

  const handleRun = async () => {
    setRunning(true);
    try {
      const { data } = await runClustering({ k });
      setSelected(data);
      fetchClusters();
    } catch (err) { alert('Clustering failed: ' + (err.response?.data?.message || err.message)); }
    finally { setRunning(false); }
  };

  if (loading) return <div className="page-body"><p>Loading...</p></div>;

  return (
    <div>
      <div className="page-header">
        <div><h1>Clustering</h1><div className="subtitle">K-Means clustering analysis</div></div>
        {user?.role === 'admin' && (
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <label style={{ fontSize: '13px', color: '#64748b' }}>K:</label>
            <input type="number" value={k} onChange={(e) => setK(parseInt(e.target.value) || 4)} min={2} max={10}
              style={{ width: '50px', padding: '0.375rem', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '13px' }} />
            <button className="btn btn-primary btn-sm" onClick={handleRun} disabled={running}>
              {running ? 'Running...' : 'Run Clustering'}
            </button>
          </div>
        )}
      </div>
      <div className="page-body">
        {clusters.length > 0 && (
          <div className="tabs">
            {clusters.map((c, i) => (
              <button key={c._id} className={`tab ${selected?._id === c._id ? 'active' : ''}`}
                onClick={() => setSelected(c)}>
                Run {i + 1} (k={c.k})
              </button>
            ))}
          </div>
        )}

        {selected && (
          <>
            <div className="stats-grid" style={{ marginBottom: '1.5rem' }}>
              <div className="stat-card"><div className="stat-label">Clusters (k)</div><div className="stat-value">{selected.k}</div></div>
              <div className="stat-card"><div className="stat-label">Silhouette Score</div><div className="stat-value">{selected.silhouetteScore?.toFixed(3)}</div></div>
              <div className="stat-card"><div className="stat-label">Inertia</div><div className="stat-value" style={{ fontSize: '1.2rem' }}>{selected.inertia?.toFixed(0)}</div></div>
              <div className="stat-card"><div className="stat-label">Calinski-Harabasz</div><div className="stat-value" style={{ fontSize: '1rem' }}>{selected.calinskiHarabasz?.toFixed(1)}</div></div>
            </div>

            <div className="charts-grid">
              <div className="card">
                <div className="card-header">Cluster Sizes</div>
                <div className="card-body">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={(selected.clusters || []).map((c) => ({ name: c.label, count: c.count, pct: c.percentage }))}>
                      <XAxis dataKey="name" fontSize={11} />
                      <YAxis fontSize={12} />
                      <Tooltip />
                      <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                        {(selected.clusters || []).map((_, i) => <rect key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="card">
                <div className="card-header">Cluster Radar</div>
                <div className="card-body">
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={[
                      { subject: 'Study', ...Object.fromEntries((selected.clusters || []).map((c, i) => [`c${i}`, c.characteristics?.avgStudyHours || 0])) },
                      { subject: 'Sleep', ...Object.fromEntries((selected.clusters || []).map((c, i) => [`c${i}`, c.characteristics?.avgSleepHours || 0])) },
                      { subject: 'Phone', ...Object.fromEntries((selected.clusters || []).map((c, i) => [`c${i}`, c.characteristics?.avgPhoneUsage || 0])) },
                      { subject: 'Exercise', ...Object.fromEntries((selected.clusters || []).map((c, i) => [`c${i}`, (c.characteristics?.avgExerciseMinutes || 0) / 6])) },
                      { subject: 'Productivity', ...Object.fromEntries((selected.clusters || []).map((c, i) => [`c${i}`, c.characteristics?.avgProductivity || 0])) },
                      { subject: 'Focus', ...Object.fromEntries((selected.clusters || []).map((c, i) => [`c${i}`, (c.characteristics?.avgFocusScore || 0) / 1.5])) }
                    ]}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" fontSize={10} />
                      <PolarRadiusAxis fontSize={8} />
                      {(selected.clusters || []).map((_, i) => (
                        <Radar key={i} name={`C${i}`} dataKey={`c${i}`} stroke={COLORS[i]} fill={COLORS[i]} fillOpacity={0.15} />
                      ))}
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header">Cluster Details</div>
              <div className="card-body">
                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr><th>Cluster</th><th>Count</th><th>%</th><th>Study Hrs</th><th>Sleep</th><th>Phone</th><th>Productivity</th><th>Focus</th><th>Grade</th></tr>
                    </thead>
                    <tbody>
                      {(selected.clusters || []).map((c, i) => (
                        <tr key={i}>
                          <td><span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', background: COLORS[i], marginRight: 6 }} />{c.label}</td>
                          <td>{c.count}</td>
                          <td>{c.percentage}%</td>
                          <td>{c.characteristics?.avgStudyHours?.toFixed(1)}</td>
                          <td>{c.characteristics?.avgSleepHours?.toFixed(1)}</td>
                          <td>{c.characteristics?.avgPhoneUsage?.toFixed(1)}h</td>
                          <td>{c.characteristics?.avgProductivity?.toFixed(1)}</td>
                          <td>{c.characteristics?.avgFocusScore?.toFixed(1)}</td>
                          <td>{c.characteristics?.avgFinalGrade?.toFixed(1)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}

        {!loading && clusters.length === 0 && (
          <div className="empty-state">
            <h3>No Clustering Results</h3>
            <p>Run clustering to group students by characteristics.</p>
          </div>
        )}
      </div>
    </div>
  );
}
