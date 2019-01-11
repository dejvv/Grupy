$(function() {
    let socket = io.connect('http://localhost:8000');

    const message = $("#message");
    const username = $("#username");
    const send_message = $("#send_message");
    const send_username = $("#send_username");
    const chatroom = $("#chatroom");

    // send message
    send_message.click(function () {
        socket.emit('new_message', {message: message.val()});
    });

    // listen for messages
    socket.on("incomming_messages", (data) => {
        console.log(data);
        chatroom.append("<p class='message'>" + data.username + ":" + data.message + "</p>");
    })

    // change username
    send_username.click( function() {
        console.log(username.val());
        socket.emit('change_username', {username: username.val()});
    });
});