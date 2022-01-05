const Client = require('../client.js');
const { Router } = require('express');
const showRouter = Router();

showRouter.post("/channels/:serverID", (req, res) => {
    var channels = [];
    
    Client.guilds.get(req.params.serverID).channels.forEach(chan => {
      if (chan.type === "text") {
        channels.push({ serverId: chan.guild.id, channelId: chan.id, channelName: chan.name })
      }
    })

    res.send(channels);
});

showRouter.post("/servers", (req, res) => {
   var guilds = [];
     
   Client.guilds.forEach(guild => {
      guilds.push({ guildId: guild.id, guildName: guild.name });   
   });
   
   res.send(guilds);
});

module.exports = showRouter;