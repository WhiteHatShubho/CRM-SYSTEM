# CRM System - Setup Guide

## Project Structure

```
CRM/
├── server/              # Backend (Node.js/Express)
│   ├── config/         # Database configuration
│   ├── controllers/    # Business logic
│   ├── middleware/     # Auth & validation middleware
│   ├── models/         # MongoDB schemas
│   ├── routes/         # API endpoints
│   ├── services/       # SMS & external services
│   ├── utils/          # JWT utilities
│   ├── server.js       # Main server file
│   ├── package.json
│   └── .env           # Environment variables
│
└── client/              # Frontend (React + Vite)
    ├── public/         # Static files
    ├── src/
    │   ├── api/        # Axios configuration
    │   ├── components/ # Reusable components
    │   ├── pages/      # Page components
    │   ├── styles/     # CSS files
    │   └── main.jsx    # App entry point
    ├── vite.config.js
    ├── package.json
    └── index.html
```

## Installation & Running

### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas connection)
- npm/yarn

### Backend Setup

```bash
# 1. Navigate to server directory
cd server

# 2. Install dependencies
npm install

# 3. Configure environment variables
# Edit .env file with your settings:
# - MONGODB_URI: MongoDB connection string
# - JWT_SECRET: Your secret key
# - SMS_API_KEY: SMS provider API key

# 4. Start the server
npm start         # Production
npm run dev       # Development with nodemon
```

Server will run on `http://localhost:5000`

### Frontend Setup

```bash
# 1. Navigate to client directory
cd client

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

Frontend will run on `http://localhost:3000`

## API Endpoints

### Authentication (6.1)
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - Register new user (Admin only)
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/password` - Change password
- `POST /api/auth/logout` - Logout

### Dashboard/Scope (6.2)
- `GET /api/dashboard/metrics` - Get dashboard metrics
- `GET /api/dashboard/pending-services` - Get pending services

### Customers (6.3)
- `POST /api/customers` - Create customer
- `GET /api/customers` - Get all customers
- `GET /api/customers/:id` - Get customer by ID
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer
- `GET /api/customers/:id/history` - Get customer service/AMC history

### AMC Management (6.4)
- `POST /api/amcs` - Create AMC
- `GET /api/amcs` - Get all AMCs
- `GET /api/amcs/:id` - Get AMC by ID
- `PUT /api/amcs/:id` - Update AMC
- `DELETE /api/amcs/:id` - Delete AMC
- `PUT /api/amcs/:id/mark-due` - Mark AMC as due
- `PUT /api/amcs/:id/renew` - Renew AMC

### Services (6.5)
- `POST /api/services` - Create service
- `GET /api/services` - Get services
- `GET /api/services/:id` - Get service by ID
- `PUT /api/services/:id` - Update service
- `PUT /api/services/:id/complete` - Complete service
- `DELETE /api/services/:id` - Delete service
- `GET /api/services/employee/:employeeId` - Get employee services

### Employees (6.6)
- `POST /api/employees` - Create employee (Admin)
- `GET /api/employees` - Get all employees
- `GET /api/employees/:id` - Get employee by ID
- `PUT /api/employees/:id` - Update employee (Admin)
- `DELETE /api/employees/:id` - Delete employee (Admin)
- `GET /api/employees/performance` - Get performance metrics

### Reports (6.7)
- `GET /api/reports/amc` - AMC renewal report
- `GET /api/reports/services` - Service report
- `GET /api/reports/summary` - Summary report
- `GET /api/reports/export` - Export to CSV

### SMS/Notifications (6.8)
- `POST /api/notifications/send` - Send SMS (Admin)

## Features Implemented

### 6.1 Login & Authentication ✓
- Role-based login (Admin/Employee)
- JWT token authentication
- Password change functionality
- Secure token validation

### 6.2 Dashboard/Scope ✓
- Real-time metrics
- Pending service count
- AMC due count
- Active employees/customers overview
- Weekly/monthly filters

### 6.3 Customer Management ✓
- Add/edit/delete customers
- Search by name & mobile
- View service & AMC history
- Mark recurring customers
- Complete customer profiles

### 6.4 AMC Management ✓
- Create & manage AMCs
- Auto next service date calculation
- AMC renewal functionality
- Due notifications
- History tracking

### 6.5 Service Management ✓
- Create & assign services
- Service status tracking
- OTP verification support
- Employee assignment
- Service history

### 6.6 Employee Management ✓
- Add/edit/delete employees
- Performance metrics
- Service count tracking
- Department management

### 6.7 Reports & Analytics ✓
- AMC renewal reports
- Service summary reports
- Export to CSV
- Date range filtering
- Multiple report types

### 6.8 SMS Notifications ✓
- SMS service integration ready
- Template support
- AMC due reminders
- Service completion alerts

### 6.9 Settings & Profile ✓
- Update profile details
- Change password
- Notification preferences
- Secure logout

## Database Models

### User
- Email, Password (hashed)
- Full Name, Department, Phone
- Role (admin/employee), Status

### Customer
- Name, Mobile Number, Email
- Address, City, State, Pincode
- Recurring flag, Service count

### Service
- Customer ID, Employee ID
- Service Type, Date, Status
- Description, Amount
- OTP support

### AMC
- Customer ID, AMC Name
- Start/End/Renewal Dates
- Service Frequency
- Amount, Active/Due flags

## Security

- JWT token-based authentication
- Bcrypt password hashing
- Role-based access control
- CORS enabled
- Environment variables for sensitive data

## Next Steps

1. **Database Setup**: Configure MongoDB connection
2. **SMS Integration**: Add your SMS API provider (Twilio, AWS SNS, etc.)
3. **Deployment**: Deploy to cloud (AWS, Heroku, DigitalOcean)
4. **Testing**: Implement unit & integration tests
5. **Monitoring**: Add logging & monitoring

## Troubleshooting

**MongoDB Connection Error**
- Verify MONGODB_URI in .env
- Check MongoDB is running
- Verify network access for Atlas

**CORS Error**
- Check backend CORS configuration
- Verify frontend proxy settings

**JWT Token Issues**
- Clear localStorage and login again
- Verify JWT_SECRET matches

## Support

For issues or questions, refer to:
- Backend: `/server/server.js`
- Frontend: `/client/src/main.jsx`
- API Documentation: Check routes files
