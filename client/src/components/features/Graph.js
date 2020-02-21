import React, { Component } from 'react';
import {bubblechart,bar,stackedarea,area,scatter,table} from './Chart';
import equal from 'fast-deep-equal'
class Graph extends Component { 
    state = {
        graphData : [], 
        graphSplit : {},       
        graph : "",
    }

    componentWillReceiveProps=async(nextProps)=>{
        if(!equal(this.props, nextProps)){
            if (nextProps.graphData.length!==undefined){
                this.setState({graphData: nextProps.graphData})
            }
            else {
                this.setState({graphData: nextProps.graphData["0"]})
            }

            if (nextProps.graph.graphType===undefined &&nextProps.graph.featureType===undefined ){
                await this.setState({graph:{graphType:"table",featureType:"max"}})             
            }
            else {
                await this.setState({graph: nextProps.graph})   
            }
            
        }
      
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
        this.setState({graphData:value})
    }    
    rawToxyData = ()=> {
        var tempValue = []
        this.state.graphData.map(item => {
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
        // console.log("graph",graph)            
        if (graph==="table"){            
            if(this.state.graphData.length>0){
                return(
                    <div>
                        {table(this.state.graphData,this.state.graph.featureType)}
                    </div>                    
                )
            }
            else {
                alert("No data")
            }

        }

        var tempValue = this.rawToxyData();
        //console.log(tempValue)
        switch(graph) {
            case 'scatterplot':
                return(
                    <div>
                        {scatter(tempValue,this.state.graph.featureType)}
                    </div>
                    
                )      
            case 'area':
                return(
                    <div>
                        {area(tempValue,this.state.graph.featureType)}
                    </div>                    
                ) 
            case 'stackedarea':
                return(
                    <div>
                        {stackedarea(tempValue,this.state.graph.featureType)}
                    </div>                    
                ) 
            case 'bar':
                return(
                    <div>
                        {bar(tempValue,this.state.graph.featureType)}
                    </div>                    
                ) 
            case 'bubblechart':
                return(
                    <div>
                        {bubblechart(tempValue,this.state.graph.featureType)}
                    </div>                    
                ) 
            default:
                return null;
        }
    }

    render() {                   
        //console.log("data_length : ",this.props.graphData.length,"type : ",this.state.graph)
        if (this.props.graphData.length ===undefined) {  
            return(
                <div>
                    <div>   
                        {this.btn_SplitWaveform()}      
                        <p className="buttontext">button</p>
                    </div>    
                    <div>                                   
                        {this.graphChoose(this.state.graph.graphType)}        
                    </div>          
                </div>                
            )
        }
        else {
            return(
                <div>                   
                    {this.graphChoose(this.state.graph.graphType)}
                </div>                
            )
        }
    }        
    
}

export default Graph;