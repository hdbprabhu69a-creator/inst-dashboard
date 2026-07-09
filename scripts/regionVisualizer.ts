import sharp from "sharp";
import fs from "node:fs/promises";

async function main(){

    const input="output/page-1-closed.png";

    const {data,info}=await sharp(input)
        .greyscale()
        .raw()
        .toBuffer({resolveWithObject:true});

    const svg:string[]=[];

    svg.push(
`<svg width="${info.width}" height="${info.height}" xmlns="http://www.w3.org/2000/svg">`
    );

    // ---------- Horizontal bands ----------
    const h:number[]=[];

    for(let y=0;y<info.height;y++){

        let ink=0;

        for(let x=0;x<info.width;x++){

            if(data[y*info.width+x]<120) ink++;

        }

        h.push(ink);

    }

    let active=false;
    let y0=0;

    for(let y=0;y<h.length;y++){

        if(h[y]>info.width*0.02){

            if(!active){
                y0=y;
                active=true;
            }

        }else{

            if(active){

                if(y-y0>60){

                    svg.push(
`<rect x="0" y="${y0}" width="${info.width}" height="${y-y0}" fill="none" stroke="red" stroke-width="8"/>`
                    );

                    // ---------- Vertical split ----------
                    const v:number[]=[];

                    for(let x=0;x<info.width;x++){

                        let ink=0;

                        for(let yy=y0;yy<y;yy++){

                            if(data[yy*info.width+x]<120) ink++;

                        }

                        v.push(ink);

                    }

                    let vx=false;
                    let x0=0;

                    for(let x=0;x<v.length;x++){

                        if(v[x]>(y-y0)*0.02){

                            if(!vx){

                                x0=x;
                                vx=true;

                            }

                        }else{

                            if(vx){

                                if(x-x0>80){

                                    svg.push(
`<rect x="${x0}" y="${y0}" width="${x-x0}" height="${y-y0}" fill="none" stroke="lime" stroke-width="5"/>`
                                    );

                                }

                                vx=false;

                            }

                        }

                    }

                }

                active=false;

            }

        }

    }

    svg.push("</svg>");

    await fs.writeFile(
        "output/page-1-regions.svg",
        svg.join("")
    );

    await sharp(input)
        .composite([
            {
                input:Buffer.from(svg.join("")),
                top:0,
                left:0
            }
        ])
        .png()
        .toFile("output/page-1-regions.png");

    console.log("");
    console.log("================================");
    console.log(" 2D Region Preview Generated");
    console.log("================================");
    console.log("output/page-1-regions.png");

}

main().catch(console.error);
