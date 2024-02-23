import{_ as O,a as A,l as W,w as D,b as _,d as V,c as H,e as L,f as P}from"./lodash-88cb051a.js";import{d as B,r as i,i as x,o as C,a as M,b as s,c as g,e as m,w as f,u,f as q,t as z,g as v,h as T,j as h,F as E,k as j,_ as Z}from"./index-cc74e8b1.js";const K={class:"text-blue-600 font-semibold"},R=B({__name:"TestPopup",props:{land:{type:Object,required:!0}},setup(d){const y=d,a=i(!1),o=x("layer");return C(()=>{o.on("click",()=>console.log("test",y.land.id)),o.on("mouseover",()=>a.value=!0),o.on("mouseout",()=>a.value=!1)}),M(()=>{o.off("mouseover"),o.off("mouseout")}),(p,c)=>(s(),g("div",null,[a.value?(s(),m(u(A),{key:0,position:d.land.center},{default:f(()=>[a.value?(s(),m(u(O),{key:0},{default:f(()=>[q("div",K,z(d.land.id),1)]),_:1})):v("",!0)]),_:1},8,["position"])):v("",!0)]))}}),X=B({__name:"IslandClickHandler",props:{island:{type:Object,required:!0}},setup(d){const y=d,a=x("map"),o=x("layer");return C(()=>{o.on("click",()=>a.value.fitBounds(y.island.polygon))}),M(()=>{o.off("click")}),(p,c)=>null}}),Y={class:"about"},ee={key:0},te=["onClick"],oe={key:1},ne=B({__name:"AboutView",setup(d){const y=i([-17.7351,168.32461]),a=i(12),o=i([]),p=i(null),c=i([]),F=i([]),k=i({}),b=i(!1),$=t=>{console.log("sl",t),p.value=t},G=()=>{console.log("usl"),p.value=null},w=T(()=>p.value?o.value.find(t=>t.id===p.value):null),J=async t=>{const l=_.polygon([t.getSouthWest(),t.getNorthWest(),t.getNorthEast(),t.getSouthEast()]).toGeoJSON(),e=await V.items("Land").readByQuery({limit:150,fields:["id","name","center","geometry","listings","listings.id","listings.amount"],filter:{center:{_intersects:l}}});o.value=e.data.map(n=>{let r=n.listings.length>0,U=n.geometry.coordinates[0].map(S=>new _.LatLng(S[1],S[0]));return{id:n.id,name:n.name,has_listings:r,starting_price:r?n.listings[0].amount:null,polygon:U,center:new _.LatLng(n.center.coordinates[1],n.center.coordinates[0])}})},N=async()=>{var l;const t=await V.items("Island").readByQuery({fields:["id","name","geometry","group.id","group.name"],limit:-1});c.value=(l=t.data)==null?void 0:l.map(e=>{const n=e.geometry.coordinates[0].map(r=>new _.LatLng(r[1],r[0]));return{...e,polygon:n}}),c.value.forEach(e=>{if(!e.group)return;let r=new _.GeoJSON(e.geometry).getBounds();k.value[e.group.id]||(k.value[e.group.id]=new _.LatLngBounds),k.value[e.group.id].extend(r)}),F.value=[...new Set(c.value.map(e=>e.group))]},Q=W.debounce(async t=>{console.log("update map");const l=t.getBounds();await J(l),c.value.length===0&&await N()},250),I=({zoom:t=void 0,map:l})=>{t&&(console.log("z",t),a.value=t),Q(l)};return C(async()=>{await N(),D(a,t=>b.value=t<10,{immediate:!0})}),(t,l)=>(s(),g("div",Y,[h(u(P),{center:y.value,zoom:15,class:"h-full w-full",onZoomend:I,onMove:I},{default:f(()=>[h(u(H)),b.value?v("",!0):(s(),g("div",ee,[w.value?(s(),m(u(L),{key:0,positions:w.value.polygon,color:"red",weight:5,"fill-color":"red",onClick:G},null,8,["positions"])):v("",!0),(s(!0),g(E,null,j(o.value,e=>(s(),m(u(L),{key:e.id,positions:e.polygon,color:"green",weight:2,"fill-color":"blue"},{default:f(()=>[h(u(O),{onClick:n=>$(e.id)},{default:f(()=>[q("div",{class:"text-blue-600 font-semibold",onClick:n=>$(e.id)},z(e.id),9,te)]),_:2},1032,["onClick"]),h(R,{land:e},null,8,["land"])]),_:2},1032,["positions"]))),128)),w.value?(s(),m(u(A),{key:1,position:w.value.center},null,8,["position"])):v("",!0)])),b.value?(s(),g("div",oe,[(s(!0),g(E,null,j(c.value,e=>(s(),m(u(L),{key:e.id,positions:e.polygon,color:"blue",weight:3,"fill-color":"light-blue"},{default:f(()=>[h(X,{island:e},null,8,["island"])]),_:2},1032,["positions"]))),128))])):v("",!0)]),_:1},8,["center"])]))}});const le=Z(ne,[["__scopeId","data-v-1e068ac0"]]);export{le as default};