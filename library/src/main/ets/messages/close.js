import SMB2Message from '../tools/smb2_message';
import { message } from '../tools/message';

export default message({
  generate: function (connection, params) {
    return new SMB2Message({
      headers: {
        'Command': 'CLOSE'
      , 'SessionId': connection.SessionId
      , 'TreeId': connection.TreeId
      , 'ProcessId': connection.ProcessId
      }
    , request: {
        'FileId': params.FileId
      }
    });

  }
})