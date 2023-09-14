import React, { Component, useState, useEffect} from 'react';
import '../css/events.css'
import Sidebar from './Sidebar';
import Calendar from 'react-calendar';
import Select from 'react-select'
import DailyView from './DailyView'
import WeeklyView from './WeeklyView';
import {Button, FormSelect} from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import NewEventPopUp from './NewEventPopup'
import { Temporal } from '@js-temporal/polyfill';
import {Container, Row, Col, Form} from 'react-bootstrap';

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
        (selectedDay.toString().substring(0,10))
        pers.setItem("selectedDay", selectedDay)
        setPassSelectedDay(true)
    },[selectedDay])
    useEffect(()=>{
        ("adsf")
    },[isPoppedUp])

    const handleClose=()=>{
        setIsPoppedUp(false)
    }
    function handleCalendarChange(date){
        let formatDate = `${date.getFullYear()}-${date.getMonth() + 1 < 10 && "0"}${date.getMonth() + 1}-${date.getDate() < 10 ?"0":""}${date.getDate()}`
        setSelectedDay(Temporal.PlainDate.from(formatDate))

    }
    return(
        <>
            <Sidebar/>
            <Container fluid className='nopadding'>
                <Row className='nopadding'>
                    <Col lg={9} className='nopadding'>
                                <Container fluid className={selectedTime === "daily" ? "events-body-daily" : "events-body-weekly"}>
                                <Col lg={5}>
                                                <Row>
                                                    <Col lg={3} className='my-5'>
                                                    <Form.Select value={selectedTime} onChange={(e)=>setSelectedTime(e.target.value)}>
                                                    <option value="daily">
                                                        Daily
                                                    </option>
                                                    <option value="weekly">
                                                        Weekly
                                                    </option>
                                                </Form.Select>
                                            </Col>
                                                    <Col lg={{span:5, offset:4}} className='my-5'>
                                                    <Button onClick={()=>setIsPoppedUp(true)}>Event <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon></Button>
                                                    </Col>
                                                </Row>
                                </Col>
                                <Row className='my-4'>
                                    <Col lg={10}>
                                    </Col>
                                </Row>
                             {(selectedTime === 'daily') ?
                            <div className="event-display">
                                {passSelectedDay && <DailyView className="daily-view-display" day={selectedDay}/>}
                            </div>
                            :
                            <div className='event-display'>
                                <WeeklyView className="weekly-view-display" day={selectedDay.toString()} end={pers.getItem("weekEnd")}/>
                            </div>
                            }

                                </Container>
                                </Col>
                                <Col lg={3} className='nopadding'>
                                            {selectedTime === "daily" &&
                                            <Container fluid className="events-calendar-sidebar">
                                            <Row className='nopadding'>        
                                                 <Row className='my-5'>
                                                    <Col>
                                                    <Calendar className="calendar-view" onChange={(value)=>handleCalendarChange(value)}>
                                               </Calendar>
                                                    </Col>
                                                 </Row>
                                                

                                            </Row>
                                            </Container>
                                            }
                                </Col>
                </Row>
            </Container>
            {isPoppedUp && <NewEventPopUp handleClose = {handleClose}></NewEventPopUp>}
            

        
        </>
    )
}
 
export default Events;