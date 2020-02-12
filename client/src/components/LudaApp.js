import React from 'react'
import Header from './Header'
import Body from './Body'
import Navigator from './Navigator'

export default class LudaApp extends React.Component {
    state = {
        options: [],
        featureInfo: []
    }
    componentDidMount() {
        try {
            console.log('fetch: ', fetch('http://192.168.100.99:5000/features/info'))
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
                <Header />
                <Navigator 
                    naviMenu={naviMenu}
                />
                <div className="container">
                    <Body 
                        options={this.state.options} 
                        featureInfo={this.state.featureInfo}
                    />
                </div>
            </div>
        )
    }
}