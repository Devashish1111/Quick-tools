import { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw, Settings, Bell, BellOff, Coffee, Zap, BookOpen } from 'lucide-react';

type Phase = 'work' | 'short' | 'long';

const PHASES: Record<Phase, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  work:  { label: 'Focus Time',    color: 'var(--qt-accent)',   bg: 'rgba(200,255,0,0.1)',   icon: Zap },
  short: { label: 'Short Break',   color: 'var(--qt-success)',  bg: 'rgba(34,211,165,0.1)',  icon: Coffee },
  long:  { label: 'Long Break',    color: 'var(--qt-info)',     bg: 'rgba(96,165,250,0.1)',  icon: BookOpen },
};

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export default function PomodoroTimer() {
  const [workMins,  setWorkMins]  = useState(25);
  const [shortMins, setShortMins] = useState(5);
  const [longMins,  setLongMins]  = useState(15);
  const [longAfter, setLongAfter] = useState(4);

  const [phase,        setPhase]       = useState<Phase>('work');
  const [timeLeft,     setTimeLeft]    = useState(workMins * 60);
  const [running,      setRunning]     = useState(false);
  const [cycles,       setCycles]      = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [soundOn,      setSoundOn]     = useState(true);
  const [totalFocus,   setTotalFocus]  = useState(0);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const phaseConfig = PHASES[phase];
  const PIcon = phaseConfig.icon;
  const totalSeconds = phase === 'work' ? workMins * 60 : phase === 'short' ? shortMins * 60 : longMins * 60;
  const progress = ((totalSeconds - timeLeft) / totalSeconds) * 100;

  const playBeep = useCallback(() => {
    if (!soundOn) return;
    try {
      const ctx = new AudioContext();
      audioCtxRef.current = ctx;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 880;
      osc.type = 'sine';
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
      osc.start();
      osc.stop(ctx.currentTime + 0.8);
    } catch {}
  }, [soundOn]);

  const nextPhase = useCallback(() => {
    playBeep();
    if (phase === 'work') {
      const newCycles = cycles + 1;
      setCycles(newCycles);
      setTotalFocus(f => f + workMins);
      if (newCycles % longAfter === 0) {
        setPhase('long');
        setTimeLeft(longMins * 60);
      } else {
        setPhase('short');
        setTimeLeft(shortMins * 60);
      }
    } else {
      setPhase('work');
      setTimeLeft(workMins * 60);
    }
    setRunning(false);
  }, [phase, cycles, longAfter, workMins, shortMins, longMins, playBeep]);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) { nextPhase(); return 0; }
          return t - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running, nextPhase]);

  // Update document title
  useEffect(() => {
    document.title = running ? `${formatTime(timeLeft)} — ${phaseConfig.label}` : 'Pomodoro Timer';
    return () => { document.title = 'QuickToolbox'; };
  }, [timeLeft, running, phaseConfig.label]);

  const reset = () => {
    setRunning(false);
    setPhase('work');
    setTimeLeft(workMins * 60);
    setCycles(0);
  };

  const switchPhase = (p: Phase) => {
    setRunning(false);
    setPhase(p);
    setTimeLeft(p === 'work' ? workMins * 60 : p === 'short' ? shortMins * 60 : longMins * 60);
  };

  // SVG circle progress
  const R = 80;
  const CIRC = 2 * Math.PI * R;
  const dashOffset = CIRC * (1 - progress / 100);

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      {/* Phase tabs */}
      <div className="qt-card p-2">
        <div className="grid grid-cols-3 gap-2">
          {(Object.keys(PHASES) as Phase[]).map(p => {
            const pc = PHASES[p];
            const PcIcon = pc.icon;
            return (
              <button
                key={p}
                onClick={() => switchPhase(p)}
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200"
                style={
                  phase === p
                    ? { background: pc.bg, color: pc.color, border: `1px solid ${pc.color}40` }
                    : { color: 'var(--qt-text-tertiary)', border: '1px solid transparent' }
                }
              >
                <PcIcon className="w-3.5 h-3.5" />
                {pc.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Timer circle */}
      <div
        className="qt-card flex flex-col items-center py-10"
        style={{
          background: `linear-gradient(135deg, ${phaseConfig.bg} 0%, rgba(0,0,0,0) 60%)`,
          border: `1px solid ${phaseConfig.color}25`,
        }}
      >
        <div className="relative w-52 h-52 mb-8">
          {/* Background circle */}
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 200 200">
            <circle cx="100" cy="100" r={R} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
            <circle
              cx="100" cy="100" r={R} fill="none"
              stroke={phaseConfig.color}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={CIRC}
              strokeDashoffset={dashOffset}
              style={{ transition: 'stroke-dashoffset 1s linear', filter: `drop-shadow(0 0 8px ${phaseConfig.color}60)` }}
            />
          </svg>

          {/* Time display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span
              className="text-5xl font-black font-display tabular-nums"
              style={{ color: phaseConfig.color, letterSpacing: '-0.03em' }}
            >
              {formatTime(timeLeft)}
            </span>
            <div className="flex items-center gap-1.5 mt-1">
              <PIcon className="w-3.5 h-3.5" style={{ color: phaseConfig.color, opacity: 0.7 }} />
              <span className="text-xs font-medium" style={{ color: 'var(--qt-text-secondary)' }}>{phaseConfig.label}</span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4">
          <button
            onClick={reset}
            className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200"
            style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--qt-text-secondary)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={() => setRunning(!running)}
            className="w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-200 shadow-lg"
            style={{
              background: phaseConfig.color,
              color: '#000',
              boxShadow: running ? `0 6px 30px ${phaseConfig.color}50` : `0 4px 20px ${phaseConfig.color}30`,
              transform: running ? 'scale(1.05)' : 'scale(1)',
            }}
          >
            {running ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 ml-0.5" />}
          </button>

          <button
            onClick={() => setSoundOn(!soundOn)}
            className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200"
            style={{ background: 'rgba(255,255,255,0.06)', color: soundOn ? 'var(--qt-accent)' : 'var(--qt-text-muted)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            {soundOn ? <Bell className="w-5 h-5" /> : <BellOff className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="qt-stat">
          <div className="qt-stat-value">{cycles}</div>
          <div className="qt-stat-label">Pomodoros Completed</div>
        </div>
        <div className="qt-stat">
          <div className="qt-stat-value">{totalFocus}m</div>
          <div className="qt-stat-label">Total Focus Time</div>
        </div>
      </div>

      {/* Settings */}
      <div className="qt-card space-y-4">
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="flex items-center justify-between w-full"
        >
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4" style={{ color: 'var(--qt-accent)' }} />
            <span className="text-sm font-semibold" style={{ color: 'var(--qt-text)' }}>Timer Settings</span>
          </div>
          <span className="text-xs" style={{ color: 'var(--qt-text-tertiary)' }}>{showSettings ? 'Hide' : 'Show'}</span>
        </button>

        {showSettings && (
          <div className="space-y-4 pt-2 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
            {[
              { label: 'Focus Duration (min)', value: workMins,  set: setWorkMins,  min: 1, max: 90 },
              { label: 'Short Break (min)',    value: shortMins, set: setShortMins, min: 1, max: 30 },
              { label: 'Long Break (min)',     value: longMins,  set: setLongMins,  min: 1, max: 60 },
              { label: 'Long Break After',     value: longAfter, set: setLongAfter, min: 1, max: 10 },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-4">
                <label className="text-xs w-36 flex-shrink-0" style={{ color: 'var(--qt-text-secondary)' }}>{item.label}</label>
                <input
                  type="range"
                  min={item.min}
                  max={item.max}
                  value={item.value}
                  onChange={e => { item.set(Number(e.target.value)); if (!running) reset(); }}
                  className="qt-range flex-1"
                />
                <span className="text-sm font-bold w-6 text-right font-display" style={{ color: 'var(--qt-accent)' }}>{item.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
