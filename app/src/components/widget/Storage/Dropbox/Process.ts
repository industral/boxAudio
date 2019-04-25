import LibraryProcess from '../index';
import dropbox from 'dropbox';
import * as mm from '@industral/music-metadata-browser';
import {IAudioMetadata} from '@industral/music-metadata-browser';

import store from '@/stores';
import {LogType} from '@/stores/modules/library-processing';

import db, {StorageName} from '@/context/db';
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
    let result = await this.scanFolder('');
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
    } catch (error) {
    } finally {
      URL.revokeObjectURL(objectURL);

      return {
        metadata,
        data
      };
    }
  }

  public async fetchFileDataRange(path: string = '', bytesRangeStart = 0, bytesRangeAmount = 1024 * 100) {
    const response = await fetch('https://content.dropboxapi.com/2/files/download', {
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
      let fileDataRangeResult = await this.fetchFileDataRange(file.id);
      arrayBuffer = fileDataRangeResult.data;

      let metadataResult = await this.getMetadataForArrayBuffer(arrayBuffer);
      let iteration = 0;

      while (iteration < 3) {
        if (this.isMetadataOK(metadataResult && metadataResult.metadata)) break;

        fileDataRangeResult = await this.fetchFileDataRange(file.id, fileDataRangeResult.bytesRangeStart + fileDataRangeResult.bytesRangeAmount, fileDataRangeResult.bytesRangeAmount);

        arrayBuffer = arrayBufferConcat(arrayBuffer, fileDataRangeResult.data);
        metadataResult = await this.getMetadataForArrayBuffer(arrayBuffer);

        ++iteration;
      }

      const metadata = metadataResult.metadata!;

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

      const albumArtist = metadata.common.albumartist || metadata.common.artist || 'Unknown';
      const album = metadata.common.album || 'Unknown';

      await db.addSong({
        storageName: StorageName.Dropbox,
        storageId: file.id,
        artist: metadata.common.artist || 'Unknown',
        albumArtist,
        album,
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
        storageName: StorageName.Dropbox,
        albumArtist,
        album,
        coverArt: metadata.common.picture
      });

      delete metadata.common.picture;
      store.commit('libraryProcessing/addLog', {
        type: LogType.info,
        message: `Metadata found for file: ${file.path_lower}`,
        messageLong: `Metadata: ${JSON.stringify(metadata, null, 2)}`
      });
    } catch (error) {
      console.error(error);
    } finally {
      arrayBuffer = null;
    }
  }

  private isMetadataOK(metadata: IAudioMetadata | undefined) {
    return metadata && metadata.common && metadata.common.artist && metadata.common.albumartist && metadata.common.title &&
      metadata.format.sampleRate && metadata.format.duration && metadata.format.dataformat;
  }

  private async scanFolder(path?: string | undefined, cursor?: string | undefined) {
    const params = {
      path,
      recursive: cursor ? undefined : true,
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
    })[method](params);


    for (const item of result.entries) {
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
