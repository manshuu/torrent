import fs from 'fs';
import bencode from 'bencode'
import { getPeers } from "./tracker.js";
import { infoHash, open, size } from "./torrent-parser.js";
import { genId } from './util.js';


const torrent = open("puppy.torrent");
// console.log("torrent:", torrent);

const info = infoHash(torrent);
console.log("infoHash:", info);

const tSize = size(torrent);
console.log("size:", tSize);

const id = genId();
console.log("id:", id);

getPeers(torrent, peers => {
    console.log('List of peers', peers);
})

