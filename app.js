import { join } from 'path';

import express, { static as staticServer } from 'express';
import pkg from 'body-parser';

import productRoutes from './routes/products.js';
import authRoutes from './routes/auth.js';
import { initDb } from './db.js';

const PORT = process.env.BE_PORT || 3101;

const app = express();
const { json } = pkg;

app.use(json());
app.use('/images', staticServer(join('/images')));

app.use((req, res, next) => {

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET,POST,PUT,PATCH,DELETE,OPTIONS'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use('/products', productRoutes);
app.use('/', authRoutes);

initDb((err, db) => {
  if (err) {
    console.log(err);
  } else {
    app.listen(PORT);
  }
});

