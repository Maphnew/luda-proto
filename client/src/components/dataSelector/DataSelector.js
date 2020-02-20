import React, { Component } from 'react';
import Select from 'react-select'
import DateRangePicker from 'react-bootstrap-daterangepicker';
// you will need the css that comes with bootstrap@3. if you are using
// a tool like webpack, you can do the following:
import 'bootstrap/dist/css/bootstrap.css';
// you will also need the css that comes with bootstrap-daterangepicker
import 'bootstrap-daterangepicker/daterangepicker.css';

class DataSelector extends Component { 
    state = { 
        selectedOption:{},
        waveMaster : [], 
        startdate: new Date(),
        stopdate: new Date(),
        showPopup: false,  
    };        

    componentDidMount() {
        if (this.state.selectedOption.Level1  === undefined){
            this.setState({ selectedOption :  {Level1: "Level1", Level2: "Level2", Level3:"Level3", Level4: "Level4", Level5: "Level5"} });       
        }

        fetch("http://192.168.100.99:5000/features/info", {method: 'GET'})
        .then(response => response.json())
        .then((json) => {            
            this.setState({ waveMaster:json }); 
        })
        .catch(err => console.log(err));
    }

    handleChange = (selectedOption) => {     
        this.setState({ selectedOption }); // this will update the state of selected therefore updating value in react-select
    }

    onChange = async (event, picker) => {
        await this.setState({ startdate:picker.startDate._d })
        await this.setState({ stopdate: picker.endDate._d})
        this.dataloadClick()
        //console.log(picker.startDate._d,picker.endDate._d);
    }

    dataloadClick = async () => {
        if (this.state.selectedOption.hasOwnProperty("DefColumn")===false) {
            alert("Please enter data!");
            return
        }

        const tagName = this.state.selectedOption.DefServer+"."+this.state.selectedOption.DefTable+"."+this.state.selectedOption.DefColumn
        const params = {"TagName":tagName, "StartTime" : this.state.startdate, "StopTime" : this.state.stopdate}    
        this.props.onDataSubmit(params)

    }

    render() {  
        const { selectedOption } = this.state;             
        const tempLevel2 = []
        const tempLevel3 = []
        const tempLevel4 = []
        const tempLevel5 = []

        this.state.waveMaster.map( function(item){ 
            if(selectedOption.Level1 === item.Level1)
            {
                tempLevel2.push(item)
                if(selectedOption.Level2 === item.Level2)
                {
                    tempLevel3.push(item)
                    if(selectedOption.Level3 === item.Level3)
                    {
                        tempLevel4.push(item)
                        if(selectedOption.Level4 === item.Level4)
                        {
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
            <div className="Info">
                <div className="Data">
                <h4 className = "Subheading"> Data</h4>                 
                <Select 
                    className="ComboBox" 
                    id = "Level1"
                    value={selectedOption}
                    options={Level1}                        
                    getOptionLabel={(Level1)=>Level1.Level1}
                    getOptionValue={(Level1)=>Level1.value}
                    onChange={this.handleChange}
                />
                <Select 
                    className="ComboBox" 
                    id = "Level1"
                    value={selectedOption}
                    options={Level2}                        
                    getOptionLabel={(Level2)=>Level2.Level2}
                    getOptionValue={(Level2)=>Level2.value}
                    onChange={this.handleChange}
                />
                <Select 
                    className="ComboBox" 
                    id = "Level3"
                    value={selectedOption}
                    options={Level3}                        
                    getOptionLabel={(Level3)=>Level3.Level3}
                    getOptionValue={(Level3)=>Level3.value}
                    onChange={this.handleChange}
                />
                <Select 
                    className="ComboBox" 
                    id = "Level4"
                    value={selectedOption}
                    options={Level4}                        
                    getOptionLabel={(Level4)=>Level4.Level4}
                    getOptionValue={(Level4)=>Level4.value}
                    onChange={this.handleChange}
                />
                <Select 
                    className="ComboBox" 
                    id = "Level5"
                    value={selectedOption}
                    options={Level5}                        
                    getOptionLabel={(Level5)=>Level5.Level5}
                    getOptionValue={(Level5)=>Level5.value}
                    onChange={this.handleChange}
                />

                <DateRangePicker 
                    showDropdowns
                    timePicker
                    onApply={this.onChange}
                    onEvent={this.onChange}
                >
                <button className="SearchButton" > Search Period</button>
                </DateRangePicker>
                <button id="btnPeriod" className="SearchButton" onClick={this.dataloadClick}>Search</button>

                </div>
            </div>
        );
    }    
}

export default DataSelector;