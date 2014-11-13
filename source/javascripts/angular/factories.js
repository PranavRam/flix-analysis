angular.module('myApp').factory('dataFactory', ['$rootScope', '$http', function($rootScope, $http) {
    var promise = $http.get('data/movies.json').
        success(function(data, status, headers, config) {
          data = data.map(function(movie){
            movie.release_date = new Date(movie.release_date);
            return movie;
          })
          $rootScope.movies_db = TAFFY(data);

          movies_db = $rootScope.movies_db;
        }).
        error(function(data, status, headers, config) {
          // log error
        });

    return {
        options: {
          genreCritique: 'genre',
          productionRevenue: 'revenue'
        },
        actorName: "Leonardo DiCaprio",
        directorName: "Steven Spielberg",
        setActorName: function(name){
          this.actorName = name;
          $rootScope.$broadcast('actor:updated',data);
        },
        setGenreCritique: function(name){
          this.options.genreCritique = name;
          $rootScope.$broadcast('genre_critique:updated',data);
        },
        promise: promise
    };
}]);