import fs from 'fs';
import bencode from 'bencode'
import crypto from 'crypto';


export function open(filepath) {
    return bencode.decode(fs.readFileSync(filepath), 'utf8');
}

export function size(torrent) {
    const size = (torrent.info.files ? torrent.info.files.map(file => file.length).reduce((accu, curr) => { accu + curr }, 0) : torrent.info.length);
    const buf = Buffer.alloc(8);
    buf.writeBigUint64BE(BigInt(size), 0);
    return buf;
}

export function infoHash(torrent) {
    const info = torrent.info;
    const hash = crypto.createHash("sha1").update(info).digest();
    console.log(hash);
    return hash;
}