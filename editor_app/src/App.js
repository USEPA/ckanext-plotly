import React, {Component} from 'react';
import plotly from 'plotly.js/dist/plotly';
import PlotlyEditor from 'react-chart-editor';
import 'react-chart-editor/lib/react-chart-editor.css';


const config = {editable: true};

class App extends Component {
  constructor( props ) {
    super(props);

    window.plotlyEditor = this;

    this.dataURL = props.dataURL;
    this.configElement = props.configField;

    console.log(this.dataURL);
    this.state = {data: [], layout: {}, frames: [], dataValues: {} };

    this.loadConfig = this.loadConfig.bind(this);
    this.exportConfig = this.exportConfig.bind(this);
  }

  componentDidMount() {

    async function getData( dataURL) {
        var data = {}
        await plotly.d3.csv(dataURL, function(csv) {

            for ( const row in csv) {
                const keys = Object.keys( csv[row] )
                for ( const keyIdx in keys) {
                    const key = keys[keyIdx];
                    if ( data.hasOwnProperty(key))    { data[key].push(csv[row][key]); }
                    else                              { data[key] = [csv[row][key]]; }
                }
            }

            console.log(data);
        });
        return data;
    }

  getData( this.dataURL).then( (data) => {this.setState({dataValues: data });
  });

  }


  loadConfig( source ) {

   if ( source) {

        try {
            var config = JSON.parse(document.getElementById(source).value);
        }
        catch (e) {
            alert( "Error parsing configuration: \n" + e.message )
            return
        }

        if ( 'traces' in config) {
            var traces = config.traces;
            for (const t in traces) {
                const keys = Object.keys( traces[t] )
                for ( const k in keys) {
                    if (keys[k].endsWith("src")) {
                        var srcKey = keys[k];
                        var dataKey = srcKey.substring(0, srcKey.length-3);
                        srcKey = traces[t][srcKey];
                        traces[t][ dataKey] = this.state.dataValues[srcKey];
                    }
                }
            }
            this.setState( {data: traces})
        }

        if ( 'layout' in config) { this.setState( {layout: config.layout})}

    }
  }

  exportConfig( destination ) {
    // Clean out extras to make an easier to read JSON should someone want to hand edit it
    var traces = this.state.data;
    for ( const t in traces) {
        const keys = Object.keys( traces[t] )
        for ( const keyIdx in keys) {
            const key = keys[keyIdx];
            if ( key.concat('src') in traces[t] ) { delete traces[t][key] }
        }

        if ('meta' in traces[t]) { delete traces[t]['meta']}
    }

    var layout = this.state.layout;
    for (const ax in layout) {
        if ( layout[ax]['autorange']) { delete layout[ax]['range'] }
    }

    var configJson = { "traces": traces, "layout":layout, "frames":this.state.frames};
    //console.log(configJson)
    document.getElementById(destination).value = JSON.stringify(configJson, null, 2);

  }

  render() {
    return (
      <div className="app" >
        <PlotlyEditor
          ref={this.appRef}
          data={this.state.data}
          layout={this.state.layout}
          config={config}
          frames={this.state.frames}
          dataSources={this.state.dataValues}
          dataSourceOptions={Object.keys(this.state.dataValues)}
          plotly={plotly}
          onUpdate={(data, layout, frames) => this.setState({data, layout, frames})}
          useResizeHandler
          debug
        />
        </div>
    );
  }
}

export default App;


