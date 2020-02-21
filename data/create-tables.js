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
            CREATE TABLE candidates (
                name VARCHAR(256) NOT NULL,
                born INTEGER NOT NULL,
                running BOOLEAN NOT NULL,
                identity VARCHAR(256) NOT NULL,
                img VARCHAR(256) NOT NULL
            );
        `);

        console.log('create tables complete');
    }
    catch (err) {
        // problem? let's see the error...
        console.log(err);
    }
    finally {
        // success or failure, need to close the db connection
        client.end();
    }   
}