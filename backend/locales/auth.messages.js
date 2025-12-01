module.exports = {
  auth: {
    // Succès
    registerSuccess: 'Inscription réussie.',
    loginSuccess: 'Connexion réussie.',
    adminCreatedSuccess: 'Administrateur créé avec succès.',
    superAdminCreatedSuccess: 'Super administrateur créé avec succès.',
    
    // Erreurs
    emailAlreadyExists: 'Cet email est déjà utilisé.',
    phoneAlreadyExists: 'Ce numéro de téléphone est déjà utilisé.',
    invalidCredentials: 'Identifiants incorrects.',
    registerError: 'Erreur lors de l\'inscription.',
    loginError: 'Erreur lors de la connexion.',
    createAdminError: 'Erreur lors de la création de l\'administrateur.',
    profileError: 'Erreur lors de la récupération du profil.',
    
    // Validation
    firstnameRequired: 'Le prénom ne peut pas être vide',
    lastnameRequired: 'Le nom ne peut pas être vide',
    emailInvalid: 'Email invalide',
    phoneInvalid: 'Numéro de téléphone invalide',
    passwordMinLength: 'Le mot de passe doit contenir au moins 6 caractères',
    passwordUppercase: 'Le mot de passe doit contenir au moins une majuscule',
    passwordLowercase: 'Le mot de passe doit contenir au moins une minuscule',
    passwordNumber: 'Le mot de passe doit contenir au moins un chiffre',
    roleInvalid: 'Rôle invalide',
    identifierRequired: 'Email ou téléphone requis',
    passwordRequired: 'Mot de passe requis',
    
    // Middlewares
    tokenMissing: 'Accès refusé. Token manquant.',
    tokenInvalid: 'Token invalide ou expiré.',
    adminRequired: 'Accès refusé. Droits administrateur requis.',
    superAdminRequired: 'Accès refusé. Droits super administrateur requis.',
    
    // Autres
    userNotFound: 'Utilisateur non trouvé.',
    
    // Console logs
    logRegisterError: 'Erreur lors de l\'inscription:',
    logCreateAdminError: 'Erreur lors de la création de l\'admin:',
    logLoginError: 'Erreur lors de la connexion:',
    logProfileError: 'Erreur lors de la récupération du profil:'
  }
};
