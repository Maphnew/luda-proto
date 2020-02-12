import React from 'react'
import Features from './Features'

const Body = (props) => {
    return (
        <div>
            <h1>Welcome!</h1>
            {props.options && <h2>{props.options}</h2>}
            <Features 
                featureInfo={props.featureInfo}
            />
        </div>
    )
}

export default Body