// WhatsApp Notification Service
// Using WhatsApp Web integration through device

const sendWhatsApp = async (phoneNumber, message) => {
  try {
    // WhatsApp Web integration - opens WhatsApp with pre-filled message
    // This will trigger on the user's device WhatsApp application
    const formattedPhone = phoneNumber.replace(/[^0-9]/g, '');
    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/${formattedPhone}?text=${encodedMessage}`;
    
    console.log(`[WhatsApp] Message ready for ${phoneNumber}: ${message}`);
    
    return { 
      success: true, 
      message: 'WhatsApp message prepared successfully',
      whatsappURL: whatsappURL 
    };
  } catch (error) {
    console.error('WhatsApp message preparation failed:', error.message);
    return { success: false, message: 'WhatsApp message preparation failed' };
  }
};

// AMC Due Reminder via WhatsApp
exports.sendAMCReminder = async (phoneNumber, customerName, amcName, endDate) => {
  const message = `Hello ${customerName}, your AMC for ${amcName} expires on ${endDate}. Please renew it to continue services.`;
  return sendWhatsApp(phoneNumber, message);
};

// Service Completion Confirmation via WhatsApp
exports.sendServiceCompletion = async (phoneNumber, customerName, serviceType) => {
  const message = `Hello ${customerName}, your ${serviceType} service has been completed. Thank you for choosing us!`;
  return sendWhatsApp(phoneNumber, message);
};

// Send WhatsApp to single customer
exports.sendWhatsAppToCustomer = async (req, res) => {
  try {
    const { phoneNumber, message } = req.body;

    if (!phoneNumber || !message) {
      return res.status(400).json({ message: 'Phone number and message are required' });
    }

    const result = await sendWhatsApp(phoneNumber, message);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Failed to prepare WhatsApp message', error: error.message });
  }
};

// Send WhatsApp to all customers
exports.sendWhatsAppToAll = async (req, res) => {
  try {
    const { message } = req.body;
    const Customer = require('../models/Customer');

    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    const customers = await Customer.find({});

    if (customers.length === 0) {
      return res.status(404).json({ message: 'No customers found' });
    }

    const results = customers.map((customer) => ({
      customerId: customer._id,
      customerName: customer.name,
      phoneNumber: customer.mobileNumber,
      whatsappURL: `https://wa.me/${customer.mobileNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`,
      message: message,
    }));

    res.json({
      success: true,
      totalCustomers: results.length,
      message: 'WhatsApp links generated for all customers',
      data: results,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to generate WhatsApp messages', error: error.message });
  }
};
