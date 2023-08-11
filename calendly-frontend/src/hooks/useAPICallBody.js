
const useAPICallBody=()=>{
    async function callAPI(url, method, body){
        console.log("api", body)
        let res = await fetch(url,
            {method:method,
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(body)
    }).then((response)=>response.json())
        console.log(res, "callPi")
        return res
    }
    return {callAPI}
}
export default useAPICallBody;