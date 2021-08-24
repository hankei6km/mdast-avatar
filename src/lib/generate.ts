import { createCanvas, loadImage } from 'canvas';
import { MdAvaterOptions, mdAvaterOptionsDefaults } from '../avater';
import { replaceQuery } from './util';

export async function generateAvater(
  avater: string,
  base?: string,
  inMdqrOptions: MdAvaterOptions = {}
) {
  const mdqrOptions = Object.assign({ avater: {}, format: {} }, inMdqrOptions);
  const avaterQuery =
    mdqrOptions.avater.query !== undefined
      ? mdqrOptions.avater.query
      : mdAvaterOptionsDefaults.avater.query;
  const avaterImg = await loadImage(replaceQuery(avater, avaterQuery)).catch(
    (err) => {
      console.error(`avater loadImage: ${err}`);
      throw new Error(`avater loadImage: ${err}`);
    }
  );
  const baseImg = base
    ? await loadImage(base).catch((err) => {
        // TODO: error 画像を表示させる.
        console.error(`base loadImage: ${err}`);
      })
    : '';
  let canvasWidth = baseImg ? baseImg.width : avaterImg.width;
  let canvasHeight = baseImg ? baseImg.width : avaterImg.height;
  const avaterPosition =
    mdqrOptions.avater.position !== undefined
      ? mdqrOptions.avater.position
      : mdAvaterOptionsDefaults.avater.position;
  const avaterFillstyle =
    mdqrOptions.avater.fillstyle !== undefined
      ? mdqrOptions.avater.fillstyle
      : mdAvaterOptionsDefaults.avater.fillstyle;
  const avaterFillshape =
    mdqrOptions.avater.fillshape !== undefined
      ? mdqrOptions.avater.fillshape
      : mdAvaterOptionsDefaults.avater.fillshape;
  const avaterPadding =
    mdqrOptions.avater.padding !== undefined
      ? mdqrOptions.avater.padding
      : mdAvaterOptionsDefaults.avater.padding;
  const avaterMargin =
    mdqrOptions.avater.margin !== undefined
      ? mdqrOptions.avater.margin
      : mdAvaterOptionsDefaults.avater.margin;
  const avaterFit =
    mdqrOptions.avater.fit !== undefined
      ? mdqrOptions.avater.fit
      : mdAvaterOptionsDefaults.avater.fit;
  const formatType =
    mdqrOptions.format.type !== undefined
      ? mdqrOptions.format.type
      : mdAvaterOptionsDefaults.format.type;
  const formatQuality =
    mdqrOptions.format.quality !== undefined
      ? mdqrOptions.format.quality
      : mdAvaterOptionsDefaults.format.quality;

  const canvas = createCanvas(canvasWidth, canvasHeight);

  const ctx = canvas.getContext('2d');
  let x = 0;
  let y = 0;
  let w = avaterImg.width;
  let h = avaterImg.height;
  if (baseImg) {
    ctx.drawImage(baseImg, 0, 0, baseImg.width, baseImg.height);
    const baseSize =
      baseImg.width < baseImg.height ? baseImg.width : baseImg.height;
    if (avaterFit > 0) {
      const fitSize = (baseSize * avaterFit) / 100;
      w = fitSize;
      h = fitSize;
      if (avaterImg.width > avaterImg.height) {
        w = fitSize;
        h = (avaterImg.height * fitSize) / avaterImg.width;
      } else if (avaterImg.width < avaterImg.height) {
        w = (avaterImg.width * fitSize) / avaterImg.height;
        h = fitSize;
      }
    }
    x =
      avaterPosition === 'center'
        ? (baseImg.width - w) / 2
        : baseImg.width - (w + avaterMargin);
    y =
      avaterPosition === 'center'
        ? (baseImg.height - h) / 2
        : baseImg.height - (h + avaterMargin);
  }
  ctx.fillStyle = avaterFillstyle;
  if (avaterFillshape === 'circle') {
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
  if (avaterFillshape === 'circle') {
    ctx.beginPath();
    ctx.arc(
      x + w / 2,
      y + h / 2,
      // 楕円には対応していない.
      w / 2 - avaterPadding,
      0,
      2 * Math.PI,
      false
    );
    ctx.clip();
  }
  ctx.drawImage(
    avaterImg,
    x + avaterPadding,
    y + avaterPadding,
    w - avaterPadding * 2,
    h - avaterPadding * 2
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
