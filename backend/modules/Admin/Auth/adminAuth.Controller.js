const AdminModel = require("./adminAuth.model");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const config = require("../../../config/default");

exports.adminRegister = async (req, res, next) => {

    const { name, email, password, role, mobileNumber, gender } = req.body;

    try {
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, Email and Password are required."
            });
        }

        const existingAdmin = await AdminModel.findByEmail(email);

        if (existingAdmin) {
            return res.status(400).json({
                success: false,
                message: "Email is already registered."
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const adminData = await AdminModel.createAdmin({
            name,
            email,
            password: hashedPassword,
            role,
            mobileNumber,
            gender
        });

        res.status(201).json({
            success: true,
            message: "Admin registered successfully.",
            data: adminData
        });

    } catch (err) {
        next(err);
    }
};

exports.adminLogin = async (req, res, next) => {

    const { email, password } = req.body;

    try {

        const admin = await AdminModel.findByEmail(email);

        if (!admin) {
            return res.status(404).json({
                success: false,
                message: "Account not found"
            });
        }

        const passwordCheck = await bcrypt.compare(password, admin.password);

        if (!passwordCheck) {
            return res.status(401).json({
                success: false,
                message: "Password mismatch"
            });
        }

        const token = jwt.sign(
            {
                id: admin.id,
                name: admin.name,
                email: admin.email,
                role: admin.role
            },
            config.jwt_secret,
            { expiresIn: "1d" }
        );

        res.status(200).json({
            success: true,
            name: admin.name,
            email: admin.email,
            role: admin.role,
            token
        });

    } catch (err) {
        next(err);
    }
};

exports.adminProfile = async (req, res) => {

}