import SMB2Message from '../tools/smb2_message';
import { message } from '../tools/message';


export default message({
  generate: function (connection, params) {

    return new SMB2Message({
      headers: {
        'Command': 'WRITE'
      , 'SessionId': connection.SessionId
      , 'TreeId': connection.TreeId
      , 'ProcessId': connection.ProcessId
      }
    , request: {
        'FileId': params.FileId
      , 'Offset': params.Offset
      , 'Buffer': params.Buffer
      }
    });

  }

, parseResponse: function (response) {
    return response.getResponse().Buffer;
  }
});