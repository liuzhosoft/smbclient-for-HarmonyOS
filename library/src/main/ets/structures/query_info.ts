import { FileInformationClass } from '../msfscc/FileInformationClass';

export enum QueryInfoType {
  /**
   * The file information is requested.
   */
  SMB2_0_INFO_FILE = 0x01,
  /**
   * The underlying object store information is requested.
   */
  SMB2_0_INFO_FILESYSTEM = 0x02,
  /**
   * The security information is requested.
   */
  SMB2_0_INFO_SECURITY = 0x03,
  /**
   * The underlying object store quota information is requested.
   */
  SMB2_0_INFO_QUOTA = 0x04,
}

const MAX_OUTPUT_BUFFER_LENGTH = 64 * 1024;

export default {
  request: [
    ['StructureSize', 2, 41],
    ['InfoType', 1, QueryInfoType.SMB2_0_INFO_FILE],
    ['FileInformationClass', 1, FileInformationClass.FileAllInformation],
    ['MaxOutputBufferLength', 4, MAX_OUTPUT_BUFFER_LENGTH],
    ['InputBufferOffset', 2, 0],
    ['Reserved', 2, 0],
    ['InputBufferLength', 4, 0],
    ['AdditionalInformation', 4, 0],
    ['Flags', 4, 0],
    ['FileId', 16],
  ],

  response: [
    ['StructureSize', 2],
    ['OutputBufferOffset', 2],
    ['OutputBufferLength', 4],
    ['Buffer', 'OutputBufferLength'],
  ]
}