

import React, { Component, useContext, useEffect, useState } from 'react';
import {Navigate} from "react-router-dom"
import { UserContext } from './UserContext';
import { Nav } from 'react-bootstrap';
import useAPICall from '../hooks/useAPICall';

const LoginCheck =({element}) =>{
    const [isAuth, setIsAuth] = useState(undefined)
    const {callAPI:authenticate} = useAPICall()
    useEffect(()=>{
        ("whfdsf")
        checkStatus()
    },[])
    async function checkStatus(){
        let res = await authenticate(`http://localhost:4000/authenticate`, "POST")
        setIsAuth(res)
    }
    

    return (
        <div>
            {(isAuth !== undefined) ? (<>
            {isAuth.status === "success" ? <>{element}</> : <Navigate replace={true} to="/login"></Navigate>}
            </>):<div></div>}
        </div>
    )

}
 
export default LoginCheck;