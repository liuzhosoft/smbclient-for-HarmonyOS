import SMB2Message from '../tools/smb2_message';
import { message } from '../tools/message';
import { Buffer } from '../buffer/index';
import SmbFile from '../model/SmbFile';
import { readWindowsTime, windowsTimeStamp2Unix } from '../tools/time_util';


export default message({
  generate: function (connection, params) {

    return new SMB2Message({
      headers: {
        'Command': 'QUERY_DIRECTORY'
      , 'SessionId': connection.SessionId
      , 'TreeId': connection.TreeId
      , 'ProcessId': connection.ProcessId
      }
    , request: {
        'FileId': params.FileId
      , 'Buffer': new Buffer('*', 'ucs2')
      }
    });

  }

, parseResponse: function (response) {
    return parseFiles(response.getResponse().Buffer);
  }
});

/*
 * HELPERS
 */
function parseFiles(buffer) {
  var files = []
    , offset = 0
    , nextFileOffset = -1
  ;
  while (nextFileOffset != 0) {
    // extract next file offset
    nextFileOffset = buffer.readUInt32LE(offset);
    // extract the file
    files.push(
      parseFile(
        buffer.subarray(offset + 4, nextFileOffset ? offset + nextFileOffset : buffer.length)
      )
    );
    // move to nex file
    offset += nextFileOffset;
  }
  return files;
}


function parseFile( buffer) {
  var file = new SmbFile()
  var offset = 0
  // index
  file.Index = buffer.readUInt32LE(offset);
  offset += 4;

  // CreationTime
  let windowsTime = readWindowsTime(buffer, offset);
  file.CreationTime = windowsTimeStamp2Unix(windowsTime);
  offset += 8;

  // LastAccessTime
  windowsTime = readWindowsTime(buffer, offset);
  file.LastAccessTime = windowsTimeStamp2Unix(windowsTime);
  offset += 8;

  // LastWriteTime
  windowsTime = readWindowsTime(buffer, offset);
  file.LastWriteTime = windowsTimeStamp2Unix(windowsTime);
  offset += 8;

  // ChangeTime
  windowsTime = readWindowsTime(buffer, offset);
  file.ChangeTime = windowsTimeStamp2Unix(windowsTime);
  offset += 8;


  // EndofFile
  file.EndofFile = buffer.readBigUInt64LE(offset);
  offset += 8;

  // AllocationSize
  file.AllocationSize = buffer.subarray(offset, offset + 8);
  offset += 8;

  // FileAttributes
  file.FileAttributes = buffer.readUInt32LE(offset);
  offset += 4;

  // FilenameLength
  file.FilenameLength = buffer.readUInt32LE(offset);
  offset += 4;

  // EASize
  file.EASize = buffer.readUInt32LE(offset);
  offset += 4;

  // ShortNameLength
  file.ShortNameLength = buffer.readUInt8(offset);
  offset += 1;

  // FileId
  file.FileId = buffer.subarray(offset, offset + 8);
  offset += 8;

  // Reserved
  offset += 27;

  // Filename
  file.Filename = buffer.subarray(offset, offset + file.FilenameLength).toString('ucs2');
  offset += file.FilenameLength;

  return file;
}