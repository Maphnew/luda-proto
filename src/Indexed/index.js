import React, { Component } from 'react';
import './App.css';
import DateTimePicker from 'react-datetime-picker';
import GraphTable from './GraphTable';
import Graph from './Graph';
import WaveListTable from './WaveListTable';

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
    fetch("http://192.168.100.99:5000/features/info", { method: 'GET' })
      .then(response => response.json())
      .then((json) => {
        this.setState({ waveMaster: json });
      })
      .catch(err => console.log(err));
  }

  handleChange = (selectedOption) => {
    this.setState({ selectedOption }); // this will update the state of selected therefore updating value in react-select
    //console.log(selectedOption,`Selected: ${selectedOption.label}`); 
  }

  levelChange = (selectedOption) => {
    this.setState({ selectedOption }); // this will update the state of selected therefore updating value in react-select
  }
  
  /*Search버튼 클릭*/
  SearchClick = () => {
    const tagName = DefServer + "." + DefTable + "." + DefColumn;
    const params = { "TagName": tagName, "StartTime": this.state.startdate, "StopTime": this.state.stopdate }
    console.log(params)
    fetch("http://192.168.100.99:5000/indexed/wavelist", {
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
        response.json()
        console.log(response.json())
      })
      .then((json) => {
        const moment = require('moment')
        JSON.stringify(json.map(function (record) {
          var requiredPattern = 'YYYY-MM-DD HH:mm:ss.SSS';
          record.startTime = moment(record.startTime).format(requiredPattern);
          record.stopTime = moment(record.stopTime).format(requiredPattern);
          return record;
        }));
      })
      .catch(err => console.log(err));
  }
  onStartDateChange = startdate => this.setState({ startdate })
  onEndDateChange = stopdate => this.setState({ stopdate })

  onChange = date => this.setState({ date })

  handleChange = date => {
    this.setState({
      startDate: date

    });
  };
  render() {
    return (
      <div>
        <div className="Layout1">
          <div className="Total">
            <div className="LabelLa1">
              <h4>Search Period</h4>
            </div>
            <div className="PeriodLa">
              <div className="DatePickLa">
                <DateTimePicker onChange={this.onStartDateChange} format={"yyyy-MM-dd hh:mm:ss a"} value={this.state.startdate} className="datepicker" id="datepick1" />
              </div>
              <div className="LabelLa2">
                <h4> ~ </h4>
              </div>
              <div className="DatePickLa">
                <DateTimePicker onChange={this.onEndDateChange} format={"yyyy-MM-dd hh:mm:ss a"} value={this.state.stopdate} className="datepicker" id="datepick2" />
              </div>
              <div className="DatePickLa">
                <button className="Search_btn" onClick={this.SearchClick}>Search</button>
              </div>
            </div>
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