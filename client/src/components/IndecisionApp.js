import React from 'react'
import AddOption from './AddOption'
import Options from './Options'
import Header from './Header'
import Action from './Action'

export default class IndecisionApp extends React.Component {
    constructor(props) {
        super(props)
        this.handleDeleteOptions = this.handleDeleteOptions.bind(this)
        this.handlePick = this.handlePick.bind(this)
        this.handleAddOption = this.handleAddOption.bind(this)
        this.handleDeleteOption = this.handleDeleteOption.bind(this)
        this.state = {
            options : []
        }
    }
    componentDidMount() {
        console.log('hey')
        try {
            console.log('something')
            fetch('/test')
                .then(res => {
                    console.log(res)
                    return res.json()
                })
                .then(optionsA => {
                    console.log("a")
                    console.log('optionsA', optionsA)

                    const json = localStorage.getItem('options')
                    console.log('json ', json)
                    const options = JSON.parse(json)
                    console.log('options')
                    console.log(options)
                    if(optionsA) {
                        this.setState(() => ({ optionsA }))
                    }
                })

            // const json = localStorage.getItem('options')
            // const options = JSON.parse(json)
            // console.log('options')
            // console.log(options)
            // if(options) {
            //     this.setState(() => ({ options }))
            // }
        } catch (e) {
            // Do nothing at all
        }
    }
    componentDidUpdate(prevProps, prevState) {
        if (prevState.options.length !== this.state.options.length) {
            const json = JSON.stringify(this.state.options)
            localStorage.setItem('options', json)
        }
        
    }
    componentWillUnmount() {
        console.log('componentWillUnmount')
    }
    handleDeleteOptions() {
        this.setState(() =>({ options: [] }))
    }
    handleDeleteOption(optionToRemove) {
        this.setState((prevState) => ({
            options: prevState.options.filter((option) => optionToRemove !== option)
        }))
    }
    handlePick() {
        const randomNum = Math.floor(Math.random() * this.state.options.length)
        const option = this.state.options[randomNum]
        alert(option)
    }
    handleAddOption(option) {
        if (!option) {
            return 'Enter valid value to add item'
        }else if(this.state.options.indexOf(option) > -1) {
            return 'This option already exists'
        }
        this.setState((prevState) => ({ options: prevState.options.concat(option) }))
    }
    render() {
        const subtitle = 'Put your life in the hands of a Computer'
        
        return (
            <div>
                <Header subtitle={subtitle}/>
                <Action 
                    hasOptions={this.state.options.length > 0}
                    handlePick={this.handlePick}
                />
                <Options 
                    options={this.state.options} 
                    handleDeleteOptions={this.handleDeleteOptions}
                    handleDeleteOption={this.handleDeleteOption}
                />
                <AddOption 
                    handleAddOption={this.handleAddOption}
                />
            </div>
        )
    }
}