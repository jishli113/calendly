import React, { Component, useContext, useState, useEffect } from 'react';
import { UserContext } from './UserContext';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faChevronLeft, faCircle, faLock } from '@fortawesome/free-solid-svg-icons'
import { Temporal } from '@js-temporal/polyfill';
import useAPICall from '../hooks/useAPICallBody';
import '../css/dailyview.css'
import { Card, Col, Row, Image } from 'react-bootstrap';
import useTimeConversion from '../hooks/useTimeConversion';
import Tag from './Tag';
const DailyView=(props)=>{

    const pers = window.localStorage
    const {contextUsername} = useContext(UserContext)
    const [currentDate, setCurrentDate] = useState(props.day)
    const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday","Sunday"]
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    const {res:events, callAPI:callGetEvents} = useAPICall()
    const {convertToLocal} = useTimeConversion()
    const [isRetrieving, setIsRetrieving] = useState(true)
    const [displayedEvents, setDisplayedEvents] = useState()


    useEffect(()=>{

        if (currentDate !== undefined){
            pers.setItem("selectedDay", currentDate.toString())
        }
        getCurrentEvents()
    },[currentDate])

    useEffect(()=>{
        console.log(isRetrieving)
    },[isRetrieving])
    useEffect(()=>{
        console.log(displayedEvents, "huh")
    },[displayedEvents])

    useEffect(()=>{
        if(currentDate === undefined){
            setCurrentDate(Temporal.PlainDate.from(pers.getItem("selectedDay")))
        }
    },[])
    useEffect(()=>{
        setCurrentDate(props.day)
    },[props.day])



    function timeComparator(obj1, obj2){
        return obj1.starthour != obj2.starthour ? obj1.starthour - obj2.starthour : obj1.startminute - obj2.st
    }

    async function getCurrentEvents(){
        let events = await(callGetEvents(`http://localhost:4000/api/dailyevents/${pers.getItem("contextUsername")}/${currentDate.toString()}`, "GET"))
        if (events !== undefined){
            console.log(events, "events")
            let eventsStore = events
            const localTz = Temporal.Now.timeZone()
            const dateOne = currentDate
            const dateTwo = dateOne.add({days:1})
            for (var i = 0; i < events.length; i++){
                let temp = undefined
                let d1bool = false
                let d2bool = false
                console.log(dateOne.toString(), dateTwo.toString())
                for (var j = 0; j < events[i].dates.length; j++){
                    d1bool = d1bool || dateOne.toString() ==  events[i].dates[j]
                    d2bool = d2bool || dateTwo.toString() == events[i].dates[j]
                }
                console.log(events[i].dates)
                if ((d1bool || d2bool) && (!d1bool || !d2bool)){
                    if (d1bool){
                        console.log("hey", events[i].starthour, events[i].startminute)
                        temp = convertToLocal(localTz, dateOne.year, dateOne.month,dateOne.day, events[i].starthour, events[i].startminute)
                        if (temp.year != dateOne.year || temp.month != dateOne.month || temp.day != dateOne.day){
                            console.log("gone", temp.toString())
                            eventsStore.splice(i,1)
                            i = i - 1
                            continue
                        }
                    }
                    if (d2bool){
                        temp = convertToLocal(localTz, dateTwo.year, dateTwo.month,dateTwo.day, events[i].starthour, events[i].startminute)
                        if (temp.year != dateOne.year || temp.month != dateOne.month || temp.day != dateOne.day){
                            console.log("gone")
                            eventsStore.splice(i, 1)
                            i = i - 1
                            continue
                        }
                    }
                }
                temp = convertToLocal(localTz, dateOne.year, dateOne.month,dateOne.day, events[i].starthour, events[i].startminute)
                eventsStore[i].starthour = temp.hour
                eventsStore[i].startminute = temp.minute
                temp = convertToLocal(localTz, dateOne.year, dateOne.month, dateOne.day, events[i].endhour, events[i].endminute)
                eventsStore[i].endhour = temp.hour
                eventsStore[i].endminute = temp.minute
            }
            console.log(eventsStore, "adfds")
            setIsRetrieving(false)
            setDisplayedEvents(eventsStore.sort(timeComparator))
        }
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
                 <h1 className='date-text'>{currentDate.toString().substring(0,10)}</h1>
                 <FontAwesomeIcon icon={faChevronLeft} className="day-before-button" onClick = {()=>prevDay()}></FontAwesomeIcon>
                 <FontAwesomeIcon icon={faChevronRight} className="day-after-button" onClick={()=>nextDay()}></FontAwesomeIcon>
             </Navbar>
             <div className="dailyview-events">
                {(!isRetrieving) && displayedEvents.map(event=>(
                    <DailyViewCard props={event}></DailyViewCard>
                ))}
             </div>
        </div>
    )
}

export default DailyView

const DailyViewCard=(props)=>{
    const {formatTime} = useTimeConversion()

    useEffect(()=>{
    },[])

    return(
        <Container>
        <Row className='daily-view-card-parent-row'>
            <Col lg={{span:8, offset:2}} className="daily-event-col">
            <Card className="eventcard">
            {!props.props.active && <div className="non-active-cover"> <FontAwesomeIcon icon={faLock} className="non-active-lock-logo"></FontAwesomeIcon><div></div>
                </div>}
                <Card.Header className="dailyview-card-header">
                    <h1 className="dailyview-card-event-text">{props.props.eventname}</h1>
                    <p className="dailyview-card-time-text">{`${formatTime(props.props.starthour, props.props.startminute)} - ${formatTime(props.props.endhour, props.props.endminute)}`}</p>
                </Card.Header>
                <Card.Body>
                    <Image roundedCircle src={props.props.eventurl} className={props.props.active ? "event-image" : "event-image-non-active"} size={20}>
                    </Image>
                </Card.Body>
                <Card.Footer>
                    <Row>
                        Tags:
                    </Row>
                    <Row>
                        <div>
                            {props.props.selectedtags.length > 0 && props.props.selectedtags.map(tag=>(
                                <Tag tag={tag}> </Tag>
                            ))}
                            {/* {props.props.selectedtags.length > 0 && <h1>adfasd</h1>} */}
                        </div>
                    </Row>
                </Card.Footer>
            </Card>
            </Col>
        </Row>
        </Container>
    )

}