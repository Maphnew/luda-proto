import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Input from "@material-ui/core/Input";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
// Icons
import EditIcon from "@material-ui/icons/EditOutlined";
import DoneIcon from "@material-ui/icons/DoneAllTwoTone";
import RevertIcon from "@material-ui/icons/NotInterestedOutlined";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    overflowX: "auto"
  },
  table: {
    minWidth: 650
  },
  selectTableCell: {
    width: 60
  },
  tableCell: {
    width: 130,
    height: 40
  },
  input: {
    width: 130,
    height: 40
  }
}));

// const createData = (name, starttime, endtime, median, average, area,max,min) => ({
//   id: name,
//   name, starttime, endtime, median, average, area,max,min,
//   isEditMode: false
// });

const CustomTableCell = ({ row, name, onChange }) => {
  const classes = useStyles();
  const { isEditMode } = row;

  return (
    <TableCell align="center" className={classes.tableCell}>
      {isEditMode ? (
        <Input
          value={row[name.key]}
          name={name.key}
          onChange={e => onChange(e, row)}
          className={classes.input}
        />
      ) : (
        row[name.key]
      )}
    </TableCell>
  );
};

function GraphTable(props) {
  if (props.splitData.parts!== undefined) {
    var tempArr = [];
    Object.entries(props.splitData.parts).map(([key,value])=>{ 
        var tempJson = Object.assign({"id":key, isEditMode: false}, value);
        tempArr.push(tempJson)                                               
    }) 
    //console.log(tempArr)
  }

  const [rows, setRows] = React.useState(tempArr);
  const [previous, setPrevious] = React.useState({});
  const [save, setSave] = React.useState("");
  const classes = useStyles();

  const onToggleEditMode = id => {
    setRows(state => {
      return rows.map(row => {
        if (row.id === id) {
            return { ...row, isEditMode: !row.isEditMode };
        }        
        return row;
      });
    });
  };

  const onChange = (e, row) => {
    if (!previous[row.id]) {
      setPrevious(state => ({ ...state, [row.id]: row }));
    }
    const value = e.target.value;
    const name = e.target.name;
    const { id } = row;
    const newRows = rows.map(row => {
      if (row.id === id) {
        return { ...row, [name]: value };
      }
      return row;
    });
    setRows(newRows);
  };

  const onRevert = id => {
    const newRows = rows.map(row => {
      if (row.id === id) {
        return previous[id] ? previous[id] : row;
      }
      return row;
    });
    setRows(newRows);
    setPrevious(state => {
      delete state[id];
      return state;
    });
    onToggleEditMode(id);
  };

  const resetClick = () => {
    var tempArr = [];
    Object.entries(props.splitData.parts).map(([key,value])=>{ 
        var tempJson = Object.assign({"id":key, isEditMode: false}, value);
        tempArr.push(tempJson)                                               
    }) 
    setRows(tempArr);

  }

  const saveClick = () => {    
    setSave("Processing")
    var tempParts = {}
    rows.map((row)=>{
      tempParts[row.id] = {"startTime":row.startTime,"stopTime":row.stopTime}
    })
    var params = {
      "index_date":props.splitData.index_date,
      "index_num":props.splitData.index_num,
      "parts":tempParts
    }
    // console.log("saveClick",params)

    fetch("http://192.168.100.175:5000/indexed/splitlist", {
        method: 'PATCH', 
        headers: { 
            'Content-Type': 'application/json',
            'Accept' : '*/*'
        },
        body : JSON.stringify(params)
    })
    .then(response => {
      const statusCode = response.status;
      setSave("Complete")
      return { statusCode };
    
    })
    .catch(error => {
      console.error(error);
      setSave("network error")
      return { name: "network error", description: "" };
    });
  }

  const tableCellElement =(data)=> {

    const tableCell =  Object.entries(data[0]).map(([key,value],idx)=>{ 
      if (key !== "isEditMode"){
        return(<TableCell align="left" key={idx} >{key}</TableCell>)  
      }             
    }) 
    return tableCell;
  }

  return (
    <div>
      <button className="Reset_btn" onClick ={resetClick}>Reset</button>
      <button className="Save_btn" onClick = {saveClick}>Save</button>
      {save}
      <Paper className={classes.root}>
        <Table className={classes.table} aria-label="caption table">
      <TableHead>
            <TableRow>
            <TableCell align="left" />
              {tableCellElement(rows)}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(row => (
              <TableRow key={row.id}>
                <TableCell className={classes.selectTableCell}>
                  {row.isEditMode ? (
                    <>
                      <IconButton
                        aria-label="done"
                        onClick={() => onToggleEditMode(row.id)}
                      >
                        <DoneIcon />
                      </IconButton>
                      <IconButton
                        aria-label="revert"
                        onClick={() => onRevert(row.id)}
                      >
                        <RevertIcon />
                      </IconButton>
                    </>
                  ) : (
                    <IconButton
                      aria-label="delete"
                      onClick={() => onToggleEditMode(row.id)}
                    >
                      <EditIcon />
                    </IconButton>
                  )}
                </TableCell>
                  {
                    Object.entries(row).map(([key,value])=>{ 
                      if (key !== "isEditMode"){
                        if(key ==="startTime" || key ==="stopTime"){
                          return(<CustomTableCell {...{ row, name: {key}, onChange}} key ={key} />)
                        }                  
                        else {
                          return(<TableCell align="center" className={classes.tableCell}  key ={key}> {row[key]} </TableCell>)
                        }                      
                      }
                    })
                  }
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </div>
  );
}

export default GraphTable;
