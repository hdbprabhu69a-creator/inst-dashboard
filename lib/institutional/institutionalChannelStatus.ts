export function getInstitutionalChannelStatus(
  cmp: number,
  channel: any
) {
  if (!channel)
    return null;

  return {
    upper: channel.upper,
    lower: channel.lower,
    width: channel.width,
    status:
      cmp > channel.upper
        ? "BREAKOUT"
        : cmp < channel.lower
        ? "BREAKDOWN"
        : "INSIDE",
  };
}
