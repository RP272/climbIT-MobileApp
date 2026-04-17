export function chunkIntoColumns<T>(items: readonly T[] | null | undefined, columnSize: number) {
  const columns: T[][] = [];
  const safeItems = items ?? [];

  for (let index = 0; index < safeItems.length; index += columnSize) {
    columns.push(safeItems.slice(index, index + columnSize));
  }

  return columns;
}
