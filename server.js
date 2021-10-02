var express = require('express');
//This is how express reads json out of the body
var bodyPraser = require('body-parser');

var app = express();

app.use(express.static(__dirname)); //Serve html code

//Telling body-parser to use json coding
app.use(bodyPraser.json());
app.use(bodyPraser.urlencoded({extended: false}));

//Created new server http and passed in the app
var http = require('http').Server(app);
//Will be listening with http instead of app
var io = require('socket.io')(http);
//Call and require mongoose package.
var mongoose = require('mongoose');
//Connection string to the database
var dbUrl = 'mongodb+srv://user:user@cluster0.r0wk0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
//Created entity of a message
var Message = mongoose.model('Message', {
    name: String,
    message: String
});

//if the HTTPGET request comes for the messages in the messages folder. Listening for GET
app.get('/messages', (req, res) =>{
    //Query from the mongoDB
    Message.find({},(err,messages) =>{
        res.send(messages);
    });
 });

//Listen for the POST. Add msg to the DB
app.post('/messages', (req, res) =>{
    //Runs on a server.
    //When post req is sent, grab json from the body
    var message = new Message(req.body);
    //Pass the function to the save method
    message.save((err) =>{
        if(err){
            sendStatus(500);
        } else{
            io.emit('message', req.body);
            res.sendStatus(200);
        }
    });
});

//Check for a connection
io.on('connection', (socket)=>{
    console.log('User Connected')
});

//Connect to mongoose
mongoose.connect(dbUrl, (err)=>{
    //log out mongodb connection or the error msg
    console.log('mongodb connection', err);
});

//Listening with a version with socket.io
var server = http.listen(3000, () =>{
    console.log('server is listening on port', server.address().port);
});