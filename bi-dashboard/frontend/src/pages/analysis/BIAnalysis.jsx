import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { getOverview, getKPIs, getCorrelations } from '../../api/analysis.api';

const COLORS = ['#2563eb', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

export default function BIAnalysis() {
  const [overview, setOverview] = useState(null);
  const [kpis, setKpis] = useState([]);
  const [correlations, setCorrelations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('overview');

  useEffect(() => {
    Promise.all([getOverview(), getKPIs(), getCorrelations()])
      .then(([o, k, c]) => { setOverview(o.data); setKpis(k.data); setCorrelations(c.data); })
      .catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-body"><p>Loading...</p></div>;

  return (
    <div>
      <div className="page-header">
        <div><h1>BI Analysis</h1><div className="subtitle">Business Intelligence analysis suite</div></div>
      </div>
      <div className="page-body">
        <div className="tabs">
          <button className={`tab ${tab === 'overview' ? 'active' : ''}`} onClick={() => setTab('overview')}>Overview</button>
          <button className={`tab ${tab === 'kpis' ? 'active' : ''}`} onClick={() => setTab('kpis')}>KPIs</button>
          <button className={`tab ${tab === 'correlations' ? 'active' : ''}`} onClick={() => setTab('correlations')}>Correlations</button>
        </div>

        {tab === 'overview' && overview && (
          <>
            <div className="stats-grid">
              <div className="stat-card"><div className="stat-label">Students</div><div className="stat-value">{overview.totalStudents}</div></div>
              <div className="stat-card"><div className="stat-label">Avg Productivity</div><div className="stat-value">{overview.avgProductivity?.toFixed(1)}</div></div>
              <div className="stat-card"><div className="stat-label">Avg Grade</div><div className="stat-value">{overview.avgFinalGrade?.toFixed(1)}</div></div>
              <div className="stat-card"><div className="stat-label">Avg Focus</div><div className="stat-value">{overview.avgFocusScore?.toFixed(1)}</div></div>
            </div>
            <div className="charts-grid">
              <div className="card">
                <div className="card-header">Gender Distribution</div>
                <div className="card-body">
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie data={overview.genderDistribution || []} dataKey="count" nameKey="label" cx="50%" cy="50%" outerRadius={80}>
                        {(overview.genderDistribution || []).map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="card">
                <div className="card-header">Stress Distribution</div>
                <div className="card-body">
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={overview.stressDistribution || []}>
                      <XAxis dataKey="label" fontSize={12} />
                      <YAxis fontSize={12} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </>
        )}

        {tab === 'kpis' && (
          <div className="stats-grid">
            {kpis.map((k, i) => (
              <div key={i} className={`stat-card ${k.status === 'good' ? 'good' : 'warning'}`}>
                <div className="stat-label">{k.name}</div>
                <div className="stat-value">{typeof k.value === 'number' ? k.value.toFixed(1) : k.value}</div>
                <div className="stat-sub">Target: {k.goal} {k.unit}</div>
                <div className="progress-bar"><div className={`fill ${k.status === 'good' ? 'good' : 'warning'}`} style={{ width: `${Math.min(100, (k.value / k.goal) * 100)}%` }} /></div>
              </div>
            ))}
          </div>
        )}

        {tab === 'correlations' && (
          <div className="card">
            <div className="card-header">Feature Correlations (|r| &gt; 0.3)</div>
            <div className="card-body">
              <div className="table-wrapper">
                <table>
                  <thead><tr><th>Field 1</th><th>Field 2</th><th>Correlation</th><th>Strength</th></tr></thead>
                  <tbody>
                    {correlations.map((c, i) => (
                      <tr key={i}>
                        <td>{c.field1}</td>
                        <td>{c.field2}</td>
                        <td style={{ fontWeight: 600, color: c.correlation > 0 ? '#22c55e' : '#ef4444' }}>{c.correlation.toFixed(3)}</td>
                        <td><span className={`badge ${Math.abs(c.correlation) > 0.6 ? 'badge-success' : 'badge-warning'}`}>
                          {Math.abs(c.correlation) > 0.6 ? 'Strong' : 'Moderate'}
                        </span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
