import React from 'react'
import Navigator from './Navigator'
import Home from './Home'
import Features from './features/Features'
import Raw from './Raw'
import Indexed from './Indexed'
import NotFoundPage from './NotFoundPage'
import {Route, Switch, BrowserRouter as Router} from 'react-router-dom'

const Body = (props) => {
    const naviMenu = props.naviMenu
    return (
        <Router>
            <div>
                <Navigator 
                    naviMenu={naviMenu}
                />
                <Switch>
                    <Route 
                        path="/"
                        component={Home}
                        exact={true}
                    />
                    <Route 
                        path="/raw"
                        component={Raw}
                        exact={true}
                    />
                    <Route 
                        path="/indexed"
                        component={Indexed}
                        exact={true}
                    />
                    <Route 
                        path="/features"
                        component={Features}
                        exact={true}
                    />
                    <Route component={NotFoundPage} />
                </Switch>
                
            </div>
        </Router>

    )
}

export default Body