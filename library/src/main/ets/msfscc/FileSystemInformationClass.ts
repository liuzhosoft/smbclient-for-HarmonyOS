/**
 * MS-FSCC 2.5 File System Information Classes
 */
export enum FileSystemInformationClass {
  FileFsVolumeInformation = 0x01,
  FileFsLabelInformation = 0x02,
  FileFsSizeInformation = 0x03,
  FileFsDeviceInformation = 0x04,
  FileFsAttributeInformation = 0x05,
  FileFsControlInformation = 0x06,
  FileFsFullSizeInformation = 0x07,
  FileFsObjectIdInformation = 0x08,
  FileFsDriverPathInformation = 0x09,
  FileFsVolumeFlagsInformation = 0x0A,
  FileFsSectorSizeInformation = 0x0B,
}