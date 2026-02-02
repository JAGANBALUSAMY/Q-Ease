const express = require('express');
const router = express.Router();
const { registerUser, loginUser, staffLogin, adminLogin, superAdminLogin } = require('../controllers/authController');
const { validateRegister, validateLogin, validateStaffLogin } = require('../middleware/validationMiddleware');

// Register a new user
router.post('/register', validateRegister, registerUser);

// Login user (general login)
router.post('/login', validateLogin, loginUser);

// Staff login
router.post('/staff-login', validateStaffLogin, staffLogin);

// Admin login
router.post('/admin-login', validateLogin, adminLogin);

// Super Admin login
router.post('/super-admin-login', validateLogin, superAdminLogin);

module.exports = router;