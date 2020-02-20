import React from 'react'
import {NavLink} from 'react-router-dom'

const Navigator = (props) => {
    return (
        <div className="navigator">
            <NavLink to="/raw" activeClassName="is-active">
                <div className="naviMenu0">
                    {props.naviMenu && props.naviMenu[0]}
                </div>
            </NavLink>
            
            <NavLink to="/indexed" activeClassName="is-active">
                <div className="naviMenu1">
                    {props.naviMenu && props.naviMenu[1]}
                </div>
            </NavLink>
            
            <NavLink to="/features/feature" activeClassName="is-active">
                <div className="naviMenu2">
                    {props.naviMenu && props.naviMenu[2]}
                </div>
            </NavLink>
            
        </div>
        
    )
}

export default Navigator