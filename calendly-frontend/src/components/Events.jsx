import React, { Component, useState, useEffect} from 'react';
import '../css/events.css'
import Sidebar from './Sidebar';
import Calendar from 'react-calendar';
import Select from 'react-select'
import DailyView from './DailyView'
import WeeklyView from './WeeklyView';
import {Button} from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import NewEventPopUp from './NewEventPopup'

const Events =() =>{
    const pers = window.localStorage
    const [selectedDay, setSelectedDay] = useState(new Date())
    const [selectedTime, setSelectedTime] = useState((pers.getItem("selected")!=='null') ? pers.getItem("selected"):"daily")
    const [isPoppedUp, setIsPoppedUp] = useState(false)
    useEffect(()=>{
        if (selectedTime !== undefined){
            pers.setItem("selected",selectedTime)
        }
    },[selectedTime])
    useEffect(()=>{
        if(selectedDay !== undefined){
            pers.setItem("selectedDay", String(selectedDay))
        }
    },[selectedDay])
    useEffect(()=>{
        console.log("adsf")
    },[isPoppedUp])

    const handleClose=()=>{
        setIsPoppedUp(false)
    }
    return(
        <div className="events-page-body">
            <Sidebar className="sidebar"/>
            <div className="events-body">
                <select className="form-select" value={selectedTime} onChange={(e)=>setSelectedTime(e.target.value)}>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                </select>
                <Button className="add-event-button" onClick={()=>setIsPoppedUp(true)}>Event <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon></Button>
                        {(selectedTime === 'daily') ?
                        <div className="event-display">
                            <DailyView className="daily-view-display" day = {pers.getItem("selectedDay")}/>
                        </div>
                        :
                        <div className='event-display'>
                            <WeeklyView className="weekly-view-display" day={pers.getItem("selectedDay")} end={pers.getItem("weekEnd")}/>
                        </div>
                        }
            </div>
            <div className="events-calendar-sidebar">
                    <div className='calendar-sidebar-div'><Calendar className="calendar-view">
                        </Calendar></div>
                     
            </div>
            {isPoppedUp && <NewEventPopUp handleClose = {handleClose}></NewEventPopUp>}
        </div>
    )
}
 
export default Events;