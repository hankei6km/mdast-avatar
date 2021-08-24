import { MdAvatarOptions } from '../avatar';
import { decodeOptions } from './options';

const assign = (o: MdAvatarOptions) =>
  Object.assign({ avatar: {}, format: {}, base: {} }, o);
describe('decodeOptions()', () => {
  it('should decode from file names / log alt', () => {
    expect(
      decodeOptions({}, ['mdast-avatar_position-right-bottom', '', ''])
    ).toEqual(assign({ avatar: { position: 'right-bottom' } }));
    expect(decodeOptions({}, ['mdast-avatar_margin-10', '', ''])).toEqual(
      assign({
        avatar: { margin: 10 }
      })
    );
    expect(
      decodeOptions({}, ['mdast-avatar_fillstyle-FF0000FF', '', ''])
    ).toEqual(assign({ avatar: { fillstyle: '#FF0000FF' } }));
    expect(
      decodeOptions({}, ['mdast-avatar_fillshape-circle', '', ''])
    ).toEqual(assign({ avatar: { fillshape: 'circle' } }));
    expect(decodeOptions({}, ['mdast-avatar_padding-20', '', ''])).toEqual(
      assign({
        avatar: { padding: 20 }
      })
    );
    expect(
      decodeOptions({}, ['mdast-avatar_query-w=100&text=abc-123', '', ''])
    ).toEqual(assign({ avatar: { query: 'w=100&text=abc-123' } }));
    expect(
      decodeOptions({}, ['mdast-avatar_query-w%3D100%26text%3Dabc-123', '', ''])
    ).toEqual(assign({ avatar: { query: 'w=100&text=abc-123' } }));
    expect(decodeOptions({}, ['mdast-format_type-jpeg', '', ''])).toEqual(
      assign({
        format: { type: 'jpeg' }
      })
    );
    expect(decodeOptions({}, ['mdast-format_quality-50', '', ''])).toEqual(
      assign({
        format: { quality: 0.5 }
      })
    );
    expect(
      decodeOptions({}, ['mdast-base_query-w=100&text=abc-123', '', ''])
    ).toEqual(assign({ base: { query: 'w=100&text=abc-123' } }));
    expect(
      decodeOptions({}, ['mdast-base_query-w%3D100%26text%3Dabc-123', '', ''])
    ).toEqual(assign({ base: { query: 'w=100&text=abc-123' } }));
  });
  it('should terminate query by "."', () => {
    expect(
      decodeOptions({}, [
        'mdast-avatar_query-w=100&text=abc-123.-avatar_padding-3-base_query-w=200&text=abc-456.-avatar_margin-4',
        '',
        ''
      ])
    ).toEqual(
      assign({
        avatar: { padding: 3, margin: 4, query: 'w=100&text=abc-123' },
        base: { query: 'w=200&text=abc-456' }
      })
    );
  });
  it('should decode from multiple sources', () => {
    expect(
      decodeOptions({}, [
        'mdast-avatar_padding-20-avatar_fit-10',
        'avatar_padding-21-avatar_fit-11',
        ''
      ])
    ).toEqual(assign({ avatar: { padding: 21, fit: 11 } }));
    expect(
      decodeOptions({}, [
        'mdast-avatar_padding-20-avatar_fit-10',
        'avatar_padding-21-avatar_fit-11',
        'avatar_fit-12'
      ])
    ).toEqual(assign({ avatar: { padding: 21, fit: 12 }, format: {} }));
  });
});
