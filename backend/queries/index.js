// Fichier centralisé pour importer toutes les requêtes SQL
const userQueries = require('./user.queries');
const productQueries = require('./product.queries');
const cartQueries = require('./cart.queries');
const orderQueries = require('./order.queries');

module.exports = {
  user: userQueries,
  product: productQueries,
  cart: cartQueries,
  order: orderQueries
};
