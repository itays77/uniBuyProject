import express, { Request, Response } from 'express';
import cors from 'cors';
import 'dotenv/config';
import mongoose from 'mongoose';
import myUserRoute from './routes/MyUserRoute';
import itemRoute from './routes/ItemRoute';

mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING as string)
  .then(() => console.log('Connected to MongoDB'));

const app = express();
app.use(express.json());
app.use(cors());

app.get('/health', async (req: Request, res: Response) => {
  res.send({ message: 'health OK!' });
});

app.use('/api/my/user', myUserRoute);
app.use('/api/items', itemRoute);

app.listen(8000, () => {
  console.log('Server is running on port: 8000');
});
