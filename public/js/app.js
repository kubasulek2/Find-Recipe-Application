$(()=>{(()=>{const e=$(".door"),o=$(".handle");e.on("click",async function(){o.addClass("open");let s=new Promise(e=>setTimeout(()=>e(o.removeClass("open")),300)),n=new Promise(e=>setTimeout(()=>e(),600));await s,await n,e.toggleClass("open")})})()});
//# sourceMappingURL=app.js.map
