import React from 'react';
import "../css/App.css";
import {SidebarData} from "./SidebarData.js"
import "../css/Sidebar.css"
import {Link} from "react-router-dom"
import {useContext, useEffect, useState} from 'react'
import { UserContext } from './UserContext';
import { ListGroup, Container, Nav } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function Sidebar(){
    const pers = window.localStorage

    useEffect(()=>{
    })
    return(
    // <div className='sidebar'>
    //     <ul className='sidebar-ul'>
    //         <Link to='/'>
    //             <li className="calendly-header" key="calendly-logo">
    //                 Calendly
    //             </li>
    //         </Link>
    //         {SidebarData.map(val => {
    //             return(
    //                 <Link className="calendly-header-link" to={(val.title === "Social")?`${val.link}/${pers.getItem("contextUsername")}`:`${val.link}`}>
    //                     <li className="sidebar-item">
    //                         <div className='sidebar-title'>{val.title}</div>
    //                         <div className='sidebar-icon'>{val.icon}</div>
    //                      </li>
    //                 </Link>s
    //         )}
    //         )}
    //     </ul>
    // </div>
    <>
        {/* <Nav fluid className="col-md-12 sidebar">

        </Nav> */}
        <Container fluid className='sidebar'>
            <Nav>
                <Nav.Item>
                    <Nav.Link href="/">Calendly</Nav.Link>
                </Nav.Item>
                {SidebarData.map(val=>{
                    return(
                        <Nav.Item>
                        <Nav.Link href={(val.title === "Social")?`${val.link}/${pers.getItem("contextUsername")}`:`${val.link}`}>
                            <h1 className='sidebar-title'>{val.icon}{val.title}</h1>
                        </Nav.Link>
                    </Nav.Item>
                    )
                })}
            </Nav>
        </Container>
    </>
    );
}
export default Sidebar