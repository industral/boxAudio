const DATA = {};
const CACHE_NAME = 'cache-v2';

let filesToCache = [];

if (self.__precacheManifest) {
  filesToCache = self.__precacheManifest.reduce((acc, curr) => {
    const url = curr.url;

    if (url.includes('Router-')) {
      if (url.includes('Router-Home')) acc.push(url);
    } else {
      acc.push(url);
    }

    return acc;
  }, []);
}

self.addEventListener('message', function(event) {
  if (event.data.accessTokenDropbox) {
    DATA.accessTokenDropbox = event.data.accessTokenDropbox;
  }
});

self.addEventListener('activate', event => {
  console.log('Activating new service worker...');

  const cacheWhitelist = [CACHE_NAME];

  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('install', event => {
  console.log('Attempting to install service worker and cache static assets');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(filesToCache);
      })
  );
});

self.addEventListener('fetch', async function(event) {
  const url = new URL(event.request.url);

  if (url.pathname === '/storage/download') {
    if (!DATA.accessTokenDropbox) {
      const promise = new Promise(async (resolve, reject) => {
        const r = new Response("", {
          status: 401,
        });

        resolve(r);
      });

      await sendMessage({
        type: 'error',
        message: 'No Dropbox Access Token was found'
      });

      // return event.respondWith(promise);
    } else {
      const file = url.searchParams.get('file');

      const promise = new Promise(async (resolve, reject) => {
        try {

          const changedRequest = createNewRequest(event.request, file);
          const resultResponse = await fetch(changedRequest);

          const blob = await resultResponse.clone().blob();

          resolve(resultResponse);

          // cache blob
        } catch(error) {
          console.log('reject', error, file);

          reject(error);
        }
      });

      event.respondWith(promise);
    }
  } else {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          return response || fetch(event.request).then((response) => {
            cache.put(event.request, response.clone());
            return response;
          });
        });
      })
    );
  }
});

function createNewRequest(request, path) {
  const r = new Request('https://content.dropboxapi.com/2/files/download', {
    ...request,
  });

  r.method = request.method;
  r.headers.set('Authorization', `Bearer ${DATA.accessTokenDropbox}`);
  r.headers.set('Dropbox-API-Arg', JSON.stringify({path}));
  r.headers.set('Range', request.headers.get('Range'));

  return r;
}

async function sendMessage(message) {
  if (event.clientId) {
    const client = await clients.get(event.clientId);
    if (client) {
      client.postMessage(message);
    }
  }
}
