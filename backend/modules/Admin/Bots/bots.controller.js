const botModel = require("./bots.model");

async function list(req, res) {
    try {
        const bots = await botModel.getAllClients();
        res.json({
            success: true,
            data: bots,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Failed to fetch bots' });
    }
}

const viewBot = async (req, res, next) => {
    try {
        const { id } = req.params;

        const bot = await botModel.getBotById(id);

        if (!bot) {
            return res.status(404).json({
                success: false,
                message: "Bot not found"
            });
        }

        res.status(200).json({
            success: true,
            data: bot
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    list,
    viewBot
}