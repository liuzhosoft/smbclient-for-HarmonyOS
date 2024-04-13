// @ts-ignore
import { Buffer } from '../buffer/index'
import SMB2Forge from '../tools/smb2_forge'
import BigInt from '../tools/bigint'

var SMB2Request = SMB2Forge.request

/*
 * rename
 * ======
 *
 * change the name of a file:
 *
 *  - open the file
 *
 *  - change file name
 *
 *  - close the file
 *
 */
export default function (paths, cb) {

  var connection = this;
  console.info("smb rename path:" + paths)
  // SMB2 open the folder / file
  SMB2Request('open_folder', {
    path: paths[0]
  }, connection, function (err, file) {
    if (err) SMB2Request('open', {
      path: paths[0]
    }, connection, function (err, file) {
      if (err) cb && cb(err);
      else rename(connection, file, paths[1], cb);
    });
    else rename(connection, file, paths[1], cb);
  });

}


function rename(connection, file, newPath, cb) {
  // SMB2 rename
  SMB2Request('set_info', {
    FileId: file.FileId,
    FileInfoClass: 'FileRenameInformation',
    Buffer: renameBuffer(newPath)
  }, connection, function (err) {
    if (err) cb && cb(err);
    // SMB2 close file
    else SMB2Request('close', file, connection, function (err) {
      cb && cb(null);
    });
  });
}


function renameBuffer(newPath) {

  var filename = new Buffer(newPath, 'ucs2');

  return Buffer.concat([

  // ReplaceIfExists 1 byte
    (new BigInt(1, 0)).toBuffer()

    // Reserved 7 bytes
    , (new BigInt(7, 0)).toBuffer()

    // RootDirectory 8 bytes
    , (new BigInt(8, 0)).toBuffer()

    // FileNameLength 4 bytes
    , (new BigInt(4, filename.length)).toBuffer()

    // FileName
    , filename

  ]);

}
