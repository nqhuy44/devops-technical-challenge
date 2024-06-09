import express from 'express';
import { query } from './database';
import { PORT } from './config';

const app = express();

query('SELECT NOW()', [])
  .then(res => {
    console.log(`Database connected. Current time: ${res.rows[0].now}`);

    app.get('/', (req, res) => {
      res.send('Hello World!');
    });

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('Failed to connect to the database.', err);
    process.exit(1);
  });