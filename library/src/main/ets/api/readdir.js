import SMB2Forge from '../tools/smb2_forge';

var SMB2Request = SMB2Forge.request

/*
 * readdir
 * =======
 *
 * list the file / directory from the path provided:
 *
 *  - open the directory
 *
 *  - query directory content
 *
 *  - close the directory
 *
 */
export default function (path, cb) {
  var connection = this;

  // SMB2 open directory
  SMB2Request('open_folder', {
    path: path
  }, connection, function (err, file) {
    if (err) cb && cb(err);
    // SMB2 query directory
    else queryDir(file, connection, [], cb);
  });
}


/*
 * Helpers
 */

/**
 * queryDir - recursive querying until all files in a directory have been added to the listing.
 * @param file
 * @param connection
 * @param completeFileListing
 * @param cb
 */
function queryDir(file, connection, completeFileListing, cb) {
  console.info("smb queryDir: " + JSON.stringify(file))
  SMB2Request('query_directory', file, connection, function (err, files) {
    var allFiles = completeFileListing.concat(files || []);
    // no more file
    // => close and send response
    if (err && err.code === 'STATUS_NO_MORE_FILES') {
      return SMB2Request('close', file, connection, function (err) {

        var filterFiles = allFiles
          .filter(function (v) {
            return v.Filename != '.' && v.Filename != '..'
          }) // remove '.' and '..' values

        cb && cb(null, filterFiles);
      });
    }

    // error
    // => close and send error
    if (err) {
      return cb && cb(err);
    }

    // still receiving files
    // => maybe the folder is not empty
    queryDir(file, connection, allFiles, cb)
  });
}

