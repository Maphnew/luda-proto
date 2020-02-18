import React, { Component } from 'react';

class PaletteGraph extends Component {
    handleClick=(event)=>{
        this.props.onGraphTypeSubmit(event.target.id)
    }

    render() {        
        return (            
            <div className="Recommended">
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