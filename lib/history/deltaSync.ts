export function getDeltaFromDate(lastDate?: string): Date {
  if (!lastDate) {
    const d = new Date();
    d.setFullYear(d.getFullYear() - 2);
    return d;
  }

  const d = new Date(lastDate);
  d.setDate(d.getDate() + 1);
  return d;
}

export function getToday(): Date {
  return new Date();
}

