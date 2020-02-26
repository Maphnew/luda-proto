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
    }
    componentDidUpdate(prevProps, prevState) {
        console.log('componentDidUpdate')
    }
    componentWillUnmount() {
        console.log('componentWillUnmount')
    }
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