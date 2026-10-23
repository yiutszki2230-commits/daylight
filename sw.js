'use strict';
const CACHE='daylight-shell-v1.1.0-ds037';
const BASE=new URL('./',self.location.href);
const ASSETS=['./','index.html','style.css','ds037.css','assets/ds037-daylight-tableau.webp','engine.js','app.js','manifest.webmanifest','icon.svg','icon-192.png','icon-512.png'].map(x=>new URL(x,BASE).href);
self.addEventListener('install',event=>event.waitUntil((async()=>{const cache=await caches.open(CACHE);await cache.addAll(ASSETS);await self.skipWaiting();})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{for(const key of await caches.keys())if(key.startsWith('daylight-shell-')&&key!==CACHE)await caches.delete(key);await self.clients.claim();})()));
self.addEventListener('fetch',event=>{const request=event.request,url=new URL(request.url);if(request.method!=='GET'||url.origin!==BASE.origin||!url.pathname.startsWith(BASE.pathname))return;
if(request.mode==='navigate'){event.respondWith((async()=>{try{const response=await fetch(request);if(response.ok&&!response.redirected){const cache=await caches.open(CACHE);await cache.put(new URL('index.html',BASE).href,response.clone());}return response;}catch(e){return (await caches.match(new URL('index.html',BASE).href))||Response.error();}})());return;}
if(!ASSETS.includes(url.href))return;event.respondWith((async()=>{const cached=await caches.match(request);if(cached)return cached;const response=await fetch(request);if(response.ok&&!response.redirected)(await caches.open(CACHE)).put(request,response.clone());return response;})());
});
