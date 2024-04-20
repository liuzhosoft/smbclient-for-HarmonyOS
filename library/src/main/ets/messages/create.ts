import SMB2Message, { headerStructureSize } from '../tools/smb2_message';
import { message } from '../tools/message';
import { Buffer } from '../buffer/index';
import { SMB2ImpersonationLevel } from '../mssmb2/SMB2ImpersonationLevel';
import { AccessMask } from '../msdtyp/AccessMask';
import { FileAttributes } from '../msfscc/FileAttributes';
import { SMB2ShareAccess } from '../mssmb2/SMB2ShareAccess';
import { SMB2CreateDisposition } from '../mssmb2/SMB2CreateDisposition';
import { SMB2CreateOptions } from '../mssmb2/SMB2CreateOptions';
import { Create } from '../structures/create';
import { Utils } from '../tools/utils';


export class CreateOptions {
  path: string
  impersonationLevel?: SMB2ImpersonationLevel
  accessMask?: Set<AccessMask>
  fileAttributes?: Set<FileAttributes>
  shareAccess?: Set<SMB2ShareAccess> | number
  createDisposition?: SMB2CreateDisposition
  createOptions?: Set<SMB2CreateOptions>
}


export default message({
  generate: function (connection, params: CreateOptions) {

    let buffer = new Buffer(params.path, 'ucs2');

    return new SMB2Message({
      headers: {
        'Command': 'CREATE',
        'SessionId': connection.SessionId,
        'TreeId': connection.TreeId,
        'ProcessId': connection.ProcessId
      },

      request: {
        'Buffer': buffer,
        'ImpersonationLevel': params.impersonationLevel,
        'DesiredAccess': Utils.flagValueBy(params.accessMask) ?? 0x001701DF,
        'FileAttributes': Utils.flagValueBy(params.fileAttributes) ?? 0x00000080,
        'ShareAccess': Utils.flagValueBy(params.shareAccess) ?? 0x00000000,
        'CreateDisposition': params.createDisposition ?? 0x00000005,
        'CreateOptions': Utils.flagValueBy(params.createOptions) ?? 0x00000044,
        'NameOffset': headerStructureSize + Create.StructureSize - 1,
        'CreateContextsOffset': 0x007A + ((buffer as unknown) as Uint8Array).length,
      }
    });

  }
});

