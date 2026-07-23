const db = require("../../../config/db");
const pool = require('../../../config/db');

const getAllClients = async () => {
    const result = await db.query("SELECT * FROM bots ORDER BY created_at DESC");
    return result.rows;
};

async function getBotById(botId, clientId) {
    const result = await pool.query(
        `SELECT * FROM bots WHERE id = $1`,
        [botId]
    );
    return result.rows[0];
}

module.exports = {
    getAllClients,
    getBotById
}