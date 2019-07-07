const express = require('express');
const app = express();
const server = app.listen(8080);
const io = require('socket.io')(server);

const MIN_TIMER = 2;
const MAX_TIMER = 6;

const MIN_BG_ID = 1;
const MAX_BG_ID = 11;

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

let firstPlayerConnected = false;
let lastPlayerConnected = false;
let firstPlayerReady = false;
let lastPlayerReady = false;
let signalShown = false;
let fighterHasAttacked = false;

function generateNUmberinRange(min, max, multiplier) {
    return Math.floor(Math.random() * (max - min + 1) + min) * multiplier;
}

io.on('connection', (socket) => {
    if (firstPlayerConnected && lastPlayerConnected) {
        return;
    }
    if (firstPlayerConnected === false) {
        firstPlayerConnected = true;
        socket.player = 1;
        io.to(`${socket.id}`).emit('firstPlayer');
    } else {
        lastPlayerConnected = true;
        socket.player = 2;
        io.to(`${socket.id}`).emit('lastPlayer');
    }
    socket.join('players room');

    socket.on('disconnect', () => {
        if (socket.player === 1) {
            firstPlayerConnected = false;
            firstPlayerReady = false;
        } else {
            lastPlayerConnected = false;
            lastPlayerReady = false;
        }
        io.in('players room').emit('reset');
    });

    socket.on('ready', () => {
        if (socket.player === 1) {
            firstPlayerReady = true;
        } else if (socket.player === 2){
            lastPlayerReady = true;
        }
        if (firstPlayerReady && lastPlayerReady) {
            fighterHasAttacked = false;
            signalShown = false;
            io.in('players room').emit('game-ready');
            setTimeout(() => {
                const allPLayersReady = firstPlayerReady === true && lastPlayerReady === true;
                if (allPLayersReady && fighterHasAttacked === false && signalShown === false) {
                    io.in('players room').emit('signal');
                    signalShown = true;
                } else {
                    signalShown = false;
                }
            }, generateNUmberinRange(MIN_TIMER, MAX_TIMER, 1000));
        }
    });

    socket.on('attack', () => {
        if (fighterHasAttacked === true) {
            return;
        }
        if (fighterHasAttacked === false && signalShown === false) {
            const nextBackground = generateNUmberinRange(MIN_BG_ID, MAX_BG_ID, 1);
            const winner = (socket.player === 1) ? 2 : 1;
            io.in('players room').emit('endGame', {winner, nextBackground});
        } else {
            const nextBackground = generateNUmberinRange(MIN_BG_ID, MAX_BG_ID, 1);
            const winner = socket.player;
            io.in('players room').emit('endGame', {winner, nextBackground});
            signalShown = false;
        }
        fighterHasAttacked = true;
        firstPlayerReady = false;
        lastPlayerReady = false;
    });
});
