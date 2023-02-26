import React, { useContext, useEffect } from 'react';
import Sidebar from './Sidebar';
import '../css/settings.css'
import { useNavigate } from 'react-router-dom';
import { UserContext } from './UserContext';
import useAPICall from '../hooks/useAPICall';
const Settings = () => {
    const {UCsetLoggedin, contextUsername} = useContext(UserContext)
    const navigate = useNavigate()
    const {res, callAPI:logOutUpdate} = useAPICall()

    useEffect(()=>{
        navigate('/landing')
    },[res])
    const logout = async(e) =>{
        e.preventDefault()
        try {
            await logOutUpdate(`http://localhost:4000/api/users/loggedin/${contextUsername}/false`, "PATCH")
        } catch (error) {
            console.error(error.message)
        }

    }
        return (
            <div>
                <Sidebar className="sidebar"/>
                <div className="settings-body">
                    <button className="logout-button" onClick={logout}></button>
                </div>
            </div>
    );
        }
 
export default Settings;