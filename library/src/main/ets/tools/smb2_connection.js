import socket from '@ohos.net.socket'
import SMB2Forge from './smb2_forge'


var SMB2Connection = {
  close: function (connection) {
  },
  requireConnect: function (connection, method) {
    return function (path, callback) {
    }
  },
  init: function (connection) {
  }
}


SMB2Connection.close = function (connection) {
  clearAutoCloseTimeout(connection);
  if (connection.connected) {
    connection.connected = false;
    connection.socket.close();
  }
},
SMB2Connection.requireConnect = function (connection, method) {

  return function (path, callback) {
    var args = Array.prototype.slice.call(arguments);
    connect(connection, function (err) {
      // process the cb
      var cb = args.pop();
      cb = scheduleAutoClose(connection, cb);
      args.push(cb);

      // manage the connection error
      if (err) {
        cb(err)
      } else {
        method.apply(connection, args);
      }
    });
  }
},
SMB2Connection.init = function (connection) {
  // create a socket
  connection.connected = false;
  connection.socket = socket.constructTCPSocketInstance();
  // attach data events to socket


  connection.socket.on('message', SMB2Forge.response(connection))
  connection.errorHandler = [];
  connection.socket.on('error', function (err) {
    if (connection.errorHandler.length > 0) {
      connection.errorHandler[0].call(null, err)
    }
  });

}


export default SMB2Connection;


/*
 * PRIVATE FUNCTION TO HANDLE CONNECTION
 */
function connect(connection, cb) {

  if (connection.connected) {
    cb && cb(null);
    return;
  }

  cb = scheduleAutoClose(connection, cb);

  connection.socket.connect({
    address: { address: connection.ip, port: connection.port },
    timeout: connection.autoCloseTimeout
  }).then(() => {
    console.info('smb-- connect server success');
  }).catch(err => {
    console.error('smb-- connect server fail ' + JSON.stringify(err));
  });


  // SMB2 negotiate connection
  SMB2Forge.request('negotiate', {}, connection, function (err) {
    console.log("smb connection  0: err=" + JSON.stringify(err))
    if (err) cb && cb(err);
            
    // SMB2 setup session / negotiate ntlm
    else SMB2Forge.request('session_setup_step1', {}, connection, function (err) {
      console.log("smb connection  1: err=" + JSON.stringify(err))
      if (err) cb && cb(err);

      // SMB2 setup session / autheticate with ntlm
      else SMB2Forge.request('session_setup_step2', {}, connection, function (err) {
        console.log("smb connection  2: err=" + JSON.stringify(err))
        if (err) cb && cb(err);

        // SMB2 tree connect
        else SMB2Forge.request('tree_connect', {}, connection, function (err) {
          console.log("smb connection  3: err=" + JSON.stringify(err))
          if (err) cb && cb(err);
          else {
            connection.connected = true;
            cb && cb(null);
          }
        });
      });
    });
  });
}


/*
 * PRIVATE FUNCTION TO HANDLE CLOSING THE CONNECTION
 */
function clearAutoCloseTimeout(connection) {
  if (connection.scheduledAutoClose) {
    clearTimeout(connection.scheduledAutoClose);
    connection.scheduledAutoClose = null;
  }
}

function setAutoCloseTimeout(connection) {
  clearAutoCloseTimeout(connection);
  if (connection.autoCloseTimeout != 0) {
    connection.scheduledAutoClose = setTimeout(function () {
      connection.close();
    }, connection.autoCloseTimeout);
  }
}

function scheduleAutoClose(connection, cb) {
  addErrorListener(connection, cb);
  clearAutoCloseTimeout(connection);
  return function () {
    removeErrorListener(connection);
    setAutoCloseTimeout(connection);
    cb.apply(null, arguments);
  }
}


/*
 * PRIVATE FUNCTIONS TO HANDLE ERRORS
 */
function addErrorListener(connection, callback) {
  connection.errorHandler.unshift(callback);
}

function removeErrorListener(connection) {
  connection.errorHandler.shift();
}


