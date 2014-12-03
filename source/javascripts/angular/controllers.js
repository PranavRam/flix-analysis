angular.module('myApp').controller('macroCtrl', ['$rootScope', '$scope', '$http', 'dataFactory', function($rootScope, $scope, $http, dataFactory) {
    $scope.onLoad = function() {
        $('.macro.menu .item').tab({
            // tabs are inside of this element
            context: $('#macro-view'),
            history: false
        });
    }
}]);

angular.module('myApp').controller('microCtrl', ['$rootScope', '$scope', '$http', 'dataFactory', function($rootScope, $scope, $http, dataFactory) {
    $scope.onLoad = function() {
        $('.micro.menu .item').tab({
            // tabs are inside of this element
            context: $('#micro-view'),
            history: false,
            onTabLoad: function(tabPath, parameterArray, historyEvent) {
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

    $scope.min = 0;
    $scope.max = 100;

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
        // $scope.selectedCelebrities = [];
    $scope.updateCelebrities = function(data) {
        console.log($scope.selectedCelebrities);
        var names = $scope.selectedCelebrities.map(function(item) {
            return item.name;
        });
        dataFactory.updateCelebrityList(names);
    }
    dataFactory.promise.then(function() {
        var actorNames = _.uniq(_.flatten($rootScope.movies_db().limit(100).select('actor_names')));
        var genreNames = _.uniq(_.flatten($rootScope.movies_db().select('genre')));
        var directorNames = _.uniq($rootScope.movies_db().limit(100).select('director'));

        $scope.genres = genreNames.map(function(genre){
            return {
                name: genre,
                ticked: true
            }
        });
        var celebrities = [];
        celebrities.push({
            name: '<strong>Actors</strong>',
            multiSelectGroup: true
        });
        angular.forEach(actorNames, function(value) {
            celebrities.push({
                name: value,
                ticked: function() {
                    return value == dataFactory.actorName[0]
                }()
            });
        });
        celebrities.push({
            multiSelectGroup: false
        });
        celebrities.push({
            name: '<strong>Directors</strong>',
            multiSelectGroup: true
        });
        angular.forEach(directorNames, function(value) {
            celebrities.push({
                name: value,
                ticked: function() {
                    return value == dataFactory.actorName[0]
                }()
            });
        });
        celebrities.push({
            multiSelectGroup: false
        });
        $scope.celebrities = celebrities;
        // console.log($scope.celebrities);
        // console.log(actorNames);
        /*var actors = new Bloodhound({
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
        });*/
        // kicks off the loading/processing of `local` and `prefetch`
        /*actors.initialize();
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
        });*/
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
                /**/
            var movies_data = dataFactory.results
            var celebrities = dataFactory.actorName;
            var result = [];
            angular.forEach(celebrities, function(celeb) {
                var data = $rootScope.movies_db([{
                    actor_names: {
                        has: celeb
                    }
                }, {
                    director: celeb
                }]).get();
                result.push(data);
            });
            var movies_d = [];
            angular.forEach(result, function(celebMovieList, i) {
                var data = d3.nest().key(function(d) {
                        return d.genre[0];
                    })
                    .rollup(function(d) {
                        return d.length;
                    }).entries(celebMovieList);
                data.name = celebrities[i];
                data = data.map(function(dat) {
                    return {
                        name: celebrities[i],
                        genre: dat.key,
                        value: dat.values
                    };

                });
                movies_d.push(data);
            });
            /**/
            movies_d = _.flatten(movies_d);
            // console.log(movies_d);
            /*var movies_d = d3.nest().key(function(d) {
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
            });*/
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
                type: 'lineWithFocusChart',
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
                x2Axis: {
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
                    }
                },
                yAxis: {
                    axisLabel: 'Rating',
                    tickFormat: function(d) {
                        return d3.format('.0f')(d);
                    }
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
            var celebrities = dataFactory.actorName;
            var result = [];
            angular.forEach(celebrities, function(celeb) {
                var data = $rootScope.movies_db([{
                    actor_names: {
                        has: celeb
                    }
                }, {
                    director: celeb
                }]).get();
                result.push(data);
            });
            var movies_d = [];
            angular.forEach(result, function(celebMovieList, i) {
                var data = celebMovieList.map(function(movie) {
                    return {
                        x: movie.release_date,
                        y: movie.critic_rating,
                        title: movie.title
                    }
                });
                movies_d.push({
                    key: celebrities[i],
                    color: d3plus.color.random(i),
                    values: data
                });
            });
            // console.log(movies_d);
            /*var movies_d = movies_data.map(function(movie) {
                return {
                    x: movie.release_date,
                    y: movie.critic_rating,
                    title: movie.title
                }
            });*/
            // console.log(movies_d);
            // $scope.$apply(function(){
            $timeout(function() {
                $scope.data = movies_d;
            });

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
                    "Public Rating": movie.public_rating,
                    "Critic Rating": movie.critic_rating
                }
            });
            // WHY?
            // console.log('twice');
            $timeout(function() {
                $scope.data = movies_data;
            });
        };

        dataFactory.promise.then(function(data) {
            // updateData();
            $scope.$on('actor:updated', function(event, data) {
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
                },
                xAxis: {
                    staggerLabels: true
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
    }])
    .controller('parallelCtrl', ['dataFactory', '$rootScope', '$scope', function(dataFactory, $rootScope, $scope) {
        var updateData = function() {
            /*var movies_data = dataFactory.results;
            // console.log(movies_data);
            $scope.data = [];*/
            // };

            // d3.csv('data/cars.csv', function(data) {
            // $scope.data = data;
            var movies_data = $rootScope.movies_db().limit(79).map(function(record, recordNum) {
                    return {
                        // release_date: record.release_date,
                        production_cost: record.production_cost,
                        domestic_revenue: record.domestic_revenue,
                        public_rating: record.public_rating,
                        critic_rating: record.critic_rating,
                        director: record.director,
                        runtime: record.runtime,
                        actor: record.actor_names[0],
                        genre: record.genre[0],
                        title: record.title
                    }
                })
                // "title", "production_cost", "domestic_cost", "foreign_revenue", "public_rating", "critic_rating", "runtime", "director");
                // console.log('MOVIES', movies_data);
                // var dimensions = ['director', 'title', 'runtime'];
            $scope.data = movies_data;
            var blue_to_brown = d3.scale.linear()
                .domain([0, 200000000])
                .range(["red", "green"])
                .interpolate(d3.interpolateLab);

            var color = function(d) {
                return blue_to_brown(d['domestic_revenue']);
            };

            // console.log($el[0]);
            var parcoords = d3.parcoords()('#parcoords');
            // function update() {
            if (typeof $scope.data != 'undefined') {
                // console.log($el);
                parcoords
                // .dimensions(dimensions)
                    .color(color)
                    .alpha(0.4)
                    .data($scope.data)
                    /*.height(600)
                    .width(960)*/
                    .render()
                    .shadows()
                    .reorderable()
                    .on('brushend', function(data) {
                        console.log(data);
                    })
                    .brushMode("1D-axes"); // enable brushing
            }
            // }
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