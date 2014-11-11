var fetchValue = require("../fetch/value.js"),
    validObject  = require("../../object/validate.coffee"),
    uniqueValues = require("../../util/uniques.coffee");
//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
// Nests and groups the data.
//------------------------------------------------------------------------------
var dataNest = function( vars , flatData , nestingLevels , requirements ) {

  requirements = requirements || vars.types[vars.type.value].requirements || [];

  var nestedData   = d3.nest(),
      groupedData  = [],
      segments     = "temp" in vars ? [ "active" , "temp" , "total" ] : [],
      exceptions   = "time" in vars ? [ vars.time.value , vars.icon.value ] : [],
      checkAxes    = function() {

      //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
      // If the visualization has method requirements, check to see if we need
      // to key the data by a discrete scale variable.
      //------------------------------------------------------------------------
      if ( requirements && requirements.length ) {

        ["x","y"].forEach(function(axis){

          var axisKey = vars[axis].value;

          if (requirements.indexOf(axis) >= 0 && axisKey && vars[axis].scale.value === "discrete") {

            exceptions.push(axisKey);

            nestedData.key(function(d){
              return fetchValue( vars , d , axisKey );
            });

          }

        });

      }

    };

  if (!(requirements instanceof Array)) requirements = [requirements];

  //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  // Loop through each nesting level.
  //----------------------------------------------------------------------------
  nestingLevels.forEach(function( level , i ){

    //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    // Create a nest key for the current level.
    //--------------------------------------------------------------------------
    nestedData
      .key(function(d){

        if ( typeof level === "function" ) {
          return level(d);
        }

        return fetchValue( vars , d , level );
      });

    checkAxes();

  });

  if ( !nestingLevels.length ) {

    nestedData
      .key(function(d){
        return true;
      });

    checkAxes();
  }

  var i = nestingLevels.length ? nestingLevels.length - 1 : 0;

  //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  // If we're at the deepest level, create the rollup function.
  //----------------------------------------------------------------------------
  nestedData.rollup(function( leaves ) {

    //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    // If there's only 1 leaf, and it's been processed, return it as-is.
    //--------------------------------------------------------------------------
    if ( leaves.length === 1 && ("d3plus" in leaves[0]) ) {
      // var returnObj = leaves[0]
      // returnObj.d3plus.depth = i
      groupedData.push(leaves[0]);
      return leaves[0];
    }

    //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    // Create the "d3plus" object for the return variable, starting with
    // just the current depth.
    //--------------------------------------------------------------------------
    var returnObj = {
      "d3plus": {
        "depth": i
      }
    };

    if ("d3plus" in leaves[0]) {

      leaves.forEach(function(l){
        if ("d3plus" in l) {
          if (l.d3plus.merged instanceof Array) {
            if (!returnObj.d3plus.merged) returnObj.d3plus.merged = [];
            returnObj.d3plus.merged = returnObj.d3plus.merged.concat(l.d3plus.merged);
          }
          if (l.d3plus.text) returnObj.d3plus.text = l.d3plus.text;
        }
      });
    }

    //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    // Create a reference sum for the 3 different "segment" variables.
    //--------------------------------------------------------------------------
    segments.forEach(function(c){

      var key = vars[c].value || c;

      returnObj.d3plus[key] = d3.sum(leaves, function( d ) {

        var a = 0;

        if ( vars[c].value ) {

          a = fetchValue(vars,d,vars[c].value);

          if ( typeof a !== "number" ) {
            a = a ? 1 : 0;
          }

        }
        else if ( c === "total" ) {
          a = 1;
        }

        return a;

      });

    });

    //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    // Aggregate all values detected in the data.
    //--------------------------------------------------------------------------
    for ( var key in vars.data.keys ) {

      var uniques = uniqueValues(leaves,key);

      if (uniques.length) {

        var agg     = vars.aggs && vars.aggs.value[key] ? vars.aggs.value[key] : "sum",
            aggType = typeof agg,
            keyType = vars.data.keys[key],
            idKey   = vars.id.nesting.indexOf(key) >= 0,
            timeKey = "time" in vars && key === vars.time.value;

        if ( key in returnObj.d3plus ) {

          returnObj[key] = returnObj.d3plus[key];

        }
        else if ( aggType === "function" ) {

          returnObj[key] = vars.aggs.value[key](leaves);

        }
        else if ( timeKey ) {
          var dates = [];

          function parseDates(arr) {

            for ( var i = 0; i < arr.length ; i++ ) {
              var d = arr[i];
              if (d !== undefined) {
                if (d.constructor === Date) dates.push(d);
                else if (d.constructor === Array) {
                  parseDates(d);
                }
                else {
                  d = new Date(d.toString());
                  if (d !== "Invalid Date") {
                    d.setTime( d.getTime() + d.getTimezoneOffset() * 60 * 1000 );
                    dates.push(d);
                  }
                }
              }
            }

          }

          parseDates(uniques);

          if (dates.length === 1) returnObj[key] = dates[0];
          else returnObj[key] = dates;

        }
        else if ( keyType === "number" && aggType === "string" && !idKey ) {
          returnObj[key] = d3[agg](leaves.map(function(d){return d[key];}));
        }
        else {

          var testVals = [];
          function checkVal(obj) {
            if (obj instanceof Array) {
              obj.forEach(checkVal);
            }
            else if (validObject(obj) && key in obj) {
              if (obj[key] instanceof Array) {
                obj[key].forEach(checkVal);
              }
              else {
                testVals.push(obj);
              }
            }
          }
          checkVal(leaves);

          var keyValues = testVals.length === 1 ? testVals[0][key]
                        : uniqueValues( testVals , key );

          if ( keyValues !== undefined && keyValues !== null ) {

            if ( !(keyValues instanceof Array) ) {
              keyValues = [ keyValues ];
            }

            if ( keyValues.length ) {

              if ( idKey && vars.id.nesting.indexOf(key) > i && testVals.length > 1 ) {
                if (key == "id" && nestingLevels.length == 1 && testVals.length > leaves.length) {
                  var newNesting = nestingLevels.concat(key);
                  testVals = dataNest(vars,testVals,newNesting);
                }
                returnObj[key] = testVals.length === 1 ? testVals[0] : testVals;

              }
              else {

                returnObj[key] = keyValues.length === 1 ? keyValues[0] : keyValues;

              }

            }

          }
          else if (idKey) {
            var endPoint = vars.id.nesting.indexOf(key) - 1;
            if (endPoint >= i && (!("endPoint" in returnObj.d3plus) || returnObj.d3plus.endPoint > i)) {
              returnObj.d3plus.endPoint = i;
            }
          }

        }

      }

    }

    groupedData.push(returnObj);

    return returnObj;

  });

  var rename_key_value = function(obj) {
    if (obj.values && obj.values.length) {
      obj.children = obj.values.map(function(obj) {
        return rename_key_value(obj);
      });
      delete obj.values;
      return obj;
    }
    else if(obj.values) {
      return obj.values;
    }
    else {
      return obj;
    }
  };

  var find_keys = function(obj,depth,keys) {
    if (obj.children) {
      if (vars.data.keys[nestingLevels[depth]] == "number") {
        obj.key = parseFloat(obj.key);
      }
      keys[nestingLevels[depth]] = obj.key;
      delete obj.key;
      for ( var k in keys ) {
        obj[k] = keys[k];
      }
      depth++;
      obj.children.forEach(function(c){
        find_keys(c,depth,keys);
      });
    }
  };

  nestedData = nestedData
    .entries(flatData)
    .map(rename_key_value)
    .map(function(obj){
      find_keys(obj,0,{});
      return obj;
    });

  return groupedData;

};

module.exports = dataNest;
