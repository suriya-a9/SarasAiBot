const pool = require('../../config/db');

async function verifyBotOwnership(botId, clientId) {
    const result = await pool.query(
        `SELECT id FROM bots WHERE id = $1 AND client_id = $2`,
        [botId, clientId]
    );
    return !!result.rows[0];
}

async function getConversationsForBot(botId, { limit = 50, offset = 0 } = {}) {
    const result = await pool.query(
        `SELECT
       c.id,
       c.visitor_id,
       c.visitor_name,
       c.visitor_email,
       c.visitor_phone,
       c.started_at,
       COUNT(m.id) AS message_count,
       MAX(m.created_at) AS last_message_at,
       (
         SELECT content FROM messages
         WHERE conversation_id = c.id
         ORDER BY created_at ASC LIMIT 1
       ) AS first_message
     FROM conversations c
     LEFT JOIN messages m ON m.conversation_id = c.id
     WHERE c.bot_id = $1
     GROUP BY c.id
     ORDER BY MAX(m.created_at) DESC NULLS LAST
     LIMIT $2 OFFSET $3`,
        [botId, limit, offset]
    );
    return result.rows;
}

async function getConversationCount(botId) {
    const result = await pool.query(
        `SELECT COUNT(*) FROM conversations WHERE bot_id = $1`,
        [botId]
    );
    return parseInt(result.rows[0].count, 10);
}

async function getMessagesForConversation(conversationId, botId) {
    const result = await pool.query(
        `SELECT m.id, m.role, m.content, m.created_at
     FROM messages m
     JOIN conversations c ON c.id = m.conversation_id
     WHERE m.conversation_id = $1 AND c.bot_id = $2
     ORDER BY m.created_at ASC`,
        [conversationId, botId]
    );
    return result.rows;
}

module.exports = {
    verifyBotOwnership,
    getConversationsForBot,
    getConversationCount,
    getMessagesForConversation,
};