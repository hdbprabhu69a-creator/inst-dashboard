import sharp from "sharp";

async function main(){

    const input="output/page-1.png";

    const {data,info}=await sharp(input)
        .greyscale()
        .raw()
        .toBuffer({resolveWithObject:true});

    const projection:number[]=[];

    for(let y=0;y<info.height;y++){

        let sum=0;

        for(let x=0;x<info.width;x++){

            sum+=data[y*info.width+x];

        }

        projection.push(sum);

    }

    const window=41;
    const half=Math.floor(window/2);

    const smooth:number[]=[];

    for(let y=0;y<projection.length;y++){

        let total=0;
        let count=0;

        for(let k=-half;k<=half;k++){

            const i=y+k;

            if(i>=0 && i<projection.length){

                total+=projection[i];
                count++;

            }

        }

        smooth.push(total/count);

    }

    const threshold=info.width*235;

    console.log("");
    console.log("========== Major Horizontal Regions ==========");
    console.log("");

    let inGap=false;
    let start=0;

    for(let y=0;y<smooth.length;y++){

        if(smooth[y]>threshold){

            if(!inGap){

                start=y;
                inGap=true;

            }

        }else{

            if(inGap){

                const height=y-start;

                if(height>=30){

                    console.log(
                        `Gap : ${start} - ${y} (${height}px)`
                    );

                }

                inGap=false;

            }

        }

    }

}

main().catch(console.error);
