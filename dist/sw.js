(()=>{"use strict";var e={316:()=>{try{self["workbox:background-sync:6.5.3"]&&_()}catch(e){}},322:()=>{try{self["workbox:cacheable-response:6.5.3"]&&_()}catch(e){}},986:()=>{try{self["workbox:core:6.5.3"]&&_()}catch(e){}},883:()=>{try{self["workbox:precaching:6.5.3"]&&_()}catch(e){}},831:()=>{try{self["workbox:routing:6.5.3"]&&_()}catch(e){}},694:()=>{try{self["workbox:strategies:6.5.3"]&&_()}catch(e){}}},t={};function s(n){var a=t[n];if(void 0!==a)return a.exports;var r=t[n]={exports:{}};return e[n](r,r.exports,s),r.exports}(()=>{s(986);class e extends Error{constructor(e,t){super(((e,...t)=>{let s=e;return t.length>0&&(s+=` :: ${JSON.stringify(t)}`),s})(e,t)),this.name=e,this.details=t}}const t=new Set,n={googleAnalytics:"googleAnalytics",precache:"precache-v2",prefix:"workbox",runtime:"runtime",suffix:"undefined"!=typeof registration?registration.scope:""},a=e=>[n.prefix,e,n.suffix].filter((e=>e&&e.length>0)).join("-"),r=e=>e||a(n.precache);function i(e,t){const s=new URL(e);for(const e of t)s.searchParams.delete(e);return s.href}let o;class c{constructor(){this.promise=new Promise(((e,t)=>{this.resolve=e,this.reject=t}))}}function h(e){return new Promise((t=>setTimeout(t,e)))}function u(e,t){const s=t();return e.waitUntil(s),s}let l,d;const f=new WeakMap,y=new WeakMap,p=new WeakMap,w=new WeakMap,g=new WeakMap;let m={get(e,t,s){if(e instanceof IDBTransaction){if("done"===t)return y.get(e);if("objectStoreNames"===t)return e.objectStoreNames||p.get(e);if("store"===t)return s.objectStoreNames[1]?void 0:s.objectStore(s.objectStoreNames[0])}return b(e[t])},set:(e,t,s)=>(e[t]=s,!0),has:(e,t)=>e instanceof IDBTransaction&&("done"===t||"store"===t)||t in e};function _(e){return"function"==typeof e?(t=e)!==IDBDatabase.prototype.transaction||"objectStoreNames"in IDBTransaction.prototype?(d||(d=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])).includes(t)?function(...e){return t.apply(q(this),e),b(f.get(this))}:function(...e){return b(t.apply(q(this),e))}:function(e,...s){const n=t.call(q(this),e,...s);return p.set(n,e.sort?e.sort():[e]),b(n)}:(e instanceof IDBTransaction&&function(e){if(y.has(e))return;const t=new Promise(((t,s)=>{const n=()=>{e.removeEventListener("complete",a),e.removeEventListener("error",r),e.removeEventListener("abort",r)},a=()=>{t(),n()},r=()=>{s(e.error||new DOMException("AbortError","AbortError")),n()};e.addEventListener("complete",a),e.addEventListener("error",r),e.addEventListener("abort",r)}));y.set(e,t)}(e),s=e,(l||(l=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])).some((e=>s instanceof e))?new Proxy(e,m):e);var t,s}function b(e){if(e instanceof IDBRequest)return function(e){const t=new Promise(((t,s)=>{const n=()=>{e.removeEventListener("success",a),e.removeEventListener("error",r)},a=()=>{t(b(e.result)),n()},r=()=>{s(e.error),n()};e.addEventListener("success",a),e.addEventListener("error",r)}));return t.then((t=>{t instanceof IDBCursor&&f.set(t,e)})).catch((()=>{})),g.set(t,e),t}(e);if(w.has(e))return w.get(e);const t=_(e);return t!==e&&(w.set(e,t),g.set(t,e)),t}const q=e=>g.get(e),R=["get","getKey","getAll","getAllKeys","count"],v=["put","add","delete","clear"],C=new Map;function E(e,t){if(!(e instanceof IDBDatabase)||t in e||"string"!=typeof t)return;if(C.get(t))return C.get(t);const s=t.replace(/FromIndex$/,""),n=t!==s,a=v.includes(s);if(!(s in(n?IDBIndex:IDBObjectStore).prototype)||!a&&!R.includes(s))return;const r=async function(e,...t){const r=this.transaction(e,a?"readwrite":"readonly");let i=r.store;return n&&(i=i.index(t.shift())),(await Promise.all([i[s](...t),a&&r.done]))[0]};return C.set(t,r),r}var k;k=m,m={...k,get:(e,t,s)=>E(e,t)||k.get(e,t,s),has:(e,t)=>!!E(e,t)||k.has(e,t)},s(316);const D="requests",L="queueName";class T{constructor(){this._db=null}async addEntry(e){const t=(await this.getDb()).transaction(D,"readwrite",{durability:"relaxed"});await t.store.add(e),await t.done}async getFirstEntryId(){const e=await this.getDb(),t=await e.transaction(D).store.openCursor();return null==t?void 0:t.value.id}async getAllEntriesByQueueName(e){const t=await this.getDb();return await t.getAllFromIndex(D,L,IDBKeyRange.only(e))||new Array}async getEntryCountByQueueName(e){return(await this.getDb()).countFromIndex(D,L,IDBKeyRange.only(e))}async deleteEntry(e){const t=await this.getDb();await t.delete(D,e)}async getFirstEntryByQueueName(e){return await this.getEndEntryFromIndex(IDBKeyRange.only(e),"next")}async getLastEntryByQueueName(e){return await this.getEndEntryFromIndex(IDBKeyRange.only(e),"prev")}async getEndEntryFromIndex(e,t){const s=await this.getDb(),n=await s.transaction(D).store.index(L).openCursor(e,t);return null==n?void 0:n.value}async getDb(){return this._db||(this._db=await function(e,t,{blocked:s,upgrade:n,blocking:a,terminated:r}={}){const i=indexedDB.open(e,t),o=b(i);return n&&i.addEventListener("upgradeneeded",(e=>{n(b(i.result),e.oldVersion,e.newVersion,b(i.transaction),e)})),s&&i.addEventListener("blocked",(e=>s(e.oldVersion,e.newVersion,e))),o.then((e=>{r&&e.addEventListener("close",(()=>r())),a&&e.addEventListener("versionchange",(e=>a(e.oldVersion,e.newVersion,e)))})).catch((()=>{})),o}("workbox-background-sync",3,{upgrade:this._upgradeDb})),this._db}_upgradeDb(e,t){t>0&&t<3&&e.objectStoreNames.contains(D)&&e.deleteObjectStore(D),e.createObjectStore(D,{autoIncrement:!0,keyPath:"id"}).createIndex(L,L,{unique:!1})}}class S{constructor(e){this._queueName=e,this._queueDb=new T}async pushEntry(e){delete e.id,e.queueName=this._queueName,await this._queueDb.addEntry(e)}async unshiftEntry(e){const t=await this._queueDb.getFirstEntryId();t?e.id=t-1:delete e.id,e.queueName=this._queueName,await this._queueDb.addEntry(e)}async popEntry(){return this._removeEntry(await this._queueDb.getLastEntryByQueueName(this._queueName))}async shiftEntry(){return this._removeEntry(await this._queueDb.getFirstEntryByQueueName(this._queueName))}async getAll(){return await this._queueDb.getAllEntriesByQueueName(this._queueName)}async size(){return await this._queueDb.getEntryCountByQueueName(this._queueName)}async deleteEntry(e){await this._queueDb.deleteEntry(e)}async _removeEntry(e){return e&&await this.deleteEntry(e.id),e}}const x=["method","referrer","referrerPolicy","mode","credentials","cache","redirect","integrity","keepalive"];class U{constructor(e){"navigate"===e.mode&&(e.mode="same-origin"),this._requestData=e}static async fromRequest(e){const t={url:e.url,headers:{}};"GET"!==e.method&&(t.body=await e.clone().arrayBuffer());for(const[s,n]of e.headers.entries())t.headers[s]=n;for(const s of x)void 0!==e[s]&&(t[s]=e[s]);return new U(t)}toObject(){const e=Object.assign({},this._requestData);return e.headers=Object.assign({},this._requestData.headers),e.body&&(e.body=e.body.slice(0)),e}toRequest(){return new Request(this._requestData.url,this._requestData)}clone(){return new U(this.toObject())}}const N="workbox-background-sync",I=new Set,P=e=>{const t={request:new U(e.requestData).toRequest(),timestamp:e.timestamp};return e.metadata&&(t.metadata=e.metadata),t};class K{constructor(t,{forceSyncFallback:s,onSync:n,maxRetentionTime:a}={}){if(this._syncInProgress=!1,this._requestsAddedDuringSync=!1,I.has(t))throw new e("duplicate-queue-name",{name:t});I.add(t),this._name=t,this._onSync=n||this.replayRequests,this._maxRetentionTime=a||10080,this._forceSyncFallback=Boolean(s),this._queueStore=new S(this._name),this._addSyncListener()}get name(){return this._name}async pushRequest(e){await this._addRequest(e,"push")}async unshiftRequest(e){await this._addRequest(e,"unshift")}async popRequest(){return this._removeRequest("pop")}async shiftRequest(){return this._removeRequest("shift")}async getAll(){const e=await this._queueStore.getAll(),t=Date.now(),s=[];for(const n of e){const e=60*this._maxRetentionTime*1e3;t-n.timestamp>e?await this._queueStore.deleteEntry(n.id):s.push(P(n))}return s}async size(){return await this._queueStore.size()}async _addRequest({request:e,metadata:t,timestamp:s=Date.now()},n){const a={requestData:(await U.fromRequest(e.clone())).toObject(),timestamp:s};switch(t&&(a.metadata=t),n){case"push":await this._queueStore.pushEntry(a);break;case"unshift":await this._queueStore.unshiftEntry(a)}this._syncInProgress?this._requestsAddedDuringSync=!0:await this.registerSync()}async _removeRequest(e){const t=Date.now();let s;switch(e){case"pop":s=await this._queueStore.popEntry();break;case"shift":s=await this._queueStore.shiftEntry()}if(s){const n=60*this._maxRetentionTime*1e3;return t-s.timestamp>n?this._removeRequest(e):P(s)}}async replayRequests(){let t;for(;t=await this.shiftRequest();)try{await fetch(t.request.clone())}catch(s){throw await this.unshiftRequest(t),new e("queue-replay-failed",{name:this._name})}}async registerSync(){if("sync"in self.registration&&!this._forceSyncFallback)try{await self.registration.sync.register(`${N}:${this._name}`)}catch(e){}}_addSyncListener(){"sync"in self.registration&&!this._forceSyncFallback?self.addEventListener("sync",(e=>{if(e.tag===`${N}:${this._name}`){const t=async()=>{let t;this._syncInProgress=!0;try{await this._onSync({queue:this})}catch(e){if(e instanceof Error)throw t=e,t}finally{!this._requestsAddedDuringSync||t&&!e.lastChance||await this.registerSync(),this._syncInProgress=!1,this._requestsAddedDuringSync=!1}};e.waitUntil(t())}})):this._onSync({queue:this})}static get _queueNames(){return I}}s(831);const B=e=>e&&"object"==typeof e?e:{handle:e};class O{constructor(e,t,s="GET"){this.handler=B(t),this.match=e,this.method=s}setCatchHandler(e){this.catchHandler=B(e)}}class M extends O{constructor(e,t,s){super((({url:t})=>{const s=e.exec(t.href);if(s&&(t.origin===location.origin||0===s.index))return s.slice(1)}),t,s)}}class j{constructor(){this._routes=new Map,this._defaultHandlerMap=new Map}get routes(){return this._routes}addFetchListener(){self.addEventListener("fetch",(e=>{const{request:t}=e,s=this.handleRequest({request:t,event:e});s&&e.respondWith(s)}))}addCacheListener(){self.addEventListener("message",(e=>{if(e.data&&"CACHE_URLS"===e.data.type){const{payload:t}=e.data,s=Promise.all(t.urlsToCache.map((t=>{"string"==typeof t&&(t=[t]);const s=new Request(...t);return this.handleRequest({request:s,event:e})})));e.waitUntil(s),e.ports&&e.ports[0]&&s.then((()=>e.ports[0].postMessage(!0)))}}))}handleRequest({request:e,event:t}){const s=new URL(e.url,location.href);if(!s.protocol.startsWith("http"))return;const n=s.origin===location.origin,{params:a,route:r}=this.findMatchingRoute({event:t,request:e,sameOrigin:n,url:s});let i=r&&r.handler;const o=e.method;if(!i&&this._defaultHandlerMap.has(o)&&(i=this._defaultHandlerMap.get(o)),!i)return;let c;try{c=i.handle({url:s,request:e,event:t,params:a})}catch(e){c=Promise.reject(e)}const h=r&&r.catchHandler;return c instanceof Promise&&(this._catchHandler||h)&&(c=c.catch((async n=>{if(h)try{return await h.handle({url:s,request:e,event:t,params:a})}catch(e){e instanceof Error&&(n=e)}if(this._catchHandler)return this._catchHandler.handle({url:s,request:e,event:t});throw n}))),c}findMatchingRoute({url:e,sameOrigin:t,request:s,event:n}){const a=this._routes.get(s.method)||[];for(const r of a){let a;const i=r.match({url:e,sameOrigin:t,request:s,event:n});if(i)return a=i,(Array.isArray(a)&&0===a.length||i.constructor===Object&&0===Object.keys(i).length||"boolean"==typeof i)&&(a=void 0),{route:r,params:a}}return{}}setDefaultHandler(e,t="GET"){this._defaultHandlerMap.set(t,B(e))}setCatchHandler(e){this._catchHandler=B(e)}registerRoute(e){this._routes.has(e.method)||this._routes.set(e.method,[]),this._routes.get(e.method).push(e)}unregisterRoute(t){if(!this._routes.has(t.method))throw new e("unregister-route-but-not-found-with-method",{method:t.method});const s=this._routes.get(t.method).indexOf(t);if(!(s>-1))throw new e("unregister-route-route-not-registered");this._routes.get(t.method).splice(s,1)}}let A;function W(t,s,n){let a;if("string"==typeof t){const e=new URL(t,location.href);a=new O((({url:t})=>t.href===e.href),s,n)}else if(t instanceof RegExp)a=new M(t,s,n);else if("function"==typeof t)a=new O(t,s,n);else{if(!(t instanceof O))throw new e("unsupported-route-type",{moduleName:"workbox-routing",funcName:"registerRoute",paramName:"capture"});a=t}return(A||(A=new j,A.addFetchListener(),A.addCacheListener()),A).registerRoute(a),a}function F(e){return"string"==typeof e?new Request(e):e}s(694);class H{constructor(e,t){this._cacheKeys={},Object.assign(this,t),this.event=t.event,this._strategy=e,this._handlerDeferred=new c,this._extendLifetimePromises=[],this._plugins=[...e.plugins],this._pluginStateMap=new Map;for(const e of this._plugins)this._pluginStateMap.set(e,{});this.event.waitUntil(this._handlerDeferred.promise)}async fetch(t){const{event:s}=this;let n=F(t);if("navigate"===n.mode&&s instanceof FetchEvent&&s.preloadResponse){const e=await s.preloadResponse;if(e)return e}const a=this.hasCallback("fetchDidFail")?n.clone():null;try{for(const e of this.iterateCallbacks("requestWillFetch"))n=await e({request:n.clone(),event:s})}catch(t){if(t instanceof Error)throw new e("plugin-error-request-will-fetch",{thrownErrorMessage:t.message})}const r=n.clone();try{let e;e=await fetch(n,"navigate"===n.mode?void 0:this._strategy.fetchOptions);for(const t of this.iterateCallbacks("fetchDidSucceed"))e=await t({event:s,request:r,response:e});return e}catch(e){throw a&&await this.runCallbacks("fetchDidFail",{error:e,event:s,originalRequest:a.clone(),request:r.clone()}),e}}async fetchAndCachePut(e){const t=await this.fetch(e),s=t.clone();return this.waitUntil(this.cachePut(e,s)),t}async cacheMatch(e){const t=F(e);let s;const{cacheName:n,matchOptions:a}=this._strategy,r=await this.getCacheKey(t,"read"),i=Object.assign(Object.assign({},a),{cacheName:n});s=await caches.match(r,i);for(const e of this.iterateCallbacks("cachedResponseWillBeUsed"))s=await e({cacheName:n,matchOptions:a,cachedResponse:s,request:r,event:this.event})||void 0;return s}async cachePut(s,n){const a=F(s);await h(0);const r=await this.getCacheKey(a,"write");if(!n)throw new e("cache-put-with-no-response",{url:(o=r.url,new URL(String(o),location.href).href.replace(new RegExp(`^${location.origin}`),""))});var o;const c=await this._ensureResponseSafeToCache(n);if(!c)return!1;const{cacheName:u,matchOptions:l}=this._strategy,d=await self.caches.open(u),f=this.hasCallback("cacheDidUpdate"),y=f?await async function(e,t,s,n){const a=i(t.url,s);if(t.url===a)return e.match(t,n);const r=Object.assign(Object.assign({},n),{ignoreSearch:!0}),o=await e.keys(t,r);for(const t of o)if(a===i(t.url,s))return e.match(t,n)}(d,r.clone(),["__WB_REVISION__"],l):null;try{await d.put(r,f?c.clone():c)}catch(e){if(e instanceof Error)throw"QuotaExceededError"===e.name&&await async function(){for(const e of t)await e()}(),e}for(const e of this.iterateCallbacks("cacheDidUpdate"))await e({cacheName:u,oldResponse:y,newResponse:c.clone(),request:r,event:this.event});return!0}async getCacheKey(e,t){const s=`${e.url} | ${t}`;if(!this._cacheKeys[s]){let n=e;for(const e of this.iterateCallbacks("cacheKeyWillBeUsed"))n=F(await e({mode:t,request:n,event:this.event,params:this.params}));this._cacheKeys[s]=n}return this._cacheKeys[s]}hasCallback(e){for(const t of this._strategy.plugins)if(e in t)return!0;return!1}async runCallbacks(e,t){for(const s of this.iterateCallbacks(e))await s(t)}*iterateCallbacks(e){for(const t of this._strategy.plugins)if("function"==typeof t[e]){const s=this._pluginStateMap.get(t),n=n=>{const a=Object.assign(Object.assign({},n),{state:s});return t[e](a)};yield n}}waitUntil(e){return this._extendLifetimePromises.push(e),e}async doneWaiting(){let e;for(;e=this._extendLifetimePromises.shift();)await e}destroy(){this._handlerDeferred.resolve(null)}async _ensureResponseSafeToCache(e){let t=e,s=!1;for(const e of this.iterateCallbacks("cacheWillUpdate"))if(t=await e({request:this.request,response:t,event:this.event})||void 0,s=!0,!t)break;return s||t&&200!==t.status&&(t=void 0),t}}class ${constructor(e={}){this.cacheName=e.cacheName||a(n.runtime),this.plugins=e.plugins||[],this.fetchOptions=e.fetchOptions,this.matchOptions=e.matchOptions}handle(e){const[t]=this.handleAll(e);return t}handleAll(e){e instanceof FetchEvent&&(e={event:e,request:e.request});const t=e.event,s="string"==typeof e.request?new Request(e.request):e.request,n="params"in e?e.params:void 0,a=new H(this,{event:t,request:s,params:n}),r=this._getResponse(a,s,t);return[r,this._awaitComplete(r,a,s,t)]}async _getResponse(t,s,n){let a;await t.runCallbacks("handlerWillStart",{event:n,request:s});try{if(a=await this._handle(s,t),!a||"error"===a.type)throw new e("no-response",{url:s.url})}catch(e){if(e instanceof Error)for(const r of t.iterateCallbacks("handlerDidError"))if(a=await r({error:e,event:n,request:s}),a)break;if(!a)throw e}for(const e of t.iterateCallbacks("handlerWillRespond"))a=await e({event:n,request:s,response:a});return a}async _awaitComplete(e,t,s,n){let a,r;try{a=await e}catch(r){}try{await t.runCallbacks("handlerDidRespond",{event:n,request:s,response:a}),await t.doneWaiting()}catch(e){e instanceof Error&&(r=e)}if(await t.runCallbacks("handlerDidComplete",{event:n,request:s,response:a,error:r}),t.destroy(),r)throw r}}class Q extends ${async _handle(t,s){let n,a=await s.cacheMatch(t);if(a);else try{a=await s.fetchAndCachePut(t)}catch(e){e instanceof Error&&(n=e)}if(!a)throw new e("no-response",{url:t.url,error:n});return a}}const V={cacheWillUpdate:async({response:e})=>200===e.status||0===e.status?e:null};class z extends ${constructor(e={}){super(e),this.plugins.some((e=>"cacheWillUpdate"in e))||this.plugins.unshift(V),this._networkTimeoutSeconds=e.networkTimeoutSeconds||0}async _handle(t,s){const n=[],a=[];let r;if(this._networkTimeoutSeconds){const{id:e,promise:i}=this._getTimeoutPromise({request:t,logs:n,handler:s});r=e,a.push(i)}const i=this._getNetworkPromise({timeoutId:r,request:t,logs:n,handler:s});a.push(i);const o=await s.waitUntil((async()=>await s.waitUntil(Promise.race(a))||await i)());if(!o)throw new e("no-response",{url:t.url});return o}_getTimeoutPromise({request:e,logs:t,handler:s}){let n;return{promise:new Promise((t=>{n=setTimeout((async()=>{t(await s.cacheMatch(e))}),1e3*this._networkTimeoutSeconds)})),id:n}}async _getNetworkPromise({timeoutId:e,request:t,logs:s,handler:n}){let a,r;try{r=await n.fetchAndCachePut(t)}catch(e){e instanceof Error&&(a=e)}return e&&clearTimeout(e),!a&&r||(r=await n.cacheMatch(t)),r}}class G extends ${constructor(e={}){super(e),this._networkTimeoutSeconds=e.networkTimeoutSeconds||0}async _handle(t,s){let n,a;try{const e=[s.fetch(t)];if(this._networkTimeoutSeconds){const t=h(1e3*this._networkTimeoutSeconds);e.push(t)}if(a=await Promise.race(e),!a)throw new Error(`Timed out the network response after ${this._networkTimeoutSeconds} seconds.`)}catch(e){e instanceof Error&&(n=e)}if(!a)throw new e("no-response",{url:t.url,error:n});return a}}s(322);class J{constructor(e={}){this._statuses=e.statuses,this._headers=e.headers}isResponseCacheable(e){let t=!0;return this._statuses&&(t=this._statuses.includes(e.status)),this._headers&&t&&(t=Object.keys(this._headers).some((t=>e.headers.get(t)===this._headers[t]))),t}}function X(t){if(!t)throw new e("add-to-cache-list-unexpected-type",{entry:t});if("string"==typeof t){const e=new URL(t,location.href);return{cacheKey:e.href,url:e.href}}const{revision:s,url:n}=t;if(!n)throw new e("add-to-cache-list-unexpected-type",{entry:t});if(!s){const e=new URL(n,location.href);return{cacheKey:e.href,url:e.href}}const a=new URL(n,location.href),r=new URL(n,location.href);return a.searchParams.set("__WB_REVISION__",s),{cacheKey:a.href,url:r.href}}s(883);class Y{constructor(){this.updatedURLs=[],this.notUpdatedURLs=[],this.handlerWillStart=async({request:e,state:t})=>{t&&(t.originalRequest=e)},this.cachedResponseWillBeUsed=async({event:e,state:t,cachedResponse:s})=>{if("install"===e.type&&t&&t.originalRequest&&t.originalRequest instanceof Request){const e=t.originalRequest.url;s?this.notUpdatedURLs.push(e):this.updatedURLs.push(e)}return s}}}class Z{constructor({precacheController:e}){this.cacheKeyWillBeUsed=async({request:e,params:t})=>{const s=(null==t?void 0:t.cacheKey)||this._precacheController.getCacheKeyForURL(e.url);return s?new Request(s,{headers:e.headers}):e},this._precacheController=e}}class ee extends ${constructor(e={}){e.cacheName=r(e.cacheName),super(e),this._fallbackToNetwork=!1!==e.fallbackToNetwork,this.plugins.push(ee.copyRedirectedCacheableResponsesPlugin)}async _handle(e,t){return await t.cacheMatch(e)||(t.event&&"install"===t.event.type?await this._handleInstall(e,t):await this._handleFetch(e,t))}async _handleFetch(t,s){let n;const a=s.params||{};if(!this._fallbackToNetwork)throw new e("missing-precache-entry",{cacheName:this.cacheName,url:t.url});{const e=a.integrity,r=t.integrity,i=!r||r===e;n=await s.fetch(new Request(t,{integrity:"no-cors"!==t.mode?r||e:void 0})),e&&i&&"no-cors"!==t.mode&&(this._useDefaultCacheabilityPluginIfNeeded(),await s.cachePut(t,n.clone()))}return n}async _handleInstall(t,s){this._useDefaultCacheabilityPluginIfNeeded();const n=await s.fetch(t);if(!await s.cachePut(t,n.clone()))throw new e("bad-precaching-response",{url:t.url,status:n.status});return n}_useDefaultCacheabilityPluginIfNeeded(){let e=null,t=0;for(const[s,n]of this.plugins.entries())n!==ee.copyRedirectedCacheableResponsesPlugin&&(n===ee.defaultPrecacheCacheabilityPlugin&&(e=s),n.cacheWillUpdate&&t++);0===t?this.plugins.push(ee.defaultPrecacheCacheabilityPlugin):t>1&&null!==e&&this.plugins.splice(e,1)}}ee.defaultPrecacheCacheabilityPlugin={cacheWillUpdate:async({response:e})=>!e||e.status>=400?null:e},ee.copyRedirectedCacheableResponsesPlugin={cacheWillUpdate:async({response:t})=>t.redirected?await async function(t,s){let n=null;if(t.url&&(n=new URL(t.url).origin),n!==self.location.origin)throw new e("cross-origin-copy-response",{origin:n});const a=t.clone(),r={headers:new Headers(a.headers),status:a.status,statusText:a.statusText},i=s?s(r):r,c=function(){if(void 0===o){const e=new Response("");if("body"in e)try{new Response(e.body),o=!0}catch(e){o=!1}o=!1}return o}()?a.body:await a.blob();return new Response(c,i)}(t):t};class te{constructor({cacheName:e,plugins:t=[],fallbackToNetwork:s=!0}={}){this._urlsToCacheKeys=new Map,this._urlsToCacheModes=new Map,this._cacheKeysToIntegrities=new Map,this._strategy=new ee({cacheName:r(e),plugins:[...t,new Z({precacheController:this})],fallbackToNetwork:s}),this.install=this.install.bind(this),this.activate=this.activate.bind(this)}get strategy(){return this._strategy}precache(e){this.addToCacheList(e),this._installAndActiveListenersAdded||(self.addEventListener("install",this.install),self.addEventListener("activate",this.activate),this._installAndActiveListenersAdded=!0)}addToCacheList(t){const s=[];for(const n of t){"string"==typeof n?s.push(n):n&&void 0===n.revision&&s.push(n.url);const{cacheKey:t,url:a}=X(n),r="string"!=typeof n&&n.revision?"reload":"default";if(this._urlsToCacheKeys.has(a)&&this._urlsToCacheKeys.get(a)!==t)throw new e("add-to-cache-list-conflicting-entries",{firstEntry:this._urlsToCacheKeys.get(a),secondEntry:t});if("string"!=typeof n&&n.integrity){if(this._cacheKeysToIntegrities.has(t)&&this._cacheKeysToIntegrities.get(t)!==n.integrity)throw new e("add-to-cache-list-conflicting-integrities",{url:a});this._cacheKeysToIntegrities.set(t,n.integrity)}if(this._urlsToCacheKeys.set(a,t),this._urlsToCacheModes.set(a,r),s.length>0){const e=`Workbox is precaching URLs without revision info: ${s.join(", ")}\nThis is generally NOT safe. Learn more at https://bit.ly/wb-precache`;console.warn(e)}}}install(e){return u(e,(async()=>{const t=new Y;this.strategy.plugins.push(t);for(const[t,s]of this._urlsToCacheKeys){const n=this._cacheKeysToIntegrities.get(s),a=this._urlsToCacheModes.get(t),r=new Request(t,{integrity:n,cache:a,credentials:"same-origin"});await Promise.all(this.strategy.handleAll({params:{cacheKey:s},request:r,event:e}))}const{updatedURLs:s,notUpdatedURLs:n}=t;return{updatedURLs:s,notUpdatedURLs:n}}))}activate(e){return u(e,(async()=>{const e=await self.caches.open(this.strategy.cacheName),t=await e.keys(),s=new Set(this._urlsToCacheKeys.values()),n=[];for(const a of t)s.has(a.url)||(await e.delete(a),n.push(a.url));return{deletedURLs:n}}))}getURLsToCacheKeys(){return this._urlsToCacheKeys}getCachedURLs(){return[...this._urlsToCacheKeys.keys()]}getCacheKeyForURL(e){const t=new URL(e,location.href);return this._urlsToCacheKeys.get(t.href)}getIntegrityForCacheKey(e){return this._cacheKeysToIntegrities.get(e)}async matchPrecache(e){const t=e instanceof Request?e.url:e,s=this.getCacheKeyForURL(t);if(s)return(await self.caches.open(this.strategy.cacheName)).match(s)}createHandlerBoundToURL(t){const s=this.getCacheKeyForURL(t);if(!s)throw new e("non-precached-url",{url:t});return e=>(e.request=new Request(t),e.params=Object.assign({cacheKey:s},e.params),this.strategy.handle(e))}}let se;const ne=()=>(se||(se=new te),se);class ae extends O{constructor(e,t){super((({request:s})=>{const n=e.getURLsToCacheKeys();for(const a of function*(e,{ignoreURLParametersMatching:t=[/^utm_/,/^fbclid$/],directoryIndex:s="index.html",cleanURLs:n=!0,urlManipulation:a}={}){const r=new URL(e,location.href);r.hash="",yield r.href;const i=function(e,t=[]){for(const s of[...e.searchParams.keys()])t.some((e=>e.test(s)))&&e.searchParams.delete(s);return e}(r,t);if(yield i.href,s&&i.pathname.endsWith("/")){const e=new URL(i.href);e.pathname+=s,yield e.href}if(n){const e=new URL(i.href);e.pathname+=".html",yield e.href}if(a){const e=a({url:r});for(const t of e)yield t.href}}(s.url,t)){const t=n.get(a);if(t)return{cacheKey:t,integrity:e.getIntegrityForCacheKey(t)}}}),e.strategy)}}var re;self.skipWaiting(),self.addEventListener("activate",(()=>self.clients.claim())),re=[{'revision':null,'url':'/20230214-main-5dbe0296fbd5197b35bc.js'},{'revision':'add648dcf37b0d3f5e04345cdc1ca376','url':'/fonts/ProximaSoft/3955CC_0_0.woff2'},{'revision':'f66c57cf4d06520f9da99fa96d8f60f0','url':'/fonts/ProximaSoft/3955CC_1_0.woff2'},{'revision':'9ac260a7780c56f86a2ad084a1765ef9','url':'/fonts/ProximaSoft/3955CC_2_0.woff2'},{'revision':'37c5627028abd7d049f6f5b6aa65d23e','url':'/fonts/ProximaSoft/3955CC_3_0.woff2'},{'revision':'81099a55deb671f19fb3d378e6009e1a','url':'/fonts/ProximaSoft/3955CC_4_0.woff2'},{'revision':'eb7dc243d9bd0cfd32b3d9424646b34a','url':'/fonts/ProximaSoft/3955CC_5_0.woff2'},{'revision':'ebbe879e0c6c782c668e00687a764279','url':'/fonts/SignPainterHouseScriptRg/font.woff2'},{'revision':'0c52041a50ca634f29966f1f698948cc','url':'/index.html'},{'revision':'18a63fcd8153c36a059cf12499053b2a','url':'/site.webmanifest'},{'revision':'a97f5f1605d31e8be772cafaae12d324','url':'/webfonts/fa-brands-400.woff2'},{'revision':'19df7b71c08c158645e908e031b67a59','url':'/webfonts/fa-duotone-900.woff2'},{'revision':'892267898848cec59a6de9732f272dc4','url':'/webfonts/fa-light-300.woff2'},{'revision':'a4e56814c8f188544184d01fdb08efd4','url':'/webfonts/fa-regular-400.woff2'},{'revision':'c85e3f8b36f91b247af9b9580c6142e5','url':'/webfonts/fa-sharp-solid-900.woff2'},{'revision':'9966f4967759f0a0e24b33218c42a89b','url':'/webfonts/fa-solid-900.woff2'},{'revision':'cbf2c277c8533f0d6b3350e0fd666fdb','url':'/webfonts/fa-thin-100.woff2'},{'revision':'99d005ad96a9d4f6e015ffac9350ce7a','url':'/webfonts/fa-v4compatibility.woff2'}],ne().precache(re),function(e){const t=ne();W(new ae(t,undefined))}(),W(new O((e=>{let{request:t}=e;return"navigate"===t.mode}),new G({plugins:[new class{constructor({fallbackURL:e,precacheController:t}){this.handlerDidError=()=>this._precacheController.matchPrecache(this._fallbackURL),this._fallbackURL=e,this._precacheController=t||ne()}}({fallbackURL:"/index.html"})]}))),W(new O((e=>{let{request:t}=e;return["image"].includes(t.destination)}),new Q({cacheName:"cache-static-assets"}))),async function(){const e=(await self.caches.keys()).filter((e=>e.startsWith("hashed-")&&!e.startsWith("hashed-1676404312234")));await Promise.all(e.map((e=>self.caches.delete(e))))}(),W(new O((e=>{let{request:t}=e;return["script","style"].includes(t.destination)}),new Q({cacheName:("static-hashed-assets","hashed-1676404312234-static-hashed-assets")}))),W((e=>{let{url:t}=e;return t.pathname.includes("appconfig.json")}),new z({cacheName:"cache-appconfig"})),W((e=>{let{url:t}=e;return t.pathname.startsWith("/api/")}),new z({cacheName:"cache-api",plugins:[new class{constructor(e){this.cacheWillUpdate=async({response:e})=>this._cacheableResponse.isResponseCacheable(e)?e:null,this._cacheableResponse=new J(e)}}({statuses:[0,200,404]})]}));const ie=new class{constructor(e,t){this.fetchDidFail=async({request:e})=>{await this._queue.pushRequest({request:e})},this._queue=new K(e,t)}}("form-responses",{maxRetentionTime:1440});W(/\/api\/form-responses/,new G({plugins:[ie]}),"POST")})()})();