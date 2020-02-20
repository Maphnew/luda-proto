import CanvasJSReact from './canvasjs.react';
import React, { Component } from 'react';
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

var startTime = 0, endTime = 0;
 
class Graph extends Component {

	componentDidMount() {
		endTime = new Date();
		// document.getElementById("timeToRender").innerHTML = "Time to Render: " + (endTime - startTime) + "ms";
	}
	
	render() {
		var limit = 100;
		var y = 100;    
		var data = [];
		var dataSeries = { type: "line" };
		var dataPoints = [
			{
				x: new Date(2020, 2, 20, 10, 33, 30, 0),
				y: 1,
			  },
			  {
				x: new Date(2020, 2, 20, 10, 34, 31, 0),
				y: 3,
			  },
			  {
				x: new Date(2020, 2, 20, 10, 35, 32, 0),
				y: 2,
			  },
			  
		];

		dataSeries.dataPoints = dataPoints;
		data.push(dataSeries);
		// console.log(test);
		const spanStyle = {
			position:'absolute', 
			top: '10px',
			fontSize: '20px', 
			fontWeight: 'bold', 
			backgroundColor: '#d85757',
			padding: '0px 4px',
			color: '#ffffff'
		}
		
		const options = {
			zoomEnabled: true,
			animationEnabled: true,
			title: {
				text: ""
			},
			axisY: {
				includeZero: false
			},
			data: data  // random data
		}
		
		startTime = new Date();
				
		return (
			<div>
			<button className="Reset_btn">Reset</button>
            <button className="Save_btn">Save</button>
            <div className="WaveListGraph">
		
			<CanvasJSChart options = {options} 
				 onRef={ref => this.chart = ref}
			/>
			{/*You can get reference to the chart instance as shown above using onRef. This allows you to access all chart properties and methods*/}
			<span id="timeToRender" style={spanStyle}></span>
		</div>
		</div>
		);
	} 			
}
export default Graph;
           