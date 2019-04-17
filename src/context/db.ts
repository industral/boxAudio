import Dexie from 'dexie';

console.log('DB!');

export interface ISong {
  id?: number;
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
  albumArtist: string;
  album: string;
  coverArt?: object;
}

class ScirottPlayer extends Dexie {
  public songs!: Dexie.Table<ISong, number>;
  public albums!: Dexie.Table<IAlbum, number>;

  constructor() {
    super('ScirottPlayer2');

    this.version(1).stores({
      songs: 'file,artist,albumArtist,album,title',
      albums: '[albumArtist+album],albumArtist,album',
      songChunkCache: '++chunkId'
    });
  }
}

const db = new ScirottPlayer();

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
      console.log(artist);

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
    const result:any = {};
    const songs = await db.songs.where('albumArtist').equals(artist).toArray();
    const albums = await db.albums.where('albumArtist').equals(artist).toArray();

    console.log('albums', albums);
    for (const song of songs) {
      result[song.album] = result[song.album] || {};
      result[song.album].count = result[song.album].count || 0;
      ++result[song.album].count;
      result[song.album].coverArt = result[song.album].coverArt || albums.find((album) => album.album === song.album).coverArt
    }

    return result;
  }

  async getSongsForArtistAndAlbum(artist: string, album: string) {
    return await db.songs.where({albumArtist: artist, album}).toArray();
  }
}

export default new DB();

// db.transaction('rw', db.friends, async () => {
//
//   // // Make sure we have something in DB:
//   // if ((await db.friends.where('name').equals('Josephine').count()) === 0) {
//   //   let id = await db.friends.add({name: 'Josephine', age: 21});
//   //   console.log(`Addded friend with id ${id}`);
//   // }
//   //
//   // // Query:
//   // let youngFriends = await db.friends.where('age').below(25).toArray();
//   //
//   // // Show result:
//   // console.log('My young friends: ' + JSON.stringify(youngFriends));
//
// }).catch(e => {
//   console.log(e.stack || e);
// });
