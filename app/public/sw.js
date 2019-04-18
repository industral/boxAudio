var DATA = {};

self.addEventListener('message', function(event) {
  if (event.data.accessTokenDropbox) {
    DATA.accessTokenDropbox = event.data.accessTokenDropbox;
  }
});

self.addEventListener('install', function(event) {
});

self.addEventListener('install', event => {
  self.skipWaiting();
});

//
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

      if (event.clientId) {
        const client = await clients.get(event.clientId);
        if (client) {
          client.postMessage({
            type: 'error',
            message: 'No Dropbox Access Token was found'
          });
        }
      }

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
          reject(error);
        }
      });

      event.respondWith(promise);
    }
  } else {
    return fetch(event.request);
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
