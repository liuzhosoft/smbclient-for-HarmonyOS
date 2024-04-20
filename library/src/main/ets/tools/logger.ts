import { SMB2 } from '../smb2'

export function logd(tag: string, msg: string, e?: Error) {
  if (SMB2.log) {
    console.debug(`[smbclient][${tag}]: ${msg}${e ? ('\n' + e.stack) : ''}`)
  }
}

export function loge(tag: string, msg: string, e?: Error) {
  if (SMB2.log) {
    console.error(`[smbclient][${tag}]: ${msg}${e ? ('\n' + e.stack) : ''}`)
  }
}

export function logi(tag: string, msg: string, e?: Error) {
  if (SMB2.log) {
    console.info(`[smbclient][${tag}]: ${msg}${e ? ('\n' + e.stack) : ''}`)
  }
}

export function logw(tag: string, msg: string, e?: Error) {
  if (SMB2.log) {
    console.warn(`[smbclient][${tag}]: ${msg}${e ? ('\n' + e.stack) : ''}`)
  }
}