const express = require('express');
const app = express();
const server = app.listen(3000);
const io = require('socket.io')(server);

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

const players = [];
let availableFighters = 2

io.on('connection', (socket) => {
    if (players.indexOf(socket.id) < 0) {
        players.push(socket.id);
        socket.join('players room');
        console.log('New fighter connected', socket.id);
        if (players.length < 2) {
            io.in('players room').emit('game-not-ready');
        } else {
            socket.emit('lastPlayer', availableFighters);
            io.in('players room').emit('game-ready');
        }
    }

    socket.on('disconnect', () => {
        const socketIndex = players.indexOf(socket.id);
        players.splice(socketIndex, 1);
        console.log('Player with ID '+ socket.id + ' disconnected.');
        io.in('players room').emit('game-not-ready');
    });

    socket.on('chooseFighter', () => {
        availableFighters -= 1;
    });
});
