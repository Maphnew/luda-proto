import React,{Component} from 'react'
import Home from './Home'
import Features from './features/Features'
import DataSelector from './dataSelector/DataSelector'
import Raw from './Raw'
import Indexed from './Indexed'
import NotFoundPage from './NotFoundPage'
import {Route, Switch} from 'react-router-dom'

class Body extends Component{
    state = { 
        selectedOption:{}
    };

    onDataSubmit=(getData)=>{
        this.setState({ selectedOption: getData})
    }

    render() {
        return (
            <div>
                <DataSelector
                    onDataSubmit = {this.onDataSubmit}
                />
                <Switch>
                    <Route 
                        path="/" component={Home} exact={true}
                    />
                    <Route 
                        path="/raw" component={Raw} exact={true}
                    />
                    <Route 
                        path="/indexed" component={Indexed} exact={true}
                    />
                    <Route 
                        path="/features/feature"
                        render={() => <Features values={this.state.selectedOption}/> }
                        exact={true}
                    />
                    <Route component={NotFoundPage} />
                </Switch>
                
            </div>
        )
    }
    
}

export default Body