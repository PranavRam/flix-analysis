fetchValue = require "../../core/fetch/value.js"
graph      = require "./helpers/graph/draw.coffee"
dataTicks  = require "./helpers/graph/dataTicks.coffee"
nest       = require "./helpers/graph/nest.coffee"
stack      = require "./helpers/graph/stack.coffee"

# Line Plot
line = (vars) ->

  graph vars,
    buffer: vars.axes.opposite
    mouse:  true

  data = nest vars

  # Assign x and y to each data point
  for point in data
    for d in point.values
      d.d3plus.x  = vars.x.scale.viz fetchValue(vars, d, vars.x.value)
      d.d3plus.x += vars.axes.margin.left

      d.d3plus.y  = vars.y.scale.viz fetchValue(vars, d, vars.y.value)
      d.d3plus.y += vars.axes.margin.top

      d.d3plus.r = 2

  dataTicks vars

  if vars.axes.stacked then stack vars, data else data

# Visualization Settings and Helper Functions
line.requirements = ["data", "x", "y"]
line.setup        = (vars) ->

  unless vars.axes.discrete
    axis = if vars.time.value is vars.y.value then "y" else "x"
    vars.self[axis] scale: "discrete"

  y    = vars[vars.axes.opposite].value
  size = vars.size
  if (not y.value and size.value) or (size.changed and size.previous is y.value)
    vars.self[vars.axes.opposite] size.value
  else if (not size.value and y.value) or (y.changed and y.previous is size.value)
    vars.self.size y.value
  return
line.shapes  = ["line"]
line.tooltip = "static"

module.exports = line
