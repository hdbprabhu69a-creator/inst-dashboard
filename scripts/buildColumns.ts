import fs from "node:fs";

type Row={
    y:number;
    text:string;
    items:{x:number}[];
};

const rows:Row[]=JSON.parse(
    fs.readFileSync("output/page-1-rows.json","utf8")
);

const buckets=new Map<number,number>();

for(const row of rows){

    if(row.items.length===0) continue;

    const left=Math.min(...row.items.map(i=>i.x));

    const bucket=Math.round(left/20)*20;

    buckets.set(
        bucket,
        (buckets.get(bucket)??0)+1
    );

}

const histogram=[...buckets.entries()]
.sort((a,b)=>a[0]-b[0]);

console.log("");
console.log("===== LEFT EDGE HISTOGRAM =====");

for(const [x,c] of histogram){

    console.log(
        `${x.toString().padStart(4)} : ${"*".repeat(c)} (${c})`
    );

}

fs.writeFileSync(
    "output/left-edge-histogram.json",
    JSON.stringify(histogram,null,2)
);
