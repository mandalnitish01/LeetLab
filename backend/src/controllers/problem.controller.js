import { db } from "../libs/db.js";
import {
  getJudge0LanguageId,
  pollBatchResults,
  submitBatch,
} from "../libs/judge0.lib.js";

export const createProblem = async (req, res) => {
  //geting/extracting all the data from the request body
  const {
    title,
    description,
    difficulty,
    tags,
    examples,
    constraints,
    testCases,
    codeSnippets,
    referenceSolutions,
  } = req.body;
  console.log("Problem set----------", req.body);
  //check the user role
  if (req.user.role !== "ADMIN") {
    return res
      .status(403)
      .json({ message: "Access denied. Only admins can create problems." });
  }
  //loop through all the referance solutions for different languages
  try {
    for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
      //extract the language id from the solution code getJudge0LanguageId function
      const languageId = getJudge0LanguageId(language);
      //   console.log(languageId);
      //through an error if the language is not supported
      if (!languageId) {
        return res
          .status(400)
          .json({ message: `Unsupported language: ${language}` });
      }

      //yaadgaar problem find that is i forget to destructure the arguements
      //   i spent 2-3 hours on this to find the error

      const submissions = testCases.map(({ input, output }) => {
        console.log(
          "Language ID-----",
          languageId,
          "Solution Code------",
          solutionCode,
          "Input -------",
          input,
          "Output -----",
          output
        );
        return {
          source_code: solutionCode,
          language_id: languageId,
          stdin: input,
          expectedOutput: output,
        };
      });
      //extract all the submission results tokens
      const submissionResults = await submitBatch(submissions);
      // console.log("submission Results data " , submissionResults)
      //get all the tokens from the submission results
      const tokens = submissionResults.map((res) => res.token);
      // console.log("Token for checking the results", tokens)
      //create a pooling of the problem with the tokens
      const results = await pollBatchResults(tokens);
      // console.log("result after polling", results)

      //Check if the submission was successful
      //   for (let i = 0; i < results.length; i++) {
      //     const result = results[i];
      //     console.log("result-------", result);
      //     if (result.status.id !== 3) {
      //       // Check if the submission was successful
      //       return res
      //         .status(400)
      //         .json({
      //           error: `Test case ${i + 1} failed for language ${language}`,
      //         });
      //     }
      //   }
      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        // console.log("result-----------", result);
        // const expectedOutput = testCases[i].output.trim();
        // const actualOutput = result.stdout?.trim();

        // console.log(`--- Test Case ${i + 1} ---`);
        // console.log("Expected:", JSON.stringify(expectedOutput));
        // console.log("Actual  :", JSON.stringify(actualOutput));

        if (result.status.id !== 3 || actualOutput !== expectedOutput) {
          return res.status(400).json({
            error: `Test case ${i + 1} failed for language ${language}`,
            // actual: actualOutput,
            // expected: expectedOutput,
          });
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
        },
      });
      // console.log("Problem created successfully but no", newProblem)
      return res.status(201).json({
        success: true,
        message: "Problem created successfully",
        Problem: newProblem,
      });
    }
  } catch (error) {
    // console.log(error);
    return res.status(500).json({
      error: "Error While Creating Problem",
    });
  }
};

export const getAllProblems = async (req, res) => {
  try {
    const problems = await db.Problem.findMany();
    if (!problems) {
      return res.status(400).json({
        error: "No Problems Found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Message Fetched Successfullly",
      problems,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Error While Fetching Problem",
    });
  }
};
export const getProblemById = async (req, res) => {
  const { id } = req.params;
  try {
    const problem = await db.Problem.findUnique({
      where: {
        id,
      },
    });
    if (!problem) {
      return res.status(400).json({
        error: "No Problem Found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "problem Fetched Successfullly by id",
      problem,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Error While Fetching Problem by Id",
    });
  }
};
export const updateProblem = async (req, res) => {
  //id nikalo
  const { id } = req.params;
  // console.log("Updating problem with id:-----", id);

  // // console.log("request body------", req);
  const {
    title,
    description,
    difficulty,
    tags,
    examples,
    constraints,
    testCases,
    codeSnippets,
    referenceSolutions,
  } = req.body;
  // console.log("request body------", req.body);

  const problem = await db.Problem.findUnique({
    where: {
      id,
    },
  });

  if (!problem) {
    return res.status(404).json({
      message: "No problem found for updation",
    });
  }
  try {
    for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
      //taking language and solution code from refernce sol
      const languageId = getJudge0LanguageId(language);

      if (!languageId) {
        return req.status(403).json({
          error: "Language not allowed",
        });
      }
      //loop through each reference solution for different language

      const submissions = testCases.map(({ input, output }) => ({
        source_code: solutionCode,
        language_id: languageId,
        stdin: input,
        expected_output: output,
      }));

      const submissionResults = await submitBatch(submissions);
      const tokens = submissionResults.map((res) => res.token);
      const results = await pollBatchResults(tokens);
      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        if (result.status.id !== 3) {
          return res.status(400).json({
            error: `Testcase ${i + 1} failed for language ${language}`,
          });
        }
      }
    }

    const updatedProblem = await db.Problem.update({
      where: {
        id,
      },
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
        userId: req.user.id,
      },
    });

    return res.status(200).json({
      message: "Problem updated successfully",
      success: true,
      Problem: updatedProblem,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error updating problem",
    });
  }
};
export const deleteProblem = async (req, res) => {
  const { id } = req.params;
  try {
    const problem = await db.Problem.findUnique({
      where: {
        id,
      },
    });
    if (!problem) {
      return res.status(400).json({
        error: "No Problem Found",
      });
    }
    //delete the problem id mathches in db
    await db.Problem.delete({ where: { id } });
    return res.status(200).json({
      success: true,
      message: "Problem Deleted Successfullly",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Error While Deleting Problem",
    });
  }
};
export const getAllProblemsSolvedByUser = async (req, res) => {
  
};
