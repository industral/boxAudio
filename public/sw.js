var DATA = {};

self.addEventListener('message', function(event) {
  if (event.data.accessTokenDropbox) {
    DATA.accessTokenDropbox = event.data.accessTokenDropbox;
  }

  console.log('!!!! MESSGAE', event.data);
  // Perform install steps
});

self.addEventListener('install', function(event) {
  console.log('!!!!', event);
  // Perform install steps
});

self.addEventListener('install', event => {
  self.skipWaiting();

  // event.waitUntil(
  //   caching etc
  // );
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

      console.log('PATHNAME');
      // event.respondWith(new Response("Hello world!"));


      // if (event.request.method === 'HEAD') {
      //   const promise = new Promise(async (resolve, reject) => {
      //     const r = new Response("", {
      //       status: 200,
      //       // "statusText": "SuperSmashingGreat!",
      //       headers: {
      //         'Content-Length': url.searchParams.get('size')
      //       }
      //     });
      //
      //     resolve(r);
      //   });
      //
      //   event.respondWith(promise);
      // } else {
      const promise = new Promise(async (resolve, reject) => {
        try {

          const changedRequest = fetchFile2(event.request, file);
          console.log('changedRequest', changedRequest);
          const resultResponse = await fetch(changedRequest);

          // const resultResponse = await fetchFile(file);
          const blob = await resultResponse.clone().blob();

          resolve(resultResponse);
          console.log('YAY', blob);
        } catch(error) {
          reject(error);
        }
      });

      event.respondWith(promise);
    }
    // }
  } else {
    return fetch(event.request);
  }


  //   caches.match(event.request)
  //     .then(function(response) {
  //         // Cache hit - return response
  //         if (response) {
  //           return response;
  //         }
  //         // return fetch(event.request);
  //       }
  //     )
  // );
});

function fetchFile2(request, path) {
  const r = new Request('https://content.dropboxapi.com/2/files/download', {
    ...request,
    // method: request.method,
    // mode: 'no-cors'
    // headers: {
    //   Authorization: `Bearer ${DATA.accessTokenDropbox}`,
    //   'Dropbox-API-Arg': JSON.stringify({path})
    // }
  });

  console.log('RRR', request);
  console.log('RRR2', request.method);

  r.method = request.method;
  // r.url = 'https://content.dropboxapi.com/2/files/download';
  r.headers.set('Authorization', `Bearer ${DATA.accessTokenDropbox}`);
  r.headers.set('Dropbox-API-Arg', JSON.stringify({path}));
  r.headers.set('Range', request.headers.get('Range'));

  // request.headers.Authorization = `Bearer ${DATA.accessTokenDropbox}`;
  // request.headers['Dropbox-API-Arg'] = JSON.stringify({path});

  console.log('RRR3', request);

  return r;
}

// async function fetchFile(path = '', bytesRangeStart = 0, bytesRangeAmount = 1024 * 20) {
//   const response = await fetch('https://content.dropboxapi.com/2/files/download', {
//     headers: {
//       'Authorization': `Bearer ${DATA.accessTokenDropbox}`,
//       'Dropbox-API-Arg': JSON.stringify({path}),
//       // 'Range': `bytes=${bytesRangeStart}-${bytesRangeStart + bytesRangeAmount - 1}`
//     }
//   });
//
//   if (response.ok) {
//     return response;
//   } else {
//     console.error(`Can't fetch`, response);
//     throw response;
//   }
// }
