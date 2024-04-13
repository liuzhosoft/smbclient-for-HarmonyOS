import SMB2Message from '../tools/smb2_message'
import { message } from '../tools/message'
import { Buffer } from '../buffer/index'

export default message({
  generate: function (connection) {

    return new SMB2Message({
      headers: {
        'Command': 'TREE_CONNECT'
      , 'SessionId': connection.SessionId
      , 'ProcessId': connection.ProcessId
      }
    , request: {
        'Buffer': new Buffer(connection.fullPath, 'ucs2')
      }
    });

  }

, onSuccess: function (connection, response) {
    var h = response.getHeaders();
    connection.TreeId = h.TreeId;
  }
})