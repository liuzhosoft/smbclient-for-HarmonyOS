import SMB2Connection from '../tools/smb2_connection';

export default function close(connection) {
  console.info('smj connection close')
  SMB2Connection.close(connection)
}