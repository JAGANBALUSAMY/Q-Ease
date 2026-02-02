-- Q-Ease Sample Data Seeding

-- Insert sample organisations
INSERT INTO "Organisation" (
    "id", 
    "code", 
    "name", 
    "description", 
    "address", 
    "city", 
    "country", 
    "contactEmail", 
    "contactPhone", 
    "isVerified", 
    "isActive"
) VALUES 
(
    'org_123456',
    'ORG001',
    'City Hospital',
    'A leading healthcare facility',
    '123 Medical Street',
    'Metropolis',
    'USA',
    'contact@cityhospital.com',
    '+1-555-123-4567',
    true,
    true
),
(
    'org_789012',
    'ORG002',
    'Tech Solutions Inc',
    'IT support and services',
    '456 Innovation Blvd',
    'Techville',
    'USA',
    'support@techsolutions.com',
    '+1-555-987-6543',
    true,
    true
);

-- Insert sample roles
INSERT INTO "Role" (
    "id",
    "name",
    "description",
    "permissions"
) VALUES 
(
    'role_admin',
    'ORGANISATION_ADMIN',
    'Full administrative privileges',
    '{"permissions": ["manage_users", "manage_queues", "view_analytics", "manage_settings"]}'
),
(
    'role_staff',
    'STAFF',
    'Staff member with queue management',
    '{"permissions": ["call_tokens", "view_queue", "update_token_status"]}'
),
(
    'role_user',
    'USER',
    'Regular user',
    '{"permissions": ["join_queue", "view_token", "receive_notifications"]}'
);

-- Insert sample queues
INSERT INTO "Queue" (
    "id",
    "organisationId",
    "name",
    "description",
    "averageTime",
    "isActive"
) VALUES 
(
    'queue_emergency',
    'org_123456',
    'Emergency Registration',
    'Patient registration for emergency department',
    5,
    true
),
(
    'queue_cashier',
    'org_789012',
    'Main Service Desk',
    'General IT support and services',
    10,
    true
);

-- Insert sample users
INSERT INTO "User" (
    "id",
    "email",
    "firstName",
    "lastName",
    "phoneNumber",
    "organisationId",
    "roleId",
    "isVerified",
    "isActive"
) VALUES 
(
    'user_admin',
    'admin@cityhospital.com',
    'John',
    'Admin',
    '+1-555-111-1111',
    'org_123456',
    'role_admin',
    true,
    true
),
(
    'user_staff',
    'nurse@cityhospital.com',
    'Sarah',
    'Nurse',
    '+1-555-222-2222',
    'org_123456',
    'role_staff',
    true,
    true
),
(
    'user_patient',
    'patient@example.com',
    'Jane',
    'Doe',
    '+1-555-333-3333',
    'org_123456',
    'role_user',
    true,
    true
);

-- Insert sample tokens
INSERT INTO "Token" (
    "id",
    "tokenId",
    "queueId",
    "userId",
    "organisationId",
    "status",
    "priority",
    "position",
    "issuedAt"
) VALUES 
(
    'token_001',
    'E001',
    'queue_emergency',
    'user_patient',
    'org_123456',
    'PENDING',
    'NORMAL',
    1,
    NOW()
);