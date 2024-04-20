import { SMB2ImpersonationLevel } from '../mssmb2/SMB2ImpersonationLevel'

export namespace Create {
  export const StructureSize = 57
}

export default {
  request: [
    ['StructureSize', 2, Create.StructureSize],
    ['SecurityFlags', 1, 0],
    ['RequestedOpLockLevel', 1, 0],
    ['ImpersonationLevel', 4, SMB2ImpersonationLevel.Impersonation],
    ['SmbCreateFlags', 8, 0],
    ['Reserved', 8, 0],
    ['DesiredAccess', 4, 0x00100081],
    ['FileAttributes', 4, 0x00000000],
    ['ShareAccess', 4, 0x00000007],
    ['CreateDisposition', 4, 0x00000001],
    ['CreateOptions', 4, 0x00000020],
    ['NameOffset', 2],
    ['NameLength', 2],
    ['CreateContextsOffset', 4],
    ['CreateContextsLength', 4],
    ['Buffer', 'NameLength'],
    ['Reserved2', 2, 0x4200],
    ['CreateContexts', 'CreateContextsLength', ''],
  ],

  response: [
    ['StructureSize', 2],
    ['OplockLevel', 1],
    ['Flags', 1],
    ['CreateAction', 4],
    ['CreationTime', 8],
    ['LastAccessTime', 8],
    ['LastWriteTime', 8],
    ['ChangeTime', 8],
    ['AllocationSize', 8],
    ['EndofFile', 8],
    ['FileAttributes', 4],
    ['Reserved2', 4],
    ['FileId', 16],
    ['CreateContextsOffset', 4],
    ['CreateContextsLength', 4],
    ['Buffer', 'CreateContextsLength'],
  ]
}