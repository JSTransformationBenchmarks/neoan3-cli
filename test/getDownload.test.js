const fs_readFilePromise = require('util').promisify(require('fs').readFile);

const fs_mkdirPromise = require('util').promisify(require('fs').mkdir);

const assert = require('assert');

const download = require('../actions/gitDownload');

const fs = require('fs');

const path = require('path');

describe('Download', function () {
  before(async function () {
    await fs_mkdirPromise('./demo');
  });
  after(function () {
    download.deleteRecursive('./demo');
  });
  describe('#download - download by url', function () {
    it('should download a complete repo', async function () {
      let dl = await download.download('https://github.com/sroehrl/neoan3.git', './demo/');
      assert.equal(dl.user, 'sroehrl');
      let testComposer = JSON.parse(await fs_readFilePromise('./demo/composer.json', 'utf-8'));
      assert.equal(testComposer.name, 'sroehrl/neoan3');
    });
  });
  describe('#download - download by object', function () {
    it('should download a complete repo', async function () {
      download.deleteRecursive('./demo');
      let dl = await download.download({
        user: 'sroehrl',
        repo: 'neoan3',
        ref: 'master'
      }, './demo/');
      assert.equal(dl.user, 'sroehrl');
      let testComposer = JSON.parse(await fs_readFilePromise('./demo/composer.json', 'utf-8'));
      assert.equal(testComposer.name, 'sroehrl/neoan3');
    });
  });
});