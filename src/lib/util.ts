import * as path from 'path';
import { Content } from 'mdast';

export const makerProtocol = 'avater:';
export const makerFile = 'mdast-avater';

export function stripMakerProtocol(s: string): string {
  if (s.startsWith(makerProtocol)) {
    return s.slice(7); // 'avater:'.length = 7
  }
  return s;
}

export function getFileNameFromURL(url: string | undefined): string {
  let ret: string = '';
  try {
    const u = new URL(url || '');
    if (u.protocol === 'https:' || u.protocol === 'http:') {
      ret = path.parse(u.pathname).name;
    }
  } catch (err) {
    ret = path.parse(url || '').name;
  }
  return ret;
}

export function validImageURL(url: string): boolean {
  try {
    const protocol = new URL(url).protocol;
    switch (protocol) {
      case 'http:':
      case 'https:':
      case 'data:':
        return true;
    }
  } catch (err) {
    return false;
  }
  return false;
}

export function replaceQuery(url: string, q: string): string {
  try {
    const { protocol } = new URL(url);
    if (protocol === 'http:' || protocol === 'https:') {
      const u = url.split('?', 2);
      if (u.length > 1 && q) {
        const addParams = new URLSearchParams(q);
        // const dstParams = new URLSearchParams(u[1]);
        // addParams.forEach((v, k) => {
        //   dstParams.append(k, v);
        // });
        return `${u[0]}?${addParams.toString()}`;
      } else if (q) {
        const addParams = new URLSearchParams(q);
        return `${url}?${addParams.toString()}`;
      }
    }
  } catch (err) {}
  return url;
}

export function updateImageUrl(c: Content, url: string) {
  if (c.type === 'image') {
    c.url = url;
  } else if (c.type === 'link') {
    if (c.children[0].type === 'image') {
      c.children[0].url = url;
    }
  }
}
