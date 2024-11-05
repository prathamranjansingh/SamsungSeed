import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import { router } from './routes/route.js';
import session from 'express-session';
dotenv.config();
import { db, connectToDatabase } from './db/connectDB.js';
let { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID } = process.env;

export const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(session({
    secret: 'rwrfhihr87433br98',
    resave: false,
    saveUninitialized: false
}));

app.use(session({
    secret : process.env.SESSION_SECRET || 'secret',
    resave : false,
    saveUninitialized : false,
    cookie : { secure : false }     // true for https
}))


app.use('/api', router);

const PORT = process.env.PORT || 3000;
connectToDatabase();
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

