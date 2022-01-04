const url = 'wss://localhost:5005/'
const webSocket = new WebSocket(url)

var mainCont = document.getElementsByClassName("mainContainer")[0];
var serverVal = document.getElementsByClassName("serverInp")[0];
var channelVal = document.getElementsByClassName("channelInp")[0];
var serverList;
var channelList;

webSocket.onopen = () => {
    webSocket.send("WS message"); 
};
 
webSocket.onerror = (error) => {
    webSocket.log(JSON.parse(error));
};
 
webSocket.onmessage = (event) => {
  var data = JSON.parse(event.data);
  if (serverVal.id == data.server && channelVal.id == data.channel) {
    var timestamp = new Date(data.timestamp).toLocaleString();
  
    mainCont.innerHTML += `<p><small style="color:#bfbfbf;">${timestamp}</small> ${data.author}: ${data.content}</p>`
  }
};


var serverShow = document.getElementsByClassName("showBtn")[0];
var channelShow = document.getElementsByClassName("showBtn")[1];

serverShow.addEventListener("click", () => {
  fetch(document.location + "/showServers", {
    method: 'POST'
  }).then(resp => resp.json())
  .then(data => {
    var alertMsg = "DMs\n";
    
    for (var i = 0; i < data.length; i++) {
      alertMsg += `${data[i].guildName}\n`;
    }
    
    alert(alertMsg);
    serverList = data;
  });
});

channelShow.addEventListener("click", () => {
  if (!serverVal.id) return alert("Please input a server first.");
  
  fetch(document.location + `showChannels/${serverVal.id}`, {
    method: 'POST'
  }).then(resp => resp.json())
  .then(data => {
    var alertMsg = "";
    
    for (var i = 0; i < data.length; i++) {
      alertMsg += `${data[i].channelName}\n`;
    }
    
    alert(alertMsg);
    
    channelList = data;
  })
});

serverVal.addEventListener("input", () => {
  if (serverList) {
  
    if (serverList.some(server => server.guildName == serverVal.value)) {
      for (var i = 0; i < serverList.length; i++) {
        if (serverList[i].guildName == serverVal.value) {
          serverVal.id = serverList[i].guildId;
          break;
        }
      } 
    }
    
  } else {
    fetch(document.location + "/showServers", {
    method: 'POST'
    }).then(resp => resp.json())
    .then(data => {
      serverList = data;
    });
  }
});

channelVal.addEventListener("input", () => {
  if (serverVal.value) {
    if (channelList && channelList[0].serverId == serverVal.id) {
      for (var i = 0; i < channelList.length; i++) {
        if (channelList[i].channelName == channelVal.value) {
          channelVal.id = channelList[i].channelId;
          break;
        }
      }
    } else {
      fetch(document.location + `/showChannels/${serverVal.id}`, {
        method: 'POST'
      }).then(resp => resp.json())
      .then(data => {
        channelList = data;
      })      
    }
  } else {
    alert("Please input a server first.");
  }
});

var postBtn = document.getElementById("enterMessage");

postBtn.addEventListener("keyup", (e) => {
    if (e.code == "Enter") {
      e.preventDefault();
      
      if (postBtn.value == "") return;
      
      if (serverVal.id && channelVal.id) {
        fetch(document.location + `/postMsg/${serverVal.id}/${channelVal.id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ content: postBtn.value })
        }).then(resp => resp.json())
        .then(data => {
          console.log(data);
        })
        
      postBtn.value = "";
      } else {
        alert("You need a valid server or channel input. Click on 'Show List' to see a list of channels/servers.");
      }
    }
});