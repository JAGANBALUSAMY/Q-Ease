/**
 * Notification Worker
 * Background job for sending notifications
 * 
 * This worker handles:
 * - Batch notification sending
 * - Retry failed notifications
 * - Scheduled notifications
 */

const { PrismaClient } = require('@prisma/client');
const { sendTokenCalledEmail, sendTokenIssuedEmail } = require('../services/emailService');
const prisma = new PrismaClient();

/**
 * Process pending notifications
 * Send notifications that failed or are queued
 */
const processPendingNotifications = async () => {
    try {
        console.log('📧 Processing pending notifications...');

        // Get unread notifications from last 24 hours
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        const pendingNotifications = await prisma.notification.findMany({
            where: {
                isRead: false,
                createdAt: {
                    gte: yesterday
                }
            },
            include: {
                user: true
            },
            take: 100 // Process in batches
        });

        console.log(`Found ${pendingNotifications.length} pending notifications`);

        // Process each notification
        for (const notification of pendingNotifications) {
            try {
                // Here you can implement retry logic for failed email sends
                console.log(`Processing notification ${notification.id} for user ${notification.user.email}`);

                // Mark as processed (optional)
                // await prisma.notification.update({
                //   where: { id: notification.id },
                //   data: { isRead: true }
                // });
            } catch (error) {
                console.error(`Failed to process notification ${notification.id}:`, error);
            }
        }

        return true;
    } catch (error) {
        console.error('Notification processing failed:', error);
        return false;
    }
};

/**
 * Send reminder notifications
 * Remind users about their upcoming tokens
 */
const sendReminders = async () => {
    try {
        console.log('⏰ Sending reminder notifications...');

        // Find tokens that are 2-3 positions away from being called
        const upcomingTokens = await prisma.token.findMany({
            where: {
                status: 'PENDING',
                position: {
                    lte: 3,
                    gte: 2
                }
            },
            include: {
                user: true,
                queue: true
            }
        });

        console.log(`Found ${upcomingTokens.length} tokens for reminders`);

        for (const token of upcomingTokens) {
            try {
                // Create reminder notification
                await prisma.notification.create({
                    data: {
                        userId: token.userId,
                        organisationId: token.organisationId,
                        type: 'TOKEN_REMINDER',
                        title: 'Your turn is approaching!',
                        message: `Your token ${token.tokenId} is ${token.position} positions away. Please be ready.`,
                        data: JSON.stringify({
                            tokenId: token.id,
                            queueId: token.queueId,
                            position: token.position
                        })
                    }
                });

                console.log(`Sent reminder for token ${token.tokenId}`);
            } catch (error) {
                console.error(`Failed to send reminder for token ${token.id}:`, error);
            }
        }

        return true;
    } catch (error) {
        console.error('Reminder sending failed:', error);
        return false;
    }
};

/**
 * Cleanup old notifications
 */
const cleanupOldNotifications = async () => {
    try {
        console.log('🧹 Cleaning up old notifications...');

        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const deleted = await prisma.notification.deleteMany({
            where: {
                createdAt: {
                    lt: thirtyDaysAgo
                },
                isRead: true
            }
        });

        console.log(`Deleted ${deleted.count} old notifications`);

        return true;
    } catch (error) {
        console.error('Cleanup failed:', error);
        return false;
    }
};

// Run if executed directly
if (require.main === module) {
    console.log('🚀 Starting notification worker...');

    processPendingNotifications()
        .then(() => sendReminders())
        .then(() => cleanupOldNotifications())
        .then(() => {
            console.log('✅ Notification worker completed');
            process.exit(0);
        })
        .catch((error) => {
            console.error('❌ Notification worker failed:', error);
            process.exit(1);
        });
}

module.exports = {
    processPendingNotifications,
    sendReminders,
    cleanupOldNotifications
};