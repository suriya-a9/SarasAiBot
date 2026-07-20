const analyticsModel = require('./analytics.model');

async function listConversations(req, res) {
    try {
        const { botId } = req.params;
        const clientId = req.user.id;

        if (!botId) {
            return res.status(400).json({ error: 'Bot ID is required' });
        }

        const owns = await analyticsModel.verifyBotOwnership(botId, clientId);
        if (!owns) return res.status(404).json({ error: 'Bot not found' });

        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 20;
        const offset = (page - 1) * limit;

        const [conversations, total] = await Promise.all([
            analyticsModel.getConversationsForBot(botId, { limit, offset }),
            analyticsModel.getConversationCount(botId),
        ]);

        res.json({
            conversations,
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch conversations' });
    }
}

async function getConversationMessages(req, res) {
    try {
        const { botId, conversationId } = req.params;
        const clientId = req.user.id;

        if (!botId) {
            return res.status(400).json({ error: 'Bot ID is required' });
        }

        const owns = await analyticsModel.verifyBotOwnership(botId, clientId);
        if (!owns) return res.status(404).json({ error: 'Bot not found' });

        const messages = await analyticsModel.getMessagesForConversation(conversationId, botId);
        if (messages.length === 0) {
            return res.status(404).json({ error: 'Conversation not found' });
        }

        res.json({ messages });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch conversation' });
    }
}

module.exports = { listConversations, getConversationMessages };