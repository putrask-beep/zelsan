import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { getCorrelationData } from '../../api/dashboard.api';

export default function CorrelationView() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCorrelationData().then(({ data }) => { setData(data || []); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-body"><p>Loading...</p></div>;

  const chartData = data.map((d) => ({
    name: `${d.field1.replace(/([A-Z])/g, ' $1').substring(0, 12)} ↔ ${d.field2.replace(/([A-Z])/g, ' $1').substring(0, 12)}`,
    correlation: parseFloat(d.correlation.toFixed(3))
  }));

  return (
    <div>
      <div className="page-header">
        <div><h1>Correlations</h1><div className="subtitle">Feature correlation analysis</div></div>
      </div>
      <div className="page-body">
        <div className="card">
          <div className="card-header">Correlation Strength</div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={chartData} layout="vertical">
                <XAxis type="number" domain={[-1, 1]} fontSize={12} />
                <YAxis type="category" dataKey="name" width={250} fontSize={10} />
                <Tooltip />
                <Bar dataKey="correlation" radius={[0, 4, 4, 0]}>
                  {chartData.map((d, i) => (
                    <Cell key={i} fill={d.correlation > 0 ? '#22c55e' : '#ef4444'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card" style={{ marginTop: '1rem' }}>
          <div className="card-header">Correlation Details</div>
          <div className="card-body">
            <div className="table-wrapper">
              <table>
                <thead><tr><th>Field 1</th><th>Field 2</th><th>Correlation</th><th>Strength</th></tr></thead>
                <tbody>
                  {data.map((d, i) => (
                    <tr key={i}>
                      <td>{d.field1}</td>
                      <td>{d.field2}</td>
                      <td style={{ color: d.correlation > 0 ? '#22c55e' : '#ef4444', fontWeight: 600 }}>
                        {d.correlation.toFixed(3)}
                      </td>
                      <td><span className={`badge ${Math.abs(d.correlation) > 0.6 ? 'badge-success' : Math.abs(d.correlation) > 0.3 ? 'badge-warning' : 'badge-info'}`}>
                        {Math.abs(d.correlation) > 0.6 ? 'Strong' : Math.abs(d.correlation) > 0.3 ? 'Moderate' : 'Weak'}
                      </span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
