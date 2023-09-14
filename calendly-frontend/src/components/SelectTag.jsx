import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle, faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { Form } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import '../css/tag.css'
const SelectTag=(props)=>{
    const [selected, setSelected] = useState(false)
    const {tag, tagcolor} = props.tag
    useEffect(()=>{
        if(selected){
            props.selectTag({tag, tagcolor})
        }
        else{
            props.deselectTag({tag, tagcolor})
        }
    },[selected])
    return(
        <span className="tag-container" style={{color:tagcolor, height:100}} onClick={()=>setSelected(!selected)}>
            <FontAwesomeIcon icon={(selected) ? faCircleXmark : faCircle} style={{color:tagcolor, margin:1}}></FontAwesomeIcon>
            <Form.Text style={{width:40, color:"black"}}>{tag}</Form.Text>
        </span>
    )
}
export default SelectTag
