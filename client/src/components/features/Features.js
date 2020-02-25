import React, { Component } from 'react';
import Palette from './Palette';
import Graph from './Graph';
import './Features.css';

class Features extends Component {
    state = {
        graph : {},
        graphData : [],
        
    }

    // componentWillUnmount=()=> {
    //     console.log("fetch : componentWillUnmount")
    //     localStorage.setItem('featureReq',null)          
    // }

    onGraphShow=(getData)=> {
        this.setState({ graphData: getData});
    }

    onGraphType=(getData)=> {
        this.setState({graph: getData});
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
                        graphData={this.state.graphData} graph={this.state.graph}
                    />
                </div>
            </div>
        )        
    }
}

export default Features;