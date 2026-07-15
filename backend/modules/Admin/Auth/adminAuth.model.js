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

module.exports = {
    findByEmail,
    createAdmin
};