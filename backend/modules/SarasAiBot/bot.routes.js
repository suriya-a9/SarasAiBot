const express = require('express');
const router = express.Router();
const botController = require('./bot.controller');
const auth = require("../../middleware/auth.middleware");
const checkClientStatus = require("../../middleware/clientStatus.middleware");

router.post('/', auth, checkClientStatus, botController.create);
router.get('/', auth, checkClientStatus, botController.list);
router.get('/:botId', auth, checkClientStatus, botController.getOne);
router.put('/:botId', auth, checkClientStatus, botController.update);
router.delete('/:botId', auth, checkClientStatus, botController.remove);

module.exports = router;