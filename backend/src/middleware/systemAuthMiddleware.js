const systemAuth = (req, res, next) => {
    const systemKey = req.headers['x-system-key'];
    const configuredKey = process.env.SYSTEM_SECRET || 'default-system-secret-please-change';

    if (!systemKey || systemKey !== configuredKey) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized system access'
        });
    }

    next();
};

module.exports = systemAuth;
