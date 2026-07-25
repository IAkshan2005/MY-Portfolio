import React, { useState, useEffect, useRef } from 'react';
import {
  Terminal,
  Cpu,
  Sparkles,
  Globe,
  Github,
  Layers,
  ArrowUpRight,
  Send,
  Volume2,
  VolumeX,
  Shield,
  Radio,
  Code2,
  Database,
  Layout,
  RefreshCw,
  Layers2,
  CheckCircle2,
  History,
  X,
  Flame,
  ArrowRight
} from 'lucide-react';
import { Project, SkillNode, TerminalLine } from './types';

export default function App() {
  // Theme highlights
  const [activeTab, setActiveTab] = useState<'all' | 'ecommerce' | 'ui' | 'ai'>('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  
  // Custom cursor position
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [cursorLabel, setCursorLabel] = useState('');

  // Audio Synthesizer State
  const [isAudioOn, setIsAudioOn] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const synthGainNode = useRef<GainNode | null>(null);
  const ambientOscillator = useRef<OscillatorNode | null>(null);
  const ambientGain = useRef<GainNode | null>(null);

  // Terminal State
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalHistory, setTerminalHistory] = useState<TerminalLine[]>([
    { text: 'SYSTEM CORRUPTED... INTRUSION DETECTED...', type: 'error', timestamp: '09:47:39' },
    { text: 'DECRYPTING AUTH KEY...', type: 'warn', timestamp: '09:47:40' },
    { text: 'SECURE SHELL ACQUIRED. WELCOME TO AKSHAN CORE V2.47.', type: 'success', timestamp: '09:47:41' },
    { text: 'Type "help" to fetch manual protocols or test core parameters.', type: 'system', timestamp: '09:47:41' }
  ]);
  const terminalBottomRef = useRef<HTMLDivElement>(null);

  // AI Assistant Chat State
  const [aiChatHistory, setAiChatHistory] = useState([
    { sender: 'AI', text: 'Subroutine: AKSHAN_CORE initialized. How can I assist you with Akshan\'s engineering credentials today?' }
  ]);
  const [aiInput, setAiInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Contact Form Transmissions State
  const [transmissions, setTransmissions] = useState<any[]>([]);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMsg, setContactMsg] = useState('');
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [transmissionStatus, setTransmissionStatus] = useState<string | null>(null);

  // Skill Decryption Progress Map
  const [skills, setSkills] = useState<SkillNode[]>([
    { name: 'TypeScript / React', level: 96, class: 'Frontend', status: 'DECRYPTED', diagnosticCode: '0x992B' },
    { name: 'Tailwind CSS / GSAP', level: 92, class: 'Frontend', status: 'DECRYPTED', diagnosticCode: '0xE81A' },
    { name: 'Node.js / Express', level: 88, class: 'Backend', status: 'ENCRYPTED', diagnosticCode: '0x44BC' },
    { name: 'REST APIs & WebSockets', level: 85, class: 'Protocols', status: 'ENCRYPTED', diagnosticCode: '0x1F72' },
    { name: 'System Architecture', level: 80, class: 'Architecture', status: 'ENCRYPTED', diagnosticCode: '0xA9D8' },
    { name: 'Git & Deployment Pipelines', level: 90, class: 'Protocols', status: 'DECRYPTED', diagnosticCode: '0x3D4C' }
  ]);
  const [decryptingIndex, setDecryptingIndex] = useState<number | null>(null);
  const [decryptProgress, setDecryptProgress] = useState(100);

  // Custom Projects List
  const projects: Project[] = [
    {
      id: 'vinoria',
      title: 'Vinoria Market',
      category: 'ecommerce',
      client: 'Boutique Winery',
      description: 'A premium wine e-commerce platform built to feel editorial, streamlined, and clean to browse.',
      extendedDesc: 'Vinoria Market leverages responsive design models to showcase fine wines. It incorporates rapid loading architectures, advanced client-side filtering algorithms, and an ultra-secure Checkout mock sequence. Every item card behaves with tactile fluid response.',
      tags: ['React', 'TypeScript', 'Tailwind', 'Fluid Motion'],
      metrics: [
        { label: 'Page Speed Index', value: '0.6s' },
        { label: 'Conversion Lift', value: '+35%' },
        { label: 'Lighthouse Score', value: '100%' }
      ],
      status: 'online',
      liveUrl: 'https://vinoria.io',
      githubUrl: 'https://github.com/akshan/vinoria-market'
    },
    {
      id: 'nexis',
      title: 'Nexis Studio',
      category: 'ui',
      client: 'Design Token System',
      description: 'A modular, high-contrast user interface system for engineering scalable brands and WebGL dashboards.',
      extendedDesc: 'A full design token package compiled to CSS/JSON parameters. Features fully compliant keyboard accessibility, strict color contrast guidelines, customizable themes, and robust modular grid visual layouts built specifically for fast web portals.',
      tags: ['Tailwind CSS', 'Figma API', 'Design Tokens', 'Accessibility'],
      metrics: [
        { label: 'Component Library Size', value: '24kb' },
        { label: 'Keyboard Nav compliance', value: 'WCAG AA' },
        { label: 'Dev adoption rate', value: '94%' }
      ],
      status: 'online',
      liveUrl: 'https://nexis.studio',
      githubUrl: 'https://github.com/akshan/nexis-studio'
    },
    {
      id: 'synapse',
      title: 'Synapse Core Monitor',
      category: 'ai',
      client: 'Autonomous Node Terminal',
      description: 'An interactive real-time resource aggregator widget that compiles application metrics into sleek layouts.',
      extendedDesc: 'Synapse connects to mock performance metrics to read server loads, memory allocation patterns, and network traffic indices. Displays highly clean vector-based telemetry charts and logs directly onto responsive dark-theme dashboard panels.',
      tags: ['Web Audio API', 'React Hooks', 'SVG Visualizer', 'CSS Grid'],
      metrics: [
        { label: 'Update Latency', value: '16ms' },
        { label: 'CPU footprint', value: '<2%' },
        { label: 'Telemetry parameters', value: '18+' }
      ],
      status: 'under-development',
      githubUrl: 'https://github.com/akshan/synapse-core'
    }
  ];

  // Load transmissions from storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('akshan_transmissions');
    if (saved) {
      try {
        setTransmissions(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Sync cursor pos
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Keyboard accessibility listen
  useEffect(() => {
    if (terminalBottomRef.current) {
      terminalBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [terminalHistory]);

  const toggleAudio = () => {
    const state = !isAudioOn;
    setIsAudioOn(state);
    
    try {
      if (state) {
        // Initialize AudioContext lazily on user action (chrome security requirement)
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioContextClass();
        audioCtxRef.current = ctx;

        // Custom cyber low synth drone oscillator
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const masterGain = ctx.createGain();
        
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(55, ctx.currentTime); // Low A hum
        
        // Low pass filter to make it pleasant drone rather than harsh noise
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(110, ctx.currentTime);
        
        gain.gain.setValueAtTime(0.015, ctx.currentTime); // very subtle background
        masterGain.gain.setValueAtTime(1.0, ctx.currentTime);
        
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start();
        
        // Save references
        ambientOscillator.current = osc;
        ambientGain.current = gain;
        synthGainNode.current = masterGain;

        // Play positive activation sound
        playBeep(440, 'sine', 0.15, 0.1);
        setTimeout(() => playBeep(880, 'sine', 0.1, 0.15), 100);
      } else {
        // Stop background ambient osc
        if (ambientOscillator.current) {
          ambientOscillator.current.stop();
          ambientOscillator.current.disconnect();
          ambientOscillator.current = null;
        }
        if (audioCtxRef.current) {
          audioCtxRef.current.close();
          audioCtxRef.current = null;
        }
        ambientGain.current = null;
        synthGainNode.current = null;
      }
    } catch (e) {
      console.warn('Audio Context failed to boot. Likely iframe permission boundary.', e);
    }
  };

  const playBeep = (freq: number, type: OscillatorType = 'sine', duration = 0.1, volume = 0.12) => {
    if (!isAudioOn || !audioCtxRef.current) return;
    try {
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      
      gainNode.gain.setValueAtTime(volume, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      console.warn('Click synth failure', e);
    }
  };

  const handleInteractiveHover = (label = '', active = true) => {
    setIsHovered(active);
    setCursorLabel(label);
    if (active) {
      playBeep(1200, 'sine', 0.04, 0.03);
    }
  };

  // Skill interactive decryptor routine
  const triggerDecryptSkill = (index: number) => {
    if (decryptingIndex !== null) return;
    
    playBeep(220, 'triangle', 0.4, 0.1);
    setDecryptingIndex(index);
    setDecryptProgress(0);

    // Swap skill item structure
    const updated = [...skills];
    updated[index].status = 'DECRYPTED';

    const interval = setInterval(() => {
      setDecryptProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setDecryptingIndex(null);
          playBeep(880, 'sine', 0.2, 0.12);
          
          setSkills((prevSkills) => {
            const temp = [...prevSkills];
            temp[index].status = 'DECRYPTED';
            return temp;
          });
          return 100;
        }
        // Synthesizer blip frequency shifts during load
        if (prev % 15 === 0) {
          playBeep(600 + prev * 5, 'sawtooth', 0.05, 0.03);
        }
        return prev + 10;
      });
    }, 70);
  };

  // Terminal commands interpreter
  const handleTerminalCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!terminalInput.trim()) return;

    const cmd = terminalInput.trim().toLowerCase();
    const time = new Date().toLocaleTimeString('en-US', { hour12: false });
    
    // Add typed input to list
    const newLogs: TerminalLine[] = [
      ...terminalHistory,
      { text: `visitor@akshan-core:~$ ${terminalInput}`, type: 'input', timestamp: time }
    ];

    playBeep(350, 'square', 0.08, 0.08);

    // Interpret command
    if (cmd === 'help') {
      newLogs.push(
        { text: 'AVAILABLE CYBER PROTOCOLS:', type: 'success', timestamp: time },
        { text: '  about      - Display Akshan\'s mission parameter vector.', type: 'system', timestamp: time },
        { text: '  skills     - Interrogate technical node decryption arrays.', type: 'system', timestamp: time },
        { text: '  projects   - Output compiled visual works registry data.', type: 'system', timestamp: time },
        { text: '  contact    - Retrieve direct sub-ether coordinates (form/socials).', type: 'system', timestamp: time },
        { text: '  metrics    - Show real-time production performance indicators.', type: 'system', timestamp: time },
        { text: '  clear      - Purge standard visual terminal buffer state.', type: 'system', timestamp: time }
      );
    } else if (cmd === 'about') {
      newLogs.push(
        { text: 'MISSION OUTLINE: Akshan is a forward-thinking software engine architect who blends cold, meticulous design criteria with highly kinetic web layouts.', type: 'success', timestamp: time },
        { text: 'Focus ranges from scalable micro-interfacing patterns to accessible web rendering frameworks. Highly passionate about user speed metrics, aesthetic balance, and custom synthesized environments.', type: 'system', timestamp: time }
      );
    } else if (cmd === 'skills') {
      newLogs.push(
        { text: '--- INTEGRITIES ACQUIRED FROM SKILLS MATRIX ---', type: 'warn', timestamp: time },
        ...skills.map(s => ({
          text: `[${s.status}] ${s.name.padEnd(24)} | Level: ${s.level}% | Diagnostic: ${s.diagnosticCode}`,
          type: s.status === 'DECRYPTED' ? 'success' as const : 'warn' as const,
          timestamp: time
        }))
      );
    } else if (cmd === 'projects') {
      newLogs.push(
        { text: '--- COMPILED WORKS FOR MAIN VIEWPORT ---', type: 'warn', timestamp: time },
        ...projects.map(p => ({
          text: `✦ ${p.title} (${p.category.toUpperCase()}) - ${p.description}`,
          type: 'success' as const,
          timestamp: time
        })),
        { text: 'Type standard contact to get custom request protocol details.', type: 'system', timestamp: time }
      );
    } else if (cmd === 'contact') {
      newLogs.push(
        { text: 'DIRECT CHANNELS SECURED:', type: 'success', timestamp: time },
        { text: '  Email: dis227783@gmail.com', type: 'success', timestamp: time },
        { text: '  GitHub: @akshan', type: 'system', timestamp: time },
        { text: '  Use the inbound transmitter visual block below for fast dispatch.', type: 'warn', timestamp: time }
      );
    } else if (cmd === 'metrics') {
      newLogs.push(
        { text: 'SYSTEM STATS:', type: 'success', timestamp: time },
        { text: '  Product Deployments: 12+', type: 'success', timestamp: time },
        { text: '  Aesthetic Rating: Optimal', type: 'success', timestamp: time },
        { text: '  Avg Engagement Lift: +35%', type: 'success', timestamp: time },
        { text: '  Client Satisfaction: 100%', type: 'success', timestamp: time }
      );
    } else if (cmd === 'clear') {
      setTerminalHistory([]);
      setTerminalInput('');
      return;
    } else {
      newLogs.push({ text: `Unknown command "${cmd}". Type "help" for a manual protocol list.`, type: 'error', timestamp: time });
    }

    setTerminalHistory(newLogs);
    setTerminalInput('');
  };

  // AI Dialogue system responds immediately on click
  const handleAiQuestion = (question: string) => {
    if (isTyping) return;
    
    // Add standard prompt bubble
    const queue = [...aiChatHistory, { sender: 'User', text: question }];
    setAiChatHistory(queue);
    setIsTyping(true);
    playBeep(400, 'triangle', 0.1, 0.08);

    // Simple delay for thinking representation
    setTimeout(() => {
      let answer = '';
      if (question.includes('stack')) {
        answer = 'Akshan core is optimized for TypeScript, React, Vite, Node, and tailwind/postcss configurations. Performance metrics are reinforced with procedural animations and vector assets.';
      } else if (question.includes('internships')) {
        answer = 'Affirmative. Akshan is actively scouting for strategic software engineering internships and visual development collaborations. Transmission coordinates are fully decryptable in the footer system below.';
      } else if (question.includes('design')) {
        answer = 'The design paradigm is "Tactile Cyberpunk Editorial Grid". It respects clean typographic grid pairings, precise negative space layouts, functional high-contrast accent systems, and excludes bloated generic gradient clutter.';
      } else {
        answer = 'Core status is active. Highly adaptable to production teams aiming to scale product architectures with pristine responsive rendering layers.';
      }

      setAiChatHistory([...queue, { sender: 'AI', text: answer }]);
      setIsTyping(false);
      // Play cool cyber received chirp
      playBeep(950, 'sine', 0.15, 0.08);
      setTimeout(() => playBeep(1400, 'sine', 0.1, 0.05), 80);
    }, 850);
  };

  // Custom AI input submission
  const handleCustomAiSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiInput.trim() || isTyping) return;
    const txt = aiInput;
    setAiInput('');
    handleAiQuestion(txt);
  };

  // Transmit Message sequence
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMsg) {
      setTransmissionStatus('ERROR: Empty fields detected in input nodes.');
      playBeep(200, 'sawtooth', 0.3, 0.15);
      return;
    }

    setIsTransmitting(true);
    setTransmissionStatus('STABILIZING SIGNAL PATH...');
    playBeep(300, 'triangle', 0.15, 0.1);

    setTimeout(() => {
      // Append message object
      const payload = {
        name: contactName,
        email: contactEmail,
        msg: contactMsg,
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
        id: Math.random().toString(36).substring(3, 8).toUpperCase()
      };

      const updated = [payload, ...transmissions];
      setTransmissions(updated);
      localStorage.setItem('akshan_transmissions', JSON.stringify(updated));

      // Append log directly inside primary terminal
      setTerminalHistory((prev) => [
        ...prev,
        { text: `[TRANSMISSION ${payload.id}] SECURE STREAM ROUTED FROM ${payload.name.toUpperCase()}`, type: 'success', timestamp: payload.timestamp }
      ]);

      setIsTransmitting(false);
      setTransmissionStatus(`SUCCESS: SECURED CHANNEL ID [${payload.id}]. ACK RECEIVED.`);
      playBeep(1200, 'sine', 0.3, 0.12);

      // Clean inputs
      setContactName('');
      setContactEmail('');
      setContactMsg('');

      // Auto fade status
      setTimeout(() => setTransmissionStatus(null), 5000);
    }, 1800);
  };

  const clearIncomingLogs = () => {
    playBeep(180, 'sawtooth', 0.2, 0.1);
    setTransmissions([]);
    localStorage.removeItem('akshan_transmissions');
  };

  // Custom Project categories
  const filteredProjects = activeTab === 'all' 
    ? projects 
    : projects.filter(p => p.category === activeTab);

  return (
    <div className="relative min-h-screen text-slate-100 font-sans selection:bg-cyber selection:text-ink cyber-scanlines overflow-hidden">
      
      {/* Visual cyber target reticle tracking cursor (hidden on mobile) */}
      <div 
        className="pointer-events-none fixed z-50 hidden md:block"
        style={{
          left: `${mousePos.x}px`,
          top: `${mousePos.y}px`,
          transform: 'translate(-50%, -50%)',
          transition: 'width 0.2s, height 0.2s, background-color 0.2s'
        }}
      >
        <div className={`rounded-full border border-cyber/50 flex items-center justify-center ${isHovered ? 'w-16 h-16 bg-cyber/10' : 'w-10 h-10 bg-transparent'}`}>
          <div className="w-1.5 h-1.5 rounded-full bg-cyber" />
        </div>
        {cursorLabel && (
          <div className="absolute top-8 left-8 py-1 px-2.5 bg-black/90 border border-cyber text-[9px] uppercase tracking-widest text-cyber whitespace-nowrap rounded font-mono">
            {cursorLabel}
          </div>
        )}
      </div>

      {/* TECH DECORATIVE BACKGROUNDS */}
      <div className="absolute inset-0 tech-grid-lines opacity-40 mix-blend-color-dodge pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-cyber/5 to-transparent pointer-events-none" />

      {/* FLOATING STATUS HUD BAR (Top-most visual indicators) */}
      <div className="text-[10px] text-slate-500 font-mono tracking-widest bg-black/45 py-2 px-6 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-cyber">
            <span className="w-1.5 h-1.5 rounded-full bg-cyber animate-pulse" />
            CORE ACTIVE: V2.47
          </span>
          <span className="hidden sm:inline border-l border-white/10 pl-4">UTC CLOCK: 09:47:39</span>
          <span className="hidden md:inline border-l border-white/10 pl-4">LOCALE: SECURE PORT 3000</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleAudio}
            onMouseEnter={() => handleInteractiveHover('SOUND FEEDBACK')}
            onMouseLeave={() => setIsHovered(false)}
            aria-label={isAudioOn ? "Disable sound effects" : "Enable sound effects"}
            className={`flex items-center gap-1.5 px-3 py-1 bg-white/5 border rounded hover:border-cyber/60 transition ${isAudioOn ? 'text-cyber border-cyber/30 bg-cyber/5' : 'text-slate-400 border-white/10'}`}
          >
            {isAudioOn ? (
              <>
                <Volume2 size={12} />
                <span>AUDIO ON</span>
              </>
            ) : (
              <>
                <VolumeX size={12} />
                <span>AUDIO OFF</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* HEADER NAVIGATION */}
      <header className="sticky top-0 z-40 glass-panel">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="relative group">
              <div className="h-9 w-9 rounded-full bg-linear-to-tr from-cyber/30 via-cyber-pink/20 to-transparent flex items-center justify-center border border-cyber/40 group-hover:rotate-45 transition duration-500">
                <Cpu size={16} className="text-cyber" />
              </div>
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyber opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyber"></span>
              </span>
            </div>
            <div>
              <span className="font-mono text-[9px] uppercase tracking-[0.35em] text-cyber/80 block">ENGINE PORTFOLIO</span>
              <h1 className="text-sm font-semibold tracking-wide text-white font-display">AKSHAN . CO</h1>
            </div>
          </div>
          
          <nav className="hidden gap-8 text-xs font-mono uppercase tracking-widest md:flex">
            <a 
              href="#about" 
              className="text-slate-300 hover:text-cyber transition"
              onMouseEnter={() => handleInteractiveHover('LOCATE MISSION')}
              onMouseLeave={() => setIsHovered(false)}
            >
              ABOUT
            </a>
            <a 
              href="#identity" 
              className="text-slate-300 hover:text-cyber transition"
              onMouseEnter={() => handleInteractiveHover('NEURAL PROFILE')}
              onMouseLeave={() => setIsHovered(false)}
            >
              METRICS
            </a>
            <a 
              href="#projects" 
              className="text-slate-300 hover:text-cyber transition"
              onMouseEnter={() => handleInteractiveHover('DECRYPT WORK')}
              onMouseLeave={() => setIsHovered(false)}
            >
              PROJECTS
            </a>
            <a 
              href="#transmission" 
              className="text-slate-300 hover:text-cyber transition"
              onMouseEnter={() => handleInteractiveHover('CONTACT INTERFACES')}
              onMouseLeave={() => setIsHovered(false)}
            >
              TRANSMIT
            </a>
          </nav>

          <a 
            href="#transmission" 
            className="hidden sm:inline-flex rounded-full border border-cyber-pink/50 bg-cyber-pink/5 px-5 py-2 text-[10px] font-mono uppercase tracking-[0.2em] text-cyber-pink transition hover:bg-cyber-pink/25 hover:shadow-neon-pink"
            onMouseEnter={() => handleInteractiveHover('SECURE COORD')}
            onMouseLeave={() => setIsHovered(false)}
          >
            LET&apos;S BUILD_
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 md:px-8 py-10 space-y-16">
        
        {/* HERO SECTION MODULE */}
        <section id="about" className="relative grid gap-8 lg:grid-cols-12 items-stretch pt-4">
          
          {/* Main Visual Callout */}
          <div className="lg:col-span-8 glass-card rounded-2xl md:rounded-3xl border border-cyber/15 p-6 md:p-12 relative overflow-hidden flex flex-col justify-between shadow-neon">
            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
              <Terminal size={300} className="text-cyber" />
            </div>
            
            <div className="space-y-6 max-w-2xl relative z-10">
              <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-8">
                {/* Advanced Profile Photo Container */}
                <div className="relative w-28 h-28 md:w-36 md:h-36 shrink-0 group">
                  <div className="absolute inset-0 rounded-2xl bg-linear-to-tr from-cyber to-cyber-pink animate-pulse blur-md opacity-20 group-hover:opacity-60 transition duration-500 text-xs"></div>
                  <div className="absolute inset-0 border border-cyber/50 rounded-2xl rotate-3 group-hover:rotate-6 transition duration-500"></div>
                  <div className="absolute inset-0 border border-cyber-pink/50 rounded-2xl -rotate-3 group-hover:-rotate-6 transition duration-500"></div>
                  <div className="w-full h-full relative z-10 rounded-2xl overflow-hidden border border-cyber bg-black">
                    <div className="absolute top-0 left-0 w-full h-1 bg-cyber/80 opacity-50 z-20 animate-scan drop-shadow-[0_0_8px_rgba(7,247,255,0.8)]"></div>
                    <img src={`${import.meta.env.BASE_URL}profile.jpg`} alt="Akshan Profile Code" className="w-full h-full object-cover filter grayscale sepia-[.3] hue-rotate-[180deg] group-hover:grayscale-0 group-hover:sepia-0 transition duration-700" />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 text-[9px] font-mono tracking-widest uppercase bg-cyber/15 border border-cyber/30 text-cyber rounded">
                      METICULOUS PARADIGM
                    </span>
                    <span className="w-2 h-2 rounded-full bg-cyber-pink inline-block animate-ping" />
                  </div>
                  
                  <h2 className="text-3xl md:text-5xl font-semibold leading-tight text-white font-display">
                    Crafting premium digital products with cold editorial precision.
                  </h2>
                </div>
              </div>
              
              <p className="text-sm md:text-base leading-relaxed text-slate-300 max-w-xl mt-4">
                I am <strong className="text-cyber font-medium">Akshan</strong>. I construct high-conversion web interfaces, responsive client layouts, and robust modular application pipelines designed to perform at lightspeed and neon-lit precision.
              </p>
            </div>

            {/* Quick action buttons & tag triggers */}
            <div className="mt-8 pt-8 border-t border-white/5 flex flex-wrap gap-4 items-center justify-between group">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full border border-cyber/20 bg-cyber/5 px-3 py-1.5 text-[10px] font-mono text-cyber uppercase tracking-widest">
                  ⚛️ REACT CORE
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] font-mono text-slate-300 uppercase tracking-widest">
                  🎨 TAILWIND CSS
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] font-mono text-slate-300 uppercase tracking-widest">
                  ⚡ HIGHLIGHT TRANSITIONS
                </span>
              </div>
              <a 
                href="#projects"
                className="inline-flex items-center gap-2 text-xs font-mono text-cyber-pink hover:text-cyber transition group-hover:translate-x-2 duration-300 pointer-events-auto"
                onMouseEnter={() => handleInteractiveHover('ACCESS DOCKET')}
                onMouseLeave={() => setIsHovered(false)}
              >
                DISCOVER REGISTRY <ArrowRight size={14} />
              </a>
            </div>
          </div>

          {/* Quick Metrics HUD Column (Bento configuration) */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            
            <div id="identity" className="glass-card-pink rounded-2xl md:rounded-3xl p-6 flex flex-col justify-between flex-1">
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[0.35em] text-cyber-pink">QUANTIFIABLE STATUS</p>
                <h3 className="mt-2 text-xl font-semibold text-white tracking-tight font-display">Production Delivery Output</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-4 my-6">
                <div className="border-l-2 border-cyber-pink/40 pl-3">
                  <p className="text-3xl font-semibold text-white font-mono">12+</p>
                  <p className="text-[10px] text-slate-400 font-mono uppercase tracking-wider mt-1">Deployments</p>
                </div>
                <div className="border-l-2 border-cyber-pink/40 pl-3">
                  <p className="text-3xl font-semibold text-white font-mono">35%</p>
                  <p className="text-[10px] text-slate-400 font-mono uppercase tracking-wider mt-1">Conversion Lift</p>
                </div>
                <div className="border-l-2 border-white/20 pl-3">
                  <p className="text-3xl font-semibold text-white font-mono">100%</p>
                  <p className="text-[10px] text-slate-400 font-mono uppercase tracking-wider mt-1">Audit Score</p>
                </div>
                <div className="border-l-2 border-white/20 pl-3">
                  <p className="text-3xl font-semibold text-white font-mono">0.6s</p>
                  <p className="text-[10px] text-slate-400 font-mono uppercase tracking-wider mt-1">Load Index</p>
                </div>
              </div>

              <div className="text-[10.5px] bg-white/5 border border-white/10 rounded-xl p-3 text-slate-300 font-mono leading-relaxed">
                <span className="text-cyber-pink font-semibold">LOG REDIRECT:</span> Optimized client frameworks show faster performance index. Tested on multiple browsers successfully.
              </div>
            </div>

            {/* Micro widget: Static Status indicator */}
            <div className="bg-slate-950/70 border border-white/5 rounded-2xl p-4 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">GEOLOCATION SYSTEM:</span>
              <span className="text-cyber uppercase font-semibold">ASIA/COLOMBO SECTOR</span>
            </div>

          </div>
        </section>

        {/* SKILLS DECRYPTION LAB & TERMINAL COMPONENT */}
        <section className="grid gap-6 lg:grid-cols-12 items-start">
          
          {/* Interactive Decryption Lab Block */}
          <div className="lg:col-span-6 glass-card rounded-2xl p-6 md:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layout size={16} className="text-cyber" />
                <h3 className="text-base font-semibold tracking-wider font-mono">TECH INTEGRITY MATRIX</h3>
              </div>
              <span className="text-[10px] font-mono text-slate-500">DECRYPTED LEVEL CAP</span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-mono">
              Hover/Touch the locked system nodes below to deploy our diagnostic decryption sequencer:
            </p>

            <div className="space-y-4">
              {skills.map((skill, index) => (
                <div 
                  key={index}
                  onMouseEnter={() => triggerDecryptSkill(index)}
                  className={`border rounded-xl p-4 transition-all duration-300 cursor-pointer ${
                    skill.status === 'DECRYPTED' 
                    ? 'bg-cyber/5 border-cyber/25 hover:border-cyber/50' 
                    : 'bg-black/40 border-white/10 hover:border-cyber/30'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-white font-medium flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full ${skill.status === 'DECRYPTED' ? 'bg-cyber animate-pulse' : 'bg-slate-600'}`} />
                      {skill.name}
                    </span>
                    <span className="text-slate-400 uppercase text-[9px] bg-white/5 px-2 py-0.5 rounded border border-white/5">
                      {skill.class}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center gap-4">
                    {/* Status diagnostic indicator code */}
                    <span className={`text-[10px] font-mono ${skill.status === 'DECRYPTED' ? 'text-cyber' : 'text-slate-500'}`}>
                      {skill.status === 'DECRYPTED' 
                        ? `DECRYPTED [${skill.diagnosticCode}]` 
                        : decryptingIndex === index 
                          ? `DECRYPTING ${decryptProgress}%` 
                          : `ENCRYPTED [LOCKED]`
                      }
                    </span>
                    
                    {/* Visual custom bar layout */}
                    <div className="h-1 flex-1 bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-500 ${skill.status === 'DECRYPTED' ? 'bg-cyber' : 'bg-slate-700'}`}
                        style={{ 
                          width: skill.status === 'DECRYPTED' 
                            ? `${skill.level}%` 
                            : decryptingIndex === index 
                              ? `${decryptProgress}%` 
                              : '0%' 
                        }}
                      />
                    </div>

                    <span className="text-[11px] font-mono font-bold text-white whitespace-nowrap">
                      {skill.status === 'DECRYPTED' ? `${skill.level}%` : '0%'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Core Interactive Command Terminal Console */}
          <div className="lg:col-span-6 bg-slate-950/90 border border-white/10 rounded-2xl p-4 md:p-6 shadow-2xl flex flex-col justify-between min-h-[460px] relative">
            <div className="absolute top-3 right-4 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
            </div>

            <div>
              {/* Header */}
              <div className="flex items-center gap-2 border-b border-white/5 pb-3 mb-4 text-xs font-mono text-slate-400">
                <Terminal size={14} className="text-cyber" />
                <span>AKSHAN SYSTEM DISPATCH SHELL v2.47</span>
              </div>

              {/* Logs area */}
              <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1 font-mono text-xs leading-relaxed">
                {terminalHistory.map((line, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="text-slate-600 shrink-0">[{line.timestamp}]</span>
                    <span className={`break-all ${
                      line.type === 'error' ? 'text-rose-500 font-bold' :
                      line.type === 'warn' ? 'text-amber-400' :
                      line.type === 'success' ? 'text-cyan-400' :
                      line.type === 'input' ? 'text-white' : 'text-slate-300'
                    }`}>
                      {line.text}
                    </span>
                  </div>
                ))}
                <div ref={terminalBottomRef} />
              </div>
            </div>

            {/* Input interface */}
            <form onSubmit={handleTerminalCommand} className="mt-4 pt-3 border-t border-white/5 flex items-center gap-2 font-mono text-xs">
              <span className="text-cyber select-none">visitor@akshan-core:~$</span>
              <input
                type="text"
                value={terminalInput}
                onChange={(e) => setTerminalInput(e.target.value)}
                onKeyDown={() => {
                  // Synthesizer key clicks
                  playBeep(650, 'sine', 0.04, 0.04);
                }}
                className="flex-1 bg-transparent border-none outline-none text-white placeholder-slate-600 focus:ring-0"
                placeholder="Type 'help' for possible execution paths..."
                autoFocus
              />
              <button 
                type="submit" 
                className="text-slate-500 hover:text-cyber transition-all p-1"
                aria-label="Send terminal command"
              >
                <ArrowUpRight size={14} />
              </button>
            </form>
          </div>

        </section>

        {/* NEURAL LINK AI SUBROUTINE PANEL */}
        <section className="glass-card rounded-2xl md:rounded-3xl border border-white/5 p-6 md:p-8 grid gap-8 lg:grid-cols-12 items-center">
          
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-cyber/10 rounded-lg border border-cyber/20 text-cyber">
                <Sparkles size={16} />
              </div>
              <h3 className="text-base font-semibold font-mono uppercase tracking-wide">ASSISTANT_AI PORTAL</h3>
            </div>
            
            <p className="text-sm text-slate-300 leading-relaxed">
              Interact with the <strong className="text-cyber">Neural Subroutine</strong> mimicking Akshan's knowledge. Choose a predefined instruction vector below or write custom queries.
            </p>

            {/* Predefined prompt targets */}
            <div className="space-y-2.5 pt-2">
              <button
                onClick={() => handleAiQuestion('What is Akshan\'s tech stack?')}
                onMouseEnter={() => handleInteractiveHover('INQUIRE TECH')}
                onMouseLeave={() => setIsHovered(false)}
                className="w-full text-left text-xs text-slate-300 py-2.5 px-4 bg-white/5 border border-white/5 hover:border-cyber/40 hover:bg-cyber/5 rounded-xl transition duration-300 font-mono"
              >
                ✦ Query technology platform preferences
              </button>
              <button
                onClick={() => handleAiQuestion('Are you open for internships?')}
                onMouseEnter={() => handleInteractiveHover('INQUIRE PLACEMENT')}
                onMouseLeave={() => setIsHovered(false)}
                className="w-full text-left text-xs text-slate-300 py-2.5 px-4 bg-white/5 border border-white/5 hover:border-cyber/40 hover:bg-cyber/5 rounded-xl transition duration-300 font-mono"
              >
                ✦ Query internship availability indices
              </button>
              <button
                onClick={() => handleAiQuestion('What are your design rules?')}
                onMouseEnter={() => handleInteractiveHover('INQUIRE STYLE')}
                onMouseLeave={() => setIsHovered(false)}
                className="w-full text-left text-xs text-slate-300 py-2.5 px-4 bg-white/5 border border-white/5 hover:border-cyber/40 hover:bg-cyber/5 rounded-xl transition duration-300 font-mono"
              >
                ✦ Query aesthetic structural directives
              </button>
            </div>
          </div>

          <div className="lg:col-span-8 flex flex-col h-[340px] bg-slate-950/60 border border-white/15 rounded-2xl p-4 md:p-6 justify-between select-text">
            
            {/* Thread readout container */}
            <div className="space-y-4 overflow-y-auto max-h-[250px] pr-1">
              {aiChatHistory.map((item, idx) => (
                <div 
                  key={idx} 
                  className={`flex items-start gap-3 ${item.sender === 'User' ? 'justify-end' : 'justify-start'}`}
                >
                  {item.sender === 'AI' && (
                    <div className="w-7 h-7 rounded-lg bg-cyber/15 border border-cyber/30 flex items-center justify-center shrink-0">
                      <Cpu size={12} className="text-cyber" />
                    </div>
                  )}
                  <div className={`p-4.5 rounded-2xl max-w-[85%] text-xs leading-relaxed font-sans ${
                    item.sender === 'User' 
                      ? 'bg-cyber-pink/10 border border-cyber-pink/20 text-slate-100' 
                      : 'bg-white/5 border border-white/10 text-slate-200'
                  }`}>
                    {item.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex items-center gap-2 text-slate-400 font-mono text-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyber animate-pulse" />
                  <span>Subroutine processing grid matrix...</span>
                </div>
              )}
            </div>

            {/* Custom Input dispatch form */}
            <form onSubmit={handleCustomAiSubmit} className="flex gap-2 items-center border-t border-white/5 pt-3 mt-2">
              <input
                type="text"
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                className="flex-1 rounded-full bg-black/50 border border-white/10 text-xs px-4 py-3 placeholder:text-slate-500 focus:border-cyber focus:outline-none transition font-sans text-white focus:ring-1 focus:ring-cyber/20"
                placeholder="Submit direct neural prompt..."
                disabled={isTyping}
              />
              <button
                type="submit"
                disabled={isTyping}
                onMouseEnter={() => handleInteractiveHover('DISPATCH AI ROUTE')}
                onMouseLeave={() => setIsHovered(false)}
                className="h-10 w-10 flex items-center justify-center bg-cyber text-ink hover:bg-white transition duration-300 rounded-full"
                aria-label="Send chat message"
              >
                <Send size={14} />
              </button>
            </form>

          </div>

        </section>

        {/* WORKREGISTRY MODULE (SELECTED PORTFOLIO) */}
        <section id="projects" className="space-y-10 py-4">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.35em] text-cyber font-mono">SELECTED WORK ARCHIVE</p>
              <h3 className="text-3xl font-bold font-display text-white">Engineering results with meticulous details.</h3>
            </div>
            
            {/* Category selection list */}
            <div className="flex flex-wrap gap-2 font-mono text-[10px] uppercase">
              {(['all', 'ecommerce', 'ui', 'ai'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setActiveTab(cat);
                    playBeep(450, 'triangle', 0.05, 0.05);
                  }}
                  onMouseEnter={() => handleInteractiveHover(`FILTER: ${cat.toUpperCase()}`)}
                  onMouseLeave={() => setIsHovered(false)}
                  className={`px-4 py-2 rounded-full border transition-all ${
                    activeTab === cat 
                      ? 'border-cyber bg-cyber/10 text-cyber' 
                      : 'border-white/10 bg-slate-900/45 text-slate-400 hover:border-white/20'
                  }`}
                >
                  {cat === 'all' ? 'ALL_WORKS' : `${cat}_SECTOR`}
                </button>
              ))}
            </div>
          </div>

          {/* Grid visual cards layout */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((proj) => (
              <article 
                key={proj.id}
                onClick={() => {
                  setSelectedProject(proj);
                  playBeep(520, 'sine', 0.15, 0.1);
                }}
                onMouseEnter={() => handleInteractiveHover('VIEW DECRYPTED DETAIL')}
                onMouseLeave={() => setIsHovered(false)}
                className="group relative rounded-2xl overflow-hidden glass-card hover:border-cyber/30 transition-all duration-300 flex flex-col justify-between p-6 shadow-md hover:shadow-neon cursor-pointer"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="text-cyber uppercase bg-cyber/5 border border-cyber/20 px-2 py-0.5 rounded">
                      {proj.category}
                    </span>
                    <span className="text-slate-500">{proj.client}</span>
                  </div>

                  <h4 className="text-2xl font-semibold font-display text-white group-hover:text-cyber transition">
                    {proj.title}
                  </h4>
                  
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    {proj.description}
                  </p>
                </div>

                <div className="space-y-4 mt-6">
                  {/* Performance Indicators preview */}
                  <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/5">
                    {proj.metrics.slice(0, 2).map((met, mi) => (
                      <div key={mi} className="font-mono">
                        <span className="text-[9px] text-slate-500 block uppercase tracking-wider">{met.label}</span>
                        <span className="text-sm font-semibold text-white">{met.value}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between font-mono text-[9.5px]">
                    <div className="flex gap-2 text-slate-500">
                      {proj.tags.slice(0, 2).map((t, idx) => (
                        <span key={idx} className="bg-white/5 border border-white/5 px-2 py-0.5 rounded">{t}</span>
                      ))}
                    </div>
                    <span className="text-cyber-pink inline-flex items-center gap-1 group-hover:underline">
                      ANALYSIS LOG <ArrowUpRight size={12} />
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* FULL PROJECT DETAIL DRAWER OVERLAY MODAL */}
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md transition-opacity">
            <div className="relative w-full max-w-2xl bg-slate-950 border border-cyber/30 rounded-3xl p-6 md:p-8 space-y-6 shadow-neon max-h-[90vh] overflow-y-auto">
              
              <button
                onClick={() => {
                  setSelectedProject(null);
                  playBeep(250, 'sine', 0.1, 0.08);
                }}
                className="absolute top-4 right-4 p-2.5 bg-white/5 border border-white/10 hover:border-cyber text-slate-400 hover:text-white transition rounded-full"
                aria-label="Close details"
              >
                <X size={16} />
              </button>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 text-[9px] font-mono tracking-widest uppercase bg-cyber/15 border border-cyber/30 text-cyber rounded text-xs">
                    COMPILED SYSTEM DOSSIER
                  </span>
                  <span className="text-xs text-slate-400 font-mono">[{selectedProject.client.toUpperCase()}]</span>
                </div>

                <h3 className="text-3xl font-bold font-display text-white">{selectedProject.title}</h3>
                <p className="text-xs text-slate-400 font-mono uppercase">DEPLOYMENT STATUS: <span className="text-emerald-400 font-bold">{selectedProject.status.replace('-', ' ')}</span></p>
              </div>

              <div className="space-y-4 font-sans leading-relaxed text-sm text-slate-300 border-t border-white/10 pt-4">
                <p>{selectedProject.extendedDesc}</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-3 bg-white/5 border border-white/10 p-4 rounded-2xl font-mono">
                {selectedProject.metrics.map((met, idx) => (
                  <div key={idx} className="border-l border-white/20 pl-3">
                    <span className="text-[10px] text-slate-400 block uppercase tracking-widest">{met.label}</span>
                    <span className="text-lg font-bold text-white mt-1 block">{met.value}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-2 text-xs font-mono py-2">
                {selectedProject.tags.map((tag, idx) => (
                  <span key={idx} className="bg-slate-900 border border-white/5 text-slate-300 py-1 px-3 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap gap-4 pt-4 border-t border-white/5 font-mono text-xs justify-end">
                {selectedProject.githubUrl && (
                  <a
                    href={selectedProject.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-slate-300 hover:text-cyber transition px-4 py-2 border border-white/10 hover:border-cyber rounded-xl bg-white/5"
                  >
                    <Github size={13} /> GITHUB_REPOSITORY
                  </a>
                )}
                <button
                  onClick={() => {
                    setSelectedProject(null);
                    playBeep(250, 'sine', 0.1, 0.08);
                  }}
                  className="bg-cyber text-ink hover:bg-white font-semibold tracking-widest py-2.5 px-6 rounded-xl transition"
                >
                  DISMISS LOG
                </button>
              </div>

            </div>
          </div>
        )}

        {/* CONTACT INBOUND MODULE (TRANSMISSIONS FEEDBACK) */}
        <section id="transmission" className="grid gap-8 lg:grid-cols-12 items-start py-4">
          
          {/* Transmission form block layout */}
          <div className="lg:col-span-7 glass-card rounded-2xl p-6 md:p-10 space-y-6 relative">
            <div className="flex items-center gap-2">
              <Radio size={18} className="text-cyber animate-pulse" />
              <h3 className="text-lg font-semibold font-mono uppercase tracking-wide">SECURED CHANNELS DIRECT TRANSLATION</h3>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed font-sans">
              Enter your authentication criteria and transmit clear-text message vectors safely. The core will catalog transmissions onto standard storage frames instantly.
            </p>

            <form onSubmit={handleContactSubmit} className="space-y-5 font-mono text-xs">
              
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block space-y-2">
                  <span className="text-slate-400 uppercase tracking-widest block text-[9.5px]">VISITOR REGISTER IDENT:</span>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-black/60 px-4 py-3.5 text-white outline-none transition focus:border-cyber focus:ring-1 focus:ring-cyber/30 font-sans"
                    placeholder="E.g. Captain Alpha"
                  />
                </label>
                
                <label className="block space-y-2">
                  <span className="text-slate-400 uppercase tracking-widest block text-[9.5px]">DIGITAL COMM ADDRESS:</span>
                  <input
                    type="email"
                    required
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-black/60 px-4 py-3.5 text-white outline-none transition focus:border-cyber focus:ring-1 focus:ring-cyber/30 font-sans"
                    placeholder="you@sector.com"
                  />
                </label>
              </div>

              <label className="block space-y-2">
                <span className="text-slate-400 uppercase tracking-widest block text-[9.5px]">STREAM PACKET MESSAGE CONTENT:</span>
                <textarea
                  rows={4}
                  required
                  value={contactMsg}
                  onChange={(e) => setContactMsg(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-black/60 px-4 py-3.5 text-white outline-none transition focus:border-cyber focus:ring-1 focus:ring-cyber/30 font-sans text-xs leading-relaxed"
                  placeholder="Formulate your request vectors or internship schedules description..."
                />
              </label>

              {transmissionStatus && (
                <div className={`p-4 rounded-xl font-mono text-xs border ${transmissionStatus.startsWith('SUCCESS') ? 'bg-cyber/10 border-cyber/30 text-cyber' : 'bg-rose-950/20 border-rose-500/20 text-rose-400'}`}>
                  {transmissionStatus}
                </div>
              )}

              <button
                type="submit"
                disabled={isTransmitting}
                onMouseEnter={() => handleInteractiveHover('TRANSMIT MESSAGE NOW')}
                onMouseLeave={() => setIsHovered(false)}
                className="w-full inline-flex items-center justify-center rounded-xl bg-cyber-pink py-4 font-mono font-bold uppercase tracking-widest text-white transition-all hover:bg-white hover:text-ink hover:shadow-neon-pink focus:outline-none"
              >
                {isTransmitting ? 'STABILIZING STREAM...' : 'SECURE STREAM DISPATCH'}
              </button>

            </form>
          </div>

          {/* Decoded Streams Inbound Logs Feed */}
          <div className="lg:col-span-5 bg-slate-950/70 border border-white/5 rounded-2xl p-6 space-y-6 flex flex-col justify-between min-h-[460px]">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
                  <CheckCircle2 size={14} className="text-cyber" />
                  <span>DECODED INBOUND STREAMS</span>
                </div>
                {transmissions.length > 0 && (
                  <button 
                    onClick={clearIncomingLogs}
                    className="text-[10px] text-slate-500 hover:text-rose-400 transition font-mono border border-white/10 px-2 py-0.5 rounded hover:border-rose-400/40"
                    onMouseEnter={() => handleInteractiveHover('PURGE STREAM MEMORY')}
                    onMouseLeave={() => setIsHovered(false)}
                  >
                    PURGE
                  </button>
                )}
              </div>

              <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-1">
                {transmissions.length === 0 ? (
                  <div className="text-center py-20 text-slate-600 font-mono text-xs space-y-2">
                    <p>No external communication signatures routed yet.</p>
                    <p className="text-[10px] opacity-70">Use the dispatch module on the left to test input frames.</p>
                  </div>
                ) : (
                  transmissions.map((t, idx) => (
                    <div key={idx} className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-2 font-mono text-xs">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-cyber font-bold">[{t.id}] ID: {t.name.toUpperCase()}</span>
                        <span className="text-slate-500">{t.timestamp}</span>
                      </div>
                      <p className="text-slate-400">EMAIL: <span className="text-slate-300 font-semibold">{t.email}</span></p>
                      <p className="text-slate-200 leading-relaxed bg-black/45 p-2 rounded border border-white/5 font-sans mt-2">{t.msg}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-3 font-mono text-xs text-slate-400 mt-4 h-16">
              <Shield size={16} className="text-cyber-pink shrink-0 animate-pulse" />
              <div className="leading-relaxed text-[11px]">
                <strong className="text-cyber-pink uppercase font-semibold">Security frame active:</strong> All coordinates sanitized and locally archived. No third-party relays used.
              </div>
            </div>

          </div>

        </section>

      </main>

      {/* REFINED CYBER FOOTER PARADIGM */}
      <footer className="border-t border-white/10 bg-black/80 py-12 px-6 font-mono text-xs text-slate-500 relative z-30">
        <div className="mx-auto max-w-7xl grid gap-8 sm:grid-cols-2 md:grid-cols-3 items-center justify-between">
          <div className="space-y-2">
            <span className="font-display text-sm font-bold text-white tracking-widest">AKSHAN . CO</span>
            <p className="leading-relaxed text-[11px]">
              Cyberpunk Minimalist Studio Frame. Crafted with authentic procedural Web Audio algorithms.
            </p>
          </div>

          <div className="space-y-2 text-left sm:text-center md:text-left">
            <p className="text-slate-400 uppercase tracking-widest text-[10px] font-semibold">Digital Contacts</p>
            <p className="text-[11.5px]">Email: <a href="mailto:dis227783@gmail.com" className="text-cyber hover:underline" onMouseEnter={() => handleInteractiveHover('LAUNCH EMAIL')} onMouseLeave={() => setIsHovered(false)}>dis227783@gmail.com</a></p>
          </div>

          <div className="text-left sm:text-right space-y-1 text-[11px]">
            <p className="text-slate-400">© 2026 Akshan. All permissions decrypted.</p>
            <p>DESIGN INTENT PARADIGM: STABLE_CLEAN_NEON</p>
          </div>
        </div>
      </footer>

    </div>
  );
}
