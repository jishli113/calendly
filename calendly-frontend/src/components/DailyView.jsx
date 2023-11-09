import React, { Component, useContext, useState, useEffect } from "react";
import { UserContext } from "./UserContext";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CommentView from "./CommentView";
import useAlterEvents from "../hooks/useAlterEvents";
import DailyViewCard from "./DailyViewCard";
import {
  faChevronRight,
  faChevronLeft,
  faCircle,
  faLock,
} from "@fortawesome/free-solid-svg-icons";
import { Temporal } from "@js-temporal/polyfill";
import useAPICall from "../hooks/useAPICallBody";
import "../css/dailyview.css";
import useTimeConversion from "../hooks/useTimeConversion";
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
  const {getCurrentEvents:alter} = useAlterEvents()

  useEffect(() => {
    if (currentDate !== undefined) {
      pers.setItem("selectedDay", currentDate.toString());
    }
    getCurrentEvents();
  }, [currentDate]);

  useEffect(() => {
    if (currentDate === undefined) {
      setCurrentDate(Temporal.PlainDate.from(pers.getItem("selectedDay")));
    }
  }, []);
  useEffect(() => {
    setCurrentDate(props.day);
  }, [props.day]);


  async function getCurrentEvents() {
      let temp = await alter(pers.getItem("contextUsername"), currentDate)
      setIsRetrieving(false);
      setDisplayedEvents(temp);
    }

  const nextDay = () => {
    setCurrentDate((currentDate) => currentDate.add({ days: 1 }));
  };

  const prevDay = () => {
    setCurrentDate((currentDate) => currentDate.add({ days: -1 }));
  };


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

