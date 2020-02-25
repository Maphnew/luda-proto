import React, { Component } from 'react';
import './Indexed.css';
import GraphTable from './GraphTable';
import Graph from './IndexedGraph';
import WaveListTable from './WaveListTable';
import equal from 'fast-deep-equal'

class Index extends Component {
  state = {
    date: new Date(),
    waveMaster: [],
    selectedOption: {},
    startdate: new Date(),
    stopdate: new Date(),   
  }

  state = {
    selectedOption: { Level1: "Level1", Level2: "Level2", Level3: "Level3", Level4: "Level4", Level5: "Level5" },
    waveMaster: []
  }

  componentDidMount() {
    // console.log("componentDidMount",this.props.values.TagName)
    // console.log("componentDidMount",this.props.values.StartTime)
    // console.log("componentDidMount",this.props.values.StopTime)
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
        .then(response => {
          console.log(response)
          const json = response.json()
          console.log(json)
        })
        .then((json) => {
          const moment = require('moment')
          JSON.stringify(json.map(function (record) {
            var requiredPattern = 'YYYY-MM-DD HH:mm:ss.SSS';
            record.startTime = moment(record.startTime).format(requiredPattern);
            record.stopTime = moment(record.stopTime).format(requiredPattern);
            return record;
            console.record();
          }));
        })
        .catch(err => console.log(err));
    }
  }

  render() {
    const wavelist = []
    this.state.waveMaster.map(function(item){
      wavelist.push(item);
      console.log(wavelist)
      return wavelist;
    })

    return (
      <div>
        <div className="Layout1">
          <div className="Total">
          </div>
          <div className="Total">
            <h4>Wave List</h4>
            <WaveListTable></WaveListTable>
          </div>
        </div>
        <div className="Layout2">
          <div className="Total">
            <Graph></Graph>
            <div className="WaveListGraphTable">
              <GraphTable
                splitData={{
                  "index_date": "2020-02-24T00:00:00.000Z",
                  "index_num" : 3,
                  "parts": {"0": {"startTime": "2020-02-24 00:51:15.100000","stopTime": "2020-02-24 00:51:18.400000",  "max": 65.05, "average": 38.54, "median": 50.25, "area": 1310.52}, 
                            "1": {"startTime": "2020-02-24 00:51:18.500000", "stopTime": "2020-02-24 00:51:26.900000", "max": 28.37, "average": 27.76, "median": 27.78, "area": 2359.86}, 
                            "2": {"startTime": "2020-02-24 00:51:27", "stopTime": "2020-02-24 00:51:30.700000", "max": 45.62, "average": 28.0, "median": 31.89, "area": 1064.05}}
                }}
              />
            </div>
          </div>
        </div>
      </div>

    );
  }
}

export default Index;