const pool = require('../../config/db');

async function getActiveBotById(botId) {
    const result = await pool.query(
        `SELECT * FROM bots WHERE id = $1 AND is_active = true`,
        [botId]
    );
    return result.rows[0];
}

async function getOrCreateConversation(botId, visitorId, conversationId, visitorInfo) {
    if (conversationId) {
        const existing = await pool.query(
            `SELECT * FROM conversations WHERE id = $1 AND bot_id = $2`,
            [conversationId, botId]
        );
        if (existing.rows[0]) return existing.rows[0];
    }

    const created = await pool.query(
        `INSERT INTO conversations (bot_id, visitor_id, visitor_name, visitor_email, visitor_phone)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [
            botId,
            visitorId,
            visitorInfo?.name || null,
            visitorInfo?.email || null,
            visitorInfo?.phone || null,
        ]
    );
    return created.rows[0];
}

async function getRecentMessages(conversationId, limit = 10) {
    const result = await pool.query(
        `SELECT role, content FROM messages WHERE conversation_id = $1 ORDER BY created_at ASC LIMIT $2`,
        [conversationId, limit]
    );
    return result.rows;
}

async function saveMessage(conversationId, role, content) {
    await pool.query(
        `INSERT INTO messages (conversation_id, role, content) VALUES ($1, $2, $3)`,
        [conversationId, role, content]
    );
}

module.exports = {
    getActiveBotById,
    getOrCreateConversation,
    getRecentMessages,
    saveMessage,
};