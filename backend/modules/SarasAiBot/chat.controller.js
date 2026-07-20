const chatModel = require('./chat.model');

async function sendMessage(req, res) {
    try {
        const { botId } = req.params;
        const { message, visitorId, conversationId, visitorInfo } = req.body;

        if (!message || !message.trim()) {
            return res.status(400).json({ error: 'Message is required' });
        }

        const bot = await chatModel.getActiveBotById(botId);
        if (!bot) return res.status(404).json({ error: 'Bot not found or inactive' });

        if (bot.require_contact_form && !conversationId && !visitorInfo) {
            return res.status(400).json({ error: 'Contact details are required before starting a chat' });
        }

        const conversation = await chatModel.getOrCreateConversation(
            botId,
            visitorId,
            conversationId,
            visitorInfo
        );
        const history = await chatModel.getRecentMessages(conversation.id);

        await chatModel.saveMessage(conversation.id, 'user', message);

        const systemPrompt = `${bot.system_instructions || `You are a helpful assistant for ${bot.name}.`}
Tone: ${bot.tone || 'friendly'}

Use the following information to answer questions. If the answer isn't in this information, say you don't know and offer to connect the visitor with the business directly.

---
${bot.knowledge_base || 'No knowledge base provided yet.'}
---`;

        const claudeMessages = [
            ...history.map(m => ({ role: m.role, content: m.content })),
            { role: 'user', content: message }
        ];

        const response = await fetch("https://api.anthropic.com/v1/messages", {
            method: "POST",
            headers: {
                "x-api-key": process.env.ANTHROPIC_API_KEY,
                "anthropic-version": "2023-06-01",
                "content-type": "application/json"
            },
            body: JSON.stringify({
                model: "claude-haiku-4-5-20251001",
                max_tokens: 500,
                system: systemPrompt,
                messages: claudeMessages
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('Claude API error:', data);
            return res.status(502).json({ error: 'Failed to get a response from the assistant' });
        }

        const reply = data.content[0].text;
        await chatModel.saveMessage(conversation.id, 'assistant', reply);

        res.json({ reply, conversationId: conversation.id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Something went wrong' });
    }
}

async function getPublicConfig(req, res) {
    const bot = await chatModel.getActiveBotById(req.params.botId);
    if (!bot) return res.status(404).json({ error: 'Bot not found' });

    const suggestions = typeof bot.suggestions === 'string' ? JSON.parse(bot.suggestions) : bot.suggestions;
    const contactFormFields = typeof bot.contact_form_fields === 'string'
        ? JSON.parse(bot.contact_form_fields)
        : bot.contact_form_fields;

    res.json({
        name: bot.name,
        welcomeMessage: bot.welcome_message,
        avatar: bot.avatar,
        accentColor: bot.accent_color,
        position: bot.widget_position,
        suggestions: suggestions || [],
        requireContactForm: bot.require_contact_form || false,
        contactFormFields: contactFormFields || ['name', 'email'],
    });
}

module.exports = { sendMessage, getPublicConfig };