const express = require('express');
const app = express();
const server = app.listen(3000);
const io = require('socket.io')(server);

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

let availableFighters = 2;
let fightersReady = 0;

io.on('connection', (socket) => {
    if (availableFighters === 2) {
        socket.join('players room');
        availableFighters -= 1;
    } else if (availableFighters === 1) {
        socket.join('players room');
        availableFighters -= 1;
        io.to(`${socket.id}`).emit('lastPlayer');
    }

    socket.on('disconnect', () => {
        io.in('players room').emit('game-not-ready');
        availableFighters += 1;
        fightersReady -= 1;
        // Prevent page reload by both players
        if (fightersReady < 0) {
            fightersReady = 0;
        }
    });

    socket.on('ready', () => {
        fightersReady += 1;
        if (fightersReady === 2) {
            io.in('players room').emit('game-ready');
        }
    });
});
