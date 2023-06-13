import React from "react";
import { CustomPicker } from "react-color";
import { GithubPicker } from 'react-color';
import "../css/TagColorPicker.css"

const TagColorPicker=(props)=>{
    return(
           <GithubPicker onChangeComplete={props.handleSelectColor}></GithubPicker>
    )
}
export default TagColorPicker