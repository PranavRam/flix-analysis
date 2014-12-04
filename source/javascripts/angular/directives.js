angular.module('myApp').directive('radio', ['$rootScope', '$timeout', function($rootScope, $timeout) {

    var link = function($scope, $el, $attrs) {

        return $timeout(function() {
            return $($el.parent()).checkbox({
                onChange: function(value) {
                    // console.log(value, $scope[$attrs.ngModel]);
                    $scope.$apply(function() {

                        if ($scope[$attrs.ngModel] == 'genre') {
                            $scope[$attrs.ngModel] = 'critique';
                        } else if ($scope[$attrs.ngModel] == 'critique') {
                            $scope[$attrs.ngModel] = 'genre';
                        } else if ($scope[$attrs.ngModel] == 'production') {
                            $scope[$attrs.ngModel] = 'revenue';
                            // $rootScope.$broadcast('genre_critique:updated');
                        } else if ($scope[$attrs.ngModel] == 'revenue') {
                            $scope[$attrs.ngModel] = 'production';
                        }
                    });

                    // $scope[$attrs.ngModel] = value;
                }
            });
        });
    }
    return {
        require: 'ngModel',
        link: link
    }
}]);

angular.module('myApp').directive('pieChart', function() {

    var link = function($scope, $el, $attrs) {
        /*var data = [{
                "genre": "Drama",
                "name": "TM",
                "value": 1
            }, {
                "genre": "Action",
                "name": "SS"
                "value": 2
            }];*/
        // update();
        var visualization = d3plus.viz()
            .container(d3.select($el[0]))

        function update() {
            if (typeof $scope.data2 !== 'undefined') {
                console.log($scope.data2);
                visualization
                    .data($scope.data2)
                    .type("pie")
                    .id("genre")
                    // .x("genre")
                    .size("value")
                    .height(450)
                    .ui([{
                        "method": function(value) {
                            console.log(arguments);
                            if (value === "name") {
                                visualization.id(["name", "genre"]).draw();
                            } else {
                                visualization.id("genre").draw();
                            }
                        },
                        "type": "drop",
                        "value": [{
                            "Genre": "genre"
                        }, {
                            "Celebrity": "name"
                        }]
                    }])
                    .draw()
                    /*setTimeout(function(){
                        $el.find('.d3plus_arc').off('click').on('click', function(d){
                            console.log(d.target.__data__)
                        });
                    }, 3000);*/
            }
            // console.log(visualization);
            // viz = visualization;
        }
        $scope.$watch('data2', update);
        $(window).on("resize", function() {
            update();
        });
    }
    return {
        template: '<div></div>',
        restrict: 'E',
        link: link,
        replace: true
    }
});

angular.module('myApp').directive('treeMap', function() {

    var link = function($scope, $el, $attrs) {
        var visualization = d3plus.viz()
            .container(d3.select($el[0]))

        function update() {
            if (typeof $scope.data !== 'undefined') {
                visualization
                    .data($scope.data)
                    .type("tree_map")
                    .id(["genre", "name"])
                    .size("value")
                    .height(600)
                    .width($('.fifteen.wide.column .row')[0].clientWidth - 25)
                    .draw();
            }
        }

        $(window).on("resize", function() {
            update();
        });
        $scope.$watch('data', update);
    }
    return {
        template: '<div></div>',
        restrict: 'E',
        link: link,
        replace: true
    }
});

angular.module('myApp').directive('scatterPlot', function() {

    var link = function($scope, $el, $attrs) {
        var visualization = d3plus.viz()
            .container(d3.select($el[0]))

        function update() {
            if (typeof $scope.data !== 'undefined') {
                // instantiate d3plus
                // console.log('updating sctt', $scope.data);
                visualization
                    .data($scope.data) // data to use with the visualization
                    .type("scatter") // visualization type
                    .id(["genre", "title"]) // key for which our data is unique on
                    .depth(0)
                    .id({
                        "solo": []
                    })
                    .x($scope.production_revenue) // key for x-axis
                    .aggs({
                        "production": "mean",
                        "revenue": "mean"
                    })
                    .y("Critic Rating") // key for y-axis
                    .aggs({
                        "Critic Rating": "mean",
                        "Public Rating": "mean"
                    })
                    .color("genre")
                    .height(450)
                    .ui([{
                        "method": "y",
                        "label": "Rating",
                        "value": [{
                            "Critic": "Critic Rating"
                        }, {
                            "Public": "Public Rating"
                        }]
                    }, {
                        "method": "x",
                        "value": [{
                            "Production": "production"
                        }, {
                            "Revenue": "revenue"
                        }]
                    }, {
                        "method": function(value){
                            if(value == "celebrity"){
                                visualization.depth(0).id("title").id({"solo":[]}).color("celebrity").draw();
                            }
                            else{
                                visualization.depth(0).id(["genre", "title"]).color("genre").draw();
                            }
                        },
                        "type": "drop",
                        "value": ["genre", "celebrity"]
                    }, {
                        "method": function(value) {
                            visualization.id({
                                "solo": []
                            }).depth(0).draw();
                        },
                        "label": "Reset",
                        "type": "button",
                        "value": [""]
                    }])
                    // .focus({value: {title: "Minority Report"}})
                    .draw() // finally, draw the visualization!*/
            }
        }
        $scope.$watch('data', update);
        $scope.$on('selected_movie:updated', function(event, data) {
            // console.log('yo', data);
            // you could inspect the data to see if what you care about changed, or just update your own scope
            if(visualization.color() == "genre"){

                if (data.length > 0) {
                    visualization.depth(0).id({
                        "solo": data
                    }).depth(1).draw();
                } else {
                    visualization.id(["genre", "title"]).id({
                        "solo": []
                    }).depth(0).draw();
                }
            }
            else {
                if (data.length > 0) {
                    visualization.depth(0).id({
                        "solo": data
                    }).draw();
                } else {
                    visualization.id("title").id({
                        "solo": []
                    }).depth(0).draw();
                }
            }
        });
    }
    return {
        template: '<div></div>',
        restrict: 'E',
        link: link,
        replace: true
    }
});

angular.module('myApp').directive('bubbleChart', function() {

    var link = function($scope, $el, $attrs) {
        var visualization = d3plus.viz()
            .container(d3.select($el[0]))

        function update() {
            if (typeof $scope.data != 'undefined') {
                visualization
                    .data($scope.data) // data to use with the visualization
                    .type("bubbles") // visualization type
                    .id(["genre", "name"]) // nesting keys
                    .depth(1) // 0-based depth
                    .size("value") // key name to size bubbles
                    .color("genre") // color by each group
                    .legend({
                        "size": 70
                    })
                    .text({
                        "id": "name",
                        "genre": "genre"
                    })
                    .height(800)
                    .width($('.fifteen.wide.column .row')[0].clientWidth - 25)
                    .draw() // finally, draw the visualization!
            }
        }
        $scope.$watch('data', update);
        $scope.$on('microtab:change', function(e) {
            update();
        });
    }
    return {
        template: '<div></div>',
        restrict: 'E',
        link: link,
        replace: true
    }
});

angular.module('myApp').directive('paralleld3', function() {

    var blue_to_brown = d3.scale.linear()
        .domain([9, 50])
        .range(["steelblue", "brown"])
        .interpolate(d3.interpolateLab);

    var color = function(d) {
        return blue_to_brown(d['economy (mpg)']);
    };

    var link = function($scope, $el, $attrs) {
        // console.log($el[0]);
        var parcoords = d3.parcoords()($el[0]);

        function update() {
            if (typeof $scope.data != 'undefined') {
                console.log($el);
                parcoords
                    .color(color)
                    .alpha(0.4)
                    .data($scope.data)
                    /*.height(600)
                    .width(960)*/
                    .render()
                    .shadows()
                    .reorderable()
                    .brushMode("1D-axes"); // enable brushing
            }
        }
        $scope.$watch('data', update);
    }
    return {
        template: "<div></div>",
        restrict: 'EA',
        link: link,
        replace: true
    }
});

angular.module('myApp').directive('graphd3plus', function() {

    var link = function($scope, $el, $attrs) {
        var visualization = d3plus.viz()
            .container(d3.select($el[0]))

        function update() {
            // console.log('graph');
            if (typeof $scope.data != 'undefined' && typeof $scope.data.nodes != 'undefined' && typeof $scope.data.links != 'undefined') {
                visualization
                    .type("network")
                    .data($scope.data.nodes)
                    .edges($scope.data.links)
                    .size("connections")
                    .color("type")
                    .id("name")
                    // .text({"id":"name"})
                    .legend(false)
                    .height(600)
                    .focus("Brad Pitt", $scope.cb)
                    .draw();
                // console.log('GRAPH', visualization.data());
            }
        }
        $scope.$watch('data', update);
        $scope.$on('actor:updated', function(event, data) {
            // console.log('yo', data);
            visualization.focus(data).draw();
            // you could inspect the data to see if what you care about changed, or just update your own scope
            // visualization.focus("data")
        });
    }
    return {
        template: '<div></div>',
        restrict: 'E',
        link: link,
        replace: true
    }
});

angular.module('myApp').directive('graph', function() {

    var link = function($scope, $el, $attrs) {
        /*Force Directed*/
        var width = $el[0].clientWidth,
            height = 600;

        var color = d3.scale.ordinal().range(['#3d4f53', '#8f4139', '#ab987a']);

        var force = d3.layout.force()
            .charge(-40)
            .linkDistance(10)
            .size([width, height]);

        var svg = d3.select($el[0]).append("svg")
            .attr("id", "main-svg")
            .attr("width", width)
            .attr("height", height);

        // d3.json("data/films.json", function(error, graph) {
        function update() {
                var graph = $scope.data;
                // console.log(graph);
                if (typeof graph !== 'undefined') {
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
                        force.start();
                    }

                    function dragstart(d) {
                        d3.select(this).classed("fixed", d.fixed = true);
                    }
                }
            }
            // });

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
            chart.attr("width", $el[0].clientWidth);
            chart.attr("height", chart.parent().height());
            force.size([chart.parent().width(), chart.parent().height()]);
            force.start();
        }

        $(document).ready(function() {
            resize();
        });

        $(window).on("resize", function() {
            resize();
        });
        $scope.$watch('data', update);
    }

    return {
        template: '<div></div>',
        restrict: 'E',
        link: link,
        replace: true
    }
});