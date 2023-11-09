import useTimeConversion from "../hooks/useTimeConversion";
import React, { Component } from 'react';
import Tag from "./Tag";
import { faHeart, faComment } from "@fortawesome/free-solid-svg-icons";
import { Card, Col, Row, Image, Container } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";

const DailyViewCard = (props) => {
    const { formatTime } = useTimeConversion();
    return (
      <Container>
        <Row className="daily-view-card-parent-row">
          <Col lg={{ span: 8, offset: 2 }} className="daily-event-col">
            <Card className="eventcard">
            {!props.props.active && <div className="non-active-cover"> <FontAwesomeIcon icon={faLock} className="non-active-lock-logo"></FontAwesomeIcon><div></div>
                  </div>}
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
                  <Image roundedCircle src={props.props.eventurl} className={props.props.active ? "event-image" : "event-image-non-active"} size={20}></Image>
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
  export default DailyViewCard