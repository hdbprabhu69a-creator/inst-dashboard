import sharp from "sharp";
import fs from "node:fs/promises";

type Region = {
    x:number;
    y:number;
    width:number;
    height:number;
};

async function main(){

    const input="output/page-1-closed.png";

    const {data,info}=await sharp(input)
        .greyscale()
        .raw()
        .toBuffer({resolveWithObject:true});


    const horizontal:number[]=[];


    for(let y=0;y<info.height;y++){

        let count=0;

        for(let x=0;x<info.width;x++){

            const pixel=data[y*info.width+x];

            if(pixel<100){
                count++;
            }

        }

        horizontal.push(count);

    }


    const bands:{
        start:number;
        end:number;
    }[]=[];


    let active=false;
    let start=0;


    for(let y=0;y<horizontal.length;y++){

        if(horizontal[y]>info.width*0.02){

            if(!active){
                start=y;
                active=true;
            }

        }
        else{

            if(active){

                if(y-start>40){

                    bands.push({
                        start,
                        end:y
                    });

                }

                active=false;
            }

        }

    }


    const regions:Region[]=[];


    for(const band of bands){

        regions.push({

            x:0,

            y:band.start,

            width:info.width,

            height:band.end-band.start

        });

    }


    await fs.writeFile(

        "output/page-1-regions.json",

        JSON.stringify(
            regions,
            null,
            2
        )

    );


    console.log("");
    console.log("================================");
    console.log(" BUILD-012C REGION DETECTOR");
    console.log("================================");
    console.log("");

    console.log(
        JSON.stringify(
            regions,
            null,
            2
        )
    );

}

main().catch(console.error);
