require('dotenv').config();
const connectDB = require('./config/db');
connectDB();

const app = require('./app');
const PORT = process.env.PORT || 5000;
console.log(`El puerto en env.PORT es ${process.env.PORT}`);
app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en el puerto ${PORT}`);
});
