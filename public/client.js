const socket = io('http://localhost:3000');
socket.on('game-ready', () => {
    console.log('Game ready');
});
socket.on('game-not-ready', () => {
    console.log('Game not ready');
});
