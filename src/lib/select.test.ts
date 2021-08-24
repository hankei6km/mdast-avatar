import { Content, Paragraph } from 'mdast';
import fromMarkdown from 'mdast-util-from-markdown';
import { pickBase, selectTarget } from './select';

const testTree = (s: string): Content[] => {
  const tree = fromMarkdown(s);
  return (tree.children[0] as Paragraph).children;
};

describe('pickBase()', () => {
  it('should pick "line break + image"', async () => {
    const c = testTree(
      '![alt1](avatar:data:image/png;base64,iVBOR)\n![](https://hankei6km.github.io/base.png)'
    );
    const sel = pickBase(c, 0);
    expect(sel).toEqual([1, 2]);
  });
  it('should pick "image"', async () => {
    const c = testTree(
      '![alt1](avatar:data:image/png;base64,iVBOR)![](https://hankei6km.github.io/base.png)'
    );
    const sel = pickBase(c, 0);
    expect(sel).toEqual([1]);
  });
  it('should pick "link image"', async () => {
    const c = testTree(
      '![alt1](avatar:data:image/png;base64,iVBOR)[![](https://hankei6km.github.io/base.png)](https://hankei6km.github.io/)'
    );
    const sel = pickBase(c, 0);
    expect(sel).toEqual([1]);
  });
  it('should skip "image" that have invalid url ', async () => {
    const c = testTree(
      '![alt1](avatar:data:image/png;base64,iVBOR)![](/path/to/base.png)'
    );
    const sel = pickBase(c, 0);
    expect(sel).toEqual([]);
  });
});

describe('selectTarget()', () => {
  it('should return "image-alt" and iamge content(data)', async () => {
    const c = testTree('![avatar:alt](data:image/png;base64,iVBOR)\ntest');
    const sel = selectTarget(c, 0);
    expect(sel.kind).toEqual('image-alt');
    expect(sel.avatarContent).toEqual([c[0]]);
  });
  it('should return "image-salt" and iamge content(https)', async () => {
    const c = testTree(
      '![avatar:alt](https://hankei6km.github.io/mdast-avatar.png,iVBOR)\ntest'
    );
    const sel = selectTarget(c, 0);
    expect(sel.kind).toEqual('image-alt');
    expect(sel.avatarContent).toEqual([c[0]]);
  });
  it('should not return "image-alt" and iamge content', async () => {
    const c = testTree('![avatar:alt](/path/to/test.png)\ntest');
    const sel = selectTarget(c, 0);
    expect(sel.kind).toEqual('');
    expect(sel.avatarContent).toEqual([]);
  });
  it('should return "image-scheme" and iamge content(data)', async () => {
    const c = testTree('![alt](avatar:data:image/png;base64,iVBOR)\ntest');
    const sel = selectTarget(c, 0);
    expect(sel.kind).toEqual('image-scheme');
    expect(sel.avatarContent).toEqual([c[0]]);
  });
  it('should return "image-scheme" and iamge content(https)', async () => {
    const c = testTree(
      '![alt](avatar:https://hankei6km.github.io/mdast-avatar.png,iVBOR)\ntest'
    );
    const sel = selectTarget(c, 0);
    expect(sel.kind).toEqual('image-scheme');
    expect(sel.avatarContent).toEqual([c[0]]);
  });
  it('should not return "image-scheme" and iamge content', async () => {
    const c = testTree('![alt](avatar:/path/to/test.png)\ntest');
    const sel = selectTarget(c, 0);
    expect(sel.kind).toEqual('');
    expect(sel.avatarContent).toEqual([]);
  });
  it('should return "image-file" and iamge content', async () => {
    const c = testTree(
      '![test](https://hankei6km.github.io/mdast-avatar.png)\ntext'
    );
    const sel = selectTarget(c, 0);
    expect(sel.kind).toEqual('image-file');
    expect(sel.avatarContent).toEqual([c[0]]);
  });
  it('should not return "image-file" and iamge content', async () => {
    const c = testTree('![test](/path/to/mdast-avatar.png)\ntext');
    const sel = selectTarget(c, 0);
    expect(sel.kind).toEqual('');
    expect(sel.avatarContent).toEqual([]);
  });
  it('should return "image-file" and iamge contents', async () => {
    const c = testTree(
      '![alt](https://hankei6km.github.io/mdast-avatar.png)\n![](https://hankei6km.github.io/base.png)'
    );
    const sel = selectTarget(c, 0);
    expect(sel.kind).toEqual('image-file');
    expect(sel.avatarContent).toEqual([c[0], c[2]]);
  });
});
