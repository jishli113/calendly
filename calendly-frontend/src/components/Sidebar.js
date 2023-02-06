import React from 'react';
import "../App.css";
import {SidebarData} from "./SidebarData.js"
import "../Sidebar.css"
import {Link} from "react-router-dom"

function Sidebar(){
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
                    <Link className="calendly-header-link" to={val.link}>
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