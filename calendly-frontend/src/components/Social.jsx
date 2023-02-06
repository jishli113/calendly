
import '../social.css'
import Sidebar from './Sidebar';
import FolPopup from './FolPopup.js'
import { useState,useContext,useEffect } from 'react';
import { UserContext } from './UserContext';
import { faUser, faUserPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


const Social =(props) => {
    const {contextUsername,UCsetUsername, contextFirstname, UCsetFirstname, contextLastname, UCsetLastname, UCsetLoggedin, contextFollowers, contextFollowing, UCsetFollowers, UCsetFollowing} = useContext(UserContext)
    const [open, setOpen] = useState(false)
    const [followerSwitch, setFollowerSwitch] = useState(true)
    const [isFollowing, setIsFollowing] = useState(false)
    const [followers,setFollowers] = useState()
    const [following, setFollowing] = useState()
    const [isLoading, setIsLoading] = useState(true)
    const [isBaseProfile, setIsBaseProfile] = useState(false)
    const pers = window.localStorage

    useEffect(()=>{
        pers.setItem('followers', followers)
        pers.setItem('following', following)
    },[followers, following])
    useEffect (() =>{
        console.log(props.username)
        
        if (props.username === undefined){
            baseProcedure()
        }
        else{
            notBaseProcedure()
        }
    },[])
    const notBaseProcedure = async()=>{
        console.log('what')
            pers.setItem('username',contextUsername)
            setIsBaseProfile(false)
            const folResponse = await fetch(`http://localhost:4000/api/following/${contextUsername}/${props.username}`,
            {
                method:"GET",
                headers:{"Content-Type":"application/json"}
            }).then((response)=>response.json())
            .then((json)=>detIsFollowing(json))
            setIsLoading(false)
            const response = await fetch(`http://localhost:4000/api/users/${props.username}`,
        {
            method:"GET",
            headers:{"Content-Type":"application/json"}
        }).then((response) => response.json())
        .then((json) =>updateData(json))
    }
    const baseProcedure = async()=>{
        console.log("base")
            setIsBaseProfile(true)
            const folData = await fetch(`http://localhost:4000/api/followingcount/${contextUsername}`,
            {method:"GET",
            headers:{"Content-Type":"application/json"}}).then((response)=>response.json()).then((json)=>setFollowingCount(json))
            const folData2 = await fetch(`http://localhost:4000/api/followercount/${contextUsername}`,
            {method:"GET",
            headers:{"Content-Type":"application/json"}}).then((response)=>response.json()).then((json)=>setFollowerCount(json))
            setIsLoading(false)
            pers.setItem('username',contextUsername)
            pers.setItem('firstname', contextFirstname)
            pers.setItem('lastname',contextLastname)
    }
    const setFollowerCount = (data) =>{
        let convertedData = separateObject(JSON.parse(JSON.stringify(data)))
        console.log(convertedData[0].key.count)
        setFollowers(convertedData[0].key.count)
    }
    const setFollowingCount = (data) =>{
        let convertedData = separateObject(JSON.parse(JSON.stringify(data)))
        setFollowing(convertedData[0].key.count)
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

    const handleFollow = (updateFollow) =>{
        setIsFollowing(updateFollow)
        if (updateFollow){
            
        }
    }
    const handleClose = () =>{
        setOpen(!open)
    }
        return (
                <div className='body'>
                <Sidebar className="sidebar"/>
                <div className="social-body">
                <div className="profile-header">
                    <div className='pfp-username-div'>
                        <img className="pfpimg-social"></img>
                        <h1 className="username-social">{pers.getItem('username')}</h1>
                    </div>
                    <div className="fol-div">
                        <h1 className="followers" onClick={()=>openPopup(true)}>{pers.getItem('followers')}<br></br>Followers</h1>
                        <h1 className="following" onClick={()=>openPopup(false)}>{pers.getItem('following')}<br></br>Following</h1>
                        {!isBaseProfile&&
                        <div className="follow-icon-div">
                            <FontAwesomeIcon className="follow-button-selected"icon={faUserPlus} onClick={()=>handleFollow(false)}/>
                        </div>
                        }
                    </div>
                </div>
                {open && 
                <FolPopup className="fol-popup-social" trigger={true} folswitch={followerSwitch} handleClose={handleClose}>
                </FolPopup>
                }
                </div>
                </div>
        );
    } 
export default Social;