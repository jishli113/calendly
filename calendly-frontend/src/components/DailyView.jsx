import React, { Component, useContext, useState, useEffect } from "react";
import { UserContext } from "./UserContext";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CommentView from "./CommentView";
import {
  faChevronRight,
  faChevronLeft,
  faCircle,
  faLock,
} from "@fortawesome/free-solid-svg-icons";
import { Temporal } from "@js-temporal/polyfill";
import useAPICall from "../hooks/useAPICallBody";
import "../css/dailyview.css";
import { Card, Col, Row, Image } from "react-bootstrap";
import useTimeConversion from "../hooks/useTimeConversion";
import Tag from "./Tag";
import { faHeart, faComment } from "@fortawesome/free-solid-svg-icons";
import useAPICallBody from "../hooks/useAPICallBody";
const DailyView = (props) => {
  const pers = window.localStorage;
  const { contextUsername } = useContext(UserContext);
  const [currentDate, setCurrentDate] = useState(props.day);
  const [selectedCommentsUsername, setSelectedCommentsUsername] = useState()
  const [selectedCommentsEventname, setSelectedCommentsEventname] = useState()
  const dayNames = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const { res: events, callAPI: callGetEvents } = useAPICallBody();
  const { convertToLocal } = useTimeConversion();
  const [isRetrieving, setIsRetrieving] = useState(true);
  const [displayedEvents, setDisplayedEvents] = useState();
  const [commentsOpen, setCommentsOpen] = useState(false)

  useEffect(() => {
    if (currentDate !== undefined) {
      pers.setItem("selectedDay", currentDate.toString());
    }
    getCurrentEvents();
  }, [currentDate]);

  useEffect(()=>{
    console.log(commentsOpen)
  },[commentsOpen])

  useEffect(() => {
    if (currentDate === undefined) {
      setCurrentDate(Temporal.PlainDate.from(pers.getItem("selectedDay")));
    }
  }, []);
  useEffect(() => {
    setCurrentDate(props.day);
  }, [props.day]);

  function timeComparator(obj1, obj2) {
    return obj1.starthour != obj2.starthour
      ? obj1.starthour - obj2.starthour
      : obj1.startminute - obj2.st;
  }

  async function getCurrentEvents() {
    let events = await callGetEvents(
      `http://localhost:4000/api/dailyevents/`,
      "POST",
      {
        username: pers.getItem("contextUsername"),
        date: currentDate.toString(),
      }
    );
    console.log(events)
    if (events !== undefined) {
      let eventsStore = events;
      const localTz = Temporal.Now.timeZone();
      const dateOne = currentDate;
      const dateTwo = dateOne.add({ days: 1 });
      for (var i = 0; i < events.length; i++) {
        let temp = undefined;
        let d1bool = false;
        let d2bool = false
        for (var j = 0; j < events[i].dates.length; j++) {
          d1bool = d1bool || dateOne.toString() == events[i].dates[j];
          d2bool = d2bool || dateTwo.toString() == events[i].dates[j];
        }
        if ((d1bool || d2bool) && (!d1bool || !d2bool)) {
          if (d1bool) {
            temp = convertToLocal(
              localTz,
              dateOne.year,
              dateOne.month,
              dateOne.day,
              events[i].starthour,
              events[i].startminute
            );
            if (
              temp.year != dateOne.year ||
              temp.month != dateOne.month ||
              temp.day != dateOne.day
            ) {
              eventsStore.splice(i, 1);
              i = i - 1;
              continue;
            }
          }
          if (d2bool) {
            temp = convertToLocal(
              localTz,
              dateTwo.year,
              dateTwo.month,
              dateTwo.day,
              events[i].starthour,
              events[i].startminute
            );
            if (
              temp.year != dateOne.year ||
              temp.month != dateOne.month ||
              temp.day != dateOne.day
            ) {
              eventsStore.splice(i, 1);
              i = i - 1;
              continue;
            }
          }
        }
        temp = convertToLocal(
          localTz,
          dateOne.year,
          dateOne.month,
          dateOne.day,
          events[i].starthour,
          events[i].startminute
        );
        eventsStore[i].starthour = temp.hour;
        eventsStore[i].startminute = temp.minute;
        temp = convertToLocal(
          localTz,
          dateOne.year,
          dateOne.month,
          dateOne.day,
          events[i].endhour,
          events[i].endminute
        );
        eventsStore[i].endhour = temp.hour;
        eventsStore[i].endminute = temp.minute;
      }
      setIsRetrieving(false);
      setDisplayedEvents(eventsStore.sort(timeComparator));
    }
  }

  const nextDay = () => {
    setCurrentDate((currentDate) => currentDate.add({ days: 1 }));
  };

  const prevDay = () => {
    setCurrentDate((currentDate) => currentDate.add({ days: -1 }));
  };

  function refactorDate() {
    return currentDate.toString();
  }

  function handleCommentOpen(eventname, username){
    setCommentsOpen(true)
    setSelectedCommentsEventname(eventname)
    setSelectedCommentsUsername(username)
  }
  function handleCommentClose(){
    setCommentsOpen(false)
  }

  return (
    <>
    <div className="dailyview-display">
      <Navbar bg="light" className="switch-days-nav">
        <h1 className="date-text">{currentDate.toString().substring(0, 10)}</h1>
        <FontAwesomeIcon
          icon={faChevronLeft}
          className="day-before-button"
          onClick={() => prevDay()}
        ></FontAwesomeIcon>
        <FontAwesomeIcon
          icon={faChevronRight}
          className="day-after-button"
          onClick={() => nextDay()}
        ></FontAwesomeIcon>
      </Navbar>
      <div className="dailyview-events">
        {!isRetrieving &&
          displayedEvents.map((event) => (
            <DailyViewCard props={event} handleComment = {handleCommentOpen}></DailyViewCard>
          ))}
      </div>
    </div>
    {commentsOpen ? <CommentView handleClose ={handleCommentClose} username={selectedCommentsUsername} eventname={selectedCommentsEventname}></CommentView> : ""}
    </>
  );
};

export default DailyView;

const DailyViewCard = (props) => {
  const { formatTime } = useTimeConversion();
  return (
    <Container>
      <Row className="daily-view-card-parent-row">
        <Col lg={{ span: 8, offset: 2 }} className="daily-event-col">
          <Card className="eventcard">
            <Card.Header className="dailyview-card-header">
              <h1 className="dailyview-card-event-text">
                {props.props.eventname}
              </h1>
              <p className="dailyview-card-time-text">{`${formatTime(
                props.props.starthour,
                props.props.startminute
              )} - ${formatTime(
                props.props.endhour,
                props.props.endminute
              )}`}</p>
            </Card.Header>
            <Card.Body className="eventcard-card-body">
              <Container>
                <Row>
                <Col lg={{ span: 5, offset: 2 }}>
                  <Image
                    roundedCircle
                    src={props.props.eventurl}
                    className="event-image"
                    size={20}
                  ></Image>
                </Col>
                <Col lg={{ span: 2, offset: 3 }}>
                  <Row className="like-icon-row">
                    <FontAwesomeIcon
                      icon={faHeart}
                      className="like-icon"
                    ></FontAwesomeIcon>
                  </Row>
                  <Row className="my-2">
                    <h3 className="like-number">{props.props.likes.length}</h3>
                  </Row>
                  <Row className="comment-icon-row">
                    <FontAwesomeIcon
                      icon={faComment}
                      className="comment-icon"
                      onClick={()=>props.handleComment(props.props.eventname, props.props.username)}
                    ></FontAwesomeIcon>
                  </Row>
                  <Row className="my-2 align-items-right">
                    <h3 className="comment-number">
                      {props.props.usercomments.length}
                    </h3>
                  </Row>
                </Col>
                </Row>
              </Container>
            </Card.Body>
            <Card.Footer>
              <Row>Tags:</Row>
              <Row>
                <div>
                  {props.props.selectedtags.length > 0 &&
                    props.props.selectedtags.map((tag) => (
                      <Tag tag={tag}> </Tag>
                    ))}
                </div>
              </Row>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};
