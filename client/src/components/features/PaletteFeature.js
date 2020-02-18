import React, { Component } from 'react';
import SearchField from "react-search-field";
import CircularProgress from '@material-ui/core/CircularProgress'; // import material CircularProgress

class PaletteFeature extends Component {
    state = {         
        sendData : this.props.value,
        statisticsItem : [],
        waveformItem : ["All","Split"],
        buttonSearch : [],
    };        

    componentDidMount() {
        if (this.state.sendData.TagName===undefined){
            alert("Please enter data!")
            return
        }

        fetch("http://192.168.100.99:5000/features/feature/statistics", {
            method: 'POST', 
            headers: { 
                'Content-Type': 'application/json',
                'Accept' : '*/*'
            },
            body : JSON.stringify({"TagName":this.state.sendData.TagName,"Table":this.state.sendData.Table,  
            "StartTime" : this.state.sendData.StartTime, "StopTime" : this.state.sendData.StopTime})
        })
        //.then(response => console.log(response))
        .then(response => response.json())
        .then((json) => {            
            this.setState({ statisticsItem:json })
            //console.log("Data",this.state.statisticsItem)
        })
        .catch(err => {
            console.log(err)
        });        

        
    }

    tableKinds = (event) => {             
        if (this.state.sendData.TagName===undefined){
            alert("Please enter data!")
            return
        }
        var tableName = ""
        if ((event.target.id).toLowerCase()==="all") {
            tableName = "WaveIndex"
        }
        else {
            tableName = "WaveSplit"
        }
        this.setState({sendData:{ ...this.state.sendData, Table: tableName}}, () => {            
            this.props.onFormSubmit(this.state.sendData)
            fetch("http://192.168.100.99:5000/features/feature", {
                method: 'POST', 
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept' : '*/*'
                },
                body : JSON.stringify(this.state.sendData)
            })
            //.then(response => console.log(response))
            .then(response => response.json())
            .then((json) => {                 
                const moment = require('moment') 
                var requiredPattern = 'YYYY-MM-DD HH:mm:ss.SSS';                
                if (tableName === "WaveIndex"){                    
                    JSON.stringify(json.map(function (record)  {                      
                        record.startTime = moment(record.startTime).format(requiredPattern);
                        record.stopTime = moment(record.stopTime).format(requiredPattern);                          
                        return record;
                    }));
                    this.props.onGraphDataSubmit(json)
                }
                else {                    
                    var tempJson = {}
                    JSON.stringify(json.map(function (record)  {    
                        Object.entries(record.parts).map(([key,value])=>{                            
                            if (tempJson[key]===undefined){
                                tempJson[key] = []
                            }
                            tempJson[key].push(value)
                            return record;                        
                          }) 
                          return tempJson;
                    }));            
                    this.props.onGraphDataSubmit(tempJson)
                    //console.log(tempJson)        
                }
                
            })
            .catch(err => console.log(err));      
        })
    }

    statistics = (event) => {     
        //this.setState({ selectedOption }); // this will update the state of selected therefore updating value in react-select 
        if (this.state.sendData.TagName===undefined){
            alert("Please enter data!")
            return
        }        
        this.setState({sendData:{ ...this.state.sendData, Feature: event.target.id}} , () => {
            this.props.onFormSubmit(this.state.sendData)        
            fetch("http://192.168.100.99:5000/features/feature", {
                method: 'POST', 
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept' : '*/*'
                },
                body : JSON.stringify(this.state.sendData)
            })        
            .then(response => response.json())
            .then((json) => {            
                const moment = require('moment')
                var requiredPattern = 'YYYY-MM-DD HH:mm:ss.SSS';
                if (this.state.sendData.Table === "WaveIndex"){                    
                    JSON.stringify(json.map(function (record)  {                      
                        record.startTime = moment(record.startTime).format(requiredPattern);
                        record.stopTime = moment(record.stopTime).format(requiredPattern);                          
                        return record;
                    }));
                    this.props.onGraphDataSubmit(json)
                }
                else {                    
                    var tempJson = {}
                    JSON.stringify(json.map(function (record)  {    
                        Object.entries(record.parts).map(([key,value])=>{                            
                            if (tempJson[key]===undefined){
                                tempJson[key] = []
                            }
                            tempJson[key].push(value)
                            return record;                        
                          }) 
                          return tempJson;
                    }));            
                    this.props.onGraphDataSubmit(tempJson)
                    //console.log(tempJson)        
                }
            })
            .catch(err => console.log(err));  
        })  
    }

    onSearchChange = (event) => {        
        if (event===""){
            this.setState({buttonSearch:[]})  
        }
        else {
            var allButton = []
            allButton.push(...this.state.waveformItem)
            allButton.push (...this.state.statisticsItem)
        
            var entry = allButton.filter((item) => {
                var finder = event;
                return eval('/'+finder+'/').test(item.toLowerCase()) ;
            });

            if (entry.length === 0){
                this.setState({buttonSearch: ["none"]}) 
            }
            else {
                this.setState({buttonSearch: entry})                 
            }
            
        }        
    }

    waveformElement=()=>{
        const waveform = this.state.waveformItem.map(
            (id, idx) => {
                if (this.state.buttonSearch.indexOf(id) !== -1 || this.state.buttonSearch.length === 0) {
                    return (
                        <button id={id} key={idx} className="FeatureButton" onClick={this.tableKinds}>{ id }</button>
                    )
                }
                return id
            });
        return waveform;
    }

    element=()=>{
        const waveform = this.state.statisticsItem.map(
        (id, idx) => {                
            if (this.state.buttonSearch.indexOf(id) !== -1 || this.state.buttonSearch.length === 0){     
                return ( 
                <button id={id} key={idx} className="FeatureButton" onClick={this.statistics}>{ id }</button>
                )  
            }
            return id
        });
        return waveform;
    }

    render() {   
        const {customers, isLoading, completed} = this.state; // add compledted

        const Hello = 
            <div>                
                <div>
                    <h4 className = "Subheading"> Waveform</h4>                    
                    {this.waveformElement()}
                </div>

                <div>
                    <h4 className = "Subheading"> Statistics</h4>                
                    {this.element()}			
                </div> 

            </div>


        return (            
            <div>
                <div className="SearchItem">
                    <SearchField
                        placeholder="Search Item"
                        onEnter={this.onSearchChange}
                        onSearchClick={this.onSearchChange}
                        onChange={this.onSearchChange}
                        classNames="test-class"
                    />
                </div>
                <div>
                    {Hello}
                </div>
            </div>
        );
    }
}

export default PaletteFeature;