const url = 'wss://localhost:5005/'
const webSocket = new WebSocket(url)

const mainCont = document.getElementsByClassName("mainContainer")[0];
const serverVal = document.getElementsByClassName("serverInp")[0];
const channelVal = document.getElementsByClassName("channelInp")[0];
let serverList;
let channelList;

webSocket.onopen = () => {
    webSocket.send("WS message"); 
};
 
webSocket.onerror = (error) => {
    webSocket.log(JSON.parse(error));
};
 
webSocket.onmessage = (event) => {
  let data = JSON.parse(event.data);
  if (serverVal.id == data.server && channelVal.id == data.channel) {
    let timestamp = new Date(data.timestamp).toLocaleString();
  
    mainCont.innerHTML += `<p><small style="color:#bfbfbf;">${timestamp}</small> <strong style="color:${data.roleColor};">${data.authorName}:</strong> ${data.content}</p>`
  }
};


let serverShow = document.getElementsByClassName("showBtn")[0];
let channelShow = document.getElementsByClassName("showBtn")[1];

serverShow.addEventListener("click", () => {
  fetch(document.location + "/show/servers", {
    method: 'POST'
  }).then(resp => resp.json())
  .then(data => {
    let alertMsg = "DMs\n";
    
    for (let i = 0; i < data.length; i++) {
      alertMsg += `${data[i].guildName}\n`;
    }
    
    alert(alertMsg);
    serverList = data;
  });
});

channelShow.addEventListener("click", () => {
  if (!serverVal.id) return alert("Please input a server first.");
  
  fetch(document.location + `/show/channels/${serverVal.id}`, {
    method: 'POST'
  }).then(resp => resp.json())
  .then(data => {
    let alertMsg = "";
    
    for (let i = 0; i < data.length; i++) {
      alertMsg += `${data[i].channelName}\n`;
    }
    
    alert(alertMsg);
    
    channelList = data;
  })
});

serverVal.addEventListener("input", () => {
  if (serverList) {
  
    if (serlet.some(server => server.guildName == serverVal.value)) {
      for (let i = 0; i < serverList.length; i++) {
        if (serverList[i].guildName == serverVal.value) {
          serverVal.id = serverList[i].guildId;
          break;
        }
      } 
    }
    
  } else {
    fetch(document.location + "/show/servers", {
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
      for (let i = 0; i < channelList.length; i++) {
        if (channelList[i].channelName == channelVal.value) {
          channelVal.id = channelList[i].channelId;
          break;
        }
      }
    } else {
      fetch(document.location + `/show/channels/${serverVal.id}`, {
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

let postBtn = document.getElementById("enterMessage");

postBtn.addEventListener("keyup", (e) => {
    if (e.code == "Enter") {
      e.preventDefault();
      
      if (postBtn.value == "") return;
      
      if (serverVal.id && channelVal.id) {
        fetch(document.location + `/post/message/${serverVal.id}/${channelVal.id}`, {
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