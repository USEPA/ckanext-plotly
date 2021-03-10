
this.ckan.module('plotly_view', function (jQuery) {
  return {
    initialize: function() {

        function makePlot(dataURL,  plotlyConfig){
            console.log( dataURL)
            Plotly.d3.csv(dataURL, function(data){ drawPlot(data, plotlyConfig) } );
        }

        function drawPlot(dataRows, configObj) {

          console.log(configObj);

          // Set default values
          var layout = {}
          var config = {scrollZoom: true, displaylogo: false}

          var traces = configObj.traces|| [];
          var layout = { ...layout, ...configObj.layout};
          var config = {...config, ...configObj.config};

          for ( var t=0; t<traces.length; t++) {
            keys = Object.keys( traces[t]);
            for ( var k=0; k<keys.length; k++ ) {
                if (keys[k].endsWith("src")) {
                    var srcKey = keys[k];
                    var dataKey = srcKey.substring(0, srcKey.length-3);
                    srcKey = traces[t][srcKey];
                    traces[t][ dataKey] = [];
                    for (i=1; i<dataRows.length ; i++) {
                        traces[t][dataKey].push(dataRows[i][srcKey]);
                    }
                }
            }
          }

          Plotly.newPlot('plotly_div', traces, layout, config );
        }

        var plotlyConfig = this.options.plotlyConfig;
        makePlot(this.options.dataurl, plotlyConfig );

    }
  }
});
