'use strict';

var _ = require('lodash'),
    moment = require('moment'),
    R = require('ramda');

// EXPORTS

module.exports.transformRaw = transformRaw;

module.exports.keyValueWrapper = keyValueWrapper;

module.exports.sortByFirst = sortByFirst;

module.exports.sortByDate = sortByDate;
module.exports.groupByDate = groupByDate;

module.exports.sumAmounts = sumAmounts;
module.exports.sumAmountsByDate = sumAmountsByDate;
module.exports.cumulativeAmountsByDate = cumulativeAmountsByDate;

module.exports.test = test;

// PRIVATE UTILS

var addProp = R.curry(function(prop, a, b) { return R.add(a, b[prop]); });

var diffByProp = R.curry(function(prop, a, b) { return R.subtract(a[prop], b[prop]); });
var diffByPropDesc = R.curry(function(prop, a, b) { return diffByProp(prop, b, a); });

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

var objToArray = function(data) { return sortByFirst(R.toPairs(data)); };

var sortBy = R.curry(function(prop, data) { return R.sort(diffByProp(prop), data); });
var groupBy = R.curry(function(prop, data) { return R.groupBy(R.prop(prop), data); });
var sumOf = R.curry(function(prop, data) { return R.reduce(addProp(prop), 0, data); });

var sumAmountsForEachProp = applyFnToEachProp(sumAmounts);

// EXPORTED UTILS

function sortByFirst(data) { return sortBy(0, data); }

function sortByDate(data) { return sortBy('date', data); }
function groupByDate(data) { return groupBy('date', data); }

function sumAmounts(data) { return sumOf('amount', data); }
function sumAmountsByDate(data) { return objToArray(sumAmountsForEachProp(groupByDate(data))); }
function cumulativeAmountsByDate(data) { return accumulateIndex(1, sumAmountsByDate(data)); }

function keyValueWrapper(key, value) { return [{"key": key, "values": value}]; }



function test(data) { 

  return totalsOverTime(data);
}

// [{"key":"Total","values":[["1401231600000",1335.78],["1401145200000",2569.12]]}]
var cumulativeTotalsOverTime = function(data) { return  keyValueWrapper('Total', cumulativeAmountsByDate(data)); };

// [{"key":"Total","values":[["1401231600000",1335.78],["1401145200000",1233.34]]}]
var totalsOverTime = function(data) { return  keyValueWrapper('Total', objToArray(sumAmountsByDate(data))); };

// EXPORTED TRANSFORM

function transformRaw(data) {
  return {
    createdTime: moment().toDate(),
    bank: 'AMEX',
    date: moment(data[0], 'DD/MM/YYYY').toDate().getTime(),
    description: data[3].replace(/\s{2,}/g, ' '),
    amount: parseFloat(data[2])
  };
}