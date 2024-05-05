import { bintohex, expandkey, oddpar } from './common';
import { Buffer } from '../buffer/index';
import { MD4 } from '../crypto/md4';
import { createDES } from './desutil';

/*
 * Generate the LM Hash
 */
export function lmhashbuf(inputstr) {
  /* ASCII --> uppercase */
  var x = inputstr.substring(0, 14).toUpperCase();
  var xl = Buffer.byteLength(x, 'ascii');

  /* null pad to 14 bytes */
  var y = new Buffer(14);

  y.write(x, 0, xl, 'ascii');
  y.fill(0, xl);

  // @ts-ignore
  let pandKey = y.slice(0, 7);
  // @ts-ignore
  let pandKey2 = y.slice(7, 14);

  /* insert odd parity bits in key */
  var halves = [
    oddpar(expandkey(pandKey)),
    oddpar(expandkey(pandKey2))
  ];
  /* DES encrypt magic number "KGS!@#$%" to two
   * 8-byte ciphertexts, (ECB, no padding)
   */
  var buf = new Buffer(16);
  var pos = 0;
  halves.forEach(function (k) {
    var des = createDES(k);
    var str = des.update('KGS!@#$%', 'binary', 'binary');
    buf.write(str, pos, pos + 8, 'binary');
    pos += 8;
  });
  return buf;
}


export function nthashbuf(str) {
  // /* take MD4 hash of UCS-2 encoded password */
  var ucs2 = Buffer.from(str, 'ucs2');
  MD4.update(ucs2);
  let tembuf = MD4.digest();
  return tembuf;
}

export function lmhash(is) {
  return bintohex(lmhashbuf(is));
}

export function nthash(is) {
  return bintohex(nthashbuf(is));
}

