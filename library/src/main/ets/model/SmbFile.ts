export default class SmbFile {
  Index: 0
  // milliseconds
  CreationTime: number
  // milliseconds
  LastAccessTime: number
  // milliseconds
  LastWriteTime: number
  // milliseconds
  ChangeTime: number
  EndofFile: bigint
  AllocationSize: bigint
  FileAttributes: number
  FilenameLength: number
  EASize: number
  ShortNameLength: 0
  FileId: ''
  Filename: string

  isDirectory(): boolean {
    return (this.FileAttributes & 0x00000010) > 0
  }
}