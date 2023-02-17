
import React, { Component, useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import '../friendtab.css'
import {Link, useNavigate} from "react-router-dom"
import Social from './Social';
import {Route} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.css'

const FriendTab =(props) => {
        const navigate = useNavigate()
        const pers = localStorage
        const [isFollowing, setIsFollowing] = useState(false)
        useEffect(()=>{
            const getFolStatus = async() =>{
                console.log(pers.getItem("contextUsername"),props.username)
                const response = await fetch(`http://localhost:4000/api/following/${pers.getItem("contextUsername")}/${props.username}`,{
                    method:'GET',
                    headers:{"Content-Type":"application/json"}
                }).then((response)=>response.json()).then((json)=>console.log(json)).then((json)=>detIsFollowing(json))
        }
            const detIsFollowing = (data) =>{
                if (data === null){
                    setIsFollowing(false)
                }
                else{
                    setIsFollowing(true)
                }
            }
            getFolStatus()
        })
        const onExit = () =>{
            navigate(`/social/${props.username}`)
        }
        const handleFol = async() =>{
            console.log("fol")
            if (isFollowing === false){
                const follow = await fetch(`http://localhost:4000/api/follow/${pers.getItem("contextUsername")}/${props.username}`,{
                method:'POST',
                headers:{"Content-Type":"application/json"}
            })
            }
            else{
                const unfollow = await fetch(`http://localhost:4000/api/unfollow/${pers.getItem("contextUsername")}/${props.username}`,{
                method:'DELETE',
                headers:{"Content-Type":"application/json"}
            })
            }
        }
        return (
                <Card className='friendtab' key={window.location.pathname} onClick={onExit} >
                    <Card.Body className="friendtab-card-body">
                    <h1 className="friendtab-username">{props.username}</h1>
                    <img className="friendtab-pfp" src={props.pfpimg}></img>
                    {isFollowing ? <button className='friendtab-fol-button' onClick={handleFol}>Unfollow</button> : <button className='friendtab-fol-button'>Follow</button>}
                    </Card.Body>
                </Card>
        );
    }
export default FriendTab;