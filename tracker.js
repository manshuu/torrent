import dgram from 'dgram';
import { Buffer } from 'buffer';
import { URL } from 'url';


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
    // ...
  }
  
  function parseConnResp(resp) {
    // ...
  }
  
  function buildAnnounceReq(connId) {
    // ...
  }
  
  function parseAnnounceResp(resp) {
    // ...
  }