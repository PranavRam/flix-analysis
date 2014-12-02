angular.module('myApp').factory('dataFactory', ['$rootScope', '$http', function($rootScope, $http) {
    var me = this;
    factory = {
      options: {
        genreCritique: 'genre',
        productionRevenue: 'production'
      },
      actorName: ["Steven Spielberg"],
      directorName: "Steven Spielberg",
      setActorName: function(name){
        this.actorName = name;
        $rootScope.$broadcast('actor:updated',data);
      },
      setGenreCritique: function(name){
        this.options.genreCritique = name;
        $rootScope.$broadcast('genre_critique:updated',data);
      },
    };

    var promise = $http.get('data/movies.json').
        success(function(data, status, headers, config) {
          data = data.map(function(movie){
            // movie.release_date = new Date(movie.release_date);
            movie.release_date = moment(movie.release_date, "MM/DD/YYYY").toDate();
            return movie;
          });
          data.sort(function(a,b){
            // Turn your strings into dates, and then subtract them
            // to get a value that is either negative, positive, or zero.
            return a.release_date - b.release_date;
          });
          $rootScope.movies_db = TAFFY(data);

          movies_db = $rootScope.movies_db;
          factory.results = $rootScope.movies_db([{
                actor_names: {
                    has: factory.actorName
                }
            }, {
                director: factory.actorName
            }]).get();
        }).
        error(function(data, status, headers, config) {
          // log error
        });
    factory.promise = promise;

    return factory;
}]);