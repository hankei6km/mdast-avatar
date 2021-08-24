import { createCanvas, loadImage } from 'canvas';
import { MdAvatarOptions, mdAvatarOptionsDefaults } from '../avatar';
import { replaceQuery } from './util';

export async function generateAvatar(
  avatar: string,
  base?: string,
  inMdqrOptions: MdAvatarOptions = {}
) {
  const mdqrOptions = Object.assign(
    { avatar: {}, format: {}, base: {} },
    inMdqrOptions
  );
  const avatarQuery =
    mdqrOptions.avatar.query !== undefined
      ? mdqrOptions.avatar.query
      : mdAvatarOptionsDefaults.avatar.query;
  const avatarImg = await loadImage(replaceQuery(avatar, avatarQuery)).catch(
    (err) => {
      // TODO: error 画像を表示させる.
      console.error(`avatar loadImage: ${err}`);
    }
  );
  if (avatarImg) {
    const baseQuery =
      mdqrOptions.base.query !== undefined
        ? mdqrOptions.base.query
        : mdAvatarOptionsDefaults.base.query;
    const baseImg = base
      ? await loadImage(replaceQuery(base, baseQuery)).catch((err) => {
          // TODO: error 画像を表示させる.
          console.error(`base loadImage: ${err}`);
        })
      : '';
    let canvasWidth = baseImg ? baseImg.width : avatarImg.width;
    let canvasHeight = baseImg ? baseImg.width : avatarImg.height;
    const avatarPosition =
      mdqrOptions.avatar.position !== undefined
        ? mdqrOptions.avatar.position
        : mdAvatarOptionsDefaults.avatar.position;
    const avatarFillstyle =
      mdqrOptions.avatar.fillstyle !== undefined
        ? mdqrOptions.avatar.fillstyle
        : mdAvatarOptionsDefaults.avatar.fillstyle;
    const avatarFillshape =
      mdqrOptions.avatar.fillshape !== undefined
        ? mdqrOptions.avatar.fillshape
        : mdAvatarOptionsDefaults.avatar.fillshape;
    const avatarPadding =
      mdqrOptions.avatar.padding !== undefined
        ? mdqrOptions.avatar.padding
        : mdAvatarOptionsDefaults.avatar.padding;
    const avatarMargin =
      mdqrOptions.avatar.margin !== undefined
        ? mdqrOptions.avatar.margin
        : mdAvatarOptionsDefaults.avatar.margin;
    const avatarFit =
      mdqrOptions.avatar.fit !== undefined
        ? mdqrOptions.avatar.fit
        : mdAvatarOptionsDefaults.avatar.fit;
    const formatType =
      mdqrOptions.format.type !== undefined
        ? mdqrOptions.format.type
        : mdAvatarOptionsDefaults.format.type;
    const formatQuality =
      mdqrOptions.format.quality !== undefined
        ? mdqrOptions.format.quality
        : mdAvatarOptionsDefaults.format.quality;

    const canvas = createCanvas(canvasWidth, canvasHeight);

    const ctx = canvas.getContext('2d');
    let x = 0;
    let y = 0;
    let w = avatarImg.width;
    let h = avatarImg.height;
    if (baseImg) {
      ctx.drawImage(baseImg, 0, 0, baseImg.width, baseImg.height);
      const baseSize =
        baseImg.width < baseImg.height ? baseImg.width : baseImg.height;
      if (avatarFit > 0) {
        const fitSize = (baseSize * avatarFit) / 100;
        w = fitSize;
        h = fitSize;
        if (avatarImg.width > avatarImg.height) {
          w = fitSize;
          h = (avatarImg.height * fitSize) / avatarImg.width;
        } else if (avatarImg.width < avatarImg.height) {
          w = (avatarImg.width * fitSize) / avatarImg.height;
          h = fitSize;
        }
      }
      x =
        avatarPosition === 'center'
          ? (baseImg.width - w) / 2
          : baseImg.width - (w + avatarMargin);
      y =
        avatarPosition === 'center'
          ? (baseImg.height - h) / 2
          : baseImg.height - (h + avatarMargin);
    }
    ctx.fillStyle = avatarFillstyle;
    if (avatarFillshape === 'circle') {
      ctx.beginPath();
      ctx.arc(
        x + w / 2,
        y + h / 2,
        // 楕円には対応していない.
        w / 2,
        0,
        2 * Math.PI,
        false
      );
      ctx.clip();
    }
    ctx.fillRect(x, y, w, h);
    if (avatarFillshape === 'circle') {
      ctx.beginPath();
      ctx.arc(
        x + w / 2,
        y + h / 2,
        // 楕円には対応していない.
        w / 2 - avatarPadding,
        0,
        2 * Math.PI,
        false
      );
      ctx.clip();
    }
    ctx.drawImage(
      avatarImg,
      x + avatarPadding,
      y + avatarPadding,
      w - avatarPadding * 2,
      h - avatarPadding * 2
    );
    const ret =
      formatType === 'png'
        ? canvas.toDataURL('image/png')
        : canvas.toDataURL('image/jpeg', formatQuality);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // 環境が違うのでそんまま適用できないが、
    // できるだけメモリーが開放されるように.
    // https://tech.mobilefactory.jp/entry/2019/12/17/143000
    canvas.height = 0;
    canvas.width = 0;
    return ret;
  }

  return '';
}
