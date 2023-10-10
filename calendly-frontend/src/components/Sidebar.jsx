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
    <>
        <Container fluid className='sidebar'>
            <Nav>
                <Nav.Item>
                    <Nav.Link href="/"><h1 className='sidebar-calendly-title'>Calendly</h1></Nav.Link>
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