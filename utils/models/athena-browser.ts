
import { Schema, Document } from "mongoose";
import mongoose from "mongoose";

export interface ICompletion extends Document {
  taskInstructions: string;
  previousActions: string[];
  simplifiedDOM: string;
  usage: any;
  prompt: string;
  response: string;
  timestamp: Date;
}

const CompletionSchema: Schema = new Schema({
  taskInstructions: { type: String, required: true },
  previousActions: { type: [String], required: true },
  simplifiedDOM: { type: String, required: true },
  usage: { type: Object, required: true },
  prompt: { type: String, required: true },
  response: { type: String, required: true },
  timestamp: { type: Date, required: true },
});

export const Completion = mongoose.model<ICompletion>("Completion", CompletionSchema);