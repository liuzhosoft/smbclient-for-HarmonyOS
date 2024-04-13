import SMB2Forge from '../tools/smb2_forge';

let SMB2Request = SMB2Forge.request

/*
 * listshare
 * =======
 *
 * list the server shares:
 *
 */
export default function (path, cb) {
  let connection = this;

  // open the directory
  SMB2Request('open_folder', {
    path: path
  }, connection, function (err, file) {
    if (err) cb && cb(err);
    // list shares
    else listShare(file, connection, [], cb);
  });
}


function listShare(file, connection, completeFileListing, cb) {
  SMB2Request('list_shares', {
    file: file
  }, connection, function (err, file) {
    if (err) cb && cb(err);
    else {
      // parse the shares
    }
  });
}
