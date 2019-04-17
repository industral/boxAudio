import LibraryProcess from '../index';
import dropbox from 'dropbox';
import * as mm from 'music-metadata-browser';
import {IAudioMetadata} from 'music-metadata-browser';

import store from '@/stores';
import {LogType} from '@/stores/modules/library-processing';

import db from '@/context/db';
import arrayBufferConcat from 'arraybuffer-concat';

const Dropbox = dropbox.Dropbox;

export default class DropboxProcess extends LibraryProcess {
  private files: dropbox.files.FileMetadataReference[] = [];
  private filesProcessed: number = 0;

  public async start() {
    store.commit('libraryProcessing/setScanProgress', true);

    await this.getListOfAllFiles();

    store.commit('libraryProcessing/setFilesCount', this.files.length);

    await this.getMetadataForAllFiles();

    store.commit('libraryProcessing/setScanProgress', false);
  }

  private async getListOfAllFiles() {
    let result = await this.scanFolder('/Dido');
    while (result) {
      result = await this.scanFolder(undefined, result);
    }
  }

  private async getMetadataForAllFiles() {
    for (const file of this.files) {
      await this.getMetadataForFileWithTries(file);
      store.commit('libraryProcessing/setProcessedFilesCount', ++this.filesProcessed);
    }
  }

  public async getMetadataForArrayBuffer(data: ArrayBuffer) {
    const objectURL = URL.createObjectURL(new Blob([data]));

    let metadata;
    try {
      metadata = await mm.fetchFromUrl(objectURL);
      console.log('metadata', metadata);
      URL.revokeObjectURL(objectURL);
    } catch (error) {
      console.log('error', error);
    } finally {
      return {
        metadata,
        data
      };
    }
  }

  public async fetchFileDataRange(path: string = '', bytesRangeStart = 0, bytesRangeAmount = 1024 * 20) {
    const response = await fetch('https://content.dropboxapi.com/2/files/download', { // https://content.dropboxapi.com/2/files/download
      headers: {
        'Authorization': `Bearer ${store.state.settings.accessTokenDropbox}`,
        'Dropbox-API-Arg': JSON.stringify({path}),
        'Range': `bytes=${bytesRangeStart}-${bytesRangeStart + bytesRangeAmount - 1}`
      }
    });

    if (response.ok) {
      const data = await response.arrayBuffer();

      return {
        data,
        bytesRangeStart,
        bytesRangeAmount
      };
    } else {
      throw response;
    }
  }


  private async getMetadataForFileWithTries(file: dropbox.files.FileMetadataReference) {
    let arrayBuffer: ArrayBuffer;
    try {
      let dataResult = await this.fetchFileDataRange(file.path_lower);
      arrayBuffer = dataResult.data;

      let metadataResult = await this.getMetadataForArrayBuffer(arrayBuffer);
      let iteration = 1;

      while (iteration < 5) {
// @ts-ignore
        console.log('!!!!', iteration);
        // @ts-ignore
        if (!this.isMetadataOK(metadataResult && metadataResult.metadata)) {
          // @ts-ignore
          // try {
          // @ts-ignore


          dataResult = await this.fetchFileDataRange(file.path_lower, dataResult.bytesRangeStart + dataResult.bytesRangeAmount, dataResult.bytesRangeAmount);

          arrayBuffer = arrayBufferConcat(arrayBuffer, dataResult.data);
          metadataResult = await this.getMetadataForArrayBuffer(arrayBuffer);

          // result = await this.getMetadataForArrayBuffer(file, result.bytesRangeStart + result.bytesRangeAmount, result.bytesRangeAmount);
          // } catch (error) {
          // }
          console.log(`iteration ${file.path_lower}`, iteration);
          ++iteration;
        } else {
          if (this.isMetadataOK(metadataResult && metadataResult.metadata)) {
            const metadata = metadataResult.metadata!;

            console.log('metadata', metadataResult.metadata);

            let trackNumber: string = '';
            let diskNumber: string = '';

            if (metadata.common.track.no) {
              trackNumber = metadata.common.track.no.toString();

              if (metadata.common.track.of) {
                trackNumber += ` of ${metadata.common.track.of}`;
              }
            }

            if (metadata.common.disk.no) {
              diskNumber = metadata.common.disk.no.toString();

              if (metadata.common.disk.of) {
                diskNumber += ` of ${metadata.common.disk.of}`;
              }
            }

            await db.addSong({
              artist: metadata.common.artist || 'Unknown',
              albumArtist: metadata.common.albumartist || metadata.common.artist || 'Unknown',
              album: metadata.common.album || 'Unknown',
              title: metadata.common.title || 'Unknown',
              diskNumber: diskNumber,
              trackNumber: trackNumber,
              file: file.path_lower!,
              coverArt: metadata.common.picture,
              size: file.size,
              bitrate: metadata.format.bitrate!,
              duration: metadata.format.duration!,
              dataformat: metadata.format.dataformat!
            });

            await db.addAlbum({
              albumArtist: metadata.common.albumartist || metadata.common.artist || 'Unknown',
              album: metadata.common.album || 'Unknown',
              coverArt: metadata.common.picture
            });

            delete metadata.common.picture;
            store.commit('libraryProcessing/addLog', {
              type: LogType.info,
              message: `Metadata found for file: ${file.path_lower}`,
              messageLong: `Metadata: ${JSON.stringify(metadata, null, 2)}`
            });
          } else {
            store.commit('libraryProcessing/addLog', {
              type: LogType.warn,
              message: `Metadata was found for file: ${file.path_lower}`
            });
          }

          break;
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  private isMetadataOK(metadata: IAudioMetadata | undefined) {
    return metadata && metadata.common && (metadata.common.artist || metadata.common.album || metadata.common.title) &&
      metadata.format.sampleRate && metadata.format.duration && metadata.format.dataformat;
  }

  private async scanFolder(path?: string | undefined, cursor?: string | undefined) {
    const params = {
      path,
      recursive: cursor ? undefined : true,
      // limit: cursor ? undefined : 10, //TODO: remove. Only for testing purpose
      cursor
    };

    let method: string = 'filesListFolder';

    if (cursor) {
      method = 'filesListFolderContinue';
    }

    //FIXME: how to workaround that?
    // @ts-ignore
    const result: dropbox.files.ListFolderResult = await new Dropbox({
      fetch,
      accessToken: store.state.settings.accessTokenDropbox
    })[method](params); //TODO: remove `Above & Beyond` after test


    for (const item of result.entries) {
      // console.log('item', item);
      if (item['.tag'] === 'file' && item.path_lower && item.path_lower.match(this.extensions)) {
        this.files.push(item);

        store.commit('libraryProcessing/addLog', {
          type: LogType.info,
          message: `Found file: ${item.path_lower}`
        });
      }
    }

    if (result.has_more) {
      return result.cursor;
    }
  }
}
