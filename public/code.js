

(function () {
  const app = document.querySelector(".app");
  const socket = io();
  let uname;

  const joinButton = app.querySelector(".join-screen #join-user");
  const usernameInput = app.querySelector(".join-screen #username");
  const joinScreen = app.querySelector(".join-screen");
  const chatScreen = app.querySelector(".chat-screen");
  const sendButton = app.querySelector(".typebox #send-message");
  const msg = app.querySelector(".typebox #message-input");
  const messageContainer = app.querySelector(".chat-screen .messages");
  const exitButton = app.querySelector(".chat-screen #exit-chat");

  joinButton.addEventListener("click", () => {
    let username = usernameInput.value;
    if (username.length === 0) return;
    socket.emit("new user", username);
    uname = username;
    console.log("Switching screens");
    joinScreen.classList.remove("active");
    chatScreen.classList.add("active");

    sendButton.addEventListener("click", () => {
      let message = msg.value;
      if (message.length == 0) return;
      renderMessage("my", {
        username: username,
        text: message,
      });
      socket.emit("chat", {
        username: username,
        text: message,
      });
      msg.value = "";
    });

    exitButton.addEventListener("click", () => {
      socket.emit("exit user", uname);
      window.location.href = window.location.href;
    });

    function renderMessage(type, message) {
      if (type == "my") {
        let el = document.createElement("div");
        el.setAttribute("class", "message my-message");
        el.innerHTML = `
        <div>
         <div class="name">You</div>
         <div class="text">${message.text}</div>
        </div>
        `;
        messageContainer.appendChild(el);
      } else if (type == "other") {
        let el = document.createElement("div");
        el.setAttribute("class", "message other-message");
        el.innerHTML = `
        <div>
         <div class="name">${message.username}</div>
         <div class="text">${message.text}</div>
        </div>
        `;
        messageContainer.appendChild(el);
      } else if (type == "update") {
        let el = document.createElement("div");
        el.setAttribute("class", "update");
        el.innerText = message;
        messageContainer.appendChild(el);
      }
      // crooll chat to end
      messageContainer.scrollTop =
        messageContainer.scrollHeight - messageContainer.clientHeight;
    }

    socket.on("update", (update) => {
      renderMessage("update", update);
    });
    socket.on("chat", (message) => {
      // Check if the message is sent by the current user
      if (message.username !== uname) {
        renderMessage("other", message);
      }
    });
    
  });
})();
