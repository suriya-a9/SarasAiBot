const { body } = require("express-validator");

exports.registerValidation = [
    body("name")
        .notEmpty()
        .withMessage("Name is required"),

    body("email")
        .isEmail()
        .withMessage("Valid email is required"),

    body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters"),

    body("mobileNumber")
        .optional()
        .isMobilePhone()
        .withMessage("Invalid mobile number"),

    body("role")
        .notEmpty()
        .withMessage('Role is required')
        .bail()
        .isIn(["Admin", "SuperAdmin", "Manager"])
        .withMessage("Invalid role"),

    body("gender")
        .notEmpty()
        .withMessage('Gender is required')
];

exports.loginValidation = [
    body("email")
        .notEmpty()
        .withMessage('Email is required')
        .bail()
        .isEmail()
        .withMessage("Valid email is required"),

    body("password")
        .notEmpty()
        .withMessage('Password is required')
        .bail()
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters"),
]