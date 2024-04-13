import SMB2Forge from '../tools/smb2_forge';

var SMB2Request = SMB2Forge.request

/*
 * mkdir
 * =====
 *
 * create folder:
 *
 *  - create the folder
 *
 *  - close the folder
 *
 */

export default function (path, mode, cb) {

  if (typeof mode == 'function') {
    cb = mode;
    mode = '0777';
  }

  var connection = this;

  connection.exists(path, function (err, exists) {

    if (err) cb && cb(err);

    else if (!exists) {

      // SMB2 open file
      SMB2Request('create_folder', {
        path: path
      }, connection, function (err, file) {
        if (err) cb && cb(err);
        // SMB2 query directory
        else SMB2Request('close', file, connection, function (err) {
          cb && cb(null);
        });
      });

    } else {

      cb(new Error('File/Folder already exists'));

    }

  });

}

