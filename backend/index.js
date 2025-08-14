import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
import connectDB from './config/db.js'; 
import authRoutes from './routes/auth.route.js';


dotenv.config();
const __dirname = path.resolve();

const app = express();


// Setting up the Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


connectDB();


app.use('/backend/auth', authRoutes);


// Health Check Endpoint
app.get('/backend/ping', (req, res) => {
  res.status(200).send('pong');
});


// Serving the frontend build
app.use(express.static(path.join(__dirname, 'frontend/dist')));
app.get(/^(?!\/backend).*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/dist/index.html'));
});


// Global Error Handler
app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({ error: err.message || 'Internal Server Error' });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
