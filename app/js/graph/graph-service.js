angular.module('app.graph').factory('GraphService', function($http) {
  return {
    getBalanceGraphData: function() {
      return $http.get('/api/graph/balance');
    },
    
    getIncomingTotalData: function() {
      return $http.get('/api/graph/total/incoming');
    },
    getOutgoingTotalData: function() {
      return $http.get('/api/graph/total/outgoing');
    },

    getIncomingTimeData: function() {
      return $http.get('/api/graph/time/incoming');
    },
    getOutgoingTimeData: function() {
      return $http.get('/api/graph/time/outgoing');
    }
  };
});