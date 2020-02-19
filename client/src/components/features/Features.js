import React, { Component } from 'react';
import Palette from './Palette';
import Graph from './Graph';
import './Features.css';

class Features extends Component {
    state = {
        graphData : [],
        graphType : "",
    }

    onGraphShow=(getData)=> {
        this.setState({ graphData: getData});
    	//console.log('test',this.state.graphData);
    }

    onGraphType=(getData)=> {
        this.setState({ graphType: getData});
    	//console.log('test',this.state.graphData);
    }

    render() {
        return(
            <div className="FeaturesEntry">
                <div className="PaletteEntry">
                    <Palette
                        onGraphShow={this.onGraphShow} onGraphType={this.onGraphType} values={this.props.values}
                    />      
                </div>
                <div className="GraphEntry" >
                    <Graph
                        graphData={this.state.graphData} graphType={this.state.graphType}
                    />
                </div>
            </div>
        )        
    }
}

export default Features;