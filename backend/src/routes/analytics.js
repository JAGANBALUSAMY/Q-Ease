const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const { getOverview, getRealtimeOverview, getRealtimeAlerts, getRealtimeQueues, getStaffPerformance } = require('../controllers/analyticsController.js');

// Basic analytics endpoint
router.get('/', async (req, res) => {
    return res.json({
      success: true,
      data: 'Server Works' 
    })
})

// Organisation analytics endpoint (for admin dashboard)
router.get('/organisation', async (req, res) => {
    return res.json({
      success: true,
      data: {
        metrics: {
          totalQueues: 5,
          activeQueues: 3,
          totalTokens: 127,
          servedToday: 89,
          waitingCount: 12,
          averageWaitTime: 15
        }
      }
    })
})

// Realtime overview endpoint
router.get('/realtime/overview', async (req, res) => {
    return res.json({
      success: true,
      data: {
        activeQueues: 3,
        waitingCustomers: 12,
        servedToday: 89,
        staffOnline: 4
      }
    })
})

// Realtime queues endpoint
router.get('/realtime/queues', async (req, res) => {
    return res.json({
      success: true,
      data: [
        { name: 'OPD Registration', waiting: 5, avgWait: 12, status: 'active', staffCount: 2 },
        { name: 'Laboratory Services', waiting: 3, avgWait: 18, status: 'active', staffCount: 1 },
        { name: 'Billing Counter', waiting: 4, avgWait: 8, status: 'active', staffCount: 1 }
      ]
    })
})

// Realtime alerts endpoint
router.get('/realtime/alerts', async (req, res) => {
    return res.json({
      success: true,
      data: [
        { severity: 'medium', message: 'OPD Registration queue over capacity (15)', time: '10:30 AM' },
        { severity: 'low', message: 'Laboratory Services has long wait times', time: '10:15 AM' }
      ]
    })
})

// Historical performance endpoint
router.get('/historical/performance', async (req, res) => {
    return res.json({
      success: true,
      data: [
        { date: '2024-01-15', served: 45, avgWaitTime: 12, queuesActive: 3 },
        { date: '2024-01-16', served: 52, avgWaitTime: 14, queuesActive: 3 },
        { date: '2024-01-17', served: 38, avgWaitTime: 11, queuesActive: 2 }
      ]
    })
})

// Historical trends endpoint
router.get('/historical/trends', async (req, res) => {
    return res.json({
      success: true,
      data: [
        { date: '2024-01-15', served: 45, avgWaitTime: 12, queuesActive: 3 },
        { date: '2024-01-16', served: 52, avgWaitTime: 14, queuesActive: 3 },
        { date: '2024-01-17', served: 38, avgWaitTime: 11, queuesActive: 2 }
      ]
    })
})

// Historical comparison endpoint
router.get('/historical/comparison', async (req, res) => {
    return res.json({
      success: true,
      data: {
        currentPeriod: { served: 135, avgWaitTime: 12.3, efficiency: 87 },
        previousPeriod: { served: 118, avgWaitTime: 14.2, efficiency: 82 },
        change: { served: 14.4, waitTime: -13.4, efficiency: 6.1 }
      }
    })
})

// Staff performance endpoint
router.get('/staff/performance', async (req, res) => {
    return res.json({
      success: true,
      data: [
        { staffName: 'Dr. Sarah Johnson', queue: 'OPD Registration', tokensServed: 25, avgWaitTime: 10, efficiency: 92 },
        { staffName: 'Nurse Priya', queue: 'Laboratory Services', tokensServed: 18, avgWaitTime: 15, efficiency: 85 },
        { staffName: 'Receptionist Meena', queue: 'Billing Counter', tokensServed: 32, avgWaitTime: 8, efficiency: 95 }
      ]
    })
})

// Staff rankings endpoint
router.get('/staff/rankings', async (req, res) => {
    return res.json({
      success: true,
      data: [
        { rank: 1, staffName: 'Receptionist Meena', score: 95, improvement: '+5%' },
        { rank: 2, staffName: 'Dr. Sarah Johnson', score: 92, improvement: '+2%' },
        { rank: 3, staffName: 'Nurse Priya', score: 85, improvement: '-3%' }
      ]
    })
})

// Staff training endpoint
router.get('/staff/training', async (req, res) => {
    return res.json({
      success: true,
      data: {
        completed: 12,
        inProgress: 3,
        pending: 2,
        averageScore: 87
      }
    })
})

// Customer satisfaction endpoint
router.get('/customer/satisfaction', async (req, res) => {
    return res.json({
      success: true,
      data: {
        avgRating: 4.2,
        totalFeedback: 89,
        ratingDistribution: {
          '5': 45,
          '4': 28,
          '3': 12,
          '2': 3,
          '1': 1
        }
      }
    })
})

// Customer segments endpoint
router.get('/customer/segments', async (req, res) => {
    return res.json({
      success: true,
      data: [
        { segment: 'Regular Patients', count: 156, avgVisits: 12 },
        { segment: 'New Patients', count: 78, avgVisits: 1 },
        { segment: 'Emergency Cases', count: 23, avgVisits: 3 }
      ]
    })
})

// Customer behavior endpoint
router.get('/customer/behavior', async (req, res) => {
    return res.json({
      success: true,
      data: {
        peakHours: ['10:00-11:00', '14:00-15:00'],
        abandonmentRate: 8.5,
        noShowRate: 12.3,
        avgVisitFrequency: 2.4
      }
    })
})

// Operational efficiency endpoint
router.get('/operational/efficiency', async (req, res) => {
    return res.json({
      success: true,
      data: {
        efficiency: 87,
        resourceUtilization: 78,
        avgServiceTime: 12,
        servedTokens: 135,
        totalTokens: 156,
        staffCount: 8
      }
    })
})

// Operational costs endpoint
router.get('/operational/costs', async (req, res) => {
    return res.json({
      success: true,
      data: {
        totalCost: 2450,
        costPerService: 12.50,
        staffCost: 1800,
        overhead: 650
      }
    })
})

// Operational resources endpoint
router.get('/operational/resources', async (req, res) => {
    return res.json({
      success: true,
      data: {
        staffUtilization: 85,
        queueCapacity: 78,
        equipmentUsage: 92,
        resourceAllocation: 'Optimal'
      }
    })
})

// Overview endpoint
router.get('/overview', async (req, res) => {
    return res.json({
      success: true,
      data: {
        totalServedToday: 89,
        avgWaitTime: 15,
        satisfactionScore: 4.2,
        activeQueues: 3
      }
    })
})

// Export endpoint
router.get('/export', async (req, res) => {
    const { format, tab, range } = req.query;
    
    // This would generate actual export data
    // For now, returning a placeholder
    const exportData = {
      timestamp: new Date().toISOString(),
      tab,
      range,
      format
    };

    if (format === 'csv') {
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=analytics-${tab}-${range}.csv`);
      res.send('Date,Value\n2024-01-01,100\n2024-01-02,150');
    } else {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=analytics-${tab}-${range}.pdf`);
      res.send('PDF content would be generated here');
    }
})

module.exports = router