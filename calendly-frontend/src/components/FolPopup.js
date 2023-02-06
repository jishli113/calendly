import React, { useEffect,useMemo } from 'react';
import '../FolPopup.css'
import { faXmark} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import FriendTab from './friendtab.jsx'
import {useState, useContext} from 'react'
import { UserContext } from './UserContext';

function FolPopup(props){
    const {contextUsername,UCsetUsername, contextFirstname, UCsetFirstname, contextLastname, UCsetLastname, UCsetLoggedin, contextFollowers, contextFollowing, UCsetFollowers, UCsetFollowing} = useContext(UserContext)
    const [ppllist, setPplList] = useState()
    const [isLoading, setIsLoading] = useState(true)


    useEffect(()=>{
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
    
        const getFolData = async(fol) =>{
            console.log("foldata")
            const tag = fol ? "followers" : "following"
            const response = await fetch(`http://localhost:4000/api/${tag}/${contextUsername}`,{
                method:"GET",
                headers:{"Content-Type":"application/json"}
            }).then((response)=>response.json())
            .then((json)=> setFolPPlList(json))
        }
    
        const setFolPPlList = (data) =>{
            console.log("setfol")
            let pplListConvertedData =  separateObject(JSON.parse(JSON.stringify(data)))
            pplListConvertedData.map(people=>{
                console.log(people.key)
            })
            setPplList(pplListConvertedData)
            setIsLoading(false)
        }
        console.log("effect")
        console.log(isLoading)
        getFolData(props.folswitch)
    },[])

    return(props.trigger) ? (
            <div className="fol-popup">
                <div className="fol-popup-inner">
                    <FontAwesomeIcon icon={faXmark} className="fol-popup-close" onClick={props.handleClose}></FontAwesomeIcon>
                    {props.folswitch ? <h1 className="follower-or-following" key="Followers">Followers</h1> : <h1 className="follower-or-following" key="Following">Following</h1>}
                    {(!isLoading && ppllist) && 
                    <ul className="fol-ppl-list">
                    {ppllist.map(people =>
                        (props.folswitch ? <li className="friendtab-popup">
                        <FriendTab username={people.key.followerusername} pfpimg={people.key.pfpimg}/>
                 </li>:
                 <li className="friendtab-popup">
                 <FriendTab username={people.key.followingusername} pfpimg={people.key.pfpimg}/>
          </li>)
                    )}
                </ul>}
                </div>
            </div>
        ):"";
    
}
export default FolPopup