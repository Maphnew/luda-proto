import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import { AutoSizer, Column, Table } from 'react-virtualized';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import Paper from "@material-ui/core/Paper";

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
  static defaultProps = {
    headerHeight: 48,
    rowHeight: 48,
  };

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
render() {
  const { classes, columns, rowHeight, headerHeight, ...tableProps } = this.props;

  return (
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
    <Paper style={{ height: 600, width: '81%' }}>
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
    </Paper>
  );
};
export default ReactVirtualizedTable;