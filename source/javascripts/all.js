//= require taffydb/taffy.js
//= require jquery
//= require moment/min/moment-with-locales.js
//= require underscore
//= require jquery-sticky/jquery.sticky.js
//= require typeahead.js/dist/bloodhound.js
//= require typeahead.js/dist/typeahead.jquery.js
//= require angular/angular.js
//= require d3/d3.js
//= require nvd3/nv.d3.js
//= require d3plus/d3plus.full.min.js
//= require angular-nvd3/dist/angular-nvd3.js
//= require semantic-ui
//= require angular-treemap
//= require angular/app
//= require angular/directives
//= require angular/factories
//= require angular/controllers

$(function() {
    $('.ui.sidebar').sidebar();
    // $('.ui.radio.checkbox').checkbox();
    $('#sidebar-menu').on('click', function() {
        $('.ui.sidebar').sidebar('toggle');
    });
    // $('.micro.menu .item').tab();
    $("#sticker").sticky({
        topSpacing: 10,
        getWidthFrom: '.fifteen.wide.column > .row'
    });
});