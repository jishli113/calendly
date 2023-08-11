import React, { useContext, useEffect } from 'react';
import { UserContext } from './UserContext';
import "../css/tagscrollview.css"
import SelectTag from './SelectTag';
const TagScrollView =(props)=>{
    return(
        <span className="tagscroll-div">
            {(props !== undefined) && props.taglist.map(tag=>{
                return <SelectTag tag={tag} selectTag={props.selectTag} deselectTag={props.deselectTag}></SelectTag>
            })}
        </span>
    )
}
export default TagScrollView