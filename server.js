// have installed superagent, supertest, express, nodemon, jest, dotenv, cors
// Load Environment Variables from the .env file


// Application Dependencies
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pg = require('pg');
const morgan = require('morgan');
const request = require('superagent');

// Database Client
// (create and connect using DATABASE_URL)


// Application Setup
const app = express();
// (add middleware utils: logging, cors, static files from public)
// app.use(...)


// API Routes

// http method and path...


// Start the server
// (use PORT from .env!)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log('server running on PORT', PORT);
});