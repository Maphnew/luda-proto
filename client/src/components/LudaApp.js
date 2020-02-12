import React from 'react'
import Header from './Header'
import Body from './Body'
import Navigator from './Navigator'

export default class LudaApp extends React.Component {
    state = {
        options: []
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
                    />
                </div>
                

            </div>
        )
    }
}