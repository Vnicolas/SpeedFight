import {generateNumberInRange} from './utils';

// Signal shown between these times (included) (units: seconds)
const MIN_TIMER = 2;
const MAX_TIMER = 6;

// Indexes of backgrounds ids
const MIN_BG_ID = 1;
const MAX_BG_ID = 11;

class GameService {
  constructor(io) {
    this.io = io; // from socket.io package
    this.firstPlayerConnected = false;
    this.lastPlayerConnected = false;
    this.firstPlayerReady = false;
    this.lastPlayerReady = false;
    this.signalShown = false;
    this.playerHasAttacked = false;
  }

  get playersReady() {
    return this.firstPlayerReady && this.lastPlayerReady;
  }

  get gameCanStart() {
    return !this.playerHasAttacked && !this.signalShown;
  }

  get gameIsFull() {
    return this.firstPlayerConnected && this.lastPlayerConnected;
  }

  attack() {
    this.playerHasAttacked = true;
  }

  preparePlayer(socket) {
    if (socket.player === 1) {
      this.firstPlayerReady = true;
    } else if (socket.player === 2) {
      this.lastPlayerReady = true;
    }
  }

  end(winner, timeToAttack) {
    this.playerHasAttacked = false;
    this.firstPlayerReady = false;
    this.lastPlayerReady = false;
    this.signalShown = false;
    const nextBackground = generateNumberInRange(MIN_BG_ID, MAX_BG_ID);
    this.io.in('players room').emit('endGame', {winner, nextBackground, timeToAttack});
  }

  prepareGame() {
    this.playerHasAttacked = false;
    this.signalShown = false;
    this.io.in('players room').emit('game-ready');
  }

  setPlayer(socket) {
    if (this.firstPlayerConnected === false) {
      this.setFirstPlayer(socket);
    } else {
      this.setLastPlayer(socket);
    }
  }

  resetPlayer(socket) {
    if (socket.player === 1) {
      this.resetFirstPlayer();
    } else {
      this.resetLastPlayer();
    }
    this.io.in('players room').emit('reset');
  }

  setFirstPlayer(socket) {
    this.firstPlayerConnected = true;
    socket.player = 1;
    this.io.to(`${socket.id}`).emit('firstPlayer');
  }

  setLastPlayer(socket) {
    this.lastPlayerConnected = true;
    socket.player = 2;
    this.io.to(`${socket.id}`).emit('lastPlayer');
  }

  resetFirstPlayer() {
    this.firstPlayerConnected = false;
    this.firstPlayerReady = false;
  }

  resetLastPlayer() {
    this.lastPlayerConnected = false;
    this.lastPlayerReady = false;
  }

  launchGame() {
    setTimeout(() => {
      if (this.playersReady && this.gameCanStart) {
        this.io.in('players room').emit('signal');
        this.signalShown = true;
      } else {
        this.signalShown = false;
      }
    }, generateNumberInRange(MIN_TIMER, MAX_TIMER, 1000));
  }
}

export default GameService;
