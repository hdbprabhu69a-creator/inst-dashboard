export type TickListener=(tick:any)=>void;

class LiveTickHub{

  private listeners=new Map<number,TickListener>();

  private nextId=1;

  subscribe(listener:TickListener){

    const id=this.nextId++;

    this.listeners.set(id,listener);

    console.log(
      "[LiveTickHub] Subscribe:",
      id,
      "Total:",
      this.listeners.size
    );

    return ()=>{

      if(this.listeners.delete(id)){

        console.log(
          "[LiveTickHub] Unsubscribe:",
          id,
          "Total:",
          this.listeners.size
        );

      }

    };

  }

  publish(tick:any){

    for(const [id,listener] of this.listeners){

      try{
        listener(tick);

      }catch(err:any){

        console.log(
          "[LiveTickHub] Removing dead listener:",
          id
        );

        this.listeners.delete(id);

      }

    }

  }

  listenerCount(){

    return this.listeners.size;

  }

}

export const liveTickHub=
new LiveTickHub();


