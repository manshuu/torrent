import net from "net";
import { getPeers } from "./tracker.js";
import { buildHandShake, buildInterested } from "./message.js";
import { parse } from "path";

export default function(torrent) {
    getPeers(torrent, peers => {
        peers.forEach(peer => { download(peer, torrent); });
    })
}


function download(peer, torrent) {
    const socket = new net.Socket();
    socket.on('error', console.log);
    socket.connect(peer.port, peer.ip, () => {
        // 1. handshake 
        socket.write(buildHandShake(torrent));

    });
    
    onWholeMsg(socket, msg => msgHandler(msg, socket));

    
}

function onWholeMsg(socket, callback) {
   let savedBuf = Buffer.alloc(0);
   let handShake = true;
   
    socket.on('data', recvBuf => {
        const msgLen = () => handShake ? savedBuf.readUint8(0) + 49 : savedBuf.readUint32BE(0) + 4;
        savedBuf = Buffer.concat([savedBuf, recvBuf]);

        while (savedBuf.length >= 4 && savedBuf.length >= msgLen()) {
            callback(Buffer.from(savedBuf.subarray(0, msgLen())));
            savedBuf = Buffer.from(savedBuf.subarray(msgLen()));
            handShake = false;
        }
    });
}

function msgHandler(msg, socket) {
    if (isHandShake(msg)) {
        socket.write(buildInterested())
    }
    else {
        const m = parse(msg);
        
        switch (m.id) {
            case 0:
                chokeHandler();
                break;
            case 1:
                unChokeHandler();
                break;
            case 4:
                haveHandler();
                break;
            case 5:
                bitfieldHandler();
                break;
            case 7:
                chokeHandler();
                break;                    
            default:
                break;
        }
    }
}

function isHandShake(msg) {
    return msg.length === msg.readUint8(0) + 49 && msg.toString('utf8', 1) === 'BitTorrent protocol';
}