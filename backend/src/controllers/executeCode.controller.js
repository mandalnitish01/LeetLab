import { pollBatchResults, submitBatch } from "../libs/judge0.lib.js";
import {db} from "../libs/db.js"
export const executeCode = async(req,res)=>{
    try {
        const {source_code , language_id , stdin , expected_outputs , problemId} = req.body
        console.log(req.body)
        const userId = req.user.id;
        console.log("userId----------",userId)
        
        //atep-1 validation test cases
        if(!Array.isArray(stdin)|| stdin.length === 0 || !Array.isArray(expected_outputs) || expected_outputs.length !== stdin.length){
            return res.status(400).json({error:"Invalid or Missing test cases"})
        }

        // step-2 prepare each test cases for judge0 batch submissions
        const submissions = stdin.map((input)=>({
            source_code,
            language_id,
            stdin:input,
        }));

        // step-3 send  submit batch of submission of judge0
        const submitResponse = await submitBatch(submissions);

        const tokens = submitResponse.map((res) => res.token);

        //poll judge0 for results of all submited test cases
        const results = await pollBatchResults(tokens);
         console.log("result--------------")
         console.log(results);

         res.status(200).json({success:true,message:"Code Executed Successfully",results})

    } catch (error) {
        console.log(error);
        return res.status(500).json({error:"Error While Executing Code"})
        
    }

}