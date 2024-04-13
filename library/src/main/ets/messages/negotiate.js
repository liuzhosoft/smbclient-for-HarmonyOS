import SMB2Message from '../tools/smb2_message';
import { message } from '../tools/message';

export default message({
  generate: function (connection) {

    return new SMB2Message({
      headers: {
        'Command': 'NEGOTIATE'
      , 'ProcessId': connection.ProcessId
      }
    });

  }
})