'use strict';

var route = require('koa-route'),
    parse = require('co-body'),
    _ = require('lodash'),
    dataService = require('../services/data-service'),
    utils = require('../services/utils-service');

// ROUTES

exports.init = function (app) {
  app.use(route.get('/api/graph/balance', getData));
};

// ROUTE FUNCTIONS

function *getData() {
  // get entries
  var entries = yield dataService.getData();

  // transform entries
  this.body = utils.dataTransform(entries);
}

// FUNCTIONS
