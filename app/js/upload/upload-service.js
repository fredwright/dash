angular.module('app.upload').factory('UploadService', function($http) {
  return {
    put: function(filename) {
      return $http.put('/api/upload/'+filename);
    },
    post: function() {
      return $http.post('/api/upload');
    }
  };
});