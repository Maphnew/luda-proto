import React from 'react';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import CanvasJSReact from './assets/canvasjs.react';

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

export {bubblechart,bar,stackedarea,area,scatter,table};