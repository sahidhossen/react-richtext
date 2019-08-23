import React from 'react';
import RichText from './richText';

export default class App extends React.Component {
    constructor(props){
        super()
        this.state = {
            value: '<h3>Lets start with rich text editor</h3>',
            multiline: false
        }
    }
    render(){
        // console.log("value: ", this.state.value)
        return (
            <div className="app-container">
                <h3 className="title"> This is initial apps </h3>
                <h4> State: {this.state.multiline ? 'multiline' : 'single line'} </h4>
                <RichText
                    value={this.state.value}
                    multiline={true}
                    tagName='h3'
                    onChange={(value)=> this.setState({ value }) }
                    placeholder={'Write Text...'}
                />

                <div className="print-row-html">
                    { this.state.value }
                </div>

            </div>
        )
    }
}