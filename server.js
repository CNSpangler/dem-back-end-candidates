// Fri morning: finished load-seed-data
    // build database
    // create endpoints, etc.
    // FRONT END, BITCHES!

// have installed superagent, supertest, express, nodemon, jest, dotenv, cors
// Load Environment Variables from the .env file


// Application Dependencies
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pg = require('pg');
const morgan = require('morgan');
// const request = require('superagent');

// Database Client
// (create and connect using DATABASE_URL)
const Client = pg.Client;
const client = new Client(process.env.DATABASE_URL);
client.connect();

// Application Setup
const app = express();
// (add middleware utils: logging, cors, static files from public)
// app.use(...)
// const PORT = process.env.PORT;
app.use(morgan('dev')); // http logging
app.use(cors()); // enable CORS request



// API Routes

app.get('/', (req, res) => res.send(`Get dem candidates`));

app.get('/api/candidates', async(req, res, next) => {
    try {
        const result = await client.query(`
            SELECT
                name,
                born,
                running,
                identity,
                img
            FROM CANDIDATES;
        `);

        res.json(result.rows);
    } catch (err) {
        res.status(500).json({
            error: err.message || err
        });
    }
});

// http method and path...


// Start the server
// (use PORT from .env!)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log('server running on PORT', PORT);
});