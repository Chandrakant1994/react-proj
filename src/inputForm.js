import React, { Component } from 'react';
//import { Form, Text } from 'react-form';
import * as ReactBootstrap from 'react-bootstrap';
import pnp from 'sp-pnp-js';
import $ from 'jquery';

/* global SP : true */
/* eslint no-undef: "error"*/

class InputForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: "",
            items: null,
            fields : null,
            title: null,
            age: null,
            department: null,
            lists: [],
            selectedList: null
        }
        //this.handleChange = this.handleChange.bind(this);
        //this.handleSubmit = this.handleSubmit.bind(this);
        //this.handleDelete = this.handleDelete.bind(this);
        
    }


    handleChange(e) {
        this.setState({
            selectedList: e.target.value
        })
    }

    handleSubmit(e) {
        this.CreateListItem(e);
        e.preventDefault();
    }

    handleDelete(e) {
        this.DeleteListItem(e);
        this.RetrieveListData();
        e.preventDefault();
    }

    handleUpdate(event) {

        console.dir(event.target.parentNode.parentNode);
        this.UpdateListItem(event);
        this.RetrieveListData();
        event.preventDefault();
    }

    handleClick(e) {
        console.log(e.target.previousSibling);
        e.preventDefault();
    }

    componentWillMount() {
        //debugger;
        console.log("InputForm will Mount")
        this.RetrieveAllLists();
    }

    componentDidMount() {
        console.log("InputForm Did Mount");
        this.selectBox = document.getElementById('selectBox');
        
        //this.RetrieveListData();
    }

    componentWillUpdate(){
        console.log("InputForm Will Update");
    }

    componentDidUpdate(){
        //this.RetrieveListData();
        console.log("InputForm Did Update");
    }


    // get all the items from a list


    RetrieveAllLists() {
        var reactHandler = this; 
        var spRequest = new XMLHttpRequest();
        spRequest.open('GET', "/sites/dev/_api/Web/Lists/?$filter=Hidden eq false and BaseTemplate eq 100", true);
        spRequest.setRequestHeader("Accept", "application/json");

        spRequest.onreadystatechange = function () {

            if (spRequest.readyState === 4 && spRequest.status === 200) {
                var result = JSON.parse(spRequest.responseText);
                //console.log(result.value);
                reactHandler.setState({
                    lists: result.value
                });
            }
            else if (spRequest.readyState === 4 && spRequest.status !== 200) {
                console.log('Error Occured !');
            }
        };
        spRequest.send();
    }


    RetrieveListData() {
        var reactHandler = this;
        
        var spRequest = new XMLHttpRequest();
        spRequest.open('GET', "/sites/dev/_api/web/lists/getbytitle('" + this.selectBox.value + "')/items", true);
        spRequest.setRequestHeader("Accept", "application/json");

        spRequest.onreadystatechange = function () {

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

        
        var spFieldRequest = new XMLHttpRequest();
        spFieldRequest.open('GET', "/sites/dev/_api/web/lists/getbytitle('" + this.selectBox.value + "')/fields?$filter=Hidden eq false and ReadOnlyField eq false and (FromBaseType eq false or Required eq true)", true); // and FromBaseType eq false
        spFieldRequest.setRequestHeader("Accept", "application/json");

        spFieldRequest.onreadystatechange = function () {

            if (spFieldRequest.readyState === 4 && spFieldRequest.status === 200) {
                var result = JSON.parse(spFieldRequest.responseText);
                console.log(result.value);
                reactHandler.setState({
                    fields: result.value
                });
            }
            else if (spFieldRequest.readyState === 4 && spFieldRequest.status !== 200) {
                console.log('Error Occured !');
            }
        };
        spFieldRequest.send();

    }

    CreateListItem(event) {
        $.ajax({
            url: "/sites/dev/_api/web/lists/GetByTitle('" + this.selectBox.value + "')/items",
            type: "POST",
            data: JSON.stringify({
                '__metadata': { 'type': 'SP.Data.PlayersListItem' },
                'Title': event.target.childNodes[0].childNodes[1].value,
                'Age': event.target.childNodes[0].childNodes[2].value,
                'Department': event.target.childNodes[0].childNodes[3].value
            }),
            headers: {
                "accept": "application/json;odata=verbose",
                "X-RequestDigest": $("#__REQUESTDIGEST").val(),
                "content-Type": "application/json;odata=verbose"
            },
            success: function () {
                console.log("success");
            },
            error: function (error) {
                console.log(JSON.stringify(error));
            }
        });

    }

    DeleteListItem(event) {
        let itemId = event.target.id
        $.ajax({
            url: "/sites/dev/_api/web/lists/GetByTitle('" + this.selectBox.value + "')/items(" + itemId + ")",
            type: "POST",
            headers: {
                "accept": "application/json;odata=verbose",
                "IF-MATCH": "*",
                "X-RequestDigest": $("#__REQUESTDIGEST").val(),
                "X-HTTP-Method": "DELETE"
            },
            success: function () {
                console.log("Item deleted Id :" + itemId);
            },
            error: function (error) {
                console.log(JSON.stringify(error));
            }
        });

    }

    UpdateListItem(event) {
        let itemId = event.target.id;
        let elem = event.target.parentNode.parentNode;
        $.ajax({
            url: "/sites/dev/_api/web/lists/GetByTitle('" + this.selectBox.value + "')/items(" + itemId + ")",
            type: "POST",
            data: JSON.stringify({
                '__metadata': { 'type': 'SP.Data.PlayersListItem' },
                'Title': elem.childNodes[0].innerText,
                'Age': elem.childNodes[1].innerText,
                'Department': elem.childNodes[2].innerText
            }),
            headers: {
                "accept": "application/json;odate=verbose",
                "Content-Type": "application/json;odata=verbose",
                "IF-MATCH": "*",
                "X-RequestDigest": $("#__REQUESTDIGEST").val(),
                "X-HTTP-Method": "MERGE"
            },
            success: function () {
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
                <Form onSubmit={this.handleSubmit.bind(this)} />

                <Select onChange={this.RetrieveListData.bind(this)}  ref='selectInput'>
                    {this.state}
                </Select>

                {this.state.items &&
                    <Tables onUpdateClick={this.handleUpdate.bind(this)} onDeleteClick={this.handleDelete.bind(this)}>{this.state}</Tables>
                }
            </div>
        );
    }
}

class Form extends React.Component {
    componentDidMount() {
        console.log("Form did mount")
    }

    componentWillUpdate(){
        console.log("Form will update")
    }

    componentWillMount(){
        console.log("Form will Mount")
    }

    componentDidUpdate(){
        console.log("Form Did update")
    }
    
    render() {
        return (
            <form onSubmit={this.props.onSubmit} className="form">
                <div className = "form-group col-md-3" >
                    <label className = "label label-default"> <h4>  Enter Player Details : </h4>  </label>
                <input type="text" id="name" placeholder="Name" className = "form-control" />
                <input type="text" id="age" placeholder="Age" className = "form-control"/>
                <input type="text" id="department" placeholder="Department" className = "form-control" />
                <input type="submit" id="submit" className = "btn btn-info" />
                </div>
            </form>
        );
    }
}

class Select extends React.Component {

    componentDidMount() {
        console.log("select did mount")
    }

    componentWillUpdate(){
        console.log("select will update")
    }

    componentWillMount(){
        console.log("select will Mount")
    }

    componentDidUpdate(){
        console.log("select did update")
    }

    render() {
        return (
            <div className = "form-group col-md-2">
            <select onChange={this.props.onChange}  id="selectBox" className = "form-control">
                {this.props.children.lists && this.props.children.lists.map(function (object) {
                    return <option value={object.Title}>{object.Title}</option>
                }, this)}
            </select>
            </div>
        )
    }
}

class Tables extends React.Component {
    componentDidMount() {
        console.log("Table did mount")
    }

    componentWillUpdate(){
        console.log("Table will update")
    }

    componentWillMount(){
        console.log("Table will Mount")
    }

    componentDidUpdate(){
        console.log("Table Did update")
    }

    render() {
        return (
            <table className="table">
                <thead className="thead-inverse">
                    <tr>
                        {this.props.children.fields.map(function (object,i){
                           return <th>{object.InternalName}</th>
                        })}

                        <th>Action Item</th>
                        <th>Action Item</th>
                    </tr>

                </thead>
                {this.props.children.items.map(function (object, i) {
                    return <tr>
                        {this.props.children.fields.map(function (field){
                            return <td contentEditable>{object[field.InternalName]}</td>
                        })}
                        <td> <input type="button" value="Update" id = {object.Id} onClick={this.props.onUpdateClick} /></td>
                        <td> <input type="button" value="Delete" id = {object.Id} onClick={this.props.onDeleteClick} /></td>
                    </tr>
                }, this)}

            </table>
        )
    }
}

export default InputForm;
//{this.props.children.state.lists.map(function (object) {
//                      return <option value={object.Title}>{object.Title}</option>
//                    }, this)} 