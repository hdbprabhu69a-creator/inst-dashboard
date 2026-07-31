import {ParsedArticle} from "./articleSegmenter";

function isHeadline(text:string){

    const t=text
        .replace(/\s+/g," ")
        .trim();

    if(t.length<12) return false;

    if(t.length>140) return false;

    if(/[.:;]$/.test(t))
        return false;

    const words=t.split(/\s+/);

    if(words.length<2 || words.length>18)
        return false;

    const titleWords=words.filter(w=>
        /^[A-Z][a-zA-Z&()'/-]*$/.test(w)
    ).length;

    const ratio=titleWords/words.length;

    return ratio>=0.55;

}

export function mergeFragments(
    fragments:ParsedArticle[]
):ParsedArticle[]{

    const articles:ParsedArticle[]=[];

    let current:ParsedArticle|null=null;

    for(const f of fragments){

        if(!current){

            current={...f};

            continue;

        }

        if(isHeadline(f.headline)){

            articles.push(current);

            current={...f};

            continue;

        }

        current.body=
            (
                current.body+
                " "+
                f.headline+
                " "+
                f.body
            )
            .replace(/\s+/g," ")
            .trim();

    }

    if(current){

        articles.push(current);

    }

    return articles;

}

