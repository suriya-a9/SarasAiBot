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
    const query = `
        UPDATE clients
        SET status = $1
        WHERE id = $2
        RETURNING *
    `;

    const result = await db.query(query, [status, id]);

    return result.rows[0];
};

module.exports = {
    getAllClients,
    getClientById,
    updateClientStatus
};