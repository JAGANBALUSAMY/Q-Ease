-- Add indexes for performance optimization
-- Run this migration to improve query performance

-- User table indexes
CREATE INDEX IF NOT EXISTS idx_user_email ON "User"(email);
CREATE INDEX IF NOT EXISTS idx_user_role ON "User"(role);
CREATE INDEX IF NOT EXISTS idx_user_organisation ON "User"("organisationId");
CREATE INDEX IF NOT EXISTS idx_user_active ON "User"("isActive");

-- Organisation table indexes
CREATE INDEX IF NOT EXISTS idx_organisation_code ON "Organisation"(code);
CREATE INDEX IF NOT EXISTS idx_organisation_verified ON "Organisation"("isVerified");

-- Queue table indexes
CREATE INDEX IF NOT EXISTS idx_queue_organisation ON "Queue"("organisationId");
CREATE INDEX IF NOT EXISTS idx_queue_active ON "Queue"("isActive");
CREATE INDEX IF NOT EXISTS idx_queue_org_active ON "Queue"("organisationId", "isActive");

-- Token table indexes
CREATE INDEX IF NOT EXISTS idx_token_user ON "Token"("userId");
CREATE INDEX IF NOT EXISTS idx_token_queue ON "Token"("queueId");
CREATE INDEX IF NOT EXISTS idx_token_organisation ON "Token"("organisationId");
CREATE INDEX IF NOT EXISTS idx_token_status ON "Token"(status);
CREATE INDEX IF NOT EXISTS idx_token_queue_status ON "Token"("queueId", status);
CREATE INDEX IF NOT EXISTS idx_token_issued_at ON "Token"("issuedAt");
CREATE INDEX IF NOT EXISTS idx_token_called_at ON "Token"("calledAt");

-- Notification table indexes
CREATE INDEX IF NOT EXISTS idx_notification_user ON "Notification"("userId");
CREATE INDEX IF NOT EXISTS idx_notification_organisation ON "Notification"("organisationId");
CREATE INDEX IF NOT EXISTS idx_notification_read ON "Notification"("isRead");
CREATE INDEX IF NOT EXISTS idx_notification_created ON "Notification"("createdAt");

-- StaffAssignment table indexes
CREATE INDEX IF NOT EXISTS idx_staff_assignment_staff ON "StaffAssignment"("staffId");
CREATE INDEX IF NOT EXISTS idx_staff_assignment_queue ON "StaffAssignment"("queueId");

-- Feedback table indexes (if exists)
CREATE INDEX IF NOT EXISTS idx_feedback_queue ON "Feedback"("queueId") WHERE EXISTS (
  SELECT 1 FROM information_schema.tables WHERE table_name = 'Feedback'
);
CREATE INDEX IF NOT EXISTS idx_feedback_created ON "Feedback"("createdAt") WHERE EXISTS (
  SELECT 1 FROM information_schema.tables WHERE table_name = 'Feedback'
);

-- Composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_token_queue_status_position ON "Token"("queueId", status, position);
CREATE INDEX IF NOT EXISTS idx_user_org_role ON "User"("organisationId", role);

-- Partial indexes for active records (more efficient)
CREATE INDEX IF NOT EXISTS idx_token_pending ON "Token"("queueId", position) WHERE status = 'PENDING';
CREATE INDEX IF NOT EXISTS idx_queue_active_org ON "Queue"("organisationId") WHERE "isActive" = true;

COMMENT ON INDEX idx_user_email IS 'Fast lookup for login';
COMMENT ON INDEX idx_token_queue_status IS 'Optimize queue token queries';
COMMENT ON INDEX idx_token_pending IS 'Fast lookup for pending tokens in queue';
