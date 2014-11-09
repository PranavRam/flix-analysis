angular.module('myApp').directive('graph', function(){

    var link = function($scope, $el, $attrs){
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
        function update(){
            var graph = $scope.data;
            // console.log(graph);
            if(typeof graph !== 'undefined'){
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