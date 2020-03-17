import React, { Component } from 'react';
import equal from 'fast-deep-equal'
import { CSVLink, CSVDownload } from "react-csv";

class PaletteDownload extends Component {
    state = {      
        getItem:{},
    };   
    
    componentDidMount=async()=>{           
        try {
            const getItem = JSON.parse(localStorage.getItem('dataSelector'))
            console.log(this.props.values)
            await this.setState({getItem})
        }
        catch {
            await this.setState({getItem:{}})
        }
    }

    render() { 
        return (
            <div>
              <h2> 조회 시간 </h2>
              {this.state.getItem.startTime} ~ {this.state.getItem.stopTime}
              <h2> 아이템 </h2>
              {this.state.getItem.Level1}.{this.state.getItem.Level2}.{this.state.getItem.Level3}.{this.state.getItem.Level4}.{this.state.getItem.Level5}
              <h2> feature </h2>
              {this.props.graph.feature}
              <h2> label </h2>
              {this.props.graph.label}              
              <CSVLink data={this.props.values} separator={","}>
                    Download
              </CSVLink>
            </div>
        )
    }

                

}

export default PaletteDownload;