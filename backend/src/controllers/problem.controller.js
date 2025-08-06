import {db} from '../libs/db.js'
import { getJudge0LanguageId, pollBatchResults, submitBatch } from '../libs/judge0.lib.js';



export const createProblem = async (req, res) => {
    //geting/extracting all the data from the request body
    const { title,description,difficulty,tags,examples,constraints,testCases,codeSnippets,referenceSolutions } = req.body;
console.log("Problem set" , req.body);
    //check the user role
    if (req.user.role !== 'ADMIN') {
        return res.status(403).json({ message: 'Access denied. Only admins can create problems.' });
    }
    //loop through all the referance solutions for different languages
    try {
        for(const [language , solutionCode] of Object.entries(referenceSolutions)){
            //extract the language id from the solution code getJudge0LanguageId function
            const languageId = getJudge0LanguageId(language);
            console.log(languageId)
            //through an error if the language is not supported
            if (!languageId) {
                return res.status(400).json({ message: `Unsupported language: ${language}` });
            }

            const submissions = testCases.map((input , output) =>{
                return {
                    language_id: languageId,
                    source_code: solutionCode,
                    stdin: input,
                    expected_output: output
                };
            });
            //extract all the submission results tokens
            const submissionResults = await submitBatch(submissions);
console.log("submission Results data " , submissionResults)
            //get all the tokens from the submission results
            const tokens = submissionResults.map((res) => res.token);
console.log("Token for checking the results", tokens)
            //create a pooling of the problem with the tokens
            const results = await pollBatchResults(tokens)
console.log("result after polling", results)

            //Check if the submission was successful
            for(let i=0; i < results.length; i++) {
                const result = results[i];
                console.log("result-------" , result)
                if (result.status.id !== 3) { // Check if the submission was successful
                    return res.status(400).json({ error:`Test case ${i+1} failed for language ${language}` });
                }
            }

            //save the problem to the DataBase
            const newProblem = await db.Problem.create({
                data: {
                    title,
                    description,
                    difficulty,
                    tags,
                    examples,
                    constraints,
                    testCases,
                    codeSnippets,
                    referenceSolutions,
                    userId: req.user.id, // Assuming you want to associate the problem with the user who created it
                    // languageId, // Save the language ID for the problem
}});   
// console.log("Problem created successfully but no", newProblem)         
    return res.status(201).json({
        success: true,        
        message: 'Problem created successfully',
        Problem: newProblem
        
    });  
        }
        
    } catch (error) {
        
    }

}

export const getAllProblems = async (req, res) => {}
export const getProblemById = async (req, res) => {}
export const updateProblem = async (req, res) => {}
export const deleteProblem = async (req, res) => {}
export const getAllProblemsSolvedByUser = async (req, res) => {}
