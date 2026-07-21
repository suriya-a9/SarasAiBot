const analyticsModel = require('./analytics.model');

async function listConversations(req, res) {
    try {
        const { botId } = req.params;
        const clientId = req.user.id;

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

async function getStats(req, res) {
    try {
        const { botId } = req.params;
        const clientId = req.user.id;

        const owns = await analyticsModel.verifyBotOwnership(botId, clientId);
        if (!owns) return res.status(404).json({ error: 'Bot not found' });

        const stats = await analyticsModel.getBotStats(botId);
        res.json(stats);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch stats' });
    }
}

async function getRecentActivity(req, res) {
    try {
        const { botId } = req.params;
        const clientId = req.user.id;

        const owns = await analyticsModel.verifyBotOwnership(botId, clientId);
        if (!owns) return res.status(404).json({ error: 'Bot not found' });

        const limit = parseInt(req.query.limit, 10) || 5;
        const activity = await analyticsModel.getRecentActivity(botId, limit);

        const TEN_MINUTES = 10 * 60 * 1000;
        const now = Date.now();
        const withStatus = activity.map((c) => ({
            ...c,
            status: now - new Date(c.last_message_at).getTime() < TEN_MINUTES ? 'Active' : 'Completed',
        }));

        res.json({ activity: withStatus });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch recent activity' });
    }
}

module.exports = { listConversations, getConversationMessages, getStats, getRecentActivity };