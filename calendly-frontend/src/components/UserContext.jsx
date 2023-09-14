import React, { useEffect } from "react";
import { useState, createContext } from "react";

export const UserContext = createContext({})
export const UserContextProvider = ({children}) =>{
    const [contextUsername, setUsername] = useState(null)
    const [contextFirstname, setFirstname] = useState(null)
    const [contextLastname, setLastname] = useState(null)
    const [contextLoggedin, setLoggedin] = useState(false)
    const [contextFollowers, setContextFollowers] = useState(0)
    const [contextFollowing, setContextFollowing] = useState(0)
    const pers = window.localStorage

    useEffect(()=>{
        if (contextUsername){
            (contextUsername, "contextNULLCHECK")
            pers.setItem("contextUsername", contextUsername)
        }
    },[contextUsername])
    const UCsetUsername = (value) =>{
        setUsername(value)
        (value, "heree!")
    }

    const UCsetFirstname = (value) =>{
        setFirstname(value)
    }

    const UCsetLastname = (value) =>{
        setLastname(value)
    }

    const UCsetLoggedin = (value) =>{
        setLoggedin(value)
    }
    const UCsetFollowers = (value) =>{
        setContextFollowers(value)
    }

    const UCsetFollowing = (value) =>{
        setContextFollowing(value)
    }

    const value={contextUsername, UCsetUsername, contextFirstname, UCsetFirstname, contextLastname,UCsetLastname,contextLoggedin,UCsetLoggedin,contextFollowers, contextFollowing,UCsetFollowers, UCsetFollowing}

    return(
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    )

}