/* eslint-disable import/no-anonymous-default-export */
import { NextApiRequest, NextApiResponse } from 'next';
// import openai from 'openai';

// // Set your OpenAI API key
// // openai.apiKey = '<YOUR_API_KEY>';

// async function getLanguageModelResponse(question: string, history: string[]): Promise<string> {
//   try {
//     // Join the history with the question to create a single prompt
//     const prompt = history.concat([`User: ${question}`, 'AI:']).join('\n');

//     // Call the GPT-3.5 API
//     const result = await openai.completion({
//       engine: 'text-davinci-002', // Choose the appropriate engine for GPT-3.5
//       prompt: prompt,
//       max_tokens: 150, // Adjust the maximum tokens based on your requirements
//       n: 1,
//       stop: ['\nUser:', '\nAI:'],
//       temperature: 0.8,
//     });

//     // Get the response from the API result
//     const response = result.choices[0].text.trim();

//     return response;
//   } catch (error) {
//     console.error('Error while querying the OpenAI API:', error);
//     throw new Error('Error while querying the OpenAI API');
//   }
// }

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method === 'POST') {
//     try {
//       const { question, history } = req.body;
//       const response = await getLanguageModelResponse(question, history);

//       // Send the response as Server-Sent Events (SSE)
//       res.setHeader('Content-Type', 'text/event-stream');
//       res.setHeader('Cache-Control', 'no-cache');
//       res.setHeader('Connection', 'keep-alive');

//       // Send the response in chunks
//       response.split('').forEach((char, index) => {
//         setTimeout(() => {
//           res.write(`data: ${JSON.stringify({ data: char })}\n\n`);

//           // Send the "[DONE]" message when the response is complete
//           if (index === response.length - 1) {
//             res.write(`data: [DONE]\n\n`);
//             res.end();
//           }
//         }, index * 100); // Adjust the delay based on your requirements
//       });

//     } catch (error) {
//       res.status(500).json({ message: 'Internal server error', error });
//     }
//   } else {
//     res.status(405).json({ message: 'Method not allowed' });
//   }
// }
import { env } from 'process';

export default async function (req: NextApiRequest, res: NextApiResponse) {

    const response = await fetch(process.env.LCC_ENDPOINT_URL as string, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": process.env.LCC_TOKEN as string
      },
      body: JSON.stringify({
        question: req.body.question,
        history: req.body.history
      }),
    });
  
      const data = await response.json();
  
      res.status(200).json({ result: data })
  }