export type RenderMarker = {
  time: any;
  price: number;
  color: string;
  type: "signal" | "structure" | "breakout";
};

export type RenderLine = {
  points: {
    time: any;
    value: number;
  }[];
  color: string;
  width: number;
};

export type RenderPlan = {
  lines: RenderLine[];
  markers: RenderMarker[];
};


