import mongoose from 'mongoose';

const connectToDatabase = async () => {
    try{
        await mongoose.connect(process.env.MONGODB_URI);

        console.log('Connected to MongoDB successfully');

    }catch(err){
        console.error('MongoDB connection error:', err.message);
    }
}
export default connectToDatabase;