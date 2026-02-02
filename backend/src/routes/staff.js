const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRole } = require('../middleware/auth');

// All routes require authentication and staff role
router.use(authenticateToken);
router.use(authorizeRole(['STAFF', 'ADMIN', 'SUPER_ADMIN']));

// Get staff assigned queues
router.get('/queues', (req, res) => {
  res.json({
    success: true,
    data: {
      queues: []
    }
  });
});

// Get staff profile
router.get('/profile', (req, res) => {
  res.json({
    success: true,
    data: {
      staff: req.user
    }
  });
});

// Update staff status
router.put('/status', (req, res) => {
  res.json({
    success: true,
    message: 'Staff status updated successfully'
  });
});

module.exports = router;