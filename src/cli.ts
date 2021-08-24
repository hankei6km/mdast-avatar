import { Readable, Writable } from 'stream';
import fromMarkdown from 'mdast-util-from-markdown';
import toMarkdown from 'mdast-util-to-markdown';
import { toImageDataURL } from './avatar';
var syntax = require('micromark-extension-frontmatter');
var frontmatter = require('mdast-util-frontmatter');

type ToMarkdownOptions = {
  bullet?: '-' | '*' | '+';
  closeAtx?: boolean;
  emphasis?: '_' | '*';
  fence?: '~' | '`';
  fences?: boolean;
  incrementListMarker?: boolean;
  listItemIndent?: 'tab' | 'one' | 'mixed';
  quote?: '"' | "'";
  resourceLink?: boolean;
  rule?: '-' | '_' | '*';
  ruleRepetition?: number;
  ruleSpaces?: boolean;
  setext?: boolean;
  strong?: '_' | '*';
  tightDefinitions?: boolean;
};

type Opts = {
  stdin: Readable;
  stdout: Writable;
  stderr: Writable;
  bullet?: ToMarkdownOptions['bullet'];
  rule?: ToMarkdownOptions['rule'];
};

const cli = async ({
  stdin,
  stdout,
  stderr,
  bullet = '-',
  rule = '-'
}: Opts): Promise<number> => {
  try {
    let source = '';
    await new Promise((resolve) => {
      stdin.on('data', (d) => (source = source + d));
      stdin.on('end', () => resolve(source));
    });
    const tree = fromMarkdown(source, {
      extensions: [syntax(['yaml', 'toml'])],
      mdastExtensions: [frontmatter.fromMarkdown(['yaml', 'toml'])]
    });
    await toImageDataURL(tree);
    stdout.write(
      toMarkdown(tree, {
        bullet,
        rule,
        extensions: [frontmatter.toMarkdown(['yaml', 'toml'])]
      })
    );
  } catch (err) {
    stderr.write(err.toString());
    stderr.write('\n');
    return 1;
  }
  return 0;
};

export default cli;
