import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import { router } from './routes/route.js';
import session from 'express-session';
dotenv.config();

import postgres from 'postgres';

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

const db = postgres({
    host: PGHOST,
    database: PGDATABASE,
    username: PGUSER,
    password: PGPASSWORD,
    port: 5432,
    ssl: 'require',
    connection: {
        options: `project=${ENDPOINT_ID}`,
    },
});

console.log('Connected to PostgreSQL');

app.use(session({
    secret : process.env.SESSION_SECRET || 'secret',
    resave : false,
    saveUninitialized : false,
    cookie : { secure : false }     // true for https
}))

app.get('/', (req, res) => {
    res.send("Hello, world!");
});
app.use('/api', router);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

export { db };
