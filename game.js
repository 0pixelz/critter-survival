"use strict";
/* ========= Critter Wilds v2 — the classic look on Phaser WebGL =========
   All art is the game's own hand-drawn Brawl-Stars style, baked to GPU textures. */
const TILE=56, IW=72, IH=36, MW=96, MH=64, PR=18;
const TYPES={
  Leaf:{color:'#4caf50'},Ember:{color:'#e8613c'},Aqua:{color:'#2f8fe0'},
  Spark:{color:'#f2c336'},Stone:{color:'#b08d57'},Gale:{color:'#9b8cf0'}};
const SPECIES={
  Sproutle:{type:'Leaf',color:'#5bbf4c',accent:'#2e7d32',shape:'round'},
  Cindnip:{type:'Ember',color:'#ef6a45',accent:'#b23a1c',shape:'fox'},
  Puddlet:{type:'Aqua',color:'#3f9be6',accent:'#1c5fa0',shape:'round'},
  Sparkit:{type:'Spark',color:'#f4cf4a',accent:'#c79a11',shape:'fox'},
  Pebblo:{type:'Stone',color:'#b8935e',accent:'#7a5a30',shape:'blob'},
  Zephlet:{type:'Gale',color:'#a99cf2',accent:'#6b5cc0',shape:'bird'},
  Mosslet:{type:'Leaf',color:'#7cc26a',accent:'#3e7d34',shape:'blob'},
  Emburr:{type:'Ember',color:'#e2542e',accent:'#9c2f13',shape:'blob'},
  Thornip:{type:'Leaf',color:'#66bb3a',accent:'#33691e',shape:'fox'},
  Blazehog:{type:'Ember',color:'#e64a19',accent:'#8d2408',shape:'blob'},
  Finewt:{type:'Aqua',color:'#29b6f6',accent:'#0277bd',shape:'fox'},
  Voltail:{type:'Spark',color:'#ffd54f',accent:'#f9a825',shape:'bird'},
  Ionfox:{type:'Spark',color:'#fff176',accent:'#fbc02d',shape:'fox'},
  Craggle:{type:'Stone',color:'#a1887f',accent:'#5d4037',shape:'blob'},
  Breezle:{type:'Gale',color:'#b39ddb',accent:'#5e35b1',shape:'round'},
  Coralux:{type:'Aqua',color:'#4dd0e1',accent:'#00838f',shape:'round'},
};
const WILD=Object.keys(SPECIES);
const CLASSES={
  mage:{robe:'#3f6fd6',trim:'#2456bf',skin:'#ffce9e',el:'Ember'},
  ranger:{robe:'#3f8f4a',trim:'#2e6d34',skin:'#f0b98a',el:'Gale'},
  warrior:{robe:'#b0402e',trim:'#7c2a1c',skin:'#e8a87a',el:'Stone'}};
const TOWNS=[{name:'Oakvale',cx:14,cy:12,s:6},{name:'Emberport',cx:78,cy:16,s:6},{name:'Mossholm',cx:46,cy:52,s:6}];
const CASTLES=[];
const ELEMS={
  fire:{nm:'Fire',ic:'🔥',col:'#ff8844',hex:0xff8844},
  frost:{nm:'Frost',ic:'❄️',col:'#7ad0ff',hex:0x7ad0ff},
  storm:{nm:'Storm',ic:'⚡',col:'#ffd23c',hex:0xffd23c},
  arcane:{nm:'Arcane',ic:'🔮',col:'#c07aff',hex:0xc07aff}};
const SUBCLASSES={
  mage:{
    fire:{nm:'Pyromancer',ic:'🔥',col:'#ff8844',hex:0xff8844,desc:'Bolts IGNITE foes — and burning enemies EXPLODE on death, spreading flame to everything nearby'},
    storm:{nm:'Stormweaver',ic:'⚡',col:'#ffd23c',hex:0xffd23c,desc:'−10% cooldown · your bolts arc CHAIN LIGHTNING that can jump to a second and even a third foe'},
    chrono:{nm:'Chronomancer',ic:'⏳',col:'#7ad0ff',hex:0x7ad0ff,desc:'Hits slow time around foes · ALL cooldowns recover 18% faster · every 20s an incoming hit is REWOUND to nothing'},
    necro:{nm:'Necromancer',ic:'💀',col:'#c07aff',hex:0xc07aff,desc:'Drain life — heal 4% of damage dealt · slain foes may RISE as spirit minions that fight for you for 12s'}},
  warrior:{
    berserker:{nm:'Berserker',ic:'🩸',col:'#e8483a',hex:0xe8483a,desc:'Deal up to +50% damage as your HP drops · heal 8% of damage dealt · dealing & taking damage fills your RAGE — at full, erupt into a 6s FRENZY (+40% damage, +30% speed)'},
    juggernaut:{nm:'Juggernaut',ic:'🛡️',col:'#8a929c',hex:0x8a929c,desc:'+20% DEF · 25% chance to BLOCK any hit · raiders near you drop what they\'re smashing and attack YOU instead — the wall your base deserves'},
    blademaster:{nm:'Blademaster',ic:'🗡️',col:'#ffd23c',hex:0xffd23c,desc:'−20% attack cooldown · chained hits build a COMBO (+5% damage each, up to 5) · dash resets your swing and grants a 0.45s PARRY that reflects damage'},
    warlord:{nm:'Warlord',ic:'📯',col:'#ffb454',hex:0xffb454,desc:'+20% Super charge · towers near you fire 35% faster · your War Cry lasts twice as long and heals more — lead the defense of your city'}},
  ranger:{
    beastmaster:{nm:'Beastmaster',ic:'🐺',col:'#c9803a',hex:0xc9803a,desc:'A spirit wolf hunts at your side — its bites MARK prey for 4s, and you deal +15% damage to marked targets'},
    trapper:{nm:'Trapper',ic:'🪤',col:'#b8935e',hex:0xb8935e,desc:'Spike & snare traps cost half, last twice as many uses, and coat victims in POISON that ticks for seconds — total zone control'},
    sharpshooter:{nm:'Sharpshooter',ic:'🎯',col:'#ffd23c',hex:0xffd23c,desc:'+12% damage · +10% crit · aimed (hold & drag) shots hit 40% harder · arrows that fly far strike for 150% — but −10% max HP'},
    warden:{nm:'Warden',ic:'🌿',col:'#5da53f',hex:0x5da53f,desc:'Nature\'s guardian: regenerate 2 HP/s · +15% DEF · arrows may entangle foes in roots · your Thorn Wall lasts 50% longer and ROOTS instead of slowing'}}};
function subDef(c2,el){const t=SUBCLASSES[c2]||SUBCLASSES.mage;return t[el]||t[Object.keys(t)[0]];}
function subVis(){const d=G?subDef(G.class,G.element):null;return d||{col:'#ff8844',hex:0xff8844};}
function isWSub(k){return G&&G.class==='warrior'&&G.element===k;}
function isRSub(k){return G&&G.class==='ranger'&&G.element===k;}
function isMSub(k){return G&&G.class==='mage'&&G.element===k;}
const PETS={
  wolf:{tex:'wolfTex',ic:'🐺',nm:'Wolf',dmg:0.45,rate:1.1,spd:190,desc:'Balanced hunter — solid bites, marks prey'},
  hawk:{tex:'hawkTex',ic:'🦅',nm:'Hawk',dmg:0.30,rate:0.75,spd:255,desc:'Lightning-fast strikes — lower damage, relentless marking',lock:()=>((G.skills||{}).feralfang||0)>=2,lockTxt:'Feral Fangs rank 2'},
  boar:{tex:'boarTex',ic:'🐗',nm:'Boar',dmg:0.70,rate:1.7,spd:165,stun:0.5,desc:'Crushing charges — heavy damage and a stunning knockdown',lock:()=>((G.skills||{}).alphabond||0)>=1,lockTxt:'Alpha Bond rank 1'}};
function petDef(){return PETS[(G&&G.pet)||'wolf']||PETS.wolf;}
function petDmg(){return Math.max(2,Math.round((G._atk||6)*petDef().dmg*(1+0.2*((G.skills||{}).feralfang||0))));}
function petRate(){return petDef().rate*Math.max(0.55,1-0.12*((G.skills||{}).alphabond||0));}
function petMark(){return 4+((G.skills||{}).alphabond||0);}
function wallDef(){
  if(!G)return {nm:'Fire Wall',ic:'🔥',hex:0xff9a3c};
  const T={
    mage:{fire:['Fire Wall','🔥',0xff9a3c],storm:['Storm Wall','⚡',0xffd23c],chrono:['Frost Wall','❄️',0x7ad0ff],necro:['Soul Wall','💀',0xc07aff]},
    warrior:{berserker:['Blood Spikes','🩸',0xe8483a],juggernaut:['Bulwark','🛡️',0x9aa8b8],blademaster:['Blade Fence','🗡️',0xffd23c],warlord:['War Banners','📯',0xffb454]},
    ranger:{beastmaster:['Wild Thicket','🐾',0xc9803a],trapper:['Barbed Hedge','🪤',0xb8935e],sharpshooter:['Spike Palisade','🎯',0xffd23c],warden:['Entangling Wall','🌿',0x5da53f]}};
  const e=(T[G.class]||T.mage)[G.element];
  return e?{nm:e[0],ic:e[1],hex:e[2]}:{nm:'Fire Wall',ic:'🔥',hex:0xff9a3c};}
const BOSS_LAIR={x:88,y:56};
const CHUNK=6;
function revealAt(wx,wy){if(!G)return;if(!G.seen)G.seen={};
  const cx2=Math.floor(wx/TILE/CHUNK),cy2=Math.floor(wy/TILE/CHUNK);
  for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++)G.seen[(cx2+dx)+'_'+(cy2+dy)]=1;}
function chunkSeen(tx2,ty2){return !!(G&&G.seen&&G.seen[Math.floor(tx2/CHUNK)+'_'+Math.floor(ty2/CHUNK)]);}
const BOSS_NAME='Direfang the Ravager';
function hash(a,b){const n=Math.sin(a*127.1+b*311.7)*43758.5453;return n-Math.floor(n);}
function shadeCol(hex,amt){let h=hex.replace('#','');if(h.length===3)h=h.split('').map(x=>x+x).join('');
  let r=parseInt(h.slice(0,2),16),g=parseInt(h.slice(2,4),16),b=parseInt(h.slice(4,6),16);
  const f=amt<0?0:255,t=Math.abs(amt);r=Math.round(r+(f-r)*t);g=Math.round(g+(f-g)*t);b=Math.round(b+(f-b)*t);return`rgb(${r},${g},${b})`;}
/* ---- world gen (v1's generator) ---- */
let grid=[];
const SOLID=new Set(['T','W','H','N','M','S','B','R','V','C','U','r','b','K','w','Y','X','Q']);
const PROP=new Set(['T','H','N','M','S','B','R','V','Q']);
function inb(x,y){return x>1&&y>1&&x<MW-2&&y<MH-2;}
function gen(){
  grid=[];
  for(let y=0;y<MH;y++){const r=[];for(let x=0;x<MW;x++){
    let t='.';
    if(x<2||y<2||x>=MW-2||y>=MH-2)t='T';
    else if(hash(Math.floor(x/5)*2.1,Math.floor(y/5)*3.3)<0.28&&hash(x*1.7,y*1.9)<0.6)t=',';
    if(t==='.'&&hash(x*3.7,y*5.3)<0.14)t='T';
    if(t==='.'&&hash(x*9.4,y*8.8)<0.012)t='B';
    r.push(t);}grid.push(r);}
  for(const L of[{x:32,y:32,rx:7,ry:4},{x:66,y:44,rx:5,ry:4}])
    for(let y=L.y-L.ry-1;y<=L.y+L.ry+1;y++)for(let x=L.x-L.rx-1;x<=L.x+L.rx+1;x++){
      if(!inb(x,y))continue;const d=Math.hypot((x-L.x)/L.rx,(y-L.y)/L.ry);
      if(d<0.85)grid[y][x]='W';else if(d<1.15)grid[y][x]='~';}
  for(const t of TOWNS){
    for(let y=t.cy-t.s;y<=t.cy+t.s;y++)for(let x=t.cx-t.s;x<=t.cx+t.s;x++)
      if(inb(x,y)&&Math.hypot(x-t.cx,y-t.cy)<=t.s)grid[y][x]='.';
    for(let d=-t.s;d<=t.s;d++){if(inb(t.cx+d,t.cy))grid[t.cy][t.cx+d]='P';if(inb(t.cx,t.cy+d))grid[t.cy+d][t.cx]='P';}
    const put=(dx,dy,ch)=>{if(inb(t.cx+dx,t.cy+dy))grid[t.cy+dy][t.cx+dx]=ch;};
    put(-3,-3,'H');put(3,-3,'H');put(-4,3,'H');put(4,3,'H');
    put(-2,-2,'N');put(2,-2,'M');put(-2,2,'R');put(3,1,'V');put(1,-4,'S');put(-4,-1,'B');put(-3,3,'Q');
  }
  const road=(a,b)=>{let x=a.cx,y=a.cy,g2=0;while((x!==b.cx||y!==b.cy)&&g2++<600){
    if(Math.abs(b.cx-x)>Math.abs(b.cy-y))x+=Math.sign(b.cx-x);else y+=Math.sign(b.cy-y);
    for(const[ox,oy]of[[0,0],[1,0],[0,1]])if(inb(x+ox,y+oy)&&'T,.~W'.includes(grid[y+oy][x+ox]))grid[y+oy][x+ox]='P';}};
  road(TOWNS[0],TOWNS[1]);road(TOWNS[0],TOWNS[2]);road(TOWNS[1],TOWNS[2]);
  // dungeon entrances (caves in the wild, sewer grate per town)
  const placeE=(x0,y0,ch)=>{for(let r=0;r<9;r++)for(let y=y0-r;y<=y0+r;y++)for(let x=x0-r;x<=x0+r;x++){
    if(!inb(x,y))continue;if(grid[y][x]!=='.'&&grid[y][x]!=='T')continue;grid[y][x]=ch;return;}};
  for(const[ex,ey]of[[12,50],[82,46],[64,10],[30,26]])placeE(ex,ey,'C');
  TOWNS.forEach(t=>placeE(t.cx+t.s+2,t.cy+3,'U'));
  // castles: 3x2 keep + gate tile below
  CASTLES.length=0;
  for(const[cx0,cy0]of[[24,40],[68,28]]){
    let done=false;
    for(let r=0;r<10&&!done;r++)for(let y=cy0-r;y<=cy0+r&&!done;y++)for(let x=cx0-r;x<=cx0+r&&!done;x++){
      if(x<3||y<3||x+2>=MW-3||y+2>=MH-3)continue;
      let ok=true;
      for(let dy=0;dy<3;dy++)for(let dx=0;dx<3;dx++){const t=grid[y+dy][x+dx];
        if(t!=='.'&&t!==','&&t!=='T')ok=false;}
      if(!ok)continue;
      for(let dy=0;dy<2;dy++)for(let dx=0;dx<3;dx++)grid[y+dy][x+dx]='Y';
      grid[y+2][x]='.';grid[y+2][x+2]='.';
      grid[y+2][x+1]='X';
      CASTLES.push({x:x+1,y:y+2});done=true;}}
  PLOTS.length=0;plotIndex={};
  TOWNS.forEach((t,i)=>{const sz=t.s;
    [[-sz-7,-2,5,4],[sz+2,-5,6,5],[-2,sz+2,6,4]].forEach((d,j)=>{
      const px=t.cx+d[0],py=t.cy+d[1],w=d[2],h=d[3];
      if(px<2||py<2||px+w>=MW-2||py+h>=MH-2)return;
      PLOTS.push({id:'p'+i+j,town:t.name,x:px,y:py,w,h,price:Math.round(w*h*12*(1+i*0.3))});
      for(let y=py;y<py+h;y++)for(let x=px;x<px+w;x++){if(grid[y][x]!=='P')grid[y][x]='.';plotIndex[x+','+y]=PLOTS[PLOTS.length-1];}});});
}
function tileAt(x,y){if(x<0||y<0||x>=GW||y>=GH)return dungeon?'r':'T';return grid[y][x];}
let buildAt={};
function rebuildBuildIndex(){buildAt={};if(G&&G.builds)for(const b of G.builds)buildAt[b.x+','+b.y]=b;}
function solidWorld(wx,wy,forE){const tx=Math.floor(wx/TILE),ty=Math.floor(wy/TILE);
  if(SOLID.has(tileAt(tx,ty)))return true;
  const b=buildAt[tx+','+ty];if(!b)return false;
  const d=BUILD_DEF[b.t]||{};return !!(forE?(d.eSolid||d.solid):d.solid);}
function townDist(wx,wy){let d=1e9;for(const t of TOWNS)d=Math.min(d,Math.hypot(wx/TILE-t.cx,wy/TILE-t.cy));return d;}
function zoneLevel(wx,wy){if(dungeon)return dungeon.lvl;return Math.max(1,1+Math.floor((townDist(wx,wy)-8)/5)*3);}
function isoX(wx,wy){return (wx/TILE-wy/TILE)*(IW/2);}
function isoY(wx,wy){return (wx/TILE+wy/TILE)*(IH/2);}
/* ---- gesture classify (v1) ---- */
function resampleG(pts,n){const d=[0];let len=0;
  for(let i=1;i<pts.length;i++){len+=Math.hypot(pts[i].x-pts[i-1].x,pts[i].y-pts[i-1].y);d.push(len);}
  if(len===0)return pts.slice();const step=len/(n-1),out=[pts[0]];let di=1;
  for(let i=1;i<n-1;i++){const target=i*step;while(di<d.length-1&&d[di]<target)di++;
    const t=(target-d[di-1])/((d[di]-d[di-1])||1);
    out.push({x:pts[di-1].x+(pts[di].x-pts[di-1].x)*t,y:pts[di-1].y+(pts[di].y-pts[di-1].y)*t});}
  out.push(pts[pts.length-1]);return out;}
function classifyGesture(pts){if(pts.length<3)return 'bolt';
  let len=0;for(let i=1;i<pts.length;i++)len+=Math.hypot(pts[i].x-pts[i-1].x,pts[i].y-pts[i-1].y);
  if(len<26)return 'bolt';
  const rs=resampleG(pts,10),H=[];
  for(let i=1;i<rs.length;i++)H.push(Math.atan2(rs[i].y-rs[i-1].y,rs[i].x-rs[i-1].x));
  let total=0,turns=0;
  for(let i=1;i<H.length;i++){let dd=H[i]-H[i-1];while(dd>Math.PI)dd-=2*Math.PI;while(dd<-Math.PI)dd+=2*Math.PI;
    total+=Math.abs(dd);if(Math.abs(dd)>0.7)turns++;}
  let minx=1e9,miny=1e9,maxx=-1e9,maxy=-1e9;for(const p of pts){minx=Math.min(minx,p.x);miny=Math.min(miny,p.y);maxx=Math.max(maxx,p.x);maxy=Math.max(maxy,p.y);}
  const diag=Math.hypot(maxx-minx,maxy-miny)||1;
  const net=Math.hypot(pts[pts.length-1].x-pts[0].x,pts[pts.length-1].y-pts[0].y);
  if(net<diag*0.5&&total>3.8)return 'nova';
  if(turns>=3)return 'chain';if(turns>=1)return 'power';return 'bolt';}
/* =================== ART BAKERY — v1's hand-drawn style =================== */
let ctx=null;
function mkCv(w,h){const cv=document.createElement('canvas');cv.width=w;cv.height=h;ctx=cv.getContext('2d');
  ctx.lineJoin='round';ctx.lineCap='round';return cv;}
function rr(x,y,w,h,r){ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath();}
function shadow(sx,sy,rw,rh){ctx.fillStyle='rgba(0,0,0,.28)';ctx.beginPath();ctx.ellipse(sx,sy,rw,rh,0,0,7);ctx.fill();}
function diamondPath(cx,cy){ctx.beginPath();ctx.moveTo(cx,cy-IH/2);ctx.lineTo(cx+IW/2,cy);ctx.lineTo(cx,cy+IH/2);ctx.lineTo(cx-IW/2,cy);ctx.closePath();}
function bakeGround(kind,v){
  const cv=mkCv(IW+2,IH+2),cx=IW/2+1,cy=IH/2+1;
  let col;
  switch(kind){case 'P':col='#6b5636';break;case '~':col='#7d6f47';break;
    case 'W':col='#153f5c';break;case ',':col='#2b5230';break;
    case 'c':col=v===1?'#3a3531':'#332f2b';break;
    case 's':col=v===1?'#39413b':'#333a35';break;
    case 'w':col='#1c4a2e';break;
    default:col=v===1?'#3d6b39':'#365f33';}
  diamondPath(cx,cy);ctx.fillStyle=col;ctx.fill();
  ctx.strokeStyle='rgba(255,255,255,0.045)';ctx.lineWidth=1;
  ctx.beginPath();ctx.moveTo(cx-IW/2,cy);ctx.lineTo(cx,cy-IH/2);ctx.lineTo(cx+IW/2,cy);ctx.stroke();
  ctx.strokeStyle='rgba(0,0,0,0.22)';
  ctx.beginPath();ctx.moveTo(cx-IW/2,cy);ctx.lineTo(cx,cy+IH/2);ctx.lineTo(cx+IW/2,cy);ctx.stroke();
  if(kind===','){ctx.fillStyle='#3f7a3a';for(let i=-1;i<2;i++)ctx.fillRect(cx+i*9,cy-7,2,8);}
  else if(kind==='W'){ctx.fillStyle='rgba(120,200,240,0.18)';ctx.fillRect(cx-12,cy,22,2);
    ctx.fillStyle='rgba(205,230,255,0.22)';ctx.fillRect(cx-4,cy-4,10,2);}
  else if(kind==='P'||kind==='~'){ctx.fillStyle='rgba(0,0,0,0.14)';ctx.fillRect(cx-7,cy-2,3,3);ctx.fillRect(cx+6,cy+3,3,3);}
  else if(v===2){ctx.fillStyle='rgba(28,64,28,0.5)';ctx.fillRect(cx-3,cy-5,2,6);ctx.fillRect(cx+2,cy-4,2,6);}
  return cv;}
function bakeTree(variant){
  const cv=mkCv(96,110),cx2=48,base=96;
  shadow(cx2,base,22,9);
  const autumn=variant===1,pink=variant===2;
  const c1=pink?'#c76a8a':autumn?'#7c3f18':'#28541f',
        c2=pink?'#e08aa8':autumn?'#a85f1e':'#356b2a',
        c3=pink?'#f2aec4':autumn?'#d18a2c':'#4c8f3a',line='#12160f';
  ctx.fillStyle='#4e351d';ctx.strokeStyle=line;ctx.lineWidth=4;rr(cx2-6,base-30,12,32,4);ctx.fill();ctx.stroke();
  ctx.fillStyle=c1;ctx.beginPath();ctx.arc(cx2,base-46,26,0,7);ctx.fill();ctx.stroke();
  ctx.fillStyle=c2;ctx.beginPath();ctx.arc(cx2-10,base-52,15,0,7);ctx.fill();
  ctx.beginPath();ctx.arc(cx2+11,base-49,13,0,7);ctx.fill();
  ctx.fillStyle=c3;ctx.beginPath();ctx.arc(cx2-4,base-59,10,0,7);ctx.fill();
  ctx.fillStyle='rgba(0,0,0,.24)';ctx.beginPath();ctx.arc(cx2+13,base-39,10,0,7);ctx.fill();
  return cv;}
function bakeHouse(opts){
  const cv=mkCv(130,130),cx=65,base=104,line='#12160f';
  const roofCols=[['#b04030','#7c2a1c'],['#3f6fa0','#2c4f78'],['#5a7d3a','#41602a']];
  const rc=(opts&&opts.roof)||roofCols[(opts&&opts.roofIdx)||0];
  const wallL=(opts&&opts.wallL)||'#bfa077', wallR=(opts&&opts.wallR)||'#e2c99e';
  const ex=27,h=26,rh=24,ov=5,b=base+6;
  const S={x:cx,y:b},E={x:cx+ex,y:b-ex*0.5},W2={x:cx-ex,y:b-ex*0.5};
  const pRt=(t,y)=>({x:S.x+(E.x-S.x)*t,y:S.y+(E.y-S.y)*t-y});
  const pLt=(t,y)=>({x:S.x+(W2.x-S.x)*t,y:S.y+(W2.y-S.y)*t-y});
  const quad=(a,b2,c2,d2)=>{ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b2.x,b2.y);ctx.lineTo(c2.x,c2.y);ctx.lineTo(d2.x,d2.y);ctx.closePath();};
  shadow(cx,b-1,ex+7,ex*0.42);
  ctx.strokeStyle=line;ctx.lineWidth=3.2;
  ctx.fillStyle=wallL;quad(S,W2,{x:W2.x,y:W2.y-h},{x:S.x,y:S.y-h});ctx.fill();ctx.stroke();
  ctx.fillStyle=wallR;quad(S,E,{x:E.x,y:E.y-h},{x:S.x,y:S.y-h});ctx.fill();ctx.stroke();
  ctx.fillStyle='rgba(96,92,82,.9)';
  quad(S,E,{x:E.x,y:E.y-5},{x:S.x,y:S.y-5});ctx.fill();
  quad(S,W2,{x:W2.x,y:W2.y-5},{x:S.x,y:S.y-5});ctx.fill();
  ctx.strokeStyle='#6b4a2a';ctx.lineWidth=2.4;
  ctx.beginPath();ctx.moveTo(S.x,S.y);ctx.lineTo(S.x,S.y-h);ctx.stroke();
  ctx.beginPath();ctx.moveTo(W2.x,W2.y);ctx.lineTo(W2.x,W2.y-h);ctx.moveTo(E.x,E.y);ctx.lineTo(E.x,E.y-h);ctx.stroke();
  {const d0=pRt(0.18,5),d1=pRt(0.5,5),t0=pRt(0.18,22),t1=pRt(0.5,22);
   ctx.fillStyle='#5a3a20';ctx.strokeStyle=line;ctx.lineWidth=2.4;quad(d0,d1,t1,t0);ctx.fill();ctx.stroke();
   ctx.fillStyle='#ffd23c';const hn=pRt(0.45,13);ctx.beginPath();ctx.arc(hn.x,hn.y,1.8,0,7);ctx.fill();}
  {const w0=pRt(0.64,12),w1=pRt(0.88,12),w2=pRt(0.88,21),w3=pRt(0.64,21);
   ctx.fillStyle='#ffd77a';quad(w0,w1,w2,w3);ctx.fill();
   ctx.strokeStyle='#6b4a2a';ctx.lineWidth=2;quad(w0,w1,w2,w3);ctx.stroke();}
  {const w0=pLt(0.3,11),w1=pLt(0.68,11),w2=pLt(0.68,22),w3=pLt(0.3,22);
   ctx.fillStyle='#ffd77a';quad(w0,w1,w2,w3);ctx.fill();
   ctx.strokeStyle='#6b4a2a';ctx.lineWidth=2;quad(w0,w1,w2,w3);ctx.stroke();}
  const A={x:cx,y:b-ex*0.5-h-rh};
  const Sr={x:S.x,y:S.y-h+ov*0.6},Er={x:E.x+ov,y:E.y-h},Wr={x:W2.x-ov,y:W2.y-h};
  ctx.strokeStyle=line;ctx.lineWidth=3.2;
  ctx.fillStyle=rc[1];ctx.beginPath();ctx.moveTo(Sr.x,Sr.y);ctx.lineTo(Wr.x,Wr.y);ctx.lineTo(A.x,A.y);ctx.closePath();ctx.fill();ctx.stroke();
  ctx.fillStyle=rc[0];ctx.beginPath();ctx.moveTo(Sr.x,Sr.y);ctx.lineTo(Er.x,Er.y);ctx.lineTo(A.x,A.y);ctx.closePath();ctx.fill();ctx.stroke();
  ctx.strokeStyle='rgba(0,0,0,.22)';ctx.lineWidth=1.6;
  for(const f of[0.3,0.55,0.78]){
    const p1={x:Sr.x+(A.x-Sr.x)*f,y:Sr.y+(A.y-Sr.y)*f},p2={x:Er.x+(A.x-Er.x)*f,y:Er.y+(A.y-Er.y)*f};
    ctx.beginPath();ctx.moveTo(p1.x,p1.y);ctx.lineTo(p2.x,p2.y);ctx.stroke();
    const p3={x:Wr.x+(A.x-Wr.x)*f,y:Wr.y+(A.y-Wr.y)*f};
    ctx.beginPath();ctx.moveTo(p1.x,p1.y);ctx.lineTo(p3.x,p3.y);ctx.stroke();}
  ctx.strokeStyle='rgba(255,255,255,.18)';ctx.lineWidth=2;
  ctx.beginPath();ctx.moveTo(Sr.x,Sr.y);ctx.lineTo(A.x,A.y);ctx.stroke();
  {const f=0.42,chx=Wr.x+(A.x-Wr.x)*f,chy=Wr.y+(A.y-Wr.y)*f;
   ctx.fillStyle='#8a8d84';ctx.strokeStyle=line;ctx.lineWidth=2.2;
   rr(chx-4,chy-15,8,13,1.5);ctx.fill();ctx.stroke();
   ctx.fillStyle='#6f7377';rr(chx-5.5,chy-18,11,4,1.5);ctx.fill();ctx.stroke();}
  if(opts&&opts.sign){const sp2=pRt(0.34,26);
    ctx.save();ctx.translate(sp2.x+2,sp2.y+11);
    if(opts.sign==='cross'){ctx.fillStyle='#fff';ctx.strokeStyle=line;ctx.lineWidth=2;
      rr(-7.5,-7.5,15,15,3);ctx.fill();ctx.stroke();
      ctx.fillStyle='#e0426f';rr(-2,-5.5,4,11,1);ctx.fill();rr(-5.5,-2,11,4,1);ctx.fill();}
    else if(opts.sign==='coin'){ctx.fillStyle='#f2e6c8';ctx.strokeStyle=line;ctx.lineWidth=2;
      rr(-8,-7,16,14,3);ctx.fill();ctx.stroke();
      ctx.fillStyle='#ffd23c';ctx.beginPath();ctx.arc(0,0,5,0,7);ctx.fill();}
    else{ctx.fillStyle='#f2e6c8';ctx.strokeStyle=line;ctx.lineWidth=2;
      rr(-6.5,-8,13,16,2);ctx.fill();ctx.stroke();
      ctx.strokeStyle='#a8895a';ctx.lineWidth=1.2;
      for(let i=0;i<3;i++){ctx.beginPath();ctx.moveTo(-4,-4+i*4);ctx.lineTo(4,-4+i*4);ctx.stroke();}}
    ctx.restore();}
  return cv;}
function critBody(sp){const s=SPECIES[sp];
  if(s.shape==='fox')return 'imp';
  if(s.shape==='bird')return 'bat';
  if(s.shape==='blob')return 'brute';
  return s.type==='Leaf'?'shroom':s.type==='Aqua'?'slime':'wisp';}
function isRangedSp(sp){const s=SPECIES[sp];
  return s.shape==='fox'&&(s.type==='Ember'||s.type==='Spark'||s.type==='Gale');}
function bakeCritter(sp){
  const size=96,cv=mkCv(size,size);const s=SPECIES[sp];
  const cx=size/2,OL='#141414',W=size*0.045;
  const dark=shadeCol(s.color,-0.32),light=shadeCol(s.color,0.30),acc=s.accent;
  const c=ctx;const body=critBody(sp);
  const glow=shadeCol(s.color,0.55);
  c.lineJoin='round';c.lineCap='round';
  const eyes=(ex,ey,ew,angry)=>{ // shared glowing angry eyes
    for(const dx of[-1,1]){
      c.fillStyle='#141414';c.strokeStyle=OL;c.lineWidth=W*0.6;
      c.beginPath();c.moveTo(cx+dx*(ex-ew*0.8),ey+ew*0.55);
      c.lineTo(cx+dx*(ex+ew*0.75),ey-ew*0.8);
      c.lineTo(cx+dx*(ex+ew*0.85),ey+ew*0.4);c.closePath();c.fill();c.stroke();
      c.fillStyle=glow;c.shadowColor=glow;c.shadowBlur=size*0.09;
      c.beginPath();c.ellipse(cx+dx*ex,ey,ew*0.42,ew*0.34,dx*-0.3,0,7);c.fill();c.shadowBlur=0;
      c.fillStyle='rgba(255,255,255,.85)';c.beginPath();c.arc(cx+dx*(ex-ew*0.15),ey-ew*0.12,ew*0.12,0,7);c.fill();
      if(angry){c.strokeStyle=OL;c.lineWidth=W;
        c.beginPath();c.moveTo(cx+dx*(ex+ew*0.9),ey-ew*1.15);c.lineTo(cx+dx*(ex-ew*0.6),ey-ew*0.35);c.stroke();}}};
  const fangMouth=(my,mw)=>{c.fillStyle='#2a1216';c.strokeStyle=OL;c.lineWidth=W*0.55;
    c.beginPath();c.moveTo(cx-mw,my);c.quadraticCurveTo(cx,my+mw*0.6,cx+mw,my);
    c.quadraticCurveTo(cx,my+mw*0.95,cx-mw,my);c.closePath();c.fill();c.stroke();
    c.fillStyle='#f2ecdc';
    for(const fx of[-0.5,0.5]){c.beginPath();c.moveTo(cx+fx*mw-mw*0.16,my+mw*0.02);c.lineTo(cx+fx*mw,my+mw*0.5);c.lineTo(cx+fx*mw+mw*0.16,my+mw*0.02);c.closePath();c.fill();}};
  const grad=(y0,y1)=>{const g=c.createLinearGradient(0,y0,0,y1);g.addColorStop(0,light);g.addColorStop(1,dark);return g;};
  c.fillStyle='rgba(0,0,0,.22)';c.beginPath();c.ellipse(cx,size*0.9,size*0.3,size*0.08,0,0,7);c.fill();
  if(body==='imp'){ // Diablo-fallen-style imp: horns, tail, staff for casters
    const cy=size*0.56,r=size*0.24;
    c.strokeStyle=OL;c.lineWidth=W; // tail
    c.beginPath();c.moveTo(cx+r*0.8,cy+r*0.8);c.quadraticCurveTo(cx+r*1.9,cy+r*1.1,cx+r*1.7,cy-r*0.2);c.stroke();
    c.fillStyle=acc;c.beginPath();c.moveTo(cx+r*1.55,cy-r*0.15);c.lineTo(cx+r*1.95,cy-r*0.5);c.lineTo(cx+r*1.95,cy+r*0.1);c.closePath();c.fill();c.stroke();
    c.strokeStyle=dark;c.lineWidth=W*2.2; // skinny legs
    for(const dx of[-1,1]){c.beginPath();c.moveTo(cx+dx*r*0.45,cy+r*0.8);c.lineTo(cx+dx*r*0.6,size*0.87);c.stroke();}
    c.strokeStyle=OL;c.lineWidth=W*0.8;c.fillStyle=dark;
    for(const dx of[-1,1]){c.beginPath();c.ellipse(cx+dx*r*0.62,size*0.88,r*0.26,r*0.14,0,0,7);c.fill();c.stroke();}
    c.fillStyle=grad(cy-r*1.1,cy+r);c.strokeStyle=OL;c.lineWidth=W*1.1; // lean body
    c.beginPath();c.moveTo(cx-r*0.85,cy+r*0.85);c.quadraticCurveTo(cx-r*1.05,cy-r*0.3,cx-r*0.55,cy-r*0.75);
    c.quadraticCurveTo(cx,cy-r*1.15,cx+r*0.55,cy-r*0.75);c.quadraticCurveTo(cx+r*1.05,cy-r*0.3,cx+r*0.85,cy+r*0.85);
    c.quadraticCurveTo(cx,cy+r*1.15,cx-r*0.85,cy+r*0.85);c.closePath();c.fill();c.stroke();
    c.fillStyle=acc;c.strokeStyle=OL;c.lineWidth=W*0.9; // big curved horns
    for(const dx of[-1,1]){c.beginPath();c.moveTo(cx+dx*r*0.35,cy-r*0.95);
      c.quadraticCurveTo(cx+dx*r*1.1,cy-r*1.5,cx+dx*r*0.9,cy-r*2.05);
      c.quadraticCurveTo(cx+dx*r*0.95,cy-r*1.35,cx+dx*r*0.15,cy-r*1.05);c.closePath();c.fill();c.stroke();}
    if(isRangedSp(sp)){ // caster staff with orb
      c.strokeStyle='#3a2a16';c.lineWidth=W*1.6;
      c.beginPath();c.moveTo(cx-r*1.35,cy+r*0.95);c.lineTo(cx-r*1.35,cy-r*1.05);c.stroke();
      c.fillStyle=glow;c.shadowColor=glow;c.shadowBlur=size*0.1;
      c.beginPath();c.arc(cx-r*1.35,cy-r*1.2,r*0.28,0,7);c.fill();c.shadowBlur=0;
      c.strokeStyle=OL;c.lineWidth=W*0.7;c.stroke();}
    eyes(r*0.42,cy-r*0.25,r*0.3,true);
    fangMouth(cy+r*0.42,r*0.4);
  }else if(body==='bat'){ // winged hoverer
    const cy=size*0.5,r=size*0.2;
    c.fillStyle=shadeCol(acc,-0.1);c.strokeStyle=OL;c.lineWidth=W; // wings
    for(const dx of[-1,1]){c.beginPath();c.moveTo(cx+dx*r*0.7,cy-r*0.2);
      c.quadraticCurveTo(cx+dx*r*2.3,cy-r*1.5,cx+dx*r*2.5,cy+r*0.15);
      c.quadraticCurveTo(cx+dx*r*2.05,cy-r*0.1,cx+dx*r*1.8,cy+r*0.45);
      c.quadraticCurveTo(cx+dx*r*1.45,cy+r*0.05,cx+dx*r*1.1,cy+r*0.6);
      c.quadraticCurveTo(cx+dx*r*0.9,cy+r*0.25,cx+dx*r*0.7,cy+r*0.35);c.closePath();c.fill();c.stroke();}
    c.fillStyle=grad(cy-r,cy+r*1.2);c.strokeStyle=OL;c.lineWidth=W*1.1; // round body
    c.beginPath();c.ellipse(cx,cy,r*1.05,r*1.15,0,0,7);c.fill();c.stroke();
    c.fillStyle=acc;c.strokeStyle=OL;c.lineWidth=W*0.8; // pointed ears
    for(const dx of[-1,1]){c.beginPath();c.moveTo(cx+dx*r*0.35,cy-r*0.9);c.lineTo(cx+dx*r*0.75,cy-r*1.7);c.lineTo(cx+dx*r*0.05,cy-r*1.05);c.closePath();c.fill();c.stroke();}
    c.fillStyle=dark;for(const dx of[-1,1]){c.beginPath();c.moveTo(cx+dx*r*0.3,cy+r*1.1);c.lineTo(cx+dx*r*0.42,cy+r*1.55);c.lineTo(cx+dx*r*0.05,cy+r*1.18);c.closePath();c.fill();c.stroke();} // dangling feet
    eyes(r*0.42,cy-r*0.1,r*0.32,true);
    fangMouth(cy+r*0.5,r*0.4);
  }else if(body==='brute'){ // wide heavy bruiser with fists
    const cy=size*0.58,r=size*0.27;
    c.fillStyle=grad(cy-r,cy+r);c.strokeStyle=OL;c.lineWidth=W*1.15; // wide slab body
    c.beginPath();c.moveTo(cx-r*1.15,cy+r*0.9);c.quadraticCurveTo(cx-r*1.35,cy-r*0.5,cx-r*0.7,cy-r*0.85);
    c.quadraticCurveTo(cx,cy-r*1.05,cx+r*0.7,cy-r*0.85);c.quadraticCurveTo(cx+r*1.35,cy-r*0.5,cx+r*1.15,cy+r*0.9);
    c.quadraticCurveTo(cx,cy+r*1.1,cx-r*1.15,cy+r*0.9);c.closePath();c.fill();c.stroke();
    c.fillStyle=dark;c.strokeStyle=OL;c.lineWidth=W*0.9; // big fists
    for(const dx of[-1,1]){c.beginPath();c.ellipse(cx+dx*r*1.25,cy+r*0.55,r*0.4,r*0.45,0,0,7);c.fill();c.stroke();
      c.strokeStyle='rgba(0,0,0,.3)';c.lineWidth=W*0.5;
      c.beginPath();c.moveTo(cx+dx*r*1.1,cy+r*0.35);c.lineTo(cx+dx*r*1.4,cy+r*0.35);c.stroke();c.strokeStyle=OL;c.lineWidth=W*0.9;}
    c.fillStyle=acc;c.strokeStyle=OL;c.lineWidth=W*0.8; // spiky back ridge
    for(const a of[-0.6,-0.2,0.2,0.6]){const bx=cx+a*r*1.5,by=cy-r*(0.85-Math.abs(a)*0.25);
      c.beginPath();c.moveTo(bx-r*0.16,by+r*0.08);c.lineTo(bx+a*r*0.12,by-r*0.42);c.lineTo(bx+r*0.16,by+r*0.08);c.closePath();c.fill();c.stroke();}
    c.fillStyle='rgba(255,255,255,.18)';c.beginPath();c.ellipse(cx-r*0.4,cy-r*0.3,r*0.35,r*0.5,0.3,0,7);c.fill();
    eyes(r*0.4,cy-r*0.3,r*0.26,true);
    fangMouth(cy+r*0.3,r*0.48);
  }else if(body==='slime'){ // dripping gel dome
    const cy=size*0.62,r=size*0.27;
    c.fillStyle=grad(cy-r*1.2,cy+r*0.8);c.strokeStyle=OL;c.lineWidth=W*1.1;
    c.beginPath();c.moveTo(cx-r*1.1,cy+r*0.7);
    c.quadraticCurveTo(cx-r*1.25,cy-r*0.6,cx,cy-r*1.2);
    c.quadraticCurveTo(cx+r*1.25,cy-r*0.6,cx+r*1.1,cy+r*0.7);
    for(const[dx,dp]of[[0.75,0.3],[0.4,0.55],[0,0.35],[-0.45,0.6],[-0.8,0.3]]){
      c.quadraticCurveTo(cx+dx*r+r*0.14,cy+r*(0.7+dp),cx+dx*r,cy+r*(0.7+dp));
      c.quadraticCurveTo(cx+dx*r-r*0.14,cy+r*(0.7+dp),cx+dx*r-r*0.24,cy+r*0.7);}
    c.closePath();c.fill();c.stroke();
    c.fillStyle='rgba(255,255,255,.35)';c.beginPath();c.ellipse(cx-r*0.4,cy-r*0.55,r*0.3,r*0.42,0.4,0,7);c.fill();
    c.fillStyle='rgba(255,255,255,.2)';c.beginPath();c.arc(cx+r*0.5,cy+r*0.1,r*0.14,0,7);c.fill();
    c.beginPath();c.arc(cx+r*0.2,cy+r*0.45,r*0.09,0,7);c.fill();
    eyes(r*0.4,cy-r*0.15,r*0.3,false);
    fangMouth(cy+r*0.4,r*0.36);
  }else if(body==='shroom'){ // angry mushroom
    const cy=size*0.66,r=size*0.2;
    c.fillStyle=grad(cy-r,cy+r);c.strokeStyle=OL;c.lineWidth=W; // stem body
    c.beginPath();c.moveTo(cx-r*0.8,cy+r*1.05);c.quadraticCurveTo(cx-r*0.95,cy-r*0.5,cx-r*0.6,cy-r*0.8);
    c.quadraticCurveTo(cx,cy-r,cx+r*0.6,cy-r*0.8);c.quadraticCurveTo(cx+r*0.95,cy-r*0.5,cx+r*0.8,cy+r*1.05);
    c.quadraticCurveTo(cx,cy+r*1.25,cx-r*0.8,cy+r*1.05);c.closePath();c.fill();c.stroke();
    const capC=acc,capL=shadeCol(acc,0.35);
    const g2=c.createLinearGradient(0,cy-r*2.6,0,cy-r*0.6);g2.addColorStop(0,capL);g2.addColorStop(1,capC);
    c.fillStyle=g2;c.strokeStyle=OL;c.lineWidth=W*1.15; // big cap
    c.beginPath();c.moveTo(cx-r*1.7,cy-r*0.7);
    c.quadraticCurveTo(cx-r*1.6,cy-r*2.5,cx,cy-r*2.6);
    c.quadraticCurveTo(cx+r*1.6,cy-r*2.5,cx+r*1.7,cy-r*0.7);
    c.quadraticCurveTo(cx,cy-r*1.15,cx-r*1.7,cy-r*0.7);c.closePath();c.fill();c.stroke();
    c.fillStyle='#f2ecdc';c.strokeStyle=OL;c.lineWidth=W*0.6; // cap spots
    for(const[dx,dy,rr2]of[[-0.8,-1.7,0.28],[0.3,-2.05,0.22],[1,-1.5,0.25]]){
      c.beginPath();c.ellipse(cx+dx*r,cy+dy*r,r*rr2,r*rr2*0.8,0,0,7);c.fill();c.stroke();}
    eyes(r*0.42,cy-r*0.1,r*0.3,true);
    fangMouth(cy+r*0.5,r*0.38);
  }else{ // wisp: floating ghost flame
    const cy=size*0.52,r=size*0.24;
    c.fillStyle='rgba(0,0,0,0)';
    const g3=c.createLinearGradient(0,cy-r*1.4,0,cy+r*1.6);g3.addColorStop(0,light);g3.addColorStop(1,dark);
    c.fillStyle=g3;c.strokeStyle=OL;c.lineWidth=W*1.1;
    c.beginPath();c.moveTo(cx,cy-r*1.5);
    c.quadraticCurveTo(cx+r*1.15,cy-r*0.6,cx+r*1.0,cy+r*0.5);
    for(const[dx,dp]of[[0.6,1.15],[0.15,0.8],[-0.35,1.2],[-0.75,0.75]]){
      c.lineTo(cx+dx*r,cy+dp*r);}
    c.lineTo(cx-r*1.0,cy+r*0.5);c.quadraticCurveTo(cx-r*1.15,cy-r*0.6,cx,cy-r*1.5);
    c.closePath();c.fill();c.stroke();
    c.fillStyle=glow;c.shadowColor=glow;c.shadowBlur=size*0.12; // inner flame core
    c.beginPath();c.ellipse(cx,cy-r*0.5,r*0.32,r*0.5,0,0,7);c.fill();c.shadowBlur=0;
    c.fillStyle='rgba(255,255,255,.3)';c.beginPath();c.ellipse(cx-r*0.45,cy-r*0.7,r*0.22,r*0.35,0.4,0,7);c.fill();
    eyes(r*0.42,cy-r*0.05,r*0.3,false);
    fangMouth(cy+r*0.42,r*0.34);
  }
  return cv;}
function bakeHero(cls2,frame,pose){
  pose=pose||'walk';
  const cv=mkCv(130,130),X=65,Y=104;
  const C=CLASSES[cls2],OL='#141414';
  const el=G?subDef(cls2,G.element).col||TYPES[C.el].color:TYPES[C.el].color;
  // darker heroic palettes (no clown vibes)
  const P={
    warrior:{legs:'#3a3f46',boot:'#241d15',eye:'#ffb454'},
    ranger:{legs:'#2c4030',boot:'#241d15',eye:'#e8ffd8'},
    mage:{legs:'#232c5c',boot:'#241d15',eye:'#7ad0ff'}}[cls2];
  const ph=(frame%6)/6*Math.PI*2;
  const sw=pose==='walk'?Math.sin(ph):0;
  const bob=pose==='walk'?Math.abs(Math.cos(ph))*2.5:(pose==='atk'?1:0);
  const atk=pose==='atk'?frame%3:-1;
  shadow(X,Y+6,22,9);
  ctx.save();ctx.translate(X,Y-bob);
  if(pose==='walk')ctx.rotate(sw*0.035);
  // ---- quiver on back (ranger) ----
  if(cls2==='ranger'){
    ctx.save();ctx.rotate(-0.35);
    ctx.strokeStyle=OL;ctx.lineWidth=2.6;ctx.fillStyle='#6b4326';
    rr(-19,-46,9,20,4);ctx.fill();ctx.stroke();
    ctx.strokeStyle='#c9a15a';ctx.lineWidth=2;
    for(const dx of[-16.5,-13]){ctx.beginPath();ctx.moveTo(dx,-46);ctx.lineTo(dx-1,-53);ctx.stroke();}
    ctx.fillStyle='#e8e2d0';ctx.strokeStyle=OL;ctx.lineWidth=1.4;
    for(const dx of[-17.5,-14]){ctx.beginPath();ctx.moveTo(dx-3,-52);ctx.lineTo(dx+2,-52);ctx.lineTo(dx-0.5,-57);ctx.closePath();ctx.fill();ctx.stroke();}
    ctx.restore();}
  // ---- legs & boots ----
  const lx=-8-sw*8,rx=8+sw*8;
  const lLift=Math.max(0,sw)*6,rLift=Math.max(0,-sw)*6;
  ctx.strokeStyle=P.legs;ctx.lineWidth=8.5;ctx.lineCap='round';
  ctx.beginPath();ctx.moveTo(-6,-16);ctx.lineTo(lx,-4-lLift);ctx.stroke();
  ctx.beginPath();ctx.moveTo(6,-16);ctx.lineTo(rx,-4-rLift);ctx.stroke();
  ctx.strokeStyle=OL;ctx.lineWidth=3;
  for(const[fx,fl]of[[lx,lLift],[rx,rLift]]){
    ctx.fillStyle=P.boot;
    ctx.beginPath();ctx.moveTo(fx-6,2-fl);
    ctx.quadraticCurveTo(fx-7,-6-fl,fx,-6-fl);ctx.quadraticCurveTo(fx+9,-6-fl,fx+9,0-fl);
    ctx.quadraticCurveTo(fx+9,3.5-fl,fx+4,3.5-fl);ctx.lineTo(fx-3,3.5-fl);
    ctx.quadraticCurveTo(fx-6,3.5-fl,fx-6,2-fl);ctx.closePath();ctx.fill();ctx.stroke();
    ctx.strokeStyle='rgba(255,255,255,.14)';ctx.lineWidth=2;
    ctx.beginPath();ctx.moveTo(fx-4,-5.2-fl);ctx.lineTo(fx+5,-5.2-fl);ctx.stroke();
    ctx.fillStyle='rgba(255,255,255,.2)';
    ctx.beginPath();ctx.ellipse(fx-1,-4.4-fl,2.2,1.1,-0.3,0,7);ctx.fill();
    ctx.strokeStyle=OL;ctx.lineWidth=3;}
  // ---- off arm ----
  const oaSw=pose==='walk'?sw*7:(atk===0?-5:atk===1?6:0);
  ctx.strokeStyle=C.skin;ctx.lineWidth=7;ctx.lineCap='round';
  ctx.beginPath();ctx.moveTo(-12,-34);ctx.lineTo(-16-oaSw,-20);ctx.stroke();
  ctx.strokeStyle=OL;ctx.lineWidth=2.2;ctx.fillStyle='#3a342c';
  ctx.beginPath();ctx.arc(-16-oaSw,-19,4.2,0,7);ctx.fill();ctx.stroke();
  // ---- torso per class ----
  ctx.strokeStyle=OL;ctx.lineWidth=4;
  const torso=()=>{ctx.beginPath();ctx.moveTo(-14,-13);ctx.quadraticCurveTo(-17,-32,-10,-40);
    ctx.quadraticCurveTo(0,-45,10,-40);ctx.quadraticCurveTo(17,-32,14,-13);
    ctx.quadraticCurveTo(0,-9,-14,-13);ctx.closePath();};
  if(cls2==='warrior'){
    const sg=ctx.createRadialGradient(-6,-38,3,0,-27,30);sg.addColorStop(0,'#98a4b0');sg.addColorStop(0.55,'#69747f');sg.addColorStop(1,'#3e454e');
    ctx.fillStyle=sg;torso();ctx.fill();ctx.stroke();
    ctx.strokeStyle='rgba(0,0,0,.35)';ctx.lineWidth=2.4;
    ctx.beginPath();ctx.moveTo(0,-42);ctx.lineTo(0,-12);ctx.stroke();
    ctx.beginPath();ctx.moveTo(-13,-24);ctx.quadraticCurveTo(0,-20,13,-24);ctx.stroke();
    ctx.fillStyle='#8a6d4a';ctx.strokeStyle=OL;ctx.lineWidth=3;   // fur collar
    ctx.beginPath();for(let i=0;i<=6;i++){const fx=-13+i*4.33;
      ctx.lineTo(fx,-38+(i%2?3.5:0));}ctx.lineTo(13,-44);ctx.lineTo(-13,-44);ctx.closePath();ctx.fill();ctx.stroke();
    ctx.fillStyle='#5a6470';ctx.strokeStyle=OL;ctx.lineWidth=3;   // pauldron
    ctx.beginPath();ctx.ellipse(13,-35,7,5.5,-0.35,0,7);ctx.fill();ctx.stroke();
    ctx.strokeStyle='rgba(255,255,255,.25)';ctx.lineWidth=2;
    ctx.beginPath();ctx.moveTo(9,-38);ctx.quadraticCurveTo(13,-40,17,-37);ctx.stroke();
  }else if(cls2==='ranger'){
    const rg=ctx.createRadialGradient(-6,-38,3,0,-27,30);rg.addColorStop(0,'#579a62');rg.addColorStop(0.55,'#3a6a43');rg.addColorStop(1,'#22402a');
    ctx.fillStyle=rg;torso();ctx.fill();ctx.stroke();
    ctx.strokeStyle='#6b4326';ctx.lineWidth=4.4;                  // strap
    ctx.beginPath();ctx.moveTo(-11,-40);ctx.lineTo(12,-16);ctx.stroke();
    ctx.strokeStyle='rgba(0,0,0,.2)';ctx.lineWidth=2.2;
    ctx.beginPath();ctx.moveTo(-13,-18);ctx.quadraticCurveTo(0,-14,13,-18);ctx.stroke();
    ctx.fillStyle='rgba(255,255,255,.14)';
    ctx.beginPath();ctx.moveTo(-9,-40);ctx.quadraticCurveTo(-14,-30,-12,-16);ctx.lineTo(-8,-16);ctx.quadraticCurveTo(-11,-30,-9,-40);ctx.closePath();ctx.fill();
  }else{
    const mg=ctx.createRadialGradient(-6,-38,3,0,-27,30);mg.addColorStop(0,'#5468c4');mg.addColorStop(0.55,'#36448e');mg.addColorStop(1,'#1e2650');
    ctx.fillStyle=mg;torso();ctx.fill();ctx.stroke();
    ctx.strokeStyle='#ffd23c';ctx.lineWidth=2.6;                  // gold hem
    ctx.beginPath();ctx.moveTo(-13.5,-15);ctx.quadraticCurveTo(0,-11,13.5,-15);ctx.stroke();
    ctx.fillStyle='#7ad0ff';ctx.shadowColor='#7ad0ff';ctx.shadowBlur=8;   // chest rune
    ctx.beginPath();ctx.moveTo(0,-34);ctx.lineTo(4,-28);ctx.lineTo(0,-22);ctx.lineTo(-4,-28);ctx.closePath();ctx.fill();ctx.shadowBlur=0;
    ctx.strokeStyle=OL;ctx.lineWidth=1.8;ctx.stroke();
    ctx.fillStyle='rgba(255,255,255,.16)';
    ctx.beginPath();ctx.moveTo(-9,-40);ctx.quadraticCurveTo(-14,-30,-12,-16);ctx.lineTo(-8,-16);ctx.quadraticCurveTo(-11,-30,-9,-40);ctx.closePath();ctx.fill();
  }
  // belt
  ctx.fillStyle='#241f19';ctx.strokeStyle=OL;ctx.lineWidth=2.4;
  rr(-14.5,-20,29,6,3);ctx.fill();ctx.stroke();
  ctx.fillStyle='#8a929c';rr(-3.5,-20.5,7,7,2);ctx.fill();ctx.stroke();
  ctx.fillStyle='rgba(0,0,0,.2)';                       // neck AO
  ctx.beginPath();ctx.ellipse(1,-42,9,3.2,0,0,7);ctx.fill();
  ctx.fillStyle='rgba(0,0,0,.14)';                      // hip AO
  ctx.beginPath();ctx.ellipse(0,-12,12,3,0,0,7);ctx.fill();
  // ---- weapon arm & weapon ----
  let armX,armY;
  if(atk===0){armX=6;armY=-38;}
  else if(atk===1){armX=20;armY=-22;}
  else if(atk===2){armX=16;armY=-26;}
  else{armX=14+sw*4;armY=-24+Math.abs(sw)*2;}
  ctx.strokeStyle=C.skin;ctx.lineWidth=7;
  ctx.beginPath();ctx.moveTo(11,-34);ctx.lineTo(armX,armY);ctx.stroke();
  ctx.strokeStyle=OL;ctx.lineWidth=2.2;ctx.fillStyle='#3a342c';
  ctx.beginPath();ctx.arc(armX,armY,4.2,0,7);ctx.fill();ctx.stroke();
  ctx.save();ctx.translate(armX,armY);
  if(cls2==='warrior'){
    const ang=atk===0?-2.1:atk===1?0.75:atk===2?-0.2:-0.55;
    ctx.rotate(ang);
    ctx.strokeStyle=OL;ctx.lineWidth=2.6;
    ctx.fillStyle='#4a3a24';rr(-2.5,2,5,9,2);ctx.fill();ctx.stroke();
    ctx.fillStyle='#8a929c';rr(-8,-1,16,4,2);ctx.fill();ctx.stroke();
    const sg2=ctx.createLinearGradient(0,-28,0,0);sg2.addColorStop(0,'#e8eef4');sg2.addColorStop(1,'#9aa6b2');
    ctx.fillStyle=sg2;ctx.beginPath();ctx.moveTo(-4,-2);ctx.lineTo(-4,-22);ctx.lineTo(0,-30);ctx.lineTo(4,-22);ctx.lineTo(4,-2);ctx.closePath();ctx.fill();ctx.stroke();
    ctx.strokeStyle='rgba(0,0,0,.25)';ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(0,-25);ctx.lineTo(0,-3);ctx.stroke();
    ctx.restore();
    if(atk===1){
      ctx.strokeStyle='rgba(255,255,255,.75)';ctx.lineWidth=6;ctx.lineCap='round';
      ctx.beginPath();ctx.arc(4,-26,26,-0.9,0.9);ctx.stroke();
      ctx.strokeStyle='rgba(255,255,255,.35)';ctx.lineWidth=11;
      ctx.beginPath();ctx.arc(4,-26,26,-0.6,0.6);ctx.stroke();}
  }else if(cls2==='ranger'){
    ctx.rotate(atk===0?-0.15:0);
    ctx.strokeStyle='#4a3319';ctx.lineWidth=4.2;
    ctx.beginPath();ctx.arc(4,0,15,-1.2,1.2);ctx.stroke();
    const px=atk===0?-9:3;
    ctx.strokeStyle='#e8e2d0';ctx.lineWidth=1.6;
    const tx1=4+Math.cos(-1.2)*15,ty1=Math.sin(-1.2)*15,tx2=4+Math.cos(1.2)*15,ty2=Math.sin(1.2)*15;
    ctx.beginPath();ctx.moveTo(tx1,ty1);ctx.lineTo(px,0);ctx.lineTo(tx2,ty2);ctx.stroke();
    if(atk!==1){
      ctx.strokeStyle='#c9a15a';ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(px,0);ctx.lineTo(20,0);ctx.stroke();
      ctx.fillStyle='#fff';ctx.strokeStyle=OL;ctx.lineWidth=1.6;
      ctx.beginPath();ctx.moveTo(24,0);ctx.lineTo(17,-3.5);ctx.lineTo(19,0);ctx.lineTo(17,3.5);ctx.closePath();ctx.fill();ctx.stroke();}
    ctx.restore();
    if(atk===1){ctx.strokeStyle='rgba(255,255,255,.7)';ctx.lineWidth=3;ctx.lineCap='round';
      for(const dy of[-4,0,4]){ctx.beginPath();ctx.moveTo(armX+8,armY+dy);ctx.lineTo(armX+26,armY+dy);ctx.stroke();}}
  }else{
    const ang=atk===0?0.5:atk===1?-0.35:0.15;
    ctx.rotate(ang);
    ctx.strokeStyle='#2a2036';ctx.lineWidth=4;ctx.lineCap='round';
    ctx.beginPath();ctx.moveTo(-4,10);ctx.lineTo(12,-16);ctx.stroke();
    const orbR=atk===0?7.5:atk===1?6:5.5;
    ctx.fillStyle='#7ad0ff';ctx.shadowColor='#7ad0ff';ctx.shadowBlur=atk===1?22:14;
    ctx.beginPath();ctx.arc(13,-18,orbR,0,7);ctx.fill();ctx.shadowBlur=0;
    ctx.strokeStyle=OL;ctx.lineWidth=2;ctx.stroke();
    ctx.fillStyle='rgba(255,255,255,.9)';ctx.beginPath();ctx.arc(11,-20,2.2,0,7);ctx.fill();
    if(atk===1){ctx.strokeStyle='rgba(255,255,255,.8)';ctx.lineWidth=2.2;
      for(let i=0;i<5;i++){const aa=i/5*Math.PI*2+0.3;
        ctx.beginPath();ctx.moveTo(13+Math.cos(aa)*9,-18+Math.sin(aa)*9);
        ctx.lineTo(13+Math.cos(aa)*15,-18+Math.sin(aa)*15);ctx.stroke();}}
    ctx.restore();
  }
  // ---- head: hooded / helmed, shadowed faces, glowing eyes ----
  const hy=-56,tilt=atk===1?0.06:0;
  ctx.save();ctx.rotate(tilt);
  const eye=(ex,ey,rot)=>{ // sharp angular glowing eye
    ctx.save();ctx.translate(ex,ey);ctx.rotate(rot);
    ctx.fillStyle=P.eye;ctx.shadowColor=P.eye;ctx.shadowBlur=7;
    ctx.beginPath();ctx.moveTo(-4,1.6);ctx.quadraticCurveTo(0,-3.4,4.4,-1);
    ctx.quadraticCurveTo(1,2.8,-4,1.6);ctx.closePath();ctx.fill();ctx.shadowBlur=0;
    ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(1,-0.4,1.1,0,7);ctx.fill();
    ctx.restore();};
  if(cls2==='warrior'){
    // iron helm, full face, glowing slits
    ctx.strokeStyle=OL;ctx.lineWidth=4;
    const hg=ctx.createRadialGradient(-6,hy-8,3,0,hy,22);hg.addColorStop(0,'#96a2ae');hg.addColorStop(0.5,'#67727d');hg.addColorStop(1,'#3a424b');
    ctx.fillStyle=hg;
    ctx.beginPath();ctx.arc(0,hy,17.5,Math.PI*0.95,Math.PI*0.05);
    ctx.lineTo(17.5,hy+10);ctx.quadraticCurveTo(9,hy+16,0,hy+16);
    ctx.quadraticCurveTo(-9,hy+16,-17.5,hy+10);ctx.closePath();ctx.fill();ctx.stroke();
    ctx.fillStyle='#2a2f36';                                   // visor shadow band
    rr(-14,hy-3,31,10,4);ctx.fill();
    ctx.strokeStyle='rgba(0,0,0,.4)';ctx.lineWidth=2.2;        // ridge
    ctx.beginPath();ctx.moveTo(0,hy-17);ctx.lineTo(0,hy-4);ctx.stroke();
    ctx.strokeStyle=OL;ctx.lineWidth=3;                        // side fins
    ctx.fillStyle='#5a6470';
    ctx.beginPath();ctx.moveTo(-16,hy-8);ctx.lineTo(-24,hy-16);ctx.lineTo(-15,hy-14);ctx.closePath();ctx.fill();ctx.stroke();
    ctx.beginPath();ctx.moveTo(16,hy-8);ctx.lineTo(24,hy-16);ctx.lineTo(15,hy-14);ctx.closePath();ctx.fill();ctx.stroke();
    ctx.fillStyle='rgba(255,255,255,.2)';
    ctx.beginPath();ctx.ellipse(-7,hy-11,6,3,-.5,0,7);ctx.fill();
    eye(3,hy+2,-0.08);eye(12,hy+2,0.08);
    ctx.strokeStyle='#c8402e';ctx.lineWidth=2.6;               // battle scar on jaw
    ctx.beginPath();ctx.moveTo(13,hy+11);ctx.lineTo(16,hy+14);ctx.stroke();
  }else{
    // hood (green ranger / deep-blue mage) with shadowed face
    const hc=cls2==='ranger'?['#3f7048','#27462e']:['#3a4a9c','#232c5c'];
    ctx.strokeStyle=OL;ctx.lineWidth=4;
    const hgr=ctx.createRadialGradient(-6,hy-8,3,0,hy,24);hgr.addColorStop(0,shadeCol(hc[0],0.35));hgr.addColorStop(0.5,hc[0]);hgr.addColorStop(1,hc[1]);
    ctx.fillStyle=hgr;
    ctx.beginPath();
    ctx.moveTo(-16,hy+13);ctx.quadraticCurveTo(-21,hy-2,-14,hy-13);
    ctx.quadraticCurveTo(-6,hy-22,4,hy-20);                      // peak
    ctx.quadraticCurveTo(2,hy-26,7,hy-27);ctx.quadraticCurveTo(9,hy-21,8,hy-18);
    ctx.quadraticCurveTo(18,hy-12,19,hy+1);ctx.quadraticCurveTo(19,hy+9,16,hy+13);
    ctx.quadraticCurveTo(0,hy+18,-16,hy+13);ctx.closePath();ctx.fill();ctx.stroke();
    // face opening: deep shadow
    ctx.fillStyle='#1c1712';
    ctx.beginPath();ctx.ellipse(3,hy+3,11.5,9.5,0.05,0,7);ctx.fill();
    ctx.strokeStyle=OL;ctx.lineWidth=2.4;ctx.stroke();
    // dim skin hint at jaw
    ctx.fillStyle=shadeCol(C.skin,-0.45);
    ctx.beginPath();ctx.ellipse(4,hy+8,8,4,0.05,0,7);ctx.fill();
    if(cls2==='ranger'){ // face scarf
      ctx.fillStyle='#6b4326';ctx.strokeStyle=OL;ctx.lineWidth=2.2;
      ctx.beginPath();ctx.moveTo(-6,hy+6);ctx.quadraticCurveTo(4,hy+11,14,hy+6);
      ctx.quadraticCurveTo(13,hy+13,3,hy+13);ctx.quadraticCurveTo(-5,hy+12,-6,hy+6);ctx.closePath();ctx.fill();ctx.stroke();}
    if(cls2==='mage'){ // gold hood trim
      ctx.strokeStyle='#ffd23c';ctx.lineWidth=2.2;
      ctx.beginPath();ctx.ellipse(3,hy+3,13,11,0.05,-2.2,1.2);ctx.stroke();}
    ctx.fillStyle='rgba(255,255,255,.14)';
    ctx.beginPath();ctx.ellipse(-9,hy-9,5.5,3,-.7,0,7);ctx.fill();
    eye(-1,hy+1,-0.1);eye(9,hy+1,0.1);
  }
  ctx.restore();
  ctx.restore();
  return cv;}
function bakeCastle(){
  const cv=mkCv(260,240),CX=130,base=222;
  const OL='#12160f';
  ctx.lineJoin='round';ctx.lineCap='round';
  shadow(CX,base+6,95,20);
  const stoneG=(x,y,w,h)=>{const g=ctx.createLinearGradient(x,y,x+w,y+h);
    g.addColorStop(0,'#a8b2bc');g.addColorStop(0.5,'#8a95a0');g.addColorStop(1,'#5e6872');return g;};
  const crenel=(x,y,w,n)=>{const cw=w/(n*2-1);
    ctx.beginPath();ctx.moveTo(x,y+14);
    for(let i=0;i<n;i++){const bx=x+i*cw*2;ctx.lineTo(bx,y);ctx.lineTo(bx+cw,y);ctx.lineTo(bx+cw,y+ (i===n-1?14:8));if(i<n-1)ctx.lineTo(bx+cw*2,y+8);}
    ctx.lineTo(x+w,y+14);};
  const bricks=(x,y,w,h)=>{ctx.strokeStyle='rgba(0,0,0,.16)';ctx.lineWidth=2;
    for(let ry=y+12;ry<y+h;ry+=16){ctx.beginPath();ctx.moveTo(x+4,ry);ctx.lineTo(x+w-4,ry);ctx.stroke();}
    for(let ry=y+4,k=0;ry<y+h-8;ry+=16,k++)for(let rx=x+14+(k%2)*12;rx<x+w-8;rx+=26){
      ctx.beginPath();ctx.moveTo(rx,ry+8);ctx.lineTo(rx,ry+16);ctx.stroke();}};
  const slit=(x,y)=>{ctx.fillStyle='#1c2026';ctx.strokeStyle=OL;ctx.lineWidth=2;
    ctx.beginPath();ctx.moveTo(x-3,y+8);ctx.lineTo(x-3,y-4);ctx.arc(x,y-4,3,Math.PI,0);ctx.lineTo(x+3,y+8);ctx.closePath();ctx.fill();ctx.stroke();};
  ctx.strokeStyle=OL;ctx.lineWidth=5;
  // central keep (behind)
  ctx.fillStyle=stoneG(CX-46,40,92,120);
  crenel(CX-46,40,92,5);ctx.lineTo(CX+46,150);ctx.lineTo(CX-46,150);ctx.closePath();ctx.fill();ctx.stroke();
  bricks(CX-46,54,92,96);
  slit(CX-20,90);slit(CX+20,90);slit(CX,74);
  // flag
  ctx.strokeStyle='#3a2a16';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(CX,40);ctx.lineTo(CX,8);ctx.stroke();
  ctx.fillStyle='#c8402e';ctx.strokeStyle=OL;ctx.lineWidth=3;
  ctx.beginPath();ctx.moveTo(CX,10);ctx.quadraticCurveTo(CX+26,6,CX+34,14);ctx.quadraticCurveTo(CX+22,18,CX,24);ctx.closePath();ctx.fill();ctx.stroke();
  // side towers
  ctx.strokeStyle=OL;ctx.lineWidth=5;
  for(const tx2 of[CX-96,CX+56]){
    ctx.fillStyle=stoneG(tx2,86,40,136);
    crenel(tx2-6,86,52,3);ctx.lineTo(tx2+46,base);ctx.lineTo(tx2-6,base);ctx.closePath();ctx.fill();ctx.stroke();
    bricks(tx2-6,102,52,116);
    slit(tx2+20,130);slit(tx2+20,170);}
  // curtain wall
  ctx.fillStyle=stoneG(CX-72,138,144,84);
  crenel(CX-72,138,144,6);ctx.lineTo(CX+72,base);ctx.lineTo(CX-72,base);ctx.closePath();ctx.fill();ctx.stroke();
  bricks(CX-72,152,144,70);
  // gate arch
  ctx.fillStyle='#2a2f36';ctx.strokeStyle=OL;ctx.lineWidth=4.5;
  ctx.beginPath();ctx.moveTo(CX-26,base);ctx.lineTo(CX-26,178);ctx.arc(CX,178,26,Math.PI,0);ctx.lineTo(CX+26,base);ctx.closePath();ctx.fill();ctx.stroke();
  // wooden door inside arch
  ctx.fillStyle='#6b4326';ctx.beginPath();ctx.moveTo(CX-19,base);ctx.lineTo(CX-19,182);ctx.arc(CX,182,19,Math.PI,0);ctx.lineTo(CX+19,base);ctx.closePath();ctx.fill();
  ctx.strokeStyle='rgba(0,0,0,.3)';ctx.lineWidth=2.4;
  for(const dx of[-9,0,9]){ctx.beginPath();ctx.moveTo(CX+dx,base);ctx.lineTo(CX+dx,170);ctx.stroke();}
  ctx.strokeStyle='#3a2a16';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(CX-19,196);ctx.lineTo(CX+19,196);ctx.stroke();
  // banners by gate
  ctx.strokeStyle=OL;ctx.lineWidth=3;
  for(const dx of[-46,46]){
    ctx.fillStyle='#c8402e';
    ctx.beginPath();ctx.moveTo(CX+dx-8,150);ctx.lineTo(CX+dx+8,150);ctx.lineTo(CX+dx+8,192);ctx.lineTo(CX+dx,202);ctx.lineTo(CX+dx-8,192);ctx.closePath();ctx.fill();ctx.stroke();
    ctx.fillStyle='#ffd23c';ctx.beginPath();ctx.arc(CX+dx,166,5,0,7);ctx.fill();ctx.stroke();}
  // torch glows by gate
  for(const dx of[-30,30]){
    ctx.fillStyle='rgba(255,180,84,.35)';ctx.beginPath();ctx.arc(CX+dx,168,10,0,7);ctx.fill();
    ctx.fillStyle='#ffb454';ctx.beginPath();ctx.ellipse(CX+dx,168,3.4,5,0,0,7);ctx.fill();}
  return cv;}
function bakeMisc(kind){
  if(kind==='flame'){const cv=mkCv(30,40),cx=15;
    ctx.strokeStyle='#12160f';ctx.lineWidth=2.6;ctx.lineJoin='round';
    const g=ctx.createLinearGradient(0,6,0,36);g.addColorStop(0,'#ffd23c');g.addColorStop(1,'#ff6a1e');
    ctx.fillStyle=g;ctx.beginPath();
    ctx.moveTo(cx,3);ctx.quadraticCurveTo(26,16,24,25);ctx.quadraticCurveTo(23,35,cx,37);
    ctx.quadraticCurveTo(7,35,6,25);ctx.quadraticCurveTo(4,16,cx,3);ctx.closePath();ctx.fill();ctx.stroke();
    ctx.fillStyle='#fff2c8';ctx.beginPath();ctx.ellipse(cx,27,4.5,7,0,0,7);ctx.fill();return cv;}
  if(kind==='thorn'){const cv=mkCv(38,30),line='#12160f';
    ctx.strokeStyle=line;ctx.lineWidth=2.4;ctx.lineJoin='round';
    ctx.fillStyle='#3f7d34';
    for(const[bx,h]of[[7,14],[15,20],[24,15],[31,18]]){ctx.beginPath();
      ctx.moveTo(bx-5,27);ctx.quadraticCurveTo(bx-2,27-h,bx,27-h-2);ctx.quadraticCurveTo(bx+2,27-h,bx+5,27);
      ctx.closePath();ctx.fill();ctx.stroke();}
    ctx.fillStyle='#5da53f';for(const[bx,h]of[[15,20],[31,18]]){ctx.beginPath();
      ctx.moveTo(bx-2.5,26);ctx.quadraticCurveTo(bx-1,26-h*0.7,bx,26-h*0.75);ctx.quadraticCurveTo(bx+1,26-h*0.7,bx+2.5,26);
      ctx.closePath();ctx.fill();}return cv;}
  if(kind==='sign'){const cv=mkCv(50,50),cx=25,base=42,line='#12160f';
    shadow(cx,base,14,6);ctx.strokeStyle=line;ctx.lineWidth=3;
    ctx.fillStyle='#4e341c';rr(cx-2,base-18,5,18,2);ctx.fill();ctx.stroke();
    ctx.fillStyle='#9c7638';rr(cx-14,base-30,28,16,3);ctx.fill();ctx.stroke();
    ctx.fillStyle='#4e341c';ctx.fillRect(cx-9,base-25,18,2);ctx.fillRect(cx-9,base-20,15,2);return cv;}
  if(kind==='berry'){const cv=mkCv(60,50),cx=30,base=42,line='#12160f';
    shadow(cx,base,18,7);
    ctx.fillStyle='#1f5223';ctx.strokeStyle=line;ctx.lineWidth=4;ctx.beginPath();ctx.arc(cx,base-12,18,0,7);ctx.fill();ctx.stroke();
    ctx.fillStyle='#e5372f';for(const[dx,dy]of[[-6,-8],[6,-2],[0,4],[9,-10]]){ctx.beginPath();ctx.arc(cx+dx,base-12+dy,3,0,7);ctx.fill();}return cv;}
  if(kind==='wolf'){const cv=mkCv(56,44),line='#12160f';
    shadow(28,38,15,5);
    ctx.strokeStyle=line;ctx.lineWidth=2.8;ctx.lineJoin='round';
    const g=ctx.createLinearGradient(0,10,0,36);g.addColorStop(0,'#b8a68e');g.addColorStop(1,'#8a7a62');
    ctx.fillStyle=g;                                          // body
    ctx.beginPath();ctx.moveTo(10,34);ctx.quadraticCurveTo(8,22,18,20);
    ctx.quadraticCurveTo(30,16,40,21);ctx.quadraticCurveTo(46,24,45,32);
    ctx.quadraticCurveTo(38,37,10,34);ctx.closePath();ctx.fill();ctx.stroke();
    ctx.strokeStyle='#6a5a44';ctx.lineWidth=4;                // legs
    for(const lx of[16,24,34,41]){ctx.beginPath();ctx.moveTo(lx,33);ctx.lineTo(lx-1,40);ctx.stroke();}
    ctx.strokeStyle=line;ctx.lineWidth=2.4;                   // tail
    ctx.fillStyle='#9a8a70';
    ctx.beginPath();ctx.moveTo(11,30);ctx.quadraticCurveTo(2,26,4,18);ctx.quadraticCurveTo(8,24,13,26);ctx.closePath();ctx.fill();ctx.stroke();
    ctx.fillStyle='#b8a68e';                                  // head
    ctx.beginPath();ctx.moveTo(38,22);ctx.quadraticCurveTo(46,12,52,15);
    ctx.quadraticCurveTo(56,20,50,25);ctx.quadraticCurveTo(44,28,38,25);ctx.closePath();ctx.fill();ctx.stroke();
    ctx.fillStyle='#8a7a62';                                  // ears
    ctx.beginPath();ctx.moveTo(41,15);ctx.lineTo(43,7);ctx.lineTo(47,13);ctx.closePath();ctx.fill();ctx.stroke();
    ctx.fillStyle='#7ad0ff';ctx.shadowColor='#7ad0ff';ctx.shadowBlur=5;  // spirit eye
    ctx.beginPath();ctx.arc(47,18,2,0,7);ctx.fill();ctx.shadowBlur=0;
    return cv;}
  if(kind==='hawk'){const cv=mkCv(52,44),line='#12160f';
    shadow(26,40,12,4);
    ctx.strokeStyle=line;ctx.lineWidth=2.6;ctx.lineJoin='round';
    ctx.fillStyle='#8a6a44';
    for(const dx of[-1,1]){ctx.save();ctx.translate(26,20);ctx.scale(dx,1);
      ctx.beginPath();ctx.moveTo(4,0);ctx.quadraticCurveTo(16,-14,24,-8);
      ctx.quadraticCurveTo(18,-2,14,4);ctx.quadraticCurveTo(9,2,4,4);ctx.closePath();ctx.fill();ctx.stroke();ctx.restore();}
    const g=ctx.createLinearGradient(0,10,0,34);g.addColorStop(0,'#b09068');g.addColorStop(1,'#7a5c3a');
    ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(26,22,8,11,0,0,7);ctx.fill();ctx.stroke();
    ctx.fillStyle='#f0e8d8';ctx.beginPath();ctx.ellipse(26,26,4.5,6,0,0,7);ctx.fill();
    ctx.fillStyle='#b09068';ctx.beginPath();ctx.arc(26,11,5.5,0,7);ctx.fill();ctx.stroke();
    ctx.fillStyle='#ffd23c';ctx.beginPath();ctx.moveTo(26,12);ctx.lineTo(31,14);ctx.lineTo(26,16);ctx.closePath();ctx.fill();ctx.stroke();
    ctx.fillStyle='#7ad0ff';ctx.shadowColor='#7ad0ff';ctx.shadowBlur=4;
    ctx.beginPath();ctx.arc(24,10,1.6,0,7);ctx.fill();ctx.shadowBlur=0;
    return cv;}
  if(kind==='boar'){const cv=mkCv(58,46),line='#12160f';
    shadow(29,40,16,5);
    ctx.strokeStyle=line;ctx.lineWidth=2.8;ctx.lineJoin='round';
    const g=ctx.createLinearGradient(0,12,0,38);g.addColorStop(0,'#8a6a52');g.addColorStop(1,'#5c4436');
    ctx.fillStyle=g;
    ctx.beginPath();ctx.moveTo(8,34);ctx.quadraticCurveTo(6,18,20,15);
    ctx.quadraticCurveTo(34,12,44,18);ctx.quadraticCurveTo(50,22,49,32);
    ctx.quadraticCurveTo(38,39,8,34);ctx.closePath();ctx.fill();ctx.stroke();
    ctx.fillStyle='#4a3428';ctx.beginPath();ctx.moveTo(14,15);ctx.lineTo(20,8);ctx.lineTo(24,15);ctx.closePath();ctx.fill();ctx.stroke();
    ctx.strokeStyle='#4a3428';ctx.lineWidth=4;
    for(const lx of[15,23,35,43]){ctx.beginPath();ctx.moveTo(lx,35);ctx.lineTo(lx-1,42);ctx.stroke();}
    ctx.strokeStyle=line;ctx.lineWidth=2.4;
    ctx.fillStyle='#8a6a52';ctx.beginPath();ctx.ellipse(48,24,7,6,0,0,7);ctx.fill();ctx.stroke();
    ctx.fillStyle='#d8a8a0';ctx.beginPath();ctx.ellipse(54,25,3,3.4,0,0,7);ctx.fill();ctx.stroke();
    ctx.fillStyle='#f0e8d8';
    ctx.beginPath();ctx.moveTo(46,28);ctx.quadraticCurveTo(43,34,48,34);ctx.lineTo(47,29);ctx.closePath();ctx.fill();ctx.stroke();
    ctx.fillStyle='#7ad0ff';ctx.shadowColor='#7ad0ff';ctx.shadowBlur=4;
    ctx.beginPath();ctx.arc(45,20,1.8,0,7);ctx.fill();ctx.shadowBlur=0;
    return cv;}
  if(kind==='quester'){const cv=mkCv(44,74),cx=22,base=66,line='#12160f';
    shadow(cx,base,12,5);
    ctx.strokeStyle=line;ctx.lineWidth=3;
    ctx.fillStyle='#7c5cd6';ctx.beginPath();ctx.moveTo(cx-10,base);ctx.quadraticCurveTo(cx-11,base-24,cx,base-26);
    ctx.quadraticCurveTo(cx+11,base-24,cx+10,base);ctx.closePath();ctx.fill();ctx.stroke();
    ctx.fillStyle='#ffd8ae';ctx.beginPath();ctx.arc(cx,base-33,8.5,0,7);ctx.fill();ctx.stroke();
    ctx.fillStyle='#4a3aa0';ctx.beginPath();ctx.moveTo(cx-10,base-36);ctx.quadraticCurveTo(cx,base-46,cx+12,base-38);
    ctx.quadraticCurveTo(cx+2,base-34,cx-10,base-36);ctx.closePath();ctx.fill();ctx.stroke();
    ctx.strokeStyle='#e8483a';ctx.lineWidth=2.4;
    ctx.beginPath();ctx.moveTo(cx+9,base-42);ctx.quadraticCurveTo(cx+15,base-50,cx+11,base-55);ctx.stroke();
    ctx.fillStyle='#1a1a1a';for(const dx of[-3,3]){ctx.beginPath();ctx.arc(cx+dx,base-33,1.4,0,7);ctx.fill();}
    ctx.fillStyle='#ffd23c';ctx.strokeStyle=line;ctx.lineWidth=2.6;
    ctx.beginPath();ctx.arc(cx,9,7.5,0,7);ctx.fill();ctx.stroke();
    ctx.fillStyle='#12160f';ctx.font='bold 12px Fredoka,system-ui';ctx.textAlign='center';ctx.fillText('!',cx,13);
    return cv;}
  if(kind==='villager'){const cv=mkCv(40,60),cx=20,base=52,line='#12160f';
    shadow(cx,base,10,4);ctx.strokeStyle=line;ctx.lineWidth=3;
    ctx.fillStyle='#8a6d3a';ctx.beginPath();ctx.moveTo(cx-8,base);ctx.quadraticCurveTo(cx-9,base-16,cx,base-18);ctx.quadraticCurveTo(cx+9,base-16,cx+8,base);ctx.closePath();ctx.fill();ctx.stroke();
    ctx.fillStyle='#f0c090';ctx.beginPath();ctx.arc(cx,base-24,8,0,7);ctx.fill();ctx.stroke();
    ctx.fillStyle='#6a4a26';ctx.beginPath();ctx.arc(cx,base-27,8,Math.PI,0);ctx.closePath();ctx.fill();ctx.stroke();
    ctx.fillStyle='#1a1a1a';for(const dx of[-3,3]){ctx.beginPath();ctx.arc(cx+dx,base-23,1.3,0,7);ctx.fill();}return cv;}
  if(kind==='campfire'){const cv=mkCv(60,60),cx=30,base=48;
    shadow(cx,base+2,20,8);
    ctx.strokeStyle='#2e2114';ctx.lineWidth=6;
    ctx.beginPath();ctx.moveTo(cx-13,base+3);ctx.lineTo(cx+13,base-3);ctx.moveTo(cx-13,base-3);ctx.lineTo(cx+13,base+3);ctx.stroke();
    ctx.fillStyle='#ff5a1e';ctx.beginPath();ctx.moveTo(cx-9,base);ctx.quadraticCurveTo(cx,base-28,cx+9,base);ctx.closePath();ctx.fill();
    ctx.fillStyle='#ffb02e';ctx.beginPath();ctx.moveTo(cx-6,base);ctx.quadraticCurveTo(cx,base-19,cx+6,base);ctx.closePath();ctx.fill();
    ctx.fillStyle='#ffe86a';ctx.beginPath();ctx.moveTo(cx-3,base-2);ctx.quadraticCurveTo(cx,base-11,cx+3,base-2);ctx.closePath();ctx.fill();return cv;}
  if(kind==='firebolt'||kind==='chronobolt'||kind==='necrobolt'){
    const P2={firebolt:['#ff9a3c','#ff7a2a','#ffc23c','#fff6d8'],
      chronobolt:['#7ad0ff','#3a8fd0','#a8e0ff','#f0faff'],
      necrobolt:['#c07aff','#8a4ad0','#d8aaff','#f4eaff']}[kind];
    const cv=mkCv(36,16);ctx.translate(18,8);
    ctx.shadowColor=P2[0];ctx.shadowBlur=6;
    ctx.fillStyle=P2[1];ctx.beginPath();
    ctx.moveTo(14,0);ctx.quadraticCurveTo(6,-6,-6,-4);ctx.quadraticCurveTo(-15,-2,-17,0);
    ctx.quadraticCurveTo(-15,2,-6,4);ctx.quadraticCurveTo(6,6,14,0);ctx.closePath();ctx.fill();
    ctx.shadowBlur=0;
    ctx.fillStyle=P2[2];ctx.beginPath();
    ctx.moveTo(12,0);ctx.quadraticCurveTo(4,-3.6,-4,-2.4);ctx.quadraticCurveTo(-10,-1,-11,0);
    ctx.quadraticCurveTo(-10,1,-4,2.4);ctx.quadraticCurveTo(4,3.6,12,0);ctx.closePath();ctx.fill();
    ctx.fillStyle=P2[3];ctx.beginPath();ctx.ellipse(7,0,4.5,1.9,0,0,7);ctx.fill();
    if(kind==='chronobolt'){ // crystalline shards
      ctx.strokeStyle='#e8f6ff';ctx.lineWidth=1.4;
      ctx.beginPath();ctx.moveTo(2,-4);ctx.lineTo(6,-1);ctx.moveTo(-3,3);ctx.lineTo(1,1);ctx.stroke();}
    return cv;}
  if(kind==='stormbolt'){ // jagged lightning bolt
    const cv=mkCv(38,18);ctx.translate(19,9);
    ctx.shadowColor='#ffd23c';ctx.shadowBlur=7;
    ctx.strokeStyle='#ffd84a';ctx.lineWidth=4;ctx.lineJoin='round';ctx.lineCap='round';
    ctx.beginPath();ctx.moveTo(-16,1);ctx.lineTo(-6,-4);ctx.lineTo(-1,2);ctx.lineTo(7,-3);ctx.lineTo(14,0);ctx.stroke();
    ctx.shadowBlur=0;
    ctx.strokeStyle='#fff8d0';ctx.lineWidth=1.8;
    ctx.beginPath();ctx.moveTo(-14,1);ctx.lineTo(-6,-3);ctx.lineTo(-1,2);ctx.lineTo(7,-2);ctx.lineTo(13,0);ctx.stroke();
    ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(14,0,2.6,0,7);ctx.fill();
    return cv;}
  if(kind==='arrow'||kind.indexOf('arrow_')===0){
    const P2={arrow:['#c9a15a','#9b8cf0','#fff'],
      arrow_beastmaster:['#a8703a','#c9803a','#ffe0c0'],
      arrow_trapper:['#6b5636','#b8935e','#d8d0c0'],
      arrow_sharpshooter:['#c9a15a','#ffd23c','#fff6d0'],
      arrow_warden:['#7a5c3a','#5da53f','#e8ffd8']}[kind]||['#c9a15a','#9b8cf0','#fff'];
    const cv=mkCv(44,20);ctx.translate(22,10);
    ctx.strokeStyle=P2[0];ctx.lineWidth=2.8;
    ctx.beginPath();ctx.moveTo(-16,0);ctx.lineTo(11,0);ctx.stroke();
    ctx.fillStyle=P2[1];ctx.beginPath();ctx.moveTo(-16,0);ctx.lineTo(-21,-5);ctx.lineTo(-18,0);ctx.lineTo(-21,5);ctx.closePath();ctx.fill();
    if(kind==='arrow_warden'){ // leaf fletching
      ctx.beginPath();ctx.ellipse(-17,-3,4,2,-0.5,0,7);ctx.fill();
      ctx.beginPath();ctx.ellipse(-17,3,4,2,0.5,0,7);ctx.fill();}
    if(kind==='arrow_trapper'){ // barbs
      ctx.fillStyle=P2[1];
      ctx.beginPath();ctx.moveTo(6,-1);ctx.lineTo(3,-5);ctx.lineTo(8,-1);ctx.closePath();ctx.fill();
      ctx.beginPath();ctx.moveTo(6,1);ctx.lineTo(3,5);ctx.lineTo(8,1);ctx.closePath();ctx.fill();}
    ctx.fillStyle=P2[2];ctx.shadowColor=P2[1];ctx.shadowBlur=8;
    ctx.beginPath();
    if(kind==='arrow_sharpshooter'){ctx.moveTo(24,0);ctx.lineTo(11,-3.4);ctx.lineTo(14,0);ctx.lineTo(11,3.4);}
    else{ctx.moveTo(21,0);ctx.lineTo(11,-4);ctx.lineTo(14,0);ctx.lineTo(11,4);}
    ctx.closePath();ctx.fill();return cv;}
}


/* ---- procedural sound (v1) ---- */
let AC=null;
function actx(){try{if(!AC)AC=new (window.AudioContext||window.webkitAudioContext)();if(AC.state==='suspended')AC.resume();}catch(e){}return AC;}
function tone(freq,dur,type,vol,slideTo){const c=actx();if(!c||(G&&G.muted))return;const t=c.currentTime;
  const o=c.createOscillator(),g=c.createGain();o.type=type||'square';o.frequency.setValueAtTime(freq,t);
  if(slideTo)o.frequency.exponentialRampToValueAtTime(Math.max(1,slideTo),t+dur);
  g.gain.setValueAtTime(vol||0.18,t);g.gain.exponentialRampToValueAtTime(0.0001,t+dur);
  o.connect(g).connect(c.destination);o.start(t);o.stop(t+dur+0.02);}
function noiseBurst(dur,vol){const c=actx();if(!c||(G&&G.muted))return;const t=c.currentTime;
  const b=c.createBuffer(1,Math.max(1,(c.sampleRate*dur)|0),c.sampleRate),d=b.getChannelData(0);
  for(let i=0;i<d.length;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/d.length,2);
  const s2=c.createBufferSource();s2.buffer=b;const g=c.createGain();g.gain.value=vol||0.15;
  s2.connect(g).connect(c.destination);s2.start(t);}
function fNoise(dur,vol,f0,f1,type){ // filtered noise sweep (whoosh/crackle/hiss)
  const c=actx();if(!c||(G&&G.muted))return;const t=c.currentTime;
  const b=c.createBuffer(1,Math.max(1,(c.sampleRate*dur)|0),c.sampleRate),d=b.getChannelData(0);
  for(let i=0;i<d.length;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/d.length,1.4);
  const s2=c.createBufferSource();s2.buffer=b;
  const fl=c.createBiquadFilter();fl.type=type||'bandpass';fl.Q.value=1.1;
  fl.frequency.setValueAtTime(f0,t);fl.frequency.exponentialRampToValueAtTime(Math.max(40,f1),t+dur);
  const g=c.createGain();g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(0.0001,t+dur);
  s2.connect(fl).connect(g).connect(c.destination);s2.start(t);}
function crackle(dur,vol){ // sparse pops for fire
  const c=actx();if(!c||(G&&G.muted))return;const t=c.currentTime;
  const b=c.createBuffer(1,(c.sampleRate*dur)|0,c.sampleRate),d=b.getChannelData(0);
  for(let i=0;i<d.length;i++)d[i]=Math.random()<0.015?(Math.random()*2-1):d[i-1]?d[i-1]*0.6:0;
  const s2=c.createBufferSource();s2.buffer=b;
  const fl=c.createBiquadFilter();fl.type='highpass';fl.frequency.value=1400;
  const g=c.createGain();g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(0.0001,t+dur);
  s2.connect(fl).connect(g).connect(c.destination);s2.start(t);}
function bell(freq,dur,vol,delay){ // bright bell partials (quest/fanfare)
  const c=actx();if(!c||(G&&G.muted))return;const t=c.currentTime+(delay||0);
  for(const[m,v2]of[[1,1],[2.76,0.4],[5.4,0.18]]){
    const o=c.createOscillator(),g=c.createGain();o.type='sine';
    o.frequency.setValueAtTime(freq*m,t);
    g.gain.setValueAtTime(vol*v2,t);g.gain.exponentialRampToValueAtTime(0.0001,t+dur);
    o.connect(g).connect(c.destination);o.start(t);o.stop(t+dur+0.02);}}
function elemCastSfx(){
  const el=(G&&G.element)||'fire';
  if(G&&G.class==='ranger'){ // bow: string pluck + arrow whoosh
    tone(190+Math.random()*30,0.05,'triangle',0.16,120);
    fNoise(0.16,0.1,2600,700);return;}
  if(G&&G.class==='warrior'){ // blade whoosh
    fNoise(0.15,0.16,900,2600);return;}
  switch(el){
    case 'fire':fNoise(0.22,0.16,420,1600);crackle(0.2,0.12);break;
    case 'chrono':case 'frost':tone(1450+Math.random()*120,0.16,'sine',0.09,2100);fNoise(0.18,0.07,4200,6800,'highpass');break;
    case 'storm':tone(1900,0.09,'sawtooth',0.1,140);crackle(0.12,0.14);break;
    case 'necro':tone(140,0.26,'sawtooth',0.1,90);tone(146,0.26,'sawtooth',0.08,88);fNoise(0.26,0.06,300,120,'lowpass');break;
    default:tone(520,0.11,'square',0.13,900);}}
function killSfx(e){
  if(G&&G.muted)return;
  if(e.boss){tone(70,0.8,'sawtooth',0.2,40);fNoise(0.7,0.18,300,60,'lowpass');bell(520,0.9,0.12,0.25);return;}
  const body=e.raider?'brute':critBody(e.sp);
  switch(body){
    case 'imp':tone(880+Math.random()*120,0.18,'sawtooth',0.12,260);tone(1200,0.08,'square',0.06,500);break;
    case 'bat':tone(1500,0.06,'square',0.09,2100);setTimeout(()=>tone(1250,0.07,'square',0.08,1800),70);fNoise(0.14,0.05,3800,6200,'highpass');break;
    case 'brute':tone(110,0.22,'sawtooth',0.16,55);fNoise(0.2,0.14,250,90,'lowpass');break;
    case 'slime':fNoise(0.2,0.16,600,150,'lowpass');tone(300,0.14,'sine',0.1,90);break;
    case 'shroom':fNoise(0.16,0.12,800,300,'lowpass');fNoise(0.25,0.05,2600,4200,'highpass');break;
    default:tone(950,0.3,'sine',0.08,240);fNoise(0.3,0.05,5000,7800,'highpass');}
  if(!e.raider)setTimeout(()=>tone(1150,0.05,'square',0.05,1500),160); // faint coin tick
}
let _hitT=0;
function sfx(n){switch(n){
  case 'cast':elemCastSfx();break;
  case 'ecast':tone(320,0.14,'sawtooth',0.07,110);fNoise(0.16,0.06,500,180,'lowpass');break;
  case 'crit':{if(performance.now()-_hitT<70)return;_hitT=performance.now();
    tone(1750,0.1,'square',0.12,2600);tone(220,0.12,'sawtooth',0.12,70);
    noiseBurst(0.12,0.14);bell(2100,0.22,0.08);break;}
  case 'wall':{const el=(G&&G.element)||'fire';
    if(G&&G.class==='warrior'){fNoise(0.4,0.2,150,60,'lowpass');noiseBurst(0.3,0.14);}
    else if(G&&G.class==='ranger'){fNoise(0.35,0.14,700,250);tone(240,0.2,'triangle',0.08,120);}
    else if(el==='chrono'){bell(1150,0.5,0.12);fNoise(0.4,0.08,5000,7600,'highpass');}
    else if(el==='storm'){tone(2100,0.2,'sawtooth',0.12,110);crackle(0.3,0.16);}
    else if(el==='necro'){tone(110,0.55,'sawtooth',0.13,60);fNoise(0.5,0.08,260,90,'lowpass');}
    else{fNoise(0.45,0.2,300,1400);crackle(0.45,0.16);}break;}
  case 'quest':{ // WoW-style completion flourish
    [392,523,659,784].forEach((f,i)=>bell(f,0.5,0.16,i*0.09));
    bell(1046,0.9,0.2,0.36);
    setTimeout(()=>fNoise(0.5,0.06,3000,7000,'highpass'),320);
    setTimeout(()=>sfx('coin'),430);break;}
  case 'hit':{if(performance.now()-_hitT<45)return;_hitT=performance.now();noiseBurst(0.09,0.12);tone(200,0.08,'sawtooth',0.09,90);break;}
  case 'super':tone(280,0.5,'sawtooth',0.2,1300);noiseBurst(0.5,0.13);break;
  case 'catch':tone(500,0.1,'square',0.16,720);setTimeout(()=>tone(760,0.11,'square',0.16,1000),110);setTimeout(()=>tone(1050,0.16,'triangle',0.16,1350),240);break;
  case 'fail':tone(420,0.22,'square',0.13,150);break;
  case 'level':[523,659,784,1046].forEach((f,i)=>setTimeout(()=>tone(f,0.12,'triangle',0.17),i*85));break;
  case 'coin':tone(920,0.06,'square',0.1,1250);setTimeout(()=>tone(1320,0.08,'square',0.1),65);break;
  case 'engage':tone(300,0.14,'square',0.15,520);setTimeout(()=>tone(520,0.2,'square',0.15,300),140);break;
  case 'heal':[660,880,1046].forEach((f,i)=>setTimeout(()=>tone(f,0.13,'sine',0.14),i*90));break;
}}
window.addEventListener('pointerdown',()=>actx(),{capture:true});
/* =================== STATE & GEAR (ported from classic) =================== */
const CLASS_BASE={mage:{hp:54,atk:15,def:9},ranger:{hp:52,atk:14,def:10},warrior:{hp:66,atk:16,def:14}};
const RARITIES=[
  {key:'common',name:'Common',col:'#c9ced4',hex:0xc9ced4,mult:1,affixes:1},
  {key:'magic',name:'Magic',col:'#5aa8ff',hex:0x5aa8ff,mult:1.3,affixes:2},
  {key:'rare',name:'Rare',col:'#ffd23c',hex:0xffd23c,mult:1.7,affixes:3},
  {key:'epic',name:'Epic',col:'#c07aff',hex:0xc07aff,mult:2.2,affixes:4}];
const GEAR_SLOTS=['weapon','helm','armor','boots','trinket','charm'];
const SLOT_ICON={weapon:'⚔️',helm:'🪖',armor:'🥋',boots:'🥾',trinket:'💍',charm:'🔮'};
const GEAR_NAMES={weapon:{mage:'Staff',ranger:'Bow',warrior:'Blade'},
  helm:['Cap','Helm','Hood','Circlet'],armor:['Tunic','Cloak','Mail','Plate'],
  boots:['Boots','Treads','Greaves','Striders'],trinket:['Ring','Amulet','Band','Totem'],
  charm:['Charm','Talisman','Fetish','Idol']};
const SETS={mage:{name:'Emberweave'},warrior:{name:'Ironbound'},ranger:{name:'Sylvanheart'}};
const GEAR_PREFIX={common:['Worn','Simple','Sturdy'],magic:['Gleaming','Charged','Keen'],rare:['Savage','Ancient','Runed'],epic:['Mythic','Dragonforged','Celestial']};
const AFFIX_POOL=[{k:'atk',base:2,per:0.5,lab:'⚔'},{k:'def',base:2,per:0.4,lab:'🛡'},{k:'hp',base:8,per:2.0,lab:'❤'},
  {k:'spd',base:3,per:0.15,lab:'👟%'},{k:'xp',base:5,per:0.2,lab:'✦%'},{k:'coin',base:6,per:0.25,lab:'◉%'}];
const RARE_PREFIX=['Dread','Vile','Gloom','Blood','Storm','Grim'];
const SKILLS=[
  // == SPELL TREE ==
  {tree:'spell',tier:1,icon:'\ud83d\udca5',key:'power',name:'Spell Power',max:5,eff:'+8% damage / rank'},
  {tree:'spell',tier:1,icon:'\u26a1',key:'haste',name:'Haste',max:5,eff:'\u22128% attack cooldown / rank'},
  {tree:'spell',tier:2,icon:'\ud83d\udd31',key:'multi',name:'Split Shot',max:2,eff:'+1 projectile / rank',req:{power:2}},
  {tree:'spell',tier:2,icon:'\ud83c\udfaf',key:'pierce',name:'Piercing',max:3,eff:'+1 pierce / rank',req:{haste:2}},
  {tree:'spell',tier:2,icon:'\ud83c\udf00',key:'focus',name:'Super Focus',max:5,eff:'+15% Super charge / rank'},
  {tree:'spell',tier:3,icon:'\u2604\ufe0f',key:'overload',name:'Overload',max:3,eff:'+20% Super damage / rank',req:{focus:2}},
  {tree:'spell',tier:3,icon:'shield',cv:1,key:'shield',cls:'mage',name:'Spell Shield',max:3,eff:'ACTIVE: absorb damage 8s (stronger / rank)'},
  {tree:'spell',tier:3,icon:'horn',cv:1,key:'warcry',cls:'warrior',name:'War Cry',max:3,eff:'ACTIVE: roar \u2014 heal & \u221240% damage 10s'},
  {tree:'spell',tier:3,icon:'quiver',cv:1,key:'quiver',cls:'ranger',name:'Swift Quiver',max:3,eff:'ACTIVE: 3\u00d7 fire rate (4+rank s)'},
  {tree:'spell',tier:4,icon:'firewall',cv:1,key:'firewall',cls:'mage',name:'Fire Wall',max:3,eff:'SWIPE SPELL: draw a wall of flame (longer+stronger / rank)',req:{shield:1}},
  {tree:'spell',tier:4,icon:'spikes',cv:1,key:'spikewall',cls:'warrior',name:'Earthshatter',max:3,eff:'SWIPE SPELL: draw stone spikes that root foes',req:{warcry:1}},
  {tree:'spell',tier:4,icon:'thorns',cv:1,key:'thornwall',cls:'ranger',name:'Thorn Wall',max:3,eff:'SWIPE SPELL: draw a hedge of thorns that slows foes',req:{quiver:1}},
  {tree:'spell',tier:2,icon:'🐾',key:'feralfang',cls:'ranger',sub:'beastmaster',name:'Feral Fangs',max:5,eff:'+20% companion damage / rank'},
  {tree:'spell',tier:3,icon:'🐺',key:'alphabond',cls:'ranger',sub:'beastmaster',name:'Alpha Bond',max:3,eff:'Companion attacks 12% faster & MARK lasts +1s / rank'},
  // == PASSIVE TREE ==
  {tree:'passive',tier:1,icon:'\u2764\ufe0f',key:'vitality',name:'Vitality',max:5,eff:'+6% max HP / rank'},
  {tree:'passive',tier:1,icon:'\ud83d\udcaa',key:'might',name:'Might',max:5,eff:'+4% ATK / rank'},
  {tree:'passive',tier:1,icon:'\ud83e\udea8',key:'iron',name:'Iron Skin',max:5,eff:'+5% DEF / rank'},
  {tree:'passive',tier:1,icon:'\ud83d\udc5f',key:'swift',name:'Swiftness',max:5,eff:'+6% move speed / rank'},
  {tree:'passive',tier:2,icon:'\ud83d\udc9a',key:'mending',name:'Mending',max:3,eff:'regen HP while roaming / rank',req:{vitality:1}},
  {tree:'passive',tier:2,icon:'\ud83d\udcd6',key:'scholar',name:'Scholar',max:5,eff:'+10% XP / rank'},
  {tree:'passive',tier:2,icon:'\ud83d\udcb0',key:'fortune',name:'Fortune',max:5,eff:'+12% coins / rank'},
  {tree:'passive',tier:3,icon:'\ud83d\udde1\ufe0f',key:'crit',name:'Critical Strike',max:5,eff:'+3% chance of 2\u00d7 damage / rank',req:{might:2}}];
function skillReq(nd){if(!nd.req)return true;for(const k in nd.req){if(((G.skills||{})[k]||0)<nd.req[k])return false;}return true;}
function xpToNext(l){return 16+l*l*4;}
let G=null;
const SAVE_KEY='critter-wilds-v2-s1';
function gearSum(k){let t=0;if(!G)return 0;
  for(const sl of GEAR_SLOTS){const it=G.equip[sl];if(it&&it.stats[k])t+=it.stats[k];}return t;}
function mods(){const m={dmg:1,cd:1,speed:1,xp:1,coins:1,crit:0,count:0,pierce:0,superGain:1,superPow:1,regen:0};if(!G)return m;
  const S=G.skills||{};
  if(G.class==='mage')m.dmg*=1.12,m.cd*=0.9;else if(G.class==='ranger')m.speed*=1.15;else m.superGain*=1.3;
  m.dmg*=1+0.08*(S.power||0);m.cd*=Math.pow(0.92,S.haste||0);m.speed*=1+0.06*(S.swift||0);
  m.count+=(S.multi||0);m.pierce+=(S.pierce||0);
  m.superGain*=1+0.15*(S.focus||0);m.superPow*=1+0.2*(S.overload||0);m.regen+=(S.mending||0);
  m.xp*=1+0.1*(S.scholar||0);m.coins*=1+0.12*(S.fortune||0);m.crit=0.03*(S.crit||0);
  if(G.element==='arcane'){m.dmg*=1.08;m.pierce+=1;}
  if(G.class==='mage'){
    if(G.element==='storm')m.cd*=0.9;
    if(G.element==='chrono')m.cd*=0.85;}
  if(G.class==='ranger'){
    if(G.element==='sharpshooter'){m.dmg*=1.12;m.crit+=0.10;}
    if(G.element==='warden')m.regen+=2;}
  if(G.class==='warrior'){
    if(G.element==='berserker'&&G.maxHp>0)m.dmg*=1+0.5*Math.max(0,1-G.hp/G.maxHp);
    if(G.element==='blademaster')m.cd*=0.8;
    if(G.element==='warlord')m.superGain*=1.2;
    if(scene&&scene.frenzyT>0){m.dmg*=1.4;m.speed*=1.3;}}
  m.speed*=1+gearSum('spd')/100;m.xp*=1+gearSum('xp')/100;m.coins*=1+gearSum('coin')/100;
  return m;}

/* ---- economy / craft / build data (v1) ---- */
const RES_KEYS=['wood','stone','fiber','ore'];
const RES_ICON={wood:'🪵',stone:'🪨',fiber:'🌿',ore:'⛏️'};
const SELL_PRICE={wood:2,stone:2,fiber:2,ore:6};
const SHOP_ITEMS=[{key:'berry',name:'Berry',price:15},{key:'potion',name:'Potion',price:30},{key:'ration',name:'Ration',price:25}];
const TOOLS={axe:{icon:'🪓',tiers:[{name:'Axe I',cost:{wood:3,stone:2}},{name:'Axe II',cost:{wood:5,ore:3},station:'forge'},{name:'Axe III',cost:{wood:8,ore:6},station:'forge'}]},
  pickaxe:{icon:'⛏️',tiers:[{name:'Pickaxe I',cost:{wood:3,stone:3}},{name:'Pickaxe II',cost:{wood:5,ore:4},station:'forge'},{name:'Pickaxe III',cost:{wood:8,ore:7},station:'forge'}]}};
const BUILD_DEF={
  campfire:{name:'Campfire',hp:60,light:1},torch:{name:'Torch',hp:40,light:1},
  wall:{name:'Wall',hp:160,solid:1,eSolid:1},door:{name:'Door',hp:120,eSolid:1},
  hut:{name:'Hut',hp:320,solid:1,eSolid:1,light:1},chest:{name:'Chest',hp:120,eSolid:1},
  table:{name:'Craft Table',hp:100,eSolid:1},forge:{name:'Forge',hp:160,eSolid:1,light:1},
  spike:{name:'Spike Trap',hp:30,trap:1,uses:4},snare:{name:'Snare Trap',hp:20,trap:1,uses:3},
  tarrow:{name:'Arrow Tower',hp:200,solid:1,eSolid:1,tower:1},
  tfrost:{name:'Frost Tower',hp:180,solid:1,eSolid:1,tower:1,light:1},
  tcata:{name:'Catapult',hp:220,solid:1,eSolid:1,tower:1}};
const TOWERS={
  tarrow:{name:'Arrow Tower',ammo:'wood',ammoPer:6,col:0xe8c464,tiers:[{dmg:10,range:4.2,rate:0.7},{dmg:16,range:4.8,rate:0.55},{dmg:24,range:5.4,rate:0.4}],up:[{wood:8,stone:4},{wood:12,ore:5}]},
  tfrost:{name:'Frost Tower',ammo:'fiber',ammoPer:6,col:0x7ad0ff,tiers:[{dmg:5,range:3.6,rate:0.9,slow:1.6},{dmg:8,range:4.2,rate:0.75,slow:2.2},{dmg:12,range:4.6,rate:0.6,slow:3}],up:[{stone:8,fiber:6},{ore:6,fiber:8}]},
  tcata:{name:'Catapult',ammo:'stone',ammoPer:4,col:0xd89a5a,tiers:[{dmg:16,range:5.2,rate:1.8,aoe:1.2},{dmg:24,range:5.8,rate:1.5,aoe:1.4},{dmg:36,range:6.4,rate:1.2,aoe:1.6}],up:[{wood:10,stone:10},{ore:8,stone:12}]}};
const TRAPS={spike:{dmg:20,cd:0.8},snare:{root:2.5,cd:0.5}};
const RECIPES=[
  {key:'campfire',cost:{wood:5},lvl:1,desc:'Warm light. Place anywhere.'},
  {key:'torch',cost:{wood:2,fiber:2},lvl:1,desc:'Bright light. Place anywhere.'},
  {key:'wall',cost:{wood:2,stone:2},lvl:1,plot:1,desc:'Blocks enemies.'},
  {key:'door',cost:{wood:4},lvl:1,plot:1,desc:'You pass, enemies don\'t.'},
  {key:'chest',cost:{wood:6},lvl:1,plot:1,desc:'Bank materials — safe on death!'},
  {key:'table',cost:{wood:6,stone:2},lvl:1,plot:1,desc:'Unlocks advanced recipes nearby.'},
  {key:'forge',cost:{stone:10,wood:4},lvl:2,plot:1,station:'table',desc:'Smith tier-2+ tools nearby.'},
  {key:'hut',cost:{wood:12,stone:6},lvl:2,plot:1,desc:'Rest & heal point.'},
  {key:'spike',cost:{wood:3,stone:2},lvl:2,plot:1,station:'table',desc:'Wounds raiders (4 uses).'},
  {key:'snare',cost:{fiber:4},lvl:2,plot:1,station:'table',desc:'Roots an enemy (3 uses).'},
  {key:'tarrow',cost:{wood:10,stone:4},lvl:2,plot:1,station:'table',desc:'Auto-fires. Ammo: wood.'},
  {key:'tfrost',cost:{stone:8,fiber:6},lvl:3,plot:1,station:'forge',desc:'Slows. Ammo: fiber.'},
  {key:'tcata',cost:{wood:12,stone:12},lvl:3,plot:1,station:'forge',desc:'AoE. Ammo: stone.'},
  {key:'potion',item:1,cost:{fiber:2,berry:1},lvl:1,desc:'Heals 60 HP.'},
  {key:'ration',item:1,cost:{fiber:3},lvl:1,desc:'Fills hunger.'}];
const NODE_KIND={wood:{give:'wood',amt:[1,2],label:'Gather'},stone:{give:'stone',amt:[1,2],label:'Mine'},
  fiber:{give:'fiber',amt:[1,3],label:'Gather'},ore:{give:'ore',amt:[1,2],label:'Mine',tool:'pickaxe'}};
const CLASS_PERK={warrior:1.25,ranger:1,mage:1}; // warrior: +25% building HP
const PLOTS=[];
let plotIndex={};
function plotAt(x,y){return plotIndex[x+','+y]||null;}
function ownsAt(x,y){const p=plotAt(x,y);return !!(p&&G&&G.plots&&G.plots[p.id]);}
function craftXpToNext(l){return 4+l*3;}
function haveCost(cost){for(const k in cost){const have=(k==='berry')?(G.items.berry||0):(G.res[k]||0);if(have<cost[k])return false;}return true;}
function payCost(cost){for(const k in cost){if(k==='berry')G.items.berry-=cost[k];else G.res[k]-=cost[k];}}
function costStr(cost){return Object.entries(cost).map(([k,v])=>v+' '+k).join(', ');}
function gainCraftXp(){G.craftXp++;while(G.craftXp>=craftXpToNext(G.craftLvl)){G.craftXp-=craftXpToNext(G.craftLvl);G.craftLvl++;toast('🔨 Crafting Lv.'+G.craftLvl);sfx('level');}}
function absDay(){return (G&&(G.day||1)+(G.time||0))||1;}
function nodeSpec(tx,ty){
  if(tileAt(tx,ty)!=='.')return null;if(plotAt(tx,ty))return null;
  const wx=(tx+0.5)*TILE,wy=(ty+0.5)*TILE;
  if(townDist(wx,wy)<6.5)return null;
  if(hash(tx*5.7+3,ty*9.1+7)>0.05)return null;
  const r=hash(tx*2.3,ty*4.9),zl=zoneLevel(wx,wy);
  let k=r<0.34?'wood':r<0.58?'stone':r<0.84?'fiber':'ore';
  if(k==='ore'&&zl<4)k='stone';
  return {k,x:wx,y:wy,tx,ty};}
function nodeReady(tx,ty){const t=(G&&G.nodeT||{})[tx+','+ty];return !t||absDay()>=t;}

let superC=0;
function addSuper(a){superC=Math.min(100,superC+a*mods().superGain);}
function abilityKey(){return {mage:'shield',warrior:'warcry',ranger:'quiver'}[(G&&G.class)||'mage'];}
function abilityRank(){return (G&&G.skills&&G.skills[abilityKey()])||0;}
function runeKey(){return {mage:'firewall',warrior:'spikewall',ranger:'thornwall'}[(G&&G.class)||'mage'];}
const SPELLBOOK={
  strike:{name:()=>({mage:'Power Bolt',warrior:'Heavy Blow',ranger:'Power Shot'}[G.class]),icon:()=>'\ud83d\udca5',cv:0,
    desc:'Heavy attack \u2014 1.9\u00d7 damage \u00b7 5s cooldown',avail:()=>true},
  nova:{name:()=>({mage:'Nova Burst',warrior:'Whirlwind',ranger:'Arrow Fan'}[G.class]),icon:()=>'\u2734\ufe0f',cv:0,
    desc:'All-around burst \u00b7 8s cooldown',avail:()=>((G.skills||{}).multi||0)>0,lock:'Learn Split Shot (Spell tree)'},
  active:{name:()=>{const n=SKILLS.find(s2=>s2.key===abilityKey());return n?n.name:'Active';},
    icon:()=>({mage:'shield',warrior:'horn',ranger:'quiver'}[G.class]),cv:1,
    desc:'Your class ACTIVE skill',avail:()=>abilityRank()>0,lock:'Learn it in the Spell tree'},
  rune:{name:()=>wallDef().nm,
    icon:()=>({mage:'firewall',warrior:'spikes',ranger:'thorns'}[G.class]),cv:1,
    desc:'SWIPE spell \u2014 tap, then draw its path',avail:()=>runeRank()>0,lock:'Learn it in the Spell tree'}};
function autoEquip(k){if(!G.loadout)G.loadout=[];
  if(G.loadout.length<3&&!G.loadout.includes(k)){G.loadout.push(k);return true;}return false;}
function runeRank(){return (G&&G.skills&&G.skills[runeKey()])||0;}
function damageHero(d){if(!G)return 0;
  if(isMSub('chrono')&&scene&&(scene.rewindCD||0)<=0){scene.rewindCD=20;
    scene.cameras.main.flash(200,120,200,255);
    toast('⏳ Time rewinds — the blow never lands!');sfx('cast');return 0;}
  if(isWSub('juggernaut')&&Math.random()<0.25){
    if(scene){scene.hitEmit.setPosition(isoX(scene.px,scene.py),isoY(scene.px,scene.py)-22);scene.hitEmit.explode(6);}
    sfx('cast');return 0;}
  if(isWSub('blademaster')&&scene&&scene.parryT>0){
    let best=null,bd=TILE*2.5;
    for(const e of scene.enemies){const dd=Math.hypot(e.x-scene.px,e.y-scene.py);if(dd<bd){bd=dd;best=e;}}
    if(best)scene.hurtEnemy(best,Math.max(3,d*2),Math.atan2(best.y-scene.py,best.x-scene.px));
    toast('⚔ PARRY!');sfx('cast');return 0;}
  if(scene&&scene.shieldT>0&&scene.shieldHp>0){const a=Math.min(scene.shieldHp,d);scene.shieldHp-=a;d-=a;
    if(scene.shieldHp<=0){scene.shieldT=0;toast('🛡 Shield broke!');sfx('fail');}}
  if(scene&&scene.warcryT>0)d=Math.round(d*0.6);
  if(isWSub('berserker')&&scene)scene.rage=Math.min(100,(scene.rage||0)+d*1.2);
  G.hp=Math.max(0,G.hp-d);return d;}
function recalcHero(){const b=CLASS_BASE[G.class],L=G.level,S=G.skills||{};
  let mh=Math.floor(b.hp*(1+(L-1)*0.14))+10;mh=Math.floor(mh*(1+0.06*(S.vitality||0)));
  G.maxHp=mh+gearSum('hp');
  G._atk=Math.floor((Math.floor(b.atk*(1+(L-1)*0.11))+3)*(1+0.04*(S.might||0)))+gearSum('atk');
  G._def=Math.floor((Math.floor(b.def*(1+(L-1)*0.10))+2)*(1+0.05*(S.iron||0)))+gearSum('def');
  if(G.class==='warrior'&&G.element==='juggernaut')G._def=Math.floor(G._def*1.2);
  if(G.class==='ranger'&&G.element==='warden')G._def=Math.floor(G._def*1.15);
  if(G.class==='ranger'&&G.element==='sharpshooter')G.maxHp=Math.floor(G.maxHp*0.9);
  if(fullSet()){G._atk=Math.floor(G._atk*1.12);G._def=Math.floor(G._def*1.12);G.maxHp=Math.floor(G.maxHp*1.08);}
  if(G.hp>G.maxHp)G.hp=G.maxHp;}
function newGame(cls2,elem,name){
  G={class:cls2,level:1,xp:0,hp:0,maxHp:0,_atk:0,_def:0,hunger:100,energy:100,
    coins:40,items:{berry:3,potion:0,ration:1},skills:{},skillPoints:0,
    equip:{weapon:null,helm:null,armor:null,boots:null,trinket:null,charm:null},gear:[],
    px:(TOWNS[0].cx+1.5)*TILE,py:(TOWNS[0].cy+1.5)*TILE,time:0.35,day:1,berriesPicked:{},
    res:{wood:0,stone:0,fiber:0,ore:0},bank:{wood:0,stone:0,fiber:0,ore:0},tools:{axe:0,pickaxe:0},
    plots:{},builds:[],craftLvl:1,craftXp:0,nodeT:{},raid:null,loadout:['strike'],
    element:elem||'fire',name:(name||'').slice(0,12)||'Hero',seen:{},quests:[],trackQ:null};
  recalcHero();G.hp=G.maxHp;save();}
function save(){try{if(G&&scene){if(dungeon){G.px=dungeon.returnX;G.py=dungeon.returnY;}else{G.px=scene.px;G.py=scene.py;}}localStorage.setItem(SAVE_KEY,JSON.stringify(G));}catch(e){}}
function load(){try{const r=localStorage.getItem(SAVE_KEY);if(!r)return false;G=JSON.parse(r);
  if(!G.berriesPicked)G.berriesPicked={};
  if(!G.res)G.res={wood:0,stone:0,fiber:0,ore:0};if(!G.bank)G.bank={wood:0,stone:0,fiber:0,ore:0};
  if(!G.tools)G.tools={axe:0,pickaxe:0};if(!G.plots)G.plots={};if(!G.builds)G.builds=[];
  if(G.craftLvl===undefined)G.craftLvl=1;if(G.craftXp===undefined)G.craftXp=0;
  if(!G.nodeT)G.nodeT={};if(G.raid===undefined)G.raid=null;
  if(!G.loadout){G.loadout=['strike'];if(abilityRank()>0)autoEquip('active');if(runeRank()>0)autoEquip('rune');}
  if(G.quest&&!G.quests){G.quests=[Object.assign({town:0},G.quest)];G.quest=null;}
  if(!G.quests)G.quests=[];if(G.trackQ===undefined)G.trackQ=null;
  if(!G.questsDone)G.questsDone=0;if(!G.bossRespawn)G.bossRespawn=0;
  if(!G.element)G.element={mage:'fire',ranger:'beastmaster',warrior:'berserker'}[G.class]||'fire';
  if(G.class==='warrior'&&!SUBCLASSES.warrior[G.element])
    G.element={fire:'berserker',frost:'juggernaut',storm:'blademaster',arcane:'warlord'}[G.element]||'berserker';
  if(G.class==='ranger'&&!SUBCLASSES.ranger[G.element])
    G.element={fire:'sharpshooter',frost:'trapper',storm:'beastmaster',arcane:'warden'}[G.element]||'beastmaster';
  if(G.class==='mage'&&!SUBCLASSES.mage[G.element])
    G.element={frost:'chrono',arcane:'necro'}[G.element]||'fire';
  if(!G.name)G.name={warrior:'Warrior',mage:'Mage',ranger:'Ranger'}[G.class];
  if(!G.seen){G.seen={};for(const t of TOWNS)revealAt((t.cx+0.5)*TILE,(t.cy+0.5)*TILE);revealAt(G.px,G.py);}
  recalcHero();return true;}catch(e){return false;}}
function rollGear(lvl,minR){
  const roll=Math.random();let ri=roll<0.5?0:roll<0.8?1:roll<0.95?2:3;ri=Math.max(ri,minR||0);
  const R=RARITIES[ri],slot=GEAR_SLOTS[Math.floor(Math.random()*GEAR_SLOTS.length)];
  const base=slot==='weapon'?GEAR_NAMES.weapon[G.class]:GEAR_NAMES[slot][Math.floor(Math.random()*4)];
  const pool=AFFIX_POOL.slice(),stats={};
  for(let i=0;i<R.affixes;i++){const a=pool.splice(Math.floor(Math.random()*pool.length),1)[0];
    stats[a.k]=Math.max(1,Math.round((a.base+lvl*a.per)*R.mult*(0.8+Math.random()*0.4)));}
  const it={slot,rar:ri,name:GEAR_PREFIX[R.key][Math.floor(Math.random()*3)]+' '+base,lvl,stats};
  if(ri>=1&&Math.random()<0.15){const sn=SETS[G.class].name;
    it.set=sn;it.name=sn+' '+base;
    stats[G.class==='warrior'?'def':G.class==='mage'?'atk':'spd']=(stats[G.class==='warrior'?'def':G.class==='mage'?'atk':'spd']||0)+Math.max(2,Math.round(lvl*0.8));}
  return it;}
function statStr(it){const L={atk:'⚔',def:'🛡',hp:'❤',spd:'👟%',xp:'✦%',coin:'◉%'};
  return Object.entries(it.stats).map(([k,v])=>L[k]+'+'+v).join(' · ');}
function gearRarCol(slot){const it=G&&G.equip[slot];return (it&&it.rar>0)?RARITIES[it.rar].col:null;}
function grantXp(a){G.xp+=Math.round(a*mods().xp);
  while(G.xp>=xpToNext(G.level)&&G.level<50){G.xp-=xpToNext(G.level);G.level++;
    G.skillPoints=(G.skillPoints||0)+1;const b=G.maxHp;recalcHero();G.hp+=Math.max(0,G.maxHp-b);
    toast('⭐ Level '+G.level+'! +1 skill point');}
  save();}

const VILLAGER_LINES=[
 'Deep wilds hold Lv.20+ monsters… and the best ore.',
 'Buy land and raiders WILL come. Build arrow towers!',
 'A chest banks your materials — safe even if you fall.',
 'The forge unlocks tier-2 tools. Better tools, bigger hauls.',
 'Purple-named monsters always drop gear!'];
function openShop(){pauseGame(true);const p=document.getElementById('panel');
  let h='<h2>🛒 Trader\'s Mart</h2>';
  h+=`<div class="subline" style="color:#ffd23c">◉ ${G.coins} coins</div>`;
  h+='<div class="subline" style="color:#f2c14e;font-weight:700">BUY</div><div class="plist">';
  SHOP_ITEMS.forEach(s2=>{h+=`<div class="pcard"><div style="flex:1"><b>${s2.name}</b> <span style="color:#c98b3a">${s2.price}c</span> <span class="lv">owned ${G.items[s2.key]||0}</span></div>
    <button class="cbtn" data-buy="${s2.key}" ${G.coins<s2.price?'disabled':''}>Buy</button></div>`;});
  h+='</div><div class="subline" style="color:#f2c14e;font-weight:700;margin-top:6px">SELL MATERIALS</div><div class="plist">';
  RES_KEYS.forEach(k=>{const n=G.res[k]||0;
    h+=`<div class="pcard" style="${n?'':'opacity:.55'}"><div style="flex:1"><b>${RES_ICON[k]} ${k}</b> <span class="lv">×${n}</span></div>
      <button class="cbtn" data-sell="${k}" ${n?'':'disabled'}>Sell +${n*SELL_PRICE[k]}c</button></div>`;});
  h+='</div><div class="prow" style="margin-top:8px"><button class="cbtn" id="shopClose">Leave</button></div>';
  p.innerHTML=h;
  p.querySelectorAll('[data-buy]').forEach(b=>b.onclick=()=>{const s2=SHOP_ITEMS.find(x=>x.key===b.dataset.buy);
    if(G.coins<s2.price)return;G.coins-=s2.price;G.items[s2.key]=(G.items[s2.key]||0)+1;sfx('coin');save();updateHud();openShop();});
  p.querySelectorAll('[data-sell]').forEach(b=>b.onclick=()=>{const k=b.dataset.sell,n=G.res[k]||0;if(!n)return;
    G.coins+=n*SELL_PRICE[k];G.res[k]=0;sfx('coin');save();updateHud();openShop();});
  document.getElementById('shopClose').onclick=()=>pauseGame(false);}
function openRegistrar(){pauseGame(true);const p=document.getElementById('panel');
  let h='<h2>🏛 Land Registrar</h2><div class="subline">Gold stakes = for sale · green = yours. Stand on a plot to buy it directly.</div><div class="plist">';
  PLOTS.forEach(pl=>{const own=G.plots[pl.id];
    h+=`<div class="pcard"><div style="flex:1"><b>${pl.town} plot</b> <span class="lv">${pl.w}×${pl.h}</span><br>
      <small style="color:#8a6d3a">${own?'✅ Owned':'Price: '+pl.price+'c'}</small></div>
      ${own?'':`<button class="cbtn" data-plot="${pl.id}" ${G.coins<pl.price?'disabled':''}>Buy</button>`}</div>`;});
  h+='</div><div class="prow" style="margin-top:8px"><button class="cbtn" id="regClose">Leave</button></div>';
  p.innerHTML=h;
  p.querySelectorAll('[data-plot]').forEach(b=>b.onclick=()=>{const pl=PLOTS.find(x=>x.id===b.dataset.plot);
    if(!pl||G.coins<pl.price)return;G.coins-=pl.price;G.plots[pl.id]=true;sfx('catch');
    if(scene&&scene.refreshPlots)scene.refreshPlots();save();updateHud();openRegistrar();});
  document.getElementById('regClose').onclick=()=>pauseGame(false);}
function nearStation(kind){if(!scene)return false;
  for(const b of G.builds){if(b.t!==kind)continue;
    if(Math.hypot((b.x+0.5)*TILE-scene.px,(b.y+0.5)*TILE-scene.py)<TILE*2.6)return true;}return false;}
const _bIcon={};
function buildIconSrc(key){
  if(_bIcon[key])return _bIcon[key];
  const cv=key==='hut'?bakeHouse({roofIdx:2}):key==='campfire'?bakeMisc('campfire'):key==='chest'?bakeBuild('chestB'):bakeBuild(key);
  _bIcon[key]=cv;return cv;}
function blitBuildIcons(p){
  p.querySelectorAll('canvas.bicon').forEach(cv=>{
    const src=buildIconSrc(cv.dataset.bk);
    cv.width=76;cv.height=76;
    const c=cv.getContext('2d');
    const s2=Math.min(76/src.width,76/src.height);
    const w=src.width*s2,h2=src.height*s2;
    c.imageSmoothingEnabled=true;
    c.drawImage(src,(76-w)/2,(76-h2)/2,w,h2);});}
function openCraft(){pauseGame(true);const p=document.getElementById('panel');const R=G.res;
  let h=`<h2>🔨 Crafting</h2><div class="subline">🔨 Lv.${G.craftLvl} (${G.craftXp}/${craftXpToNext(G.craftLvl)}) · 🪵${R.wood} 🪨${R.stone} 🌿${R.fiber} ⛏️${R.ore}</div>`;
  h+='<div class="subline" style="color:#f2c14e;font-weight:700">TOOLS</div><div class="plist">';
  for(const key of Object.keys(TOOLS)){const T2=TOOLS[key],tier=G.tools[key]||0,next=T2.tiers[tier];
    const ok=next&&haveCost(next.cost)&&(!next.station||nearStation(next.station));
    h+=`<div class="pcard"><div style="flex:1"><b>${T2.icon} ${next?next.name:T2.tiers[tier-1].name}</b> <span class="lv">${next?'tier '+(tier+1):'MAX'}</span><br>
      <small style="color:#5a4">${next?costStr(next.cost)+(next.station?' · near '+BUILD_DEF[next.station].name:''):'Top tier'}</small></div>
      <button class="cbtn" data-tool="${key}" ${ok?'':'disabled'}>${next?'Craft':'✓'}</button></div>`;}
  h+='</div><div class="subline" style="color:#f2c14e;font-weight:700;margin-top:6px">RECIPES</div><div class="plist">';
  for(const r of RECIPES){const lock=G.craftLvl<r.lvl,noSt=r.station&&!nearStation(r.station);
    const rc=scene&&scene.effCost?scene.effCost(r):r.cost;
    const ok=!lock&&!noSt&&haveCost(rc);
    const nm2=r.item?(r.key.charAt(0).toUpperCase()+r.key.slice(1)):BUILD_DEF[r.key].name;
    h+=`<div class="pcard" style="${ok?'':'opacity:.6'}">${r.item?'<div style="width:38px;text-align:center;font-size:24px;flex:none">🧪</div>':`<canvas class="bicon" data-bk="${r.key}"></canvas>`}<div style="flex:1;min-width:0"><b>${nm2}</b>${lock?' <span style="color:#c0392b">🔒Lv.'+r.lvl+'</span>':''}${noSt?' <span style="color:#c0392b">near '+BUILD_DEF[r.station].name+'</span>':''}${r.plot?' <span style="color:#3f7d34">⌂</span>':''}<br>
      <small style="color:#5a4">${r.desc} — ${costStr(rc)}</small></div>
      <button class="cbtn" data-craft="${r.key}" ${ok?'':'disabled'}>${r.item?'Craft':'Build'}</button></div>`;}
  h+='</div><div class="prow" style="margin-top:8px"><button class="cbtn" id="craftClose">◀ Close</button></div>';
  p.innerHTML=h;
  blitBuildIcons(p);
  p.querySelectorAll('[data-tool]').forEach(b=>b.onclick=()=>{const key=b.dataset.tool,T2=TOOLS[key],tier=G.tools[key]||0,next=T2.tiers[tier];
    if(!next||!haveCost(next.cost)||(next.station&&!nearStation(next.station)))return;
    payCost(next.cost);G.tools[key]=tier+1;gainCraftXp();sfx('level');toast(T2.icon+' '+next.name+' crafted!');save();openCraft();});
  p.querySelectorAll('[data-craft]').forEach(b=>b.onclick=()=>{const r=RECIPES.find(x=>x.key===b.dataset.craft);
    const rc=scene&&scene.effCost?scene.effCost(r):r.cost;
    if(G.craftLvl<r.lvl||!haveCost(rc)||(r.station&&!nearStation(r.station)))return;
    if(r.item){payCost(rc);G.items[r.key]=(G.items[r.key]||0)+1;gainCraftXp();sfx('coin');toast('Crafted '+r.key);save();openCraft();}
    else{scene.enterBuild(r.key,r);pauseGame(false);toast('Placing '+BUILD_DEF[r.key].name+' — tap a tile to aim it, ✓ to build');}});
  document.getElementById('craftClose').onclick=()=>pauseGame(false);}
function openBank(){pauseGame(true);const p=document.getElementById('panel');
  let h='<h2>📦 Storage Chest</h2><div class="subline">Banked materials survive death.</div><div class="plist">';
  for(const k of RES_KEYS)h+=`<div class="pcard"><div style="flex:1"><b>${RES_ICON[k]} ${k}</b></div><span class="lv">carry ${G.res[k]||0} · bank ${G.bank[k]||0}</span></div>`;
  h+='</div><div class="prow" style="margin-top:8px">';
  h+='<button class="cbtn" id="bkDep">⬇ Deposit all</button><button class="cbtn" id="bkTake">⬆ Withdraw all</button>';
  h+='<button class="cbtn" id="bkClose">Close</button></div>';
  p.innerHTML=h;
  document.getElementById('bkDep').onclick=()=>{for(const k of RES_KEYS){G.bank[k]=(G.bank[k]||0)+(G.res[k]||0);G.res[k]=0;}sfx('coin');save();openBank();};
  document.getElementById('bkTake').onclick=()=>{for(const k of RES_KEYS){G.res[k]=(G.res[k]||0)+(G.bank[k]||0);G.bank[k]=0;}sfx('coin');save();openBank();};
  document.getElementById('bkClose').onclick=()=>pauseGame(false);}
function openTower(b){pauseGame(true);const p=document.getElementById('panel');
  const T2=TOWERS[b.t],tier=T2.tiers[(b.tier||1)-1],up=(b.tier||1)<3?T2.up[(b.tier||1)-1]:null;
  let h=`<h2>${T2.name} — Tier ${b.tier||1}</h2>`;
  h+=`<div class="subline">💥 ${tier.dmg} · 📏 ${tier.range} tiles${tier.slow?' · ❄ slows':''}${tier.aoe?' · 💣 AoE':''} · Ammo <b style="color:#ffd23c">${b.ammo||0}</b> (${T2.ammo}) · HP ${Math.ceil(b.hp)}/${b.maxHp}</div>`;
  h+='<div class="prow" style="margin-top:8px">';
  h+=`<button class="cbtn" id="twLoad" ${!(G.res[T2.ammo]>0)?'disabled':''}>Load (1 ${T2.ammo} → ${T2.ammoPer} shots) · have ${G.res[T2.ammo]||0}</button>`;
  if(up)h+=`<button class="cbtn" id="twUp" ${haveCost(up)?'':'disabled'}>⬆ Tier ${(b.tier||1)+1} — ${costStr(up)}</button>`;
  h+=`<button class="cbtn" id="twClose">Close</button></div>`;
  p.innerHTML=h;
  document.getElementById('twLoad').onclick=()=>{if(!(G.res[T2.ammo]>0))return;G.res[T2.ammo]--;b.ammo=(b.ammo||0)+T2.ammoPer;sfx('coin');save();openTower(b);};
  const u=document.getElementById('twUp');if(u)u.onclick=()=>{if(!up||!haveCost(up))return;payCost(up);b.tier=(b.tier||1)+1;
    b.maxHp=Math.round(b.maxHp*1.3);b.hp=b.maxHp;sfx('level');save();openTower(b);};
  document.getElementById('twClose').onclick=()=>pauseGame(false);}
/* ---- menu icons (v1's drawn style) ---- */
function drawMenuIcon(cv,kind){
  const c=cv.getContext('2d'),s=cv.width,m=s/2,OL='#1c2716',W=s*0.085;
  c.clearRect(0,0,s,s);c.lineJoin='round';c.lineCap='round';c.strokeStyle=OL;c.lineWidth=W;
  const R=(x,y,w,h,r)=>{c.beginPath();c.moveTo(x+r,y);c.arcTo(x+w,y,x+w,y+h,r);c.arcTo(x+w,y+h,x,y+h,r);c.arcTo(x,y+h,x,y,r);c.arcTo(x,y,x+w,y,r);c.closePath();};
  const star=(cx,cy,Ro,ri)=>{c.beginPath();for(let i=0;i<8;i++){const a=i*Math.PI/4-Math.PI/2,d=i%2?ri:Ro;
    const px=cx+Math.cos(a)*d,py=cy+Math.sin(a)*d;i?c.lineTo(px,py):c.moveTo(px,py);}c.closePath();};
  switch(kind){
  case 'inventory':{ // leather satchel
    c.beginPath();c.arc(m,s*0.36,s*0.2,Math.PI,0);c.stroke();
    c.fillStyle='#b4854f';R(s*0.16,s*0.32,s*0.68,s*0.48,s*0.09);c.fill();c.stroke();
    c.fillStyle='#8a5a2e';R(s*0.16,s*0.32,s*0.68,s*0.2,s*0.09);c.fill();c.stroke();
    c.fillStyle='#ffd23c';R(m-s*0.06,s*0.44,s*0.12,s*0.13,s*0.03);c.fill();c.stroke();
    c.fillStyle='rgba(255,255,255,.25)';R(s*0.21,s*0.6,s*0.2,s*0.06,s*0.03);c.fill();break;}
  case 'skills':{ // gold sparkle stars
    c.fillStyle='#ffd23c';star(m-s*0.03,m+s*0.04,s*0.32,s*0.12);c.fill();c.stroke();
    c.fillStyle='#fff';c.beginPath();c.arc(m-s*0.1,m-s*0.05,s*0.05,0,7);c.fill();
    c.fillStyle='#ffd23c';star(s*0.76,s*0.24,s*0.11,s*0.045);c.fill();c.stroke();break;}
  case 'craft':{ // hammer
    c.save();c.translate(m,m);c.rotate(-0.6);
    c.fillStyle='#8a5a2b';R(-s*0.05,-s*0.06,s*0.1,s*0.42,s*0.04);c.fill();c.stroke();
    c.fillStyle='#b8bfc6';R(-s*0.23,-s*0.3,s*0.46,s*0.2,s*0.05);c.fill();c.stroke();
    c.fillStyle='rgba(255,255,255,.35)';R(-s*0.18,-s*0.27,s*0.17,s*0.06,s*0.03);c.fill();c.restore();break;}
  case 'guide':{ // parchment scroll
    c.fillStyle='#f2e6c8';R(s*0.22,s*0.18,s*0.56,s*0.64,s*0.06);c.fill();c.stroke();
    c.strokeStyle='#a8895a';c.lineWidth=W*0.55;
    for(let i=0;i<3;i++){c.beginPath();c.moveTo(s*0.32,s*(0.38+i*0.13));c.lineTo(s*0.68,s*(0.38+i*0.13));c.stroke();}
    c.strokeStyle=OL;c.lineWidth=W;
    c.fillStyle='#d8c49a';c.beginPath();c.ellipse(m,s*0.18,s*0.28,s*0.075,0,0,7);c.fill();c.stroke();break;}
  case 'soundOn': case 'soundOff':{ // speaker + waves or red X
    c.fillStyle='#6f7377';c.beginPath();
    c.moveTo(s*0.12,s*0.4);c.lineTo(s*0.28,s*0.4);c.lineTo(s*0.46,s*0.22);c.lineTo(s*0.46,s*0.78);c.lineTo(s*0.28,s*0.6);c.lineTo(s*0.12,s*0.6);c.closePath();c.fill();c.stroke();
    c.fillStyle='rgba(255,255,255,.22)';c.beginPath();c.moveTo(s*0.32,s*0.38);c.lineTo(s*0.42,s*0.28);c.lineTo(s*0.42,s*0.44);c.closePath();c.fill();
    if(kind==='soundOn'){c.strokeStyle='#54c23a';
      c.beginPath();c.arc(s*0.5,m,s*0.15,-0.85,0.85);c.stroke();
      c.beginPath();c.arc(s*0.5,m,s*0.28,-0.75,0.75);c.stroke();}
    else{c.strokeStyle='#e8483a';c.lineWidth=W*1.15;
      c.beginPath();c.moveTo(s*0.56,s*0.34);c.lineTo(s*0.84,s*0.66);c.moveTo(s*0.84,s*0.34);c.lineTo(s*0.56,s*0.66);c.stroke();}break;}
  case 'resume':{ // chunky play arrow
    const g=c.createLinearGradient(0,s*0.2,0,s*0.8);g.addColorStop(0,'#63d24a');g.addColorStop(1,'#37981f');
    c.fillStyle=g;c.beginPath();c.moveTo(s*0.3,s*0.2);c.lineTo(s*0.82,m);c.lineTo(s*0.3,s*0.8);c.closePath();c.fill();c.stroke();
    c.fillStyle='rgba(255,255,255,.3)';c.beginPath();c.moveTo(s*0.35,s*0.28);c.lineTo(s*0.6,s*0.41);c.lineTo(s*0.35,s*0.46);c.closePath();c.fill();break;}
  case 'w_warrior':{ // sword
    c.save();c.translate(m,m);c.rotate(-0.78);
    c.fillStyle='#cfd6dd';c.beginPath();c.moveTo(-s*0.055,s*0.1);c.lineTo(-s*0.055,-s*0.28);c.lineTo(0,-s*0.4);c.lineTo(s*0.055,-s*0.28);c.lineTo(s*0.055,s*0.1);c.closePath();c.fill();c.stroke();
    c.strokeStyle='rgba(0,0,0,.25)';c.lineWidth=W*0.5;c.beginPath();c.moveTo(0,-s*0.3);c.lineTo(0,s*0.07);c.stroke();
    c.strokeStyle=OL;c.lineWidth=W;
    c.fillStyle='#ffd23c';R(-s*0.16,s*0.1,s*0.32,s*0.085,s*0.03);c.fill();c.stroke();
    c.fillStyle='#6a4a26';R(-s*0.05,s*0.19,s*0.1,s*0.19,s*0.04);c.fill();c.stroke();
    c.fillStyle='#ffd23c';c.beginPath();c.arc(0,s*0.42,s*0.06,0,7);c.fill();c.stroke();c.restore();break;}
  case 'w_ranger':{ // bow with nocked arrow
    c.strokeStyle='#8a5a2b';c.lineWidth=W*1.35;
    c.beginPath();c.arc(m-s*0.1,m,s*0.32,-1.1,1.1);c.stroke();
    const x1=m-s*0.1+Math.cos(-1.1)*s*0.32,y1=m+Math.sin(-1.1)*s*0.32;
    const x2=m-s*0.1+Math.cos(1.1)*s*0.32,y2=m+Math.sin(1.1)*s*0.32;
    c.strokeStyle='#e8e2d0';c.lineWidth=W*0.5;c.beginPath();c.moveTo(x1,y1);c.lineTo(x2,y2);c.stroke();
    c.strokeStyle='#c9a15a';c.lineWidth=W*0.8;c.beginPath();c.moveTo(m-s*0.26,m);c.lineTo(m+s*0.28,m);c.stroke();
    c.fillStyle='#fff';c.strokeStyle=OL;c.lineWidth=W*0.55;
    c.beginPath();c.moveTo(m+s*0.4,m);c.lineTo(m+s*0.24,m-s*0.085);c.lineTo(m+s*0.28,m);c.lineTo(m+s*0.24,m+s*0.085);c.closePath();c.fill();c.stroke();break;}
  case 'w_mage':{ // wand with glowing star tip
    c.save();c.translate(m,m);c.rotate(0.78);
    c.fillStyle='#6a4a26';R(-s*0.05,-s*0.3,s*0.1,s*0.6,s*0.04);c.fill();c.stroke();c.restore();
    const tx=m+s*0.21,ty=m-s*0.21;
    c.fillStyle='#7ad0ff';c.shadowColor='#7ad0ff';c.shadowBlur=s*0.1;
    star(tx,ty,s*0.15,s*0.06);c.fill();c.shadowBlur=0;c.stroke();
    c.fillStyle='#fff';c.beginPath();c.arc(tx-s*0.03,ty-s*0.03,s*0.035,0,7);c.fill();break;}
  case 'shield':{ // heater shield
    const g2=c.createLinearGradient(0,s*0.15,0,s*0.85);g2.addColorStop(0,'#7ad0ff');g2.addColorStop(1,'#3f6fd6');
    c.fillStyle=g2;c.beginPath();c.moveTo(m,s*0.12);c.quadraticCurveTo(s*0.84,s*0.2,s*0.8,s*0.42);
    c.quadraticCurveTo(s*0.76,s*0.72,m,s*0.88);c.quadraticCurveTo(s*0.24,s*0.72,s*0.2,s*0.42);
    c.quadraticCurveTo(s*0.16,s*0.2,m,s*0.12);c.closePath();c.fill();c.stroke();
    c.fillStyle='#fff';star(m,s*0.45,s*0.14,s*0.055);c.fill();
    c.fillStyle='rgba(255,255,255,.25)';c.beginPath();c.moveTo(m,s*0.16);c.quadraticCurveTo(s*0.3,s*0.24,s*0.28,s*0.44);c.lineTo(s*0.38,s*0.3);c.closePath();c.fill();break;}
  case 'horn':{ // war horn
    c.fillStyle='#8a5a2b';c.beginPath();c.moveTo(s*0.2,s*0.62);c.quadraticCurveTo(s*0.3,s*0.85,s*0.62,s*0.74);
    c.quadraticCurveTo(s*0.86,s*0.64,s*0.82,s*0.36);c.lineTo(s*0.68,s*0.44);c.quadraticCurveTo(s*0.66,s*0.62,s*0.46,s*0.64);
    c.quadraticCurveTo(s*0.32,s*0.64,s*0.3,s*0.52);c.closePath();c.fill();c.stroke();
    c.fillStyle='#ffd23c';R(s*0.62,s*0.4,s*0.14,s*0.12,s*0.03);c.fill();c.stroke();
    c.strokeStyle='#ffb454';c.lineWidth=W*0.9;
    c.beginPath();c.moveTo(s*0.2,s*0.42);c.lineTo(s*0.3,s*0.3);c.moveTo(s*0.12,s*0.52);c.lineTo(s*0.2,s*0.24);c.stroke();break;}
  case 'quiver':{ // quiver with arrows
    c.save();c.translate(m,m);c.rotate(0.5);
    c.fillStyle='#8a5a2e';R(-s*0.14,-s*0.18,s*0.28,s*0.5,s*0.06);c.fill();c.stroke();
    c.strokeStyle='#c9a15a';c.lineWidth=W*0.8;
    for(const dx of[-s*0.07,0,s*0.07]){c.beginPath();c.moveTo(dx,-s*0.16);c.lineTo(dx*1.6,-s*0.4);c.stroke();}
    c.fillStyle='#a8e063';c.strokeStyle=OL;c.lineWidth=W*0.5;
    for(const dx of[-s*0.11,0,s*0.11]){c.beginPath();c.moveTo(dx*1.6,-s*0.46);c.lineTo(dx*1.6-s*0.05,-s*0.36);c.lineTo(dx*1.6+s*0.05,-s*0.36);c.closePath();c.fill();c.stroke();}
    c.restore();break;}
  case 'armor':{ // chestplate
    const g3=c.createLinearGradient(0,s*0.18,0,s*0.85);g3.addColorStop(0,'#c8cfd6');g3.addColorStop(1,'#828b94');
    c.fillStyle=g3;c.beginPath();c.moveTo(s*0.3,s*0.18);c.lineTo(s*0.7,s*0.18);c.lineTo(s*0.82,s*0.32);c.lineTo(s*0.72,s*0.44);
    c.lineTo(s*0.72,s*0.74);c.quadraticCurveTo(m,s*0.88,s*0.28,s*0.74);c.lineTo(s*0.28,s*0.44);c.lineTo(s*0.18,s*0.32);c.closePath();c.fill();c.stroke();
    c.strokeStyle='rgba(0,0,0,.3)';c.lineWidth=W*0.55;
    c.beginPath();c.moveTo(m,s*0.28);c.lineTo(m,s*0.8);c.stroke();
    c.beginPath();c.moveTo(s*0.34,s*0.5);c.quadraticCurveTo(m,s*0.58,s*0.66,s*0.5);c.stroke();
    c.fillStyle='#ffd23c';c.strokeStyle=OL;c.lineWidth=W*0.5;c.beginPath();c.arc(m,s*0.33,s*0.055,0,7);c.fill();c.stroke();
    c.fillStyle='rgba(255,255,255,.3)';c.beginPath();c.ellipse(s*0.38,s*0.3,s*0.05,s*0.09,-0.3,0,7);c.fill();break;}
  case 'firewall':{ // flame
    const gf=c.createLinearGradient(0,s*0.15,0,s*0.85);gf.addColorStop(0,'#ffd23c');gf.addColorStop(1,'#ff6a1e');
    c.fillStyle=gf;c.beginPath();
    c.moveTo(m,s*0.1);c.quadraticCurveTo(s*0.82,s*0.42,s*0.76,s*0.6);
    c.quadraticCurveTo(s*0.72,s*0.84,m,s*0.88);c.quadraticCurveTo(s*0.28,s*0.84,s*0.24,s*0.6);
    c.quadraticCurveTo(s*0.18,s*0.42,m,s*0.1);c.closePath();c.fill();c.stroke();
    c.fillStyle='#fff2c8';c.beginPath();c.ellipse(m,s*0.64,s*0.11,s*0.16,0,0,7);c.fill();break;}
  case 'spikes':{ // stone spikes
    c.fillStyle='#a8b0b8';
    for(const[bx,h]of[[0.28,0.34],[0.5,0.52],[0.72,0.38]]){c.beginPath();
      c.moveTo(s*(bx-0.13),s*0.82);c.lineTo(s*bx,s*(0.82-h));c.lineTo(s*(bx+0.13),s*0.82);
      c.closePath();c.fill();c.stroke();}
    c.fillStyle='rgba(255,255,255,.3)';c.beginPath();
    c.moveTo(s*0.44,s*0.72);c.lineTo(s*0.5,s*0.36);c.lineTo(s*0.5,s*0.72);c.closePath();c.fill();break;}
  case 'thorns':{ // thorny vines
    c.strokeStyle='#3f7d34';c.lineWidth=W*1.3;
    c.beginPath();c.moveTo(s*0.14,s*0.72);c.quadraticCurveTo(s*0.4,s*0.2,s*0.86,s*0.4);c.stroke();
    c.beginPath();c.moveTo(s*0.16,s*0.4);c.quadraticCurveTo(s*0.5,s*0.75,s*0.84,s*0.66);c.stroke();
    c.fillStyle='#5da53f';c.strokeStyle=OL;c.lineWidth=W*0.5;
    for(const[tx2,ty2,a]of[[0.34,0.42,-0.6],[0.58,0.3,0.4],[0.5,0.62,2.6],[0.72,0.56,1.8]]){
      c.save();c.translate(s*tx2,s*ty2);c.rotate(a);
      c.beginPath();c.moveTo(-s*0.05,0);c.lineTo(0,-s*0.12);c.lineTo(s*0.05,0);c.closePath();c.fill();c.stroke();c.restore();}break;}
  case 'helm':{ // knight helm
    const hg2=c.createLinearGradient(0,s*0.2,0,s*0.8);hg2.addColorStop(0,'#c8cfd6');hg2.addColorStop(1,'#828b94');
    c.fillStyle=hg2;c.beginPath();c.arc(m,s*0.45,s*0.3,Math.PI,0);
    c.lineTo(s*0.8,s*0.72);c.quadraticCurveTo(m,s*0.8,s*0.2,s*0.72);c.closePath();c.fill();c.stroke();
    c.fillStyle='#2a2f36';R(s*0.26,s*0.48,s*0.48,s*0.12,s*0.05);c.fill();
    c.fillStyle='#ffb454';c.beginPath();c.moveTo(m-s*0.03,s*0.16);c.quadraticCurveTo(s*0.62,s*0.08,s*0.56,s*0.28);c.quadraticCurveTo(m,s*0.2,m-s*0.03,s*0.16);c.closePath();c.fill();c.stroke();
    c.fillStyle='rgba(255,255,255,.3)';c.beginPath();c.ellipse(s*0.38,s*0.32,s*0.08,s*0.05,-0.4,0,7);c.fill();break;}
  case 'boots':{ // leather boot
    c.fillStyle='#6b4a2a';c.beginPath();
    c.moveTo(s*0.34,s*0.2);c.lineTo(s*0.56,s*0.2);c.lineTo(s*0.56,s*0.52);
    c.quadraticCurveTo(s*0.82,s*0.54,s*0.82,s*0.7);c.quadraticCurveTo(s*0.82,s*0.78,s*0.7,s*0.78);
    c.lineTo(s*0.36,s*0.78);c.quadraticCurveTo(s*0.3,s*0.78,s*0.3,s*0.68);c.closePath();c.fill();c.stroke();
    c.fillStyle='#4a3018';R(s*0.3,s*0.66,s*0.52,s*0.12,s*0.05);c.fill();c.stroke();
    c.strokeStyle='rgba(0,0,0,.3)';c.lineWidth=W*0.5;
    c.beginPath();c.moveTo(s*0.38,s*0.3);c.lineTo(s*0.52,s*0.3);c.moveTo(s*0.38,s*0.4);c.lineTo(s*0.52,s*0.4);c.stroke();break;}
  case 'ring':{ // gold ring with gem
    c.strokeStyle='#ffd23c';c.lineWidth=W*1.6;
    c.beginPath();c.arc(m,s*0.56,s*0.2,0,7);c.stroke();
    c.strokeStyle=OL;c.lineWidth=W*0.6;
    c.beginPath();c.arc(m,s*0.56,s*0.2+W*0.8,0,7);c.stroke();
    c.beginPath();c.arc(m,s*0.56,s*0.2-W*0.8,0,7);c.stroke();
    c.fillStyle='#7ad0ff';c.strokeStyle=OL;c.lineWidth=W*0.7;
    c.beginPath();c.moveTo(m,s*0.14);c.lineTo(m+s*0.11,s*0.26);c.lineTo(m,s*0.38);c.lineTo(m-s*0.11,s*0.26);c.closePath();c.fill();c.stroke();
    c.fillStyle='#fff';c.beginPath();c.arc(m-s*0.03,s*0.22,s*0.03,0,7);c.fill();break;}
  case 'orb':{ // charm orb on stand
    c.fillStyle='#6a4a26';R(s*0.32,s*0.66,s*0.36,s*0.14,s*0.05);c.fill();c.stroke();
    const og=c.createRadialGradient(m-s*0.08,s*0.36,s*0.03,m,s*0.42,s*0.3);
    og.addColorStop(0,'#e8d8ff');og.addColorStop(0.5,'#c07aff');og.addColorStop(1,'#6a3ab0');
    c.fillStyle=og;c.beginPath();c.arc(m,s*0.42,s*0.26,0,7);c.fill();c.stroke();
    c.fillStyle='rgba(255,255,255,.7)';c.beginPath();c.arc(m-s*0.09,s*0.33,s*0.05,0,7);c.fill();break;}
  case 'dash':{ // speed streaks + body
    c.strokeStyle='#eaf6ff';c.lineWidth=W*1.15;
    for(const[dy,x0,l]of[[-0.15,0.14,0.3],[0,0.1,0.42],[0.15,0.16,0.26]]){
      c.beginPath();c.moveTo(s*x0,m+s*dy);c.lineTo(s*x0+s*l,m+s*dy);c.stroke();}
    c.fillStyle='#fff';c.strokeStyle=OL;c.lineWidth=W*0.8;
    c.beginPath();c.arc(s*0.72,m,s*0.14,0,7);c.fill();c.stroke();break;}
  case 'blink':{ // swirl portal
    c.strokeStyle='#d8c9ff';c.lineWidth=W*1.1;
    c.beginPath();for(let a=0;a<5.2;a+=0.14){const r=s*0.06+a*s*0.052;
      const px=m+Math.cos(a*1.75)*r,py=m+Math.sin(a*1.75)*r;a===0?c.moveTo(px,py):c.lineTo(px,py);}c.stroke();
    c.fillStyle='#fff';c.beginPath();c.arc(m,m,s*0.075,0,7);c.fill();
    c.fillStyle='#ffd23c';star(s*0.78,s*0.2,s*0.09,s*0.038);c.fill();break;}
  }
}
function setBtnIcon(el,kind,px){el.innerHTML='';const cv=document.createElement('canvas');
  cv.width=px*2;cv.height=px*2;cv.style.width=px+'px';cv.style.height=px+'px';cv.style.display='block';
  drawMenuIcon(cv,kind);el.appendChild(cv);}
/* ---- hero paperdoll (v1 heroPreview with gear accents) ---- */
function gearCol(it){return it?(it.set?'#2fd06a':(it.rar>0?RARITIES[it.rar].col:null)):null;}
function setCount(){if(!G)return 0;let n=0;for(const sl of GEAR_SLOTS){const it=G.equip[sl];if(it&&it.set)n++;}return n;}
function fullSet(){return setCount()>=6;}
function heroPreview(cv,cls2,withGear){
  const c=cv.getContext('2d');c.clearRect(0,0,cv.width,cv.height);
  const src=bakeHero(cls2,0,'idle');
  const s=Math.min(cv.width/130,cv.height/130);
  const w=130*s,h=130*s,ox=(cv.width-w)/2,oy=(cv.height-h)/2;
  const px=(lx,ly)=>({x:ox+lx*s,y:oy+ly*s});
  c.imageSmoothingEnabled=true;
  if(withGear&&G&&fullSet()){ // full-set aura behind the hero
    const p0=px(65,72);
    const g=c.createRadialGradient(p0.x,p0.y,4,p0.x,p0.y,60*s);
    g.addColorStop(0,'rgba(150,255,120,.55)');g.addColorStop(1,'rgba(150,255,120,0)');
    c.fillStyle=g;c.beginPath();c.arc(p0.x,p0.y,60*s,0,7);c.fill();}
  c.drawImage(src,ox,oy,w,h);
  if(withGear&&G){
    const glow=(lx,ly,r,col)=>{if(!col)return;const p0=px(lx,ly);
      c.save();c.globalAlpha=0.7;c.shadowColor=col;c.shadowBlur=10*s;
      c.fillStyle=col;c.beginPath();c.arc(p0.x,p0.y,r*s,0,7);c.fill();c.restore();};
    glow(81,80,4.5,gearCol(G.equip.weapon));
    glow(65,38,4,gearCol(G.equip.helm));
    glow(63,74,4,gearCol(G.equip.armor));
    glow(57,104,3.4,gearCol(G.equip.boots));glow(74,104,3.4,gearCol(G.equip.boots));
    glow(90,52,3.4,gearCol(G.equip.trinket));
    glow(41,62,3.4,gearCol(G.equip.charm));
    if(fullSet()){c.save();c.globalAlpha=0.9;c.fillStyle='#dfffc8';
      for(let i=0;i<6;i++){const aa=i/6*Math.PI*2,p0=px(65+Math.cos(aa)*34,66+Math.sin(aa)*40);
        c.beginPath();c.arc(p0.x,p0.y,2.2*s,0,7);c.fill();}c.restore();}}
}
let panelOpen=false;
function pauseGame(p){panelOpen=p;if(scene&&scene.scene){if(p)scene.scene.pause();else scene.scene.resume();}
  document.getElementById('panel').style.display=p?'flex':'none';}
function openPanel(){if(!G)return;pauseGame(true);const p=document.getElementById('panel');
  const C=CLASSES[G.class],hpPct=Math.max(0,G.hp/G.maxHp*100);
  const nm={warrior:'Warrior',mage:'Mage',ranger:'Ranger'}[G.class];
  let h=`<h2>${nm} <span style="font-size:14px;opacity:.8">Lv.${G.level}</span></h2>`;
  h+=`<div class="subline"><span style="color:#ffd23c">◉ ${G.coins}</span> · Day ${G.day} · engine beta</div>`;
  h+=`<div class="plist"><div class="pcard"><canvas width="56" height="56" id="heroCv" style="width:44px;height:44px"></canvas>
    <div style="flex:1"><div class="hpwrap"><i style="width:${hpPct}%"></i></div>
    <small>${Math.ceil(Math.max(0,G.hp))}/${G.maxHp} HP · ⚔ ${G._atk} · 🛡 ${G._def} · XP ${G.xp}/${xpToNext(G.level)}</small></div></div></div>`;
  h+=`<div class="subline">🪵${G.res.wood} 🪨${G.res.stone} 🌿${G.res.fiber} ⛏️${G.res.ore} · 🔨 Lv.${G.craftLvl} · 🪓${G.tools.axe||0} ⛏${G.tools.pickaxe||0}</div>`;
  h+=`<div class="menugrid">
    <div class="mtile" id="mChar"><canvas class="micon" data-ic="armor"></canvas>Character</div>
    <div class="mtile" id="mInv"><canvas class="micon" data-ic="inventory"></canvas>Inventory</div>
    <div class="mtile" id="mSkill"><canvas class="micon" data-ic="skills"></canvas>Skills${(G.skillPoints||0)>0?`<span class="badge">${G.skillPoints}</span>`:''}</div>
    <div class="mtile" id="mCraft"><canvas class="micon" data-ic="craft"></canvas>Craft &amp; Build</div>
    <div class="mtile" id="mMap"><canvas class="micon" data-ic="guide"></canvas>Map</div>
    <div class="mtile" id="mQuests"><canvas class="micon" data-ic="guide"></canvas>Quests${(G.quests||[]).filter(questDone).length?`<span class="badge">${G.quests.filter(questDone).length}</span>`:''}</div>
    <div class="mtile" id="mSound"><canvas class="micon" data-ic="${G.muted?'soundOff':'soundOn'}"></canvas>Sound ${G.muted?'Off':'On'}</div>
    <div class="mtile" id="mClose"><canvas class="micon" data-ic="resume"></canvas>Resume</div>
  </div>`;
  p.innerHTML=h;
  heroPreview(document.getElementById('heroCv'),G.class,true);
  p.querySelectorAll('canvas.micon').forEach(cv=>{cv.width=68;cv.height=68;drawMenuIcon(cv,cv.dataset.ic);});
  document.getElementById('mChar').onclick=()=>openCharacter();
  document.getElementById('mInv').onclick=()=>openInventory();
  document.getElementById('mSkill').onclick=()=>openSkills();
  document.getElementById('mMap').onclick=()=>openMap();
  document.getElementById('mQuests').onclick=()=>openQuests();
  document.getElementById('mCraft').onclick=openCraft;
  document.getElementById('mSound').onclick=()=>{G.muted=!G.muted;save();if(!G.muted)sfx('coin');openPanel();};
  document.getElementById('mClose').onclick=()=>pauseGame(false);}
const QUESTS=[
  {key:'slay',txt:'Slay 8 wild monsters',need:8,kind:'kill'},
  {key:'rare',txt:'Defeat 2 rare or alpha monsters',need:2,kind:'kill'},
  {key:'wood',txt:'Deliver 12 wood',need:12,kind:'bring',res:'wood'},
  {key:'stone',txt:'Deliver 10 stone',need:10,kind:'bring',res:'stone'},
  {key:'boss',txt:'Slay 💀 Direfang the Ravager',need:1,kind:'kill'}];
const _qpos={};
function questNpcPos(ti){if(_qpos[ti])return _qpos[ti];const t=TOWNS[ti]||TOWNS[0];
  for(let r=0;r<10;r++)for(let y=t.cy-r;y<=t.cy+r;y++)for(let x=t.cx-r;x<=t.cx+r;x++)
    if(grid[y]&&grid[y][x]==='Q'){_qpos[ti]={x,y};return _qpos[ti];}
  return {x:t.cx,y:t.cy};}
function townOffer(ti){return QUESTS[(G.day+ti*2+(G.questsDone||0))%QUESTS.length];}
function questDone(q){const def=QUESTS.find(x=>x.key===q.key);
  return def.kind==='bring'?(G.res[def.res]||0)>=q.need:(q.n||0)>=q.need;}
function questProg(q){const def=QUESTS.find(x=>x.key===q.key);
  return def.kind==='bring'?(G.res[def.res]||0)+'/'+q.need+' carried':(q.n||0)+'/'+q.need;}
function trackTargetLive(){
  if(G.trackQ==null)return null;const q=(G.quests||[])[G.trackQ];if(!q)return null;
  const def=QUESTS.find(x=>x.key===q.key);
  if(questDone(q)){const p=questNpcPos(q.town||0);return {x:p.x,y:p.y,t:'turnin'};}
  if(q.key==='boss')return {x:BOSS_LAIR.x,y:BOSS_LAIR.y,t:'boss'};
  if(scene&&(q.key==='slay'||q.key==='rare')){
    let best=null,bd=1e18;
    for(const e of scene.enemies){if(e.raider||e.boss)continue;
      if(q.key==='rare'&&!(e.rare||e.alpha))continue;
      const d=Math.hypot(e.x-scene.px,e.y-scene.py);if(d<bd){bd=d;best=e;}}
    if(best)return {x:best.x/TILE-0.5,y:best.y/TILE-0.5,t:'hunt'};
    if(q.key==='rare'){ // no rare alive: hunt near a cave
      let bc=null,bcd=1e9;const px2=Math.floor(scene.px/TILE),py2=Math.floor(scene.py/TILE);
      for(let y=2;y<MH-2;y++)for(let x=2;x<MW-2;x++)if(grid[y][x]==='C'){
        const d=Math.hypot(x-px2,y-py2);if(d<bcd){bcd=d;bc={x,y};}}
      if(bc)return {x:bc.x,y:bc.y,t:'hunt'};}
  }
  if(def&&def.kind==='bring'&&scene){
    const want=def.res,px2=Math.floor(scene.px/TILE),py2=Math.floor(scene.py/TILE);
    let best=null,bd=1e9;
    for(let y=Math.max(2,py2-26);y<Math.min(MH-2,py2+26);y++)
      for(let x=Math.max(2,px2-26);x<Math.min(MW-2,px2+26);x++){
        let ok=false;
        if(want==='wood')ok=grid[y][x]==='T';
        else{const nd2=nodeSpec(x,y);ok=!!nd2&&nd2.k===want&&nodeReady(x,y);}
        if(ok){const d=Math.hypot(x-px2,y-py2);if(d<bd){bd=d;best={x,y};}}}
    if(best)return {x:best.x,y:best.y,t:want};
  }
  const p=questNpcPos(q.town||0);return {x:p.x,y:p.y,t:'turnin'};}
function trackTarget(){return (scene&&scene._trk!==undefined)?scene._trk:trackTargetLive();}
function drawPinIcon(cv,t){
  const c=cv.getContext('2d'),S2=cv.width;c.clearRect(0,0,S2,S2);
  const m=S2/2;
  c.lineJoin='round';c.lineCap='round';
  const g=c.createLinearGradient(0,S2*0.05,0,S2*0.75);
  g.addColorStop(0,'#ffe082');g.addColorStop(1,'#f0a012');
  c.fillStyle=g;c.strokeStyle='#1c1408';c.lineWidth=S2*0.08;
  c.beginPath();c.arc(m,S2*0.38,S2*0.32,Math.PI*0.85,Math.PI*0.15);
  c.quadraticCurveTo(S2*0.62,S2*0.68,m,S2*0.92);
  c.quadraticCurveTo(S2*0.38,S2*0.68,m-Math.cos(Math.PI*0.15)*S2*0.32,S2*0.38+Math.sin(Math.PI*0.15)*S2*0.32);
  c.closePath();c.fill();c.stroke();
  c.fillStyle='#fff6e0';c.beginPath();c.arc(m,S2*0.38,S2*0.2,0,7);c.fill();
  c.strokeStyle='#1c1408';c.lineWidth=S2*0.05;c.stroke();
  const ink='#2a1c08';
  if(t==='turnin'){c.fillStyle=ink;
    c.beginPath();c.arc(m,S2*0.47,S2*0.045,0,7);c.fill();
    c.beginPath();c.moveTo(m-S2*0.035,S2*0.27);c.lineTo(m+S2*0.035,S2*0.27);
    c.lineTo(m+S2*0.02,S2*0.41);c.lineTo(m-S2*0.02,S2*0.41);c.closePath();c.fill();}
  else if(t==='hunt'){c.strokeStyle=ink;c.lineWidth=S2*0.055;
    c.beginPath();c.moveTo(m-S2*0.11,S2*0.49);c.lineTo(m+S2*0.11,S2*0.27);c.stroke();
    c.beginPath();c.moveTo(m+S2*0.11,S2*0.49);c.lineTo(m-S2*0.11,S2*0.27);c.stroke();
    c.lineWidth=S2*0.04;
    c.beginPath();c.moveTo(m-S2*0.13,S2*0.31);c.lineTo(m-S2*0.06,S2*0.31);c.stroke();
    c.beginPath();c.moveTo(m+S2*0.06,S2*0.31);c.lineTo(m+S2*0.13,S2*0.31);c.stroke();}
  else if(t==='boss'){c.fillStyle=ink;
    c.beginPath();c.arc(m,S2*0.35,S2*0.11,Math.PI,0);
    c.lineTo(m+S2*0.11,S2*0.45);c.lineTo(m-S2*0.11,S2*0.45);c.closePath();c.fill();
    c.fillStyle='#fff6e0';
    for(const dx of[-0.045,0.045]){c.beginPath();c.arc(m+dx*S2,S2*0.36,S2*0.032,0,7);c.fill();}}
  else if(t==='wood'){c.fillStyle='#8a5a2e';c.strokeStyle=ink;c.lineWidth=S2*0.035;
    c.fillRect(m-S2*0.13,S2*0.31,S2*0.26,S2*0.12);c.strokeRect(m-S2*0.13,S2*0.31,S2*0.26,S2*0.12);
    c.fillStyle='#d8b888';c.beginPath();c.arc(m-S2*0.13,S2*0.37,S2*0.055,0,7);c.fill();c.stroke();}
  else{c.fillStyle='#9aa2ac';c.strokeStyle=ink;c.lineWidth=S2*0.035;
    c.beginPath();c.moveTo(m-S2*0.12,S2*0.44);c.lineTo(m-S2*0.08,S2*0.3);c.lineTo(m+S2*0.05,S2*0.28);
    c.lineTo(m+S2*0.13,S2*0.38);c.lineTo(m+S2*0.06,S2*0.45);c.closePath();c.fill();c.stroke();}}
function openQuest(ti){ti=ti||0;pauseGame(true);const p=document.getElementById('panel');
  const tn2=TOWNS[ti]?TOWNS[ti].name:'Town';
  let h='<h2>❗ '+tn2+' Quest Board</h2>';
  const mine=G.quests.map((q,i)=>({q,i})).filter(o=>(o.q.town||0)===ti);
  if(mine.length){
    h+='<div class="plist" style="margin-top:6px">';
    for(const o of mine){const q=o.q,def=QUESTS.find(x=>x.key===q.key);
      const can=questDone(q),rw=30+G.level*6;
      h+=`<div class="pcard"><div style="flex:1;min-width:0"><b>${def.txt}</b> <span class="lv">${questProg(q)}</span><br>
        <small style="color:#5a4">Reward: ◉ ${rw} + gear</small></div>
        <button class="cbtn" data-turn="${o.i}" ${can?'':'disabled'}>${def.kind==='bring'?'Deliver':'Claim'}</button></div>`;}
    h+='</div>';}
  if(!mine.length&&G.quests.length<3){
    const q=townOffer(ti),rw=30+G.level*6;
    h+=`<div class="subline">"Psst, adventurer! Help ${tn2} and I'll make it worth your while."</div>`;
    h+=`<div class="pcard" style="max-width:500px;margin:8px auto 0;width:100%">
      <div style="flex:1;min-width:0"><b>${q.txt}</b><br>
      <small style="color:#5a4">Reward: ◉ ${rw} + a piece of ${q.key==='boss'?'EPIC':'quality'} gear</small></div>
      <button class="cbtn" id="qAccept">Accept</button></div>`;}
  else if(!mine.length)h+='<div class="subline" style="margin-top:8px">Your quest log is full (3/3).</div>';
  h+='<div class="subline" style="margin-top:8px">📜 Manage & track quests in the menu → Quests</div>';
  h+='<div class="prow" style="margin-top:8px"><button class="cbtn" id="qClose">Leave</button></div>';
  p.innerHTML=h;p.style.display='flex';
  const acc=document.getElementById('qAccept');
  if(acc)acc.onclick=()=>{const q=townOffer(ti);
    G.quests.push({key:q.key,need:q.need,n:0,town:ti});
    if(G.trackQ==null)G.trackQ=G.quests.length-1;
    sfx('menu');toast('Quest accepted: '+q.txt);save();openQuest(ti);};
  p.querySelectorAll('[data-turn]').forEach(b2=>b2.onclick=()=>{const i=+b2.dataset.turn,q=G.quests[i];
    if(!q||!questDone(q))return;
    const def=QUESTS.find(x=>x.key===q.key);
    if(def.kind==='bring')G.res[def.res]-=q.need;
    const rw=30+G.level*6;G.coins+=rw;
    const it=rollGear(G.level+1,q.key==='boss'?3:1);
    if(G.gear.length<15){G.gear.push(it);toast('🎁 Quest done! +'+rw+'c · '+it.name+' → bag');}
    else{scene.dropGear(scene.px,scene.py,it);toast('🎁 Quest done! +'+rw+'c · gear dropped (bag full)');}
    G.quests.splice(i,1);
    if(G.trackQ===i)G.trackQ=null;else if(G.trackQ>i)G.trackQ--;
    G.questsDone=(G.questsDone||0)+1;sfx('quest');save();updateHud();openQuest(ti);});
  document.getElementById('qClose').onclick=()=>pauseGame(false);}
function openQuests(){const p=document.getElementById('panel');
  let h='<h2>📜 Quest Log</h2>';
  h+=`<div class="subline">Active: ${G.quests.length}/3 · tap TRACK to follow one on screen</div>`;
  if(G.quests.length){h+='<div class="plist" style="margin-top:6px">';
    G.quests.forEach((q,i)=>{const def=QUESTS.find(x=>x.key===q.key);
      const tn2=TOWNS[q.town||0].name,can=questDone(q),tracked=G.trackQ===i;
      h+=`<div class="pcard" style="${tracked?'border-color:#ffd23c;box-shadow:0 0 10px rgba(255,210,60,.4),0 3px 0 rgba(0,0,0,.22)':''}">
        <div style="flex:1;min-width:0"><b>${def.txt}</b> <span class="lv">${questProg(q)}</span><br>
        <small style="color:#5a4">${tn2}${can?' · <b style="color:#3f7d34">READY — return to ❗</b>':''}</small></div>
        <button class="cbtn" data-tq="${i}">${tracked?'Untrack':'Track'}</button>
        <button class="cbtn" data-aq="${i}" style="opacity:.7">✕</button></div>`;});
    h+='</div>';}
  else h+='<div class="subline" style="margin-top:8px">No active quests — visit a ❗ villager in any town.</div>';
  h+='<div class="subline" style="margin-top:10px;color:#f2c14e;font-weight:700">OFFERED IN TOWNS</div><div class="plist" style="margin-top:4px">';
  TOWNS.forEach((t,i)=>{
    if(G.quests.some(q2=>(q2.town||0)===i)){h+=`<div class="pcard" style="opacity:.6"><div style="flex:1"><b>${t.name}</b><br><small>quest already taken</small></div></div>`;return;}
    const q=townOffer(i);
    h+=`<div class="pcard"><div style="flex:1;min-width:0"><b>${t.name}</b><br><small style="color:#5a4">${q.txt} — visit the ❗ villager to accept</small></div></div>`;});
  h+='</div><div class="prow" style="margin-top:8px"><button class="cbtn" id="qlBack">◀ Menu</button></div>';
  p.innerHTML=h;
  p.querySelectorAll('[data-tq]').forEach(b2=>b2.onclick=()=>{const i=+b2.dataset.tq;
    G.trackQ=(G.trackQ===i)?null:i;sfx('menu');save();openQuests();});
  p.querySelectorAll('[data-aq]').forEach(b2=>b2.onclick=()=>{const i=+b2.dataset.aq;
    G.quests.splice(i,1);
    if(G.trackQ===i)G.trackQ=null;else if(G.trackQ>i)G.trackQ--;
    sfx('menu');save();openQuests();});
  document.getElementById('qlBack').onclick=openPanel;}
function openMap(){const p=document.getElementById('panel');
  let h='<h2>🗺 World Map</h2>';
  h+='<div style="text-align:center;line-height:0;margin-top:4px"><canvas id="mapCv" width="'+(MW*8)+'" height="'+(MH*8)+'" style="width:min(96vw,480px);border:4px solid #2a2118;border-radius:14px;background:#0b1220;box-shadow:0 0 24px rgba(0,0,0,.6)"></canvas></div>';
  h+='<div class="subline" style="margin-top:6px">⭐ you · unexplored lands are shrouded — go discover them!</div>';
  h+='<div class="prow" style="margin-top:8px"><button class="cbtn" id="mapBack">◀ Menu</button></div>';
  p.innerHTML=h;
  const cv=document.getElementById('mapCv'),c=cv.getContext('2d'),S=8;
  const COL={'.':'#5a9e4c',',':'#4a8a40','T':'#33682c','W':'#2e6ba6','P':'#9a7a4c','~':'#8a7a50',
    'H':'#d9a24a','N':'#e08a9a','M':'#5f8fc0','S':'#c9a15a','B':'#b0885a','R':'#8a7ad0','V':'#c9a15a','Q':'#c07ad6',
    'Y':'#8a95a0','X':'#6e7880','C':'#3a3531','U':'#555e66','K':'#ffd23c'};
  for(let y=0;y<MH;y++)for(let x=0;x<MW;x++){
    const t=grid[y][x];let col=COL[t]||'#5a9e4c';
    const jit=(hash(x*7.3,y*9.1)-0.5)*0.14;
    c.fillStyle=shadeCol(col,jit);c.fillRect(x*S,y*S,S,S);
    if(t==='T'){c.fillStyle=shadeCol('#2a5a24',jit-0.05);
      c.beginPath();c.arc(x*S+S/2,y*S+S*0.42,S*0.42,0,7);c.fill();
      c.fillStyle='rgba(255,255,255,.10)';c.beginPath();c.arc(x*S+S*0.36,y*S+S*0.3,S*0.16,0,7);c.fill();}
    if(t==='W'){
      let shore=false;
      for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]]){const n=(grid[y+dy]||[])[x+dx];if(n&&n!=='W'){shore=true;break;}}
      if(shore){c.fillStyle='rgba(160,220,255,.35)';c.fillRect(x*S,y*S,S,S*0.35);}
      else if(hash(x*3.1,y*4.7)<0.06){c.fillStyle='rgba(255,255,255,.25)';c.fillRect(x*S+S*0.2,y*S+S*0.4,S*0.5,1.5);}}
    if((t==='P'||t==='~')&&hash(x*5.7,y*3.9)<0.3){c.fillStyle='rgba(0,0,0,.10)';c.fillRect(x*S+S*0.3,y*S+S*0.3,S*0.35,S*0.35);}}
  const lg=c.createLinearGradient(0,0,MW*S,MH*S);
  lg.addColorStop(0,'rgba(255,240,200,.10)');lg.addColorStop(0.5,'rgba(0,0,0,0)');lg.addColorStop(1,'rgba(10,20,40,.18)');
  c.fillStyle=lg;c.fillRect(0,0,MW*S,MH*S);
  c.strokeStyle='rgba(255,210,60,.9)';c.lineWidth=2;
  for(const pl of PLOTS){if(!G.plots[pl.id])continue;c.strokeRect(pl.x*S,pl.y*S,pl.w*S,pl.h*S);}
  const fg=document.createElement('canvas');fg.width=MW*S;fg.height=MH*S;
  const f=fg.getContext('2d');
  for(let cy2=0;cy2<Math.ceil(MH/CHUNK);cy2++)for(let cx2=0;cx2<Math.ceil(MW/CHUNK);cx2++){
    if(G.seen&&G.seen[cx2+'_'+cy2])continue;
    f.fillStyle='#0c1322';f.fillRect(cx2*CHUNK*S,cy2*CHUNK*S,CHUNK*S,CHUNK*S);}
  f.globalCompositeOperation='source-atop';
  for(let i=0;i<260;i++){const rx=hash(i*3.7,i*1.3)*MW*S,ry=hash(i*9.1,i*5.3)*MH*S;
    f.fillStyle='rgba(70,90,130,'+(0.05+hash(i*1.1,i*7.7)*0.09)+')';
    f.beginPath();f.ellipse(rx,ry,10+hash(i*2.3,i*4.1)*26,7+hash(i*6.1,i*8.3)*14,hash(i,i)*3,0,7);f.fill();}
  f.globalCompositeOperation='source-over';
  c.save();c.filter='blur(5px)';c.drawImage(fg,0,0);c.filter='none';
  c.globalAlpha=0.85;c.drawImage(fg,0,0);c.globalAlpha=1;c.restore();
  c.font='bold 22px Fredoka,system-ui';c.textAlign='center';
  for(const t of TOWNS){if(!chunkSeen(t.cx,t.cy))continue;
    c.fillStyle='#fff';c.strokeStyle='rgba(0,0,0,.7)';c.lineWidth=4;
    c.strokeText(t.name,t.cx*S,(t.cy-4)*S);c.fillText(t.name,t.cx*S,(t.cy-4)*S);}
  c.font='26px system-ui';
  for(const ca of CASTLES)if(chunkSeen(ca.x,ca.y))c.fillText('🏰',ca.x*S,(ca.y-1)*S);
  if(chunkSeen(BOSS_LAIR.x,BOSS_LAIR.y))c.fillText('💀',BOSS_LAIR.x*S,BOSS_LAIR.y*S);
  for(let y=0;y<MH;y++)for(let x=0;x<MW;x++)if(grid[y][x]==='C'&&chunkSeen(x,y)){
    c.fillStyle='#12160f';c.beginPath();c.arc(x*S+S/2,y*S+S/2,S*0.9,0,7);c.fill();
    c.fillStyle='#8a6d3a';c.beginPath();c.arc(x*S+S/2,y*S+S/2,S*0.5,0,7);c.fill();}
  const vg=c.createRadialGradient(MW*S/2,MH*S/2,MH*S*0.35,MW*S/2,MH*S/2,MW*S*0.62);
  vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(5,8,14,.5)');
  c.fillStyle=vg;c.fillRect(0,0,MW*S,MH*S);
  {const tt3=trackTargetLive();
   if(tt3){
     c.fillStyle='rgba(255,210,60,.35)';c.beginPath();c.arc((tt3.x+0.5)*S,(tt3.y+0.5)*S,S*3,0,7);c.fill();
     const pcv=document.createElement('canvas');pcv.width=44;pcv.height=44;drawPinIcon(pcv,tt3.t);
     c.drawImage(pcv,(tt3.x+0.5)*S-22,(tt3.y+0.5)*S-40);}}
  if(!dungeon&&scene){
    const pxT=scene.px/TILE,pyT=scene.py/TILE;
    const g2=c.createRadialGradient(pxT*S,pyT*S,1,pxT*S,pyT*S,S*3.2);
    g2.addColorStop(0,'rgba(255,220,90,.6)');g2.addColorStop(1,'rgba(255,220,90,0)');
    c.fillStyle=g2;c.beginPath();c.arc(pxT*S,pyT*S,S*3.2,0,7);c.fill();
    c.fillStyle='#ffd23c';c.strokeStyle='#fff';c.lineWidth=3;
    c.beginPath();c.arc(pxT*S,pyT*S,S*1.1,0,7);c.fill();c.stroke();
    c.fillStyle='#12160f';c.beginPath();c.arc(pxT*S,pyT*S,S*0.4,0,7);c.fill();}
  document.getElementById('mapBack').onclick=openPanel;}
const INV_DEF={
  berry:{ic:'🫐',nm:'Berry',fx:'Heals 35% HP · +25 hunger',lore:'Plump forest berries — sweet, juicy, and just a little magical.',use:1},
  potion:{ic:'🧪',nm:'Potion',fx:'Restores 60 HP',lore:'A swirling red brew from the nurse\'s own recipe.',use:1},
  ration:{ic:'🍖',nm:'Ration',fx:'Fully fills hunger',lore:'Smoked meat wrapped in leaves. A traveler\'s best friend.',use:1},
  wood:{ic:'🪵',nm:'Wood',fx:'Building & crafting material',lore:'Sturdy timber chopped from wild trees.'},
  stone:{ic:'🪨',nm:'Stone',fx:'Building & crafting material',lore:'Rough grey stone pried from rocky outcrops.'},
  fiber:{ic:'🌿',nm:'Fiber',fx:'Crafting material · tower ammo',lore:'Tough plant fibers, good for rope and snares.'},
  ore:{ic:'⛏️',nm:'Ore',fx:'Smithing material (needs pickaxe)',lore:'Glinting ore veins only a pickaxe can crack open.'},
  axe:{ic:'🪓',nm:'Axe',fx:'Chop trees for wood',lore:'The woodsman\'s answer to every problem.'},
  pickaxe:{ic:'⛏',nm:'Pickaxe',fx:'Mine stone & ore nodes',lore:'Bites through rock like it holds a grudge.'}};
function openInventory(sel){if(typeof sel!=='string')sel=null;
  const p=document.getElementById('panel');const it=G.items,R=G.res;
  const cnt=k=>k==='axe'||k==='pickaxe'?(G.tools[k]||0):(INV_DEF[k].use?(it[k]||0):(R[k]||0));
  if(!sel){sel=['berry','potion','ration'].find(k=>cnt(k)>0)||'berry';}
  let h='<h2>🎒 Inventory</h2>';
  h+=`<div class="subline">🍖 hunger ${Math.round(G.hunger)}% · ❤ ${Math.ceil(Math.max(0,G.hp))}/${G.maxHp} · ◉ ${G.coins}</div>`;
  // Zelda-style detail card for the selected item
  const D=INV_DEF[sel];
  if(D){const n=cnt(sel),isTool=sel==='axe'||sel==='pickaxe';
    h+=`<div class="pcard" style="max-width:500px;margin:5px auto 0;width:100%">
      <div style="width:44px;text-align:center;font-size:30px;flex:none">${D.ic}</div>
      <div style="flex:1;min-width:0"><b style="color:#c98b3a">${D.nm}</b> <span class="lv">${isTool?(n?'tier '+n:'not crafted'):'×'+n}</span><br>
      <small style="color:#7a6a4a;font-style:italic">${D.lore}</small><br>
      <small style="color:#3f7d34">${D.fx}</small></div>
      ${D.use?`<button class="cbtn" id="invUse" ${n>0?'':'disabled'}>Use</button>`:''}</div>`;}
  const grid=(title,keys)=>{
    h+=`<div class="subline" style="margin-top:7px;color:#f2c14e;font-weight:700">${title}</div><div class="baggrid">`;
    for(const k of keys){const n=cnt(k),D2=INV_DEF[k];
      h+=`<div class="bagslot ${sel===k?'sel':''}" data-inv="${k}" style="${n>0?'':'opacity:.45;'}">
        ${D2.ic}<span class="eqlv">${k==='axe'||k==='pickaxe'?(n?['I','II','III'][n-1]||n:'—'):n}</span></div>`;}
    h+='</div>';};
  grid('CONSUMABLES',['berry','potion','ration']);
  grid('MATERIALS',['wood','stone','fiber','ore']);
  grid('TOOLS',['axe','pickaxe']);
  h+=`<div class="subline" style="margin-top:7px">⚔ Gear lives in the <b>Character</b> screen${G.gear.length?` — ${G.gear.length} in bag`:''}</div>`;
  h+='<div class="prow" style="margin-top:8px"><button class="cbtn" id="invBack">◀ Menu</button></div>';
  p.innerHTML=h;
  p.querySelectorAll('[data-inv]').forEach(el=>el.onclick=()=>{sfx('menu');openInventory(el.dataset.inv);});
  const ub=document.getElementById('invUse');
  if(ub)ub.onclick=()=>{const k=sel;
    if(!(G.items[k]>0))return;G.items[k]--;
    if(k==='berry'){G.hunger=Math.min(100,G.hunger+25);G.hp=Math.min(G.maxHp,G.hp+Math.floor(G.maxHp*0.35));toast('Ate a Berry');}
    else if(k==='potion'){G.hp=Math.min(G.maxHp,G.hp+60);toast('Used a Potion');}
    else{G.hunger=100;toast('Hunger restored');}
    sfx('heal');save();updateHud();openInventory(k);};
  document.getElementById('invBack').onclick=openPanel;}
function openCharacter(sel){if(typeof sel!=='string')sel=null;const p=document.getElementById('panel');const M=mods();
  const nm={warrior:'Warrior',mage:'Mage',ranger:'Ranger'}[G.class];
  const SN=SETS[G.class].name,sc=setCount();
  const SD=subDef(G.class,G.element),EL=SD;
  let h=`<h2>${G.name||nm} <span style="font-size:13px;color:${EL.col}">${SD.ic} ${SD.nm}</span> — Lv.${G.level}${fullSet()?' <span style="color:#2fd06a">🌟</span>':''}</h2>`;
  h+=`<div class="subline">❤ ${Math.ceil(Math.max(0,G.hp))}/${G.maxHp} · ⚔ ${G._atk} · 🛡 ${G._def}`+
     `${M.speed>1?` · 👟 +${Math.round((M.speed-1)*100)}%`:''}${M.xp>1?` · ✦ +${Math.round((M.xp-1)*100)}%`:''}${M.coins>1?` · ◉ +${Math.round((M.coins-1)*100)}%`:''}</div>`;
  if(sc>0)h+=`<div class="subline" style="color:#2fd06a;font-weight:700">${SN} set: ${sc}/6${fullSet()?' — COMPLETE! +12% ⚔🛡, +8% ❤':''}</div>`;
  const slotBox=(slot)=>{const it=G.equip[slot];const col=gearCol(it);
    if(it)return `<div class="eqslot ${sel==='slot:'+slot?'sel':''}" data-sel="slot:${slot}" style="${col?`border-color:${col};box-shadow:0 0 10px ${col}66,0 3px 0 rgba(0,0,0,.22);`:''}">
      <span class="ic">${SLOT_ICON[slot]}</span><span class="eqlv">${it.lvl}</span><span class="eqlab">${slot}</span></div>`;
    return `<div class="eqslot empty ${sel==='slot:'+slot?'sel':''}" data-sel="slot:${slot}"><span class="ic">${SLOT_ICON[slot]}</span><span class="eqlab">${slot}</span></div>`;};
  h+=`<div class="dollwrap">
    <div class="eqcol">${slotBox('weapon')}${slotBox('armor')}${slotBox('boots')}</div>
    <canvas id="dollCv" width="340" height="340" style="width:160px;height:160px"></canvas>
    <div class="eqcol">${slotBox('helm')}${slotBox('trinket')}${slotBox('charm')}</div>
  </div>`;
  // detail card for selection
  let det=null,detIsBag=false,bagIdx=-1;
  if(sel&&sel.startsWith('slot:'))det=G.equip[sel.slice(5)];
  else if(sel&&sel.startsWith('bag:')){bagIdx=+sel.slice(4);det=G.gear[bagIdx];detIsBag=true;}
  if(det){const R=RARITIES[det.rar],col=gearCol(det)||'#20301c';
    h+=`<div class="pcard" style="max-width:500px;margin:6px auto 0;width:100%;border-color:${col}">
      <div style="flex:1;min-width:0"><b style="color:${col}">${SLOT_ICON[det.slot]} ${det.name}</b> <span class="lv">${det.set?'SET':R.name} Lv.${det.lvl}</span><br>
      <small style="color:#5a4">${statStr(det)}</small>${det.set?`<br><small style="color:#2fd06a">${det.set} set piece (${sc}/6 worn)</small>`:''}</div>
      ${detIsBag?`<button class="cbtn" data-eq="${bagIdx}">Equip</button><button class="cbtn" data-sv="${bagIdx}">⚒</button>`
                :`<button class="cbtn" data-uneq="${det.slot}">Unequip</button>`}</div>`;}
  else h+=`<div class="subline" style="margin-top:4px">Tap a slot or bag item to inspect</div>`;
  // gear bag grid
  h+=`<div class="subline" style="margin-top:8px;color:#f2c14e;font-weight:700">GEAR BAG (${G.gear.length}/15)</div>`;
  if(G.gear.length){h+='<div class="baggrid">';
    G.gear.forEach((it,i)=>{const col=gearCol(it);
      h+=`<div class="bagslot ${sel==='bag:'+i?'sel':''}" data-sel="bag:${i}" style="${col?`border-color:${col};box-shadow:0 0 9px ${col}55,0 3px 0 rgba(0,0,0,.22);`:''}">${SLOT_ICON[it.slot]}<span class="eqlv">${it.lvl}</span></div>`;});
    h+='</div>';}
  else h+='<div class="subline">💜 rares always drop gear — hunt them!</div>';
  h+='<div class="prow" style="margin-top:8px"><button class="cbtn" id="charBack">◀ Menu</button></div>';
  p.innerHTML=h;
  heroPreview(document.getElementById('dollCv'),G.class,true);
  p.querySelectorAll('[data-sel]').forEach(el=>el.onclick=()=>{sfx('menu');openCharacter(el.dataset.sel);});
  p.querySelectorAll('[data-eq]').forEach(b2=>b2.onclick=()=>{const i=+b2.dataset.eq,it=G.gear[i];if(!it)return;
    const cur=G.equip[it.slot];G.gear.splice(i,1);if(cur)G.gear.push(cur);G.equip[it.slot]=it;
    recalcHero();if(G.hp>G.maxHp)G.hp=G.maxHp;
    if(fullSet()&&!G.setDone){G.setDone=1;toast('🌟 '+SETS[G.class].name+' SET COMPLETE — you shine with power!');sfx('level');}
    else toast('Equipped '+it.name);
    save();updateHud();applyGearFx();openCharacter('slot:'+it.slot);});
  p.querySelectorAll('[data-sv]').forEach(b2=>b2.onclick=()=>{const i=+b2.dataset.sv,it=G.gear[i];if(!it)return;
    const c=Math.round((5+it.lvl*2)*RARITIES[it.rar].mult);G.gear.splice(i,1);G.coins+=c;
    toast(`Salvaged → +${c}c`);save();updateHud();openCharacter();});
  p.querySelectorAll('[data-uneq]').forEach(b2=>b2.onclick=()=>{const slot=b2.dataset.uneq,it=G.equip[slot];if(!it)return;
    if(G.gear.length>=15){toast('Gear bag full');return;}
    G.equip[slot]=null;G.gear.push(it);recalcHero();if(G.hp>G.maxHp)G.hp=G.maxHp;save();updateHud();applyGearFx();openCharacter();});
  document.getElementById('charBack').onclick=openPanel;}
let skTab='spell';
function spentIn(tree){let t=0;for(const nd of SKILLS)if(nd.tree===tree&&(!nd.cls||nd.cls===G.class)&&(!nd.sub||nd.sub===G.element))t+=(G.skills||{})[nd.key]||0;return t;}
function nodeOpen(nd){return spentIn(nd.tree)>=(nd.tier-1)*2&&skillReq(nd);}
function openSkills(sel){if(typeof sel!=='string')sel=null;const p=document.getElementById('panel');
  const RN=['I','II','III','IV'];
  let h=`<h2>\u2726 Skills</h2><div class="subline">Points: <b style="color:#ffd23c">${G.skillPoints||0}</b> \u00b7 +1 every level-up</div>`;
  if(skTab==='loadout')skTab='spell';
  h+=`<div class="sktabs">
    <button class="sktab ${skTab==='spell'?'on':''}" data-tab="spell">\u2694 Spells</button>
    <button class="sktab ${skTab==='passive'?'on':''}" data-tab="passive">\u2726 Passives</button></div>`;
  const nd=SKILLS.find(n=>n.key===sel);
  if(nd){const rank=(G.skills||{})[nd.key]||0,maxed=rank>=nd.max,ok=nodeOpen(nd);
    const dispNm=(nd.key==='firewall'||nd.key==='spikewall'||nd.key==='thornwall')?wallDef().nm:nd.name;
    const spentT=spentIn(nd.tree),need=(nd.tier-1)*2;
    let lockTxt='';
    if(spentT<need)lockTxt=`\ud83d\udd12 Needs ${need} points spent in this tree`;
    else if(!skillReq(nd))lockTxt='\ud83d\udd12 Requires '+Object.entries(nd.req).map(([k,v])=>((SKILLS.find(n=>n.key===k)||{name:k}).name)+' '+v).join(', ');
    h+=`<div class="pcard" style="max-width:500px;margin:4px auto 0;width:100%">
      <div style="flex:1;min-width:0"><b>${dispNm}</b> <span class="lv">${rank}/${nd.max}</span><br>
      <small>${nd.eff}</small>${lockTxt?`<br><small style="color:#e8483a">${lockTxt}</small>`:''}</div>
      <button class="cbtn" id="skLearn" data-k="${nd.key}" ${(!maxed&&ok&&(G.skillPoints||0)>0)?'':'disabled'}>${maxed?'MAX':'Learn'}</button></div>`;}
  else h+='<div class="subline" style="margin-top:4px">Tap a skill to inspect it</div>';
  h+=`<div id="skTree"><canvas id="skLines"></canvas>`;
  const spent=spentIn(skTab);
  for(let t=1;t<=4;t++){
    const nodes=SKILLS.filter(n=>n.tree===skTab&&n.tier===t&&(!n.cls||n.cls===G.class)&&(!n.sub||n.sub===G.element));
    if(!nodes.length)continue;
    const need=(t-1)*2,open=spent>=need;
    if(t>1)h+=`<div class="sktsep ${open?'':'dim'}">TIER ${RN[t-1]}${open?'':' \ud83d\udd12 '+need+' pts in tree'}</div>`;
    h+='<div class="sktier">';
    for(const nd of nodes){const rank=(G.skills||{})[nd.key]||0,maxed=rank>=nd.max,ok=nodeOpen(nd);
      h+=`<div class="sknode ${ok?'':'locked'} ${maxed?'maxed':''} ${sel===nd.key?'sel':''}" data-sk="${nd.key}">${nd.cv?`<canvas class="skcv" data-ic="${nd.icon}"></canvas>`:`<span>${nd.icon}</span>`}<span class="skrk">${rank}/${nd.max}</span></div>`;}
    h+='</div>';}
  h+='</div>';
  if(skTab==='spell'){
    if(!G.loadout)G.loadout=['strike'];
    if(isRSub('beastmaster')){
      if(!G.pet)G.pet='wolf';
      h+='<div class="subline" style="margin-top:10px;color:#f2c14e;font-weight:700">COMPANION</div><div class="plist" style="margin-top:4px">';
      for(const pk in PETS){const P2=PETS[pk];
        const locked=P2.lock&&!P2.lock();
        h+=`<div class="pcard" style="${locked?'opacity:.55':''}${G.pet===pk?';border-color:#ffd23c;box-shadow:0 0 10px rgba(255,210,60,.4),0 3px 0 rgba(0,0,0,.22)':''}">
          <div style="width:34px;text-align:center;font-size:23px">${P2.ic}</div>
          <div style="flex:1;min-width:0"><b>${P2.nm}</b>${G.pet===pk?' <span style="color:#3f7d34;font-size:11px">\u2714 active</span>':''}<br>
          <small>${locked?'\ud83d\udd12 Unlock: '+P2.lockTxt:P2.desc+' \u00b7 '+Math.round(P2.dmg*100)+'% ATK every '+P2.rate+'s'}</small></div>
          <button class="cbtn" data-pet="${pk}" ${locked||G.pet===pk?'disabled':''}>${G.pet===pk?'\u2713':'Choose'}</button></div>`;}
      h+='</div>';}
    h+=`<div class="subline" style="margin-top:10px;color:#f2c14e;font-weight:700">EQUIPPED SPELLS (${G.loadout.length}/3)</div>
    <div class="subline" style="font-size:10px">they appear as buttons in battle</div><div class="plist" style="margin-top:4px">`;
    for(const k of Object.keys(SPELLBOOK)){const sb=SPELLBOOK[k];
      const av=sb.avail(),eq=G.loadout.includes(k),full=G.loadout.length>=3;
      h+=`<div class="pcard" style="${av?'':'opacity:.55'}">
        <div style="width:34px;text-align:center;font-size:22px">${sb.cv?`<canvas class="skcv2" data-ic="${sb.icon()}" style="width:28px;height:28px"></canvas>`:sb.icon()}</div>
        <div style="flex:1;min-width:0"><b>${sb.name()}</b>${eq?' <span style="color:#3f7d34;font-size:11px">\u2714 equipped</span>':''}<br>
        <small>${av?sb.desc:'\ud83d\udd12 '+(sb.lock||'')}</small></div>
        <button class="cbtn" data-eqs="${k}" ${av&&(eq||!full)?'':'disabled'}>${eq?'Remove':'Equip'}</button></div>`;}
    h+='</div>';}
  h+='<div class="prow" style="margin-top:6px"><button class="cbtn" id="skBack">\u25c0 Menu</button></div>';
  p.innerHTML=h;
  p.querySelectorAll('canvas.skcv2').forEach(cv=>{cv.width=56;cv.height=56;drawMenuIcon(cv,cv.dataset.ic);});
  p.querySelectorAll('[data-eqs]').forEach(b2=>b2.onclick=()=>{const k=b2.dataset.eqs;
    if(G.loadout.includes(k))G.loadout=G.loadout.filter(x=>x!==k);
    else if(G.loadout.length<3)G.loadout.push(k);
    sfx('menu');save();openSkills(sel);});
  p.querySelectorAll('[data-pet]').forEach(b2=>b2.onclick=()=>{const pk=b2.dataset.pet;
    const P2=PETS[pk];if(!P2||(P2.lock&&!P2.lock()))return;
    G.pet=pk;if(scene&&scene.wolf)scene.wolf.s.setTexture(P2.tex);
    sfx('level');toast(P2.ic+' '+P2.nm+' is now your companion!');save();openSkills(sel);});
  p.querySelectorAll('canvas.skcv').forEach(cv=>{cv.width=60;cv.height=60;drawMenuIcon(cv,cv.dataset.ic);});
  p.querySelectorAll('[data-sk]').forEach(el=>el.onclick=()=>{sfx('menu');openSkills(el.dataset.sk);});
  p.querySelectorAll('.sktab').forEach(b2=>b2.onclick=()=>{skTab=b2.dataset.tab;sfx('menu');openSkills();});
  const lb=document.getElementById('skLearn');
  if(lb)lb.onclick=()=>{const nd2=SKILLS.find(n=>n.key===lb.dataset.k),rank=(G.skills||{})[nd2.key]||0;
    if(rank>=nd2.max||(G.skillPoints||0)<=0||!nodeOpen(nd2))return;
    G.skills[nd2.key]=rank+1;G.skillPoints--;sfx('level');
    const b3=G.maxHp;recalcHero();G.hp+=Math.max(0,G.maxHp-b3);
    let msg=nd2.name+' \u2192 '+(rank+1);
    if(rank===0&&nd2.key===abilityKey()&&autoEquip('active'))msg+=' \u00b7 equipped!';
    if(rank===0&&nd2.key===runeKey()&&autoEquip('rune'))msg+=' \u00b7 equipped!';
    if(rank===0&&nd2.key==='multi')msg+=' \u00b7 '+SPELLBOOK.nova.name()+' unlocked below!';
    toast(msg);save();updateHud();openSkills(nd2.key);};
  document.getElementById('skBack').onclick=openPanel;
  requestAnimationFrame(drawSkillLines);}
function drawSkillLines(){const tree=document.getElementById('skTree'),cv=document.getElementById('skLines');
  if(!tree||!cv)return;
  const w=tree.clientWidth,hh=tree.scrollHeight;
  cv.width=w*2;cv.height=hh*2;cv.style.width=w+'px';cv.style.height=hh+'px';
  const c=cv.getContext('2d');c.scale(2,2);c.lineCap='round';
  const pos=k=>{const el=tree.querySelector(`[data-sk="${k}"]`);if(!el)return null;
    return {x:el.offsetLeft+el.offsetWidth/2,y:el.offsetTop+el.offsetHeight/2};};
  for(const nd of SKILLS){if(nd.tree!==skTab||!nd.req)continue;if(nd.cls&&nd.cls!==G.class)continue;if(nd.sub&&nd.sub!==G.element)continue;
    const b2=pos(nd.key);if(!b2)continue;
    for(const rk in nd.req){const a2=pos(rk);if(!a2)continue;
      const ok=((G.skills||{})[rk]||0)>=nd.req[rk];
      c.strokeStyle=ok?'rgba(255,210,60,.85)':'rgba(140,150,140,.4)';
      c.lineWidth=3;c.setLineDash(ok?[]:[5,4]);
      c.beginPath();c.moveTo(a2.x,a2.y+24);
      c.bezierCurveTo(a2.x,a2.y+40,b2.x,b2.y-42,b2.x,b2.y-26);c.stroke();}}
  c.setLineDash([]);}
function applyGearFx(){if(!scene||!scene.pGlow)return;
  const wC=gearRarCol('weapon');
  if(fullSet()){scene.pGlow.setTint(0x9aff6a).setScale(1.0).setAlpha(0.5);
    if(!scene.setEmit){scene.setEmit=scene.add.particles(0,0,'dot',{speed:{min:8,max:30},scale:{start:0.22,end:0},lifespan:900,frequency:120,tint:0x9aff6a,blendMode:'ADD'}).setDepth(999880);}
    scene.setEmit.start();}
  else{scene.pGlow.setScale(0.6).setAlpha(0.2);
    if(scene.setEmit)scene.setEmit.stop();
    scene.pGlow.setTint(wC?Phaser.Display.Color.HexStringToColor(wC).color:subVis().hex);}
  if(gearRarCol('charm')){if(!scene.charmFx){scene.charmFx=scene.add.image(0,0,'dot').setScale(0.28).setBlendMode(Phaser.BlendModes.ADD).setDepth(9999);}
    scene.charmFx.setTint(Phaser.Display.Color.HexStringToColor(gearRarCol('charm')).color).setVisible(true);}
  else if(scene.charmFx)scene.charmFx.setVisible(false);}


function bakeNode(kind){
  const cv=mkCv(64,56),sx=32,base=46,line='#12160f';
  shadow(sx,base,16,6);
  if(kind==='wood'){ctx.strokeStyle=line;ctx.lineWidth=3;ctx.fillStyle='#7a5230';
    for(const[dx,dy]of[[-5,0],[5,-3]]){ctx.beginPath();ctx.ellipse(sx+dx,base-6+dy,10,6,0.2,0,7);ctx.fill();ctx.stroke();
      ctx.fillStyle='#c9a15a';ctx.beginPath();ctx.ellipse(sx+dx-8,base-6+dy,3,5,0,0,7);ctx.fill();ctx.fillStyle='#7a5230';}}
  else if(kind==='stone'){ctx.fillStyle='#8a8d84';ctx.strokeStyle=line;ctx.lineWidth=3;
    ctx.beginPath();ctx.moveTo(sx-13,base);ctx.lineTo(sx-8,base-14);ctx.lineTo(sx+4,base-16);ctx.lineTo(sx+13,base-4);ctx.lineTo(sx+8,base+2);ctx.closePath();ctx.fill();ctx.stroke();
    ctx.fillStyle='rgba(255,255,255,.15)';ctx.beginPath();ctx.moveTo(sx-6,base-10);ctx.lineTo(sx-1,base-13);ctx.lineTo(sx+2,base-8);ctx.closePath();ctx.fill();}
  else if(kind==='ore'){ctx.fillStyle='#5a6470';ctx.strokeStyle=line;ctx.lineWidth=3;
    ctx.beginPath();ctx.moveTo(sx-12,base);ctx.lineTo(sx-7,base-11);ctx.lineTo(sx+6,base-12);ctx.lineTo(sx+12,base-2);ctx.lineTo(sx+7,base+2);ctx.closePath();ctx.fill();ctx.stroke();
    ctx.fillStyle='#8fd0ff';ctx.shadowColor='#8fd0ff';ctx.shadowBlur=8;
    for(const[dx,dy,r]of[[-4,-8,4],[3,-11,5],[7,-4,3]]){ctx.beginPath();ctx.moveTo(sx+dx,base+dy-r);ctx.lineTo(sx+dx+r*0.8,base+dy);ctx.lineTo(sx+dx,base+dy+r*0.6);ctx.lineTo(sx+dx-r*0.8,base+dy);ctx.closePath();ctx.fill();}
    ctx.shadowBlur=0;}
  else{ctx.strokeStyle='#2e6d34';ctx.lineWidth=3;
    for(let i=-2;i<=2;i++){ctx.beginPath();ctx.moveTo(sx+i*4,base);ctx.quadraticCurveTo(sx+i*4,base-16,sx+i*5,base-22);ctx.stroke();}
    ctx.fillStyle='#7cc26a';for(let i=-1;i<=1;i++){ctx.beginPath();ctx.ellipse(sx+i*6,base-20,3,5,i*0.4,0,7);ctx.fill();}}
  return cv;}
function bakeBuild(kind){
  const cv=mkCv(90,100),cx=45,base=84,line='#12160f';
  if(kind==='torch'){shadow(cx,base,7,4);ctx.strokeStyle=line;ctx.lineWidth=4;ctx.fillStyle='#5a3d20';
    rr(cx-3,base-26,6,28,2);ctx.fill();ctx.stroke();
    ctx.fillStyle='#ff7a1e';ctx.beginPath();ctx.moveTo(cx-5,base-26);ctx.quadraticCurveTo(cx,base-40,cx+5,base-26);ctx.closePath();ctx.fill();
    ctx.fillStyle='#ffd23c';ctx.beginPath();ctx.moveTo(cx-2.5,base-27);ctx.quadraticCurveTo(cx,base-34,cx+2.5,base-27);ctx.closePath();ctx.fill();}
  else if(kind==='wall'){shadow(cx,base+2,20,7);ctx.strokeStyle=line;ctx.lineWidth=4;ctx.fillStyle='#9a7a52';
    rr(cx-18,base-26,36,28,3);ctx.fill();ctx.stroke();ctx.strokeStyle='rgba(0,0,0,.25)';ctx.lineWidth=2;
    ctx.beginPath();ctx.moveTo(cx-18,base-13);ctx.lineTo(cx+18,base-13);ctx.moveTo(cx,base-26);ctx.lineTo(cx,base-13);ctx.stroke();}
  else if(kind==='door'){shadow(cx,base+2,18,6);ctx.strokeStyle=line;ctx.lineWidth=4;
    ctx.fillStyle='#9a7a52';rr(cx-18,base-26,7,28,2);ctx.fill();ctx.stroke();rr(cx+11,base-26,7,28,2);ctx.fill();ctx.stroke();
    rr(cx-18,base-30,36,7,3);ctx.fill();ctx.stroke();
    ctx.fillStyle='#6a4a26';rr(cx-9,base-22,18,24,2);ctx.fill();
    ctx.fillStyle='#ffd23c';ctx.beginPath();ctx.arc(cx+5,base-9,2,0,7);ctx.fill();}
  else if(kind==='chestB'){shadow(cx,base,14,5);ctx.strokeStyle=line;ctx.lineWidth=3.5;
    ctx.fillStyle='#8a5a2e';rr(cx-13,base-16,26,17,3);ctx.fill();ctx.stroke();
    ctx.fillStyle='#a8703a';rr(cx-13,base-21,26,8,3);ctx.fill();ctx.stroke();
    ctx.fillStyle='#ffd23c';rr(cx-3,base-15,6,7,1);ctx.fill();}
  else if(kind==='table'){shadow(cx,base,17,6);ctx.strokeStyle=line;ctx.lineWidth=3.5;
    ctx.fillStyle='#6a4a26';rr(cx-15,base-6,5,8,1);ctx.fill();ctx.stroke();rr(cx+10,base-6,5,8,1);ctx.fill();ctx.stroke();
    ctx.fillStyle='#b48a5a';rr(cx-19,base-16,38,10,3);ctx.fill();ctx.stroke();
    ctx.fillStyle='#8a8d84';rr(cx-10,base-20,8,5,1);ctx.fill();}
  else if(kind==='forge'){shadow(cx,base+2,20,7);ctx.strokeStyle=line;ctx.lineWidth=4;
    ctx.fillStyle='#6f7377';rr(cx-17,base-24,34,26,4);ctx.fill();ctx.stroke();
    ctx.fillStyle='#2a2a2e';rr(cx-8,base-14,16,12,2);ctx.fill();
    ctx.fillStyle='#ff7a1e';ctx.beginPath();ctx.moveTo(cx-6,base-3);ctx.quadraticCurveTo(cx,base-13,cx+6,base-3);ctx.closePath();ctx.fill();
    ctx.fillStyle='#8a8d84';rr(cx-14,base-30,28,7,2);ctx.fill();ctx.stroke();}
  else if(kind==='spike'){shadow(cx,base,15,5);ctx.strokeStyle=line;ctx.lineWidth=2.5;
    ctx.fillStyle='#b8bcc2';for(const dx of[-10,-3,4,11]){ctx.beginPath();ctx.moveTo(cx+dx-3,base);ctx.lineTo(cx+dx,base-11);ctx.lineTo(cx+dx+3,base);ctx.closePath();ctx.fill();ctx.stroke();}}
  else if(kind==='snare'){ctx.strokeStyle='#8a6d3a';ctx.lineWidth=3;ctx.setLineDash([6,4]);
    ctx.beginPath();ctx.ellipse(cx,base-2,14,7,0,0,7);ctx.stroke();ctx.setLineDash([]);}
  else{ // towers
    const T2=TOWERS[kind];shadow(cx,base+2,18,7);
    ctx.strokeStyle=line;ctx.lineWidth=4;
    ctx.fillStyle='#8a6a44';ctx.beginPath();ctx.moveTo(cx-14,base+2);ctx.lineTo(cx-9,base-34);ctx.lineTo(cx+9,base-34);ctx.lineTo(cx+14,base+2);ctx.closePath();ctx.fill();ctx.stroke();
    ctx.fillStyle='#6a4a26';rr(cx-13,base-40,26,9,2);ctx.fill();ctx.stroke();
    if(kind==='tarrow'){ctx.strokeStyle='#3a2a16';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(cx-8,base-44);ctx.lineTo(cx+8,base-44);ctx.stroke();}
    else if(kind==='tfrost'){ctx.fillStyle='#7ad0ff';ctx.shadowColor='#7ad0ff';ctx.shadowBlur=10;
      ctx.beginPath();ctx.moveTo(cx,base-58);ctx.lineTo(cx+6,base-44);ctx.lineTo(cx,base-40);ctx.lineTo(cx-6,base-44);ctx.closePath();ctx.fill();ctx.shadowBlur=0;ctx.strokeStyle=line;ctx.lineWidth=2;ctx.stroke();}
    else{ctx.strokeStyle='#5a4a30';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(cx-6,base-40);ctx.lineTo(cx+9,base-52);ctx.stroke();
      ctx.fillStyle='#8a8d84';ctx.beginPath();ctx.arc(cx+10,base-53,5,0,7);ctx.fill();}}
  return cv;}


/* =================== DUNGEONS (caves & sewers) =================== */
let dungeon=null, GW=MW, GH=MH, pendingPos=null;
const CAVE_NAMES=['Gloomdepth Cave','Howling Hollow','Crystal Chasm','The Old Delve'];
function genDungeon(){
  const w=44,h=32,theme=dungeon.theme;
  const wall=theme==='cave'?'r':'b', fl=theme==='cave'?'c':'s';
  const g=Array.from({length:h},()=>Array(w).fill(wall));
  const rnd=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
  const rooms=[];const n=7+Math.floor(Math.random()*3);
  for(let i=0;i<n;i++){const rw=rnd(4,8),rh2=rnd(3,6),rx=rnd(2,w-rw-3),ry=rnd(2,h-rh2-3);
    rooms.push({x:rx,y:ry,w:rw,h:rh2,cx:rx+(rw>>1),cy:ry+(rh2>>1)});
    for(let y=ry;y<ry+rh2;y++)for(let x=rx;x<rx+rw;x++)g[y][x]=fl;}
  rooms.sort((a,b)=>a.cx-b.cx);
  for(let i=1;i<rooms.length;i++){const a=rooms[i-1],b2=rooms[i];let x=a.cx,y=a.cy;
    while(x!==b2.cx){g[y][x]=fl;g[Math.min(h-2,y+1)][x]=fl;x+=Math.sign(b2.cx-x);}
    while(y!==b2.cy){g[y][x]=fl;g[y][Math.min(w-2,x+1)]=fl;y+=Math.sign(b2.cy-y);}}
  if(theme==='sewer')for(const r of rooms)if(r.w>=6){const wy=r.y+(r.h>>1);
    for(let x=r.x+1;x<r.x+r.w-1;x++)if(g[wy][x]===fl)g[wy][x]='w';}
  const st=rooms[0];g[st.cy][st.cx]='E';
  let far=rooms[0],fd=-1;for(const r of rooms){const d=Math.hypot(r.cx-st.cx,r.cy-st.cy);if(d>fd){fd=d;far=r;}}
  g[far.cy][far.cx]='K';
  dungeon.grid=g;dungeon.w=w;dungeon.h=h;dungeon.rooms=rooms;dungeon.far=far;
  dungeon.sx=st.cx;dungeon.sy=Math.min(st.y+st.h-1,st.cy+1);}
function enterDungeon(theme,ex,ey,title){
  if(G.raid&&G.raid.active){toast('⚔️ Repel the raid first!');sfx('fail');return;}
  const zl=zoneLevel((ex+.5)*TILE,(ey+.5)*TILE);
  const lvl=theme==='cave'?Math.max(3,zl+1):Math.max(4,zl+3);
  let nm;
  if(title)nm=title;
  else if(theme==='cave')nm=CAVE_NAMES[Math.floor(hash(ex*3.1,ey*7.3)*4)%4];
  else{let bt=TOWNS[0],bd=1e9;for(const t of TOWNS){const d=Math.hypot(t.cx-ex,t.cy-ey);if(d<bd){bd=d;bt=t;}}nm=bt.name+' Sewers';}
  dungeon={theme,lvl,name:nm,returnX:scene.px,returnY:scene.py};
  genDungeon();sfx('engage');
  toast('⬇ '+nm+' — Lv.'+lvl+'+ · find the chest, take the stairs out!');
  scene.scene.restart();}
function exitDungeon(){
  pendingPos={x:dungeon.returnX,y:dungeon.returnY};
  dungeon=null;sfx('coin');toast('☀️ Back to the surface');
  scene.scene.restart();}
function bakeDungeonArt(){
  return {
    rwall:(()=>{const cv=mkCv(76,64),cx=38,base=56;
      ctx.fillStyle='#443f38';ctx.strokeStyle='#12160f';ctx.lineWidth=3.5;
      rr(cx-30,base-40,60,44,7);ctx.fill();ctx.stroke();
      ctx.fillStyle='#544e46';ctx.beginPath();ctx.ellipse(cx,base-38,27,9,0,0,7);ctx.fill();
      ctx.fillStyle='#8fd0ff';ctx.shadowColor='#8fd0ff';ctx.shadowBlur=7;
      ctx.beginPath();ctx.moveTo(cx+2,base-20);ctx.lineTo(cx+6,base-14);ctx.lineTo(cx-1,base-13);ctx.closePath();ctx.fill();ctx.shadowBlur=0;
      return cv;})(),
    bwall:(()=>{const cv=mkCv(76,60),cx=38,base=52;
      ctx.fillStyle='#3c4a42';ctx.strokeStyle='#12160f';ctx.lineWidth=3.5;
      rr(cx-30,base-38,60,42,4);ctx.fill();ctx.stroke();
      ctx.strokeStyle='rgba(0,0,0,.35)';ctx.lineWidth=1.4;
      for(let i=0;i<3;i++){ctx.beginPath();ctx.moveTo(cx-28,base-30+i*11);ctx.lineTo(cx+28,base-30+i*11);ctx.stroke();}
      ctx.fillStyle='rgba(110,190,120,.35)';ctx.beginPath();ctx.arc(cx-10,base-12,5,0,7);ctx.fill();
      return cv;})(),
    stairs:(()=>{const cv=mkCv(70,80),cx=35,base=66;
      ctx.fillStyle='rgba(255,240,200,0.14)';
      ctx.beginPath();ctx.moveTo(cx-8,base);ctx.lineTo(cx-16,base-58);ctx.lineTo(cx+16,base-58);ctx.lineTo(cx+8,base);ctx.closePath();ctx.fill();
      ctx.strokeStyle='#12160f';ctx.lineWidth=2.5;
      for(let i=0;i<3;i++){ctx.fillStyle=i%2?'#9a9d94':'#8a8d84';
        rr(cx-14+i*3,base-4-i*7,28-i*6,7,2);ctx.fill();ctx.stroke();}
      return cv;})(),
    cavemouth:(()=>{const cv=mkCv(90,80),cx=45,base=70;
      shadow(cx,base+2,30,10);ctx.strokeStyle='#12160f';ctx.lineWidth=4;
      ctx.fillStyle='#5c564e';ctx.beginPath();ctx.moveTo(cx-28,base+2);ctx.quadraticCurveTo(cx-26,base-34,cx,base-40);
      ctx.quadraticCurveTo(cx+26,base-34,cx+28,base+2);ctx.closePath();ctx.fill();ctx.stroke();
      ctx.fillStyle='#0a0910';ctx.beginPath();ctx.moveTo(cx-12,base+1);ctx.quadraticCurveTo(cx-12,base-22,cx,base-24);
      ctx.quadraticCurveTo(cx+12,base-22,cx+12,base+1);ctx.closePath();ctx.fill();ctx.stroke();
      ctx.fillStyle='rgba(120,200,255,.3)';ctx.beginPath();ctx.arc(cx,base-10,4,0,7);ctx.fill();
      return cv;})(),
    grate:(()=>{const cv=mkCv(60,40),cx=30,base=30;
      shadow(cx,base+1,18,7);ctx.strokeStyle='#12160f';ctx.lineWidth=3;
      ctx.fillStyle='#8a8d84';ctx.beginPath();ctx.ellipse(cx,base-4,17,9,0,0,7);ctx.fill();ctx.stroke();
      ctx.fillStyle='#20301c';ctx.beginPath();ctx.ellipse(cx,base-5,11,6,0,0,7);ctx.fill();ctx.stroke();
      ctx.strokeStyle='#5a6055';ctx.lineWidth=2;
      for(const dx of[-6,-2,2,6]){ctx.beginPath();ctx.moveTo(cx+dx,base-9);ctx.lineTo(cx+dx,base-1);ctx.stroke();}
      ctx.fillStyle='rgba(110,220,150,.3)';ctx.beginPath();ctx.ellipse(cx,base-5,11,6,0,0,7);ctx.fill();
      return cv;})()};
}

/* =================== GAME =================== */
let cls='warrior';
const DAY_LEN=150;
const drops=[];
function toast(m){const el=document.getElementById('toast');el.textContent=m;el.style.opacity='1';
  clearTimeout(toast.t);toast.t=setTimeout(()=>el.style.opacity='0',1600);}
function updateHud(){if(!G)return;
  document.getElementById('hp').style.width=Math.max(0,G.hp/G.maxHp*100)+'%';
  document.getElementById('hunger').style.width=Math.max(0,G.hunger)+'%';
  document.getElementById('xpb').style.width=Math.max(0,Math.min(100,G.xp/xpToNext(G.level)*100))+'%';
  document.getElementById('coins').textContent='◉ '+G.coins;
  document.getElementById('lvl').textContent='Lv.'+G.level;
  const nf=(1+Math.cos((G.time||0)*6.2832))/2;
  document.getElementById('clock').textContent=(nf>0.55?'🌙':'☀️')+' Day '+G.day;}
let scene;
class World extends Phaser.Scene{
  create(){
    scene=this;
    if(dungeon){grid=dungeon.grid;GW=dungeon.w;GH=dungeon.h;}
    else{GW=MW;GH=MH;gen();
      if(pendingPos){G.px=pendingPos.x;G.py=pendingPos.y;pendingPos=null;}}
    this.bushSprites={};
    const tx=(k,cv)=>{if(!this.textures.exists(k))this.textures.addCanvas(k,cv);};
    for(const k of['.','P','~','W',','])for(let v=0;v<3;v++)tx('g_'+k+v,bakeGround(k,v));
    for(let v=0;v<3;v++)tx('tree'+v,bakeTree(v));
    for(let v=0;v<3;v++)tx('houseR'+v,bakeHouse({roofIdx:v}));
    tx('castleTex',bakeCastle());
    tx('nurse',bakeHouse({wallL:'#d0ccc0',wallR:'#efece2',roof:['#d06a8a','#a84a68'],sign:'cross'}));
    tx('mart',bakeHouse({roof:['#3f6fa0','#2c4f78'],sign:'coin'}));
    tx('registrar',bakeHouse({wallL:'#cfc7b3',wallR:'#e5decb',roof:['#6b56d6','#4a3aa0'],sign:'scroll'}));
    tx('sign',bakeMisc('sign'));tx('berry',bakeMisc('berry'));tx('villager',bakeMisc('villager'));tx('quester',bakeMisc('quester'));tx('wolfTex',bakeMisc('wolf'));tx('hawkTex',bakeMisc('hawk'));tx('boarTex',bakeMisc('boar'));
    tx('campfire',bakeMisc('campfire'));tx('arrowTex',bakeMisc('arrow'));for(const rk of['beastmaster','trapper','sharpshooter','warden'])tx('arrow_'+rk,bakeMisc('arrow_'+rk));tx('fireboltTex',bakeMisc('firebolt'));tx('chronoboltTex',bakeMisc('chronobolt'));tx('necroboltTex',bakeMisc('necrobolt'));tx('stormboltTex',bakeMisc('stormbolt'));tx('flameTex',bakeMisc('flame'));tx('thornTex',bakeMisc('thorn'));
    for(const k of['wood','stone','fiber','ore'])tx('nd_'+k,bakeNode(k));
    for(const k of['torch','wall','door','chestB','table','forge','spike','snare','tarrow','tfrost','tcata'])tx('b_'+k,bakeBuild(k));
    if(!this.textures.exists('rwall')){const da=bakeDungeonArt();
      for(const k in da)tx(k,da[k]);
      tx('g_c0',bakeGround('c',0));tx('g_c1',bakeGround('c',1));
      tx('g_s0',bakeGround('s',0));tx('g_s1',bakeGround('s',1));
      tx('g_w0',bakeGround('w',0));tx('g_w1',bakeGround('w',1));}
    for(const sp of WILD)tx('cr_'+sp,bakeCritter(sp));
    for(let f=0;f<6;f++)tx('hero'+f,bakeHero(cls,f,'walk'));
    tx('heroIdle',bakeHero(cls,0,'idle'));
    for(let f=0;f<3;f++)tx('heroAtk'+f,bakeHero(cls,f,'atk'));
    {const g=this.make.graphics({add:false});
     g.fillStyle(0xffffff,1);g.fillCircle(16,16,7);g.generateTexture('dot',32,32);
     const gl=this.make.graphics({add:false});
     gl.fillStyle(0xffffff,0.22);gl.fillCircle(32,32,30);gl.fillStyle(0xffffff,0.3);gl.fillCircle(32,32,20);
     gl.fillStyle(0xffffff,0.55);gl.fillCircle(32,32,11);gl.generateTexture('glow',64,64);
     const lg=this.make.graphics({add:false});
     for(let r2=80;r2>0;r2-=2){lg.fillStyle(0xffffff,0.026);lg.fillCircle(84,84,r2);}
     lg.generateTexture('light',168,168);}
    const IWH=IW/2,IHH=IH/2;
    this.chestSprite=null;
    for(let y=0;y<GH;y++)for(let x=0;x<GW;x++){
      const t=tileAt(x,y),sx=(x-y)*IWH,sy=(x+y)*IHH;
      if(dungeon){
        const fl=dungeon.theme==='cave'?'c':'s';
        const gk=(t==='r'||t==='b'||t==='K'||t==='E')?fl:(t==='w'?'w':fl);
        this.add.image(sx,sy,'g_'+gk+((x+y)&1)).setDepth(sy-100000);
        if(t==='r')this.add.image(sx,sy+4,'rwall').setDepth(sy+IH*0.28).setOrigin(0.5,0.84);
        else if(t==='b')this.add.image(sx,sy+4,'bwall').setDepth(sy+IH*0.28).setOrigin(0.5,0.84);
        else if(t==='E')this.add.image(sx,sy,'stairs').setDepth(sy+IH*0.28).setOrigin(0.5,0.84);
        else if(t==='K'){this.chestSprite=this.add.image(sx,sy,'b_chestB').setScale(1.3).setDepth(sy+IH*0.28).setOrigin(0.5,0.84);
          this.add.image(sx,sy-12,'glow').setScale(0.9).setTint(0xffd23c).setBlendMode(Phaser.BlendModes.ADD).setAlpha(0.5).setDepth(sy+IH*0.28+1);}
        continue;}
      const gk=PROP.has(t)||t==='C'||t==='U'||t==='Y'||t==='X'?'.':t;
      const v=gk==='.'?(hash(x*1.3,y*2.7)<0.25?2:(x+y)&1):((x+y)&1);
      this.add.image(sx,sy,'g_'+gk+v).setDepth(sy-100000);
      if(t==='T'){const tv=hash(x*3+1,y*7+2)<0.3?1:(hash(x,y*3)<0.06?2:0);
        this.add.image(sx,sy+IH*0.28,'tree'+tv).setDepth(sy+IH*0.28).setOrigin(0.5,0.87);}
      else if(t==='H')this.add.image(sx,sy,'houseR'+(Math.floor(hash(x*3.7,y*5.1)*3)%3)).setDepth(sy+IH*0.28).setOrigin(0.5,0.8);
      else if(t==='N')this.add.image(sx,sy,'nurse').setDepth(sy+IH*0.28).setOrigin(0.5,0.8);
      else if(t==='M')this.add.image(sx,sy,'mart').setDepth(sy+IH*0.28).setOrigin(0.5,0.8);
      else if(t==='R')this.add.image(sx,sy,'registrar').setDepth(sy+IH*0.28).setOrigin(0.5,0.8);
      else if(t==='S')this.add.image(sx,sy,'sign').setDepth(sy+IH*0.28).setOrigin(0.5,0.84);
      else if(t==='C')this.add.image(sx,sy,'cavemouth').setDepth(sy+IH*0.28).setOrigin(0.5,0.84);
      else if(t==='U')this.add.image(sx,sy,'grate').setDepth(sy+IH*0.28).setOrigin(0.5,0.7);
      else if(t==='X')this.add.image(sx,sy+IH*0.5,'castleTex').setDepth(sy+IH*0.28).setOrigin(0.5,0.94);
      else if(t==='B'){const bs=this.add.image(sx,sy,'berry').setDepth(sy+IH*0.28).setOrigin(0.5,0.84);
        this.bushSprites[x+','+y]=bs;
        if(G.berriesPicked&&G.berriesPicked[x+','+y]){bs.setVisible(false);grid[y][x]='.';}}
      else if(t==='V')this.add.image(sx,sy,'villager').setDepth(sy+IH*0.28).setOrigin(0.5,0.87);
      else if(t==='Q')this.add.image(sx,sy,'quester').setDepth(sy+IH*0.28).setOrigin(0.5,0.88);
    }
    const t0=TOWNS[0];
    this.cfX=(t0.cx-1.5)*TILE;this.cfY=(t0.cy+1.5)*TILE;
    if(!dungeon){
      const cf=this.add.image(isoX(this.cfX,this.cfY),isoY(this.cfX,this.cfY),'campfire').setDepth(isoY(this.cfX,this.cfY)+10).setOrigin(0.5,0.8);
      this.tweens.add({targets:cf,scaleX:1.05,scaleY:0.94,duration:260,yoyo:true,repeat:-1});
      this.add.image(cf.x,cf.y-10,'glow').setScale(1.2).setTint(0xff9a3c).setBlendMode(Phaser.BlendModes.ADD).setAlpha(0.5).setDepth(isoY(this.cfX,this.cfY)+11);}
    if(dungeon){this.px=(dungeon.sx+0.5)*TILE;this.py=(dungeon.sy+0.5)*TILE;}
    else{this.px=G.px;this.py=G.py;}this.vx=0;this.vy=0;this.face={x:1,y:0};this.flip=1;
    this.player=this.add.sprite(0,0,'heroIdle').setOrigin(0.5,0.8).setScale(0.66);
    this.pGlow=this.add.image(0,0,'glow').setScale(0.6).setTint(0xffe9a0).setBlendMode(Phaser.BlendModes.ADD).setAlpha(0.2);
    if(!this.anims.exists('walk'))this.anims.create({key:'walk',frames:[0,1,2,3,4,5].map(f=>({key:'hero'+f})),frameRate:12,repeat:-1});
    if(!this.anims.exists('atk'))this.anims.create({key:'atk',frames:[0,1,1,2].map(f=>({key:'heroAtk'+f})),frameRate:18,repeat:0});
    this.atkAnimT=0;
    this.enemies=[];this.shots=[];this.slash=this.add.graphics().setDepth(999900);this.slashes=[];
    this.castCD=0;this.dashT=0;this.dashCD=0;this.hurtCD=0;
    if(dungeon){
      dungeon.rooms.forEach((r,i)=>{if(i===0)return;
        const n=1+Math.floor(Math.random()*2)+(r===dungeon.far?1:0);
        for(let k=0;k<n;k++){const x=r.x+1+Math.floor(Math.random()*Math.max(1,r.w-2)),
          y=r.y+1+Math.floor(Math.random()*Math.max(1,r.h-2));
          if(SOLID.has(dungeon.grid[y][x]))continue;
          this.spawnEnemyAt((x+.5)*TILE,(y+.5)*TILE,dungeon.lvl+Math.floor(Math.random()*3),Math.random()<0.15);}});
      const bx=dungeon.far.cx,by=Math.min(dungeon.far.y+dungeon.far.h-1,dungeon.far.cy+1);
      const g2=this.spawnEnemyAt((bx+0.5)*TILE,(by+0.5)*TILE,dungeon.lvl+3,false,true);
      if(g2){g2.s.setScale(0.95);g2.nameT.setText('⭐ Guardian L'+(dungeon.lvl+3));}
    }else{for(let i=0;i<12;i++)this.spawnEnemy();
      if(G.day>=(G.bossRespawn||0))this.spawnBoss();}
    this.hitEmit=this.add.particles(0,0,'dot',{speed:{min:50,max:150},scale:{start:0.45,end:0},lifespan:420,gravityY:140,emitting:false,blendMode:'ADD'}).setDepth(999890);
    this.camTarget=this.add.rectangle(0,0,2,2,0,0);
    const cam=this.cameras.main;
    cam.startFollow(this.camTarget,true,0.12,0.12);cam.setZoom(1.15);
    if(cam.postFX)cam.postFX.addVignette(0.5,0.5,1.35,0.08);
    this.darkRT=this.add.renderTexture(0,0,this.scale.width,this.scale.height).setOrigin(0,0).setScrollFactor(0).setDepth(9999900);
    this.scale.on('resize',sz=>{this.darkRT.setSize(sz.width,sz.height);});
    this.joy={active:false,id:-1,ox:0,oy:0,nx:0,ny:0};this.gest={active:false,id:-1,pts:[]};
    this.input.addPointer(3);
    this.input.on('pointerdown',p=>{
      if(this.runeArm&&!this.spellSwipe.active){
        this.spellSwipe={active:true,id:p.id,pts:[{x:p.x,y:p.y}]};return;}
      if(this.buildMode){const a=p.worldX/(IW/2),b2=p.worldY/(IH/2);
        this.buildSel={x:Math.floor((a+b2)/2),y:Math.floor((b2-a)/2)};return;}
      if(p.x<this.scale.width/2&&!this.joy.active){this.joy.active=true;this.joy.id=p.id;this.joy.ox=p.x;this.joy.oy=p.y;this.joy.nx=0;this.joy.ny=0;}
      else if(!this.gest.active){this.gest.active=true;this.gest.id=p.id;this.gest.pts=[{x:p.x,y:p.y}];}});
    this.input.on('pointermove',p=>{
      if(this.spellSwipe.active&&p.id===this.spellSwipe.id){
        const l=this.spellSwipe.pts[this.spellSwipe.pts.length-1];
        if(Math.hypot(p.x-l.x,p.y-l.y)>4)this.spellSwipe.pts.push({x:p.x,y:p.y});return;}
      if(this.joy.active&&p.id===this.joy.id){let dx=p.x-this.joy.ox,dy=p.y-this.joy.oy;const d=Math.hypot(dx,dy),R=55;
        if(d>R){dx*=R/d;dy*=R/d;}this.joy.nx=dx/R;this.joy.ny=dy/R;}
      else if(this.gest.active&&p.id===this.gest.id){const l=this.gest.pts[this.gest.pts.length-1];
        if(Math.hypot(p.x-l.x,p.y-l.y)>4)this.gest.pts.push({x:p.x,y:p.y});}});
    const up=p=>{
      if(this.spellSwipe.active&&p.id===this.spellSwipe.id){
        const pts=this.spellSwipe.pts;this.spellSwipe={active:false,id:-1,pts:[]};
        this.fadeTrail={pts,t:this.time.now,col:0xff9a3c};this.castRune(pts);return;}
      if(this.joy.active&&p.id===this.joy.id){this.joy.active=false;this.joy.nx=0;this.joy.ny=0;}
      else if(this.gest.active&&p.id===this.gest.id){const g2=this.gest.pts;this.gest.active=false;
        if(g2.length>1)this.fadeTrail={pts:g2,t:this.time.now,col:subVis().hex};
        if(g2.length){const spell=classifyGesture(g2),a=g2[0],b=g2[g2.length-1];this.attack(spell,b.x-a.x,b.y-a.y);}}};
    this.input.on('pointerup',up);this.input.on('pointerupoutside',up);
    this.keys=this.input.keyboard.addKeys('W,A,S,D,UP,DOWN,LEFT,RIGHT,J,Q,SHIFT');
    this.aim={active:false,id:-1,ox:0,oy:0,dx:0,dy:0};
    if(!window._uiBound){window._uiBound=true;
      const $=id=>document.getElementById(id);
      $('btnDash').addEventListener('pointerdown',e=>{e.preventDefault();scene.dash();});
      $('btnMenu').addEventListener('pointerdown',e=>{e.preventDefault();
        if(scene.buildMode){scene.cancelBuild();toast('Build cancelled');return;}openPanel();});
      $('interactTag').addEventListener('pointerdown',e=>{e.preventDefault();scene.doInteract();});
      $('btnSuper').addEventListener('pointerdown',e=>{e.preventDefault();scene.unleashSuper();});
      for(let i=0;i<3;i++)$('btnS'+i).addEventListener('pointerdown',e=>{e.preventDefault();scene.castSlot(i);});
      // A button — tap: attack/interact. Ranged classes: hold & drag to aim, release to fire (Brawl-style)
      const ba=$('btnA');
      ba.addEventListener('pointerdown',e=>{e.preventDefault();
        if(cls==='warrior'){scene.attack('bolt',0,0);return;}
        scene.aim={active:true,id:e.pointerId,ox:e.clientX,oy:e.clientY,dx:0,dy:0};
        try{ba.setPointerCapture(e.pointerId);}catch(_){}});
      ba.addEventListener('pointermove',e=>{const a=scene.aim;
        if(!a.active||e.pointerId!==a.id)return;e.preventDefault();
        a.dx=e.clientX-a.ox;a.dy=e.clientY-a.oy;});
      const rel=e=>{const a=scene.aim;if(!a.active||e.pointerId!==a.id)return;a.active=false;
        if(Math.hypot(a.dx,a.dy)<16)scene.attack('bolt',0,0);
        else scene.attack('bolt',0,0,Math.atan2(a.dy/IH-a.dx/IW,a.dx/IW+a.dy/IH));};
      ba.addEventListener('pointerup',rel);
      ba.addEventListener('pointercancel',()=>{scene.aim.active=false;});
      $('bbPlace').addEventListener('pointerdown',e=>{e.preventDefault();scene.placeBuild();});
      $('bbCancel').addEventListener('pointerdown',e=>{e.preventDefault();scene.cancelBuild();toast('Build mode off');});
    }
    // crown texture for alpha monsters
    if(!this.textures.exists('crownTex')){const g=this.make.graphics({add:false});
     g.fillStyle(0x12160f,1);g.fillPoints([{x:0,y:17},{x:0,y:3},{x:6,y:9},{x:11,y:1},{x:16,y:9},{x:22,y:3},{x:22,y:17}],true);
     g.fillStyle(0xffd23c,1);g.fillPoints([{x:2,y:14},{x:2,y:7},{x:7,y:11},{x:11,y:5},{x:15,y:11},{x:20,y:7},{x:20,y:14}],true);
     g.generateTexture('crownTex',22,18);}
    // gear-drop chest texture
    if(!this.textures.exists('drop_helm')){
      const mk2=(key,kind)=>{const cv=document.createElement('canvas');cv.width=52;cv.height=52;
        drawMenuIcon(cv,kind);this.textures.addCanvas(key,cv);};
      mk2('drop_weapon','w_'+cls);mk2('drop_helm','helm');mk2('drop_armor','armor');
      mk2('drop_boots','boots');mk2('drop_trinket','ring');mk2('drop_charm','orb');}
    if(!this.textures.exists('chestTex')){const g=this.make.graphics({add:false});
     g.fillStyle(0x12160f,1);g.fillRoundedRect(0,10,30,20,4);
     g.fillStyle(0x8a5a2e,1);g.fillRoundedRect(2,12,26,16,3);
     g.fillStyle(0xa8703a,1);g.fillRoundedRect(2,8,26,9,3);
     g.fillStyle(0xffd23c,1);g.fillRoundedRect(12,15,6,7,1);
     g.generateTexture('chestTex',30,32);}

    // resource nodes / plots / builds (overworld only)
    this.nodeSprites={};this.nodeCheckT=0;
    this.plotGfx=this.add.graphics().setDepth(-90000);this.plotTexts=[];
    this.buildSprites={};buildAt={};
    if(!dungeon){
      for(let y=2;y<MH-2;y++)for(let x=2;x<MW-2;x++){const nd=nodeSpec(x,y);
        if(nd){const sp2=this.add.image(isoX(nd.x,nd.y),isoY(nd.x,nd.y),'nd_'+nd.k).setDepth(isoY(nd.x,nd.y)+IH*0.28).setOrigin(0.5,0.8);
          sp2.setVisible(nodeReady(x,y));this.nodeSprites[x+','+y]={sp:sp2,nd};}}
      this.refreshPlots();
      rebuildBuildIndex();
      for(const b of G.builds)this.addBuildSprite(b);}
    this.buildMode=null;this.buildRecipe=null;this.ghost=null;this.buildSel=null;
    document.getElementById('buildBar').style.display='none';
    this.choppedCD={};
    this.bushSprites=this.bushSprites||{};this.saveT=0;this.survT=0;this.interactT=null;
    this.waves=[];this.waveGfx=this.add.graphics().setDepth(999901);
    this.eshots=[];
    this.zones=[];this.spellCD=0;this.spellMax=14;this.runeArm=false;this.strikeCD=0;this.novaCD=0;
    this.rage=0;this.frenzyT=0;this.parryT=0;this.comboT=0;this.comboN=0;
    this.minions=[];this.rewindCD=0;
    if(isRSub('beastmaster')){
      if(!G.pet)G.pet='wolf';
      this.wolf={x:this.px-40,y:this.py-20,cd:0,
        s:this.add.sprite(0,0,petDef().tex).setOrigin(0.5,0.85).setScale(0.9),
        gl:this.add.image(0,0,'glow').setScale(0.35).setTint(0x7ad0ff).setBlendMode(Phaser.BlendModes.ADD).setAlpha(0.25)};}
    this.spellSwipe={active:false,id:-1,pts:[]};this.fadeTrail=null;
    this.trailGfx=this.add.graphics().setScrollFactor(0).setDepth(9999950);
    this.buffGfx=this.add.graphics().setDepth(999902);
    this.aimGfx=this.add.graphics().setDepth(999903);
    this.shieldT=0;this.shieldHp=0;this.warcryT=0;this.quiverT=0;this.abilityCD=0;this.abilityMax=1;
    setBtnIcon(document.getElementById('btnA'),'w_'+cls,52);
    setBtnIcon(document.querySelector('#btnDash span'),cls==='mage'?'blink':'dash',30);
    applyGearFx();
    updateHud();
  }
  unleashSuper(){
    if(superC<100||panelOpen)return;superC=0;sfx('super');this.atkAnimT=0.3;this.player.play('atk',true);
    const M=mods(),base=G._atk*M.superPow;
    this.cameras.main.shake(300,0.008);
    if(cls==='warrior'){
      this.waves.push({x:this.px,y:this.py,r:12,maxR:TILE*7,dmg:Math.max(14,Math.floor(base*3)),kb:70,hit:new Set()});
      for(let i=0;i<8;i++){const a=i/8*6.283;
        this.spawnShot(a,380,Math.max(10,Math.floor(base*2.2)),3,0xffb454);}
    }else if(cls==='ranger'){
      for(let i=0;i<24;i++){const a=i/24*6.283;this.spawnShot(a,640,Math.max(5,Math.floor(base*1.3)),4,subVis().hex,true);}
      this.waves.push({x:this.px,y:this.py,r:12,maxR:TILE*4,dmg:Math.max(8,Math.floor(base*1.6)),kb:0,hit:new Set()});
    }else{
      for(let i=0;i<14;i++){const a=i/14*6.283;this.spawnShot(a,480,Math.max(6,Math.floor(base*1.6)),2,subVis().hex);}
      this.waves.push({x:this.px,y:this.py,r:12,maxR:TILE*5,dmg:Math.max(10,Math.floor(base*2.2)),kb:0,hit:new Set()});
    }
    for(let k=0;k<3;k++){this.hitEmit.setPosition(isoX(this.px,this.py),isoY(this.px,this.py)-10);this.hitEmit.explode(14);}
    toast(cls==='warrior'?'⚔ WARCRY SHOCKWAVE!':cls==='ranger'?'🏹 ARROW VOLLEY!':'✨ ARCANE NOVA!');}
  spawnShot(a2,spd,dmg,pierce,tint,arrow,big){
    const critF=!!this._critShot;
    let core;
    if(arrow||cls==='ranger'){
      const ak=cls==='ranger'&&SUBCLASSES.ranger[G.element]?'arrow_'+G.element:'arrowTex';
      core=this.add.image(0,0,ak).setScale(big?1.4:0.9);}
    else{const bk={fire:'fireboltTex',storm:'stormboltTex',chrono:'chronoboltTex',necro:'necroboltTex'}[G.element]||'fireboltTex';
      core=this.add.image(0,0,bk).setScale(big?1.5:0.8);}
    if(big)core.setTint(0xffe9a0);
    const gl=this.add.image(0,0,'glow').setScale(big?0.55:0.24).setAlpha(big?0.7:0.5).setTint(tint).setBlendMode(Phaser.BlendModes.ADD);
    this.shots.push({core,gl,x:this.px,y:this.py,x0:this.px,y0:this.py,vx:Math.cos(a2)*spd,vy:Math.sin(a2)*spd,dmg,life:1.1,pierce,big,critF});}
  castSlot(i){
    const k=(G.loadout||[])[i];if(!k||!SPELLBOOK[k]||!SPELLBOOK[k].avail())return;
    if(k==='active')this.classAbility();
    else if(k==='rune')this.armRune();
    else if(k==='strike'){if(this.strikeCD>0||this.castCD>0)return;this.strikeCD=5;this.attack('power',0,0);}
    else if(k==='nova'){if(this.novaCD>0||this.castCD>0)return;this.novaCD=8;this.attack('nova',0,0);}}
  armRune(){
    if(panelOpen||this.buildMode)return;
    const r=runeRank();if(!r)return;
    if(this.spellCD>0){toast('Spell recharging…');return;}
    this.runeArm=!this.runeArm;
    if(this.runeArm)toast(wallDef().ic+' Swipe where the '+wallDef().nm+' should go!');}
  castRune(pts){
    this.runeArm=false;
    if(pts.length<3)return;
    const rank=runeRank(),cam=this.cameras.main;
    const segs=[];let last=null;const maxSegs=6+rank*3;
    for(const q of pts){
      const wp=cam.getWorldPoint(q.x,q.y);
      const a=wp.x/(IW/2),b2=wp.y/(IH/2);
      const wx=TILE*(a+b2)/2,wy=TILE*(b2-a)/2;
      if(Math.floor(wx/TILE)<1||Math.floor(wy/TILE)<1||Math.floor(wx/TILE)>=GW-1||Math.floor(wy/TILE)>=GH-1)continue;
      if(SOLID.has(tileAt(Math.floor(wx/TILE),Math.floor(wy/TILE))))continue;
      if(!last||Math.hypot(wx-last.x,wy-last.y)>TILE*0.55){segs.push({x:wx,y:wy});last=segs[segs.length-1];
        if(segs.length>=maxSegs)break;}}
    if(!segs.length){toast('Swipe across open ground');return;}
    this.spellCD=this.spellMax=14;
    let dur=5+rank*2;if(isRSub('warden'))dur=Math.round(dur*1.5);
    const dmg=Math.max(4,Math.round(G._atk*(0.55+0.25*rank)*mods().dmg));
    const texKey=cls==='mage'?'flameTex':cls==='warrior'?'b_spike':'thornTex';
    const wd=wallDef();
    const gcol=wd.hex;
    for(const sg of segs){
      const sx2=isoX(sg.x,sg.y),sy2=isoY(sg.x,sg.y);
      const sp2=this.add.image(sx2,sy2,texKey).setOrigin(0.5,0.85).setDepth(sy2+IH*0.28);
      if(cls==='mage'&&G.element!=='fire')sp2.setTint(wd.hex);
      if(cls==='warrior'&&G.element!=='juggernaut')sp2.setTint(wd.hex);
      if(cls==='ranger'&&G.element!=='warden'&&G.element!=='beastmaster')sp2.setTint(wd.hex);
      const gl=this.add.image(sx2,sy2-8,'glow').setScale(0.45).setTint(gcol)
        .setBlendMode(Phaser.BlendModes.ADD).setAlpha(0.4).setDepth(sy2+IH*0.28-1);
      const fs=cls==='warrior'?0.75:1;
      sp2.setScale(0.1);this.tweens.add({targets:sp2,scaleX:fs,scaleY:fs,duration:180,ease:'Back.Out'});
      this.zones.push({x:sg.x,y:sg.y,sp:sp2,gl,life:dur,max:dur,tick:0.3+Math.random()*0.3,tickMax:isWSub('blademaster')?0.28:0.4,dmg,seed:Math.random()*6.28,fs});}
    sfx('wall');this.cameras.main.shake(120,0.004);
    toast(wallDef().ic+' '+wallDef().nm.toUpperCase()+'!');}
  updateZones(dt){
    for(let i=this.zones.length-1;i>=0;i--){const z=this.zones[i];z.life-=dt;
      if(z.life<=0){z.sp.destroy();z.gl.destroy();this.zones.splice(i,1);continue;}
      const fl=1+Math.sin(this.time.now*0.012+z.seed)*0.08;
      if(z.life<z.max-0.25)z.sp.setScale(z.fs*fl);
      const fade=Math.min(1,z.life/1.2);
      z.sp.setAlpha(fade);z.gl.setAlpha(0.4*fade*fl);
      z.tick-=dt;
      if(z.tick<=0){z.tick=z.tickMax||0.4;
        for(const e of [...this.enemies]){
          if(Math.hypot(e.x-z.x,e.y-z.y)>TILE*0.95)continue;
          if(cls==='warrior')e.rootT=Math.max(e.rootT||0,isWSub('juggernaut')?1.6:1.0);
          if(isWSub('berserker')){e.burnT=Math.max(e.burnT||0,2);e.burnDmg=Math.max(1,Math.round(z.dmg*0.25));}
          if(isWSub('warlord'))addSuper(3);
          if(cls==='ranger'){if(isRSub('warden'))e.rootT=Math.max(e.rootT||0,1.2);else e.slowT=Math.max(e.slowT||0,1.5);}
          if(isRSub('trapper')){e.poisonT=Math.max(e.poisonT||0,3);e.poisonDmg=Math.max(2,Math.round((G._atk||6)*0.15));}
          if(isMSub('fire')){e.burnT=3;e.burnDmg=Math.max(2,Math.round(z.dmg*0.35));}
          if(isMSub('chrono'))e.slowT=Math.max(e.slowT||0,2.2);
          this.hurtEnemy(e,Math.max(1,Math.round(z.dmg*(0.85+Math.random()*0.3))),Math.atan2(e.y-z.y,e.x-z.x));}}}}
  classAbility(){
    if(panelOpen)return;
    const rank=abilityRank();if(!rank||this.abilityCD>0)return;
    if(cls==='mage'){this.shieldHp=(28+G.level*3)*rank;this.shieldT=8;this.abilityCD=this.abilityMax=12;
      sfx('heal');toast('🛡 SPELL SHIELD');}
    else if(cls==='warrior'){const heal=Math.round(G.maxHp*(0.10+0.08*rank));
      G.hp=Math.min(G.maxHp,G.hp+Math.round(heal*(isWSub('warlord')?1.5:1)));this.warcryT=isWSub('warlord')?20:10;this.abilityCD=this.abilityMax=15;
      this.waves.push({x:this.px,y:this.py,r:10,maxR:TILE*3,dmg:0,kb:50,hit:new Set()});
      this.cameras.main.shake(200,0.005);sfx('super');toast('📯 WAR CRY! +'+heal+' HP');updateHud();}
    else{this.quiverT=4+rank;this.abilityCD=this.abilityMax=14;sfx('cast');toast('🏹 SWIFT QUIVER');}}
  updateWaves(dt){
    this.waveGfx.clear();
    for(let i=this.waves.length-1;i>=0;i--){const w=this.waves[i];w.r+=430*dt;
      if(w.r>=w.maxR){this.waves.splice(i,1);continue;}
      for(const e of this.enemies){if(w.hit.has(e))continue;
        const d=Math.hypot(e.x-w.x,e.y-w.y);
        if(Math.abs(d-w.r)<26){w.hit.add(e);
          if(w.dmg>0)this.hurtEnemy(e,Math.max(1,Math.round(w.dmg*(0.9+Math.random()*0.2))),Math.atan2(e.y-w.y,e.x-w.x));
          if(w.kb){const dd=d||1;e.vx+=(e.x-w.x)/dd*w.kb*6;e.vy+=(e.y-w.y)/dd*w.kb*6;}}}
      const k=1-w.r/w.maxR;
      this.waveGfx.lineStyle(8*k+2,subVis().hex,Math.max(0,k*0.8));
      this.waveGfx.beginPath();
      for(let a=0;a<=6.4;a+=0.25){const p={x:isoX(w.x+Math.cos(a)*w.r,w.y+Math.sin(a)*w.r),y:isoY(w.x+Math.cos(a)*w.r,w.y+Math.sin(a)*w.r)-8};
        if(a===0)this.waveGfx.moveTo(p.x,p.y);else this.waveGfx.lineTo(p.x,p.y);}
      this.waveGfx.closePath();this.waveGfx.strokePath();}}
  doInteract(){const t2=this.interactT;if(!t2)return;
    if(t2.cave){enterDungeon('cave',t2.cave.x,t2.cave.y);return;}
    if(t2.vault){enterDungeon('sewer',t2.vault.x,t2.vault.y,'Castle Vault');return;}
    if(t2.quest){openQuest(t2.quest.town||0);return;}
    if(t2.sewer){enterDungeon('sewer',t2.sewer.x,t2.sewer.y);return;}
    if(t2.stairs){exitDungeon();return;}
    if(t2.treasure){const{x,y}=t2.treasure;
      grid[y][x]=dungeon.theme==='cave'?'c':'s';
      if(this.chestSprite)this.chestSprite.setVisible(false);
      const lvl=dungeon.lvl+2;
      this.dropGear((x+0.5)*TILE,(y+0.9)*TILE,rollGear(lvl,2));
      this.dropGear((x-0.1)*TILE,(y+0.4)*TILE,rollGear(lvl,1));
      if(Math.random()<0.5)this.dropGear((x+1.1)*TILE,(y+0.4)*TILE,rollGear(lvl,1));
      const c=Math.round((40+lvl*8)*mods().coins);G.coins+=c;
      sfx('catch');this.cameras.main.shake(200,0.005);
      toast('💰 TREASURE! +'+c+'c and gear!');save();updateHud();return;}
    if(t2.buyPlot){const pl=t2.buyPlot;
      if(G.coins<pl.price){toast('Need '+pl.price+'c');sfx('fail');return;}
      G.coins-=pl.price;G.plots[pl.id]=true;sfx('catch');
      this.refreshPlots();toast('🎉 Land purchased — build here!');save();updateHud();return;}
    if(t2.nurse){G.hp=G.maxHp;G.hunger=100;sfx('heal');toast('💗 Fully healed!');save();updateHud();return;}
    if(t2.shop){openShop();return;}
    if(t2.registrar){openRegistrar();return;}
    if(t2.talk){toast(VILLAGER_LINES[(Math.floor(hash(t2.talk.x,t2.talk.y)*100)+G.day)%VILLAGER_LINES.length]);return;}
    if(t2.sign){toast('🪧 Gather 🪵🪨🌿⛏️, buy land, build & defend. Raiders come at night!');return;}
    if(t2.tree){if(!(G.tools.axe>0)){toast('Need a 🪓 axe — craft one (☰ → Craft)');sfx('fail');return;}
      const key=t2.tree.x+','+t2.tree.y;this.choppedCD[key]=this.time.now+5000;
      const amt=1+Math.floor(Math.random()*2)+Math.max(0,G.tools.axe-1)+(G.class==='ranger'?1:0);
      G.res.wood+=amt;sfx('coin');toast('+'+amt+' wood');save();return;}
    if(t2.node){const K=NODE_KIND[t2.node.k];
      if(K.tool&&!(G.tools[K.tool]>0)){toast('Need a '+TOOLS[K.tool].icon+' '+K.tool+' — craft one!');sfx('fail');return;}
      let amt=K.amt[0]+Math.floor(Math.random()*(K.amt[1]-K.amt[0]+1));
      amt+=Math.max(0,(K.give==='wood'?G.tools.axe:(K.give==='stone'||K.give==='ore')?G.tools.pickaxe:0)-1);
      if(G.class==='ranger')amt+=1;
      G.res[K.give]+=amt;G.nodeT[t2.node.tx+','+t2.node.ty]=absDay()+0.3;
      const o=this.nodeSprites[t2.node.tx+','+t2.node.ty];if(o)o.sp.setVisible(false);
      sfx('coin');toast('+'+amt+' '+K.give);save();return;}
    if(t2.hut){if(G.time>0.5)G.day++;G.time=0.28;
      G.hp=Math.min(G.maxHp,G.hp+Math.floor(G.maxHp*0.5));sfx('heal');
      toast('😴 Rested until morning (Day '+G.day+')');save();updateHud();return;}
    if(t2.bank){openBank();return;}
    if(t2.station){openCraft();return;}
    if(t2.tower){openTower(t2.tower);return;}
    if(t2.fix){const b=t2.fix,c=Math.max(1,Math.ceil((b.maxHp-b.hp)/50*(G.class==='warrior'?0.8:1)));
      if((G.res.wood||0)<c){toast('Repair needs '+c+' wood');sfx('fail');return;}
      G.res.wood-=c;b.hp=b.maxHp;sfx('heal');toast('Repaired (−'+c+' wood)');save();return;}
    if(t2.drop){
      if(G.gear.length>=15){toast('🎒 Gear bag full — salvage some!');return;}
      const i=drops.indexOf(t2.drop);if(i<0)return;
      G.gear.push(t2.drop.item);
      toast('Picked up '+t2.drop.item.name+' ('+RARITIES[t2.drop.item.rar].name+')');
      t2.drop.beam.destroy();t2.drop.chest.destroy();t2.drop.gl.destroy();
      drops.splice(i,1);save();
    }else if(t2.bush){
      const key=t2.bush.x+','+t2.bush.y;
      G.berriesPicked[key]=1;G.items.berry=(G.items.berry||0)+1;
      grid[t2.bush.y][t2.bush.x]='.';
      const bs=this.bushSprites[key];if(bs)bs.setVisible(false);
      toast('+1 Berry');save();
    }
    this.interactT=null;document.getElementById('interactTag').style.display='none';}
  dropGear(wx,wy,item){
    const sx=isoX(wx,wy),sy=isoY(wx,wy);
    const R=RARITIES[item.rar],col=R.hex;
    const beam=this.add.image(sx,sy-38,'glow').setScale(0.3,2.4).setTint(col).setBlendMode(Phaser.BlendModes.ADD).setAlpha(0.22).setDepth(sy+9);
    const tex='drop_'+item.slot;
    const chest=this.add.image(sx,sy-10,this.textures.exists(tex)?tex:'chestTex').setScale(0.72).setDepth(sy+10);
    const gl=this.add.image(sx,sy-8,'glow').setScale(0.3).setTint(col).setBlendMode(Phaser.BlendModes.ADD).setAlpha(0.26).setDepth(sy+9.5);
    this.tweens.add({targets:chest,y:sy-14,duration:600,yoyo:true,repeat:-1,ease:'Sine.easeInOut'});
    drops.push({x:wx,y:wy,item,beam,chest,gl});}
  spawnEshot(e,aa){
    const glow=0xc07aff;
    const core=this.add.image(0,0,'dot').setScale(0.42).setTint(e.boss?0xff5a4a:0xc07aff);
    const gl=this.add.image(0,0,'glow').setScale(0.3).setAlpha(0.55).setTint(e.boss?0xff5a4a:glow).setBlendMode(Phaser.BlendModes.ADD);
    const spd=e.boss?260:210;
    this.eshots.push({core,gl,x:e.x,y:e.y,vx:Math.cos(aa)*spd,vy:Math.sin(aa)*spd,
      dmg:Math.max(3,Math.round(e.atk*0.75)),life:2.2});
    sfx('ecast');}
  updateEshots(dt){
    for(let i=this.eshots.length-1;i>=0;i--){const s=this.eshots[i];
      s.life-=dt;s.x+=s.vx*dt;s.y+=s.vy*dt;
      const dead=s.life<=0||solidWorld(s.x,s.y);
      const dp=Math.hypot(s.x-this.px,s.y-this.py);
      if(!dead&&dp<PR+8&&G.hp>0&&this.hurtCD<=0){
        this.hurtCD=0.25;
        damageHero(Math.max(2,Math.round(s.dmg-G._def*0.25)));updateHud();sfx('hit');
        this.cameras.main.shake(80,0.004);this.cameras.main.flash(110,190,60,60);
        if(G.hp<=0){toast('💀 You fell! Loose coins & materials lost — banked goods, gear & levels kept.');
          G.hp=G.maxHp;G.coins=0;G.res={wood:0,stone:0,fiber:0,ore:0};G.hunger=Math.max(50,G.hunger);
          if(dungeon){dungeon=null;const t0=TOWNS[0];G.px=(t0.cx+1.5)*TILE;G.py=(t0.cy+1.5)*TILE;
            pendingPos={x:G.px,y:G.py};save();this.scene.restart();return;}
          if(G.raid&&G.raid.active){G.raid.active=0;G.raid.next=absDay()+1.5;
            for(let j=this.enemies.length-1;j>=0;j--){const r2=this.enemies[j];
              if(r2.raider){r2.s.destroy();r2.hbB.destroy();r2.hbF.destroy();if(r2.nameT)r2.nameT.destroy();this.enemies.splice(j,1);}}}
          const t0=TOWNS[0];this.px=(t0.cx+1.5)*TILE;this.py=(t0.cy+1.5)*TILE;save();updateHud();}
        s.life=0;}
      const ssx=isoX(s.x,s.y),ssy=isoY(s.x,s.y)-14;
      s.core.setPosition(ssx,ssy).setDepth(999000);s.gl.setPosition(ssx,ssy).setDepth(998999);
      if(s.life<=0||dead){s.core.destroy();s.gl.destroy();this.eshots.splice(i,1);}}}
  spawnBoss(){
    let bx=null,by=null;
    for(let r=0;r<14&&bx===null;r++)for(let y=BOSS_LAIR.y-r;y<=BOSS_LAIR.y+r&&bx===null;y++)for(let x=BOSS_LAIR.x-r;x<=BOSS_LAIR.x+r;x++){
      if(x<3||y<3||x>=GW-3||y>=GH-3)continue;
      if(!SOLID.has(grid[y][x])&&grid[y][x]!==','){bx=x;by=y;break;}}
    if(bx===null)return;
    const lvl=Math.min(40,Math.max(12,zoneLevel((bx+.5)*TILE,(by+.5)*TILE)+6));
    const e=this.spawnEnemyAt((bx+0.5)*TILE,(by+0.5)*TILE,lvl,false,true);
    if(!e)return;
    e.boss=true;e.ranged=true;e.s.setScale(1.25);
    e.hp=e.maxHp=Math.round(e.maxHp*2.6);e.atk=Math.round(e.atk*1.25);
    e.nameT.setText('💀 '+BOSS_NAME+' L'+lvl).setColor('#ff5a4a').setFontSize(13);
    e.ring.setTint(0xff5a4a).setScale(1.15);
    this.bossRef=e;}
  spawnEnemy(){
    for(let t2=0;t2<40;t2++){
      const a=Math.random()*6.283,d=(6+Math.random()*9)*TILE;
      const wx=this.px+Math.cos(a)*d,wy=this.py+Math.sin(a)*d;
      const tx2=Math.floor(wx/TILE),ty2=Math.floor(wy/TILE);
      if(tx2<2||ty2<2||tx2>=GW-2||ty2>=GH-2)continue;
      if(solidWorld(wx,wy)||(!dungeon&&townDist(wx,wy)<7))continue;
      const alpha=Math.random()<0.06,rare=!alpha&&Math.random()<0.08;
      this.spawnEnemyAt(wx,wy,Math.min(40,Math.max(1,zoneLevel(wx,wy)+Math.floor(Math.random()*3)))+(alpha?4:rare?2:0),rare,alpha);
      return;}}
  spawnEnemyAt(wx,wy,lvl,rare,alpha){
    {
      const sp=WILD[Math.floor(Math.random()*WILD.length)];
      const s=this.add.sprite(0,0,'cr_'+sp).setScale(alpha?0.9:rare?0.72:0.55).setOrigin(0.5,0.82);
      let nameT=null,crown=null,ring=null;
      if(alpha){
        nameT=this.add.text(0,0,'★L'+lvl,{fontFamily:'Fredoka',fontSize:'12px',color:'#ffd23c',stroke:'#000',strokeThickness:3.5}).setOrigin(0.5).setDepth(999850);
        crown=this.add.image(0,0,'crownTex').setDepth(999849);
        ring=this.add.image(0,0,'glow').setScale(0.95).setTint(0xffcd5a).setBlendMode(Phaser.BlendModes.ADD).setAlpha(0.35).setDepth(999790);}
      else if(rare){s.setTint(0xd8a8ff);
        nameT=this.add.text(0,0,RARE_PREFIX[Math.floor(Math.random()*RARE_PREFIX.length)]+' '+sp+' L'+lvl,
          {fontFamily:'Fredoka',fontSize:'11px',color:'#c07aff',stroke:'#000',strokeThickness:3}).setOrigin(0.5).setDepth(999850);
        ring=this.add.image(0,0,'glow').setScale(0.72).setTint(0xc07aff).setBlendMode(Phaser.BlendModes.ADD).setAlpha(0.3).setDepth(999790);}
      else{nameT=this.add.text(0,0,'L'+lvl,{fontFamily:'Fredoka',fontSize:'10px',color:'#eaf2ff',
        backgroundColor:'rgba(8,10,20,0.62)',padding:{x:5,y:1}}).setOrigin(0.5).setDepth(999850);}
      const hpM=Math.round((30+lvl*9)*(alpha?2.2:rare?1.7:1));
      const hbB=this.add.rectangle(0,0,34,4,0x000000,0.55).setDepth(999800).setVisible(false);
      const hbF=this.add.rectangle(0,0,34,4,0x54c23a).setDepth(999801).setVisible(false);
      const en={s,hbB,hbF,nameT,crown,ring,x:wx,y:wy,vx:0,vy:0,hp:hpM,maxHp:hpM,lvl,rare,alpha:!!alpha,sp,
        ranged:isRangedSp(sp),shootT:1.5+Math.random(),
        atk:Math.round((5+lvl*1.7)*(alpha?1.4:1)),wander:Math.random()*3,wdir:Math.random()*6.28,touch:0,flash:0,bob:Math.random()*6};
      this.enemies.push(en);
      return en;}
  }
  attack(spell,gx,gy,forceAng){
    if(this.castCD>0)return;
    let ang=null;
    if(forceAng!=null)ang=forceAng;
    else{let best=null,bd=cls==='warrior'?TILE*2.6:TILE*7;
      for(const e of this.enemies){const d=Math.hypot(e.x-this.px,e.y-this.py);if(d<bd){bd=d;best=e;}}
      if(best)ang=Math.atan2(best.y-this.py,best.x-this.px);
      else if(gx||gy){let wx=gx/IW+gy/IH,wy=gy/IH-gx/IW;ang=Math.atan2(wy,wx);}
      else ang=Math.atan2(this.face.y,this.face.x);}
    const M=mods();
    const mult=spell==='power'?1.9:spell==='chain'?1.15:spell==='nova'?0.8:1;
    this.castCD=(spell==='bolt'?0.3:0.85)*M.cd*(this.quiverT>0?0.33:1);
    let dmg=Math.max(3,Math.round(G._atk*mult*M.dmg*(0.9+Math.random()*0.2)));
    if(isWSub('blademaster')){
      this.comboN=(this.comboT>0)?Math.min(5,(this.comboN||0)+1):0;
      this.comboT=1.5;dmg=Math.round(dmg*(1+0.05*(this.comboN||0)));}
    if(isRSub('sharpshooter')&&forceAng!=null)dmg=Math.round(dmg*1.4);
    let crit=forceAng!=null&&cls!=='warrior';
    if(!crit&&Math.random()<M.crit)crit=true;
    if(crit)dmg*=2;
    this._critShot=crit;
    this.atkAnimT=0.24;if(this.player.anims.isPlaying)this.player.anims.stop();this.player.play('atk');
    {const scr2=Math.cos(ang)-Math.sin(ang);if(scr2<-0.05)this.flip=-1;else if(scr2>0.05)this.flip=1;}
    sfx('cast');
    if(cls==='warrior'){
      const rch=spell==='power'?TILE*2.3:TILE*1.6;
      this.slashes.push({ang,life:spell==='power'?0.26:0.18,reach:rch});
      if(spell==='nova'){this.slashes.push({ang:ang+2.09,life:0.18,reach:TILE*1.6});this.slashes.push({ang:ang-2.09,life:0.18,reach:TILE*1.6});}
      if(spell==='power'){this.waves.push({x:this.px,y:this.py,r:10,maxR:TILE*2.4,dmg:0,kb:60,hit:new Set()});
        this.cameras.main.shake(180,0.008);}
      else if(spell==='nova')this.cameras.main.shake(140,0.005);
      else this.cameras.main.shake(70,0.003);
      for(const e of this.enemies){const d=Math.hypot(e.x-this.px,e.y-this.py);if(d>(spell==='power'?TILE*3:TILE*2.2))continue;
        let da=Math.atan2(e.y-this.py,e.x-this.px)-ang;while(da>Math.PI)da-=6.283;while(da<-Math.PI)da+=6.283;
        if(spell!=='nova'&&Math.abs(da)>1.1)continue;this.hurtEnemy(e,dmg,ang,crit);}
    }else if(spell==='nova'){
      // ring burst all around
      const n=8+M.count;
      for(let i=0;i<n;i++){const a2=ang+i*(Math.PI*2/n);
        this.spawnShot(a2,430,dmg,(cls==='ranger'?1:0)+M.pierce,subVis().hex,cls==='ranger');}
      this.waves.push({x:this.px,y:this.py,r:10,maxR:TILE*2.2,dmg:0,kb:35,hit:new Set()});
      this.cameras.main.shake(130,0.005);
    }else if(spell==='power'){
      // one huge heavy bolt
      this.spawnShot(ang,540,dmg,1+M.pierce,0xffd23c,cls==='ranger',true);
      this.cameras.main.shake(160,0.006);
    }else{
      const n=1+M.count;
      for(let i=0;i<n;i++){const a2=ang+(i-(n-1)/2)*0.28;
        this.spawnShot(a2,cls==='ranger'?600:480,dmg,(spell==='chain'?2:(cls==='ranger'?1:0))+M.pierce,subVis().hex);
      }
    }
    this._critShot=false;
  }
  hurtEnemy(e,dmg,ang,crit){
    if(isRSub('beastmaster')&&(e.marked||0)>0)dmg=Math.round(dmg*1.15);
    if(isRSub('warden')&&Math.random()<0.15)e.rootT=Math.max(e.rootT||0,0.8);
    e.hp-=dmg;e.flash=0.15;e.s.setTintFill(0xffffff);addSuper(dmg*0.35);sfx('hit');
    if(isWSub('berserker')){
      G.hp=Math.min(G.maxHp,G.hp+dmg*(this.frenzyT>0?0.14:0.08));
      this.rage=Math.min(100,(this.rage||0)+dmg*0.35);}
    if(isMSub('necro'))G.hp=Math.min(G.maxHp,G.hp+dmg*0.04);
    if(G&&G.element&&!e._noProc){
      if(G.element==='fire'){e.burnT=Math.max(e.burnT||0,1.2);e.burnDmg=Math.max(1,Math.round((G._atk||5)*0.12));}
      else if(G.element==='frost'||G.element==='chrono')e.slowT=Math.max(e.slowT||0,0.9);
      else if(G.element==='storm'&&Math.random()<(isMSub('storm')?0.25:0.15)){
        let from=e,jd=Math.round(dmg*0.4);
        const jumps=isMSub('storm')?2:1,hit=new Set([e]);
        for(let j=0;j<jumps;j++){
          let best=null,bd=TILE*3.5;
          for(const o of this.enemies){if(hit.has(o))continue;const d=Math.hypot(o.x-from.x,o.y-from.y);if(d<bd){bd=d;best=o;}}
          if(!best)break;hit.add(best);
          best._noProc=1;this.hurtEnemy(best,Math.max(1,jd),Math.atan2(best.y-from.y,best.x-from.x));best._noProc=0;
          if(best.s&&best.s.scene){this.hitEmit.setPosition(best.s.x,best.s.y-16);this.hitEmit.explode(6);}
          from=best;jd=Math.round(jd*0.6);}}}
    e.vx+=Math.cos(ang)*140;e.vy+=Math.sin(ang)*140;
    this.hitEmit.setPosition(e.s.x,e.s.y-14);this.hitEmit.explode(8);
    const t=this.add.text(e.s.x,e.s.y-34,crit?dmg+'!':''+dmg,
      {fontFamily:'Fredoka',fontSize:crit?'20px':'15px',color:crit?'#ffb454':'#fff',stroke:'#000',strokeThickness:crit?4:3}).setOrigin(0.5).setDepth(9999000);
    if(crit){sfx('crit');t.setScale(0.6);
      this.tweens.add({targets:t,scale:1.15,duration:110,yoyo:true});}
    this.tweens.add({targets:t,y:t.y-(crit?30:22),alpha:0,duration:crit?750:600,onComplete:()=>t.destroy()});
    if(e.hp<=0){
      this.hitEmit.setPosition(e.s.x,e.s.y-12);this.hitEmit.explode(16);
      const c=Math.round((4+e.lvl*2.5)*(e.alpha?3:e.rare?2:1)*mods().coins);G.coins+=c;
      const ct=this.add.text(e.s.x,e.s.y-24,'+'+c+'c',{fontFamily:'Fredoka',fontSize:'14px',color:'#ffd23c',stroke:'#000',strokeThickness:3}).setOrigin(0.5).setDepth(9999000);
      this.tweens.add({targets:ct,y:ct.y-26,alpha:0,duration:800,onComplete:()=>ct.destroy()});
      {let xg=(4+e.lvl*2.2)*(e.boss?6:e.alpha?3:e.rare?2:1);
       const gap=G.level-e.lvl;
       if(gap>0)xg*=Math.max(0.1,1-gap*0.15);      // farming low-level mobs pays less and less
       else if(gap<0)xg*=Math.min(1.4,1-gap*0.08); // punching up pays a bonus
       grantXp(Math.max(1,Math.round(xg)));}
      killSfx(e);
      if(e.boss){G.bossRespawn=G.day+2;G.bossKills=(G.bossKills||0)+1;G.coins+=100+e.lvl*8;
        this.dropGear(e.x,e.y,rollGear(e.lvl,3));this.dropGear(e.x+30,e.y,rollGear(e.lvl,2));
        for(const q2 of G.quests||[])if(q2.key==='boss')q2.n=Math.min(q2.need,(q2.n||0)+1);
        toast('💀 '+BOSS_NAME+' DEFEATED! Epic loot + '+(100+e.lvl*8)+'c');sfx('level');}
      else if(e.alpha){this.dropGear(e.x,e.y,rollGear(e.lvl,2));toast('⭐ Defeated the ALPHA '+e.sp+'!');}
      else if(e.rare)this.dropGear(e.x,e.y,rollGear(e.lvl,1));
      else if(Math.random()<0.06)this.dropGear(e.x,e.y,rollGear(e.lvl,0));
      if(!e.raider)for(const q2 of G.quests||[]){
        if(q2.key==='slay')q2.n=Math.min(q2.need,(q2.n||0)+1);
        if(q2.key==='rare'&&(e.rare||e.alpha))q2.n=Math.min(q2.need,(q2.n||0)+1);}
      if(isMSub('fire')&&(e.burnT||0)>0){
        this.hitEmit.setPosition(e.s.x,e.s.y-10);this.hitEmit.explode(18);
        this.cameras.main.shake(90,0.004);
        const bx2=e.x,by2=e.y,bd3=Math.max(4,Math.round((G._atk||6)*0.8));
        for(const o of [...this.enemies]){if(o===e)continue;
          if(Math.hypot(o.x-bx2,o.y-by2)>TILE*1.7)continue;
          o.burnT=Math.max(o.burnT||0,1.5);o.burnDmg=Math.max(1,Math.round((G._atk||5)*0.12));
          o._noProc=1;this.hurtEnemy(o,bd3,Math.atan2(o.y-by2,o.x-bx2));o._noProc=0;}}
      if(isMSub('necro')&&!e.raider&&Math.random()<0.2&&(this.minions||[]).length<3){
        const ms=this.add.sprite(0,0,'cr_'+e.sp).setScale(0.4).setOrigin(0.5,0.82)
          .setTint(0x9adfff).setAlpha(0.75);
        const mg=this.add.image(0,0,'glow').setScale(0.3).setTint(0x9adfff).setBlendMode(Phaser.BlendModes.ADD).setAlpha(0.3);
        this.minions.push({x:e.x,y:e.y,s:ms,gl:mg,life:12,cd:0.5});
        toast('💀 '+e.sp+' rises to serve you!');}
      e.s.destroy();e.hbB.destroy();e.hbF.destroy();if(e.nameT)e.nameT.destroy();if(e.crown)e.crown.destroy();if(e.ring)e.ring.destroy();
      this.enemies.splice(this.enemies.indexOf(e),1);
      updateHud();this.spawnEnemy();
    }
  }
  dash(){
    if(this.dashCD>0)return;this.dashCD=isWSub('blademaster')?2:3;
    if(isWSub('blademaster')){this.castCD=0;this.parryT=0.45;}
    let dx=this.face.x,dy=this.face.y;const mv=Math.hypot(this.vx,this.vy);
    if(mv>25){dx=this.vx/mv;dy=this.vy/mv;}
    if(cls==='mage'){let d=TILE*3.2;while(d>10&&this.collides(this.px+dx*d,this.py+dy*d))d-=10;
      this.hitEmit.setPosition(isoX(this.px,this.py),isoY(this.px,this.py)-10);this.hitEmit.explode(12);
      this.px+=dx*d;this.py+=dy*d;
      this.hitEmit.setPosition(isoX(this.px,this.py),isoY(this.px,this.py)-10);this.hitEmit.explode(12);}
    else{this.dashT=0.16;this.dashDir={x:dx,y:dy};}
  }
  collides(x,y){for(const[ox,oy]of[[PR,0],[-PR,0],[0,PR],[0,-PR]])if(solidWorld(x+ox,y+oy))return true;return false;}
  refreshPlots(){
    this.plotGfx.clear();this.plotTexts.forEach(t2=>t2.destroy());this.plotTexts=[];
    for(const pl of PLOTS){const own=G.plots[pl.id];
      this.plotGfx.lineStyle(2.5,own?0x54c23a:0xffd23c,own?0.75:0.6);
      const c0={x:pl.x*TILE,y:pl.y*TILE},c1={x:(pl.x+pl.w)*TILE,y:pl.y*TILE},
            c2={x:(pl.x+pl.w)*TILE,y:(pl.y+pl.h)*TILE},c3={x:pl.x*TILE,y:(pl.y+pl.h)*TILE};
      this.plotGfx.beginPath();
      [[c0,c1],[c1,c2],[c2,c3],[c3,c0]].forEach(([a,b2])=>{
        this.plotGfx.moveTo(isoX(a.x,a.y),isoY(a.x,a.y));this.plotGfx.lineTo(isoX(b2.x,b2.y),isoY(b2.x,b2.y));});
      this.plotGfx.strokePath();
      if(!own){const mx=(pl.x+pl.w/2)*TILE,my2=(pl.y+pl.h/2)*TILE;
        this.plotTexts.push(this.add.text(isoX(mx,my2),isoY(mx,my2),'FOR SALE '+pl.price+'c',
          {fontFamily:'Fredoka',fontSize:'11px',color:'#ffd23c',stroke:'#000',strokeThickness:3}).setOrigin(0.5).setDepth(-89999));}}}
  addBuildSprite(b){
    const wx=(b.x+0.5)*TILE,wy=(b.y+0.5)*TILE,sx=isoX(wx,wy),sy=isoY(wx,wy);
    const key=b.t==='hut'?'houseR2':b.t==='campfire'?'campfire':b.t==='chest'?'b_chestB':'b_'+b.t;
    const sp2=this.add.image(sx,sy,key).setDepth(sy+IH*0.28).setOrigin(0.5,b.t==='hut'?0.8:0.82);
    this.buildSprites[b.x+','+b.y]=sp2;
    if(BUILD_DEF[b.t].light){const gl=this.add.image(sx,sy-14,'glow').setScale(0.9).setTint(b.t==='tfrost'?0x7ad0ff:0xff9a3c)
      .setBlendMode(Phaser.BlendModes.ADD).setAlpha(0.45).setDepth(sy+IH*0.28+1);sp2._gl=gl;}}
  removeBuildSprite(b){const k=b.x+','+b.y,sp2=this.buildSprites[k];
    if(sp2){if(sp2._gl)sp2._gl.destroy();sp2.destroy();delete this.buildSprites[k];}}
  damageBuild(b,d){b.hp-=d;
    if(b.hp<=0){const i=G.builds.indexOf(b);if(i>=0)G.builds.splice(i,1);
      rebuildBuildIndex();this.removeBuildSprite(b);
      toast('💥 Your '+BUILD_DEF[b.t].name+' was destroyed!');noiseBurst(0.25,0.18);save();}}
  buildOk(tx2,ty2){const t2=tileAt(tx2,ty2);
    const occ=!!buildAt[tx2+','+ty2]||(tx2===Math.floor(this.px/TILE)&&ty2===Math.floor(this.py/TILE));
    return !SOLID.has(t2)&&t2!==','&&!occ;}
  enterBuild(key,r){this.buildMode=key;this.buildRecipe=r;
    this.runeArm=false;
    const dx=Math.round(this.face.x),dy=Math.round(this.face.y);
    let tx2=Math.floor(this.px/TILE)+dx,ty2=Math.floor(this.py/TILE)+dy;
    if(dx===0&&dy===0)ty2+=1;
    this.buildSel={x:tx2,y:ty2};
    document.getElementById('buildBar').style.display='flex';}
  effCost(r){if(!isRSub('trapper')||!BUILD_DEF[r.key]||!BUILD_DEF[r.key].trap)return r.cost;
    const c2={};for(const k in r.cost)c2[k]=Math.max(1,Math.ceil(r.cost[k]/2));return c2;}
  placeBuild(){
    if(!this.buildMode||!this.buildSel)return;
    const bt={x:this.buildSel.x,y:this.buildSel.y,ok:this.buildOk(this.buildSel.x,this.buildSel.y)};
    if(!bt.ok){toast("Can't build there");return;}
    const r=this.buildRecipe,rc=this.effCost(r);
    if(r.plot&&!ownsAt(bt.x,bt.y)){toast('You must own this land — buy the plot!');sfx('fail');return;}
    if(!haveCost(rc)){toast('Not enough materials');this.cancelBuild();return;}
    payCost(rc);
    const def=BUILD_DEF[this.buildMode];
    const maxHp2=Math.round(def.hp*(G.class==='warrior'?1.25:1));
    const b={t:this.buildMode,x:bt.x,y:bt.y,hp:maxHp2,maxHp:maxHp2};
    if(def.tower){b.tier=1;b.ammo=0;}
    if(def.trap)b.uses=def.uses*(isRSub('trapper')?2:1);
    G.builds.push(b);rebuildBuildIndex();this.addBuildSprite(b);gainCraftXp();sfx('coin');save();
    if(!haveCost(this.effCost(r))){this.cancelBuild();toast('Built! (out of materials)');}
    else toast('Built! Tap another tile, or ✕ when done');}
  cancelBuild(){this.buildMode=null;this.buildRecipe=null;this.buildSel=null;
    document.getElementById('buildBar').style.display='none';
    if(this.ghost){this.ghost.destroy();this.ghost=null;}}
  updateTowers(dt){
    for(const b of G.builds){const T2=TOWERS[b.t];if(!T2)continue;
      b.cd=(b.cd||0)-dt;if(b.cd>0||!(b.ammo>0))continue;
      const tier=T2.tiers[(b.tier||1)-1],rng=tier.range*TILE*(G.class==='mage'?1.1:1);
      const bx=(b.x+0.5)*TILE,by=(b.y+0.5)*TILE;
      let best=null,bd=rng;
      for(const e of this.enemies){const d=Math.hypot(e.x-bx,e.y-by);if(d<bd){bd=d;best=e;}}
      if(!best)continue;
      let rate=tier.rate;
      if(isWSub('warlord')&&Math.hypot(this.px-bx,this.py-by)<TILE*7)rate*=0.65;
      b.cd=rate;b.ammo--;
      const t0=bd/540,a=Math.atan2(best.y+best.vy*t0-by,best.x+best.vx*t0-bx);
      const dmg=Math.floor(tier.dmg*(G.class==='mage'?1.15:1));
      const core=this.add.image(0,0,'dot').setScale(0.45).setTint(T2.col);
      const gl=this.add.image(0,0,'glow').setScale(0.45).setTint(T2.col).setBlendMode(Phaser.BlendModes.ADD);
      this.shots.push({core,gl,x:bx,y:by,vx:Math.cos(a)*540,vy:Math.sin(a)*540,dmg,life:1.0,pierce:0,turret:true,slow:tier.slow,aoe:tier.aoe});}}
  updateTraps(dt){
    for(let i=G.builds.length-1;i>=0;i--){const b=G.builds[i],TR=TRAPS[b.t];if(!TR)continue;
      b.cd=(b.cd||0)-dt;if(b.cd>0)continue;
      const bx=(b.x+0.5)*TILE,by=(b.y+0.5)*TILE;
      for(const e of this.enemies){if(Math.hypot(e.x-bx,e.y-by)>TILE*0.62)continue;
        b.cd=TR.cd;
        if(b.t==='spike'){this.hurtEnemy(e,TR.dmg,0);}
        else e.rootT=TR.root;
        if(isRSub('trapper')){e.poisonT=3;e.poisonDmg=Math.max(2,Math.round((G._atk||6)*0.15));}
        b.uses--;
        if(b.uses<=0){G.builds.splice(i,1);rebuildBuildIndex();this.removeBuildSprite(b);save();}
        break;}}}
  structuresOnPlots(){let n=0;for(const b of G.builds)if(ownsAt(b.x,b.y))n++;return n;}
  updateRaid(dt){
    if(!G.raid)G.raid={next:absDay()+1.6,active:0,warned:0,num:0};
    const R=G.raid;
    if(R.active){if(!this.enemies.some(e=>e.raider)){R.active=0;R.warned=0;R.next=absDay()+2+Math.random()*1.5;
      const rw=Math.round((20+G.level*5)*mods().coins);G.coins+=rw;
      toast('🛡️ Raid repelled! +'+rw+'c');sfx('level');save();updateHud();}return;}
    if(this.structuresOnPlots()<3)return;
    if(!R.warned&&R.next-absDay()<0.1){R.warned=1;toast('⚠️ Raiders are coming for your base!');sfx('engage');}
    if(absDay()>=R.next){R.active=1;R.num++;
      let cxs=0,cys=0,n=0;
      for(const b of G.builds)if(ownsAt(b.x,b.y)){cxs+=(b.x+0.5)*TILE;cys+=(b.y+0.5)*TILE;n++;}
      if(!n){R.active=0;return;}
      const c={x:cxs/n,y:cys/n},cnt=Math.min(9,2+R.num+Math.floor(G.level/4));
      const a0=Math.random()*6.283;
      for(let i=0;i<cnt;i++){const a=a0+(Math.random()-.5)*1.2,d=TILE*(12+Math.random()*4);
        let wx=Phaser.Math.Clamp(c.x+Math.cos(a)*d,3*TILE,(MW-3)*TILE),
            wy=Phaser.Math.Clamp(c.y+Math.sin(a)*d,3*TILE,(MH-3)*TILE);
        if(solidWorld(wx,wy,true))continue;
        this.spawnRaider(wx,wy,Math.min(40,Math.max(2,G.level+R.num)));}
      this.cameras.main.shake(300,0.006);sfx('super');toast('⚔️ RAID '+R.num+'! Defend your base!');save();}}
  spawnRaider(wx,wy,lvl){
    const sp=WILD[Math.floor(Math.random()*WILD.length)];
    const s2=this.add.sprite(0,0,'cr_'+sp).setScale(0.62).setOrigin(0.5,0.82).setTint(0xff9a8a);
    const nameT=this.add.text(0,0,'Raider L'+lvl,{fontFamily:'Fredoka',fontSize:'11px',color:'#e8483a',stroke:'#000',strokeThickness:3}).setOrigin(0.5).setDepth(999850);
    const hpM=Math.round(26+lvl*8);
    const hbB=this.add.rectangle(0,0,34,4,0x000000,0.55).setDepth(999800).setVisible(false);
    const hbF=this.add.rectangle(0,0,34,4,0x54c23a).setDepth(999801).setVisible(false);
    this.enemies.push({s:s2,hbB,hbF,nameT,x:wx,y:wy,vx:0,vy:0,hp:hpM,maxHp:hpM,lvl,rare:false,raider:true,sp,
      atk:6+lvl*1.8,wander:0,wdir:0,touch:0,flash:0,bob:Math.random()*6,atkCD:0});}
  update(_,dms){
    const dt=Math.min(0.05,dms/1000);
    const cdm=isMSub('chrono')?1.18:1;
    this.castCD=Math.max(0,this.castCD-dt*cdm);this.dashCD=Math.max(0,this.dashCD-dt*cdm);this.hurtCD=Math.max(0,this.hurtCD-dt);this.spellCD=Math.max(0,this.spellCD-dt*cdm);this.strikeCD=Math.max(0,this.strikeCD-dt*cdm);this.novaCD=Math.max(0,this.novaCD-dt*cdm);
    this.rewindCD=Math.max(0,(this.rewindCD||0)-dt);
    this.parryT=Math.max(0,this.parryT-dt);this.comboT=Math.max(0,(this.comboT||0)-dt);if(this.comboT<=0)this.comboN=0;
    if(this.frenzyT>0){this.frenzyT-=dt;this.player.setTint(0xff8a7a);
      if(this.frenzyT<=0){this.player.clearTint();toast('Frenzy fades…');updateHud();}}
    else if(isWSub('berserker')&&(this.rage||0)>=100){this.rage=0;this.frenzyT=6;
      this.cameras.main.flash(220,255,60,40);this.cameras.main.shake(200,0.006);
      sfx('super');toast('🩸 FRENZY! +40% damage, +30% speed');}
    this.abilityCD=Math.max(0,this.abilityCD-dt*(isMSub('chrono')?1.18:1));this.shieldT=Math.max(0,this.shieldT-dt);
    this.warcryT=Math.max(0,this.warcryT-dt);this.quiverT=Math.max(0,this.quiverT-dt);
    G.time=(G.time+dt/DAY_LEN);if(G.time>=1){G.time-=1;G.day++;toast('☀️ Day '+G.day);}
    this.updateWaves(dt);this.updateZones(dt);this.updateEshots(dt);
    if(this.wolf){const w=this.wolf;w.cd=Math.max(0,w.cd-dt);
      let tgt=null,bd2=TILE*5.5;
      for(const e of this.enemies){const d2=Math.hypot(e.x-this.px,e.y-this.py);if(d2<bd2){bd2=d2;tgt=e;}}
      const hx=tgt?tgt.x:this.px-44,hy=tgt?tgt.y:this.py-22;
      const dwx=hx-w.x,dwy=hy-w.y,dwl=Math.hypot(dwx,dwy)||1;
      const PD=petDef(),wspd=tgt?PD.spd:PD.spd*0.8;
      if(dwl>18){w.x+=dwx/dwl*Math.min(wspd*dt,dwl);w.y+=dwy/dwl*Math.min(wspd*dt,dwl);}
      if(tgt&&dwl<34&&w.cd<=0){w.cd=petRate();
        tgt.marked=petMark();
        if(PD.stun)tgt.rootT=Math.max(tgt.rootT||0,PD.stun);
        tgt._noProc=1;this.hurtEnemy(tgt,petDmg(),Math.atan2(tgt.y-w.y,tgt.x-w.x));tgt._noProc=0;}
      const wsx=isoX(w.x,w.y),wsy=isoY(w.x,w.y)-Math.abs(Math.sin(this.time.now*0.012))*2;
      w.s.setPosition(wsx,wsy).setDepth(isoY(w.x,w.y)+IH*0.28).setFlipX(dwx<0);
      w.gl.setPosition(wsx,wsy-10).setDepth(isoY(w.x,w.y)+IH*0.28-1);}
    for(let mi=(this.minions||[]).length-1;mi>=0;mi--){const w=this.minions[mi];
      w.life-=dt;w.cd=Math.max(0,w.cd-dt);
      if(w.life<=0){w.s.destroy();w.gl.destroy();this.minions.splice(mi,1);continue;}
      let tgt=null,bd2=TILE*6;
      for(const e of this.enemies){const d2=Math.hypot(e.x-w.x,e.y-w.y);if(d2<bd2){bd2=d2;tgt=e;}}
      const hx=tgt?tgt.x:this.px+30+mi*24,hy=tgt?tgt.y:this.py+26;
      const dwx=hx-w.x,dwy=hy-w.y,dwl=Math.hypot(dwx,dwy)||1;
      if(dwl>16){w.x+=dwx/dwl*Math.min(165*dt,dwl);w.y+=dwy/dwl*Math.min(165*dt,dwl);}
      if(tgt&&dwl<30&&w.cd<=0){w.cd=1.2;
        tgt._noProc=1;this.hurtEnemy(tgt,Math.max(2,Math.round((G._atk||6)*0.35)),Math.atan2(tgt.y-w.y,tgt.x-w.x));tgt._noProc=0;}
      if(!this.minions[mi])continue;
      const wsx=isoX(w.x,w.y),wsy=isoY(w.x,w.y)-Math.abs(Math.sin(this.time.now*0.01+mi))*3;
      w.s.setPosition(wsx,wsy).setDepth(isoY(w.x,w.y)+IH*0.28).setFlipX(dwx<0)
        .setAlpha(Math.min(0.75,w.life));
      w.gl.setPosition(wsx,wsy-10).setDepth(isoY(w.x,w.y)+IH*0.28-1);}if(!dungeon){this.updateTowers(dt);this.updateTraps(dt);this.updateRaid(dt);}
    this.nodeCheckT+=dt;if(this.nodeCheckT>1){this.nodeCheckT=0;
      for(const k in this.nodeSprites){const o=this.nodeSprites[k];
        o.sp.setVisible(nodeReady(o.nd.tx,o.nd.ty));}}
    // build ghost sits on the tapped tile
    if(this.buildMode&&this.buildSel){
      const bt=this.buildSel;
      const key=this.buildMode==='hut'?'houseR2':this.buildMode==='campfire'?'campfire':this.buildMode==='chest'?'b_chestB':'b_'+this.buildMode;
      if(!this.ghost)this.ghost=this.add.image(0,0,key).setOrigin(0.5,0.82);
      const wx=(bt.x+0.5)*TILE,wy=(bt.y+0.5)*TILE;
      const bad=!this.buildOk(bt.x,bt.y)||(this.buildRecipe.plot&&!ownsAt(bt.x,bt.y));
      this.ghost.setAlpha(0.55+Math.sin(this.time.now*0.008)*0.15)
        .setPosition(isoX(wx,wy),isoY(wx,wy)).setDepth(isoY(wx,wy)+IH*0.28).setTint(bad?0xff6666:0xffffff);
    }else if(this.ghost){this.ghost.destroy();this.ghost=null;}
    this.survT+=dt;if(this.survT>0.5){this.survT=0;
      if(!dungeon)revealAt(this.px,this.py);
      this._trk=trackTargetLive();
      G.hunger=Math.max(0,G.hunger-(Math.hypot(this.vx,this.vy)>20?0.4:0.2));
      if(G.hunger<=0)G.hp=Math.max(0,G.hp-1);
      const rg=mods().regen;if(rg>0&&G.hp>0&&G.hp<G.maxHp)G.hp=Math.min(G.maxHp,G.hp+rg);
      updateHud();}
    this.saveT+=dt;if(this.saveT>4){this.saveT=0;save();}
    let ix=0,iy=0;
    if(this.joy.active){ix=this.joy.nx;iy=this.joy.ny;}
    else{const k=this.keys;ix=((k.D.isDown||k.RIGHT.isDown)?1:0)-((k.A.isDown||k.LEFT.isDown)?1:0);
      iy=((k.S.isDown||k.DOWN.isDown)?1:0)-((k.W.isDown||k.UP.isDown)?1:0);}
    if(Phaser.Input.Keyboard.JustDown(this.keys.J))this.attack('bolt',0,0);
    if(Phaser.Input.Keyboard.JustDown(this.keys.Q)||Phaser.Input.Keyboard.JustDown(this.keys.SHIFT))this.dash();
    const mag=Math.min(1,Math.hypot(ix,iy)),SP=220*mods().speed;
    let tvx=0,tvy=0;
    if(mag>0.06){
      let wx=ix/IW+iy/IH,wy=iy/IH-ix/IW;const wl=Math.hypot(wx,wy)||1;wx/=wl;wy/=wl;
      tvx=wx*SP*mag;tvy=wy*SP*mag;this.face={x:wx,y:wy};}
    this.vx+=(tvx-this.vx)*Math.min(1,dt*12);this.vy+=(tvy-this.vy)*Math.min(1,dt*12);
    if(this.dashT>0){this.dashT-=dt;this.vx=this.dashDir.x*950;this.vy=this.dashDir.y*950;}
    const nx=this.px+this.vx*dt,ny=this.py+this.vy*dt;
    if(!this.collides(nx,this.py))this.px=nx;
    if(!this.collides(this.px,ny))this.py=ny;
    const sx=isoX(this.px,this.py),sy=isoY(this.px,this.py);
    const moving=Math.hypot(this.vx,this.vy)>20;
    this.atkAnimT=Math.max(0,this.atkAnimT-dt);
    if(moving){const scr=(this.vx-this.vy);this.flip=scr<-1?-1:scr>1?1:this.flip;}
    if(this.atkAnimT>0)this.player.play('atk',true);
    else if(moving)this.player.play('walk',true);
    else{this.player.anims.stop();this.player.setTexture('heroIdle');}
    this.player.setPosition(sx,sy).setDepth(sy+IH*0.28).setFlipX(this.flip<0);
    this.pGlow.setPosition(sx,sy-14).setDepth(sy+IH*0.28-1);
    if(this.setEmit)this.setEmit.setPosition(sx,sy-20);
    this.camTarget.setPosition(sx,sy);
    for(let i=this.enemies.length-1;i>=0;i--){const e=this.enemies[i];
      e.flash=Math.max(0,e.flash-dt);
      if(e.flash<=0){e.s.clearTint();
        if(e.burnT>0)e.s.setTint(0xff9a66);
        else if((e.poisonT||0)>0)e.s.setTint(0x9adf6a);
        else if(e.rare)e.s.setTint(0xd8a8ff);}
      if(e.burnT>0){e.burnT-=dt;
        if(Math.random()<dt*8){this.hitEmit.setPosition(e.s.x+(Math.random()-0.5)*18,e.s.y-16-Math.random()*10);this.hitEmit.explode(1);}
        e.burnTick=(e.burnTick===undefined?0.5:e.burnTick)-dt;
        if(e.burnTick<=0){e.burnTick=0.5;
          this.hurtEnemy(e,e.burnDmg||2,Math.random()*6.28);
          if(!this.enemies.includes(e))continue;}}
      if((e.poisonT||0)>0){e.poisonT-=dt;
        e.poisonTick=(e.poisonTick===undefined?0.6:e.poisonTick)-dt;
        if(e.poisonTick<=0){e.poisonTick=0.6;
          this.hurtEnemy(e,e.poisonDmg||2,Math.random()*6.28);
          if(!this.enemies.includes(e))continue;}}
      e.marked=Math.max(0,(e.marked||0)-dt);
      e.touch=Math.max(0,e.touch-dt);e.bob+=dt;
      e.rootT=Math.max(0,(e.rootT||0)-dt);e.slowT=Math.max(0,(e.slowT||0)-dt);
      const sf=e.rootT>0?0:(e.slowT>0?0.45:1);
      const dx=this.px-e.x,dy=this.py-e.y,dl=Math.hypot(dx,dy)||1;
      if(!dungeon&&!e.raider&&!e.boss&&dl>TILE*24){e.s.destroy();e.hbB.destroy();e.hbF.destroy();if(e.nameT)e.nameT.destroy();if(e.crown)e.crown.destroy();if(e.ring)e.ring.destroy();this.enemies.splice(i,1);this.spawnEnemy();continue;}
      if(e.raider){ // march on the base, smash buildings
        if(!e.tgt||!G.builds.includes(e.tgt)){let best=null,bd2=1e9;
          for(const b of G.builds){if(!ownsAt(b.x,b.y))continue;
            const d2=Math.hypot((b.x+0.5)*TILE-e.x,(b.y+0.5)*TILE-e.y);if(d2<bd2){bd2=d2;best=b;}}
          e.tgt=best;}
        let tx2,ty2;
        if(dl<(isWSub('juggernaut')?TILE*5.5:TILE*2.2)||!e.tgt){tx2=this.px;ty2=this.py;}
        else{tx2=(e.tgt.x+0.5)*TILE;ty2=(e.tgt.y+0.5)*TILE;}
        const ddx=tx2-e.x,ddy=ty2-e.y,ddl=Math.hypot(ddx,ddy)||1;
        if(ddl>TILE*0.85){const spd=78*sf;
          e.vx+=(ddx/ddl*spd-e.vx)*Math.min(1,dt*3);e.vy+=(ddy/ddl*spd-e.vy)*Math.min(1,dt*3);
          const nx3=e.x+e.vx*dt,ny3=e.y+e.vy*dt;
          if(!solidWorld(nx3,e.y,true))e.x=nx3;else{const bb=buildAt[Math.floor(nx3/TILE)+','+Math.floor(e.y/TILE)];if(bb&&ownsAt(bb.x,bb.y))e.tgt=bb;e.vx*=-0.3;}
          if(!solidWorld(e.x,ny3,true))e.y=ny3;else{const bb=buildAt[Math.floor(e.x/TILE)+','+Math.floor(ny3/TILE)];if(bb&&ownsAt(bb.x,bb.y))e.tgt=bb;e.vy*=-0.3;}
        }else{e.vx=e.vy=0;e.atkCD=(e.atkCD||0)-dt;
          if(e.atkCD<=0){e.atkCD=1;
            if(e.tgt&&ddl<TILE*1.1){this.damageBuild(e.tgt,6+Math.floor(e.lvl*1.2));sfx('hit');
              this.hitEmit.setPosition(isoX(tx2,ty2),isoY(tx2,ty2)-14);this.hitEmit.explode(5);}
          }}
      }else if(e.ranged&&dl<TILE*6.5){
        // caster: keep distance, lob bolts (Diablo fallen shaman style)
        let mvx=0,mvy=0;const sp2=64*sf;
        if(dl<TILE*2.6){mvx=-dx/dl;mvy=-dy/dl;}
        else if(dl>TILE*5){mvx=dx/dl;mvy=dy/dl;}
        e.vx+=(mvx*sp2-e.vx)*Math.min(1,dt*3);e.vy+=(mvy*sp2-e.vy)*Math.min(1,dt*3);
        const ex2=e.x+e.vx*dt,ey2=e.y+e.vy*dt;
        if(!solidWorld(ex2,e.y,true))e.x=ex2;
        if(!solidWorld(e.x,ey2,true))e.y=ey2;
        e.shootT-=dt;
        if(e.shootT<=0&&G.hp>0&&e.rootT<=0){e.shootT=e.boss?1.4:2.4+Math.random()*0.8;
          const aa=Math.atan2(this.py-e.y,this.px-e.x);
          const vol=e.boss?3:1;
          for(let vi=0;vi<vol;vi++)this.spawnEshot(e,aa+(vi-(vol-1)/2)*0.3);}
      }else{
        const sp2=(dl<TILE*4?68:24)*sf;
        if(dl<TILE*4){e.vx+=(dx/dl*sp2-e.vx)*Math.min(1,dt*3);e.vy+=(dy/dl*sp2-e.vy)*Math.min(1,dt*3);}
        else{e.wander-=dt;if(e.wander<=0){e.wander=1+Math.random()*2;e.wdir=Math.random()*6.28;}
          e.vx+=(Math.cos(e.wdir)*sp2-e.vx)*Math.min(1,dt*2);e.vy+=(Math.sin(e.wdir)*sp2-e.vy)*Math.min(1,dt*2);}
        const ex2=e.x+e.vx*dt,ey2=e.y+e.vy*dt;
        if(!solidWorld(ex2,e.y,true))e.x=ex2;else e.wdir=Math.random()*6.28;
        if(!solidWorld(e.x,ey2,true))e.y=ey2;else e.wdir=Math.random()*6.28;
      }
      const esx=isoX(e.x,e.y),esy=isoY(e.x,e.y)-Math.abs(Math.sin(e.bob*3))*3;
      e.s.setPosition(esx,esy).setDepth(isoY(e.x,e.y)+IH*0.28);
      e.s.setFlipX((e.vx-e.vy)<0);
      if(e.nameT)e.nameT.setPosition(esx,esy-(e.alpha?68:(e.rare||e.raider)?52:46));
      if(e.crown)e.crown.setPosition(esx,esy-54);
      if(e.ring){e.ring.setPosition(esx,esy-14);e.ring.setAlpha((e.alpha?0.32:0.26)+Math.sin(e.bob*2.6)*0.12);}
      const show=e.hp<e.maxHp;
      e.hbB.setVisible(show).setPosition(esx,esy-40);
      e.hbF.setVisible(show).setPosition(esx-17+17*(e.hp/e.maxHp),esy-40).setScale(Math.max(0,e.hp/e.maxHp),1);
      if(dl<PR+16&&e.touch<=0&&this.hurtCD<=0&&G.hp>0){e.touch=0.9;this.hurtCD=0.3;
        const d3=damageHero(Math.max(2,Math.round(e.atk*0.6-G._def*0.25)));updateHud();sfx('hit');
        this.cameras.main.shake(90,0.004);this.cameras.main.flash(130,190,40,40);
        const kb=30;this.px+=dx/dl*-kb;this.py+=dy/dl*-kb;
        if(G.hp<=0){toast('💀 You fell! Loose coins & materials lost — banked goods, gear & levels kept.');
          G.hp=G.maxHp;G.coins=0;G.res={wood:0,stone:0,fiber:0,ore:0};G.hunger=Math.max(50,G.hunger);
          if(dungeon){dungeon=null;const t0=TOWNS[0];G.px=(t0.cx+1.5)*TILE;G.py=(t0.cy+1.5)*TILE;
            pendingPos={x:G.px,y:G.py};save();this.scene.restart();return;}
          if(G.raid&&G.raid.active){G.raid.active=0;G.raid.next=absDay()+1.5;
            for(let j=this.enemies.length-1;j>=0;j--){const r2=this.enemies[j];
              if(r2.raider){r2.s.destroy();r2.hbB.destroy();r2.hbF.destroy();if(r2.nameT)r2.nameT.destroy();this.enemies.splice(j,1);}}}
          const t0=TOWNS[0];this.px=(t0.cx+1.5)*TILE;this.py=(t0.cy+1.5)*TILE;save();updateHud();}}
    }
    for(let i=this.shots.length-1;i>=0;i--){const s=this.shots[i];
      s.life-=dt;s.x+=s.vx*dt;s.y+=s.vy*dt;
      const ssx=isoX(s.x,s.y),ssy=isoY(s.x,s.y)-10;
      s.core.setPosition(ssx,ssy).setDepth(999000);s.gl.setPosition(ssx,ssy).setDepth(998999);
      if(s.core.texture.key.indexOf('arrow')===0||s.core.texture.key.indexOf('bolt')>0){
        const pang=Math.atan2((s.vx+s.vy)*IH/2,(s.vx-s.vy)*IW/2);s.core.setRotation(pang);}
      let dead=s.life<=0||solidWorld(s.x,s.y);
      if(!dead)for(const e of this.enemies){
        if(Math.hypot(e.x-s.x,e.y-s.y)<24){
          let sd=s.dmg;
          if(!s.turret&&isRSub('sharpshooter')&&s.x0!==undefined&&Math.hypot(s.x-s.x0,s.y-s.y0)>TILE*4)sd=Math.round(sd*1.5);
          this.hurtEnemy(e,sd,Math.atan2(s.vy,s.vx),s.critF);
          if(s.slow)e.slowT=Math.max(e.slowT||0,s.slow);
          if(s.aoe)for(const e2 of this.enemies){if(e2===e)continue;
            if(Math.hypot(e2.x-s.x,e2.y-s.y)<s.aoe*TILE)this.hurtEnemy(e2,Math.max(1,Math.floor(s.dmg*0.7)),Math.atan2(s.vy,s.vx));}
          if(s.pierce-->0)continue;dead=true;break;}}
      if(dead){s.core.destroy();s.gl.destroy();this.shots.splice(i,1);}
    }
    this.slash.clear();
    for(let i=this.slashes.length-1;i>=0;i--){const sl=this.slashes[i];sl.life-=dt;
      if(sl.life<=0){this.slashes.splice(i,1);continue;}
      const k=sl.life/0.18;
      this.slash.lineStyle(6*k+2,cls==='warrior'?subVis().hex:0xd8c9a0,0.85*k);
      this.slash.beginPath();
      for(let j=0;j<=12;j++){const aa=sl.ang-1.1+2.2*j/12;
        const wx2=this.px+Math.cos(aa)*sl.reach,wy2=this.py+Math.sin(aa)*sl.reach;
        const p={x:isoX(wx2,wy2),y:isoY(wx2,wy2)-8};
        if(j===0)this.slash.moveTo(p.x,p.y);else this.slash.lineTo(p.x,p.y);}
      this.slash.strokePath();}
    // charm orbit fx
    if(this.charmFx&&this.charmFx.visible){const a=this.time.now*0.003;
      this.charmFx.setPosition(sx+Math.cos(a)*22,sy-34+Math.sin(a*2)*7);}
    // swipe trails (gesture spells + rune swipe)
    this.trailGfx.clear();
    const drawTrail=(pts,col,alpha)=>{if(pts.length<2)return;
      for(let ti=1;ti<pts.length;ti++){const k=ti/pts.length;
        this.trailGfx.lineStyle(2.5+k*7,col,alpha*(0.2+k*0.8));
        this.trailGfx.beginPath();this.trailGfx.moveTo(pts[ti-1].x,pts[ti-1].y);
        this.trailGfx.lineTo(pts[ti].x,pts[ti].y);this.trailGfx.strokePath();}
      const lp=pts[pts.length-1];
      this.trailGfx.fillStyle(0xffffff,alpha*0.9);this.trailGfx.fillCircle(lp.x,lp.y,4);};
    if(this.gest.active&&this.gest.pts.length>1)
      drawTrail(this.gest.pts,subVis().hex,0.75);
    if(this.spellSwipe.active&&this.spellSwipe.pts.length>1)
      drawTrail(this.spellSwipe.pts,0xff9a3c,0.95);
    if(this.fadeTrail){const ft=(this.time.now-this.fadeTrail.t)/450;
      if(ft>=1)this.fadeTrail=null;else drawTrail(this.fadeTrail.pts,this.fadeTrail.col,0.8*(1-ft));}
    // aim preview (hold A + drag)
    this.aimGfx.clear();
    if(this.aim.active&&Math.hypot(this.aim.dx,this.aim.dy)>=16){
      const awx=this.aim.dx/IW+this.aim.dy/IH,awy=this.aim.dy/IH-this.aim.dx/IW;
      const al2=Math.hypot(awx,awy)||1,AL=TILE*7;
      const ex4=this.px+awx/al2*AL,ey4=this.py+awy/al2*AL;
      const x0=sx,y0=sy-16,x1=isoX(ex4,ey4),y1=isoY(ex4,ey4)-16;
      const an2=Math.atan2(y1-y0,x1-x0),pp=an2+Math.PI/2;
      const acol=cls==='mage'?0xffaa55:0xc8f07a;
      this.aimGfx.fillStyle(acol,0.2);
      this.aimGfx.beginPath();
      this.aimGfx.moveTo(x0+Math.cos(pp)*3,y0+Math.sin(pp)*3);
      this.aimGfx.lineTo(x1+Math.cos(pp)*15,y1+Math.sin(pp)*15);
      this.aimGfx.lineTo(x1-Math.cos(pp)*15,y1-Math.sin(pp)*15);
      this.aimGfx.lineTo(x0-Math.cos(pp)*3,y0-Math.sin(pp)*3);
      this.aimGfx.closePath();this.aimGfx.fillPath();
      this.aimGfx.lineStyle(2,acol,0.55);this.aimGfx.strokePath();
      this.aimGfx.fillStyle(acol,0.55);
      this.aimGfx.beginPath();
      this.aimGfx.moveTo(x1+Math.cos(an2)*20,y1+Math.sin(an2)*20);
      this.aimGfx.lineTo(x1+Math.cos(pp)*11,y1+Math.sin(pp)*11);
      this.aimGfx.lineTo(x1-Math.cos(pp)*11,y1-Math.sin(pp)*11);
      this.aimGfx.closePath();this.aimGfx.fillPath();}
    // buff rings
    this.buffGfx.clear();
    if(this.shieldT>0){this.buffGfx.lineStyle(3,0x7ad0ff,0.4+Math.sin(this.time.now*0.01)*0.2);
      this.buffGfx.strokeEllipse(sx,sy-22,48,64);}
    if(this.warcryT>0){this.buffGfx.lineStyle(2.5,0xffb454,0.4);
      this.buffGfx.strokeEllipse(sx,sy+2,42,18);}
    if(this.quiverT>0&&Math.random()<0.3){this.hitEmit.setPosition(sx+(Math.random()-0.5)*24,sy-28);this.hitEmit.explode(1);}
    // super + ability buttons
    {const sb=document.getElementById('btnSuper');const deg=Math.round(superC*3.6);
     sb.style.background=`conic-gradient(#ffd23c ${deg}deg, rgba(30,32,44,.9) ${deg}deg)`;
     sb.classList.toggle('ready',superC>=100);
     const SCOL={strike:'#ffd23c',nova:'#7ad0ff',active:'#c07aff',rune:'#ff9a3c'};
     for(let si=0;si<3;si++){const el=document.getElementById('btnS'+si);const k=(G.loadout||[])[si];
       if(!k||!SPELLBOOK[k]||!SPELLBOOK[k].avail()){el.style.display='none';continue;}
       el.style.display='block';
       const cd=k==='strike'?this.strikeCD:k==='nova'?this.novaCD:k==='active'?this.abilityCD:this.spellCD;
       const mx=k==='strike'?5:k==='nova'?8:k==='active'?(this.abilityMax||1):(this.spellMax||1);
       const dd2=Math.round((1-cd/mx)*360);
       el.style.background=`conic-gradient(${SCOL[k]} ${dd2}deg, rgba(30,32,44,.9) ${dd2}deg)`;
       el.classList.toggle('cd',cd>0);
       el.classList.toggle('armed',k==='rune'&&this.runeArm);
       if(el.dataset.k!==k+cls){el.dataset.k=k+cls;const sp3=el.querySelector('span');
         if(SPELLBOOK[k].cv)setBtnIcon(sp3,SPELLBOOK[k].icon(),24);
         else{sp3.innerHTML='';sp3.textContent=SPELLBOOK[k].icon();}}}
     const tt2=trackTarget(),ta=document.getElementById('trackArrow');
     if(tt2&&!dungeon){
       const cam3=this.cameras.main;
       const twx=(tt2.x+0.5)*TILE,twy=(tt2.y+0.5)*TILE;
       const tix=isoX(twx,twy),tiy=isoY(twx,twy);
       const tsx=(tix-cam3.worldView.x)*cam3.zoom,tsy=(tiy-cam3.worldView.y)*cam3.zoom;
       const SW=this.scale.width,SH=this.scale.height,MG=52;
       const tang=Math.atan2(tsy-SH/2,tsx-SW/2);
       const dist2=Math.hypot(twx-this.px,twy-this.py);
       let ex2=tsx,ey2=tsy-64,off2=false;
       if(tsx<MG||tsx>SW-MG||tsy<MG||tsy>SH-MG){off2=true;
         const tmax=Math.min((SW/2-MG)/Math.max(1e-6,Math.abs(Math.cos(tang))),(SH/2-MG)/Math.max(1e-6,Math.abs(Math.sin(tang))));
         ex2=SW/2+Math.cos(tang)*tmax;ey2=SH/2+Math.sin(tang)*tmax;}
       ta.style.display='flex';ta.style.left=ex2+'px';ta.style.top=ey2+'px';
       const taIc=document.getElementById('taIc');
       if(ta.dataset.t!==tt2.t){ta.dataset.t=tt2.t;drawPinIcon(taIc,tt2.t);}
       document.getElementById('taDist').textContent=dist2<TILE*1.8?'HERE!':Math.round(dist2/TILE)+'m';
       const tr=document.getElementById('taRot');
       tr.style.display=off2?'block':'none';
       tr.style.transform='rotate('+tang+'rad)';
     }else ta.style.display='none';
     const db=document.getElementById('btnDash');const dd=Math.round((1-this.dashCD/(isWSub('blademaster')?2:3))*360);
     db.style.background=`conic-gradient(#5fd0f5 ${dd}deg, rgba(30,32,44,.9) ${dd}deg)`;
     db.classList.toggle('cd',this.dashCD>0);}
    // interact scan: gear drops & berry bushes
    this.interactT=null;let bestD=1e9,label='';
    const setT=(d2,max,t2,l2)=>{if(d2<bestD&&d2<max){bestD=d2;this.interactT=t2;label=l2;}};
    for(const d3 of drops){setT(Math.hypot(d3.x-this.px,d3.y-this.py),TILE*1.4,{drop:d3},'Pick up '+d3.item.name);}
    {const ctx2=Math.floor(this.px/TILE),cty=Math.floor(this.py/TILE);
      for(let yy=cty-2;yy<=cty+2;yy++)for(let xx=ctx2-2;xx<=ctx2+2;xx++){
        const t2=tileAt(xx,yy),dd=Math.hypot((xx+0.5)*TILE-this.px,(yy+0.5)*TILE-this.py);
        const bld=buildAt[xx+','+yy];
        if(t2==='B'&&!G.berriesPicked[xx+','+yy])setT(dd,TILE*1.3,{bush:{x:xx,y:yy}},'Pick berries');
        else if(t2==='N')setT(dd,TILE*1.2,{nurse:1},'Heal');
        else if(t2==='M')setT(dd,TILE*1.2,{shop:1},'Shop');
        else if(t2==='R')setT(dd,TILE*1.2,{registrar:1},'Land Office');
        else if(t2==='V')setT(dd,TILE*1.2,{talk:{x:xx,y:yy}},'Talk');
        else if(t2==='Q'){let bt2=0,bd4=1e9;
          TOWNS.forEach((t3,ti2)=>{const d4=Math.hypot(t3.cx-xx,t3.cy-yy);if(d4<bd4){bd4=d4;bt2=ti2;}});
          const has=G.quests.some(q2=>(q2.town||0)===bt2);
          setT(dd,TILE*1.3,{quest:{town:bt2}},has?'❗ Quest progress':'❗ New Quest');}
        else if(t2==='S')setT(dd,TILE*1.2,{sign:1},'Read');
        else if(t2==='T'&&!dungeon&&!((this.choppedCD[xx+','+yy]||0)>this.time.now))setT(dd,TILE*1.25,{tree:{x:xx,y:yy}},'Chop');
        else if(t2==='C')setT(dd,TILE*1.3,{cave:{x:xx,y:yy}},'Enter Cave');
        else if(t2==='X')setT(dd,TILE*1.5,{vault:{x:xx,y:yy}},'\ud83c\udff0 Enter Castle Vault');
        else if(t2==='U')setT(dd,TILE*1.3,{sewer:{x:xx,y:yy}},'Enter Sewers');
        else if(t2==='E')setT(dd,TILE*1.3,{stairs:1},'Climb Out');
        else if(t2==='K')setT(dd,TILE*1.4,{treasure:{x:xx,y:yy}},'Open Chest');
        if(bld){
          if(bld.t==='hut')setT(dd,TILE*1.4,{hut:bld},'Rest');
          else if(bld.t==='chest')setT(dd,TILE*1.4,{bank:bld},'Chest');
          else if(bld.t==='table'||bld.t==='forge')setT(dd,TILE*1.4,{station:bld},'Craft');
          else if(TOWERS[bld.t])setT(dd,TILE*1.4,{tower:bld},(bld.ammo||0)<=0?'Load Tower':'Tower');
          else if(bld.hp<bld.maxHp)setT(dd,TILE*1.4,{fix:bld},'Repair');}
        const nso=this.nodeSprites[xx+','+yy];
        if(nso&&nso.sp.visible)setT(dd,TILE*1.3,{node:nso.nd},NODE_KIND[nso.nd.k].label);}
      // standing on a for-sale plot
      if(!this.interactT&&!dungeon){const pl=plotAt(ctx2,cty);
        if(pl&&!G.plots[pl.id]){this.interactT={buyPlot:pl};bestD=0;
          label=G.coins>=pl.price?('🏷 Buy this land · '+pl.price+'c'):('🏷 Costs '+pl.price+'c (have '+G.coins+'c)');}}}
    {const tag=document.getElementById('interactTag');
     if(this.interactT&&!panelOpen){const cam2=this.cameras.main;
       const tx2=(sx-cam2.worldView.x)*cam2.zoom,ty2=(sy-cam2.worldView.y)*cam2.zoom;
       tag.style.left=tx2+'px';tag.style.top=(ty2-64)+'px';
       tag.style.display='block';tag.innerHTML=label+' <b>▸ tap</b>';}
     else tag.style.display='none';}
    const nf=dungeon?0.95:(1+Math.cos(G.time*6.2832))/2;
    const darkA=dungeon?0.62:Math.max(0,nf-0.3)*0.8;
    this.darkRT.clear();
    if(darkA>0.03){
      this.darkRT.fill(0x0c1226,darkA);
      const cam=this.cameras.main;
      const e1=(wx,wy,sc)=>{const px2=(isoX(wx,wy)-cam.worldView.x)*cam.zoom,py2=(isoY(wx,wy)-cam.worldView.y)*cam.zoom;
        this.darkRT.erase('light',px2-84*sc,py2-84*sc);};
      e1(this.px,this.py,dungeon?1.35:1);
      if(!dungeon)e1(this.cfX,this.cfY,1.3);
      else{ // stairs + chest shine in the dark
        for(let y=0;y<GH;y++)for(let x=0;x<GW;x++){const t3=grid[y][x];
          if(t3==='E'||t3==='K')e1((x+0.5)*TILE,(y+0.5)*TILE,1);}}
    }
  }
}
function boot(){
  document.getElementById('ovl').style.display='none';
  new Phaser.Game({type:Phaser.AUTO,parent:document.body,backgroundColor:'#274d2b',
    scale:{mode:Phaser.Scale.RESIZE,width:window.innerWidth,height:window.innerHeight},
    render:{antialias:true},scene:World});
  toast('Left thumb moves · right thumb attacks · ☰ menu');}
let mkCls='mage',mkElem='fire';
function menuUI(){
  const bd=document.getElementById('mkBody');
  const hasSave=!!G;
  let h='<div style="height:2vh"></div>';
  if(hasSave)h+=`<button class="zbtn gold" id="zCont"><span class="zic">▶</span>Continue<small>${G.name} the ${subDef(G.class,G.element).nm} · Lv.${G.level} · Day ${G.day}</small></button>`;
  h+=`<button class="zbtn" id="zSingle"><span class="zic">⚔</span>${hasSave?'New Adventure':'Single Player'}${hasSave?'<small>forge a new hero (replaces your save)</small>':'<small>forge your hero and set out</small>'}</button>`;
  h+=`<button class="zbtn off"><span class="zic">🌐</span>Multiplayer<span class="soon">COMING SOON</span></button>`;
  h+=`<button class="zbtn" id="zHow"><span class="zic">📖</span>How to Play</button>`;
  if(hasSave)h+=`<button class="zbtn" id="zRec"><span class="zic">🏆</span>Records</button>`;
  h+=`<button class="zbtn" id="zOpt"><span class="zic">⚙</span>Options</button>`;
  h+=`<div style="margin-top:6px;color:#5f5540;font-size:10px;font-weight:700">CRITTER WILDS · <a href="classic/" style="color:#8a7a5c">classic version</a></div>`;
  bd.innerHTML=h;
  const on=(id,fn)=>{const el=document.getElementById(id);if(el)el.onclick=fn;};
  on('zCont',()=>{cls=G.class;boot();});
  on('zSingle',()=>creationUI());
  on('zHow',()=>howUI());
  on('zRec',()=>recordsUI());
  on('zOpt',()=>optionsUI());
}
function backBtn(){return '<button class="zbtn slim" id="zBack"><span class="zic">◀</span>Back</button>';}
function howUI(){
  const bd=document.getElementById('mkBody');
  bd.innerHTML=`<div class="zpanel">
    <b>🕹 Controls</b>
    <p>Left thumb — move (virtual stick). Right thumb — swipe to attack in a direction, or draw a <b>V</b> / <b>Z</b> / <b>circle</b> for gesture spells. Hold the weapon button and drag to aim, release to fire.</p>
    <b>⚔ Fighting</b>
    <p>Fill the ✦ Super by dealing damage. Equip up to 3 spells in Skills → Loadout. Your subclass makes every hit burn, chill, arc lightning or pierce.</p>
    <b>🏕 Surviving</b>
    <p>Eat berries, rest at huts, bank materials in a chest — banked goods survive death. Buy land, build walls & towers; raids come at night.</p>
    <b>🗺 Exploring</b>
    <p>The map is shrouded until you explore. Find caves, sewers, castles, the world boss 💀 — and take quests from the ❗ villager in each town.</p>
  </div>`+backBtn();
  document.getElementById('zBack').onclick=menuUI;}
function recordsUI(){
  const bd=document.getElementById('mkBody');
  const seenN=Object.keys(G.seen||{}).length,tot=Math.ceil(MW/CHUNK)*Math.ceil(MH/CHUNK);
  const rows=[
    ['Hero',`${G.name} the ${subDef(G.class,G.element).nm}`],
    ['Level',G.level+' · '+G.xp+' xp'],
    ['Days survived',G.day],
    ['Coins',G.coins],
    ['World explored',Math.round(seenN/tot*100)+'%'],
    ['Gear collected',(G.gear.length+Object.values(G.equip).filter(Boolean).length)+' pieces'],
    ['Set pieces worn',setCount()+'/6'],
    ['Quests completed',G.questsDone||0],
    ['Bosses slain',G.bossKills||0],
    ['Plots owned',Object.keys(G.plots||{}).length],
    ['Buildings standing',(G.builds||[]).length],
    ['Crafting level',G.craftLvl]];
  bd.innerHTML='<div class="zpanel">'+rows.map(([k,v])=>`<div class="zrow"><span>${k}</span><b>${v}</b></div>`).join('')+'</div>'+backBtn();
  document.getElementById('zBack').onclick=menuUI;}
function optionsUI(){
  const bd=document.getElementById('mkBody');
  let h='<div class="zpanel">';
  if(G)h+=`<button class="zbtn slim" id="zMute"><span class="zic">${G.muted?'🔇':'🔊'}</span>Sound: ${G.muted?'Off':'On'}</button>`;
  h+=`<button class="zbtn slim" id="zInstall"><span class="zic">📲</span>Install to Home Screen</button>`;
  if(G)h+=`<button class="zbtn slim danger" id="zErase"><span class="zic">🗑</span>Erase Save</button>`;
  h+='</div>'+backBtn();
  bd.innerHTML=h;
  const on=(id,fn)=>{const el=document.getElementById(id);if(el)el.onclick=fn;};
  on('zMute',()=>{G.muted=!G.muted;save();optionsUI();});
  on('zInstall',()=>{localStorage.removeItem('cw-pwa-no');
    const evb=window._pwaDeferred;
    if(evb)evb.prompt();
    else alert('iPhone: tap the Share ⬆ button, then "Add to Home Screen".');});
  on('zErase',()=>{if(confirm('Erase '+(G.name||'your hero')+' forever?')){localStorage.removeItem(SAVE_KEY);location.reload();}});
  document.getElementById('zBack').onclick=menuUI;}
const MK_NAMES=['Ash','Rook','Vex','Kael','Nyx','Bram','Sol','Wren','Dax','Mira','Torin','Lira','Fenn','Oren','Sable','Juno'];
const MK_TAG={mage:'Dark sorcerer<br>spells · blink · fire walls',ranger:'Hooded hunter<br>arrows · dash · thorn walls',warrior:'Iron knight<br>cleaves · rage · earthshatter'};
function creationUI(){
  const bd=document.getElementById('mkBody');
  let h='';
  h+='<div class="mklab">CHOOSE YOUR CLASS</div><div class="crow">';
  for(const c of['mage','ranger','warrior'])
    h+=`<div class="ccard ${mkCls===c?'sel':''}" data-mkc="${c}"><canvas data-cv="${c}" width="164" height="164"></canvas><b>${{mage:'Mage',ranger:'Ranger',warrior:'Warrior'}[c]}</b><small>${MK_TAG[c]}</small></div>`;
  h+='</div><div class="mklab">CHOOSE YOUR SUBCLASS</div><div class="crow">';
  if(!SUBCLASSES[mkCls][mkElem])mkElem=Object.keys(SUBCLASSES[mkCls])[0];
  for(const k in SUBCLASSES[mkCls]){const sd=SUBCLASSES[mkCls][k];
    h+=`<button class="echip ${mkElem===k?'sel':''}" data-mke="${k}">${sd.ic} ${sd.nm}</button>`;}
  h+=`</div><div id="elemDesc">${subDef(mkCls,mkElem).desc}</div>`;
  h+=`<div class="mklab">NAME YOUR HERO</div>
  <div id="nameRow"><input id="heroName" maxlength="12" value="${window._mkName||MK_NAMES[Math.floor(Math.random()*MK_NAMES.length)]}" spellcheck="false"><button id="rollName">🎲</button></div>`;
  h+='<button id="beginBtn">⚔ BEGIN YOUR LEGEND</button>';
  h+=backBtn();
  bd.innerHTML=h;
  bd.querySelectorAll('[data-cv]').forEach(cv2=>{
    const c2=cv2.getContext('2d');c2.imageSmoothingEnabled=true;
    c2.drawImage(bakeHero(cv2.dataset.cv,0,'idle'),10,10,144,144);});
  bd.querySelectorAll('[data-mkc]').forEach(el=>el.onclick=()=>{mkCls=el.dataset.mkc;keepName();creationUI();});
  bd.querySelectorAll('[data-mke]').forEach(el=>el.onclick=()=>{mkElem=el.dataset.mke;keepName();creationUI();});
  const keepName=()=>{const i=document.getElementById('heroName');if(i)window._mkName=i.value;};
  document.getElementById('rollName').onclick=()=>{window._mkName=MK_NAMES[Math.floor(Math.random()*MK_NAMES.length)];creationUI();};
  document.getElementById('beginBtn').onclick=()=>{
    const nm=(document.getElementById('heroName').value||'Hero').trim().slice(0,12)||'Hero';
    cls=mkCls;newGame(mkCls,mkElem,nm);boot();};
  document.getElementById('zBack').onclick=menuUI;
}
const _hasSave=load();
menuUI();

/* ---- PWA: service worker + install-to-homescreen popup ---- */
if('serviceWorker' in navigator)navigator.serviceWorker.register('sw.js').catch(()=>{});
(function(){
  const standalone=matchMedia('(display-mode: standalone)').matches||matchMedia('(display-mode: fullscreen)').matches||navigator.standalone;
  if(standalone||localStorage.getItem('cw-pwa-no'))return;
  const isIOS=/iPhone|iPad|iPod/.test(navigator.userAgent)&&!window.MSStream;
  let deferred=null;
  function showBar(ios){
    if(document.getElementById('pwaBar'))return;
    const d=document.createElement('div');d.id='pwaBar';
    d.innerHTML=`<img src="icon-192.png" alt="">
      <div class="ptxt">Install Critter Wilds${ios?'<small>Tap <b>Share ⬆</b> then <b>Add to Home Screen</b></small>':'<small>Fullscreen, works offline, right on your phone</small>'}</div>
      ${ios?'':'<button id="pwaInstall">Install</button>'}<button id="pwaClose">✕</button>`;
    document.body.appendChild(d);d.style.display='flex';
    const ib=document.getElementById('pwaInstall');
    if(ib)ib.onclick=async()=>{if(!deferred)return;deferred.prompt();
      const ch=await deferred.userChoice;deferred=null;d.remove();
      if(ch&&ch.outcome==='accepted')localStorage.setItem('cw-pwa-no','1');};
    document.getElementById('pwaClose').onclick=()=>{localStorage.setItem('cw-pwa-no','1');d.remove();};
  }
  window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferred=e;window._pwaDeferred=e;showBar(false);});
  if(isIOS)setTimeout(()=>showBar(true),1800);
})();
