const express = require('express');
const app = express();
const server = app.listen(3000);
const io = require('socket.io')(server);

const MIN_TIMER = 2;
const MAX_TIMER = 6;

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

let availableFighters = 2;
let fightersReady = 0;

function generateTimer() {
    return Math.floor(Math.random() * (MAX_TIMER - MIN_TIMER + 1) + MIN_TIMER) * 1000;
}


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
            setTimeout(() => {
                io.in('players room').emit('signal');
            }, generateTimer());
        }
    });
});
