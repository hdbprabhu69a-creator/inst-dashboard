import {
  SwingPoint,
  TrendLine,
} from "./types";

import {
  slope,
  intercept,
  lineValue,
  isNearLine,
} from "./geometry";

export function buildTrendLines(

  swings: SwingPoint[],

  type: "HIGH" | "LOW"

): TrendLine[] {

  const points =

    swings.filter(

      s => s.type === type

    );

  const lines: TrendLine[] = [];

  if (points.length < 2)
    return lines;

  for (

    let i = 0;

    i < points.length - 1;

    i++

  ) {

    for (

      let j = i + 1;

      j < points.length;

      j++

    ) {

      const start =
        points[i];

      const end =
        points[j];

      const m =
        slope(
          start,
          end
        );

      const b =
        intercept(
          start,
          m
        );

      let touches = 2;

      let broken = false;

      for (

        let k = j + 1;

        k < points.length;

        k++

      ) {

        const p =
          points[k];

        const expected =

          lineValue(

            m,

            b,

            p.index

          );

        if (

          isNearLine(

            p.price,

            expected,

            0.6

          )

        ) {

          touches++;

        }

        else {

          if (

            type === "HIGH"

          ) {

            if (

              p.price >

              expected

            ) {

              broken = true;

              break;

            }

          }

          else {

            if (

              p.price <

              expected

            ) {

              broken = true;

              break;

            }

          }

        }

      }

      if (

        touches >= 3

      ) {

        lines.push({

          start,

          end,

          slope: m,

          intercept: b,

          touches,

          broken,

        });

      }

    }

  }

  return rankTrendLines(
    lines
  );

}

export function rankTrendLines(

  lines: TrendLine[]

): TrendLine[] {

  return lines.sort(

    (a, b) => {

      if (

        b.touches !==

        a.touches

      ) {

        return (

          b.touches -

          a.touches

        );

      }

      return (

        Math.abs(

          a.slope

        ) -

        Math.abs(

          b.slope

        )

      );

    }

  );

}

export function getBestTrendLine(

  lines: TrendLine[]

): TrendLine | null {

  if (

    lines.length === 0

  )

    return null;

  return lines[0];

}