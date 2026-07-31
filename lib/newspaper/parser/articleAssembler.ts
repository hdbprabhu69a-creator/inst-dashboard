import {ParsedArticle,splitArticles} from "./articleSegmenter";
import {splitIntoBlocks} from "./textBlocks";

export function assembleArticles(
    page:number,
    text:string
):ParsedArticle[]{

    const blocks=splitIntoBlocks(text);

    const articles:ParsedArticle[]=[];

    for(const block of blocks){

        const lower=block.toLowerCase();

        if(
            lower.includes("market.radar") ||
            lower.includes("commodities.agri.business") ||
            lower.includes("qrcode") ||
            lower.includes("http") ||
            lower.includes("sensex") ||
            lower.includes("nifty")
        ){
            continue;
        }

        const parsed=splitArticles(page,block);

        for(const article of parsed){

            if(
                article.headline.length>10 &&
                article.body.length>80
            ){
                articles.push(article);
            }

        }

    }

    return articles;

}

