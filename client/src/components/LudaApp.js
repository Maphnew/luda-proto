import React from 'react'
import Header from './Header'

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
        const subtitle = 'This is subtitle'
        
        return (
            <div>
                <Header 
                    subtitle={subtitle}
                    options={this.state.options} 
                />
            </div>
        )
    }
}