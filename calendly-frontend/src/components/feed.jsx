import React, { Component, Fragment } from "react";
import { useEffect, useState, useContext } from "react";
import Sidebar from "./Sidebar";
import { UserContext } from "./UserContext";
import useAPICallBody from "../hooks/useAPICallBody";
import { Temporal } from "@js-temporal/polyfill";
import useTimeConversion from "../hooks/useTimeConversion";
import { Container, Row, Card, Col, Image } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment, faHeart } from "@fortawesome/free-solid-svg-icons";
import Tag from "./Tag";
import "../css/feed.css";
import CommentView from "./CommentView";
const Feed = () => {
  const {
    contextUsername,
  } = useContext(UserContext);
  const pers = window.localStorage;
  let username =
    pers.getItem("contextUsername") == null
      ? contextUsername
      : pers.getItem("contextUsername");
  const { callAPI } = useAPICallBody();
  const [feedLoading, setFeedLoading] = useState(true);
  const { convertToUTC} = useTimeConversion();
  const [feedEvents, setFeedEvents] = useState();
  const [selectedCommentsUsername, setSelectedCommentsUsername] = useState()
  const [selectedCommentsEventname, setSelectedCommentsEventname] = useState()
  const [commentsOpen, setCommentsOpen] = useState(false)
  useEffect(() => {
    retrieveFeed();
  }, []);
  async function retrieveFeed() {
    let c = Temporal.Now.plainDateTimeISO();
    let date = convertToUTC(
      Temporal.Now.timeZoneId(),
      c.year,
      c.month,
      c.day,
      c.hour,
      c.minute
    )
    const body = { username: username, date: date.toString().substring(0, 10) }
    let temp = await callAPI(
      `http://localhost:4000/api/events/feed`,
      "POST",
      body
    )
    setFeedEvents(temp);
    setFeedLoading(false);
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
    <Fragment>
      <Sidebar className="sidebar" />
      <div className="feed-body">
        {!feedLoading && (
          <>
            {feedEvents.length > 0 ? (
              feedEvents.map((event) => <FeedEvents event={event} handleComment={handleCommentOpen}></FeedEvents>)
            ) : (
              <h1>Nothing to see here... Come back for updates!</h1>
            )}
          </>
        )}
      </div>
    </Fragment>
    {commentsOpen && <CommentView handleClose ={handleCommentClose} username={selectedCommentsUsername} eventname={selectedCommentsEventname}></CommentView>}
    </>
  );
};
export default Feed;

const FeedEvents = (props) => {
  const { formatTime, convertToLocal } = useTimeConversion();
  const [startTime, setStartTime] = useState();
  const [endTime, setEndTime] = useState();
  const [likeCount, setLikeCount] = useState();
  const [liked, setLiked] = useState(false);
  const {callAPI: incrementLike} = useAPICallBody()
  const {callAPI:decrementLike} = useAPICallBody()
  useEffect(() => {
    let stime = Temporal.Now.plainDateTimeISO();
    let etime = Temporal.Now.plainDateTimeISO();
    stime = convertToLocal(
      Temporal.Now.timeZone(),
      stime.year,
      stime.month,
      stime.day,
      props.event.starthour,
      props.event.startminute
    );
    etime = convertToLocal(
      Temporal.Now.timeZone(),
      etime.year,
      etime.month,
      etime.day,
      props.event.endhour,
      props.event.endminute
    );
    setStartTime(formatTime(stime.hour, stime.minute));
    setEndTime(formatTime(etime.hour, etime.minute));
    setLikeCount(props.event.likes.length)
  }, []);
  async function handleLike() {
    setLikeCount(!liked ? likeCount + 1: likeCount - 1);
    setLiked(!liked)
    const body = {eventusername:props.event.forusername, eventname:props.event.eventname}
    if (!liked){
      await decrementLike('http://localhost:4000/api/events/incrementlike', "POST", body)
    }
    else{
      await incrementLike('http://localhost:4000/api/events/decrementlike', "POST", body)
    }
  }
  return (
    <Container>
      <Row className="daily-view-card-parent-row">
        <Col lg={{ span: 8, offset: 2 }} className="daily-event-col">
          <Card className="eventcard">
            <Card.Header className="dailyview-card-header">
              <h1 className="dailyview-card-event-text">
                {props.event.eventname}
              </h1>
              <p className="dailyview-card-time-text">{`${startTime} - ${endTime}`}</p>
            </Card.Header>
            <Card.Body className="eventcard-card-body">
              <Row>
              <Col lg={{ span: 5, offset: 2 }}>
                <Image
                  roundedCircle
                  src={props.event.eventurl}
                  className="event-image"
                  size={20}
                ></Image>
              </Col>
              <Col lg={{ span: 2, offset: 10 }}>
                <Row className="like-icon-row">
                  <FontAwesomeIcon
                    icon={faHeart}
                    className={liked ? "like-icon-liked" : "like-icon"}
                    onClick={() => handleLike()}
                  ></FontAwesomeIcon>
                </Row>
                <h3>{likeCount}</h3>
                <Row className="comment-icon-row">
                  <FontAwesomeIcon
                    icon={faComment}
                    className="comment-icon"
                    onClick={()=>props.handleComment(props.event.forusername, props.event.eventname)}
                  ></FontAwesomeIcon>
                </Row>
                <h3>{props.event.usercomments.length}</h3>
              </Col>
              </Row>
            </Card.Body>
            <Card.Footer>
              <Row>Tags:</Row>
              <Row>
                <div>
                  {props.event.selectedtags.length > 0 &&
                    props.event.selectedtags.map((tag) => (
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
