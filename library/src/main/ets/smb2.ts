import { Buffer } from './buffer/index'
import SMB2Connection from './tools/smb2_connection'
import exists from './api/exists'
import close from './api/close'
import mkdir from './api/mkdir'
import readdir from './api/readdir'
import readfile from './api/readfile'
import rename from './api/rename'
import writefile from './api/writefile'
import rmdir from './api/rmdir'
import unlink from './api/unlink'
import sendfile from './api/sendfile'
import listshare from './api/listshare'

let port = 445
let packetConcurrency = 20
let autoCloseTimeout = 10000


export interface options {
  address: string,
  share: string,
  port?: number,
  packetConcurrency?: number,
  autoCloseTimeout?: number,
  domain: string,
  username: string,
  password: string,

}

export class SMB2 {
  private ip: string = '';
  private port: number = 445;
  private messageId: number = 0;
  private fullPath: string = '';
  private packetConcurrency: number = 20;
  private autoCloseTimeout: number = 10000;
  private domain: string = 'DOMAIN';
  private username: string = '';
  private password: string = '';
  private SessionId;
  private ProcessId;
  private socket;
  private errorHandler = [];
  private newResponse: boolean = false;

  public constructor(opt: options) {
    opt = opt || {} as options;

    // resolve IP from NetBios
    // this.ip = netBios.resolve(matches[0]);
    this.ip = opt.address;

    // set default port
    this.port = opt.port || port;

    // set message id
    this.messageId = 0;

    // save the full path
    this.fullPath = "\\\\" + this.ip + "\\" + opt.share;

    // packet concurrency default 20
    this.packetConcurrency = opt.packetConcurrency || packetConcurrency;

    // close timeout default 10s
    if (opt.autoCloseTimeout !== undefined) {
      this.autoCloseTimeout = opt.autoCloseTimeout
    } else {
      this.autoCloseTimeout = autoCloseTimeout
    }

    // store authentification
    this.domain = opt.domain;
    this.username = opt.username;
    this.password = opt.password;

    // set session id
    this.SessionId = Math.floor(Math.random() * 256) & 0xFF;


    // set the process id
    // https://msdn.microsoft.com/en-us/library/ff470100.aspx
    this.ProcessId = new Buffer([
      Math.floor(Math.random() * 256) & 0xFF,
      Math.floor(Math.random() * 256) & 0xFF,
      Math.floor(Math.random() * 256) & 0xFF,
      Math.floor(Math.random() * 256) & 0xFE
    ]);

    // init connection (socket)
    SMB2Connection.init(this);
  }

  public exists(path, callback) {
    SMB2Connection.requireConnect(this, exists)(path, callback)
  }

  public mkdir(path, callback) {
    SMB2Connection.requireConnect(this, mkdir)(path, callback)
  }

  public listFile(path, callback) {
    path = this.fmtPath(path)
    SMB2Connection.requireConnect(this, readdir)(path, callback)
  }

  public readFile(filename: string, options?: { encoding: 'UTF-8' }, callback?: any) {
    if (!options) {
      options = { encoding: 'UTF-8' }
    }
    SMB2Connection.requireConnect(this, readfile)([filename, options], callback)
  }

  public rename(oldPath, newPath, callback) {
    SMB2Connection.requireConnect(this, rename)([oldPath, newPath], callback)
  }

  public writeFile(filename, data, encoding?: string, callback?: any) {
    if (!encoding) {
      encoding = 'UTF-8'
    }
    SMB2Connection.requireConnect(this, writefile)([filename, data, encoding], callback)
  }


  public rmdir(path, callback) {
    SMB2Connection.requireConnect(this, rmdir)(path, callback)
  }

  public unlink(path, callback) {
    SMB2Connection.requireConnect(this, unlink)(path, callback)
  }

  public sendFile(filename: string, data, callback) {
    SMB2Connection.requireConnect(this, sendfile)([filename, data], callback)
  }

  public listShare(callback) {
    // TODO impl it
    let tpath = this.ip + "/IPC$"
    SMB2Connection.requireConnect(this, listshare)([], callback)
  }

  public close() {
    close(this)
  }

  private fmtPath(path) {
    if (path.startsWith("/")) {
      path = path.substring(1)
    }
    if (path.endsWith("/")) {
      path = path.substring(0, path.length - 1)
    }
    return path.replace("/", "\\")
  }
}