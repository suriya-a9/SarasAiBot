const express = require('express');

const router = express.Router();

const { listClients, viewClient, updateClientStatus } = require("./clients.controller");
const { updateClientStatusValidation } = require("../../../utils/validators/adminClient.validation");
const { validate } = require("../../../middleware/validation.middleware");
const auth = require("../../../middleware/auth.middleware");

router.get('/clients', auth, listClients);
router.get("/clients/:id", auth, viewClient);
router.patch("/:id/status", auth, updateClientStatusValidation, validate, updateClientStatus);

module.exports = router;