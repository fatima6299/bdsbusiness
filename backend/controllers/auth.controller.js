const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const { auth } = require('../locales');

// Inscription d'un nouvel utilisateur (toujours avec role 'user')
exports.register = async (req, res) => {
  try {
    const { firstname, lastname, email, phone, password } = req.body;

    // Vérifier si l'email existe déjà
    if (email && await User.emailExists(email)) {
      return res.status(400).json({ 
        success: false, 
        message: auth.emailAlreadyExists 
      });
    }

    // Vérifier si le téléphone existe déjà
    if (phone && await User.phoneExists(phone)) {
      return res.status(400).json({ 
        success: false, 
        message: auth.phoneAlreadyExists 
      });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer l'utilisateur avec le rôle 'user' par défaut
    const userId = await User.create({
      firstname,
      lastname,
      email,
      phone,
      password: hashedPassword,
      role: 'user' // Toujours 'user' pour l'inscription publique
    });

    res.status(201).json({
      success: true,
      message: auth.registerSuccess,
      userId
    });
  } catch (error) {
    console.error(auth.logRegisterError, error);
    res.status(500).json({ 
      success: false, 
      message: auth.registerError 
    });
  }
};

// Créer un utilisateur admin (réservé aux admins uniquement)
exports.createAdmin = async (req, res) => {
  try {
    const { firstname, lastname, email, phone, password } = req.body;

    // Vérifier si l'email existe déjà
    if (email && await User.emailExists(email)) {
      return res.status(400).json({ 
        success: false, 
        message: auth.emailAlreadyExists 
      });
    }

    // Vérifier si le téléphone existe déjà
    if (phone && await User.phoneExists(phone)) {
      return res.status(400).json({ 
        success: false, 
        message: auth.phoneAlreadyExists 
      });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer l'utilisateur avec le rôle 'admin'
    const userId = await User.create({
      firstname,
      lastname,
      email,
      phone,
      password: hashedPassword,
      role: 'admin'
    });

    res.status(201).json({
      success: true,
      message: auth.adminCreatedSuccess,
      userId
    });
  } catch (error) {
    console.error(auth.logCreateAdminError, error);
    res.status(500).json({ 
      success: false, 
      message: auth.createAdminError 
    });
  }
};

// Connexion d'un utilisateur
exports.login = async (req, res) => {
  try {
    const { identifier, password } = req.body; // identifier = email ou phone

    // Chercher l'utilisateur par email ou téléphone
    let user;
    if (identifier.includes('@')) {
      user = await User.findByEmail(identifier);
    } else {
      user = await User.findByPhone(identifier);
    }

    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: auth.invalidCredentials 
      });
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false, 
        message: auth.invalidCredentials 
      });
    }

    // Générer le token JWT
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        role: user.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      success: true,
      message: auth.loginSuccess,
      token,
      user: {
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (error) {
    console.error(auth.logLoginError, error);
    res.status(500).json({ 
      success: false, 
      message: auth.loginError 
    });
  }
};

// Obtenir le profil de l'utilisateur connecté
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: auth.userNotFound 
      });
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error(auth.logProfileError, error);
    res.status(500).json({ 
      success: false, 
      message: auth.profileError 
    });
  }
};
