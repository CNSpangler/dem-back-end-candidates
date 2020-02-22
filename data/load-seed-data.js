require('dotenv').config();
const pg = require('pg');
const Client = pg.Client;

const candidates = require('./candidates.js');
const types = require('./types.js');

run();

async function run() {
    const client = new Client(process.env.DATABASE_URL);

    try {
        await client.connect();

        const savedTypes = await Promise.all(
            types.map(async type => {
                const result = await client.query(`
                    INSERT INTO types (type)
                    VALUES ($1)
                    RETURNING *;
                `,
                [type]);
                return result.rows[0];
            })
        );

        // "Promise all" does a parallel execution of async tasks
        await Promise.all(
            // for every cat data, we want a promise to insert into the db
            candidates.map(candidate => {
                savedTypes.find(type => {
                    return type.type_id === candidate.type_id;
                });

                // This is the query to insert a cat into the db.
                // First argument is the function is the "parameterized query"
                return client.query(`
                    INSERT INTO candidates (name, born, running, identity, img)
                    VALUES ($1, $2, $3, $4, $5);
                `,
                    // Second argument is an array of values for each parameter in the query:
                [candidate.name, candidate.born, candidate.running, candidate.identity, candidate.img]);

            })
        );


        console.log('seed data load complete');
    }
    catch (err) {
        console.log(err);
    }
    finally {
        client.end();
    }    
}