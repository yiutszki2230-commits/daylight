(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.Daylight=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const SCHEMA=1;
const iso=(d=new Date())=>new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Hong_Kong',year:'numeric',month:'2-digit',day:'2-digit'}).format(d);
const validDate=s=>typeof s==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(s)&&!Number.isNaN(Date.parse(s+'T12:00:00Z'))&&new Date(s+'T12:00:00Z').toISOString().slice(0,10)===s;
const addDays=(s,n)=>new Date(Date.parse(s+'T12:00:00Z')+n*86400000).toISOString().slice(0,10);
const days=(a,b)=>Math.round((Date.parse(b+'T12:00:00Z')-Date.parse(a+'T12:00:00Z'))/86400000);
const hash=s=>Array.from(s).reduce((h,c)=>(h*31+c.charCodeAt(0))>>>0,0);
function empty(){return {schema:SCHEMA,name:'我的一天',events:[],tasks:[],cando:[],done:{},eventStatus:{},logs:{},history:{},settings:{minutes:120,energy:'medium',reminder:'08:30',focus:'all'}};}
function validate(raw){
 if(!raw||typeof raw!=='object'||raw.schema!==SCHEMA)throw Error('檔案格式不符，請選 Daylight 規劃或備份 JSON。');
 for(const field of ['events','tasks','cando'])if(!Array.isArray(raw[field])||raw[field].length>1000)throw Error('清單內容不完整或過大。');
 const seen=new Set();
 for(const [type,items] of [['events',raw.events],['tasks',raw.tasks],['cando',raw.cando]])for(const item of items){
  if(!item||typeof item.id!=='string'||!item.id||item.id.length>100||seen.has(item.id)||typeof item.title!=='string'||!item.title.trim()||item.title.length>240)throw Error('清單名稱或識別碼無效。');seen.add(item.id);
  for(const key of ['date','due'])if(item[key]&&!validDate(item[key]))throw Error('日期格式不正確。');
  if(type==='events'&&!validDate(item.date))throw Error('限期需要有效日期。');
  if(item.time&&!/^([01]\d|2[0-3]):[0-5]\d$/.test(item.time))throw Error('時間格式不正確。');
  for(const key of ['note','step','finish','project'])if(item[key]!=null&&(typeof item[key]!=='string'||item[key].length>5000))throw Error('文字內容過長或無效。');
  if(item.minutes!=null&&(!Number.isInteger(item.minutes)||item.minutes<5||item.minutes>480))throw Error('工作分鐘數需介乎5至480。');
  if(item.kind&&!['exam','homework','milestone','todo','waiting'].includes(item.kind))throw Error('未知清單類型。');
 }
 const out=empty();out.name=typeof raw.name==='string'?raw.name.slice(0,80):out.name;
 for(const key of ['events','tasks','cando'])out[key]=JSON.parse(JSON.stringify(raw[key]));
 for(const field of ['done','eventStatus','logs','history'])if(raw[field]&&typeof raw[field]==='object'&&!Array.isArray(raw[field]))out[field]=JSON.parse(JSON.stringify(raw[field]));
 out.settings={...out.settings,...raw.settings};
 if(![30,60,120,180].includes(Number(out.settings.minutes)))out.settings.minutes=120;
 if(!['low','medium','high'].includes(out.settings.energy))out.settings.energy='medium';
 if(!/^([01]\d|2[0-3]):[0-5]\d$/.test(out.settings.reminder))out.settings.reminder='08:30';
 if(typeof out.settings.focus!=='string')out.settings.focus='all';
 return out;
}
const prep={
 'MGMT 2130':[
 ['拆清一組易混概念','從教授材料選兩個易混 concepts，合上筆記寫差異，再查漏補缺。','一張比較卡＋一個待補弱點'],
 ['將概念放入 case','選一個課程 case，寫 concept → evidence → recommendation；保留英文關鍵詞。','一份簡短英文分析'],
 ['做一次陌生案例練習','用已確認範圍做一題新 case，先自己回答再對照解析。','一題答案及訂正'],
 ['重做最容易混淆的一題','從錯題揀一題，解釋正確答案及另一選項點解唔合適。','一段有理由的訂正']],
 'ACCT 3010':[
 ['練一組分錄與理由','按教授已確認範圍做分錄題，解釋每項 debit／credit 的原因。CH7 LO5 不納入。','三題分錄或判斷＋訂正'],
 ['將數字放回報表','從已確認考試範圍選一題，連起分錄、income statement 與 balance sheet 的影響。','一題完整步驟及報表影響'],
 ['核對存貨擁有權與成本','若 CH7 仍是弱點，練 Ownership & Inventoriable Costs；已掌握可改做另一個已確認考點。CH7 LO5 排除。','三題判斷，逐題講理由'],
 ['重做一題會計錯題','先不看答案重做，標出錯在概念、計算、分錄或呈列。','一題完整訂正＋一個提醒']],
 'MGMT 3410':[
 ['整理 Final 範圍及弱點','先依教授最新材料確認 Final 範圍；選一組需要重溫的 concepts，不能直接沿用 Midterm 範圍。','一組弱點及來源位置'],
 ['練概念與 case 證據','從已確認 Final 範圍選一個 case，寫 concepts → application → case evidence。','一份英文短答案']],
 'ISOM 1400':[
 ['整理概念與因果機制','以教授確認的 Final 範圍為準，選一個概念寫 definition、mechanism、example。','一張概念卡'],
 ['比較概念並試用新情境','從已確認 Final 範圍選兩個概念，寫差異，再分析一個新例子。','一張比較卡＋一段分析']]
};
function makePlan(state,date){
 if(!validDate(date))throw Error('無效日期');
 const candidates=[],limit=Number(state.settings.minutes),short=state.settings.energy==='low'||limit<=60;
 const todayEvents=state.events.filter(e=>e.date===date&&state.eventStatus[e.id]!=='done');
 for(const e of state.events){
  if(state.eventStatus[e.id]==='done'||e.date<date)continue;
  const gap=days(date,e.date);
  if(e.kind==='exam'&&gap<=45){
   if(gap===0){candidates.push({key:`prep:${e.id}:${date}`,title:`${e.project||e.title}：考前精要`,step:'只看已準備的精要及易錯點，確認考試時間／地點；考後留休息空間。',finish:'完成一輪短複習',minutes:short?15:20,project:e.project||'考試',score:160,eventId:e.id});continue;}
   const list=prep[e.project]||[['整理考試弱點','按教授確認的範圍，選一個弱點練習。','一份練習及訂正']];const p=list[hash(date+e.id)%list.length];
   candidates.push({key:`prep:${e.id}:${date}`,title:`${e.project||e.title}：${p[0]}`,step:p[1],finish:p[2],minutes:short?20:gap>14?25:40,project:e.project||'學習',score:gap<=3?130-gap:gap<=7?105-gap:70-gap,eventId:e.id});
  }
  if(e.kind==='homework'&&gap<=4){const text=gap===0?['檢查並提交功課','逐項核對作答，提交後確認收據／平台狀態。','已核對提交狀態']:gap===1?['完成本週功課初稿','先處理未完成題，卡住的步驟列出待查。','初稿完成或清楚記錄餘下題目']:['開始本週功課','打開題目，確認份量，先完成第一個可處理部分。','知道剩餘工作及卡點'];candidates.push({key:`hw:${e.id}:${date}`,title:`${e.project||'功課'}：${text[0]}`,step:text[1],finish:text[2],minutes:short?15:gap<=1?35:25,project:e.project||'功課',score:gap<=1?155-gap:110-gap,eventId:e.id});}
 }
 for(const t of state.tasks){if(t.kind==='waiting'||t.archived||state.done[`task:${t.id}`])continue;const gap=t.due?days(date,t.due):null;if(gap!==null&&gap>7)continue;candidates.push({...t,key:`task:${t.id}`,step:t.step||'先做最小一個可完成的部分。',finish:t.finish||'完成這個步驟，或記錄卡點。',minutes:Math.min(t.minutes||20,short?20:60),score:gap===null?25:gap<0?145:gap<=1?150-gap:100-gap});}
 candidates.sort((a,b)=>b.score-a.score||a.key.localeCompare(b.key));
 const todos=[];let used=0;
 // 已剔選的當日項目仍保留，完成後不自動補入更多工作。
 const saved=state.history[date];
 if(saved&&saved.signature===signature(state)&&Array.isArray(saved.todos)){todos.push(...saved.todos);used=todos.reduce((n,t)=>n+t.minutes,0);}else{
 for(const t of candidates){if(todos.length>=3)break;if(state.done[t.key]&&!t.key.startsWith('prep:'))continue;if(used+t.minutes<=limit){todos.push(t);used+=t.minutes;}}
 }
 const examSoon=state.events.some(e=>e.kind==='exam'&&state.eventStatus[e.id]!=='done'&&days(date,e.date)>=0&&days(date,e.date)<=7);
 let pool=state.cando.filter(c=>!c.archived&&(state.settings.focus==='all'||c.project===state.settings.focus));
 if(examSoon||short){const small=pool.filter(c=>(c.minutes||20)<=20);if(small.length)pool=small;}
 pool.sort((a,b)=>hash(date+a.id)-hash(date+b.id));
 const recent=(c)=>Object.entries(state.done).some(([key,value])=>value&&key.startsWith('can:'+c.id+':')&&days(key.slice(-10),date)>0&&days(key.slice(-10),date)<4);
 const fresh=pool.filter(c=>!recent(c));if(fresh.length>=2)pool=fresh;
 const light=pool.filter(c=>(c.minutes||20)<=20),deep=pool.filter(c=>(c.minutes||20)>20);
 let chosen=[];if(light.length)chosen.push(light[0]);if(deep.length&&!short&&!examSoon)chosen.push(deep[0]);for(const c of pool)if(chosen.length<2&&!chosen.includes(c))chosen.push(c);
 const cando=chosen.map(c=>({...c,key:`can:${c.id}:${date}`}));
 const upcoming=state.events.filter(e=>state.eventStatus[e.id]!=='done'&&e.date>=date).sort((a,b)=>a.date.localeCompare(b.date));
 const unconfirmed=state.events.filter(e=>e.date<date&&state.eventStatus[e.id]!=='done');
 return {date,todos,cando,upcoming,todayEvents,unconfirmed,used,signature:signature(state)};
}
function signature(s){return JSON.stringify([s.events,s.tasks,s.cando,s.settings.minutes,s.settings.energy,s.settings.focus,s.eventStatus]);}
function remember(s,p){s.history[p.date]={todos:p.todos,signature:p.signature};const dates=Object.keys(s.history).sort();while(dates.length>90)delete s.history[dates.shift()];}
const esc=s=>String(s||'').replace(/\\/g,'\\\\').replace(/\n/g,'\\n').replace(/;/g,'\\;').replace(/,/g,'\\,');
const stamp=d=>d.toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'');
function fold(line){let result='',count=0;for(const c of line){const n=new TextEncoder().encode(c).length;if(count+n>73){result+='\r\n ';count=1;}result+=c;count+=n;}return result;}
function calendar(s,{date=iso(),url='',test=false}={}){
 const now=new Date();const lines=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Daylight//Daily Planner//ZH-HK','CALSCALE:GREGORIAN','METHOD:PUBLISH','X-WR-CALNAME:Daylight 每日清單'];
 const event=(uid,start,end,title,description,extra=[],alarm='PT0M')=>{lines.push('BEGIN:VEVENT','UID:'+uid+'@daylight.local','DTSTAMP:'+stamp(now),start,end,'SUMMARY:'+esc(title),'DESCRIPTION:'+esc(description),...extra,'BEGIN:VALARM','ACTION:DISPLAY','DESCRIPTION:'+esc(title),'TRIGGER:'+alarm,'END:VALARM','END:VEVENT');};
 if(test){const start=new Date(now.getTime()+3*60000),end=new Date(start.getTime()+60000);event('test-'+now.getTime(),'DTSTART:'+stamp(start),'DTEND:'+stamp(end),'Daylight 提醒測試','收到後，日曆提醒已可使用。'+(url?'\n打開清單：'+url:''));}
 else {const [h,m]=s.settings.reminder.split(':').map(Number);let start=new Date(`${date}T${s.settings.reminder}:00+08:00`);if(start<=now)start=new Date(start.getTime()+86400000);const end=new Date(start.getTime()+5*60000);event('daily-'+hash(url),'DTSTART:'+stamp(start),'DTEND:'+stamp(end),'看看今天的 To-do + Can-do','每日最多3件To-do，Can-do任選1件或略過。'+(url?'\n打開今天清單：'+url:''),['RRULE:FREQ=DAILY',...(url?['URL:'+url]:[])]);}
 lines.push('END:VCALENDAR');return lines.map(fold).join('\r\n')+'\r\n';
}
return {SCHEMA,iso,validDate,addDays,days,empty,validate,makePlan,remember,calendar,hash};
});
