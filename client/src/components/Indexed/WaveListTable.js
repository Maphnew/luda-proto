import React from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import equal from 'fast-deep-equal';
import { Link, Route, BrowserRouter as Router } from 'react-router-dom';
import Indexed from './Indexed';
import GraphTable from './GraphTable';

// function onSelectRow(row, isSelected, e) {
//   if (isSelected) {     
//      const selectedItem = {"index_date":`${row['index_date']}`, "index_num":`${row['index_num']}`, "parts":`${row['parts']}`}
//      return selectedItem
//     }
// }

class WaveListTable extends React.Component {
  state = {
    selected:{},
    data: [],
    graphData: []
  };

  onRowSelect = async(row, isSelected) => {
    if (isSelected) {
      const moment = require('moment')
      var requiredPattern = 'YYYY-MM-DD HH:mm:ss.SSS';
      row.index_date = moment(row.index_date).format(requiredPattern);
      await this.setState({ selected: row});     
      this.props.onGraphData(this.state.selected)
    } else {
      this.props.onGraphData({})
    }
  }

  componentWillReceiveProps = async (nextProps) => {
    if (!equal(this.props.wavelist, nextProps.wavelist)) // Check if it's a new user, you can also use some unique property, like the ID  (this.props.user.id !== prevProps.user.id)
    {
      await this.setState({ data: nextProps.wavelist })
      console.log(nextProps.wavelist)
    }
  }

  render() {
    var selectRowProp = {
      mode: 'radio',
      clickToSelect: true,
      unselectable: [2],
      selected: [1],
      onSelect: this.onRowSelect,
      bgColor: "rgb(238, 193, 213)" 
    };
    return (
      <Router>
        <div>
          <h4>Wave List</h4>
          <BootstrapTable 
            data={this.state.data} 
            selectRow={selectRowProp} 
            pagination={true}
            striped
            hover
            condensed
            pagination
            >
            <TableHeaderColumn isKey dataField='startTime'>
              StartTime
          </TableHeaderColumn>
            <TableHeaderColumn dataField='stopTime'>
              StopTime
          </TableHeaderColumn>
            <TableHeaderColumn dataField='split'>
              split
          </TableHeaderColumn>
          </BootstrapTable>
          <Route
            path='/indexed/Indexed'
            render={() => <Indexed values={this.props.values} onGraphDataSubmit={this.onGraphDataSubmit} />}
          />
          <Route
            path='/indexed/GraphTable'
            render={() => <GraphTable values={this.props.values} onGraphDataSubmit={this.onGraphDataSubmit} />}
          />
        </div>
      </Router>
    );
  }
}
export default WaveListTable;