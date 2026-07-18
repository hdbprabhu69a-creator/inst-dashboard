import fs from "node:fs";

const text=fs.readFileSync("contract-note.txt","utf8");

console.log(text.substring(0,12000));
