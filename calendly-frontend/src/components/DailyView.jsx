import React, { Component, useContext, useState, useEffect } from 'react';
import { UserContext } from './UserContext';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faChevronLeft, faCircle, faLock } from '@fortawesome/free-solid-svg-icons'
import { Temporal } from '@js-temporal/polyfill';
import useAPICall from '../hooks/useAPICallBody';
import '../css/dailyview.css'
import '../css/dailyviewcard.css'
import { Card, Col, Row, Image } from 'react-bootstrap';
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
            pers.setItem("selectedDay", currentDate.toString())
        }
        getCurrentEvents()
    },[currentDate])
    useEffect(()=>{
        if(currentDate === undefined){
            setCurrentDate(Temporal.PlainDate.from(pers.getItem("selectedDay")))
        }
    },[])
    async function getCurrentEvents(){
        setIsLoading(true)
        await(callGetEvents(`http://localhost:4000/api/dailyevents/${pers.getItem("contextUsername")}/${currentDate.toString()}`, "GET"))
        setIsLoading(false)
        console.log(events)
    }
    const nextDay=()=>{
        setCurrentDate(currentDate => currentDate.add({days:1}))
    }
    const prevDay=()=>{
        setCurrentDate(currentDate => currentDate.add({days:-1}))
    }
    function refactorDate(){
            return currentDate.toString()

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
        <Container>
        <Row className='daily-view-card-parent-row'>
            <Col lg={{span:2, offset:2}} className="status-circle-col">
                <FontAwesomeIcon icon={faCircle} size="4x" className="status-circle-ircon">
                    <FontAwesomeIcon icon={faLock}>

                    </FontAwesomeIcon>
                </FontAwesomeIcon>
            </Col>
            <Col lg={{span:6}} className="daily-event-col">
            <Card className="eventcard">
                <Card.Header className="dailyview-card-header">
                    <h1 className="dailyview-card-event-text">{props.props.eventname}</h1>
                    <p className="dailyview-card-time-text">{`${props.props.starthour}:${props.props.startminute} - ${props.props.endhour}:${props.props.endminute}`}</p>
                </Card.Header>
                <Card.Body>
                    <Image roundedCircle>

                    </Image>
                </Card.Body>
            </Card>
            </Col>
        </Row>
        </Container>
    )

}