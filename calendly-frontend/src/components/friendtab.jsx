
import React, { Component } from 'react';
import Card from 'react-bootstrap/Card';
import '../friendtab.css'
import {Link, useNavigate} from "react-router-dom"

const FriendTab =(props) => {
        const navigate = useNavigate()
        console.log(props)
        const toProfile = () =>{
            navigate(`/social/${props.username}`,{username:props.username})
        }
        return (
                <Card className='friendtab' onClick={toProfile}>
                    <h1 className="friendtab-username">{props.username}</h1>
                    <img className="friendtab-pfp" src={props.pfpimg}></img>
                </Card>
        );
    }
export default FriendTab;