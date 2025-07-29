import mongoose from 'mongoose';
import { config } from './index.js';

const connectToDatabase = async () => {
    try{
        const mongoUri = process.env.MONGODB_URI || config.mongoUri;
        await mongoose.connect(mongoUri);

        console.log('Connected to MongoDB successfully');

    }catch(err){
        console.error('MongoDB connection error:', err.message);
        console.log('Server will continue without database connection. Some features may not work.');
    }
}
export default connectToDatabase;