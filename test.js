import dgram from 'node:dgram';
import { Buffer } from 'node:buffer';
import crypto from 'node:crypto';

// Function to create a connection request
function buildConnReq() {
    const buf = Buffer.alloc(16);
    buf.writeUint32BE(0x417, 0);
    buf.writeUint32BE(0x27101980, 4);
    crypto.randomBytes(4).copy(buf, 8); // Transaction ID
    return buf;
}

// Function to parse connection response
function parseConnResp(resp) {
    return {
        action: resp.readUInt32BE(0),
        transactionId: resp.readUInt32BE(4),
        connectionId: resp.slice(8)
    };
}

// Main function to connect to the tracker
function connectToTracker(trackerUrl) {
    const socket = dgram.createSocket('udp4');

    socket.on('error', (err) => {
        console.error(`Socket error: ${err.stack}`);
        socket.close();
    });

    socket.on('message', (msg) => {
        console.log(`Received message: ${msg}`);
        const response = parseConnResp(msg);
        console.log(`Action: ${response.action}, Transaction ID: ${response.transactionId}, Connection ID: ${response.connectionId.toString('hex')}`);
        // Here you can add further logic to handle the announce request
    });

    socket.on('listening', () => {
        const address = socket.address();
        console.log(`Socket listening on ${address.address}:${address.port}`);
        
        // Send the connection request once the socket is ready
        const connReq = buildConnReq();
        socket.send(connReq, 0, connReq.length, trackerUrl.port, trackerUrl.hostname, (err) => {
            if (err) {
                console.error(`Error sending request: ${err}`);
            } else {
                console.log('Connection request sent');
            }
        });
    });

    // Bind the socket to a random available port
    socket.bind(0, () => {
        console.log(`Bound to port ${socket.address().port}`);
    });
}

// Usage example with a known UDP tracker URL
// const trackerUrl = new URL('udp://tracker.openbittorrent.com:80');
const trackerUrl = new URL('udp://tracker.dler.org:6969/announce');
connectToTracker(trackerUrl);
