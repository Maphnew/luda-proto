import React from 'react'
import {NavLink} from 'react-router-dom'

const Navigator = (props) => {
    return (
        <div className="navigator">
            <NavLink to="/raw" activeClassName="is-active" className="naviMenu0">
                <div>
                    {props.naviMenu && props.naviMenu[0]}
                </div>
            </NavLink>
            
            <NavLink to="/indexed" activeClassName="is-active"  className="naviMenu1">
                <div>
                    {props.naviMenu && props.naviMenu[1]}
                </div>
            </NavLink>
            
            <NavLink to="/features/feature" activeClassName="is-active"  className="naviMenu2">
                <div>
                    {props.naviMenu && props.naviMenu[2]}
                </div>
            </NavLink>
            
        </div>
        
    )
}

export default Navigator