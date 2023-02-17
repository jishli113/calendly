import React, { useContext } from 'react';
import Sidebar from './Sidebar';
import '../css/settings.css'
import { useNavigate } from 'react-router-dom';
import { UserContext } from './UserContext';

const Settings = () => {
    const {UCsetLoggedin, contextUsername} = useContext(UserContext)
    const navigate = useNavigate()
    const logout = async(e) =>{
        e.preventDefault()
        try {
            const body = {"loggedin":false}
            const logOutUpdate = await fetch(`http://localhost:4000/api/users/loggedin/${contextUsername}`,{
                method:"PATCH",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify(body)
            }).then(
                navigate('/landing')
            )
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