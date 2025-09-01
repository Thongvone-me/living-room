// Returns current Laos time (UTC+7) as ISO string
export function getLaosTime() {
  return new Date(Date.now() + 7 * 60 * 60 * 1000).toISOString();
}
