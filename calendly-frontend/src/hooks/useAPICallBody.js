import {useState,useEffect} from 'react'
const useAPICallBody=()=>{
    const [res, setRes] = useState()
    async function callAPI(url, method, body){
        await fetch(url,
            {method:method,
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(body)
    }).then((response)=>response.json()).then((json)=>setRes(json))
        
            }
    return {res, callAPI}
}
export default useAPICallBody;