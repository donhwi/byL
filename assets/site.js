/* 공통: 머리·꼬리, 정책 문서 링크, 플로우 도식 그리기 */
const C={ink:'#373330',ink2:'#615E5B',ink3:'#857F7A',line:'#E7E4E1',line2:'#F1EFED',accent:'#F08300',accentW:'#FFF3E4',teal:'#3F6B7D',tealW:'#E9F1F4',warm:'#8A5A33',warmW:'#F6EDE4'};
const INK={color:C.ink,weak:'#fff'},ACC={color:C.accent,weak:C.accentW},TEAL={color:C.teal,weak:C.tealW},WARM={color:C.warm,weak:C.warmW};

(function(){
  /* 한 문서 안의 장(章) 목록으로 메뉴를 만들고, 보고 있는 장과 구간을 표시한다 */
  const chaps=[...document.querySelectorAll('main .chap[id]')];
  const top=document.createElement('header');top.className='top';
  const item=c=>`<a href="#${c.id}">${c.dataset.nav}</a><div class="subs">${[...c.querySelectorAll('.sec[id]')].map(x=>`<a href="#${x.id}">${x.dataset.nav||x.querySelector('h2').textContent}</a>`).join('')}</div>`;
  top.innerHTML=`<div class="in"><a class="me" href="#top">이돈휘<small>서비스 기획</small></a><nav><a href="#top">소개</a>${chaps.map(item).join('')}</nav></div>`;
  document.body.prepend(top);
  const links=[...top.querySelectorAll('nav>a')],subs=[...top.querySelectorAll('.subs a')],secs=[...document.querySelectorAll('main .chap .sec[id]')];
  const last=(els,y)=>els.filter(e=>e.getBoundingClientRect().top<=y).pop();
  let tick=0;
  const mark=()=>{tick=0;const y=innerHeight*.3,c=last(chaps,y),x=last(secs,y);
    links.forEach(l=>l.classList.toggle('cur',l.hash==='#'+(c?c.id:'top')));
    subs.forEach(l=>l.classList.toggle('on',!!x&&l.hash==='#'+x.id))};
  addEventListener('scroll',()=>{if(!tick)tick=requestAnimationFrame(mark)},{passive:true});mark();
  /* 화면 묶음: 누르면 다음 장, 가만히 두면 5초마다 넘어간다 */
  document.querySelectorAll('.slides').forEach(f=>{
    const imgs=[...f.querySelectorAll('.stage img')],cap=f.querySelector('.cap'),dots=f.querySelector('.dots'),notes=[...(f.parentElement.querySelector('.notes')||f).children].filter(e=>f.parentElement.matches('.showcase'));
    dots.innerHTML=imgs.map(()=>'<i></i>').join('');
    let n=0,timer=0;
    const show=k=>{n=(k+imgs.length)%imgs.length;imgs.forEach((im,i)=>im.classList.toggle('on',i===n));
      [...dots.children].forEach((d,i)=>d.classList.toggle('on',i===n));notes.forEach((d,i)=>d.classList.toggle('on',i===n));cap.textContent=`${n+1} / ${imgs.length} · ${imgs[n].dataset.cap}`};
    const auto=()=>{clearInterval(timer);if(!matchMedia('(prefers-reduced-motion:reduce)').matches)timer=setInterval(()=>{if(!document.hidden)show(n+1)},5000)};
    f.querySelector('.stage').addEventListener('click',()=>{show(n+1);auto()});
    show(0);auto()});
  const foot=document.createElement('footer');foot.className='foot';
  foot.innerHTML=`<div class="in"><span>이돈휘 · 서비스 기획</span><a href="mailto:lee_don@naver.com">lee_don@naver.com</a><span>화면의 수치와 이름은 모두 예시 데이터이며, 실제 화면이 아니라 기획 구조를 다시 그린 것입니다.</span></div>`;
  document.body.append(foot);
})();

let uid=0;
function markers(p){return ['ink','accent','teal'].map(k=>`<marker id="${p}${k}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,1 L9,5 L0,9 z" fill="${C[k]}"/></marker>`).join('')}
const EK={flow:['ink',''],cmd:['accent',''],data:['teal','5 4']};

/* 레인(가로줄) × 단계(세로줄) 격자에 노드를 놓고 선을 자동으로 잇는다 */
function flow(id,{lanes,cols,phases=[],nodes,edges}){
  const LW=124,CW=158,NW=134,NH=58,LH=108,TOP=phases.length?70:44,p='m'+(uid++);
  const W=LW+cols.length*CW+14,H=TOP+lanes.length*LH+10;
  const P=n=>({x:LW+n.c*CW+CW/2,y:TOP+n.l*LH+LH/2});
  let s=`<svg viewBox="0 0 ${W} ${H}" role="img" style="max-width:${W}px;min-width:${Math.min(W,920)}px"><defs>${markers(p)}</defs>`;
  phases.forEach(ph=>{const x=LW+ph.from*CW+6,w=(ph.to-ph.from+1)*CW-12;
    s+=`<rect x="${x}" y="10" width="${w}" height="22" rx="11" fill="${C.line2}"/><text x="${x+w/2}" y="25" text-anchor="middle" font-size="11.5" font-weight="650" fill="${C.ink2}">${ph.name}</text>`});
  cols.forEach((c,i)=>{const x=LW+i*CW+CW/2,y=TOP-16;
    s+=`<circle cx="${x-NW/2+9}" cy="${y-4}" r="9" fill="#FF9520"/><text x="${x-NW/2+9}" y="${y}" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">${i+1}</text><text x="${x-NW/2+24}" y="${y}" font-size="12.5" font-weight="700" fill="${C.ink}">${c}</text>`});
  lanes.forEach((l,i)=>{const y=TOP+i*LH;
    s+=`<rect x="8" y="${y+4}" width="${W-16}" height="${LH-8}" rx="10" fill="${i%2?'#fff':'#FAF9F8'}" stroke="${C.line2}"/><rect x="8" y="${y+4}" width="4" height="${LH-8}" rx="2" fill="${l.color}"/>
     <text x="24" y="${y+LH/2-(l.sub?3:-4)}" font-size="13.5" font-weight="700" fill="${C.ink}">${l.name}</text>${l.sub?`<text x="24" y="${y+LH/2+14}" font-size="11" fill="${C.ink3}">${l.sub}</text>`:''}`});
  let es='',ls='';
  edges.forEach(([a,b,k='flow',label,route])=>{const A=P(nodes[a]),B=P(nodes[b]),[col,dash]=EK[k];let d,lx,ly,anchor='start';
    if(route==='above'){const y0=TOP+nodes[a].l*LH+13;d=`M${A.x},${A.y-NH/2} V${y0} H${B.x} V${B.y-NH/2-2}`;lx=(A.x+B.x)/2;ly=y0+4;anchor='middle'}
    else if(route==='below'){const yb=TOP+lanes.length*LH-13,xl=B.x-NW/2-12;d=`M${A.x},${A.y+NH/2} V${yb} H${xl} V${B.y} H${B.x-NW/2-2}`;lx=(A.x+xl)/2;ly=yb+4;anchor='middle'}
    else if(nodes[a].c===nodes[b].c){const dir=Math.sign(B.y-A.y);d=`M${A.x},${A.y+dir*NH/2} V${B.y-dir*(NH/2+2)}`;lx=A.x+8;ly=(A.y+B.y)/2+4}
    else if(nodes[a].l===nodes[b].l){d=`M${A.x+NW/2},${A.y} H${B.x-NW/2-2}`;lx=(A.x+B.x)/2;ly=A.y-7;anchor='middle'}
    else{const xm=B.x-NW/2-12;d=`M${A.x+NW/2},${A.y} H${xm} V${B.y} H${B.x-NW/2-2}`;lx=xm+7;ly=(A.y+B.y)/2+4}
    es+=`<path d="${d}" fill="none" stroke="${C[col]}" stroke-width="1.7" stroke-linejoin="round" ${dash?`stroke-dasharray="${dash}"`:''} marker-end="url(#${p}${col})"/>`;
    if(label)ls+=`<text x="${lx}" y="${ly}" text-anchor="${anchor}" font-size="11" font-weight="600" fill="${C[col]}" stroke="#fff" stroke-width="4" paint-order="stroke">${label}</text>`});
  let ns='';
  Object.values(nodes).forEach(n=>{const {x,y}=P(n),l=lanes[n.l],x0=x-NW/2,y0=y-NH/2;
    ns+=n.kind==='dec'?`<polygon points="${x0},${y} ${x0+16},${y0} ${x0+NW-16},${y0} ${x0+NW},${y} ${x0+NW-16},${y0+NH} ${x0+16},${y0+NH}" fill="#fff" stroke="${C.ink}" stroke-width="1.5"/>`
      :`<rect x="${x0}" y="${y0}" width="${NW}" height="${NH}" rx="9" fill="${l.weak}" stroke="${l.color}" stroke-width="1.5"/>`;
    ns+=`<foreignObject x="${x0}" y="${y0}" width="${NW}" height="${NH}"><div xmlns="http://www.w3.org/1999/xhtml" class="nd">${n.t}</div></foreignObject>`});
  document.getElementById(id).innerHTML=s+es+ns+ls+'</svg>';
}

/* 문장 단위 줄바꿈: 문장이 줄 끝에서 잘리면 문장 전체를 다음 줄로 내린다 */
document.querySelectorAll('.sec>p:not(.notice),.lead,.card p,.notes li,.list li,.hint').forEach(p=>{
  if(p.children.length)return;
  const parts=p.textContent.trim().split(/(?<=[.?!])\s+/);
  if(parts.length<2)return;
  p.textContent='';
  parts.forEach((t,i)=>{const s=document.createElement('span');s.className='s';s.textContent=t;p.append(s,i<parts.length-1?' ':'')});
});
