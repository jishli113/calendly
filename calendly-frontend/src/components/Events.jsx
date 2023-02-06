import React, { Component } from 'react';
import '../events.css'
import Sidebar from './Sidebar';

class Events extends Component {
    state = {  } 
    render() { 
        return (
            <Sidebar className="sidebar" />
        );
    }
}
 
export default Events;