import React, { Component } from 'react';
import { Form, Text } from 'react-form';
import pnp from 'sp-pnp-js';
import $ from 'jquery';

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

        /*var ctx = new SP.ClientContext.get_current();

        var targetList = ctx.get_web().get_lists().getByTitle('Players');
        var query = SP.CamlQuery.createAllItemsQuery();
        var listItems;
        listItems = targetList.getItems(query);
        
        ctx.loadQuery(listItems); // load query returns an array 

        ctx.executeQueryAsync(  
        function(){ 
        var items = [];
        var listEnum = listItems.getEnumerator();
         
        while (listEnum.moveNext()) {
            var item = listEnum.get_current();
            items.push('ID: ' + item.get_id() + ' Title: ' + item.get_item('Title'));
        }
         
        alert(items.join("\n")); 
    }, 
    function(sender, args){ alert('Error: ' + args.get_message()); }
);*/
    /*pnp.sp.web.lists.getByTitle("Players").items.get().then((items) => {

    console.log(items);
    var itemList = items.getEnumerator();
    while(itemList.moveNext()){
        console.log(items.get_current());
    }
    });*/


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