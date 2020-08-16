const { pool } = require('../clients/postgres');
const { asyncRetry } = require('../util/retry');

const queryGetHistoricViewsWithName = `
SELECT time
FROM stats
WHERE name = $1 
ORDER BY time ASC;
`

const queryGetViewCountWithName = `
SELECT vw.amount
FROM views vw
WHERE vw.name = $1
ORDER BY vw.amount ASC;
`

const updateViewCountWithName = `
INSERT INTO views(name, amount)
VALUES($1, 1)
ON CONFLICT (name)
DO UPDATE SET amount = views.amount + 1;
`

const queryListPopular = `
SELECT name, amount
FROM views
ORDER BY amount DESC
LIMIT 10;
`

const queryCountHistoricViewsWithName = `
SELECT COUNT(id) 
FROM stats 
WHERE name = $1;
`

const queryEarliestHistoricViewsWithName = `
SELECT id, time
FROM stats
WHERE name = $1
ORDER BY time ASC
LIMIT 1;
`

const queryDeleteHistoricViewsById = `
DELETE FROM stats
WHERE id = $1;
`

const queryInsertHistoricViews = `
INSERT INTO stats(name, time) 
VALUES($1, $2);
`

async function mostPopular() {
  return await asyncRetry(async () => {
    let client = null;
    try {
      client = await pool.connect();
      const result = await client.query(queryListPopular);
      return result.rows;
    } finally {
      if (client !== null) {
        client.release();
      }
    }
  });
}

async function getViewCount(name) {
  return await asyncRetry(async () => {
    let client = null;
    try {
      client = await pool.connect();
      const result = await client.query(queryGetViewCountWithName, [name]);
      return result.rows.map((value) => parseInt(value.amount));
    } finally {
      if (client !== null) {
        client.release();
      }
    }
  });
}

async function saveViewCount(name) {
  return await asyncRetry(async () => {
    let client = null;
    try {
      client = await pool.connect();
      await client.query(updateViewCountWithName, [name]);
    } finally {
      if (client !== null) {
        client.release();
      }
    }
  });
}

async function getHistoricViews(name) {
  return await asyncRetry(async () => {
    let client = null;
    try {
      client = await pool.connect();
      const result = await client.query(queryGetHistoricViewsWithName, [name]);
      return result.rows.map((value) => parseInt(value.time));
    } finally {
      if (client !== null) {
        client.release();
      }
    }
  });
}

async function saveHistoricView(name) {
  let client = null;
  try {
    client = await asyncRetry(() => pool.connect());

    const earliestRecord = await asyncRetry(async () => {
      const result = await client.query(queryCountHistoricViewsWithName, [name]);
      if (parseInt(result.rows[0].count) >= 100) {
        return await client.query(queryEarliestHistoricViewsWithName, [name]);
      }
    });

    await asyncRetry(async () => {
      if (earliestRecord) {
        await client.query(queryDeleteHistoricViewsById, [earliestRecord.rows[0].id]);
      }
      await client.query(queryInsertHistoricViews, [name, new Date().getTime()]);
    });
  } finally {
    if (client !== null) {
      client.release();
    }
  }
}

module.exports = {
  getHistoricViews,
  saveHistoricView,
  getViewCount,
  saveViewCount,
  mostPopular
}