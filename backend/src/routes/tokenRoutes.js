const express = require('express');
const router = express.Router();
const {
  authenticateToken,
  authorizeRoles
} = require('../middleware/authMiddleware');
const {
  validateToken,
  validateId
} = require('../middleware/validationMiddleware');
const {
  createToken,
  getTokenById,
  getMyTokens,
  callNextToken,
  markTokenServed,
  cancelToken,
  skipToken,
  getQueueTokens
} = require('../controllers/tokenController');

// Create token (User joins queue)
router.post('/', authenticateToken, validateToken, createToken);

// Get my tokens
router.get('/my', authenticateToken, getMyTokens);

// Get token by ID
router.get('/:tokenId', authenticateToken, validateId, getTokenById);

// Cancel token
router.patch('/:tokenId/cancel', authenticateToken, validateId, cancelToken);

// Skip token (Staff only) - marks as missed
router.patch('/:tokenId/skip', authenticateToken, authorizeRoles(['STAFF', 'ORGANISATION_ADMIN', 'SUPER_ADMIN']), validateId, skipToken);

// Call next token in queue (Staff only)
router.post('/queue/:queueId/call-next', authenticateToken, authorizeRoles(['STAFF', 'ORGANISATION_ADMIN', 'SUPER_ADMIN']), callNextToken);

// Mark token as served (Staff only)
router.patch('/:tokenId/serve', authenticateToken, authorizeRoles(['STAFF', 'ORGANISATION_ADMIN', 'SUPER_ADMIN']), validateId, markTokenServed);

// Get all tokens in a queue (Staff/Admin only)
router.get('/queue/:queueId/tokens', authenticateToken, authorizeRoles(['STAFF', 'ORGANISATION_ADMIN', 'SUPER_ADMIN']), getQueueTokens);

module.exports = router;