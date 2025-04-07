// src/index.ts

import express, { Request, Response } from 'express';
import prisma from './db';

const app = express();

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to the INTERVU API!');
});

const port = process.env.PORT || 3000;
app.listen(port, async () => {
  console.log(`Server is running on port: ${port}`);
  try {
    await prisma.$connect();
    console.log('Connected to the database successfully!');
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
});
