import SMB2Message from '../tools/smb2_message';
import { message } from '../tools/message';
import { Buffer } from '../buffer/index';


export default message({
  generate: function (connection, params) {

    var buffer = new Buffer(params.path, 'ucs2');

    return new SMB2Message({
      headers: {
        'Command': 'CREATE'
      , 'SessionId': connection.SessionId
      , 'TreeId': connection.TreeId
      , 'ProcessId': connection.ProcessId
      }
    , request: {
        'Buffer': buffer
      ,
        'FileAttributes': 0x00000000
      ,
        'ShareAccess': 0x00000007
      ,
        'CreateDisposition': 0x00000001
      ,
        'CreateOptions': 0x00200021
      ,
        'NameOffset': 0x0078
      ,
        'CreateContextsOffset': 0x007A + buffer.length
      }
    });

  }

, parseResponse: function (response) {
    // return parseFiles(response.getResponse().Buffer);
  }

});