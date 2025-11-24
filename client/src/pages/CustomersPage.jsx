import { useState, useEffect } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    mobileNumber: '',
    email: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    isRecurring: false,
  });

  useEffect(() => {
    fetchCustomers();
  }, [search]);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/customers', {
        params: search ? { search } : {},
      });
      setCustomers(response.data.data);
    } catch (err) {
      console.error('Failed to fetch customers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/customers/${editingId}`, formData);
      } else {
        await api.post('/customers', formData);
      }
      setShowForm(false);
      setEditingId(null);
      setFormData({
        name: '',
        mobileNumber: '',
        email: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        isRecurring: false,
      });
      fetchCustomers();
    } catch (err) {
      console.error('Error saving customer:', err);
    }
  };

  const handleEdit = (customer) => {
    setFormData(customer);
    setEditingId(customer._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await api.delete(`/customers/${id}`);
        fetchCustomers();
      } catch (err) {
        console.error('Error deleting customer:', err);
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <h1>Customers</h1>

        <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
          <input
            type="text"
            placeholder="Search by name or mobile..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
          />
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : 'Add Customer'}
          </button>
        </div>

        {showForm && (
          <div className="card">
            <h2>{editingId ? 'Edit Customer' : 'Add New Customer'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Mobile Number</label>
                <input
                  type="tel"
                  value={formData.mobileNumber}
                  onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Address</label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>City</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>State</label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Pincode</label>
                <input
                  type="text"
                  value={formData.pincode}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={formData.isRecurring}
                    onChange={(e) => setFormData({ ...formData, isRecurring: e.target.checked })}
                  />
                  Recurring Customer
                </label>
              </div>
              <button type="submit" className="btn btn-success">
                {editingId ? 'Update' : 'Create'} Customer
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
                  <th>Name</th>
                  <th>Mobile</th>
                  <th>Email</th>
                  <th>City</th>
                  <th>Type</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer._id}>
                    <td>{customer.name}</td>
                    <td>{customer.mobileNumber}</td>
                    <td>{customer.email || 'N/A'}</td>
                    <td>{customer.city || 'N/A'}</td>
                    <td>{customer.isRecurring ? 'Recurring' : 'Non-recurring'}</td>
                    <td>
                      <button
                        className="btn btn-primary"
                        onClick={() => handleEdit(customer)}
                        style={{ marginRight: '5px' }}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDelete(customer._id)}
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
