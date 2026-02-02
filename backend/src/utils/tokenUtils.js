const { prisma } = require('../models');

// Recalculate positions for all tokens in a queue
const recalculateQueuePositions = async (queueId) => {
  try {
    // Get all pending tokens ordered by priority and issued time
    const tokens = await prisma.token.findMany({
      where: {
        queueId,
        status: 'PENDING'
      },
      orderBy: [
        { priority: 'desc' }, // Higher priority first (EMERGENCY > PRIORITY > NORMAL)
        { issuedAt: 'asc' }   // Earlier issued first among same priority
      ]
    });

    // Update positions sequentially
    for (let i = 0; i < tokens.length; i++) {
      await prisma.token.update({
        where: { id: tokens[i].id },
        data: {
          position: i + 1
        }
      });
    }

    console.log(`Recalculated positions for ${tokens.length} tokens in queue ${queueId}`);
    return tokens.length;
  } catch (error) {
    console.error('Error recalculating queue positions:', error);
    throw error;
  }
};

// Calculate the next position when adding a new token
const calculateNewTokenPosition = async (queueId, priority = 'NORMAL') => {
  try {
    // Get all pending tokens in the queue
    const pendingTokens = await prisma.token.findMany({
      where: {
        queueId,
        status: 'PENDING'
      },
      orderBy: [
        { priority: 'desc' },
        { issuedAt: 'asc' }
      ]
    });

    // Find the position for the new token based on its priority
    let position = 1;
    for (const token of pendingTokens) {
      if (getPriorityValue(token.priority) <= getPriorityValue(priority)) {
        position++;
      } else {
        break;
      }
    }

    return position;
  } catch (error) {
    console.error('Error calculating new token position:', error);
    throw error;
  }
};

// Get numeric value for priority (higher number = higher priority)
const getPriorityValue = (priority) => {
  switch (priority) {
    case 'EMERGENCY':
      return 3;
    case 'PRIORITY':
      return 2;
    case 'NORMAL':
      return 1;
    default:
      return 1;
  }
};

// Generate a unique display token ID
const generateDisplayTokenId = async (queueId, queueName) => {
  try {
    // Get the last token in the queue to determine the next number
    const lastToken = await prisma.token.findFirst({
      where: { queueId },
      orderBy: { issuedAt: 'desc' }
    });

    let newNumber = 1;
    if (lastToken) {
      // Extract the number from the last token's display ID
      const lastNumberMatch = lastToken.displayToken.match(/\d+$/);
      if (lastNumberMatch) {
        newNumber = parseInt(lastNumberMatch[0]) + 1;
      }
    }

    // Create prefix from queue name (first letter)
    const prefix = queueName.charAt(0).toUpperCase() || 'T';

    // Format the display token ID (e.g., E001, R002, etc.)
    const displayToken = `${prefix}${newNumber.toString().padStart(3, '0')}`;

    return displayToken;
  } catch (error) {
    console.error('Error generating display token ID:', error);
    throw error;
  }
};

// Update all token positions after a token status change
const updatePositionsAfterStatusChange = async (queueId, changedTokenId, newStatus) => {
  try {
    // If the token is being removed from the queue (SERVED, CANCELLED, MISSED), 
    // we need to shift down all tokens that came after it in position
    if (['SERVED', 'CANCELLED', 'MISSED'].includes(newStatus)) {
      const changedToken = await prisma.token.findUnique({
        where: { id: changedTokenId }
      });

      if (changedToken && changedToken.status === 'PENDING') {
        // Get all pending tokens that had a position after the changed token
        const tokensToUpdate = await prisma.token.findMany({
          where: {
            queueId,
            status: 'PENDING',
            position: { gt: changedToken.position }
          },
          orderBy: { position: 'asc' }
        });

        // Shift their positions down by 1
        for (const token of tokensToUpdate) {
          await prisma.token.update({
            where: { id: token.id },
            data: {
              position: token.position - 1
            }
          });
        }
      }
    }

    return true;
  } catch (error) {
    console.error('Error updating positions after status change:', error);
    throw error;
  }
};

module.exports = {
  recalculateQueuePositions,
  calculateNewTokenPosition,
  getPriorityValue,
  generateDisplayTokenId,
  updatePositionsAfterStatusChange
};