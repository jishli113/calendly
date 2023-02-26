import React, { Component, useContext, useState, useEffect } from 'react';
import { UserContext } from './UserContext';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import '../css/dailyview.css'
const DailyView=(props)=>{
    const pers = window.localStorage
    const {contextUsername} = useContext(UserContext)
    const [currentDate, setCurrentDate] = useState(props.day)
    useEffect(()=>{
        if (currentDate !== undefined){
            pers.setItem("selectedDay", currentDate)
        }
    },[currentDate])
    useEffect(()=>{
        if(currentDate === undefined){
            currentDate = pers.getItem("selectedDay")
        }
    },[])
    const refactorDate=(date)=>{
        return(date.split(" ",4).slice(0,4).join(" "))
    }

    return(
        <div className="dailyview-display">
            <Navbar bg="light" className="switch-days-nav">
                <h1 className='date-text'>{refactorDate(currentDate)}</h1>
                <FontAwesomeIcon icon={faChevronLeft} className="day-before-button"></FontAwesomeIcon>
                <FontAwesomeIcon icon={faChevronRight} className="day-after-button"></FontAwesomeIcon>
            </Navbar>
            <div className="dailyview-events">

            </div>
        </div>
    )
}
export default DailyView