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
            website,
            image
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
    website,
    image
}) => {

    const query = `
        INSERT INTO clients
        (
            name,
            workEmail,
            password,
            company,
            mobile_number,
            website,
            image
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7)
        RETURNING
            id,
            name,
            workEmail,
            company,
            mobile_number,
            website,
            image;
    `;

    const values = [
        name,
        workEmail,
        password,
        company,
        mobileNumber,
        website,
        image
    ];

    const result = await db.query(query, values);

    return result.rows[0];
};

const updateProfile = async (id, data) => {

    const query = `
UPDATE clients
SET
    name = COALESCE($1,name),
    mobile_number = COALESCE($2,mobile_number),
    website = COALESCE($3,website),
    company = COALESCE($4,company),
    image = COALESCE($5,image)
WHERE id=$6
RETURNING
    id,
    name,
    workEmail,
    mobile_number,
    company,
    website,
    image;
`;

    const values = [
        data.name,
        data.mobileNumber,
        data.website,
        data.company,
        data.image,
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