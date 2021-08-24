import { Content, Image } from 'mdast';
import { AvaterSourcKind } from '../avater';
import {
  makerProtocol,
  makerFile,
  stripMakerProtocol,
  getFileNameFromURL,
  validImageURL
} from './util';
import { Literal } from 'unist';

export function isBase(c: Content): boolean {
  if (c.type === 'image' && validImageURL((c as Image).url || '')) {
    return true;
  } else if (c.type === 'link') {
    if (c.children.length === 1 && c.children[0].type === 'image')
      validImageURL((c.children[0] as Image).url || '');
    return true;
  }
  return false;
}

export function pickBase(c: Content[], idx: number): number[] {
  const clen = c.length;
  if (idx + 1 < clen) {
    if (isBase(c[idx + 1])) {
      return [idx + 1];
    }
  }
  if (idx + 2 < clen) {
    if (c[idx + 1].type === 'text') {
      const l: Literal = c[idx + 1] as Literal;
      if (l.value === '\n' && isBase(c[idx + 2])) {
        return [idx + 1, idx + 2];
      }
    }
  }
  return [];
}

export function selectTarget(
  c: Content[],
  idx: number
): { kind: AvaterSourcKind; avaterContent: Content[]; removeIdxs: number[] } {
  const ret: {
    kind: AvaterSourcKind;
    avaterContent: Content[];
    removeIdxs: number[];
  } = {
    kind: '',
    avaterContent: [],
    removeIdxs: []
  };
  const top = c[idx];
  if (top.type === 'image') {
    const url: string = top.url || '';
    const alt: string = top.alt || '';
    if (
      alt.startsWith(makerProtocol) &&
      validImageURL(stripMakerProtocol(url))
    ) {
      // as alt
      ret.kind = 'image-alt';
    } else if (
      url.startsWith(makerProtocol) &&
      validImageURL(stripMakerProtocol(url))
    ) {
      // as scheme
      ret.kind = 'image-scheme';
    } else if (
      getFileNameFromURL(url).startsWith(makerFile) &&
      validImageURL(url)
    ) {
      // as marker
      ret.kind = 'image-file';
    }
  }
  if (ret.kind !== '') {
    ret.avaterContent.push(top);
    const baseIdx = pickBase(c, idx);
    const llen = baseIdx.length;
    if (llen > 0) {
      ret.avaterContent.push(c[baseIdx[llen - 1]]);
      ret.removeIdxs = [idx]; // 元画像をbese画像に埋め込むので base 画像を削除.
      if (llen > 1) {
        ret.removeIdxs.push(baseIdx[0]);
      }
    }
  }
  return ret;
}
