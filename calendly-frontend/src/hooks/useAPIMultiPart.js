import {useState,useEffect} from 'react'
const useAPIMultiPart=()=>{
    async function callAPI(url, method, formdata){
        console.log(formdata)
        let response = await fetch(url,
            {method:method,
                credentials:'include',
        headers:{},
        body:formdata
    }).then((response)=>response.json())
    return response
        
            }
    return {callAPI}
}
export default useAPIMultiPart;