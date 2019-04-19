//make a connection
var socket = io.connect("http://localhost:3000");
var sendButton = $("span#sendBtn");
var messageBox = $("#message");
var inbox = $("#inbox");
var usernameField = $("#username");
var username = null;
var startChatBtn = $("#startChatBtn");
var preChatDiv = $("#pre-chat");

$(function(){
    usernameField.keypress(e => {
        let key = e.which;
        if(key === 13) {
            startChatBtn.click();
        }
    });
    messageBox.keypress(function (e) {
        var key = e.which;
        if(key == 13)  // the enter key code
         {
            sendButton.click();
            
         }
         
       });
    
    //append new messages to the chatbox   
        socket.on("new_message", data => {
            inbox.append(`<span class="receivedMsg">${data.message}</span>`);
            if(inbox.height() >= 250) {
                inbox.stop().animate({ scrollTop: inbox[0].scrollHeight}, 1000);
            }
        });
});

function sendMessage(){
    if(messageBox.val().toString().trim().length > 0) {
        socket.emit("new_message", {message: messageBox.val(), username: username});
        inbox.append(`<span class="sentMsg">${messageBox.val()}</span>`);
        if(inbox.height() >= 250) {
            inbox.stop().animate({ scrollTop: inbox[0].scrollHeight}, 1000);
        }
    }
    messageBox.val("");
}

function startChat(){
    username = usernameField.val();
    socket.emit("username", {username: username});
    preChatDiv.addClass("disappear");
    setTimeout(() => {
        preChatDiv.remove();
    }, 1000);
    $("#messageField").show();
}