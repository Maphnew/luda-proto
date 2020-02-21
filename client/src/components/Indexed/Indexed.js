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
    stopdate: new Date()
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
              <GraphTable></GraphTable>
            </div>
          </div>
        </div>
      </div>

    );
  }
}

export default Index;