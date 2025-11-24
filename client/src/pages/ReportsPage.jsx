import { useState } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';

export default function ReportsPage() {
  const [reportType, setReportType] = useState('summary');
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const fetchReport = async () => {
    setLoading(true);
    try {
      const params = {};
      if (dateFrom) params.dateFrom = dateFrom;
      if (dateTo) params.dateTo = dateTo;

      let response;
      if (reportType === 'summary') {
        response = await api.get('/reports/summary', { params });
      } else if (reportType === 'services') {
        response = await api.get('/reports/services', { params });
      } else if (reportType === 'amc') {
        response = await api.get('/reports/amc', { params });
      }

      setReportData(response.data);
    } catch (err) {
      console.error('Failed to fetch report:', err);
    } finally {
      setLoading(false);
    }
  };

  const exportReport = async () => {
    try {
      const params = { type: reportType };
      if (dateFrom) params.dateFrom = dateFrom;
      if (dateTo) params.dateTo = dateTo;

      const response = await api.get('/reports/export', { params, responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${reportType}-report.csv`);
      document.body.appendChild(link);
      link.click();
      link.parentElement.removeChild(link);
    } catch (err) {
      console.error('Failed to export report:', err);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <h1>Reports & Analytics</h1>

        <div className="card">
          <h2>Generate Report</h2>
          <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
            >
              <option value="summary">Summary Report</option>
              <option value="services">Services Report</option>
              <option value="amc">AMC Report</option>
            </select>

            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
              placeholder="From Date"
            />

            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
              placeholder="To Date"
            />

            <button className="btn btn-primary" onClick={fetchReport} disabled={loading}>
              {loading ? 'Loading...' : 'Generate'}
            </button>

            <button
              className="btn btn-success"
              onClick={exportReport}
              disabled={!reportData || loading}
            >
              Export to CSV
            </button>
          </div>
        </div>

        {reportData && (
          <div className="card">
            {reportType === 'summary' && (
              <>
                <h2>Summary Report</h2>
                <div className="dashboard-grid">
                  <div className="metric-card">
                    <div className="metric-label">Total Customers</div>
                    <div className="metric-value">{reportData.data.totalCustomers}</div>
                  </div>
                  <div className="metric-card">
                    <div className="metric-label">Total Services</div>
                    <div className="metric-value">{reportData.data.totalServices}</div>
                  </div>
                  <div className="metric-card">
                    <div className="metric-label">Completed Services</div>
                    <div className="metric-value">{reportData.data.completedServices}</div>
                  </div>
                  <div className="metric-card">
                    <div className="metric-label">Pending Services</div>
                    <div className="metric-value">{reportData.data.pendingServices}</div>
                  </div>
                  <div className="metric-card">
                    <div className="metric-label">Total AMCs</div>
                    <div className="metric-value">{reportData.data.totalAMCs}</div>
                  </div>
                  <div className="metric-card">
                    <div className="metric-label">Active AMCs</div>
                    <div className="metric-value">{reportData.data.activeAMCs}</div>
                  </div>
                  <div className="metric-card">
                    <div className="metric-label">Due AMCs</div>
                    <div className="metric-value">{reportData.data.dueAMCs}</div>
                  </div>
                  <div className="metric-card">
                    <div className="metric-label">Completion Rate</div>
                    <div className="metric-value">{reportData.data.completedPercentage}%</div>
                  </div>
                </div>
              </>
            )}

            {reportType === 'services' && (
              <>
                <h2>Services Report ({reportData.data.length} records)</h2>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Customer</th>
                      <th>Mobile</th>
                      <th>Service Type</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.data.map((service, idx) => (
                      <tr key={idx}>
                        <td>{service.customerName}</td>
                        <td>{service.mobileNumber}</td>
                        <td>{service.serviceType}</td>
                        <td>{new Date(service.serviceDate).toLocaleDateString()}</td>
                        <td>{service.status}</td>
                        <td>{service.amount || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}

            {reportType === 'amc' && (
              <>
                <h2>AMC Report ({reportData.data.length} records)</h2>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Customer</th>
                      <th>Mobile</th>
                      <th>AMC Name</th>
                      <th>Start Date</th>
                      <th>End Date</th>
                      <th>Value</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.data.map((amc, idx) => (
                      <tr key={idx}>
                        <td>{amc.customerName}</td>
                        <td>{amc.mobileNumber}</td>
                        <td>{amc.amcName}</td>
                        <td>{new Date(amc.startDate).toLocaleDateString()}</td>
                        <td>{new Date(amc.endDate).toLocaleDateString()}</td>
                        <td>{amc.amcValue}</td>
                        <td>{amc.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
}
