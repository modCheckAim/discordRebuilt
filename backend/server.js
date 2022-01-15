const express = require("express");
const app = express();

app.use(express.json());
app.use("/src", express.static("./src/"))
var PORT = process.env.PORT || 5005;
var server = app.listen(PORT); 

const token = process.env.token;
const fetch = require('node-fetch');

const Client = require('./client');

const WebSocket = require('ws')

const wss = new WebSocket.Server({ server });

wss.on('connection', ws => {

  Client.on('message', msg => {
    ws.send(JSON.stringify({
      type: 'MESSAGE',
      content: msg.content,
      authorName: (msg.member ? (msg.member.nickname === null ? msg.author.username : msg.member.nickname) : msg.author.username),
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
  res.sendFile(process.cwd() + "/html/index.html"); 
    
  await Client.once('ready', () => {
    console.log('client ready!');
  });
})

const showRouter = require('./routes/show');
app.use("/show", showRouter);

app.post("/postMsg/:serverID/:channelID", (req, res) => {
    var ctx = Client.guilds.get(req.params.serverID).channels.get(req.params.channelID);
    
    ctx.send(req.body.content);
    res.send('Message sent.');
});

Client.login(token);