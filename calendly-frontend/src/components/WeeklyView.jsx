import React, { Component, useEffect, useState, useContext } from 'react';
import { UserContext } from './UserContext';
import useAPICall from '../hooks/useAPICall';
import { Temporal } from '@js-temporal/polyfill';
import '../css/weeklyview.css'
import { Row, Col, Card, Navbar, Container } from 'react-bootstrap';
import useTimeConversion from '../hooks/useTimeConversion';
import useAPICallBody from '../hooks/useAPICallBody'
const WeeklyView =(props)=>{
    const pers = window.localStorage
    const [weekEvents, setWeekEvents] = useState()
    const [startDay, setStartDay] = useState(pers.getItem("selectedDay"))
    const {contextUsername} = useContext(UserContext)
    const [isLoading, setIsLoading] = useState(true)
    const [weekDates, setWeekDates] = useState()
    const {formatTime} = useTimeConversion()
    const {callAPI:getEvent} = useAPICallBody()


    useEffect(()=>{
        if(contextUsername !== null){
            pers.setItem("contextUsername", contextUsername)
        }
        if (startDay == undefined){
            setStartDay(Temporal.PlainDate.from(pers.getItem("selectedDay")))
        }
        
    },[])

    useEffect(()=>{
        if (startDay != undefined){
            pers.setItem("selectedDay", startDay.toString())
        }
        weekCount(Temporal.PlainDate.from(pers.getItem("selectedDay")))
    },[startDay])
    async function weekCount(date){
        let temp = date
        let ret = []
        let dates = []
        for (let i = 0; i < 7; i ++ ){
            let t = await getEvent(`http://localhost:4000/api/events/daily/`, "POST",
            {username:pers.getItem("contextUsername"), date:temp.toString()})
            dates.push(temp.toString())
            temp = temp.add({days:1})
            ret.push(t)
        }
        setIsLoading(false)
        setWeekEvents(ret)
        setWeekDates(dates)
    }
    
    return(
        <Container fluid={true} className="weekly-view-container">
        <Row>
            {(!isLoading) && weekDates.map(date=>{
                return <Col>
                    <h1 className="weekly-dates">{date}</h1>
                </Col>
            })}
        </Row>
        <Row className="parent-row">
                {(!isLoading && weekEvents.length > 0) ? weekEvents.map(day=>{
                    return <Col className="weeklyview-col">
                            <div className='weeklyview-col-div'>
                            {day.length > 0 && day.map(item=>{
                            return <Card className="weeklyview-card">
                                <h1 className="card-eventname">{item.eventname}</h1>
                                <p>{`${formatTime(item.starthour, item.startminute)}`}</p>
                                <p>{`${formatTime(item.endhour, item.endminute)}`}</p>
                                    </Card>
            })}
                </div>
                    </Col>
                }):<></>}
        </Row>
        </Container>
    )
}

export default WeeklyView
