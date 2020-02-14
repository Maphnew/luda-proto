import React from 'react'
import Modal from 'react-modal'

const SettingModal = (props) => (
    <Modal
        isOpen={props.modalOpen}
        onRequestClose={props.handleModalClose}
        contentLabel="Settings"
        closeTimeoutMS={200}
        className="modal"
    >
        <h3 className="modal__title">Settings</h3>
        <div className="modal__body">
            {props.database.host && <input className="modal__input" readOnly="readonly" type="text" value={props.database.host}/>}
        </div>
        <div className="modal__body">
            {props.database.host && <input className="modal__input" readOnly="readonly" type="text" value={props.database.port}/>}
        </div>
        <div className="modal__body">
            {props.database.host && <input className="modal__input" readOnly="readonly" type="text" value={props.database.user}/>}
        </div>
        <div className="modal__body">
            {props.database.host && <input className="modal__input" readOnly="readonly" type="password" value={props.database.password}/>}
        </div>
        <div className="modal__body">
            {props.database.host && <input className="modal__input" readOnly="readonly" type="text" value={props.database.database}/>}
        </div>
        <button className="button" onClick={props.handleModalClose}>Test & Save</button>

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
