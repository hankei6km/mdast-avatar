# mdast-avatar

[mdast](https://github.com/syntax-tree/mdast) に含まれる画像をアバターとして Markdown へ埋め込む。

## Install

npm:

```
npm install mdast-avatar
```

## Usage

### 画像の URL に `avatar:`

code:

```typescript
import fromMarkdown from 'mdast-util-from-markdown';
import toMarkdown from 'mdast-util-to-markdown';
import { toImageDataURL } from './avatar';

(async () => {
  const tree = fromMarkdown('# title\n\n![My avatar](avatar:https://github.com/hankei6km/mdast-avatar/raw/main/example/example-avatar.png)\ntext');
  await toImageDataURL(tree);
  console.log(toMarkdown(tree));
})();
```

yield:

```markdown
# title

![My avatar](data:image/png;base64, ...snip ...=)
text
```

### 画像の alt に `avatar:`

code:

```typescript
import fromMarkdown from 'mdast-util-from-markdown';
import toMarkdown from 'mdast-util-to-markdown';
import { toImageDataURL } from './avatar';

(async () => {
  const tree = fromMarkdown('# title\n\n![avatar:My avatar](https://github.com/hankei6km/mdast-avatar/raw/main/example/example-avatar.png)\ntext');
  await toImageDataURL(tree);
  console.log(toMarkdown(tree));
})();
```

yield:

```markdown
# title

![My avatar](data:image/png;base64, ...snip ...=)
text
```

### Base Image に重ねる

code:

```typescript
import fromMarkdown from 'mdast-util-from-markdown';
import toMarkdown from 'mdast-util-to-markdown';
import { toImageDataURL } from './qrcode';

(async () => {
  const tree = fromMarkdown(
    '# title\n\![avatar:](https://github.com/hankei6km/mdast-avatar/raw/main/example/example-avatar.png)\n![Base image](https://github.com/hankei6km/mdast-avatar/raw/main/example/example-base.jpg)\ntext'
  );
  await toImageDataURL(tree);
  console.log(toMarkdown(tree));
})();
```

yield:

```markdown
# title

![Base image](data:image/png;base64, ...snip ...=)
text
```

### Options

code:

```typescript
import fromMarkdown from 'mdast-util-from-markdown';
import toMarkdown from 'mdast-util-to-markdown';
import { toImageDataURL } from './qrcode';

(async () => {
  const tree = fromMarkdown(
    '# title\n\![avatar:avatar_padding-2](https://github.com/hankei6km/mdast-avatar/raw/main/example/example-avatar.png)\n![Base image](https://github.com/hankei6km/mdast-avatar/raw/main/example/example-base.jpg)\ntext'
  );
  await toImageDataURL(tree);
  console.log(toMarkdown(tree));
})();
```

yield:

```markdown
# title

![Base image](data:image/png;base64, ...snip ...=)
text
```
avatar options:

- position: `-avatar_position-<center | right-bottom>`
- fillstyle: `-avatar_fillstyle-<<RRGGBBAA>>`
- fillshape: `-avatar_fillshape-<circle | rect>>`
- margin: `-avatar_margin-<number>`
- paddinfg: `-avatar_padding-<number>`
- fit: `-avatar_fit-<number>`
- query: `-avatar_query-<string>` (オプション文字列全体の末尾に指定)

format options:
- type: `-format_type-<png | jpeg>`
- quality: `-format_quality-<number>` (単位は `%`)


## API

### `toImageDataURL(tree[, options])`

[mdast](https://github.com/syntax-tree/mdast) に含まれる画像をアバターとして変換。

変換対象となる画像。
- `src` が `avatar:` で始まる
- `alt` が `avatar:` で始まる
- `src` のファイル名が `mdast-avatar` で始まる
- 画像 URL のプロトコルが `http:` `https:` `data:` 

画像は `root / paragraph / image` 階層のみサポートしている。

アバターの直後に `image` または `link / image` がある場合、その `image` はロゴ画像として扱われる。

#### `options.avatar`

主に base に avatar を重ねるときのオプション。

##### `position`

type: `center` | `right-bottom`  

deault: `center`

##### `fillstyle`

type: `#RRGGBBAA`

deault: `#FFFFFFFF`

##### `fillshape`

type: `circle` | `rect`

deault: `circle`

##### `margin`

type: `<number>`

default: `55`

##### `padding`

type: `<number>`

default: `4`

##### `fit`

type:`<number>`

base の幅に対する比率(単位は `%`)。 `0` を渡すと無効化。

default: `35`

##### `query`

type:`<string>`

アバター画像の URL に付加される文字列。

#### `format`

生成された画像を DataURL でエンコードするときのオプション。

##### `type`
 
type: `png` | `jpeg`

default: `png`

##### `quality`
 
type: `number`

default: `0.92`


#### returns

`Promise<MdNode>`

## CLI

```console
$ cat example/avatar-deck.md  | mdavatar > avatar-embedded-deck.md
```

なお、出力される markdown 文字列はアバター画像の変換以外も to-markdown の変換に影響される。

### JSON config file

```json
{
  "toMarkdown": { "bullet": "-", "rule": "-" }
}
```

`toMarkdown.bullet` / `toMarkdown.rule` フィールドは [toMarkdown](https://github.com/syntax-tree/mdast-util-to-markdown#tomarkdowntree-options) へ渡される。

## License

MIT License

Copyright (c) 2021 hankei6km

