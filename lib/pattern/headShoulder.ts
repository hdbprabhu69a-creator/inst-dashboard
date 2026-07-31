import {
  SwingPoint,
} from "./types";

export function slope(

  a: SwingPoint,

  b: SwingPoint

): number {

  const dx =
    b.index - a.index;

  if (dx === 0)
    return 0;

  return (
    b.price -
    a.price
  ) / dx;

}

export function intercept(

  point: SwingPoint,

  slope: number

): number {

  return (

    point.price -

    slope *
      point.index

  );

}

export function lineValue(

  slope: number,

  intercept: number,

  x: number

): number {

  return (

    slope * x +

    intercept

  );

}

export function distance(

  a: SwingPoint,

  b: SwingPoint

): number {

  return Math.sqrt(

    Math.pow(

      a.index -
        b.index,

      2

    ) +

      Math.pow(

        a.price -
          b.price,

        2

      )

  );

}

export function priceDistance(

  price: number,

  linePrice: number

): number {

  return Math.abs(

    price -
      linePrice

  );

}

export function isNearLine(

  price: number,

  linePrice: number,

  tolerancePct = 0.5

): boolean {

  const tolerance =

    linePrice *

    tolerancePct /

    100;

  return (

    Math.abs(

      price -

      linePrice

    ) <= tolerance

  );

}

export function midpoint(

  a: SwingPoint,

  b: SwingPoint

) {

  return {

    x:

      (

        a.index +

        b.index

      ) / 2,

    y:

      (

        a.price +

        b.price

      ) / 2,

  };

}

