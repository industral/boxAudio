export default class Utils {
  static openAuthWindow(url: string, width = 900 as number, height = 1000 as number) {
    const top = (screen.height - height) / 4;
    const left = (screen.width - width) / 2;

    window.open(url, '_blank', `toolbar=no, location=no, height=${height}, width=${width}, top=${top}, left=${left}`);
  }

  static getURLFromArrayBuffer(data: ArrayBuffer | null) {
    if (!data) {
      return '/img/no-cover.png';
    }

    return URL.createObjectURL(new Blob([data.data], {mime: data.format}));
  }

  // static concatArrayBuffer(...buffers: ArrayBuffer[]) {
  //   const tmp = new Uint8Array(buffers.reduce((previous:ArrayBuffer, current:ArrayBuffer) => previous.length + current.length));
  //
  //
  //   buffers.map(() => {
  //
  //   });
  //
  //   tmp.set(new Uint8Array(buffer1), 0);
  //   tmp.set(new Uint8Array(buffer2), buffer1.byteLength);
  //   return tmp.buffer;
  // }
}
