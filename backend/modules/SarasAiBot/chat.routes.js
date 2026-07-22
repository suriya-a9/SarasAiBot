const express = require('express');
const router = express.Router();
const chatController = require('./chat.controller');
const checkClientStatus = require("../../middleware/clientStatus.middleware");
const cors = require('cors');

router.use(cors());
router.post('/:botId/message', chatController.sendMessage);
router.get('/:botId/config', chatController.getPublicConfig);

module.exports = router;