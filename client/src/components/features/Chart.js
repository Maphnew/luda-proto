import React from 'react';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import CanvasJSReact from './assets/canvasjs.react';

const table = (data,feature) =>{ 
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
                {feature}
            </TableHeaderColumn>
        </BootstrapTable>         
    </div>
    )
}

const scatter = (data,feature) =>{            
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
            title: feature,
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

const area = (data,feature) =>{            
    var CanvasJSChart = CanvasJSReact.CanvasJSChart;
    const options = {
        theme: "light2",
        animationEnabled: true,
        exportEnabled: true,
        axisY: {
            title: feature,
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

const stackedarea = (data,feature) =>{            
    var CanvasJSChart = CanvasJSReact.CanvasJSChart;
    const options = {
        theme: "light2",
        animationEnabled: true,
        exportEnabled: true,
        axisY: {
            title:  feature,
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

const bar = (data,feature) => {
    var CanvasJSChart = CanvasJSReact.CanvasJSChart;
    const options = {
        animationEnabled: true,
        theme: "light2",
        axisX: {
            reversed: true,
        },
        axisY: {
            title: feature,
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

const bubblechart = (data,feature) => {
    var CanvasJSChart = CanvasJSReact.CanvasJSChart;
    const options = {
        animationEnabled: true,
        exportEnabled: true,
        theme: "light2", // "light1", "light2", "dark1", "dark2"
        axisX: {
            logarithmic: true
        },
        axisY: {
            title: feature   
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

export {bubblechart,bar,stackedarea,area,scatter,table};