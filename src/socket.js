const socketIO = require('socket.io');

const socket = (server) => {
    const io = socketIO(server, { cors: { origin: '*' } });

    io.on('connection', async (socket) => {
        console.log('Device connected');
    });
};

module.exports = socket;