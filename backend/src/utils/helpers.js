// Generate a random 6-digit code for organisations
const generateRandomCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Validate email format
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate password strength
const isStrongPassword = (password) => {
  // At least 8 characters, one uppercase, one lowercase, one number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

// Sanitize user input
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .trim()
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/[<>]/g, ''); // Remove angle brackets
};

// Format error response
const formatErrorResponse = (message, errors = null) => {
  return {
    success: false,
    message,
    errors
  };
};

// Format success response
const formatSuccessResponse = (message, data = null) => {
  return {
    success: true,
    message,
    data
  };
};

module.exports = {
  generateRandomCode,
  isValidEmail,
  isStrongPassword,
  sanitizeInput,
  formatErrorResponse,
  formatSuccessResponse
};