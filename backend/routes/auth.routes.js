const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { verifyToken, isAdmin, isSuperAdmin } = require('../middleware/auth.middleware');
const validate = require('../middleware/validation.middleware');
const { auth } = require('../locales');

// Validation rules pour l'inscription
const registerValidation = [
  body('firstname').optional().trim().notEmpty().withMessage(auth.firstnameRequired),
  body('lastname').optional().trim().notEmpty().withMessage(auth.lastnameRequired),
  body('email').optional().isEmail().withMessage(auth.emailInvalid),
  body('phone').optional().matches(/^[0-9+\s()-]+$/).withMessage(auth.phoneInvalid),
  body('password')
    .isLength({ min: 6 }).withMessage(auth.passwordMinLength)
    .matches(/[A-Z]/).withMessage(auth.passwordUppercase)
    .matches(/[a-z]/).withMessage(auth.passwordLowercase)
    .matches(/[0-9]/).withMessage(auth.passwordNumber)
];

// Validation rules pour la connexion
const loginValidation = [
  body('identifier').notEmpty().withMessage(auth.identifierRequired),
  body('password').notEmpty().withMessage(auth.passwordRequired)
];

// Routes publiques
router.post('/register', registerValidation, validate, authController.register);
router.post('/login', loginValidation, validate, authController.login);

// Routes protégées (nécessitent un token)
router.get('/profile', verifyToken, authController.getProfile);

// Routes admin et superadmin (pour créer des admins)
router.post('/create-admin', verifyToken, isSuperAdmin, registerValidation, validate, authController.createAdmin);

// Export the router to be used in server.js
module.exports = router;