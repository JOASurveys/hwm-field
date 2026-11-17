// Offline cache for JOA HWM Field. Bump VERSION when any file changes.
const VERSION='joa-hwm-1.1.4';
const FILES=['./','./index.html','./manifest.json','./icon.svg','./apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(VERSION).then(c=>c.addAll(FILES.map(f=>new Request(f,{cache:'no-cache'})))));self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==VERSION).map(x=>caches.delete(x)))));self.clients.claim();});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET') return;
  // network first (so updates arrive when there is signal), cache fallback offline
  const same=new URL(e.request.url).origin===location.origin;
  // no-cache: always ask the server whether a newer copy exists (GitHub Pages lets browsers cache files for 10 min)
  e.respondWith((same?fetch(e.request.url,{cache:'no-cache',credentials:'same-origin'}):fetch(e.request)).then(r=>{const c=r.clone();caches.open(VERSION).then(x=>x.put(e.request,c));return r;})
    .catch(()=>caches.match(e.request,{ignoreSearch:true})));
});
