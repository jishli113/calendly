
import React, { Component, useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import '../css/friendtab.css'
import {Link, useNavigate} from "react-router-dom"
import Social from './Social';
import {Route} from "react-router-dom";
import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css'
import useAPICall from '../hooks/useAPICall';

const FriendTab =(props) => {
        const navigate = useNavigate()
        const pers = localStorage
        const {res:followingData, callAPI:getFollowingData} = useAPICall()
        const [isFollowing, setIsFollowing] = useState(false)
        useEffect(()=>{
            detIsFollowing(followingData)
        },[followingData])
        useEffect(()=>{
            const getFolStatus = async() =>{
                console.log(pers.getItem("contextUsername"),props.username)
                await getFollowingData(`http://localhost:4000/api/following/${pers.getItem("contextUsername")}/${props.username}`, "GET")
        }
            getFolStatus()
        })
        const detIsFollowing = (data) =>{
            if (data === undefined){
                setIsFollowing(false)
            }
            else{
                console.log(data)
                setIsFollowing(true)
            }
        }
        const onExit = () =>{
            navigate(`/social/${props.username}`)
        }
        const handleFol = async() =>{
            console.log("fol")
            if (isFollowing === false){
                await fetch(`http://localhost:4000/api/follow/${pers.getItem("contextUsername")}/${props.username}`,{
                method:'POST',
                headers:{"Content-Type":"application/json"}
            })
            }
            else{
                await fetch(`http://localhost:4000/api/unfollow/${pers.getItem("contextUsername")}/${props.username}`,{
                method:'DELETE',
                headers:{"Content-Type":"application/json"}
            })
            }
        }
        return (
                <Card style={{height:'100%', width:'100%', borderRadius:'20px', borderColor:'#3BBA9C', borderWidth:'3px', backgroundColor:'#43455C'}} key={window.location.pathname} onClick={onExit} >
                    <Card.Body className="friendtab-card-body">
                    <h1 className="friendtab-username">{props.username}</h1>
                    <img className="friendtab-pfp" src={props.pfpimg}></img>
                    {isFollowing ? <Button className='fol-button' onClick={handleFol}>Following</Button> : <Button className='fol-button'>Follow</Button>}
                    </Card.Body>
                </Card>
        );
    }
export default FriendTab;