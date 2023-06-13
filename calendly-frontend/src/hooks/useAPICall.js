import {useState,useEffect} from 'react'
const useAPICall=()=>{
    const [res, setRes] = useState()
    async function callAPI(url, method){
        console.log(url, "called")
        await fetch(url,
            {method:method,
        headers:{"Content-Type":"application/json"}}).then((response)=>response.json()).then((json)=>setRes(json))
            }
    return {res, callAPI}
}
export default useAPICall;