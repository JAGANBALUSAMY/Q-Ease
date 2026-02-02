const { prisma } = require('../models');

// Service to calculate queue statistics
const calculateQueueStats = async (queueId) => {
  try {
    // Get the queue information
    const queue = await prisma.queue.findUnique({
      where: { id: queueId }
    });

    if (!queue) {
      throw new Error('Queue not found');
    }

    // Get various token counts
    const stats = await prisma.token.groupBy({
      by: ['status'],
      where: {
        queueId
      },
      _count: {
        status: true
      }
    });

    const statusCounts = {};
    stats.forEach(stat => {
      statusCounts[stat.status] = stat._count.status;
    });

    // Calculate average wait time based on position and average service time
    let avgWaitTime = 0;
    if (queue.averageTime) {
      const pendingTokens = statusCounts.PENDING || 0;
      avgWaitTime = pendingTokens * queue.averageTime;
    }

    return {
      queueId: queue.id,
      name: queue.name,
      totalTokens: Object.values(statusCounts).reduce((sum, count) => sum + count, 0),
      pendingTokens: statusCounts.PENDING || 0,
      servedTokens: statusCounts.SERVED || 0,
      cancelledTokens: statusCounts.CANCELLED || 0,
      missedTokens: statusCounts.MISSED || 0,
      averageWaitTime: avgWaitTime,
      isActive: queue.isActive
    };
  } catch (error) {
    console.error('Calculate queue stats error:', error);
    throw error;
  }
};

// Service to get queue timeline (recent activity)
const getQueueTimeline = async (queueId, limit = 10) => {
  try {
    const timeline = await prisma.token.findMany({
      where: {
        queueId
      },
      orderBy: {
        issuedAt: 'desc'
      },
      take: limit,
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true
          }
        }
      }
    });

    return timeline.map(token => ({
      id: token.id,
      displayToken: token.displayToken,
      status: token.status,
      priority: token.priority,
      issuedAt: token.issuedAt,
      user: token.user ? `${token.user.firstName} ${token.user.lastName}` : 'Walk-in',
      position: token.position
    }));
  } catch (error) {
    console.error('Get queue timeline error:', error);
    throw error;
  }
};

// Service to pause all queues for an organisation
const pauseAllQueuesForOrganisation = async (organisationId) => {
  try {
    const result = await prisma.queue.updateMany({
      where: {
        organisationId
      },
      data: {
        isActive: false
      }
    });

    return {
      queuesUpdated: result.count
    };
  } catch (error) {
    console.error('Pause all queues error:', error);
    throw error;
  }
};

// Service to resume all queues for an organisation
const resumeAllQueuesForOrganisation = async (organisationId) => {
  try {
    const result = await prisma.queue.updateMany({
      where: {
        organisationId
      },
      data: {
        isActive: true
      }
    });

    return {
      queuesUpdated: result.count
    };
  } catch (error) {
    console.error('Resume all queues error:', error);
    throw error;
  }
};

// Service to get queue performance metrics
const getQueuePerformance = async (queueId, startDate, endDate) => {
  try {
    const performanceData = await prisma.token.findMany({
      where: {
        queueId,
        issuedAt: {
          gte: startDate,
          lte: endDate
        }
      },
      orderBy: {
        issuedAt: 'asc'
      }
    });

    // Calculate metrics
    let totalWaitTime = 0;
    let servedCount = 0;
    let missedCount = 0;

    performanceData.forEach(token => {
      if (token.status === 'SERVED' && token.issuedAt && token.servedAt) {
        const waitTimeMs = new Date(token.servedAt) - new Date(token.issuedAt);
        const waitTimeMins = Math.round(waitTimeMs / (1000 * 60));
        totalWaitTime += waitTimeMins;
        servedCount++;
      } else if (token.status === 'MISSED') {
        missedCount++;
      }
    });

    const avgWaitTime = servedCount > 0 ? totalWaitTime / servedCount : 0;
    const totalProcessed = servedCount + missedCount;
    const missRate = totalProcessed > 0 ? missedCount / totalProcessed : 0;

    return {
      queueId,
      period: { startDate, endDate },
      metrics: {
        avgWaitTime,
        servedCount,
        missedCount,
        totalProcessed,
        missRate
      }
    };
  } catch (error) {
    console.error('Get queue performance error:', error);
    throw error;
  }
};

module.exports = {
  calculateQueueStats,
  getQueueTimeline,
  pauseAllQueuesForOrganisation,
  resumeAllQueuesForOrganisation,
  getQueuePerformance
};