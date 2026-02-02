const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const createTenant = async (req, res) => {
    try {
        const {
            orgName,
            orgCode,
            firstName,
            lastName,
            email,
            password,
            phoneNumber
        } = req.body;

        // 1. Validation
        if (!orgName || !orgCode || !email || !password || !firstName || !lastName) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        if (orgCode.length !== 6) {
            return res.status(400).json({
                success: false,
                message: 'Organization code must be exactly 6 characters'
            });
        }

        // 2. Check existence
        const existingOrg = await prisma.organisation.findUnique({
            where: { code: orgCode }
        });
        if (existingOrg) {
            return res.status(409).json({ success: false, message: 'Organization code already exists' });
        }

        const existingUser = await prisma.user.findUnique({
            where: { email }
        });
        if (existingUser) {
            return res.status(409).json({ success: false, message: 'User email already exists' });
        }

        // 3. Get Super Admin Role
        const superAdminRole = await prisma.roleModel.findFirst({
            where: { name: 'SUPER_ADMIN' }
        });

        if (!superAdminRole) {
            // Create role if it doesn't exist (bootstrapping)
            await prisma.roleModel.create({
                data: {
                    name: 'SUPER_ADMIN',
                    description: 'Top level administrator for an organization'
                }
            });
            // Re-fetch or use created... simple recursive/retry logic or just fail? 
            // safer to just fail and ask admin to seed db, but for ease let's fail with clear message
            return res.status(500).json({ success: false, message: 'SUPER_ADMIN role not found. Please seed roles.' });
        }

        // 4. Create Transaction
        const result = await prisma.$transaction(async (prisma) => {
            // Create Org
            const org = await prisma.organisation.create({
                data: {
                    name: orgName,
                    code: orgCode.toUpperCase(),
                    isActive: true,
                    isVerified: true // Auto-verify since system admin created it
                }
            });

            // Hash Password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create User
            const user = await prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    firstName,
                    lastName,
                    phoneNumber,
                    roleId: superAdminRole.id,
                    organisationId: org.id,
                    isActive: true,
                    isVerified: true
                }
            });

            return { org, user };
        });

        res.status(201).json({
            success: true,
            message: 'Tenant created successfully',
            data: {
                organisation: {
                    id: result.org.id,
                    name: result.org.name,
                    code: result.org.code
                },
                user: {
                    id: result.user.id,
                    email: result.user.email,
                    role: 'SUPER_ADMIN'
                }
            }
        });

    } catch (error) {
        console.error('Create tenant error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create tenant',
            error: error.message
        });
    }
};

module.exports = {
    createTenant
};
