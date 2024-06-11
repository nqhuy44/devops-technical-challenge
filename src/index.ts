import express from 'express';
import { query } from './database';
import { PORT } from './config';

const app = express();


app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});