module.exports = {
  user: {
    // Succès
    userUpdatedSuccess: 'Utilisateur mis à jour avec succès.',
    userDeletedSuccess: 'Utilisateur supprimé avec succès.',
    usersRetrievedSuccess: 'Utilisateurs récupérés avec succès.',
    
    // Erreurs
    userNotFound: 'Utilisateur non trouvé.',
    retrieveUsersError: 'Erreur lors de la récupération des utilisateurs.',
    retrieveAdminsError: 'Erreur lors de la récupération des admins.',
    retrieveUserError: 'Erreur lors de la récupération de l\'utilisateur.',
    updateUserError: 'Erreur lors de la mise à jour de l\'utilisateur.',
    deleteUserError: 'Erreur lors de la suppression de l\'utilisateur.',
    
    // Permissions
    cannotModifyAdmin: 'Vous ne pouvez pas modifier un administrateur.',
    cannotDeleteSelf: 'Un super administrateur ne peut pas se supprimer lui-même.',
    cannotDeleteSuperAdmin: 'Un super administrateur ne peut pas supprimer un autre super administrateur.',
    onlySuperAdminCanDeleteAdmin: 'Seul un super administrateur peut supprimer un administrateur.',
    
    // Console logs
    logRetrieveUsersError: 'Erreur lors de la récupération des utilisateurs:',
    logRetrieveAdminsError: 'Erreur lors de la récupération des admins:',
    logRetrieveUserError: 'Erreur lors de la récupération de l\'utilisateur:',
    logUpdateError: 'Erreur lors de la mise à jour:',
    logDeleteError: 'Erreur lors de la suppression:'
  }
};
