const AdminClientModel = require("./clients.model");

exports.listClients = async (req, res, next) => {
    try {
        const clientListData = await AdminClientModel.getAllClients();

        res.status(200).json({
            success: true,
            data: clientListData
        });
    } catch (err) {
        next(err);
    }
};

exports.viewClient = async (req, res, next) => {
    try {
        const { id } = req.params;

        const client = await AdminClientModel.getClientById(id);

        if (!client) {
            return res.status(404).json({
                success: false,
                message: "Client not found"
            });
        }

        res.status(200).json({
            success: true,
            data: client
        });
    } catch (err) {
        next(err);
    }
};

exports.updateClientStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const client = await AdminClientModel.updateClientStatus(id, status);

        if (!client) {
            return res.status(404).json({
                success: false,
                message: "Client not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Client status updated successfully",
            data: client
        });
    } catch (err) {
        next(err);
    }
};