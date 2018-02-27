const title = `Responsive Components`;
const repo = `responsive-components`;
const url = `https://philipwalton.github.io/${repo}/`
const desc = `a modern approach to styling elements ` +
    `based on the size of their container`;

const authorUrl = `https://philipwalton.com`;
const articleUrl = `${authorUrl}/articles/` +
    `responsive-components-a-solution-to-the-container-queries-problem/`;

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
  authorUrl,
  articleUrl,
  repoUrl,
  publicPath,
  publicDir,
  publicStaticDir,
  publicStaticPath,
  manifestFileName,
  shareInfo,
};
