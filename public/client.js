// Variables initialization
const socket = io('http://localhost:8888');
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
const winnerMessage = document.querySelector('#winnerMessage');
const btnRestart = document.querySelector('#restart');
const playerLabel = document.querySelector('#player');

// Socket events
socket.on('game-ready', () => {
    launchGame();
});
socket.on('firstPlayer', () => {
    sayanIndicator.classList.remove('hidden');
    sayanIndicator.classList.add('move');
    playerLabel.innerHTML = 'You are ZACK';
});
socket.on('lastPlayer', () => {
    player = 2;
    ennemyIndicator.classList.remove('hidden');
    ennemyIndicator.classList.add('move');
    playerLabel.innerHTML = 'You are GRUNT';
});
socket.on('endGame', animateFighter);
socket.on('signal', showSignal);

btnJoin.addEventListener('click', joinBattle);

// Functions
function animateFighter(winner) {
    document.removeEventListener('keyup', attack);
    container.classList.remove('focus');
    hideSignal();
    container.style.animation = 'blink-opacity .5s linear';
    if (winner === 1) {
        sayan.style.backgroundPosition = '252% 13.5%';
        sayan.style.left = '50%';
        ennemy.style.backgroundPosition = '40% -5.2%';
        setTimeout(() => {
            sayan.style.backgroundPosition = '23.5% 0.1%';
            container.removeAttribute('style');
        }, 800);
    } else {
        ennemy.style.backgroundPosition = '10% 68.4%';
        ennemy.style.left = '46%';
        sayan.style.backgroundPosition = '146% 20%';
        setTimeout(() => {
            ennemy.style.backgroundPosition = '31% 78.9%';
            container.removeAttribute('style');
        }, 800);
    }

    setTimeout(() => {
        if (winner === 1) {
            winnerMessage.innerHTML = 'Winner ZACK !!';
            winnerMessage.classList.remove('hidden');
        } else {
            winnerMessage.innerHTML = 'Winner GRUNT !!';
        }
        winnerMessage.classList.remove('hidden');
        btnRestart.classList.remove('hidden');
    }, 500);
}

function showSignal() {
    signalShown = true;
    signal.style.visibility = 'visible';
}

function hideSignal() {
    signalShown = false;
    signal.style.visibility = 'hidden';
}

function attack() {
    socket.emit('attack');
}

function launchGame() {
    gameIsReady = true;
    header.classList.add('hidden');
    container.classList.add('focus');
    sayanIndicator.classList.remove('move');
    ennemyIndicator.classList.remove('move');
    hideButton();
    prepareFighters();
    document.addEventListener('keyup', attack);
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
    header.classList.remove('blink-border');
    container.classList.remove('focus');
    header.classList.add('blink-opacity');
    header.classList.remove('blink-border');
    header.innerHTML = 'AWAITING THE OPPONENT...';
    sayan.removeAttribute('style');
    ennemy.removeAttribute('style');

}

function reset() {
    location.reload();
}

function prepareFighters() {
    sayan.style.backgroundPosition = '70.5% 0%';
    ennemy.style.backgroundPosition = '0% -15.9%';
}
