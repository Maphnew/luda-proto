import React, { Component } from 'react';
import SearchField from "react-search-field";
import Loading from 'react-loading-bar'
import 'react-loading-bar/dist/index.css'
import {featurePost,featureGet} from './Fetch'
import equal from 'fast-deep-equal'

class PaletteFeature extends Component {      
    state = {      
        isLoading: false,
        show: false,   
        sendData : this.props.values,
        featureReq:localStorage.getItem( 'featureReq' ),
        statisticsItem : [],
        waveformItem : ["All","Split"],
        buttonSearch : [],
    };    

    componentDidMount=async()=>{
        this.setState({ isLoading: true, show: true });
        
        let featureReq = JSON.parse( localStorage.getItem('featureReq'))
        if(featureReq===null){
            await this.setState({ featureReq:{"Table":"WaveIndex","Feature":"max"}})   
        }
        else {
            await this.setState({ featureReq})
        }            
        await this.updateValues(this.state.sendData);

        this.setState({ isLoading: false, show: false });   

    }

    componentWillReceiveProps = async(nextProps) => {
        if(!equal(this.props.values, nextProps.values)) // Check if it's a new user, you can also use some unique property, like the ID  (this.props.user.id !== prevProps.user.id)
        {
            this.setState({ isLoading: true, show: true });            
            await this.updateValues(nextProps.values);
            this.setState({ isLoading: false, show: false });   
        }      
    }

    updateValues=async(values)=>{
        if (values.TagName===undefined){
            alert("Please enter data!")
            return
        }
        this.setState({ sendData:values},async()=>{
            const params = {
                "TagName":this.state.sendData.TagName,"Table": this.state.sendData.Table,  
                "StartTime" : this.state.sendData.StartTime, "StopTime" : this.state.sendData.StopTime
            }

            const jsonGet = await featureGet(params)
            if (jsonGet.length===undefined || jsonGet.length===0){
                alert("The feature does not exist.\n Please check data!")
                return
            }

            await this.setState({ statisticsItem:jsonGet })            
            const jsonPost = await featurePost(this.state.sendData,this.state.featureReq)
            this.props.onGraphDataSubmit(jsonPost)
        })
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

        await this.setState({featureReq:{ ...this.state.featureReq, Table: tableName}}) 
        localStorage.setItem('featureReq', JSON.stringify(this.state.featureReq))    
        const json = await featurePost(this.state.sendData,this.state.featureReq)
        this.props.onGraphDataSubmit(json)

        this.setState({ isLoading: false, show: false });
    }

    statistics = async (event) => {     
        if (this.state.sendData.TagName===undefined){
            alert("Please enter data!")
            return
        }        

        this.setState({ isLoading: true, show: true });

        await this.setState({featureReq:{ ...this.state.featureReq, Feature: event.target.id}} )
        localStorage.setItem('featureReq', JSON.stringify(this.state.featureReq))    
        const json = await featurePost(this.state.sendData,this.state.featureReq)
        this.props.onGraphDataSubmit(json)
        this.props.onGraphTypeSubmit(undefined,this.state.featureReq.Feature)       
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