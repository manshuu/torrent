import net from "net";
import { getPeers } from "./tracker.js";

export default function(torrent) {
    getPeers(torrent, peers => {
        peers.forEach(peer => {
            download(peer);
        });
    })
}


function download(peer) {
    const socket = new net.Socket();
    socket.on('error', console.log);
    socket.connect(peer.port, peer.ip, () => {

    });
    
    socket.on('data', data => {

    });
}