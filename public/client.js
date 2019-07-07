// Variables initialization
const socket = io(window.location.origin);
let player = 1;
let gameIsReady = false;
let signalShown = false;
let nextBackground = 1;
const MIN_ID = 1;
const MAX_ID = 11;

// HTML elements
const btnJoin = document.querySelector('#join-button');
const btnRestart = document.querySelector('#restart');
const header = document.querySelector('header span');
const sayan = document.querySelector('#fighter-1');
const sayanIndicator = document.querySelector('.icon-fighter.sayan');
const ennemy = document.querySelector('#fighter-2');
const ennemyIndicator = document.querySelector('.icon-fighter.ennemy');
const container = document.querySelector('.game-container');
const signal = document.querySelector('#signal');
const winnerMessage = document.querySelector('#winnerMessage');
const playerLabel = document.querySelector('#player');

// Socket events
socket.on('reset', () => {
    reset();
});
socket.on('game-ready', () => {
    launchGame();
});
socket.on('firstPlayer', () => {
    autoSelectFighter(1);
});
socket.on('lastPlayer', () => {
    autoSelectFighter(2);
});
socket.on('endGame', (infos) => {
    animateFighter(infos.winner);
    nextBackground = infos.nextBackground;
});
socket.on('signal', showSignal);

btnJoin.addEventListener('click', joinGame);
btnRestart.addEventListener('click', () => {
    reset(true);
});

// Game logic
function autoSelectFighter(fighterId) {
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

function joinGame() {
    hideBtnJoin();
    waitOpponent();
    socket.emit('ready', player);
}

function waitOpponent() {
    gameIsReady = false;
    signalShown = false;
    hideSignal();
    hideBtnJoin();
    header.classList.remove('hidden');
    header.classList.remove('blink-border');
    container.classList.remove('focus');
    header.classList.add('blink-opacity');
    header.classList.remove('blink-border');
    header.innerHTML = 'AWAITING THE OPPONENT...';
    sayan.removeAttribute('style');
    ennemy.removeAttribute('style');

}

function launchGame() {
    gameIsReady = true;
    header.classList.add('hidden');
    container.classList.add('focus');
    sayanIndicator.classList.remove('move');
    ennemyIndicator.classList.remove('move');
    hideBtnJoin();
    prepareFighters();
    'keyup touchend'.split(' ').forEach((eventName) => {
        document.addEventListener(eventName, attack);
    });
}

function showSignal() {
    signalShown = true;
    signal.style.visibility = 'visible';
}

function hideSignal() {
    signalShown = false;
    signal.style.visibility = 'hidden';
}

function reset(_changeBackground) {
    if (_changeBackground === true) {
        changeBackground(nextBackground);
    } else {
        container.removeAttribute('style');
    }
    header.removeAttribute('style');
    header.classList.add('hidden');
    container.classList.remove('focus');
    sayan.removeAttribute('style');
    ennemy.removeAttribute('style');
    winnerMessage.classList.add('hidden');
    btnRestart.classList.add('hidden');
    gameIsReady = false;
    showBtnJoin();
    hideSignal();
    autoSelectFighter(player);
}

// Fighters logic
function prepareFighters() {
    sayan.style.backgroundPosition = '70.5% 0%';
    ennemy.style.backgroundPosition = '0% -15.9%';
}

function attack() {
    if (gameIsReady === true) {
        socket.emit('attack');
    }
}

function animateFighter(winner) {
    gameIsReady = false;
    document.removeEventListener('keyup touchend', attack);
    container.classList.remove('focus');
    hideSignal();
    container.style.animation = 'blink-opacity .5s linear';
    if (winner === 1) {
        sayanWin();
    } else {
        ennemyWin();
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

function sayanWin() {
    const leftCoordEnnemy = ennemy.getBoundingClientRect().left + 30 + 'px';
    sayan.style.backgroundPosition = '69.5% 13.1%';
    sayan.style.left = leftCoordEnnemy;
    ennemy.style.backgroundPosition = '40% -5.2%';
    setTimeout(() => {
        sayan.style.backgroundPosition = '23.5% 0.1%';
        container.style.animation = 'none';
    }, 500);
}

function ennemyWin() {
    const leftCoordSayan = sayan.getBoundingClientRect().right + 'px';
    ennemy.style.backgroundPosition = '10% 68.4%';
    ennemy.style.left = leftCoordSayan;
    sayan.style.backgroundPosition = '146.5% 20%';
    setTimeout(() => {
        ennemy.style.backgroundPosition = '31% 78.9%';
        container.style.animation = 'none';
    }, 500);
}

// Display logic
function hideBtnJoin() {
    btnJoin.classList.add('hidden');
}

function showBtnJoin() {
    btnJoin.classList.remove('hidden');
}

function changeBackground(id) {
    container.style.backgroundImage = `url('./img/bg-${id}.gif')`;
}
