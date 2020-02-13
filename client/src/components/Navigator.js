import React from 'react'

const Navigator = (props) => {
    return (
        <div className="navigator">
            <div className="naviMenu0">
                {props.naviMenu && props.naviMenu[0]}
            </div>
            <div className="naviMenu1">
                {props.naviMenu && props.naviMenu[1]}
            </div>
            <div className="naviMenu2">
                {props.naviMenu && props.naviMenu[2]}
            </div>
        </div>
    )
}

export default Navigator