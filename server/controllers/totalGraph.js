'use strict';

var route = require('koa-route'),
    parse = require('co-body'),
    _ = require('lodash'),
    dataService = require('../services/data-service'),
    utils = require('../services/utils-service');

// ROUTES

exports.init = function (app) {
  app.use(route.get('/api/graph/total/incoming', dataIncoming));
  app.use(route.get('/api/graph/total/outgoing', dataOutgoing));
};

// ROUTE FUNCTIONS

function *dataOutgoing() {
  // get data
  var data = yield dataService.getData();

  // transform entries and categories
  this.body = dataTransform(data, data);
}

function *dataIncoming() {
  // get data
  var data = yield dataService.getData();

  // transform entries and categories
  this.body = dataTransform(data, data);
}

// FUNCTIONS

function dataTransform(entries, categories) {
  // group amounts for each category
  var amountsByCategory = {};
  var undefinedCategory = false;
  _.each(entries, function(entry, i) {
    var amount = entry.amount;

    // add to an array with category as index
    var index = _.findIndex(categories, function(category){
      return category._id.toString() == entry.categoryId;
    });
    if (index == -1) undefinedCategory = true;
    var current = amountsByCategory[index] || 0;
    amountsByCategory[index] = current + amount;
  });

  // put totals in a 'y' var with category as 'key'
  var data = _.map(categories, function(category, i) {
    return{
      "key": category.description,
      "y": amountsByCategory[i] || 0
    };
  });

  // create undefined category if any entries with invalid category
  if (undefinedCategory) data.push({
    "key": 'Undefined',
    "y": amountsByCategory[-1]
  });

  // console.log('total = ');
  // console.log(data);
  return data;
}