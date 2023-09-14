import React, { useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle, faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { Form } from 'react-bootstrap';

const Tag=(props)=>{
    useEffect(()=>{
        (props, "?????")
    },[])
    return(
        <span className="tag-container" style={{color:props.tag.tagcolor, height:100}}>
            <FontAwesomeIcon icon={faCircle} style={{color:props.tag.tagcolor, margin:1}}></FontAwesomeIcon>
            <Form.Text style={{width:40, color:"black"}}>{props.tag.tag}</Form.Text>
        </span>
    )
}
export default Tag