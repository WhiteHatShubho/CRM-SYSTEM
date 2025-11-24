import { useState, useEffect } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';

export default function WhatsAppPage() {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [whatsappLinks, setWhatsappLinks] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [messageMode, setMessageMode] = useState('all'); // 'all' or 'selected'

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await api.get('/customers');
      setCustomers(response.data.data);
    } catch (err) {
      setError('Failed to fetch customers');
      console.error(err);
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedCustomers(customers.map((c) => c._id));
    } else {
      setSelectedCustomers([]);
    }
  };

  const handleSelectCustomer = (customerId) => {
    setSelectedCustomers((prev) =>
      prev.includes(customerId)
        ? prev.filter((id) => id !== customerId)
        : [...prev, customerId]
    );
  };

  const sendToAllCustomers = async () => {
    if (!message.trim()) {
      setError('Please enter a message');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await api.post('/notifications/send-all', { message });
      setWhatsappLinks(response.data.data);
      setShowResults(true);
      setSuccess(`WhatsApp links generated for ${response.data.totalCustomers} customers!`);
      setMessage('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate WhatsApp links');
    } finally {
      setLoading(false);
    }
  };

  const sendToSelectedCustomers = async () => {
    if (!message.trim()) {
      setError('Please enter a message');
      return;
    }

    if (selectedCustomers.length === 0) {
      setError('Please select at least one customer');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const selected = customers.filter((c) => selectedCustomers.includes(c._id));
      const links = selected.map((customer) => ({
        customerId: customer._id,
        customerName: customer.name,
        phoneNumber: customer.mobileNumber,
        whatsappURL: `https://wa.me/${customer.mobileNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`,
        message: message,
      }));

      setWhatsappLinks(links);
      setShowResults(true);
      setSuccess(`WhatsApp links generated for ${links.length} customers!`);
      setMessage('');
    } catch (err) {
      setError('Failed to generate WhatsApp links');
    } finally {
      setLoading(false);
    }
  };

  const openWhatsAppLink = (url) => {
    window.open(url, '_blank');
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <h1>WhatsApp Notifications</h1>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <div className="card">
          <h2>Send WhatsApp Messages</h2>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ marginRight: '20px' }}>
              <input
                type="radio"
                value="all"
                checked={messageMode === 'all'}
                onChange={(e) => setMessageMode(e.target.value)}
              />
              Send to All Customers (One Tap)
            </label>
            <label>
              <input
                type="radio"
                value="selected"
                checked={messageMode === 'selected'}
                onChange={(e) => setMessageMode(e.target.value)}
              />
              Send to Selected Customers
            </label>
          </div>

          {messageMode === 'selected' && (
            <div className="card" style={{ backgroundColor: '#f9f9f9', marginBottom: '20px' }}>
              <h3>Select Customers</h3>
              <div style={{ marginBottom: '10px' }}>
                <label>
                  <input
                    type="checkbox"
                    checked={selectedCustomers.length === customers.length && customers.length > 0}
                    onChange={handleSelectAll}
                  />
                  Select All ({customers.length})
                </label>
              </div>
              <div style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid #ddd', padding: '10px', borderRadius: '4px' }}>
                {customers.map((customer) => (
                  <div key={customer._id} style={{ marginBottom: '8px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <input
                        type="checkbox"
                        checked={selectedCustomers.includes(customer._id)}
                        onChange={() => handleSelectCustomer(customer._id)}
                      />
                      <span>{customer.name}</span>
                      <span style={{ color: '#666', fontSize: '12px' }}>({customer.mobileNumber})</span>
                    </label>
                  </div>
                ))}
              </div>
              <p style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
                Selected: {selectedCustomers.length} customer(s)
              </p>
            </div>
          )}

          <div className="form-group">
            <label>Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your WhatsApp message here..."
              style={{ minHeight: '150px', fontFamily: 'Arial, sans-serif' }}
            />
            <p style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
              Character count: {message.length}
            </p>
          </div>

          <button
            className="btn btn-success"
            onClick={messageMode === 'all' ? sendToAllCustomers : sendToSelectedCustomers}
            disabled={loading || !message.trim() || (messageMode === 'selected' && selectedCustomers.length === 0)}
            style={{ padding: '12px 30px', fontSize: '16px' }}
          >
            {loading ? 'Generating Links...' : messageMode === 'all' ? 'Send to All Customers' : 'Send to Selected'}
          </button>
        </div>

        {showResults && whatsappLinks.length > 0 && (
          <div className="card">
            <h2>WhatsApp Links Generated ({whatsappLinks.length})</h2>
            <p style={{ color: '#666', marginBottom: '20px' }}>
              Click on any customer below to open WhatsApp with the pre-filled message
            </p>
            <table className="table">
              <thead>
                <tr>
                  <th>Customer Name</th>
                  <th>Mobile Number</th>
                  <th>Message Preview</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {whatsappLinks.map((link) => (
                  <tr key={link.customerId}>
                    <td>{link.customerName}</td>
                    <td>{link.phoneNumber}</td>
                    <td>
                      <span
                        style={{
                          display: 'block',
                          maxWidth: '300px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          color: '#666',
                          fontSize: '13px',
                        }}
                        title={link.message}
                      >
                        {link.message}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-primary"
                        onClick={() => openWhatsAppLink(link.whatsappURL)}
                        style={{ fontSize: '12px', padding: '8px 15px' }}
                      >
                        Open WhatsApp
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
