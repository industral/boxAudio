import utils from '@/assets/scripts/utils';
import dropbox from 'dropbox';

const Dropbox = dropbox.Dropbox;

export default class Connect {
  static connect() {
    const dbx = new Dropbox({clientId: process.env.VUE_APP_DROPBOX_CLIENT_ID});

    const url = dbx.getAuthenticationUrl(`${location.origin}/dropbox-oauth-callback`);
    utils.openAuthWindow(url);
  }
}
