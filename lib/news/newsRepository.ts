import {adminDb} from "@/lib/firebase-admin";
import {NewsDocument} from "./newsTypes";
import {classifyNews} from "./classifyNews";

const COLLECTION="news";

export async function getAllNews(){

    const snapshot=await adminDb
        .collection(COLLECTION)
        .orderBy("date","desc")
        .get();

    return snapshot.docs.map(doc=>{

    const data=doc.data();

    return{

        ...data,

        id:doc.id

    };

});

}

export async function createNews(news:NewsDocument){

    const {id,...newsData}=news;

    const cls=classifyNews(

        (newsData as any).title ?? (newsData as any).headline ?? "",

        (newsData as any).summary ?? ""

    );

    const ref=await adminDb
        .collection(COLLECTION)
        .add({

            ...newsData,

            category:cls.category,

            subCategory:cls.subCategory ?? null,

            createdAt:new Date(),

            updatedAt:new Date()

        });

    return ref.id;

}

export async function updateNews(id:string,data:Partial<NewsDocument>){

    await adminDb
        .collection(COLLECTION)
        .doc(id)
        .update({

            ...data,

            updatedAt:new Date()

        });

}

export async function deleteNews(id:string){

    await adminDb
        .collection(COLLECTION)
        .doc(id)
        .delete();

}






