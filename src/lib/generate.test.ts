import { generateAvatar } from './generate';
const consoleErrror = console.error;
jest.mock('canvas', () => {
  const mockDrawImage = jest.fn();

  const mockBeginPath = jest.fn();
  const mockArc = jest.fn();
  const mockClip = jest.fn();
  const mockClearRect = jest.fn();
  const mockFillRect = jest.fn();
  const mockGetContext = jest.fn();
  const mockCanvasToDataURL = jest.fn();
  const mockCreateCanvas = jest.fn();
  const mockLoadImage = jest.fn();
  const reset = () => {
    mockDrawImage.mockReset();
    mockBeginPath.mockReset();
    mockArc.mockReset();
    mockClip.mockReset();
    mockClearRect.mockReset();
    mockFillRect.mockReset();
    mockGetContext.mockReset();
    mockGetContext.mockReturnValue({
      beginPath: mockBeginPath,
      arc: mockArc,
      clip: mockClip,
      drawImage: mockDrawImage,
      clearRect: mockClearRect,
      fillRect: mockFillRect
    });
    mockCanvasToDataURL.mockReset();
    mockCanvasToDataURL.mockReturnValue('check');
    mockCreateCanvas.mockReset();
    mockCreateCanvas.mockReturnValue({
      getContext: mockGetContext,
      toDataURL: mockCanvasToDataURL
    });
    mockLoadImage.mockReset();
    mockLoadImage
      .mockResolvedValueOnce({
        width: 100,
        height: 100
      })
      .mockResolvedValueOnce({
        width: 200,
        height: 200
      });
  };
  reset();
  return {
    createCanvas: mockCreateCanvas,
    loadImage: mockLoadImage,
    _reset: reset,
    _getMocks: () => ({
      mockBeginPath,
      mockArc,
      mockClip,
      mockDrawImage,
      mockClearRect,
      mockFillRect,
      mockGetContext,
      mockCanvasToDataURL,
      mockCreateCanvas,
      mockLoadImage
    })
  };
});

afterEach(() => {
  console.error = consoleErrror;
  require('canvas')._reset();
});

describe('generateAvatar()', () => {
  it('should generate avatar image', async () => {
    const res = generateAvatar('avatar');
    expect(await res).toEqual('check');
    const {
      mockBeginPath,
      mockArc,
      mockClip,
      mockLoadImage,
      mockCreateCanvas,
      mockFillRect,
      mockDrawImage,
      mockCanvasToDataURL
    } = require('canvas')._getMocks();
    expect(mockLoadImage.mock.calls.length).toEqual(1);
    expect(mockLoadImage.mock.calls[0][0]).toEqual('avatar');
    expect(mockCreateCanvas.mock.calls[0]).toEqual([100, 100]);
    expect(mockBeginPath.mock.calls.length).toEqual(2);
    expect(mockFillRect.mock.calls.length).toEqual(1);
    expect(mockFillRect.mock.calls[0]).toEqual([0, 0, 100, 100]);
    expect(mockDrawImage.mock.calls.length).toEqual(1);
    expect(mockClip.mock.calls.length).toEqual(2);
    expect(mockArc.mock.calls.length).toEqual(2);
    expect(mockArc.mock.calls[0]).toEqual([50, 50, 50, 0, 2 * Math.PI, false]);
    expect(mockArc.mock.calls[1]).toEqual([50, 50, 46, 0, 2 * Math.PI, false]);
    expect(mockDrawImage.mock.calls[0]).toEqual([
      { width: 100, height: 100 },
      4,
      4,
      92,
      92
    ]);
    expect(mockCanvasToDataURL.mock.calls.length).toEqual(1);
    expect(mockCanvasToDataURL.mock.calls[0]).toEqual(['image/png']);
  });
  it('should generate avatar with base image', async () => {
    const res = generateAvatar('avatar', 'base');
    expect(await res).toEqual('check');
    const {
      mockBeginPath,
      mockArc,
      mockClip,
      mockLoadImage,
      mockCreateCanvas,
      mockFillRect,
      mockDrawImage
    } = require('canvas')._getMocks();
    expect(mockLoadImage.mock.calls.length).toEqual(2);
    expect(mockLoadImage.mock.calls[0][0]).toEqual('avatar');
    expect(mockLoadImage.mock.calls[1][0]).toEqual('base');
    expect(mockCreateCanvas.mock.calls[0]).toEqual([200, 200]);
    expect(mockBeginPath.mock.calls.length).toEqual(2);
    expect(mockFillRect.mock.calls.length).toEqual(1);
    expect(mockFillRect.mock.calls[0]).toEqual([75, 75, 50, 50]);
    expect(mockDrawImage.mock.calls.length).toEqual(2);
    expect(mockClip.mock.calls.length).toEqual(2);
    expect(mockArc.mock.calls.length).toEqual(2);
    expect(mockArc.mock.calls[0]).toEqual([
      100,
      100,
      25,
      0,
      2 * Math.PI,
      false
    ]);
    expect(mockArc.mock.calls[1]).toEqual([
      100,
      100,
      21,
      0,
      2 * Math.PI,
      false
    ]);
    expect(mockDrawImage.mock.calls[0]).toEqual([
      { width: 200, height: 200 },
      0,
      0,
      200,
      200
    ]);
    expect(mockDrawImage.mock.calls[1]).toEqual([
      { width: 100, height: 100 },
      79,
      79,
      42,
      42
    ]);
  });
  it('should generate avatar with base image(right-bottom)', async () => {
    const res = generateAvatar('avatar', 'base', {
      avatar: { position: 'right-bottom' }
    });
    expect(await res).toEqual('check');
    const {
      mockArc,
      mockFillRect,
      mockDrawImage
    } = require('canvas')._getMocks();
    expect(mockFillRect.mock.calls[0]).toEqual([138, 138, 50, 50]);
    expect(mockDrawImage.mock.calls[0]).toEqual([
      { width: 200, height: 200 },
      0,
      0,
      200,
      200
    ]);
    expect(mockDrawImage.mock.calls[0]).toEqual([
      { width: 200, height: 200 },
      0,
      0,
      200,
      200
    ]);
    expect(mockArc.mock.calls[0]).toEqual([
      163,
      163,
      25,
      0,
      2 * Math.PI,
      false
    ]);
    expect(mockArc.mock.calls[1]).toEqual([
      163,
      163,
      21,
      0,
      2 * Math.PI,
      false
    ]);
    expect(mockDrawImage.mock.calls[1]).toEqual([
      { width: 100, height: 100 },
      142,
      142,
      42,
      42
    ]);
  });
  it('should generate avatar with base image(w > h)', async () => {
    const { mockLoadImage } = require('canvas')._getMocks();
    mockLoadImage.mockReset();
    mockLoadImage
      .mockResolvedValueOnce({
        width: 100,
        height: 100
      })
      .mockResolvedValueOnce({
        width: 200,
        height: 100
      });
    const res = generateAvatar('avatar', 'base', {});
    expect(await res).toEqual('check');
    const { mockDrawImage } = require('canvas')._getMocks();
    expect(mockDrawImage.mock.calls[1]).toEqual([
      { width: 100, height: 100 },
      91.5,
      41.5,
      17,
      17
    ]);
  });
  it('should generate avatar with base image(h > w)', async () => {
    const { mockLoadImage } = require('canvas')._getMocks();
    mockLoadImage.mockReset();
    mockLoadImage
      .mockResolvedValueOnce({
        width: 100,
        height: 100
      })
      .mockResolvedValueOnce({
        width: 100,
        height: 200
      });
    const res = generateAvatar('avatar', 'base', {});
    expect(await res).toEqual('check');
    const { mockDrawImage } = require('canvas')._getMocks();
    expect(mockDrawImage.mock.calls[1]).toEqual([
      { width: 100, height: 100 },
      41.5,
      91.5,
      17,
      17
    ]);
  });
  it('should generate avatar with base image(disable fit)', async () => {
    const res = generateAvatar('avatar', 'base', { avatar: { fit: 0 } });
    expect(await res).toEqual('check');
    const { mockDrawImage } = require('canvas')._getMocks();
    expect(mockDrawImage.mock.calls[1]).toEqual([
      { width: 100, height: 100 },
      54,
      54,
      92,
      92
    ]);
  });
  it('should generate avatar with base image(padding)', async () => {
    const res = generateAvatar('avatar', 'base', { avatar: { padding: 10 } });
    expect(await res).toEqual('check');
    const {
      mockArc,
      mockFillRect,
      mockDrawImage
    } = require('canvas')._getMocks();
    expect(mockFillRect.mock.calls[0]).toEqual([75, 75, 50, 50]);
    expect(mockArc.mock.calls[1]).toEqual([
      100,
      100,
      15,
      0,
      2 * Math.PI,
      false
    ]);
    expect(mockDrawImage.mock.calls[1]).toEqual([
      { width: 100, height: 100 },
      85,
      85,
      30,
      30
    ]);
  });
  it('should generate avatar with base image(avatar query)', async () => {
    const res = generateAvatar(
      'https://hankei6km.github.io/avatar.png',
      'base',
      { avatar: { query: 'w=100' } }
    );
    expect(await res).toEqual('check');
    const { mockLoadImage } = require('canvas')._getMocks();
    expect(mockLoadImage.mock.calls[0][0]).toEqual(
      'https://hankei6km.github.io/avatar.png?w=100'
    );
  });
  it('should generate avatar with base image(base query)', async () => {
    const res = generateAvatar(
      'avatar',
      'https://hankei6km.github.io/base.png',
      { base: { query: 'w=100' } }
    );
    expect(await res).toEqual('check');
    const { mockLoadImage } = require('canvas')._getMocks();
    expect(mockLoadImage.mock.calls[1][0]).toEqual(
      'https://hankei6km.github.io/base.png?w=100'
    );
  });
  it('should save avatar to jpeg format', async () => {
    const res = generateAvatar(
      'https://hankei6km.github.io/avatar.png',
      'base',
      {
        format: { type: 'jpeg', quality: 0.5 }
      }
    );
    expect(await res).toEqual('check');
    const { mockCanvasToDataURL } = require('canvas')._getMocks();
    expect(mockCanvasToDataURL.mock.calls[0]).toEqual(['image/jpeg', 0.5]);
  });
  it('should return blank at loadImage failed', async () => {
    const mockConsoleError = jest.fn();
    console.error = mockConsoleError;
    const { mockLoadImage } = require('canvas')._getMocks();
    mockLoadImage.mockReset();
    mockLoadImage.mockRejectedValueOnce('load image failed');
    const res = generateAvatar('avatar', 'base', { avatar: { fit: 0 } });
    expect(await res).toEqual('');
  });
  it('should skip base image at loadImage failed', async () => {
    const mockConsoleError = jest.fn();
    console.error = mockConsoleError;
    const { mockLoadImage } = require('canvas')._getMocks();
    mockLoadImage.mockReset();
    mockLoadImage
      .mockResolvedValueOnce({
        width: 100,
        height: 100
      })
      .mockRejectedValueOnce('load image failed');
    const res = generateAvatar('avatar', 'base', { avatar: { fit: 0 } });
    expect(await res).toEqual('check');
    expect(mockConsoleError.mock.calls.length).toEqual(1);
    expect(mockConsoleError.mock.calls[0][0]).toEqual(
      'base loadImage: load image failed'
    );
    const { mockDrawImage } = require('canvas')._getMocks();
    expect(mockDrawImage.mock.calls.length).toEqual(1);
    expect(mockDrawImage.mock.calls[0]).toEqual([
      { width: 100, height: 100 },
      4,
      4,
      92,
      92
    ]);
  });
});
