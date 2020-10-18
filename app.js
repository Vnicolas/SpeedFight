const express = require('express');
const app = express();
const server = app.listen(8080);
const io = require('socket.io')(server);
import {generateNumberInRange} from './utils';

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Signal shown after the time (in seconds)
const MIN_TIMER = 2;
const MAX_TIMER = 6;
const MIN_BG_ID = 1;
const MAX_BG_ID = 11;

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
    setFirstPlayer(socket);
  } else {
    setLastPlayer(socket);
  }

  socket.join('players room');

  socket.on('disconnect', () => {
    if (socket.player === 1) {
      resetFirstPlayer();
    } else {
      resetLastPlayer();
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
      prepareGame();
      launchGame();
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
    resetGame(winner, timeToAttack);
  });
});

function resetGame(winner, timeToAttack) {
  const nextBackground = generateNumberInRange(MIN_BG_ID, MAX_BG_ID);
  io.in('players room').emit('endGame', {winner, nextBackground, timeToAttack});
  fighterHasAttacked = false;
  firstPlayerReady = false;
  lastPlayerReady = false;
  signalShown = false;
}

function prepareGame() {
  fighterHasAttacked = false;
  signalShown = false;
  io.in('players room').emit('game-ready');
}

function setFirstPlayer(socket) {
  firstPlayerConnected = true;
  socket.player = 1;
  io.to(`${socket.id}`).emit('firstPlayer');
}

function setLastPlayer(socket) {
  lastPlayerConnected = true;
  socket.player = 2;
  io.to(`${socket.id}`).emit('lastPlayer');
}

function resetFirstPlayer() {
  firstPlayerConnected = false;
  firstPlayerReady = false;
}

function resetLastPlayer() {
  lastPlayerConnected = false;
  lastPlayerReady = false;
}

function launchGame() {
  setTimeout(() => {
    const playersReady = firstPlayerReady === true && lastPlayerReady === true;
    const gameCanStart = fighterHasAttacked === false && signalShown === false;
    if (playersReady && gameCanStart) {
      io.in('players room').emit('signal');
      signalShown = true;
    } else {
      signalShown = false;
    }
  }, generateNumberInRange(MIN_TIMER, MAX_TIMER, 1000));
}
