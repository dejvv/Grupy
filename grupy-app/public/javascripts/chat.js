$(function() {
    let socket = io.connect('http://localhost:8000');

    const message = $("#your-message-id");
    const username = "test";
    const send_message = $("#button-for-posting-msg");
    const send_username = $("#send_username");
    const chatroom = document.getElementById("chat-window");
    scrollToBottom(chatroom);

    const chat_id = document.getElementById("id_chat");
    const user_id = document.getElementById("id_user");
    const user_name = document.getElementById("name_user");

    // send message
    send_message.click(function () {
        if (message.val() == "")
            return;
        socket.emit('new_message', {message: message.val(), chat_id: chat_id.innerHTML, user_id: user_id.innerHTML, username: user_name.innerHTML});
        message.val("");
    });

    // listen for messages
    socket.on("incomming_messages", (data) => {
        //console.log("incoming_msg:", data);
        chatroom.innerHTML += gimmeChat(data.username, data.message);
        scrollToBottom(chatroom);
    })

    // change username
    send_username.click( function() {
        console.log(username.val());
        socket.emit('change_username', {username: username.val()});
    });
});

function scrollToBottom(element) {
    element.scrollTop = element.scrollHeight;
}

function gimmeChat(username, message) {
    return `<hr class="dropdown-divider"><div class="container is-fluid">
        <hr class="dropdown-divider">
        <div class="columns is-multiline">
            <div class="column is-one-fifth">
                <figure class="image is-32x32">
                    <img id="chat-user-0-profile-pic" src="https://bulma.io/images/placeholders/128x128.png" class="is-rounded">
                </figure>
                <p id="chat-user-0">` + username + `</p>
            </div>
            <div class="column is-four-fifth has-background-light">
                <p id="chat-user-0-msg">` + message + `</p>
            </div>
        </div>
    </div>`
}