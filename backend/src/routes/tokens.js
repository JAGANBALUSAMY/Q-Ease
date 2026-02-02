const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRole } = require('../middleware/auth');

// All routes require authentication
router.use(authenticateToken);

// Get token by ID
router.get('/:id', (req, res) => {
  res.json({
    success: true,
    data: {
      token: {}
    }
  });
});

// Join queue (user)
router.post('/join', (req, res) => {
  res.json({
    success: true,
    data: {
      token: {}
    }
  });
});

// Staff routes
router.use(authorizeRole(['STAFF', 'ADMIN', 'SUPER_ADMIN']));

// Call next token
router.put('/:id/call', (req, res) => {
  res.json({
    success: true,
    message: 'Token called successfully'
  });
});

// Serve token
router.put('/:id/serve', (req, res) => {
  res.json({
    success: true,
    message: 'Token served successfully'
  });
});

// Skip token
router.put('/:id/skip', (req, res) => {
  res.json({
    success: true,
    message: 'Token skipped successfully'
  });
});

module.exports = router;