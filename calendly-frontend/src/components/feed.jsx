import React, { Component, Fragment } from 'react';
import { useEffect, useState, useContext } from 'react';
import Sidebar from './Sidebar';
import { UserContext } from './UserContext';
import useAPICallBody from '../hooks/useAPICallBody';
import { Temporal } from '@js-temporal/polyfill';
import useTimeConversion from '../hooks/useTimeConversion';
import { Container, Row, Card, Col, Image } from 'react-bootstrap';
import Tag from './Tag';
const Feed = ()=> {
    const pers = window.localStorage
    let username = (pers.getItem("contextUsername") == null) ? contextUsername : pers.getItem("contextUsername")
    const {callAPI} = useAPICallBody()
    const [feedLoading, setFeedLoading] = useState(true)
    const {contextUsername,UCsetUsername, contextFirstname, UCsetFirstname, contextLastname, UCsetLastname, UCsetLoggedin} = useContext(UserContext)
    const {convertToUTC, formatTime} = useTimeConversion()
    const [feedEvents, setFeedEvents] = useState()
    useEffect(()=>{
    })
    useEffect(()=>{
        retrieveFeed()
    },[])
    useEffect(()=>{
        console.log(feedEvents)
    },[feedEvents])
    useEffect(()=>{
        if (contextUsername !== undefined){
            pers.setItem("contextUsername", contextUsername)
            username = contextUsername
        }
    },[contextUsername])
    async function retrieveFeed(){
        let c = Temporal.Now.plainDateTimeISO()
        let date = convertToUTC(Temporal.Now.timeZone(), c.year, c.month, c.day, c.hour, c.minute)
        console.log(date.toString().substring(0,10))
        console.log("wd", username)
        const body = {"username":username, "date": date.toString().substring(0,10)}
        console.log(body)
        let temp = await callAPI(`http://localhost:4000/api/feedevents`, "POST", body)
        console.log("done", temp)
        setFeedEvents(temp)
        setFeedLoading(false)
    }
        return (
        <Fragment>
            <Sidebar className="sidebar"/>
            <div className='feed-body'>
            {!feedLoading && feedEvents.map(event =>
                <FeedEvents event ={event}></FeedEvents>)}
            </div>
        </Fragment>);
}
export default Feed;

const FeedEvents = (props) =>{
    const {formatTime, convertToLocal} = useTimeConversion()
    const [startTime, setStartTime] = useState()
    const [endTime, setEndTime] = useState()
    useEffect(()=>{
        let stime = Temporal.Now.plainDateTimeISO()
        let etime = Temporal.Now.plainDateTimeISO()
        stime = convertToLocal(Temporal.Now.timeZone(), stime.year, stime.month, stime.day, props.event.starthour, props.event.startminute)
        etime = convertToLocal(Temporal.Now.timeZone(), etime.year, etime.month, etime.day, props.event.endhour, props.event.endminute)
        setStartTime(formatTime(stime.hour, stime.minute))
        setEndTime(formatTime(etime.hour, etime.minute))
        console.log(props.event)
    },[])
    useEffect(()=>{
        console.log("startTime", startTime)
    },[startTime])
    return(<Container>
                <Row className='daily-view-card-parent-row'>
                    <Col lg={{span:8, offset:2}} className="daily-event-col">
                    <Card className="eventcard">
                        <Card.Header className="dailyview-card-header">
                            <h1 className="dailyview-card-event-text">{props.event.eventname}</h1>
                            <p className="dailyview-card-time-text">{`${startTime} - ${endTime}`}</p>
                        </Card.Header>
                        <Card.Body>
                            <Image roundedCircle src={props.event.eventurl} className="event-image" size={20}>
                            </Image>
                        </Card.Body>
                        <Card.Footer>
                            <Row>
                                Tags:
                            </Row>
                            <Row>
                                <div>
                                    {props.event.selectedtags.length > 0 && props.event.selectedtags.map(tag=>(
                                        <Tag tag={tag}> </Tag>
                                    ))}
                                    {/* {props.props.selectedtags.length > 0 && <h1>adfasd</h1>} */}
                                </div>
                            </Row>
                        </Card.Footer>
                    </Card>
                    </Col>
                </Row>
    </Container>)
}
