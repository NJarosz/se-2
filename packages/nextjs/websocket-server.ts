const { WebSocketServer } = require("ws");

const wss = new WebSocketServer({ host: '0.0.0.0', port: 4000 }); // Or whichever port you want.  Be sure to set Firewall accordingly.

wss.on('connection', (ws) => {
    console.log('New client connected');

    ws.on('message', (message) => {
        // Broadcast the message to all connected clients
        const messageString = message.toString();
        console.log('Received:', messageString);
        wss.clients.forEach((client) => {
            if (client.readyState === client.OPEN) {
                client.send(messageString);
            }
        });
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

console.log('WebSocket server is running on ws://localhost:4000');
