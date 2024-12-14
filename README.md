# studocu
Bypass premium for studocu (Only for showing hidden pages)

## Bookmark
```js
javascript:(function(){document.querySelectorAll(".page-content").forEach(e=>{"blur(2px)"===window.getComputedStyle(e).filter&&new Promise((t,r)=>{const n=Date.now(),o=setInterval(()=>{const s=e.innerHTML.match(/<img[^>]*src="([^"]*)"/);s?(clearInterval(o),t(s[1])):Date.now()-n>5e3&&(clearInterval(o),r(new Error("Timeout: No blurred image found within 5 seconds.")))},100)}).then(t=>{const r=t.match(/https:\/\/.*?\/(.*)\/html\/pages\/blurred\/page(\d+)\.webp/);if(!r)return console.error("Failed to parse unique ID and page number.");const[n,o,s]=r,c=parseInt(s,10),a=c>9?String.fromCharCode(c-9+96):c;fetch(`https://doc-assets-us-west-1.studocu.com/${o}/html/${o}${c}.page`).then(e=>e.text()).then(t=>{const r=document.createElement("div");r.innerHTML=t,r.querySelector("img").src=`https://doc-assets-us-west-1.studocu.com/${o}/html/bg${a}.png`;const n=e.parentElement;n.innerHTML=r.innerHTML;const s=n.firstElementChild;s&&(s.style.display="block");const c=document.querySelector('div[style="margin-top: -532px;"]');c&&c.remove()}).catch(e=>console.error("Error fetching unblurred page:",e))}).catch(e=>console.error(e.message))});})();
```
