import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log('✅ Conectado a MongoDB Atlas');
  } catch (err: any) {
    console.error('❌ Error al conectar a MongoDB:', err.message);
    process.exit(1);
  }
};

export default connectDB;
