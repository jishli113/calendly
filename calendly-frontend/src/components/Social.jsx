
import '../css/social.css'
import Sidebar from './Sidebar';
import FolPopup from './FolPopup.jsx'
import { useState,useContext,useEffect } from 'react';
import { UserContext } from './UserContext';
import { faUserPlus, faUserCheck, faHandshake, faCircleExclamation, faCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Button, Card, Image } from 'react-bootstrap';
import useAPICallBody from '../hooks/useAPICallBody';
import {Container, Row, Col} from 'react-bootstrap'
import useAlterEvents from '../hooks/useAlterEvents';
import { Temporal } from "@js-temporal/polyfill";
import DailyViewCard from './DailyViewCard';
import CommentView from './CommentView';
import NotificationsSideBar from './NotificationsSideBar.jsx';

const Social =() => {
    const [open, setOpen] = useState(false)
    const [followerSwitch, setFollowerSwitch] = useState(true)
    const [isFollowing, setIsFollowing] = useState(false)
    const [followers,setFollowers] = useState()
    const [following, setFollowing] = useState()
    const [isLoading, setIsLoading] = useState(true)
    const [isLoadingEvents, setIsLoadingEvents] = useState(true)
    const [isFollowingLoading, setIsFollowingLoading] = useState(true)
    const {username} = useParams()
    const {callAPI:getNonBaseFollowingRequest} = useAPICallBody()
    const {callAPI:getNonBaseUserData} = useAPICallBody()
    const {callAPI:getBaseUserData} = useAPICallBody()
    const {callAPI:getFollowerCount} = useAPICallBody()
    const {callAPI:getFollowingCount} = useAPICallBody()
    const {callAPI:followRequest} = useAPICallBody()
    const {callAPI:unfollowRequest} = useAPICallBody()
    const {callAPI:getIsPrivate} = useAPICallBody()
    const {getCurrentEvents:alter} = useAlterEvents()
    const {callAPI:getFollowRequests} = useAPICallBody()
    const {callAPI:getLikeNotifications} = useAPICallBody()
    const {callAPI:getCommentNotifications} = useAPICallBody()
    const [displayInfo, setDisplayInfo] = useState()
    const [displayedEvents, setDisplayedEvents] = useState()
    const [commentsOpen, setCommentsOpen] = useState(false)
    const [isPrivate, setIsPrivate] = useState(false)
    const [selectedCommentsEventname, setSelectedCommentsEventname] = useState()
    const [selectedCommentsUsername ,setSelectedCommentsUsername] = useState()
    const[currentDate, setCurrentDate] = useState(Temporal.Now.plainDateISO())
    const [followRequests, setFollowRequests] = useState()
    const [notisCount, setNotisCount] = useState(0);
    const [notis, setNotis] = useState();
    const [followReqNotis, setFollowReqNotis] = useState();
    const [notificationType, setNotificationType] = useState()
    const [notificationsOpen, setNotificationsOpen] = useState(false)

    
    const pers = window.localStorage

    useEffect (() =>{
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
        getCurrentEvents()
        console.log(isPrivate)
    },[])
    async function getCurrentEvents() {
        let temp = await alter(pers.getItem("username"), currentDate)
        console.log(temp, pers.getItem("username"))
        setIsLoadingEvents(false);
        setDisplayedEvents(temp);
        }

    useEffect(()=>{
        setOpen(false)
        if(pers.getItem("username")!==username){
            pers.setItem("username",username)
        }
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
        getCurrentEvents()
    },[username])
    const notBaseProcedure =async()=>{
            let nbFollowing = await getNonBaseFollowingRequest(`http://localhost:4000/api/users/isfollowing`, "POST", {forusername:username, followingusername:pers.getItem("contextUsername")})
            detIsFollowing(nbFollowing)
            let userInfo = await getNonBaseUserData(`http://localhost:4000/api/users/info`, "POST", {username})
            let isPrivate = await getIsPrivate(`http://localhost:4000/api/users/isprivate`, "POST", {username})
            setDisplayInfo(userInfo[0])
            setIsPrivate(isPrivate)
            setIsLoading(false)
    }
    const baseProcedure = async()=>{
        let userInfo = await getBaseUserData(`http://localhost:4000/api/users/info`,"POST", {username})
        let fr = await getFollowRequests(`http://localhost:4000/api/users/followrequests`, "POST", {username})
        setFollowReqNotis(fr)
        console.log(fr, "ASGAS")
        let frcount = fr.length
        let f = await getFollowRequests(`http://localhost:4000/api/users/notifications`, "POST", {username})
        let fcount = 0;
        f.map((follow)=>{
            if (follow.seen){
                fcount = fcount + 1
            }
        })
        setNotis(f);
        console.log(fcount + frcount)
        setNotisCount(fcount + frcount)
        console.log(fcount + frcount)
        setDisplayInfo(userInfo[0])
        setIsLoading(false)
    }
    const detIsFollowing = (data) =>{
        if (Object.keys(data).length == 0){
            setIsFollowing(false)
        }
        else{
            setIsFollowing(true)
        }
        setIsFollowingLoading(false)
    }

    function handleCommentOpen(eventname, username){
        setCommentsOpen(true)
        setSelectedCommentsEventname(eventname)
        setSelectedCommentsUsername(username)
      }
      function handleCommentClose(){
        setCommentsOpen(false)
      }
    const openPopup = (fol) => {
        setOpen(!open)
        setFollowerSwitch(fol)
    }

    const handleFollow = async(updateFollow) =>{
        if (updateFollow){
            if (isPrivate){
                let body = {requester:pers.getItem("contextUsername"), requested:pers.getItem("username")}
                followRequest(`http://localhost:4000/api/users/followrequest`, "POST", body)

            }
            else{
                let body = {follower:pers.getItem("contextUsername"), followed:pers.getItem("username")}
                followRequest(`http://localhost:4000/api/users/follow/`, "POST", body)
                setFollowers(followers + 1)
            }
        }
        else
        {
            let body = {unfollower:pers.getItem("contextUsername"), beingunfollowed:pers.getItem("username")}
            unfollowRequest(`http://localhost:4000/api/users/unfollow/`,"POST", body)
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
        let followers = await getFollowerCount(`http://localhost:4000/api/users/followercount`,"POST", body)
        let following = await getFollowingCount(`http://localhost:4000/api/users/followingcount`,"POST", body)
        setFollowers(parseInt((followers[0])["count"]))
        setFollowing(parseInt((following[0])["count"]))
        setIsFollowingLoading(false)
    }
    function handleNotificationOpen(type){
        setNotificationType(type)
        setNotificationsOpen(true)
    }
    function closeNotificationTab(){
        setNotificationsOpen(false)
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
                    {pers.getItem("contextUsername") == pers.getItem("username") ? <>
                        <Row className='my-5'>
                            <div style={{padding:"8px", position:"relative"}}>
                            {!isLoading && notisCount > 0 ?
                                <><FontAwesomeIcon icon={faCircle} color='red' className='notification-badge'></FontAwesomeIcon>
                                <Card.Text className='notifications-number-text'>{notisCount}</Card.Text></>:<></>
                                
                            }
                            <Card className="noti-card border-dark" onClick={()=>handleNotificationOpen("follow")}>
                                <div style={{display:'inline-flex'}}>
                                <Col lg={{span:4, offset:3}}><Card.Title style={{marginTop:'auto', marginBottom:'auto'}}>Follow Notifications</Card.Title></Col>
                                    <Col lg={{span:2, offset:1}}>
                                        <FontAwesomeIcon icon={faHandshake} className='follow-request-icon'></FontAwesomeIcon>
                                    </Col>
                                    <Col lg={{span:2}}>
                                    </Col>
                                </div>
                            </Card>
                            </div>
                        </Row>
                        </>
                        :<></>}
                            </>
                    }               

                    </Col>
                    {(!isLoading && ((pers.getItem("contextUsername") == username) || !isPrivate ))?
                        <Col lg={{span:8}}>
                        <div className="dailyview-events">
                            {!isLoadingEvents &&
                            displayedEvents.map((event) => (
                                <DailyViewCard props={event} handleComment = {handleCommentOpen}></DailyViewCard>
                            ))}
                        </div>
                        </Col>:<></>
                    }
                </Row>
                </Container>
                {open && <FolPopup className="fol-popup-social" trigger={true} folswitch={followerSwitch} handleClose={handleClose} username={username}>
                // </FolPopup>}
                {commentsOpen ? <CommentView handleClose ={handleCommentClose} username={selectedCommentsUsername} eventname={selectedCommentsEventname}></CommentView> : ""}
                {notificationsOpen && !isLoading ? <NotificationsSideBar type={notificationType} data={notis} followRequests={followReqNotis} close={closeNotificationTab}></NotificationsSideBar>:<></>}
                </>
                

        )
    } 
export default Social;