angular.module('myApp').factory('dataFactory', ['$rootScope', '$http', function($rootScope, $http) {
    var promise = $http.get('data/movies.json').
        success(function(data, status, headers, config) {
          $rootScope.movies_db = TAFFY(data);
        }).
        error(function(data, status, headers, config) {
          // log error
        });

    return {
        actorName: "Leonardo DiCaprio",
        setActorName: function(name){
          this.actorName = name;
        },
        promise: promise
    };
}]);