import {NextRequest,NextResponse} from "next/server";
import {adminDb} from "@/lib/firebase-admin";

const col=adminDb.collection("corporate_events");

export async function GET(){
  const snap=await col.orderBy("meetingDate").get();
  return NextResponse.json({success:true,data:snap.docs.map(d=>({id:d.id,...d.data()}))});
}

export async function POST(req:NextRequest){
  const body=await req.json();
  body.createdAt=new Date();
  body.updatedAt=new Date();
  const doc=await col.add(body);
  return NextResponse.json({success:true,id:doc.id});
}

export async function PUT(req:NextRequest){
  const body=await req.json();
  await col.doc(body.id).update({...body,updatedAt:new Date()});
  return NextResponse.json({success:true});
}

export async function DELETE(req:NextRequest){
  const id=new URL(req.url).searchParams.get("id");
  if(!id) return NextResponse.json({success:false,message:"Missing id"},{status:400});
  await col.doc(id).delete();
  return NextResponse.json({success:true});
}
