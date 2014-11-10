//= require taffydb/taffy.js
//= require jquery
//= require underscore
//= require typeahead.js/dist/bloodhound.js
//= require typeahead.js/dist/typeahead.jquery.js
//= require angular/angular.js
//= require d3/d3.js
//= require nvd3/nv.d3.js
//= require d3plus.full
//= require angular-nvd3/dist/angular-nvd3.js
//= require semantic-ui
//= require angular-treemap
//= require angular/app
//= require angular/directives
//= require angular/factories
//= require angular/controllers

$(function() {
    $('.ui.sidebar').sidebar();
    $('.ui.radio.checkbox').checkbox();
    $('.ui.button').on('click', function() {
        $('.ui.sidebar').sidebar('toggle');
    });
     
    /* Bubble Chart*/
    /*var sample_data = [{
        "value": 250,
        "genre": "Drama",
        "name": "The Dark Knight Rises",
        "group": "Revenue (In Millions)"
    }, {
        "value": 160,
        "genre": "Drama",
        "name": "Inception",
        "group": "Revenue (In Millions)"
    }, {
        "value": 185,
        "genre": "Action",
        "name": "The Dark Knight",
        "group": "Revenue (In Millions)"
    }, {
        "value": 160,
        "genre": "Drama",
        "name": "The Prestige",
        "group": "Revenue (In Millions)"
    }, {
        "value": 150,
        "genre": "Drama",
        "name": "Batman Begins",
        "group": "Revenue (In Millions)"
    }, {
        "value": 46,
        "genre": "Action",
        "name": "Insomnia",
        "group": "Revenue (In Millions)"
    }];*/

    // instantiate d3plus
    /*var visualization = d3plus.viz()
        .container("#viz") // container DIV to hold the visualization
        .data(sample_data) // data to use with the visualization
        .type("bubbles") // visualization type
        .id(["group", "genre"]) // nesting keys
        .depth(1) // 0-based depth
        .size("value") // key name to size bubbles
        .color("genre") // color by each group
        .legend({
            "size": 70
        })
        // .text("genre")
        .height(350)
        .draw() // finally, draw the visualization!*/

    var sample_data = [
        {"critique": 87, "production": 250, "movie": "The Dark Knight Rises"},
        {"critique": 85, "production": 160, "movie": "Inception"},
        {"critique": 40, "production": 40, "movie": "The Dark Knight"},
        {"critique": 45, "production": 10, "movie": "The Prestige"},
        {"critique": 80, "production": 150, "movie": "Batman Begins"},
        {"critique": 92, "production": 46, "movie": "Insomnia"},
      ]
     
      // instantiate d3plus
      var visualization = d3plus.viz()
        .container("#viz")  // container DIV to hold the visualization
        .data(sample_data)  // data to use with the visualization
        .type("chart")      // visualization type
        .id("movie")         // key for which our data is unique on
        .x("critique")         // key for x-axis
        .y("production")        // key for y-axis
        .height(350)
        .draw()             // finally, draw the visualization!
});