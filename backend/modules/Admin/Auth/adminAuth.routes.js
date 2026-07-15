const express = require("express");
const router = express.Router();

const { adminRegister, adminLogin, adminProfile, updateProfile } = require("./adminAuth.Controller");
const auth = require("../../../middleware/auth.middleware");
const { validate } = require("../../../middleware/validation.middleware");
const { registerValidation, loginValidation, updateProfileValidation } = require("../../../utils/validators/adminAuth.validation");

router.post('/register', registerValidation, validate, adminRegister);
router.post('/login', loginValidation, validate, adminLogin);
router.get("/profile", auth, adminProfile);
router.patch(
    "/profile",
    auth,
    updateProfileValidation,
    validate,
    updateProfile
);

module.exports = router;