import React from 'react'

const Features = (props) => (
    <div>
        <div>
            {props.featureInfo && <h3>{props.featureInfo}</h3>}
        </div>
    </div>
)

export default Features