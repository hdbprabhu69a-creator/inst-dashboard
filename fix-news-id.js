const {initializeApp,applicationDefault}=require("firebase-admin/app");
const {getFirestore,FieldValue}=require("firebase-admin/firestore");

initializeApp({
credential:applicationDefault()
});

const db=getFirestore();

(async()=>{

const snap=await db.collection("news").get();

for(const doc of snap.docs){

await doc.ref.update({

id:FieldValue.delete()

});

console.log("Fixed",doc.id);

}

process.exit(0);

})();
