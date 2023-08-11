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
import { Temporal } from '@js-temporal/polyfill';

const Events =() =>{
    const pers = window.localStorage
    const [selectedDay, setSelectedDay] = useState(Temporal.Now.plainDateISO())
    const [passSelectedDay, setPassSelectedDay] = useState(false)
    const [selectedTime, setSelectedTime] = useState((pers.getItem("selected")!=='null') ? pers.getItem("selected"):"daily")
    const [isPoppedUp, setIsPoppedUp] = useState(false)
    useEffect(()=>{
        if (selectedTime !== undefined){
            pers.setItem("selected",selectedTime)
        }
    },[selectedTime])

    useEffect(()=>{
        console.log(selectedDay.toString().substring(0,10))
        pers.setItem("selectedDay", selectedDay)
        setPassSelectedDay(true)
    },[selectedDay])
    useEffect(()=>{
        console.log("adsf")
    },[isPoppedUp])

    const handleClose=()=>{
        setIsPoppedUp(false)
    }
    function handleCalendarChange(date){
        let formatDate = `${date.getFullYear()}-${date.getMonth() + 1 < 10 && "0"}${date.getMonth() + 1}-${date.getDate() < 10 ?"0":""}${date.getDate()}`
        setSelectedDay(Temporal.PlainDate.from(formatDate))

    }
    return(
        <div className="events-page-body">
            <Sidebar className="sidebar"/>
            <div className="events-body-wrapper">
                <div className="events-body">
                    <select className="form-select" value={selectedTime} onChange={(e)=>setSelectedTime(e.target.value)}>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                    </select>
                    <Button className="add-event-button" onClick={()=>setIsPoppedUp(true)}>Event <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon></Button>
                            {(selectedTime === 'daily') ?
                            <div className="event-display">
                                {passSelectedDay && <DailyView className="daily-view-display" day={selectedDay}/>}
                            </div>
                            :
                            <div className='event-display'>
                                <WeeklyView className="weekly-view-display" day={selectedDay.toString()} end={pers.getItem("weekEnd")}/>
                            </div>
                            }
                </div>
                {selectedTime === "daily" && <div className="events-calendar-sidebar">
                        <div className='calendar-sidebar-div'>
                            <Calendar className="calendar-view" onChange={(value)=>handleCalendarChange(value)}>
                            </Calendar></div>
                        
                </div>}
                {isPoppedUp && <NewEventPopUp handleClose = {handleClose}></NewEventPopUp>}
        </div>
        </div>
    )
}
 
export default Events;