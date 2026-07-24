import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Download, FileText, FileSpreadsheet } from 'lucide-react';
import { getReportData, downloadPDF, downloadExcel } from '../../api/reporting.api';

export default function Reporting() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getReportData().then(({ data }) => { setReport(data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const handleDownload = async (type) => {
    try {
      const fn = type === 'pdf' ? downloadPDF : downloadExcel;
      const { data } = await fn();
      const blob = new Blob([data]);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bi-report.${type === 'pdf' ? 'pdf' : 'xlsx'}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert('Download failed');
    }
  };

  if (loading) return <div className="page-body"><p>Loading...</p></div>;

  return (
    <div>
      <div className="page-header">
        <div><h1>Reporting</h1><div className="subtitle">Generate and download reports</div></div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn-outline btn-sm" onClick={() => handleDownload('pdf')}>
            <FileText size={14} /> Export PDF
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => handleDownload('excel')}>
            <FileSpreadsheet size={14} /> Export Excel
          </button>
        </div>
      </div>
      <div className="page-body">
        {report ? (
          <>
            <div className="stats-grid">
              <div className="stat-card"><div className="stat-label">Total Students</div><div className="stat-value">{report.summary?.total}</div></div>
              <div className="stat-card"><div className="stat-label">Avg Productivity</div><div className="stat-value">{report.summary?.avgProductivity?.toFixed(1)}</div></div>
              <div className="stat-card"><div className="stat-label">Avg Grade</div><div className="stat-value">{report.summary?.avgGrade?.toFixed(1)}</div></div>
              <div className="stat-card"><div className="stat-label">High Performers</div><div className="stat-value">{report.summary?.highPerformers}</div></div>
            </div>

            <div className="charts-grid">
              <div className="card">
                <div className="card-header">Correlations Summary</div>
                <div className="card-body">
                  <div className="metric-row"><span className="label">Study Hours → Productivity</span><span className="value">{report.summary?.studyProductivityCorr?.toFixed(3)}</span></div>
                  <div className="metric-row"><span className="label">Screen Time → Productivity</span><span className="value">{report.summary?.screenProductivityCorr?.toFixed(3)}</span></div>
                  <div className="metric-row"><span className="label">Exercise → Focus</span><span className="value">{report.summary?.exerciseCorr?.toFixed(3)}</span></div>
                </div>
              </div>
              <div className="card">
                <div className="card-header">Gender Distribution</div>
                <div className="card-body">
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={report.summary?.genderDist || []}>
                      <XAxis dataKey="label" fontSize={12} />
                      <YAxis fontSize={12} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#2563eb" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {report.clusters?.length > 0 && (
              <div className="card">
                <div className="card-header">Clustering Summary</div>
                <div className="card-body">
                  <div className="table-wrapper">
                    <table>
                      <thead><tr><th>Cluster</th><th>Count</th><th>%</th><th>Productivity</th><th>Focus</th></tr></thead>
                      <tbody>
                        {report.clusters.map((c, i) => (
                          <tr key={i}>
                            <td>{c.label}</td><td>{c.count}</td><td>{c.percentage}%</td>
                            <td>{c.characteristics?.avgProductivity?.toFixed(1)}</td>
                            <td>{c.characteristics?.avgFocusScore?.toFixed(1)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            <div className="card" style={{ marginTop: '1rem' }}>
              <div className="card-header">Report Info</div>
              <div className="card-body">
                <div className="metric-row"><span className="label">Generated At</span><span className="value">{new Date(report.generatedAt).toLocaleString()}</span></div>
                <div className="metric-row"><span className="label">Total Students</span><span className="value">{report.summary?.total}</span></div>
              </div>
            </div>
          </>
        ) : (
          <div className="empty-state">
            <h3>No Report Data</h3>
            <p>Upload a dataset first to generate reports.</p>
          </div>
        )}
      </div>
    </div>
  );
}
