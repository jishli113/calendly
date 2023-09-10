import React, { Component, useState, useEffect, useContext, useRef} from 'react';
import '../css/neweventpopup.css'
import Form from 'react-bootstrap/Form'
import Select from 'react-dropdown-select';
import Button from 'react-bootstrap/Button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faXmark, faPlusCircle, faPlus } from '@fortawesome/free-solid-svg-icons';
import DatePicker from 'react-date-picker';
import { Row, Col, Container, Image } from 'react-bootstrap';
import useAPICallBody from '../hooks/useAPICallBody';
import useAPICall from '../hooks/useAPICall';
import { UserContext } from './UserContext';
import NewTagPopup from './NewTagPopup';
import TagScrollView from './TagScrollview';
import { Dropdown } from 'react-bootstrap';
import { Temporal } from '@js-temporal/polyfill';
import { faCloudArrowUp } from '@fortawesome/free-solid-svg-icons';
import useAPIMultiPart from '../hooks/useAPIMultiPart.js';
import moment from 'moment-timezone';
import useTimeConversion from '../hooks/useTimeConversion';
const NewEventPopup=(props)=>{
    const pers = window.localStorage
    const [eventName, setEventName] = useState("")
    const [startDate, setStartDate] = useState()
    const [startTime, setStartTime] = useState()
    const [endDate, setEndDate] = useState()
    const [endTime, setEndTime] = useState()
    const [tagPopup, setTagPopUp] = useState(false)
    const [repeats, setRepeats] = useState("Today Only")
    const {callAPI: createEventCall} = useAPIMultiPart()
    const {callAPI: getEvents} = useAPICall()
    const [eventNames, setEventNames] = useState()
    const {callAPI:getTags} = useAPICall()
    const {contextUsername} = useContext(UserContext)
    const [username, setUsername] = useState((pers.getItem("contextUsername") === "undefined") ? contextUsername : pers.getItem("contextUsername"))
    const [tagList, setTagList] = useState([])
    const [requiredFields, setRequiredFields] = useState(false)
    const [invalidDate, setInvalidDate] = useState(false)
    const [selectedTags, setSelectedTags] = useState([])
    const [recurringEventName, setRecurringEventName] = useState(false)
    const [nextPage, setNextPage] = useState(false)
    const [selectedImage, setSelectedImage] = useState(false)
    const imageInputRef = useRef(null)
    const [image, setImage] = useState()
    const {convertToUTC} = useTimeConversion()
    let utcTz = Temporal.TimeZone.from("UTC")

    useEffect(()=>{
        utcTz = Temporal.TimeZone.from("UTC")
    })
    
    useEffect(()=>{
        if (contextUsername !== null){
            pers.setItem("contextUsername", contextUsername)
        }
        refreshTags()
        getExistingEvents()
    },[])
    useEffect(()=>{
        handlePers(username, setUsername, "contextUsername")
    },[username])
    useEffect(()=>{
        handlePers(eventName, setEventName, "eventName")
    },[eventName])
    useEffect(()=>{
        handlePers(startDate, setStartDate, "startDate")
    },[startDate])

 
    useEffect(()=>{
        handlePers(endDate, setEndDate, "endDate")
    },[endDate])
    useEffect(()=>{
        handlePers(startTime, setStartTime, "startTime")
    },[startTime])
    useEffect(()=>{
        handlePers(endTime, setEndDate, "endTime")
        
    },[endTime])
    useEffect(()=>{
        
    },[startDate])
    useEffect(()=>{
            
    },[eventNames])
    useEffect(()=>{

    },[selectedImage])
    async function getExistingEvents(){
        let events = await getEvents(`http://localhost:4000/api/geteventnames/${username}`)
        setEventNames(events)
    }
    async function checkNext(){
        
        setRecurringEventName(true)
        for (let i = 0; i < eventNames.length; i++){
            if (eventNames[i].eventname == eventName){
                setRecurringEventName(false)
                break
            }
        }
        
        if (eventName === "" || startDate === undefined || endDate === undefined || startTime === undefined || endTime === undefined){
            setRequiredFields(true)
            setNextPage(false)
        }
        else{
            const s = Temporal.PlainDate.from(startDate)
            const e = Temporal.PlainDate.from(endDate)
            
            if (Temporal.PlainDate.compare(s, e) == 1 || ((startTime.substring(0,2) > endTime.substring(0,2)) || ((startTime.substring(0,2) == endTime.substring(0,2)) && startTime.substring(3,5) > endTime.substring(3,5)))){
                setInvalidDate(true)
                setNextPage(false)
            }
            else{
                setRequiredFields(false)
                setNextPage(true)
            }
        }
}
    async function refreshTags(){
        let tags = await getTags(`http://localhost:4000/api/getalltags/${username}`)
        setTagList(tags)
    }
    function handlePers(variable, setVar, key){
         if (variable === undefined){
            setVar(pers.getItem(key))
        }
        else{
            pers.setItem(key, variable)
        }
    }
    function handleTagPopUp(){
        setTagPopUp(!tagPopup)
        if (!tagPopup){
            refreshTags()
        }

    }
    function handleSelectedTag(data){
        let temp = selectedTags
        temp.push(data)
        setSelectedTags(temp)
    }
    function handleDeselectTag(data){
        
        let temp = selectedTags
        for(let i = 0; i < selectedTags.length; i ++){
            
            if (selectedTags[i].tag === data.tag){
                temp.splice(i, 1)
                setSelectedTags(temp)
            }
        }
    }
    function removePers(key){
        pers.removeItem(key)
    }

    async function createEvents(sd, ed){
        
        const startHour = parseInt(startTime.substring(0,2))
        const startMinute = parseInt(startTime.substring(3,5))
        const endHour = parseInt(endTime.substring(0,2))
        const endMinute = parseInt(endTime.substring(3,5))
        let start = convertToUTC(Temporal.Now.timeZone(), sd.year, sd.month, sd.day, startHour, startMinute)
        let end = convertToUTC(Temporal.Now.timeZone(), ed.year, ed.month, ed.day, endHour, endMinute)
        const sh = start.toString().substring(11,13)
        const sm = start.toString().substring(14,16)
        const eh = end.toString().substring(11,13)
        const em = end.toString().substring(14,16)
        
        
        const dates = []
        if (repeats === "Today Only"){
            dates.push(start.toString().substring(0,10))
        }
        else if (repeats === "Daily"){
            let s = start
            while (Temporal.PlainDate.compare(s,end) == -1){
                
                dates.push(s.toString().substring(0,10))
                s = s.add({days:1})
            }
        }
        else if (repeats === "Weekly"){
            let s = start 
            while(Temporal.PlainDate.compare(s,end) == -1){
                
                dates.push(s.toString().substring(0,10))
                s = s.add({days:7})
            }
        }
        else if (repeats === "Weekdays"){
            let s = start
            while(Temporal.PlainDate.compare(s,end) == -1){
                if (s["dayOfWeek"] < 6){
                    dates.push(s.toString().substring(0,10))
                }
                s = s.add({days:1})
            }
        }
        
        const formData = new FormData()
        
        formData.append("dates",JSON.stringify(dates))
        formData.append("sh", sh)
        formData.append("sm", sm)
        formData.append("eh", eh)
        formData.append("em", em)
        formData.append("eventName", eventName)
        formData.append("username", username)
        formData.append("selectedTags", JSON.stringify(selectedTags))
        formData.append("eventImage", selectedImage && image)
        formData.append("active", false)
        
        let result = await createEventCall(`http://localhost:4000/api/createevent`, "POST", formData)
        
        if(result.status === "success"){
            removePers("startTime")
            removePers("endTime")
            removePers("startDate")
            removePers("endDate")
            props.handleClose()
        }
        //ELSE: tell user that create event failed
    }
    const handleInputClick = ()=>{
        
        if (imageInputRef === undefined){
            return
        }
        imageInputRef.current.click()
    }
    const handleImageInputChange=(event)=>{
        setSelectedImage(true)
        const file = event.target.files[0]
        setImage(file)
    }
    return(
        <div className="new-event-popup">
            <div className="new-event-popup-inner">
            <FontAwesomeIcon icon={faXmark} className="fol-popup-close" onClick={props.handleClose}></FontAwesomeIcon>
                {!nextPage ? 
                <div>
                    <Form>
                    <Container fluid>
                    <Row>
                        <Form.Group>
                            <Form.Label>Event Name</Form.Label>
                            <Form.Control onChange={(e)=>setEventName(e.target.value)} className="event-name-form"type="text" placeholder="Your Event Name..." required></Form.Control>
                        </Form.Group>
                    </Row>
                    <Row className="my-3">
                        <Col>
                            <Form.Label>Start Time</Form.Label>
                            <Form.Control type="time" onChange={(e)=>{setStartTime(e.target.value)}}></Form.Control>
                        </Col>
                        <Col>
                            <Form.Label>End Time</Form.Label>
                            <Form.Control type="time" onChange={(e)=>{setEndTime(e.target.value)}}></Form.Control>
                        </Col>
                    </Row>
                    <Row className="my-3">
                        <Col>
                            <Form.Group>
                                <Form.Label>Starts</Form.Label>
                                <Form.Control type="date" onChange={(e)=>{setStartDate(e.target.value)}}></Form.Control>
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group>
                                <Form.Label>Ends</Form.Label>
                                <Form.Control type="date" onChange={(e)=>{setEndDate(e.target.value)}}></Form.Control>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        {invalidDate && <Form.Label style={{color:"red", textAlign:"center"}} >
                            Invalid Time Frame
                        </Form.Label>}
                        {recurringEventName && <Form.Label style={{color:"red", textAlign:"center"}}></Form.Label>}
                    </Row>
                    <Row className='align-items-end'>
                        <Col lg="11">
                            <TagScrollView taglist={tagList} selectTag = {handleSelectedTag} deselectTag = {handleDeselectTag}></TagScrollView>
                        </Col>
                        <Col lg="1">
                            <FontAwesomeIcon icon={faPlusCircle} className="create-tag-button" onClick={handleTagPopUp}></FontAwesomeIcon>
                        </Col>
                    </Row>
                    <Row className="my-5">
                        <Col>
                                <Dropdown className="repeats-dropdown" onChange={(e)=>setRepeats(e.target.value)} defaultValue="This Event Repeats...">
                                    <Dropdown.Toggle>
                                        {repeats}
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Dropdown.Item onClick={()=>setRepeats("Today Only")}>
                                            Today Only
                                        </Dropdown.Item>
                                        <Dropdown.Item onClick={()=>setRepeats("Daily")}>
                                            Daily
                                        </Dropdown.Item>
                                        <Dropdown.Item onClick={()=>setRepeats("Weekly")}>
                                            Weekly
                                        </Dropdown.Item>
                                        <Dropdown.Item onClick={()=>setRepeats("Weekdays")}>
                                            Weekdays
                                        </Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                        </Col>
                        <Col>
                            <Button className="create-event-button" onClick={()=>checkNext()}>Next</Button>
                        </Col>
                    </Row>
                </Container>
                </Form>
                {tagPopup && <NewTagPopup handleClose={handleTagPopUp}>
                    </NewTagPopup>}
                </div>:  
                <Container className="upload-image-div">
                    <Row>
                        <Button className="add-image-button" onClick={handleInputClick}>
                                        Upload an Image    
                                        <FontAwesomeIcon icon={faCloudArrowUp}></FontAwesomeIcon>
                        <input type="file" ref = {imageInputRef} onChange={(e)=>handleImageInputChange(e)} accept="image/*" name="eventImage"></input>
                        </Button>
                        
                    </Row>
                    <Row className="my-5">
                        {selectedImage ? <Image src = {URL.createObjectURL(image)} className="uploaded-image"></Image>:<h1>No Selected Image</h1>}
                    </Row>
                    <Row className="my-5">
                        <Button onClick={()=>createEvents(Temporal.PlainDate.from(startDate), Temporal.PlainDate.from(endDate))} className="create-event-button">Create Event</Button>
                    </Row>
                </Container>}
            </div>
        </div>
    )
}

export default NewEventPopup