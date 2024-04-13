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
  EndofFile: 0
  AllocationSize: 0
  FileAttributes: 0
  FilenameLength: 0
  EASize: 0
  ShortNameLength: 0
  FileId: ''
  Filename: ''

  isDirectory(): boolean {
    return (this.FileAttributes & 0x00000010) > 0
  }
}