'use strict';

var route = require('koa-route'),
    parse = require('co-body'),
    dataService = require('../services/data-service'),
    utils = require('../services/utils-service');

// ROUTES

exports.init = function (app) {
  app.use(route.get('/api/graph/balance', getBalanceGraphData));

  app.use(route.get('/api/graph/total/outgoing', getIncomingTotalData));
  app.use(route.get('/api/graph/total/incoming', getOutgoingTotalData));
  
  app.use(route.get('/api/graph/time/incoming', getIncomingTimeData));
  app.use(route.get('/api/graph/time/outgoing', getOutgoingTimeData));
};

// ROUTE FUNCTIONS

// [{"key":"Total","values":[["1401231600000",1335.78],["1401145200000",1233.34]]},
//  {"key":"AMEX","values":[["1401231600000",1335.78],["1401145200000",1233.34]]}]
function *getBalanceGraphData() {
  var data = yield dataService.getData();
  this.body = utils.keyValueWrapper('Total', utils.cumulativeAmountsByDate(data));
}

function *getIncomingTotalData() {
  var data = yield dataService.getData();
  this.body = utils.keyValueWrapper('Total', utils.cumulativeAmountsByDate(data));
}
function *getOutgoingTotalData() {
  var data = yield dataService.getData();
  this.body = utils.keyValueWrapper('Total', utils.cumulativeAmountsByDate(data));
}

function *getIncomingTimeData() {
  var data = yield dataService.getData();
  this.body = utils.keyValueWrapper('Total', utils.cumulativeAmountsByDate(data));
}
function *getOutgoingTimeData() {
  var data = yield dataService.getData();
  this.body = utils.keyValueWrapper('Total', utils.cumulativeAmountsByDate(data));
}