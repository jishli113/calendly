
const useAPICall=()=>{
    async function callAPI(url, method){
            
            let res = await fetch(url,
            {method:method,
                credentials:'include',
                headers:{"Content-Type":"application/json"}}).then((response)=>response.json())
                return res
        }
    return {callAPI}
}
export default useAPICall;