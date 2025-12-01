const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { verifyToken, isAdmin, isSuperAdmin } = require('../middleware/auth.middleware');

// Routes pour la gestion des utilisateurs (role: user)
// Accessibles aux admins et superadmins

// Récupérer tous les utilisateurs (role: user uniquement)
router.get('/', verifyToken, isAdmin, userController.getAllUsers);

// Récupérer un utilisateur par ID
router.get('/:id', verifyToken, isAdmin, userController.getUserById);

// Mettre à jour un utilisateur
router.put('/:id', verifyToken, isAdmin, userController.updateUser);

// Supprimer un utilisateur
router.delete('/:id', verifyToken, isAdmin, userController.deleteUser);

// Routes pour la gestion des admins
// Accessibles uniquement aux superadmins

// Récupérer tous les admins et superadmins
router.get('/admins/list', verifyToken, isSuperAdmin, userController.getAllAdmins);

// Export the router to be used in server.js
module.exports = router;