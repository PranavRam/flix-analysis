var copy        = require("../../../util/copy.coffee"),
    form        = require("../../../form/form.js"),
    print       = require("../../../core/console/print.coffee"),
    validObject = require("../../../object/validate.coffee");

//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
// Draws a UI drawer, if defined.
//------------------------------------------------------------------------------
module.exports = function( vars ) {

  var enabled = vars.ui.value && vars.ui.value.length,
      position = vars.ui.position.value;

  if ( vars.dev.value && enabled ) print.time("drawing custom UI elements");

  var drawer = vars.container.value.selectAll("div#d3plus_drawer")
    .data(["d3plus_drawer"]);

  drawer.enter().append("div")
    .attr("id","d3plus_drawer");

  var positionStyles = {};
  vars.ui.position.accepted.forEach(function(p){
    positionStyles[p] = p == position ? vars.margin.bottom+"px" : "auto";
  });

  drawer
    .style("text-align",vars.ui.align.value)
    .style("position","absolute")
    .style("width",vars.width.value-(vars.ui.padding*2)+"px")
    .style("height","auto")
    .style(positionStyles);

  var ui = drawer.selectAll("div.d3plus_drawer_ui")
    .data(enabled ? vars.ui.value : [], function(d){
      return d.method || false;
    });

  ui.enter().append("div")
    .attr("class","d3plus_drawer_ui")
    .style("padding",vars.ui.padding+"px")
    .style("display","inline-block")
    .each(function(d){

      var container = d3.select(this);
      var focus, callback;

      if (typeof d.method === "string" && d.method in vars) {
        focus = vars[d.method].value;
        callback = function(value) {
          if ( value !== vars[d.method].value ) {
            vars.self[d.method](value).draw();
          }
        };
      }
      else {
        focus = d.value[0];
        if (validObject(focus)) focus = focus[d3.keys(focus)[0]];
        if (typeof d.method === "function") callback = d.method;
      }

      d.form = form()
        .container(container)
        .focus(focus, callback)
        .id("id")
        .text("text");

    });

  ui.each(function(d){

    var data = [], title;

    if (d.label) {
      title = d.label;
    }
    else if (typeof d.method === "string" && d.method in vars) {
      title = vars.format.locale.value.method[d.method] || d.method;
    }

    d.value.forEach(function(o){

      var obj = {};

      if (validObject(o)) {
        obj.id   = o[d3.keys(o)[0]];
        obj.text = d3.keys(o)[0];
      }
      else {
        obj.id   = o;
        obj.text = vars.format.value(o);
      }

      data.push(obj);

    });

    var font = copy(vars.ui.font);
    font.secondary = vars.ui.font;

    d.form
      .data(data)
      .font(font)
      .format(vars.format.locale.language)
      .title(vars.format.value(title))
      .type(d.type || "auto")
      .ui({
        "align": vars.ui.align.value,
        "padding": vars.ui.padding,
        "margin": 0
      })
      .width(d.width || false)
      .draw();

  });

  ui.exit().remove();

  var drawerHeight = drawer.node().offsetHeight || drawer.node().getBoundingClientRect().height;

  if ( drawerHeight ) {
    vars.margin[position] += drawerHeight;
  }

  if ( vars.dev.value && enabled ) print.timeEnd("drawing custom UI elements");

};
