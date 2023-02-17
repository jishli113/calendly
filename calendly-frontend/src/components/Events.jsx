import React, { Component, useState } from 'react';
import '../css/events.css'
import Sidebar from './Sidebar';
import Calendar from 'react-calendar';
import Select from "react-dropdown-select";
import DailyView from './DailyView'
import {getCurrentDate} from './getCurrentDate'

const Events =() =>{
    const dropDownOptions = ['daily', 'monthly', 'yearly']
    const [selectedTime, setSelectedTime] = useState('daily')
    const [selectedDay, setSelectedDay] = useState(getCurrentDate())
    return(
        <div className="events-page-body">
            <Sidebar className="sidebar"/>
            <div className="events-body">
                <Select options = {dropDownOptions} onChange = {(selected) => setSelectedTime(selected)}></Select>
                <div className="event-display">
                    {(selectedTime !== 'daily') ? 
                    <Calendar className="calendar-view" day = {selectedDay}>

                    </Calendar>:
                    <DailyView date={selectedDay}></DailyView>
                    }
                </div>
            </div>
        </div>
    )
}
 
export default Events;