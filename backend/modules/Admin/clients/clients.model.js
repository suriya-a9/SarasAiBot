const db = require("../../../config/db");

const getAllClients = async () => {
    const result = await db.query("SELECT * FROM clients");
    return result.rows;
};

const getClientById = async (id) => {
    const query = `
        SELECT
            c.id,
            c.name,
            c.workEmail,
            c.mobile_number,
            c.company,
            c.website,
            c.image,
            c.status,
            b.id AS bot_id,
            b.name AS bot_name,
            b.tone AS bot_tone,
            b.language AS bot_language,
            b.system_instructions AS bot_system_instructions,
            b.knowledge_base AS bot_knowledge_base,
            b.is_active AS bot_is_active,
            b.welcome_message AS bot_welcome_message,
            b.avatar AS bot_avatar,
            b.accent_color AS bot_accent_color,
            b.widget_position AS bot_widget_position,
            b.suggestions AS bot_suggestions,
            b.require_contact_form AS bot_require_contact_form,
            b.contact_form_fields AS bot_contact_form_fields,
            b.created_at AS bot_created_at,
            b.updated_at AS bot_updated_at
        FROM clients c
        LEFT JOIN bots b ON b.client_id = c.id
        WHERE c.id = $1
        ORDER BY b.created_at DESC
        LIMIT 1
    `;

    const result = await db.query(query, [id]);

    if (!result.rows[0]) {
        return null;
    }

    const row = result.rows[0];
    const client = {
        id: row.id,
        name: row.name,
        workEmail: row.workemail,
        mobile_number: row.mobile_number,
        company: row.company,
        website: row.website,
        image: row.image,
        status: row.status
    };

    if (row.bot_id) {
        client.bot = {
            id: row.bot_id,
            name: row.bot_name,
            tone: row.bot_tone,
            language: row.bot_language,
            system_instructions: row.bot_system_instructions,
            knowledge_base: row.bot_knowledge_base,
            is_active: row.bot_is_active,
            welcome_message: row.bot_welcome_message,
            avatar: row.bot_avatar,
            accent_color: row.bot_accent_color,
            widget_position: row.bot_widget_position,
            suggestions: row.bot_suggestions,
            require_contact_form: row.bot_require_contact_form,
            contact_form_fields: row.bot_contact_form_fields,
            created_at: row.bot_created_at,
            updated_at: row.bot_updated_at
        };
    } else {
        client.bot = null;
    }

    return client;
};

const updateClientStatus = async (id, status) => {
    const pgClient = await db.connect();
    try {
        await pgClient.query('BEGIN');

        const clientResult = await pgClient.query(
            `UPDATE clients SET status = $1 WHERE id = $2 RETURNING *`,
            [status, id]
        );

        if (!clientResult.rows[0]) {
            await pgClient.query('ROLLBACK');
            return null;
        }

        const botIsActive = status === 'Active';
        await pgClient.query(
            `UPDATE bots SET is_active = $1, updated_at = NOW() WHERE client_id = $2`,
            [botIsActive, id]
        );

        await pgClient.query('COMMIT');
        return clientResult.rows[0];
    } catch (err) {
        await pgClient.query('ROLLBACK');
        throw err;
    } finally {
        pgClient.release();
    }

};

const getClientsCount = async () => {
    const result = await db.query(`
        SELECT COUNT(*) AS total
        FROM clients
    `);

    return Number(result.rows[0].total);
};

const getBotsCount = async () => {
    const result = await db.query(`
        SELECT COUNT(*) AS total
        FROM bots
    `);

    return Number(result.rows[0].total);
};

const getActiveBotsCount = async () => {
    const result = await db.query(`
        SELECT COUNT(*) AS total
        FROM bots
        WHERE is_active = true
    `);

    return Number(result.rows[0].total);
};

const getNewClientsCount = async (days = 7) => {
    const result = await db.query(
        `
        SELECT COUNT(*) AS total
        FROM clients
        WHERE created_at >= NOW() - ($1 || ' days')::interval
    `,
        [days]
    );

    return Number(result.rows[0].total);
};

const getMessagesTodayCount = async () => {
    const result = await db.query(`
        SELECT COUNT(*) AS total
        FROM messages
        WHERE role = 'user' AND created_at::date = CURRENT_DATE
    `);

    return Number(result.rows[0].total);
};

const getActiveEndUsersCount = async (days = 30) => {
    const result = await db.query(
        `
        SELECT COUNT(DISTINCT c.visitor_id) AS total
        FROM conversations c
        JOIN messages m ON m.conversation_id = c.id
        WHERE m.created_at >= NOW() - ($1 || ' days')::interval
    `,
        [days]
    );

    return Number(result.rows[0].total);
};

module.exports = {
    getAllClients,
    getClientById,
    updateClientStatus,
    getClientsCount,
    getBotsCount,
    getActiveBotsCount,
    getNewClientsCount,
    getMessagesTodayCount,
    getActiveEndUsersCount,
};