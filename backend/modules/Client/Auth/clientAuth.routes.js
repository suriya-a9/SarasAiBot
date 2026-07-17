const express = require('express');
const router = express.Router();

const { clientRegister, clientLogin, clientProfile, updateProfile } = require("./clientAuth.controller");
const { validate } = require("../../../middleware/validation.middleware");
const auth = require("../../../middleware/auth.middleware");
const upload = require("../../../middleware/fileUpload");
const { registerValidation, loginValidation, updateProfileValidation } = require("../../../utils/validators/clientAuth.validation");

router.post(
    "/register",
    upload.single("image"),
    registerValidation,
    validate,
    clientRegister
);
router.post('/login', loginValidation, validate, clientLogin);
router.get('/profile', auth, clientProfile);
router.patch(
    "/profile",
    auth,
    upload.single("image"),
    updateProfileValidation,
    validate,
    updateProfile
);

module.exports = router;