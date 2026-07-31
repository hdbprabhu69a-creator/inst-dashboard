import type { DeliveryRecord, NormalizedDeliveryRecord } from "./DeliveryTypes";

/** Validates and chronologically orders delivery records without filling market-data gaps. */
export class DeliveryNormalizer {
  normalize(records: readonly DeliveryRecord[]): NormalizedDeliveryRecord[] {
    const normalized = records.map((record) => this.normalizeOne(record));
    normalized.sort((left, right) => left.timestamp - right.timestamp);
    return normalized;
  }
  private normalizeOne(record: DeliveryRecord): NormalizedDeliveryRecord {
    const timestamp = record.date instanceof Date ? record.date.getTime() : Date.parse(record.date);
    if (!record.symbol.trim() || !Number.isFinite(timestamp)) throw new Error("Delivery record requires a symbol and valid date.");
    const values = [record.open, record.high, record.low, record.close, record.volume, record.deliveryQty, record.deliveryPercent];
    if (values.some((value) => !Number.isFinite(value)) || record.volume < 0 || record.deliveryQty < 0) throw new Error(`Invalid numeric delivery record for ${record.symbol}.`);
    return { ...record, symbol: record.symbol.trim().toUpperCase(), date: new Date(timestamp).toISOString().slice(0, 10), timestamp };
  }
}

