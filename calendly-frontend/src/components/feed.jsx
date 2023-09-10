import React, { Component, Fragment } from 'react';
import { useEffect, useState, useContext } from 'react';
import Sidebar from './Sidebar';
import { UserContext } from './UserContext';
import useAPICallBody from '../hooks/useAPICallBody';
import { Temporal } from '@js-temporal/polyfill';
import useTimeConversion from '../hooks/useTimeConversion';
import { Container, Row, Card, Col, Image } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment,  faHeart} from '@fortawesome/free-solid-svg-icons';
import Tag from './Tag';
import  "../css/feed.css";
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
        
    },[feedEvents])
    async function retrieveFeed(){
        let c = Temporal.Now.plainDateTimeISO()
        let date = convertToUTC(Temporal.Now.timeZone(), c.year, c.month, c.day, c.hour, c.minute)
        
        
        const body = {"username":username, "date": date.toString().substring(0,10)}
        
        let temp = await callAPI(`http://localhost:4000/api/feedevents`, "POST", body)
        
        setFeedEvents(temp)
        setFeedLoading(false)
    }
        return (
        <Fragment>
            <Sidebar className="sidebar"/>
            <div className='feed-body'>
            {!feedLoading && <>{feedEvents.length > 0 ? feedEvents.map(event =>
                <FeedEvents event ={event}></FeedEvents>) : <h1>Nothing to see here... Come back for updates!</h1>}</>}
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
        
    },[])
    function handleLike(){

    }
    return(<Container>
                <Row className='daily-view-card-parent-row'>
                    <Col lg={{span:8, offset:2}} className="daily-event-col">
                    <Card className="eventcard">
                        <Card.Header className="dailyview-card-header">
                            <h1 className="dailyview-card-event-text">{props.event.eventname}</h1>
                            <p className="dailyview-card-time-text">{`${startTime} - ${endTime}`}</p>
                        </Card.Header>
                        <Card.Body className='eventcard-card-body'>
                            <Col lg={{span:5, offset:2}}>
                            <Image roundedCircle src={props.event.eventurl} className="event-image" size={20}>
                            </Image>
                            </Col>
                            <Col lg={{span:2, offset:10}}>
                                <Row className='like-icon-row'>
                                    <FontAwesomeIcon icon={faHeart} className='like-icon' onClick={handleLike()}></FontAwesomeIcon>
                                </Row>
                                <h3>{props.event.likes.length}</h3>
                                <Row className='comment-icon-row'>
                                    <FontAwesomeIcon icon={faComment} className='comment-icon'></FontAwesomeIcon>
                                </Row>
                                <h3>{props.event.usercomments.length}</h3>
                            </Col>
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
                                </div>
                            </Row>
                        </Card.Footer>
                    </Card>
                    </Col>
                </Row>
    </Container>)
}
