import React, { useEffect } from "react";
import '../css/CommentTab.css'
import { Container, Image, Row, Col } from "react-bootstrap";
const CommentTab = (props) =>{
    return(
        <>
            <Container className="comment-tab">
                <Row>
                    <Col lg={{span:1}}>
                            <Image roundedCircle src={props.comment.pfpimg} className="friendtab-pfp">
                            </Image>
                    </Col>
                    <Col lg={{span:2}} className="comment-username-margin">
                        <h5 className="commenttab-username">{props.comment.username}</h5>
                    </Col>
                    <Col lg={{span:8}}>
                        <h5>{props.comment.comment}</h5>
                    </Col>
                    <Col lg={{span:1}}>
                    </Col>
                </Row>
            </Container>
        </>
    )
}
export default CommentTab