import { Buffer } from '../buffer/index'
import SMB2Message from './smb2_message'

import message_close from '../messages/close'
import message_create from '../messages/create'
import message_create_folder from '../messages/create_folder'
import message_negotiate from '../messages/negotiate'
import message_open from '../messages/open'
import message_open_folder from '../messages/open_folder'
import message_query_directory from '../messages/query_directory'
import message_read from '../messages/read'
import message_session_setup_step1 from '../messages/session_setup_step1'
import message_session_setup_step2 from '../messages/session_setup_step2'
import message_set_info from '../messages/set_info'
import message_tree_connect from '../messages/tree_connect'
import message_write from '../messages/write'
import message_list_shares from '../messages/list_shares'
import message_query_info from '../messages/query_info'
import { logi } from './logger'

const SMB2Forge = {
  request: function (messageName, params, connection, cb) {
  },
  response: function (c) {
    return function (response) {
    }
  }
}


/*
 * SMB2 MESSAGE FORGE
 */
SMB2Forge.request = function (messageName, params, connection, cb) {
  var msg = getMessage(messageName)
  logi('request', ' msgName=' + messageName + ', msg=' + JSON.stringify(msg));
  // @ts-ignore
  var smbMessage = msg.generate(connection, params)


  let sendAndReceive = () => {
    // send
    sendNetBiosMessage(connection, smbMessage);

    // wait for the response
    getResponse(
      connection,
      smbMessage.getHeaders().MessageId,
      msg.parse(connection, cb)
    );
  }

  if ('session_setup_step2' == messageName) {
    setTimeout(sendAndReceive, 2000);
  } else {
    sendAndReceive();
  }


}

var responseCount = 0;

/*
 * SMB2 RESPONSE MESSAGE PARSER
 */
SMB2Forge.response = function (c) {
  responseCount++
  c.responses = {};
  c.responsesCB = {};
  c.responseBuffer = Buffer.alloc(0);
  return function (response) {
    // concat new response

    let cat = [c.responseBuffer, Buffer.from(response.message)];

    c.responseBuffer = Buffer.concat(cat);
    // extract complete messages
    var extract = true;
    while (extract) {
      extract = false;
      // has a message header
      if (c.responseBuffer.length >= 4) {
        // message is complete
        var msgLength = (c.responseBuffer.readUInt8(1) << 16) + c.responseBuffer.readUInt16BE(2);
        if (c.responseBuffer.length >= msgLength + 4) {
          // set the flags
          extract = true;
          // parse message
          var r = c.responseBuffer.slice(4, msgLength + 4)
          var message = new SMB2Message()
          message.parseBuffer(r);
          //debug
          // get the message id
          // @ts-ignore
          var mId = message.getHeaders().MessageId.toString('hex');
          // check if the message can be dispatched
          // or store it
          if (c.responsesCB[mId]) {
            c.responsesCB[mId](message);
            delete c.responsesCB[mId];
          } else {
            c.responses[mId] = message;
          }
          // remove from response buffer
          c.responseBuffer = c.responseBuffer.slice(msgLength + 4);
        }
      }
    }
  }
}

export default SMB2Forge

/*
 * HELPERS
 */
function sendNetBiosMessage(connection, message) {
  console.info('smb sendNetBiosMessage: connection = ' + JSON.stringify(connection))
  console.info('smb sendNetBiosMessage: message = ' + JSON.stringify(message))
  var smbRequest = message.getBuffer(connection);

  // create NetBios package
  var buffer = new Buffer(smbRequest.length + 4);

  // write NetBios cmd
  buffer.writeUInt8(0x00, 0);

  // write message length
  buffer.writeUInt8((0xFF0000 & smbRequest.length) >> 16, 1);
  buffer.writeUInt16BE(0xFFFF & smbRequest.length, 2);

  // write message content
  smbRequest.copy(buffer, 4, 0, smbRequest.length);
  // Send it !!!
  connection.newResponse = false;

  let send = () => {
    console.log('smb start send ...............');
    connection.socket.send({
      data: buffer.buffer
    }, err => {
      if (err) {
        console.log('smb send fail:' + JSON.stringify(err));
        return;
      }
      console.log('smb send success');
    });
  }

  if ('NEGOTIATE' == message.headers.Command) {
    connection.socket.on('connect', send);
  } else {
    send();
  }

  return true;
}


function getResponse(c, mId, cb) {
  var messageId = new Buffer(4);
  messageId.writeUInt32LE(mId, 0);
  let messageid = messageId.toString('hex');
  if (c.responses[messageid]) {
    cb(c.responses[messageid]);
    delete c.responses[messageid];
  } else {
    c.responsesCB[messageid] = cb;
  }
}


function getMessage(messageName) {
  var msg = {};
  switch (messageName) {
    case 'close':
      msg = message_close;
      break;
    case 'create':
      msg = message_create;
      break;
    case 'create_folder':
      msg = message_create_folder;
      break;
    case 'negotiate':
      msg = message_negotiate;
      break;
    case 'open':
      msg = message_open;
      break;
    case 'open_folder':
      msg = message_open_folder;
      break;
    case 'query_directory':
      msg = message_query_directory;
      break;
    case 'read':
      msg = message_read;
      break;
    case 'session_setup_step1':
      msg = message_session_setup_step1;
      break;
    case 'session_setup_step2':
      msg = message_session_setup_step2;
      break;
    case 'set_info':
      msg = message_set_info;
      break;
    case 'tree_connect':
      msg = message_tree_connect;
      break;
    case 'write':
      msg = message_write;
      break;
    case 'list_shares':
      msg = message_list_shares;
      break;
    case 'query_info':
      msg = message_query_info;
      break;
    default:
      break;
  }
  return msg;
}
