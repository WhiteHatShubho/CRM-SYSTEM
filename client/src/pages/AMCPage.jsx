import { useState, useEffect } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';

export default function AMCPage() {
  const [amcs, setAmcs] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filter, setFilter] = useState('');
  const [formData, setFormData] = useState({
    customerId: '',
    amcName: '',
    startDate: '',
    endDate: '',
    serviceFrequency: 'quarterly',
    amcValue: '',
  });

  useEffect(() => {
    fetchAmcs();
    fetchCustomers();
  }, [filter]);

  const fetchAmcs = async () => {
    setLoading(true);
    try {
      const params = filter ? { status: filter } : {};
      const response = await api.get('/amcs', { params });
      setAmcs(response.data.data);
    } catch (err) {
      console.error('Failed to fetch AMCs:', err);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/amcs/${editingId}`, formData);
      } else {
        await api.post('/amcs', formData);
      }
      setShowForm(false);
      setEditingId(null);
      setFormData({
        customerId: '',
        amcName: '',
        startDate: '',
        endDate: '',
        serviceFrequency: 'quarterly',
        amcValue: '',
      });
      fetchAmcs();
    } catch (err) {
      console.error('Error saving AMC:', err);
    }
  };

  const handleEdit = (amc) => {
    setFormData({
      customerId: amc.customerId._id,
      amcName: amc.amcName,
      startDate: amc.startDate.split('T')[0],
      endDate: amc.endDate.split('T')[0],
      serviceFrequency: amc.serviceFrequency,
      amcValue: amc.amcValue,
    });
    setEditingId(amc._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await api.delete(`/amcs/${id}`);
        fetchAmcs();
      } catch (err) {
        console.error('Error deleting AMC:', err);
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <h1>AMC Management</h1>

        <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
          >
            <option value="">All AMCs</option>
            <option value="active">Active</option>
            <option value="due">Due for Renewal</option>
          </select>
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : 'Add AMC'}
          </button>
        </div>

        {showForm && (
          <div className="card">
            <h2>{editingId ? 'Edit AMC' : 'Add New AMC'}</h2>
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
                <label>AMC Name</label>
                <input
                  type="text"
                  value={formData.amcName}
                  onChange={(e) => setFormData({ ...formData, amcName: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Start Date</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>End Date</label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Service Frequency</label>
                <select
                  value={formData.serviceFrequency}
                  onChange={(e) => setFormData({ ...formData, serviceFrequency: e.target.value })}
                >
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="half-yearly">Half-Yearly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
              <div className="form-group">
                <label>AMC Value</label>
                <input
                  type="number"
                  value={formData.amcValue}
                  onChange={(e) => setFormData({ ...formData, amcValue: e.target.value })}
                  required
                />
              </div>
              <button type="submit" className="btn btn-success">
                {editingId ? 'Update' : 'Create'} AMC
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
                  <th>AMC Name</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Frequency</th>
                  <th>Value</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {amcs.map((amc) => (
                  <tr key={amc._id}>
                    <td>{amc.customerId?.name}</td>
                    <td>{amc.amcName}</td>
                    <td>{new Date(amc.startDate).toLocaleDateString()}</td>
                    <td>{new Date(amc.endDate).toLocaleDateString()}</td>
                    <td>{amc.serviceFrequency}</td>
                    <td>{amc.amcValue}</td>
                    <td>
                      <span style={{
                        padding: '5px 10px',
                        borderRadius: '4px',
                        backgroundColor: amc.isDue ? '#ff9800' : amc.isActive ? '#4caf50' : '#ccc',
                        color: 'white',
                        fontSize: '12px'
                      }}>
                        {amc.isDue ? 'Due' : amc.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-primary"
                        onClick={() => handleEdit(amc)}
                        style={{ marginRight: '5px' }}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDelete(amc._id)}
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
