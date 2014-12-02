angular.module('myApp').controller('macroCtrl', ['$rootScope', '$scope', '$http', 'dataFactory', function($rootScope, $scope, $http, dataFactory) {
    $scope.onLoad = function() {
        $('.macro.menu .item').tab({
            // tabs are inside of this element
            context: $('#macro-view'),
            history : false
        });
    }
}]);

angular.module('myApp').controller('microCtrl', ['$rootScope', '$scope', '$http', 'dataFactory', function($rootScope, $scope, $http, dataFactory) {
    $scope.onLoad = function() {
        $('.micro.menu .item').tab({
            // tabs are inside of this element
            context: $('#micro-view'),
            history : false,
            onTabLoad: function(tabPath, parameterArray, historyEvent){
                $scope.currentTab = tabPath;
                // console.log($scope.currentTab);
            }
        });
    }
}]);

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
        /*$scope.data.nodes = $scope.data.nodes.map(function(node) {
            node.connections = 0;
            return node;
        })*/
        $scope.data.links = $scope.data.links.map(function(link) {
            // $scope.data.nodes[link.source].connections++;
            // $scope.data.nodes[link.target].connections++;
            return {
                source: $scope.data.nodes[link.source],
                target: $scope.data.nodes[link.target]
            }
        });
        // console.log($scope.data.links);
    }).
    error(function(data, status, headers, config) {
        // log error
    });

    $scope.cb = function(name) {
        console.log(name);
        return name;
    }
}]);

angular.module('myApp').controller('treeMapCtrl', ['$rootScope', '$scope', '$http', 'dataFactory', function($rootScope, $scope, $http, dataFactory) {
    var updateData = function() {
        var movies_data = dataFactory.results.map(function(movie) {
            return {
                value: movie.production_cost,
                genre: movie.genre[0],
                name: movie.title,
                revenue: movie.domestic_revenue
            }
        });
        // console.log('yup', movies_data);
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
        // console.log('hey there');
        dataFactory.options.genreCritique = value;
    });
    $scope.$watch('production_revenue', function(value) {
        dataFactory.options.productionRevenue = value;
    });
    $scope.onLoad = function() {
        $("#sticker").sticky({
            topSpacing: 10,
            getWidthFrom: '.fifteen.wide.column > .row'
        });
    }
    dataFactory.promise.then(function() {
        var actorNames = _.uniq(_.flatten($rootScope.movies_db().select('actor_names')));
        var directorNames = _.uniq($rootScope.movies_db().select('director'));
        // console.log(actorNames);
        var actors = new Bloodhound({
            datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            // `states` is an array of state names defined in "The Basics"
            local: $.map(actorNames, function(actor) {
                return {
                    value: actor
                };
            })
        });

        var directors = new Bloodhound({
            datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            // `states` is an array of state names defined in "The Basics"
            local: $.map(directorNames, function(director) {
                return {
                    value: director
                };
            })
        });
        // kicks off the loading/processing of `local` and `prefetch`
        actors.initialize();
        directors.initialize();

        $('.typeahead').typeahead({
            hint: true,
            highlight: true,
            minLength: 1
        }, {
            name: 'actors',
            displayKey: 'value',
            // `ttAdapter` wraps the suggestion engine in an adapter that
            // is compatible with the typeahead jQuery plugin
            source: actors.ttAdapter(),
            templates: {
                header: '<h3 class="heading">Actors</h3>'
            }
        }, {
            name: 'directors',
            displayKey: 'value',
            // `ttAdapter` wraps the suggestion engine in an adapter that
            // is compatible with the typeahead jQuery plugin
            source: directors.ttAdapter(),
            templates: {
                header: '<h3 class="heading">Directors</h3>'
            }
        }).bind("typeahead:selected", function(obj, datum, name) {
            if (name === 'actors') {
                dataFactory.updateCelebrityList(datum.value);
                // console.log('1', datum.value);
            }
            // console.log(obj, datum, name);
        });
    }, function(error) {});
    // $('.ui.radio.checkbox').checkbox();
}]);

angular.module('myApp')
    .controller('productionRevenueCtrl', ['dataFactory', '$rootScope', '$scope', '$http', '$timeout', function(dataFactory, $rootScope, $scope, $http, $timeout) {

        var updateData = function() {
            $scope.production_revenue = dataFactory.options.productionRevenue;
            var movies_data = dataFactory.results.map(function(movie) {
                return {
                    value: function() {
                        if ($scope.production_revenue === 'revenue')
                            return (movie.domestic_revenue) + (movie.foreign_revenue);
                        return movie.production_cost;
                    }(),
                    genre: movie.genre[0],
                    name: movie.title,
                    group: 'Production Cost'
                }
            });
            $scope.data = movies_data;
        };

        dataFactory.promise.then(function(data) {
            $scope.$on('actor:updated', function(event, data) {
                // you could inspect the data to see if what you care about changed, or just update your own scope
                updateData();
            });
            $scope.$watch(function() {
                return dataFactory.options.productionRevenue;
            }, function(n, o) {
                // console.log(dataFactory.options.productionRevenue);
                updateData();
            });
        }, function(error) {

        });
    }])
    .controller('diversityCtrl', ['dataFactory', '$rootScope', '$scope', '$http', '$timeout', function(dataFactory, $rootScope, $scope, $http, $timeout) {
        var updateData = function() {
            var movies_data = dataFactory.results
            var movies_d = d3.nest().key(function(d) {
                    return d.genre[0];
                })
                .rollup(function(d) {
                    return d.length;
                }).entries(movies_data);
            movies_d = movies_d.map(function(movie) {
                return {
                    genre: movie.key,
                    value: movie.values
                }
            });
            // console.log('pieeeeee', movies_d);
            $scope.data2 = movies_d;
        };

        dataFactory.promise.then(function(data) {
            updateData();
            $scope.$on('actor:updated', function(event, data) {
                // you could inspect the data to see if what you care about changed, or just update your own scope
                updateData();
            });
        }, function(error) {

        });
    }])
    .controller('ratingsTimeCtrl', ['dataFactory', '$rootScope', '$scope', '$http', '$timeout', function(dataFactory, $rootScope, $scope, $http, $timeout) {
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
            var movies_data = dataFactory.results
            // _.sortBy(movies_data, function(o) { return o.release_date; })
            // console.log(movies_data);
            var movies_d = movies_data.map(function(movie) {
                return {
                    x: movie.release_date,
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
            updateData();
            $scope.$on('actor:updated', function(event, data) {
                // you could inspect the data to see if what you care about changed, or just update your own scope
                updateData();
            });
        }, function(error) {

        });
    }])
    .controller('scatterChartCtrl', ['dataFactory', '$rootScope', '$scope', '$http', '$timeout', function(dataFactory, $rootScope, $scope, $http, $timeout) {
        var updateData = function() {
            $scope.production_revenue = dataFactory.options.productionRevenue;
            var movies_data = dataFactory.results.map(function(movie) {
                return {
                    production: movie.production_cost,
                    revenue: (movie.domestic_revenue + movie.foreign_revenue),
                    genre: movie.genre[0],
                    title: movie.title,
                    critique: movie.critic_rating
                }
            });
            // WHY?
            $timeout(function(){
                $scope.data = movies_data;
            });
        };

        dataFactory.promise.then(function(data) {
            updateData();
            $scope.$on('actor:updated', function(event, data) {
                // you could inspect the data to see if what you care about changed, or just update your own scope
                updateData();
            });
            /*$scope.$watch(function() {
                return dataFactory.options.productionRevenue;
            }, function(n, o) {
                // console.log(dataFactory.options.productionRevenue);
                updateData();
            });*/
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
                        if (d >= 1000000000) {
                            return d3.format('.2f')(prefix.scale(d)) + 'B';
                        }
                        return d3.format('.2f')(prefix.scale(d)) + prefix.symbol;
                    }
                }
                /*,
                                tooltipContent: function(type, x, y, e, graph) { //return html content
                                    // console.log(e.point.movie);
                                    console.log(arguments);
                                }*/
            }
        };

        var updateData = function() {
            var movies_data = dataFactory.results;
            // console.log(movies_data);
            var domestic = movies_data.map(function(movie) {
                return [movie.title, movie.domestic_revenue]
            });
            var foreign = movies_data.map(function(movie) {
                return [movie.title, movie.foreign_revenue]
            });
            // console.log(movies_d);
            // $scope.$apply(function(){
            $scope.data = [{
                "key": "Domestic",
                "values": domestic
            }, {
                "key": "International",
                "values": foreign
            }];
        };

        dataFactory.promise.then(function(data) {
            updateData();
            $scope.$on('actor:updated', function(event, data) {
                // you could inspect the data to see if what you care about changed, or just update your own scope
                updateData();
            });
        }, function(error) {

        });
    }]);