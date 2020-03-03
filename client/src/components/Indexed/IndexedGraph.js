import CanvasJSReact from './assets/canvasjs.react';
import React, { Component } from 'react';
import Chart from'chart.js';
var CanvasJSChart = CanvasJSReact.CanvasJSChart;
var startTime = 0, endTime = 0;
const moment = require('moment')
class Graph extends Component {
	state = {
		jsondata: [],
		splitdata: [],
		data:[],
		start:[]
	  };

	componentDidMount() {
		endTime = new Date();
		startTime = new Date();
		// document.getElementById("timeToRender").innerHTML = "Time to Render: " + (endTime - startTime) + "ms";
	}

	componentWillReceiveProps = async (Props) => {
		this.state.data = []
		if(this.props.splitData.parts!== undefined){
			await this.setState({splitdata: this.props.splitData.parts})
			var json = JSON.parse(this.state.splitdata)	
			console.log("here",json) //선택했던 파형 2개 들어감, 앞에 파형만 들어가도록
		}
		await this.setState({ jsondata: this.props.waveform})
	
	}

	render() {
		var dataSeries = { type: "line" };
		var dataPoints = this.state.jsondata
		console.log('dataPoints',dataPoints);
		// var dataPoints =[{
		// 	x: new Date(2020, 2, 28, 11, 5, 21,100),
		// 	y: 41.58
		// 	},
		// 	{
		// 	x: new Date(2020, 2, 28, 11, 5, 22,200),
		// 	y: 41.50
		// 	}
		// 	];
		const date1 = new Date(2020,2,2,11,53,33);
		const date2 = new Date(2020,2,2,11,53,38);
		const date3 = new Date(2020,2,2,11,53,44);
		this.state.data = []
		dataSeries.dataPoints = dataPoints;
		this.state.data.push(dataSeries);
		// this.state.start.push(this.state.date[2])
	
		console.log('data ',this.state.data);

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
			axisX:{
				stripLines: [{
				value: date1,
				thickness: 1,
				color: "black",
				},
				{
					value: date2,
					thickness: 1,
					color: "black",
				}
				,
				{
					value: date3,
					thickness: 1,
					color: "black",
				}
			],
			  },
			data: this.state.data  // random data
			
		}
				
		return (
		<div>				
			<div className="WaveListGraph">
				<CanvasJSChart options = {options} onRef={ref => this.chart = ref}/>
				<span id="timeToRender" style={spanStyle}></span>
			</div>
		</div>
		);
	} 			
}
export default Graph;
           