import { hexlify, toUtf8Bytes } from 'ethers/lib/utils';

export function toHex(input: any) {
  return hexlify(toUtf8Bytes(JSON.stringify(input)));
}
