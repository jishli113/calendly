import React, { Component } from 'react';
import {Navigate} from "react-router-dom"

const LoginCheck =({element}) =>{


        return (
            // isLoggedIn ? (
            //     <>{this.state.children.element}</>
            // ):(
            //     <Navigate replace = {true} to="/login"/>
            // )
            <div>
                {element}
            </div>
        );
}
 
export default LoginCheck;