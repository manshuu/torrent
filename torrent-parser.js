import fs from 'fs';
import bencode from 'bencode'



export function open(filepath) {
    return bencode.decode(fs.readFileSync("puppy.torrent"), 'utf8');
}

export function size(torrent) {

}

export function infoHash(torrent) {

}