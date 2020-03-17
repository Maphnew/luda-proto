import React, { Component } from 'react';
import Palette from './Palette';
import Graph from './Graph';
import './Features.css';

class Features extends Component {
    state = {
        graph : {},
        graphData : [],
        mylist : [],        
    }

    onMylist=(getData)=> {
        this.setState({ mylist: getData}); 
    }

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
                        onGraphShow={this.onGraphShow} onGraphType={this.onGraphType} values={this.props.values} mylist={this.state.mylist}
                    />      
                </div>
                <div className="GraphEntry" >
                    <Graph
                        graphData={this.state.graphData} graph={this.state.graph} onMylist={this.onMylist}
                    />
                </div>
            </div>
        )        
    }
}

export default Features;