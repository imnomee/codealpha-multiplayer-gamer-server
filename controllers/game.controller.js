import Game from '../models/Game.model.js';

export const createGame = async (req, res) => {
    const randomNumber = Math.floor(Math.random() * 10) + 1;
    const newGame = new Game({ player1: req.user, randomNumber });
    await newGame.save();
    console.log(newGame);
    return res
        .status(201)
        .json({ gameId: newGame._id, message: 'Game created' });
};

export const joinGame = async (req, res) => {
    const { gameId } = req.body;
    const game = await Game.findById(gameId);
    if (!game) return res.status(404).json({ message: 'Game not found' });
    game.player2 = req.user;
    await game.save();
    return res.status(200).json({ message: 'Joined the game' });
};
