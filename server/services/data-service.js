'use strict';

var mongo = require('../config/mongo');

// EXPORTS

module.exports.getData = getData;
module.exports.createData = createData;
module.exports.deleteData = deleteData;

// EXPORTED FUNCTIONS

function *getData() {
  // get data
  var data = yield mongo.data.find().sort().toArray();
  data.forEach(function (dataPoint) {
    dataPoint.id = dataPoint._id;
    delete dataPoint._id;
  });

  return data;
}

function *createData(data) {
  return yield mongo.data.insert(data);
}

function *deleteData(data) {
  return yield mongo.data.remove({});
}