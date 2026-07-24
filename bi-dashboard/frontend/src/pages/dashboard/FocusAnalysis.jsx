import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ScatterChart, Scatter, Cell } from 'recharts';
import { getDistribution, getComparison } from '../../api/analysis.api';

const COLORS = ['#2563eb', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function FocusAnalysis() {
  const [focusDist, setFocusDist] = useState(null);
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getDistribution(null, 'focusScore', 8),
      getComparison(null, 'gender', 'focusScore')
    ]).then(([d1, d2]) => {
      setFocusDist(d1.data);
      setComparison(d2.data);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-body"><p>Loading...</p></div>;

  return (
    <div>
      <div className="page-header">
        <div><h1>Focus Analysis</h1><div className="subtitle">Understanding focus score distribution and factors</div></div>
      </div>
      <div className="page-body">
        <div className="charts-grid">
          <div className="card">
            <div className="card-header">Focus Score Distribution</div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={focusDist?.bins || []}>
                  <XAxis dataKey="range" fontSize={10} angle={-30} textAnchor="end" height={60} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="card">
            <div className="card-header">Focus by Gender</div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={comparison || []}>
                  <XAxis dataKey="group" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="avg" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        {comparison && (
          <div className="card">
            <div className="card-header">Focus Comparison by Gender</div>
            <div className="card-body">
              <div className="table-wrapper">
                <table>
                  <thead><tr><th>Gender</th><th>Count</th><th>Avg Focus</th><th>Min</th><th>Max</th></tr></thead>
                  <tbody>
                    {comparison.map((c, i) => (
                      <tr key={i}><td>{c.group}</td><td>{c.count}</td><td>{c.avg.toFixed(1)}</td><td>{c.min}</td><td>{c.max}</td></tr>
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
