const express = require('express');
const app = express();
const server = app.listen(8080);
const io = require('socket.io')(server);
import {generateNumberInRange} from './utils';

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

io.on('connection', socket => {
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
    } else if (socket.player === 2) {
      lastPlayerReady = true;
    }
    if (firstPlayerReady && lastPlayerReady) {
      fighterHasAttacked = false;
      signalShown = false;
      io.in('players room').emit('game-ready');
      setTimeout(() => {
        const allPlayersReady = firstPlayerReady === true && lastPlayerReady === true;
        if (allPlayersReady && fighterHasAttacked === false && signalShown === false) {
          io.in('players room').emit('signal');
          signalShown = true;
        } else {
          signalShown = false;
        }
      }, generateNumberInRange(MIN_TIMER, MAX_TIMER, 1000));
    }
  });

  socket.on('attack', timeToAttack => {
    if (fighterHasAttacked === true) {
      return;
    }
    fighterHasAttacked = true;
    let winner;
    if (signalShown === false) {
      winner = socket.player === 1 ? 2 : 1;
    } else {
      winner = socket.player;
    }
    const nextBackground = generateNumberInRange(MIN_BG_ID, MAX_BG_ID);
    io.in('players room').emit('endGame', {winner, nextBackground, timeToAttack});
    resetGame();
  });
});

function resetGame() {
  fighterHasAttacked = false;
  firstPlayerReady = false;
  lastPlayerReady = false;
  signalShown = false;
}
