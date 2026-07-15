const express = require("express");
const router = express.Router();

const { adminRegister, adminLogin } = require("./adminAuth.Controller");
const auth = require("../../../middleware/auth.middleware");
const { validate } = require("../../../middleware/validation.middleware");
const { registerValidation, loginValidation } = require("../../../utils/validators/adminAuth.validation");

router.post('/register', registerValidation, validate, adminRegister);
router.post('/login', loginValidation, validate, adminLogin);

module.exports = router;