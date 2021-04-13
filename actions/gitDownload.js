const fs_mkdirPromise = require('util').promisify(require('fs').mkdir);

const fs_unlinkPromise = require('util').promisify(require('fs').unlink);

const fs_lstatPromise = require('util').promisify(require('fs').lstat);

const fs_readdirPromise = require('util').promisify(require('fs').readdir);

const downloader = require('github-download');

const fs = require('fs-extra');

const path = require('path');

module.exports = {
  download: download,
  deleteRecursive: deleteFolderRecursive
};

async function deleteFolderRecursive(folder) {
  if (fs.existsSync(folder)) {
    for (const [index, file] of (await fs_readdirPromise(folder)).entries()) {
      const curPath = path.join(folder, file);

      if ((await fs_lstatPromise(curPath)).isDirectory()) {
        // recurse
        deleteFolderRecursive(curPath);
      } else {
        // delete file
        await fs_unlinkPromise(curPath);
      }
    }

    fs.rmdirSync(folder);
  }
}

async function download(urlOrObj, dest) {
  return new Promise(async (resolve, reject) => {
    const tmp = dest + 'tmp';
    await fs_mkdirPromise(tmp, {
      recursive: true
    });
    let dld = downloader(urlOrObj, tmp, process.cwd());
    dld.on('end', async res => {
      fs.copy(tmp, dest, {
        mkdir: true
      }, function (err) {
        if (err) throw new Error(err);
        deleteFolderRecursive(tmp);
        resolve(dld);
      });
    });
  });
}