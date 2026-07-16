const db = require("../../../config/db");

const findByEmail = async (email) => {
    const query = `
        SELECT *
        FROM clients
        WHERE workEmail = $1
    `;

    const result = await db.query(query, [email]);
    return result.rows[0];
};

const findById = async (id) => {

    const query = `
        SELECT
            id,
            name,
            workEmail,
            mobile_number,
            company,
            website
        FROM clients
        WHERE id = $1
    `;

    const result = await db.query(query, [id]);

    return result.rows[0];
};

const createClient = async ({
    name,
    workEmail,
    password,
    company,
    mobileNumber,
    website
}) => {

    const query = `
        INSERT INTO clients
        (
            name,
            workEmail,
            password,
            company,
            mobile_number,
            website
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id, name, workEmail, company, mobile_number, website;
    `;

    const values = [
        name,
        workEmail,
        password,
        company,
        mobileNumber,
        website
    ];

    const result = await db.query(query, values);

    return result.rows[0];
};

const updateProfile = async (id, data) => {

    const query = `
    UPDATE clients
    SET
        name = COALESCE($1, name),
        mobile_number = COALESCE($2, mobile_number),
        website = COALESCE($3, website),
        company = COALESCE($4, company)
    WHERE id = $5
    RETURNING
        id,
        name,
        workemail,
        website,
        mobile_number,
        company;
`;

    const values = [
        data.name,
        data.mobileNumber,
        data.website,
        data.company,
        id
    ];

    const result = await db.query(query, values);

    return result.rows[0];
};

module.exports = {
    findByEmail,
    findById,
    createClient,
    updateProfile
}