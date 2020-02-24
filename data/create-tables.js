require('dotenv').config();
const pg = require('pg');
const Client = pg.Client;

run();

async function run() {
    // make a new pg client to the supplied url
    const client = new Client(process.env.DATABASE_URL);

    try {
        // initiate connecting to db
        await client.connect();
    
        // run a query to create tables
        await client.query(`
            CREATE TABLE types (
                type_id SERIAL PRIMARY KEY NOT NULL,
                type VARCHAR(256) NOT NULL
            );

            CREATE TABLE candidates (
                id SERIAL PRIMARY KEY NOT NULL,
                name VARCHAR(256) NOT NULL,
                born INTEGER NOT NULL,
                running BOOLEAN NOT NULL,
                type INTEGER NOT NULL REFERENCES types(type_id),
                img VARCHAR(256) NOT NULL
            );
        `);

        console.log('create tables complete');
    }
    catch (err) {
        console.log(err);
    }
    finally {
        // success or failure, need to close the db connection
        client.end();
    }   
}