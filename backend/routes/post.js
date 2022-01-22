const Client = require('../client.js');
const { Router } = require('express');
const postRouter = Router();

postRouter.post("/message/:serverID/:channelID", (req, res) => {
   const findServerAndChannel = Client.guilds.get(req.params.serverID).channels.get(req.params.channelID);
    
   findServerAndChannel.send(req.body.content);
   res.sendStatus(200);
});

module.exports = postRouter;