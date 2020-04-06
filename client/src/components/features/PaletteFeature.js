import React, { Component } from 'react';
import SearchField from "react-search-field";
import Loading from 'react-loading-bar'
import 'react-loading-bar/dist/index.css'
import {featurePost,featureGet,labelPost} from './Fetch'
import equal from 'fast-deep-equal'

class PaletteFeature extends Component {      
    state = {      
        isLoading: false,
        show: false,   
        sendData : this.props.values,
        featureReq:localStorage.getItem( 'featureReq' ),
        statisticsItem : [],
        labelItem : [],
        waveformItem : ["All","Split"],
        buttonSearch : [],
    };    

    componentDidMount=async()=>{
        this.setState({ isLoading: true, show: true });

        try {
            let featureReq = JSON.parse( localStorage.getItem('featureReq'))
            await this.setState({ featureReq})
        }
        catch {
            await this.setState({ featureReq:{"table":"WaveIndex","feature":"max"}})   
            localStorage.setItem('featureReq', JSON.stringify(this.state.featureReq)) 
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
        if (values.tagName===undefined){
            alert("Please enter data!")
            return
        }
        this.setState({ sendData:values},async()=>{
            const params = {
                "tagName":this.state.sendData.tagName,"table": this.state.sendData.table,  
                "startTime" : this.state.sendData.startTime, "stopTime" : this.state.sendData.stopTime
            }

            const getJson = await featureGet(params)
            if (getJson[0].length===undefined || getJson[0].length===0 ){                
                alert("The feature does not exist.\n Please check data!")
                return
            }            
            await this.setState({ labelItem:getJson[1] })
            await this.setState({ statisticsItem:getJson[0] })     
            var jsonPost = {}        
            if (this.state.featureReq.label === undefined){
                jsonPost = await featurePost(this.state.sendData,this.state.featureReq)
            }
            else {
                jsonPost = await labelPost(this.state.sendData,this.state.featureReq)
            }   
            this.props.onGraphDataSubmit(jsonPost)
        })
    }

    tableKinds = async (event) => {             
        if (this.state.sendData.tagName===undefined){
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

        await this.setState({featureReq:{ ...this.state.featureReq, table: tableName}}) 
        localStorage.setItem('featureReq', JSON.stringify(this.state.featureReq))    
        var json = {}
        if (this.state.featureReq.label === undefined){
            json = await featurePost(this.state.sendData,this.state.featureReq)
        }
        else {
            json = await labelPost(this.state.sendData,this.state.featureReq)
        }   
        // console.log(json[0])
        this.props.onGraphDataSubmit(json)
        this.setState({ isLoading: false, show: false });
    }

    statistics = async (event) => {     
        if (this.state.sendData.tagName===undefined){
            alert("Please enter data!")
            return
        }        

        this.setState({ isLoading: true, show: true });
        await this.setState({featureReq:{ ...this.state.featureReq, feature: event.target.id}} )
        localStorage.setItem('featureReq', JSON.stringify(this.state.featureReq))    
        var json = {}
        if (this.state.featureReq.label === undefined){
            json = await featurePost(this.state.sendData,this.state.featureReq)
        }
        else {
            json = await labelPost(this.state.sendData,this.state.featureReq)
        } 
        this.props.onGraphDataSubmit(json)        
        this.props.onGraphTypeSubmit(undefined,this.state.featureReq.Feature)       
        this.setState({ isLoading: false, show: false });
    }

    label = async (event) => {     
        if (this.state.sendData.tagName===undefined){
            alert("Please enter data!")
            return
        }
        this.setState({ isLoading: true, show: true });
        var json = {}
        if (event.target.id !== this.state.featureReq.label){
            await this.setState({featureReq:{ ...this.state.featureReq, label: event.target.id}} )
            json = await labelPost(this.state.sendData,this.state.featureReq)

        }
        else {
            await this.setState({featureReq:{ ...this.state.featureReq, label: undefined}} )
            json = await featurePost(this.state.sendData,this.state.featureReq)
        }
        localStorage.setItem('featureReq', JSON.stringify(this.state.featureReq))         
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
        if (data.length === undefined ) {
            return
        }
        const waveform = data.filter((id, idx) => this.state.buttonSearch.indexOf(id) !== -1 || this.state.buttonSearch.length === 0).map((id, idx) => {
                return (
                    <button id={id} key={idx} className="FeatureButton" onClick={func}>{ id }</button>
                )
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

                <div>
                    <h4 className = "Subheading"> Label</h4>                
                    {this.waveformElement(this.state.labelItem,this.label)}			
                </div> 
            </div>
        );
    }
}

export default PaletteFeature;