import { useNavigate } from 'react-router-dom';
import '../styles/navbar.css';

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">CRM System</div>
      <ul className="navbar-menu">
        <li><a href="/dashboard">Dashboard</a></li>
        <li><a href="/customers">Customers</a></li>
        <li><a href="/amcs">AMC Management</a></li>
        <li><a href="/services">Services</a></li>
        <li><a href="/employees">Employees</a></li>
        <li><a href="/reports">Reports</a></li>
        <li><a href="/whatsapp">WhatsApp</a></li>
        <li><a href="/settings">Settings</a></li>
        <li>
          <span>{user.fullName || 'User'}</span>
        </li>
        <li>
          <button onClick={handleLogout} className="btn btn-danger" style={{ margin: 0, padding: '5px 10px' }}>
            Logout
          </button>
        </li>
      </ul>
    </nav>
  );
}
