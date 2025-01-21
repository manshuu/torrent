import fs from 'fs';
import bencode from 'bencode'

import tracker from tracker;

const torrent = bencode.decode(fs.readFileSync("puppy.torrent"), 'utf8');

tracker.getPeers(torrent, peers => {
    console.log('List of peers', peers);
})

