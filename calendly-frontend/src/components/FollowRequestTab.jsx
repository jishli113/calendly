import React, { Component, useEffect, useState } from 'react';
import { Row, Col, Card, Button } from 'react-bootstrap';
import useAPICallBody from '../hooks/useAPICallBody';

const FollowRequestTab = (props) =>{
    const {callAPI} = useAPICallBody()
    const [requestResolved, setRequestResolved] = useState(false)
    const [areFriends, setAreFriends] = useState(false)
    async function acceptFollowRequest(){
        setRequestResolved(true)
        setAreFriends(true)
        console.log(props.index)
        await callAPI(`http://localhost:4000/api/users/acceptfollowrequest`,"POST", {requested:props.requested, requester:props.requester})
        console.log("hey")
        props.remove(props.index)
        console.log(requestResolved, areFriends)
    }
    async function declineFollowRequest(){
        await callAPI(`http://localhost:4000/api/users/declinefollowrequest`,"POST",{requested:props.requested, requester:props.requester})
        setRequestResolved(true)
        setAreFriends(false)
    }

    async function handleFollow(){
        await callAPI(`http://localhost:4000/api/users/follow`, "POST", {followed:props.requester, follower:props.requested})
    }
    async function handleUnfollow(){
        await callAPI(`http://localhost:4000/api/users/unfollow`, "POST", {unfollower:props.requested, unfollowed:props.requester})
    }
    return(
        <>
            <Row >
            <Card >
                <Row>
                    <Col lg={{span:4}}>
                        <Card.Text>{props.requester}</Card.Text>
                    </Col>
                    {!requestResolved ? <><Col lg={{offset:2, span:2}}>
                        <Button size='sm' onClick={()=>acceptFollowRequest()}>
                            Accept
                        </Button>
                    </Col>
                    <Col lg={{span:2, offset:1}}>
                        <Button size='sm' variant='dark' onClick={()=>declineFollowRequest()}>
                            Decline
                        </Button></Col></>:
                        <>
                            <>
                            {areFriends ? 
                            <>
                                <Button size='sm' variant='light' onClick={()=>handleUnfollow()}>
                            Following
                            </Button>
                            </> :
                            <>
                                <Button size='sm' onClick={()=>handleFollow()}>
                                    Follow
                                </Button>
                            </>}
                        </>
                        </>}
                </Row>
            </Card>
            </Row>
        </>
    )
}
export default FollowRequestTab