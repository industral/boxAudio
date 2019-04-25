export default class Utils {
  static openAuthWindow(url: string, width = 900 as number, height = 1000 as number) {
    const top = (screen.height - height) / 4;
    const left = (screen.width - width) / 2;

    window.open(url, '_blank', `toolbar=no, location=no, height=${height}, width=${width}, top=${top}, left=${left}`);
  }

  static getURLFromArrayBuffer(data: ArrayBuffer | null) {
    if (!data) {
      return '/img/no-cover.jpg';
    }

    return URL.createObjectURL(new Blob([data.data], {mime: data.format}));
  }
}
