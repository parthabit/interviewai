import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { interviewAPI } from '../services/api';

const INTERVIEW_MODES = {
  technical: { label: 'Technical Interview', icon: '💻', desc: 'DSA, System Design, Coding' },
  hr:        { label: 'HR Interview',        icon: '🗣️', desc: 'Behavioral, Culture Fit'   },
  system:    { label: 'System Design',       icon: '🏗️', desc: 'Architecture, Scalability'  },
};

const companies = ['Google','Microsoft','Amazon','Meta','Flipkart','Infosys','TCS','Razorpay','CRED','Swiggy'];

const OPENERS = {
  technical: (c) => `Hello! I'm your AI interviewer for a Technical interview at ${c}. We'll cover DSA, system design, and coding. Think out loud!\n\n**Question 1:** Tell me about yourself and your technical background.`,
  hr:        (c) => `Hi! I'm your HR interviewer for ${c}. We'll explore your experiences using STAR method. Ready?\n\n**Question 1:** Tell me about yourself and your career journey.`,
  system:    (c) => `Hello! I'm a Principal Engineer at ${c}. Let's work through a system design problem.\n\n**Question 1:** Design a real-time chat application like WhatsApp. Walk me through your high-level approach.`,
};

/* ── Video Recording Hook ─────────────────────────────────────────────────── */
function useVideoRecording() {
  const videoRef      = useRef(null);
  const mediaRec      = useRef(null);
  const chunks        = useRef([]);
  const streamRef     = useRef(null);
  const [recording,   setRecording]   = useState(false);
  const [videoURL,    setVideoURL]    = useState(null);
  const [camEnabled,  setCamEnabled]  = useState(false);
  const [camError,    setCamError]    = useState(null);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setCamEnabled(true); setCamError(null);
    } catch {
      setCamError('Camera/mic access denied. Enable permissions to record.');
    }
  }, []);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    setCamEnabled(false); setRecording(false);
  }, []);

  const startRecording = useCallback(() => {
    if (!streamRef.current) return;
    chunks.current = [];
    const mr = new MediaRecorder(streamRef.current, { mimeType: 'video/webm;codecs=vp9,opus' });
    mr.ondataavailable = (e) => { if (e.data.size > 0) chunks.current.push(e.data); };
    mr.onstop = () => {
      const blob = new Blob(chunks.current, { type: 'video/webm' });
      setVideoURL(URL.createObjectURL(blob));
    };
    mr.start(1000); mediaRec.current = mr; setRecording(true);
  }, []);

  const stopRecording = useCallback(() => { mediaRec.current?.stop(); setRecording(false); }, []);

  const download = useCallback(() => {
    if (!videoURL) return;
    const a = document.createElement('a'); a.href = videoURL;
    a.download = `interview-${Date.now()}.webm`; a.click();
  }, [videoURL]);

  useEffect(() => () => stopCamera(), [stopCamera]);
  return { videoRef, recording, videoURL, camEnabled, camError, startCamera, stopCamera, startRecording, stopRecording, download };
}

/* ── Main Component ──────────────────────────────────────────────────────── */
export default function InterviewRoom() {
  const { navigate } = useApp();
  const [stage,      setStage]      = useState('setup');
  const [mode,       setMode]       = useState('technical');
  const [company,    setCompany]    = useState('Google');
  const [iid,        setIid]        = useState(null);   // interview server id
  const [messages,   setMessages]   = useState([]);
  const [input,      setInput]      = useState('');
  const [aiTyping,   setAiTyping]   = useState(false);
  const [timer,      setTimer]      = useState(0);
  const [voiceOn,    setVoiceOn]    = useState(false);
  const [scores,     setScores]     = useState(null);
  const [msgCount,   setMsgCount]   = useState(0);
  const chatRef   = useRef(null);
  const timerRef  = useRef(null);
  const recognRef = useRef(null);
  const vid = useVideoRecording();

  const fmt = (s) => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;
  const scroll = useCallback(() => setTimeout(() => chatRef.current?.scrollTo({ top: 99999, behavior: 'smooth' }), 80), []);
  const addMsg = useCallback((role, content) => {
    setMessages((p) => [...p, { id: Date.now()+Math.random(), role, content, time: new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}) }]);
    scroll();
  }, [scroll]);

  /* start */
  const startInterview = useCallback(async () => {
    setStage('active'); setMessages([]); setTimer(0); setMsgCount(0);
    timerRef.current = setInterval(() => setTimer((t) => t + 1), 1000);
    let id = null;
    try { const r = await interviewAPI.start({ type: mode, company }); id = r.interviewId; } catch {}
    setIid(id);
    setTimeout(() => { setAiTyping(true); setTimeout(() => { setAiTyping(false); addMsg('ai', OPENERS[mode](company)); }, 1500); }, 300);
  }, [mode, company, addMsg]);

  /* send message */
  const sendMessage = useCallback(async () => {
    const text = input.trim(); if (!text || aiTyping) return;
    setInput(''); addMsg('user', text); setMsgCount((c) => c + 1); setAiTyping(true);
    const isLast = msgCount >= 7;
    try {
      let reply;
      if (isLast) {
        reply = "Excellent session! That concludes our interview. You've demonstrated solid knowledge. Generating your report now 🎉";
      } else if (iid) {
        const r = await interviewAPI.sendMessage(iid, text); reply = r.content;
      } else {
        await new Promise((r) => setTimeout(r, 1200));
        const fallbacks = ["Interesting! Can you elaborate with a concrete example?","Good point. How would you handle edge cases?","What's the time/space complexity of that approach?","How would you scale this to 100M users?","Walk me through your thought process step by step."];
        reply = fallbacks[Math.floor(Math.random() * fallbacks.length)];
      }
      setAiTyping(false); addMsg('ai', reply);
      if (isLast) {
        clearInterval(timerRef.current);
        setTimeout(async () => {
          let s = { communication: 75+Math.floor(Math.random()*15), confidence: 65+Math.floor(Math.random()*20), clarity: 78+Math.floor(Math.random()*12), technical: 70+Math.floor(Math.random()*20) };
          if (iid) { try { const r = await interviewAPI.end(iid, timer); s = r.scores; } catch {} }
          s.overall = Math.round((s.communication+s.confidence+s.clarity+s.technical)/4);
          setScores(s); if (vid.recording) vid.stopRecording(); setStage('ended');
        }, 2000);
      }
    } catch { setAiTyping(false); addMsg('ai', 'Connection hiccup — please continue, can you elaborate on that?'); }
  }, [input, aiTyping, msgCount, iid, timer, addMsg, vid]);

  /* voice */
  const toggleVoice = useCallback(() => {
    if (!voiceOn) {
      const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SR) { alert('Speech recognition needs Chrome.'); return; }
      recognRef.current = new SR(); recognRef.current.continuous = true; recognRef.current.interimResults = true;
      recognRef.current.onresult = (e) => setInput(Array.from(e.results).map((r)=>r[0].transcript).join(''));
      recognRef.current.onerror = () => setVoiceOn(false);
      recognRef.current.start(); setVoiceOn(true);
    } else { recognRef.current?.stop(); setVoiceOn(false); }
  }, [voiceOn]);

  const endEarly = useCallback(async () => {
    clearInterval(timerRef.current); if (vid.recording) vid.stopRecording();
    let s = { communication:72, confidence:68, clarity:75, technical:70, overall:71 };
    if (iid) { try { const r = await interviewAPI.end(iid, timer); s = { ...r.scores, overall: r.scores.overall||71 }; } catch {} }
    setScores(s); setStage('ended');
  }, [iid, timer, vid]);

  useEffect(() => () => { clearInterval(timerRef.current); recognRef.current?.stop(); }, []);

  /* ── SETUP ── */
  if (stage === 'setup') return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-white">AI Interview Room</h1>
      <div className="grid grid-cols-3 gap-4">
        {Object.entries(INTERVIEW_MODES).map(([k,v]) => (
          <motion.button key={k} whileHover={{scale:1.02}} whileTap={{scale:0.98}} onClick={() => setMode(k)}
            className={`glass-card rounded-2xl p-5 text-left transition-all ${mode===k?'border-brand-500/50 shadow-glow':'hover:border-white/20'}`}>
            <div className="text-3xl mb-3">{v.icon}</div>
            <div className="font-semibold text-white mb-1">{v.label}</div>
            <div className="text-xs text-slate-500">{v.desc}</div>
            {mode===k && <div className="w-2 h-2 rounded-full bg-brand-400 mt-3"/>}
          </motion.button>
        ))}
      </div>

      <div className="glass-card rounded-2xl p-6">
        <h3 className="font-semibold text-white mb-4">Settings</h3>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-slate-400 mb-3">Target Company</label>
            <div className="flex flex-wrap gap-2">
              {companies.map((c) => (
                <button key={c} onClick={() => setCompany(c)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${company===c?'bg-brand-500 text-white':'glass text-slate-400 hover:text-white'}`}>{c}</button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            {[['Mode', INTERVIEW_MODES[mode].label],['Company', company],['AI Engine','Claude gemini-1.5-flash'],['Duration','30–45 min']].map(([k,v]) => (
              <div key={k} className="flex justify-between text-sm"><span className="text-slate-500">{k}</span><span className="text-white font-medium">{v}</span></div>
            ))}
          </div>
        </div>
      </div>

      {/* Camera setup */}
      <div className="glass-card rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3">
          <div><h3 className="font-semibold text-white">Video Recording <span className="text-slate-600 text-sm font-normal">(optional)</span></h3>
            <p className="text-xs text-slate-500">Record for self-review playback</p></div>
          <button onClick={vid.camEnabled ? vid.stopCamera : vid.startCamera}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${vid.camEnabled?'bg-red-500/20 text-red-400 border border-red-500/30':'btn-secondary'}`}>
            {vid.camEnabled ? '📷 Disable' : '📷 Enable Camera'}
          </button>
        </div>
        {vid.camError && <p className="text-xs text-red-400 mb-2">{vid.camError}</p>}
        {vid.camEnabled && (
          <div className="rounded-xl overflow-hidden bg-black" style={{height:160}}>
            <video ref={vid.videoRef} autoPlay muted playsInline className="w-full h-full object-cover"/>
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <button onClick={startInterview} className="btn-primary flex items-center gap-2 py-4 px-8 rounded-2xl">🚀 Start Interview</button>
        <button onClick={() => navigate('dashboard')} className="btn-secondary py-4 px-6 rounded-2xl text-sm">Cancel</button>
      </div>
    </div>
  );

  /* ── RESULTS ── */
  if (stage === 'ended') {
    const metrics = [
      {label:'Communication', score:scores.communication, icon:'💬', color:'#5b68f3'},
      {label:'Confidence',    score:scores.confidence,    icon:'💪', color:'#8b5cf6'},
      {label:'Clarity',       score:scores.clarity,       icon:'🎯', color:'#06b6d4'},
      {label:'Technical',     score:scores.technical,     icon:'🧠', color:'#10b981'},
    ];
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <motion.div initial={{opacity:0,scale:0.9}} animate={{opacity:1,scale:1}} className="text-center py-6">
          <div className="text-5xl mb-3">🎉</div>
          <h1 className="text-3xl font-bold text-white mb-1">Interview Complete!</h1>
          <p className="text-slate-400">{fmt(timer)} · {INTERVIEW_MODES[mode].label} · {company}</p>
        </motion.div>

        <div className="grid grid-cols-4 gap-4">
          {metrics.map((m,i) => (
            <motion.div key={i} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:i*0.1}} className="glass-card rounded-2xl p-5 text-center">
              <div className="text-2xl mb-2">{m.icon}</div>
              <div className="text-2xl font-bold text-white mb-1">{m.score}%</div>
              <div className="text-xs text-slate-500 mb-3">{m.label}</div>
              <div className="h-1.5 glass rounded-full overflow-hidden">
                <motion.div initial={{width:0}} animate={{width:`${m.score}%`}} transition={{duration:1,delay:0.5+i*0.1}}
                  className="h-full rounded-full" style={{background:m.color}}/>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-white text-lg">Overall Score</h3>
            <div className="text-center">
              <div className="text-4xl font-bold gradient-text">{scores.overall}%</div>
              <div className="text-xs text-slate-500">{scores.overall>=85?'Excellent 🌟':scores.overall>=70?'Good 👍':'Keep Practicing 💪'}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-5">
            {[
              {t:'strength', text:'Good logical structure and professional communication throughout.'},
              {t:'strength', text:'Maintained clear answers with relevant context.'},
              {t:'improve',  text:'Add specific metrics to examples (e.g., "improved speed by 40%").'},
              {t:'improve',  text:'Work on conciseness — tighten longer answers for impact.'},
            ].map((f,i) => (
              <div key={i} className={`flex gap-2 p-3 rounded-xl text-xs border ${f.t==='strength'?'bg-green-500/5 border-green-500/10 text-green-300':'bg-yellow-500/5 border-yellow-500/10 text-yellow-300'}`}>
                <span>{f.t==='strength'?'✅':'💡'}</span><span>{f.text}</span>
              </div>
            ))}
          </div>

          {vid.videoURL && (
            <div className="mb-5">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-semibold text-white">📹 Interview Recording</h4>
                <button onClick={vid.download} className="text-xs text-brand-400 hover:text-brand-300">⬇ Download .webm</button>
              </div>
              <div className="rounded-xl overflow-hidden bg-black">
                <video src={vid.videoURL} controls className="w-full max-h-52 object-contain"/>
              </div>
            </div>
          )}

          <div className="flex gap-3 flex-wrap">
            <button onClick={() => { setStage('setup'); setScores(null); }} className="btn-primary py-2.5 px-6 rounded-xl text-sm">🔄 Practice Again</button>
            <button onClick={() => navigate('analytics')} className="btn-secondary py-2.5 px-6 rounded-xl text-sm">📊 Analytics</button>
            <button onClick={() => navigate('certificate')} className="btn-secondary py-2.5 px-6 rounded-xl text-sm">🏆 Certificate</button>
            <button onClick={() => navigate('dashboard')} className="btn-secondary py-2.5 px-6 rounded-xl text-sm">🏠 Dashboard</button>
          </div>
        </div>
      </div>
    );
  }

  /* ── ACTIVE ── */
  return (
    <div className="max-w-5xl mx-auto flex flex-col" style={{height:'calc(100vh - 120px)'}}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 bg-red-400 rounded-full animate-pulse"/><span className="text-sm text-red-400 font-semibold">LIVE</span></div>
          <div className="glass px-3 py-1.5 rounded-xl text-sm text-white font-mono">{fmt(timer)}</div>
          <div className="text-sm text-slate-500">{INTERVIEW_MODES[mode].icon} {company}</div>
          {vid.recording && <div className="flex items-center gap-1 glass px-2 py-1 rounded-lg"><div className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse"/><span className="text-xs text-red-400">REC</span></div>}
        </div>
        <div className="flex items-center gap-3">
          <div className="text-xs text-slate-500">Q{msgCount+1}/8</div>
          <div className="w-28 h-1.5 glass rounded-full overflow-hidden">
            <div className="h-full bg-brand-500 rounded-full transition-all duration-700" style={{width:`${Math.min(msgCount/8*100,100)}%`}}/>
          </div>
          {vid.camEnabled
            ? <button onClick={vid.recording ? vid.stopRecording : vid.startRecording}
                className={`text-xs px-3 py-1.5 rounded-xl ${vid.recording?'bg-red-500/20 text-red-400 border border-red-500/30':'glass text-slate-400 hover:text-white'}`}>
                {vid.recording ? '⏹ Stop' : '⏺ Record'}
              </button>
            : <button onClick={vid.startCamera} className="text-xs glass px-3 py-1.5 rounded-xl text-slate-400 hover:text-white">📷 Camera</button>
          }
          <button onClick={endEarly} className="text-xs glass px-3 py-1.5 rounded-xl text-slate-400 hover:text-white">End</button>
        </div>
      </div>

      {/* Chat + Camera PiP */}
      <div className="flex gap-4 flex-1 min-h-0">
        <div className="flex-1 flex flex-col min-h-0">
          <div ref={chatRef} className="flex-1 overflow-y-auto space-y-4 pr-2 mb-3">
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div key={msg.id} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{duration:0.25}}
                  className={`flex ${msg.role==='user'?'justify-end':'justify-start'}`}>
                  {msg.role==='ai' && <div className="w-8 h-8 rounded-xl animated-gradient flex items-center justify-center text-xs font-bold text-white flex-shrink-0 mr-2 mt-1 shadow-glow">AI</div>}
                  <div className={`max-w-xl px-4 py-3 rounded-2xl text-sm leading-relaxed ${msg.role==='user'?'bg-brand-500/20 border border-brand-500/20 text-white rounded-tr-sm ml-10':'glass-card text-slate-200 rounded-tl-sm'}`}>
                    {msg.content.split('\n').map((l,i) => <p key={i} className={i>0?'mt-1.5':''}>{l.replace(/\*\*/g,'')}</p>)}
                    <div className={`text-xs mt-1.5 ${msg.role==='user'?'text-brand-400/50':'text-slate-600'}`}>{msg.time}</div>
                  </div>
                  {msg.role==='user' && <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-400 to-purple-500 flex items-center justify-center text-xs font-bold text-white flex-shrink-0 ml-2 mt-1">U</div>}
                </motion.div>
              ))}
              {aiTyping && (
                <motion.div key="typing" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="flex items-end gap-2">
                  <div className="w-8 h-8 rounded-xl animated-gradient flex items-center justify-center text-xs font-bold text-white shadow-glow">AI</div>
                  <div className="glass-card rounded-2xl rounded-tl-sm px-4 py-3">
                    <div className="flex gap-1 h-4 items-center">
                      {[0,0.2,0.4].map((d,i) => <motion.div key={i} animate={{scale:[1,1.5,1]}} transition={{duration:0.7,delay:d,repeat:Infinity}} className="w-2 h-2 bg-brand-400 rounded-full"/>)}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="glass-card rounded-2xl p-3 flex items-end gap-3 flex-shrink-0">
            <textarea value={input} onChange={(e)=>setInput(e.target.value)}
              onKeyDown={(e)=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();sendMessage();}}}
              placeholder="Type your answer… (Enter to send)" rows={3}
              className="flex-1 bg-transparent text-sm text-white placeholder-slate-600 outline-none resize-none leading-relaxed"/>
            <div className="flex flex-col gap-2">
              <button onClick={toggleVoice} className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${voiceOn?'bg-red-500 pulse-ring':'glass hover:bg-white/10'}`}>
                {voiceOn?'⏹':'🎤'}
              </button>
              <button onClick={sendMessage} disabled={!input.trim()||aiTyping}
                className="w-10 h-10 rounded-xl bg-brand-500 hover:bg-brand-400 disabled:opacity-40 flex items-center justify-center transition-all shadow-glow text-white text-lg">↑</button>
            </div>
          </div>
        </div>

        {vid.camEnabled && (
          <motion.div initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} className="w-48 flex-shrink-0 space-y-3">
            <div className="glass-card rounded-2xl overflow-hidden">
              <div className="relative bg-black" style={{height:130}}>
                <video ref={vid.videoRef} autoPlay muted playsInline className="w-full h-full object-cover"/>
                {vid.recording && <div className="absolute top-2 right-2 flex items-center gap-1 glass px-1.5 py-0.5 rounded"><div className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse"/><span className="text-xs text-red-400">REC</span></div>}
              </div>
              <div className="p-2 text-center text-xs text-slate-500">You</div>
            </div>
            <div className="glass-card rounded-xl p-3">
              <div className="text-xs font-semibold text-white mb-2">💡 Tips</div>
              <ul className="space-y-1 text-xs text-slate-500">
                {['Look at camera','Sit up straight','Speak clearly','Use examples'].map((t,i) => <li key={i}>{t}</li>)}
              </ul>
            </div>
          </motion.div>
        )}
      </div>
      <p className="text-xs text-slate-700 text-center mt-2 flex-shrink-0">Enter to send · Shift+Enter new line · 🎤 voice</p>
    </div>
  );
}
