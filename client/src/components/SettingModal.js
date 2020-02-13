import React from 'react'
import Modal from 'react-modal'

const customStyles = {
    content : {
      top                   : '50%',
      left                  : '50%',
      right                 : 'auto',
      bottom                : 'auto',
      marginRight           : '-50%',
      transform             : 'translate(-50%, -50%)'
    }
  };

const SettingModal = (props) => (
    <Modal
        isOpen={props.modalOpen}
        onRequestClose={props.handleModalClose}
        style={customStyles}
        contentLabel="Settings"
    >
        <h3>Settings</h3>
        <div>
            {props.database.host && <input readOnly="readonly" type="text" value={props.database.host}/>}
        </div>
        <div>
            {props.database.host && <input readOnly="readonly" type="text" value={props.database.port}/>}
        </div>
        <div>
            {props.database.host && <input readOnly="readonly" type="text" value={props.database.port}/>}
        </div>
        <div>
            {props.database.host && <input readOnly="readonly" type="text" value={props.database.user}/>}
        </div>
        <div>
            {props.database.host && <input readOnly="readonly" type="password" value={props.database.password}/>}
        </div>
        <div>
            {props.database.host && <input readOnly="readonly" type="text" value={props.database.database}/>}
        </div>
        <button onClick={props.handleModalClose}>Test & Save</button>

    </Modal>
)

SettingModal.defaultProps = {
    database: {
        host: '192.168.101.50',
        port: '16033',
        user: 'root',
        password: 'its@1234',
        database: 'UYeG_Cloud',
    }
}

export default SettingModal
