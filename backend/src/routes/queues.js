const express = require('express');
const router = express.Router();
const { optionalAuth, authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');
const { validateQueue, validateQueueUpdate } = require('../middleware/validationMiddleware');
const {
  getAllQueues,
  getQueueById,
  getQueuesByOrganisation,
  createQueue,
  updateQueue,
  pauseQueue,
  resumeQueue,
  deleteQueue
} = require('../controllers/queueController');

// Public routes (browsing queues)
router.get('/', optionalAuth, getAllQueues);
router.get('/:id', optionalAuth, getQueueById);
router.get('/organisation/:organisationId', optionalAuth, getQueuesByOrganisation);

// Admin/Staff routes
router.post('/', authenticateToken, authorizeRoles(['ORGANISATION_ADMIN', 'SUPER_ADMIN']), validateQueue, createQueue);
router.put('/:id', authenticateToken, authorizeRoles(['ORGANISATION_ADMIN', 'SUPER_ADMIN']), validateQueueUpdate, updateQueue);
router.patch('/:id/pause', authenticateToken, authorizeRoles(['STAFF', 'ORGANISATION_ADMIN', 'SUPER_ADMIN']), pauseQueue);
router.patch('/:id/resume', authenticateToken, authorizeRoles(['STAFF', 'ORGANISATION_ADMIN', 'SUPER_ADMIN']), resumeQueue);
router.delete('/:id', authenticateToken, authorizeRoles(['ORGANISATION_ADMIN', 'SUPER_ADMIN']), deleteQueue);

module.exports = router;