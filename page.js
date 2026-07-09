'use client'

import { useEffect, useMemo, useState } from 'react'
import { Activity, Dumbbell, HeartPulse, Home, Timer, Trophy, ShieldCheck, RotateCcw, CheckCircle2, Circle, Zap, CalendarDays, LineChart, Footprints, ChevronRight } from 'lucide-react'

const rehabA = [
  { id:'thoracic', name:'Thoracic Rotation', dose:'1–2 × 8–10/strana', why:'Torakalna rotacija da SI/križa ne preuzimaju rotaciju kod šuta i sprinta.', cues:'Kukovi mirni, rotacija između lopatica, bez forsiranja križa.' },
  { id:'ankle', name:'Wall Ankle Mobility – lijevi gležanj', dose:'2 × 12–15', why:'Lijeva dorzalna fleksija smanjuje kompenzacije stopalo/koljeno/kuk.', cues:'Peta dolje, koljeno prema 2. prstu, mjeri udaljenost od zida.' },
  { id:'ir90', name:'90/90 Hip IR – aktivno', dose:'2 × 8–10/strana', why:'Vraća kontrolu unutarnje rotacije desnog kuka bez agresivnog istezanja.', cues:'Bez štipanja u preponi; manji raspon je bolji od forsiranja.' },
  { id:'clamshell', name:'Clamshell ili lateral band walk', dose:'2 × 12–15', why:'Aktivacija gluteus mediusa protiv kolapsa koljena unutra.', cues:'Osjeti bočni gluteus, ne TFL/prednji kuk.' },
  { id:'deadbug', name:'Dead Bug', dose:'2 × 6–8/strana', why:'Anti-ekstenzija/anti-rotacija za stabilniji SI.', cues:'Križa lagano uz pod, disanje mirno.' },
  { id:'release', name:'Blagi piriformis release + disanje', dose:'60–90 s', why:'Smiruje tonus bez agresivnog cross-body stretch-a.', cues:'Samo 1–2/10 napetost, bez trnaca.' }
]

const rehabB = [
  { id:'proneir', name:'Prone Hip IR aktivacija', dose:'2 × 8/strana', why:'Druga varijanta IR da ne radiš svaki dan istu vježbu.', cues:'Stopalo ide van, zdjelica ostaje na podu.' },
  { id:'bridgeir', name:'SL Bridge s blagom IR na vrhu', dose:'2 × 8–10', why:'Glute max + kontrola kuka u funkcionalnoj poziciji.', cues:'Ne guraj u križa, IR je mala i kontrolirana.' },
  { id:'stepdown', name:'Step-down kontrola', dose:'2–3 × 6–8/strana', why:'Najvažniji test i trening kontrole koljena/zdjelice za povratak rezovima.', cues:'Koljeno prema 2. prstu, zdjelica ne pada.' },
  { id:'sideplank', name:'Side plank hip abduction', dose:'2 × 8 + 10 s hold', why:'Lateralna stabilnost zdjelice za sprint i promjenu smjera.', cues:'Bez rotacije trupa, stopalo ravno.' },
  { id:'pallof', name:'Pallof press', dose:'2 × 10/strana', why:'Anti-rotacija bez opterećivanja SI rotacijom.', cues:'Rebra dolje, zdjelica mirna.' },
  { id:'breath', name:'Diafragmatično disanje', dose:'5 ciklusa 4-4-6', why:'Reset živčanog sustava i smanjenje zaštitnog tonusa.', cues:'Trbuh se diže, prsa mirna.' }
]

const strength = {
  A: [
    ['Hip Thrust bilateral', '4 × 8–10', 'RPE 13–16/20', 'Glavni gluteus rad. Ne forsirati hiperekstenziju.'],
    ['RDL', '3 × 8–10', 'RPE 13–15/20', 'Počni konzervativno. Ako SI reagira dan poslije, smanji 10–20%.'],
    ['RFESS / Bulgarian split squat', '3 × 8/strana', 'RPE 14–16/20', 'Kontrola zdjelice i koljena; prvo forma, tek onda kilaža.'],
    ['Copenhagen short lever', '3 × 20–30 s', 'RPE 13–15/20', 'Aduktori za šut i stabilnost zdjelice.'],
    ['Pallof press', '3 × 12/strana', 'RPE 12–14/20', 'Anti-rotacija za SI.']
  ],
  B: [
    ['Single-leg RDL', '3 × 8/strana', 'RPE 13–15/20', 'Kontralateralni grip; zdjelica se ne otvara.'],
    ['Lateral band walk', '3 × 12–15 koraka', 'RPE 12–14/20', 'Glute medius u pokretu, bolji transfer od clamshella.'],
    ['Sliding leg curl', '3 × 8–10', 'RPE 14–16/20', 'Nordic tek kad nema reakcije lože/SI.'],
    ['Adductor squeeze / Copenhagen iso', '3 × 15 s + 10', 'RPE 12–13/20', 'Kontrolirano, bez boli u preponi.'],
    ['Plank shoulder taps', '3 × 8/strana', 'RPE 12–14/20', 'Pelvis se ne rotira.']
  ],
  C: [
    ['Goblet squat to box', '4 × 8', 'RPE 14–15/20', 'Kontrolirani čučanj, bez pada na kutiju.'],
    ['Step-up', '3 × 8–10/strana', 'RPE 14–16/20', 'Bez odguravanja donjom nogom.'],
    ['Suitcase carry / farmer carry', '4 × 20–30 m', 'RPE 13–15/20', 'Zamjena za dodatni unilateral hip thrust; manje iritira SI.'],
    ['Half-kneeling band chop', '3 × 10/strana', 'RPE 12–14/20', 'Kontrolirana rotacija za šut, bez agresivne rotacije zdjelice.'],
    ['Landing / lateral bound', '3 × 5–6', 'RPE 14–16/20', 'Tek kad step-down 5/5 i bol 0–2/10.']
  ]
}

const phases = [
  ['Hodanje', '30 min hodanja, rehab, lagani skip A', '0–1/10 bol i normalna mehanika'],
  ['Lagano trčanje', '2 × 10–15 min na 50–60%', 'Nema reakcije idući dan; SL bridge 15×'],
  ['Ubrzanja', '60–70–80%, skip C, lateralni pomaci', '80% brzine bez boli i bez kompenzacije'],
  ['Promjena smjera', 'T-test, zaustavljanja, rezovi, 80–90%', 'Step-down 20 cm 10× bez valgusa'],
  ['Šut + 1v1', 'Laganiji šut → jači, dribbling, 1v1', 'Šut bez povećanja boli idući dan'],
  ['Utakmica', 'Trening ekipe, 30–60 min, puna utakmica', 'Sve prethodno bez boli; subjektivno 0–1/10']
]

const tests = [
  ['Hip IR ROM', 'Cilj ≥30–40°'],
  ['Wall ankle L/D', 'L ≥10 cm i mala asimetrija'],
  ['Step-down', '5/5 kvaliteta'],
  ['Side plank D/L', 'Asimetrija <10%'],
  ['Bol mir/jog/šut', 'Sve 0–1/10'],
  ['Single-leg balance', '30 s otvorene, 15 s zatvorene oči']
]

function useLocal(key, initial){
  const [value,setValue] = useState(initial)
  useEffect(()=>{ try{ const raw=localStorage.getItem(key); if(raw) setValue(JSON.parse(raw)) }catch{} },[key])
  useEffect(()=>{ try{ localStorage.setItem(key, JSON.stringify(value)) }catch{} },[key,value])
  return [value,setValue]
}

export default function App(){
  const [tab,setTab] = useState('dashboard')
  const [pain,setPain] = useLocal('pain', {morning:1, after:1, next:1})
  const [whoop,setWhoop] = useLocal('whoop', {recovery:70, sleep:7, strain:8})
  const [done,setDone] = useLocal('done', {})
  const [week,setWeek] = useLocal('week', 1)
  const [phase,setPhase] = useLocal('phase', 1)
  const today = useMemo(()=> new Date().toLocaleDateString('hr-HR',{weekday:'long', day:'numeric', month:'long'}),[])
  const rehab = week % 2 ? rehabA : rehabB
  const painAvg = Math.round(((+pain.morning)+(+pain.after)+(+pain.next))/3*10)/10
  const readiness = whoop.recovery < 40 || painAvg >= 3 ? 'Samo rehab / smanji intenzitet' : whoop.recovery > 65 && painAvg <= 2 ? 'Može planirani trening' : 'Umjereno, bez forsiranja sprinta'

  return <main className="app">
    <section className="hero">
      <div><p className="eyebrow">HARA Recovery</p><h1>Rehab kuka/SI + povratak nogometu</h1><p className="muted">{today} · tjedan {week}/12 · faza {phase}/6</p></div>
      <div className="score"><span>{Math.round((week/12)*100)}%</span><small>12-tjedni plan</small></div>
    </section>

    <nav className="tabs">
      {[
        ['dashboard',Home,'Danas'],['rehab',HeartPulse,'Rehab'],['strength',Dumbbell,'Snaga'],['football',Footprints,'Nogomet'],['tests',LineChart,'Testovi']
      ].map(([id,Icon,label])=><button key={id} onClick={()=>setTab(id)} className={tab===id?'active':''}><Icon size={18}/>{label}</button>)}
    </nav>

    {tab==='dashboard' && <section className="grid">
      <Card icon={<ShieldCheck/>} title="Preporuka za danas" big={readiness} text="Ako bol raste u setu ili traje idući dan, vrati RPE -2 i preskoči sprint/reaktivne vježbe." />
      <Card icon={<Activity/>} title="Bol" big={`${painAvg}/10`} text="Zeleno 0–2, žuto 3, crveno 4+." />
      <Card icon={<Zap/>} title="WHOOP ručni unos" big={`${whoop.recovery}% recovery`} text={`San ${whoop.sleep} h · strain ${whoop.strain}`} />
      <div className="panel full">
        <h2>Dnevni unos</h2>
        <div className="sliders"><Slider label="Bol ujutro" value={pain.morning} set={v=>setPain({...pain,morning:v})}/><Slider label="Bol poslije" value={pain.after} set={v=>setPain({...pain,after:v})}/><Slider label="Bol idući dan" value={pain.next} set={v=>setPain({...pain,next:v})}/><Slider label="WHOOP Recovery" value={whoop.recovery} max={100} set={v=>setWhoop({...whoop,recovery:v})}/></div>
      </div>
      <div className="panel full row"><button onClick={()=>setWeek(Math.max(1,week-1))}>Tjedan -</button><strong>Tjedan {week}</strong><button onClick={()=>setWeek(Math.min(12,week+1))}>Tjedan +</button></div>
    </section>}

    {tab==='rehab' && <section className="panel"><h2>{week%2?'Rehab A':'Rehab B'} · 10–15 min baza</h2><p className="muted">Rotiraj A/B da ne radiš previše IR vježbi isti dan. Puni 20-min protokol radi 4–5× tjedno.</p>{rehab.map(ex=><Exercise key={ex.id} ex={ex} done={done[ex.id]} toggle={()=>setDone({...done,[ex.id]:!done[ex.id]})}/>)}</section>}

    {tab==='strength' && <section className="panel"><h2>Trening snage 3× tjedno</h2><p className="muted">RPE 13–16/20 u početku. Nema teške snage dan nakon utakmice.</p>{Object.entries(strength).map(([day,items])=><div key={day} className="workout"><h3>Trening {day}</h3>{items.map((i,idx)=><div className="line" key={i[0]}><b>{i[0]}</b><span>{i[1]}</span><em>{i[2]}</em><small>{i[3]}</small></div>)}</div>)}</section>}

    {tab==='football' && <section className="panel"><h2>Povratak sprintu i nogometu</h2><p className="muted">Napredovanje po kriterijima, ne po kalendaru.</p>{phases.map((p,i)=><button key={p[0]} className={`phase ${phase===i+1?'current':''} ${phase>i+1?'done':''}`} onClick={()=>setPhase(i+1)}><span>{phase>i+1?<CheckCircle2/>:<Circle/>}</span><div><b>{i+1}. {p[0]}</b><p>{p[1]}</p><small>Kriterij: {p[2]}</small></div><ChevronRight/></button>)}</section>}

    {tab==='tests' && <section className="panel"><h2>Testovi svakih 7–14 dana</h2>{tests.map(t=><div className="test" key={t[0]}><b>{t[0]}</b><span>{t[1]}</span></div>)}<div className="rules"><h3>Pravila boli</h3><p>🟢 0–2/10 nastavi · 🟡 3/10 modificiraj · 🔴 4+/10 stani. Trnci, širenje niz nogu ili bol >48 h = javi se fizioterapeutu/liječniku.</p></div></section>}
  </main>
}

function Card({icon,title,big,text}){return <div className="card"><div className="icon">{icon}</div><p>{title}</p><h2>{big}</h2><span>{text}</span></div>}
function Slider({label,value,set,max=10}){return <label><span>{label}: <b>{value}</b></span><input type="range" min="0" max={max} value={value} onChange={e=>set(+e.target.value)}/></label>}
function Exercise({ex,done,toggle}){return <div className={`exercise ${done?'complete':''}`} onClick={toggle}><button>{done?<CheckCircle2/>:<Circle/>}</button><div><h3>{ex.name}</h3><p>{ex.dose}</p><small><b>Zašto:</b> {ex.why}</small><small><b>Tehnika:</b> {ex.cues}</small></div></div>}
