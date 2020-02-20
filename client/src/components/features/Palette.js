import React, { Component } from 'react';
import {NavLink , Route, BrowserRouter as Router} from 'react-router-dom'
import PaletteGraph from './PaletteGraph';
import PaletteFeature from './PaletteFeature';

class Palette extends Component {
    state = { 
        btnId : "btnInfo",
        graphData : [],
        graph : {},        
    };

    onGraphDataSubmit=(getData)=>{
        this.setState({ graphData: getData});        
        this.props.onGraphShow(getData)
    }

    onGraphTypeSubmit=async(graphType,featureType)=>{
        if (this.state.graph.graphType===undefined &&this.state.graph.featureType===undefined ){
            await this.setState({graph:{graphType:"table",featureType:"max"}})             
        }

        if (graphType!==undefined){
            await this.setState({graph:{ ...this.state.graph, graphType: graphType}}) 
        }

        else if (featureType!==undefined){
            await this.setState({graph:{ ...this.state.graph, featureType: featureType}}) 
        }        

        this.props.onGraphType(this.state.graph)
    }

    render() {
        return(
        <Router>
            <div>
                <div>
                    <h3 className = "PaletteTitle"> PALETTE</h3> 
                    <div className="ButtonEntry"> 
                        <NavLink  to="/features/feature" activeClassName="ButtonClick">
                            <div className="ButtonDefault">
                                Feature
                            </div>
                            {/* <button id="btnFeature" className={this.state.btnId==="btnFeature" ? "ButtonClick": "ButtonDefault"} onClick={this.handleClick}>Feature</button> */}
                        </NavLink >
                        <NavLink  to="/features/graph" activeClassName="ButtonClick">
                            <div className="ButtonDefault">
                                Graph
                            </div>
                            {/* <button id="btnGraph" className={this.state.btnId==="btnGraph"  ? "ButtonClick": "ButtonDefault"} onClick={this.handleClick}>Graph</button> */}
                        </NavLink >    
                    </div> 
                </div>
                <div> 
                    <Route 
                        path='/features/feature' 
                        render={() => <PaletteFeature values={this.props.values}  onGraphDataSubmit={this.onGraphDataSubmit}  onGraphTypeSubmit={this.onGraphTypeSubmit}/> }
                    />

                    <Route 
                        path='/features/graph' 
                        render={() => <PaletteGraph values={this.props.values}  onGraphDataSubmit={this.onGraphDataSubmit} onGraphTypeSubmit={this.onGraphTypeSubmit}/> }
                    /> 

                </div>
            </div>
        </Router>)
        
    }
}

export default Palette;