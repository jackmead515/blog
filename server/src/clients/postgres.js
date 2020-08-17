const { Pool } = require('pg');
const config = require('../config');

const options = {
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};

if (config.pgUrl) {
  options.connectionString = config.pgUrl;
} else {
  options.user = config.pgUser;
  options.password = config.pgPassword;
  options.database = config.pgDatabase;
  options.port = 5432;
}

const pool = new Pool({ ...options });

async function initialize() {
  let client = null;
  try {
    client = await pool.connect();
    await client.query(`
      CREATE TABLE IF NOT EXISTS stats (
        id SERIAL PRIMARY KEY,
        name VARCHAR(500) NOT NULL,
        time BIGINT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS views (
        id SERIAL PRIMARY KEY,
        name VARCHAR(500) NOT NULL UNIQUE,
        amount BIGINT NOT NULL
      );
    `);
  } finally {
    if (client !== null) {
      client.release();
    }
  }
}

module.exports = { pool, initialize };


