

import mongoose, { Document, Schema } from 'mongoose';

export interface IInteraction extends Document {
  task: string;
  prompt: string;
  output: string;
  timestamp: Date;
}

const interactionSchema = new Schema<IInteraction>({
  task: String,
  prompt: String,
  output: String,
  timestamp: Date,
});

const Interaction = mongoose.model<IInteraction>('athena-extension-writely', interactionSchema);

export default Interaction;