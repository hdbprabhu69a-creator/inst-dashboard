export class LiveMarketStream {

  constructor(
    _apiKey:string,
    _accessToken:string
  ){}

  connect(
    _tokens:number[]
  ){
    console.warn(
      "[Legacy LiveMarketStream] Disabled"
    );
  }

  on(
    _token:number,
    _listener:any
  ){}

  disconnect(){}

}

