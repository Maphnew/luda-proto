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
                await this.setState({graphData: nextProps.graphData})
            }
            else {
                await this.setState({graphData: nextProps.graphData["0"]})
            }
                      
            let featureReq = JSON.parse( localStorage.getItem('featureReq'))  
            if(nextProps.graph.graphType===undefined){
                await this.setState({graph:{graphType:"table",featureType:featureReq.feature}})  
            }
            else {
                await this.setState({graph:{graphType:nextProps.graph.graphType,featureType:featureReq.feature}})   
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
        var tempMap = {}
        this.state.graphData.map(item => {
            const moment = require('moment') 
            var requiredPattern = 'YYYY-MM-DD HH:mm:ss.SSS';
            var tempJson = {
                "x":new Date(moment(item.startTime).format(requiredPattern)),
                "y":parseFloat(item.values),
                "index_num":item.index_num,
                "index_date":item.index_date,
            }
            if (item.labels !== undefined){
                if (tempMap[item.labels] === undefined){
                    tempMap[item.labels] = [tempJson]
                }
                else {
                    tempMap[item.labels].push(tempJson)
                }                
            }
            tempValue.push(tempJson)
            return item;
          });

          if (Object.keys(tempMap).length !== 0)
          {
            // console.log(tempMap)
            return tempMap;
          }       

          return tempValue;
      }

    graphChoose = (graph) =>{          
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
        // console.log(this.props.graphData)
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