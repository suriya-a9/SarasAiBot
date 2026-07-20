const express = require('express');
const router = express.Router();
const botController = require('./bot.controller');
const auth = require("../../middleware/auth.middleware");

router.use(auth);

router.post('/', botController.create);
router.get('/', botController.list);
router.get('/:botId', botController.getOne);
router.put('/:botId', botController.update);
router.delete('/:botId', botController.remove);

module.exports = router;