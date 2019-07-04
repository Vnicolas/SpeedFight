// Variables initialization
const socket = io('http://localhost:3000');
let player = 1;
let gameIsReady = false;
let gameIsStarted = false;
let signalShown = false;

// HTML elements
const btnJoin = document.querySelector('#join-button');
const header = document.querySelector('header span');
const sayan = document.querySelector('#fighter-1');
const sayanIndicator = document.querySelector('.icon-fighter.sayan');
const ennemy = document.querySelector('#fighter-2');
const ennemyIndicator = document.querySelector('.icon-fighter.ennemy');
const container = document.querySelector('.game-container');
const signal = document.querySelector('#signal');

// Socket events
socket.on('game-ready', () => {
    launchGame();
});
socket.on('firstPlayer', () => {
    sayanIndicator.classList.add('blink-opacity');
    sayanIndicator.classList.remove('hidden');
    ennemyIndicator.classList.add('hidden');
});
socket.on('lastPlayer', () => {
    player = 2;
    sayanIndicator.classList.add('hidden');
    ennemyIndicator.classList.add('blink-opacity');
    ennemyIndicator.classList.remove('hidden');
});
socket.on('looser', () => {
    hideSignal();
    container.classList.remove('focus');
});
socket.on('winner', () => {
    hideSignal();
    container.classList.remove('focus');
});
//socket.on('endGame', reset);
socket.on('signal', showSignal);

btnJoin.addEventListener('click', joinBattle);

// Functions
function animateFighter() {

}

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
    document.addEventListener('keyup', () => {
        socket.emit('attack');
    });
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
    socket.emit('ready', player);
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
    if (player === 1) {
        sayanIndicator.classList.remove('blink-opacity');
    } else {
        ennemyIndicator.classList.remove('blink-opacity');
    }

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
    ennemyIndicator.classList.remove('hidden');
    sayanIndicator.classList.remove('hidden');
}

function prepareFighters() {
    sayan.style.backgroundPosition = '70.5% 0%';
    ennemy.style.backgroundPosition = '0% 0%';
}
