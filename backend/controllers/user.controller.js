const User = require('../models/user.model');
const { user } = require('../locales');
const queries = require('../queries').user;
const db = require('../../config/db');

// Récupérer tous les utilisateurs (role: user) - Admin et SuperAdmin
exports.getAllUsers = async (req, res) => {
  try {
    const [users] = await db.query(queries.findAllUsers, ['user']);

    res.json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    console.error(user.logRetrieveUsersError, error);
    res.status(500).json({ 
      success: false, 
      message: user.retrieveUsersError 
    });
  }
};

// Récupérer tous les admins - SuperAdmin uniquement
exports.getAllAdmins = async (req, res) => {
  try {
    const [admins] = await db.query(queries.findAllAdmins, ['admin', 'superadmin']);

    res.json({
      success: true,
      count: admins.length,
      admins
    });
  } catch (error) {
    console.error(user.logRetrieveAdminsError, error);
    res.status(500).json({ 
      success: false, 
      message: user.retrieveAdminsError 
    });
  }
};

// Récupérer un utilisateur par ID - Admin et SuperAdmin
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: user.userNotFound 
      });
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error(user.logRetrieveUserError, error);
    res.status(500).json({ 
      success: false, 
      message: user.retrieveUserError 
    });
  }
};

// Mettre à jour un utilisateur - Admin et SuperAdmin
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstname, lastname, email, phone } = req.body;

    // Vérifier que l'utilisateur existe
    const userToUpdate = await User.findById(id);
    if (!userToUpdate) {
      return res.status(404).json({ 
        success: false, 
        message: user.userNotFound 
      });
    }

    // Vérifier le rôle de l'utilisateur cible
    if (userToUpdate.role === 'admin' || userToUpdate.role === 'superadmin') {
      // Seul un superadmin peut modifier un admin ou superadmin
      if (req.user.role !== 'superadmin') {
        return res.status(403).json({ 
          success: false, 
          message: user.cannotModifyAdmin 
        });
      }
    }

    const updatedUser = await User.update(id, {
      firstname,
      lastname,
      email,
      phone
    });

    res.json({
      success: true,
      message: user.userUpdatedSuccess,
      user: updatedUser
    });
  } catch (error) {
    console.error(user.logUpdateError, error);
    res.status(500).json({ 
      success: false, 
      message: user.updateUserError 
    });
  }
};

// Supprimer un utilisateur - Admin et SuperAdmin
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Vérifier que l'utilisateur existe
    const userToDelete = await User.findById(id);
    if (!userToDelete) {
      return res.status(404).json({ 
        success: false, 
        message: user.userNotFound 
      });
    }

    // Protection: Un superadmin ne peut pas se supprimer lui-même
    if (userToDelete.role === 'superadmin' && req.user.id === parseInt(id)) {
      return res.status(403).json({ 
        success: false, 
        message: user.cannotDeleteSelf 
      });
    }

    // Protection: Un superadmin ne peut pas supprimer un autre superadmin
    if (userToDelete.role === 'superadmin' && req.user.role === 'superadmin') {
      return res.status(403).json({ 
        success: false, 
        message: user.cannotDeleteSuperAdmin 
      });
    }

    // Vérifier le rôle de l'utilisateur cible
    if (userToDelete.role === 'admin' || userToDelete.role === 'superadmin') {
      // Seul un superadmin peut supprimer un admin
      if (req.user.role !== 'superadmin') {
        return res.status(403).json({ 
          success: false, 
          message: user.onlySuperAdminCanDeleteAdmin 
        });
      }
    }

    await User.delete(id);

    res.json({
      success: true,
      message: user.userDeletedSuccess
    });
  } catch (error) {
    console.error(user.logDeleteError, error);
    res.status(500).json({ 
      success: false, 
      message: user.deleteUserError 
    });
  }
};
