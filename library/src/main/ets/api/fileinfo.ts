import { CreateOptions } from '../messages/create';
import SmbFile from '../model/SmbFile';
import { AccessMask } from '../msdtyp/AccessMask';
import { SMB2CreateDisposition } from '../mssmb2/SMB2CreateDisposition';
import { SMB2ImpersonationLevel } from '../mssmb2/SMB2ImpersonationLevel';
import { SMB2ShareAccess } from '../mssmb2/SMB2ShareAccess';
import { SMB2 } from '../smb2';
import { jsonStringifyBigint } from '../tools/bigint';
import { logi } from '../tools/logger';
import SMB2Forge from '../tools/smb2_forge';

const SMB2Request = SMB2Forge.request


/*
 * fileInfo
 *
 * get file info for path
 *
 */
export default function (path: string, callback?: (err?: Error, info?: SmbFile) => void) {

  //  this function call from connection[SMB2]
  let connection: SMB2 = this as SMB2;


  logi('api.fileinfo', 'path=' + path)
  let options: CreateOptions = {
    path: path,
    impersonationLevel: SMB2ImpersonationLevel.Identification,
    accessMask: new Set([AccessMask.FILE_READ_EA, AccessMask.FILE_READ_ATTRIBUTES]),
    fileAttributes: new Set(),
    shareAccess: SMB2ShareAccess.ALL,
    createDisposition: SMB2CreateDisposition.FILE_OPEN,
    createOptions: new Set(),
  }
  // step 1: get FileId
  SMB2Request('create', options, connection, function (err, file) {
    if (err) {
      logi('api.fileinfo', 'get FileId failed.', err)
      callback && callback(err);
      return;
    }
    logi('api.fileinfo', 'get FileId success.')
    // step 2: query info for fileId
    SMB2Request('query_info', {
      fileId: file.FileId
    }, connection, (err: Error | undefined, smbFile: SmbFile) => {
      if (err) {
        logi('api.fileinfo', 'query info failed.', err)
        callback && callback(err);
        return;
      }
      logi('smbclient:', 'query info success: smbFile=' + JSON.stringify(smbFile, jsonStringifyBigint));
      // step 3: close the connection
      SMB2Request('close', file, connection, function (err: Error | undefined) {
        callback && callback(null, smbFile);
      });
    })
  })

}