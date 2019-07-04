let player = 1;
let gameIsReady = false;
let isWaiting = false;
const socket = io('http://localhost:3000');

socket.on('game-ready', () => {
    initGame();
});
socket.on('game-not-ready', () => {
    waitOpponent();
});

socket.on('lastPlayer', () => {
    player = 2;
    console.log('lastPlayer', player);
});

const btnJoin = document.querySelector('#join-button');
const header = document.querySelector('header span');
const sayan = document.querySelector('#fighter-1');
const ennemy = document.querySelector('#fighter-2');

btnJoin.addEventListener('click', joinBattle);

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
    isWaiting = true;
    hideButton();
    header.classList.remove('hidden');
    header.classList.add('blink-opacity');
    header.classList.remove('blink-border');
    header.innerHTML = 'WAITING OPPONENT...';
    header.style.color = '#414141';
    header.style.borderColor = '#414141';
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
    hideButton();
    prepareFighters();
}

function prepareFighters() {
    sayan.style.backgroundPosition = '70.5% 0%';
    ennemy.style.backgroundPosition = '0% 0%';
}
