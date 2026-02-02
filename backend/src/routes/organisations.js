const express = require('express');
const router = express.Router();
const { optionalAuth, authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');
const { validateOrganization, validateSearch } = require('../middleware/validationMiddleware');
const {
  getAllOrganisations,
  getOrganisationById,
  getOrganisationByCode,
  searchOrganisations,
  createOrganisation,
  updateOrganisation,
  deleteOrganisation
} = require('../controllers/organisationController');

// Public routes (no auth required)
router.get('/', optionalAuth, validateSearch, getAllOrganisations);
router.get('/search', optionalAuth, validateSearch, searchOrganisations);
router.get('/code/:code', optionalAuth, getOrganisationByCode);
router.get('/:id', optionalAuth, getOrganisationById);

// Admin routes (require authentication and admin role)
router.post('/', authenticateToken, authorizeRoles(['ORGANISATION_ADMIN', 'SUPER_ADMIN']), validateOrganization, createOrganisation);
router.put('/:id', authenticateToken, authorizeRoles(['ORGANISATION_ADMIN', 'SUPER_ADMIN']), updateOrganisation);
router.delete('/:id', authenticateToken, authorizeRoles(['SUPER_ADMIN']), deleteOrganisation);

module.exports = router;