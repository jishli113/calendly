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

const NewEventPopup=(props)=>{
    const pers = window.localStorage
    const [eventName, setEventName] = useState("")
    const [startDate, setStartDate] = useState()
    const [startTime, setStartTime] = useState()
    const [endDate, setEndDate] = useState()
    const [endTime, setEndTime] = useState()
    const [tagPopup, setTagPopUp] = useState(false)
    const [repeats, setRepeats] = useState("Today Only")
    const {res:createEventRes, callAPI: createEventCall} = useAPICallBody()
    const {res:eventNames, callAPI: getEvents} = useAPICall()
    const {res:tags, callAPI:getTags} = useAPICall()
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
        if(tags !== undefined){
            setTagList(tags)
        }
    },[tags])
    useEffect(()=>{
        console.log(startDate)
    },[startDate])
    useEffect(()=>{
            console.log(eventNames, "event")
    },[eventNames])
    async function getExistingEvents(){
        await getEvents(`http://localhost:4000/api/geteventnames/${username}`)
    }
    async function checkNext(){
        for (let i = 0; i < eventNames.length; i++){
            if (eventNames[i].eventname == eventName){
                setRecurringEventName(false)
                break
            }
        }
        setRecurringEventName(true)
        if (eventName === "" || startDate === undefined || endDate === undefined || startTime === undefined || endTime === undefined){
            setRequiredFields(true)
            setNextPage(false)
        }
        else{
            setRequiredFields(false)
            setNextPage(true)
        }
}
    async function checkCreateEvent(){
            const s = Temporal.PlainDate.from(startDate)
            const e = Temporal.PlainDate.from(endDate)
            if (Temporal.PlainDate.compare(s, e) == 1){
                setInvalidDate(true)
            }
            else{
                createEvents(s, e)
                
            }

        }
    async function refreshTags(){
        await getTags(`http://localhost:4000/api/getalltags/${username}`)
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
        console.log(data)
        let temp = selectedTags
        for(let i = 0; i < selectedTags.length; i ++){
            console.log(selectedTags[i])
            if (selectedTags[i].tag === data.tag){
                temp.splice(i, 1)
                setSelectedTags(temp)
            }
        }
    }
    async function createEvents(sd, ed){
        const sh = parseInt(startTime.substring(0,2))
        const sm = parseInt(startTime.substring(3,5))
        const eh = parseInt(endTime.substring(0,2))
        const em = parseInt(endTime.substring(3,5))
        console.log(sh, " sh")
        console.log(eh, "eh")
        const dates = []
        if (repeats === "Today Only"){
            dates.push(sd.toString())
        }
        else if (repeats === "Daily"){
            let s = sd
            while (Temporal.PlainDate.compare(s,ed) == -1){
                dates.push(s.toString())
                s = s.add({days:1})
            }
        }
        else if (repeats === "Weekly"){
            let s = sd 
            while(Temporal.PlainDate.compare(s,ed) == -1){
                console.log(s.toString())
                dates.push(s.toString())
                s = s.add({days:7})
            }
        }
        else if (repeats === "Weekdays"){
            let s = sd
            while(Temporal.PlainDate.compare(s,ed) == -1){
                if (s["dayOfWeek"] < 6){
                    dates.push(s.toString())
                }
                s = s.add({days:1})
            }
        }
        const body = {dates, sh, sm,eh, em, eventName, username, selectedTags}
        await createEventCall(`http://localhost:4000/api/createevent`, "POST", body)
        if(!recurringEventName){
            props.handleClose()
        }
    }
    const handleInputClick = ()=>{
        console.log(imageInputRef, "img")
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
                            <Form.Label>Time</Form.Label>
                            <Form.Control type="time" onChange={(e)=>{console.log(e.target.value)}}></Form.Control>
                        </Col>
                        <Col>
                            <Form.Label>Time</Form.Label>
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
                            <Button className="create-event-button" onClick={checkNext}>Next</Button>
                        </Col>
                    </Row>
                </Container>
                </Form>
                {tagPopup && <NewTagPopup handleClose={handleTagPopUp}>
                    </NewTagPopup>}
                </div>:  
                <div>
                    <Button className="add-image-button" onClick={handleInputClick}>
                                    Upload an Image    
                                    <FontAwesomeIcon icon={faCloudArrowUp}></FontAwesomeIcon>
                    <input type="file" ref = {imageInputRef} onChange={(e)=>handleImageInputChange(e)}></input>
                    </Button>
                    {selectedImage && <Image src = " " roundedCircle ></Image>}
                </div>}
            </div>
        </div>
    )
}

export default NewEventPopup