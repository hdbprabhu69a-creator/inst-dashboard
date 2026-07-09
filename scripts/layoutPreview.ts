import sharp from "sharp";

async function main(){

    const input="output/page-1.png";
    const output="output/page-1-layout.png";

    const image=sharp(input);

    const meta=await image.metadata();

    if(!meta.width || !meta.height){
        throw new Error("Unable to read image dimensions.");
    }

    const svg=`
<svg width="${meta.width}" height="${meta.height}">
    <rect x="0" y="0" width="${meta.width}" height="180"
          fill="none" stroke="red" stroke-width="6"/>

    <rect x="40" y="220" width="760" height="820"
          fill="none" stroke="lime" stroke-width="6"/>

    <rect x="820" y="220" width="520" height="760"
          fill="none" stroke="cyan" stroke-width="6"/>

    <rect x="760" y="980" width="620" height="980"
          fill="none" stroke="yellow" stroke-width="6"/>

    <rect x="40" y="1040" width="680" height="520"
          fill="none" stroke="magenta" stroke-width="6"/>

    <rect x="40" y="1620" width="680" height="360"
          fill="none" stroke="orange" stroke-width="6"/>
</svg>`;

    await image
        .composite([
            {
                input:Buffer.from(svg),
                top:0,
                left:0
            }
        ])
        .png()
        .toFile(output);

    console.log("");
    console.log("================================");
    console.log(" Layout Preview Generated");
    console.log("================================");
    console.log(output);

}

main().catch(console.error);
