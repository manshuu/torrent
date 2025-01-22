import fs from 'fs';
import bencode from 'bencode'
import tracker from tracker;
import { open } from "torrent-parser";


const torrent = open("pupppy.torrent");


tracker.getPeers(torrent, peers => {
    console.log('List of peers', peers);
})

