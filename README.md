# Q-Ease - Digital Queue Management System 🎯

[![Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)](https://github.com)
[![Version](https://img.shields.io/badge/Version-1.0.0-blue)](https://github.com)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

**Q-Ease** is a modern, full-stack digital queue management system that enables organizations to manage customer queues efficiently with real-time updates, QR code integration, and multi-channel notifications.

---

## ✨ Features

### Core Functionality
- 🔐 **Multi-role Authentication** - User, Staff, Admin, Super Admin
- 🏢 **Organization Management** - Browse, search, and manage organizations
- 📋 **Queue Management** - Create, pause/resume, and monitor queues
- 🎫 **Token System** - Join queues, track position, real-time updates
- 📱 **QR Code Integration** - Generate and scan QR codes for quick access
- 🔔 **Multi-channel Notifications** - Email, push, and real-time updates
- 📊 **Analytics Dashboard** - Performance metrics and reports

### Real-time Features
- ⚡ **Socket.IO Integration** - Live queue and token updates
- 📍 **Position Tracking** - Real-time position changes
- 🔄 **Auto-refresh** - Automatic status synchronization
- 👥 **Multi-user Support** - Concurrent user handling

### Security & Performance
- 🛡️ **Rate Limiting** - Protection against abuse
- 🔒 **JWT Authentication** - Secure token-based auth
- ✅ **Input Validation** - Comprehensive validation
- 📝 **Request Logging** - Access and error logs
- 🚀 **Database Indexes** - Optimized queries
- 📄 **Pagination** - Efficient data loading

---

## 🏗️ Architecture

### Tech Stack

**Backend:**
- Node.js + Express
- PostgreSQL + Prisma ORM
- Socket.IO for real-time
- JWT for authentication
- Nodemailer for emails

**Frontend:**
- React + Vite
- Socket.IO Client
- Axios for API calls
- HTML5 QR Code Scanner

**Infrastructure:**
- Nginx (reverse proxy)
- PM2 (process management)
- PostgreSQL (database)
- Optional: Redis (caching)

---

## 📁 Project Structure

```
q-ease/
├── backend/
│   ├── src/
│   │   ├── controllers/      # Business logic
│   │   ├── routes/           # API endpoints
│   │   ├── services/         # External services
│   │   ├── middleware/       # Auth, validation, logging
│   │   ├── workers/          # Background jobs
│   │   ├── utils/            # Helper functions
│   │   └── server.js         # Entry point
│   ├── prisma/
│   │   ├── schema.prisma     # Database schema
│   │   └── migrations/       # DB migrations
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── pages/            # Page components
│   │   ├── services/         # API & Socket.IO
│   │   └── App.jsx           # Main app
│   └── package.json
│
└── docs/
    ├── api/                  # API documentation
    ├── deployment/           # Deployment guides
    └── user-guides/          # User manuals
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/q-ease.git
cd q-ease
```

2. **Backend Setup**
```bash
cd backend
npm install

# Configure environment
cp .env.example .env
# Edit .env with your database credentials

# Run migrations
npx prisma migrate deploy
npx prisma generate

# Seed database (optional)
npm run seed

# Start server
npm run dev
```

3. **Frontend Setup**
```bash
cd frontend
npm install

# Configure environment
echo "VITE_API_URL=http://localhost:5000/api" > .env
echo "VITE_SOCKET_URL=http://localhost:5000" >> .env

# Start development server
npm run dev
```

4. **Access the application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api
- API Health: http://localhost:5000/health

---

## 📚 Documentation

### API Documentation
- [Complete API Reference](docs/api/API_DOCUMENTATION.md) - All 40+ endpoints
- [Authentication](docs/api/endpoints/auth.md) - Login, register, JWT
- [Organizations](docs/api/endpoints/organisations.md) - CRUD operations
- [Queues](docs/api/endpoints/queues.md) - Queue management
- [Tokens](docs/api/endpoints/tokens.md) - Token operations

### Deployment
- [Production Deployment Guide](docs/deployment/production-deployment.md) - Complete setup
- [Environment Variables](docs/deployment/environment-variables.md) - Configuration
- [Database Setup](docs/deployment/database-setup.md) - PostgreSQL setup

### User Guides
- [End User Guide](docs/user-guides/END_USER_GUIDE.md) - For customers
- [Admin Guide](docs/user-guides/ADMIN_GUIDE.md) - For administrators
- [Staff Guide](docs/user-guides/STAFF_GUIDE.md) - For staff members

### Testing
- [Integration Testing](docs/testing/integration-testing.md) - Test scenarios

---

## 🔧 Configuration

### Backend Environment Variables
```env
# Server
NODE_ENV=development
PORT=5000

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/qease"

# JWT
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN=24h

# Frontend
FRONTEND_URL=http://localhost:5173

# Email (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### Frontend Environment Variables
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

---

## 🧪 Testing

### Run Integration Tests
```bash
cd backend
node integration-test.js
```

**Expected Output:**
```
✅ 1. Backend Health Check - PASS
✅ 2. User Login - PASS
✅ 3. Get Organizations - PASS
✅ 4. Get Queues (Authenticated) - PASS
✅ 5. Get User Profile - PASS
✅ 6. Get My Tokens - PASS
✅ 7. CORS Configuration - PASS
✅ 8. QR Code Generation - PASS

📊 Integration Test Results: 8/8 tests passed
```

---

## 📊 API Endpoints

### Authentication (5 endpoints)
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/staff-login` - Staff login
- `POST /api/auth/admin-login` - Admin login
- `POST /api/auth/super-admin-login` - Super admin login

### Organizations (7 endpoints)
- `GET /api/organisations` - List all organizations
- `GET /api/organisations/search` - Search organizations
- `GET /api/organisations/code/:code` - Get by code
- `GET /api/organisations/:id` - Get by ID
- `POST /api/organisations` - Create organization
- `PUT /api/organisations/:id` - Update organization
- `DELETE /api/organisations/:id` - Delete organization

### Queues (9 endpoints)
- `GET /api/queues` - List all queues
- `GET /api/queues/:id` - Get queue details
- `GET /api/queues/organisation/:id` - Get org queues
- `POST /api/queues` - Create queue
- `PUT /api/queues/:id` - Update queue
- `PATCH /api/queues/:id/pause` - Pause queue
- `PATCH /api/queues/:id/resume` - Resume queue
- `DELETE /api/queues/:id` - Delete queue

### Tokens (7 endpoints)
- `POST /api/tokens` - Create token (join queue)
- `GET /api/tokens/my` - Get my tokens
- `GET /api/tokens/:id` - Get token details
- `PATCH /api/tokens/:id/cancel` - Cancel token
- `POST /api/tokens/queue/:id/call-next` - Call next token
- `PATCH /api/tokens/:id/serve` - Mark as served
- `GET /api/tokens/queue/:id/tokens` - Get queue tokens

### QR Codes (3 endpoints)
- `GET /api/qr/organisation/:id` - Generate org QR
- `GET /api/qr/queue/:id` - Generate queue QR
- `GET /api/qr/token/:id` - Generate token QR

### Users (5 endpoints)
- `GET /api/users/profile` - Get profile
- `PUT /api/users/profile` - Update profile
- `POST /api/users/change-password` - Change password
- `GET /api/users/notifications` - Get notifications
- `PATCH /api/users/notifications/:id/read` - Mark as read

### Analytics (9 endpoints)
- `GET /api/analytics/organisations/:id` - Org analytics
- `GET /api/analytics/queues/:id` - Queue analytics
- `GET /api/analytics/platform` - Platform stats
- And more...

---

## 🔄 Background Workers

### Analytics Worker
```bash
node src/workers/analyticsWorker.js
```
- Generates daily reports
- Aggregates statistics
- Cleans up old data

### Notification Worker
```bash
node src/workers/notificationWorker.js
```
- Processes pending notifications
- Sends reminders
- Batch notification sending

### Token Timeout Worker
```bash
node src/workers/tokenTimeoutWorker.js
```
- Handles no-shows
- Auto-cancels expired tokens
- Sends timeout warnings

---

## 🎯 Use Cases

### For Hospitals
- Manage patient queues
- Reduce waiting room crowding
- Track patient flow
- Generate reports

### For Government Offices
- Citizen service queues
- Appointment management
- Service time tracking
- Performance analytics

### For Retail
- Customer service queues
- Peak hour management
- Staff allocation
- Customer satisfaction tracking

---

## � Security Features

- ✅ JWT-based authentication
- ✅ Role-based access control (RBAC)
- ✅ Rate limiting (5 types)
- ✅ Input validation & sanitization
- ✅ Helmet security headers
- ✅ CORS protection
- ✅ Request logging
- ✅ Password hashing (bcrypt)

---

## 📈 Performance Optimizations

- ✅ Database indexes (20+)
- ✅ Pagination for list endpoints
- ✅ Efficient Prisma queries
- ✅ Socket.IO room-based updates
- ✅ Redis caching support (optional)
- ✅ Optimized bundle size

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Authors

- **Your Name** - Initial work

---

## 🙏 Acknowledgments

- Socket.IO for real-time capabilities
- Prisma for excellent ORM
- React team for the amazing framework
- All contributors and testers

---

## 📞 Support

- **Email:** support@qease.com
- **Documentation:** [docs/](docs/)
- **Issues:** [GitHub Issues](https://github.com/yourusername/q-ease/issues)

---

## 🗺️ Roadmap

### Version 1.0 ✅ (Current)
- [x] Core queue management
- [x] Real-time updates
- [x] QR code system
- [x] Email notifications
- [x] Analytics dashboard

### Version 1.1 (Planned)
- [ ] Mobile apps (iOS/Android)
- [ ] SMS notifications
- [ ] Advanced analytics
- [ ] Multi-language support
- [ ] Dark mode

### Version 2.0 (Future)
- [ ] AI-powered queue optimization
- [ ] Video calling integration
- [ ] Advanced reporting
- [ ] API webhooks
- [ ] Third-party integrations

---

## 📊 Project Status

- **Version:** 1.0.0
- **Status:** Production Ready ✅
- **Last Updated:** 2026-02-01
- **Completion:** 100%

### Statistics
- **Backend Files:** 46
- **Frontend Files:** 15+
- **API Endpoints:** 40+
- **Documentation Pages:** 10
- **Integration Tests:** 8/8 passing
- **Lines of Code:** 18,000+

---

**Made with ❤️ by the Q-Ease Team**

**⭐ Star this repo if you find it helpful!**