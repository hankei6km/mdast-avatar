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
      '![alt1](avater:data:image/png;base64,iVBOR)\n![](https://hankei6km.github.io/base.png)'
    );
    const sel = pickBase(c, 0);
    expect(sel).toEqual([1, 2]);
  });
  it('should pick "image"', async () => {
    const c = testTree(
      '![alt1](avater:data:image/png;base64,iVBOR)![](https://hankei6km.github.io/base.png)'
    );
    const sel = pickBase(c, 0);
    expect(sel).toEqual([1]);
  });
  it('should pick "link image"', async () => {
    const c = testTree(
      '![alt1](avater:data:image/png;base64,iVBOR)[![](https://hankei6km.github.io/base.png)](https://hankei6km.github.io/)'
    );
    const sel = pickBase(c, 0);
    expect(sel).toEqual([1]);
  });
  it('should skip "image" that have invalid url ', async () => {
    const c = testTree(
      '![alt1](avater:data:image/png;base64,iVBOR)![](/path/to/base.png)'
    );
    const sel = pickBase(c, 0);
    expect(sel).toEqual([]);
  });
});

describe('selectTarget()', () => {
  it('should return "image-alt" and iamge content(data)', async () => {
    const c = testTree('![avater:alt](data:image/png;base64,iVBOR)\ntest');
    const sel = selectTarget(c, 0);
    expect(sel.kind).toEqual('image-alt');
    expect(sel.avaterContent).toEqual([c[0]]);
  });
  it('should return "image-salt" and iamge content(https)', async () => {
    const c = testTree(
      '![avater:alt](https://hankei6km.github.io/mdast-avater.png,iVBOR)\ntest'
    );
    const sel = selectTarget(c, 0);
    expect(sel.kind).toEqual('image-alt');
    expect(sel.avaterContent).toEqual([c[0]]);
  });
  it('should not return "image-alt" and iamge content', async () => {
    const c = testTree('![avater:alt](/path/to/test.png)\ntest');
    const sel = selectTarget(c, 0);
    expect(sel.kind).toEqual('');
    expect(sel.avaterContent).toEqual([]);
  });
  it('should return "image-scheme" and iamge content(data)', async () => {
    const c = testTree('![alt](avater:data:image/png;base64,iVBOR)\ntest');
    const sel = selectTarget(c, 0);
    expect(sel.kind).toEqual('image-scheme');
    expect(sel.avaterContent).toEqual([c[0]]);
  });
  it('should return "image-scheme" and iamge content(https)', async () => {
    const c = testTree(
      '![alt](avater:https://hankei6km.github.io/mdast-avater.png,iVBOR)\ntest'
    );
    const sel = selectTarget(c, 0);
    expect(sel.kind).toEqual('image-scheme');
    expect(sel.avaterContent).toEqual([c[0]]);
  });
  it('should not return "image-scheme" and iamge content', async () => {
    const c = testTree('![alt](avater:/path/to/test.png)\ntest');
    const sel = selectTarget(c, 0);
    expect(sel.kind).toEqual('');
    expect(sel.avaterContent).toEqual([]);
  });
  it('should return "image-file" and iamge content', async () => {
    const c = testTree(
      '![test](https://hankei6km.github.io/mdast-avater.png)\ntext'
    );
    const sel = selectTarget(c, 0);
    expect(sel.kind).toEqual('image-file');
    expect(sel.avaterContent).toEqual([c[0]]);
  });
  it('should not return "image-file" and iamge content', async () => {
    const c = testTree('![test](/path/to/mdast-avater.png)\ntext');
    const sel = selectTarget(c, 0);
    expect(sel.kind).toEqual('');
    expect(sel.avaterContent).toEqual([]);
  });
  it('should return "image-file" and iamge contents', async () => {
    const c = testTree(
      '![alt](https://hankei6km.github.io/mdast-avater.png)\n![](https://hankei6km.github.io/base.png)'
    );
    const sel = selectTarget(c, 0);
    expect(sel.kind).toEqual('image-file');
    expect(sel.avaterContent).toEqual([c[0], c[2]]);
  });
});
