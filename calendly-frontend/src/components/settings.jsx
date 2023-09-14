import React, { useContext, useEffect } from 'react';
import Sidebar from './Sidebar';
import '../css/settings.css'
import { useNavigate } from 'react-router-dom';
import { UserContext } from './UserContext';
import useAPICall from '../hooks/useAPICall';
import { Button, Container, Row, Col } from 'react-bootstrap';
const Settings = () => {
    const {UCsetLoggedin, contextUsername} = useContext(UserContext)
    const navigate = useNavigate()
    const {res, callAPI:logOutUpdate} = useAPICall()

    useEffect(()=>{
        if (res !== undefined){
            navigate('/landing')
        }
    },[res])
    const logout = async(e) =>{
        ("wut")
        e.preventDefault()
        try {
            await logOutUpdate(`http://localhost:4000/api/logout/`, "POST")
            ("after")
            navigate('/login', {replace:true})
            
        } catch (error) {
            console.error(error.message)
        }

    }
        return (
            <>
            <Sidebar/>
            <Container>
                <Row>
                    <Col lg={{span:2, offset:2}}>
                        <Button onClick={(e)=>logout(e)}>Logout</Button>
                    </Col>
                </Row>

            </Container>
            </>
    );
        }
 
export default Settings;