import type { NextApiRequest } from "next";
import type { NextApiResponse } from "next";

// import {
//   createModel,
//   executeCreateTaskAgent,
//   extractArray,
// } from "../../utils/chain";

// import { createModel, executeCreateTaskAgent, extractArray } from "utils/chain";
// import { createModel,  } from "../../utils/chain";
import { createModel, executeCreateTaskAgent,  extractArray } from "utils/chain";
const key = "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";

export interface CreateTaskAPIRequest extends NextApiRequest {
  body: {
    customApiKey: string;
    goal: string;
    tasks: string[];
    lastTask: string;
    result: string;
  };
}

export interface CreateTaskAPIResponse extends NextApiResponse {
  body: {
    tasks: string[];
  };
}

export default async function handler(
  req: CreateTaskAPIRequest,
  res: CreateTaskAPIResponse
) {
  const completion = await executeCreateTaskAgent(
    createModel(key),
    req.body.goal,
    req.body.tasks,
    req.body.lastTask,
    req.body.result
  );
  console.log(completion.text);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  return res.status(200).json({ tasks: extractArray(completion.text) });
}
