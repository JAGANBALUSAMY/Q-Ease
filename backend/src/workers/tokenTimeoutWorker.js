/**
 * Token Timeout Worker
 * Background job for handling token timeouts and no-shows
 * 
 * This worker:
 * - Marks tokens as NO_SHOW if not served within timeout
 * - Automatically cancels expired tokens
 * - Sends notifications for timeout warnings
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Timeout duration in minutes
const CALLED_TOKEN_TIMEOUT = 10; // 10 minutes after being called
const PENDING_TOKEN_TIMEOUT = 120; // 2 hours for pending tokens

/**
 * Check for tokens that have been called but not served
 */
const checkCalledTokenTimeouts = async () => {
    try {
        console.log('⏱️  Checking called token timeouts...');

        const timeoutThreshold = new Date();
        timeoutThreshold.setMinutes(timeoutThreshold.getMinutes() - CALLED_TOKEN_TIMEOUT);

        // Find tokens that have been called but not served
        const timedOutTokens = await prisma.token.findMany({
            where: {
                status: 'CALLED',
                calledAt: {
                    lt: timeoutThreshold
                }
            },
            include: {
                user: true,
                queue: true
            }
        });

        console.log(`Found ${timedOutTokens.length} timed out tokens`);

        for (const token of timedOutTokens) {
            try {
                // Mark as NO_SHOW
                await prisma.token.update({
                    where: { id: token.id },
                    data: {
                        status: 'CANCELLED',
                        cancelledAt: new Date()
                    }
                });

                // Create notification
                await prisma.notification.create({
                    data: {
                        userId: token.userId,
                        organisationId: token.organisationId,
                        type: 'TOKEN_TIMEOUT',
                        title: 'Token Expired',
                        message: `Your token ${token.tokenId} has expired due to no-show. Please join the queue again if needed.`,
                        data: JSON.stringify({
                            tokenId: token.id,
                            queueId: token.queueId,
                            reason: 'timeout'
                        })
                    }
                });

                console.log(`Marked token ${token.tokenId} as timed out`);

                // Emit socket event
                const io = global.io;
                if (io) {
                    io.to(`token-${token.id}`).emit('token-update', {
                        tokenId: token.id,
                        status: 'CANCELLED',
                        reason: 'timeout'
                    });

                    io.to(`queue-${token.queueId}`).emit('queue-update', {
                        queueId: token.queueId,
                        action: 'token-timeout'
                    });
                }
            } catch (error) {
                console.error(`Failed to process timeout for token ${token.id}:`, error);
            }
        }

        return timedOutTokens.length;
    } catch (error) {
        console.error('Called token timeout check failed:', error);
        return 0;
    }
};

/**
 * Check for very old pending tokens
 */
const checkPendingTokenTimeouts = async () => {
    try {
        console.log('⏱️  Checking pending token timeouts...');

        const timeoutThreshold = new Date();
        timeoutThreshold.setMinutes(timeoutThreshold.getMinutes() - PENDING_TOKEN_TIMEOUT);

        // Find very old pending tokens
        const expiredTokens = await prisma.token.findMany({
            where: {
                status: 'PENDING',
                issuedAt: {
                    lt: timeoutThreshold
                }
            }
        });

        console.log(`Found ${expiredTokens.length} expired pending tokens`);

        for (const token of expiredTokens) {
            try {
                // Auto-cancel very old tokens
                await prisma.token.update({
                    where: { id: token.id },
                    data: {
                        status: 'CANCELLED',
                        cancelledAt: new Date()
                    }
                });

                // Notify user
                await prisma.notification.create({
                    data: {
                        userId: token.userId,
                        organisationId: token.organisationId,
                        type: 'TOKEN_EXPIRED',
                        title: 'Token Expired',
                        message: `Your token ${token.tokenId} has expired. Please join the queue again if needed.`,
                        data: JSON.stringify({
                            tokenId: token.id,
                            reason: 'expired'
                        })
                    }
                });

                console.log(`Auto-cancelled expired token ${token.tokenId}`);
            } catch (error) {
                console.error(`Failed to cancel expired token ${token.id}:`, error);
            }
        }

        return expiredTokens.length;
    } catch (error) {
        console.error('Pending token timeout check failed:', error);
        return 0;
    }
};

/**
 * Send timeout warnings
 * Warn users when their called token is about to timeout
 */
const sendTimeoutWarnings = async () => {
    try {
        console.log('⚠️  Sending timeout warnings...');

        const warningThreshold = new Date();
        warningThreshold.setMinutes(warningThreshold.getMinutes() - (CALLED_TOKEN_TIMEOUT - 2)); // 2 minutes before timeout

        const tokensNearTimeout = await prisma.token.findMany({
            where: {
                status: 'CALLED',
                calledAt: {
                    lt: warningThreshold,
                    gte: new Date(warningThreshold.getTime() - 60000) // Last minute
                }
            },
            include: {
                user: true
            }
        });

        for (const token of tokensNearTimeout) {
            try {
                await prisma.notification.create({
                    data: {
                        userId: token.userId,
                        organisationId: token.organisationId,
                        type: 'TOKEN_WARNING',
                        title: 'Urgent: Your Token is About to Expire!',
                        message: `Your token ${token.tokenId} will expire in 2 minutes. Please proceed to the counter immediately!`,
                        data: JSON.stringify({
                            tokenId: token.id,
                            minutesRemaining: 2
                        })
                    }
                });

                console.log(`Sent timeout warning for token ${token.tokenId}`);
            } catch (error) {
                console.error(`Failed to send warning for token ${token.id}:`, error);
            }
        }

        return tokensNearTimeout.length;
    } catch (error) {
        console.error('Timeout warning failed:', error);
        return 0;
    }
};

// Run if executed directly
if (require.main === module) {
    console.log('🚀 Starting token timeout worker...');

    const runWorker = async () => {
        const calledTimeouts = await checkCalledTokenTimeouts();
        const pendingTimeouts = await checkPendingTokenTimeouts();
        const warnings = await sendTimeoutWarnings();

        console.log(`✅ Processed ${calledTimeouts} called timeouts, ${pendingTimeouts} pending timeouts, ${warnings} warnings`);
    };

    runWorker()
        .then(() => {
            console.log('✅ Token timeout worker completed');
            process.exit(0);
        })
        .catch((error) => {
            console.error('❌ Token timeout worker failed:', error);
            process.exit(1);
        });
}

module.exports = {
    checkCalledTokenTimeouts,
    checkPendingTokenTimeouts,
    sendTimeoutWarnings
};