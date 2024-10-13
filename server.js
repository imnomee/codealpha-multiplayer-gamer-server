import express from 'express';
import http from 'http';
import { Server } from 'socket.io'; // Correct import for socket.io

const app = express();

const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log(`A user connected: ${socket.id}`);

    socket.on('message', (msg) => {
        console.log(`Message from: ${socket.id}: ${msg}`);

        io.emit('message', { msg, id: socket.id });
    });

    socket.on('disconnect', () => {
        console.log(`A user disconnected: ${socket.id}`);
    });
});

const PORT = 3000;

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
