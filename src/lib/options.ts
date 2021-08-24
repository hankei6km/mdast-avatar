import { MdAvaterOptions } from '../avater';

const optionsDecoderAvater = [
  {
    name: 'position',
    decoder: /(^|.+-)avater_position-(center|right-bottom)(-|$)/
  },
  { name: 'fillstyle', decoder: /(^|.+-)avater_fillstyle-([0-9A-Fa-f]+)(-|$)/ },
  {
    name: 'fillshape',
    decoder: /(^|.+-)avater_fillshape-(rect|circle)(-|$)/
  },
  {
    name: 'margin',
    decoder: /(^|.+-)avater_margin-(\d+)(-|$)/
  },
  {
    name: 'padding',
    decoder: /(^|.+-)avater_padding-(\d+)(-|$)/
  },
  {
    name: 'fit',
    decoder: /(^|.+-)avater_fit-(\d+)(-|$)/
  },
  {
    name: 'query',
    decoder: /(^|.+-)avater_query-(.+)$/
  }
];
const optionsDecoderFormat = [
  {
    name: 'type',
    decoder: /(^|.+-)format_type-(png|jpeg)(-|$)/
  },
  { name: 'quality', decoder: /(^|.+-)format_quality-(\d+)(-|$)/ }
];

export function decodeOptions(
  mdqrOptions: MdAvaterOptions,
  sources: string[]
): MdAvaterOptions {
  const retMdqrOptions: any = JSON.parse(
    JSON.stringify(
      Object.assign({ avater: {}, format: {} }, mdqrOptions) || {
        avater: {},
        format: {}
      }
    )
  );
  //  fileName と alt からでコードするので関数化してある.
  // TODO: ユーティリティ化などを検討.
  const decodeMdqrOptions = (out: any, src: string) => {
    optionsDecoderAvater.forEach((o) => {
      const m = src.match(o.decoder);
      if (m) {
        // TODO: decoder 側で代入用の関数を指定できるように.
        if (o.name === 'position' || o.name === 'fillshape') {
          out.avater[o.name] = m[2];
        } else if (o.name === 'query') {
          out.avater[o.name] = decodeURIComponent(m[2]);
        } else if (o.name === 'fillstyle') {
          out.avater[o.name] = `#${m[2]}`;
        } else {
          out.avater[o.name] = parseInt(m[2], 10);
        }
      }
    });
    optionsDecoderFormat.forEach((o) => {
      const m = src.match(o.decoder);
      if (m) {
        // TODO: decoder 側で代入用の関数を指定できるように.
        if (o.name === 'type') {
          out.format[o.name] = m[2];
        } else if (o.name === 'quality') {
          out.format[o.name] = parseInt(m[2], 10) / 100;
        }
      }
    });
  };
  sources.forEach((s) => decodeMdqrOptions(retMdqrOptions, s));

  return retMdqrOptions;
}
