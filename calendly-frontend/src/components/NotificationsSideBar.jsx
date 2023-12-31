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
    const {callAPI} = useAPICallBody()
    const pers = window.localStorage
    useEffect(()=>{
        console.log(props.data, "dat")
        setType(props.type)
        setData(props.data)
            setFollowRequests(props.followRequests)
            setFollowRequestNum(props.followRequests.length)
    },[])
    function handleFollowRequestBar(update){
        setFollowRequestBar(update)
        console.log(followRequests)
    }
    async function removeFollowRequest(index){
        let copy = followRequests
        console.log(followRequestNum, "mnum")
        delete copy[index]
        setFollowRequests(copy)
        setFollowRequestNum(followRequestNum - 1)
        console.log(copy)
        console.log(copy.length, "len")
        const res = await callAPI(`http://localhost:4000/api/users/notifications`, "POST",{username:pers.getItem("username")}) 
        console.log(res, "ADSGASDHhu")
        setData(res)
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
                        <Card className='position-absolute' onClick = {()=>handleFollowRequestBar(!followRequestBar)}>
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
                    {followRequests.map((request, index)=>(
                        <FollowRequestTab remove = {removeFollowRequest} requester={request.requester} requested = {request.requested} index={index}></FollowRequestTab>
                    ))}
            </>:<></>}
                <Row>
                    {data != undefined && data.map((request)=>{
                        <>
                        ASDFAS
                        <NotificationTab message={request.message} time={request.time}></NotificationTab>
                        </>
                    })}
                </Row>
            </Container>
        </div>
    )

}
export default NotificationsSideBar