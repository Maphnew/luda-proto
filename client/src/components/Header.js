import React from 'react'
import HeaderSetting from './HeaderSetting'

const Header = (props) => {
    return (
        <div className="header">
            <div className="container">
                <div className="title">
                    <h1>{props.title}</h1>
                </div>
                <HeaderSetting 
                    modalOpen={props.modalOpen}
                    handleModalOpen={props.handleModalOpen}
                    handleModalClose={props.handleModalClose}
                />
            </div>
        </div>
    )
}

Header.defaultProps = {
    title: 'LUDA'
}

export default Header