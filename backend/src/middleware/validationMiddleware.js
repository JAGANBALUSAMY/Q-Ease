const { body, param, query, validationResult } = require('express-validator');

// Validation error handler
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array()
        });
    }
    next();
};

// Auth validations
const validateRegister = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email address'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
    body('firstName')
        .trim()
        .notEmpty()
        .withMessage('First name is required'),
    body('lastName')
        .trim()
        .notEmpty()
        .withMessage('Last name is required'),
    body('phoneNumber')
        .optional()
        .matches(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/)
        .withMessage('Please provide a valid phone number'),
    handleValidationErrors
];

const validateLogin = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email address'),
    body('password')
        .notEmpty()
        .withMessage('Password is required'),
    handleValidationErrors
];

const validateStaffLogin = [
    body('employeeId')
        .notEmpty()
        .withMessage('Employee ID is required'),
    body('password')
        .notEmpty()
        .withMessage('Password is required'),
    handleValidationErrors
];

// Organization validations
const validateOrganization = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Organization name is required')
        .isLength({ min: 3, max: 100 })
        .withMessage('Organization name must be between 3 and 100 characters'),
    body('code')
        .isLength({ min: 6, max: 6 })
        .withMessage('Organization code must be exactly 6 characters')
        .isAlphanumeric()
        .withMessage('Organization code must contain only letters and numbers')
        .toUpperCase(),
    body('contactEmail')
        .optional()
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email address'),
    body('contactPhone')
        .optional()
        .matches(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/)
        .withMessage('Please provide a valid phone number'),
    body('description')
        .optional()
        .isLength({ max: 500 })
        .withMessage('Description must not exceed 500 characters'),
    handleValidationErrors
];

const validateOrganizationUpdate = [
    body('name')
        .optional()
        .trim()
        .isLength({ min: 3, max: 100 })
        .withMessage('Organization name must be between 3 and 100 characters'),
    body('contactEmail')
        .optional()
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email address'),
    body('contactPhone')
        .optional()
        .matches(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/)
        .withMessage('Please provide a valid phone number'),
    handleValidationErrors
];

// Queue validations
const validateQueue = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Queue name is required')
        .isLength({ min: 3, max: 100 })
        .withMessage('Queue name must be between 3 and 100 characters'),
    body('organisationId')
        .notEmpty()
        .withMessage('Organization ID is required'),
    body('maxTokens')
        .optional()
        .isInt({ min: 1, max: 1000 })
        .withMessage('Max tokens must be between 1 and 1000'),
    body('averageTime')
        .optional()
        .isInt({ min: 1, max: 300 })
        .withMessage('Average time must be between 1 and 300 minutes'),
    body('description')
        .optional()
        .isLength({ max: 500 })
        .withMessage('Description must not exceed 500 characters'),
    handleValidationErrors
];

const validateQueueUpdate = [
    body('name')
        .optional()
        .trim()
        .isLength({ min: 3, max: 100 })
        .withMessage('Queue name must be between 3 and 100 characters'),
    body('maxTokens')
        .optional()
        .isInt({ min: 1, max: 1000 })
        .withMessage('Max tokens must be between 1 and 1000'),
    body('averageTime')
        .optional()
        .isInt({ min: 1, max: 300 })
        .withMessage('Average time must be between 1 and 300 minutes'),
    body('isActive')
        .optional()
        .isBoolean()
        .withMessage('isActive must be a boolean value'),
    handleValidationErrors
];

// Token validations
const validateToken = [
    body('queueId')
        .notEmpty()
        .withMessage('Queue ID is required'),
    body('priority')
        .optional()
        .isIn(['NORMAL', 'PRIORITY', 'EMERGENCY'])
        .withMessage('Priority must be NORMAL, PRIORITY, or EMERGENCY'),
    body('userId')
        .optional()
        .notEmpty()
        .withMessage('User ID cannot be empty if provided'),
    handleValidationErrors
];

const validateTokenUpdate = [
    body('status')
        .optional()
        .isIn(['PENDING', 'CALLED', 'SERVED', 'CANCELLED', 'MISSED', 'ABANDONED'])
        .withMessage('Invalid token status'),
    body('notes')
        .optional()
        .isLength({ max: 500 })
        .withMessage('Notes must not exceed 500 characters'),
    handleValidationErrors
];

// ID parameter validation
const validateId = [
    param('id')
        .notEmpty()
        .withMessage('ID parameter is required'),
    handleValidationErrors
];

// Search query validation
const validateSearch = [
    query('search')
        .optional()
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage('Search query must be between 1 and 100 characters'),
    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer'),
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100'),
    handleValidationErrors
];

module.exports = {
    validateRegister,
    validateLogin,
    validateStaffLogin,
    validateOrganization,
    validateOrganizationUpdate,
    validateQueue,
    validateQueueUpdate,
    validateToken,
    validateTokenUpdate,
    validateId,
    validateSearch,
    handleValidationErrors
};
