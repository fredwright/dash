angular.module('app.graph').controller('BalanceGraphCtrl', function($scope, GraphService){

  // DATA

  GraphService.getBalanceGraphData().success(function(data) {
    $scope.data = data;
  });
    
  $scope.options = {
    chart: {
      type: 'lineChart',
      height: 200,
      margin : {
        top: 20,
        right: 20,
        bottom: 60,
        left: 65
      },
      x: function(d){ return d[0]; },
      y: function(d){ return d[1]; },
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