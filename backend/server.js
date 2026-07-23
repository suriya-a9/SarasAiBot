require("dotenv").config();
const express = require("express");
const app = express();
const config = require("./config/default");
const logger = require("./logger");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const adminAuthRoutes = require("./modules/Admin/Auth/adminAuth.routes");
const clientAuthRoutes = require("./modules/Client/Auth/clientAuth.routes");
const sarasBotRoutes = require("./modules/SarasAiBot/bot.routes");
const sarasBotChatRoutes = require("./modules/SarasAiBot/chat.routes");
const adminClient = require("./modules/Admin/clients/clients.routes");
const adminBots = require("./modules/Admin/Bots/bots.routes");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));
app.use(express.static('public'));

app.use(cors());
app.use(helmet());
app.set("trust proxy", true);

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 1000,
    message: "Request limit reached. Please try again later.",
});

app.use("/api/adminAuth", adminAuthRoutes);
app.use("/api/clientAuth", clientAuthRoutes);
app.use("/api/bots", sarasBotRoutes);
app.use("/api/chat", sarasBotChatRoutes);
app.use('/api/bots', require('./modules/SarasAiBot/analytics.routes'));
app.use('/api/admin', adminClient);
app.use('/api/admin', adminBots);

app.use((err, req, res, next) => {
    logger.error(err.stack);
    res.status(err.status || 500).json({
        message: err.message || "internal server error",
    });
});

const PORT = config.port
app.listen(PORT, "0.0.0.0", () => {
    logger.info(`Server running on ${PORT} and 0.0.0.0`);
});