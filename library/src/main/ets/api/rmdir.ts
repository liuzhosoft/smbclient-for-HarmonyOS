import SMB2Forge from '../tools/smb2_forge';
import BigInt from '../tools/bigint';
import { SMB2 } from '../smb2';
import { SMB2ImpersonationLevel } from '../mssmb2/SMB2ImpersonationLevel';
import { CreateOptions } from '../messages/create';
import { AccessMask } from '../msdtyp/AccessMask';
import { SMB2ShareAccess } from '../mssmb2/SMB2ShareAccess';
import { SMB2CreateDisposition } from '../mssmb2/SMB2CreateDisposition';
import { logi } from '../tools/logger';
import { FileAttributes } from '../msfscc/FileAttributes';
import { SMB2CreateOptions } from '../mssmb2/SMB2CreateOptions';

var SMB2Request = SMB2Forge.request

/*
 * rmdir
 * =====
 *
 * remove directory:
 *
 *  - open the folder
 *
 *  - remove the folder
 *
 *  - close the folder
 *
 */
export default function (path, callback) {
  let connection = this as SMB2;

  logi('api.rmdir', 'path=' + path)

  // step 1: check exists
  connection.exists(path, function (err, exists) {

    if (err) callback && callback(err);

    else if (exists) {

      let options: CreateOptions = {
        path: path,
        impersonationLevel: SMB2ImpersonationLevel.Identification,
        accessMask: new Set([AccessMask.DELETE]),
        fileAttributes: new Set([FileAttributes.FILE_ATTRIBUTE_DIRECTORY]),
        shareAccess: SMB2ShareAccess.ALL,
        createDisposition: SMB2CreateDisposition.FILE_OPEN,
        createOptions: new Set([SMB2CreateOptions.FILE_DIRECTORY_FILE]),
      }

      // step 2: open the file with Access.Delete
      SMB2Request('create', options, connection, function (err, file) {
        if (err) {
          logi('api.rmdir', 'open the file failed.', err)
          callback && callback(err);
          return;
        }
        // step 3: delete the file
        SMB2Request('set_info', {
          FileId: file.FileId, FileInfoClass: 'FileDispositionInformation', Buffer: (new BigInt(1, 1)).toBuffer()
        }, connection, function (err, files) {
          if (err) callback && callback(err);
          // SMB2 close the directory
          else SMB2Request('close', file, connection, function (err) {
            callback && callback(null, files);
          });
        });
      });

    } else {
      callback(new Error('Folder does not exists'));

    }
  });

}
