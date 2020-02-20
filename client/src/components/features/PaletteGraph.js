import React, { Component } from 'react';
import Loading from 'react-loading-bar'
import 'react-loading-bar/dist/index.css'
import equal from 'fast-deep-equal'
import {featurePost} from './Fetch'

class PaletteGraph extends Component {
    state = {      
        isLoading: false,
        show: false,   
        featureReq:localStorage.getItem( 'featureReq' ),
    };    

    componentWillReceiveProps=async(nextProps)=>{
        if(!equal(this.props.values, nextProps.values)) // Check if it's a new user, you can also use some unique property, like the ID  (this.props.user.id !== prevProps.user.id)
        {
            if (nextProps.values.TagName===undefined){
                alert("Please enter data!")
                return
            }

            this.setState({ isLoading: true, show: true }); 
            let featureReq = JSON.parse( localStorage.getItem('featureReq'))
            if(featureReq.Table===undefined){
                await this.setState({ featureReq:{"Table":"WaveIndex","Feature":"max"}})   
            }
            else {
                await this.setState({ featureReq})
            }    

            const jsonPost = await featurePost(nextProps.values,this.state.featureReq)
            this.props.onGraphDataSubmit(jsonPost)

            this.setState({ isLoading: false, show: false });   
        }        
    }

    handleClick=(event)=>{
        this.props.onGraphTypeSubmit(event.target.id)
    }

    render() {        
        return (            
            <div className="Recommended">
                <Loading
                    show={this.state.show}
                    color="red"
                />
                <button id="Table" className="Table" onClick={this.handleClick}>Table</button>            
                <button id="Scatterplot" className="Scatterplot" onClick={this.handleClick}>Scatter plot</button>
                <br></br>
                <button id="Area" className="Area" onClick={this.handleClick}>Area</button>            
                <button id="StackedArea" className="StackedArea" onClick={this.handleClick}>Stacked Area</button>            
                <button id="Bar" className="Bar" onClick={this.handleClick}>Bar</button>            
                <button id="TaStackedBarble" className="StackedBar" onClick={this.handleClick}>Stacked Bar</button>            
                <br></br>
                <button id="StackedBar100" className="StackedBar100" onClick={this.handleClick}>100% Stacked Bar</button>            
                <button id="Biplot" className="Biplot" onClick={this.handleClick}>Biplot</button>            
                <button id="Boxplot" className="Boxplot" onClick={this.handleClick}>Boxplot</button>            
                <button id="BubbleChart" className="BubbleChart" onClick={this.handleClick}>Bubble Chart</button>    
                <br></br>
                <button id="Column" className="Column" onClick={this.handleClick}>Column</button>            
                <button id="StackedColumn" className="StackedColumn" onClick={this.handleClick}>Stacked Column</button>            
                <button id="Heartmap" className="Heatmap" onClick={this.handleClick}>Heart map</button>            
                <button id="StackedArea100" className="StackedArea100" onClick={this.handleClick}>100% Stacked Area</button>    
                <br></br>
                <button id="Card" className="Card" onClick={this.handleClick}>Card</button>            
                <button id="StackedColumn100" className="StackedColumn100" onClick={this.handleClick}>100% Stacked Column</button>            
                <button id="ComplexChart" className="ComplexChart" onClick={this.handleClick}>Complex Chart</button>            
                <button id="DecisionTree" className="DecisionTree" onClick={this.handleClick}>Decision Tree</button>    
        </div>
        );
    }
}

export default PaletteGraph;