import { decodeOptions } from './options';
describe('decodeOptions()', () => {
  it('should decode from file names / log alt', () => {
    expect(
      decodeOptions({}, ['mdast-avater_position-right-bottom', '', ''])
    ).toEqual({ avater: { position: 'right-bottom' }, format: {} });
    expect(decodeOptions({}, ['mdast-avater_margin-10', '', ''])).toEqual({
      avater: { margin: 10 },
      format: {}
    });
    expect(
      decodeOptions({}, ['mdast-avater_fillstyle-FF0000FF', '', ''])
    ).toEqual({ avater: { fillstyle: '#FF0000FF' }, format: {} });
    expect(
      decodeOptions({}, ['mdast-avater_fillshape-circle', '', ''])
    ).toEqual({ avater: { fillshape: 'circle' }, format: {} });
    expect(decodeOptions({}, ['mdast-avater_padding-20', '', ''])).toEqual({
      avater: { padding: 20 },
      format: {}
    });
    expect(
      decodeOptions({}, ['mdast-avater_query-w=100&text=abc-123', '', ''])
    ).toEqual({ avater: { query: 'w=100&text=abc-123' }, format: {} });
    expect(
      decodeOptions({}, ['mdast-avater_query-w%3D100%26text%3Dabc-123', '', ''])
    ).toEqual({ avater: { query: 'w=100&text=abc-123' }, format: {} });
    expect(decodeOptions({}, ['mdast-format_type-jpeg', '', ''])).toEqual({
      avater: {},
      format: { type: 'jpeg' }
    });
    expect(decodeOptions({}, ['mdast-format_quality-50', '', ''])).toEqual({
      avater: {},
      format: { quality: 0.5 }
    });
  });
  it('should decode from multiple sources', () => {
    expect(
      decodeOptions({}, [
        'mdast-avater_padding-20-avater_fit-10',
        'avater_padding-21-avater_fit-11',
        ''
      ])
    ).toEqual({ avater: { padding: 21, fit: 11 }, format: {} });
    expect(
      decodeOptions({}, [
        'mdast-avater_padding-20-avater_fit-10',
        'avater_padding-21-avater_fit-11',
        'avater_fit-12'
      ])
    ).toEqual({ avater: { padding: 21, fit: 12 }, format: {} });
  });
});
