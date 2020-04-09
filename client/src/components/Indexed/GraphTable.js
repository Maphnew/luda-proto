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
import DeleteIcon from '@material-ui/icons/Delete';
import equal from 'fast-deep-equal'

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
  console.log(props.value)
  const [rows, setRows] = React.useState(undefined);
  const [previous, setPrevious] = React.useState({});
  const [save, setSave] = React.useState("");
  const [nextProps, setNextProps] = React.useState(undefined);
  const classes = useStyles();

  if(props.splitData.parts!== undefined && !equal(nextProps,props)){
    console.log("update")
      const partsJson = JSON.parse(props.splitData.parts)
      var partDataArr = [];
      Object.entries(partsJson).map(([key,value])=>{ 
          var tempJson = Object.assign({"id":key, isEditMode: false}, value);
          partDataArr.push(tempJson)
          return partDataArr                                          
      }) 
      setNextProps(props)      
      setRows(partDataArr)
      setSave("Complete")  
  }
  
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

  const onDelete = (id) => {
    if (rows.length===1){
      alert("Can't delete")
      return
    }

    if ((rows.length-1).toString() ===id){
      rows[rows.length-2].stopTime =rows[rows.length-1].stopTime
    } else if (id==="0") {
      rows[1].startTime =rows[0].startTime
    }

    rows.splice(parseInt(id), 1);

    const newRows = rows.map((row,idx) => {
      row.id=idx.toString()
      return row;
    });

    setRows(newRows);
  }

  const resetClick = () => {
    const partDataArr = graphTableData()
    setRows(partDataArr);      
  }

  const saveClick = async() => {
    const partDataArr = graphTableData()
    if (equal(rows,partDataArr)) {
      return
    }    
    
    setSave("Processing")
    var tempParts = {}
    rows.map((row,idx)=>{
      if(idx !== 0 ){
        if (Math.abs(new Date(row.startTime)-new Date(rows[idx-1].stopTime)) > 100){      
          const moment = require('moment') 
          var tempDate = new Date(row.startTime)         
          tempDate.setTime(tempDate.getTime() - 100)
          tempParts[rows[idx-1].id].stopTime = moment(tempDate).format("YYYY-MM-DD HH:mm:ss.SSSSSS")
        }
      }      
      tempParts[row.id] = {"startTime":row.startTime,"stopTime":row.stopTime}
      return tempParts
    })

    var params = {
      "tagName":props.splitData.tagName,
      "index_date":props.splitData.index_date,
      "index_num":props.splitData.index_num,
      "parts":tempParts
    }
    console.log("saveClick",params)

    await fetch("http://192.168.100.175:5000/indexed/splitlist", {
        method: 'PATCH', 
        headers: { 
            'Content-Type': 'application/json',
            'Accept' : '*/*'
        },
        body : JSON.stringify(params)
    })
    .then(response => {
      const statusCode = response.status;  
      console.log('statusCode',statusCode);    
      return { statusCode };
    
    })
    .catch(error => {
      console.error(error);
      setSave("network error")
      return { name: "network error", description: "" };
    });

    props.onGraphChange()
  }

  const addClick = async() => {
    var newRow = {"id":rows.length.toString(),"isEditMode":true,"startTime":"","stopTime":rows[rows.length-1].stopTime}
    Object.entries(rows[0]).filter(([key]) => key !== 'isEditMode' && key !== 'id' && key !== 'stopTime' && key !== 'startTime').map(([key])=>{                       
      newRow[key] = ""
      return newRow[key]
    })

    rows.push(newRow);
    setRows(rows);
    setPrevious(rows);
  }

  const graphTableData =()=>{
    var tempArr = [];
    const partsJson = JSON.parse(props.splitData.parts)
    Object.entries(partsJson).map(([key,value])=>{ 
        var tempJson = Object.assign({"id":key, isEditMode: false}, value);
        tempArr.push(tempJson)  
        return tempArr                                 
    }) 
    return tempArr
  }
  const tableCellElement =(data)=> {
    const tableCell =  Object.entries(data[0]).filter(([key]) => key !== 'isEditMode').map(([key,value],idx)=>{       
      return(<TableCell align="left" key={idx} >{key}</TableCell>)  
    }) 
    return tableCell;
  }

  if(rows=== undefined){
    // console.log(rows,props.splitData.parts)
    return (
      <div>
      </div>
    )
  }

  return (
    <div>
      <button className="Reset_btn" onClick ={resetClick}>Reset</button>
      <button className="Save_btn" onClick = {saveClick}>Save</button>
      <button className="Save_btn" onClick = {addClick}>Add</button>
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
                      <IconButton
                        aria-label="delete"
                        onClick={() => onDelete(row.id)}
                      >
                        <DeleteIcon/>
                      </IconButton>                      
                    </>
                  ) : (
                    <IconButton
                      aria-label="edit"
                      onClick={() => onToggleEditMode(row.id)}
                    >
                      <EditIcon />
                    </IconButton>
                  )}
                </TableCell>
                  {
                    Object.entries(row).filter(([key]) => key !== 'isEditMode').map(([key,value])=>{                       
                      if(key ==="startTime"){
                        return(<CustomTableCell {...{ row, name: {key}, onChange}} key ={key} />)
                      }                  
                      else {
                        return(<TableCell align="center" className={classes.tableCell}  key ={key}> {row[key]} </TableCell>)
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
