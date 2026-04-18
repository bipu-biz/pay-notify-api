# PayNotify API 🚀

A production-ready fintech backend API for managing organizational payments with real-time notifications, Redis caching, and background job processing.

## Features

- JWT Authentication with Refresh Tokens
- Multi-tenant Architecture (Organizations)
- Role Based Authorization (superadmin, admin, member)
- Real-time Notifications via WebSockets (Socket.io)
- Redis Caching Layer for High Performance
- Background Email Processing with BullMQ
- Rate Limiting for API Security
- Global Error Handling

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB + Mongoose
- **Cache**: Redis (ioredis)
- **Queue**: BullMQ
- **Real-time**: Socket.io
- **Auth**: JWT + bcryptjs
- **Email**: Nodemailer

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB
- Redis

### Installation

```bash
git clone https://github.com/bipu-biz/pay-notify-api
cd pay-notify-api
npm install
```

### Environment Variables

Create a `.env` file in root:

```
PORT=8000
MONGODB_URI=mongodb://localhost:27017/paynotify
ACCESS_TOKEN_SECRET=your_access_secret
REFRESH_TOKEN_SECRET=your_refresh_secret
REDIS_URL=redis://localhost:6379
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
```

### Run

```bash
npm run dev
```

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login user |
| POST | /api/auth/logout | Logout user |
| POST | /api/auth/refresh-token | Refresh access token |

### Organization
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/org | Create organization |
| GET | /api/org | Get organization |
| POST | /api/org/invite | Invite member |
| DELETE | /api/org/member/:id | Remove member |

### Payments
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/payments | Create payment |
| GET | /api/payments | Get all payments |
| PATCH | /api/payments/:id/pay | Mark as paid |
| PATCH | /api/payments/:id/cancel | Cancel payment |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/admin/orgs | Get all organizations |
| GET | /api/admin/orgs/:id | Get org details |
| PATCH | /api/admin/orgs/:id/ban | Ban organization |
| PATCH | /api/admin/orgs/:id/unban | Unban organization |
| GET | /api/admin/users | Get all users |

## Architecture

```
Request → Routes → Middleware → Controller → Model → MongoDB
                                     ↓
                                   Redis Cache
                                     ↓
                                 Socket.io (real-time)
                                     ↓
                                 BullMQ (background jobs)
```

## License
MIT