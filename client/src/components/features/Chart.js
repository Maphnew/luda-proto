import React from 'react';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import CanvasJSReact from './assets/canvasjs.react';

const table = (data,feature) =>{     
    const findSelected = () => { 
        var selectChartData=[]
        try {
            selectChartData = JSON.parse( localStorage.getItem('selectChartData'))
            var returnValue = []
            selectChartData.map(function (record)  {           
                returnValue.push(record.startTime)
                return record;
            })
            return returnValue
        }
        catch {
            return []
        } 
    }
    const selected = findSelected()
    const onSelectAll = async(isSelected) => {               
        if (isSelected) {
            await localStorage.setItem('selectChartData', JSON.stringify(data))
        } else {
            await localStorage.setItem('selectChartData', JSON.stringify([]))
        }
    }

    const onRowSelect = async(row, isSelected) => {        
        let selectChartData=[]
        try {
            selectChartData = JSON.parse( localStorage.getItem('selectChartData'))
            const index = selectChartData.findIndex(item => item.index_date ===  row.index_date && item.index_num ===  row.index_num);
            if (index > -1) { //Make sure item is present in the array, without if condition, -n indexes will be considered from the end of the array.
                selectChartData.splice(index, 1);
            }
            else {
                selectChartData.push(row)
            }
        }
        catch {
            selectChartData.push(row)
        }    

        await localStorage.setItem('selectChartData', JSON.stringify(selectChartData))
    }

    var selectRowProp = {
      mode: 'checkbox',
      clickToSelect: true,
      // unselectable: [2],
      selected: selected,
      onSelect: onRowSelect,
      onSelectAll: onSelectAll,
      bgColor: "rgb(173, 168, 255)" ,
    };    
    return (
    <div>                
        Table
        <BootstrapTable 
        data={data}
        selectRow={selectRowProp} 
        pagination={true}
        >
            <TableHeaderColumn isKey dataField='startTime'>
                StartTime
            </TableHeaderColumn>
            <TableHeaderColumn dataField='stopTime'>
                StopTime
            </TableHeaderColumn>
            <TableHeaderColumn dataField='values'>
                {feature}
            </TableHeaderColumn>
            {
                data[0].labels !== undefined ? 
                    (<TableHeaderColumn dataField='labels'>
                            label
                    </TableHeaderColumn>)
                    : (<></>)
            }
        </BootstrapTable>         
    </div>
    )
}

const scatter = (data,feature) =>{            
    var CanvasJSChart = CanvasJSReact.CanvasJSChart;
    var chartData = []

    async function onClick(e) {
        let selectChartData=[]
        try {
            selectChartData = JSON.parse( localStorage.getItem('selectChartData'))
            const index = selectChartData.findIndex(item => item.index_date ===  e.dataPoint.index_date && item.index_num ===  e.dataPoint.index_num);
            if (index > -1) { //Make sure item is present in the array, without if condition, -n indexes will be considered from the end of the array.
                selectChartData.splice(index, 1);
            }
            else {
                const moment = require('moment') 
                const startTime = moment(e.dataPoint.x).format('YYYY-MM-DD HH:mm:ss.SSS');               
                selectChartData.push({startTime:startTime, index_date:e.dataPoint.index_date, index_num: e.dataPoint.index_num})
            }
        }
        catch {
            const moment = require('moment') 
            const startTime = moment(e.dataPoint.x).format('YYYY-MM-DD HH:mm:ss.SSS');               
            selectChartData.push({startTime:startTime, index_date:e.dataPoint.index_date, index_num: e.dataPoint.index_num})
        }            
        await localStorage.setItem('selectChartData', JSON.stringify(selectChartData))
    }

    if (Object.prototype.toString.call(data) !== '[object Array]') {        
        Object.keys(data).map(function (record) {
            // console.log(record)
            const chart = {
                type: "scatter",
                name: record,
                showInLegend: true,
                legendText : record,
                click: onClick,
                markerSize: 15,
                xValueFormatString:"YYYY-MM-DD HH:mm:ss.fff",
                toolTipContent: "<b>StartTime: </b>{x}<br/><b>Data: </b>{y}",
                dataPoints: data[record]
            }
            chartData.push(chart)
            return chartData
        })        
    }      
    else {
        chartData = [{
            type: "scatter",
            markerSize: 15,
            click: onClick,
            xValueFormatString:"YYYY-MM-DD HH:mm:ss.fff",
            toolTipContent: "<b>StartTime: </b>{x}<br/><b>Data: </b>{y}",
            dataPoints: data
        }]
    }
    //console.log(chartData)

    const options = {
        theme: "light2",
        animationEnabled: true,
        zoomEnabled: true,
        title: {
            text: "Scatter Chart"
        },
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
            // minimum : 0
        },

        data: chartData
    }


    return(
        <div>
            <CanvasJSChart options = {options}/>
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
            xValueFormatString:"YYYY-MM-DD HH:mm:ss.fff",
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
            xValueFormatString:"YYYY-MM-DD HH:mm:ss.fff",
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