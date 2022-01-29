const express = require("express");
const app = express();

app.use(express.json());
app.use("/src", express.static("./src/"))
let PORT = process.env.PORT || 5005;
let server = app.listen(PORT); 

const TOKEN = process.env.token;
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
      channel: msg.channel.id,
      roleColor: (msg.member ? msg.member.displayHexColor : "#FFFFFF")
    }));  
  });
  
  ws.on('message', message => {
    console.log(message.toString('utf-8'));
  })
})

app.get("/", (req, res) => {
  res.sendFile(process.cwd() + "/html/index.html"); 
})

const showRouter = require('./routes/show');
app.use("/show", showRouter);
const postRouter = require('./routes/post');
app.use("/post", postRouter);

Client.login(TOKEN);
