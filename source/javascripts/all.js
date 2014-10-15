//= require_tree .
//= require jquery
//= require angular/angular.js
//= require d3/d3.js
//= require nvd3/nv.d3.js
//= require angular-nvd3/dist/angular-nvd3.js
//= require semantic-ui

$(function() {
    $('.ui.sidebar').sidebar();
    $('.ui.radio.checkbox').checkbox();
    $('.ui.button').on('click', function() {
        $('.ui.sidebar').sidebar('toggle');
    });
    var width = 960,
        height = 500;

    var color = d3.scale.ordinal().range(['#3d4f53', '#8f4139', '#ab987a']);

    var force = d3.layout.force()
        .charge(-40)
        .linkDistance(10)
        .size([width, height]);

    var svg = d3.select("#chart-container").append("svg")
        .attr("id", "main-svg")
        .attr("width", width)
        .attr("height", height);

    d3.json("data/films.json", function(error, graph) {

        force.nodes(graph.nodes)
            .links(graph.links)
            .start();

        var drag = force.drag()
            .on("dragstart", dragstart);

        var link = svg.selectAll(".link")
            .data(graph.links)
            .enter().append("line")
            .attr("class", "link");

        var node = svg.selectAll("g.node")
            .data(graph.nodes)
            .enter().append("svg:g")
            .attr("class", "node")
            .on("dblclick", dblclick)
            .call(force.drag);

        node.filter(function(d) {
                return d.type == "director"
            })
            .append("svg:text")
            .attr("class", "director nodetext")
            .attr("dx", 12)
            .attr("dy", ".35em")
            .text(function(d) {
                return d.name
            });

        node.append("circle")
            .attr("class", function(d) {
                return d.type + " nodecircle"
            })
            .attr("r", 5)
            .style("fill", function(d) {
                return color(d.type);
            })
            .on("mouseover", showPopover)
            .on("mouseout", removePopovers);

        force.on("tick", function() {
            link.attr("x1", function(d) {
                    return d.source.x;
                })
                .attr("y1", function(d) {
                    return d.source.y;
                })
                .attr("x2", function(d) {
                    return d.target.x;
                })
                .attr("y2", function(d) {
                    return d.target.y;
                });

            node.attr("transform", function(d) {
                return "translate(" + d.x + "," + d.y + ")";
            });
        });

        function dblclick(d) {
            d3.select(this).classed("fixed", d.fixed = false);
            // force.start();
        }

        function dragstart(d) {
            d3.select(this).classed("fixed", d.fixed = true);
        }
    });

    function removePopovers() {
        $('.popover').each(function() {
            $(this).remove();
        });
    }

    function showPopover(d) {
        $(this).popup({
			    content: d.type.slice(0, 1).toUpperCase() + d.type.slice(1) + ": " + d.name
			  });
			  $(this).popup('show');

    }

    function resize() {
        var chart = $("#main-svg");
        chart.attr("width", chart.parent().width());
        chart.attr("height", chart.parent().height());
        force.size([chart.parent().width(), chart.parent().height()]);
        // force.start();
    }

    $(document).ready(function() {
        resize();
    });

    $(window).on("resize", function() {
        resize();
    });
})

angular.module('myApp', ['nvd3'])
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