const QRCode = require('qrcode');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * QR Code Service
 * Generates QR codes for organizations and queues
 */

// Generate QR code for organization
const generateOrganisationQR = async (organisationId) => {
    try {
        const organisation = await prisma.organisation.findUnique({
            where: { id: organisationId },
            select: { code: true, name: true }
        });

        if (!organisation) {
            throw new Error('Organisation not found');
        }

        // QR code contains the organization code for quick access
        const qrData = {
            type: 'organisation',
            code: organisation.code,
            id: organisationId,
            url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/org/${organisation.code}`
        };

        // Generate QR code as data URL
        const qrCodeDataURL = await QRCode.toDataURL(JSON.stringify(qrData), {
            errorCorrectionLevel: 'H',
            type: 'image/png',
            quality: 0.95,
            margin: 1,
            color: {
                dark: '#000000',
                light: '#FFFFFF'
            },
            width: 300
        });

        return {
            success: true,
            qrCode: qrCodeDataURL,
            data: qrData
        };
    } catch (error) {
        console.error('Generate organisation QR error:', error);
        throw error;
    }
};

// Generate QR code for queue
const generateQueueQR = async (queueId) => {
    try {
        const queue = await prisma.queue.findUnique({
            where: { id: queueId },
            include: {
                organisation: {
                    select: { code: true, name: true }
                }
            }
        });

        if (!queue) {
            throw new Error('Queue not found');
        }

        // QR code contains direct link to join this queue
        const qrData = {
            type: 'queue',
            queueId: queue.id,
            queueName: queue.name,
            orgCode: queue.organisation.code,
            url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/queue/${queueId}/join`
        };

        // Generate QR code as data URL
        const qrCodeDataURL = await QRCode.toDataURL(JSON.stringify(qrData), {
            errorCorrectionLevel: 'H',
            type: 'image/png',
            quality: 0.95,
            margin: 1,
            color: {
                dark: '#000000',
                light: '#FFFFFF'
            },
            width: 300
        });

        return {
            success: true,
            qrCode: qrCodeDataURL,
            data: qrData
        };
    } catch (error) {
        console.error('Generate queue QR error:', error);
        throw error;
    }
};

// Generate QR code for token (for display/printing)
const generateTokenQR = async (tokenId) => {
    try {
        const token = await prisma.token.findUnique({
            where: { id: tokenId },
            include: {
                queue: {
                    select: { name: true }
                },
                organisation: {
                    select: { name: true, code: true }
                }
            }
        });

        if (!token) {
            throw new Error('Token not found');
        }

        // QR code contains token tracking information
        const qrData = {
            type: 'token',
            tokenId: token.id,
            tokenNumber: token.tokenId,
            queueName: token.queue.name,
            orgCode: token.organisation.code,
            url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/track/${tokenId}`
        };

        // Generate QR code as data URL
        const qrCodeDataURL = await QRCode.toDataURL(JSON.stringify(qrData), {
            errorCorrectionLevel: 'H',
            type: 'image/png',
            quality: 0.95,
            margin: 1,
            color: {
                dark: '#000000',
                light: '#FFFFFF'
            },
            width: 300
        });

        return {
            success: true,
            qrCode: qrCodeDataURL,
            data: qrData
        };
    } catch (error) {
        console.error('Generate token QR error:', error);
        throw error;
    }
};

// Parse QR code data
const parseQRData = (qrString) => {
    try {
        const data = JSON.parse(qrString);
        return {
            success: true,
            data
        };
    } catch (error) {
        // If not JSON, assume it's a simple code
        return {
            success: true,
            data: {
                type: 'code',
                value: qrString
            }
        };
    }
};

module.exports = {
    generateOrganisationQR,
    generateQueueQR,
    generateTokenQR,
    parseQRData
};
