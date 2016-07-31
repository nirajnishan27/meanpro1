'use strict';

/**
 * Module dependencies
 */
var coustmersPolicy = require('../policies/coustmers.server.policy'),
  coustmers = require('../controllers/coustmers.server.controller');

module.exports = function(app) {
  // Coustmers Routes
  app.route('/api/coustmers').all(coustmersPolicy.isAllowed)
    .get(coustmers.list)
    .post(coustmers.create);

  app.route('/api/coustmers/:coustmerId').all(coustmersPolicy.isAllowed)
    .get(coustmers.read)
    .put(coustmers.update)
    .delete(coustmers.delete);

  // Finish by binding the Coustmer middleware
  app.param('coustmerId', coustmers.coustmerByID);
};
