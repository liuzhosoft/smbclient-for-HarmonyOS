import SMB2Forge from '../tools/smb2_forge';

var SMB2Request = SMB2Forge.request


/*
 * exists
 * ======
 *
 * test the existence of a file
 *
 *  - try to open the file
 *
 *  - close the file
 *
 */
export default function (path, cb) {
  var connection = this;
  SMB2Request('open', {
    path: path
  }, connection, function (err, file) {
    if (err) {
      cb && cb(null, false)
    } else {
      SMB2Request('close', file, connection, function (err) {
        cb && cb(null, true);
      });
    }
  })
}
