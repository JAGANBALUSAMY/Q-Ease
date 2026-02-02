/**
 * Analytics Worker
 * Background job for generating analytics reports and aggregating data
 * 
 * This worker can be used for:
 * - Daily/weekly/monthly report generation
 * - Data aggregation for performance metrics
 * - Cleanup of old analytics data
 * 
 * To use: Set up a cron job or use node-cron
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Generate daily analytics report
 */
const generateDailyReport = async () => {
    try {
        console.log('📊 Generating daily analytics report...');

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        // Get today's token statistics
        const todayTokens = await prisma.token.groupBy({
            by: ['status'],
            where: {
                issuedAt: {
                    gte: today,
                    lt: tomorrow
                }
            },
            _count: true
        });

        // Get organization statistics
        const orgStats = await prisma.organisation.count({
            where: { isVerified: true }
        });

        // Get queue statistics
        const queueStats = await prisma.queue.count({
            where: { isActive: true }
        });

        console.log('Daily Report:', {
            date: today.toISOString().split('T')[0],
            tokens: todayTokens,
            organizations: orgStats,
            activeQueues: queueStats
        });

        // You can save this to a reports table or send via email

        return true;
    } catch (error) {
        console.error('Daily report generation failed:', error);
        return false;
    }
};

/**
 * Cleanup old analytics data
 * Remove data older than 90 days
 */
const cleanupOldData = async () => {
    try {
        console.log('🧹 Cleaning up old analytics data...');

        const ninetyDaysAgo = new Date();
        ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

        // Delete old notifications
        const deletedNotifications = await prisma.notification.deleteMany({
            where: {
                createdAt: {
                    lt: ninetyDaysAgo
                },
                isRead: true
            }
        });

        console.log(`Deleted ${deletedNotifications.count} old notifications`);

        return true;
    } catch (error) {
        console.error('Cleanup failed:', error);
        return false;
    }
};

/**
 * Aggregate weekly statistics
 */
const aggregateWeeklyStats = async () => {
    try {
        console.log('📈 Aggregating weekly statistics...');

        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);

        // Get weekly token statistics
        const weeklyTokens = await prisma.token.count({
            where: {
                issuedAt: {
                    gte: weekAgo
                }
            }
        });

        console.log(`Weekly tokens issued: ${weeklyTokens}`);

        return true;
    } catch (error) {
        console.error('Weekly aggregation failed:', error);
        return false;
    }
};

// Run if executed directly
if (require.main === module) {
    console.log('🚀 Starting analytics worker...');

    // Run daily report
    generateDailyReport()
        .then(() => cleanupOldData())
        .then(() => aggregateWeeklyStats())
        .then(() => {
            console.log('✅ Analytics worker completed');
            process.exit(0);
        })
        .catch((error) => {
            console.error('❌ Analytics worker failed:', error);
            process.exit(1);
        });
}

module.exports = {
    generateDailyReport,
    cleanupOldData,
    aggregateWeeklyStats
};