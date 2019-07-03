const express = require('express');
const app = express();
const server = app.listen(3000);
const io = require('socket.io')(server);

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

const fighters = [];

io.on('connection', (socket) => {
    if (fighters.indexOf(socket.id) < 0) {
        fighters.push(socket.id);
        console.log('New fighter connected', socket.id);
        socket.join('fighters room');
        if (fighters.length === 2) {
            io.in('fighters room').emit('game-ready');
        }
    }

    socket.on('disconnect', () => {
        const socketIndex = fighters.indexOf(socket.id);
        fighters.splice(socketIndex, 1);
        console.log('Fighter with ID '+ socket.id + ' disconnected.');
        io.in('fighters room').emit('game-not-ready');
    });
});
