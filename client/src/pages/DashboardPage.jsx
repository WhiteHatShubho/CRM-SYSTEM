import { useState, useEffect } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';

export default function DashboardPage() {
  const [metrics, setMetrics] = useState(null);
  const [pendingServices, setPendingServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [metricsRes, servicesRes] = await Promise.all([
        api.get('/dashboard/metrics'),
        api.get('/dashboard/pending-services'),
      ]);
      setMetrics(metricsRes.data.metrics);
      setPendingServices(servicesRes.data.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch dashboard data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div><Navbar /> <p>Loading...</p></div>;

  return (
    <>
      <Navbar />
      <div className="container">
        <h1>Dashboard</h1>

        {error && <div className="alert alert-error">{error}</div>}

        <div className="dashboard-grid">
          <div className="metric-card">
            <div className="metric-label">Total Customers</div>
            <div className="metric-value">{metrics?.totalCustomers || 0}</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Recurring Customers</div>
            <div className="metric-value">{metrics?.recurringCustomers || 0}</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Pending Services</div>
            <div className="metric-value">{metrics?.pendingServices || 0}</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Completed Services</div>
            <div className="metric-value">{metrics?.completedServices || 0}</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">AMC Due</div>
            <div className="metric-value">{metrics?.amcDue || 0}</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Active AMCs</div>
            <div className="metric-value">{metrics?.activeAMCs || 0}</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Weekly Services</div>
            <div className="metric-value">{metrics?.weeklyServices || 0}</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Monthly Services</div>
            <div className="metric-value">{metrics?.monthlyServices || 0}</div>
          </div>
        </div>

        <div className="card">
          <h2>Pending Services</h2>
          {pendingServices.length > 0 ? (
            <table className="table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Mobile</th>
                  <th>Service Type</th>
                  <th>Date</th>
                  <th>Assigned To</th>
                </tr>
              </thead>
              <tbody>
                {pendingServices.map((service) => (
                  <tr key={service._id}>
                    <td>{service.customerId?.name || 'N/A'}</td>
                    <td>{service.customerId?.mobileNumber || 'N/A'}</td>
                    <td>{service.serviceType}</td>
                    <td>{new Date(service.serviceDate).toLocaleDateString()}</td>
                    <td>{service.employeeId?.fullName || 'Unassigned'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No pending services</p>
          )}
        </div>
      </div>
    </>
  );
}
