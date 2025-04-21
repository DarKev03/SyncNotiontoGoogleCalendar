import dotenv from 'dotenv';
import connectDB from './config/db';
import app from './app';

dotenv.config();

connectDB();

const PORT = process.env.PORT || 5000;
console.log(`El puerto en env.PORT es ${process.env.PORT}`);

app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en el puerto ${PORT}`);
});
