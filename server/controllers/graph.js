'use strict';

var route = require('koa-route'),
    parse = require('co-body'),
    R = require('ramda'),
    dataService = require('../services/data-service'),
    U = require('../services/utils');

// ROUTES

exports.init = function (app) {
  app.use(route.get('/api/graph/balance', getBalanceGraphData));

  app.use(route.get('/api/graph/total/incoming', getIncomingTotalData));
  app.use(route.get('/api/graph/total/outgoing', getOutgoingTotalData));
  
  app.use(route.get('/api/graph/time/incoming', getIncomingTimeData));
  app.use(route.get('/api/graph/time/outgoing', getOutgoingTimeData));
};

// ROUTE FUNCTIONS

// [{"key":"Total","values":[["1401231600000",1335.78],["1401145200000",2569.12]]},
//  {"key":"AMEX","values":[["1401231600000",1335.78]}]
function *getBalanceGraphData() {
  var data = yield dataService.getData();

  // transform
  var keys = R.concat(['Total'], R.keys(U.groupByBank(data)));
  var values = R.concat([data], R.values(U.groupByBank(data)));
  this.body = U.keyValueWrapper(keys, U.applyFnToEachInArray(U.cumulativeAmountsByDate, values));
}

// [{"key":"Work","y":8773.2},{"key":"Clothes in","y":40}]
function *getIncomingTotalData() {
  var data = yield dataService.getData();

  // filter
  data = U.whereAmountGreaterThanZero(data);

  // transform
  this.body = U.keyValueWrapper(['Total'], [U.cumulativeAmountsByDate(data)]);
}
// [{"key":"Eating out","y":3174.16},{"key":"Tech","y":1283.81}]
function *getOutgoingTotalData() {
  var data = yield dataService.getData();

  // filter
  data = U.whereAmountLessThanZero(data);

  // transform
  this.body = U.keyValueWrapper(['Total'], [U.cumulativeAmountsByDate(data)]);
}

// [{"key":"Total","values":[["1401231600000",1335.78],["1401145200000",1233.34]]},
//  {"key":"AMEX","values":[["1401231600000",1335.78]}]
function *getIncomingTimeData() {
  var data = yield dataService.getData();

  // filter
  data = U.whereAmountGreaterThanZero(data);

  // transform
  var keys = R.concat(['Total'], R.keys(U.groupByBank(data)));
  var values = R.concat([data], R.values(U.groupByBank(data)));
  this.body = U.keyValueWrapper(keys, U.applyFnToEachInArray(U.sumAmountsByDate, values));
}
// [{"key":"Total","values":[["1401231600000",1335.78],["1401145200000",1233.34]]},
//  {"key":"AMEX","values":[["1401231600000",1335.78]]}]
function *getOutgoingTimeData() {
  var data = yield dataService.getData();

  // filter and invert
  data = R.compose(U.invertAmounts, U.whereAmountLessThanZero)(data);
  console.log(U.test(data));
  // transform
  var keys = R.concat(['Total'], R.keys(U.groupByBank(data)));
  var values = R.concat([data], R.values(U.groupByBank(data)));
  this.body = U.keyValueWrapper(keys, U.applyFnToEachInArray(U.sumAmountsByDate, values));
}