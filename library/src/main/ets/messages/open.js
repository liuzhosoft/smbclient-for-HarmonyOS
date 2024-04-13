import SMB2Message from '../tools/smb2_message';
import { message } from '../tools/message';
import { Buffer } from '../buffer/index';


export default message({
  generate: function (connection, params) {

    var buffer = new Buffer(params.path, 'ucs2');
    JSON.stringify("smbj open message:" + JSON.stringify(params))
    return new SMB2Message({
      headers: {
        'Command': 'CREATE'
      , 'SessionId': connection.SessionId
      , 'TreeId': connection.TreeId
      , 'ProcessId': connection.ProcessId
      }
    , request: {
        'Buffer': buffer
      , 'DesiredAccess': 0x001701DF
      , 'NameOffset': 0x0078
      , 'CreateContextsOffset': 0x007A + buffer.length
      }
    });

  }
});