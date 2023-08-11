
import '../css/social.css'
import Sidebar from './Sidebar';
import FolPopup from './FolPopup.jsx'
import { useState,useContext,useEffect } from 'react';
import { UserContext } from './UserContext';
import { faUserPlus, faUserCheck } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate, useParams, Link } from 'react-router-dom';
import useAPICall from '../hooks/useAPICall';
import { Button } from 'react-bootstrap';

const Social =() => {
    const {contextUsername} = useContext(UserContext)
    const [open, setOpen] = useState(false)
    const [followerSwitch, setFollowerSwitch] = useState(true)
    const [isFollowing, setIsFollowing] = useState(false)
    const [followers,setFollowers] = useState()
    const [following, setFollowing] = useState()
    const [isLoading, setIsLoading] = useState(true)
    const [isFollowingLoading, setIsFollowingLoading] = useState(true)
    const {username} = useParams()
    const {callAPI:getNonBaseFollowingRequest} = useAPICall()
    const {callAPI:getNonBaseUserData} = useAPICall()
    const {callAPI:getBaseUserData} = useAPICall()
    const {callAPI:getFollowerCount} = useAPICall()
    const {callAPI:getFollowingCount} = useAPICall()
    const {callAPI:followRequest} = useAPICall()
    const {callAPI:unfollowRequest} = useAPICall()

    
    const pers = window.localStorage

    useEffect (() =>{
        console.log("changed")
        console.log(isFollowing)
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
        refreshCount()
    },[])
    useEffect(()=>{
        console.log(pers.getItem("contextUsername"), "fr")
        if(pers.getItem("username")!==username){
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
            if(pers.getItem("username") === pers.getItem("contextUsername")){
                pers.setItem("base", true)
                baseProcedure()
            }
            else{
                pers.setItem("base", false)
                notBaseProcedure()
            }
        }
        refreshCount()

    },[username])
    const notBaseProcedure =async()=>{
            let nbFollowing = await getNonBaseFollowingRequest(`http://localhost:4000/api/following/${pers.getItem("contextUsername")}/${username}`, "GET")
            detIsFollowing(nbFollowing)
            await getNonBaseUserData(`http://localhost:4000/api/users/${username}`, "GET")
    }
    const baseProcedure = async()=>{
        await getBaseUserData(`http://localhost:4000/api/users/${username}`,"GET")
    }
    const detIsFollowing = (data) =>{
        setIsFollowingLoading(true)
        if (Object.keys(data).length == 0){
            setIsFollowing(false)
        }
        else{
            setIsFollowing(true)
        }
        setIsFollowingLoading(false)
    }


    const openPopup = (fol) => {
        setOpen(!open)
        setFollowerSwitch(fol)
    }

    const handleFollow = async(updateFollow) =>{
        setIsFollowing(updateFollow)
        if (updateFollow){
            followRequest(`http://localhost:4000/api/follow/${pers.getItem("contextUsername")}/${pers.getItem("username")}`, "POST")
            setFollowers(followers + 1)
        }
        else
        {
            unfollowRequest(`http://localhost:4000/api/unfollow/${pers.getItem("contextUsername")}/${pers.getItem("username")}`,"DELETE")
            setFollowers(followers - 1)
        }
    }
    const handleClose = () =>{
        setOpen(!open)
        refreshCount()
    }
    async function refreshCount(){
        console.log(pers.getItem("base"))
        setIsLoading(true)
        let followers = await getFollowerCount(`http://localhost:4000/api/followercount/${(pers.getItem("username")===pers.getItem("contextUsername"))?pers.getItem("contextUsername"):pers.getItem("username")}`,"GET")
        let following = await getFollowingCount(`http://localhost:4000/api/followingcount/${(pers.getItem("username")===pers.getItem("contextUsername"))?pers.getItem("contextUsername"):pers.getItem("username")}`,"GET")
        setFollowers(parseInt((followers[0])["count"]))
        setFollowing(parseInt((following[0])["count"]))
        setIsLoading(false)
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
                            {!isFollowingLoading ? (!isFollowing ? 
                                           <Button> Follow  <FontAwesomeIcon className="follow-button"icon={faUserPlus} onClick={()=>handleFollow(true)}/></Button>
                                           :<Button> Following  <FontAwesomeIcon className="follow-button"icon={faUserCheck} onClick={()=>handleFollow(false)}/></Button>):<></>}
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