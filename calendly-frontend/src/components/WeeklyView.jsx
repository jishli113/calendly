import React, { Component, useEffect, useState, useContext } from 'react';
import { UserContext } from './UserContext';
import useAPICall from '../hooks/useAPICall';
import { Temporal } from '@js-temporal/polyfill';
import '../css/weeklyview.css'
import { Row, Col, Card, Navbar, Container } from 'react-bootstrap';
const WeeklyView =(props)=>{
    const pers = window.localStorage
    const [weekEvents, setWeekEvents] = useState()
    const [startDay, setStartDay] = useState(pers.getItem("selectedDay"))
    const {contextUsername} = useContext(UserContext)
    const [isLoading, setIsLoading] = useState(true)
    const [weekDates, setWeekDates] = useState()

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

    useEffect(()=>{
    },[weekEvents])
    async function weekCount(date){
        setIsLoading(true)
        let temp = date
        let ret = []
        let dates = []
        for (let i = 0; i < 7; i ++ ){
            await fetch(`http://localhost:4000/api/dailyevents/${pers.getItem("contextUsername")}/${temp.toString()}`, 
            {method:"GET", headers:{"Content-Type":"application/json"}}).then(response=>response.json()).then(response=>ret.push(response))
            dates.push(temp.toString())
            temp = temp.add({days:1})
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
                                <p>{`${item.starthour}:${item.startminute}`}</p>
                                <p>{`${item.endhour}:${item.endminute}`}</p>
                                    </Card>
            })}
                </div>
                    </Col>
                }):<h1>adf</h1>}
        </Row>
        </Container>
    )
}

export default WeeklyView
