//= require_tree .
//= require jquery
//= require angular/angular.js
//= require d3/d3.js
//= require nvd3/nv.d3.js
//= require angular-nvd3/dist/angular-nvd3.js
//= require semantic-ui

$(function() {
    $('.ui.sidebar').sidebar();
    $('.ui.button').on('click', function() {
        $('.ui.sidebar').sidebar('toggle');
    });
})

angular.module('myApp', ['nvd3'])
    .controller('myCtrl', function($scope) {
        $scope.options = {
            chart: {
                type: 'lineChart',
                height: 450,
                margin: {
                    top: 20,
                    right: 20,
                    bottom: 40,
                    left: 55
                },
                x: function(d) {
                    return d.x;
                },
                y: function(d) {
                    return d.y;
                },
                useInteractiveGuideline: true,
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
                    axisLabel: 'Time (ms)'
                },
                yAxis: {
                    axisLabel: 'Voltage (v)',
                    tickFormat: function(d) {
                        return d3.format('.02f')(d);
                    },
                    axisLabelDistance: 30
                },
                callback: function(chart) {
                    console.log("!!! lineChart callback !!!");
                }
            },
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
            }
        };

        $scope.data = sinAndCos();

        /*Random Data Generator */
        function sinAndCos() {
            var sin = [],
                sin2 = [],
                cos = [];

            //Data is represented as an array of {x,y} pairs.
            for (var i = 0; i < 100; i++) {
                sin.push({
                    x: i,
                    y: Math.sin(i / 10)
                });
                sin2.push({
                    x: i,
                    y: i % 10 == 5 ? null : Math.sin(i / 10) * 0.25 + 0.5
                });
                cos.push({
                    x: i,
                    y: .5 * Math.cos(i / 10 + 2) + Math.random() / 10
                });
            }

            //Line chart data should be sent as an array of series objects.
            return [{
                values: sin, //values - represents the array of {x,y} data points
                key: 'Sine Wave', //key  - the name of the series.
                color: '#ff7f0e' //color - optional: choose your own line color.
            }, {
                values: cos,
                key: 'Cosine Wave',
                color: '#2ca02c'
            }, {
                values: sin2,
                key: 'Another sine wave',
                color: '#7777ff',
                area: true //area - set to true if you want this line to turn into a filled area chart.
            }];
        };

    })
    .controller('discreteBarChartCtrl', function($scope) {

        $scope.options = {
            chart: {
                type: 'multiBarChart',
                height: 350,
                x: function(d) {
                    return d[0];
                },
                y: function(d) {
                    return d[1];
                },
                // stacked: true,
                xAxis: {
                    axisLabel: 'Ratings'
                },
                yAxis: {
                    axisLabel: 'Numer of Movies'
                }
            }
        };

        $scope.data = [{
            "key": "Inception",
            "values": [
                ['oscars', 250],
                ['w/o oscars', 100]
            ]
        }, {
            "key": "Psycho",
            "values": [
                ['oscars', 250],
                ['w/o oscars', 200]
            ]
        }, {
            "key": "Eight Below",
            "values": [
                ['oscars', 300],
                ['w/o oscars', 100]
            ]
        }];
    })
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

        $scope.data = generateData(4, 40);

        /* Random Data Generator (took from nvd3.org) */
        function generateData(groups, points) {
            var data = [],
                shapes = ['circle', 'cross', 'triangle-up', 'triangle-down', 'diamond', 'square'],
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