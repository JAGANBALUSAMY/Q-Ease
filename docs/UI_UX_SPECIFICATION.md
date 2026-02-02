# Q-Ease UI/UX Specification Document

## 📋 Project Overview

**Q-Ease** is a digital queue management system with a complete backend API. This document provides everything needed to build the frontend UI components.

---

## 🎯 Project Context

### What's Already Done (Backend)
- ✅ Complete REST API (40+ endpoints)
- ✅ Real-time Socket.IO integration
- ✅ Authentication & authorization
- ✅ Database with PostgreSQL
- ✅ QR code generation
- ✅ Email notifications
- ✅ All business logic implemented

### What Needs to be Built (Frontend)
- 🎨 All UI components
- 📱 Responsive pages
- 🔄 Real-time updates integration
- 📷 QR scanner implementation
- 🎭 User experience flows

---

## 👥 User Roles & Permissions

### 1. End User (Customer)
**Can:**
- Browse organizations
- Search queues
- Join queues (get tokens)
- Track token status
- Cancel tokens
- Scan QR codes
- View notifications
- Manage profile

**Cannot:**
- Create/edit queues
- Call next token
- Access analytics

### 2. Staff Member
**Can:**
- Everything End User can do
- Call next token
- Mark tokens as served
- Pause/resume assigned queues
- View queue statistics

**Cannot:**
- Create/delete queues
- Manage staff
- Access full analytics

### 3. Organization Admin
**Can:**
- Everything Staff can do
- Create/edit/delete queues
- Manage staff members
- View organization analytics
- Generate QR codes
- Configure settings

**Cannot:**
- Manage other organizations
- Access platform-wide analytics

### 4. Super Admin
**Can:**
- Everything
- Manage all organizations
- Platform-wide analytics
- System configuration

---

## 🗺️ Complete User Journeys

### Journey 1: End User - Joining a Queue

**Scenario:** Sarah wants to join a hospital queue

1. **Landing Page**
   - Sees hero section with "Find Organizations"
   - Search bar prominent
   - Featured organizations displayed

2. **Search Organizations**
   - Types "City Hospital" in search
   - Sees filtered results with:
     - Organization name
     - Address
     - Active queues count
     - Current wait time (average)

3. **View Organization Details**
   - Clicks on "City Hospital"
   - Sees:
     - Organization info (name, address, hours)
     - List of available queues
     - Each queue shows:
       - Queue name (e.g., "Emergency")
       - Waiting count (e.g., "5 people waiting")
       - Average wait time (e.g., "~15 minutes")
       - Status (Active/Paused)

4. **Join Queue**
   - Clicks "Join Queue" on "Emergency"
   - Modal/confirmation appears
   - Confirms join
   - Receives token:
     - Token number: "E005"
     - Position: "5th in line"
     - Estimated wait: "75 minutes"
     - QR code for token

5. **Track Token**
   - Redirected to "My Tokens" page
   - Sees token card with:
     - Token number (large, prominent)
     - Current position (updates in real-time)
     - Queue name
     - Status indicator (Pending/Called/Served)
     - Estimated wait time
     - Cancel button

6. **Real-time Updates**
   - Position automatically updates: 5 → 4 → 3
   - Notification when position ≤ 3: "Your turn is approaching!"
   - Notification when called: "Your token E005 is called!"
   - Status changes to "CALLED"
   - Prominent message: "Please proceed to the counter"

7. **Completion**
   - Staff marks as served
   - Status changes to "SERVED"
   - Thank you message
   - Option to provide feedback (future)

### Journey 2: Staff - Managing Queue

**Scenario:** John (staff) manages the Emergency queue

1. **Staff Login**
   - Dedicated staff login page
   - Email + password
   - Redirects to staff dashboard

2. **Staff Dashboard**
   - Sees assigned queues
   - Each queue card shows:
     - Queue name
     - Waiting count
     - Current token being served
     - Next token in line
     - Quick actions (Call Next, Pause)

3. **Select Queue**
   - Clicks on "Emergency" queue
   - Full queue management view

4. **Queue Management View**
   - **Top Section:**
     - Current token (large display): "E004"
     - Status: "Being Served"
     - Timer showing service duration
   
   - **Action Buttons:**
     - "Mark as Served" (primary button)
     - "Call Next" (secondary button)
     - "Pause Queue" (tertiary)
   
   - **Waiting List:**
     - List of pending tokens
     - Each shows: Token ID, Position, Wait time
     - Priority tokens highlighted

5. **Call Next Token**
   - Clicks "Mark as Served" for current
   - Automatically calls next: "E005"
   - System:
     - Updates display to "E005"
     - Sends notification to user
     - Updates all connected clients
     - Shows next in line: "E006"

6. **Handle No-Show**
   - If customer doesn't appear after 5 minutes
   - Option to "Skip to Next"
   - Skipped token goes to end of queue

7. **Pause Queue**
   - Clicks "Pause Queue" (for break)
   - Confirmation modal
   - Queue status changes to "Paused"
   - All users notified
   - "Resume Queue" button appears

### Journey 3: Admin - Creating a Queue

**Scenario:** Admin creates a new queue

1. **Admin Dashboard**
   - Overview cards:
     - Total Queues
     - Active Queues
     - Today's Tokens
     - Average Wait Time
   - Quick actions menu

2. **Navigate to Queues**
   - Clicks "Queues" in sidebar
   - Sees list of all queues
   - Each queue card shows:
     - Name, status, waiting count
     - Edit, Pause, Delete buttons

3. **Create New Queue**
   - Clicks "Create Queue" button
   - Form appears with fields:
     - **Queue Name** (required)
       - Placeholder: "e.g., Emergency, General"
     - **Description** (optional)
       - Textarea for details
     - **Average Service Time** (required)
       - Number input in minutes
       - Helper text: "Average time per customer"
     - **Max Tokens** (optional)
       - Number input
       - Helper text: "Leave empty for unlimited"
     - **Priority Enabled** (checkbox)
       - Enable priority tokens

4. **Submit & Confirmation**
   - Clicks "Create Queue"
   - Validation checks
   - Success message
   - Redirects to queue details
   - Shows generated QR code

5. **Generate QR Code**
   - On queue details page
   - "Generate QR Code" button
   - Modal shows:
     - QR code image
     - Download button
     - Print button
     - Share link

### Journey 4: QR Code Scanning

**Scenario:** Customer scans QR code at hospital entrance

1. **Scan QR Code**
   - Customer sees QR code poster
   - Opens Q-Ease app
   - Clicks "Scan QR" button (camera icon)

2. **Camera Permission**
   - Browser requests camera access
   - User allows
   - Camera view opens

3. **Scanning Interface**
   - Live camera feed
   - Scanning frame overlay
   - Instructions: "Point camera at QR code"
   - Cancel button

4. **Successful Scan**
   - QR code detected
   - Parsing data
   - Auto-redirect based on QR type:
     - **Organization QR** → Organization details page
     - **Queue QR** → Queue join page
     - **Token QR** → Token tracking page

5. **Join from QR**
   - If queue QR scanned
   - Shows queue details
   - "Join Queue" button pre-filled
   - One-click join

---

## 🎨 Design System

### Color Palette

**Primary Colors:**
```css
--primary-500: #3B82F6      /* Main blue */
--primary-600: #2563EB      /* Hover blue */
--primary-700: #1D4ED8      /* Active blue */
```

**Secondary Colors:**
```css
--secondary-500: #10B981    /* Success green */
--secondary-600: #059669    /* Hover green */
```

**Status Colors:**
```css
--status-pending: #F59E0B   /* Orange */
--status-called: #EF4444    /* Red */
--status-served: #10B981    /* Green */
--status-cancelled: #6B7280 /* Gray */
```

**Neutral Colors:**
```css
--gray-50: #F9FAFB
--gray-100: #F3F4F6
--gray-200: #E5E7EB
--gray-300: #D1D5DB
--gray-500: #6B7280
--gray-700: #374151
--gray-900: #111827
```

### Typography

**Font Family:**
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

**Font Sizes:**
```css
--text-xs: 0.75rem      /* 12px */
--text-sm: 0.875rem     /* 14px */
--text-base: 1rem       /* 16px */
--text-lg: 1.125rem     /* 18px */
--text-xl: 1.25rem      /* 20px */
--text-2xl: 1.5rem      /* 24px */
--text-3xl: 1.875rem    /* 30px */
--text-4xl: 2.25rem     /* 36px */
```

### Spacing

```css
--space-1: 0.25rem   /* 4px */
--space-2: 0.5rem    /* 8px */
--space-3: 0.75rem   /* 12px */
--space-4: 1rem      /* 16px */
--space-6: 1.5rem    /* 24px */
--space-8: 2rem      /* 32px */
--space-12: 3rem     /* 48px */
```

### Border Radius

```css
--radius-sm: 0.375rem   /* 6px */
--radius-md: 0.5rem     /* 8px */
--radius-lg: 0.75rem    /* 12px */
--radius-xl: 1rem       /* 16px */
```

### Shadows

```css
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
```

---

## 📱 Page Specifications

### 1. Landing Page (Public)

**Route:** `/`

**Layout:**
```
┌─────────────────────────────────────┐
│ Header (Logo, Login, Sign Up)      │
├─────────────────────────────────────┤
│                                     │
│  Hero Section                       │
│  - Title: "Skip the Wait"          │
│  - Subtitle                         │
│  - Search Bar (prominent)           │
│  - CTA: "Find Organizations"        │
│                                     │
├─────────────────────────────────────┤
│                                     │
│  Featured Organizations (Grid)      │
│  [Card] [Card] [Card] [Card]       │
│                                     │
├─────────────────────────────────────┤
│  How It Works (3 Steps)            │
│  1. Find  2. Join  3. Track        │
├─────────────────────────────────────┤
│  Footer                             │
└─────────────────────────────────────┘
```

**Components Needed:**
- `Navbar` - Sticky header with logo, navigation
- `Hero` - Main banner with search
- `SearchBar` - Organization search with autocomplete
- `OrganizationCard` - Display org info
- `HowItWorks` - Feature showcase
- `Footer` - Links and info

**API Calls:**
- `GET /api/organisations` - Fetch featured organizations
- `GET /api/organisations/search?q={query}` - Search

### 2. Organization Details Page

**Route:** `/org/:code` or `/org/:id`

**Layout:**
```
┌─────────────────────────────────────┐
│ Navbar                              │
├─────────────────────────────────────┤
│ Organization Header                 │
│ - Name, Address, Hours              │
│ - Contact Info                      │
├─────────────────────────────────────┤
│ Available Queues                    │
│ ┌─────────────┐ ┌─────────────┐   │
│ │ Queue Card  │ │ Queue Card  │   │
│ │ - Name      │ │ - Name      │   │
│ │ - Waiting:5 │ │ - Waiting:3 │   │
│ │ - ~15 min   │ │ - ~10 min   │   │
│ │ [Join]      │ │ [Join]      │   │
│ └─────────────┘ └─────────────┘   │
└─────────────────────────────────────┘
```

**Components:**
- `OrganizationHeader` - Org details
- `QueueCard` - Queue info with join button
- `QueueList` - Grid of queue cards

**API Calls:**
- `GET /api/organisations/:id` - Get org details
- `GET /api/queues/organisation/:id` - Get org queues

### 3. My Tokens Page (User Dashboard)

**Route:** `/my-tokens`

**Layout:**
```
┌─────────────────────────────────────┐
│ Navbar                              │
├─────────────────────────────────────┤
│ Page Title: "My Tokens"            │
│ Tabs: [Active] [History]           │
├─────────────────────────────────────┤
│ Active Tokens                       │
│ ┌─────────────────────────────────┐│
│ │ Token Card (Large)              ││
│ │ ┌─────────────┐                 ││
│ │ │ Token: E005 │ (Huge)          ││
│ │ └─────────────┘                 ││
│ │ Position: 3rd in line           ││
│ │ Status: PENDING 🟡              ││
│ │ Queue: Emergency                ││
│ │ Est. Wait: 45 min               ││
│ │ [Cancel Token]                  ││
│ └─────────────────────────────────┘│
└─────────────────────────────────────┘
```

**Real-time Updates:**
- Position changes automatically
- Status changes (Pending → Called → Served)
- Notifications appear

**Components:**
- `TokenCard` - Large token display
- `TokenList` - List of user's tokens
- `StatusBadge` - Visual status indicator
- `ProgressBar` - Queue progress

**API Calls:**
- `GET /api/tokens/my` - Get user's tokens
- Socket.IO: `join-token` - Subscribe to updates

**Socket.IO Events:**
```javascript
socket.on('token-update', (data) => {
  // Update token status, position
});

socket.on('token-called', (data) => {
  // Show notification
  // Update UI
});
```

### 4. Queue Join Page

**Route:** `/queue/:id/join`

**Layout:**
```
┌─────────────────────────────────────┐
│ Queue Details                       │
│ Name: Emergency                     │
│ Organization: City Hospital         │
│ Current Wait: ~45 minutes           │
│ People Waiting: 5                   │
├─────────────────────────────────────┤
│ Confirmation                        │
│ "You are about to join this queue" │
│                                     │
│ [Cancel] [Confirm Join]            │
└─────────────────────────────────────┘
```

**Components:**
- `QueueDetails` - Queue information
- `JoinConfirmation` - Confirmation modal/page

**API Calls:**
- `GET /api/queues/:id` - Get queue details
- `POST /api/tokens` - Create token (join queue)

**Request Body:**
```json
{
  "queueId": "queue_id",
  "priority": "NORMAL"
}
```

### 5. Staff Dashboard

**Route:** `/staff/dashboard`

**Layout:**
```
┌─────────────────────────────────────┐
│ Sidebar          │ Main Content     │
│ - Dashboard      │ ┌──────────────┐ │
│ - My Queues      │ │ Queue Stats  │ │
│ - Profile        │ │ - Waiting: 5 │ │
│                  │ │ - Served: 23 │ │
│                  │ └──────────────┘ │
│                  │                  │
│                  │ My Queues        │
│                  │ ┌──────────────┐ │
│                  │ │ Emergency    │ │
│                  │ │ Waiting: 5   │ │
│                  │ │ [Manage]     │ │
│                  │ └──────────────┘ │
└─────────────────────────────────────┘
```

**Components:**
- `Sidebar` - Navigation
- `StatsCard` - Statistics display
- `QueueManagementCard` - Queue actions

### 6. Queue Management (Staff)

**Route:** `/staff/queue/:id`

**Layout:**
```
┌─────────────────────────────────────┐
│ Current Token (Huge Display)       │
│ ┌─────────────────────────────────┐│
│ │         E004                    ││
│ │    Being Served                 ││
│ │    ⏱️ 5:23                      ││
│ └─────────────────────────────────┘│
├─────────────────────────────────────┤
│ Actions                             │
│ [Mark as Served] [Call Next]       │
│ [Pause Queue]                       │
├─────────────────────────────────────┤
│ Next in Line: E005                 │
├─────────────────────────────────────┤
│ Waiting List (5)                   │
│ • E005 - Position 1                │
│ • E006 - Position 2                │
│ • E007 - Position 3 (Priority)     │
└─────────────────────────────────────┘
```

**Components:**
- `CurrentTokenDisplay` - Large token display
- `ActionButtons` - Staff actions
- `WaitingList` - Pending tokens list
- `Timer` - Service duration timer

**API Calls:**
- `GET /api/queues/:id` - Get queue details
- `GET /api/tokens/queue/:id/tokens` - Get queue tokens
- `POST /api/tokens/queue/:id/call-next` - Call next token
- `PATCH /api/tokens/:id/serve` - Mark as served
- `PATCH /api/queues/:id/pause` - Pause queue

### 7. Admin Dashboard

**Route:** `/admin/dashboard`

**Layout:**
```
┌─────────────────────────────────────┐
│ Sidebar          │ Main Content     │
│ - Dashboard      │ ┌──┐ ┌──┐ ┌──┐  │
│ - Queues         │ │12│ │8 │ │45│  │
│ - Staff          │ └──┘ └──┘ └──┘  │
│ - Analytics      │ Queues Active Avg│
│ - Settings       │                  │
│                  │ Recent Activity  │
│                  │ Charts & Graphs  │
└─────────────────────────────────────┘
```

**Components:**
- `AdminSidebar` - Admin navigation
- `StatCard` - KPI cards
- `ActivityFeed` - Recent actions
- `Chart` - Analytics visualization

### 8. QR Scanner Page

**Route:** `/scan`

**Layout:**
```
┌─────────────────────────────────────┐
│ [< Back]                            │
├─────────────────────────────────────┤
│                                     │
│     ┌─────────────────┐            │
│     │                 │            │
│     │  Camera Feed    │            │
│     │  with Overlay   │            │
│     │                 │            │
│     └─────────────────┘            │
│                                     │
│  "Point camera at QR code"         │
│                                     │
│  [Cancel Scan]                     │
└─────────────────────────────────────┘
```

**Components:**
- `QRScanner` - Camera-based scanner
- `ScanOverlay` - Scanning frame
- `ScanInstructions` - User guidance

**Implementation:**
```javascript
import { Html5QrcodeScanner } from 'html5-qrcode';

const scanner = new Html5QrcodeScanner(
  "reader",
  { fps: 10, qrbox: 250 }
);

scanner.render(onScanSuccess, onScanError);

function onScanSuccess(decodedText) {
  const data = JSON.parse(decodedText);
  // Navigate based on data.type
  if (data.type === 'queue') {
    navigate(`/queue/${data.queueId}/join`);
  }
}
```

---

## 🔌 API Integration Guide

### Authentication Flow

**1. Login:**
```javascript
// POST /api/auth/login
const response = await axios.post('/api/auth/login', {
  email: 'user@example.com',
  password: 'password123'
});

// Store token
localStorage.setItem('token', response.data.data.token);
localStorage.setItem('user', JSON.stringify(response.data.data.user));
```

**2. Add Token to Requests:**
```javascript
// In axios interceptor
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

**3. Handle 401 Errors:**
```javascript
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### Socket.IO Integration

**1. Connect:**
```javascript
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

socket.on('connect', () => {
  console.log('Connected to server');
});
```

**2. Join Rooms:**
```javascript
// Join queue room for updates
socket.emit('join-queue', queueId);

// Join token room for personal updates
socket.emit('join-token', tokenId);
```

**3. Listen for Updates:**
```javascript
// Queue updates
socket.on('queue-update', (data) => {
  console.log('Queue updated:', data);
  // Update UI
  setQueue(prev => ({ ...prev, ...data }));
});

// Token updates
socket.on('token-update', (data) => {
  console.log('Token updated:', data);
  // Update token status
  setToken(prev => ({ ...prev, ...data }));
});

// Token called
socket.on('token-called', (data) => {
  // Show notification
  showNotification('Your token has been called!');
  // Update status
  setTokenStatus('CALLED');
});
```

**4. Cleanup:**
```javascript
useEffect(() => {
  socket.emit('join-queue', queueId);
  
  return () => {
    socket.emit('leave-queue', queueId);
  };
}, [queueId]);
```

---

## 🎭 Component Specifications

### TokenCard Component

**Props:**
```typescript
interface TokenCardProps {
  token: {
    id: string;
    tokenId: string;
    position: number;
    status: 'PENDING' | 'CALLED' | 'SERVED' | 'CANCELLED';
    queueName: string;
    estimatedWaitTime: number;
  };
  onCancel: (tokenId: string) => void;
}
```

**Visual States:**
- **PENDING:** Orange border, position visible
- **CALLED:** Red border, pulsing animation, "GO NOW" message
- **SERVED:** Green border, checkmark icon
- **CANCELLED:** Gray, crossed out

**Example:**
```jsx
<TokenCard
  token={{
    id: '123',
    tokenId: 'E005',
    position: 3,
    status: 'PENDING',
    queueName: 'Emergency',
    estimatedWaitTime: 45
  }}
  onCancel={handleCancel}
/>
```

### QueueCard Component

**Props:**
```typescript
interface QueueCardProps {
  queue: {
    id: string;
    name: string;
    description: string;
    waitingCount: number;
    averageTime: number;
    isActive: boolean;
  };
  onJoin: (queueId: string) => void;
}
```

**Visual:**
- Card with hover effect
- Queue name (bold)
- Waiting count with icon
- Average time with clock icon
- Status badge (Active/Paused)
- Join button (primary)

### Notification Component

**Types:**
- Success (green)
- Warning (orange)
- Error (red)
- Info (blue)

**Position:** Top-right corner

**Auto-dismiss:** 5 seconds

**Example:**
```jsx
<Notification
  type="success"
  message="Token created successfully!"
  duration={5000}
/>
```

---

## 📊 State Management

### Recommended Structure

**Global State (Context/Redux):**
- User authentication
- Current user data
- Active tokens
- Notifications

**Local State:**
- Form inputs
- UI toggles
- Loading states

**Example Context:**
```javascript
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  
  const login = async (email, password) => {
    const response = await authAPI.login({ email, password });
    setUser(response.data.data.user);
    setToken(response.data.data.token);
    localStorage.setItem('token', response.data.data.token);
  };
  
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };
  
  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
```

---

## 🎨 UI/UX Best Practices

### 1. Loading States
- Show skeleton screens for content loading
- Use spinners for actions
- Disable buttons during API calls

### 2. Error Handling
- Display user-friendly error messages
- Provide retry options
- Log errors for debugging

### 3. Responsive Design
- Mobile-first approach
- Breakpoints: 640px, 768px, 1024px, 1280px
- Touch-friendly buttons (min 44x44px)

### 4. Accessibility
- Semantic HTML
- ARIA labels
- Keyboard navigation
- Color contrast (WCAG AA)

### 5. Animations
- Smooth transitions (200-300ms)
- Entrance animations for modals
- Hover effects for interactive elements
- Loading animations

---

## 📱 Responsive Breakpoints

```css
/* Mobile */
@media (max-width: 639px) {
  /* Stack cards vertically */
  /* Full-width buttons */
  /* Larger touch targets */
}

/* Tablet */
@media (min-width: 640px) and (max-width: 1023px) {
  /* 2-column grid */
  /* Sidebar collapses */
}

/* Desktop */
@media (min-width: 1024px) {
  /* 3-4 column grid */
  /* Full sidebar */
  /* Hover effects */
}
```

---

## 🚀 Implementation Priority

### Phase 1: Core User Flow (Week 1)
1. Landing page
2. Organization search & details
3. Queue join flow
4. My Tokens page
5. Basic authentication

### Phase 2: Real-time Features (Week 2)
1. Socket.IO integration
2. Live token updates
3. Position tracking
4. Notifications

### Phase 3: Staff Interface (Week 3)
1. Staff login
2. Queue management
3. Call next token
4. Pause/resume

### Phase 4: Admin Interface (Week 4)
1. Admin dashboard
2. Queue CRUD
3. Analytics display
4. QR code generation

### Phase 5: Polish (Week 5)
1. QR scanner
2. Animations
3. Error handling
4. Mobile optimization

---

## 📝 Testing Checklist

### Functional Testing
- [ ] User can register and login
- [ ] User can search organizations
- [ ] User can join a queue
- [ ] Token updates in real-time
- [ ] Staff can call next token
- [ ] Admin can create queues
- [ ] QR scanner works

### UI/UX Testing
- [ ] Responsive on mobile
- [ ] Accessible (keyboard navigation)
- [ ] Loading states work
- [ ] Error messages clear
- [ ] Animations smooth

### Integration Testing
- [ ] API calls successful
- [ ] Socket.IO connects
- [ ] Real-time updates work
- [ ] Authentication persists
- [ ] Logout clears data

---

## 🔗 API Endpoints Reference

**Full documentation:** `docs/api/API_DOCUMENTATION.md`

**Quick Reference:**
- Auth: `/api/auth/*`
- Organizations: `/api/organisations/*`
- Queues: `/api/queues/*`
- Tokens: `/api/tokens/*`
- QR Codes: `/api/qr/*`
- Users: `/api/users/*`
- Analytics: `/api/analytics/*`

**Base URL:** `http://localhost:5000/api`

---

## 📦 Recommended Libraries

**Core:**
- React 18+
- React Router DOM
- Axios
- Socket.IO Client

**UI:**
- Tailwind CSS (or styled-components)
- Headless UI (for accessible components)
- React Icons
- Framer Motion (animations)

**Utilities:**
- date-fns (date formatting)
- react-hot-toast (notifications)
- html5-qrcode (QR scanning)
- react-hook-form (forms)

---

**This document provides everything needed to build the Q-Ease frontend UI. Share this with your AI assistant to implement the components!**
