const { body } = require("express-validator");

const personalEmailDomains = [
    "gmail.com",
    "yahoo.com",
    "hotmail.com",
    "outlook.com",
    "live.com",
    "icloud.com",
    "aol.com",
    "proton.me",
    "protonmail.com",
    "zoho.com",
    "yandex.com",
    "mail.com",
    "gmx.com",
    "rediffmail.com"
];

exports.registerValidation = [
    body("name")
        .notEmpty()
        .withMessage("Name is required"),

    body("workEmail")
        .isEmail()
        .withMessage("Valid email is required")
        .bail()
        .custom((email) => {
            const domain = email.split("@")[1].toLowerCase();

            if (personalEmailDomains.includes(domain)) {
                throw new Error(
                    "Please use your company/business email address"
                );
            }

            return true;
        }),

    body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters"),

    body("mobileNumber")
        .optional()
        .isMobilePhone()
        .withMessage("Invalid mobile number"),

    body("company")
        .notEmpty()
        .withMessage('Company name is required'),

    body("website")
        .notEmpty()
        .withMessage('Website is required')
];

exports.loginValidation = [
    body("workEmail")
        .notEmpty()
        .withMessage('Work Email is required')
        .bail()
        .isEmail()
        .withMessage("Valid email is required"),
    // .bail()
    // .custom((email) => {
    //     const domain = email.split("@")[1].toLowerCase();

    //     if (personalEmailDomains.includes(domain)) {
    //         throw new Error(
    //             "Please use your company/business email address"
    //         );
    //     }

    //     return true;
    // }),

    body("password")
        .notEmpty()
        .withMessage('Password is required')
        .bail()
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters"),
]

exports.updateProfileValidation = [

    body("name")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Name cannot be empty"),

    body("mobileNumber")
        .optional()
        .isMobilePhone("any")
        .withMessage("Invalid mobile number"),

    body("webiste")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Website cannot be empty"),

    body("company")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Company cannot be empty"),
];