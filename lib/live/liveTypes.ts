export interface LiveTick {
  symbol: string;

  token: number;

  lastPrice: number;

  open?: number;
  high?: number;
  low?: number;
  close?: number;

  volume?: number;

  time: number;
}


