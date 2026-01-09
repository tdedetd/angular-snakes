export function toRgb(hex: string): { r: number, g: number, b: number } {
  const hexWithoutSharp = hex.startsWith('#') ? hex.slice(1) : hex;

  const normalizedHex = hexWithoutSharp.length === 3
    ? `${hexWithoutSharp[0]}${hexWithoutSharp[0]}${
      hexWithoutSharp[1]}${hexWithoutSharp[1]}${hexWithoutSharp[2]}${hexWithoutSharp[2]}`
    : hexWithoutSharp;

  if (normalizedHex.length !== 6) {
    throw new Error(`invalid hex format - ${normalizedHex}`);
  }

  const r = parseInt(normalizedHex.substring(0, 2), 16);
  const g = parseInt(normalizedHex.substring(2, 4), 16);
  const b = parseInt(normalizedHex.substring(4, 6), 16);

  return { r, g, b };
}
