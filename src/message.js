import { Buffer } from "buffer";
import { infoHash } from "./torrent-parser.js";
import { genId } from "./util.js";

function buildHandShake(torrent) {
    const buf = Buffer.alloc(68);

    // pstrlen
    buf.writeUint8(19, 0);
    
    // pstr 
    buf.write("BitTorrent protocol", 1);

    // reserved 8-bytes 
    buf.writeUint32BE(0, 20);
    buf.writeUint32BE(0, 24);

    // info hash 20-bytes 
    infoHash(torrent).copy(buf, 28);

    // peer id 
    genId().copy(buf, 48);
    
    return buf;
}

const buildKeepAlive = () => Buffer.alloc(4);

function buildChoke() {
    const buf = Buffer.alloc(5);

    // <length prefix> = 1. 4 bytes 
    buf.writeUint32BE(1, 0);

    // <messageId> = 1, 1 byte
    buf.writeUint8(0, 4);

    return buf;
}

function buildUnChoke() {
    const buf = Buffer.alloc(5);

    // <length prefix> = 1. 4 bytes
    buf.writeUint32BE(1, 0);

    // // <messageId> = 1, 1 byte
    buf.writeUint8(1, 4);
}

function buildInterested() {
    const buf = Buffer.alloc(5);

    // <length prefix> = 1. 4 bytes
    buf.writeUint32BE(1, 0);

    // // <messageId> = 2, 1 byte
    buf.writeUint8(2, 4);
}

function buildNotInterested() {
    const buf = Buffer.alloc(5);

    // <length prefix> = 1. 4 bytes
    buf.writeUint32BE(1, 0);

    // // <messageId> = 3, 1 byte
    buf.writeUint8(3, 4);
}

function buildHave(payload) {
    const buf = Buffer.alloc(9);

    // <length prefix> = 1. 4 byteswee
    buf.writeUint32BE(5, 0);

    // <messageId> = 4, 1 byte
    buf.writeUint8(1, 4);

    // peice index 4 bytes 
    buf.writeUint32BE(payload.index, 5);

    return buf;
}

function buildBitfield(bitfield) {
    const buf = Buffer.alloc(14);

    // <length prefix> = 1. 4 byteswee
    buf.writeUint32BE(bitfield.length + 1,  0);

    // <messageId> = 4, 1 byte
    buf.writeUint8(5, 4);

    // bitfeild 
    bitfield.copy(buf, 5);

    return buf;
}

function buildRequest(payload) {
    const buf = Buffer.alloc(17);

    // <length prefix> = 1. 4 byteswee
    buf.writeUint32BE(13, 0);

    // <messageId> = 6, 1 byte
    buf.writeUint8(6, 4);

    // peice number 4 bytes 
    buf.writeUint32BE(payload.index, 5);

    // offset within peice 
    buf.writeUint32BE(payload.begin, 9);

    // number of bytes requested 
    buf.writeUint32BE(payload.length, 13);
    
    return buf;
}

function buildPiece(payload) {
    const buf = Buffer.alloc(payload.block.length + 13);

    // <length prefix> = 1. 4 byteswee
    buf.writeUint32BE(payload.block.length + 9, 0);

    // <messageId> = 6, 1 byte
    buf.writeUint8(7, 4);

    // peice number 4 bytes 
    buf.writeUint32BE(payload.index, 5);

    // offset within peice 
    buf.writeUint32BE(payload.begin, 9);

    // number of bytes requested 
    payload.block.copy(buf, 13);

    return buf;
}

function buildCancel() {
    const buf = Buffer.alloc(17);

    // <length prefix> = 1. 4 byteswee
    buf.writeUint32BE(13, 0);

    // <messageId> = 6, 1 byte
    buf.writeUint8(8, 4);

    // peice number 4 bytes 
    buf.writeUint32BE(payload.index, 5);

    // offset within peice 
    buf.writeUint32BE(payload.begin, 9);

    // number of bytes requested 
    buf.writeUint32BE(payload.length, 13);
    return buf;
}

function buildPort(payload) {
    const buf = Buffer.alloc(7);

    buf.writeUint32BE(3, 0);

    buf.writeUint8(9, 4);

    buf.writeUint16BE(payload, 5);

    return buf;
}

export { 
    buildHandShake, 
    buildChoke, 
    buildInterested, 
    buildNotInterested,
    buildHave,
    buildCancel,
    buildPiece,
    buildPort,
    buildRequest,
    buildChoke,
    buildUnChoke,
    buildBitfield,
    buildKeepAlive
};