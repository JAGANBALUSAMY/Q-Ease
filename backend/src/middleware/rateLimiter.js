const rateLimit = require('express-rate-limit');

/**
 * Rate Limiting Middleware
 * Protects API from abuse and DDoS attacks
 */

// General API rate limiter - 100 requests per 15 minutes
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: {
        success: false,
        message: 'Too many requests from this IP, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Strict rate limiter for authentication - 5 requests per 15 minutes
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: {
        success: false,
        message: 'Too many login attempts from this IP, please try again after 15 minutes.'
    },
    skipSuccessfulRequests: true,
});

// Token creation limiter - 10 per 15 minutes
const tokenCreationLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: {
        success: false,
        message: 'Too many token creation requests. Please wait before creating more tokens.'
    },
});

// Public endpoints limiter - 200 per 15 minutes
const publicLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    message: {
        success: false,
        message: 'Too many requests. Please try again later.'
    },
});

module.exports = {
    apiLimiter,
    authLimiter,
    tokenCreationLimiter,
    publicLimiter
};