//var crypto = require('crypto');

import { Buffer } from '../buffer/index';


export function zeroextend(str, len) {
  while (str.length < len)
    str = '0' + str;
  return (str);
}

/*
 * Fix (odd) parity bits in a 64-bit DES key.
 */
export function oddpar(buf) {
  for (var j = 0; j < buf.length; j++) {
    var par = 1;
    for (var i = 1; i < 8; i++) {
      par = (par + ((buf[j] >> i) & 1)) % 2;
    }
    buf[j] |= par & 1;
  }
  return buf;
}

/*
 * Expand a 56-bit key buffer to the full 64-bits for DES.
 *
 * Based on code sample in:
 *    http://www.innovation.ch/personal/ronald/ntlm.html
 */

export function expandkey(key56) {

  var key64 = Buffer.alloc(8);

  // @ts-ignore
  key64[0] = (key56.toJSON().data[0] & 0xFE);
  // @ts-ignore
  key64[1] = ((key56.toJSON().data[0] << 7) & 0xFF) | (key56.toJSON().data[1] >> 1);
  // @ts-ignore
  key64[2] = ((key56.toJSON().data[1] << 6) & 0xFF) | (key56.toJSON().data[2] >> 2);
  // @ts-ignore
  key64[3] = ((key56.toJSON().data[2] << 5) & 0xFF) | (key56.toJSON().data[3] >> 3);
  // @ts-ignore
  key64[4] = ((key56.toJSON().data[3] << 4) & 0xFF) | (key56.toJSON().data[4] >> 4);
  // @ts-ignore
  key64[5] = ((key56.toJSON().data[4] << 3) & 0xFF) | (key56.toJSON().data[5] >> 5);
  // @ts-ignore
  key64[6] = ((key56.toJSON().data[5] << 2) & 0xFF) | (key56.toJSON().data[6] >> 6);
  // @ts-ignore
  key64[7] = (key56.toJSON().data[6] << 1) & 0xFF;
  return key64;
}

/*
 * Convert a binary string to a hex string
 */
export function bintohex(bin) {
  var buf = (Buffer.isBuffer(buf) ? buf : Buffer.alloc(bin, 'binary'));
  var str = Buffer.from(buf).toString('hex').toUpperCase();
  return zeroextend(str, 32);
}


