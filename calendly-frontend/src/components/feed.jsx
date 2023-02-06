import React, { Component, Fragment } from 'react';
import { useEffect, useState } from 'react';
import { useContext } from 'react';
import FeedEvents from './feedEvents';
import Sidebar from './Sidebar';
import { UserContext } from './UserContext';
const Feed = ()=> {

    const onEffect =()=>{
        console.log(contextUsername)
    }

    const {contextUsername,UCsetUsername, contextFirstname, UCsetFirstname, contextLastname, UCsetLastname, UCsetLoggedin} = useContext(UserContext)
    const [cardInfo, setCardInfo] = useState([
        {id:0,username: "jish",eventName:"test1",times:"8-10", likes:0, comments:0, pfpimg:" ", storyimg:"images/klay.png", tagname:"hel",tagcolor:" "},
        {id:1,username: "jish1",eventName:"test2",times:"4-5", likes:0, comments:0, pfpimg:" ", storyimg:" ", tagname:"reebo",tagcolor:" "},
        {id:2,username: "jish2",eventName:"test3",times:"2:20-10", likes:0, comments:0, pfpimg:" ", storyimg:" ", tagname:" ",tagcolor:" "},
        {id:3,username: "jish3",eventName:"test4",times:"10:30-12", likes:0, comments:0, pfpimg:" ", storyimg:" ", tagname:" ",tagcolor:" "}]
    )
    const incrementLike = (counterId) =>{
        const t = cardInfo
        t[counterId].likes = t[counterId].likes + 1;
        setCardInfo(t);
    };
    useEffect(()=>{
        console.log(contextUsername)
    })
        return (
        <Fragment>
            <Sidebar className="sidebar"/>
            <div className='feed-body'>
            {cardInfo.map(event =>
                <FeedEvents 
                id={event.id}
                event = {event}
                incrementLike={incrementLike}/>)}
            </div>
        </Fragment>);
}

 
export default Feed;