import { Root, Content, Image } from 'mdast';
import { generateAvatar } from './lib/generate';
import { decodeOptions } from './lib/options';
import { selectTarget } from './lib/select';
import {
  getFileNameFromURL,
  stripMakerProtocol,
  baseImageUrl,
  updateImageUrl
} from './lib/util';

const AvatarSourcKindValues = [
  '',
  'image-alt',
  'image-scheme',
  'image-file'
] as const;
export type AvatarSourcKind = typeof AvatarSourcKindValues[number];
export type MdAvatarOptions = {
  avatar?: {
    position?: 'center' | 'right-bottom';
    fillstyle?: string;
    fillshape?: 'rect' | 'circle';
    margin?: number;
    padding?: number;
    fit?: number;
    query?: string;
  };
  format?: {
    type?: 'png' | 'jpeg';
    quality?: number;
  };
  base?: {
    query?: string;
  };
};
export const mdAvatarOptionsDefaults: Required<MdAvatarOptions> & {
  avatar: Required<MdAvatarOptions['avatar']>;
} & {
  format: Required<MdAvatarOptions['format']>;
} & {
  base: Required<MdAvatarOptions['base']>;
} = {
  avatar: {
    position: 'center',
    fillshape: 'circle',
    fillstyle: '#FFFFFFFF',
    margin: 12,
    padding: 4,
    fit: 25,
    query: ''
  },
  format: {
    type: 'png',
    quality: 0.92
  },
  base: {
    query: ''
  }
};

export async function byImageAlt(
  tree: Content[],
  options?: MdAvatarOptions
): Promise<boolean> {
  const image = tree[0] as Image;
  const url: string = image.url || '';
  const alt: string = stripMakerProtocol(image.alt || '');
  // as scheme
  const base = tree.length > 1 ? baseImageUrl(tree[1]) || '' : '';
  const d = await generateAvatar(
    url,
    base,
    decodeOptions(options || { avatar: {} }, [alt])
  );
  if (d) {
    if (base) {
      updateImageUrl(tree[1], d);
    } else {
      image.alt = alt;
      image.url = d;
    }
    return true;
  }
  return false;
}

export async function byImageScheme(
  tree: Content[],
  options?: MdAvatarOptions
): Promise<boolean> {
  const image = tree[0] as Image;
  const url: string = image.url || '';
  const alt: string = image.alt || '';
  // as scheme
  const text = stripMakerProtocol(url);
  const base = tree.length > 1 ? baseImageUrl(tree[1]) || '' : '';
  const d = await generateAvatar(
    text,
    base,
    decodeOptions(options || { avatar: {} }, [alt])
  );
  if (d) {
    if (base) {
      updateImageUrl(tree[1], d);
    } else {
      image.url = d;
    }
    return true;
  }
  return false;
}

export async function byImageFile(
  tree: Content[],
  options?: MdAvatarOptions
): Promise<boolean> {
  const image = tree[0] as Image;
  const url: string = image.url || '';
  const alt: string = image.alt || '';
  const fileName = getFileNameFromURL(image.url);
  const base = tree.length > 1 ? baseImageUrl(tree[1]) || '' : '';
  const d = await generateAvatar(
    url,
    base,
    decodeOptions(options || { avatar: {} }, [fileName, alt])
  );
  if (d) {
    if (base) {
      updateImageUrl(tree[1], d);
    } else {
      image.url = d;
    }
    return true;
  }
  return false;
}

export function addRemoveIdxs(r: number[], a: number[]) {
  a.forEach((i) => {
    if (!r.includes(i)) {
      r.push(i);
    }
  });
}

export async function toImageDataURL(
  tree: Root,
  options: MdAvatarOptions = { avatar: {}, format: {} }
): Promise<Root> {
  if (tree.type === 'root') {
    const l = tree.children.length;
    for (let i = 0; i < l; i++) {
      const c = tree.children[i];
      if (c.type === 'paragraph') {
        const removeIdxs: number[] = [];
        const ll = c.children.length;
        for (let ii = 0; ii < ll; ii = ii + 1) {
          //const cc: Content[] = [c.children[ii]];
          const targetInfo = selectTarget(c.children, ii);

          if (targetInfo.kind === 'image-alt') {
            const updated = await byImageAlt(targetInfo.avatarContent, options);
            if (updated) {
              addRemoveIdxs(removeIdxs, targetInfo.removeIdxs);
            }
          } else if (targetInfo.kind === 'image-scheme') {
            const updated = await byImageScheme(
              targetInfo.avatarContent,
              options
            );
            if (updated) {
              addRemoveIdxs(removeIdxs, targetInfo.removeIdxs);
            }
          } else if (targetInfo.kind === 'image-file') {
            const updated = await byImageFile(
              targetInfo.avatarContent,
              options
            );
            if (updated) {
              addRemoveIdxs(removeIdxs, targetInfo.removeIdxs);
            }
          }
        }
        if (removeIdxs.length > 0) {
          c.children = c.children.filter((t, i) => !removeIdxs.includes(i));
        }
      }
    }
  }
  return tree;
}
