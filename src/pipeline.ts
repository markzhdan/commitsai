const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");
const { ChatPromptTemplate } = require("@langchain/core/prompts");

import { promptCommitMessage } from "./prompts";

export const generateCommitMessage = async (text: string, apiKey: string) => {
  try {
    const geminiModel = new ChatGoogleGenerativeAI({
      apiKey,
      modelName: "gemini-1.5-pro",
      // Prevents random results
      //   temperature: 0.1,
      //   topP: 0.3,
    });

    const prompt = ChatPromptTemplate.fromMessages([
      ["human", promptCommitMessage],
    ]);

    // geminiModel.withStructuredOutput(schema, { name: "generateCommitMsg" })
    const runnable = prompt.pipe(geminiModel);

    const result = await runnable.invoke({ text });
    return result.content;
  } catch (error) {
    console.error("Failed to generate commit message from pipeline: ", error);
    console.log("Error in pipeline: ", error);
  }
};
