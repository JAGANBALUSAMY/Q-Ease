const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const {
  getOverview,
  getRealtimeOverview,
  getRealtimeQueues,
  getRealtimeAlerts,
  getHistoricalPerformance,
  getStaffPerformance,
  getCustomerSatisfaction,
  getOperationalEfficiency,
  getAdminStats,
  getRecentActivity
} = require('../controllers/analyticsController');

// Admin Dashboard Stats
router.get('/admin-stats', authenticateToken, authorizeRole(['ORGANISATION_ADMIN', 'SUPER_ADMIN']), getAdminStats);
router.get('/recent-activity', authenticateToken, authorizeRole(['ORGANISATION_ADMIN', 'SUPER_ADMIN']), getRecentActivity);

// Get queue analytics (Organisation Admin)
router.get('/organisations/:organisationId/analytics/queues/:queueId',
  authenticateToken,
  authorizeRole(['ORGANISATION_ADMIN', 'SUPER_ADMIN']),
  getOverview
);

// Get organisation analytics (Organisation Admin)
router.get('/organisations/:organisationId/analytics',
  authenticateToken,
  authorizeRole(['ORGANISATION_ADMIN', 'SUPER_ADMIN']),
  getOverview
);

// Platform analytics (Super Admin)
router.get('/analytics/platform', authenticateToken, authorizeRole(['SUPER_ADMIN']), getOverview);

// Realtime Analytics
router.get('/analytics/realtime/overview', authenticateToken, authorizeRole(['ORGANISATION_ADMIN', 'SUPER_ADMIN']), getRealtimeOverview);
router.get('/analytics/realtime/queues', authenticateToken, authorizeRole(['ORGANISATION_ADMIN', 'SUPER_ADMIN']), getRealtimeQueues);
router.get('/analytics/realtime/alerts', authenticateToken, authorizeRole(['ORGANISATION_ADMIN', 'SUPER_ADMIN']), getRealtimeAlerts);

// Historical Analytics
router.get('/analytics/historical/performance', authenticateToken, authorizeRole(['ORGANISATION_ADMIN', 'SUPER_ADMIN']), getHistoricalPerformance);
router.get('/analytics/historical/trends', authenticateToken, authorizeRole(['ORGANISATION_ADMIN', 'SUPER_ADMIN']), getHistoricalPerformance); // Using same controller for now if logic handles it or separate if needed. Frontend calls distinct endpoints.
router.get('/analytics/historical/comparison', authenticateToken, authorizeRole(['ORGANISATION_ADMIN', 'SUPER_ADMIN']), getHistoricalPerformance);

// Staff Analytics
router.get('/analytics/staff/performance', authenticateToken, authorizeRole(['ORGANISATION_ADMIN', 'SUPER_ADMIN']), getStaffPerformance);
router.get('/analytics/staff/rankings', authenticateToken, authorizeRole(['ORGANISATION_ADMIN', 'SUPER_ADMIN']), getStaffPerformance); // Placeholder mapping
router.get('/analytics/staff/training', authenticateToken, authorizeRole(['ORGANISATION_ADMIN', 'SUPER_ADMIN']), getStaffPerformance);

// Customer Analytics
router.get('/analytics/customer/satisfaction', authenticateToken, authorizeRole(['ORGANISATION_ADMIN', 'SUPER_ADMIN']), getCustomerSatisfaction);
router.get('/analytics/customer/segments', authenticateToken, authorizeRole(['ORGANISATION_ADMIN', 'SUPER_ADMIN']), getCustomerSatisfaction);
router.get('/analytics/customer/behavior', authenticateToken, authorizeRole(['ORGANISATION_ADMIN', 'SUPER_ADMIN']), getCustomerSatisfaction);

// Operational Analytics
router.get('/analytics/operational/efficiency', authenticateToken, authorizeRole(['ORGANISATION_ADMIN', 'SUPER_ADMIN']), getOperationalEfficiency);
router.get('/analytics/operational/costs', authenticateToken, authorizeRole(['ORGANISATION_ADMIN', 'SUPER_ADMIN']), getOperationalEfficiency);
router.get('/analytics/operational/resources', authenticateToken, authorizeRole(['ORGANISATION_ADMIN', 'SUPER_ADMIN']), getOperationalEfficiency);

module.exports = router;