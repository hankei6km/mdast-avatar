# mdast-avater

[mdast](https://github.com/syntax-tree/mdast) に含まれる画像をアバターとして Markdown へ埋め込む。

## Install

npm:

```
npm install mdast-qrcode
```

## Usage

### 画像の URL に `avater:`

code:

```typescript
import fromMarkdown from 'mdast-util-from-markdown';
import toMarkdown from 'mdast-util-to-markdown';
import { toImageDataURL } from './avater';

(async () => {
  const tree = fromMarkdown('# title\n\n![My avater](avater:https://github.com/hankei6km/mdast-avater/raw/main/example/example-avater.png)\ntext');
  await toImageDataURL(tree);
  console.log(toMarkdown(tree));
})();
```

yield:

```markdown
# title

![My avater](data:image/png;base64, ...snip ...=)
text
```

### 画像の alt に `avater:`

code:

```typescript
import fromMarkdown from 'mdast-util-from-markdown';
import toMarkdown from 'mdast-util-to-markdown';
import { toImageDataURL } from './avater';

(async () => {
  const tree = fromMarkdown('# title\n\n![avater:My avater](https://github.com/hankei6km/mdast-avater/raw/main/example/example-avater.png)\ntext');
  await toImageDataURL(tree);
  console.log(toMarkdown(tree));
})();
```

yield:

```markdown
# title

![My avater](data:image/png;base64, ...snip ...=)
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
    '# title\n\![avater:](https://github.com/hankei6km/mdast-avater/raw/main/example/example-avater.png)\n![Base image](https://github.com/hankei6km/mdast-avater/raw/main/example/example-base.jpg)\ntext'
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
    '# title\n\![avater:avater_padding-2](https://github.com/hankei6km/mdast-avater/raw/main/example/example-avater.png)\n![Base image](https://github.com/hankei6km/mdast-avater/raw/main/example/example-base.jpg)\ntext'
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
avater options:

- position: `-avater_position-<center | right-bottom>`
- fillstyle: `-avater_fillstyle-<<RRGGBBAA>>`
- fillshape: `-avater_fillshape-<circle | rect>>`
- margin: `-avater_margin-<number>`
- paddinfg: `-avater_padding-<number>`
- fit: `-avater_fit-<number>`
- query: `-avater_query-<string>` (オプション文字列全体の末尾に指定)

format options:
- type: `-format_type-<png | jpeg>`
- quality: `-format_quality-<number>` (単位は `%`)


## API

### `toImageDataURL(tree[, options])`

[mdast](https://github.com/syntax-tree/mdast) に含まれる画像をアバターとして変換。

変換対象となる画像。
- `src` が `avater:` で始まる
- `alt` が `avater:` で始まる
- `src` のファイル名が `mdast-avater` で始まる
- 画像 URL のプロトコルが `http:` `https:` `data:` 

画像は `root / paragraph / image` 階層のみサポートしている。

アバターの直後に `image` または `link / image` がある場合、その `image` はロゴ画像として扱われる。

#### Options

##### avater

主に base に avater を重ねるときのオプション。

###### `position`

 `center` | `right-bottom`  

deault: `center`

###### `fillstyle`

 `#RRGGBBAA`

deault: `#FFFFFFFF`

###### `fillshape`

 `circle` | `rect`

deault: `circle`

###### `margin`

 `<number>`

default: `55`

###### `padding`

 `<number>`

default: `4`

###### `fit`

`<number>`

base の幅に対する比率(単位は `%`)。 `0` を渡すと無効化。

default: `35`

###### `query`

`<string>`

アバター画像の URL に付加される文字列。

#### `format`

生成された画像を DataURL でエンコードするときのオプション。

##### `type`
 
  `png` | `jpeg`

default: `png`

##### `quality`
 
  `number`

default: `0.92`


#### returns

`Promise<MdNode>`

## CLI

```console
$ cat example/avater-deck.md  | mdavater > avater-embedded-deck.md
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

