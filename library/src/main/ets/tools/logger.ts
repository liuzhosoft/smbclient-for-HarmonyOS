import { SMB2 } from '../smb2'

export function logd(tag: string, msg: string, e?: Error) {
  if (SMB2.log) {
    console.debug(`[${tag}]: ${msg}${e ? ('\n' + e.stack) : ''}`)
  }
}

export function loge(tag: string, msg: string, e?: Error) {
  if (SMB2.log) {
    console.error(`[${tag}]: ${msg}${e ? ('\n' + e.stack) : ''}`)
  }
}

export function logi(tag: string, msg: string, e?: Error) {
  if (SMB2.log) {
    console.info(`[${tag}]: ${msg}${e ? ('\n' + e.stack) : ''}`)
  }
}

export function logw(tag: string, msg: string, e?: Error) {
  if (SMB2.log) {
    console.warn(`[${tag}]: ${msg}${e ? ('\n' + e.stack) : ''}`)
  }
}