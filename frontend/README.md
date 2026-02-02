# Q-Ease Frontend

Frontend application for the Q-Ease digital queue management system built with React + Vite.

## Features

### User Features
- **Organisation Search**: Search for organisations by name, location, or 6-digit code
- **Queue Joining**: Join service queues with priority selection
- **Live Tracking**: Real-time queue position tracking with WebSocket updates
- **Notifications**: Push notifications when token is called
- **QR Code Scanning**: Scan organisation QR codes for quick access

### Admin Features
- **Dashboard**: Overview of queue statistics and performance metrics
- **Queue Management**: Create, edit, and manage service queues
- **Real-time Monitoring**: Live view of queue status and customer flow
- **Analytics**: Performance insights and reporting
- **Staff Management**: User and permission management

### Staff Features
- **Queue Control**: Call next customer, pause/resume queues
- **Token Management**: Skip tokens, update priorities
- **Real-time Updates**: Live queue status and customer information
- **Walk-in Registration**: Create tokens for walk-in customers

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and development server
- **React Router** - Client-side routing
- **Socket.IO Client** - Real-time WebSocket communication
- **Axios** - HTTP client for API requests
- **CSS Modules** - Scoped styling

## Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation

```bash
cd frontend
npm install
```

### Development

```bash
npm run dev
```

Runs the app in development mode on http://localhost:5173

### Production Build

```bash
npm run build
```

Creates a production build in the `dist` folder

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout.jsx      # Main layout component
│   └── PrivateRoute.jsx # Authentication wrapper
├── contexts/           # React Context providers
│   ├── AuthContext.jsx # Authentication state
│   └── SocketContext.jsx # WebSocket connections
├── hooks/              # Custom React hooks
├── pages/              # Page components
│   ├── LoginPage.jsx
│   ├── OrganisationSearchPage.jsx
│   ├── QueueJoinPage.jsx
│   ├── LiveQueueTrackingPage.jsx
│   └── AdminDashboardPage.jsx
├── utils/              # Utility functions
│   └── api.js         # Axios API client
├── App.jsx            # Main app component
└── main.jsx           # Entry point
```

## Environment Variables

Create a `.env` file in the frontend root:

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

## Key Components

### Authentication Flow
- JWT token-based authentication
- Protected routes with role-based access
- Automatic token refresh and expiry handling

### Real-time Features
- WebSocket connections for live updates
- Automatic reconnection on disconnect
- Room-based subscriptions for queue updates

### Responsive Design
- Mobile-first approach
- Touch-friendly interfaces
- Adaptive layouts for different screen sizes

## API Integration

The frontend connects to the Q-Ease backend API:
- Base URL: `http://localhost:5000/api`
- Authentication: Bearer token in Authorization header
- Real-time: Socket.IO connection to `http://localhost:5000`

## Testing

```bash
npm test
```

## Deployment

The frontend can be deployed to any static hosting service:
- Vercel
- Netlify
- AWS S3 + CloudFront
- GitHub Pages

Build the production version and serve the `dist` folder.