export function removeElementFromArray<T>(arr: T[], element: T): T[] {
  const index = arr.indexOf(element);
  if (index === -1) {
    return arr;
  }
  return [...arr.slice(0, index), ...arr.slice(index + 1, arr.length)];
}
