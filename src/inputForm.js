import React, { Component } from 'react';
import { Form, Text } from 'react-form';
import pnp from 'sp-pnp-js';


class InputForm extends Component {
    constructor(props) {
        super(props);

        this.state = { value: "" }

        //this.handleChange = this.handleChange.bind(this);
        //this.handleSubmit = this.handleSubmit.bind(this);
        
    }
    

    handleChange(e) {
        this.setState({
            value: e.target.value
        })
    }

    handleSubmit(e) {
        alert("A value has been submitted .... : " + this.state.value)
        e.preventDefault();
    }

    retrieveList() {
        // get all the items from a list
    pnp.sp.web.lists.getByTitle("Players").items.get().then((items) => {

    console.log(items);
    var itemList = items.getEnumerator();
    while(itemList.moveNext()){
        console.log(item.get_current());
    }
    });


    }

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit.bind(this)}>
                    <label>
                        Enter the Users name :
                </label>
                    <input type="text" id="name" value={this.state.value} onChange={this.handleChange.bind(this)} />
                    <input type="submit" id="submit" />
                </form>
                <div>
                    <button type = "button" onClick = {this.retrieveList} > Get List</button>
                </div>
            </div>
        );
    }
}

export default InputForm;