import { useState, useEffect } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';

export default function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    department: '',
    phone: '',
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await api.get('/employees');
      setEmployees(response.data.data);
    } catch (err) {
      console.error('Failed to fetch employees:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/employees/${editingId}`, formData);
      } else {
        await api.post('/employees', formData);
      }
      setShowForm(false);
      setEditingId(null);
      setFormData({
        fullName: '',
        email: '',
        password: '',
        department: '',
        phone: '',
      });
      fetchEmployees();
    } catch (err) {
      console.error('Error saving employee:', err);
    }
  };

  const handleEdit = (employee) => {
    setFormData({
      fullName: employee.fullName,
      email: employee.email,
      password: '',
      department: employee.department || '',
      phone: employee.phone || '',
    });
    setEditingId(employee._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await api.delete(`/employees/${id}`);
        fetchEmployees();
      } catch (err) {
        console.error('Error deleting employee:', err);
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <h1>Employees</h1>

        <div style={{ marginBottom: '20px' }}>
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : 'Add Employee'}
          </button>
        </div>

        {showForm && (
          <div className="card">
            <h2>{editingId ? 'Edit Employee' : 'Add New Employee'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  disabled={editingId}
                />
              </div>
              {!editingId && (
                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                </div>
              )}
              <div className="form-group">
                <label>Department</label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <button type="submit" className="btn btn-success">
                {editingId ? 'Update' : 'Create'} Employee
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
                  <th>Email</th>
                  <th>Department</th>
                  <th>Phone</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((employee) => (
                  <tr key={employee._id}>
                    <td>{employee.fullName}</td>
                    <td>{employee.email}</td>
                    <td>{employee.department || 'N/A'}</td>
                    <td>{employee.phone || 'N/A'}</td>
                    <td>
                      <span style={{
                        padding: '5px 10px',
                        borderRadius: '4px',
                        backgroundColor: employee.isActive ? '#4caf50' : '#f44336',
                        color: 'white',
                        fontSize: '12px'
                      }}>
                        {employee.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-primary"
                        onClick={() => handleEdit(employee)}
                        style={{ marginRight: '5px' }}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDelete(employee._id)}
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
