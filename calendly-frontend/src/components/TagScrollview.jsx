import React, { useContext, useEffect } from 'react';
import { UserContext } from './UserContext';
import Tag from './Tag'
import "../css/tagscrollview.css"
const TagScrollView =(props)=>{
    return(
        <span className="tagscroll-div">
            {(props !== undefined) && props.taglist.map(tag=>{
                return <Tag tag={tag} selectTag={props.selectTag} deselectTag={props.deselectTag}></Tag>
            })}
        </span>
    )
}
export default TagScrollView