export interface VolumeAnalysisResult{

  currentVolume:number;

  avgVolume5:number;
  avgVolume20:number;
  avgVolume50:number;

  avgDelivery5:number;
  avgDelivery10:number;
  avgDelivery20:number;

  relativeVolume:number;

  volumeTrend:string;

  participation:string;

  accumulationDistribution:string;

  priceVolumeConfirmation:string;

  breakoutConfirmation:string;
  breakdownConfirmation:string;

  buyingSellingClimax:string;

  dryVolume:boolean;

  volumeScore:number;
  deliveryScore:number;
  institutionalScore:number;

  institutionalVerdict:string;

  sma20:number;
  sma50:number;
  sma100:number;
  sma200:number;

  above20:boolean;
  above50:boolean;
  above100:boolean;
  above200:boolean;

  bullAlignment:boolean;
  bearAlignment:boolean;
}
