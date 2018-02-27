const fs = require('fs-extra');
const path = require('path');
const revHash = require('rev-hash');
const revPath = require('rev-path');
const config = require('../../config');

let revisionedAssetManifest;

const getManifest = () => {
  if (!revisionedAssetManifest) {
    revisionedAssetManifest = fs.readJsonSync(path.join(
    config.publicStaticDir, config.manifestFileName), {throws: false}) || {};
  }

  return revisionedAssetManifest;
};

const saveManifest = () => {
  fs.outputJson(
      path.join(config.publicStaticDir, config.manifestFileName),
      revisionedAssetManifest, {spaces: 2});
};


const resetManifest = () => {
  revisionedAssetManifest = {};
  saveManifest();
};


const getAsset = (filename) => {
  getManifest();

  if (!revisionedAssetManifest[filename]) {
    throw new Error(`Revisioned file for '${filename}' doesn't exist`);
  }

  return revisionedAssetManifest[filename];
};


const addAsset = async (filename, revisionedFilename) => {
  getManifest();

  revisionedAssetManifest[filename] = revisionedFilename;

  saveManifest();
};


const getRevisionedAssetUrl = (filename) => {
  return path.join(config.publicStaticPath, getAsset(filename));
};


const generateRevisionedAsset = async (filename, content) => {
  const hash = revHash(content);
  const revisionedFilename = revPath(filename, hash);

  // Updates the internal revision map so it can be referenced later.
  addAsset(filename, revisionedFilename);

  await fs.outputFile(
      path.join(config.publicStaticDir, revisionedFilename), content);
};

module.exports = {
  getManifest,
  saveManifest,
  resetManifest,
  getAsset,
  addAsset,
  getRevisionedAssetUrl,
  generateRevisionedAsset,
};
