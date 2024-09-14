import express from 'express';
import petRoutes from './routes/routes';
import routes from './routes/routes';
import errorHandler from './middlewares/errorHandler';

export const app = express();

app.use(express.json());

app.use(routes);

app.use(errorHandler)



