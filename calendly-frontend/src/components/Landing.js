
import React, { useContext } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import {Link, useNavigate} from "react-router-dom"
import { UserContext } from './UserContext';
import '../landing.css'

const Landing = () =>{
    const {contextUsername,UCsetUsername, contextFirstname, UCsetFirstname, contextLastname, UCsetLastname, UCsetLoggedin, contextFollowers, contextFollowing, UCsetFollowers, UCsetFollowing} = useContext(UserContext)
        const [username, setUsername] = useState()
        const [password, setPassword] = useState()
        const [loggedin, setLoggedIn] = useState(false)
        const navigate = useNavigate()



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
            UCsetFirstname(convertedData[0].key.firstname)
            UCsetLastname(convertedData[0].key.lastname)
            UCsetLoggedin(convertedData[0].key.loggedin)
            navigate('/',{replace:true});
         }
        
        const updateLoggedIn = async(data) =>{
            console.log("landed")
            const convertedData = separateObject(JSON.parse(JSON.stringify(data)))
            if(convertedData[0].key.password === password){
                try {
                    const body = {"loggedin":true}
                    console.log(body)
                    const r = await fetch(`http://localhost:4000/api/users/loggedin/${username}`,{
                        method:"PATCH",
                        headers:{"Content-Type":"application/json"},
                        body:JSON.stringify(body)
                    }).then(
                        onExit(convertedData)
                    )
                    console.log(r)
                    
                } catch (error) {
                    console.error(error.message)
                }
            }
            else{
                console.log("Username or password are incorrect")
            }
        }

        const onLogin = async(e) =>{
            e.preventDefault()
            try {
                const response = await fetch(`http://localhost:4000/api/users/${username}`,{
                    method:"GET",
                    headers:{"Content-Type":"application/json"},
                }).then((response) => response.json())
                .then((json)=>updateLoggedIn(json))
            } catch (error) {
                console.error(error.message)
            }
        }


        return (
            <div className="landing-div">
                <h1 className="landing-header">Calendly</h1>
                <label className="login-username-input">
                    <span> Username</span>
                    <input type="text" onChange={e =>setUsername(e.target.value)}/>
                </label>
                <label className="login-password-input">
                    <span>Password </span>
                    <input type="text" onChange={e => setPassword(e.target.value)}/>
                </label>
                <button className="landing-login-button" onClick={onLogin} > Login </button>
                <h1>Dont have an account? <Link to="/register">Register here</Link></h1>
            </div>
        );
    }
export default Landing;