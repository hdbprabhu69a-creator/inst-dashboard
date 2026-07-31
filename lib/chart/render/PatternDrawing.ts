export interface PatternDrawing {

  pattern: string;

  confidence: number;

  lines: {

    from: {
      index: number;
      time: string;
      price: number;
    };

    to: {
      index: number;
      time: string;
      price: number;
    };

  }[];

  targets: number[];

  stopLoss: number;

}


