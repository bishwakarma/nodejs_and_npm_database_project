$(() => {
    console.log('loaded');

    //Setting up connection between a server and a client.
    var socket = io();
    //Register a message event with a addMessage function.
    socket.on('message', addMessage)
    getMessages();

    $("#send").click(() => {
        var message = { name: $("#name").val(), message: $("#message").val() };
        //Pass the message
        postMessage(message);
    });
});

//Function to add messages to the server
function postMessage(message){
    $.post('http://localhost:3000/messages', message);
}

function addMessage(message){
    //Uning JS template literals. Calling name and message property in this function.
    $("#messages").append(`<h4> ${message.name} </h4> <p>${message.message}</p>`);
}

// Function for clients to get the messages using ajax.
function getMessages(){
    //Calling the get request method using jQuery from the url and passing the data to the console.
    $.get('http://localhost:3000/messages', (data) => {
        data.forEach(element => {
            //call add message method
            addMessage(element);
        });
    });
}