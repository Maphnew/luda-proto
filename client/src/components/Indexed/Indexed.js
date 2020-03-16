import React, { Component } from 'react';
import './Indexed.css';
import GraphTable from './GraphTable';
import IndexedGraph from './IndexedGraph';
import WaveListTable from './WaveListTable';
import equal from 'fast-deep-equal'

class Index extends Component {
  state = {
    date: new Date(),
    wavelist: [],
    json: [],
    graphData: {},
    Item: '',
    starttime: {}
  }

  componentWillReceiveProps = async (nextProps) => {
    if (!equal(this.props.values, nextProps.values)) // Check if it's a new user, you can also use some unique property, like the ID  (this.props.user.id !== prevProps.user.id)
    {
      const params = { "tagName": nextProps.values.tagName, "startTime": nextProps.values.startTime, "stopTime": nextProps.values.stopTime }
      //  console.log(params)
      this.setState({ item: nextProps.values.tagName })
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

          JSON.stringify(json.map(function (record, idx) {
            record.idx = idx
            record.startTime = moment(record.startTime).format(requiredPattern);
            record.stopTime = moment(record.stopTime).format(requiredPattern);
            return record;
          }));
          this.setState({ Item: nextProps.values.tagName});
          this.setState({ wavelist: json })
          // console.log('wavelist', this.state.wavelist, 'Item ', this.state.Item)
        })
        .catch(err => console.log(err));     
    }
  }

  onGraphData = async (getData) => {
    if(getData != undefined){
    const rowValue = {
      "tagName": this.state.item,
      "index_date": getData.index_date,
      "index_num": getData.index_num,
      "parts": getData.parts
    };

    await this.setState({ graphData: rowValue });
    // console.log("set",typeof(this.state.graphData),this.state.graphData)

    const params = { "tagName": this.state.item, "startTime": getData.startTime, "stopTime": getData.stopTime }
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
          record.x = new Date(record.x)
          return record;
        }));

        this.setState({ waveformData: json })
        // console.log('waveformData', this.state.waveformData)
      })
      .catch(err => console.log(err));
  }
  }
  onGraphChange = async () => {
    const params = { "tagName": this.props.values.tagName, "startTime": this.props.values.startTime, "stopTime": this.props.values.stopTime }
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

        JSON.stringify(json.map(function (record, idx) {
          record.idx = idx
          record.startTime = moment(record.startTime).format(requiredPattern);
          record.stopTime = moment(record.stopTime).format(requiredPattern);
          return record;
        }));
        this.setState({ wavelist: json })
        // console.log("this.state.wavelist", this.state.wavelist)
      })
      .catch(err => console.log(err));
  }

  render() {
    return (
      <div>
        <div className="Layout1">
          <div className="Total">
            <WaveListTable
              wavelist={this.state.wavelist}
              ItemData={this.state.Item}
              onGraphData={this.onGraphData}
            />
          </div>
        </div>
        <div className="Layout2">
          <div className="Total">
            <IndexedGraph 
            waveform={this.state.waveformData}
            splitData={this.state.graphData}></IndexedGraph>
            <div className="WaveListGraphTable">
              <GraphTable
                splitData={this.state.graphData}
                onGraphChange={this.onGraphChange}
              />
            </div>
          </div>
        </div>
      </div>

    );
  }
}

export default Index;