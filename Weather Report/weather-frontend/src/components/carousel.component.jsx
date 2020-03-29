import React from 'react';
import { Component } from 'react';
import Nature from './../images/file.jpg';
import Location from './form.component';
import './carousel.css';

var sectionStyle = {
    margin: "0% 20%",
    width: "60%",  
    height: "100vh",
    backgroundImage: `url(${Nature})`,
    color: "blue",
    boxShadow: "inset 0 0 8px 8px rgba(156,157,152,1)"
};

class Wallpaper extends Component {
    render() {
        return (
            <div className="back">
                <section style={sectionStyle}>
                    <Location/>
                </section>
            </div>
        )
    }
}

export default Wallpaper;