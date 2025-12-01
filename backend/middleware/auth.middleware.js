const jwt = require('jsonwebtoken');
const { auth } = require('../locales');

// Middleware pour vérifier le token JWT
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: auth.tokenMissing 
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Ajoute les infos utilisateur à la requête
    next();
  } catch (error) {
    return res.status(403).json({ 
      success: false, 
      message: auth.tokenInvalid 
    });
  }
};

// Middleware pour vérifier si l'utilisateur est admin ou superadmin
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
    return res.status(403).json({ 
      success: false, 
      message: auth.adminRequired 
    });
  }
  next();
};

// Middleware pour vérifier si l'utilisateur est superadmin
const isSuperAdmin = (req, res, next) => {
  if (req.user.role !== 'superadmin') {
    return res.status(403).json({ 
      success: false, 
      message: auth.superAdminRequired 
    });
  }
  next();
};

module.exports = { verifyToken, isAdmin, isSuperAdmin };
