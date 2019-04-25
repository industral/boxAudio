import Dexie from 'dexie';

export enum StorageName {
  Dropbox = 'dropbox'
}

export interface ISong {
  id?: number;
  storageName: StorageName;
  storageId: string;
  artist: string;
  albumArtist: string;
  album: string;
  title: string;
  file: string;
  diskNumber?: string;
  trackNumber?: string;
  coverArt?: object;
  size: number,
  bitrate: number,
  duration: number,
  dataformat: string
}

export interface IAlbum {
  storageName: StorageName;
  albumArtist: string;
  album: string;
  coverArt?: object;
}

class boxAudio extends Dexie {
  public songs!: Dexie.Table<ISong, number>;
  public albums!: Dexie.Table<IAlbum, number>;

  constructor() {
    super('boxAudio');

    this.version(3).stores({
      songs: 'file,artist,albumArtist,album,storageName,storageId',
      albums: '[albumArtist+album],albumArtist,album,storageName',
      songChunkCache: '++chunkId'
    });
  }
}

const db = new boxAudio();

class DB {
  async playlistCount() {
    return await db.songs.count();
  }

  async addSong(song: ISong) {
    return await db.songs.put(song);
  }

  async addAlbum(album: IAlbum) {
    return await db.albums.put(album);
  }

  async getArtistsWithinAlbums() {
    const result: any = {};
    const artistsResult = await db.albums.toArray();

    for (const artist of artistsResult) {
      result[artist.albumArtist] = result[artist.albumArtist] || {};
      result[artist.albumArtist].albums = result[artist.albumArtist].albums || [];
      result[artist.albumArtist].albums.push({
        name: artist.album,
        cover: artist.coverArt
      });
    }

    return result;
  }

  async getAlbumsForArtist(artist: string) {
    const result: any = {};
    const songs = await db.songs.where('albumArtist').equals(artist).toArray();
    const albums = await db.albums.where('albumArtist').equals(artist).toArray();

    for (const song of songs) {
      result[song.album] = result[song.album] || {};
      result[song.album].count = result[song.album].count || 0;
      ++result[song.album].count;

      if (!result[song.album].coverArt) {
        const foundAlbum = albums.find((album) => album.album === song.album);
        if (foundAlbum && foundAlbum.coverArt) {
          result[song.album].coverArt = foundAlbum.coverArt;
        }
      }
    }

    return result;
  }

  async getSongsForArtistAndAlbum(artist: string, album: string) {
    return await db.songs.where({albumArtist: artist, album}).toArray();
  }
}

export default new DB();
