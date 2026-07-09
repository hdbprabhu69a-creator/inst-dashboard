import { PDFParse } from "pdf-parse";

console.log("PDFParse prototype methods:");
console.log(
    Object.getOwnPropertyNames(PDFParse.prototype)
);

console.log("");

const parser=new PDFParse();

console.log("Instance methods:");
console.log(
    Object.getOwnPropertyNames(
        Object.getPrototypeOf(parser)
    )
);
