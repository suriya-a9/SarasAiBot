const db = require("../../../config/db");

const findByEmail = async (email) => {
    const query = `
        SELECT *
        FROM admins
        WHERE email = $1
    `;

    const result = await db.query(query, [email]);
    return result.rows[0];
};

const findById = async (id) => {

    const query = `
        SELECT
            id,
            name,
            email,
            role,
            gender,
            mobile_number
        FROM admins
        WHERE id = $1
    `;

    const result = await db.query(query, [id]);

    return result.rows[0];
};

const createAdmin = async ({
    name,
    email,
    password,
    role,
    mobileNumber,
    gender
}) => {

    const query = `
        INSERT INTO admins
        (
            name,
            email,
            password,
            role,
            mobile_number,
            gender
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id, name, email, role, mobile_number, gender;
    `;

    const values = [
        name,
        email,
        password,
        role,
        mobileNumber,
        gender
    ];

    const result = await db.query(query, values);

    return result.rows[0];
};

const updateProfile = async (id, data) => {

    const query = `
    UPDATE admins
    SET
        name = COALESCE($1, name),
        mobile_number = COALESCE($2, mobile_number),
        gender = COALESCE($3, gender)
    WHERE id = $4
    RETURNING
        id,
        name,
        email,
        role,
        mobile_number,
        gender;
`;

    const values = [
        data.name,
        data.mobileNumber,
        data.gender,
        id
    ];

    const result = await db.query(query, values);

    return result.rows[0];
};

module.exports = {
    findByEmail,
    findById,
    createAdmin,
    updateProfile
};