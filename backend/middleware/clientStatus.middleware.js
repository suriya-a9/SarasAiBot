const clientModel = require("../modules/Client/Auth/clientAuth.model");

const checkClientStatus = async (req, res, next) => {
    try {
        const clientId = req.user.id;

        const client = await clientModel.findById(clientId);

        if (!client) {
            return res.status(404).json({
                success: false,
                message: "Client not found."
            });
        }

        if (client.status !== "Active") {
            return res.status(403).json({
                success: false,
                message: "Your account is inactive. Please contact the administrator."
            });
        }

        next();
    } catch (err) {
        next(err);
    }
};

module.exports = checkClientStatus;