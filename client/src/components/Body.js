import React from 'react'

const Body = (props) => {
    return (
        <div>
            <h1>Welcome!</h1>
            {props.options && <h2>{props.options}</h2>}
        </div>
    )
}

export default Body