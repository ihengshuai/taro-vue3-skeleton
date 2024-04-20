export function sleep(wait = 500, result?: any) {
  return new Promise(resolve => setTimeout(() => resolve(result), wait));
}
