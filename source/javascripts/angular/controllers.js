angular.module('myApp').controller('graphCtrl', ['$scope', '$http', function($scope, $http) {
    // $scope.data = {};
    $http.get('data/films.json').
    success(function(data, status, headers, config) {
        $scope.data = data;
        $scope.data.links = $scope.data.links.map(function(links){
            return {
                source: $scope.data.nodes[links.source],
                target: $scope.data.nodes[links.target]
            }
        })
    }).
    error(function(data, status, headers, config) {
        // log error
    });
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
                value: +movie.production_cost,
                genre: movie.genre[0],
                name: movie.title,
                // group: 'Production Cost'
            }
        });
        $scope.data = movies_data;
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

angular.module('myApp').controller('menuCtrl', ['$rootScope', '$scope', '$http', 'dataFactory', function($rootScope, $scope, $http, dataFactory) {
    $scope.actor_director = 'actor';
    $scope.critique_genre = 'genre';
    $scope.production_revenue = 'production';
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
        });
    }, function(error){});
}]);

angular.module('myApp')
    .controller('productionRoleCtrl', ['dataFactory', '$rootScope', '$scope', '$http', '$timeout', function(dataFactory, $rootScope, $scope, $http, $timeout) {

        var updateData = function() {
            var movies_data = $rootScope.movies_db({
                actor_names: {
                    has: dataFactory.actorName
                }
            }).get();

            movies_data = movies_data.map(function(movie){
                return {
                    value: +movie.production_cost,
                    genre: movie.genre[0],
                    name: movie.title,
                    group: 'Production Cost'
                }
            });
            console.log(movies_data);
            $scope.data = movies_data;
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

        /*$timeout(function() {
            dataFactory.setActorName("Sam Worthington");
        }, 3500);*/
    }])
    .controller('discreteBarChartCtrl', ['dataFactory', '$rootScope', '$scope', '$http', '$timeout', function(dataFactory, $rootScope, $scope, $http, $timeout) {
        $scope.options = {
            chart: {
                type: 'discreteBarChart',
                height: 350,
                margin: {
                    top: 20,
                    right: 20,
                    bottom: 60,
                    left: 60
                },
                x: function(d) {
                    return d.key;
                },
                y: function(d) {
                    return d.values;
                },
                showValues: true,
                valueFormat: function(d) {
                    return d3.format('0d')(d);
                },
                transitionDuration: 500,
                xAxis: {
                    axisLabel: 'Genre'
                },
                yAxis: {
                    axisLabel: 'Number of Movies',
                    axisLabelDistance: 25
                }
            }
        };

        var updateData = function() {
            var movies_data = $rootScope.movies_db({
                actor_names: {
                    has: dataFactory.actorName
                }
            }).get();

            var movies_d = d3.nest().key(function(d) {
                return d.genre[0];
            }).rollup(function(d) {
                return d.length;
            }).entries(movies_data);
            // console.log(movies_d);
            // $scope.$apply(function(){
            $scope.data = [{
                key: 'Data',
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

        /*$timeout(function() {
            dataFactory.setActorName("Sam Worthington");
        }, 3500);*/
    }])
    .controller('scatterChartCtrl', function($scope) {

        $scope.options = {
            chart: {
                type: 'scatterChart',
                height: 350,
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
        };

        $scope.data = generateData(1, 40);

        /* Random Data Generator (took from nvd3.org) */
        function generateData(groups, points) {
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
        }
    })
    .controller('pieChartCtrl', function($scope) {

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
    })
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
            // console.log(movies_data);
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
    .controller('multiBarChartCtrl', function($scope) {

        $scope.options = {
            chart: {
                type: 'multiBarChart',
                height: 350,
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
                    axisLabel: 'Revenue (In Millions)',
                    tickFormat: function(d) {
                        return d3.format('.0f')(d);
                    }
                }
            }
        };

        $scope.data = [{
            "key": "Domestic",
            "values": [
                ["What's Eating Gilbert Grape", 40],
                ["The Departed", 300],
                ["Catch Me If You Can", 500],
                ["Titanic", 700],
                ["The Beach", 20],
                ["The Man in the Iron Mask", 80]
            ]
        }, {
            "key": "International",
            "values": [
                ["What's Eating Gilbert Grape", 10],
                ["The Departed", 600],
                ["Catch Me If You Can", 600],
                ["Titanic", 1000],
                ["The Beach", 5],
                ["The Man in the Iron Mask", 30]
            ]
        }];
    });