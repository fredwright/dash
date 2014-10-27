'use strict';

var moment = require('moment'),
    R = require('ramda');

// EXPORTS

module.exports.transformRaw = transformRaw;

module.exports.keyValueWrapper = keyValueWrapper;
module.exports.keyYWrapper = keyYWrapper;

module.exports.objToArray = objToArray;

module.exports.applyFnToEachInArray = applyFnToEachInArray;

module.exports.sortByFirst = sortByFirst;

module.exports.sortByDate = sortByDate;

module.exports.groupByDate = groupByDate;
module.exports.groupByBank = groupByBank;

module.exports.sumAmounts = sumAmounts;
module.exports.sumAmountsByDate = sumAmountsByDate;
module.exports.cumulativeAmountsByDate = cumulativeAmountsByDate;

module.exports.whereAmountGreaterThanZero = whereAmountGreaterThanZero;
module.exports.whereAmountLessThanZero = whereAmountLessThanZero;

module.exports.invertAmounts = invertAmounts;

module.exports.test = test;

// PRIVATE UTILS

var addProp = R.curry(function(prop, a, b) { return R.add(a, b[prop]); });

var diffByProp = R.curry(function(prop, a, b) { return R.subtract(a[prop], b[prop]); });
var diffByPropDesc = R.curry(function(prop, a, b) { return diffByProp(prop, b, a); });

var invertProp = R.curry(function(prop, a) {
  a[prop] = -a[prop];
  return a; 
});

var applyFnToEachProp = R.curry(function(fn, data) {
  return R.reduce(function(acc, key) {
    acc[key] = fn(data[key]);
    return acc;
  }, {}, R.keys(data));
});

var accumulateIndex = R.curry(function(index, data) {
  var acc = 0;
  return R.map(function(val) {
    acc = addProp(index, acc, val);
    val[index] = acc;
    return val;
  }, data);
});

var sortBy = R.curry(function(prop, data) { return R.sort(diffByProp(prop), data); });
var groupBy = R.curry(function(prop, data) { return R.groupBy(R.prop(prop), data); });
var sumOf = R.curry(function(prop, data) { return R.reduce(addProp(prop), 0, data); });

var sumAmountsForEachProp = applyFnToEachProp(sumAmounts);

var propGreaterThanZero = R.curry(function(prop, val, obj) { return obj[prop] > 0; });
var propLessThanZero = R.curry(function(prop, val, obj) { return obj[prop] < 0; });

var amountGreaterThanZero = propGreaterThanZero('amount');
var amountLessThanZero = propLessThanZero('amount');

var invertAmount = function(data) { return invertProp('amount', data); };

// EXPORTED UTILS

function keyValueWrapper(keys, values) { return R.map.idx(function(value, i) { return {"key": keys[i], "values": value}; }, values); }
function keyYWrapper(keys, values) { return R.map.idx(function(value, i) { return {"key": keys[i], "y": value}; }, values); }

function objToArray (data) { return sortByFirst(R.toPairs(data)); }

function applyFnToEachInArray(fn, data) {
  return R.map(function(obj) {
    return fn(obj);
  }, data);
}

function sortByFirst(data) { return sortBy(0, data); }

function sortByDate(data) { return sortBy('date', data); }
function groupByDate(data) { return groupBy('date', data); }
function groupByBank(data) { return groupBy('bank', data); }

function sumAmounts(data) { return sumOf('amount', data); }
function sumAmountsByDate(data) { return objToArray(sumAmountsForEachProp(groupByDate(data))); }
function cumulativeAmountsByDate(data) { return accumulateIndex(1, sumAmountsByDate(data)); }

function whereAmountGreaterThanZero(data) { return R.filter(R.where({id: amountGreaterThanZero}), data); }
function whereAmountLessThanZero(data) { return R.filter(R.where({id: amountLessThanZero}), data); }

function invertAmounts(data) { return applyFnToEachInArray(invertAmount, data); }


function test(data) {
  var val = groupByBank(data);
  var keys = R.concat(['Total'], R.keys(groupByBank(data)));
  var values = R.concat([data], R.values(groupByBank(data)));
  val = keyValueWrapper(keys, applyFnToEachInArray(cumulativeAmountsByDate, values));
  return val;
}

// EXPORTED TRANSFORM

function transformRaw(data) {
  return {
    createdTime: moment().toDate(),
    bank: 'HSBC',
    date: moment(data[0], 'DD/MM/YYYY').toDate().getTime(),
    description: data[1].replace(/\s{2,}/g, ' '),
    amount: parseFloat(data[2])*-1
  };
}