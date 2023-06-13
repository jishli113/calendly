import React, { Component, useContext, useEffect } from 'react';
import {Navigate} from "react-router-dom"
import { UserContext } from './UserContext';

const LoginCheck =({element}) =>{
    useEffect(()=>{
        console.log("whfdsf")
    })
    const pers = window.localStorage
    

        return (
            (pers.getItem("contextUsername")==="null") ? (
                <Navigate replace = {true} to="/landing"/>
            ):(
                <>{element}</>
            )
        );
    // return(
    //     <>{element}</>
    // )
}
 
export default LoginCheck;