import { useState, useEffect } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [formData, setFormData] = useState({
    customerId: '',
    employeeId: '',
    serviceType: '',
    serviceDate: '',
    description: '',
  });

  useEffect(() => {
    fetchServices();
    fetchCustomers();
    fetchEmployees();
  }, [statusFilter]);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const params = statusFilter ? { status: statusFilter } : {};
      const response = await api.get('/services', { params });
      setServices(response.data.data);
    } catch (err) {
      console.error('Failed to fetch services:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await api.get('/customers');
      setCustomers(response.data.data);
    } catch (err) {
      console.error('Failed to fetch customers:', err);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await api.get('/employees');
      setEmployees(response.data.data);
    } catch (err) {
      console.error('Failed to fetch employees:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/services/${editingId}`, formData);
      } else {
        await api.post('/services', formData);
      }
      setShowForm(false);
      setEditingId(null);
      setFormData({
        customerId: '',
        employeeId: '',
        serviceType: '',
        serviceDate: '',
        description: '',
      });
      fetchServices();
    } catch (err) {
      console.error('Error saving service:', err);
    }
  };

  const handleEdit = (service) => {
    setFormData({
      customerId: service.customerId._id,
      employeeId: service.employeeId?._id || '',
      serviceType: service.serviceType,
      serviceDate: service.serviceDate.split('T')[0],
      description: service.description || '',
    });
    setEditingId(service._id);
    setShowForm(true);
  };

  const handleComplete = async (id) => {
    try {
      await api.put(`/services/${id}/complete`);
      fetchServices();
    } catch (err) {
      console.error('Error completing service:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await api.delete(`/services/${id}`);
        fetchServices();
      } catch (err) {
        console.error('Error deleting service:', err);
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <h1>Services</h1>

        <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
          >
            <option value="">All Services</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : 'Add Service'}
          </button>
        </div>

        {showForm && (
          <div className="card">
            <h2>{editingId ? 'Edit Service' : 'Add New Service'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Customer</label>
                <select
                  value={formData.customerId}
                  onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                  required
                >
                  <option value="">Select Customer</option>
                  {customers.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name} - {c.mobileNumber}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Assign Employee</label>
                <select
                  value={formData.employeeId}
                  onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                >
                  <option value="">Unassigned</option>
                  {employees.map((e) => (
                    <option key={e._id} value={e._id}>
                      {e.fullName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Service Type</label>
                <input
                  type="text"
                  value={formData.serviceType}
                  onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                  placeholder="e.g., Maintenance, Installation, Support"
                  required
                />
              </div>
              <div className="form-group">
                <label>Service Date</label>
                <input
                  type="date"
                  value={formData.serviceDate}
                  onChange={(e) => setFormData({ ...formData, serviceDate: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <button type="submit" className="btn btn-success">
                {editingId ? 'Update' : 'Create'} Service
              </button>
            </form>
          </div>
        )}

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="card">
            <table className="table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Service Type</th>
                  <th>Date</th>
                  <th>Assigned To</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {services.map((service) => (
                  <tr key={service._id}>
                    <td>{service.customerId?.name}</td>
                    <td>{service.serviceType}</td>
                    <td>{new Date(service.serviceDate).toLocaleDateString()}</td>
                    <td>{service.employeeId?.fullName || 'Unassigned'}</td>
                    <td>
                      <span style={{
                        padding: '5px 10px',
                        borderRadius: '4px',
                        backgroundColor: service.status === 'completed' ? '#4caf50' :
                                         service.status === 'pending' ? '#ff9800' : '#2196f3',
                        color: 'white',
                        fontSize: '12px'
                      }}>
                        {service.status}
                      </span>
                    </td>
                    <td>
                      {service.status !== 'completed' && (
                        <>
                          <button
                            className="btn btn-success"
                            onClick={() => handleComplete(service._id)}
                            style={{ marginRight: '5px', fontSize: '12px', padding: '5px 10px' }}
                          >
                            Complete
                          </button>
                          <button
                            className="btn btn-primary"
                            onClick={() => handleEdit(service)}
                            style={{ marginRight: '5px', fontSize: '12px', padding: '5px 10px' }}
                          >
                            Edit
                          </button>
                        </>
                      )}
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDelete(service._id)}
                        style={{ fontSize: '12px', padding: '5px 10px' }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
