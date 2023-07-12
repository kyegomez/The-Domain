import { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";
// import { Completion, ICompletion } from 'utils/models/-browser';
import { Completion, ICompletion } from "utils/models/athena-browser";

// import Completion, { ICompletion } from "../../models/Completion";
// Connect to MongoDB if not already connected
const mongo_url: any = process.env.MONGO_URL;

if (mongoose.connection.readyState === 0) {
  mongoose
    .connect(`${mongo_url}`)
    .catch((error) => console.error("Error connecting to MongoDB:", error));
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    try {
      const completionData: ICompletion = new Completion(req.body);
      await completionData.save();
      res.status(200).json({ message: "Completion data saved successfully" });
    } catch (error: any) {
      console.error("Request body:", req.body);
      console.error("Error saving completion data:", error);
      console.error("Error stack trace:", error.stack);
      res.status(500).json({ message: "Error saving completion data", error: error.message });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
};
