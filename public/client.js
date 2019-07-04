// Variables initialization
const socket = io('http://localhost:3000');
let player = 1;
let gameIsReady = false;
let gameIsStarted = false;
let signalShown = false;

// Socket events
socket.on('game-ready', () => {
    launchGame();
});
socket.on('game-not-ready', () => {
    waitOpponent();
});
socket.on('lastPlayer', () => {
    player = 2;
});
socket.on('signal', showSignal);

// HTML elements
const btnJoin = document.querySelector('#join-button');
const header = document.querySelector('header span');
const sayan = document.querySelector('#fighter-1');
const ennemy = document.querySelector('#fighter-2');
const container = document.querySelector('.game-container');
const signal = document.querySelector('#signal');

btnJoin.addEventListener('click', joinBattle);

// Functions
function showSignal() {
    signalShown = true;
    signal.style.visibility = 'visible';
}

function hideSignal() {
    signalShown = false;
    signal.style.visibility = 'hidden';
}

function launchGame() {
    gameIsReady = true;
    header.classList.add('hidden');
    container.classList.add('focus');
    hideButton();
    prepareFighters();
}

function hideButton () {
    btnJoin.classList.add('hidden');
}

function showButton () {
    btnJoin.classList.remove('hidden');
}

function joinBattle () {
    hideButton();
    waitOpponent();
    socket.emit('ready');
}

function waitOpponent() {
    gameIsReady = false;
    signalShown = false;
    hideSignal();
    hideButton();
    header.classList.remove('hidden');
    container.classList.remove('focus');
    header.classList.add('blink-opacity');
    header.classList.remove('blink-border');
    header.innerHTML = 'WAITING OPPONENT...';
    sayan.removeAttribute('style');
    ennemy.removeAttribute('style');
}

function reset() {
    gameIsReady = false;
    signalShown = false;
    showButton();
    header.classList.remove('hidden');
    header.classList.remove('blink-opacity');
    header.classList.add('blink-border');
    header.innerHTML = 'GET READY TO FIGHT !';
    header.removeAttribute('style');
    sayan.removeAttribute('style');
    ennemy.removeAttribute('style');
}

function prepareFighters() {
    sayan.style.backgroundPosition = '70.5% 0%';
    ennemy.style.backgroundPosition = '0% 0%';
}
