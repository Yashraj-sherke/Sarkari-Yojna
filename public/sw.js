const CACHE='sy-offline-v1';
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.add('/offline.html')));self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('sy-offline-')&&k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim();});
// Never cache profiles, API responses, authenticated pages, or eligibility content.
self.addEventListener('fetch',e=>{if(e.request.mode==='navigate')e.respondWith(fetch(e.request).catch(()=>caches.match('/offline.html')));});
