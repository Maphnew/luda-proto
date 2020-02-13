import React from 'react'
const HeaderSetting = (props) => (
    <div className="headerSettings">
        <div className="settingImage">
            <img src='/images/settings2.svg' height="30" onClick={props.handleModalOpen}/>
        </div>
    </div>
)

export default HeaderSetting