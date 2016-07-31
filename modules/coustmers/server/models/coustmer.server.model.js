'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Coustmer Schema
 */
var CoustmerSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Coustmer name',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Coustmer', CoustmerSchema);
