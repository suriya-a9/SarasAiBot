const pool = require('../../config/db');

async function createBot({
    clientId,
    name,
    tone,
    language,
    systemInstructions,
    knowledgeBase,
    welcomeMessage,
    avatar,
    accentColor,
    widgetPosition,
    suggestions,
    requireContactForm,
    contactFormFields,
}) {
    const result = await pool.query(
        `INSERT INTO bots (
       client_id, name, tone, language, system_instructions, knowledge_base,
       welcome_message, avatar, accent_color, widget_position, suggestions,
       require_contact_form, contact_form_fields
     )
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
     RETURNING *`,
        [
            clientId,
            name,
            tone,
            language,
            systemInstructions,
            knowledgeBase,
            welcomeMessage,
            avatar,
            accentColor,
            widgetPosition,
            JSON.stringify(suggestions || []),
            requireContactForm || false,
            JSON.stringify(contactFormFields || ["name", "email"]),
        ]
    );
    return result.rows[0];
}

async function getBotsByClient(clientId) {
    const result = await pool.query(
        `SELECT * FROM bots WHERE client_id = $1 ORDER BY created_at DESC`,
        [clientId]
    );
    return result.rows;
}

async function getBotById(botId, clientId) {
    const result = await pool.query(
        `SELECT * FROM bots WHERE id = $1 AND client_id = $2`,
        [botId, clientId]
    );
    return result.rows[0];
}

async function updateBot(botId, clientId, fields) {
    const {
        name,
        tone,
        language,
        systemInstructions,
        knowledgeBase,
        isActive,
        welcomeMessage,
        avatar,
        accentColor,
        widgetPosition,
        suggestions,
        requireContactForm,
        contactFormFields,
    } = fields;

    const result = await pool.query(
        `UPDATE bots SET
       name = COALESCE($1, name),
       tone = COALESCE($2, tone),
       language = COALESCE($3, language),
       system_instructions = COALESCE($4, system_instructions),
       knowledge_base = COALESCE($5, knowledge_base),
       is_active = COALESCE($6, is_active),
       welcome_message = COALESCE($7, welcome_message),
       avatar = COALESCE($8, avatar),
       accent_color = COALESCE($9, accent_color),
       widget_position = COALESCE($10, widget_position),
       suggestions = COALESCE($11, suggestions),
       require_contact_form = COALESCE($12, require_contact_form),
       contact_form_fields = COALESCE($13, contact_form_fields),
       updated_at = NOW()
     WHERE id = $14 AND client_id = $15
     RETURNING *`,
        [
            name,
            tone,
            language,
            systemInstructions,
            knowledgeBase,
            isActive,
            welcomeMessage,
            avatar,
            accentColor,
            widgetPosition,
            suggestions ? JSON.stringify(suggestions) : null,
            typeof requireContactForm === "boolean" ? requireContactForm : null,
            contactFormFields ? JSON.stringify(contactFormFields) : null,
            botId,
            clientId,
        ]
    );
    return result.rows[0];
}

async function deleteBot(botId, clientId) {
    await pool.query(`DELETE FROM bots WHERE id = $1 AND client_id = $2`, [botId, clientId]);
}

module.exports = { createBot, getBotsByClient, getBotById, updateBot, deleteBot };