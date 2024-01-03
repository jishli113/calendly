import React, { Component } from 'react';
import "../css/NotificationsSideBar.css"
import { Container } from 'react-bootstrap';
import { useEffect } from 'react';
import { useState } from 'react';
import { Card, Row, Col} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX, faCircle } from '@fortawesome/free-solid-svg-icons';
import FollowRequestTab from './FollowRequestTab';
import NotificationTab from './NotificationTab';
import useAPICallBody from '../hooks/useAPICallBody';
const NotificationsSideBar = (props) =>{
    const [type, setType] = useState()
    const [data, setData] = useState()
    const [followRequests, setFollowRequests] = useState()
    const [followRequestBar, setFollowRequestBar] = useState(false)
    const [followRequestNum, setFollowRequestNum] = useState(0)
    const [isLoading, setIsLoading] = useState(true)
    const {callAPI} = useAPICallBody()
    const pers = window.localStorage
    useEffect(()=>{
        setType(props.type)
        setData(props.data)
            setFollowRequests(props.followRequests)
            setFollowRequestNum(props.followRequests.length)
        setIsLoading(false)
    },[])
    useEffect(()=>{ 
        console.log(data != undefined && !isLoading) 
    },[data])
    function handleFollowRequestBar(update){
        setFollowRequestBar(update)
        console.log(followRequests)
    }
    async function removeFollowRequest(index){
        let copy = followRequests
        delete copy[index]
        setFollowRequests(copy)
        setFollowRequestNum(followRequestNum - 1)
        const res = await callAPI(`http://localhost:4000/api/users/notifications`, "POST",{username:pers.getItem("username")}) 
        setData(res)
        setIsLoading(false)
        console.log(res, "upd")
    }
    return(
        <div className='fol-popup'>
            <Container fluid className="notification-popup-inner">
                <Row>
                    <Col lg={{offset:11, span:1}}>
                            <FontAwesomeIcon icon={faX} onClick={props.close} style={{cursor:"pointer"}}></FontAwesomeIcon>
                    </Col>
                </Row>
                {props.type == "follow" && followRequests != undefined && followRequestNum > 0 ?
                <>
                    <Row>
                        <Card onClick = {()=>handleFollowRequestBar(!followRequestBar)}>
                            <Card.Text className='follow-request-text'>
                                Follow Requests
                            </Card.Text>
                            <FontAwesomeIcon className='follow-request-badge' icon={faCircle} color='red'></FontAwesomeIcon>
                            <Card.Text className='follow-request-badge-number'>{followRequestNum}</Card.Text>
                        </Card>
                    </Row>
                </>:<></>}
                {followRequestBar ? 
                <>
                <Row>
                    {followRequests.map((request, index)=>(
                        <FollowRequestTab remove = {removeFollowRequest} requester={request.requester} requested = {request.requested} index={index}></FollowRequestTab>
                    ))}
                </Row>
            </>:<></>}
                <Row>
                    {data != undefined && !isLoading ? data.map((request)=>(
                        <>
                        <NotificationTab message={request.message} time={request.time}></NotificationTab>
                        </>
                    )):<></>}
                </Row>
            </Container>
        </div>
    )

}
export default NotificationsSideBar