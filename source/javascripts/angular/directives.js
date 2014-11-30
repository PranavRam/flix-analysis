angular.module('myApp').directive('linePlot', function() {

    var link = function($scope, $el, $attrs) {
        var sample_data = [
            {"year": 1991, "name":"alpha", "value": 17},
            {"year": 1992, "name":"alpha", "value": 20},
            {"year": 1993, "name":"alpha", "value": 25},
            {"year": 1994, "name":"alpha", "value": 33},
            {"year": 1995, "name":"alpha", "value": 52},
            {"year": 1991, "name":"beta", "value": 36},
            {"year": 1992, "name":"beta", "value": 32},
            {"year": 1993, "name":"beta", "value": 40},
            {"year": 1994, "name":"beta", "value": 58},
            {"year": 1995, "name":"beta", "value": 13},
            {"year": 1991, "name":"gamma", "value": 24},
            {"year": 1992, "name":"gamma", "value": 27},
            {"year": 1994, "name":"gamma", "value": 35},
            {"year": 1995, "name":"gamma", "value": 40}
          ]
         function update(){
          // instantiate d3plus
          console.log($scope.data);
              var visualization = d3plus.viz()
                .container(d3.select($el[0]))  // container DIV to hold the visualization
                .data($scope.data)  // data to use with the visualization
                .type("line")       // visualization type
                .id("title")         // key for which our data is unique on
                .text("title")       // key to use for display text
                .y("rating")         // key to use for y-axis
                .x("Release Date")          // key to use for x-axis
                .x({"scale": "continuous"})
                .height(350)
                // .time("Release Date")
                .draw()             // finally, draw the visualization!
            }
         
        $scope.$watch('data', update);
    }
    return {
        template: '<div></div>',
        restrict: 'E',
        link: link,
        replace: true
    }
});

angular.module('myApp').directive('radio', ['$rootScope', '$timeout', function($rootScope, $timeout) {

    var link = function($scope, $el, $attrs) {
        
        return $timeout(function(){
            return $($el.parent()).checkbox({
                    onChange: function (value) {
                        // console.log(value, $scope[$attrs.ngModel]);
                        $scope.$apply(function(){

                            if($scope[$attrs.ngModel] == 'genre'){
                                $scope[$attrs.ngModel] = 'critique';
                            }
                            else if($scope[$attrs.ngModel] == 'critique'){
                                $scope[$attrs.ngModel] = 'genre';
                            }
                            else if($scope[$attrs.ngModel] == 'production'){
                                $scope[$attrs.ngModel] = 'revenue';
                                // $rootScope.$broadcast('genre_critique:updated');
                            }
                            else if($scope[$attrs.ngModel] == 'revenue'){
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
        var data = [
           {"genre": "Drama", "value": 1},
           {"genre": "Action", "value": 2}
         ]
        // update();
        var visualization = d3plus.viz()
          .container(d3.select($el[0]))
        function update(){
            if(typeof $scope.data2 !== 'undefined'){
                 visualization
                   .data($scope.data2)
                   .type("pie")
                   .id("genre")
                   // .x("genre")
                   .size("value")
                   .height(450)
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
            if(typeof $scope.data !== 'undefined'){
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
            if(typeof $scope.data !== 'undefined'){
             // instantiate d3plus
                visualization
                   .data($scope.data)  // data to use with the visualization
                   .type("scatter")      // visualization type
                   .id(["genre", "title"])         // key for which our data is unique on
                   .x($scope.production_revenue)         // key for x-axis
                   .y("critique")        // key for y-axis
                   .color("genre")
                   .aggs({"critique": "mean", "production": "mean", "revenue": "mean"})
                   .height(450)
                   .draw()             // finally, draw the visualization!*/
               }
        }
        $scope.$watch('data', update);
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
            // console.log('bubble');
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
                .height(450)
                .draw() // finally, draw the visualization!
        }
        $scope.$watch('data', update);
    }
    return {
        template: '<div></div>',
        restrict: 'E',
        link: link,
        replace: true
    }
});

angular.module('myApp').directive('graphd3plus', function() {

    var link = function($scope, $el, $attrs) {
        var visualization = d3plus.viz()
            .container(d3.select($el[0]))
        function update() {
            console.log('graph');
            if(typeof $scope.data != 'undefined'){
                visualization
                    .type("network")
                    .data($scope.data.nodes)
                    .edges($scope.data.links)
                    // .size("connections")
                    .color("type")
                    .id("name")
                    // .text({"id":"name"})
                    .legend(false)
                    .height(600)
                    /*.focus({
                        tooltip: true,
                        value: "Steven Spielberg"
                    }, $scope.cb)*/
                    .draw();
                }
        }
        $scope.$watch('data', update);
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