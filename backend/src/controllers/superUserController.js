const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

// Create a new Organisation Admin (Level 2)
// Only callable by SUPER_ADMIN (Level 1)
const createAdmin = async (req, res) => {
    try {
        const { email, password, firstName, lastName, phoneNumber } = req.body;
        const superAdminId = req.user.id; // From Auth Middleware
        const organisationId = req.user.organisationId;

        // 1. Validate Scope
        // Ensure the caller is actually a Super Admin
        if (req.user.role !== 'SUPER_ADMIN') {
            return res.status(403).json({ success: false, message: 'Only Super Admins can create Admins' });
        }

        // 2. Check existence
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ success: false, message: 'User (Admin) already exists' });
        }

        // 3. Get Role
        const adminRole = await prisma.roleModel.findFirst({
            where: { name: 'ORGANISATION_ADMIN' }
        });

        if (!adminRole) {
            return res.status(500).json({ success: false, message: 'Role ORGANISATION_ADMIN not found' });
        }

        // 4. Create User with Lineage
        const hashedPassword = await bcrypt.hash(password, 10);
        const newAdmin = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                firstName,
                lastName,
                phoneNumber,
                roleId: adminRole.id,
                organisationId: organisationId, // Must belong to same Org
                creatorId: superAdminId,        // LINEAGE ENFORCEMENT
                isActive: true,
                isVerified: true
            }
        });

        res.status(201).json({
            success: true,
            message: 'Admin created successfully',
            data: {
                id: newAdmin.id,
                email: newAdmin.email,
                role: 'ORGANISATION_ADMIN',
                creatorId: newAdmin.creatorId
            }
        });

    } catch (error) {
        console.error('Create Admin Error:', error);
        res.status(500).json({ success: false, message: 'Failed to create Admin' });
    }
};

// Get Admins created by this Super Admin
const getMyAdmins = async (req, res) => {
    try {
        const superAdminId = req.user.id;

        if (req.user.role !== 'SUPER_ADMIN') {
            return res.status(403).json({ success: false, message: 'Access denied' });
        }

        const admins = await prisma.user.findMany({
            where: {
                creatorId: superAdminId, // STRICT OWNERSHIP CHECK
                roleModel: { name: 'ORGANISATION_ADMIN' }
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                isActive: true,
                createdAt: true
            }
        });

        res.json({ success: true, data: admins });

    } catch (error) {
        console.error('Get Admins Error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch admins' });
    }
};

module.exports = {
    createAdmin,
    getMyAdmins
};
