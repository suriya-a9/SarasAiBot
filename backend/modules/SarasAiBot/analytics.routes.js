const express = require('express');
const router = express.Router();
const analyticsController = require('./analytics.controller');
const auth = require("../../middleware/auth.middleware");

router.use(auth);

router.get('/:botId/conversations', analyticsController.listConversations);
router.get('/:botId/conversations/:conversationId', analyticsController.getConversationMessages);

module.exports = router;