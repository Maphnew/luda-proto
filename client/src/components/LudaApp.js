import React from 'react'
import Header from './Header'
import Body from './Body'
import Navigator from './Navigator'
import SettingModal from './SettingModal'

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
        try {
            fetch('/test')
                .then(res => {
                    console.log('res: ', res)
                    return res.json()
                })
                .then(json => {
                    const options = json.options
                    console.log('options[0]', options[0])
                    if(options) {
                        this.setState(() => ({ options }))
                    }
                })
        } catch (e) {
            // Do nothing at all
        }
        try {
            fetch('/features/info')
                .then(res => {
                    console.log('info', res)
                    return res.json()
                }).then(info => {
                    console.log(info)
                    if(info) {
                        // this.setState(() => ({ featureInfo: info }))
                    }
                })
        } catch (e) {

        }
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
            <div>
                <Header 
                    modalOpen={this.state.modalOpen}
                    handleModalOpen={this.handleModalOpen}
                    handleModalClose={this.handleModalClose}
                />
                <Navigator 
                    naviMenu={naviMenu}
                />
                <div className="container">
                    <Body 
                        options={this.state.options} 
                        featureInfo={this.state.featureInfo}
                    />
                </div>
                <SettingModal 
                    modalOpen={this.state.modalOpen}
                    handleModalOpen={this.handleModalOpen}
                    handleModalClose={this.handleModalClose}
                />
            </div>
        )
    }
}