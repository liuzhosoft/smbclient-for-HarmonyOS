import { FileInformationClass } from '../msfscc/FileInformationClass'

export default {
  request: [
    ['StructureSize', 2, 33]
    , ['FileInformationClass', 1, FileInformationClass.FileIdBothDirectoryInformation]
    , ['Flags', 1, 0]
    , ['FileIndex', 4, 0]
    , ['FileId', 16]
    , ['FileNameOffset', 2, 96]
    , ['FileNameLength', 2]
    , ['OutputBufferLength', 4, 0x00010000]
    , ['Buffer', 'FileNameLength']
  ],

  response: [
    ['StructureSize', 2]
    , ['OutputBufferOffset', 2]
    , ['OutputBufferLength', 4]
    , ['Buffer', 'OutputBufferLength']
  ]
}