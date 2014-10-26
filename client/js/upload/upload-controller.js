angular.module('app.upload').controller('UploadCtrl', function($scope, UploadService){
  $scope.filename = '';
  
  $scope.upload = function() {
    UploadService.put($scope.filename);
  };
  $scope.clear = function() {
    UploadService.post();
  };
});