import React, { Component } from 'react';
import { Card, ListGroup, Button } from 'react-bootstrap';
import Snow from './../images/snow.jpg';
import Clear from './../images/clear-day.jpg';
import Rain from './../images/rain.jpg';
import Location from './form.component';

class Forecast extends Component {
    state = {
        error: this.props.error,
        place: this.props.forecast.place,
        temp: this.props.forecast.temp + ' degree Celcius',
        summary: this.props.forecast.summary,
        icon: this.props.forecast.icon, 
        num: '',
        showForm: false,
        showCard: true
    }

    componentDidMount() {
        if(this.state.icon === 'rain') {
            this.setState({
                num: 1
            })
        }
        else if(this.state.icon === 'snow') {
            this.setState({
                num: 2
            })
        }
        else {
            this.setState({
                num: 3
            })
        }
        console.log(this.state)
    }

    handleClick = (e) => {
        this.setState({
            showForm: true,
            showCard: false
        })
    }

    render() {
        if(!this.state.error) {
            return (
                <div className="d-flex align-items-center justify-content-center w-100">
                    {this.state.showCard ? <Card style={{ width: '30rem', height: '31rem' }} className="border-0">
                        {this.state.num === 1 ? <Card.Img style={{ height: '15rem'}} variant="top" src={Rain}></Card.Img> : null}
                        {this.state.num === 2 ? <Card.Img style={{ height: '15rem'}} variant="top" src={Snow}></Card.Img> : null}
                        {this.state.num === 3 ? <Card.Img style={{ height: '15rem'}} variant="top" src={Clear}></Card.Img> : null}
                        <Card.Body>
                            <Card.Title className="text-dark"><h4>{this.state.place}</h4></Card.Title>
                            <ListGroup variant="flush">
                                <ListGroup.Item></ListGroup.Item>
                                <ListGroup.Item className="text-dark"><b>{this.state.temp}</b></ListGroup.Item>
                            </ListGroup><br/>
                            <Card.Text className="text-dark">{this.state.summary}</Card.Text>
                            <Button variant="outline-dark" onClick={this.handleClick}>Back</Button>
                        </Card.Body>
                    </Card> : null }
                    {this.state.showForm ? <Location/> : null }
                </div>
            )
        }
        else {
            return (
                <div className="d-flex align-items-center justify-content-center w-100">
                {this.state.showCard ? <Card style={{ width: '30rem', height: '15rem' }} className="border-0">
                    <Card.Body>
                        <Card.Text className="text-dark">{this.state.error}</Card.Text>
                        <Button variant="outline-dark" onClick={this.handleClick}>Ok</Button>
                    </Card.Body>
                </Card> : null }
                {this.state.showForm ? <Location/> : null }
            </div>
            )
        }
          
    }
}

export default Forecast;