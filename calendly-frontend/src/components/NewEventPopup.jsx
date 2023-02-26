import React, { Component, useState, useEffect} from 'react';
import '../css/neweventpopup.css'
import Form from 'react-bootstrap/Form'
import Dropdown from 'react-bootstrap/Dropdown'
import Button from 'react-bootstrap/Button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faXmark } from '@fortawesome/free-solid-svg-icons';
import DatePicker from 'react-datepicker';

const NewEventPopup=(props)=>{
    const [selectedDate, setSelectedDate] = useState(new Date())
    const monthConversion = {"Jan":"01", "Feb":"02"}
    useEffect(()=>{
        console.log(monthConversion)
    })
    return(
        <div className="new-event-popup">
            <div className="new-event-popup-inner">
            <FontAwesomeIcon icon={faXmark} className="fol-popup-close" onClick={props.handleClose}></FontAwesomeIcon>
                <Form>
                    <Form.Control className="event-name-form"type="text" placeholder="Your Event Name..." required></Form.Control>
                </Form>
                <Button className="new-event-select-date">{String(selectedDate).split(" ").slice(0,4).join(" ")+"  "}<FontAwesomeIcon icon={faCaretDown}></FontAwesomeIcon>

                </Button>
                {/* <DatePicker selected={selectedDate}></DatePicker> */}
                {/* <Dropdown>
                    <Dropdown.Menu>
                        <Dropdown.Item>
                            Single-Day
                        </Dropdown.Item>
                        <Dropdown.Item></Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown> */}
            </div>
        </div>
    )
}
export default NewEventPopup