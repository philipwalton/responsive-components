const title = `Responsive Components`;
const repo = `responsive-components`;
const url = `https://philipwalton.github.io/${repo}/`
const desc = `a modern strategy for styling components ` +
    `based on the size of their container`;

const repoUrl = `https://github.com/philipwalton/${repo}`;
const publicPath = `/${repo}/`;
const publicDir = `${repo}`;
const publicStaticDir = `${repo}/static`;
const publicStaticPath = `/${repo}/static/`;
const manifestFileName = `revisioned-asset-manifest.json`;
const shareInfo = {
  url: url,
  text: `${title}: ${desc}`,
  via: `philwalton`,
};

module.exports = {
  title,
  repo,
  url,
  desc,
  repoUrl,
  publicPath,
  publicDir,
  publicStaticDir,
  publicStaticPath,
  manifestFileName,
  shareInfo,
};
