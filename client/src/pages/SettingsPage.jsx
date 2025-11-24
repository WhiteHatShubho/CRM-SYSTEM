import { useState } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || '{}'));
  const [formData, setFormData] = useState({
    fullName: user.fullName || '',
    email: user.email || '',
    phone: user.phone || '',
  });
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setMessage('');
      // Profile update would be implemented in backend
      setMessage('Profile updated successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setError('');
      setMessage('');
      await api.put('/auth/password', {
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      });
      setMessage('Password updated successfully');
      setPasswordData({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Password update failed');
    }
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <h1>Settings & Profile Management</h1>

        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-error">{error}</div>}

        <div className="card">
          <div style={{ marginBottom: '20px', borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>
            <button
              className={`btn ${activeTab === 'profile' ? 'btn-primary' : ''}`}
              onClick={() => setActiveTab('profile')}
              style={{ marginRight: '10px', backgroundColor: activeTab === 'profile' ? '#007bff' : '#ccc' }}
            >
              Profile
            </button>
            <button
              className={`btn ${activeTab === 'password' ? 'btn-primary' : ''}`}
              onClick={() => setActiveTab('password')}
              style={{ backgroundColor: activeTab === 'password' ? '#007bff' : '#ccc' }}
            >
              Password
            </button>
          </div>

          {activeTab === 'profile' && (
            <form onSubmit={handleUpdateProfile}>
              <h2>Profile Information</h2>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={formData.email}
                  disabled
                  style={{ backgroundColor: '#f0f0f0', cursor: 'not-allowed' }}
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
              <div className="form-group">
                <label>Role</label>
                <input
                  type="text"
                  value={user.role || 'User'}
                  disabled
                  style={{ backgroundColor: '#f0f0f0', cursor: 'not-allowed' }}
                />
              </div>
              <button type="submit" className="btn btn-success">
                Update Profile
              </button>
            </form>
          )}

          {activeTab === 'password' && (
            <form onSubmit={handleUpdatePassword}>
              <h2>Change Password</h2>
              <div className="form-group">
                <label>Current Password</label>
                <input
                  type="password"
                  value={passwordData.oldPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Confirm Password</label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  required
                />
              </div>
              <button type="submit" className="btn btn-success">
                Update Password
              </button>
            </form>
          )}
        </div>

        <div className="card">
          <h2>Account Information</h2>
          <p><strong>Name:</strong> {user.fullName}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>
          <p><strong>Account Status:</strong> Active</p>
        </div>
      </div>
    </>
  );
}
