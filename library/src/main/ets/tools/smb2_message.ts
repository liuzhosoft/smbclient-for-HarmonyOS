import { Buffer } from '../buffer/index'

import struct_close from '../structures/close'
import struct_create from '../structures/create'
import struct_negotiate from '../structures/negotiate'
import struct_query_directory from '../structures/query_directory'
import struct_read from '../structures/read'
import struct_session_setup from '../structures/session_setup'
import struct_set_info from '../structures/set_info'
import struct_tree_connect from '../structures/tree_connect'
import struct_write from '../structures/write'
import struct_query_info from '../structures/query_info'

/*
 * CONSTANTS
 */
const protocolId = new Buffer([0xFE, 'S'.charCodeAt(0), 'M'.charCodeAt(0), 'B'.charCodeAt(0)])

enum SMB2MessageCommandCode {
  SMB2_NEGOTIATE = 0x0000,
  SMB2_SESSION_SETUP = 0x0001,
  SMB2_LOGOFF = 0x0002,
  SMB2_TREE_CONNECT = 0x0003,
  SMB2_TREE_DISCONNECT = 0x0004,
  SMB2_CREATE = 0x0005,
  SMB2_CLOSE = 0x0006,
  SMB2_FLUSH = 0x0007,
  SMB2_READ = 0x0008,
  SMB2_WRITE = 0x0009,
  SMB2_LOCK = 0x000A,
  SMB2_IOCTL = 0x000B,
  SMB2_CANCEL = 0x000C,
  SMB2_ECHO = 0x000D,
  SMB2_QUERY_DIRECTORY = 0x000E,
  SMB2_CHANGE_NOTIFY = 0x000F,
  SMB2_QUERY_INFO = 0x0010,
  SMB2_SET_INFO = 0x0011,
  SMB2_OPLOCK_BREAK = 0x0012
}

const headerTranslates = {
  'Command': {
    'NEGOTIATE': SMB2MessageCommandCode.SMB2_NEGOTIATE,
    'SESSION_SETUP': SMB2MessageCommandCode.SMB2_SESSION_SETUP,
    'LOGOFF': SMB2MessageCommandCode.SMB2_LOGOFF,
    'TREE_CONNECT': SMB2MessageCommandCode.SMB2_TREE_CONNECT,
    'TREE_DISCONNECT': SMB2MessageCommandCode.SMB2_TREE_DISCONNECT,
    'CREATE': SMB2MessageCommandCode.SMB2_CREATE,
    'CLOSE': SMB2MessageCommandCode.SMB2_CLOSE,
    'FLUSH': SMB2MessageCommandCode.SMB2_FLUSH,
    'READ': SMB2MessageCommandCode.SMB2_READ,
    'WRITE': SMB2MessageCommandCode.SMB2_WRITE,
    'LOCK': SMB2MessageCommandCode.SMB2_LOCK,
    'IOCTL': SMB2MessageCommandCode.SMB2_IOCTL,
    'CANCEL': SMB2MessageCommandCode.SMB2_CANCEL,
    'ECHO': SMB2MessageCommandCode.SMB2_ECHO,
    'QUERY_DIRECTORY': SMB2MessageCommandCode.SMB2_QUERY_DIRECTORY,
    'CHANGE_NOTIFY': SMB2MessageCommandCode.SMB2_CHANGE_NOTIFY,
    'QUERY_INFO': SMB2MessageCommandCode.SMB2_QUERY_INFO,
    'SET_INFO': SMB2MessageCommandCode.SMB2_SET_INFO,
    'OPLOCK_BREAK': SMB2MessageCommandCode.SMB2_OPLOCK_BREAK,
  }
}

const flags = {
  'SERVER_TO_REDIR': 0x00000001,
  'ASYNC_COMMAND': 0x00000002,
  'RELATED_OPERATIONS': 0x00000004,
  'SIGNED': 0x00000008,
  'DFS_OPERATIONS': 0x10000000,
  'REPLAY_OPERATION': 0x20000000
}

export const headerStructureSize = 64

const headerSync = function (processId, sessionId) {
  return [
    ['ProtocolId', 4, protocolId],
    ['StructureSize', 2, headerStructureSize],
    ['CreditCharge', 2, 0],
    ['Status', 4, 0],
    ['Command', 2],
    ['Credit', 2, 126],
    ['Flags', 4, 0],
    ['NextCommand', 4, 0],
    ['MessageId', 4],
    ['MessageIdHigh', 4, 0],
    ['ProcessId', 4, processId],
    ['TreeId', 4, 0],
    ['SessionId', 8, sessionId],
    ['Signature', 16, 0]
  ];
}

const headerASync = function (processId, sessionId) {
  return [
    ['ProtocolId', 4, protocolId],
    ['StructureSize', 2, headerStructureSize],
    ['CreditCharge', 2, 0],
    ['Status', 4, 0],
    ['Command', 2],
    ['Credit', 2, 126],
    ['Flags', 4, 0],
    ['NextCommand', 4, 0],
    ['MessageId', 4],
    ['MessageIdHigh', 4, 0],
    ['AsyncId', 8],
    ['SessionId', 8, sessionId],
    ['Signature', 16, 0]
  ];
}


var SMB2Message = function (options) {

  // INIT HEADERS
  this.headers = {};
  if (options && options.headers) {
    this.setHeaders(options.headers);
  }

  // INIT REQUEST
  this.request = {};
  if (options && options.request) {
    this.setRequest(options.request);
  }

  // INIT RESPONSE
  this.response = {};
}

export default SMB2Message


var proto = SMB2Message.prototype = {};


// @ts-ignore
proto.setHeaders = function (obj) {
  for (var key in obj) {
    this.headers[key] = obj[key];
  }
  this.structure = getStructure(this.headers['Command'].toLowerCase());
}

// @ts-ignore
proto.getHeaders = function () {
  return this.headers;
}


// @ts-ignore
proto.setRequest = function (request) {
  this.request = request;
}
// @ts-ignore
proto.getRequest = function () {
  return this.request;
}
// @ts-ignore
proto.getResponse = function () {
  return this.response;
}


// @ts-ignore
proto.getBuffer = function (connection) {
  var buffer = new Buffer(0xFFFF)
  var length = 0

  // SET MESSAGE ID
  if (!this.isMessageIdSetted) {
    this.isMessageIdSetted = true;
    this.headers['MessageId'] = connection.messageId++;
  }
  console.log('smb headers=' + JSON.stringify(this.headers))
  // HEADERS
  length += writeHeaders(this, buffer);

  // REQUEST
  length += writeRequest(this, buffer, headerStructureSize)
  // extract the data
  var output = new Buffer(length);
  buffer.copy(output, 0, 0, length);
  return output;
}

// @ts-ignore
proto.parseBuffer = function (buffer) {
  // HEADERS
  readHeaders(this, buffer)

  // RESPONSE
  readResponse(this, buffer, headerStructureSize)

}


/*
 * HELPERS
 */
function dataToBuffer(data, length) {

  // buffers will be buffers
  if (Buffer.isBuffer(data)) {
    return data;
  }

  // string to buffer
  if (typeof data == 'string') {
    return new Buffer(data);
  }

  // raw data to buffer
  var result = new Buffer(length);
  for (var i = 0; i < length; i++) {
    result.writeUInt8(
      0xFF & (data >> (i * 8))
      , i
    );
  }
  return result;

}

function bufferToData(buffer) {

  // not a buffer go away
  if (!Buffer.isBuffer(buffer)) {
    return buffer;
  }
  // raw data to buffer
  var result = 0;
  let temBuffer = Buffer.from(buffer)
  for (var i = 0; i < temBuffer.length; i++) {
    result += temBuffer.readUInt8(i) << (i * 8);
  }
  return result;

}

function writeData(buffer, data, offset, length) {
  dataToBuffer(data, length).copy(buffer, offset, 0)
}

function readData(buffer, offset, length) {
  //  let temBuffer = Buffer.from(buffer)
  return buffer.slice(offset, offset + length);
}

function translate(key, value) {
  if (headerTranslates[key] && typeof headerTranslates[key][value] != 'undefined') {
    return headerTranslates[key][value];
  }
  return value;
}

function unTranslate(key, value) {
  if (headerTranslates[key]) {
    for (var t in headerTranslates[key]) {
      if (headerTranslates[key][t] == value) {
        return t;
      }
    }
  }
  return null;
}


/*
 * PRIVATE FUNCTIONS
 */
function readHeaders(message, buffer) {
  var headers = (message.isAsync ? headerASync : headerSync)(message.ProcessId, message.SessionId)
  var offset = 0
  for (let header of headers) {
    var key = header[0]
    var length = header[1]

    message.headers[key] = readData(
      buffer
      , offset
      , length
    );

    if (length <= 8) {
      message.headers[key] = unTranslate(key, bufferToData(message.headers[key])) || message.headers[key];
    }
    offset += length;
  }

  message.structure = getStructure(message.headers['Command'].toLowerCase());
}

function getStructure(header) {
  var structure = {}
  switch (header) {
    case 'close':
      structure = struct_close;
      break;
    case 'create':
      structure = struct_create;
      break;
    case 'negotiate':
      structure = struct_negotiate;
      break;
    case 'query_directory':
      structure = struct_query_directory;
      break;
    case 'read':
      structure = struct_read;
      break;
    case 'session_setup':
      structure = struct_session_setup;
      break;
    case 'set_info':
      structure = struct_set_info;
      break;
    case 'tree_connect':
      structure = struct_tree_connect;
      break;
    case 'write':
      structure = struct_write;
      break;
    case 'query_info':
      structure = struct_query_info;
      break;
    default:
      structure = struct_close;
      break;
  }
  return structure;

}

function writeHeaders(message, buffer) {
  var headers = (message.isAsync ? headerASync : headerSync)(message.ProcessId, message.SessionId)
  var offset = 0
  for (let header of headers) {
    var key = header[0]
    var length = header[1]
    var defaultValue = header[2] || 0;
    writeData(
      buffer,
      translate(key, message.headers[key] || defaultValue),
      offset,
      length
    );
    offset += length;
  }
  return offset;
}


function readResponse(message, buffer, offset) {
  for (var i in message.structure.response) {
    var key = message.structure.response[i][0];
    var length = message.structure.response[i][1] || 1;
    if (typeof length == 'string') {
      length = bufferToData(message.response[length]);
    }
    message.response[key] = readData(buffer, offset, length);
    offset += length;
  }
}


function writeRequest(message, buffer, offset) {
  var initOffset = offset
  var needsRewrite = false
  var tmpBuffer = new Buffer(buffer.length)
  offset = 0;
  for (var i in message.structure.request) {
    var key = message.structure.request[i][0]
    var length = message.structure.request[i][1] || 1
    var defaultValue = message.structure.request[i][2] || 0

    if (typeof length == 'string') {
      message.request[key] = message.request[key] || '';
      if (message.request[length] != message.request[key].length) {
        message.request[length] = message.request[key].length;
        needsRewrite = true;
      }
      length = message.request[key].length;
    } else {
      message.request[key] = message.request[key] || defaultValue;
    }

    writeData(
      tmpBuffer,
      message.request[key],
      offset,
      length
    );
    offset += length;
  }
  if (needsRewrite) {
    writeRequest(message, tmpBuffer, 0);
  }

  tmpBuffer.copy(buffer, initOffset, 0, offset);
  return offset;
}
