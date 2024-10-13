import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';

// Path setup
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server);
import authRoutes from './routes/auth.route.js';
import gameRoutes from './routes/game.route.js';

// Middlewares
app.use(express.json());
app.use(cors());
app.use(express.static(__dirname + '/public'));
app.use(cookieParser());

// Auth Routes
app.use('/auth', authRoutes);
app.use('/game', gameRoutes);

// Game State
let games = {};
let waitingPlayer = null;

// WebSocket functionality
io.on('connection', (socket) => {
    console.log(`${socket.id} connected`);

    // Handle player joining a game
    socket.on('joinGame', (userId) => {
        if (waitingPlayer) {
            // Start a game with the waiting player
            const roomName = `room-${waitingPlayer}-${userId}`;
            socket.join(roomName);
            waitingPlayer = null;

            const randomNumber = Math.floor(Math.random() * 10) + 1;
            games[roomName] = { randomNumber };

            io.to(roomName).emit('startGame', {
                message: 'Game Started! Guess a number between 1 and 10',
            });
            console.log(`Game started in ${roomName}`);
        } else {
            // If no waiting player, mark the current player as waiting
            waitingPlayer = userId;
            socket.emit('waiting', {
                message: 'Waiting for another player to join...',
            });
            console.log(`${userId} is waiting for another player...`);
        }
    });

    // Handle a player making a guess
    socket.on('makeGuess', (data) => {
        console.log(data);
        const { roomName, guess } = data;
        const game = games[roomName];

        if (game) {
            const { randomNumber } = game;
            if (guess === randomNumber) {
                io.to(roomName).emit('gameEnd', {
                    message: `Correct! The number was ${guess}`,
                });
                delete games[roomName]; // Game ends, so remove it
            } else if (guess < randomNumber) {
                socket.emit('feedback', { message: 'Too Low!' });
            } else {
                socket.emit('feedback', { message: 'Too High!' });
            }
        } else {
            socket.emit('error', { message: 'No game found in this room.' });
        }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log(`${socket.id} disconnected`);
        if (waitingPlayer === socket.id) {
            waitingPlayer = null;
        }
    });
});

// MongoDB Connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected');
    } catch (error) {
        console.error(error);
    }
};

// Start the server
const port = process.env.PORT || 3000;

server.listen(port, () => {
    connectDB();
    console.log(`Server is running on http://localhost:${port}`);
});
