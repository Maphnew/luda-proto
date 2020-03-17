import React, { Component } from 'react';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import equal from 'fast-deep-equal'
import {NavLink , Redirect} from 'react-router-dom'
import Indexed from '../Indexed/Indexed'
class PaletteMylist extends Component {
    state = {      
        selectChartData:[],
    };   
    
    componentDidMount=async()=>{        
        this.setState({ isLoading: true, show: true });

        try {
            let selectChartData = JSON.parse( localStorage.getItem('selectChartData'))
            console.log("componentDidMount",selectChartData)
            await this.setState({ selectChartData})
        }
        catch {
            await this.setState({ selectChartData:[]})
        }       
    }

    localStorageUpdated(){
        console.log("localStorageUpdated")
        if (!localStorage.getItem('selectChartData')) {
            try {
                let selectChartData = JSON.parse( localStorage.getItem('selectChartData'))
                console.log("componentWillReceiveProps",selectChartData)
                this.setState({ selectChartData})
            }
            catch {

            }
        } 

    }

    componentWillReceiveProps = async() => {       
        let selectChartData = JSON.parse( localStorage.getItem('selectChartData')) 
        console.log("componentWillReceiveProps",selectChartData)
        if(!equal(selectChartData, this.state.selectChartData)) // Check if it's a new user, you can also use some unique property, like the ID  (this.props.user.id !== prevProps.user.id)
        {           
            console.log("componentWillReceiveProps",selectChartData)        
            await this.setState({ selectChartData}) 
        }      
    }

    render() { 
        console.log(this.state.selectChartData)
        return (
            <div>
                <BootstrapTable 
                data={this.state.selectChartData} 
                pagination={true}>
                <TableHeaderColumn isKey dataField='index_date'>
                    index_date
                </TableHeaderColumn>
                <TableHeaderColumn dataField='index_num'>
                    index_num
                </TableHeaderColumn>
                </BootstrapTable>
                <div > 
                    <a href="/indexed" >
                        <div>
                            OK                            
                        </div>
                        {/* <button id="btnGraph" className={this.state.btnId==="btnGraph"  ? "ButtonClick": "ButtonDefault"} onClick={this.handleClick}>Graph</button> */}
                    </a > 
                    {/* <Redirect to="/indexed">OK</Redirect> */}
                </div>
            </div>
        )
    }

                

}

export default PaletteMylist;