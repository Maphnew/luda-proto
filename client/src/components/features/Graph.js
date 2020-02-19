import React, { Component } from 'react';
import {bubblechart,bar,stackedarea,area,scatter,table} from './Chart';

class Graph extends Component { 
    state = {
        graph : [], 
        graphSplit : {},       
        conversionValue:[],
        graphType : "",
    }

    componentWillReceiveProps(nextProps){
        if (nextProps.graphData.length!==undefined){
            this.setState({graph: nextProps.graphData})
        }
        else {
            this.setState({graph: nextProps.graphData["0"]})
        }
        this.setState({graphType: nextProps.graphType.toLowerCase()},() => {
            if (this.state.graphType===""){
                this.setState({graphType: "table"})
            }
        })        
    }

    btn_SplitWaveform=()=>{
        const split= Object.entries(this.props.graphData).map(([key,value]) => {
            return (             
                <button id={key} key={key}  className="graphbutton" onClick={((e) => this.handleClick(e, value))}>{ key }</button>
                // <div>{key} : {value.toString()}</div>
            );
        })        
        return split;
    }

    handleClick = (e, value) =>{      
        this.setState({graph:value})
    }    
    rawToxyData = ()=> {
        var tempValue = []
        this.state.graph.map(item => {
            const moment = require('moment') 
            var requiredPattern = 'YYYY-MM-DD HH:mm:ss.SSS';
            var tempJson = {
                "x":new Date(moment(item.startTime).format(requiredPattern)),
                "y":parseFloat(item.values),

            }
            tempValue.push(tempJson)
            return item;
          });
          return tempValue;
      }

    graphChoose = (graph) =>{            
    if (graph==="" || graph==="table"){
        return(
            <div>
                {table(this.state.graph)}
            </div>                    
        )
    }

    var tempValue = this.rawToxyData();
    //console.log(tempValue)
    switch(graph) {
        case 'scatterplot':
            return(
                <div>
                    {scatter(tempValue)}
                </div>
                
            )      
        case 'area':
            return(
                <div>
                    {area(tempValue)}
                </div>                    
            ) 
        case 'stackedarea':
            return(
                <div>
                    {stackedarea(tempValue)}
                </div>                    
            ) 
        case 'bar':
            return(
                <div>
                    {bar(tempValue)}
                </div>                    
            ) 
        case 'bubblechart':
            return(
                <div>
                    {bubblechart(tempValue)}
                </div>                    
            ) 
        default:
            return null;
    }
}

    render() {            
        
        console.log("data_length : ",this.props.graphData.length,"type : ",this.state.graphType)
        if (this.props.graphData.length ===undefined) {  
            return(
                <div>
                    <div>   
                        {this.btn_SplitWaveform()}      
                        <p className="buttontext">button</p>
                    </div>    
                    <div>                                   
                        {this.graphChoose(this.state.graphType)}        
                    </div>          
                </div>                
            )
        }
        else {
            return(
                <div>                   
                    {this.graphChoose(this.state.graphType)}
                </div>                
            )
        }
    }        
    
}

export default Graph;