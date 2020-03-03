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
		// startTime1:'',
		// startTime2:'',
		// startTime3:'',
		start:[]
	  };

	componentDidMount() {
		endTime = new Date();
		startTime = new Date();
	}

	componentWillReceiveProps = async (nextProps) => {
		this.state.data = []
		if(nextProps.splitData.parts!== undefined){
			await this.setState({splitdata: nextProps.splitData.parts})
			// console.log(this.state.splitdata)
			var json = JSON.parse(this.state.splitdata)
			var jsonLen = Object.keys(json).length
			this.state.start = []
			for(let i=0; i < jsonLen; i++){
				var time = new Date(json[i].startTime)
				this.state.start.push(time)
			}
			
			// try{
			// 	var time1 = new Date(json[0].startTime)
			// 	this.setState({startTime1: time1})
			// }catch{
			// 	this.setState({startTime1: 0})
			// }	
			// try{
			// 	var time2 = new Date(json[1].startTime)
			// 	this.setState({startTime2: time2})
			// }catch{
			// 	this.setState({startTime2: 0})
			// }
			// try{
			// 	var time3 = new Date(json[2].startTime)
			// 	this.setState({startTime3: time3})
			// }catch{
			// 	this.setState({startTime3: 0})
			// }
		}
		await this.setState({ jsondata: this.props.waveform})	
	}

	render() {
		var dataSeries = { type: "line" };
		var dataPoints = this.state.jsondata
		//console.log(this.state.startTime1,this.state.startTime2,this.state.startTime3)
		this.state.data = []
		dataSeries.dataPoints = dataPoints;
		this.state.data.push(dataSeries);

		const spanStyle = {
			position:'absolute', 
			top: '10px',
			fontSize: '20px', 
			fontWeight: 'bold', 
			backgroundColor: '#d85757',
			padding: '0px 4px',
			color: '#ffffff'
		}
		const stripline = [{
			value: this.state.start[0],
			thickness: 1,
			color: "black",
		},
		{
			value: this.state.start[1],
			thickness: 1,
			color: "black",
		},
		{
			value: this.state.start[2],
			thickness: 1,
			color: "black",
		}
	];

		const options = {
			zoomEnabled: true,
			animationEnabled: true,
			title: {
				text: ""
			},
			axisX:{
				stripLines: stripline
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

           