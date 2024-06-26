import { Buffer } from '../buffer/index';
import SMB2Forge from '../tools/smb2_forge';
import BigInt from '../tools/bigint';


var SMB2Request = SMB2Forge.request

/*
 * readFile
 * ========
 *
 * read the content of a file from the share
 *
 *  - open the file
 *
 *  - read the content
 *
 *  - close the file
 *
 */
var fileLength = 0
  // @ts-ignore
  , offset = new BigInt(8)
  , stop = false
  , nbRemainingPackets = 0
  , maxPacketSize = 0x00010000
  , result;

export default function (params, cb) {
  var connection = this;
  let filename = params[0]
  var options = params.length == 2 ? params[1] : {
    encoding: 'UTF-8'
  }

  SMB2Request('open', {
    path: filename
  }, connection, function (err, file) {
    if (err) cb && cb(err);
    // SMB2 read file content
    else {
      fileLength = 0
      // @ts-ignore
      offset = new BigInt(8)
      stop = false
      nbRemainingPackets = 0
      maxPacketSize = 0x00010000
      // get file length
      for (var i = 0; i < file.EndofFile.length; i++) {
        fileLength |= file.EndofFile[i] << (i * 8);
      }
      result = new Buffer(fileLength);
      checkDone(file, cb);
    }
  });

  // callback manager
  function callback(offset, cb) {
    return function (err, content) {
      if (stop) return;
      if (err) {
        cb && cb(err);
        stop = true;
      } else {
        content.copy(result, offset.toNumber());
        nbRemainingPackets--;
        checkDone(result, cb);
      }
    }
  }

  // callback manager
  function checkDone(file, cb) {
    if (stop) return;
    createPackets(file, cb);
    if (nbRemainingPackets == 0 && offset.ge(fileLength)) {
      SMB2Request('close', file, connection, function (err) {
        if (options.encoding) {
          result = result.toString(options.encoding);
        }
        cb && cb(null, result);
      })
    }
  }

  // create packets
  function createPackets(file, cb) {
    while (nbRemainingPackets < connection.packetConcurrency && offset.lt(fileLength)) {
      // process packet size
      var rest = offset.sub(fileLength).neg();
      var packetSize = rest.gt(maxPacketSize) ? maxPacketSize : rest.toNumber();

      // generate buffer
      SMB2Request('read', {
        'FileId': file.FileId
      , 'Length': packetSize
      , 'Offset': offset.toBuffer()
      }, connection, callback(offset, cb));
      offset = offset.add(packetSize);
      nbRemainingPackets++;
    }
  }

}
