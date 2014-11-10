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
//= require jquery-address/src/jquery.address.js
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
    $('.demo.menu .item').tab();
    /* Bubble Chart*/

    /*var sample_data = [
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
        .draw()             // finally, draw the visualization!*/
});