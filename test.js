import { buildChoke, buildHandShake } from "./src/message.js";
import { open } from "./src/torrent-parser.js";


const torrent = open(process.argv[2]);

console.log(buildHandShake(torrent).toJSON());