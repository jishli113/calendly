import React, { Component, useContext, useState, useEffect } from 'react';
import { UserContext } from './UserContext';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import { Temporal } from '@js-temporal/polyfill';
import useAPICall from '../hooks/useAPICallBody';
import '../css/dailyview.css'
import { Card, Col, Row } from 'react-bootstrap';
const DailyView=(props)=>{
    const pers = window.localStorage
    const {contextUsername} = useContext(UserContext)
    const [currentDate, setCurrentDate] = useState(Temporal.Now.plainDateISO())
    const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday","Sunday"]
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    const {res:events, callAPI:callGetEvents} = useAPICall()
    const [isLoading, setIsLoading] = useState(true)

    useEffect(()=>{
        console.log("daynames")
 },[dayNames])
    useEffect(()=>{
        if (currentDate !== undefined){
            pers.setItem("selectedDay", JSON.stringify(currentDate))
        }
        getCurrentEvents()
    },[currentDate])
    useEffect(()=>{
        if(currentDate === undefined){
            currentDate = JSON.parse(pers.getItem("selectedDay"))
        }
    },[])
    async function getCurrentEvents(){
        setIsLoading(true)
        await(callGetEvents(`http://localhost:4000/api/dailyevents/${pers.getItem("contextUsername")}/${currentDate.toString()}`, "GET"))
        setIsLoading(false)
        console.log(events)
    }
    const refactorDate=(date)=>{
        return(`${dayNames[currentDate["dayOfWeek"]-1]} ${monthNames[currentDate["month"]-1]} ${currentDate["day"]} ${currentDate["year"]}`)
    }
    const nextDay=()=>{
        setCurrentDate(currentDate => currentDate.add({days:1}))
    }
    const prevDay=()=>{
        setCurrentDate(currentDate => currentDate.add({days:-1}))
    }
    return(
        <div className="dailyview-display">
             <Navbar bg="light" className="switch-days-nav">
                 <h1 className='date-text'>{refactorDate(currentDate)}</h1>
                 <FontAwesomeIcon icon={faChevronLeft} className="day-before-button" onClick = {()=>prevDay()}></FontAwesomeIcon>
                 <FontAwesomeIcon icon={faChevronRight} className="day-after-button" onClick={()=>nextDay()}></FontAwesomeIcon>
             </Navbar>
             <div className="dailyview-events">
                {!isLoading && events.map(event=>(
                    <DailyViewCard props={event}></DailyViewCard>
                ))}
             </div>
        </div>
    )
}
export default DailyView

const DailyViewCard=(props)=>{
    useEffect(()=>{
        console.log(props.props)
    },[])
    return(
        <Card>
            <h1>{props.props.eventname}</h1>
            <p>{`${props.props.starthour}:${props.props.startminute}`}</p>
            <p>{`${props.props.endhour}:${props.props.endminute}`}</p>
        </Card>
    )

}