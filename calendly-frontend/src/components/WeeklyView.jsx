import React, { Component, useEffect, useState, useContext } from 'react';
import { UserContext } from './UserContext';
import '../css/weeklyview.css'
const WeeklyView =(props)=>{
    const pers = window.localStorage
    const weekDates = []
    const [startDay, setStartDay] = useState()
    const {contextUsername} = useContext(UserContext)
    useEffect(()=>{
        if(contextUsername !== null){
            pers.setItem("contextUsername", contextUsername)
        }
        setStartDay(new Date(pers.getItem("selectedDay")))
        weekCount(new Date(pers.getItem("selectedDay")))
    },[])
    const weekCount = async(date) =>{
        console.log(String(date))
        for (let i = 0; i < 7; i++){
            let temp = new Date(String(date))
            temp.setDate(temp.getDate() + i)
            console.log(String(temp).split(" ",4).slice(1,4).join(" "))
            await fetch(`http://localhost:4000/api/event/${pers.getItem("contextUsername")}/${String(temp).split(" ",4).slice(1,4).join(" ")}`,
            {method:"GET",
            headers:{"Content-Type":"application/json"}})
            .then((response)=>response.json()).then((json)=>handleQuery(separateObject(json)))
            weekDates.push(temp.getDate())
        }
        console.log(weekDates)
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
    const handleQuery = (data)=>{
        console.log(data)
    }
    return(
        <div>

        </div>
    )
}
export default WeeklyView