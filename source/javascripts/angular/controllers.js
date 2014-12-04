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
    // $rootScope.currentTab = 'general';
    $scope.onLoad = function() {
        $('.micro.menu .item').tab({
            // tabs are inside of this element
            context: $('#micro-view'),
            history: false,
            onTabLoad: function(tabPath, parameterArray, historyEvent) {
                $rootScope.$broadcast('microtab:change', tabPath);
                // console.log($rootScope.currentTab);
            }
        });
    }
}]);

angular.module('myApp').controller('movieInfoCtrl', ['$rootScope', '$scope', '$http', 'dataFactory', function($rootScope, $scope, $http, dataFactory) {
    $scope.data = [];

    $scope.movies = [];
    dataFactory.promise.then(function(data) {
        $scope.movies = dataFactory.results;
        $scope.data = $scope.movies[0];
        // console.log($scope.movies[0]);
        $scope.$watch(function() {
            return dataFactory.results;
        }, function(n, o) {
            // console.log(dataFactory.actorName);
            // updateData();
            $scope.movies = dataFactory.results;
        })
    }, function(error) {

    });

    $scope.selectMovie = function(movie) {
        $scope.data = movie;
        dataFactory.selectMovie([movie.title]);
        // console.log(movie);
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
        var actorNames = _.uniq(_.flatten($rootScope.movies_db().limit(200).select('actor_names')));
        // var genreNames = _.uniq(_.flatten($rootScope.movies_db().select('genre')));
        var genreNames = _.uniq(_.flatten(_.pluck(dataFactory.results, 'genre')));
        var directorNames = _.uniq($rootScope.movies_db().limit(200).select('director'));
        var movies = dataFactory.results;
        movies = movies.map(function(movie){
            return {
                name: movie.title,
                ticked: true
            };
        });
        // console.log(movies);
        $scope.movies = movies;
        $scope.genres = genreNames.map(function(genre) {
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
                    // console.log("!!! lineChart callback !!!");
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
                    celebrity: function(){
                        if (_.intersection(dataFactory.actorName, movie.actor_names).length > 0){
                            // console.log(_.intersection(dataFactory.actorName, movie.actor_names));
                            return _.intersection(dataFactory.actorName, movie.actor_names)[0];
                        }
                        // else if(dataFactory.actorName.indexOf(movie.director) > -1){
                            return movie.director;
                        // }
                    }(),
                    "Public Rating": movie.public_rating,
                    "Critic Rating": movie.critic_rating
                }
            });
            // WHY?
            // console.log('twice');
            $timeout(function() {
                $scope.data = movies_data;
                console.log(movies_data);
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
    .controller('multiBarChartCtrl', ['dataFactory', '$rootScope', '$scope', '$timeout', function(dataFactory, $rootScope, $scope, $timeout) {

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
                },
                barColor: function(d, i) {
                        var colors = d3.scale.category20().range();
                        var rnd = Math.floor(Math.random() * colors.length)
                        return colors[rnd];
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
            $timeout(function(){
                $scope.data = [{
                    "key": "Domestic",
                    "values": domestic
                }, {
                    "key": "International",
                    "values": foreign
                }];
            });
            // console.log('New', $scope.data);
        };

        dataFactory.promise.then(function(data) {
            updateData();
            $scope.$on('actor:updated', function(event, data) {
                // you could inspect the data to see if what you care about changed, or just update your own scope
                updateData();
            });
            $scope.$on('selected_movie:updated', function(event, data) {
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
            /*var movies_data = $rootScope.movies_db().limit(79).map(function(record, recordNum) {
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
                });*/
            var movies_data = dataFactory.results.map(function(record, recordNum) {
                return {
                    release_date: record.release_date,
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
            });
            // "title", "production_cost", "domestic_cost", "foreign_revenue", "public_rating", "critic_rating", "runtime", "director");
            // console.log('MOVIES', movies_data);
            // var dimensions = ['director', 'title', 'runtime'];
            $scope.data = movies_data;
            var zcolorscale = d3.scale.linear()
                .domain([-2, -0.5, 0.5, 2])
                .range(["red", "green"])
                .interpolate(d3.interpolateLab);

            /*var color = function(d) {
                return zcolorscale(d['critic_rating']);
            };*/

            // console.log($el[0]);
            $('#parcoords').html('');
            parcoords = d3.parcoords()('#parcoords');
            // function update() {
            if (typeof $scope.data != 'undefined') {
                // console.log($el);
                parcoords
                // .dimensions(dimensions)
                // .color(color)
                    .alpha(0.4)
                    .data($scope.data)
                    /*.height(600)
                    .width(960)*/
                    .render()
                    .shadows()
                    .reorderable()
                    .on('brushend', function(data) {
                        var movie_titles = data.map(function(movie){
                            return movie.title;
                        });
                        // console.log(movie_titles);
                        dataFactory.setMovies(movie_titles);
                    })
                    .brushMode("1D-axes"); // enable brushing
            }
            change_color("domestic_revenue");
            parcoords.svg.selectAll(".dimension")
                .on("click", change_color)
                .selectAll(".label")
                .style("font-size", "14px");

            function change_color(dimension) {
                // console.log(dimension);
                parcoords.svg.selectAll(".dimension .label")
                    .style("font-weight", "normal")
                    .filter(function(d) {
                        return d == dimension;
                    })
                    .style("font-weight", "bold");
                // console.log(zcolor(parcoords.data(),dimension));
                if (dimension == "title" || dimension == "actor" || dimension == "director" || dimension == "genre") {
                    parcoords.color(function(d) {
                        return d3plus.color.random(d[dimension]);
                    }).render();
                    return;
                }
                parcoords.color(zcolor(parcoords.data(), dimension)).render()
            }

            // return color function based on plot and dimension
            function zcolor(col, dimension) {
                var z = zscore(_(col).pluck(dimension).map(parseFloat));
                // console.log(z);
                return function(d) {
                    return zcolorscale(z(d[dimension]))
                }
            };

            // color by zscore
            function zscore(col) {
                // console.log(col);
                var n = col.length,
                    mean = _(col).mean(),
                    sigma = _(col).stdDeviation();
                return function(d) {
                    return (d - mean) / sigma;
                };
            };
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