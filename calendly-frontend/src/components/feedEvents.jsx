import React, { Component } from 'react';
import Card from 'react-bootstrap/Card';
import '../feedEvents.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart } from '@fortawesome/free-solid-svg-icons'
import { faComment } from '@fortawesome/free-solid-svg-icons'

const FeedEvents = (props) => {
    const incrementLike = () =>{
    props.incrementLike(props.id)
};
        return (
    <Card style={{marginBottom:'10px'}}>
      <Card.Header style={{height:'4rem'}}>
        <div className="header-1">
            <img src={props.pfpimg} className="pfpimg"></img>
            <h2 className="username">{props.username}</h2>
        </div>
        <div className="header-2">
            <h2 className="event-name">{props.eventName}</h2>
        </div>
        <div className="header-3">
            <h2 className="times">{props.times}</h2>  
        </div>
      </Card.Header>
      <Card.Body >
        <div className='tags'>
            <div className='tag'>
                <div className='circle'/>
                <div className='tagname'>{props.tagname}</div>
            </div>
        </div>
        <div className='story'>
            <img src={props.storyimg} className="story-img" alt='cannot display'></img>
        </div>
            <div className="likes-div">
                <FontAwesomeIcon onClick={incrementLike} className='likes-icon' icon={faHeart} />
                <h1 className="likes-count">{props.likes}</h1>
                </div>
            <div className='comment-div'>
                <FontAwesomeIcon className='comment-icon' icon={faComment} />
                <h1 className='comment-count'>{props.comments}</h1>
            </div>
      </Card.Body>
    </Card>
        );
    }
export default FeedEvents;