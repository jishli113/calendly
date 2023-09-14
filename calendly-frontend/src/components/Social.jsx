
import '../css/social.css'
import Sidebar from './Sidebar';
import FolPopup from './FolPopup.jsx'
import { useState,useContext,useEffect } from 'react';
import { UserContext } from './UserContext';
import { faUserPlus, faUserCheck } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate, useParams, Link } from 'react-router-dom';
import useAPICall from '../hooks/useAPICall';
import { Button, Image } from 'react-bootstrap';
import useAPICallBody from '../hooks/useAPICallBody';
import {Container, Row, Col} from 'react-bootstrap'

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
    const {callAPI:getNonBaseFollowingRequest} = useAPICallBody()
    const {callAPI:getNonBaseUserData} = useAPICallBody()
    const {callAPI:getBaseUserData} = useAPICallBody()
    const {callAPI:getFollowerCount} = useAPICallBody()
    const {callAPI:getFollowingCount} = useAPICallBody()
    const {callAPI:followRequest} = useAPICallBody()
    const {callAPI:unfollowRequest} = useAPICallBody()
    const [displayInfo, setDisplayInfo] = useState()

    
    const pers = window.localStorage

    useEffect (() =>{
        ("changed")
        (isFollowing)
        if(pers.getItem("username")!==username){
            pers.setItem("username",username)
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
        ("username changed", username)
    },[username])
    useEffect(()=>{
        (isLoading, isFollowingLoading)
        ("adfasd")
        setOpen(false)
        if(pers.getItem("username")!==username){
            pers.setItem("username",username)
        }
        (pers.getItem("username"), pers.getItem("contextUsername"))
        setIsLoading(true)
        setIsFollowingLoading(true)
            if(pers.getItem("username") === pers.getItem("contextUsername")){
                pers.setItem("base", true)
                baseProcedure()
            }
            else{
                pers.setItem("base", false)
                notBaseProcedure()
            }
        refreshCount()

    },[username])
    useEffect(()=>{
        (displayInfo, "display")
    },[displayInfo])
    const notBaseProcedure =async()=>{
            let nbFollowing = await getNonBaseFollowingRequest(`http://localhost:4000/api/isfollowing`, "POST", {forusername:username, followingusername:pers.getItem("contextUsername")})
            detIsFollowing(nbFollowing)
            ("adfsdaSDGA", nbFollowing)
            let userInfo = await getNonBaseUserData(`http://localhost:4000/api/userinfo`, "POST", {username})
            (userInfo, "adsfadsga")
            setDisplayInfo(userInfo[0])
            setIsLoading(false)
    }
    const baseProcedure = async()=>{
        let userInfo = await getBaseUserData(`http://localhost:4000/api/userinfo`,"POST", {username})
        setDisplayInfo(userInfo[0])
        setIsLoading(false)
    }
    const detIsFollowing = (data) =>{
        (data, "detis")
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
    useEffect(()=>{
        (displayInfo, "ASDFASF")
    },[displayInfo])

    const handleFollow = async(updateFollow) =>{
        ("calleddf")
        if (updateFollow){
            let body = {follower:pers.getItem("contextUsername"), followed:pers.getItem("username")}
            followRequest(`http://localhost:4000/api/follow/`, "POST", body)
            setFollowers(followers + 1)
        }
        else
        {
            let body = {unfollower:pers.getItem("contextUsername"), beingunfollowed:pers.getItem("username")}
            unfollowRequest(`http://localhost:4000/api/unfollow/`,"POST", body)
            setFollowers(followers - 1)
        }
        setIsFollowing(updateFollow)
    }
    const handleClose = () =>{
        setOpen(!open)
        refreshCount()
    }
    async function refreshCount(){
        (pers.getItem("base"))
        setIsFollowingLoading(true)
        const user = pers.getItem("username")
        const body = {username:user}
        let followers = await getFollowerCount(`http://localhost:4000/api/followercount`,"POST", body)
        let following = await getFollowingCount(`http://localhost:4000/api/followingcount`,"POST", body)
        setFollowers(parseInt((followers[0])["count"]))
        setFollowing(parseInt((following[0])["count"]))
        setIsFollowingLoading(false)
    }
        return (
                <>
                <Sidebar/>
                <Container fluid className='social-container'>
                <Row>
                    <Col lg={4}>
                        {!isLoading && 
                            <>
                            <Row>
                        <Col lg={{span:8, offset:2}} className='my-4'>
                            <Image roundedCircle src={displayInfo.pfpimg} className='social-pfp-image'></Image>
                        </Col>
                    </Row>
                    <Row className='my-4'>
                        <h1 style={{textAlign:"center"}}>
                        {displayInfo.username}
                        </h1>

                    </Row>
                    <Row>
                        <Col lg={{span:2, offset:2}}>
                                <span className="social-fol-info" onClick={()=>openPopup(true)}> {`${followers}\n Followers`} </span>
                            </Col>
                            <Col lg={{span:2, offset:1}}>
                                <span className='social-fol-info' onClick={()=>openPopup(false)}>{`${following}\n Following`}</span>
                            </Col>
                            <Col>
                            {pers.getItem("contextUsername") != pers.getItem("username") && !isFollowingLoading ? (!isFollowing ? 
                                           <Button> Follow  <FontAwesomeIcon className="follow-button"icon={faUserPlus} onClick={()=>handleFollow(true)}/></Button>
                                           :<Button> Following  <FontAwesomeIcon className="follow-button"icon={faUserCheck} onClick={()=>handleFollow(false)}/></Button>):<></>}
                            </Col>
                    </Row>
                            </>
                        }

                    </Col>

                </Row>
                </Container>
                {open && <FolPopup className="fol-popup-social" trigger={true} folswitch={followerSwitch} handleClose={handleClose} username={username}>
                // </FolPopup>}
                </>

        )
    } 
export default Social;