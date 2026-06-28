export interface DrawingPoint {
  index: number;
  price: number;
}

export interface DrawingLine {
  from: DrawingPoint;
  to: DrawingPoint;
  label?: string;
}

export interface PatternDrawing {
  lines: DrawingLine[];
  targets: number[];
  stopLoss?: number;
}
