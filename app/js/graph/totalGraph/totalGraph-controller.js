angular.module('app.graph').controller('TotalGraphCtrl', function($scope, GraphService){

  // DATA
  
  GraphService.getIncomingTotalData().success(function(data) {
    $scope.incomingData = data;
  });
  GraphService.getOutgoingTotalData().success(function(data) {
    $scope.outgoingData = data;
  });

  $scope.options = {
    chart: {
      type: 'pieChart',
      height: 300,
      x: function(d){return d.key;},
      y: function(d){return d.y;},
      showLabels: true,
      transitionDuration: 500,
      labelThreshold: 0.01,
      legend: {
        margin: {
          top: 5,
          right: 35,
          bottom: 5,
          left: 0
        }
      }
    }
  };
});