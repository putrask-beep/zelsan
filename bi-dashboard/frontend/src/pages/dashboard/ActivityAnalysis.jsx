import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { getActivityData } from '../../api/dashboard.api';

export default function ActivityAnalysis() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getActivityData().then(({ data }) => { setData(data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-body"><p>Loading...</p></div>;
  if (!data) return <div className="page-body"><div className="empty-state"><h3>No Data</h3></div></div>;

  return (
    <div>
      <div className="page-header">
        <div><h1>Activity Analysis</h1><div className="subtitle">Daily activity patterns breakdown</div></div>
      </div>
      <div className="page-body">
        <div className="charts-grid">
          <div className="card">
            <div className="card-header">Average Hours by Activity</div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={data} layout="vertical">
                  <XAxis type="number" fontSize={12} />
                  <YAxis type="category" dataKey="label" width={120} fontSize={11} />
                  <Tooltip />
                  <Bar dataKey="avg" fill="#2563eb" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="card">
            <div className="card-header">Activity Radar</div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={350}>
                <RadarChart data={data.map((d) => ({ subject: d.label.replace('Hours', 'Hrs'), value: d.avg, fullMark: d.max }))}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" fontSize={10} />
                  <PolarRadiusAxis fontSize={10} />
                  <Radar name="Avg" dataKey="value" stroke="#2563eb" fill="#2563eb" fillOpacity={0.3} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-header">Activity Statistics</div>
          <div className="card-body">
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr><th>Activity</th><th>Average</th><th>Min</th><th>Max</th><th>Range</th></tr>
                </thead>
                <tbody>
                  {data.map((d, i) => (
                    <tr key={i}>
                      <td>{d.label}</td>
                      <td>{d.avg.toFixed(2)}</td>
                      <td>{d.min.toFixed(2)}</td>
                      <td>{d.max.toFixed(2)}</td>
                      <td>{(d.max - d.min).toFixed(2)}</td>
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
