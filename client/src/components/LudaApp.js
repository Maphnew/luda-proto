import React from 'react'
import Header from './Header'
import Body from './Body'
import SettingModal from './SettingModal'
import {BrowserRouter as Router} from 'react-router-dom'

export default class LudaApp extends React.Component {
    state = {
        options: [],
        featureInfo: [],
        modalOpen: false
    }
    handleModalOpen = () => {
        this.setState(() => ({ modalOpen: true }))
    }
    handleModalClose = () => {
        this.setState(() => ({ modalOpen: false}))
    }
    componentDidMount() {
        console.log('componentDidMount')
        this.setupBeforeUnloadListener();
    }
    componentDidUpdate(prevProps, prevState) {
        console.log('componentDidUpdate')
    }

    // Things to do before unloading/closing the tab
    doSomethingBeforeUnload = () => {
        localStorage.setItem('featureReq', undefined)    
    }

    // Setup the `beforeunload` event listener
    setupBeforeUnloadListener = () => {
        window.addEventListener("beforeunload", (ev) => {
            ev.preventDefault();
            return this.doSomethingBeforeUnload();
        });
    };

    render() {
        const naviMenu = ['Raw', 'Indexed', 'Features']
        
        return (
            <Router>
                <div>
                    <Header 
                        modalOpen={this.state.modalOpen}
                        handleModalOpen={this.handleModalOpen}
                        handleModalClose={this.handleModalClose}
                        naviMenu={naviMenu}
                    />
                    <Body 

                    />
                    <SettingModal 
                        modalOpen={this.state.modalOpen}
                        handleModalOpen={this.handleModalOpen}
                        handleModalClose={this.handleModalClose}
                    />
                </div>
            </Router>
            
        )
    }
}