const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

/**
 * Request Logging Middleware
 * Logs all API requests for monitoring and debugging
 */

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}

// Create write stream for access logs
const accessLogStream = fs.createWriteStream(
    path.join(logsDir, 'access.log'),
    { flags: 'a' }
);

// Custom token for response time in ms
morgan.token('response-time-ms', (req, res) => {
    if (!req._startTime) return '-';
    const diff = process.hrtime(req._startTime);
    return (diff[0] * 1e3 + diff[1] * 1e-6).toFixed(2);
});

// Custom format for detailed logging
const detailedFormat = ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" :response-time-ms ms';

// Development logging (console)
const devLogger = morgan('dev');

// Production logging (file)
const prodLogger = morgan(detailedFormat, { stream: accessLogStream });

// Combined logger
const requestLogger = (req, res, next) => {
    // Add start time
    req._startTime = process.hrtime();

    // Log to console in development
    if (process.env.NODE_ENV !== 'production') {
        devLogger(req, res, () => { });
    }

    // Always log to file
    prodLogger(req, res, () => { });

    next();
};

// Error logger
const errorLogger = (err, req, res, next) => {
    const errorLog = {
        timestamp: new Date().toISOString(),
        method: req.method,
        url: req.url,
        error: err.message,
        stack: err.stack,
        user: req.user?.id || 'anonymous'
    };

    // Log to file
    fs.appendFileSync(
        path.join(logsDir, 'error.log'),
        JSON.stringify(errorLog) + '\n'
    );

    // Log to console in development
    if (process.env.NODE_ENV !== 'production') {
        console.error('Error:', errorLog);
    }

    next(err);
};

module.exports = {
    requestLogger,
    errorLogger
};
