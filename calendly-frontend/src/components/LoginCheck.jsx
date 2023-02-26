import React, { Component, useContext } from 'react';
import {Navigate} from "react-router-dom"
import { UserContext } from './UserContext';

const LoginCheck =({element}) =>{
    const {contextLoggedIn} = useContext(UserContext)
    

        // return (
        //     contextLoggedIn ? (
        //         <>{this.state.children.element}</>
        //     ):(
        //         <Navigate replace = {true} to="/landing"/>
        //     )
        // );
    return(
        <>{element}</>
    )
}
 
export default LoginCheck;