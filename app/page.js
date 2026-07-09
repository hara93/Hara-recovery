'use client'
import {useEffect,useState} from 'react'

const rehab = [
 ['Thoracic Rotation','1–2 × 8/strana','Mobilnost toraksa bez rotiranja zdjelice.'],
 ['90/90 Hip IR','1–2 × 8–10','Danas samo jedna glavna IR vježba. Bez štipanja u preponi.'],
 ['Wall Ankle Mobility L','2 × 12','Lijevi gležanj, koljeno prema 2. prstu.'],
 ['Step-down kontrola','2 × 8/strana','Koljeno ne pada unutra, zdjelica mirna.'],
 ['Dead bug','2 × 8/strana','Anti-rotacija i SI stabilnost.']
]
const strength = {
 'A': [['Hip Thrust','4×8','RPE 14–16/20'],['RDL','3×8–10','RPE 13–15/20'],['RFESS','3×8/strana','kontrola zdjelice'],['Pallof press','3×12/strana','anti-rotacija'],['Copenhagen short','3×20–30s','adduktori']],
 'B': [['Single-leg RDL','3×8/strana','kontralateralni grip'],['Lateral band walk','3×12/strana','glute med'],['Sliding leg curl','3×8–10','loža'],['Adductor squeeze','3×15s + 10','adduktori'],['Plank shoulder tap','3×8/strana','core']],
 'C': [['Goblet squat box','4×8','kontrolirano'],['Step-up','3×10/strana','bez odraza donje noge'],['Suitcase carry','3×30–40 m','zamjena za još hip thrusta'],['TRX row','3×12','gornji dio'],['Landing prep','3×5','samo ako nema boli']]
}
const phases=['Hodanje','Lagano trčanje','Ubrzanja','Promjene smjera','Šut + 1v1','Utakmica']

export default function Page(){
 const [tab,setTab]=useState('dashboard')
 const [done,setDone]=useState({})
 const [pain,setPain]=useState(null)
 useEffect(()=>{setDone(JSON.parse(localStorage.getItem('done')||'{}')); setPain(localStorage.getItem('pain')||null)},[])
 useEffect(()=>{localStorage.setItem('done',JSON.stringify(done))},[done])
 useEffect(()=>{if(pain!==null)localStorage.setItem('pain',pain)},[pain])
 const toggle=k=>setDone(d=>({...d,[k]:!d[k]}))
 return <main className="app">
  <div className="hero"><div className="eyebrow">HARA Recovery Pro</div><h1 className="title">Rehab kuka/SI + povratak nogometu</h1><p className="subtitle">Pametnija verzija plana: manje dnevnog volumena, rotacija IR vježbi, jasniji kriteriji za sprint i manje duplanja hip thrust obrazaca.</p><div className="bar"><div className="fill"/></div></div>
  <div className="tabs">{[['dashboard','Danas'],['rehab','Rehab'],['strength','Snaga'],['football','Nogomet']].map(t=><button key={t[0]} onClick={()=>setTab(t[0])} className={'tab '+(tab===t[0]?'active':'')}>{t[1]}</button>)}</div>
  <section className={'section '+(tab==='dashboard'?'active':'')}><div className="grid"><div className="card"><h3>Status</h3><div className="big">Tjedan 1</div><div className="muted">baza + kontrola</div></div><div className="card"><h3>Bol danas</h3><div className="big">{pain??'—'}/10</div><div className="muted">0–2 nastavi, 3 smanji</div></div></div><div className="card"><h3>Unos boli</h3><div className="pain">{[0,1,2,3,4,5,6,7,8,9,10].map(n=><button key={n} onClick={()=>setPain(String(n))} className={String(pain)===String(n)?'sel':''}>{n}</button>)}</div></div><div className="note">Danas: ako je bol 0–2/10 napravi 10–15 min rehab. Ako je 3/10 smanji volumen. Ako je 4+/10 prekini snagu/sprint.</div></section>
  <section className={'section '+(tab==='rehab'?'active':'')}>{rehab.map((e,i)=><div className="exercise" key={e[0]} onClick={()=>toggle('r'+i)}><span className={'check '+(done['r'+i]?'done':'')}/><div><b>{e[0]}</b><div className="muted">{e[1]} · {e[2]}</div><span className="pill">10–15 min verzija</span></div></div>)}</section>
  <section className={'section '+(tab==='strength'?'active':'')}>{Object.entries(strength).map(([day,items])=><div className="card" key={day} style={{marginBottom:12}}><h3>Trening {day}</h3>{items.map((e,i)=><div className="exercise" key={e[0]} onClick={()=>toggle(day+i)}><span className={'check '+(done[day+i]?'done':'')}/><div><b>{e[0]}</b><div className="muted">{e[1]} · {e[2]}</div></div></div>)}</div>)}</section>
  <section className={'section '+(tab==='football'?'active':'')}>{phases.map((p,i)=><div className="exercise" key={p} onClick={()=>toggle('p'+i)}><span className={'check '+(done['p'+i]?'done':'')}/><div><b>{i+1}. {p}</b><div className="muted">Napreduj samo ako je bol 0–2/10 tijekom i dan nakon, bez kompenzacije.</div></div></div>)}</section><div className="footer" />
 </main>
}
