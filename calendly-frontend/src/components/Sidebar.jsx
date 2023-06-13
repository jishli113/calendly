import React from 'react';
import "../css/App.css";
import {SidebarData} from "./SidebarData.js"
import "../css/Sidebar.css"
import {Link} from "react-router-dom"
import {useContext, useEffect, useState} from 'react'
import { UserContext } from './UserContext';

function Sidebar(){
    const {contextUsername} = useContext(UserContext)
    const [username, setUsername] = useState()
    const pers = window.localStorage

    useEffect(()=>{
        if(contextUsername !== null){
            pers.setItem("contextUsername", contextUsername)
            setUsername(contextUsername)
        }
        else{
            setUsername(pers.getItem("contextUsername"))
        }
    })
    return(
    <div className='sidebar'>
        <ul className='sidebar-ul'>
            <Link to='/'>
                <li className="calendly-header" key="calendly-logo">
                    Calendly
                </li>
            </Link>
            {SidebarData.map(val => {
                return(
                    <Link className="calendly-header-link" to={(val.title === "Social")?`${val.link}/${username}`:`${val.link}`}>
                        <li className="sidebar-item">
                            <div className='sidebar-title'>{val.title}</div>
                            <div className='sidebar-icon'>{val.icon}</div>
                         </li>
                    </Link>
            )}
            )}
        </ul>
    </div>
    );
}
export default Sidebar