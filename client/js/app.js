angular
  .module('app', [
    'ui.router',
    'app.dash',
    'app.upload'
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
            templateUrl: 'js/dash/balanceGraph/balanceGraph.html',
            controller: 'BalanceGraphCtrl'
          },
          'totalGraph@app': { 
            templateUrl: 'js/dash/totalGraph/totalGraph.html',
            controller: 'TotalGraphCtrl'
          },
          'timeGraph@app': { 
            templateUrl: 'js/dash/timeGraph/timeGraph.html',
            controller: 'TimeGraphCtrl'
          }
        }
      });

    $urlRouterProvider.otherwise('/');
    $locationProvider.html5Mode(true);
  });