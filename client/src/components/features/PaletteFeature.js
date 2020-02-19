import React, { Component } from 'react';
import SearchField from "react-search-field";
import Loading from 'react-loading-bar'
import 'react-loading-bar/dist/index.css'
import {featurePost,featureGet} from './Fetch'
class PaletteFeature extends Component {
    state = {      
        isLoading: false,
        show: false,   
        sendData : this.props.value,
        statisticsItem : [],
        waveformItem : ["All","Split"],
        buttonSearch : [],
    };        

    componentDidMount = async() => {
        if (this.state.sendData.TagName===undefined){
            alert("Please enter data!")
            return
        }

        this.setState({ isLoading: true, show: true });

        const params = {
            "TagName":this.state.sendData.TagName,"Table":this.state.sendData.Table,  
            "StartTime" : this.state.sendData.StartTime, "StopTime" : this.state.sendData.StopTime
        }
        const json = await featureGet(params)
        this.setState({ statisticsItem:json })

        this.setState({ isLoading: false, show: false });

        
    }

    tableKinds = async (event) => {             
        if (this.state.sendData.TagName===undefined){
            alert("Please enter data!")
            return
        }
        
        this.setState({ isLoading: true, show: true });

        var tableName = ""
        if ((event.target.id).toLowerCase()==="all") {
            tableName = "WaveIndex"
        }
        else {
            tableName = "WaveSplit"
        }

        await this.setState({sendData:{ ...this.state.sendData, Table: tableName}})
        
        this.props.onFormSubmit(this.state.sendData)
        const json = await featurePost(this.state.sendData)
        this.props.onGraphDataSubmit(json)

        this.setState({ isLoading: false, show: false });
    }

    statistics = async (event) => {     
        if (this.state.sendData.TagName===undefined){
            alert("Please enter data!")
            return
        }        

        this.setState({ isLoading: true, show: true });

        await this.setState({sendData:{ ...this.state.sendData, Feature: event.target.id}} )
        this.props.onFormSubmit(this.state.sendData)
        const json = await featurePost(this.state.sendData)
        this.props.onGraphDataSubmit(json)

        this.setState({ isLoading: false, show: false });
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

    waveformElement=(data, func)=>{
        const waveform = data.map(
            (id, idx) => {
                if (this.state.buttonSearch.indexOf(id) !== -1 || this.state.buttonSearch.length === 0) {
                    return (
                        <button id={id} key={idx} className="FeatureButton" onClick={func}>{ id }</button>
                    )
                }
                return id
            });
        return waveform;
    }

    render() {   
        return (            
            <div>
                <Loading
                    show={this.state.show}
                    color="red"
                />
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
                    <h4 className = "Subheading"> Waveform</h4>                    
                    {this.waveformElement(this.state.waveformItem,this.tableKinds)}
                </div>

                <div>
                    <h4 className = "Subheading"> Statistics</h4>                
                    {this.waveformElement(this.state.statisticsItem,this.statistics)}			
                </div> 
            </div>
        );
    }
}

export default PaletteFeature;