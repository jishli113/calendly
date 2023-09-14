import React, { useEffect,useMemo } from 'react';
import '../css/FolPopup.css'
import { faXmark} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import FriendTab from './friendtab.jsx'
import {useState, useContext} from 'react'
import { UserContext } from './UserContext';
import useAPICall from '../hooks/useAPICall';
import useAPICallBody from '../hooks/useAPICallBody';
function FolPopup(props){
    const [ppllist, setPplList] = useState()
    const [isLoading, setIsLoading] = useState(true)
    const {callAPI:getUserFolData} = useAPICallBody()
    useEffect(()=>{
        setIsLoading(true)
        getFolData(props.folswitch)
        (props.folswitch, "folsw")
    },[])
    const setFolPPlList = (data) =>{
        let pplListConvertedData =  separateObject(JSON.parse(JSON.stringify(data)))
        setPplList(pplListConvertedData)
        setIsLoading(false)
    }
    const getFolData = async(fol) =>{
        const tag = fol ? "followers" : "following"
        (props.username, "????")
        let folData = await getUserFolData(`http://localhost:4000/api/${tag}`, "POST", {username:props.username})
        (folData, "adgads")
        setFolPPlList(folData)
        setIsLoading(false)
    }
    const separateObject = data => { 
        const res = [];
        const keys = Object.keys(data);
        keys.forEach(key => {
           res.push({
              key: data[key]
           });
        });
        return res;
     };

    useEffect(()=>{
        (ppllist, "changed")
    },[ppllist])

    return(props.trigger) ? (
            <div className="fol-popup">
                <div className="fol-popup-inner">
                    <FontAwesomeIcon icon={faXmark} className="fol-popup-close" onClick={props.handleClose}></FontAwesomeIcon>
                    {props.folswitch ? <h1 className="follower-or-following" key="Followers">Followers</h1> : <h1 className="follower-or-following" key="Following">Following</h1>}
                    {(!isLoading) && 
                    <ul className="fol-ppl-list">
                    {ppllist.map(people =>
                        (props.folswitch ? <li className="friendtab-popup">
                        <FriendTab username={people.key.followingusername} pfpimg={people.key.pfpimg}/>
                 </li>:
                 <li className="friendtab-popup">
                 <FriendTab username={people.key.forusername} pfpimg={people.key.pfpimg}/>
          </li>)
                    )}
                </ul>}
                </div>
            </div>
        ):"";
    
}
export default FolPopup