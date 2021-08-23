import { createReadStream } from 'fs';
import { PassThrough } from 'stream';
import cli from './cli';

describe('cli()', () => {
  it('should convert example file', async () => {
    const f = createReadStream('test/assets/test1.md');
    const stdin = new PassThrough();
    const stdout = new PassThrough();
    const stderr = new PassThrough();
    let outData = '';
    stdout.on('data', (d) => (outData = outData + d));
    let errData = '';
    stderr.on('data', (d) => (errData = errData + d));
    process.nextTick(() => {
      f.pipe(stdin);
      //stdin.end();
    });
    expect(
      await cli({
        stdin,
        stdout,
        stderr
      })
    ).toEqual(0);
    expect(outData).toMatchSnapshot();
    expect(errData).toEqual('');
  });
  it('should accept options', async () => {
    const stdin = new PassThrough();
    const stdout = new PassThrough();
    const stderr = new PassThrough();
    let outData = '';
    stdout.on('data', (d) => (outData = outData + d));
    let errData = '';
    stderr.on('data', (d) => (errData = errData + d));
    process.nextTick(() => {
      stdin.write(
        '---\ntitle: title2\n---\n\n# test2\n\n- item1\n- item2\n\n---\n\n# page2\n'
      );
      stdin.end();
    });
    expect(
      await cli({
        stdin,
        stdout,
        stderr,
        bullet: '+',
        rule: '*'
      })
    ).toEqual(0);
    expect(outData).toEqual(
      '---\ntitle: title2\n---\n\n# test2\n\n+   item1\n+   item2\n\n***\n\n# page2\n'
    );
    expect(errData).toEqual('');
  });
});
