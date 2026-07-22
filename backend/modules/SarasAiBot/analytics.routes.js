const express = require('express');
const router = express.Router();
const analyticsController = require('./analytics.controller');
const auth = require('../../middleware/auth.middleware');
const checkClientStatus = require("../../middleware/clientStatus.middleware");

router.get('/:botId/conversations', auth, checkClientStatus, analyticsController.listConversations);
router.get('/:botId/conversations/:conversationId', auth, checkClientStatus, analyticsController.getConversationMessages);
router.get('/:botId/stats', auth, checkClientStatus, analyticsController.getStats);
router.get('/:botId/recent-activity', auth, checkClientStatus, analyticsController.getRecentActivity);

module.exports = router;