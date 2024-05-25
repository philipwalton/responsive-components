import path from 'node:path';
import fs from 'fs-extra';
import hljs from 'highlight.js';
import nunjucks from 'nunjucks';
import {config} from '../config.js';

const env = nunjucks.configure('./app/templates', {
  autoescape: false,
  watch: false,
  noCache: true,
});

function RemoteExtension() {
  this.tags = ['highlight'];

  this.parse = function (parser, nodes, lexer) {
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

  this.run = function (context, language, block) {
    // Remove leading and trailing whitespace, with the exception of
    // leading whitespace on the first line with text.
    let code = block().replace(/^(\s*\n)+|\s+$/g, '');

    const firstLineWhitespace = /^\s*/.exec(code);
    if (firstLineWhitespace) {
      code = code
        .split('\n')
        .map((line) => {
          return line.replace(firstLineWhitespace, '');
        })
        .join('\n');
    }

    code = hljs.highlight(code, {language}).value;

    // Allow for highlighting portions of code blocks
    // using `**` before and after.
    return `<pre><code class="language-${language}">${code.replace(
      /\*\*(.+)?\*\*/g,
      `<mark>$1</mark>`
    )}</code></pre>`;
  };
}

env.addExtension('RemoteExtension', new RemoteExtension());

export async function compileTemplates() {
  const data = config;
  const html = nunjucks.render('index.html', data);
  await fs.outputFile(
    path.join(config.publicDir, 'index.html'),
    html,
  );
}

