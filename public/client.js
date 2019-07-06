// Variables initialization
const socket = io(window.location.origin);
let player = 1;
let gameIsReady = false;
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
socket.on('reset', () => {
    reset();
});
socket.on('game-ready', () => {
    launchGame();
});
socket.on('firstPlayer', () => {
    selectFighter(1);
});
socket.on('lastPlayer', () => {
    selectFighter(2);
});
socket.on('endGame', animateFighter);
socket.on('signal', showSignal);

btnJoin.addEventListener('click', joinBattle);
btnRestart.addEventListener('click', reset);

// Functions
function selectFighter(fighterId) {
    if (fighterId === 1) {
        player = 1;
        sayanIndicator.classList.remove('hidden');
        sayanIndicator.classList.remove('move');
        sayanIndicator.classList.add('move');
        playerLabel.innerHTML = 'You are ZACK';
    } else {
        player = 2;
        ennemyIndicator.classList.remove('hidden');
        ennemyIndicator.classList.remove('move');
        ennemyIndicator.classList.add('move');
        playerLabel.innerHTML = 'You are GRUNT';
    }
}

function animateFighter(winner) {
    gameIsReady = false;
    document.removeEventListener('keyup touchend', attack);
    container.classList.remove('focus');
    hideSignal();
    container.style.animation = 'blink-opacity .5s linear';
    if (winner === 1) {
        const leftCoordEnnemy = ennemy.getBoundingClientRect().left + 30 + 'px';
        sayan.style.backgroundPosition = '69.5% 13.1%';
        sayan.style.left = leftCoordEnnemy;
        ennemy.style.backgroundPosition = '40% -5.2%';
        setTimeout(() => {
            sayan.style.backgroundPosition = '23.5% 0.1%';
            container.removeAttribute('style');
        }, 500);
    } else {
        const leftCoordSayan = sayan.getBoundingClientRect().right + 'px';
        ennemy.style.backgroundPosition = '10% 68.4%';
        ennemy.style.left = leftCoordSayan;
        sayan.style.backgroundPosition = '146.5% 20%';
        setTimeout(() => {
            ennemy.style.backgroundPosition = '31% 78.9%';
            container.removeAttribute('style');
        }, 500);
    }

    setTimeout(() => {
        if (winner === 1) {
            winnerMessage.innerHTML = 'Winner ZACK !!';
        } else {
            winnerMessage.innerHTML = 'Winner GRUNT !!';
        }
        winnerMessage.classList.remove('hidden');
        btnRestart.classList.remove('hidden');
    }, 800);
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
    if (gameIsReady === true) {
        socket.emit('attack');
    }
}

function launchGame() {
    gameIsReady = true;
    header.classList.add('hidden');
    container.classList.add('focus');
    sayanIndicator.classList.remove('move');
    ennemyIndicator.classList.remove('move');
    hideButton();
    prepareFighters();
    'keyup touchend'.split(' ').forEach((eventName) => {
        document.addEventListener(eventName, attack);
    });
}

function hideButton () {
    btnJoin.classList.add('hidden');
}

function showButtonJoin () {
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

function reset(withTransition) {
    if (withTransition === true) {
        container.style.animation = 'blink-opacity .5s linear';
    }
    header.removeAttribute('style');
    header.classList.add('hidden');
    container.removeAttribute('style');
    container.classList.remove('focus');
    sayan.removeAttribute('style');
    ennemy.removeAttribute('style');
    winnerMessage.classList.add('hidden');
    btnRestart.classList.add('hidden');
    gameIsReady = false;
    showButtonJoin();
    hideSignal();
    selectFighter(player);
}

function prepareFighters() {
    sayan.style.backgroundPosition = '70.5% 0%';
    ennemy.style.backgroundPosition = '0% -15.9%';
}
