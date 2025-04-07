import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get('/', (_req, res) => {
  res.send('INTERVU backend is up 🎤');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
