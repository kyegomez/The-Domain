import type { NextApiRequest, NextApiResponse } from "next";
// import { createModel, extractArray, startGoalAgent } from "../../utils/chain";
import { createModel, extractArray, startGoalAgent } from "utils/chain";

const key = "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";

export interface APIRequest extends NextApiRequest {
  body: {
    customApiKey: string;
    goal: string;
  };
}

export interface ChainAPIResponse extends NextApiResponse {
  body: { tasks: string[] };
}

export default async function handler(
  req: ChainAPIRequest,
  res: ChainAPIResponse
) {
  const model = createModel(key);
  const completion = await startGoalAgent(model, req.body.goal);
  console.log(completion.text);
  res.status(200).json({ tasks: extractArray(completion.text) });
}
