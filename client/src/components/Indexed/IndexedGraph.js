import CanvasJSReact from './assets/canvasjs.react';
import React, { Component } from 'react';
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

var startTime = 0, endTime = 0;
 
class Graph extends Component {
	state = {
		jsondata: [],
		data:[]
	  };

	componentDidMount() {
		endTime = new Date();
		startTime = new Date();
		// document.getElementById("timeToRender").innerHTML = "Time to Render: " + (endTime - startTime) + "ms";
	}
	
	componentWillReceiveProps = async (nextProps) => {
		// document.getElementById("timeToRender").innerHTML = "Time to Render: " + (endTime - startTime) + "ms";
		console.log("waveform",this.props.waveform)
		this.setState({ jsondata: this.props.waveform})
	}

	render() {
		var limit = 100;
		var y = 100;    
		var dataSeries = { type: "line" };
		var dataPoints = this.state.jsondata;

		dataSeries.dataPoints = dataPoints;
		this.state.data.push(dataSeries);
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
			data: this.state.data  // random data
		}
				
		return (
			<div>
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
           