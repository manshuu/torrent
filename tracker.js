import dgram from 'dgram';
import { Buffer } from 'buffer';
import { URL } from 'url';
import crypto from 'crypto';

// 1. Send a connect request
// 2. Get the connect response and extract the connection id
// 3. Use the connection id to send an announce request - this is where we tell the tracker which files we’re interested in
// 4. Get the announce response and extract the peers list

export function getPeers(torrent, callabck) {
    const socket = dgram.createSocket('ud4');
    const rawUrl = torrent.annouce;

    // 1.send connectio requst

}

// send connection request
function udpSend(socket, massage, rawUrl, callabck = () => {}) {
    const url = new URL(rawUrl);
    socket.send(massage, 0, massage.length, url.port, url.host, callabck);
}

function respType(resp) {
    // ...
  }
  
  function buildConnReq() {
    const bud = Buffer.alloc(16);

    //connection id = 0x41727101980 == 8 bytes (4 + 4)
    buf.writeUint32BE(0x417, 0);
    buf.writeUint32BE(0x27101980, 4);

    // action connect = 0, 4-bytes 
    bud.writeInt32BE(0, 8);

    // trasaction id 
    crypto.randomBytes(4).copy(buf, 12);

    return buf;
  }
  
  function parseConnResp(resp) {
    return {
        action : resp.readUint32BE(0),
        trasactionId : resp.readUint32BE(4),
        connectionId : resp.slice(8)
    }
  }
  
  function buildAnnounceReq(connId) {
    // ...
  }
  
  function parseAnnounceResp(resp) {
    // ...
  }