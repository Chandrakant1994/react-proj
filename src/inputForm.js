import React, { Component } from 'react';
import { Form, Text } from 'react-form';
import pnp from 'sp-pnp-js';
import $ from 'jquery';
/* global SP : true */
/* eslint no-undef: "error"*/

class InputForm extends Component {
    constructor(props) {
        super(props);
        this.state = { value: "" ,
        items : [],
        title : null,
        age : null,
        department : null,    
    }
        //this.handleChange = this.handleChange.bind(this);
        //this.handleSubmit = this.handleSubmit.bind(this);
        //this.handleDelete = this.handleDelete.bind(this);
    }


    handleChange(e) {
        this.setState({
            value: e.target.value
        })
    }

    handleSubmit(e) {
        this.CreateListItem(e);
        e.preventDefault();
    }

    handleDelete(e) {      
        this.DeleteListItem(e);
        this.RetrieveSPData();
        e.preventDefault();
    }

    handleUpdate(e){
        
        console.dir(e.target.parentNode.parentNode);
        this.UpdateListItem(e);
        e.preventDefault();
    }

    handleClick(e) {
        console.log(e.target.previousSibling);
        e.preventDefault();
    }

    componentDidMount() {
        //debugger;
        this.RetrieveSPData();
    }

    // get all the items from a list



    RetrieveSPData() {
        var reactHandler = this;

        var spRequest = new XMLHttpRequest();
        spRequest.open('GET', "/sites/dev/_api/web/lists/getbytitle('Players')/items", true);
        spRequest.setRequestHeader("Accept", "application/json");

        spRequest.onreadystatechange = function () {
            console.log("entered state change")
            if (spRequest.readyState === 4 && spRequest.status === 200) {
                var result = JSON.parse(spRequest.responseText);

                reactHandler.setState({
                    items: result.value
                });
            }
            else if (spRequest.readyState === 4 && spRequest.status !== 200) {
                console.log('Error Occured !');
            }
        };
        spRequest.send();
    }

    CreateListItem(event){
        $.ajax({
        url: "/sites/dev/_api/web/lists/GetByTitle('Players')/items",
        type: "POST",
        data: JSON.stringify({
            '__metadata':{'type':'SP.Data.PlayersListItem'},
            'Title': event.target.childNodes[1].value,
            'Age' : event.target.childNodes[2].value,
            'Department' : event.target.childNodes[3].value
        }),
        headers: {
            "accept": "application/json;odata=verbose",
            "X-RequestDigest": $("#__REQUESTDIGEST").val(),
            "content-Type": "application/json;odata=verbose"
        },
        success: function(){
            console.log("success");
        },
        error: function (error) {
            console.log(JSON.stringify(error));
        }
       });

    }

    DeleteListItem(event){
        let itemId = event.target.parentNode.parentNode.id
        $.ajax({
        url: "/sites/dev/_api/web/lists/GetByTitle('Players')/items(" + itemId + ")" ,
        type: "POST",
        headers: {
            "accept": "application/json;odata=verbose",
            "IF-MATCH": "*",
            "X-RequestDigest": $("#__REQUESTDIGEST").val(),
            "X-HTTP-Method":"DELETE"
        },
        success: function(){
            console.log("Item deleted Id :" + itemId);
        },
        error: function (error) {
            console.log(JSON.stringify(error));
        }
       });
       
    }

    UpdateListItem(event){
        let elem = event.target.parentNode.parentNode;
        let itemId = elem.id;
        $.ajax({
            url: "/sites/dev/_api/web/lists/GetByTitle('Players')/items(" + itemId + ")" ,
            type : "POST",
            data : JSON.stringify({
                '__metadata' : {'type' : 'SP.Data.PlayersListItem'},
                'Title' : elem.childNodes[0].innerText,
                'Age' : elem.childNodes[1].innerText,
                'Department' : elem.childNodes[2].innerText
            }),
            headers:{
                "accept" : "application/json;odate=verbose",
                "Content-Type" : "application/json;odata=verbose",
                "IF-MATCH": "*",
                "X-RequestDigest": $("#__REQUESTDIGEST").val(),
                "X-HTTP-Method" : "MERGE"
            },
        success: function(){
            console.log("Item updated Id :" + itemId);
        },
        error: function (error) {
            console.log(JSON.stringify(error));
        }
    });
    }

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit.bind(this)}>
                <label>
                        Enter the Players detail :
                </label>
                    <input type="text" id="name" placeholder = "Name"/>
                    <input type="text" id="age" placeholder = "Age"/>
                    <input type="text" id="department" placeholder = "Department"/>
                    <input type="submit" id="submit" />
                </form>
                
                <table>
                
                    {this.state.items.map(function(object, i){
                        return <tr id={object.Id}>
                            <td contentEditable>{object.Title}</td>
                            <td contentEditable>{object.Age}</td>
                            <td contentEditable>{object.Department}</td>
                            <td> <input type="button" value = "Update" onClick = {this.handleUpdate.bind(this)}/></td>
                            <td> <input type="button" value = "Delete" onClick = {this.handleDelete.bind(this)} /></td>                           
                        </tr>
                    },this)}
                
                
                </table>
                <input type = "submit" value = "create item" onClick = {this.handleClick.bind(this)}/>
            </div>
        );
    }
}

export default InputForm;