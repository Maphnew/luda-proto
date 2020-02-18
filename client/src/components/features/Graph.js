import React, { Component } from 'react';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import CanvasJSReact from './assets/canvasjs.react';

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
    
    onShow = ()=> {
        console.log("")
        this.setState({ show: true })
      }
    
    onHide = ()=> {
        console.log("onHide")
        this.setState({ show: false })
      }

    render() {
        const table = (data) =>{ 
            return (
            <div>                
                <BootstrapTable data={data}>
                    <TableHeaderColumn isKey dataField='startTime'>
                        StartTime
                    </TableHeaderColumn>
                    <TableHeaderColumn dataField='stopTime'>
                        StopTime
                    </TableHeaderColumn>
                    <TableHeaderColumn dataField='values'>
                        Value
                    </TableHeaderColumn>
                </BootstrapTable>         
            </div>
            )
        }

        const scatter = (data) =>{            
            var CanvasJSChart = CanvasJSReact.CanvasJSChart;
            const options = {
                theme: "light2",
                animationEnabled: true,
                zoomEnabled: true,
                axisX: {
                    title:"StartTime",
                    suffix: "",
                    crosshair: {
                        enabled: true,
                        snapToDataPoint: true
                    }                    
                },
                axisY:{
                    title: "Data",
                    includeZero: false,
                    crosshair: {
                        enabled: true,
                        snapToDataPoint: true
                    },
                    minimum : 0
                },
                data: [{
                    type: "scatter",
                    markerSize: 15,
                    toolTipContent: "<b>StartTime: </b>{x}<br/><b>Data: </b>{y}",
                    dataPoints: data
                }]
            }
            return(
                <div>
                    <CanvasJSChart options = {options}
				/* onRef={ref => this.chart = ref} */
			/>
                </div>
            )
        }

        const area = (data) =>{            
            var CanvasJSChart = CanvasJSReact.CanvasJSChart;
            const options = {
                theme: "light2",
                animationEnabled: true,
                exportEnabled: true,
                axisY: {
                    title: "Data",
                    includeZero: false,
                },
                data: [
                {
                    type: "area",
                    xValueFormatString: "YYYY",
                    yValueFormatString: "#,##0.## Million",
                    dataPoints: data
                }
                ]
            }
            return (
            <div>
                <CanvasJSChart options = {options}
                    /* onRef={ref => this.chart = ref} */
                />
                {/*You can get reference to the chart instance as shown above using onRef. This allows you to access all chart properties and methods*/}
            </div>
            );
        }

        const stackedarea = (data) =>{            
            var CanvasJSChart = CanvasJSReact.CanvasJSChart;
            const options = {
                theme: "light2",
                animationEnabled: true,
                exportEnabled: true,
                axisY: {
                    title: "Data",
                    includeZero: false,
                },
                data: [
                {
                    type: "area",
                    xValueFormatString: "YYYY",
                    yValueFormatString: "#,##0.## Million",
                    dataPoints: data
                }
                ]
            }
            return (
            <div>
                <CanvasJSChart options = {options}
                    /* onRef={ref => this.chart = ref} */
                />
                {/*You can get reference to the chart instance as shown above using onRef. This allows you to access all chart properties and methods*/}
            </div>
            );
        }

        const bar = (data) => {
            var CanvasJSChart = CanvasJSReact.CanvasJSChart;
            const options = {
                animationEnabled: true,
                theme: "light2",
                axisX: {
                    reversed: true,
                },
                axisY: {
                    title: "Data",
                    //labelFormatter: this.addSymbols
                },
                data: [{
                    type: "bar",
                    dataPoints: data
                }]
            }
            return (
            <div>
                <CanvasJSChart options = {options}
                    /* onRef={ref => this.chart = ref} */
                />
                {/*You can get reference to the chart instance as shown above using onRef. This allows you to access all chart properties and methods*/}
            </div>
            );
        }

        const bubblechart = (data) => {
            var CanvasJSChart = CanvasJSReact.CanvasJSChart;
            const options = {
                animationEnabled: true,
                exportEnabled: true,
                theme: "light2", // "light1", "light2", "dark1", "dark2"
                axisX: {
                    logarithmic: true
                },
                axisY: {
                    title: "Data"
                },
                data: [{
                    type: "bubble",
                    indexLabel: "{label}",
                    toolTipContent: "<b>StartTime: </b>{x}<br/><b>Data: </b>{y}",
                    dataPoints: data
                }]
            }
            return (
            <div>
                <CanvasJSChart options = {options}
                    /* onRef={ref => this.chart = ref} */
                />
                {/*You can get reference to the chart instance as shown above using onRef. This allows you to access all chart properties and methods*/}
            </div>
            );
        }

        const graphChoose = (graph) =>{            
            if (graph==="" || graph==="table"){
                return(
                    <div>
                        {table(this.state.graph)}
                    </div>                    
                )
            }

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

            if(graph==="scatterplot"){
                return(
                    <div>
                        {scatter(tempValue)}
                    </div>
                    
                )      
            }
            else if (graph==="area"){
                return(
                    <div>
                        {area(tempValue)}
                    </div>                    
                )            
            }
            else if (graph==="stackedarea"){
                return(
                    <div>
                        {stackedarea(tempValue)}
                    </div>                    
                )            
            }
            else if (graph==="bar"){
                return(
                    <div>
                        {bar(tempValue)}
                    </div>                    
                )            
            }
            else if (graph==="bubblechart"){
                return(
                    <div>
                        {bubblechart(tempValue)}
                    </div>                    
                )            
            }
        }

        console.log("data_length : ",this.props.graphData.length,"type : ",this.state.graphType)
        if (this.props.graphData.length ===undefined) {  
            return(
                <div>
                    <div>   
                        {this.btn_SplitWaveform()}      
                        <p className="buttontext">button</p>
                    </div>    
                    <div>                                   
                        {graphChoose(this.state.graphType)}        
                    </div>          
                </div>                
            )
        }
        else {
            return(
                <div>                   
                    {graphChoose(this.state.graphType)}
                </div>                
            )
        }        
    }
}

export default Graph;