export function parseNumber(
  value: string | number
) {

  if (
    value === undefined ||
    value === null
  ) {

    return 0;

  }

  return Number(

    String(value)
      .replace(/,/g, "")
      .trim()

  );

}

export function buildDeliveryRecord(
  row: any
) {

  return {

    symbol:
      row.SYMBOL?.trim(),

    date:
      row.DATE1?.trim(),

    volume:
      parseNumber(
        row.TTL_TRD_QNTY
      ),

    deliveryQty:
      parseNumber(
        row.DELIV_QTY
      ),

    deliveryPct:
      parseNumber(
        row.DELIV_PER
      ),

  };

}