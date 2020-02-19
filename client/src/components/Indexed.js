import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { withStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import { AutoSizer, Column, Table } from 'react-virtualized';
import Select from 'react-select';
import DateTimePicker from 'react-datetime-picker';

const styles = theme => ({
  flexContainer: {
    display: 'flex',
    alignItems: 'center',
    boxSizing: 'border-box',
  },
  table: {
    // temporary right-to-left patch, waiting for
    // https://github.com/bvaughn/react-virtualized/issues/454
    '& .ReactVirtualized__Table__headerRow': {
      flip: false,
      paddingRight: theme.direction === 'rtl' ? '0px !important' : undefined,
    },
  },
  tableRow: {
    cursor: 'pointer',
  },
  tableRowHover: {
    '&:hover': {
      backgroundColor: theme.palette.grey[200],
    },
  },
  tableCell: {
    flex: 1,
  },
  noClick: {
    cursor: 'initial',
  },
});

class MuiVirtualizedTable extends React.PureComponent {
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

  static defaultProps = {
    headerHeight: 48,
    rowHeight: 48,
  };
  /*Search버튼 클릭*/
  SearchClick = () => {
    const tagName = this.state.selectedOption.DefServer + "." + this.state.selectedOption.DefTable + "." + this.state.selectedOption.DefColumn;
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
  /*파형리스트*/
  getRowClassName = ({ index }) => {
    const { classes, onRowClick } = this.props;

    return clsx(classes.tableRow, classes.flexContainer, {
      [classes.tableRowHover]: index !== -1 && onRowClick != null,
    });
  };

  cellRenderer = ({ cellData, columnIndex }) => {
    const { columns, classes, rowHeight, onRowClick } = this.props;
    return (
      <TableCell
        component="div"
        className={clsx(classes.tableCell, classes.flexContainer, {
          [classes.noClick]: onRowClick == null,
        })}
        variant="body"
        style={{ height: rowHeight }}
        align={(columnIndex != null && columns[columnIndex].numeric) || false ? 'right' : 'left'}
      >
        {cellData}
      </TableCell>
    );
  };

  headerRenderer = ({ label, columnIndex }) => {
    const { headerHeight, columns, classes } = this.props;

    return (
      <TableCell
        component="div"
        className={clsx(classes.tableCell, classes.flexContainer, classes.noClick)}
        variant="head"
        style={{ height: headerHeight }}
        align={columns[columnIndex].numeric || false ? 'right' : 'left'}
      >
        <span>{label}</span>
      </TableCell>
    );
  };

  // state = {
  //   date: new Date(),
  //   waveMaster: [],
  //   selectedOption: {},
  //   startdate: new Date(),
  //   stopdate: new Date()
  // }

  onStartDateChange = startdate => this.setState({ startdate })
  onEndDateChange = stopdate => this.setState({ stopdate })

  onChange = date => this.setState({ date })

  levelChange = (selectedOption) => {
    this.setState({ selectedOption }); // this will update the state of selected therefore updating value in react-select
  }

  handleChange = date => {
    this.setState({
      startDate: date

    });
  };

  render() {
    const { classes, columns, rowHeight, headerHeight, ...tableProps } = this.props;
    const { selectedOption } = this.state;
    const tempLevel2 = []
    const tempLevel3 = []
    const tempLevel4 = []
    const tempLevel5 = []

    this.state.waveMaster.map(function (item) {
      if (selectedOption.Level1 === item.Level1) {
        tempLevel2.push(item)
        if (selectedOption.Level2 === item.Level2) {
          tempLevel3.push(item)
          if (selectedOption.Level3 === item.Level3) {
            tempLevel4.push(item)
            if (selectedOption.Level4 === item.Level4) {
              tempLevel5.push(item)
            }
          }
        }
      }
      return tempLevel2;
    })

    const Level1 = [...new Map(this.state.waveMaster.map(o => [o.Level1, o])).values()]
    const Level2 = [...new Map(tempLevel2.map(o => [o.Level2, o])).values()]
    const Level3 = [...new Map(tempLevel3.map(o => [o.Level3, o])).values()]
    const Level4 = [...new Map(tempLevel4.map(o => [o.Level4, o])).values()]
    const Level5 = [...new Map(tempLevel5.map(o => [o.Level5, o])).values()]

    return (
      <div>
        <div className="Layout1">
            <h4>Wave List</h4>
            <div className="WaveListTable">
              <AutoSizer>
                {({ height, width }) => (
                  <Table
                    height={height}
                    width={width}
                    rowHeight={rowHeight}
                    gridStyle={{
                      direction: 'inherit',
                    }}
                    headerHeight={headerHeight}
                    className={classes.table}
                    {...tableProps}
                    rowClassName={this.getRowClassName}
                  >
                    {columns.map(({ dataKey, ...other }, index) => {
                      return (
                        <Column
                          key={dataKey}
                          headerRenderer={headerProps =>
                            this.headerRenderer({
                              ...headerProps,
                              columnIndex: index,
                            })
                          }
                          className={classes.flexContainer}
                          cellRenderer={this.cellRenderer}
                          dataKey={dataKey}
                          {...other}
                        />
                      );
                    })}
                  </Table>
                )}
              </AutoSizer>
            </div>
            </div>
        <div className="Layout2">
            <button className="Reset_btn">Reset</button>
            <button className="Save_btn">Save</button>
            <div className="WaveListGraph">그래프</div>
            <div className="WaveListGraphTable">

            </div>
        </div>
        </div>
    );
  }
}

MuiVirtualizedTable.propTypes = {
  classes: PropTypes.object.isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      dataKey: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      numeric: PropTypes.bool,
      width: PropTypes.number.isRequired,
    }),
  ).isRequired,
  headerHeight: PropTypes.number,
  onRowClick: PropTypes.func,
  rowHeight: PropTypes.number,
};

const VirtualizedTable = withStyles(styles)(MuiVirtualizedTable);

// ---
const wavelist = [
  {
    'num': 1,
    'date': '2020-02-13 09:00:00.123',
    'split': '3',
  },
  {
    'num': 2,
    'date': '2020-02-12 12:00:00.123',
    'split': '3',
  },
  {
    'num': 3,
    'date': '2020-02-11 18:00:00.123',
    'split': '3',
  },
  {
    'num': 4,
    'date': '2020-02-13 09:00:00.123',
    'split': '3',
  },
  {
    'num': 5,
    'date': '2020-02-12 12:00:00.123',
    'split': '3',
  },
  {
    'num': 6,
    'date': '2020-02-11 18:00:00.123',
    'split': '3',
  },
  {
    'num': 7,
    'date': '2020-02-13 09:00:00.123',
    'split': '3',
  },
  {
    'num': 8,
    'date': '2020-02-12 12:00:00.123',
    'split': '3',
  },
  {
    'num': 9,
    'date': '2020-02-11 18:00:00.123',
    'split': '3',
  },
  {
    'num': 10,
    'date': '2020-02-13 09:00:00.123',
    'split': '3',
  },
  {
    'num': 11,
    'date': '2020-02-12 12:00:00.123',
    'split': '3',
  },
  {
    'num': 12,
    'date': '2020-02-11 18:00:00.123',
    'split': '3',
  }

]
const ReactVirtualizedTable = () => {
  return (
    <VirtualizedTable
      rowCount={wavelist.length}
      rowGetter={({ index }) => wavelist[index]}
      columns={[
        {
          width: 100,
          label: '번호',
          dataKey: 'num',
        },
        {
          width: 350,
          label: '저장 날짜',
          dataKey: 'date',
          numeric: true,
        },
        {
          width: 230,
          label: '분할 갯수',
          dataKey: 'split',
          numeric: true,
        },

      ]}
    />
  );
};

export default ReactVirtualizedTable;