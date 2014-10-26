'use strict';

var route = require('koa-route'),
    parse = require('co-body'),
    _ = require('lodash'),
    fs = require('fs'),
    csv = require('fast-csv'),
    moment = require('moment'),
    dataService = require('../services/data-service');

// ROUTES

exports.init = function (app) {
  app.use(route.put('/api/upload/:filename', uploadCsv));
  app.use(route.post('/api/upload', clearData));
};

// ROUTE FUNCTIONS

function *uploadCsv(filename) {
  // parse csv and remove headers
  var data = yield parseCsv(filename);

  // add parsed data
  yield dataService.createData(data);
  console.log(data.length + ' records added');
  
  // return
  this.status = 200;
}

function *clearData() {
  yield dataService.deleteData();
  
  // return
  this.status = 200;
}

// FUNCTIONS

function parseCsv(filename) {
  return function(callback) {
    // get test file
    var stream = fs.createReadStream(filename+".csv");
    var data = [];
    csv
      .fromStream(stream)
      .on("record", function(newData){

        // transform data
        data.push(transform(newData));
      })
      .on("end", function(){
        callback(/* error: */ null, data);
     });
  };
}

function transform(data) {
  return {
    createdTime: moment().toDate(),
    bank: 'AMEX',
    date: moment(data[0], 'DD/MM/YYYY').toDate().getTime(),
    description: data[3].replace(/\s{2,}/g, ' '),
    amount: parseFloat(data[2])
  };
}