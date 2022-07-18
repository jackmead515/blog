const postgres = require("../clients/postgres");


async function updateStats(link, timestamp) {

    const query1 = `
INSERT INTO stats(link, times, amount)
VALUES($1, ARRAY [($2)::bigint], 1)
ON CONFLICT (link)
DO UPDATE SET times = array_append(stats.times, ($2)::bigint), amount = stats.amount + 1;
    `;

    const query2 = `
UPDATE stats
SET times = array_remove(stats.times, stats.times[0])
WHERE link = $1
AND array_length(times, 1) >= 1000;
    `

    await postgres.withClient(async (client) => {
        await client.query(query1, [link, timestamp]);
        await client.query(query2, [link]);
    });
}

async function getStats(link) {
    
    const query = `
SELECT times, amount
FROM stats
WHERE link = $1;
    `;

    const response = await postgres.withClient(async (client) => {
        return await client.query(query, [link]);
    });

    const result = response.rows[0] || { times: [], amount: 0 };

    result.times = result.times.map((num) => parseInt(num));

    return result;
}

module.exports = {
    getStats,
    updateStats
}