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

async function getBotStats(botId) {
    const result = await pool.query(
        `SELECT
       (SELECT COUNT(*) FROM conversations WHERE bot_id = $1) AS total_conversations,
       (SELECT COUNT(DISTINCT visitor_id) FROM conversations WHERE bot_id = $1) AS active_users,
       (
         SELECT COUNT(*) FROM messages m
         JOIN conversations c ON c.id = m.conversation_id
         WHERE c.bot_id = $1 AND m.role = 'user' AND m.created_at::date = CURRENT_DATE
       ) AS messages_today,
       (
         SELECT COUNT(*) FROM messages m
         JOIN conversations c ON c.id = m.conversation_id
         WHERE c.bot_id = $1 AND m.role = 'user'
       ) AS total_user_messages,
       (
         SELECT COUNT(*) FROM messages m
         JOIN conversations c ON c.id = m.conversation_id
         WHERE c.bot_id = $1 AND m.role = 'assistant'
       ) AS total_assistant_messages`,
        [botId]
    );

    const row = result.rows[0];
    const totalUserMessages = parseInt(row.total_user_messages, 10);
    const totalAssistantMessages = parseInt(row.total_assistant_messages, 10);
    const successRate = totalUserMessages > 0
        ? Math.min(100, (totalAssistantMessages / totalUserMessages) * 100)
        : null;

    return {
        totalConversations: parseInt(row.total_conversations, 10),
        activeUsers: parseInt(row.active_users, 10),
        messagesToday: parseInt(row.messages_today, 10),
        successRate,
    };
}

async function getRecentActivity(botId, limit = 5) {
    const result = await pool.query(
        `SELECT
       c.id,
       c.visitor_id,
       c.visitor_name,
       MAX(m.created_at) AS last_message_at,
       (
         SELECT content FROM messages
         WHERE conversation_id = c.id
         ORDER BY created_at DESC LIMIT 1
       ) AS last_message
     FROM conversations c
     JOIN messages m ON m.conversation_id = c.id
     WHERE c.bot_id = $1
     GROUP BY c.id
     ORDER BY MAX(m.created_at) DESC
     LIMIT $2`,
        [botId, limit]
    );
    return result.rows;
}

module.exports = {
    verifyBotOwnership,
    getConversationsForBot,
    getConversationCount,
    getMessagesForConversation,
    getBotStats,
    getRecentActivity,
};