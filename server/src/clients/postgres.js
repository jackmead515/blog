const { Pool } = require('pg');
const pg = require('pg');

const config = require('../config');

pg.types.setTypeParser(pg.types.builtins.INT8, parseInt);

const pool = new Pool({
  connectionString: config.POSTGRES_URL,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('error', (err) => {
  console.error('postgres error', err);
});

async function withClient(func) {
    let client = null;
    try {
      client = await pool.connect();
      return await func(client);
    } finally {
      if (client !== null) {
        client.release();
      }
    }
}

async function initialize() {
  await withClient(async (client) => {
    await client.query(`
      CREATE TABLE IF NOT EXISTS stats (
        id SERIAL PRIMARY KEY,
        link TEXT NOT NULL UNIQUE,
        amount BIGINT NOT NULL,
        times BIGINT[] NOT NULL
      );
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS stats_index ON stats (link);
    `);
  });
}


module.exports = {
    pool,
    initialize,
    withClient
}
