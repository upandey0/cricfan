const express = require('express');
const router = require('./Routers/Signup');
const { Pool } = require('pg');
const secrets = require('./configs/config.json');
const { syncDB } = require('./configs/db');
const notFoundHandler = require('./middlwares/notFoundHandler');
const errorHandler = require('./middlwares/errorHandler');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { redis } = require('./config');
const sessionRouter = require('./Routers/session');

const app = express();

app.use(express.json());
app.use(morgan('combined'));
app.use(helmet());
app.use(cors());
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);
// //console.log(pool)

redis.on('connect', () => {
  console.log('Connected to Redis');
});

redis.on('error', (err) => {
  console.error('Error in Redis connection', err);
});


app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'Healthy',
  });
});

app.use('/v1/api/user', router);
app.use('/v1/api/session', sessionRouter);



// Centralized error handling middleware
// app.use(errorHandler);

// Handle 404 errors
app.use(notFoundHandler);

syncDB().then(() => {
  app.listen(8000, () => {
    console.log('Server started on http://localhost:8000');
  });
});
