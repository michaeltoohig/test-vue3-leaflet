if(!self.define){let e,s={};const i=(i,n)=>(i=new URL(i+".js",n).href,s[i]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=i,e.onload=s,document.head.appendChild(e)}else e=i,importScripts(i),s()})).then((()=>{let e=s[i];if(!e)throw new Error(`Module ${i} didn’t register its module`);return e})));self.define=(n,r)=>{const o=e||("document"in self?document.currentScript.src:"")||location.href;if(s[o])return;let c={};const l=e=>i(e,o),t={module:{uri:o},exports:c,require:l};s[o]=Promise.all(n.map((e=>t[e]||l(e)))).then((e=>(r(...e),c)))}}define(["./workbox-3625d7b0"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"assets/AboutView-0dd707c5.css",revision:null},{url:"assets/AboutView-9d94fd8b.js",revision:null},{url:"assets/index-e1ef7ed8.js",revision:null},{url:"assets/index-ebfc3e79.css",revision:null},{url:"assets/ThemeView-803fa7fb.js",revision:null},{url:"index.html",revision:"0badc1d232f3fea233ce0271785a7c6f"},{url:"registerSW.js",revision:"402b66900e731ca748771b6fc5e7a068"},{url:"favicon.ico",revision:"1ba2ae710d927f13d483fd5d1e548c9b"},{url:"apple-touch-icon.png",revision:"709480e7f22b83fb2f90056148382e5c"},{url:"favicon-dark.svg",revision:"7c40ba0cb1414d1c20f5e60e33e09a5f"},{url:"pwa-192x192.png",revision:"0c2051c88e507a51a71b23e0f181ed50"},{url:"pwa-512x512.png",revision:"0c2051c88e507a51a71b23e0f181ed50"},{url:"manifest.webmanifest",revision:"55889a4a71c66a81ff13be74f9c50288"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("/")))}));
