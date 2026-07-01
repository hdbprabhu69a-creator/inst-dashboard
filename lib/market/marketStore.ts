let cache: any = null;
let lastFetch = 0;

export async function getSharedMarketData(fetcher: () => Promise<any>) {
  const now = Date.now();

  // 5 second global cache
  if (cache && now - lastFetch < 5000) {
    return cache;
  }

  cache = await fetcher();
  lastFetch = now;

  return cache;
}