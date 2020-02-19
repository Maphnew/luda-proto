import React from 'react'
import Home from './Home'
import Features from './features/Features'
import Raw from './Raw'
import Indexed from './Indexed'
import NotFoundPage from './NotFoundPage'
import {Route, Switch} from 'react-router-dom'

const Body = () => {
    
    return (
        <div>
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
                    path="/features" component={Features} exact={true}
                />
                <Route component={NotFoundPage} />
            </Switch>
            
        </div>
    )
}

export default Body