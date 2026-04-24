'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');

const bfhlRouter = require('./routes/bfhl');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(
  cors({
    origin: '*', 
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
  })
);
app.use(express.json());

app.use('/bfhl', bfhlRouter);

app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use(errorHandler);

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`BFHL API listening on http://localhost:${PORT}/bfhl`);
  });
}

module.exports = app;
