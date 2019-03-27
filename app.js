var express = require('express');
var app = express();
var io = require('socket.io')();

const port = process.env.PORT || 3000;

// tell express where our static files are (js, images, css, etc )
app.use(express.static('public'));

app.get('/', (req, res ) => {
    res.sendFile(__dirname + '/views/index.html');
});


// create server variable for socket.io to use
const server = app.listen(port, () => {
    console.log(`App is running on port ${port}`);
});

io.attach(server);

// socket.io chat app stuff to follow
io.on('connection', function(socket) {
    console.log('a user has connected');

    socket.emit('connected', {sID: `${socket.id}`, message: 'new connection'} );

    // listen for an incoming message from anyone connected to the app
    socket.on('chat message', function(msg) {
        console.log('message: ', msg, 'socket', socket.id);

        // send the message to everyone connected to the app
        io.emit('chat message', { id: `${socket.id}`, message: msg});
    });

    socket.on('disconnect', function() {
        console.log(' a user has disconnected');
    });
});