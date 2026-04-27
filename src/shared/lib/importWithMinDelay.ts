/**
 * Минимальная длительность ожидания параллельно с асинхронной загрузкой.
 * Итог: max(minMs, время loader) — удобно для lazy-роутов и будущих запросов,
 * чтобы лоадер не мигал и не было «пустого» кадра при быстром ответе.
 */
export function importWithMinDelay<T>(loader: () => Promise<T>, minMs: number): Promise<T> {
  return Promise.all([
    loader(),
    new Promise<void>((resolve) => {
      window.setTimeout(resolve, minMs);
    }),
  ]).then(([result]) => result);
}
