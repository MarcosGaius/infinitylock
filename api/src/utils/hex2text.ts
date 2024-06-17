export function hexToText(hex: string): string {
  if (hex.startsWith('0x')) {
    hex = hex.slice(2);
  }
  const buffer = Buffer.from(hex, 'hex');
  return buffer.toString('utf8');
}
