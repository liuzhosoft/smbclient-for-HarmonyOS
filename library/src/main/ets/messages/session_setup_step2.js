import SMB2Message from '../tools/smb2_message'
import { message } from '../tools/message'
import { encodeType3 } from '../ntlm/ntlm'


export default message({
  generate: function (connection) {
    return new SMB2Message({
      headers: {
        'Command': 'SESSION_SETUP'
      , 'SessionId': connection.SessionId
      , 'ProcessId': connection.ProcessId
      }
    , request: {
        'Buffer': encodeType3(
          connection.username
          , connection.ip
          , connection.domain
          , connection.nonce
          , connection.password
        )
      }
    });

  }
})
