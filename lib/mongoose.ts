// lib/mongoose.ts
import mongoose from 'mongoose';

const url: any = process.env.MONGO_URL
const connectDB = async () => {
  try {
    await mongoose.connect(url)
    console.log('MongoDB connected');
  } catch (error: any) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

export default connectDB;