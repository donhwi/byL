/* 공통: 목차 표시, 장별 배경색, 화면 묶음 넘기기 */
(function(){
  /* 보고 있는 장을 목차에 표시하고, 그 장의 하위 목차만 펼친다 */
  const site=document.getElementById('site'),links=[...document.querySelectorAll('.side nav>a')];
  const chaps=links.map(a=>document.getElementById(a.hash.slice(1))).filter(Boolean);
  const mark=id=>{site.className='site t-'+id;
    links.forEach(a=>{const on=a.hash==='#'+id,sub=a.nextElementSibling;
      a.classList.toggle('on',on);on?a.setAttribute('aria-current','true'):a.removeAttribute('aria-current');
      if(sub&&sub.classList.contains('sub'))sub.hidden=!on})};
  let cur='';
  const spy=()=>{const y=innerHeight*.38;
    const c=chaps.filter(c=>c.getBoundingClientRect().top<=y).pop()||chaps[0];
    if(c&&c.id!==cur)mark(cur=c.id)};
  addEventListener('scroll',spy,{passive:true});
  addEventListener('resize',spy);
  spy();
  /* 화면 묶음: 누르면 다음 장, 가만히 두면 5초마다 넘어간다. 한 번 누르면 자동 넘김은 멈춘다 */
  const box=document.querySelector('.show');
  if(!box)return;
  const tabs=[...document.querySelectorAll('.tabs .tab')],imgs=[...box.querySelectorAll('.sl')],notes=[...box.querySelectorAll('.nt')],bars=[...document.querySelectorAll('.prog i')],cap=document.getElementById('cap');
  let n=0,timer=0;
  const show=k=>{n=(k+imgs.length)%imgs.length;
    [tabs,imgs,bars].forEach(g=>g.forEach((e,i)=>e.classList.toggle('on',i===n)));
    tabs.forEach((t,i)=>t.setAttribute('aria-pressed',i===n));
    notes.forEach((e,i)=>e.hidden=i!==n);
    cap.textContent=`${n+1} / ${imgs.length} · ${imgs[n].dataset.cap}`};
  const pick=k=>{clearInterval(timer);show(k)};
  tabs.forEach((t,i)=>t.addEventListener('click',()=>pick(i)));
  box.querySelector('.stage').addEventListener('click',()=>pick(n+1));
  show(0);
  if(!matchMedia('(prefers-reduced-motion:reduce)').matches)timer=setInterval(()=>{if(!document.hidden)show(n+1)},5000);
})();
