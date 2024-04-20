/**
 * [MS-SMB2].pdf 2.2.13 SMB2 CREATE Request - CreateDisposition
 * <p>
 * Defines the action the server MUST take if the file that is specified in the name field already exists.
 * For opening named pipes, this field may be set to any value by the client and MUST be ignored by the server.
 * For other files, this field MUST contain one of the following values.
 */
export enum SMB2CreateDisposition {
  /**
   * If the file already exists, supersede it. Otherwise, create the file. This value SHOULD NOT be used for a printer object.
   */
  FILE_SUPERSEDE = 0x00000000,
  /**
   * If the file already exists, return success; otherwise, fail the operation. MUST NOT be used for a printer object.
   */
  FILE_OPEN = 0x00000001,
  /**
   * If the file already exists, fail the operation; otherwise, create the file.
   */
  FILE_CREATE = 0x00000002,
  /**
   * Open the file if it already exists; otherwise, create the file. This value SHOULD NOT be used for a printer object.
   */
  FILE_OPEN_IF = 0x00000003,
  /**
   * Overwrite the file if it already exists; otherwise, fail the operation. MUST NOT be used for a printer object.
   */
  FILE_OVERWRITE = 0x00000004,
  /**
   * Overwrite the file if it already exists; otherwise, create the file. This value SHOULD NOT be used for a printer object.
   */
  FILE_OVERWRITE_IF = 0x00000005,
}
