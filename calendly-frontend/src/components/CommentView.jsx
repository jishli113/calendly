import React, { useState } from "react";
import { useEffect } from "react";
import { Container, Row, Col, Card, FormControl } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMessage, faX } from "@fortawesome/free-solid-svg-icons";
import "../css/CommentView.css"
import useAPICallBody from "../hooks/useAPICallBody";
import CommentTab from "./CommentTab";

const CommentView =(props) =>{
    const [comment, setComment] = useState()
    const [commentThread, setCommentThread] = useState()
    const [isLoading, setIsLoading] = useState(true)
    const {callAPI:callAPIBody} = useAPICallBody()

    useEffect(()=>{
        loadComments()
    },[])
    async function loadComments(){
        let comments = await callAPIBody('http://localhost:4000/api/getcomments',"POST", {username:props.username, eventname:props.eventname})
        setCommentThread(comments)
        setIsLoading(false)
    }
    const commentChange=(e)=>{
        setComment(e.target.value)
    }

    async function postComment(){
        let postResponse = await callAPIBody('http://localhost:4000/api/comment', "POST", {comment:comment, eventusername:props.username, eventname:props.eventname})
        //if successful reload the comment thread or temporarily add it to the thread
    }
    function handlePostComment(){

    }
    return(
        <>
            <Container className="commentview-popup">
                <Card className="commentview-inner">
                    <Card.Header>
                        <Row>
                            <Col lg={{span:1, offset:11}}>
                                <FontAwesomeIcon icon={faX} onClick={props.handleClose}>
                                </FontAwesomeIcon>
                            </Col>

                        </Row>
                    </Card.Header>
                    <Card.Body className="comments">
                        <Container>
                            {!isLoading &&
                            <>
                            {commentThread.map((comment)=>{
                                return(
                                    <CommentTab comment={comment}></CommentTab>
                                )
                            })}
                            </>}
                        </Container>
                    </Card.Body>
                    <Card.Footer>
                        <Row>
                            <Col lg={{span:9, offset:1}}>
                                <FormControl onChange={(e)=>commentChange(e)}>

                                </FormControl>
                            </Col>
                            <Col lg={{span:2}}>
                                <FontAwesomeIcon icon={faMessage} onClick={postComment} className="send-comment-button"></FontAwesomeIcon>
                            </Col>
                        </Row>
                    </Card.Footer>
                </Card>
            </Container>
        </>
    )
}
export default CommentView