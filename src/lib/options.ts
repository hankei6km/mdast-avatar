import { MdAvatarOptions } from '../avatar';

const optionsDecoderAvatar = [
  {
    name: 'position',
    decoder: /(^|.+-)avatar_position-(center|right-bottom)(-|$)/
  },
  { name: 'fillstyle', decoder: /(^|.+-)avatar_fillstyle-([0-9A-Fa-f]+)(-|$)/ },
  {
    name: 'fillshape',
    decoder: /(^|.+-)avatar_fillshape-(rect|circle)(-|$)/
  },
  {
    name: 'margin',
    decoder: /(^|.+-)avatar_margin-(\d+)(-|$)/
  },
  {
    name: 'padding',
    decoder: /(^|.+-)avatar_padding-(\d+)(-|$)/
  },
  {
    name: 'fit',
    decoder: /(^|.+-)avatar_fit-(\d+)(-|$)/
  },
  {
    name: 'query',
    decoder: /(^|.+-)avatar_query-([^.]+)(\.|$)/
  }
];
const optionsDecoderFormat = [
  {
    name: 'type',
    decoder: /(^|.+-)format_type-(png|jpeg)(-|$)/
  },
  { name: 'quality', decoder: /(^|.+-)format_quality-(\d+)(-|$)/ }
];
const optionsDecoderBase = [
  {
    name: 'query',
    decoder: /(^|.+-)base_query-([^.]+)(\.|$)/
  }
];

export function decodeOptions(
  mdqrOptions: MdAvatarOptions,
  sources: string[]
): MdAvatarOptions {
  const retMdqrOptions: any = JSON.parse(
    JSON.stringify(
      Object.assign({ avatar: {}, format: {}, base: {} }, mdqrOptions) || {
        avatar: {},
        format: {},
        base: {}
      }
    )
  );
  //  fileName と alt からでコードするので関数化してある.
  // TODO: ユーティリティ化などを検討.
  const decodeMdqrOptions = (out: any, src: string) => {
    optionsDecoderAvatar.forEach((o) => {
      const m = src.match(o.decoder);
      if (m) {
        // TODO: decoder 側で代入用の関数を指定できるように.
        if (o.name === 'position' || o.name === 'fillshape') {
          out.avatar[o.name] = m[2];
        } else if (o.name === 'query') {
          out.avatar[o.name] = decodeURIComponent(m[2]);
        } else if (o.name === 'fillstyle') {
          out.avatar[o.name] = `#${m[2]}`;
        } else {
          out.avatar[o.name] = parseInt(m[2], 10);
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
    optionsDecoderBase.forEach((o) => {
      const m = src.match(o.decoder);
      if (m) {
        if (o.name === 'query') {
          out.base[o.name] = decodeURIComponent(m[2]);
        }
      }
    });
  };
  sources.forEach((s) => decodeMdqrOptions(retMdqrOptions, s));

  return retMdqrOptions;
}
