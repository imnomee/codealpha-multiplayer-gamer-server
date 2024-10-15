import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
const server = createServer(app);
const io = new Server(server);

mongoose.connect(process.env.MONGO_URI);
app.use(express.json());
app.use(express.static('public'));

io.on('connection', (socket) => handleSocketConnection(io, socket));

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
    console.log(`Server is running on: http://localhost:${PORT}`);
});
