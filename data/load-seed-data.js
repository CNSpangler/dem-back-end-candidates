//seed data for types won't fucking work
//needs 'distinct' to work somehow

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

        // name the variable savedTypes
        //this part already works! party on!
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
        // savedTypes = the table that has all the types loaded into it
        console.log(savedTypes);

        // "Promise all" does a parallel execution of async tasks
        await Promise.all(
            // for every candidate data, we want a promise to insert into the db
            candidates.map(candidate => {
                const candidateType = savedTypes.find(type => {
                    // this line references the SEED data, NOT the tables in database
                    return type.type === candidate.type;
                });
                console.log(candidateType);

                // This is the query to insert a candidate into the db.
                // First argument is the function is the "parameterized query"
                return client.query(`
                    INSERT INTO candidates (name, born, running, type, img)
                    VALUES ($1, $2, $3, $4, $5);
                `,
                    // Second argument is an array of values for each parameter in the query:
                [candidate.name, candidate.born, candidate.running, candidateType.type_id, candidate.img]);

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