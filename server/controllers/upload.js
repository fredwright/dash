'use strict';

var route = require('koa-route'),
    parse = require('co-body'),
    fs = require('fs'),
    csv = require('fast-csv'),
    dataService = require('../services/data-service'),
    utils = require('../services/utils-service');

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
    var stream = fs.createReadStream("csv/"+filename+".csv");
    var data = [];
    csv
      .fromStream(stream)
      .on("record", function(newData){

        // transform data
        data.push(utils.transformRaw(newData));
      })
      .on("end", function(){
        callback(/* error: */ null, data);
     });
  };
}