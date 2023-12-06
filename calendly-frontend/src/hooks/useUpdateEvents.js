import useAPICall from "./useAPICall"
const useUpdateEvents=()=>{
    const {callAPI:updateEvents} = useAPICall()
    async function update(){
            await updateEvents("http://localhost:4000/api/events/updateevents", "POST")
    }
    return {update}
}
export default useUpdateEvents