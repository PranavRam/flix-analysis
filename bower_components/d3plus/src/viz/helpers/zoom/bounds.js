var transform = require("./transform.coffee")

module.exports = function( vars , b , timing ) {

  if (!b) {
    var b = vars.zoom.bounds
  }

  if (typeof timing !== "number") {
    var timing = vars.timing.transitions
  }

  vars.zoom.size = {
    "height": b[1][1]-b[0][1],
    "width": b[1][0]-b[0][0]
  }

  var fit = vars.coords.fit.value
  if (fit == "auto" || vars.types[vars.type.value].requirements.indexOf("coords") < 0) {
    var aspect = d3.max([vars.zoom.size.width/vars.width.viz,vars.zoom.size.height/vars.height.viz])
  }
  else {
    var aspect = vars.zoom.size[fit]/vars["app_"+fit]
  }

  var min = d3.min([vars.width.viz,vars.height.viz])

  var padding = vars.types[vars.type.value].zoom ? vars.coords.padding*2 : 0

  var scale = ((min-padding) / min) / aspect

  var extent = vars.zoom.behavior.scaleExtent()

  if (extent[0] == extent[1] || b == vars.zoom.bounds) {
    vars.zoom.behavior.scaleExtent([scale,scale*16])
  }

  var max_scale = vars.zoom.behavior.scaleExtent()[1]
  if (scale > max_scale) {
    scale = max_scale
  }
  vars.zoom.scale = scale

  var translate = []

  translate[0] = vars.width.viz/2-(vars.zoom.size.width*scale)/2-(b[0][0]*scale)
  translate[1] = vars.height.viz/2-(vars.zoom.size.height*scale)/2-(b[0][1]*scale)

  vars.zoom.translate = translate
  vars.zoom.behavior.translate(translate).scale(scale)

  vars.zoom.size = {
    "height": vars.zoom.bounds[1][1]-vars.zoom.bounds[0][1],
    "width": vars.zoom.bounds[1][0]-vars.zoom.bounds[0][0]
  }

  transform(vars,timing)

}
