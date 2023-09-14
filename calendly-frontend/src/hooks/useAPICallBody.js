
const useAPICallBody=()=>{
    async function callAPI(url, method, body){
        (url, method, body)
        let res = await fetch(url,
            {method:method,
        headers:{"Content-Type":"application/json"},
        credentials:'include',
        body:JSON.stringify(body)
    }).then((response)=>response.json())
        return res
    }
    return {callAPI}
}
export default useAPICallBody;