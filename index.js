import fs from 'fs';
import bencode from 'bencode'
import { getPeers } from "./tracker.js";
import { open } from "./torrent-parser.js";


const torrent = open("pupppy.torrent");
console.log(torrent);

getPeers(torrent, peers => {
    console.log('List of peers', peers);
})

