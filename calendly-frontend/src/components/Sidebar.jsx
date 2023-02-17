import React from 'react';
import "../App.css";
import {SidebarData} from "./SidebarData.js"
import "../Sidebar.css"
import {Link} from "react-router-dom"
import {useContext, useEffect} from 'react'
import { UserContext } from './UserContext';

function Sidebar(){
    const {contextUsername} = useContext(UserContext)
    const pers = window.localStorage

    useEffect(()=>{
        if(contextUsername !== null){
            console.log("sidebar", contextUsername)
            pers.setItem("username", contextUsername)
        }
    })
    return(
    <div className='sidebar'>
        <ul className='sidebar-ul'>
            <Link to='/'>
                <li className="calendly-header">
                    Calendly
                </li>
            </Link>
            {SidebarData.map(val => {
                return(
                    <Link className="calendly-header-link" to={(val.title === "Social")?`${val.link}/${pers.getItem("username")}`:`${val.link}`}>
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