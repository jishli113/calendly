
import React, { useContext } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import {Link, useNavigate} from "react-router-dom"
import { UserContext } from './UserContext';
import '../css/login.css'
import useAPICallBody from '../hooks/useAPICallBody';
import { Row, Col, Card, Container, Form, FormLabel, Button } from 'react-bootstrap';
import useAPIMultiPart from '../hooks/useAPIMultiPart';

const Login = () =>{
    const {contextUsername,UCsetUsername} = useContext(UserContext)
        const [loggedin, setLoggedIn] = useState(false)
        const [incorrectLogin, setIncorrectLogin] = useState(false)
        const {callAPI:loginAPICall} = useAPIMultiPart()
        const navigate = useNavigate()
        const [formValue, setFormValue] = useState(new FormData)
        const pers = window.localStorage


        const handleFormInputChange=(e)=>{
            const {name, value} = e.target
            if (! formValue.has(name)){
                formValue.append(name, value)
            }
            formValue.set(name, value)
            
        }

        const separateObject = data => {
            const res = [];
            const keys = Object.keys(data);
            keys.forEach(key => {
               res.push({
                  key: data[key]
               });
            });
            return res;
         };

         const onExit = (convertedData) =>{
            UCsetUsername(convertedData[0].key.username)
            pers.setItem("contextUsername", convertedData[0].key.username)
            navigate('/',{replace:true});
         }
        
        const updateLoggedIn = async(data) =>{
            if (data.status === "Failed"){
                setIncorrectLogin(true)
            }
            else{
                const convertedData = separateObject(JSON.parse(JSON.stringify(data)))

                onExit(convertedData)
            }
        }

        const onLogin = async(e) =>{
            e.preventDefault()
            try {
                const response = await loginAPICall('http://localhost:4000/api/login/', "POST", formValue)
                updateLoggedIn(response)
            } catch (error) {
                console.error(error.message)
            }
        }


        return (
            <>
                <Row className="my-5">
                </Row>
                <Row className="my-5">
                </Row>
                <Row>
                    <Col lg={{offset:3, span:6}}>
                        <Card>
                            <Form>
                                <Row className='my-5'>
                                    <Col className='text-center'>
                                        <Form.Text className='login-calendly-text'>Calendly</Form.Text>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col lg={{offset:3, span:6}}>
                                        <Form.Group>
                                            <Form.Label>
                                                Email Address
                                            </Form.Label>
                                            <Form.Control placeholder='Your Email Address' name="email" onChange={(e)=>handleFormInputChange(e)}></Form.Control>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col lg={{offset:3, span:6}}>
                                        <Form.Group>
                                            <Form.Label>
                                                Password
                                            </Form.Label>
                                            <Form.Control placeholder='Your Password' type='password' name="password" onChange={(e)=>handleFormInputChange(e)}></Form.Control>
                                            <Form.Label>
                                                <Link to="/register"> Dont have an account? Register Here</Link>
                                            </Form.Label>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row className='my-5'>
                                    {incorrectLogin && <Col className='text-center'>
                                    <Form.Text className='incorrect-login-text'>
                                    Incorrect Username or Password
                                    </Form.Text>
                                    </Col>}
                                </Row>
                                <Row className='my-5'>
                                    <Col lg={{offset:5}}>
                                        <Button onClick={onLogin}>
                                            Login
                                        </Button>
                                    </Col>
                                </Row>
                            </Form>
                        </Card>
                    </Col>
                </Row>
            </>
        );
    }
export default Login;
