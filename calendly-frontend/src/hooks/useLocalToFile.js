const useLocalToFile=()=>{
    function srcToFile(src, fileName, mimeType){
        return (fetch(src)
            .then(function(res){return res.arrayBuffer();})
            .then(function(buf){return new File([buf], fileName, {type:mimeType});})
        );
    }
    return {srcToFile}
}
export default useLocalToFile