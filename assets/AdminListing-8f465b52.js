import{A as T,d as S,r as _,o as b,B as $,i as k,a as z,b as m,c as p,j as d,w as y,u as c,k as O,e as q,F as E,C as W,D as j,E as M,t as A,f as w}from"./index-cc74e8b1.js";import{b as L,d as C,g as F,_ as P,e as N,l as R,c as x,a as V,f as B}from"./lodash-88cb051a.js";const I=T("landStore",{state:()=>({loading:!1,selected:null,filter:"none",lands:[],history:[]}),actions:{async fetchWithinBounds(o,s=100){const i=L.polygon([o.getSouthWest(),o.getNorthWest(),o.getNorthEast(),o.getSouthEast()]).toGeoJSON(),t=await C.items("Land").readByQuery({limit:s,fields:["id","name","center","geometry","listings","listings.id","listings.amount"],filter:{center:{_intersects:i}}});this.lands=t.data.map(e=>{let a=e.listings.length>0,r=e.geometry.coordinates[0].map(l=>new L.LatLng(l[1],l[0]));return{id:e.id,name:e.name,has_listings:a,starting_price:a?e.listings[0].amount:null,polygon:r,center:new L.LatLng(e.center.coordinates[1],e.center.coordinates[0])}})},async fetchOne(o){let i=await C.items("Land").readOne(o,{fields:["id","name","center","listings.id","listings.url","listings.title","listings.amount","listings.cover","listings.source.id","listings.source.name","listings.source.logo"]});return i.listings.forEach(t=>t.coverImgSrc=F(t.cover)),i},async select(o){try{this.loading=!0;const s=await this.fetchOne(o);s.center=new L.LatLng(s.center.coordinates[1],s.center.coordinates[0]),console.log(`[Land] selected land ${s.id}`,s),this.selected=s}finally{this.loading=!1}},unselect(){this.selected&&(console.log("[Land] removing selected",this.selected.id),this.selected=null)}}}),D=S({__name:"PopupSelectLand",props:{land:{type:Object,required:!0},selectedIds:{type:Array,required:!0}},emits:["select"],setup(o,{emit:s}){I();const i=s,t=o,e=_(!1);b(()=>{$(t.selectedIds,n=>e.value=n.includes(t.land.id),{immediate:!0})}),k("map");const a=k("layer");b(()=>{a.on("click",r)}),z(()=>{a.off("click",r)});const r=()=>{i("select",t.land.id),setTimeout(()=>{a.color=e.value?"red":"blue"},250)},l=async()=>{console.log("sel",t.land.id),i("select",t.land.id)};return(n,f)=>(m(),p("div",null,[d(c(P),null,{default:y(()=>[e.value?(m(),p("button",{key:1,class:"btn btn-sm btn-default text-blue-600 font-semibold",onClick:l},"Remove")):(m(),p("button",{key:0,class:"btn btn-sm btn-primary text-blue-600 font-semibold",onClick:l},"Add"))]),_:1})]))}}),U=S({__name:"PolygonLandClick",props:{land:{type:Object,required:!0},selectedIds:{type:Array,required:!0}},emits:["select"],setup(o,{emit:s}){const i=s,t=o,e=_(!1);b(()=>{$(t.selectedIds,n=>e.value=n.includes(t.land.id),{immediate:!0})});const a=k("layer");b(()=>{a.on("click",l)}),z(()=>{a.off("click",l)});const r=n=>{const f=n?"red":"blue";a.setStyle({color:f})};$(e,n=>{r(n)});const l=()=>{i("select",t.land.id)};return(n,f)=>null}}),G=S({__name:"PolygonLand",props:{lands:{type:Array,required:!0},selectedIds:{type:Array,required:!0}},emits:["select"],setup(o,{emit:s}){const i=I(),t=s,e=k("map"),a=async n=>{console.log("sel",n),t("select",n),await i.fetchWithinBounds(e.value.getBounds())},r=o,l=n=>r.selectedIds.includes(n)?"red":"blue";return(n,f)=>(m(!0),p(E,null,O(o.lands,h=>(m(),q(c(N),{key:h.id,positions:h.polygon,color:l(h.id),"fill-color":"light-blue",weight:2},{default:y(()=>[d(U,{land:h,"selected-ids":o.selectedIds,onSelect:a},null,8,["land","selected-ids"])]),_:2},1032,["positions","color"]))),128))}}),J={class:"admin-listing"},Q={key:0},H={key:1},K=w("br",null,null,-1),X=w("br",null,null,-1),Y={class:"h-200 grid gap-4 max-w-2xl"},Z=w("h1",null,"Listing Location",-1),ee=w("h1",null,"Land Titles",-1),ne=S({__name:"AdminListing",setup(o){const s=I(),{lands:i}=W(s),t=_(18),e=_([-17.7351,168.32461]),a=_(!0),r=_(),l=_([]),n=g=>{l.value.includes(g)||l.value.push(g)},f=R.debounce(async({center:g,map:u})=>{e.value=g,await s.fetchWithinBounds(u.getBounds())},500),h=async g=>{console.log("Fetching listing",g);try{const u=await C.items("Listing").readOne(g,{fields:["*","source.id","source.name","source.logo"]}),v=new L.LatLng(u.coordinates.coordinates[1],u.coordinates.coordinates[0]);return{...u,coordinates:v}}catch(u){console.error("api error",u)}};return b(async()=>{const u=j().params.id;r.value=await h(u),a.value=!1,setTimeout(()=>{e.value=r.value.coordinates},1e3)}),(g,u)=>(m(),p("div",J,[a.value?(m(),p("div",Q,"Loading")):(m(),p("div",H,[M(A(r.value)+" ",1),K,X,M(" "+A(l.value)+" ",1),w("div",Y,[Z,d(c(B),{center:e.value,zoom:t.value,class:"h-full w-full",onMove:c(f)},{default:y(()=>[d(c(x)),d(c(V),{position:r.value.coordinates},null,8,["position"])]),_:1},8,["center","zoom","onMove"]),ee,d(c(B),{center:e.value,zoom:t.value,class:"h-full w-full",onMove:c(f)},{default:y(()=>[d(c(x)),d(G,{lands:c(i),"selected-ids":l.value,onSelect:n},null,8,["lands","selected-ids"])]),_:1},8,["center","zoom","onMove"]),d(c(B),{center:e.value,zoom:t.value,class:"h-full w-full",onMove:c(f)},{default:y(()=>[d(c(x)),(m(!0),p(E,null,O(c(i),v=>(m(),q(c(N),{key:v.id,positions:v.polygon,color:"blue","fill-color":"light-blue",weight:2},{default:y(()=>[d(D,{land:v,"selected-ids":l.value,onSelect:n},null,8,["land","selected-ids"])]),_:2},1032,["positions"]))),128))]),_:1},8,["center","zoom","onMove"])])]))]))}});export{ne as default};
