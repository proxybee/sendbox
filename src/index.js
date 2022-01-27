import express from 'express';
// import bodyParser from 'body-parser'
import Debug from 'debug';
import dotenv from 'dotenv';
import morgan from 'morgan';
import helmet from 'helmet';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import cors from 'cors';

// import swagger from 'swagger-ui-express';
// import swaggerDocument from '../swagger.js';
import parcelRoute from './routes/parcels';
import userRoute from './routes/users';
import authRoute from './routes/auth';

dotenv.config();

const app = express();
const debug = Debug('index');
const port = process.env.PORT;

app.use(morgan('tiny'));
app.use(express.json()); // For JSON requests
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET,
  cookie: { maxAge: 60000 },
  resave: false, // forces the session to be saved back to the store
  saveUninitialized: false, // dont save unmodified
}));
// app.use(bodyParser.urlencoded({ extended: false }))

app.use(
  cors({
    origin: '*',
    methods: 'GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  }),
);

app.get('/', (req, res) => res.status(200).json({ msg: 'Welcome to SendBox API.' }));

// import routes
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/parcels', parcelRoute);
app.use('/api/v1/users', userRoute);
// app.use('/docs', swagger.serve, swagger.setup(swaggerDocument));

// eslint-disable-next-line no-unused-vars
// app.get((err, req, res, next) => {
//   res.status(500).send('Something is broken! Fix it!!!');
// });
app.use((err, req, res, next) => {
  debug(err.stack);
  res.status(500);
  res.render('There was an Error processing your request. Something"s broken! to Fix it!!! update your data and try again', { error: err });
  next();
});

const server = app.listen(port, () => {
  debug(`App running on port ${port}.`);
});

process.on('exit', () => server.close());
process.on('SIGTERM', () => server.close());
process.on('uncaughtException', () => server.close());
