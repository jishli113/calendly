
import '../css/social.css'
import Sidebar from './Sidebar';
import FolPopup from './FolPopup.jsx'
import { useState,useContext,useEffect } from 'react';
import { UserContext } from './UserContext';
import { faUserPlus, faUserCheck } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate, useParams, Link } from 'react-router-dom';
import useAPICall from '../hooks/useAPICall';


const Social =() => {
    const {contextUsername,UCsetUsername, contextFirstname, UCsetFirstname, contextLastname, UCsetLastname, UCsetLoggedin, contextFollowers, contextFollowing, UCsetFollowers, UCsetFollowing} = useContext(UserContext)
    const [open, setOpen] = useState(false)
    const [followerSwitch, setFollowerSwitch] = useState(true)
    const [isFollowing, setIsFollowing] = useState(false)
    const [followers,setFollowers] = useState()
    const [following, setFollowing] = useState()
    const [isLoading, setIsLoading] = useState(true)
    const {username} = useParams()
    const {res:nonBaseFollowing, callAPI:getNonBaseFollowingRequest} = useAPICall()
    const {res:nonBaseData, callAPI:getNonBaseUserData} = useAPICall()
    const {res:baseData, callAPI:getBaseUserData} = useAPICall()
    const {res:postRet, callAPI:followRequest} = useAPICall()
    const {res:deleteRet, callAPI:unfollowRequest} = useAPICall()

    
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
        if (nonBaseData !== undefined){
            updateData(nonBaseData)
        }
    },[nonBaseData])
    useEffect(()=>{
        if (nonBaseFollowing !== undefined){
            detIsFollowing(nonBaseFollowing)
        }
    },[nonBaseFollowing])
    useEffect(()=>{
        if (baseData !== undefined){
            updateData(baseData)
        }
    })
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
    useEffect(()=>{

    })
    const notBaseProcedure =async()=>{
            await getNonBaseFollowingRequest(`http://localhost:4000/api/following/${pers.getItem("contextUsername")}/${username}`, "GET")
            detIsFollowing(nonBaseFollowing)
            await getNonBaseUserData(`http://localhost:4000/api/users/${username}`, "GET")
    }
    const baseProcedure = async()=>{
        await getBaseUserData(`http://localhost:4000/api/users/${username}`,"GET")
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
        console.log(data)
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
            followRequest(`http://localhost:4000/api/follow/${pers.getItem("contextUsername")}/${pers.getItem("username")}`, "POST")
        }
        else
        {
            unfollowRequest(`http://localhost:4000/api/unfollow/${pers.getItem("contextUsername")}/${pers.getItem("username")}`,"DELETE")
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
                        <h1 className="followers-text" onClick={()=>openPopup(true)}>{followers}<br></br>Followers</h1>
                        <h1 className="following-text" onClick={()=>openPopup(false)}>{following}<br></br>Following</h1>
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