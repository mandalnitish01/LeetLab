import { getLanguageName, pollBatchResults, submitBatch } from "../libs/judge0.lib.js";
import { db } from "../libs/db.js";
export const executeCode = async (req, res) => {
  try {
    const { source_code, language_id, stdin, expected_outputs, problemId } =
      req.body;

    // console.log("problem id---------------",problemId)
    const userId = req.user.id;
//     console.log("userId----------",userId)
// // 1. Check if the problem exists
// const problem = await prisma.Problem.findUnique({
//   where: { id: problemId },
// });

// if (!problem) {
//   throw new Error(`Problem with ID ${problemId} does not exist`);
// }
    //atep-1 validation test cases
    if (
      !Array.isArray(stdin) ||
      stdin.length === 0 ||
      !Array.isArray(expected_outputs) ||
      expected_outputs.length !== stdin.length
    ) {
      return res.status(400).json({ error: "Invalid or Missing test cases" });
    }

    // step-2 prepare each test cases for judge0 batch submissions
    const submissions = stdin.map((input) => ({
      source_code,
      language_id,
      stdin: input,
    }));

    // step-3 send  submit batch of submission on judge0
    const submitResponse = await submitBatch(submissions);

    //judge0 return a tokens
    const tokens = submitResponse.map((res) => res.token);

    //that tokens go into the polling judge0 for results of all submited test cases
    const results = await pollBatchResults(tokens);
    // console.log("result--------------");
    // console.log(results);

    //analyze the test case result
    let allPassed = true;
    const detailesResults = results.map((result, index) => {
      //get the stdout of each test case
      const stdout = result.stdout?.trim(); // trim is used for Remove leading/trailing whitespace
      //get the expected output of each test case
      const expected_output = expected_outputs[index]?.trim();
      //check the comming output and expected output
      const passed = stdout === expected_output;

      if (!passed) {
        allPassed = false;
      }
      return {
        testCase:index+1,
        passed,
        stdout,
        expected:expected_output,
        stderr:result.stderr || null,
        compiled_output:result.compile_output || null,
        ststus:result.status.description,
        memory:result.memory ? `${result.memory} KB` : undefined,
        time:result.time? `${result.time} s` : undefined
      }

      //  console.log(`Test Case # ${index+1}`);
      //  console.log(`Input # ${stdin[index]}`);
      //  console.log(`Expected Output for testcase # ${expected_output}`);
      //  console.log(`Actual Outputs # ${stdout}`);

      //  console.log(`Test Case #${index+1} ${passed ? "Passed" : "Failed"}`);
    });
    //detailed output 
    // console.log("detailesResults",detailesResults)

    //store submission summary into variable
    const submission =  await db.Submission.create({
         data:{
            userId,
            problemId,
            sourceCode:source_code,
            language:getLanguageName(language_id),
            stdin:stdin.join("\n"),
            stdout:JSON.stringify(detailesResults.map((result) => result.stdout)),
            stderr:detailesResults.some((result)=> result.stderr)? JSON.stringify(detailesResults.map((result) => result.stderr)):null,
            compileOutput:detailesResults.some((result)=> result.compiled_output)? JSON.stringify(detailesResults.map((result) => result.compiled_output)):null,
            status:allPassed? "Accepted":"Wrong Answer",
            memory:detailesResults.some((result)=> result.memory)? JSON.stringify(detailesResults.map((result) => result.memory)):null,
            time:detailesResults.some((result)=> result.time)? JSON.stringify(detailesResults.map((result) => result.time)):null
         }
    })
    // console.log("errr-------------",submission)

    //if all clear then mark problem solved for the current user
    if (allPassed) {
        // upsert methos :- update or create
      await db.ProblemSolved.upsert({
        where: {
          userId_problemId: {
            userId,
            problemId,
          }
        },
        update:{},
        create: {
          userId,
          problemId,
        },
      });
    } 

    //save individual test case resuts using detailedResults
    const testCaseResults = detailesResults.map((result) => ({
        submissionId:submission.id,
        testCase:result.testCase,
        passed:result.passed,
        stdout:result.stdout,
        expected:result.expected,
        stderr:result.stderr,
        compileOutput:result.compiled_output,
        status:result.ststus,
        memory:result.memory,
        time:result.time
    }))

await db.TestCaseResult.createMany({
    data:testCaseResults
})

const submissionWithTestCase = await db.submission.findUnique({
    where: {
        id:submission.id
    },
    include: {
        testCases: true
    }
})
    //send responde to the user
    res
      .status(200)
      .json({ success: true, message: "Code Executed Successfully" , submission: submissionWithTestCase});
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error: "Error While Executing Code" });
  }
};
