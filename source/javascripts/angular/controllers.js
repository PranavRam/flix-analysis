angular.module('myApp').controller('graphCtrl', ['$scope', '$http', function($scope, $http) {
    // $scope.data = {};
    $http.get('data/films.json').
    success(function(data, status, headers, config) {
        $scope.data = data;
    }).
    error(function(data, status, headers, config) {
        // log error
    });
}]);

angular.module('myApp')
    .controller('discreteBarChartCtrl', ['dataFactory', '$rootScope', '$scope', '$http', '$timeout', function(dataFactory, $rootScope, $scope, $http, $timeout) {
        /*$http.defaults.headers.common = {
            'X-Parse-Application-Id': 'Tuu2ar77cy4IyW2rzVFNtkuEOxlAkn0VgsWSk8GJ',
            'X-Parse-REST-API-Key': '7BUWQMhlhwDBL2OxzKczo4sLXyQwaQizz3qNGjNe'
        }
        var request = $http({
            method: "get",
            url: "https://api.parse.com/1/classes/Movie",
            params: {
                include: ['actors', 'actors.movies']
            }
        });

        request.then(function(response) {
            console.log(response.data);

        }, function(error) {
            console.log(error)
        });*/

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

        /*$scope.data = [{
            key: "Cumulative Return",
            values: [{
                "label": "Drama",
                "value": 50
            }, {
                "label": "Documentary",
                "value": 0
            }, {
                "label": "Comedy",
                "value": 0
            }, {
                "label": "Romance",
                "value": 0
            }, {
                "label": "Crime",
                "value": 0
            }, {
                "label": "Thriller",
                "value": 0
            }, {
                "label": "Horror",
                "value": 0
            }, {
                "label": "Action",
                "value": 30
            }]
        }];*/

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
            console.log(movies_d);
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
    .controller('lineChartCtrl', function($scope) {
        var format = d3.time.format("%Y-%m-%d");
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
                        console.log("stateChange");
                    },
                    changeState: function(e) {
                        console.log("changeState");
                    },
                    tooltipShow: function(e) {
                        console.log("tooltipShow");
                    },
                    tooltipHide: function(e) {
                        console.log("tooltipHide");
                    }
                },
                xAxis: {
                    axisLabel: 'Time (Release Date)',
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
                    return '<h3>' + e.point.movie + '</h3>' +
                        '<p>Rated ' + y + '% - Released on ' + format(new Date(x)) + '</p>'
                }
            }
            /*,
                            title: {
                                enable: true,
                                text: 'Title for Line Chart'
                            },
                            subtitle: {
                                enable: true,
                                text: 'Subtitle for simple line chart. Lorem ipsum dolor sit amet, at eam blandit sadipscing, vim adhuc sanctus disputando ex, cu usu affert alienum urbanitas.',
                                css: {
                                    'text-align': 'center',
                                    'margin': '10px 13px 0px 7px'
                                }
                            },
                            caption: {
                                enable: true,
                                html: '<b>Figure 1.</b> Lorem ipsum dolor sit amet, at eam blandit sadipscing, <span style="text-decoration: underline;">vim adhuc sanctus disputando ex</span>, cu usu affert alienum urbanitas. <i>Cum in purto erat, mea ne nominavi persecuti reformidans.</i> Docendi blandit abhorreant ea has, minim tantas alterum pro eu. <span style="color: darkred;">Exerci graeci ad vix, elit tacimates ea duo</span>. Id mel eruditi fuisset. Stet vidit patrioque in pro, eum ex veri verterem abhorreant, id unum oportere intellegam nec<sup>[1, <a href="https://github.com/krispo/angular-nvd3" target="_blank">2</a>, 3]</sup>.',
                                css: {
                                    'text-align': 'justify',
                                    'margin': '10px 13px 0px 7px'
                                }
                            }*/
        };
        var movies = [
            "What's Eating Gilbert Grape",
            "The Departed",
            "The Aviator",
            "Catch Me If You Can",
            "Titanic",
            "Critters 3",
            "Celebrity",
            "The Beach",
            "The Basketball Diaries",
            "The Man in the Iron Mask"
        ];
        // movies.reverse();
        $scope.data = [{
            values: [89, 92, 87, 87, 88, 70, 90, 87, 80].map(
                function(value, i) {
                    // console.log(new Date(2007 + i, 0, 1));
                    return {
                        x: new Date(2007 + i, 0, 1),
                        y: value,
                        movie: movies[i]
                    }
                }),
            key: 'Rating',
            color: '#ff7f0e'
        }];
    })
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