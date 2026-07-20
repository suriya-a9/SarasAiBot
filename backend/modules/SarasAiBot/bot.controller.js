const botModel = require('./bot.model');

async function create(req, res) {
    try {
        const clientId = req.user.id;
        const {
            name,
            tone,
            language,
            systemInstructions,
            knowledgeBase,
            welcomeMessage,
            avatar,
            accentColor,
            widgetPosition,
            suggestions,
            requireContactForm,
            contactFormFields,
        } = req.body;

        if (!name) return res.status(400).json({ error: 'Bot name is required' });

        const bot = await botModel.createBot({
            clientId,
            name,
            tone,
            language,
            systemInstructions,
            knowledgeBase,
            welcomeMessage,
            avatar,
            accentColor,
            widgetPosition,
            suggestions,
            requireContactForm,
            contactFormFields,
        });

        res.status(201).json(bot);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create bot' });
    }
}

async function list(req, res) {
    try {
        const bots = await botModel.getBotsByClient(req.user.id);
        res.json(bots);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch bots' });
    }
}

async function getOne(req, res) {
    try {
        const bot = await botModel.getBotById(req.params.botId, req.user.id);
        if (!bot) return res.status(404).json({ error: 'Bot not found' });
        res.json(bot);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch bot' });
    }
}

async function update(req, res) {
    try {
        const {
            name,
            tone,
            language,
            systemInstructions,
            knowledgeBase,
            isActive,
            welcomeMessage,
            avatar,
            accentColor,
            widgetPosition,
            suggestions,
            requireContactForm,
            contactFormFields,
        } = req.body;

        const bot = await botModel.updateBot(req.params.botId, req.user.id, {
            name,
            tone,
            language,
            systemInstructions,
            knowledgeBase,
            isActive,
            welcomeMessage,
            avatar,
            accentColor,
            widgetPosition,
            suggestions,
            requireContactForm,
            contactFormFields,
        });

        if (!bot) return res.status(404).json({ error: 'Bot not found' });
        res.json(bot);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update bot' });
    }
}

async function remove(req, res) {
    try {
        await botModel.deleteBot(req.params.botId, req.user.id);
        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete bot' });
    }
}

module.exports = { create, list, getOne, update, remove };