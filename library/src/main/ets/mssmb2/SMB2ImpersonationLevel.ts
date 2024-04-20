/**
 * [MS-SMB2] 2.2.13 / [MS-WPO] 9.7
 */
export enum SMB2ImpersonationLevel {
  Anonymous = 0x00,
  Identification = 0x01,
  Impersonation = 0x02,
  Delegate = 0x03,
}
