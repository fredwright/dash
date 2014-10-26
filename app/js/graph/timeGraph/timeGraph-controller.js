angular.module('app.graph').controller('TimeGraphCtrl', function($scope, GraphService){

  // DATA

  GraphService.getIncomingTimeData().success(function(data) {
    $scope.incomingData = data;
  });
  GraphService.getOutgoingTimeData().success(function(data) {
    $scope.outgoingData = data;
  });
    
  $scope.options = {
    chart: {
      type: 'stackedAreaChart',
      height: 250,
      margin : {
        top: 20,
        right: 20,
        bottom: 60,
        left: 40
      },
      x: function(d){return d[0];},
      y: function(d){return d[1];},
      useVoronoi: false,
      clipEdge: true,
      transitionDuration: 500,
      useInteractiveGuideline: true,
      xAxis: {
        showMaxMin: false,
        tickFormat: function(d) {
          return d3.time.format('%x')(new Date(d));
        }
      },
      yAxis: {
        tickFormat: function(d){
          return d3.format(',.2f')(d);
        }
      }
    }
  };
});