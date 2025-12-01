// Fichier centralisé pour importer tous les messages
const authMessages = require('./auth.messages');
const userMessages = require('./user.messages');
const productMessages = require('./product.messages');
const cartMessages = require('./cart.messages');
const orderMessages = require('./order.messages');
const commonMessages = require('./common.messages');

module.exports = {
  ...authMessages,
  ...userMessages,
  ...productMessages,
  ...cartMessages,
  ...orderMessages,
  ...commonMessages
};
