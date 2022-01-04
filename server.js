const express = require("express");
const app = express();

app.use(express.json());
app.use("/src", express.static("./src/"))
var PORT = process.env.PORT || 5005;
var server = app.listen(PORT); 

const token = process.env.token;
const Discord = require('discord.js');
const client = new Discord.Client();
const fetch = require('node-fetch');

const WebSocket = require('ws')

const wss = new WebSocket.Server({ server });

wss.on('connection', ws => {

  client.on('message', msg => {
    ws.send(JSON.stringify({
      type: 'MESSAGE',
      content: msg.content,
      author: msg.author.username,
      authorId: msg.author.id,
      timestamp: msg.createdTimestamp,
      server: (msg.guild ? msg.guild.id : "DM"),
      channel: msg.channel.id
    }));  
  });
  
  ws.on('message', message => {
    console.log(message.toString('utf-8'));
  })
})

app.get("/", (req, res) => {
    client.once('ready', () => {
      res.sendFile(__dirname + "/html/index.html");
    })  
})

app.post("/showServers", (req, res) => { 
   var guilds = [];
     
   client.guilds.forEach(guild => {
      guilds.push({ guildId: guild.id, guildName: guild.name });   
   });
   
   res.send(guilds);
});

app.post("/showChannels/:serverID", (req, res) => {
    var channels = [];
    
    client.guilds.get(req.params.serverID).channels.forEach(chan => {
      if (chan.type === "text") {
        channels.push({ serverId: chan.guild.id, channelId: chan.id, channelName: chan.name })
      }
    })

    res.send(channels);
})

app.post("/postMsg/:serverID/:channelID", (req, res) => {
    var ctx = client.guilds.get(req.params.serverID).channels.get(req.params.channelID);
    
    ctx.send(req.body.content);
    res.send('Message sent.');
});

client.login(token);