import axios from "axios";
export const getJudge0LanguageId = (language) => {
    const languageMap = {
        "PYTHON": 71,
        "JAVA": 62,
        "JAVASCRIPT": 63
    };
    return languageMap[language.toUpperCase()];
};

const sleep  = (ms)=> new Promise((resolve)=> setTimeout(resolve , ms))

export const submitBatch = async (submissions) => {
    console.log("url-----",`${process.env.JUDGE0_API_URL}submissions/batch?base64_encoded=false`, {
        submissions
    })
    const {data} = await axios.post(`${process.env.JUDGE0_API_URL}submissions/batch?base64_encoded=false`, {
        submissions
    });
    console.log("Submission results:", data);
    return data; //[{token},{token},{token}];
}


export const pollBatchResults = async (tokens)=>{
while(true){
    const {data} = await axios.get(`${process.env.JUDGE0_API_URL}submissions/batch`,{
        params: {
            tokens: tokens.join(","),
            base64_encoded: false
        }
    });

    const results = data.submissions;
    const isAllDone = results.every((result) =>
         result.status.id !== 1 && result.status.id !== 2
    );  
    if (isAllDone) {
        return results;
    }
    await sleep(1000); // Wait for 1 second before polling again
}
}