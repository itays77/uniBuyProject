import express, { Request, Response } from 'express';
import cors from 'cors';
import 'dotenv/config';
import mongoose from 'mongoose';
import myUserRoute from './routes/MyUserRoute';
import itemRoute from './routes/ItemRoute';
import orderRoute from './routes/OrderRoute';

mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING as string)
  .then(() => console.log('Connected to MongoDB'));

const app = express();


app.use('/api/orders/checkout/webhook', express.raw({ type: 'application/json' }));


app.use(express.json());
app.use(
  cors({
    origin: [
      'https://unibuyproject-frontend.onrender.com', // Allow your deployed frontend
      'http://localhost:5173', // Allow local development
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.get('/health', async (req: Request, res: Response) => {
  res.send({ message: 'health OK!' });
});

app.use('/api/my/user', myUserRoute);
app.use('/api/items', itemRoute);
app.use('/api/orders', orderRoute);



app.listen(8000, () => {
  console.log('Server is running on port: 8000');

  // Log environment variables 
  console.log('Environment variables check:');
  console.log(
    `- FRONTEND_URL: ${process.env.FRONTEND_URL ? '✓ Set' : '✗ Not Set'}`
  );
  console.log(
    `- UNIPAAS_API_KEY: ${process.env.UNIPAAS_API_KEY ? '✓ Set' : '✗ Not Set'}`
  );
  console.log(
    `- UNIPAAS_SECRET_KEY: ${
      process.env.UNIPAAS_SECRET_KEY ? '✓ Set' : '✗ Not Set'
    }`
  );
});


