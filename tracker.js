import dgram from 'dgram';
import { Buffer } from 'buffer';
import { URL} from 'url';
import crypto from 'crypto';
import { genId } from './util.js';
import { error } from 'console';
// 1. Send a connect request
// 2. Get the connect response and extract the connection id
// 3. Use the connection id to send an announce request - this is where we tell the tracker which files we’re interested in
// 4. Get the announce response and extract the peers list

export function getPeers(torrent, callabck) {
    const socket = dgram.createSocket('udp4');
    const url = torrent.announce;
    console.log(typeof url);
    // 1.send connectio requst
    udpSend(socket, buildConnReq(), url);

    socket.on('massage', response => {
        if (respType(response)  === "conenct") {
            // 2 
            const connResp = parseConnResp(response);
            // 3 
            const announceReq = buildAnnounceReq(connResp.connectionId);
            udpSend(socket, announceRe, url);
        }
        else if (respType(response) === "announce") {
            // 4
            const announceResp = parseAnnounceResp(response);
            callabck(announceResp.peers);
        }
    })

}

// send connection request
function udpSend(socket, massage, rawUrl, callabck = () => {}) {
    const url = new URL(rawUrl);
    socket.send(massage, 0, massage.length, url.port, url.host, callabck);
}

function respType(resp) {
    if (resp.action === 0) {
        return "connect";
    }
    else if (resp.action === 1) {
        return "announce";
    }
    else {
        throw new error("Invalid response type");
    }
}

function buildConnReq() {
    const buf = Buffer.alloc(16);

    //connection id = 0x41727101980 == 8 bytes (4 + 4)
    buf.writeUint32BE(0x417, 0);
    buf.writeUint32BE(0x27101980, 4);

    // action connect = 0, 4-bytes 
    buf.writeInt32BE(0, 8);

    // trasaction id 
    crypto.randomBytes(4).copy(buf, 12);

    return buf;
}

function parseConnResp(resp) {
    return {
        action: resp.readUint32BE(0), 
        trasactionId: resp.readUint32BE(4),
        connectionId: resp.slice(8)
    }
}

// port = between 6881 and 6889
function buildAnnounceReq(connId, torrent, port = 6881) {
    let buf = Buffer.allocUnsafe(98);

    // coonnection_id = 8-bytes, 0 
    connId.copy(buf, 0);

    // action = 1, 4-bytes. 8
    buf.writeUint32BE(1, 8);

    // trasaction_id = 4-bytes, 12
    crypto.randomBytes(4).copy(buf, 12);

    // info hash = 20-byte, 16
    torrentParser.infoHash(torrent).copy(buf, 16);

    // peer id = 20-byte, 36 
    genId.copy(buf, 36);

    // downloaded = 8-bytes, 56
    Buffer.alloc(8).copy(buf, 56);

    // left 8-bytes, 64
    torrentParser.size(torrent).copy(buf, 64);

    // uplaoded 8-bytes, 72
    Buffer.alloc(8).copy(buf, 72);

    // event 4-bytes 80
    buf.writeUint32BE(0, 80);

    // ip adress=0, 4-bytes, 84
    buf.writeUint32BE(0, 84);

    // key=random, 4-bytes, 88
    crypto.randomBytes(4).copy(buf, 88);

    // num_want = -1, 4-bytes, 92
    buf.writeInt32BE(-1, 92);

    // port 2-bytes, 96
    buf.writeUInt16BE(port, 96);

    return buf;
}

function parseAnnounceResp(resp) {

    function group(interable, groupSize) {
        let groups = []
        for (let i = 0; i < interable.length; i += groupSize) {
            ips.push(interable.slice(i, i + groupSize));
        }
        return groups;
    }

    return {
        action: resp.readUint32BE(0), // 4-bytes, 0
        trasactionId: resp.readUint32BE(4), // 4- bytes, 4
        interval: resp.readUint32BE(8), // 4-bytes, 8
        leechers: resp.readUint32BE(12), // 4-bytes, 12 
        seeders: resp.readUint32BE(16), // 4-bytes, 16
        peers: group(resp.slice(20), 6).map(address => {
            return {
                ip: address.slice(0, 4).join('.'),
                port: address.readUint16BE(4)
            }
        })
    }
}