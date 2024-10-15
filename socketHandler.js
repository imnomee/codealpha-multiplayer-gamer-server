import Game from './models/Game.model';

export const handleSocketConnection = (io, socket) => {
    socket.on('join-game', async ({ gameId, playerId }) => {
        const game = await Game.findById(gameId);
        if (!game || (game.player1 !== playerId && game.player2 !== playerId)) {
            return socket.emit('error', `Game not found or unauthorized`);
        }
        socket.join(gameId);
        io.to(gameId).emit('game-updated', {
            message: 'Player Joined the game.',
        });
    });

    socket.on('make-guess', async ({ gameId, playerId, guess }) => {
        const game = await Game.findById(gameId);
        if (!game) return socket.emit('error', 'Game not found');
        if (guess === game.randomNumber) {
            io.to(gameId).emit('game-over', { winnder: playerId });
        } else {
            io.to(gameId).emit('game-updated', {
                guess,
                message: `Player ${playerId} guessed ${guess}`,
            });
        }
    });
};
