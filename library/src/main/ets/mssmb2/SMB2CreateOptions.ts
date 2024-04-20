/**
 * SMB2 Create 2.2.13 - CreateOptions
 */
export enum SMB2CreateOptions {
  /**
   * The file being created or opened is a directory file. With this flag, the CreateDisposition field MUST be set to
   * FILE_CREATE, FILE_OPEN_IF, or FILE_OPEN. With this flag, only the following CreateOptions values are valid:
   * FILE_WRITE_THROUGH, FILE_OPEN_FOR_BACKUP_INTENT, FILE_DELETE_ON_CLOSE, and FILE_OPEN_REPARSE_POINT. If the file
   * being created or opened already exists and is not a directory file and FILE_CREATE is specified in the
   * CreateDisposition field, then the server MUST fail the request with STATUS_OBJECT_NAME_COLLISION. If the file
   * being created or opened already exists and is not a directory file and FILE_CREATE is not specified in the
   * CreateDisposition field, then the server MUST fail the request with STATUS_NOT_A_DIRECTORY. The server MUST fail
   * an invalid CreateDisposition field or an invalid combination of CreateOptions flags with STATUS_INVALID_PARAMETER.
   */
  FILE_DIRECTORY_FILE = 0x00000001,

  /**
   * The server MUST propagate writes to this open to persistent storage before returning success to the client on
   * write operations.
   */
  FILE_WRITE_THROUGH = 0x00000002,

  /**
   * This indicates that the application intends to read or write at sequential offsets using this handle, so the
   * server SHOULD optimize for sequential access. However, the server MUST accept any access pattern. This flag value
   * is incompatible with the FILE_RANDOM_ACCESS value.
   */
  FILE_SEQUENTIAL_ONLY = 0x00000004,

  /**
   * The server or underlying object store SHOULD NOT cache data at intermediate layers and SHOULD allow it to flow
   * through to persistent storage.
   */
  FILE_NO_INTERMEDIATE_BUFFERING = 0x00000008,

  /**
   * @Deprecated
   * This bit SHOULD be set to 0 and MUST be ignored by the server.
   */
  FILE_SYNCHRONOUS_IO_ALERT = 0x00000010,

  /**
   * @Deprecated
   * This bit SHOULD be set to 0 and MUST be ignored by the server.
   */
  FILE_SYNCHRONOUS_IO_NONALERT = 0x00000020,

  /**
   * If the name of the file being created or opened matches with an existing directory file, the server MUST fail the
   * request with STATUS_FILE_IS_A_DIRECTORY. This flag MUST NOT be used with FILE_DIRECTORY_FILE or the server MUST
   * fail the request with STATUS_INVALID_PARAMETER.
   */
  FILE_NON_DIRECTORY_FILE = 0x00000040,

  /**
   * @Deprecated
   * This bit SHOULD be set to 0 and MUST be ignored by the server.
   */
  FILE_COMPLETE_IF_OPLOCKED = 0x00000100,

  /**
   * The caller does not understand how to handle extended attributes. If the request includes an
   * SMB2_CREATE_EA_BUFFER create context, then the server MUST fail this request with STATUS_ACCESS_DENIED. If
   * extended attributes with the FILE_NEED_EA flag =see [MS-FSCC] section 2.4.15) set are associated with the file
   * being opened, then the server MUST fail this request with STATUS_ACCESS_DENIED.
   */
  FILE_NO_EA_KNOWLEDGE = 0x00000200,

  /**
   * This indicates that the application intends to read or write at random offsets using this handle, so the server
   * SHOULD optimize for random access. However, the server MUST accept any access pattern. This flag value is
   * incompatible with the FILE_SEQUENTIAL_ONLY value. If both FILE_RANDOM_ACCESS and FILE_SEQUENTIAL_ONLY are set,
   * then FILE_SEQUENTIAL_ONLY is ignored.
   */
  FILE_RANDOM_ACCESS = 0x00000800,

  /**
   * The file MUST be automatically deleted when the last open request on this file is closed. When this option is
   * set, the DesiredAccess field MUST include the DELETE flag. This option is often used for temporary files.
   */
  FILE_DELETE_ON_CLOSE = 0x00001000,

  /**
   * @Deprecated
   * This bit SHOULD be set to 0 and the server MUST fail the request with a STATUS_NOT_SUPPORTED error if this bit is
   * set.
   */

  FILE_OPEN_BY_FILE_ID = 0x00002000,

  /**
   * The file is being opened for backup intent. That is, it is being opened or created for the purposes of either a
   * backup or a restore operation. The server can check to ensure that the caller is capable of overriding whatever
   * security checks have been placed on the file to allow a backup or restore operation to occur. The server can
   * check for access rights to the file before checking the DesiredAccess field.
   */
  FILE_OPEN_FOR_BACKUP_INTENT = 0x00004000,

  /**
   * The file cannot be compressed. This bit is ignored when FILE_DIRECTORY_FILE is set in CreateOptions.
   */
  FILE_NO_COMPRESSION = 0x00008000,

  /**
   * @Deprecated
   * This bit SHOULD be set to 0 and MUST be ignored by the server.
   */
  FILE_OPEN_REMOTE_INSTANCE = 0x00000400,

  /**
   * @Deprecated
   * This bit SHOULD be set to 0 and MUST be ignored by the server.
   */
  FILE_OPEN_REQUIRING_OPLOCK = 0x00010000,

  /**
   * @Deprecated
   * This bit SHOULD be set to 0 and MUST be ignored by the server.
   */
  FILE_DISALLOW_EXCLUSIVE = 0x00020000,

  /**
   * @Deprecated
   * This bit SHOULD be set to 0 and the server MUST fail the request with a STATUS_NOT_SUPPORTED error if this bit is
   * set.
   */
  FILE_RESERVE_OPFILTER = 0x00100000,

  /**
   * If the file or directory being opened is a reparse point, open the reparse point itself rather than the target
   * that the reparse point references.
   */
  FILE_OPEN_REPARSE_POINT = 0x00200000,

  /**
   * In an HSM =Hierarchical Storage Management) environment, this flag means the file SHOULD NOT be recalled from
   * tertiary storage such as tape. The recall can take several minutes. The caller can specify this flag to avoid
   * those delays.
   */
  FILE_OPEN_NO_RECALL = 0x00400000,

  /**
   * @Deprecated
   * Open file to query for free space. The client SHOULD set this to 0 and the server MUST ignore it.
   */
  FILE_OPEN_FOR_FREE_SPACE_QUERY = 0x00800000,


}
