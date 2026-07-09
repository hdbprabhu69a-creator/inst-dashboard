import { read, grey, close, write } from "image-js";

async function main(){

    const image=await read(
        "output/page-1-binary.png"
    );

    const gray=grey(image);

    const result=close(gray);

    await write(
        "output/page-1-closed.png",
        result
    );

    console.log("");
    console.log("==============================");
    console.log(" Morphology Complete");
    console.log("==============================");
    console.log("output/page-1-closed.png");

}

main().catch(console.error);
