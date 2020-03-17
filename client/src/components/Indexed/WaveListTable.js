import React from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import equal from 'fast-deep-equal';
import { BrowserRouter as Router } from 'react-router-dom';

class WaveListTable extends React.Component {
  state = {
    selected: {},
    json: [],
    data: [],
    Item: '',
    indexDate: '',
    indexNum: ''
  };
//행 클릭 이벤트
  onRowSelect = async (row, isSelected) => {
    if (isSelected) {
      const params = { "tagName": this.state.Item, "index_date": row.index_date, "index_num": row.index_num }
      fetch("http://192.168.100.175:5000/indexed/waveinfo", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': '*/*'
        },
        body: JSON.stringify(params)
      })
        .then(response => response.json())
        .then((json) => {
          JSON.stringify(json.map(function (record, idx) {
            record.idx = idx
            return record;
          }));
          this.setState({ waveinfo: json[0] })
          if(this.state.waveinfo == undefined){alert("no data")}
          const rowvalue = {
            "index_date": row.index_date,
            "index_num": row.index_num,
            "startTime": row.startTime,
            "stopTime": row.stopTime,
            "idx": row.idx,
            "parts": this.state.waveinfo.parts
          }
          const moment = require('moment')
          var requiredPattern = 'YYYY-MM-DD HH:mm:ss.SSS';
          row.index_date = moment(row.index_date).format(requiredPattern);
          this.setState({ selected: rowvalue });
          this.props.onGraphData(this.state.selected)
          this.setState({ indexDate: row.index_date })
          this.setState({ indexNum: row.index_num })
        })
        .catch(err => console.log(err));
    } else {
      this.props.onGraphData({})
    }
  }

  componentWillReceiveProps = async (nextProps) => {
    if (!equal(this.props.wavelist, nextProps.wavelist)) // Check if it's a new user, you can also use some unique property, like the ID  (this.props.user.id !== prevProps.user.id)
    {
      await this.setState({ Item: nextProps.ItemData })
      await this.setState({ data: nextProps.wavelist })
      // console.log("nextProps.wavelist",this.state.data, "Item", this.state.Item)
      if (this.state.selected.idx !== undefined) {
        this.props.onGraphData(nextProps.wavelist[this.state.selected.idx])
      }
    }
  }

  //리스트 삭제버튼 이벤트
  delClick = async () => {
    const params = { "tagName": this.state.Item, "index_date": this.state.indexDate, "index_num": this.state.indexNum }
    fetch("http://192.168.100.175:5000/indexed", {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*'
      },
      body: JSON.stringify(params)
    })
      .then(response => {
        const statusText = response.statusText;
        console.log('statusText', statusText);
        if (statusText != undefined) {alert("complete")} 
        else { alert("error") }
      })
  }

  render() {
    var selectRowProp = {
      mode: 'radio',
      clickToSelect: true,
      // unselectable: [2],
      // selected: [3],
      onSelect: this.onRowSelect,
      bgColor: "rgb(173, 168, 255)",
    };

    return (
      <Router>
        <div>
        <h4>Wave List</h4>
          <button id="Del_btn" onClick={this.delClick}>Delete</button>
          <BootstrapTable
            data={this.state.data}
            selectRow={selectRowProp}
            pagination={true}>
            <TableHeaderColumn isKey dataField='startTime'>
              StartTime
          </TableHeaderColumn>
            <TableHeaderColumn dataField='stopTime'>
              StopTime
          </TableHeaderColumn>
          </BootstrapTable>
        </div>
      </Router>
    );
  }
}
export default WaveListTable;