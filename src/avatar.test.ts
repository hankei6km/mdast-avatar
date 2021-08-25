import fromMarkdown from 'mdast-util-from-markdown';
import toMarkdown from 'mdast-util-to-markdown';
import { addRemoveIdxs, toImageDataURL } from './avatar';

jest.mock('./lib/generate', () => {
  const mockGenerateAvatar = jest.fn();
  const reset = () => {
    mockGenerateAvatar.mockReset();
    mockGenerateAvatar.mockImplementation(
      async (avatar: string, base: string): Promise<string> => {
        return await jest.fn().mockResolvedValue(`a:${avatar},b:${base}`)();
      }
    );
  };
  reset();
  return {
    generateAvatar: mockGenerateAvatar,
    _reset: reset,
    _getMocks: () => ({
      mockGenerateAvatar
    })
  };
});

afterEach(() => {
  require('./lib/generate')._reset();
});

describe('addRemoveIdxs()', () => {
  it('should add uniqe idx', () => {
    const r = [10, 20];
    addRemoveIdxs(r, [5, 4]);
    addRemoveIdxs(r, [10]);
    addRemoveIdxs(r, [20]);
    addRemoveIdxs(r, [30]);
    expect(r).toEqual([10, 20, 5, 4, 30]);
  });
});

describe('toDataURL()', () => {
  it('should convert "avatrr:" in alt to DataURL', async () => {
    const tree = fromMarkdown(
      '# title\n\n![avatar:alt](data:image/png;base64,iVBOR)\ntext'
    );
    await toImageDataURL(tree);
    expect(toMarkdown(tree)).toEqual(
      '# title\n\n![alt](a:data:image/png;base64,iVBOR,b:)\ntext\n'
    );
  });
  it('should convert "avatar:" in url to DataURL', async () => {
    const tree = fromMarkdown(
      '# title\n\n![alt](avatar:data:image/png;base64,iVBOR)\ntext'
    );
    await toImageDataURL(tree);
    expect(toMarkdown(tree)).toEqual(
      '# title\n\n![alt](a:data:image/png;base64,iVBOR,b:)\ntext\n'
    );
  });
  it('should convert "markerFile" in url to DataURL', async () => {
    const tree = fromMarkdown(
      '# title\n\n![alt](avatar:https://hankei6km.github.io/logo.png)\ntext'
    );
    await toImageDataURL(tree);
    expect(toMarkdown(tree)).toEqual(
      '# title\n\n![alt](a:https://hankei6km.github.io/logo.png,b:)\ntext\n'
    );
  });
  it('should convert "avatar:" in alt to DataURL with base image', async () => {
    const tree = fromMarkdown(
      '# title\n\n![avatar:alt](data:image/png;base64,iVBOR)![base img](https://hankei6km.github.io/base.png)\ntext'
    );
    await toImageDataURL(tree);
    expect(toMarkdown(tree)).toEqual(
      '# title\n\n![base img](a:data:image/png;base64,iVBOR,b:https://hankei6km.github.io/base.png)\ntext\n'
    );
  });
  it('should convert "avatar:" in alt to DataURL with base image(link)', async () => {
    const tree = fromMarkdown(
      '# title\n\n![avatar:alt](data:image/png;base64,iVBOR)[![base img](https://hankei6km.github.io/base.png)](/foo)\ntext'
    );
    await toImageDataURL(tree);
    expect(toMarkdown(tree)).toEqual(
      '# title\n\n[![base img](a:data:image/png;base64,iVBOR,b:https://hankei6km.github.io/base.png)](/foo)\ntext\n'
    );
  });
  it('should convert "avatar:" in alt to DataURL with base image(break)', async () => {
    const tree = fromMarkdown(
      '# title\n\n![avatar:alt](data:image/png;base64,iVBOR)\n![base img](https://hankei6km.github.io/base.png)\ntext'
    );
    await toImageDataURL(tree);
    expect(toMarkdown(tree)).toEqual(
      '# title\n\n![base img](a:data:image/png;base64,iVBOR,b:https://hankei6km.github.io/base.png)\ntext\n'
    );
  });
  it('should not convert "avatar:" in alt if avatar image load failed', async () => {
    const { mockGenerateAvatar } = require('./lib/generate')._getMocks();
    mockGenerateAvatar.mockReset();
    mockGenerateAvatar.mockResolvedValue('');
    const tree = fromMarkdown(
      '# title\n\n![avatar:alt](data:image/png;base64,iVBOR)![base img](https://hankei6km.github.io/base.png)\ntext'
    );
    await toImageDataURL(tree);
    expect(toMarkdown(tree)).toEqual(
      '# title\n\n![avatar:alt](data:image/png;base64,iVBOR)![base img](https://hankei6km.github.io/base.png)\ntext\n'
    );
  });
  it('should not convert "avatar:" in url if avatar image load failed', async () => {
    const { mockGenerateAvatar } = require('./lib/generate')._getMocks();
    mockGenerateAvatar.mockReset();
    mockGenerateAvatar.mockResolvedValue('');
    const tree = fromMarkdown(
      '# title\n\n![alt](avatar:data:image/png;base64,iVBOR)\ntext'
    );
    await toImageDataURL(tree);
    expect(toMarkdown(tree)).toEqual(
      '# title\n\n![alt](avatar:data:image/png;base64,iVBOR)\ntext\n'
    );
  });
  it('should not convert "markerFile" in url if avatar image load failed', async () => {
    const { mockGenerateAvatar } = require('./lib/generate')._getMocks();
    mockGenerateAvatar.mockReset();
    mockGenerateAvatar.mockResolvedValue('');
    const tree = fromMarkdown(
      '# title\n\n![alt](data:https://hankei6km.github.io/logo.png)\ntext'
    );
    await toImageDataURL(tree);
    expect(toMarkdown(tree)).toEqual(
      '# title\n\n![alt](data:https://hankei6km.github.io/logo.png)\ntext\n'
    );
  });
});
