import sharp from "sharp";

async function main(){

    await sharp("output/page-1.png")
        .greyscale()
        .threshold(210)
        .png()
        .toFile("output/page-1-binary.png");

    console.log("");
    console.log("================================");
    console.log(" Binary Image Generated");
    console.log("================================");
    console.log("output/page-1-binary.png");

}

main().catch(console.error);
