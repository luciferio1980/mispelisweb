(function () {
  'use strict';

  const GAME_LEVEL = window.NAVY_LEVEL || 3;
  const MAIN_MENU_FILE = 'navy_project.html';

  const NEXT_LEVEL_FILE = window.NEXT_LEVEL_FILE === undefined
    ? `navy_project_level${GAME_LEVEL + 1}.html`
    : window.NEXT_LEVEL_FILE;

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700;900&display=swap');

    :root {
      --cyan: #0ff;
      --magenta: #f0f;
      --yellow: #ff0;
      --green: #0f8;
      --red: #f33;
      --purple: #b26bff;
    }

    * { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; }

    html, body {
      position: fixed; inset: 0; width: 100%; height: 100%; overflow: hidden;
      background: #070213; font-family: 'Orbitron', 'Courier New', monospace;
      touch-action: none; user-select: none; overscroll-behavior: none;
    }

    #game { position: absolute; inset: 0; width: 100%; height: 100%; display: block; z-index: 0; }
    .hidden { display: none !important; }

    #hud {
      position: fixed; top: 0; left: 0; right: 0; display: flex; justify-content: space-between;
      align-items: center; gap: 8px;
      padding: calc(6px + env(safe-area-inset-top)) calc(10px + env(safe-area-inset-right)) 6px calc(10px + env(safe-area-inset-left));
      z-index: 10; color: #fff; font-size: clamp(10px, 1.7vh, 14px); letter-spacing: 1px;
      text-shadow: 0 0 8px var(--cyan); pointer-events: none;
    }

    .hud-box {
      padding: 5px 9px; border: 1px solid rgba(0,255,255,.35); border-radius: 10px;
      background: rgba(0,0,0,.28); box-shadow: 0 0 14px rgba(0,255,255,.12);
      backdrop-filter: blur(4px); white-space: nowrap;
    }

    #livesVal { color: #ff5577; text-shadow: 0 0 10px #f0f; }

    .hud-btn, #pauseBtn {
      pointer-events: auto; min-width: clamp(34px, 5vh, 42px); height: clamp(34px, 5vh, 42px);
      padding: 0 8px; border-radius: 10px; font-size: clamp(13px, 2.2vh, 18px);
    }

    #pauseBtn { border: 1px solid var(--cyan); background: rgba(0,255,255,.08); color: var(--cyan); box-shadow: 0 0 14px rgba(0,255,255,.25); }
    .hud-btn { border: 1px solid var(--magenta); background: rgba(255,0,255,.08); color: var(--magenta); box-shadow: 0 0 14px rgba(255,0,255,.25); }
    .hud-btn.off { color: #999; border-color: #555; box-shadow: none; }

    #powerHud {
      position: fixed; top: calc(44px + env(safe-area-inset-top)); left: calc(8px + env(safe-area-inset-left));
      z-index: 10; display: flex; flex-wrap: wrap; gap: 6px; max-width: 72vw; pointer-events: none;
    }

    .power-tag {
      padding: 4px 8px; border: 1px solid; border-radius: 8px; font-size: clamp(9px, 1.5vh, 11px);
      background: rgba(0,0,0,.35); backdrop-filter: blur(4px); text-shadow: 0 0 8px currentColor;
    }

    #controls {
      position: fixed; bottom: 0; left: 0; right: 0; display: flex; justify-content: space-between;
      align-items: flex-end;
      padding: calc(10px + env(safe-area-inset-bottom)) calc(14px + env(safe-area-inset-right)) calc(10px + env(safe-area-inset-bottom)) calc(14px + env(safe-area-inset-left));
      z-index: 10; pointer-events: none;
    }

    .pad, .action {
      pointer-events: auto; display: flex; align-items: center; gap: clamp(8px, 1.6vh, 14px);
      padding: clamp(8px, 1.5vh, 12px); border-radius: 26px; background: rgba(10,0,25,.34);
      border: 1px solid rgba(180,120,255,.24); backdrop-filter: blur(7px);
    }

    .ctrl-btn {
      width: clamp(52px, 10.5vh, 76px); height: clamp(52px, 10.5vh, 76px); border-radius: 50%;
      border: 2px solid rgba(180,120,255,.7); background: rgba(180,120,255,.08); color: #d7b8ff;
      font-size: clamp(20px, 4.3vh, 30px); font-weight: 900; touch-action: none;
    }

    #fireBtn {
      width: clamp(70px, 14vh, 102px); height: clamp(70px, 14vh, 102px);
      border-color: rgba(255,140,0,.8); color: #ffb066; background: rgba(255,140,0,.08);
      font-size: clamp(26px, 5.6vh, 38px);
    }

    .ctrl-btn:active { transform: scale(.94); }

    .overlay {
      position: fixed; inset: 0; display: flex; flex-direction: column; align-items: center;
      justify-content: center; text-align: center; padding: 18px;
      background:
        radial-gradient(circle at 50% 18%, rgba(180,80,255,.18), transparent 35%),
        radial-gradient(circle at 50% 82%, rgba(255,120,0,.12), transparent 30%),
        rgba(4,2,12,.90);
      z-index: 20; color: #fff; overflow-y: auto;
    }

    .overlay h1, .overlay h2 {
      font-size: clamp(24px, 6vh, 60px); letter-spacing: 4px; color: #d7b8ff;
      text-shadow: 0 0 8px #b26bff, 0 0 24px #ff7a00; margin-bottom: 12px;
    }

    .overlay p { max-width: 760px; line-height: 1.55; color: #efe6ff; margin-bottom: 8px; font-size: clamp(12px, 2.1vh, 15px); }

    .menu-row { display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; margin: 10px 0; }

    .toggle {
      padding: 10px 14px; border: 2px solid rgba(180,120,255,.55); background: rgba(180,120,255,.05);
      color: #d7b8ff; border-radius: 12px; font-weight: 700; font-size: clamp(11px, 1.9vh, 14px);
    }

    .toggle.active { background: rgba(180,120,255,.18); box-shadow: 0 0 18px rgba(180,120,255,.4); }

    .btn {
      margin-top: 14px; padding: 14px 28px; font-size: clamp(16px, 3.2vh, 22px); font-weight: 900;
      color: #d7b8ff; background: rgba(180,120,255,.06); border: 2px solid #b26bff; border-radius: 16px;
      text-shadow: 0 0 10px #b26bff;
    }

    .btn[disabled] { opacity: .35; pointer-events: none; }

    #countdownScore {
      font-size: clamp(38px, 10vh, 76px); color: #ff0;
      text-shadow: 0 0 18px #ff0, 0 0 42px #f80; margin: 14px 0; font-weight: 900;
    }

    #gameOverOverlay { backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); background: rgba(0,0,0,.58); }

    #gameOverOverlay h2 {
      font-size: clamp(48px, 15vh, 120px); color: #f33; letter-spacing: 6px;
      text-shadow: 0 0 18px #f33, 0 0 48px #f0f, 0 0 90px #f00;
    }

    #gameOverOverlay p { font-size: clamp(14px, 2.6vh, 20px); }
  `;

  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  const html = `
    <canvas id="game"></canvas>

    <div id="hud">
      <div class="hud-box">SCORE <span id="scoreVal">0</span></div>
      <div class="hud-box">NIVEL <span id="levelVal">3</span></div>
      <div class="hud-box">PROGRESO <span id="progressVal">0/0</span></div>
      <div class="hud-box" id="livesVal">♥♥♥</div>
      <button id="hudMusicBtn" class="hud-btn">♪</button>
      <button id="pauseBtn">⏸</button>
    </div>

    <div id="powerHud"></div>

    <div id="controls" class="hidden">
      <div class="pad">
        <button id="leftBtn" class="ctrl-btn">◀</button>
        <button id="rightBtn" class="ctrl-btn">▶</button>
      </div>
      <div class="action">
        <button id="fireBtn" class="ctrl-btn">⚡</button>
      </div>
    </div>

    <div id="menu" class="overlay">
      <h1>⚡ NAVY PROJECT III ⚡</h1>
      <p>
        <b>PANTALLA 3 — VÓRTICE NEÓN</b><br />
        Arrastra sobre la pantalla para mover la nave.<br />
        Usa <b>◀ ▶</b> y <b>⚡</b> para disparar.<br />
        Badenes energéticos, vórtice en espiral y jefe final.<br />
        La dificultad se cambia en el menú principal.
      </p>

      <div class="menu-row">
        <button id="autofireBtn" class="toggle">AUTOFIRE: OFF</button>
        <button id="musicBtn" class="toggle">MÚSICA: ON</button>
      </div>

      <button id="playBtn" class="btn">INICIAR NIVEL 3</button>
    </div>

    <div id="pauseOverlay" class="overlay hidden">
      <h2>PAUSA</h2>
      <button id="resumeBtn" class="btn">CONTINUAR</button>
      <button id="restartBtn" class="btn">REINICIAR</button>
    </div>

    <div id="gameOverOverlay" class="overlay hidden">
      <h2 id="gameOverTitle">GAME OVER</h2>
      <p id="finalScore"></p>
      <button id="retryBtn" class="btn">VOLVER AL MENÚ PRINCIPAL</button>
    </div>

    <div id="victoryOverlay" class="overlay hidden">
      <h2>¡PANTALLA 3 SUPERADA!</h2>
      <p>PUNTUACIÓN</p>
      <div id="countdownScore">0</div>
      <button id="nextLevelBtn" class="btn" disabled>CARGANDO...</button>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', html);

  const $ = id => document.getElementById(id);

  function rand(a, b) { return a + Math.random() * (b - a); }
  function randInt(a, b) { return Math.floor(rand(a, b + 1)); }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function randHue(range) { return rand(range[0], range[1]) % 360; }

  function loadPref(key, def) {
    try { const v = localStorage.getItem(key); return v === null ? def : v; }
    catch (e) { return def; }
  }

  function savePref(key, value) {
    try { localStorage.setItem(key, String(value)); } catch (e) {}
  }

  const DIFFICULTIES = {
    easy: {
      lives: 6, speed: 0.82, spawn: 1.25, power: 0.32, duration: 1.5,
      fireDelay: 0.18, rapidDelay: 0.08, enemyShootMul: 1.50, enemyShotSpeed: 0.78,
      shotHit: 0.12, maxPlayerBullets: 18, maxEnemyBullets: 16, maxParticles: 140,
      toSpawn: lvl => 18 + lvl * 3
    },
    normal: {
      lives: 5, speed: 1.08, spawn: 0.90, power: 0.22, duration: 1.0,
      fireDelay: 0.22, rapidDelay: 0.10, enemyShootMul: 1.0, enemyShotSpeed: 1.0,
      shotHit: 0.15, maxPlayerBullets: 24, maxEnemyBullets: 22, maxParticles: 180,
      toSpawn: lvl => 22 + lvl * 4
    },
    hard: {
      lives: 3, speed: 1.38, spawn: 0.68, power: 0.16, duration: 0.8,
      fireDelay: 0.26, rapidDelay: 0.12, enemyShootMul: 0.75, enemyShotSpeed: 1.25,
      shotHit: 0.18, maxPlayerBullets: 30, maxEnemyBullets: 28, maxParticles: 220,
      toSpawn: lvl => 26 + lvl * 5
    }
  };

  let difficulty = loadPref('navyDifficulty', 'normal');
  if (!DIFFICULTIES[difficulty]) difficulty = 'normal';

  let autofire = loadPref('navyAutofire', 'off') === 'on';
  let musicEnabled = loadPref('navyMusic', 'on') === 'on';

  const scoreVal = $('scoreVal');
  const levelVal = $('levelVal');
  const progressVal = $('progressVal');
  const livesVal = $('livesVal');
  const pauseBtn = $('pauseBtn');
  const controls = $('controls');
  const menu = $('menu');
  const pauseOverlay = $('pauseOverlay');
  const gameOverOverlay = $('gameOverOverlay');
  const victoryOverlay = $('victoryOverlay');
  const finalScore = $('finalScore');
  const powerHud = $('powerHud');
  const autofireBtn = $('autofireBtn');
  const musicBtn = $('musicBtn');
  const hudMusicBtn = $('hudMusicBtn');
  const playBtn = $('playBtn');
  const retryBtn = $('retryBtn');
  const resumeBtn = $('resumeBtn');
  const restartBtn = $('restartBtn');
  const nextLevelBtn = $('nextLevelBtn');
  const countdownScore = $('countdownScore');
  const gameOverTitle = $('gameOverTitle');

  const cvs = $('game');
  const ctx = cvs.getContext('2d');

  let W = 0, H = 0, horizon = 0, roadHalf = 0, sizeScale = 1, SHIP_Z = 140;
  let stars = [], buildingsFar = [], buildingsNear = [], rain = [], speedLines = [];

  const CAM = 300;
  const Z_FAR = 1500;
  const BPM = 132;

  function resize() {
    const vv = window.visualViewport;
    W = Math.round(vv ? vv.width : window.innerWidth);
    H = Math.round(vv ? vv.height : window.innerHeight);

    const dpr = Math.min(2, window.devicePixelRatio || 1);
    cvs.style.width = W + 'px';
    cvs.style.height = H + 'px';
    cvs.width = Math.round(W * dpr);
    cvs.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    horizon = H * (W > H ? 0.28 : 0.32);
    roadHalf = Math.min(W * 0.38, H * 0.85);
    sizeScale = clamp(Math.min(W, H) / 420, 0.70, 1.50);
    SHIP_Z = 140;

    stars = Array.from({ length: 100 }, () => ({ x: Math.random(), y: Math.random(), r: Math.random() * 1.8 + 0.2, tw: Math.random() * Math.PI * 2 }));
    buildingsFar = Array.from({ length: 46 }, () => ({ x: Math.random() * 2 - 0.5, w: rand(0.010, 0.030), h: rand(0.03, 0.12), hue: rand(250, 305), win: randInt(3, 8) }));
    buildingsNear = Array.from({ length: 30 }, () => ({ x: Math.random() * 2 - 0.5, w: rand(0.020, 0.050), h: rand(0.06, 0.20), hue: rand(180, 235), win: randInt(4, 10) }));
    rain = Array.from({ length: 90 }, () => ({ x: Math.random() * 2 - 0.5, y: Math.random(), sp: rand(0.25, 0.9), len: rand(0.02, 0.08) }));
    speedLines = Array.from({ length: 36 }, () => ({ x: Math.random() * 2 - 0.5, y: Math.random(), len: rand(0.05, 0.18), sp: rand(0.8, 1.8) }));
  }

  window.addEventListener('resize', resize);
  window.addEventListener('orientationchange', resize);
  if (window.visualViewport) window.visualViewport.addEventListener('resize', resize);

  const POWER_TYPES = {
    SHIELD: { color: '#0ff', label: '🛡', name: 'ESCUDO' },
    RAPID: { color: '#f0f', label: '⚡', name: 'OVERDRIVE' },
    TRIPLE: { color: '#ff0', label: '▲', name: 'TRI-SHOT' },
    REPAIR: { color: '#0f8', label: '♥', name: 'NANO-REPAIR' },
    EMP: { color: '#f33', label: '✸', name: 'EMP' },
    MULTI: { color: '#b26bff', label: '×2', name: 'SCORE x2' }
  };

  const ENEMY_TYPES = {
    bit: { hp: 1, size: [22, 34], speed: [360, 440], shoot: [999, 999], score: 15, hue: [260, 290], amp: [0.10, 0.30], freq: [1.2, 2.2] },
    wasp: { hp: 2, size: [30, 46], speed: [300, 380], shoot: [1.4, 2.4], score: 25, hue: [25, 55], amp: [0.08, 0.20], freq: [0.8, 1.6], aim: 0.70 },
    orbiter: { hp: 3, size: [38, 58], speed: [230, 300], shoot: [1.6, 2.6], score: 35, hue: [190, 230], amp: [0.05, 0.15], freq: [0.6, 1.2], aim: 0.50 },
    angler: { hp: 4, size: [52, 78], speed: [160, 220], shoot: [1.8, 2.8], score: 50, hue: [300, 330], amp: [0.03, 0.10], freq: [0.4, 0.8], aim: 0.60 },
    reaper: { hp: 2, size: [34, 52], speed: [340, 420], shoot: [2.0, 3.2], score: 30, hue: [0, 25], amp: [0.20, 0.40], freq: [1.4, 2.4], aim: 0.65 },
    boss: { hp: 1, size: [160, 190], speed: [70, 90], shoot: [1.0, 1.5], score: 2000, hue: [275, 315], amp: [0.35, 0.35], freq: [0.4, 0.4], aim: 0.82 }
  };

  const state = {
    mode: 'menu', score: 0, high: Number(loadPref('navyHigh', 0)),
    lives: 5, maxLives: 7, time: 0, last: 0, shake: 0, flash: 0,
    quota: 24, killed: 0, spawned: 0, spawnTimer: 1,
    phase: 'combat', spiralTriggered: false, spiralT: 0, spiralDuration: 12, cameraRoll: 0,
    jumpAlt: 0, jumpVel: 0, bounceCount: 0, jumpInvuln: 0, bumpTimer: 8,
    bossActive: false, victoryPending: false, hackEnergy: 0
  };

  const ship = { worldX: 0, targetWorldX: 0, prevWorldX: 0, bank: 0, lastFire: -999, invuln: 1, muzzle: 0 };

  let bullets = [], aliens = [], enemyBullets = [], powerups = [], particles = [], texts = [], lightnings = [], bumps = [];
  let moveDir = 0, firing = false, dragging = false;
  let countdownInterval = null, redirectTimeout = null;

  const effects = { rapid: 0, triple: 0, multi: 0, shield: 0, hack: 0 };

  function currentCfg() { return DIFFICULTIES[difficulty]; }

  function updateHUD() {
    scoreVal.textContent = state.score;
    levelVal.textContent = GAME_LEVEL;
    if (state.phase === 'boss') progressVal.textContent = 'JEFE';
    else if (state.phase === 'spiral') progressVal.textContent = 'ESPIRAL';
    else progressVal.textContent = `${state.killed}/${state.quota}`;

    const lives = Math.max(0, state.lives);
    const empty = Math.max(0, state.maxLives - lives);
    livesVal.textContent = '♥'.repeat(lives) + '♡'.repeat(empty);
  }

  function project(z, worldX = 0) {
    const p = CAM / (CAM + Math.max(0, z));
    return { x: W / 2 + worldX * roadHalf * p, y: horizon + (H - horizon) * p, s: p };
  }

  function getShipRender() {
    const pr = project(SHIP_Z, ship.worldX);
    const sc = pr.s * sizeScale * 1.35;
    return { x: pr.x, y: pr.y - 22 * sc, baseY: pr.y, sc, p: pr.s };
  }

  function projectBulletAtZ(b, z) {
    const p = CAM / (CAM + Math.max(0, z));
    const x = W / 2 + b.worldX * roadHalf * p;
    const y = horizon + (b.originY - horizon) * (p / b.pShip);
    return { x, y, s: p };
  }

  function saveHighIfNecessary() {
    if (state.score > state.high) { state.high = state.score; savePref('navyHigh', state.high); }
  }

  const Synth = {
    ctx: null, musicGain: null, sfxGain: null, musicTimer: null, nextTime: 0, step: 0,
    ready() { return !!(this.ctx && this.musicGain && this.sfxGain); },
    init() {
      if (this.ctx) return;
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      try {
        this.ctx = new AC();
        const master = this.ctx.createGain(); master.gain.value = 0.94;
        const comp = this.ctx.createDynamicsCompressor();
        const t = this.ctx.currentTime;
        comp.threshold.setValueAtTime(-20, t); comp.knee.setValueAtTime(24, t);
        comp.ratio.setValueAtTime(5, t); comp.attack.setValueAtTime(0.003, t); comp.release.setValueAtTime(0.25, t);
        master.connect(comp); comp.connect(this.ctx.destination);
        this.musicGain = this.ctx.createGain(); this.musicGain.gain.value = 0.48; this.musicGain.connect(master);
        this.sfxGain = this.ctx.createGain(); this.sfxGain.gain.value = 0.50; this.sfxGain.connect(master);
      } catch (e) { this.ctx = null; this.musicGain = null; this.sfxGain = null; }
    },
    resume() { if (this.ctx && this.ctx.state !== 'running') this.ctx.resume().catch(() => {}); },
    suspend() { if (this.ctx && this.ctx.state === 'running') this.ctx.suspend().catch(() => {}); },
    startMusic(force = false) {
      if (!musicEnabled || !this.ready()) return;
      if (this.musicTimer && !force) return;
      this.stopMusic();
      this.step = 0; this.nextTime = this.ctx.currentTime + 0.06;
      this.musicTimer = setInterval(() => this.schedule(), 25);
    },
    stopMusic() { if (this.musicTimer) { clearInterval(this.musicTimer); this.musicTimer = null; } },
    schedule() {
      if (!this.ready()) return;
      const spb = 60 / BPM / 4;
      while (this.nextTime < this.ctx.currentTime + 0.12) { this.playStep(this.step, this.nextTime); this.nextTime += spb; this.step++; }
    },
    tone(type, freq, time, dur, vol, dest, filterFreq, glideTo) {
      if (!this.ready()) return;
      const o = this.ctx.createOscillator(); const g = this.ctx.createGain();
      o.type = type; o.frequency.setValueAtTime(freq, time);
      if (glideTo) o.frequency.exponentialRampToValueAtTime(glideTo, time + dur);
      g.gain.setValueAtTime(0.0001, time); g.gain.linearRampToValueAtTime(vol, time + 0.008); g.gain.exponentialRampToValueAtTime(0.0001, time + dur);
      o.connect(g);
      if (filterFreq) { const f = this.ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.setValueAtTime(filterFreq, time); g.connect(f); f.connect(dest); }
      else g.connect(dest);
      o.start(time); o.stop(time + dur + 0.05);
    },
    noise(time, dur, vol, filterStart, filterEnd, dest) {
      if (!this.ready()) return;
      const len = Math.max(1, Math.floor(this.ctx.sampleRate * dur));
      const buffer = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
      const src = this.ctx.createBufferSource(); src.buffer = buffer;
      const g = this.ctx.createGain(); g.gain.setValueAtTime(vol, time); g.gain.exponentialRampToValueAtTime(0.0001, time + dur);
      const f = this.ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.setValueAtTime(filterStart, time); f.frequency.exponentialRampToValueAtTime(Math.max(20, filterEnd), time + dur);
      src.connect(f); f.connect(g); g.connect(dest);
      src.start(time); src.stop(time + dur + 0.05);
    },
    kick(time) {
      if (!this.ready()) return;
      const o = this.ctx.createOscillator(); const g = this.ctx.createGain();
      o.type = 'sine'; o.frequency.setValueAtTime(175, time); o.frequency.exponentialRampToValueAtTime(42, time + 0.10);
      g.gain.setValueAtTime(0.48, time); g.gain.exponentialRampToValueAtTime(0.0001, time + 0.14);
      o.connect(g); g.connect(this.musicGain); o.start(time); o.stop(time + 0.18);
    },
    playStep(step, time) {
      const bar = Math.floor(step / 16) % 4; const s = step % 16;
      const chords = [
        { bass: 73.42, arp: [146.83, 174.61, 220.00, 293.66], pad: [73.42, 110.00, 146.83, 220.00] },
        { bass: 58.27, arp: [116.54, 146.83, 174.61, 233.08], pad: [58.27, 87.31, 116.54, 174.61] },
        { bass: 87.31, arp: [130.81, 174.61, 220.00, 261.63], pad: [87.31, 130.81, 174.61, 220.00] },
        { bass: 65.41, arp: [130.81, 164.81, 196.00, 261.63], pad: [65.41, 98.00, 130.81, 196.00] }
      ];
      const c = chords[bar];
      if (s % 4 === 0) this.kick(time);
      if (s === 4 || s === 12) this.noise(time, 0.12, 0.16, 1800, 300, this.musicGain);
      if (s % 2 === 0) this.noise(time, 0.03, 0.03, 9000, 5000, this.musicGain);
      if (s % 4 === 2) this.noise(time, 0.06, 0.05, 12000, 6000, this.musicGain);
      if (s % 4 === 0) { this.tone('sawtooth', c.bass, time, 0.18, 0.26, this.musicGain, 520); this.tone('sine', c.bass / 2, time, 0.20, 0.18, this.musicGain, 220); }
      if (s % 2 === 1) this.tone('square', c.bass * 2, time, 0.08, 0.10, this.musicGain, 1300);
      const note = c.arp[s % c.arp.length]; this.tone('square', note, time, 0.07, 0.055, this.musicGain, 2700);
      if (s === 0) c.pad.forEach(f => this.tone('sawtooth', f, time, 1.35, 0.028, this.musicGain, 880));
    },
    shoot() { if (!this.ready()) return; this.tone('square', 980, this.ctx.currentTime, 0.07, 0.10, this.sfxGain, 3200, 200); },
    enemyShoot() { if (!this.ready()) return; const t = this.ctx.currentTime; this.tone('sawtooth', 320, t, 0.11, 0.07, this.sfxGain, 1700, 110); this.tone('square', 500, t, 0.05, 0.04, this.sfxGain, 2400, 210); },
    explosion() { if (!this.ready()) return; const t = this.ctx.currentTime; this.noise(t, 0.30, 0.24, 1400, 55, this.sfxGain); this.tone('sawtooth', 120, t, 0.26, 0.10, this.sfxGain, 550, 32); },
    power() { if (!this.ready()) return; const t = this.ctx.currentTime; [392, 523, 659, 880].forEach((f, i) => this.tone('square', f, t + i * 0.05, 0.09, 0.11, this.sfxGain, 4200)); },
    hit() { if (!this.ready()) return; const t = this.ctx.currentTime; this.tone('sawtooth', 200, t, 0.25, 0.20, this.sfxGain, 900, 40); this.noise(t, 0.18, 0.12, 1200, 100, this.sfxGain); },
    level() { if (!this.ready()) return; const t = this.ctx.currentTime; [220, 330, 440, 660].forEach((f, i) => this.tone('triangle', f, t + i * 0.08, 0.14, 0.14, this.sfxGain, 3500)); },
    gameover() { if (!this.ready()) return; const t = this.ctx.currentTime; [330, 262, 196, 131].forEach((f, i) => this.tone('sawtooth', f, t + i * 0.16, 0.32, 0.14, this.sfxGain, 1200)); },
    bossWarn() { if (!this.ready()) return; const t = this.ctx.currentTime; [110, 110, 146.83, 110].forEach((f, i) => this.tone('sawtooth', f, t + i * 0.14, 0.20, 0.14, this.sfxGain, 700)); },
    hack() { if (!this.ready()) return; const t = this.ctx.currentTime; [523, 659, 784, 1046].forEach((f, i) => this.tone('square', f, t + i * 0.045, 0.08, 0.10, this.sfxGain, 5000)); },
    jump() { if (!this.ready()) return; const t = this.ctx.currentTime; this.tone('square', 220, t, 0.16, 0.10, this.sfxGain, 2200, 760); },
    bounce() { if (!this.ready()) return; const t = this.ctx.currentTime; this.tone('triangle', 330, t, 0.10, 0.09, this.sfxGain, 1800, 180); },
    spiral() { if (!this.ready()) return; const t = this.ctx.currentTime; [196, 246.94, 293.66, 392, 493.88].forEach((f, i) => this.tone('sawtooth', f, t + i * 0.07, 0.22, 0.08, this.sfxGain, 1600)); }
  };

  function updateMusicButtons() {
    musicBtn.textContent = `MÚSICA: ${musicEnabled ? 'ON' : 'OFF'}`;
    musicBtn.classList.toggle('active', musicEnabled);
    hudMusicBtn.textContent = musicEnabled ? '♪' : '♪✕';
    hudMusicBtn.classList.toggle('off', !musicEnabled);
  }

  function updateAutofireButton() {
    autofireBtn.textContent = `AUTOFIRE: ${autofire ? 'ON' : 'OFF'}`;
    autofireBtn.classList.toggle('active', autofire);
  }

  function setMusicEnabled(value) {
    musicEnabled = value;
    savePref('navyMusic', musicEnabled ? 'on' : 'off');
    updateMusicButtons();
    if (!musicEnabled) Synth.stopMusic();
    else if (state.mode === 'playing') { try { Synth.init(); Synth.resume(); Synth.startMusic(false); } catch (e) {} }
  }

  function startGame() {
    if (countdownInterval) clearInterval(countdownInterval);
    if (redirectTimeout) clearTimeout(redirectTimeout);
    try { Synth.init(); Synth.resume(); if (musicEnabled) Synth.startMusic(true); else Synth.stopMusic(); } catch (e) {}
    resetGame();
    state.mode = 'playing';
    menu.classList.add('hidden');
    gameOverOverlay.classList.add('hidden');
    pauseOverlay.classList.add('hidden');
    victoryOverlay.classList.add('hidden');
    controls.classList.remove('hidden');
    updateHUD();
  }

  function resetGame() {
    const cfg = currentCfg();
    state.score = 0; state.lives = cfg.lives; state.maxLives = cfg.lives + 2;
    state.time = 0; state.shake = 0; state.flash = 0;
    state.quota = cfg.toSpawn(GAME_LEVEL); state.killed = 0; state.spawned = 0; state.spawnTimer = 1;
    state.phase = 'combat'; state.spiralTriggered = false; state.spiralT = 0; state.cameraRoll = 0;
    state.jumpAlt = 0; state.jumpVel = 0; state.bounceCount = 0; state.jumpInvuln = 0; state.bumpTimer = rand(8, 12);
    state.bossActive = false; state.victoryPending = false; state.hackEnergy = 0;

    bullets = []; aliens = []; enemyBullets = []; powerups = []; particles = []; texts = []; lightnings = []; bumps = [];
    effects.rapid = 0; effects.triple = 0; effects.multi = 0; effects.shield = 0; effects.hack = 0;

    ship.worldX = 0; ship.targetWorldX = 0; ship.prevWorldX = 0; ship.bank = 0;
    ship.invuln = 1.5; ship.lastFire = -999; ship.muzzle = 0;
    firing = false; moveDir = 0;
  }

  function togglePause() {
    if (state.mode === 'playing') {
      state.mode = 'paused'; pauseOverlay.classList.remove('hidden');
      try { Synth.suspend(); } catch (e) {}
    } else if (state.mode === 'paused') {
      state.mode = 'playing'; pauseOverlay.classList.add('hidden');
      try { Synth.resume(); if (musicEnabled) Synth.startMusic(false); else Synth.stopMusic(); } catch (e) {}
    }
  }

  function endGame() {
    state.mode = 'gameover';
    saveHighIfNecessary();
    try { Synth.stopMusic(); Synth.gameover(); } catch (e) {}
    controls.classList.add('hidden');
    gameOverTitle.textContent = 'GAME OVER';
    finalScore.innerHTML = `PUNTUACIÓN: ${state.score}<br>RÉCORD: ${state.high}<br><br>Volviendo al menú principal...`;
    retryBtn.textContent = 'VOLVER AL MENÚ PRINCIPAL';
    gameOverOverlay.classList.remove('hidden');
    if (redirectTimeout) clearTimeout(redirectTimeout);
    redirectTimeout = setTimeout(() => { window.location.href = MAIN_MENU_FILE; }, 3500);
  }

  function showVictory() {
    state.mode = 'victory';
    controls.classList.add('hidden');
    victoryOverlay.classList.remove('hidden');
    saveHighIfNecessary();
    if (NEXT_LEVEL_FILE) { nextLevelBtn.textContent = `INICIAR NIVEL ${GAME_LEVEL + 1}`; nextLevelBtn.disabled = true; }
    else { nextLevelBtn.textContent = 'FIN DEL JUEGO'; nextLevelBtn.disabled = true; }

    let displayScore = state.score;
    countdownScore.textContent = displayScore;
    const step = Math.max(25, Math.floor(displayScore / 80) || 25);
    if (countdownInterval) clearInterval(countdownInterval);
    countdownInterval = setInterval(() => {
      displayScore -= step;
      if (displayScore <= 0) { displayScore = 0; clearInterval(countdownInterval); if (NEXT_LEVEL_FILE) nextLevelBtn.disabled = false; }
      countdownScore.textContent = displayScore;
    }, 50);
    try { Synth.level(); } catch (e) {}
  }

  function loseLife() {
    if (state.victoryPending) return;
    if (ship.invuln > 0) return;
    if (state.jumpInvuln > 0) return;
    state.lives--; ship.invuln = 2.2; state.shake = 18; state.flash = 1;
    try { Synth.hit(); } catch (e) {}
    updateHUD();
    if (state.lives <= 0) endGame();
  }

  function chooseEnemyType() {
    const table = [
      { type: 'bit', w: 24 }, { type: 'wasp', w: 22 }, { type: 'orbiter', w: 20 },
      { type: 'angler', w: 14 }, { type: 'reaper', w: 18 }
    ];
    const total = table.reduce((acc, x) => acc + x.w, 0);
    let r = Math.random() * total;
    for (const item of table) { if (r < item.w) return item.type; r -= item.w; }
    return 'bit';
  }

  function spawnEnemy() {
    const cfg = currentCfg();
    const type = chooseEnemyType();
    const def = ENEMY_TYPES[type];
    const base = rand(def.size[0], def.size[1]) * (1 + Math.min(0.25, GAME_LEVEL * 0.02));
    const rNear = base * sizeScale;
    let hp = def.hp; if (GAME_LEVEL >= 3) hp += 1;
    const speed = rand(def.speed[0], def.speed[1]) * cfg.speed * (1 + GAME_LEVEL * 0.03);
    const shootMin = def.shoot[0] * cfg.enemyShootMul * 1.15 / (1 + GAME_LEVEL * 0.03);
    const shootMax = def.shoot[1] * cfg.enemyShootMul * 1.15 / (1 + GAME_LEVEL * 0.03);
    const worldX = rand(-0.82, 0.82);
    aliens.push({
      type, worldX, baseWorldX: worldX, z: Z_FAR, rNear, hp, maxHp: hp, speed,
      hue: randHue(def.hue), phase: rand(0, Math.PI * 2), amp: rand(def.amp[0], def.amp[1]),
      freq: rand(def.freq[0], def.freq[1]), shootTimer: rand(shootMin * 0.7, shootMax * 1.2),
      shootMin, shootMax, score: def.score, aim: clamp((def.aim || 0.5) + GAME_LEVEL * 0.02, 0, 0.9), dead: false
    });
    state.spawned++;
    updateHUD();
  }

  function spawnBoss() {
    const cfg = currentCfg();
    const def = ENEMY_TYPES.boss;
    const base = rand(def.size[0], def.size[1]);
    const hp = 110 + GAME_LEVEL * 10;
    aliens.push({
      type: 'boss', worldX: 0, baseWorldX: 0, z: Z_FAR, rNear: base * sizeScale, hp, maxHp: hp,
      speed: rand(def.speed[0], def.speed[1]) * cfg.speed, hue: randHue(def.hue), phase: rand(0, Math.PI * 2),
      amp: def.amp[0], freq: def.freq[0], shootTimer: 2.0, shootMin: def.shoot[0] * cfg.enemyShootMul,
      shootMax: def.shoot[1] * cfg.enemyShootMul, score: def.score, aim: def.aim, bossPhase: 'enter',
      bossTimer: 0, dashTargetX: 0, flash: 0, hitCooldown: 0, pattern: 0, dead: false
    });
    state.phase = 'boss'; state.bossActive = true;
    addText(W / 2, H * 0.24, 'VÓRTICE CENTINELA', '#f0f', 1.6, 34);
    addText(W / 2, H * 0.30, 'Núcleo de espiral detectado', '#ff9a3d', 1.2, 18);
    try { Synth.bossWarn(); } catch (e) {}
    updateHUD();
  }

  function spawnPower(worldX, z) {
    const keys = ['SHIELD', 'RAPID', 'TRIPLE', 'EMP', 'MULTI', 'REPAIR', 'RAPID', 'TRIPLE', 'SHIELD', 'MULTI'];
    let type = keys[randInt(0, keys.length - 1)];
    if (type === 'REPAIR' && state.lives >= state.maxLives) type = 'RAPID';
    const cfg = currentCfg();
    powerups.push({ worldX: clamp(worldX, -1, 1), z, type, speed: rand(260, 330) * cfg.speed, rot: 0, dead: false });
  }

  function addScore(amount, x, y, color) {
    const mult = (effects.multi > 0 ? 2 : 1);
    const gained = Math.round(amount * mult);
    state.score += gained;
    if (x !== undefined) addText(x, y, `+${gained}`, color || '#ff0', 0.8, 16);
    updateHUD();
  }

  function addText(x, y, text, color, life, size) {
    texts.push({ x, y, text, color, life, maxLife: life, size: size || 16, dead: false });
  }

  function addLightning(x1, y1, x2, y2, hue) {
    lightnings.push({ x1, y1, x2, y2, hue, life: 0.18, maxLife: 0.18, dead: false });
  }

  function addHack(amount) {
    if (effects.hack > 0) return;
    state.hackEnergy += amount;
    if (state.hackEnergy >= 100) {
      state.hackEnergy = 0; effects.hack = 6;
      addText(W / 2, H * 0.26, '¡HACK MODE!', '#0ff', 1.2, 30);
      try { Synth.hack(); } catch (e) {}
    }
  }

  function triggerJump() {
    if (state.jumpAlt > 0) return;
    state.jumpVel = 340; state.bounceCount = 0;
    try { Synth.jump(); } catch (e) {}
  }

  function fire() {
    if (state.phase === 'spiral') return;
    const cfg = currentCfg();
    let delay = effects.rapid > 0 ? cfg.rapidDelay : cfg.fireDelay;
    if (effects.hack > 0) delay *= 0.5;
    if (state.time - ship.lastFire < delay) return;
    ship.lastFire = state.time; ship.muzzle = 0.06;
    const sr = getShipRender();
    const altOffset = state.jumpAlt * sr.sc;
    const shipY = sr.y - altOffset;
    const shots = effects.triple > 0 ? 3 : 1;
    if (bullets.length + shots > cfg.maxPlayerBullets) bullets.splice(0, bullets.length + shots - cfg.maxPlayerBullets);
    const pushBullet = (localX, localY, vx) => {
      const worldX = ship.worldX + (localX * sr.sc) / (roadHalf * sr.p);
      const originY = shipY + localY * sr.sc;
      bullets.push({ worldX, z: SHIP_Z + 6, vx, pShip: sr.p, originY, dead: false });
    };
    if (effects.triple > 0) { pushBullet(0, -72, 0); pushBullet(-22, 6, 0); pushBullet(22, 6, 0); }
    else pushBullet(0, -72, 0);
    try { Synth.shoot(); } catch (e) {}
  }

  function fireEnemyBullet(o, targetOffset = 0, speedMul = 1) {
    const cfg = currentCfg();
    if (enemyBullets.length >= cfg.maxEnemyBullets) return;
    const speed = rand(360, 480) * cfg.enemyShotSpeed * speedMul * (1 + GAME_LEVEL * 0.02);
    const time = Math.max(0.2, o.z / speed);
    const inaccuracy = (1 - (o.aim || 0.5)) * 0.55;
    const targetX = clamp(ship.worldX + targetOffset + rand(-inaccuracy, inaccuracy), -1.1, 1.1);
    const vx = (targetX - o.worldX) / time;
    enemyBullets.push({ worldX: o.worldX, z: o.z, vx, speed, hue: o.hue, checked: false, dead: false });
    try { Synth.enemyShoot(); } catch (e) {}
  }

  function fireEnemyBulletRaw(o, vx, speedMul = 1) {
    const cfg = currentCfg();
    if (enemyBullets.length >= cfg.maxEnemyBullets) return;
    const speed = rand(360, 480) * cfg.enemyShotSpeed * speedMul * (1 + GAME_LEVEL * 0.02);
    enemyBullets.push({ worldX: o.worldX, z: o.z, vx, speed, hue: o.hue, checked: false, dead: false });
    try { Synth.enemyShoot(); } catch (e) {}
  }

  function enemyShoot(o) {
    if (o.type === 'bit') return;
    if (o.type === 'boss') {
      if (o.bossPhase === 'enter' || o.bossPhase === 'windup' || o.bossPhase === 'dash') return;
      o.pattern = (o.pattern || 0) + 1;
      if (o.pattern % 3 === 0) { for (let i = -4; i <= 4; i++) fireEnemyBulletRaw(o, i * 0.12, 0.92); }
      else if (o.pattern % 3 === 1) { for (let i = 0; i < 6; i++) fireEnemyBulletRaw(o, Math.sin(o.pattern + i) * 0.35, rand(0.85, 1.15)); }
      else { fireEnemyBullet(o, -0.08, 1.1); fireEnemyBullet(o, 0.08, 1.1); }
      return;
    }
    if (o.type === 'wasp') fireEnemyBullet(o, 0, 1.0);
    else if (o.type === 'orbiter') { for (let i = -1; i <= 1; i++) fireEnemyBullet(o, i * 0.14, 0.9); }
    else if (o.type === 'angler') fireEnemyBullet(o, 0, 0.65);
    else if (o.type === 'reaper') fireEnemyBullet(o, rand(-0.10, 0.10), 1.1);
  }

  function explode(x, y, hue, count = 16, spread = 1) {
    const cfg = currentCfg();
    if (particles.length + count > cfg.maxParticles) {
      const excess = particles.length + count - cfg.maxParticles;
      if (excess > 0) particles.splice(0, Math.min(excess, particles.length));
    }
    for (let i = 0; i < count; i++) {
      const a = rand(0, Math.PI * 2); const sp = rand(40, 240) * spread;
      particles.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: rand(0.25, 0.7), maxLife: 0.7, hue, size: rand(1.5, 4) * Math.max(0.6, spread), dead: false });
    }
  }

  function damageAlien(o, dmg, chainDepth = 0) {
    if (!o || o.dead) return;
    o.hp -= dmg;
    const pr = project(o.z, o.worldX);
    explode(pr.x, pr.y, o.hue, 4, Math.max(0.35, pr.s));
    if (o.hp <= 0) destroyAlien(o, false, chainDepth);
  }

  function destroyAlien(o, givePower = true, chainDepth = 0) {
    if (o.dead) return;
    o.dead = true;
    const cfg = currentCfg();
    const pr = project(o.z, o.worldX);
    if (o.type === 'boss') {
      state.shake = 38; state.flash = 1; state.bossActive = false; state.victoryPending = true;
      explode(pr.x, pr.y, o.hue, 150, 3.0);
      for (let i = 0; i < 8; i++) explode(pr.x + rand(-120, 120) * Math.max(0.5, pr.s), pr.y + rand(-60, 60) * Math.max(0.5, pr.s), o.hue + rand(-50, 50), 28, 2.0);
      try { Synth.explosion(); Synth.level(); } catch (e) {}
      addScore(o.score, pr.x, pr.y, '#f0f');
      addText(W / 2, H * 0.30, 'VÓRTICE CENTINELA DESTRUIDO', '#0ff', 1.6, 26);
      addText(W / 2, H * 0.36, 'PANTALLA 3 LIBERADA', '#d7b8ff', 1.4, 24);
      spawnPower(clamp(o.worldX - 0.12, -1, 1), o.z);
      spawnPower(clamp(o.worldX + 0.12, -1, 1), o.z);
      setTimeout(() => { showVictory(); }, 1600);
    } else {
      explode(pr.x, pr.y, o.hue, 16, Math.max(0.5, pr.s));
      try { Synth.explosion(); } catch (e) {}
      addScore(o.score, pr.x, pr.y, `hsl(${o.hue},100%,70%)`);
      state.killed++;
      addHack(o.type === 'angler' ? 10 : o.type === 'orbiter' ? 8 : 5);
      if (givePower) { const chance = cfg.power * (o.type === 'angler' ? 1.5 : 1); if (Math.random() < chance) spawnPower(o.worldX, o.z); }
      if (chainDepth < 2) {
        const chainChance = effects.hack > 0 ? 0.45 : 0.18;
        if (Math.random() < chainChance) {
          let target = null;
          for (const a of aliens) {
            if (a.dead || a === o || a.type === 'boss') continue;
            if (Math.abs(a.z - o.z) < 180 && Math.abs(a.worldX - o.worldX) < 0.45) { target = a; break; }
          }
          if (target) { const tp = project(target.z, target.worldX); addLightning(pr.x, pr.y, tp.x, tp.y, o.hue); damageAlien(target, 1, chainDepth + 1); }
        }
      }
      updateHUD();
    }
  }

  function applyPower(pu) {
    const def = POWER_TYPES[pu.type];
    const cfg = currentCfg();
    try { Synth.power(); } catch (e) {}
    const pr = project(Math.max(0, pu.z), pu.worldX);
    addText(pr.x, pr.y, def.name, def.color, 1, 18);
    switch (pu.type) {
      case 'SHIELD': effects.shield = 8 * cfg.duration; break;
      case 'RAPID': effects.rapid = 8 * cfg.duration; break;
      case 'TRIPLE': effects.triple = 8 * cfg.duration; break;
      case 'MULTI': effects.multi = 10 * cfg.duration; break;
      case 'REPAIR': state.lives = Math.min(state.maxLives, state.lives + 1); updateHUD(); break;
      case 'EMP':
        state.shake = 18; state.flash = Math.max(state.flash, 0.35);
        aliens.forEach(o => {
          const p = project(o.z, o.worldX);
          if (o.type === 'boss') { o.hp -= 20; explode(p.x, p.y, o.hue, 12, 1); if (o.hp <= 0) destroyAlien(o); }
          else { explode(p.x, p.y, o.hue, 10, Math.max(0.4, p.s)); addScore(Math.floor(o.score / 2), p.x, p.y, '#f55'); o.dead = true; }
        });
        aliens = aliens.filter(o => !o.dead); enemyBullets = [];
        break;
    }
  }

  function startSpiral() {
    state.phase = 'spiral'; state.spiralTriggered = true; state.spiralT = 0;
    aliens = aliens.filter(o => o.type === 'boss');
    enemyBullets = []; bullets = []; powerups = []; bumps = [];
    addText(W / 2, H * 0.26, 'VÓRTICE EN ESPIRAL', '#b26bff', 1.4, 32);
    addText(W / 2, H * 0.33, '4 GIROS', '#ff9a3d', 1.2, 22);
    try { Synth.spiral(); } catch (e) {}
    updateHUD();
  }

  function endSpiral() {
    state.phase = 'combat'; state.cameraRoll = 0; state.spawnTimer = 1.5;
    addText(W / 2, H * 0.28, '¡VÓRTICE SUPERADO!', '#0ff', 1.4, 28);
    updateHUD();
  }

  function updateJump(dt) {
    if (state.jumpAlt > 0 || state.jumpVel !== 0) {
      state.jumpAlt += state.jumpVel * dt;
      state.jumpVel -= 900 * dt;
      if (state.jumpAlt <= 0) {
        state.jumpAlt = 0;
        if (state.jumpVel < -100 && state.bounceCount < 2) {
          state.jumpVel = -state.jumpVel * 0.45; state.bounceCount++; state.jumpInvuln = 0.35;
          try { Synth.bounce(); } catch (e) {}
        } else { state.jumpVel = 0; state.bounceCount = 0; }
      }
    }
    state.jumpInvuln = Math.max(0, state.jumpInvuln - dt);
  }

  function updateParticlesTexts(dt) {
    particles.forEach(p => { p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 60 * dt; p.life -= dt; if (p.life <= 0) p.dead = true; });
    texts.forEach(t => { t.y -= 28 * dt; t.life -= dt; if (t.life <= 0) t.dead = true; });
    lightnings.forEach(l => { l.life -= dt; if (l.life <= 0) l.dead = true; });
    particles = particles.filter(x => !x.dead);
    texts = texts.filter(x => !x.dead);
    lightnings = lightnings.filter(x => !x.dead);
  }

  function updateShipMovement(dt) {
    ship.prevWorldX = ship.worldX;
    if (moveDir !== 0) ship.targetWorldX += moveDir * 2.1 * dt;
    else if (state.phase === 'spiral') ship.targetWorldX += (0 - ship.targetWorldX) * Math.min(1, dt * 2);
    ship.targetWorldX = clamp(ship.targetWorldX, -1, 1);
    ship.worldX += (ship.targetWorldX - ship.worldX) * Math.min(1, dt * 15);
    ship.worldX = clamp(ship.worldX, -1, 1);
    const vx = (ship.worldX - ship.prevWorldX) / Math.max(dt, 0.0001);
    const targetBank = clamp(vx * 0.25, -1, 1);
    ship.bank += (targetBank - ship.bank) * Math.min(1, dt * 12);
  }

  function getRoadSpeed() {
    if (state.bossActive || state.victoryPending) return 0;
    if (state.phase === 'spiral') return 720;
    return 520 * currentCfg().speed + GAME_LEVEL * 16;
  }

  function update(dt) {
    const cfg = currentCfg();
    state.time += dt;
    effects.rapid = Math.max(0, effects.rapid - dt);
    effects.triple = Math.max(0, effects.triple - dt);
    effects.multi = Math.max(0, effects.multi - dt);
    effects.shield = Math.max(0, effects.shield - dt);
    effects.hack = Math.max(0, effects.hack - dt);
    ship.invuln = Math.max(0, ship.invuln - dt);
    ship.muzzle = Math.max(0, ship.muzzle - dt);
    state.flash = Math.max(0, state.flash - dt * 1.4);
    if (state.shake > 0) state.shake = Math.max(0, state.shake - dt * 30);

    updateJump(dt);

    if (state.victoryPending) { updateParticlesTexts(dt); updatePowerHud(); return; }

    updateShipMovement(dt);

    if (autofire || firing) fire();

    bullets.forEach(b => { b.z += 1350 * dt; b.worldX += b.vx * dt; b.worldX = clamp(b.worldX, -1.2, 1.2); if (b.z > Z_FAR) b.dead = true; });

    if (state.phase === 'spiral') {
      state.spiralT += dt;
      const p = clamp(state.spiralT / state.spiralDuration, 0, 1);
      state.cameraRoll = p * Math.PI * 2 * 4;
      progressVal.textContent = `ESPIRAL ${Math.floor(p * 100)}%`;
      updateParticlesTexts(dt);
      updatePowerHud();
      if (p >= 1) endSpiral();
      return;
    }

    if (state.phase === 'combat') {
      if (!state.spiralTriggered && state.killed >= Math.floor(state.quota * 0.5)) { startSpiral(); return; }
      if (state.killed >= state.quota && !state.bossActive) spawnBoss();
      if (!state.bossActive && state.spawned < state.quota) {
        state.spawnTimer -= dt;
        if (state.spawnTimer <= 0) { spawnEnemy(); state.spawnTimer = cfg.spawn * rand(0.7, 1.2); }
      }
      if (!state.bossActive) {
        state.bumpTimer -= dt;
        if (state.bumpTimer <= 0) { bumps.push({ z: Z_FAR, triggered: false, dead: false }); state.bumpTimer = rand(10, 16); }
      }
    }

    bumps.forEach(b => {
      b.z -= getRoadSpeed() * dt;
      if (!b.triggered && b.z <= SHIP_Z + 30 && state.jumpAlt === 0) { b.triggered = true; triggerJump(); }
      if (b.z < -80) b.dead = true;
    });

    aliens.forEach(o => {
      if (o.type !== 'boss') { o.z -= o.speed * dt; o.phase += o.freq * dt; o.worldX = clamp(o.baseWorldX + Math.sin(o.phase) * o.amp, -1, 1); }
      o.shootTimer -= dt;
      if (o.shootTimer <= 0 && o.z > 150 && o.z < 1300) { enemyShoot(o); o.shootTimer = rand(o.shootMin, o.shootMax) * rand(0.85, 1.25); }
      if (o.type === 'boss') {
        o.phase += o.freq * dt; o.bossTimer -= dt; o.hitCooldown = Math.max(0, o.hitCooldown - dt);
        if (o.flash > 0) o.flash = Math.max(0, o.flash - dt);
        const hoverZ = 680;
        if (o.bossPhase === 'enter') { o.z -= 260 * dt; o.worldX = Math.sin(o.phase) * 0.20; if (o.z <= hoverZ) { o.z = hoverZ; o.bossPhase = 'hover'; o.bossTimer = rand(1.2, 2.2); } }
        else if (o.bossPhase === 'hover') {
          o.worldX = clamp(Math.sin(o.phase) * 0.45, -0.8, 0.8); o.z = hoverZ + Math.sin(o.phase * 1.7) * 40;
          if (o.bossTimer <= 0) {
            o.bossPhase = 'windup'; o.bossTimer = 0.85; o.flash = 0.85;
            const side = Math.random();
            o.dashTargetX = side < 0.60 ? 0 : clamp(ship.worldX * 0.35, -0.35, 0.35);
            addText(W / 2, H * 0.22, '¡EMBISTIDA!', '#f33', 0.9, 26);
          }
        }
        else if (o.bossPhase === 'windup') { o.worldX += (o.dashTargetX - o.worldX) * Math.min(1, dt * 4); o.z = hoverZ + Math.sin(animTime * 40) * 6; if (o.bossTimer <= 0) { o.bossPhase = 'dash'; o.bossTimer = 0.55; } }
        else if (o.bossPhase === 'dash') { o.z -= 1500 * dt; o.worldX += (o.dashTargetX - o.worldX) * Math.min(1, dt * 8); if (o.z <= 45) { o.z = 45; o.bossPhase = 'retreat'; o.bossTimer = 0.9; } }
        else if (o.bossPhase === 'retreat') { o.z += 650 * dt; o.worldX += (0 - o.worldX) * Math.min(1, dt * 2); if (o.z >= hoverZ || o.bossTimer <= 0) { o.z = Math.min(o.z, hoverZ); o.bossPhase = 'hover'; o.bossTimer = rand(1.4, 2.6); } }
        if (o.z < 25) o.z = 25;
        if (o.hitCooldown <= 0 && o.z < SHIP_Z + 90 && o.z > SHIP_Z - 70 && Math.abs(ship.worldX - o.worldX) < 0.52 && state.jumpAlt < 40) {
          if (effects.shield > 0) { addText(W / 2, H * 0.30, 'ESCUDO BLOQUEA IMPACTO', '#0ff', 1.0, 18); o.bossPhase = 'retreat'; o.bossTimer = 1.0; o.z = Math.max(o.z, 120); }
          else { loseLife(); o.bossPhase = 'retreat'; o.bossTimer = 1.2; o.z = Math.max(o.z, 160); }
          o.hitCooldown = 1.5; state.shake = Math.max(state.shake, 20);
        }
      } else if (o.z <= 8) {
        o.dead = true;
        const pr = project(2, o.worldX);
        explode(pr.x, H - 25, o.hue, 18, 1.4);
        if (state.jumpAlt < 40 && effects.shield <= 0) loseLife();
      }
    });

    if (state.mode !== 'playing') return;

    for (const b of bullets) {
      if (b.dead) continue;
      for (const o of aliens) {
        if (o.dead) continue;
        if (Math.abs(b.z - o.z) < 100) {
          const hitRange = (o.rNear + (o.type === 'boss' ? 30 : 20)) / roadHalf;
          if (Math.abs(b.worldX - o.worldX) < hitRange) {
            b.dead = true; o.hp--;
            const pr = project(o.z, o.worldX);
            explode(pr.x, pr.y, o.hue, 4, Math.max(0.35, pr.s));
            if (o.hp <= 0) destroyAlien(o);
            break;
          }
        }
      }
    }

    const bulletDt = dt * (effects.hack > 0 ? 0.45 : 1);
    enemyBullets.forEach(b => {
      b.z -= b.speed * bulletDt; b.worldX += b.vx * bulletDt; b.worldX = clamp(b.worldX, -1.2, 1.2);
      if (!b.checked && b.z <= SHIP_Z + 8) {
        b.checked = true;
        const dx = Math.abs(b.worldX - ship.worldX);
        const pr = project(SHIP_Z, b.worldX);
        if (state.jumpAlt > 40 || state.jumpInvuln > 0) explode(pr.x, pr.y, b.hue, 3, 0.45);
        else if (effects.shield > 0 && dx < 0.26) { b.dead = true; explode(pr.x, pr.y, 190, 6, 0.6); }
        else if (dx < cfg.shotHit) { b.dead = true; loseLife(); }
        else explode(pr.x, pr.y, b.hue, 3, 0.45);
      }
      if (b.z <= 0) b.dead = true;
    });

    powerups.forEach(p => {
      p.z -= p.speed * dt; p.rot += dt * 3;
      if (p.z < 350) { const dx = ship.worldX - p.worldX; if (Math.abs(dx) < 0.5) p.worldX += dx * dt * 3; }
      if (p.z <= SHIP_Z + 20 && Math.abs(p.worldX - ship.worldX) < 0.34 && state.jumpAlt < 50) { p.dead = true; applyPower(p); }
      else if (p.z <= 0) { if (Math.abs(p.worldX - ship.worldX) < 0.60 && state.jumpAlt < 50) { p.dead = true; applyPower(p); } else p.dead = true; }
    });

    updateParticlesTexts(dt);

    bullets = bullets.filter(x => !x.dead);
    aliens = aliens.filter(x => !x.dead);
    enemyBullets = enemyBullets.filter(x => !x.dead);
    powerups = powerups.filter(x => !x.dead);
    bumps = bumps.filter(x => !x.dead);

    updatePowerHud();
  }

  function updatePowerHud() {
    let html = '';
    if (effects.shield > 0) html += `<div class="power-tag" style="color:#0ff;border-color:#0ff;box-shadow:0 0 10px #0ff;">🛡 ESCUDO ${effects.shield.toFixed(1)}s</div>`;
    if (effects.rapid > 0) html += `<div class="power-tag" style="color:#f0f;border-color:#f0f;box-shadow:0 0 10px #f0f;">⚡ OVERDRIVE ${effects.rapid.toFixed(1)}s</div>`;
    if (effects.triple > 0) html += `<div class="power-tag" style="color:#ff0;border-color:#ff0;box-shadow:0 0 10px #ff0;">▲ TRI-SHOT ${effects.triple.toFixed(1)}s</div>`;
    if (effects.multi > 0) html += `<div class="power-tag" style="color:#b26bff;border-color:#b26bff;box-shadow:0 0 10px #b26bff;">×2 SCORE ${effects.multi.toFixed(1)}s</div>`;
    if (effects.hack > 0) html += `<div class="power-tag" style="color:#0ff;border-color:#0ff;box-shadow:0 0 10px #0ff;">🧠 HACK MODE ${effects.hack.toFixed(1)}s</div>`;
    else if (state.hackEnergy > 0) html += `<div class="power-tag" style="color:#7fffd4;border-color:#7fffd4;box-shadow:0 0 10px #7fffd4;">🧠 HACK ${Math.floor(state.hackEnergy)}%</div>`;
    if (state.jumpAlt > 0) html += `<div class="power-tag" style="color:#ff9a3d;border-color:#ff9a3d;box-shadow:0 0 10px #ff9a3d;">🚀 SALTO</div>`;
    powerHud.innerHTML = html;
  }

  let animTime = 0;

  function draw() {
    ctx.clearRect(0, 0, W, H);

    ctx.save();
    if (state.shake > 0) ctx.translate(rand(-state.shake, state.shake) * 0.5, rand(-state.shake, state.shake) * 0.5);

    // Capa de mundo (gira durante la espiral)
    ctx.save();
    if (state.cameraRoll) { ctx.translate(W / 2, H / 2); ctx.rotate(state.cameraRoll); ctx.translate(-W / 2, -H / 2); }
    drawBackground();
    if (state.phase === 'spiral') drawSpiralTunnel();
    else { drawNormalRoad(); drawBumps(); }
    ctx.restore();

    // Capa de juego (NO gira: la nave se queda centrada como en Wipeout)
    drawEntities();
    drawLightnings();
    drawParticles();
    drawBossBar();
    drawTexts();

    ctx.restore();

    drawHackOverlay();

    if (state.flash > 0) { ctx.fillStyle = `rgba(255,0,70,${state.flash * 0.32})`; ctx.fillRect(0, 0, W, H); }
  }

  function drawBackground() {
    const bg = ctx.createLinearGradient(0, -H, 0, H * 2);
    bg.addColorStop(0, '#12042c');
    bg.addColorStop(0.45, '#1b0738');
    bg.addColorStop(1, '#04010c');
    ctx.fillStyle = bg;
    ctx.fillRect(-W, -H, W * 3, H * 3);

    ctx.save();
    stars.forEach(s => {
      const x = (s.x * 2 - 0.5) * W;
      const y = s.y * horizon * 1.4;
      const a = 0.25 + 0.55 * Math.abs(Math.sin(animTime * 2 + s.tw));
      ctx.globalAlpha = a; ctx.fillStyle = '#dcc9ff';
      ctx.beginPath(); ctx.arc(x, y, s.r, 0, Math.PI * 2); ctx.fill();
    });
    ctx.restore();

    const r = Math.min(W, H) * 0.24;
    const x = W * 0.5;
    const y = horizon - r * 0.2;
    const planetGrad = ctx.createLinearGradient(x, y - r, x, y + r);
    planetGrad.addColorStop(0, '#ff7a00');
    planetGrad.addColorStop(0.45, '#b26bff');
    planetGrad.addColorStop(1, '#2b0f4d');

    ctx.save();
    ctx.globalAlpha = 0.68; ctx.shadowBlur = 50; ctx.shadowColor = '#b26bff'; ctx.fillStyle = planetGrad;
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = 'rgba(0,255,255,0.35)'; ctx.lineWidth = Math.max(2, r * 0.04); ctx.shadowBlur = 20; ctx.shadowColor = '#0ff';
    ctx.beginPath(); ctx.ellipse(x, y, r * 1.35, r * 0.28, -0.18, 0, Math.PI * 2); ctx.stroke();
    ctx.shadowBlur = 0; ctx.fillStyle = 'rgba(8,2,18,0.72)';
    for (let i = 0; i < 7; i++) { const yy = y + r * 0.08 + i * r * 0.13; ctx.fillRect(x - r, yy, r * 2, Math.max(2, r * 0.045)); }
    ctx.restore();

    drawCityLayer(buildingsFar, 0.55);
    drawCityLayer(buildingsNear, 0.85);
    drawRain();
    drawSpeedLines();

    const beat = (animTime * BPM / 60) % 1;
    const pulse = Math.pow(1 - beat, 3) * 0.07;
    if (pulse > 0.005) { ctx.save(); ctx.fillStyle = `rgba(180,100,255,${pulse})`; ctx.fillRect(-W, -H, W * 3, H * 3); ctx.restore(); }
  }

  function drawCityLayer(layer, alpha) {
    ctx.save(); ctx.globalAlpha = alpha;
    layer.forEach((b, idx) => {
      const bx = b.x * W; const bw = b.w * W; const bh = b.h * H; const by = horizon - bh;
      ctx.fillStyle = `hsla(${b.hue},60%,8%,0.94)`; ctx.fillRect(bx, by, bw, bh);
      ctx.strokeStyle = `hsla(${b.hue},100%,65%,0.16)`; ctx.lineWidth = 1; ctx.strokeRect(bx, by, bw, bh);
      for (let j = 0; j < b.win; j++) {
        const wx = bx + (((j * 37) % 100) / 100) * bw * 0.8 + bw * 0.1;
        const wy = by + (((j * 53) % 100) / 100) * bh * 0.8 + bh * 0.1;
        const flick = 0.12 + 0.18 * Math.abs(Math.sin(animTime * 3 + idx + j));
        ctx.fillStyle = `hsla(${b.hue},100%,75%,${flick})`;
        ctx.fillRect(wx, wy, Math.max(1, bw * 0.10), Math.max(1, bh * 0.04));
      }
    });
    ctx.restore();
  }

  function drawRain() {
    ctx.save();
    rain.forEach(d => {
      const x = d.x * W;
      const y = ((d.y + animTime * d.sp) % 1.2 - 0.1) * H;
      const len = d.len * H;
      ctx.strokeStyle = 'rgba(160,220,255,0.14)'; ctx.lineWidth = 1.4;
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - len * 0.18, y + len); ctx.stroke();
    });
    ctx.restore();
  }

  function drawSpeedLines() {
    ctx.save();
    speedLines.forEach(s => {
      const x = s.x * W;
      const y = ((s.y + animTime * s.sp) % 1.1 - 0.05) * H;
      const len = s.len * H;
      ctx.strokeStyle = 'rgba(255,160,80,0.10)'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + len); ctx.stroke();
    });
    ctx.restore();
  }

  function drawNormalRoad() {
    const pFar = CAM / (CAM + Z_FAR);
    const nearY = H; const farY = horizon;
    const nearHalf = roadHalf; const farHalf = roadHalf * pFar;
    const grad = ctx.createLinearGradient(0, farY, 0, nearY);
    grad.addColorStop(0, 'rgba(35,8,60,0.94)');
    grad.addColorStop(1, 'rgba(8,2,18,0.97)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(W / 2 - nearHalf, nearY); ctx.lineTo(W / 2 + nearHalf, nearY);
    ctx.lineTo(W / 2 + farHalf, farY); ctx.lineTo(W / 2 - farHalf, farY);
    ctx.closePath(); ctx.fill();

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(W / 2 - nearHalf, nearY); ctx.lineTo(W / 2 + nearHalf, nearY);
    ctx.lineTo(W / 2 + farHalf, farY); ctx.lineTo(W / 2 - farHalf, farY);
    ctx.closePath(); ctx.clip();

    const seg = 240; const speed = getRoadSpeed(); const offset = (animTime * speed) % seg;
    const maxK = Math.ceil(Z_FAR / seg) + 1;
    for (let k = maxK; k >= 0; k--) {
      let z1 = k * seg - offset; let z2 = z1 - seg * 0.48;
      if (z1 < 0 || z1 > Z_FAR) continue; if (z2 < 0) z2 = 0;
      const a = project(z1, 0); const b = project(z2, 0);
      ctx.fillStyle = k % 2 ? 'rgba(180,100,255,0.06)' : 'rgba(255,140,0,0.04)';
      ctx.beginPath();
      ctx.moveTo(W / 2 - roadHalf * a.s, a.y); ctx.lineTo(W / 2 + roadHalf * a.s, a.y);
      ctx.lineTo(W / 2 + roadHalf * b.s, b.y); ctx.lineTo(W / 2 - roadHalf * b.s, b.y);
      ctx.closePath(); ctx.fill();
    }

    [-0.75, -0.375, 0, 0.375, 0.75].forEach(wx => {
      const a = project(0, wx); const b = project(Z_FAR, wx);
      ctx.strokeStyle = wx === 0 ? 'rgba(255,255,255,0.22)' : 'rgba(0,255,255,0.12)';
      ctx.lineWidth = wx === 0 ? 2 : 1;
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
    });
    ctx.restore();

    drawGates();

    ctx.save();
    ctx.shadowBlur = 18; ctx.lineWidth = 3;
    ctx.strokeStyle = '#b26bff'; ctx.shadowColor = '#b26bff';
    const ln = project(0, -1); const lf = project(Z_FAR, -1);
    ctx.beginPath(); ctx.moveTo(ln.x, ln.y); ctx.lineTo(lf.x, lf.y); ctx.stroke();
    ctx.strokeStyle = '#ff9a3d'; ctx.shadowColor = '#ff9a3d';
    const rn = project(0, 1); const rf = project(Z_FAR, 1);
    ctx.beginPath(); ctx.moveTo(rn.x, rn.y); ctx.lineTo(rf.x, rf.y); ctx.stroke();
    ctx.restore();
  }

  function drawGates() {
    const gateSeg = 420; const speed = getRoadSpeed(); const offset = (animTime * speed) % gateSeg;
    const maxK = Math.ceil(Z_FAR / gateSeg) + 1;
    ctx.save();
    for (let k = maxK; k >= 0; k--) {
      const z = k * gateSeg - offset;
      if (z < 60 || z > Z_FAR) continue;
      const p = project(z, 0); const half = roadHalf * p.s; const h = half * 0.9;
      const hue = (animTime * 40 + z * 0.08) % 360;
      ctx.strokeStyle = `hsla(${hue},100%,65%,0.35)`; ctx.shadowBlur = 16 * p.s; ctx.shadowColor = `hsla(${hue},100%,60%,0.45)`;
      ctx.lineWidth = Math.max(1.5, 4 * p.s);
      ctx.beginPath();
      ctx.moveTo(W / 2 - half, p.y);
      ctx.lineTo(W / 2 - half, p.y - h);
      ctx.quadraticCurveTo(W / 2, p.y - h * 1.45, W / 2 + half, p.y - h);
      ctx.lineTo(W / 2 + half, p.y);
      ctx.stroke();
    }
    ctx.restore();
  }

  // TÚNEL EN ESPIRAL (efecto Wipeout): cilindro que gira alrededor de la nave
  function drawSpiralTunnel() {
    const seg = 42;
    const speed = 720;
    const offset = (animTime * speed) % seg;
    const maxK = Math.ceil(Z_FAR / seg) + 1;
    const rings = [];

    for (let k = maxK; k >= 0; k--) {
      const zz = k * seg - offset;
      if (zz < 0 || zz > Z_FAR) continue;
      const p = CAM / (CAM + zz);
      const cy = horizon + (H - horizon) * p;
      const half = roadHalf * p;
      const tubeR = half * 1.35;
      const cx = W / 2;
      const cY = cy - tubeR * 0.5;
      rings.push({ cx, cY, tubeR, cy, half, p, zz });
    }

    if (rings.length < 2) return;

    // Cuerpo opaco del tubo (para no ver a través)
    ctx.save();
    for (let i = 0; i < rings.length - 1; i++) {
      const a = rings[i]; const b = rings[i + 1];
      const N = 16;
      ctx.beginPath();
      for (let s = 0; s <= N; s++) { const ang = s / N * Math.PI * 2; ctx.lineTo(a.cx + Math.cos(ang) * a.tubeR, a.cY + Math.sin(ang) * a.tubeR); }
      for (let s = N; s >= 0; s--) { const ang = s / N * Math.PI * 2; ctx.lineTo(b.cx + Math.cos(ang) * b.tubeR, b.cY + Math.sin(ang) * b.tubeR); }
      ctx.closePath();
      const shade = 0.55 + 0.35 * (1 - a.zz / Z_FAR);
      ctx.fillStyle = `rgba(8,2,20,${shade})`;
      ctx.fill();
    }
    ctx.restore();

    // Generatrices (líneas que giran con el tubo)
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    const G = 12;
    for (let g = 0; g < G; g++) {
      const ang = g / G * Math.PI * 2;
      const hue = (g % 2 ? 30 : 190) + Math.sin(ang) * 20;
      ctx.strokeStyle = `hsla(${hue},100%,65%,0.5)`;
      ctx.shadowBlur = 10; ctx.shadowColor = `hsla(${hue},100%,60%,0.6)`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i < rings.length; i++) {
        const r = rings[i];
        const x = r.cx + Math.cos(ang) * r.tubeR;
        const y = r.cY + Math.sin(ang) * r.tubeR;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    // Anillos / costillas
    for (let i = 0; i < rings.length; i++) {
      const r = rings[i];
      const a = 0.10 + 0.4 * (1 - r.zz / Z_FAR);
      const col = `hsla(${(animTime * 60 + r.zz * 0.2) % 360},100%,70%,${a})`;
      ctx.strokeStyle = col; ctx.shadowBlur = 8 * r.p; ctx.shadowColor = col;
      ctx.lineWidth = Math.max(1, 3 * r.p);
      ctx.beginPath(); ctx.arc(r.cx, r.cY, r.tubeR, 0, Math.PI * 2); ctx.stroke();
    }

    // Núcleo brillante del fondo del túnel
    const far = rings[0];
    const grd = ctx.createRadialGradient(far.cx, far.cY, 0, far.cx, far.cY, far.tubeR * 1.6);
    grd.addColorStop(0, 'rgba(255,255,255,0.55)');
    grd.addColorStop(0.4, 'rgba(180,120,255,0.28)');
    grd.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grd;
    ctx.beginPath(); ctx.arc(far.cx, far.cY, far.tubeR * 1.6, 0, Math.PI * 2); ctx.fill();

    ctx.restore();
  }

  function drawBumps() {
    if (state.phase !== 'combat' || state.bossActive) return;
    ctx.save();
    bumps.forEach(b => {
      if (b.z < 0 || b.z > Z_FAR) return;
      const p = project(b.z, 0); const half = roadHalf * p.s * 0.9; const h = Math.max(4, 18 * p.s);
      const grad = ctx.createLinearGradient(0, p.y - h, 0, p.y);
      grad.addColorStop(0, 'rgba(255,220,120,0.45)');
      grad.addColorStop(1, 'rgba(255,140,0,0.08)');
      ctx.fillStyle = grad; ctx.shadowBlur = 18 * p.s; ctx.shadowColor = 'rgba(255,180,80,0.55)';
      ctx.beginPath(); ctx.ellipse(W / 2, p.y, half, h, 0, Math.PI, 0); ctx.fill();
      ctx.strokeStyle = 'rgba(255,230,160,0.7)'; ctx.lineWidth = Math.max(1.5, 3 * p.s);
      ctx.beginPath(); ctx.ellipse(W / 2, p.y, half, h, 0, Math.PI, 0); ctx.stroke();
    });
    ctx.restore();
  }

  function drawEntities() {
    const list = [];
    aliens.forEach(o => { if (!o.dead) list.push({ z: o.z, kind: 1, ref: o }); });
    powerups.forEach(p => { if (!p.dead) list.push({ z: p.z, kind: 2, ref: p }); });
    list.push({ z: SHIP_Z, kind: 3, ref: null });
    enemyBullets.forEach(b => { if (!b.dead) list.push({ z: b.z, kind: 4, ref: b }); });
    list.sort((a, b) => b.z - a.z || a.kind - b.kind);
    list.forEach(item => {
      if (item.kind === 1) drawAlien(item.ref);
      if (item.kind === 2) drawPower(item.ref);
      if (item.kind === 3) drawShip();
      if (item.kind === 4) drawEnemyBullet(item.ref);
    });
    bullets.forEach(b => { if (!b.dead) drawBullet(b); });
  }

  function drawAlien(o) {
    const pr = project(o.z, o.worldX);
    const r = o.rNear * pr.s;
    if (r < 2) return;
    ctx.save();
    ctx.translate(pr.x, pr.y);
    const t = animTime * 3 + o.phase;
    const main = `hsl(${o.hue},100%,60%)`;
    const dark = `hsl(${o.hue},85%,32%)`;
    const light = `hsl(${o.hue},100%,82%)`;
    ctx.shadowBlur = 16 * pr.s + 4; ctx.shadowColor = main; ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    if (o.type === 'boss') {
      for (let i = 0; i < 4; i++) {
        ctx.save(); ctx.rotate(t * (i % 2 ? 0.5 : -0.7) + i);
        ctx.strokeStyle = `hsla(${o.hue + i * 20},100%,70%,0.7)`; ctx.lineWidth = r * 0.04;
        ctx.beginPath(); ctx.arc(0, 0, r * (0.75 + i * 0.12), 0, Math.PI * 1.5); ctx.stroke();
        ctx.restore();
      }
      const bossGrad = ctx.createRadialGradient(0, -r * 0.15, r * 0.1, 0, 0, r);
      bossGrad.addColorStop(0, light); bossGrad.addColorStop(0.45, main); bossGrad.addColorStop(1, dark);
      ctx.fillStyle = bossGrad;
      ctx.beginPath(); ctx.ellipse(0, 0, r * 0.72, r * 0.52, 0, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = light; ctx.lineWidth = Math.max(1.5, r * 0.04); ctx.stroke();
      const lookX = clamp((ship.worldX - o.worldX) * r * 0.18, -r * 0.12, r * 0.12);
      ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.ellipse(lookX, -r * 0.05, r * 0.20, r * 0.14, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#111'; ctx.beginPath(); ctx.arc(lookX, -r * 0.05, r * 0.06, 0, Math.PI * 2); ctx.fill();
      const pulse = 0.75 + Math.sin(t * 4) * 0.25;
      ctx.shadowBlur = 30; ctx.shadowColor = light; ctx.fillStyle = light;
      ctx.beginPath(); ctx.arc(0, r * 0.22, r * 0.12 * pulse, 0, Math.PI * 2); ctx.fill();
      if (o.flash > 0 || o.bossPhase === 'dash') {
        ctx.globalAlpha = 0.25 + 0.25 * Math.abs(Math.sin(animTime * 30));
        ctx.fillStyle = 'rgba(255,60,60,0.35)';
        ctx.beginPath(); ctx.ellipse(0, 0, r * 0.72, r * 0.52, 0, 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = 1;
      }
    } else if (o.type === 'bit') {
      ctx.rotate(Math.sin(t * 2) * 0.2);
      ctx.fillStyle = main;
      ctx.beginPath(); ctx.moveTo(0, -r); ctx.lineTo(r * 0.7, 0); ctx.lineTo(0, r); ctx.lineTo(-r * 0.7, 0); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = light; ctx.lineWidth = Math.max(1, r * 0.08); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, r); ctx.lineTo(0, r * 1.6); ctx.stroke();
    } else if (o.type === 'wasp') {
      ctx.fillStyle = main;
      ctx.beginPath(); ctx.moveTo(0, -r); ctx.lineTo(r * 0.5, r * 0.2); ctx.lineTo(r * 0.8, r * 0.5); ctx.lineTo(0, r * 0.3); ctx.lineTo(-r * 0.8, r * 0.5); ctx.lineTo(-r * 0.5, r * 0.2); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = light; ctx.lineWidth = Math.max(1, r * 0.07); ctx.stroke();
      ctx.fillStyle = dark; ctx.beginPath(); ctx.arc(0, -r * 0.15, r * 0.18, 0, Math.PI * 2); ctx.fill();
    } else if (o.type === 'orbiter') {
      ctx.fillStyle = dark; ctx.beginPath();
      for (let i = 0; i < 6; i++) { const a = (i / 6) * Math.PI * 2; const x = Math.cos(a) * r * 0.8; const y = Math.sin(a) * r * 0.8; if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y); }
      ctx.closePath(); ctx.fill();
      ctx.strokeStyle = main; ctx.lineWidth = Math.max(1.5, r * 0.08); ctx.stroke();
      ctx.save(); ctx.rotate(t);
      ctx.strokeStyle = light; ctx.lineWidth = Math.max(1.5, r * 0.06);
      ctx.beginPath(); ctx.arc(0, 0, r * 0.98, 0, Math.PI * 1.2); ctx.stroke();
      ctx.beginPath(); ctx.arc(0, 0, r * 0.98, Math.PI, Math.PI * 2.2); ctx.stroke();
      ctx.restore();
      ctx.fillStyle = light; ctx.beginPath(); ctx.arc(0, 0, r * 0.18, 0, Math.PI * 2); ctx.fill();
    } else if (o.type === 'angler') {
      const bodyGrad = ctx.createRadialGradient(-r * 0.2, -r * 0.2, r * 0.1, 0, 0, r);
      bodyGrad.addColorStop(0, light); bodyGrad.addColorStop(0.5, main); bodyGrad.addColorStop(1, dark);
      ctx.fillStyle = bodyGrad; ctx.beginPath(); ctx.ellipse(0, 0, r * 0.85, r * 0.65, 0, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = main; ctx.lineWidth = Math.max(1.5, r * 0.07); ctx.stroke();
      ctx.strokeStyle = light; ctx.lineWidth = Math.max(1, r * 0.05);
      ctx.beginPath(); ctx.moveTo(0, -r * 0.55); ctx.quadraticCurveTo(r * 0.2, -r * 1.0, r * 0.35, -r * 0.95); ctx.stroke();
      ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(r * 0.35, -r * 0.95, r * 0.08, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#0a0a0a'; ctx.beginPath(); ctx.arc(0, r * 0.15, r * 0.35, 0, Math.PI); ctx.fill();
      ctx.fillStyle = '#fff';
      for (let i = -2; i <= 2; i++) { ctx.beginPath(); ctx.moveTo(i * r * 0.14, r * 0.15); ctx.lineTo(i * r * 0.14 + r * 0.03, r * 0.32); ctx.lineTo(i * r * 0.14 + r * 0.06, r * 0.15); ctx.closePath(); ctx.fill(); }
    } else if (o.type === 'reaper') {
      ctx.rotate(Math.sin(t * 3) * 0.15);
      ctx.fillStyle = main;
      ctx.beginPath(); ctx.moveTo(-r * 0.9, 0); ctx.quadraticCurveTo(0, -r * 1.1, r * 0.9, 0); ctx.quadraticCurveTo(0, -r * 0.3, -r * 0.9, 0); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = light; ctx.lineWidth = Math.max(1, r * 0.07); ctx.stroke();
      ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(0, -r * 0.15, r * 0.12, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#111'; ctx.beginPath(); ctx.arc(0, -r * 0.15, r * 0.05, 0, Math.PI * 2); ctx.fill();
    }

    if (o.maxHp > 1 && o.type !== 'boss') {
      const bw = r * 1.5; const bh = Math.max(2, r * 0.12); const by = -r * 1.35; const pct = o.hp / o.maxHp;
      ctx.shadowBlur = 0;
      ctx.fillStyle = 'rgba(0,0,0,0.55)'; ctx.fillRect(-bw / 2, by, bw, bh);
      ctx.fillStyle = pct > 0.5 ? '#0f8' : (pct > 0.25 ? '#ff0' : '#f33'); ctx.fillRect(-bw / 2, by, bw * pct, bh);
    }
    ctx.restore();
  }

  function drawPower(pu) {
    const def = POWER_TYPES[pu.type];
    const pr = project(pu.z, pu.worldX);
    const size = Math.max(9, 30 * pr.s);
    ctx.save();
    ctx.translate(pr.x, pr.y); ctx.rotate(pu.rot);
    ctx.shadowBlur = 20 * pr.s + 4; ctx.shadowColor = def.color; ctx.strokeStyle = def.color;
    ctx.fillStyle = 'rgba(0,0,0,0.4)'; ctx.lineWidth = Math.max(1, 2 * pr.s);
    ctx.beginPath(); ctx.moveTo(0, -size); ctx.lineTo(size, 0); ctx.lineTo(0, size); ctx.lineTo(-size, 0); ctx.closePath();
    ctx.fill(); ctx.stroke();
    ctx.rotate(-pu.rot);
    ctx.fillStyle = def.color; ctx.font = `bold ${Math.max(9, 15 * pr.s)}px Orbitron, monospace`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(def.label, 0, 1);
    ctx.restore();
  }

  function drawEnemyBullet(b) {
    const pr = project(b.z, b.worldX); const tail = project(b.z + 110, b.worldX);
    ctx.save();
    ctx.globalCompositeOperation = 'lighter'; ctx.shadowBlur = 14; ctx.shadowColor = `hsl(${b.hue},100%,60%)`;
    ctx.strokeStyle = `hsla(${b.hue},100%,60%,0.85)`; ctx.lineWidth = Math.max(2, 5 * pr.s);
    ctx.beginPath(); ctx.moveTo(tail.x, tail.y); ctx.lineTo(pr.x, pr.y); ctx.stroke();
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(pr.x, pr.y, Math.max(2, 3.5 * pr.s), 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }

  function drawBullet(b) {
    const cur = projectBulletAtZ(b, b.z);
    const origin = projectBulletAtZ(b, SHIP_Z);
    const tailZ = b.z > SHIP_Z + 140 ? b.z - 140 : SHIP_Z;
    const tail = projectBulletAtZ(b, tailZ);
    ctx.save();
    ctx.globalCompositeOperation = 'lighter'; ctx.shadowBlur = 16; ctx.shadowColor = '#0ff';
    const beam = ctx.createLinearGradient(origin.x, origin.y, cur.x, cur.y);
    beam.addColorStop(0, 'rgba(0,255,255,0)'); beam.addColorStop(1, 'rgba(0,255,255,0.16)');
    ctx.strokeStyle = beam; ctx.lineWidth = Math.max(1.5, 3 * cur.s);
    ctx.beginPath(); ctx.moveTo(origin.x, origin.y); ctx.lineTo(cur.x, cur.y); ctx.stroke();
    const bolt = ctx.createLinearGradient(tail.x, tail.y, cur.x, cur.y);
    bolt.addColorStop(0, 'rgba(0,255,255,0)'); bolt.addColorStop(1, 'rgba(190,255,255,0.98)');
    ctx.strokeStyle = bolt; ctx.lineWidth = Math.max(2, 6 * cur.s);
    ctx.beginPath(); ctx.moveTo(tail.x, tail.y); ctx.lineTo(cur.x, cur.y); ctx.stroke();
    ctx.fillStyle = '#dff'; ctx.beginPath(); ctx.arc(cur.x, cur.y, Math.max(2, 4 * cur.s), 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }

  function drawLightnings() {
    if (lightnings.length === 0) return;
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    lightnings.forEach(l => {
      const a = l.life / l.maxLife;
      ctx.strokeStyle = `hsla(${l.hue},100%,75%,${a})`; ctx.lineWidth = 3; ctx.shadowBlur = 12; ctx.shadowColor = `hsla(${l.hue},100%,70%,${a})`;
      ctx.beginPath(); ctx.moveTo(l.x1, l.y1);
      const segs = 5;
      for (let i = 1; i < segs; i++) { const t = i / segs; const x = l.x1 + (l.x2 - l.x1) * t + rand(-12, 12) * a; const y = l.y1 + (l.y2 - l.y1) * t + rand(-12, 12) * a; ctx.lineTo(x, y); }
      ctx.lineTo(l.x2, l.y2); ctx.stroke();
    });
    ctx.restore();
  }

  function drawParticles() {
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    particles.forEach(p => { const a = p.life / p.maxLife; ctx.fillStyle = `hsla(${p.hue},100%,65%,${a})`; ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill(); });
    ctx.restore();
  }

  function drawBossBar() {
    const boss = aliens.find(a => a.type === 'boss' && !a.dead);
    if (!boss) return;
    const bw = Math.min(W * 0.56, 520); const bh = Math.max(10, H * 0.024);
    const bx = (W - bw) / 2; const by = Math.max(48, H * 0.08); const pct = clamp(boss.hp / boss.maxHp, 0, 1);
    ctx.save();
    ctx.fillStyle = 'rgba(0,0,0,0.55)'; ctx.fillRect(bx, by, bw, bh);
    const grad = ctx.createLinearGradient(bx, 0, bx + bw, 0);
    grad.addColorStop(0, '#f33'); grad.addColorStop(0.5, '#f0f'); grad.addColorStop(1, '#0ff');
    ctx.fillStyle = grad; ctx.fillRect(bx, by, bw * pct, bh);
    ctx.strokeStyle = 'rgba(255,255,255,0.5)'; ctx.lineWidth = 1; ctx.strokeRect(bx, by, bw, bh);
    ctx.fillStyle = '#fff'; ctx.font = `bold ${Math.max(10, H * 0.02)}px Orbitron, monospace`;
    ctx.textAlign = 'center'; ctx.shadowBlur = 8; ctx.shadowColor = '#f0f';
    ctx.fillText('VÓRTICE CENTINELA', W / 2, by - 6);
    ctx.restore();
  }

  function drawHackOverlay() {
    if (effects.hack <= 0) return;
    ctx.save();
    const a = 0.08 + 0.04 * Math.sin(animTime * 20);
    ctx.fillStyle = `rgba(0,255,255,${a})`; ctx.fillRect(0, 0, W, H);
    for (let i = 0; i < 6; i++) { const y = (animTime * 300 + i * 137) % H; ctx.fillStyle = 'rgba(255,0,255,0.05)'; ctx.fillRect(0, y, W, rand(2, 8)); }
    ctx.restore();
  }

  function drawShip() {
    if (ship.invuln > 0 && Math.floor(animTime * 18) % 2 === 0) return;
    const sr = getShipRender();
    const altOffset = state.jumpAlt * sr.sc;
    const shadowScale = clamp(1 - state.jumpAlt / 140, 0.35, 1);

    ctx.save();
    ctx.globalAlpha = 0.3 * shadowScale; ctx.fillStyle = '#000';
    ctx.beginPath(); ctx.ellipse(sr.x, sr.baseY, 42 * sr.sc * shadowScale, 12 * sr.sc * shadowScale, 0, 0, Math.PI * 2); ctx.fill();
    ctx.restore();

    ctx.save();
    const spiralTilt = state.phase === 'spiral' ? Math.sin(state.cameraRoll) * 0.18 : 0;
    const spiralShift = state.phase === 'spiral' ? Math.sin(state.cameraRoll) * 8 * sr.sc : 0;
    ctx.translate(sr.x + ship.bank * 8 * sr.sc + spiralShift, sr.y - altOffset);
    ctx.rotate(ship.bank * 0.36 + spiralTilt);
    ctx.transform(1, 0, ship.bank * 0.16, 1, 0, 0);
    ctx.scale(sr.sc, sr.sc);

    ctx.shadowBlur = 25; ctx.shadowColor = '#0ff';
    const bodyGrad = ctx.createLinearGradient(0, -72, 0, 36);
    bodyGrad.addColorStop(0, '#1b0b38'); bodyGrad.addColorStop(0.35, '#7b3dff'); bodyGrad.addColorStop(0.75, '#0ff'); bodyGrad.addColorStop(1, '#ff7a00');
    ctx.fillStyle = bodyGrad; ctx.strokeStyle = '#d7b8ff'; ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, -72); ctx.lineTo(7, -36); ctx.lineTo(13, -10); ctx.lineTo(46, 20); ctx.lineTo(20, 27);
    ctx.lineTo(14, 36); ctx.lineTo(-14, 36); ctx.lineTo(-20, 27); ctx.lineTo(-46, 20); ctx.lineTo(-13, -10); ctx.lineTo(-7, -36);
    ctx.closePath(); ctx.fill(); ctx.stroke();

    ctx.shadowBlur = 12; ctx.shadowColor = '#f0f'; ctx.fillStyle = 'rgba(255,0,255,0.65)';
    ctx.beginPath(); ctx.moveTo(0, -34); ctx.lineTo(6, -18); ctx.lineTo(0, 2); ctx.lineTo(-6, -18); ctx.closePath(); ctx.fill();

    const boosting = autofire || firing;
    const flameLen = (20 + Math.sin(animTime * 40) * 6) * (boosting ? 1.45 : 0.75);
    ctx.shadowBlur = 18; ctx.shadowColor = '#f80'; ctx.fillStyle = boosting ? '#ffbf00' : '#ff7700';
    ctx.beginPath(); ctx.moveTo(-16, 36); ctx.lineTo(-12, 36 + flameLen); ctx.lineTo(-8, 36); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(8, 36); ctx.lineTo(12, 36 + flameLen); ctx.lineTo(16, 36); ctx.closePath(); ctx.fill();

    ctx.shadowBlur = 14; ctx.shadowColor = '#0ff'; ctx.strokeStyle = '#0ff'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(0, -58); ctx.lineTo(0, -72); ctx.stroke();

    if (ship.muzzle > 0) {
      const a = ship.muzzle / 0.06;
      ctx.globalAlpha = a; ctx.shadowBlur = 25; ctx.shadowColor = '#0ff'; ctx.fillStyle = 'rgba(180,255,255,0.95)';
      ctx.beginPath(); ctx.arc(0, -72, 9, 0, Math.PI * 2); ctx.fill();
      if (effects.triple > 0) { ctx.beginPath(); ctx.arc(-22, 6, 6, 0, Math.PI * 2); ctx.fill(); ctx.beginPath(); ctx.arc(22, 6, 6, 0, Math.PI * 2); ctx.fill(); }
      ctx.globalAlpha = 1;
    }

    if (effects.shield > 0) {
      ctx.shadowBlur = 20; ctx.shadowColor = '#0ff'; ctx.strokeStyle = 'rgba(0,255,255,0.75)'; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.ellipse(0, -8, 56, 48, 0, 0, Math.PI * 2); ctx.stroke();
    }
    ctx.restore();
  }

  function drawTexts() {
    texts.forEach(t => {
      const a = t.life / t.maxLife;
      ctx.save();
      ctx.globalAlpha = a; ctx.fillStyle = t.color; ctx.font = `bold ${t.size}px Orbitron, monospace`;
      ctx.textAlign = 'center'; ctx.shadowBlur = 10; ctx.shadowColor = t.color;
      ctx.fillText(t.text, t.x, t.y);
      ctx.restore();
    });
  }

  function loop(ts) {
    requestAnimationFrame(loop);
    if (!state.last) state.last = ts;
    let dt = (ts - state.last) / 1000; state.last = ts; dt = Math.min(dt, 0.033);
    animTime += dt;
    if (state.mode === 'playing') update(dt);
    draw();
  }

  resize();
  requestAnimationFrame(loop);

  playBtn.textContent = `INICIAR NIVEL ${GAME_LEVEL}`;

  playBtn.addEventListener('click', startGame);
  retryBtn.addEventListener('click', () => { if (redirectTimeout) clearTimeout(redirectTimeout); window.location.href = MAIN_MENU_FILE; });
  restartBtn.addEventListener('click', () => { pauseOverlay.classList.add('hidden'); startGame(); });
  resumeBtn.addEventListener('click', togglePause);
  pauseBtn.addEventListener('click', togglePause);
  nextLevelBtn.addEventListener('click', () => { if (NEXT_LEVEL_FILE) window.location.href = NEXT_LEVEL_FILE; });

  autofireBtn.addEventListener('click', () => { autofire = !autofire; savePref('navyAutofire', autofire ? 'on' : 'off'); updateAutofireButton(); });
  musicBtn.addEventListener('click', () => { setMusicEnabled(!musicEnabled); });
  hudMusicBtn.addEventListener('click', () => { setMusicEnabled(!musicEnabled); });

  const leftBtn = $('leftBtn'); const rightBtn = $('rightBtn'); const fireBtn = $('fireBtn');

  function bindHold(el, down, up) {
    el.addEventListener('pointerdown', e => { e.preventDefault(); if (el.setPointerCapture) el.setPointerCapture(e.pointerId); down(); });
    el.addEventListener('pointerup', e => { e.preventDefault(); up(); });
    el.addEventListener('pointercancel', e => { e.preventDefault(); up(); });
  }

  bindHold(leftBtn, () => moveDir = -1, () => { if (moveDir === -1) moveDir = 0; });
  bindHold(rightBtn, () => moveDir = 1, () => { if (moveDir === 1) moveDir = 0; });
  bindHold(fireBtn, () => firing = true, () => firing = false);

  function setPointer(e) { ship.targetWorldX = clamp((e.clientX - W / 2) / roadHalf, -1, 1); }

  cvs.addEventListener('pointerdown', e => {
    if (state.mode !== 'playing') return;
    dragging = true; if (cvs.setPointerCapture) cvs.setPointerCapture(e.pointerId); setPointer(e);
  });
  cvs.addEventListener('pointermove', e => { if (dragging) setPointer(e); });
  ['pointerup', 'pointercancel'].forEach(evt => { cvs.addEventListener(evt, () => { dragging = false; }); });

  window.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') { moveDir = -1; e.preventDefault(); }
    if (e.key === 'ArrowRight') { moveDir = 1; e.preventDefault(); }
    if (e.key === ' ' || e.key === 'ArrowUp') { firing = true; e.preventDefault(); }
    if (e.key === 'p' || e.key === 'P' || e.key === 'Escape') togglePause();
  });

  window.addEventListener('keyup', e => {
    if (e.key === 'ArrowLeft' && moveDir === -1) moveDir = 0;
    if (e.key === 'ArrowRight' && moveDir === 1) moveDir = 0;
    if (e.key === ' ' || e.key === 'ArrowUp') firing = false;
  });

  document.addEventListener('contextmenu', e => e.preventDefault());
  document.addEventListener('gesturestart', e => e.preventDefault());
  document.addEventListener('visibilitychange', () => { if (document.hidden && state.mode === 'playing') togglePause(); });

  updateHUD();
  updateMusicButtons();
  updateAutofireButton();
})();