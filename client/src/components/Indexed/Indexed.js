import React, { Component } from 'react';
import './Indexed.css';
import GraphTable from './GraphTable';
import IndexedGraph from './IndexedGraph';
import WaveListTable from './WaveListTable';
import equal from 'fast-deep-equal'

class Index extends Component {
  state = {
    date: new Date(),
    waveMaster: [],
    selectedOption: {},
    startdate: new Date(),
    stopdate: new Date(), 
    wavelist: [],
    json: [],
    graphData: {},
    Item:'',
    starttime : {}
  }

  componentWillReceiveProps = async (nextProps) => {
    if (!equal(this.props.values, nextProps.values)) // Check if it's a new user, you can also use some unique property, like the ID  (this.props.user.id !== prevProps.user.id)
    {
      const params = { "TagName": nextProps.values.TagName, "StartTime": nextProps.values.StartTime, "StopTime": nextProps.values.StopTime }
      console.log(params)
      fetch("http://192.168.100.175:5000/indexed/wavelist", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': '*/*'
        },
        body: JSON.stringify(params)
        //body: '"Tagname":"S1.HisI"'
      })
        .then(response => response.json())
        .then((json) => {
          //console.log(json)
          const moment = require('moment')
          var requiredPattern = 'YYYY-MM-DD HH:mm:ss.SSS';

          JSON.stringify(json.map(function (record) {
            record.startTime = moment(record.startTime).format(requiredPattern);
            record.stopTime = moment(record.stopTime).format(requiredPattern);
            return record;
          }));
          this.setState({ wavelist: json })
          console.log('wavelist',this.state.wavelist)
        })
        .catch(err => console.log(err));
    }
  }

  onGraphData=async(getData)=> {
    const rowValue = {
      "index_date": getData.index_date,
      "index_num": getData.index_num,
      "parts": getData.parts
    };
    await this.setState({ graphData: rowValue});
    //console.log("set",typeof(this.state.graphData),this.state.graphData)

    const params = { "TagName": this.state.Item, "StartTime": getData.startTime, "StopTime": getData.stopTime }
    // console.log(params)
    fetch("http://192.168.100.175:5000/indexed/waveform", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*'
      },
      body: JSON.stringify(params)
      //body: '"Tagname":"S1.HisI"'
    })
      .then(response => response.json())
      .then((json) => {
        //console.log(json)

        JSON.stringify(json.map(function (record) {
          record.x = new Date(record.x);
          return record;
        }));
      
        this.setState({ waveformData: json })

        //  console.log("waveformData",this.state.waveformData);
      })
      .catch(err => console.log(err));

  }

  onGraphChange=async()=>{
    const params = { "TagName": this.props.values.TagName, "StartTime": this.props.values.StartTime, "StopTime": this.props.values.StopTime }
    fetch("http://192.168.100.175:5000/indexed/wavelist", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*'
      },
      body: JSON.stringify(params)
      //body: '"Tagname":"S1.HisI"'
    })
      .then(response => response.json())
      .then((json) => {
        //console.log(json)
        const moment = require('moment')
        var requiredPattern = 'YYYY-MM-DD HH:mm:ss.SSS';

        JSON.stringify(json.map(function (record) {
          record.startTime = moment(record.startTime).format(requiredPattern);
          record.stopTime = moment(record.stopTime).format(requiredPattern);
          return record;
        }));
        this.setState({ wavelist: json })
      })
      .catch(err => console.log(err));    
}

  render() {
    // const wavelist = []
    // this.state.waveMaster.map(function(item){
    //   wavelist.push(item);
    //   console.log(wavelist)
    //   return wavelist;
    // })

    return (
      <div>
        <div className="Layout1">
          <div className="Total">
            <WaveListTable
               wavelist={this.state.wavelist}
               onGraphData={this.onGraphData}
               />
          </div>
        </div>
        <div className="Layout2">
          <div className="Total">
             <IndexedGraph waveform={this.state.waveformData}
             splitData={this.state.graphData}></IndexedGraph>
            <div className="WaveListGraphTable">
              <GraphTable 
                splitData={this.state.graphData}
                onGraphChange = {this.onGraphChange}
                // splitData={{
                //   "index_date": "2020-02-24T00:00:00.000Z",
                //   "index_num" : 3,
                //   "parts": {"0": {"startTime": "2020-02-24 00:51:15.100000","stopTime": "2020-02-24 00:51:18.400000",  "max": 65.05, "average": 38.54, "median": 50.25, "area": 1310.52}, 
                //             "1": {"startTime": "2020-02-24 00:51:18.500000", "stopTime": "2020-02-24 00:51:26.900000", "max": 28.37, "average": 27.76, "median": 27.78, "area": 2359.86}, 
                //             "2": {"startTime": "2020-02-24 00:51:27", "stopTime": "2020-02-24 00:51:30.700000", "max": 45.62, "average": 28.0, "median": 31.89, "area": 1064.05}}
                // }}
              />
            </div>
          </div>
        </div>
      </div>

    );
  }
}

export default Index;