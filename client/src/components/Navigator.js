import React from 'react'

const Navigator = (props) => {
    return (
        <div className="navigator">
            {props.naviMenu && <div className="naviMenu0">{props.naviMenu[0]}</div>}
        </div>
    )
}

export default Navigator