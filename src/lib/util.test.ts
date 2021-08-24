import { getFileNameFromURL, replaceQuery, validImageURL } from './util';

describe('validImageURL()', () => {
  it('should return true', async () => {
    expect(
      validImageURL('http://hankei6km.github.io/mdast-avater.png')
    ).toBeTruthy();
    expect(
      validImageURL('https://hankei6km.github.io/mdast-avater.png')
    ).toBeTruthy();
    expect(
      validImageURL('data:image/png;base64,iVBORw0KGgoAAAANSU')
    ).toBeTruthy();
  });
  it('should return false', async () => {
    expect(validImageURL('/path/to/mdast-avater.png')).toBeFalsy();
    expect(validImageURL('mdast-avater.png')).toBeFalsy();
    expect(validImageURL('')).toBeFalsy();
  });
});

describe('getFileNameFromURL()', () => {
  it('should retun filename from path', () => {
    expect(getFileNameFromURL('test.png')).toEqual('test');
    expect(getFileNameFromURL('/path/to/test.png')).toEqual('test');
  });
  it('should retun filename from url', () => {
    expect(
      getFileNameFromURL('https://hankei6km.github.io/avater.png')
    ).toEqual('avater');
    expect(
      getFileNameFromURL('https://hankei6km.github.io/avater.png#hash')
    ).toEqual('avater');
    expect(
      getFileNameFromURL('https://hankei6km.github.io/avater.png&w=100')
    ).toEqual('avater');
  });
  it('should retun blank from data', () => {
    expect(
      getFileNameFromURL('data:image/png;base64,iVBORw0KGgoAAAANS')
    ).toEqual('');
  });
});

describe('replaceQuery()', () => {
  const toMap = (url: string) => {
    const query: { [key: string]: any } = {};
    const u = url.split('?', 2);
    if (u.length > 1) {
      const p = new URLSearchParams(u[1]);
      p.forEach((v, k) => {
        query[k] = v;
      });
    }
    return [u[0], query];
  };
  it('should add query to url', async () => {
    expect(
      toMap(
        replaceQuery('http://hankei6km.github.io/avater.png', 'w=100&h=100')
      )
    ).toEqual(toMap('http://hankei6km.github.io/avater.png?w=100&h=100'));
    expect(
      toMap(
        replaceQuery('http://hankei6km.github.io/avater.png', '?w=100&h=100')
      )
    ).toEqual(toMap('http://hankei6km.github.io/avater.png?w=100&h=100'));
    expect(
      toMap(replaceQuery('http://hankei6km.github.io/avater.png', 'abc'))
    ).toEqual(toMap('http://hankei6km.github.io/avater.png?abc'));
  });
  it('should replace query to url', async () => {
    expect(
      toMap(
        replaceQuery('http://hankei6km.github.io/avater.png?h=100', 'w=100')
      )
    ).toEqual(toMap('http://hankei6km.github.io/avater.png?w=100'));
    expect(
      toMap(replaceQuery('http://hankei6km.github.io/avater.png?h=100', 'abc'))
    ).toEqual(toMap('http://hankei6km.github.io/avater.png?abc'));
  });
  it('should add blank', async () => {
    expect(
      toMap(replaceQuery('http://hankei6km.github.io/avater.png?h=100', ''))
    ).toEqual(toMap('http://hankei6km.github.io/avater.png?h=100'));
    expect(
      toMap(replaceQuery('data:image/png;base64,iVBORw0KGgoAAAANS', 'w=100'))
    ).toEqual(toMap('data:image/png;base64,iVBORw0KGgoAAAANS'));
  });
});
