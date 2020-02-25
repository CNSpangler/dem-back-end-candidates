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

app.get('/api/candidates', async(req, res) => {
    try {
        const result = await client.query(`
            SELECT
                id,
                name,
                born,
                running,
                type,
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

app.get('/api/types', async(req, res) => {
    try {
        const result = await client.query(`
            SELECT
                type_id,
                type
            FROM types;
        `);

        res.json(result.rows);
    } catch (err) {
        res.status(500).json({
            error: err.message || err
        });
    }
});

app.get('/api/candidates/:candidateId', async(req, res) => {
    try {
        const itemId = req.params.candidateId;
        const result = await client.query(`
            SELECT *
            FROM candidates
            WHERE id=$1
        `, [itemId]);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({
            error: err.message || err
        });
    }
});

app.post('/api/candidates', async(req, res) => {
    try {
        console.log(req.body);
        const result = await client.query(`
            INSERT INTO candidates(name, running, img, type, born)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
        `,
        [req.body.name, req.body.running, req.body.img, req.body.type, req.body.born]);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({
            error: err.message || err
        });
    }
});

app.get('*', (req, res) => {
    res.json({
        error: '404: Ballot Tampering In Progress',
        status: 404
    });
});

// Start the server
// (use PORT from .env!)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log('server running on PORT', PORT);
});