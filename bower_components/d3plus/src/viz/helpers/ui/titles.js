var events = require("../../../client/pointer.coffee"),
    fetchValue = require("../../../core/fetch/value.js"),
    print      = require("../../../core/console/print.coffee"),
    rtl        = require("../../../client/rtl.coffee"),
    textWrap   = require("../../../textwrap/textwrap.coffee")
//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
// Draws appropriate titles
//------------------------------------------------------------------------------
module.exports = function(vars) {

  var total_key = vars.size.value ? vars.size.value
    : vars.color.type === "number" ? vars.color.value : false

  //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  // If there is no data or the title bar is not needed,
  // set the total value to 'null'
  //----------------------------------------------------------------------------
  if (!vars.data.viz || !vars.title.total.value || vars.small) {
    var total = false
  }
  //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  // Otherwise, let's calculate it!
  //----------------------------------------------------------------------------
  else if (total_key) {

    if ( vars.dev.value ) {
      print.time("calculating total value")
    }

    if (vars.focus.value.length) {
      var total = vars.data.viz.filter(function(d){
        return d[vars.id.value] == vars.focus.value[0]
      })
      total = d3.sum(total,function(d){
        return fetchValue(vars,d,total_key)
      })
    }
    else {
      var total = d3.sum(vars.data.pool,function(d){
        return fetchValue(vars,d,total_key)
      })
    }

    if (total === 0) {
      total = false
    }

    if (typeof total === "number") {

      var pct = ""

      if (vars.data.mute.length || vars.data.solo.length || vars.focus.value.length) {

        var overall_total = d3.sum(vars.data.value, function(d){
          if (vars.time.solo.value.length > 0) {
            var match = vars.time.solo.value.indexOf(fetchValue(vars,d,vars.time.value)) >= 0
          }
          else if (vars.time.mute.value.length > 0) {
            var match = vars.time.solo.value.indexOf(fetchValue(vars,d,vars.time.value)) < 0
          }
          else {
            var match = true
          }
          if (match) {
            return fetchValue(vars,d,total_key)
          }
        })

        if (overall_total > total) {

          var pct = (total/overall_total)*100,
              ot = vars.format.value(overall_total,vars.size.value, vars)

          var pct = " ("+vars.format.value(pct,"share")+"% of "+ot+", vars)"

        }
      }

      total = vars.format.value(total,vars.size.value, vars)
      var obj = vars.title.total.value
        , prefix = obj.prefix || vars.format.value(vars.format.locale.value.ui.total)+": "
      total = prefix + total
      obj.suffix ? total = total + obj.suffix : null
      total += pct

    }

    if ( vars.dev.value ) {
      print.timeEnd("calculating total value")
    }

  }
  else {
    var total = false
  }


  //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  // Initialize titles and detect footer
  //----------------------------------------------------------------------------
  var title_data = []

  if (vars.footer.value) {
    title_data.push({
      "link": vars.footer.link,
      "style": vars.footer,
      "type": "footer",
      "value": vars.footer.value
    })
  }

  //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  // If not in "small" mode, detect titles available
  //----------------------------------------------------------------------------
  if (!vars.small) {

    if (vars.title.value) {
      title_data.push({
        "link": vars.title.link,
        "style": vars.title,
        "type": "title",
        "value": vars.title.value
      })
    }
    if (vars.title.sub.value) {
      title_data.push({
        "link": vars.title.sub.link,
        "style": vars.title.sub,
        "type": "sub",
        "value": vars.title.sub.value
      })
    }
    if (vars.title.total.value && total) {
      title_data.push({
        "link": vars.title.total.link,
        "style": vars.title.total,
        "type": "total",
        "value": total
      })
    }

  }

  //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  // Title positioning
  //----------------------------------------------------------------------------
  function position(title) {

    title
      .style("text-anchor",function(t){

        var align = t.style.font.align

        if (align == "center") {
          return "middle"
        }
        else if ((align == "left" && !rtl) || (align == "right" && rtl)) {
          return "start"
        }
        else if ((align == "left" && rtl) || (align == "right" && !rtl)) {
          return "end"
        }

      })
      .attr("x",function(t){

        var align = t.style.font.align

        if (align == "center") {
          return vars.width.value/2
        }
        else if ((align == "left" && !rtl) || (align == "right" && rtl)) {
          return vars.padding
        }
        else if ((align == "left" && rtl) || (align == "right" && !rtl)) {
          return vars.width.value-vars.padding
        }

      })
      .attr("y",0)

  }

  //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  // Enter Titles
  //----------------------------------------------------------------------------
  function style(title) {

    title
      .attr("font-size",function(t){
        return t.style.font.size
      })
      .attr("fill",function(t){
        return t.link ? vars.links.font.color : t.style.font.color
      })
      .attr("font-family",function(t){
        return t.link ? vars.links.font.family.value : t.style.font.family.value
      })
      .attr("font-weight",function(t){
        return t.link ? vars.links.font.weight : t.style.font.weight
      })
      .style("text-decoration",function(t){
        return t.link ? vars.links.font.decoration.value : t.style.font.decoration.value
      })
      .style("text-transform",function(t){
        return t.link ? vars.links.font.transform.value : t.style.font.transform.value
      })

  }

  //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  // Enter Titles
  //----------------------------------------------------------------------------
  if ( vars.dev.value ) print.time("drawing titles")
  var titles = vars.svg.selectAll("g.d3plus_title")
    .data(title_data,function(t){
      return t.type
    })

  var titleWidth = vars.title.width || vars.width.value

  titles.enter().append("g")
    .attr("class","d3plus_title")
    .attr("opacity",0)
    .attr("transform",function(t){
      var y = t.style.position == "top" ? 0 : vars.height.value
      return "translate(0,"+y+")"
    })
    .append("text")
      .call(position)
      .call(style)

  //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  // Wrap text and calculate positions, then transition style and opacity
  //----------------------------------------------------------------------------
  titles
    .each(function(d){

      textWrap()
        .container( d3.select(this).select("text") )
        .height( vars.height.value / 8 )
        .size(false)
        .text( d.value )
        .width( titleWidth )
        .draw()

      d.y = vars.margin[d.style.position]
      vars.margin[d.style.position] += this.getBBox().height + d.style.padding*2

    })
    .on(events.over,function(t){
      if (t.link) {
        d3.select(this)
          .transition().duration(vars.timing.mouseevents)
          .style("cursor","pointer")
          .select("text")
            .attr("fill",vars.links.hover.color)
            .attr("font-family",vars.links.hover.family.value)
            .attr("font-weight",vars.links.hover.weight)
            .style("text-decoration",vars.links.hover.decoration.value)
            .style("text-transform",vars.links.hover.transform.value)
      }
    })
    .on(events.out,function(t){
      if (t.link) {
        d3.select(this)
          .transition().duration(vars.timing.mouseevents)
          .style("cursor","auto")
          .select("text")
            .call(style)
      }
    })
    .on(events.click,function(t){
      if (t.link) {
        var target = t.link.charAt(0) != "/" ? "_blank" : "_self"
        window.open(t.link,target)
      }
    })
    .transition().duration(vars.draw.timing)
      .attr("opacity",1)
      .attr("transform",function(t){
        var pos = t.style.position,
            y = pos == "top" ? 0+t.y : vars.height.value-t.y
        if (pos == "bottom") {
          y -= this.getBBox().height+t.style.padding
        }
        else {
          y += t.style.padding
        }
        return "translate(0,"+y+")"
      })
      .select("text")
        .call(position)
        .call(style)

  //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  // Exit unused titles
  //----------------------------------------------------------------------------
  titles.exit().transition().duration(vars.draw.timing)
    .attr("opacity",0)
    .remove()

  if ( vars.margin.top > 0 ) {
    vars.margin.top += vars.title.padding
  }

  if ( vars.margin.bottom > 0 ) {
    vars.margin.bottom += vars.title.padding
  }

  var min = vars.title.height
  if (min && vars.margin[vars.title.position] < min) {
    vars.margin[vars.title.position] = min
  }

  if ( vars.dev.value ) print.timeEnd("drawing titles")

}
