import CanvasJSReact from './assets/canvasjs.react';
import React, { Component } from 'react';
import Chart from'chart.js';
var CanvasJSChart = CanvasJSReact.CanvasJSChart;
var startTime = 0, endTime = 0;
const moment = require('moment')
const addSubtractDate = require("add-subtract-date");
class Graph extends Component {
	state = {
		jsondata: [],
		splitdata: [],
		startTime1:'',
		startTime2:'',
		startTime3:'',
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
			// console.log(this.state.splitdata)
			var json = JSON.parse(this.state.splitdata)	
			var time1 = new Date(json[0].startTime)
			var time2 = new Date(json[1].startTime)
			var time3 = new Date(json[2].startTime)
			this.setState({startTime1: time1})
			this.setState({startTime2: time2})
			this.setState({startTime3: time3})

		}
		await this.setState({ jsondata: this.props.waveform})	
	}

	render() {
		var dataSeries = { type: "line" };
		var dataPoints = this.state.jsondata
		// var dataPoints =[{
		// 	x: new Date(2020, 2, 28, 11, 5, 21,100),
		// 	y: 41.58
		// 	},
		// 	{
		// 	x: new Date(2020, 2, 28, 11, 5, 22,200),
		// 	y: 41.50
		// 	}
		// 	];
		console.log(this.state.startTime1,this.state.startTime2,this.state.startTime3)
		this.state.data = []
		dataSeries.dataPoints = dataPoints;
		this.state.data.push(dataSeries);
		// console.log('data ',this.state.data);
		// const date1 = new Date(2020,2,2,11,53,33);
		// const date2 = new Date(2020,2,2,11,53,38);
		// const date3 = new Date(2020,2,2,11,53,44);

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
					value: this.state.startTime1,
					thickness: 1,
					color: "black",
				},
				{
					value: this.state.startTime2,
					thickness: 1,
					color: "black",
				},
				{
					value: this.state.startTime3,
					thickness: 1,
					color: "black",
				}],
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

           