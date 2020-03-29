import React from 'react';
import { Component } from 'react';
import { Form, Button } from 'react-bootstrap';
import './carousel.css';
import Axios from 'axios';
import Forecast from './forecast.component';

class Location extends Component {
    state = {
        location: '',
        data: [],
        showCard: false,
        showForm:true
    }

    handleChange = (e) => {
        this.setState({
            location: e.target.value
        })
    }

    handleSubmit = (e) => {
        e.preventDefault();
        console.log("ok")
        Axios("http://localhost:9000/weather?location=" + this.state.location)
        .then((response) => {
            if(!response.data.error) {
                console.log(response)
                this.setState ({
                    data: response.data,
                    showCard: true,
                    showForm: false
                })  
            }
            else {

            }
            
        })
    }
    
    render() {
        return (
            <div className="d-flex align-items-center justify-content-center form">
                {this.state.showForm ? <Form onSubmit={this.handleSubmit}>
                    <Form.Group controlId="formBasicText">
                        <Form.Control size="lg" placeholder="Enter location" onChange={this.handleChange}></Form.Control>
                    </Form.Group>
                    <Button type="submit" variant="dark">Submit</Button>
                </Form> : null }
                {this.state.showCard ? <Forecast forecast={this.state.data}/> : null }
            </div>
        )
    }
}

export default Location;