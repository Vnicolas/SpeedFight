// Variables initialization
let player = 1;
let gameIsReady = false;
const socket = io('http://localhost:3000');

// Socket events
socket.on('game-ready', () => {
    initGame();
});
socket.on('game-not-ready', () => {
    waitOpponent();
});
socket.on('lastPlayer', () => {
    player = 2;
});

// HTML elements
const btnJoin = document.querySelector('#join-button');
const header = document.querySelector('header span');
const sayan = document.querySelector('#fighter-1');
const ennemy = document.querySelector('#fighter-2');
const container = document.querySelector('.game-container');

btnJoin.addEventListener('click', joinBattle);

// Functions
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
    showButton();
    header.classList.remove('hidden');
    header.classList.remove('blink-opacity');
    header.classList.add('blink-border');
    header.innerHTML = 'GET READY TO FIGHT !';
    header.removeAttribute('style');
    sayan.removeAttribute('style');
    ennemy.removeAttribute('style');
}

function initGame () {
    gameIsReady = true;
    header.classList.add('hidden');
    container.classList.add('focus');
    hideButton();
    prepareFighters();
}

function prepareFighters() {
    sayan.style.backgroundPosition = '70.5% 0%';
    ennemy.style.backgroundPosition = '0% 0%';
}
