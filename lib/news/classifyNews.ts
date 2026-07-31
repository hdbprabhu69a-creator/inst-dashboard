export interface NewsClassification{
    category:string;
    subCategory:string|null;
}

const CATEGORY_RULES={

RBI:[
"rbi","repo","reverse repo","crr","slr","mpc",
"forex reserves","fcnr","liquidity","rupee","swap facility"
],

Policy:[
"cabinet","government","gst","budget","ministry","policy","approval"
],

Economy:[
"gdp","cpi","wpi","iip","pmi","inflation",
"industrial production","core infrastructure",
"infrastructure output","fiscal deficit",
"current account","economic growth"
],

Corporate:[
"earnings","results","dividend","bonus","split",
"order win","acquisition","merger","stake sale","board meeting"
],

Global:[
"fed","ecb","boj","china","usa","us ",
"europe","world bank","imf","geopolitical"
]

};

const COMMODITIES=[

{sub:"Gold",words:["gold","bullion","gold etf"]},
{sub:"Silver",words:["silver"]},
{sub:"Crude",words:["crude prices","brent","wti","opec","oil prices","oil market"]},
{sub:"Copper",words:["copper"]},
{sub:"Zinc",words:["zinc"]},
{sub:"Tin",words:["tin"]},
{
sub:"Agri",
words:[
"kharif","rabi","crop","crops","sowing","harvest",
"agriculture","agricultural","paddy","rice","wheat",
"cotton","soybean","monsoon","fertiliser","fertilizer",
"sugar","tea","coffee","rubber"
]
}

];

export function classifyNews(title="",summary=""):NewsClassification{

const text=`${title} ${summary}`.toLowerCase();

if(CATEGORY_RULES.RBI.some((k:string)=>text.includes(k)))
    return{category:"RBI",subCategory:null};

if(CATEGORY_RULES.Policy.some((k:string)=>text.includes(k)))
    return{category:"Policy",subCategory:null};

if(CATEGORY_RULES.Corporate.some((k:string)=>text.includes(k)))
    return{category:"Corporate",subCategory:null};

// Agri gets priority over Economy
const agri=COMMODITIES.find(c=>c.sub==="Agri");
if(agri && agri.words.some((w:string)=>text.includes(w)))
    return{category:"Commodity",subCategory:"Agri"};

if(CATEGORY_RULES.Economy.some((k:string)=>text.includes(k)))
    return{category:"Economy",subCategory:null};

for(const c of COMMODITIES){

    if(c.sub==="Agri") continue;

    if(c.words.some((w:string)=>text.includes(w)))
        return{
            category:"Commodity",
            subCategory:c.sub
        };

}

if(CATEGORY_RULES.Global.some((k:string)=>text.includes(k)))
    return{category:"Global",subCategory:null};

return{
    category:"Macro",
    subCategory:null
};

}

