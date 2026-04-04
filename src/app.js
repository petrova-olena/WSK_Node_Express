import api from './api/index.js';
import express from 'express';
import authRouter from './api/routes/auth_router.js';
import cors from 'cors';
import {notFoundHandler, errorHandler} from './middlewares/error_handlers.js';

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({extended: true}));

// Auth routes first
app.use('/api/v1/auth', authRouter);

// Main API routes
app.use('/api/v1', api);

app.get('/', (req, res) => {
  res.send('Welcome to my REST API!');
});

app.post('/', (req, res) => {
  console.log(req.body);
  res.json({ok: true, data: req.body});
});

// Error handlers (must be last)
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
