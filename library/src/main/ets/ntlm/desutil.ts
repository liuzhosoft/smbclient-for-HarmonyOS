import buffer from '@ohos.buffer';
import util from '@ohos.util';


class _utils {
  static ip(inL, inR, out, off) {
    var outL = 0;
    var outR = 0;

    for (var i = 6; i >= 0; i -= 2) {
      for (var j = 0; j <= 24; j += 8) {
        outL <<= 1;
        outL |= (inR >>> (j + i)) & 1;
      }
      for (var j = 0; j <= 24; j += 8) {
        outL <<= 1;
        outL |= (inL >>> (j + i)) & 1;
      }
    }

    for (var i = 6; i >= 0; i -= 2) {
      for (var j = 1; j <= 25; j += 8) {
        outR <<= 1;
        outR |= (inR >>> (j + i)) & 1;
      }
      for (var j = 1; j <= 25; j += 8) {
        outR <<= 1;
        outR |= (inL >>> (j + i)) & 1;
      }
    }

    out[off + 0] = outL >>> 0;
    out[off + 1] = outR >>> 0;
  };

  static rip(inL, inR, out, off) {
    var outL = 0;
    var outR = 0;

    for (var i = 0; i < 4; i++) {
      for (var j = 24; j >= 0; j -= 8) {
        outL <<= 1;
        outL |= (inR >>> (j + i)) & 1;
        outL <<= 1;
        outL |= (inL >>> (j + i)) & 1;
      }
    }
    for (var i = 4; i < 8; i++) {
      for (var j = 24; j >= 0; j -= 8) {
        outR <<= 1;
        outR |= (inR >>> (j + i)) & 1;
        outR <<= 1;
        outR |= (inL >>> (j + i)) & 1;
      }
    }

    out[off + 0] = outL >>> 0;
    out[off + 1] = outR >>> 0;
  };

  static pc1(inL, inR, out, off) {
    var outL = 0;
    var outR = 0;

    // 7, 15, 23, 31, 39, 47, 55, 63
    // 6, 14, 22, 30, 39, 47, 55, 63
    // 5, 13, 21, 29, 39, 47, 55, 63
    // 4, 12, 20, 28
    for (var i = 7; i >= 5; i--) {
      for (var j = 0; j <= 24; j += 8) {
        outL <<= 1;
        outL |= (inR >> (j + i)) & 1;
      }
      for (var j = 0; j <= 24; j += 8) {
        outL <<= 1;
        outL |= (inL >> (j + i)) & 1;
      }
    }
    for (var j = 0; j <= 24; j += 8) {
      outL <<= 1;
      outL |= (inR >> (j + i)) & 1;
    }

    // 1, 9, 17, 25, 33, 41, 49, 57
    // 2, 10, 18, 26, 34, 42, 50, 58
    // 3, 11, 19, 27, 35, 43, 51, 59
    // 36, 44, 52, 60
    for (var i = 1; i <= 3; i++) {
      for (var j = 0; j <= 24; j += 8) {
        outR <<= 1;
        outR |= (inR >> (j + i)) & 1;
      }
      for (var j = 0; j <= 24; j += 8) {
        outR <<= 1;
        outR |= (inL >> (j + i)) & 1;
      }
    }
    for (var j = 0; j <= 24; j += 8) {
      outR <<= 1;
      outR |= (inL >> (j + i)) & 1;
    }

    out[off + 0] = outL >>> 0;
    out[off + 1] = outR >>> 0;
  };

  static readonly pc2table = [
  // inL => outL
    14, 11, 17, 4, 27, 23, 25, 0, 13, 22, 7, 18, 5, 9, 16, 24, 2, 20, 12,
    21, 1, 8, 15, 26,

    // inR => outR
    15, 4, 25, 19, 9, 1, 26, 16, 5, 11, 23, 8, 12, 7, 17, 0, 22, 3, 10,
    14, 6, 20, 27, 24,
  ];

  static pc2(inL, inR, out, off) {
    var outL = 0;
    var outR = 0;

    let pc2table = _utils.pc2table;

    var len = pc2table.length >>> 1;
    for (var i = 0; i < len; i++) {
      outL <<= 1;
      outL |= (inL >>> pc2table[i]) & 0x1;
    }
    for (var i = len; i < pc2table.length; i++) {
      outR <<= 1;
      outR |= (inR >>> pc2table[i]) & 0x1;
    }

    out[off + 0] = outL >>> 0;
    out[off + 1] = outR >>> 0;
  };

  static r28shl(num, shift) {
    return ((num << shift) & 0xfffffff) | (num >>> (28 - shift));
  };

  static expand(r, out, off) {
    var outL = 0;
    var outR = 0;

    outL = ((r & 1) << 5) | (r >>> 27);
    for (var i = 23; i >= 15; i -= 4) {
      outL <<= 6;
      outL |= (r >>> i) & 0x3f;
    }
    for (var i = 11; i >= 3; i -= 4) {
      outR |= (r >>> i) & 0x3f;
      outR <<= 6;
    }
    outR |= ((r & 0x1f) << 1) | (r >>> 31);

    out[off + 0] = outL >>> 0;
    out[off + 1] = outR >>> 0;
  };

  static readonly sTable = [
    14, 0, 4, 15, 13, 7, 1, 4, 2, 14, 15, 2, 11, 13, 8, 1, 3, 10, 10, 6,
    6, 12, 12, 11, 5, 9, 9, 5, 0, 3, 7, 8, 4, 15, 1, 12, 14, 8, 8, 2, 13,
    4, 6, 9, 2, 1, 11, 7, 15, 5, 12, 11, 9, 3, 7, 14, 3, 10, 10, 0, 5, 6,
    0, 13,

    15, 3, 1, 13, 8, 4, 14, 7, 6, 15, 11, 2, 3, 8, 4, 14, 9, 12, 7, 0, 2,
    1, 13, 10, 12, 6, 0, 9, 5, 11, 10, 5, 0, 13, 14, 8, 7, 10, 11, 1, 10,
    3, 4, 15, 13, 4, 1, 2, 5, 11, 8, 6, 12, 7, 6, 12, 9, 0, 3, 5, 2, 14,
    15, 9,

    10, 13, 0, 7, 9, 0, 14, 9, 6, 3, 3, 4, 15, 6, 5, 10, 1, 2, 13, 8, 12,
    5, 7, 14, 11, 12, 4, 11, 2, 15, 8, 1, 13, 1, 6, 10, 4, 13, 9, 0, 8, 6,
    15, 9, 3, 8, 0, 7, 11, 4, 1, 15, 2, 14, 12, 3, 5, 11, 10, 5, 14, 2, 7,
    12,

    7, 13, 13, 8, 14, 11, 3, 5, 0, 6, 6, 15, 9, 0, 10, 3, 1, 4, 2, 7, 8,
    2, 5, 12, 11, 1, 12, 10, 4, 14, 15, 9, 10, 3, 6, 15, 9, 0, 0, 6, 12,
    10, 11, 1, 7, 13, 13, 8, 15, 9, 1, 4, 3, 5, 14, 11, 5, 12, 2, 7, 8, 2,
    4, 14,

    2, 14, 12, 11, 4, 2, 1, 12, 7, 4, 10, 7, 11, 13, 6, 1, 8, 5, 5, 0, 3,
    15, 15, 10, 13, 3, 0, 9, 14, 8, 9, 6, 4, 11, 2, 8, 1, 12, 11, 7, 10,
    1, 13, 14, 7, 2, 8, 13, 15, 6, 9, 15, 12, 0, 5, 9, 6, 10, 3, 4, 0, 5,
    14, 3,

    12, 10, 1, 15, 10, 4, 15, 2, 9, 7, 2, 12, 6, 9, 8, 5, 0, 6, 13, 1, 3,
    13, 4, 14, 14, 0, 7, 11, 5, 3, 11, 8, 9, 4, 14, 3, 15, 2, 5, 12, 2, 9,
    8, 5, 12, 15, 3, 10, 7, 11, 0, 14, 4, 1, 10, 7, 1, 6, 13, 0, 11, 8, 6,
    13,

    4, 13, 11, 0, 2, 11, 14, 7, 15, 4, 0, 9, 8, 1, 13, 10, 3, 14, 12, 3,
    9, 5, 7, 12, 5, 2, 10, 15, 6, 8, 1, 6, 1, 6, 4, 11, 11, 13, 13, 8, 12,
    1, 3, 4, 7, 10, 14, 7, 10, 9, 15, 5, 6, 0, 8, 15, 0, 14, 5, 2, 9, 3,
    2, 12,

    13, 1, 2, 15, 8, 13, 4, 8, 6, 10, 15, 3, 11, 7, 1, 4, 10, 12, 9, 5, 3,
    6, 14, 11, 5, 0, 0, 14, 12, 9, 7, 2, 7, 2, 11, 1, 4, 14, 1, 7, 9, 4,
    12, 10, 14, 8, 2, 13, 0, 15, 6, 12, 10, 9, 13, 0, 15, 3, 3, 5, 5, 6,
    8, 11,
  ];

  static substitute(inL, inR) {
    let sTable = _utils.sTable;
    var out = 0;
    for (var i = 0; i < 4; i++) {
      var b = (inL >>> (18 - i * 6)) & 0x3f;
      var sb = sTable[i * 0x40 + b];

      out <<= 4;
      out |= sb;
    }
    for (var i = 0; i < 4; i++) {
      var b = (inR >>> (18 - i * 6)) & 0x3f;
      var sb = sTable[4 * 0x40 + i * 0x40 + b];

      out <<= 4;
      out |= sb;
    }
    return out >>> 0;
  };

  static readonly permuteTable = [
    16, 25, 12, 11, 3, 20, 4, 15, 31, 17, 9, 6, 27, 14, 1, 22, 30, 24, 8,
    18, 0, 5, 29, 23, 13, 19, 2, 26, 10, 21, 28, 7,
  ];

  static permute(num) {
    let permuteTable = _utils.permuteTable;
    var out = 0;
    for (var i = 0; i < permuteTable.length; i++) {
      out <<= 1;
      out |= (num >>> permuteTable[i]) & 0x1;
    }
    return out >>> 0;
  };

  static writeUInt32BE(bytes, value, off) {
    bytes[0 + off] = value >>> 24;
    bytes[1 + off] = (value >>> 16) & 0xff;
    bytes[2 + off] = (value >>> 8) & 0xff;
    bytes[3 + off] = value & 0xff;
  };

  static readUInt32BE(bytes: Array<number>, off: number) {
    var res =
      (bytes[0 + off] << 24) |
        (bytes[1 + off] << 16) |
        (bytes[2 + off] << 8) |
      bytes[3 + off];
    return res >>> 0;
  };
}

abstract class CipherBase {
  update(data, inputEnc) {
    if (typeof data === "string") {
      data = buffer.from(data, inputEnc);
    }

    let outBuf = this._update(data);

    return this._toString(outBuf, 'latin1');

  };

  abstract _update(data): buffer.Buffer;

  _toString(value, enc) {
    return util.TextDecoder.create(enc).decodeWithStream(value.buffer);
  };
}

interface desOpts {
  keyBuf
}

class DES extends CipherBase {
  readonly _des: DESCipher

  constructor(opts: desOpts) {
    super()
    this._des = new DESCipher(opts);
  }

  _update(data): buffer.Buffer {
    return buffer.from(this._des.update(data));
  }
}


abstract class Cipher {
  bufferOff = 0
  blockSize = 8
  buffer = new Array(this.blockSize)

  constructor() {
  }

  update(data) {
    if (data.length === 0) return [];

    else return this._updateEncrypt(data);
  };

  _updateEncrypt(data) {
    var inputOff = 0;
    var outputOff = 0;

    var count = ((this.bufferOff + data.length) / this.blockSize) | 0;
    var out = new Array(count * this.blockSize);

    if (this.bufferOff !== 0) {
      inputOff += this._buffer(data, inputOff);

      if (this.bufferOff === this.buffer.length)
        outputOff += this._flushBuffer(out, outputOff);
    }

    // Write blocks
    var max = data.length - ((data.length - inputOff) % this.blockSize);
    for (; inputOff < max; inputOff += this.blockSize) {
      this._update(data, inputOff, out, outputOff);
      outputOff += this.blockSize;
    }

    // Queue rest
    for (; inputOff < data.length; inputOff++, this.bufferOff++)
      this.buffer[this.bufferOff] = data[inputOff];

    return out;
  };

  _flushBuffer(out, off) {
    this._update(this.buffer, 0, out, off);
    this.bufferOff = 0;
    return this.blockSize;
  };

  _buffer(data, off) {
    // Append data to buffer
    var min = Math.min(
      this.buffer.length - this.bufferOff,
      data.length - off
    );
    for (var i = 0; i < min; i++)
      this.buffer[this.bufferOff + i] = data[off + i];
    this.bufferOff += min;

    // Shift next
    return min;
  };

  abstract _update(data, inputOff, out, outputOff);
}

class DESState {
  tmp = new Array(2);
  keys: Array<number>;
}

class DESCipher extends Cipher {
  readonly _desState = new DESState();

  readonly shiftTable = [1, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1];

  constructor(opts: desOpts) {
    super()
    this._deriveKeys(this._desState, opts.keyBuf)
  }

  _deriveKeys(state, key) {
    state.keys = new Array(16 * 2);

    var kL = _utils.readUInt32BE(key, 0);
    var kR = _utils.readUInt32BE(key, 4);

    _utils.pc1(kL, kR, state.tmp, 0);
    kL = state.tmp[0];
    kR = state.tmp[1];
    for (var i = 0; i < state.keys.length; i += 2) {
      var shift = this.shiftTable[i >>> 1];
      kL = _utils.r28shl(kL, shift);
      kR = _utils.r28shl(kR, shift);
      _utils.pc2(kL, kR, state.keys, i);
    }
  };

  _update(inp, inOff, out, outOff) {
    var state = this._desState;

    var l = _utils.readUInt32BE(inp, inOff);
    var r = _utils.readUInt32BE(inp, inOff + 4);

    // Initial Permutation
    _utils.ip(l, r, state.tmp, 0);
    l = state.tmp[0];
    r = state.tmp[1];

    this._encrypt(state, l, r, state.tmp, 0);

    l = state.tmp[0];
    r = state.tmp[1];

    _utils.writeUInt32BE(out, l, outOff);
    _utils.writeUInt32BE(out, r, outOff + 4);
  }

  _encrypt(state, lStart, rStart, out, off) {
    var l = lStart;
    var r = rStart;

    // Apply f() x16 times
    for (var i = 0; i < state.keys.length; i += 2) {
      var keyL = state.keys[i];
      var keyR = state.keys[i + 1];

      // f(r, k)
      _utils.expand(r, state.tmp, 0);

      keyL ^= state.tmp[0];
      keyR ^= state.tmp[1];
      var s = _utils.substitute(keyL, keyR);
      var f = _utils.permute(s);

      var t = r;
      r = (l ^ f) >>> 0;
      l = t;
    }

    // Reverse Initial Permutation
    _utils.rip(r, l, out, off);
  };
}

export function createDES(keyBuf): DES {
  return new DES({ keyBuf: keyBuf })
}
