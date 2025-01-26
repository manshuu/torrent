import fs from 'fs';
import bencode from 'bencode'
import { getPeers } from "./tracker.js";
import { infoHash, open, size } from "./torrent-parser.js";
import { genId } from './util.js';


const torrent = open("Wicked.torrent");
// console.log("torrent:", torrent);

getPeers(torrent, peers => {
    console.log('List of peers', peers);
})

