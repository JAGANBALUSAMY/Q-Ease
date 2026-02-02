# Integration Testing Guide

## Testing Backend-Frontend Integration

### 1. Prerequisites
- Backend running on `http://localhost:5000`
- Frontend running on `http://localhost:5173`
- Database seeded with test data

### 2. Test Scenarios

#### Authentication Flow
1. **User Registration**
   - Navigate to registration page
   - Fill in user details
   - Submit form
   - Verify success message
   - Check database for new user

2. **User Login**
   - Navigate to login page
   - Enter credentials: `patient1@gmail.com` / `Password123!`
   - Submit form
   - Verify redirect to dashboard
   - Check localStorage for token

3. **Staff Login**
   - Use credentials: `staff@cityhospital.com` / `Password123!`
   - Verify staff dashboard access

4. **Admin Login**
   - Use credentials: `admin@cityhospital.com` / `Password123!`
   - Verify admin dashboard access

#### Organization Browsing
1. **View Organizations**
   - Navigate to organization search page
   - Verify organizations list loads
   - Check for 4 organizations (Hospital, Clinic, Grocery, Office)

2. **Search Organizations**
   - Enter search term "hospital"
   - Verify filtered results
   - Click on organization
   - Verify organization details page

3. **Organization by Code**
   - Enter code "HOSP01"
   - Verify correct organization loads

#### Queue Management
1. **View Queues**
   - Navigate to organization detail page
   - Verify queues list displays
   - Check queue statistics (waiting count, avg time)

2. **Real-time Queue Updates**
   - Open queue in two browser windows
   - Join queue in one window
   - Verify waiting count updates in both windows

3. **Queue Status**
   - Admin: Pause a queue
   - Verify status changes to "Paused"
   - Verify users see pause notification
   - Resume queue
   - Verify status changes to "Active"

#### Token Creation & Tracking
1. **Join Queue**
   - Select a queue
   - Click "Join Queue"
   - Verify token created
   - Check token number and position

2. **Track Token**
   - Navigate to "My Tokens"
   - Verify token appears in list
   - Click on token
   - Verify token details page

3. **Real-time Token Updates**
   - Staff: Call next token
   - User: Verify token status changes to "Called"
   - Verify notification appears
   - Staff: Mark as served
   - User: Verify status changes to "Served"

#### QR Code Integration
1. **Generate QR Code**
   - Admin: View queue details
   - Click "Generate QR Code"
   - Verify QR code displays

2. **Scan QR Code**
   - Navigate to `/scan`
   - Click "Start Scanning"
   - Allow camera access
   - Scan QR code
   - Verify redirect to correct page

#### Socket.IO Real-time Features
1. **Queue Updates**
   - Open queue page
   - Check browser console for "Socket connected"
   - Verify "Live Updates" indicator
   - Create token from another window
   - Verify waiting count updates automatically

2. **Token Position Updates**
   - Join queue
   - Note your position
   - Staff calls next token
   - Verify your position decreases automatically

3. **Multi-user Testing**
   - Open 3 browser windows (User, Staff, Admin)
   - User: Join queue
   - Staff: Call next token
   - Verify all windows update in real-time

### 3. API Integration Tests

Run automated tests:
```bash
cd backend
node quick-test.js
```

Expected output:
```
✓ Health Check
✓ Organizations (4 found)
✓ User Login (token received)
✓ Queues (6 found)
✓ Create Token
✓ My Tokens
```

### 4. Common Issues & Solutions

#### CORS Errors
**Issue:** "Access-Control-Allow-Origin" error
**Solution:** Verify backend CORS configuration in `server.js`
```javascript
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
```

#### Socket.IO Connection Failed
**Issue:** Socket.IO not connecting
**Solution:** 
1. Check Socket.IO URL in `socketService.js`
2. Verify backend Socket.IO is running
3. Check browser console for connection errors

#### 401 Unauthorized
**Issue:** API requests return 401
**Solution:**
1. Check if token is in localStorage
2. Verify token format in request headers
3. Check JWT_SECRET matches in backend

#### API Not Found (404)
**Issue:** Endpoints return 404
**Solution:**
1. Verify API URL in `.env` file
2. Check endpoint paths match backend routes
3. Ensure backend server is running

### 5. Manual Testing Checklist

- [ ] User can register
- [ ] User can login
- [ ] Organizations list loads
- [ ] Organization search works
- [ ] Queue list displays
- [ ] User can join queue
- [ ] Token appears in "My Tokens"
- [ ] Real-time updates work
- [ ] QR code generates
- [ ] QR scanner works
- [ ] Staff can call next token
- [ ] Admin can pause/resume queue
- [ ] Notifications appear
- [ ] Profile updates work
- [ ] Password change works

### 6. Performance Testing

1. **Load Testing**
   - Create 10 tokens simultaneously
   - Verify all tokens created successfully
   - Check response times

2. **Real-time Performance**
   - Open 5 browser windows
   - Join same queue from all windows
   - Call next token
   - Verify all windows update within 1 second

### 7. Mobile Testing

1. Open frontend on mobile device
2. Test responsive design
3. Test QR scanner on mobile camera
4. Verify touch interactions work
5. Check notification display

### 8. Browser Compatibility

Test on:
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge

### 9. Security Testing

1. **Authentication**
   - Try accessing protected routes without login
   - Verify redirect to login page

2. **Authorization**
   - User tries to access admin routes
   - Verify 403 Forbidden response

3. **Token Expiration**
   - Wait for token to expire
   - Make API request
   - Verify auto-logout

### 10. Integration Test Results

Document results:
```
Date: ___________
Tester: ___________

✓ Authentication: PASS/FAIL
✓ Organizations: PASS/FAIL
✓ Queues: PASS/FAIL
✓ Tokens: PASS/FAIL
✓ Real-time: PASS/FAIL
✓ QR Codes: PASS/FAIL
✓ Notifications: PASS/FAIL

Issues Found:
1. ___________
2. ___________
3. ___________
```

---

## Quick Integration Test

Run this quick test to verify basic integration:

```bash
# Terminal 1: Start backend
cd backend
npm run dev

# Terminal 2: Start frontend
cd frontend
npm run dev

# Terminal 3: Run API tests
cd backend
node quick-test.js

# Browser: Open http://localhost:5173
# 1. Login with: patient1@gmail.com / Password123!
# 2. Browse organizations
# 3. Join a queue
# 4. Check "My Tokens"
# 5. Verify real-time updates
```

If all steps work, integration is successful! ✅
