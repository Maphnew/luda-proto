import React from 'react';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import CanvasJSReact from './assets/canvasjs.react';
import { render } from 'react-dom';
import ReactHighchart from 'react-highcharts';
import HighchartMore from 'highcharts/highcharts-more';

const table = (data,feature,onMylist) =>{     
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
            onMylist(data)
        } else {
            await localStorage.setItem('selectChartData', JSON.stringify([]))
            onMylist([])
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
        onMylist(selectChartData)
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

const scatter = (data,feature,onMylist) =>{            
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
                selectChartData.push({startTime:startTime, stopTime:e.dataPoint.stopTime, index_date:e.dataPoint.index_date, index_num: e.dataPoint.index_num})
            }
        }
        catch {
            const moment = require('moment') 
            const startTime = moment(e.dataPoint.x).format('YYYY-MM-DD HH:mm:ss.SSS');               
            selectChartData.push({startTime:startTime, stopTime:e.dataPoint.stopTime, index_date:e.dataPoint.index_date, index_num: e.dataPoint.index_num})
        }            
        onMylist(selectChartData)
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

function Quartile(values, q){
    if(values.length ===0) return 0;

    values.sort(function(a,b){
        return a-b;
    });

    var quartile = Math.floor(values.length * q);

    if (q == 1)
        return Math.floor(values[values.length-1]*100)/100

    if (values.length % (1/q))
        return Math.floor(values[quartile]*100)/100
     
    return  Math.floor((values[quartile - 1] + values[quartile]) * q * 100)/100

}

HighchartMore(ReactHighchart.Highcharts);          
const boxplot = (data,feature) =>{     
    var chartData = new Array()
    var chartLabel = new Array()

     if (Object.prototype.toString.call(data) !== '[object Array]') {    
        var tempArr = new Array()   
        Object.keys(data).map(record => {            
            data[record].map(function (item) {
                tempArr.push(item.y)
                return item
            })           

            const yValues = [Quartile(tempArr,0),Quartile(tempArr,0.25),Quartile(tempArr,0.5),Quartile(tempArr,0.75),Quartile(tempArr,1)]            
            // const labelInfo =  {"label" :  record, "y": yValues}
            // chartData.push(labelInfo)
            chartLabel.push(record)
            chartData.push(yValues)
            return data
        })        
    }      
    else {
        var tempJson = new Object()
        data.map(record => {
            if (tempJson[record.index_date] === undefined) {
                tempJson[record.index_date] = new Array
            }
            tempJson[record.index_date].push(record.y)
            return record
        })

        Object.keys(tempJson).map(key => {
            const yValues = [Quartile(tempJson[key],0),Quartile(tempJson[key],0.25),Quartile(tempJson[key],0.5),Quartile(tempJson[key],0.75),Quartile(tempJson[key],1)]
            //const labelInfo =  {"label" :  key, "y": tempJson[key]}
            chartLabel.push(key)
            chartData.push(yValues)
            return key
        })

    }
    console.log(chartData)
    const options ={
        chart: {
                type: 'boxplot'
            },

            title: {
                text: 'Box Plot'
            },

            legend: {
                enabled: false
            },

            xAxis: {
                categories: chartLabel,
                title: {
                    text: 'label'
                }
            },

            yAxis: {
                title: {
                    text: feature
                }
            },

            series: [{
                //name: 'Observations',
                tooltip: {
                    headerFormat: '<em>Label : {point.key}</em><br/>'
                },
                data:chartData
            }]
    }
    
    return (
      <div>
        <ReactHighchart config={options} />
      </div>
    );
  

    // var CanvasJSChart = CanvasJSReact.CanvasJSChart;
    // var chartData = new Array()

    //  if (Object.prototype.toString.call(data) !== '[object Array]') {    
    //     var tempArr = new Array()   
    //     Object.keys(data).map(record => {            
    //         data[record].map(function (item) {
    //             tempArr.push(item.y)
    //             return item
    //         })           

    //         const yValues = [Quartile(tempArr,0),Quartile(tempArr,0.25),Quartile(tempArr,0.5),Quartile(tempArr,0.75),Quartile(tempArr,1)]            
    //         const labelInfo =  {"label" :  record, "y": yValues}
    //         chartData.push(labelInfo)
    //         return data
    //     })        
    // }      
    // else {
    //     var tempJson = new Object()
    //     data.map(record => {
    //         if (tempJson[record.index_date] === undefined) {
    //             tempJson[record.index_date] = new Array
    //         }
    //         tempJson[record.index_date].push(record.y)
    //         return record
    //     })

    //     Object.keys(tempJson).map(key => {
    //         tempJson[key] = [Quartile(tempJson[key],0),Quartile(tempJson[key],0.25),Quartile(tempJson[key],0.5),Quartile(tempJson[key],0.75),Quartile(tempJson[key],1)]
    //         const labelInfo =  {"label" :  key, "y": tempJson[key]}
    //         chartData.push(labelInfo)
    //     })

    // }

    // const options = {
	// 		theme: "light2",
	// 		animationEnabled: true,

	// 		title:{
	// 			text: "Box Plot"
	// 		},

	// 		axisY: {
	// 			title: feature,
	// 			includeZero: false
	// 		},

	// 		data: [{
    //             type: "boxAndWhisker",
    //             color: "black",
    //             upperBoxColor: "#FFC28D",
	// 	        lowerBoxColor: "#9ECCB8",
    //             //yValueFormatString: "#,##0.# \"kcal/100g\"",
    //             // dataPoints: chartData
    //             dataPoints: [
    //                 { x: new Date(2017, 6, 3),  y: [4, 6, 7, 8, 9] },
    //                 { x: new Date(2017, 6, 4),  y: [4, 6, 8, 9, 7] },
    //                 { x: new Date(2017, 6, 5),  y: [4, 6, 9, 8, 7] },
    //                 { x: new Date(2017, 6, 6),  y: [4, 6, 7, 9, 8] },
    //                 { x: new Date(2017, 6, 7),  y: [6, 4, 7, 8, 9] },
    //                 { x: new Date(2017, 6, 8),  y: [6, 4, 8, 9, 7] },
    //                 { x: new Date(2017, 6, 9),  y: [6, 4, 7, 9, 8] }
    //             ]
    //         }]

	// 	}
	// 	return (
	// 	<div>
	// 		<CanvasJSChart options = {options}
	// 			/* onRef={ref => this.chart = ref} */
	// 		/>
	// 		{/*You can get reference to the chart instance as shown above using onRef. This allows you to access all chart properties and methods*/}
	// 	</div>
	// 	);
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



export {bubblechart,bar,stackedarea,area,scatter,table,boxplot};