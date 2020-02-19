import React, { Component } from 'react';
import {Link, Route, BrowserRouter as Router} from 'react-router-dom'
import PaletteGraph from './PaletteGraph';
import PaletteFeature from './PaletteFeature';

class Palette extends Component {
    state = { 
        btnId : "btnInfo",
        graphData : [],
        graphType : "",
    };

    onFormSubmit=(getData)=>{
        this.setState({ sendData: getData});
        //console.log("Get : ",getData,this.state.sendData)
        //this.props.onGraphShow(getData)
    }

    onGraphDataSubmit=(getData)=>{
        this.setState({ graphData: getData});
        // console.log("Get : ",getData,this.state.graphData)
        this.props.onGraphShow(getData)
    }

    onGraphTypeSubmit=(getData)=>{
        this.setState({ graphType: getData});
        // console.log("Get : ",getData,this.state.graphData)
        this.props.onGraphType(getData)
    }

    handleClick=(event)=>{               
        const id = event.target.id;
        this.setState({
            btnId: id,
        });        
    }

    render() {
        return(
        <Router>
            <div>
                <div>
                    <h3 className = "PaletteTitle"> PALETTE</h3> 
                    <div className="ButtonEntry"> 
                        <Link to="/features/feature" className="ButtonEach">
                            <button id="btnFeature" className={this.state.btnId==="btnFeature" ? "ButtonClick": "ButtonDefault"} onClick={this.handleClick}>Feature</button>
                        </Link>
                        <Link to="/features/graph" className="ButtonEach">
                            <button id="btnGraph" className={this.state.btnId==="btnGraph"  ? "ButtonClick": "ButtonDefault"} onClick={this.handleClick}>Graph</button>
                        </Link>    
                    </div> 
                </div>
                <div> 
                    <Route 
                        path='/features/feature' 
                        render={() => <PaletteFeature values={this.props.values} onFormSubmit={this.onFormSubmit}  onGraphDataSubmit={this.onGraphDataSubmit}/> }
                    />

                    <Route 
                        path='/features/graph' 
                        render={() => <PaletteGraph onGraphTypeSubmit={this.onGraphTypeSubmit}/> }
                    /> 

                </div>
            </div>
        </Router>)
        
    }
}

export default Palette;