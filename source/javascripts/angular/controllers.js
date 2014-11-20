angular.module('myApp').controller('movieInfoCtrl', ['$rootScope', '$scope', '$http', 'dataFactory', function($rootScope, $scope, $http, dataFactory) {
    $scope.data = {
        title: "Inception",
        genre: 'Action, Drama',
        revenue: 500,
        profit: 300,
        rt_rating: 93,
        imdb_rating: 9.4,
        release_date: 'May 7th, 2011',
        runtime: 132,
        country: 'U.S.A',
        language: 'English',
        image_url: 'http://intra.burltwpsch.org/Copy%20of%20users/dyeager/Web%20Design/Web%20Page%20Creation%20Class/2010-2011/S2/WPC12/thumbnail%20table/Inception-movie-poster.jpg'
    }
}]);

angular.module('myApp').controller('graphCtrl', ['$scope', '$http', function($scope, $http) {
    // $scope.data = {};
    $http.get('data/films.json').
    success(function(data, status, headers, config) {
        $scope.data = data;
        $scope.data.nodes = $scope.data.nodes.map(function(node){
            node.connections = 0;
            return node;
        })
        $scope.data.links = $scope.data.links.map(function(link){
            $scope.data.nodes[link.source].connections++;
            $scope.data.nodes[link.target].connections++;
            return {
                source: $scope.data.nodes[link.source],
                target: $scope.data.nodes[link.target]
            }
        });
        // console.log($scope.data.nodes);
    }).
    error(function(data, status, headers, config) {
        // log error
    });

    $scope.cb = function(name){
        console.log(name);
        return name;
    }
}]);

angular.module('myApp').controller('treeMapCtrl', ['$rootScope', '$scope', '$http', 'dataFactory', function($rootScope, $scope, $http, dataFactory) {
    var updateData = function() {
        var movies_data = $rootScope.movies_db({
            actor_names: {
                has: dataFactory.actorName
            }
        }).get();

        movies_data = movies_data.map(function(movie){
            return {
                value: movie.production_cost,
                genre: movie.genre[0],
                name: movie.title,
                revenue: movie.domestic_revenue
            }
        });
        console.log('yup', movies_data);
        $scope.data = movies_data;
    };

    dataFactory.promise.then(function(data) {
        $scope.$watch(function() {
            return dataFactory.actorName;
        }, function(n, o) {
            // console.log(dataFactory.actorName);
            updateData();
        })
        $scope.$watch(function() {
            return dataFactory.options.productionRevenue;
        }, function(n, o) {
            console.log(dataFactory.options.productionRevenue);
            updateData();
        });
    }, function(error) {

    });
}]);

angular.module('myApp').controller('menuCtrl', ['$rootScope', '$scope', '$http', 'dataFactory', '$timeout', function($rootScope, $scope, $http, dataFactory, $timeout) {
    $scope.actor_director = 'actor';
    $scope.critique_genre = dataFactory.options.genreCritique;
    $scope.production_revenue = 'production';
    $scope.$watch('critique_genre', function(value) {
           dataFactory.options.genreCritique = value;
    });
    $scope.$watch('production_revenue', function(value) {
           dataFactory.options.productionRevenue = value;
    });
    $timeout(function(){
        // $('.ui.radio.checkbox').checkbox();
    });
    dataFactory.promise.then(function(){
        var actorNames = _.uniq(_.flatten($rootScope.movies_db().select('actor_names')));
        var directorNames = _.uniq($rootScope.movies_db().select('director'));
        // console.log(actorNames);
        var actors = new Bloodhound({
          datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
          queryTokenizer: Bloodhound.tokenizers.whitespace,
          // `states` is an array of state names defined in "The Basics"
          local: $.map(actorNames, function(actor) { return { value: actor }; })
        });
         
        var directors = new Bloodhound({
          datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
          queryTokenizer: Bloodhound.tokenizers.whitespace,
          // `states` is an array of state names defined in "The Basics"
          local: $.map(directorNames, function(director) { return { value: director }; })
        });
        // kicks off the loading/processing of `local` and `prefetch`
        actors.initialize();
        directors.initialize();
         
        $('.typeahead').typeahead({
          hint: true,
          highlight: true,
          minLength: 1
        },
        {
          name: 'actors',
          displayKey: 'value',
          // `ttAdapter` wraps the suggestion engine in an adapter that
          // is compatible with the typeahead jQuery plugin
          source: actors.ttAdapter(),
          templates: {
              header: '<h3 class="heading">Actors</h3>'
            }
        },
        {
          name: 'directors',
          displayKey: 'value',
          // `ttAdapter` wraps the suggestion engine in an adapter that
          // is compatible with the typeahead jQuery plugin
          source: directors.ttAdapter(),
          templates: {
              header: '<h3 class="heading">Directors</h3>'
            }
        }).bind("typeahead:selected", function(obj, datum, name) {
            if(name === 'actors'){
                dataFactory.setActorName(datum.value);
                // console.log('1', datum.value);
            }
            // console.log(obj, datum, name);
        });
    }, function(error){});
    // $('.ui.radio.checkbox').checkbox();
}]);

angular.module('myApp')
    .controller('productionRevenueCtrl', ['dataFactory', '$rootScope', '$scope', '$http', '$timeout', function(dataFactory, $rootScope, $scope, $http, $timeout) {
        
        var updateData = function() {
            $scope.production_revenue = dataFactory.options.productionRevenue;
            var movies_data = $rootScope.movies_db({
                actor_names: {
                    has: dataFactory.actorName
                }
            }).get();

            movies_data = movies_data.map(function(movie){
                return {
                    value: function(){
                        if($scope.production_revenue === 'revenue')
                            return (+movie.domestic_revenue) + (+movie.foreign_revenue);
                        return +movie.production_cost;
                    }(),
                    genre: movie.genre[0],
                    name: movie.title,
                    group: 'Production Cost'
                }
            });
            console.log(movies_data);
            /*if(!$scope.$$phase){
                $scope.$apply(function(){
                    $scope.data = movies_data;
                });
            }*/
            $timeout(function() {
              // anything you want can go here and will safely be run on the next digest.
              // $scope.$apply(function(){
                $scope.data = movies_data;
              // });
            })
        };

        dataFactory.promise.then(function(data) {
            /*$scope.$watch(function() {
                return dataFactory.actorName;
            }, function(n, o) {
                console.log('yup', dataFactory.actorName);
                updateData();
            });*/
            // updateData();
            $scope.$on('actor:updated', function(event,data) {
             // you could inspect the data to see if what you care about changed, or just update your own scope
             updateData();
            });
            $scope.$watch(function() {
                return dataFactory.options.productionRevenue;
            }, function(n, o) {
                console.log(dataFactory.options.productionRevenue);
                updateData();
            });
        }, function(error) {

        });

        /*$timeout(function() {
            dataFactory.setActorName("Sam Worthington");
        }, 3500);*/
    }])
    .controller('genreCritiqueCtrl', ['dataFactory', '$rootScope', '$scope', '$http', '$timeout', function(dataFactory, $rootScope, $scope, $http, $timeout) {
        $scope.genre_critique = dataFactory.options.genreCritique;

        var format = d3.time.format("%m/%d/%Y");
        $scope.options = {
            chart: {
                type: 'lineChart',
                height: 450,
                margin: {
                    top: 20,
                    right: 40,
                    bottom: 40,
                    left: 55
                },
                x: function(d) {
                    return d.x;
                },
                y: function(d) {
                    return d.y;
                },
                yDomain: [0, 100],
                // useInteractiveGuideline: true,
                dispatch: {
                    stateChange: function(e) {
                        // console.log("stateChange");
                    },
                    changeState: function(e) {
                        // console.log("changeState");
                    },
                    tooltipShow: function(e) {
                        // console.log("tooltipShow");
                    },
                    tooltipHide: function(e) {
                        // console.log("tooltipHide");
                    }
                },
                xAxis: {
                    axisLabel: 'Release Date',
                    tickFormat: function(d) {
                        return format(new Date(d)); // returns a string
                        // return d3.format('.0f')(d.x);
                    },
                },
                yAxis: {
                    axisLabel: 'Rating',
                    tickFormat: function(d) {
                        return d3.format('.0f')(d);
                    },
                    axisLabelDistance: 30
                },
                callback: function(chart) {
                    console.log("!!! lineChart callback !!!");
                },
                tooltipContent: function(key, x, y, e, graph) { //return html content
                    // console.log(e.point.movie);
                    return '<h3>' + e.point.title + '</h3>' +
                        '<p>Rated ' + y + '% - Released on ' + format(new Date(x)) + '</p>'
                }
            }
        };

        var updateData = function() {
            $scope.genre_critique = dataFactory.options.genreCritique;
            var movies_data = $rootScope.movies_db({
                actor_names: {
                    has: dataFactory.actorName
                }
            }).get();
            // _.sortBy(movies_data, function(o) { return o.release_date; })
            // console.log(movies_data);
            if($scope.genre_critique == 'genre'){
                var movies_d = d3.nest().key(function(d) {
                    return d.genre[0];
                })
                .rollup(function(d) {
                    return d.length;
                }).entries(movies_data);
                movies_d = movies_d.map(function(movie){
                    return {
                        genre: movie.key,
                        value: movie.values
                    }
                });
                $scope.data2 = movies_d;
            }
            else{
                var movies_d = movies_data.map(function(movie){
                    return {
                        x: movie.release_date,
                        y: movie.critic_rating,
                        title: movie.title
                    }
                });
                console.log(movies_d);
                // $scope.$apply(function(){
                $scope.data = [{
                    key: 'Rating',
                    color: '#ff7f0e',
                    values: movies_d
                }];
            }
        };

        dataFactory.promise.then(function(data) {
            $scope.$watch(function() {
                return dataFactory.actorName;
            }, function(n, o) {
                // console.log(dataFactory.actorName);
                updateData();
            });
            $scope.$watch(function() {
                return dataFactory.options.genreCritique;
            }, function(n, o) {
                console.log(dataFactory.options.genreCritique);
                updateData();
            });
        }, function(error) {

        });

        /*$timeout(function() {
            dataFactory.setActorName("Sam Worthington");
        }, 3500);*/
    }])
    .controller('scatterChartCtrl', ['dataFactory', '$rootScope', '$scope', '$http', '$timeout', function(dataFactory, $rootScope, $scope, $http, $timeout)  {

        /*$scope.options = {
            chart: {
                type: 'scatterChart',
                height: 450,
                color: d3.scale.category10().range(),
                scatter: {
                    onlyCircles: false
                },
                showDistX: true,
                showDistY: true,
                tooltipContent: function(key) {
                    return '<h3>' + key + '</h3>';
                },
                transitionDuration: 350,
                xAxis: {
                    axisLabel: 'X Axis',
                    tickFormat: function(d) {
                        return d3.format('.02f')(d);
                    }
                },
                yAxis: {
                    axisLabel: 'Y Axis',
                    tickFormat: function(d) {
                        return d3.format('.02f')(d);
                    },
                    axisLabelDistance: 30
                }
            }
        };*/

        // $scope.data = generateData(1, 40);

        /* Random Data Generator (took from nvd3.org) */
        /*function generateData(groups, points) {
            var data = [],
                shapes = ['circle'],
                random = d3.random.normal();

            for (var i = 0; i < groups; i++) {
                data.push({
                    key: 'Group ' + i,
                    values: []
                });

                for (var j = 0; j < points; j++) {
                    data[i].values.push({
                        x: random(),
                        y: random(),
                        size: Math.random(),
                        shape: shapes[j % 6]
                    });
                }
            }
            return data;
        }*/
        var updateData = function() {
            $scope.production_revenue = dataFactory.options.productionRevenue;
            var movies_data = $rootScope.movies_db({
                actor_names: {
                    has: dataFactory.actorName
                }
            }).get();

            movies_data = movies_data.map(function(movie){
                return {
                    production: movie.production_cost,
                    revenue: (movie.domestic_revenue + movie.foreign_revenue),
                    genre: movie.genre[0],
                    title: movie.title,
                    critique: movie.critic_rating
                }
            });
            // console.log(movies_data);
            /*if(!$scope.$$phase){
                $scope.$apply(function(){
                    $scope.data = movies_data;
                });
            }*/
            // $timeout(function() {
              // anything you want can go here and will safely be run on the next digest.
              // $scope.$apply(function(){
                $scope.data = movies_data;
              // });
            // });
        };

        dataFactory.promise.then(function(data) {
            /*$scope.$watch(function() {
                return dataFactory.actorName;
            }, function(n, o) {
                console.log('yup', dataFactory.actorName);
                updateData();
            });*/
            // updateData();
            $scope.$on('actor:updated', function(event,data) {
             // you could inspect the data to see if what you care about changed, or just update your own scope
             updateData();
            });
            $scope.$watch(function() {
                return dataFactory.options.productionRevenue;
            }, function(n, o) {
                console.log(dataFactory.options.productionRevenue);
                updateData();
            });
        }, function(error) {

        });
    }])
    .controller('pieChartCtrl', ['$scope', function($scope) {

        $scope.options = {
            chart: {
                type: 'pieChart',
                height: 350,
                x: function(d) {
                    return d.key;
                },
                y: function(d) {
                    return d.y;
                },
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

        $scope.data = [{
            key: "Drama",
            y: 5
        }, {
            key: "Biography",
            y: 2
        }, {
            key: "Action",
            y: 9
        }, {
            key: "Thriller",
            y: 7
        }, {
            key: "Horror",
            y: 4
        }, {
            key: "Romance",
            y: 3
        }, {
            key: "Crime",
            y: .5
        }];
    }])
    .controller('treeCtl', function($scope, $http) {
        $scope.formatName = function(name) {
            return name;
        };
        $scope.onDetail = function(node) {
            console.log(node);
        };

        $http.get('data/flare_with_color.json').success(function(data) {
            $scope.tree = data;
        });
        $scope.tree = {}
    })
    .controller('lineChartCtrl', ['$rootScope', '$scope', 'dataFactory', function($rootScope, $scope, dataFactory) {
        var format = d3.time.format("%Y-%m-%d");
        $scope.options = {
            chart: {
                type: 'lineChart',
                height: 350,
                margin: {
                    top: 20,
                    right: 40,
                    bottom: 40,
                    left: 55
                },
                x: function(d) {
                    return d.x;
                },
                y: function(d) {
                    return d.y;
                },
                yDomain: [0, 100],
                // useInteractiveGuideline: true,
                dispatch: {
                    stateChange: function(e) {
                        // console.log("stateChange");
                    },
                    changeState: function(e) {
                        // console.log("changeState");
                    },
                    tooltipShow: function(e) {
                        // console.log("tooltipShow");
                    },
                    tooltipHide: function(e) {
                        // console.log("tooltipHide");
                    }
                },
                xAxis: {
                    axisLabel: 'Release Date',
                    tickFormat: function(d) {
                        return format(new Date(d)); // returns a string
                        // return d3.format('.0f')(d.x);
                    },
                },
                yAxis: {
                    axisLabel: 'Rating',
                    tickFormat: function(d) {
                        return d3.format('.0f')(d);
                    },
                    axisLabelDistance: 30
                },
                callback: function(chart) {
                    console.log("!!! lineChart callback !!!");
                },
                tooltipContent: function(key, x, y, e, graph) { //return html content
                    // console.log(e.point.movie);
                    return '<h3>' + e.point.title + '</h3>' +
                        '<p>Rated ' + y + '% - Released on ' + format(new Date(x)) + '</p>'
                }
            }
        };

        var updateData = function() {
            var movies_data = $rootScope.movies_db({
                actor_names: {
                    has: dataFactory.actorName
                }
            }).order('release_date').get();
            console.log(movies_data);
            movies_d = movies_data.map(function(movie){
                return {
                    x: new Date(movie.release_date),
                    y: movie.critic_rating,
                    title: movie.title
                }
            });
            // console.log(movies_d);
            // $scope.$apply(function(){
            $scope.data = [{
                key: 'Rating',
                color: '#ff7f0e',
                values: movies_d
            }];
        };

        dataFactory.promise.then(function(data) {
            $scope.$watch(function() {
                return dataFactory.actorName;
            }, function(n, o) {
                // console.log(dataFactory.actorName);
                updateData();
            })
        }, function(error) {

        });
    }])
    .controller('multiBarChartCtrl', ['dataFactory', '$rootScope', '$scope', function(dataFactory, $rootScope, $scope) {

        $scope.options = {
            chart: {
                type: 'multiBarChart',
                height: 450,
                margin: {
                    top: 20,
                    right: 40,
                    bottom: 40,
                    left: 80
                },
                x: function(d) {
                    return d[0];
                },
                y: function(d) {
                    return d[1];
                },
                stacked: true,
                yAxis: {
                    axisLabel: 'Revenue',
                    tickFormat: function(d) {
                        // console.log(d);
                        var prefix = d3.formatPrefix(d);
                        if(d >= 1000000000){
                            return d3.format('.2f')(prefix.scale(d)) + 'B';
                        }
                        return d3.format('.2f')(prefix.scale(d)) + prefix.symbol;
                    }
                }/*,
                tooltipContent: function(type, x, y, e, graph) { //return html content
                    // console.log(e.point.movie);
                    console.log(arguments);
                }*/
            }
        };

        var updateData = function() {
            var movies_data = $rootScope.movies_db({
                actor_names: {
                    has: dataFactory.actorName
                }
            }).order('release_date').get();
            // console.log(movies_data);
            var domestic = movies_data.map(function(movie){
                return  [movie.title, movie.domestic_revenue]
            });
             var foreign = movies_data.map(function(movie){
                return  [movie.title, movie.foreign_revenue]
            });
            // console.log(movies_d);
            // $scope.$apply(function(){
            $scope.data = [{
                "key": "Domestic",
                "values": domestic
            },{
                "key": "International",
                "values": foreign
            }];
        };

        dataFactory.promise.then(function(data) {
            $scope.$watch(function() {
                return dataFactory.actorName;
            }, function(n, o) {
                // console.log(dataFactory.actorName);
                updateData();
            })
        }, function(error) {

        });
    }]);