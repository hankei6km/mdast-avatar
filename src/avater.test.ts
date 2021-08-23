import fromMarkdown from 'mdast-util-from-markdown';
import toMarkdown from 'mdast-util-to-markdown';
import { addRemoveIdxs, toImageDataURL } from './avater';

jest.mock('./lib/generate', () => {
  const mockGenerateQRCode = jest.fn();
  const reset = () => {
    mockGenerateQRCode.mockReset();
    mockGenerateQRCode.mockImplementation(
      async (data: string): Promise<string> => {
        return await jest.fn().mockResolvedValue(`data:${data}`)();
      }
    );
  };
  reset();
  return {
    generateAvater: mockGenerateQRCode,
    _reset: reset,
    _getMocks: () => ({
      mockGenerateQRCode
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
  it('should convert "avater:" in alt to DataURL', async () => {
    const tree = fromMarkdown(
      '# title\n\n![avater:alt](data:image/png;base64,iVBOR)\ntext'
    );
    await toImageDataURL(tree);
    expect(toMarkdown(tree)).toEqual(
      '# title\n\n![alt](data:data:image/png;base64,iVBOR)\ntext\n'
    );
  });
  it('should convert "avater:" in url to DataURL', async () => {
    const tree = fromMarkdown(
      '# title\n\n![alt](avater:data:image/png;base64,iVBOR)\ntext'
    );
    await toImageDataURL(tree);
    expect(toMarkdown(tree)).toEqual(
      '# title\n\n![alt](data:data:image/png;base64,iVBOR)\ntext\n'
    );
  });
  it('should convert "markerFile" in url to DataURL', async () => {
    const tree = fromMarkdown(
      '# title\n\n![alt](data:https://hankei6km.github.io/logo.png)\ntext'
    );
    await toImageDataURL(tree);
    expect(toMarkdown(tree)).toEqual(
      '# title\n\n![alt](data:https://hankei6km.github.io/logo.png)\ntext\n'
    );
  });
  it('should convert "avater:" in alt to DataURL with base image', async () => {
    const tree = fromMarkdown(
      '# title\n\n![avater:alt](data:image/png;base64,iVBOR)![base img](https://hankei6km.github.io/base.png)\ntext'
    );
    await toImageDataURL(tree);
    expect(toMarkdown(tree)).toEqual(
      '# title\n\n![base img](data:data:image/png;base64,iVBOR)\ntext\n'
    );
  });
  it('should convert "avater:" in alt to DataURL with base image(link)', async () => {
    const tree = fromMarkdown(
      '# title\n\n![avater:alt](data:image/png;base64,iVBOR)[![base img](https://hankei6km.github.io/base.png)](/foo)\ntext'
    );
    await toImageDataURL(tree);
    expect(toMarkdown(tree)).toEqual(
      '# title\n\n[![base img](data:data:image/png;base64,iVBOR)](/foo)\ntext\n'
    );
  });
  it('should convert "avater:" in alt to DataURL with base image(break)', async () => {
    const tree = fromMarkdown(
      '# title\n\n![avater:alt](data:image/png;base64,iVBOR)\n![base img](https://hankei6km.github.io/base.png)\ntext'
    );
    await toImageDataURL(tree);
    expect(toMarkdown(tree)).toEqual(
      '# title\n\n![base img](data:data:image/png;base64,iVBOR)\ntext\n'
    );
  });
});
