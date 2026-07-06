import { KiteTicker } from "kiteconnect";
import { liveTickHub } from "@/lib/server/stream/LiveTickHub";
import { getSymbolFromToken } from "@/lib/tokenResolver/tokenLookup";

export class KiteLiveService {

  private ticker:any=null;

  private reconnectTimer:NodeJS.Timeout|null=null;

  private running=false;

  private apiKey="";

  private accessToken="";

  private tokens:number[]=[];

  start(
    apiKey:string,
    accessToken:string,
    tokens:number[]
  ){

    if(this.running){

      console.log(
        "[KiteLiveService] Already running"
      );

      return;

    }

    this.running=true;

    this.apiKey=apiKey;
    this.accessToken=accessToken;
    this.tokens=tokens;

    this.connect();

  }

  private connect(){

    console.log(
      "[KiteLiveService] Creating ticker"
    );

    this.ticker=new KiteTicker({
      api_key:this.apiKey,
      access_token:this.accessToken
    });

    if(typeof this.ticker.autoReconnect==="function"){

      this.ticker.autoReconnect(false);

      console.log(
        "[KiteLiveService] Library reconnect disabled"
      );

    }

    this.ticker.on("connect",()=>{

      console.log(
        "[KiteLiveService] Connected"
      );

      this.ticker.subscribe(this.tokens);

      this.ticker.setMode(
        this.ticker.modeFull,
        this.tokens
      );

    });

    this.ticker.on("ticks",(ticks:any[])=>{

      for(const tick of ticks){

        const symbol = getSymbolFromToken(Number(tick.instrument_token));

        if (!symbol) continue;

        liveTickHub.publish({
          symbol,
          lastPrice: Number(tick.last_price),
          time: tick.exchange_timestamp
            ? new Date(tick.exchange_timestamp).getTime()
            : Date.now(),
          raw: tick,
        });

      }

    });

    this.ticker.on("error",(err:any)=>{

      console.error(
        "[KiteLiveService]",
        err?.message||err
      );

    });

    this.ticker.on("close",()=>{

      console.log(
        "[KiteLiveService] Closed"
      );

      this.scheduleReconnect();

    });

    this.ticker.connect();

  }

  private scheduleReconnect(){

    if(!this.running) return;

    if(this.reconnectTimer) return;

    console.log(
      "[KiteLiveService] Reconnecting in 10 sec..."
    );

    this.reconnectTimer=setTimeout(()=>{

      this.reconnectTimer=null;

      try{

        this.ticker?.disconnect();

      }catch{}

      this.ticker=null;

      this.connect();

    },10000);

  }

  stop(){

    this.running=false;

    if(this.reconnectTimer){

      clearTimeout(
        this.reconnectTimer
      );

      this.reconnectTimer=null;

    }

    try{

      this.ticker?.disconnect();

    }catch{}

    this.ticker=null;

  }

}

export const kiteLiveService=
new KiteLiveService();



