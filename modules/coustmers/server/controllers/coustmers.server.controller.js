'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Coustmer = mongoose.model('Coustmer'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Coustmer
 */
exports.create = function(req, res) {
  var coustmer = new Coustmer(req.body);
  coustmer.user = req.user;

  coustmer.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(coustmer);
    }
  });
};

/**
 * Show the current Coustmer
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var coustmer = req.coustmer ? req.coustmer.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  coustmer.isCurrentUserOwner = req.user && coustmer.user && coustmer.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(coustmer);
};

/**
 * Update a Coustmer
 */
exports.update = function(req, res) {
  var coustmer = req.coustmer ;

  coustmer = _.extend(coustmer , req.body);

  coustmer.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(coustmer);
    }
  });
};

/**
 * Delete an Coustmer
 */
exports.delete = function(req, res) {
  var coustmer = req.coustmer ;

  coustmer.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(coustmer);
    }
  });
};

/**
 * List of Coustmers
 */
exports.list = function(req, res) { 
  Coustmer.find().sort('-created').populate('user', 'displayName').exec(function(err, coustmers) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(coustmers);
    }
  });
};

/**
 * Coustmer middleware
 */
exports.coustmerByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Coustmer is invalid'
    });
  }

  Coustmer.findById(id).populate('user', 'displayName').exec(function (err, coustmer) {
    if (err) {
      return next(err);
    } else if (!coustmer) {
      return res.status(404).send({
        message: 'No Coustmer with that identifier has been found'
      });
    }
    req.coustmer = coustmer;
    next();
  });
};
