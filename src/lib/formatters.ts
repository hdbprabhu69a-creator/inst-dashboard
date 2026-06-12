export function formatPrice(
  value: number
) {

  return Number(
    value || 0
  ).toFixed(2);

}

export function formatVolume(
  volume: number
) {

  if (!volume) {
    return "0";
  }

  if (
    volume >= 10000000
  ) {

    return (
      (
        volume /
        10000000
      ).toFixed(2) +
      " Cr"
    );

  }

  if (
    volume >= 100000
  ) {

    return (
      (
        volume /
        100000
      ).toFixed(2) +
      " L"
    );

  }

  return volume.toLocaleString();

}

export function formatNumber(
  value: number
) {

  return Number(
    value || 0
  ).toLocaleString();

}