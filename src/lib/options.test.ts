import { decodeOptions } from './options';
describe('decodeOptions()', () => {
  it('should decode from file names / log alt', () => {
    expect(
      decodeOptions({}, ['mdast-avatar_position-right-bottom', '', ''])
    ).toEqual({ avatar: { position: 'right-bottom' }, format: {} });
    expect(decodeOptions({}, ['mdast-avatar_margin-10', '', ''])).toEqual({
      avatar: { margin: 10 },
      format: {}
    });
    expect(
      decodeOptions({}, ['mdast-avatar_fillstyle-FF0000FF', '', ''])
    ).toEqual({ avatar: { fillstyle: '#FF0000FF' }, format: {} });
    expect(
      decodeOptions({}, ['mdast-avatar_fillshape-circle', '', ''])
    ).toEqual({ avatar: { fillshape: 'circle' }, format: {} });
    expect(decodeOptions({}, ['mdast-avatar_padding-20', '', ''])).toEqual({
      avatar: { padding: 20 },
      format: {}
    });
    expect(
      decodeOptions({}, ['mdast-avatar_query-w=100&text=abc-123', '', ''])
    ).toEqual({ avatar: { query: 'w=100&text=abc-123' }, format: {} });
    expect(
      decodeOptions({}, ['mdast-avatar_query-w%3D100%26text%3Dabc-123', '', ''])
    ).toEqual({ avatar: { query: 'w=100&text=abc-123' }, format: {} });
    expect(decodeOptions({}, ['mdast-format_type-jpeg', '', ''])).toEqual({
      avatar: {},
      format: { type: 'jpeg' }
    });
    expect(decodeOptions({}, ['mdast-format_quality-50', '', ''])).toEqual({
      avatar: {},
      format: { quality: 0.5 }
    });
  });
  it('should decode from multiple sources', () => {
    expect(
      decodeOptions({}, [
        'mdast-avatar_padding-20-avatar_fit-10',
        'avatar_padding-21-avatar_fit-11',
        ''
      ])
    ).toEqual({ avatar: { padding: 21, fit: 11 }, format: {} });
    expect(
      decodeOptions({}, [
        'mdast-avatar_padding-20-avatar_fit-10',
        'avatar_padding-21-avatar_fit-11',
        'avatar_fit-12'
      ])
    ).toEqual({ avatar: { padding: 21, fit: 12 }, format: {} });
  });
});
