import SMB2Message from '../tools/smb2_message';
import { message } from '../tools/message';
import { FileInformationClass } from '../msfscc/FileInformationClass';
import { FileSystemInformationClass } from '../msfscc/FileSystemInformationClass';
import { QueryInfoType } from '../structures/query_info';
import { Buffer } from '../buffer';
import SmbFile from '../model/SmbFile';
import { readWindowsTime2Unix } from '../tools/TimeUtil';

export default message({
  generate: function (connection, params) {
    let infoType = params.infoType ?? QueryInfoType.SMB2_0_INFO_FILE;
    let fileInformationClass: FileInformationClass = params.fileInformationClass ?? FileInformationClass.FileAllInformation;
    let fileSystemInformationClass: FileSystemInformationClass = params.fileSystemInformationClass;
    let fileId = params.fileId;
    //let inputBuffer;
    //let securityInformation;
    return new SMB2Message({
      headers: {
        'Command': 'QUERY_INFO',
        'SessionId': connection.SessionId,
        'TreeId': connection.TreeId,
        'ProcessId': connection.ProcessId
      },
      request: {
        'FileInformationClass': fileInformationClass,
        'FileId': fileId,
        'InfoType': infoType,
      }
    });

  },

  parseResponse: function (response) {
    let buf: Buffer = response.getResponse().Buffer;
    let file = new SmbFile();
    let offset = 0;

    // ----start FileBasicInformation
    file.CreationTime = readWindowsTime2Unix(buf, offset);
    offset += 8;

    file.LastAccessTime = readWindowsTime2Unix(buf, offset)
    offset += 8;

    file.LastWriteTime = readWindowsTime2Unix(buf, offset);
    offset += 8;

    file.ChangeTime = readWindowsTime2Unix(buf, offset);
    offset += 8;

    file.FileAttributes = buf.readUInt32LE(offset);
    offset += 4;
    // ----end FileBasicInformation

    // Reserved
    offset += 4;

    // ----start FileStandardInformation
    file.AllocationSize = buf.readBigUInt64LE(offset);
    offset += 8;

    file.EndofFile = buf.readBigUInt64LE(offset);
    offset += 8;

    let numberOfLinks = buf.readUint32LE(offset);
    offset += 4;

    let deletePending = buf.readIntLE(offset, 1) != 0;
    offset += 1;

    let directory = buf.readIntLE(offset, 1) != 0;
    offset += 1;
    // ----end FileStandardInformation

    // Reserved
    offset += 2;

    // ---- FileInternalInformation
    file.Index = buf.readBigUInt64LE(offset);
    offset += 8;

    // ---- FileEaInformation
    file.EASize = buf.readUint32LE(offset);
    offset += 4;

    // ---- FileAccessInformation
    let accessFlags = buf.readUint32LE(offset);
    offset += 4;

    // ---- FilePositionInformation
    let currentByteOffset = buf.readBigUInt64LE(offset);
    offset += 8;

    // ---- FileModeInformation
    let mode = buf.readUint32LE(offset);
    offset += 4;

    // ---- FileAlignmentInformation
    let alignmentReq = buf.readUint32LE(offset);
    offset += 4;

    // ---- FileName
    file.FilenameLength = buf.readUint32LE(offset);
    offset += 4;

    let nameBuf = ((buf as unknown) as Uint8Array).subarray(offset, offset + file.FilenameLength)
    file.Filename = ((nameBuf as unknown) as Buffer).toString('ucs2');
    offset += file.FilenameLength;

    return file;
  }
})