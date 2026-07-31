export interface ParsedArticle{

    id:string;

    page:number;

    headline:string;

    body:string;

}

function isHeadline(line:string){

    const t=line
        .replace(/\s+/g," ")
        .trim();

    if(t.length<20) return false;

    if(t.length>160) return false;

    if(/[.!?]$/.test(t)) return false;

    const words=t.split(/\s+/);

    if(words.length<3) return false;

    const caps=words.filter(w=>/^[A-Z]/.test(w)).length;

    const ratio=caps/words.length;

    return ratio>=0.6;

}

export function splitArticles(
    page:number,
    text:string
):ParsedArticle[]{

    const lines=text
        .replace(/\r/g,"")
        .split("\n")
        .map(x=>x.trim())
        .filter(Boolean);

    const articles:ParsedArticle[]=[];

    let current:ParsedArticle|null=null;

    for(const line of lines){

        if(isHeadline(line)){

            if(current){

                current.body=current.body.trim();

                if(current.body.length>40){

                    articles.push(current);

                }

            }

            current={

                id:`${page}-${articles.length+1}`,

                page,

                headline:line,

                body:""

            };

            continue;

        }

        if(current){

            current.body+=
                (current.body?" ":"")+line;

        }

    }

    if(current){

        current.body=current.body.trim();

        if(current.body.length>40){

            articles.push(current);

        }

    }

    return articles;

}

