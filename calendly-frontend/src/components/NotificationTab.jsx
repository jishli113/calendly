import React, { Component, useEffect } from 'react';
import { Card, Row, Col, Image} from 'react-bootstrap';
const NotificationTab =(props)=>{
    return(
        <>
            <Card className='my-2'>
                <Row>
                    <Col lg={{span:2}}>
                        <Image></Image>
                    </Col>
                    <Col lg={{span:7}}>
                        <Card.Text>{props.message}</Card.Text>
                    </Col>
                    <Col lg={{span:3}}>
                        <Card.Text>
                            {props.time}
                        </Card.Text>
                    </Col>
                </Row>
            </Card>
        </>
    )
}
export default NotificationTab