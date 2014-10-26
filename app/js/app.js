angular
  .module('app', [
    'ui.router',
    'app.upload',
    'app.graph'
  ])

  .config(function($stateProvider, $urlRouterProvider, $locationProvider) {
 
    // next graph views
    $stateProvider
      .state('app', {
        url: '/',
        views: {
          '': { 
            templateUrl: 'js/app.html',
            controller: 'AppCtrl'
          },
          'upload@app': { 
            templateUrl: 'js/upload/upload.html',
            controller: 'UploadCtrl'
          },
          'balanceGraph@app': { 
            templateUrl: 'js/graph/balanceGraph/balanceGraph.html',
            controller: 'BalanceGraphCtrl'
          },
          'totalGraph@app': { 
            templateUrl: 'js/graph/totalGraph/totalGraph.html',
            controller: 'TotalGraphCtrl'
          },
          'timeGraph@app': { 
            templateUrl: 'js/graph/timeGraph/timeGraph.html',
            controller: 'TimeGraphCtrl'
          }
        }
      });

    $urlRouterProvider.otherwise('/');
    $locationProvider.html5Mode(true);
  });