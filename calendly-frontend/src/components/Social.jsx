
import '../social.css'
import Sidebar from './Sidebar';
import FolPopup from './FolPopup.js'
import { useState,useContext,useEffect } from 'react';
import { UserContext } from './UserContext';
import { faUserPlus, faUserCheck } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate, useParams, Link } from 'react-router-dom';


const Social =() => {
    const {contextUsername,UCsetUsername, contextFirstname, UCsetFirstname, contextLastname, UCsetLastname, UCsetLoggedin, contextFollowers, contextFollowing, UCsetFollowers, UCsetFollowing} = useContext(UserContext)
    const [open, setOpen] = useState(false)
    const [followerSwitch, setFollowerSwitch] = useState(true)
    const [isFollowing, setIsFollowing] = useState(false)
    const [followers,setFollowers] = useState()
    const [following, setFollowing] = useState()
    const [isLoading, setIsLoading] = useState(true)
    const {username} = useParams()
    const pers = window.localStorage

    useEffect (() =>{
        if(pers.getItem("username")!==username){
            pers.setItem("username",username)
        }
        if (contextUsername !== null){
            pers.setItem("contextUsername", contextUsername)
            if (username === contextUsername){
                baseProcedure()
            }
            else{
                notBaseProcedure()
            }
        }
        else{
            if(pers.getItem("username") !== pers.getItem("contextUsername")){
                baseProcedure()
            }
            else{
                notBaseProcedure()
            }
        }

    },[])
    useEffect(()=>{
        console.log(pers.getItem("contextUsername"), "fr")
        if(pers.getItem("username")!==username){
            console.log("what")
            pers.setItem("username",username)
        }
        setOpen(false)
        if (contextUsername !== null){
            pers.setItem("contextUsername", contextUsername)
            if (username === contextUsername){
                pers.setItem("base",true)
                baseProcedure()
            }
            else{
                pers.setItem("base",false)
                notBaseProcedure()
            }
        }
        else{
            if(pers.getItem("base") === 'true'){
                baseProcedure()
            }
            else{
                notBaseProcedure()
            }
        }

    },[username])
    const notBaseProcedure = async()=>{
            await fetch(`http://localhost:4000/api/following/${pers.getItem("contextUsername")}/${username}`,
            {
                method:"GET",
                headers:{"Content-Type":"application/json"}
            }).then((response)=>response.json())
            .then((json)=>detIsFollowing(json))
            await fetch(`http://localhost:4000/api/users/${username}`,
        {
            method:"GET",
            headers:{"Content-Type":"application/json"}
        }).then((response) => response.json())
        .then((json) =>updateData(json))
    }
    const baseProcedure = async()=>{
            await fetch(`http://localhost:4000/api/users/${username}`,
            {method:"GET",
            headers:{"Content-Type":"application/json"}}).then((response)=>response.json()).then((json)=>updateData(json))
    }
    const detIsFollowing = (data) =>{
        if (data === null){
            setIsFollowing(false)
        }
        else{
            setIsFollowing(true)
        }
    }
    const updateData = (data) =>{
        let convertedData = separateObject(JSON.parse(JSON.stringify(data)))
        setFollowers(convertedData[0].key.followers)
        setFollowing(convertedData[0].key.following)
        setIsLoading(false)

    } 

    const separateObject = data => {
        const res = [];
        const keys = Object.keys(data);
        keys.forEach(key => {
           res.push({
              key: data[key]
           }); 
        });
        return res;
     };

    const openPopup = (fol) => {
        setOpen(!open)
        setFollowerSwitch(fol)
    }

    const handleFollow = async(updateFollow) =>{
        setIsFollowing(updateFollow)
        if (updateFollow){
            console.log("whas")
            const follow = await fetch(`http://localhost:4000/api/follow/${pers.getItem("contextUsername")}/${pers.getItem("username")}`,
            {method:'POST',
        headers:{"Content-Type":"application/json"}})
        }
        else
        {
            const unfollow = await fetch(`http://localhost:4000/api/unfollow/${pers.getItem("contextUsername")}/${pers.get("username")}`,
                {method:'DELETE',
            headers:{"Content-Type":"application/json"}})
        }
    }
    const handleClose = () =>{
        setOpen(!open)
    }
        return (
                <div className='body' >
                <Sidebar className="sidebar"/>
                {!isLoading && <div className="social-body">
                <div className="profile-header">
                    <div className='pfp-username-div'>
                        <img className="pfpimg-social"></img>
                        <h1 className="username-social">{username}</h1>
                    </div>
                    <div className="fol-div">
                        <h1 className="followers" onClick={()=>openPopup(true)}>{followers}<br></br>Followers</h1>
                        <h1 className="following" onClick={()=>openPopup(false)}>{following}<br></br>Following</h1>
                        {pers.getItem("username") !== pers.getItem("contextUsername") &&
                        <div className="follow-icon-div">
                            {!isFollowing ? 
                                           <FontAwesomeIcon className="follow-button"icon={faUserPlus} onClick={()=>handleFollow(true)}/>
                                           :<FontAwesomeIcon className="follow-button"icon={faUserCheck} onClick={()=>handleFollow(false)}/>}
                        </div>
                        }
                    </div>
                </div>
                {open && 
                <FolPopup className="fol-popup-social" trigger={true} folswitch={followerSwitch} handleClose={handleClose} username={username}>
                </FolPopup>
                }
                </div>}
                </div>
        );
    } 
export default Social;