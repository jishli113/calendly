import {useState,useEffect} from 'react'
const useAPIMultiPart=()=>{
    const [res, setRes] = useState()
    async function callAPI(url, method, formdata){
        console.log()
        await fetch(url,
            {method:method,
        headers:{},
        body:formdata
    }).then((response)=>response.json()).then((json)=>setRes(json))
        
            }
    return {res, callAPI}
}
export default useAPIMultiPart;