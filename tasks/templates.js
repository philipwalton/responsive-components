const fs = require('fs-extra');
const gulp = require('gulp');
const hljs = require('highlight.js');
const htmlMinifier = require('html-minifier');
const nunjucks = require('nunjucks');
const path = require('path');
const config = require('../config');

const {getRevisionedAssetUrl} = require('./utils/assets');

const env = nunjucks.configure('./app/templates', {
  autoescape: false,
  watch: false,
  noCache: true,
});

env.addFilter('revision', (filename) => {
  return getRevisionedAssetUrl(filename);
});

const inlineCache = {};
env.addFilter('inline', (filepath) => {
  if (!inlineCache[filepath]) {
    inlineCache[filepath] =
        fs.readFileSync(`${config.publicDir}/${filepath}`, 'utf-8');
  }

  return inlineCache[filepath];
});

function RemoteExtension() {
  this.tags = ['highlight'];

  this.parse = function(parser, nodes, lexer) {
    // get the tag token
    let tok = parser.nextToken();

    // parse the args and move after the block end. passing true
    // as the second arg is required if there are no parentheses
    let args = parser.parseSignature(null, true);
    parser.advanceAfterBlockEnd(tok.value);

    // parse the block contents
    let body = parser.parseUntilBlocks('endhighlight');
    parser.advanceAfterBlockEnd();

    return new nodes.CallExtension(this, 'run', args, [body]);
  };

  this.run = function(context, lang, block) {
    // Remove leading and trailing whitespace, with the exception of
    // leading whitespace on the first line with text.
    let code = block().replace(/^(\s*\n)+|\s+$/g, '');

    const firstLineWhitespace = /^\s*/.exec(code);
    if (firstLineWhitespace) {
      code = code.split('\n').map((line) => {
        return line.replace(firstLineWhitespace, '');
      }).join('\n');
    }

    code = hljs.highlight(lang, code).value;

    // Allow for highlighting portions of code blocks
    // using `**` before and after.
    return `<pre><code class="language-${lang}">${
        code.replace(/\*\*(.+)?\*\*/g, `<mark>$1</mark>`)}</code></pre>`;
  };
}

env.addExtension('RemoteExtension', new RemoteExtension());

const minifyHtml = (html) => {
  let opts = {
    removeComments: true,
    collapseWhitespace: true,
    collapseBooleanAttributes: true,
    removeAttributeQuotes: true,
    removeRedundantAttributes: true,
    useShortDoctype: true,
    removeEmptyAttributes: true,
    minifyJS: true,
    minifyCSS: true,
  };

  return htmlMinifier.minify(html, opts);
};

const processHtml = (html) => {
  return process.env.NODE_ENV === 'production' ? minifyHtml(html) : html;
};

gulp.task('templates', async () => {
  try {
    const data = Object.assign({ENV: process.env.NODE_ENV}, config);
    const html = nunjucks.render('index.html', data);
    await fs.outputFile(
        path.join(config.publicDir, 'index.html'), processHtml(html));
  } catch (err) {
    console.error(err);
  }
});
