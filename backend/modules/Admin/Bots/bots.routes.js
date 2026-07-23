const express = require('express');
const router = express.Router();

const auth = require("../../../middleware/auth.middleware");
const { list, viewBot } = require("./bots.controller");

router.get('/bots', auth, list);
router.get('/bots/:id', auth, viewBot);

module.exports = router;