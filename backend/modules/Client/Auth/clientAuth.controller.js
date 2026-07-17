const clientModel = require("./clientAuth.model");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const config = require('../../../config/default');

exports.clientRegister = async (req, res, next) => {
    const { name, workEmail, password, mobileNumber, company, website } = req.body;
    try {
        if (!name || !workEmail || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, Work Email and Password are required."
            });
        }

        const existingAdmin = await clientModel.findByEmail(workEmail);

        if (existingAdmin) {
            return res.status(400).json({
                success: false,
                message: "Email is already registered."
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const image = req.file ? req.file.filename : null;

        const clientData = await clientModel.createClient({
            name,
            workEmail,
            password: hashedPassword,
            company,
            mobileNumber,
            website,
            image
        });

        res.status(201).json({
            success: true,
            message: "Account registered successfully.",
            data: clientData
        });

    } catch (err) {
        next(err)
    }
}

exports.clientLogin = async (req, res, next) => {

    const { workEmail, password } = req.body;

    try {

        const client = await clientModel.findByEmail(workEmail);

        if (!client) {
            return res.status(404).json({
                success: false,
                message: "Account not found"
            });
        }

        const passwordCheck = await bcrypt.compare(password, client.password);

        if (!passwordCheck) {
            return res.status(401).json({
                success: false,
                message: "Password mismatch"
            });
        }

        const token = jwt.sign(
            {
                id: client.id,
                name: client.name,
                email: client.workemail,
            },
            config.jwt_secret,
            { expiresIn: "1d" }
        );

        res.status(200).json({
            success: true,
            name: client.name,
            email: client.workemail,
            token
        });

    } catch (err) {
        next(err);
    }
};

exports.clientProfile = async (req, res, next) => {
    try {

        const userId = req.user.id;

        const client = await clientModel.findById(userId);

        if (!client) {
            return res.status(404).json({
                success: false,
                message: "Account not found"
            });
        }

        res.status(200).json({
            success: true,
            data: client
        });

    } catch (err) {
        next(err);
    }
};

exports.updateProfile = async (req, res, next) => {
    try {

        const userId = req.user.id;

        const {
            name,
            mobileNumber,
            company,
            website
        } = req.body;

        const client = await clientModel.findById(userId);

        if (!client) {
            return res.status(404).json({
                success: false,
                message: "Account not found"
            });
        }

        const image = req.file ? req.file.filename : null;

        const updatedClient = await clientModel.updateProfile(userId, {
            name,
            mobileNumber,
            company,
            website,
            image
        });

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: updatedClient
        });

    } catch (err) {
        next(err);
    }
};