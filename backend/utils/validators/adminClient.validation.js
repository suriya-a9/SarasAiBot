const { body, param } = require("express-validator");

exports.updateClientStatusValidation = [
    param("id")
        .isInt()
        .withMessage("Invalid client id"),

    body("status")
        .notEmpty()
        .withMessage("Status is required")
        .bail()
        .isIn(["Active", "Inactive"])
        .withMessage("Invalid status")
];