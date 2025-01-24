import fs from 'fs';
import bencode from 'bencode'
import crypto from 'crypto';


export function open(filepath) {
    return bencode.decode(fs.readFileSync(filepath), 'utf8');
}

export function size(torrent) {
    let size = (torrent.info.files != undefined) ? torrent.info.files.map(file => file.length).reduce((accu, curr) => accu + curr , 0) : torrent.info.length;
    const sizeBigInt = BigInt(size);
    const buf = Buffer.alloc(8);
    buf.writeBigUInt64BE(sizeBigInt);
    return buf;
}

export function infoHash(torrent) {
    const info = bencode.encode(torrent.info);
    const hash = crypto.createHash("sha1").update(info).digest();
    console.log("string infohash : ", crypto.createHash("sha1").update(info.toString()).digest());
    return hash;
}