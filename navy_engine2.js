(function () {
  'use strict';

  const GAME_LEVEL = 2;

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

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      -webkit-tap-highlight-color: transparent;
    }

    html, body {
      position: fixed;
      inset: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
      background: #010b12;
      font-family: 'Orbitron', 'Courier New', monospace;
      touch-action: none;
      user-select: none;
      overscroll-behavior: none;
    }

    #game {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      display: block;
      z-index: 0;
    }

    .hidden { display: none !important; }

    #hud {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 8px;
      padding: calc(6px + env(safe-area-inset-top)) calc(10px + env(safe-area-inset-right)) 6px calc(10px + env(safe-area-inset-left));
      z-index: 10;
      color: #fff;
      font-size: clamp(10px, 1.7vh, 14px);
      letter-spacing: 1px;
      text-shadow: 0 0 8px var(--cyan);
      pointer-events: none;
    }

    .hud-box {
      padding: 5px 9px;
      border: 1px solid rgba(0,255,255,.35);
      border-radius: 10px;
      background: rgba(0,0,0,.28);
      box-shadow: 0 0 14px rgba(0,255,255,.12);
      backdrop-filter: blur(4px);
      white-space: nowrap;
    }

    #livesVal { color: #ff5577; text-shadow: 0 0 10px #f0f; }

    .hud-btn, #pauseBtn {
      pointer-events: auto;
      min-width: clamp(34px, 5vh, 42px);
      height: clamp(34px, 5vh, 42px);
      padding: 0 8px;
      border-radius: 10px;
      font-size: clamp(13px, 2.2vh, 18px);
    }

    #pauseBtn {
      border: 1px solid var(--cyan);
      background: rgba(0,255,255,.08);
      color: var(--cyan);
      box-shadow: 0 0 14px rgba(0,255,255,.25);
    }

    .hud-btn {
      border: 1px solid var(--magenta);
      background: rgba(255,0,255,.08);
      color: var(--magenta);
      box-shadow: 0 0 14px rgba(255,0,255,.25);
    }

    .hud-btn.off { color: #999; border-color: #555; box-shadow: none; }

    #powerHud {
      position: fixed;
      top: calc(44px + env(safe-area-inset-top));
      left: calc(8px + env(safe-area-inset-left));
      z-index: 10;
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      max-width: 72vw;
      pointer-events: none;
    }

    .power-tag {
      padding: 4px 8px;
      border: 1px solid;
      border-radius: 8px;
      font-size: clamp(9px, 1.5vh, 11px);
      background: rgba(0,0,0,.35);
      backdrop-filter: blur(4px);
      text-shadow: 0 0 8px currentColor;
    }

    #orientationHint {
      display: none;
      position: fixed;
      top: calc(48px + env(safe-area-inset-top));
      left: 50%;
      transform: translateX(-50%);
      z-index: 30;
      padding: 6px 12px;
      border-radius: 12px;
      background: rgba(0,255,200,.10);
      border: 1px solid rgba(0,255,200,.35);
      color: #7fffd4;
      font-size: 11px;
      pointer-events: none;
      text-align: center;
    }

    @media (orientation: portrait) {
      #orientationHint { display: block; }
    }

    #controls {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      padding: calc(10px + env(safe-area-inset-bottom)) calc(14px + env(safe-area-inset-right)) calc(10px + env(safe-area-inset-bottom)) calc(14px + env(safe-area-inset-left));
      z-index: 10;
      pointer-events: none;
    }

    .pad, .action {
      pointer-events: auto;
      display: flex;
      align-items: center;
      gap: clamp(8px, 1.6vh, 14px);
      padding: clamp(8px, 1.5vh, 12px);
      border-radius: 26px;
      background: rgba(0,16,24,.34);
      border: 1px solid rgba(0,255,220,.22);
      backdrop-filter: blur(7px);
    }

    .ctrl-btn {
      width: clamp(52px, 10.5vh, 76px);
      height: clamp(52px, 10.5vh, 76px);
      border-radius: 50%;
      border: 2px solid rgba(0,255,220,.65);
      background: rgba(0,255,220,.07);
      color: #7fffd4;
      font-size: clamp(20px, 4.3vh, 30px);
      font-weight: 900;
      touch-action: none;
    }

    #fireBtn {
      width: clamp(70px, 14vh, 102px);
      height: clamp(70px, 14vh, 102px);
      border-color: rgba(255,120,0,.75);
      color: #ff9a3d;
      background: rgba(255,120,0,.08);
      font-size: clamp(26px, 5.6vh, 38px);
    }

    .ctrl-btn:active { transform: scale(.94); }

    .overlay {
      position: fixed;
      inset: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 18px;
      background:
        radial-gradient(circle at 50% 18%, rgba(0,255,200,.14), transparent 35%),
        radial-gradient(circle at 50% 82%, rgba(255,120,0,.12), transparent 30%),
        rgba(1,8,14,.90);
      z-index: 20;
      color: #fff;
      overflow-y: auto;
    }

    .overlay h1, .overlay h2 {
      font-size: clamp(24px, 6vh, 60px);
      letter-spacing: 4px;
      color: #7fffd4;
      text-shadow: 0 0 8px #0ff, 0 0 24px #ff7a00;
      margin-bottom: 12px;
    }

    .overlay p {
      max-width: 760px;
      line-height: 1.55;
      color: #dff;
      margin-bottom: 8px;
      font-size: clamp(12px, 2.1vh, 15px);
    }

    .menu-row {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      justify-content: center;
      margin: 10px 0;
    }

    .toggle {
      padding: 10px 14px;
      border: 2px solid rgba(0,255,220,.55);
      background: rgba(0,255,220,.05);
      color: #7fffd4;
      border-radius: 12px;
      font-weight: 700;
      font-size: clamp(11px, 1.9vh, 14px);
    }

    .toggle.active {
      background: rgba(0,255,220,.18);
      box-shadow: 0 0 18px rgba(0,255,220,.4);
    }

    .diff-btn.active {
      border-color: #ff9a3d;
      color: #ff9a3d;
      background: rgba(255,120,0,.12);
    }

    .btn {
      margin-top: 14px;
      padding: 14px 28px;
      font-size: clamp(16px, 3.2vh, 22px);
      font-weight: 900;
      color: #7fffd4;
      background: rgba(0,255,220,.06);
      border: 2px solid #0ff;
      border-radius: 16px;
      text-shadow: 0 0 10px #0ff;
    }

    .btn[disabled] {
      opacity: .35;
      pointer-events: none;
    }

    #countdownScore {
      font-size: clamp(38px, 10vh, 76px);
      color: #ff0;
      text-shadow: 0 0 18px #ff0, 0 0 42px #f80;
      margin: 14px 0;
      font-weight: 900;
    }

    .tiny {
      margin-top: 12px;
      font-size: clamp(10px, 1.7vh, 12px);
      color: #8fdfff;
    }

    .power-list {
      display: grid;
      grid-template-columns: repeat(3, minmax(100px, 1fr));
      gap: 7px;
      margin-top: 10px;
      font-size: clamp(10px, 1.8vh, 13px);
    }

    .power-list div {
      padding: 7px 8px;
      border: 1px solid rgba(255,255,255,.14);
      border-radius: 10px;
      background: rgba(255,255,255,.04);
    }
  `;

  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  const html = `
    <canvas id="game"></canvas>

    <div id="orientationHint">📱 Gira el dispositivo a horizontal para una mejor experiencia</div>

    <div id="hud">
      <div class="hud-box">SCORE <span id="scoreVal">0</span></div>
      <div class="hud-box">LVL <span id="levelVal">1</span></div>
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
      <h1>⚡ NAVY PROJECT II ⚡</h1>
      <p>
        <b>PANTALLA 2 — MAR DIGITAL</b><br />
        Arrastra sobre la pantalla para mover la nave.<br />
        Usa <b>◀ ▶</b> y <b>⚡</b> para disparar.<br />
        Nueva zona: <b>HACK MODE</b> y <b>cadena de energía</b>.<br />
        Si caes, regresarás a la pantalla 1.
      </p>

      <div class="menu-row">
        <button class="toggle diff-btn" data-diff="easy">FÁCIL</button>
        <button class="toggle diff-btn" data-diff="normal">NORMAL</button>
        <button class="toggle diff-btn" data-diff="hard">DIFÍCIL</button>
      </div>

      <div class="menu-row">
        <button id="autofireBtn" class="toggle">AUTOFIRE: OFF</button>
        <button id="musicBtn" class="toggle">MÚSICA: ON</button>
      </div>

      <div class="power-list">
        <div style="color:#0ff;">🛡 ESCUDO</div>
        <div style="color:#f0f;">⚡ OVERDRIVE</div>
        <div style="color:#ff0;">▲ TRI-SHOT</div>
        <div style="color:#0f8;">♥ NANO-REPAIR</div>
        <div style="color:#f33;">✸ EMP</div>
        <div style="color:#b26bff;">×2 SCORE</div>
      </div>

      <button id="playBtn" class="btn">INICIAR PANTALLA 2</button>
      <div class="tiny">Música y SFX synthwave generados en tiempo real</div>
    </div>

    <div id="pauseOverlay" class="overlay hidden">
      <h2>⏸ NAVY PROJECT II</h2>
      <p>Sistema en pausa.</p>
      <button id="resumeBtn" class="btn">CONTINUAR</button>
      <button id="restartBtn" class="btn">REINICIAR</button>
    </div>

    <div id="gameOverOverlay" class="overlay hidden">
      <h2 id="gameOverTitle">HAS CAÍDO</h2>
      <p id="finalScore"></p>
      <button id="retryBtn" class="btn">VOLVER A PANTALLA 1</button>
    </div>

    <div id="victoryOverlay" class="overlay hidden">
      <h2>¡PANTALLA 2 SUPERADA!</h2>
      <p>PUNTUACIÓN</p>
      <div id="countdownScore">0</div>
      <button id="nextLevelBtn" class="btn" disabled>CARGANDO...</button>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', html);

  const $ = id => document.getElementById(id);

  function rand(a, b) {
    return a + Math.random() * (b - a);
  }

  function randInt(a, b) {
    return Math.floor(rand(a, b + 1));
  }

  function clamp(v, a, b) {
    return Math.max(a, Math.min(b, v));
  }

  function randHue(range) {
    return rand(range[0], range[1]) % 360;
  }

  function loadPref(key, def) {
    try {
      const v = localStorage.getItem(key);
      return v === null ? def : v;
    } catch (e) {
      return def;
    }
  }

  function savePref(key, value) {
    try {
      localStorage.setItem(key, String(value));
    } catch (e) {}
  }

  let difficulty = loadPref('navyDifficulty', 'normal');
  let autofire = loadPref('navyAutofire', 'off') === 'on';
  let musicEnabled = loadPref('navyMusic', 'on') === 'on';

  if (!DIFFICULTIES()[difficulty]) difficulty = 'normal';

  function DIFFICULTIES() {
    return {
      easy: {
        lives: 6, speed: 0.82, spawn: 1.25, power: 0.32, duration: 1.5,
        fireDelay: 0.18, rapidDelay: 0.08, enemyShootMul: 1.50, enemyShotSpeed: 0.78,
        shotHit: 0.12, maxPlayerBullets: 18, maxEnemyBullets: 16,
        maxParticles: 130, toSpawn: lvl => 10 + lvl * 3
      },
      normal: {
        lives: 5, speed: 1.08, spawn: 0.90, power: 0.22, duration: 1.0,
        fireDelay: 0.22, rapidDelay: 0.10, enemyShootMul: 1.0, enemyShotSpeed: 1.0,
        shotHit: 0.15, maxPlayerBullets: 24, maxEnemyBullets: 22,
        maxParticles: 170, toSpawn: lvl => 13 + lvl * 4
      },
      hard: {
        lives: 3, speed: 1.38, spawn: 0.68, power: 0.16, duration: 0.8,
        fireDelay: 0.26, rapidDelay: 0.12, enemyShootMul: 0.75, enemyShotSpeed: 1.25,
        shotHit: 0.18, maxPlayerBullets: 30, maxEnemyBullets: 28,
        maxParticles: 210, toSpawn: lvl => 16 + lvl * 5
      }
    };
  }

  const scoreVal = $('scoreVal');
  const levelVal = $('levelVal');
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

  const cvs = $('game');
  const ctx = cvs.getContext('2d');

  let W = 0;
  let H = 0;
  let horizon = 0;
  let roadHalf = 0;
  let sizeScale = 1;
  let stars = [];
  let skyline = [];
  let dataStreams = [];
  let SHIP_Z = 140;

  const CAM = 300;
  const Z_FAR = 1500;
  const BPM = 124;

  function computeShipZ() {
    const desiredY = H - Math.max(88, H * 0.22);
    const p = clamp((desiredY - horizon) / (H - horizon), 0.30, 0.88);
    return Math.max(70, CAM / p - CAM);
  }

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
    SHIP_Z = computeShipZ();

    stars = Array.from({ length: 80 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.6 + 0.2,
      tw: Math.random() * Math.PI * 2
    }));

    skyline = Array.from({ length: 42 }, () => ({
      x: Math.random(),
      w: rand(0.008, 0.028),
      h: rand(0.03, 0.14),
      hue: rand(165, 215),
      windows: Array.from({ length: randInt(3, 8) }, () => ({
        dx: Math.random(),
        dy: Math.random()
      }))
    }));

    dataStreams = Array.from({ length: 38 }, () => ({
      x: Math.random(),
      y: Math.random(),
      speed: rand(0.08, 0.45),
      len: rand(0.03, 0.12),
      hue: rand(155, 205)
    }));
  }

  window.addEventListener('resize', resize);
  window.addEventListener('orientationchange', resize);

  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', resize);
  }

  const POWER_TYPES = {
    SHIELD: { color: '#0ff', label: '🛡', name: 'ESCUDO' },
    RAPID: { color: '#f0f', label: '⚡', name: 'OVERDRIVE' },
    TRIPLE: { color: '#ff0', label: '▲', name: 'TRI-SHOT' },
    REPAIR: { color: '#0f8', label: '♥', name: 'NANO-REPAIR' },
    EMP: { color: '#f33', label: '✸', name: 'EMP' },
    MULTI: { color: '#b26bff', label: '×2', name: 'SCORE x2' }
  };

  const ENEMY_TYPES = {
    bit: {
      hp: 1, size: [22, 34], speed: [360, 440], shoot: [999, 999], score: 15,
      hue: [160, 190], aim: 0, amp: [0.10, 0.30], freq: [1.2, 2.2]
    },
    wasp: {
      hp: 2, size: [30, 46], speed: [300, 380], shoot: [1.4, 2.4], score: 25,
      hue: [35, 60], aim: 0.70, amp: [0.08, 0.20], freq: [0.8, 1.6]
    },
    orbiter: {
      hp: 3, size: [38, 58], speed: [230, 300], shoot: [1.6, 2.6], score: 35,
      hue: [280, 320], aim: 0.50, amp: [0.05, 0.15], freq: [0.6, 1.2]
    },
    angler: {
      hp: 4, size: [52, 78], speed: [160, 220], shoot: [1.8, 2.8], score: 50,
      hue: [195, 235], aim: 0.60, amp: [0.03, 0.10], freq: [0.4, 0.8]
    },
    reaper: {
      hp: 2, size: [34, 52], speed: [340, 420], shoot: [2.0, 3.2], score: 30,
      hue: [350, 380], aim: 0.65, amp: [0.20, 0.40], freq: [1.4, 2.4]
    },
    boss: {
      hp: 1, size: [150, 180], speed: [70, 90], shoot: [1.1, 1.6], score: 1500,
      hue: [300, 340], aim: 0.80, amp: [0.35, 0.35], freq: [0.4, 0.4]
    }
  };

  const state = {
    mode: 'menu',
    score: 0,
    high: Number(loadPref('navyHigh', 0)),
    level: 1,
    lives: 5,
    maxLives: 7,
    time: 0,
    last: 0,
    shake: 0,
    flash: 0,
    combo: 0,
    comboTimer: 0,
    bossActive: false,
    victoryPending: false,
    hackEnergy: 0
  };

  const ship = {
    worldX: 0,
    targetWorldX: 0,
    prevWorldX: 0,
    bank: 0,
    lastFire: -999,
    invuln: 1,
    muzzle: 0
  };

  let bullets = [];
  let aliens = [];
  let enemyBullets = [];
  let powerups = [];
  let particles = [];
  let texts = [];
  let lightnings = [];

  let moveDir = 0;
  let firing = false;
  let dragging = false;

  let countdownInterval = null;
  let redirectTimeout = null;

  const effects = {
    rapid: 0,
    triple: 0,
    multi: 0,
    shield: 0,
    hack: 0
  };

  function currentCfg() {
    return DIFFICULTIES()[difficulty] || DIFFICULTIES().normal;
  }

  function makeLevelCfg(lvl) {
    const cfg = currentCfg();

    if (lvl % 5 === 0) {
      return {
        toSpawn: 1,
        spawned: 0,
        interval: 1,
        timer: 1.2,
        boss: true
      };
    }

    return {
      toSpawn: cfg.toSpawn(lvl),
      spawned: 0,
      interval: Math.max(0.22, (0.88 - lvl * 0.04) * cfg.spawn),
      timer: 1.0,
      boss: false
    };
  }

  let levelCfg = makeLevelCfg(1);

  function updateHUD() {
    scoreVal.textContent = state.score;
    levelVal.textContent = state.level;

    const lives = Math.max(0, state.lives);
    const empty = Math.max(0, state.maxLives - lives);

    livesVal.textContent = '♥'.repeat(lives) + '♡'.repeat(empty);
  }

  function project(z, worldX = 0) {
    const p = CAM / (CAM + Math.max(0, z));

    return {
      x: W / 2 + worldX * roadHalf * p,
      y: horizon + (H - horizon) * p,
      s: p
    };
  }

  function getShipRender() {
    const pr = project(SHIP_Z, ship.worldX);
    const sc = pr.s * sizeScale * 1.35;

    return {
      x: pr.x,
      y: pr.y - 22 * sc,
      baseY: pr.y,
      sc,
      p: pr.s
    };
  }

  function projectBulletAtZ(b, z) {
    const p = CAM / (CAM + Math.max(0, z));
    const x = W / 2 + b.worldX * roadHalf * p;
    const y = horizon + (b.originY - horizon) * (p / b.pShip);

    return { x, y, s: p };
  }

  function getComboMult() {
    return Math.min(4, 1 + Math.floor(state.combo / 8) * 0.5);
  }

  function saveHighIfNecessary() {
    if (state.score > state.high) {
      state.high = state.score;
      savePref('navyHigh', state.high);
    }
  }

  const Synth = {
    ctx: null,
    musicGain: null,
    sfxGain: null,
    musicTimer: null,
    nextTime: 0,
    step: 0,

    ready() {
      return !!(this.ctx && this.musicGain && this.sfxGain);
    },

    init() {
      if (this.ctx) return;

      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;

      try {
        this.ctx = new AC();

        const master = this.ctx.createGain();
        master.gain.value = 0.94;

        const comp = this.ctx.createDynamicsCompressor();
        const t = this.ctx.currentTime;

        comp.threshold.setValueAtTime(-20, t);
        comp.knee.setValueAtTime(24, t);
        comp.ratio.setValueAtTime(5, t);
        comp.attack.setValueAtTime(0.003, t);
        comp.release.setValueAtTime(0.25, t);

        master.connect(comp);
        comp.connect(this.ctx.destination);

        this.musicGain = this.ctx.createGain();
        this.musicGain.gain.value = 0.48;
        this.musicGain.connect(master);

        this.sfxGain = this.ctx.createGain();
        this.sfxGain.gain.value = 0.50;
        this.sfxGain.connect(master);
      } catch (e) {
        this.ctx = null;
        this.musicGain = null;
        this.sfxGain = null;
      }
    },

    resume() {
      if (this.ctx && this.ctx.state !== 'running') {
        this.ctx.resume().catch(() => {});
      }
    },

    suspend() {
      if (this.ctx && this.ctx.state === 'running') {
        this.ctx.suspend().catch(() => {});
      }
    },

    startMusic(force = false) {
      if (!musicEnabled || !this.ready()) return;
      if (this.musicTimer && !force) return;

      this.stopMusic();

      this.step = 0;
      this.nextTime = this.ctx.currentTime + 0.06;
      this.musicTimer = setInterval(() => this.schedule(), 25);
    },

    stopMusic() {
      if (this.musicTimer) {
        clearInterval(this.musicTimer);
        this.musicTimer = null;
      }
    },

    schedule() {
      if (!this.ready()) return;

      const spb = 60 / BPM / 4;

      while (this.nextTime < this.ctx.currentTime + 0.12) {
        this.playStep(this.step, this.nextTime);
        this.nextTime += spb;
        this.step++;
      }
    },

    tone(type, freq, time, dur, vol, dest, filterFreq, glideTo) {
      if (!this.ready()) return;

      const o = this.ctx.createOscillator();
      const g = this.ctx.createGain();

      o.type = type;
      o.frequency.setValueAtTime(freq, time);

      if (glideTo) {
        o.frequency.exponentialRampToValueAtTime(glideTo, time + dur);
      }

      g.gain.setValueAtTime(0.0001, time);
      g.gain.linearRampToValueAtTime(vol, time + 0.008);
      g.gain.exponentialRampToValueAtTime(0.0001, time + dur);

      o.connect(g);

      if (filterFreq) {
        const f = this.ctx.createBiquadFilter();
        f.type = 'lowpass';
        f.frequency.setValueAtTime(filterFreq, time);
        g.connect(f);
        f.connect(dest);
      } else {
        g.connect(dest);
      }

      o.start(time);
      o.stop(time + dur + 0.05);
    },

    noise(time, dur, vol, filterStart, filterEnd, dest) {
      if (!this.ready()) return;

      const len = Math.max(1, Math.floor(this.ctx.sampleRate * dur));
      const buffer = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);

      for (let i = 0; i < len; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const src = this.ctx.createBufferSource();
      src.buffer = buffer;

      const g = this.ctx.createGain();
      g.gain.setValueAtTime(vol, time);
      g.gain.exponentialRampToValueAtTime(0.0001, time + dur);

      const f = this.ctx.createBiquadFilter();
      f.type = 'lowpass';
      f.frequency.setValueAtTime(filterStart, time);
      f.frequency.exponentialRampToValueAtTime(Math.max(20, filterEnd), time + dur);

      src.connect(f);
      f.connect(g);
      g.connect(dest);

      src.start(time);
      src.stop(time + dur + 0.05);
    },

    kick(time) {
      if (!this.ready()) return;

      const o = this.ctx.createOscillator();
      const g = this.ctx.createGain();

      o.type = 'sine';
      o.frequency.setValueAtTime(170, time);
      o.frequency.exponentialRampToValueAtTime(42, time + 0.10);

      g.gain.setValueAtTime(0.46, time);
      g.gain.exponentialRampToValueAtTime(0.0001, time + 0.14);

      o.connect(g);
      g.connect(this.musicGain);

      o.start(time);
      o.stop(time + 0.18);
    },

    playStep(step, time) {
      const bar = Math.floor(step / 16) % 4;
      const s = step % 16;

      const chords = [
        {
          bass: 82.41,
          arp: [164.81, 196.00, 246.94, 329.63],
          pad: [82.41, 123.47, 164.81, 246.94]
        },
        {
          bass: 65.41,
          arp: [130.81, 164.81, 196.00, 261.63],
          pad: [65.41, 98.00, 130.81, 196.00]
        },
        {
          bass: 98.00,
          arp: [146.83, 196.00, 246.94, 293.66],
          pad: [98.00, 146.83, 196.00, 246.94]
        },
        {
          bass: 73.42,
          arp: [146.83, 185.00, 220.00, 293.66],
          pad: [73.42, 110.00, 146.83, 220.00]
        }
      ];

      const c = chords[bar];

      if (s % 4 === 0) this.kick(time);

      if (s === 4 || s === 12) {
        this.noise(time, 0.12, 0.16, 1800, 300, this.musicGain);
      }

      if (s % 2 === 0) {
        this.noise(time, 0.03, 0.03, 9000, 5000, this.musicGain);
      }

      if (s % 4 === 2) {
        this.noise(time, 0.06, 0.05, 12000, 6000, this.musicGain);
      }

      if (s % 4 === 0) {
        this.tone('sawtooth', c.bass, time, 0.18, 0.26, this.musicGain, 500);
        this.tone('sine', c.bass / 2, time, 0.20, 0.18, this.musicGain, 220);
      }

      if (s % 2 === 1) {
        this.tone('square', c.bass * 2, time, 0.08, 0.10, this.musicGain, 1200);
      }

      const note = c.arp[s % c.arp.length];
      this.tone('square', note, time, 0.07, 0.055, this.musicGain, 2600);

      if (s === 0) {
        c.pad.forEach(f => {
          this.tone('sawtooth', f, time, 1.45, 0.028, this.musicGain, 850);
        });
      }
    },

    shoot() {
      if (!this.ready()) return;
      this.tone('square', 980, this.ctx.currentTime, 0.07, 0.10, this.sfxGain, 3200, 200);
    },

    enemyShoot() {
      if (!this.ready()) return;
      const t = this.ctx.currentTime;
      this.tone('sawtooth', 320, t, 0.11, 0.07, this.sfxGain, 1700, 110);
      this.tone('square', 500, t, 0.05, 0.04, this.sfxGain, 2400, 210);
    },

    explosion() {
      if (!this.ready()) return;
      const t = this.ctx.currentTime;
      this.noise(t, 0.30, 0.24, 1400, 55, this.sfxGain);
      this.tone('sawtooth', 120, t, 0.26, 0.10, this.sfxGain, 550, 32);
    },

    power() {
      if (!this.ready()) return;
      const t = this.ctx.currentTime;
      [392, 523, 659, 880].forEach((f, i) => {
        this.tone('square', f, t + i * 0.05, 0.09, 0.11, this.sfxGain, 4200);
      });
    },

    hit() {
      if (!this.ready()) return;
      const t = this.ctx.currentTime;
      this.tone('sawtooth', 200, t, 0.25, 0.20, this.sfxGain, 900, 40);
      this.noise(t, 0.18, 0.12, 1200, 100, this.sfxGain);
    },

    level() {
      if (!this.ready()) return;
      const t = this.ctx.currentTime;
      [220, 330, 440, 660].forEach((f, i) => {
        this.tone('triangle', f, t + i * 0.08, 0.14, 0.14, this.sfxGain, 3500);
      });
    },

    gameover() {
      if (!this.ready()) return;
      const t = this.ctx.currentTime;
      [330, 262, 196, 131].forEach((f, i) => {
        this.tone('sawtooth', f, t + i * 0.16, 0.32, 0.14, this.sfxGain, 1200);
      });
    },

    bossWarn() {
      if (!this.ready()) return;
      const t = this.ctx.currentTime;
      [110, 110, 146.83, 110].forEach((f, i) => {
        this.tone('sawtooth', f, t + i * 0.14, 0.20, 0.14, this.sfxGain, 700);
      });
    },

    hack() {
      if (!this.ready()) return;
      const t = this.ctx.currentTime;
      [523, 659, 784, 1046].forEach((f, i) => {
        this.tone('square', f, t + i * 0.045, 0.08, 0.10, this.sfxGain, 5000);
      });
    }
  };

  function updateMusicButtons() {
    if (musicBtn) {
      musicBtn.textContent = `MÚSICA: ${musicEnabled ? 'ON' : 'OFF'}`;
      musicBtn.classList.toggle('active', musicEnabled);
    }

    if (hudMusicBtn) {
      hudMusicBtn.textContent = musicEnabled ? '♪' : '♪✕';
      hudMusicBtn.classList.toggle('off', !musicEnabled);
    }
  }

  function updateDifficultyButtons() {
    document.querySelectorAll('.diff-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.diff === difficulty);
    });
  }

  function updateAutofireButton() {
    autofireBtn.textContent = `AUTOFIRE: ${autofire ? 'ON' : 'OFF'}`;
    autofireBtn.classList.toggle('active', autofire);
  }

  function setMusicEnabled(value) {
    musicEnabled = value;
    savePref('navyMusic', musicEnabled ? 'on' : 'off');
    updateMusicButtons();

    if (!musicEnabled) {
      Synth.stopMusic();
    } else if (state.mode === 'playing') {
      try {
        Synth.init();
        Synth.resume();
        Synth.startMusic(false);
      } catch (e) {}
    }
  }

  function startGame() {
    if (countdownInterval) clearInterval(countdownInterval);
    if (redirectTimeout) clearTimeout(redirectTimeout);

    try {
      Synth.init();
      Synth.resume();

      if (musicEnabled) Synth.startMusic(true);
      else Synth.stopMusic();
    } catch (e) {}

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

    state.score = 0;
    state.level = 1;
    state.lives = cfg.lives;
    state.maxLives = cfg.lives + 2;
    state.time = 0;
    state.shake = 0;
    state.flash = 0;
    state.combo = 0;
    state.comboTimer = 0;
    state.bossActive = false;
    state.victoryPending = false;
    state.hackEnergy = 0;

    bullets = [];
    aliens = [];
    enemyBullets = [];
    powerups = [];
    particles = [];
    texts = [];
    lightnings = [];

    effects.rapid = 0;
    effects.triple = 0;
    effects.multi = 0;
    effects.shield = 0;
    effects.hack = 0;

    ship.worldX = 0;
    ship.targetWorldX = 0;
    ship.prevWorldX = 0;
    ship.bank = 0;
    ship.invuln = 1.5;
    ship.lastFire = -999;
    ship.muzzle = 0;

    levelCfg = makeLevelCfg(1);

    firing = false;
    moveDir = 0;
  }

  function togglePause() {
    if (state.mode === 'playing') {
      state.mode = 'paused';
      pauseOverlay.classList.remove('hidden');

      try {
        Synth.suspend();
      } catch (e) {}
    } else if (state.mode === 'paused') {
      state.mode = 'playing';
      pauseOverlay.classList.add('hidden');

      try {
        Synth.resume();
        if (musicEnabled) Synth.startMusic(false);
        else Synth.stopMusic();
      } catch (e) {}
    }
  }

  function endGame() {
    state.mode = 'gameover';
    saveHighIfNecessary();

    try {
      Synth.stopMusic();
      Synth.gameover();
    } catch (e) {}

    controls.classList.add('hidden');

    finalScore.innerHTML = `PUNTUACIÓN: ${state.score}<br>RÉCORD: ${state.high}<br><br>Regresando a Pantalla 1...`;

    gameOverOverlay.classList.remove('hidden');

    if (redirectTimeout) clearTimeout(redirectTimeout);

    redirectTimeout = setTimeout(() => {
      window.location.href = 'navy_project.html';
    }, 3500);
  }

  function nextLevel() {
    state.level++;
    levelCfg = makeLevelCfg(state.level);
    ship.invuln = Math.max(ship.invuln, 1.4);
    enemyBullets = [];

    try {
      Synth.level();
    } catch (e) {}

    addText(W / 2, H * 0.35, `NIVEL ${state.level}`, '#7fffd4', 1.4, 30);
    updateHUD();
  }

  function loseLife() {
    if (state.victoryPending) return;
    if (ship.invuln > 0) return;

    state.lives--;
    ship.invuln = 2.2;
    state.shake = 18;
    state.flash = 1;
    state.combo = 0;
    state.comboTimer = 0;

    try {
      Synth.hit();
    } catch (e) {}

    updateHUD();

    if (state.lives <= 0) {
      endGame();
    }
  }

  function chooseEnemyType() {
    const lvl = state.level;

    const table = [
      { type: 'bit', w: 28 },
      { type: 'wasp', w: 22 + lvl },
      { type: 'orbiter', w: 16 + lvl * 0.9 },
      { type: 'angler', w: 10 + lvl * 0.7 },
      { type: 'reaper', w: 12 + lvl * 1.2 }
    ];

    const total = table.reduce((acc, x) => acc + x.w, 0);
    let r = Math.random() * total;

    for (const item of table) {
      if (r < item.w) return item.type;
      r -= item.w;
    }

    return 'bit';
  }

  function spawnBoss() {
    const cfg = currentCfg();
    const def = ENEMY_TYPES.boss;

    const base = rand(def.size[0], def.size[1]) * (1 + state.level * 0.01);
    const hp = 70 + state.level * 8;

    aliens.push({
      type: 'boss',
      worldX: 0,
      baseWorldX: 0,
      z: Z_FAR,
      rNear: base * sizeScale,
      hp,
      maxHp: hp,
      speed: rand(def.speed[0], def.speed[1]) * cfg.speed,
      hue: randHue(def.hue),
      phase: rand(0, Math.PI * 2),
      amp: def.amp[0],
      freq: def.freq[0],
      shootTimer: 2.0,
      shootMin: def.shoot[0] * cfg.enemyShootMul,
      shootMax: def.shoot[1] * cfg.enemyShootMul,
      score: def.score + state.level * 60,
      aim: def.aim,
      bossPhase: 'enter',
      bossTimer: 0,
      dashTargetX: 0,
      flash: 0,
      hitCooldown: 0,
      pattern: 0,
      dead: false
    });

    levelCfg.spawned = 1;

    addText(W / 2, H * 0.24, 'KRAKEN NÚCLEO', '#f0f', 1.6, 34);
    addText(W / 2, H * 0.30, 'Prepárate para esquivar', '#ff9a3d', 1.2, 18);

    try {
      Synth.bossWarn();
    } catch (e) {}
  }

  function spawnAlien() {
    if (levelCfg.boss) {
      spawnBoss();
      return;
    }

    const cfg = currentCfg();
    const type = chooseEnemyType();
    const def = ENEMY_TYPES[type];

    const base = rand(def.size[0], def.size[1]) * (1 + Math.min(0.25, state.level * 0.02));
    const rNear = base * sizeScale;

    let hp = def.hp;

    if (state.level > 4) hp += 1;

    const speed = rand(def.speed[0], def.speed[1]) * cfg.speed * (1 + state.level * 0.03);
    const shootMin = def.shoot[0] * cfg.enemyShootMul * 1.15 / (1 + state.level * 0.03);
    const shootMax = def.shoot[1] * cfg.enemyShootMul * 1.15 / (1 + state.level * 0.03);
    const worldX = rand(-0.82, 0.82);

    aliens.push({
      type,
      worldX,
      baseWorldX: worldX,
      z: Z_FAR,
      rNear,
      hp,
      maxHp: hp,
      speed,
      hue: randHue(def.hue),
      phase: rand(0, Math.PI * 2),
      amp: rand(def.amp[0], def.amp[1]),
      freq: rand(def.freq[0], def.freq[1]),
      shootTimer: rand(shootMin * 0.7, shootMax * 1.2),
      shootMin,
      shootMax,
      score: def.score,
      aim: clamp(def.aim + state.level * 0.02, 0, 0.9),
      dead: false
    });

    levelCfg.spawned++;
  }

  function spawnPower(worldX, z) {
    const keys = [
      'SHIELD', 'RAPID', 'TRIPLE', 'EMP', 'MULTI', 'REPAIR',
      'RAPID', 'TRIPLE', 'SHIELD', 'MULTI'
    ];

    let type = keys[randInt(0, keys.length - 1)];

    if (type === 'REPAIR' && state.lives >= state.maxLives) {
      type = 'RAPID';
    }

    const cfg = currentCfg();

    powerups.push({
      worldX: clamp(worldX, -1, 1),
      z,
      type,
      speed: rand(260, 330) * cfg.speed,
      rot: 0,
      dead: false
    });
  }

  function addScore(amount, x, y, color) {
    const mult = (effects.multi > 0 ? 2 : 1) * getComboMult();
    const gained = Math.round(amount * mult);

    state.score += gained;

    if (x !== undefined) {
      addText(x, y, `+${gained}`, color || '#ff0', 0.8, 16);
    }

    updateHUD();
  }

  function addText(x, y, text, color, life, size) {
    texts.push({
      x,
      y,
      text,
      color,
      life,
      maxLife: life,
      size: size || 16,
      dead: false
    });
  }

  function addLightning(x1, y1, x2, y2, hue) {
    lightnings.push({
      x1,
      y1,
      x2,
      y2,
      hue,
      life: 0.18,
      maxLife: 0.18,
      dead: false
    });
  }

  function addHack(amount) {
    if (effects.hack > 0) return;

    state.hackEnergy += amount;

    if (state.hackEnergy >= 100) {
      state.hackEnergy = 0;
      effects.hack = 6;

      addText(W / 2, H * 0.26, '¡HACK MODE!', '#0ff', 1.2, 30);

      try {
        Synth.hack();
      } catch (e) {}
    }
  }

  function fire() {
    const cfg = currentCfg();
    let delay = effects.rapid > 0 ? cfg.rapidDelay : cfg.fireDelay;

    if (effects.hack > 0) delay *= 0.5;

    if (state.time - ship.lastFire < delay) return;

    ship.lastFire = state.time;
    ship.muzzle = 0.06;

    const sr = getShipRender();
    const shots = effects.triple > 0 ? 3 : 1;

    if (bullets.length + shots > cfg.maxPlayerBullets) {
      bullets.splice(0, bullets.length + shots - cfg.maxPlayerBullets);
    }

    const pushBullet = (localX, localY, vx) => {
      const worldX = ship.worldX + (localX * sr.sc) / (roadHalf * sr.p);
      const originY = sr.y + localY * sr.sc;

      bullets.push({
        worldX,
        z: SHIP_Z + 6,
        vx,
        pShip: sr.p,
        originY,
        dead: false
      });
    };

    if (effects.triple > 0) {
      pushBullet(0, -72, 0);
      pushBullet(-22, 6, 0);
      pushBullet(22, 6, 0);
    } else {
      pushBullet(0, -72, 0);
    }

    try {
      Synth.shoot();
    } catch (e) {}
  }

  function fireEnemyBullet(o, targetOffset = 0, speedMul = 1) {
    const cfg = currentCfg();

    if (enemyBullets.length >= cfg.maxEnemyBullets) return;

    const speed = rand(360, 480) * cfg.enemyShotSpeed * speedMul * (1 + state.level * 0.02);
    const time = Math.max(0.2, o.z / speed);

    const inaccuracy = (1 - o.aim) * 0.55;
    const targetX = clamp(ship.worldX + targetOffset + rand(-inaccuracy, inaccuracy), -1.1, 1.1);

    const vx = (targetX - o.worldX) / time;

    enemyBullets.push({
      worldX: o.worldX,
      z: o.z,
      vx,
      speed,
      rNear: 7 * sizeScale,
      hue: o.hue,
      checked: false,
      dead: false
    });

    try {
      Synth.enemyShoot();
    } catch (e) {}
  }

  function fireEnemyBulletRaw(o, vx, speedMul = 1) {
    const cfg = currentCfg();

    if (enemyBullets.length >= cfg.maxEnemyBullets) return;

    const speed = rand(360, 480) * cfg.enemyShotSpeed * speedMul * (1 + state.level * 0.02);

    enemyBullets.push({
      worldX: o.worldX,
      z: o.z,
      vx,
      speed,
      rNear: 7 * sizeScale,
      hue: o.hue,
      checked: false,
      dead: false
    });

    try {
      Synth.enemyShoot();
    } catch (e) {}
  }

  function enemyShoot(o) {
    if (o.type === 'bit') return;

    if (o.type === 'boss') {
      if (o.bossPhase === 'enter' || o.bossPhase === 'windup' || o.bossPhase === 'dash') {
        return;
      }

      o.pattern = (o.pattern || 0) + 1;

      if (o.pattern % 3 === 0) {
        for (let i = -3; i <= 3; i++) {
          fireEnemyBulletRaw(o, i * 0.14, 0.9);
        }
      } else if (o.pattern % 3 === 1) {
        fireEnemyBullet(o, -0.08, 1.1);
        fireEnemyBullet(o, 0.08, 1.1);
      } else {
        for (let i = 0; i < 5; i++) {
          fireEnemyBulletRaw(o, rand(-0.45, 0.45), rand(0.8, 1.2));
        }
      }

      return;
    }

    if (o.type === 'wasp') {
      fireEnemyBullet(o, 0, 1.0);
    } else if (o.type === 'orbiter') {
      for (let i = -1; i <= 1; i++) {
        fireEnemyBullet(o, i * 0.14, 0.9);
      }
    } else if (o.type === 'angler') {
      fireEnemyBullet(o, 0, 0.65);
    } else if (o.type === 'reaper') {
      fireEnemyBullet(o, rand(-0.10, 0.10), 1.1);
    }
  }

  function explode(x, y, hue, count = 16, spread = 1) {
    const cfg = currentCfg();

    if (particles.length + count > cfg.maxParticles) {
      const excess = particles.length + count - cfg.maxParticles;
      if (excess > 0) particles.splice(0, Math.min(excess, particles.length));
    }

    for (let i = 0; i < count; i++) {
      const a = rand(0, Math.PI * 2);
      const sp = rand(40, 240) * spread;

      particles.push({
        x,
        y,
        vx: Math.cos(a) * sp,
        vy: Math.sin(a) * sp,
        life: rand(0.25, 0.7),
        maxLife: 0.7,
        hue,
        size: rand(1.5, 4) * Math.max(0.6, spread),
        dead: false
      });
    }
  }

  function startVictorySequence() {
    if (state.victoryPending) return;

    state.victoryPending = true;

    setTimeout(() => {
      showVictory();
    }, 1600);
  }

  function showVictory() {
    state.mode = 'victory';
    controls.classList.add('hidden');
    victoryOverlay.classList.remove('hidden');

    saveHighIfNecessary();

    nextLevelBtn.textContent = 'VOLVER A PANTALLA 1';
    nextLevelBtn.disabled = true;

    let displayScore = state.score;
    countdownScore.textContent = displayScore;

    const step = Math.max(25, Math.floor(displayScore / 80));

    if (countdownInterval) clearInterval(countdownInterval);

    countdownInterval = setInterval(() => {
      displayScore -= step;

      if (displayScore <= 0) {
        displayScore = 0;
        clearInterval(countdownInterval);
        nextLevelBtn.disabled = false;
      }

      countdownScore.textContent = displayScore;
    }, 50);
  }

  function damageAlien(o, dmg, chainDepth = 0) {
    if (!o || o.dead) return;

    o.hp -= dmg;

    const pr = project(o.z, o.worldX);
    explode(pr.x, pr.y, o.hue, 4, Math.max(0.35, pr.s));

    if (o.hp <= 0) {
      destroyAlien(o, false, chainDepth);
    }
  }

  function destroyAlien(o, givePower = true, chainDepth = 0) {
    if (o.dead) return;

    o.dead = true;

    const cfg = currentCfg();
    const pr = project(o.z, o.worldX);

    state.combo++;
    state.comboTimer = 2.8;

    if (state.combo > 0 && state.combo % 10 === 0) {
      addText(W / 2, H * 0.26, `COMBO x${state.combo}!`, '#ff0', 1.0, 26);
    }

    if (o.type === 'boss') {
      state.shake = 35;
      state.flash = 1;

      explode(pr.x, pr.y, o.hue, 130, 2.8);

      for (let i = 0; i < 7; i++) {
        explode(
          pr.x + rand(-100, 100) * Math.max(0.5, pr.s),
          pr.y + rand(-50, 50) * Math.max(0.5, pr.s),
          o.hue + rand(-40, 40),
          26,
          1.8
        );
      }

      try {
        Synth.explosion();
        Synth.level();
      } catch (e) {}

      addScore(o.score, pr.x, pr.y, '#f0f');

      addText(W / 2, H * 0.30, 'KRAKEN NÚCLEO DESTRUIDO', '#0ff', 1.6, 28);
      addText(W / 2, H * 0.36, 'PANTALLA 2 LIBERADA', '#7fffd4', 1.4, 24);

      spawnPower(clamp(o.worldX - 0.12, -1, 1), o.z);
      spawnPower(clamp(o.worldX + 0.12, -1, 1), o.z);

      startVictorySequence();
    } else {
      explode(pr.x, pr.y, o.hue, 16, Math.max(0.5, pr.s));

      try {
        Synth.explosion();
      } catch (e) {}

      addScore(o.score, pr.x, pr.y, `hsl(${o.hue},100%,70%)`);

      addHack(o.type === 'angler' ? 10 : o.type === 'orbiter' ? 8 : 5);

      if (givePower) {
        const chance = cfg.power * (o.type === 'angler' ? 1.5 : 1);

        if (Math.random() < chance) {
          spawnPower(o.worldX, o.z);
        }
      }

      if (chainDepth < 2) {
        const chainChance = effects.hack > 0 ? 0.45 : 0.18;

        if (Math.random() < chainChance) {
          let target = null;

          for (const a of aliens) {
            if (a.dead || a === o || a.type === 'boss') continue;

            if (Math.abs(a.z - o.z) < 180 && Math.abs(a.worldX - o.worldX) < 0.45) {
              target = a;
              break;
            }
          }

          if (target) {
            const tp = project(target.z, target.worldX);

            addLightning(pr.x, pr.y, tp.x, tp.y, o.hue);
            damageAlien(target, 1, chainDepth + 1);
          }
        }
      }
    }
  }

  function applyPower(pu) {
    const def = POWER_TYPES[pu.type];
    const cfg = currentCfg();

    try {
      Synth.power();
    } catch (e) {}

    const pr = project(Math.max(0, pu.z), pu.worldX);
    addText(pr.x, pr.y, def.name, def.color, 1, 18);

    switch (pu.type) {
      case 'SHIELD':
        effects.shield = 8 * cfg.duration;
        break;

      case 'RAPID':
        effects.rapid = 8 * cfg.duration;
        break;

      case 'TRIPLE':
        effects.triple = 8 * cfg.duration;
        break;

      case 'MULTI':
        effects.multi = 10 * cfg.duration;
        break;

      case 'REPAIR':
        state.lives = Math.min(state.maxLives, state.lives + 1);
        updateHUD();
        break;

      case 'EMP':
        state.shake = 18;
        state.flash = Math.max(state.flash, 0.35);

        aliens.forEach(o => {
          const p = project(o.z, o.worldX);

          if (o.type === 'boss') {
            o.hp -= 20;
            explode(p.x, p.y, o.hue, 12, 1);

            if (o.hp <= 0) {
              destroyAlien(o);
            }
          } else {
            explode(p.x, p.y, o.hue, 10, Math.max(0.4, p.s));
            addScore(Math.floor(o.score / 2), p.x, p.y, '#f55');
            o.dead = true;
          }
        });

        aliens = aliens.filter(o => !o.dead);
        enemyBullets = [];
        break;
    }
  }

  function updateParticlesTexts(dt) {
    particles.forEach(p => {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += 60 * dt;
      p.life -= dt;

      if (p.life <= 0) p.dead = true;
    });

    texts.forEach(t => {
      t.y -= 28 * dt;
      t.life -= dt;

      if (t.life <= 0) t.dead = true;
    });

    lightnings.forEach(l => {
      l.life -= dt;
      if (l.life <= 0) l.dead = true;
    });

    particles = particles.filter(x => !x.dead);
    texts = texts.filter(x => !x.dead);
    lightnings = lightnings.filter(x => !x.dead);
  }

  function update(dt) {
    const cfg = currentCfg();

    state.time += dt;

    effects.rapid = Math.max(0, effects.rapid - dt);
    effects.triple = Math.max(0, effects.triple - dt);
    effects.multi = Math.max(0, effects.multi - dt);
    effects.shield = Math.max(0, effects.shield - dt);
    effects.hack = Math.max(0, effects.hack - dt);

    if (state.comboTimer > 0) {
      state.comboTimer -= dt;
      if (state.comboTimer <= 0) state.combo = 0;
    }

    ship.invuln = Math.max(0, ship.invuln - dt);
    ship.muzzle = Math.max(0, ship.muzzle - dt);

    state.flash = Math.max(0, state.flash - dt * 1.4);

    if (state.shake > 0) {
      state.shake = Math.max(0, state.shake - dt * 30);
    }

    if (state.victoryPending) {
      updateParticlesTexts(dt);
      updatePowerHud();
      return;
    }

    const hasBoss = levelCfg.boss || aliens.some(a => a.type === 'boss');
    state.bossActive = hasBoss;

    ship.prevWorldX = ship.worldX;

    if (moveDir !== 0) {
      ship.targetWorldX += moveDir * 2.1 * dt;
    }

    ship.targetWorldX = clamp(ship.targetWorldX, -1, 1);
    ship.worldX += (ship.targetWorldX - ship.worldX) * Math.min(1, dt * 15);
    ship.worldX = clamp(ship.worldX, -1, 1);

    const vx = (ship.worldX - ship.prevWorldX) / Math.max(dt, 0.0001);
    const targetBank = clamp(vx * 0.25, -1, 1);

    ship.bank += (targetBank - ship.bank) * Math.min(1, dt * 12);

    if (autofire || firing) {
      fire();
    }

    if (levelCfg.spawned < levelCfg.toSpawn) {
      levelCfg.timer -= dt;

      if (levelCfg.timer <= 0) {
        spawnAlien();
        levelCfg.timer = levelCfg.interval * rand(0.7, 1.3);
      }
    } else if (aliens.length === 0 && !state.victoryPending) {
      nextLevel();
    }

    bullets.forEach(b => {
      b.z += 1350 * dt;
      b.worldX += b.vx * dt;
      b.worldX = clamp(b.worldX, -1.2, 1.2);

      if (b.z > Z_FAR) b.dead = true;
    });

    aliens.forEach(o => {
      if (o.type !== 'boss') {
        o.z -= o.speed * dt;
        o.phase += o.freq * dt;
        o.worldX = clamp(o.baseWorldX + Math.sin(o.phase) * o.amp, -1, 1);
      }

      o.shootTimer -= dt;

      if (o.shootTimer <= 0 && o.z > 150 && o.z < 1300) {
        enemyShoot(o);
        o.shootTimer = rand(o.shootMin, o.shootMax) * rand(0.85, 1.25);
      }

      if (o.type === 'boss') {
        o.phase += o.freq * dt;
        o.bossTimer -= dt;
        o.hitCooldown = Math.max(0, o.hitCooldown - dt);

        if (o.flash > 0) o.flash = Math.max(0, o.flash - dt);

        const hoverZ = 680;

        if (o.bossPhase === 'enter') {
          o.z -= 260 * dt;
          o.worldX = Math.sin(o.phase) * 0.20;

          if (o.z <= hoverZ) {
            o.z = hoverZ;
            o.bossPhase = 'hover';
            o.bossTimer = rand(1.2, 2.2);
          }
        } else if (o.bossPhase === 'hover') {
          o.worldX = clamp(Math.sin(o.phase) * 0.45, -0.8, 0.8);
          o.z = hoverZ + Math.sin(o.phase * 1.7) * 40;

          if (o.bossTimer <= 0) {
            o.bossPhase = 'windup';
            o.bossTimer = 0.85;
            o.flash = 0.85;

            const side = Math.random();

            if (side < 0.60) {
              o.dashTargetX = 0;
            } else {
              o.dashTargetX = clamp(ship.worldX * 0.35, -0.35, 0.35);
            }

            addText(W / 2, H * 0.22, '¡EMBISTIDA!', '#f33', 0.9, 26);
          }
        } else if (o.bossPhase === 'windup') {
          o.worldX += (o.dashTargetX - o.worldX) * Math.min(1, dt * 4);
          o.z = hoverZ + Math.sin(animTime * 40) * 6;

          if (o.bossTimer <= 0) {
            o.bossPhase = 'dash';
            o.bossTimer = 0.55;
          }
        } else if (o.bossPhase === 'dash') {
          o.z -= 1500 * dt;
          o.worldX += (o.dashTargetX - o.worldX) * Math.min(1, dt * 8);

          if (o.z <= 45) {
            o.z = 45;
            o.bossPhase = 'retreat';
            o.bossTimer = 0.9;
          }
        } else if (o.bossPhase === 'retreat') {
          o.z += 650 * dt;
          o.worldX += (0 - o.worldX) * Math.min(1, dt * 2);

          if (o.z >= hoverZ || o.bossTimer <= 0) {
            o.z = Math.min(o.z, hoverZ);
            o.bossPhase = 'hover';
            o.bossTimer = rand(1.4, 2.6);
          }
        }

        if (o.z < 25) o.z = 25;

        if (
          o.hitCooldown <= 0 &&
          o.z < SHIP_Z + 90 &&
          o.z > SHIP_Z - 70 &&
          Math.abs(ship.worldX - o.worldX) < 0.52
        ) {
          if (effects.shield > 0) {
            addText(W / 2, H * 0.30, 'ESCUDO BLOQUEA IMPACTO', '#0ff', 1.0, 18);
            o.bossPhase = 'retreat';
            o.bossTimer = 1.0;
            o.z = Math.max(o.z, 120);
          } else {
            loseLife();
            o.bossPhase = 'retreat';
            o.bossTimer = 1.2;
            o.z = Math.max(o.z, 160);
          }

          o.hitCooldown = 1.5;
          state.shake = Math.max(state.shake, 20);
        }
      } else if (o.z <= 8) {
        o.dead = true;

        const pr = project(2, o.worldX);
        explode(pr.x, H - 25, o.hue, 18, 1.4);

        if (effects.shield > 0) {
          addScore(Math.floor(o.score / 2), pr.x, pr.y, '#0ff');
        } else {
          loseLife();
        }
      }
    });

    if (state.mode !== 'playing') return;

    for (const b of bullets) {
      if (b.dead) continue;

      for (const o of aliens) {
        if (o.dead) continue;

        if (Math.abs(b.z - o.z) < 100) {
          const hitRange = (o.rNear + (o.type === 'boss' ? 28 : 20)) / roadHalf;

          if (Math.abs(b.worldX - o.worldX) < hitRange) {
            b.dead = true;
            o.hp--;

            const pr = project(o.z, o.worldX);
            explode(pr.x, pr.y, o.hue, 4, Math.max(0.35, pr.s));

            if (o.hp <= 0) {
              destroyAlien(o);
            }

            break;
          }
        }
      }
    }

    const bulletDt = dt * (effects.hack > 0 ? 0.45 : 1);

    enemyBullets.forEach(b => {
      b.z -= b.speed * bulletDt;
      b.worldX += b.vx * bulletDt;
      b.worldX = clamp(b.worldX, -1.2, 1.2);

      if (!b.checked && b.z <= SHIP_Z + 8) {
        b.checked = true;

        const dx = Math.abs(b.worldX - ship.worldX);
        const pr = project(SHIP_Z, b.worldX);

        if (effects.shield > 0 && dx < 0.26) {
          b.dead = true;
          explode(pr.x, pr.y, 190, 6, 0.6);
        } else if (dx < cfg.shotHit) {
          b.dead = true;
          loseLife();
        } else {
          explode(pr.x, pr.y, b.hue, 3, 0.45);
        }
      }

      if (b.z <= 0) b.dead = true;
    });

    powerups.forEach(p => {
      p.z -= p.speed * dt;
      p.rot += dt * 3;

      if (p.z < 350) {
        const dx = ship.worldX - p.worldX;

        if (Math.abs(dx) < 0.5) {
          p.worldX += dx * dt * 3;
        }
      }

      if (p.z <= SHIP_Z + 20 && Math.abs(p.worldX - ship.worldX) < 0.34) {
        p.dead = true;
        applyPower(p);
      } else if (p.z <= 0) {
        if (Math.abs(p.worldX - ship.worldX) < 0.60) {
          p.dead = true;
          applyPower(p);
        } else {
          p.dead = true;
        }
      }
    });

    updateParticlesTexts(dt);

    bullets = bullets.filter(x => !x.dead);
    aliens = aliens.filter(x => !x.dead);
    enemyBullets = enemyBullets.filter(x => !x.dead);
    powerups = powerups.filter(x => !x.dead);

    updatePowerHud();
  }

  function updatePowerHud() {
    let html = '';

    if (effects.shield > 0) html += powerTag('🛡 ESCUDO', '#0ff', effects.shield);
    if (effects.rapid > 0) html += powerTag('⚡ OVERDRIVE', '#f0f', effects.rapid);
    if (effects.triple > 0) html += powerTag('▲ TRI-SHOT', '#ff0', effects.triple);
    if (effects.multi > 0) html += powerTag('×2 SCORE', '#b26bff', effects.multi);

    if (effects.hack > 0) {
      html += powerTag('🧠 HACK MODE', '#0ff', effects.hack);
    } else if (state.hackEnergy > 0) {
      html += powerTag(`🧠 HACK ${Math.floor(state.hackEnergy)}%`, '#7fffd4', 0);
    }

    if (state.combo >= 5) {
      html += powerTag(`🔥 COMBO x${getComboMult().toFixed(1)}`, '#ff0', state.comboTimer);
    }

    powerHud.innerHTML = html;
  }

  function powerTag(label, color, t) {
    const timeText = t > 0 ? ` ${t.toFixed(1)}s` : '';
    return `<div class="power-tag" style="color:${color};border-color:${color};box-shadow:0 0 10px ${color};">${label}${timeText}</div>`;
  }

  let animTime = 0;

  function draw() {
    ctx.clearRect(0, 0, W, H);

    drawBackground();
    drawRoad();

    ctx.save();

    if (state.shake > 0) {
      ctx.translate(
        rand(-state.shake, state.shake) * 0.5,
        rand(-state.shake, state.shake) * 0.5
      );
    }

    drawEntities();
    drawLightnings();
    drawParticles();
    drawBossBar();
    drawTexts();

    ctx.restore();

    drawHackOverlay();

    if (state.flash > 0) {
      ctx.fillStyle = `rgba(255,0,70,${state.flash * 0.32})`;
      ctx.fillRect(0, 0, W, H);
    }
  }

  function drawBackground() {
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, '#02121c');
    bg.addColorStop(0.45, '#032230');
    bg.addColorStop(1, '#01040a');

    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    ctx.save();

    stars.forEach(s => {
      const x = s.x * W;
      const y = s.y * horizon;
      const a = 0.25 + 0.55 * Math.abs(Math.sin(animTime * 2 + s.tw));

      ctx.globalAlpha = a;
      ctx.fillStyle = '#9ff';

      ctx.beginPath();
      ctx.arc(x, y, s.r, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.restore();

    const r = Math.min(W, H) * 0.22;
    const x = W / 2;
    const y = horizon - r * 0.18;

    const moonGrad = ctx.createLinearGradient(x, y - r, x, y + r);
    moonGrad.addColorStop(0, '#7fffd4');
    moonGrad.addColorStop(0.5, '#00b7ff');
    moonGrad.addColorStop(1, '#003147');

    ctx.save();

    ctx.globalAlpha = 0.62;
    ctx.shadowBlur = 45;
    ctx.shadowColor = '#0ff';
    ctx.fillStyle = moonGrad;

    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();

    ctx.shadowBlur = 0;
    ctx.fillStyle = 'rgba(1,10,16,0.78)';

    for (let i = 0; i < 7; i++) {
      const yy = y + r * 0.10 + i * r * 0.13;
      ctx.fillRect(x - r, yy, r * 2, Math.max(2, r * 0.045));
    }

    ctx.restore();

    ctx.save();

    skyline.forEach(b => {
      const bx = b.x * W;
      const bw = b.w * W;
      const bh = b.h * H;
      const by = horizon - bh;

      ctx.fillStyle = `hsla(${b.hue},60%,8%,0.92)`;
      ctx.fillRect(bx, by, bw, bh);

      ctx.fillStyle = `hsla(${b.hue},100%,70%,0.22)`;

      b.windows.forEach(win => {
        const wx = bx + win.dx * bw * 0.8 + bw * 0.1;
        const wy = by + win.dy * bh * 0.8 + bh * 0.1;
        ctx.fillRect(wx, wy, Math.max(1, bw * 0.12), Math.max(1, bh * 0.05));
      });
    });

    ctx.restore();

    ctx.save();

    dataStreams.forEach(s => {
      const sx = s.x * W;
      const sy = ((s.y + animTime * s.speed) % 1.2 - 0.1) * H;
      const len = s.len * H;

      ctx.strokeStyle = `hsla(${s.hue},100%,70%,0.16)`;
      ctx.lineWidth = 1.5;

      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(sx, sy + len);
      ctx.stroke();
    });

    ctx.restore();

    const beat = (animTime * BPM / 60) % 1;
    const pulse = Math.pow(1 - beat, 3) * 0.08;

    if (pulse > 0.005) {
      ctx.save();
      ctx.fillStyle = `rgba(0,255,220,${pulse})`;
      ctx.fillRect(0, 0, W, H);
      ctx.restore();
    }
  }

  function drawRoad() {
    const pFar = CAM / (CAM + Z_FAR);

    const nearY = H;
    const farY = horizon;

    const nearHalf = roadHalf;
    const farHalf = roadHalf * pFar;

    const grad = ctx.createLinearGradient(0, farY, 0, nearY);
    grad.addColorStop(0, 'rgba(0,60,70,0.92)');
    grad.addColorStop(1, 'rgba(0,10,18,0.96)');

    ctx.fillStyle = grad;

    ctx.beginPath();
    ctx.moveTo(W / 2 - nearHalf, nearY);
    ctx.lineTo(W / 2 + nearHalf, nearY);
    ctx.lineTo(W / 2 + farHalf, farY);
    ctx.lineTo(W / 2 - farHalf, farY);
    ctx.closePath();
    ctx.fill();

    ctx.save();

    ctx.beginPath();
    ctx.moveTo(W / 2 - nearHalf, nearY);
    ctx.lineTo(W / 2 + nearHalf, nearY);
    ctx.lineTo(W / 2 + farHalf, farY);
    ctx.lineTo(W / 2 - farHalf, farY);
    ctx.closePath();
    ctx.clip();

    const seg = 240;
    const speed = (state.bossActive || state.victoryPending) ? 0 : 520 * currentCfg().speed + state.level * 16;
    const offset = (animTime * speed) % seg;
    const maxK = Math.ceil(Z_FAR / seg) + 1;

    for (let k = maxK; k >= 0; k--) {
      let z1 = k * seg - offset;
      let z2 = z1 - seg * 0.48;

      if (z1 < 0 || z1 > Z_FAR) continue;
      if (z2 < 0) z2 = 0;

      const a = project(z1, 0);
      const b = project(z2, 0);

      ctx.fillStyle = k % 2 ? 'rgba(0,255,200,0.06)' : 'rgba(255,120,0,0.04)';

      ctx.beginPath();
      ctx.moveTo(W / 2 - roadHalf * a.s, a.y);
      ctx.lineTo(W / 2 + roadHalf * a.s, a.y);
      ctx.lineTo(W / 2 + roadHalf * b.s, b.y);
      ctx.lineTo(W / 2 - roadHalf * b.s, b.y);
      ctx.closePath();
      ctx.fill();
    }

    [-0.75, -0.375, 0, 0.375, 0.75].forEach(wx => {
      const a = project(0, wx);
      const b = project(Z_FAR, wx);

      ctx.strokeStyle = wx === 0 ? 'rgba(255,255,255,0.22)' : 'rgba(0,255,220,0.12)';
      ctx.lineWidth = wx === 0 ? 2 : 1;

      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    });

    for (let k = maxK; k >= 0; k -= 2) {
      let z = k * seg - offset;

      if (z < 0 || z > Z_FAR) continue;

      const l = project(z, -1);
      const r = project(z, 1);

      const s = Math.max(2, 6 * l.s);

      ctx.fillStyle = 'rgba(0,255,220,0.35)';
      ctx.beginPath();
      ctx.arc(l.x, l.y, s, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = 'rgba(255,140,0,0.35)';
      ctx.beginPath();
      ctx.arc(r.x, r.y, s, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();

    ctx.save();

    ctx.shadowBlur = 18;
    ctx.lineWidth = 3;

    ctx.strokeStyle = '#0ff';
    ctx.shadowColor = '#0ff';

    const ln = project(0, -1);
    const lf = project(Z_FAR, -1);

    ctx.beginPath();
    ctx.moveTo(ln.x, ln.y);
    ctx.lineTo(lf.x, lf.y);
    ctx.stroke();

    ctx.strokeStyle = '#ff9a3d';
    ctx.shadowColor = '#ff9a3d';

    const rn = project(0, 1);
    const rf = project(Z_FAR, 1);

    ctx.beginPath();
    ctx.moveTo(rn.x, rn.y);
    ctx.lineTo(rf.x, rf.y);
    ctx.stroke();

    ctx.restore();
  }

  function drawEntities() {
    const list = [];

    aliens.forEach(o => {
      if (!o.dead) list.push({ z: o.z, kind: 1, ref: o });
    });

    powerups.forEach(p => {
      if (!p.dead) list.push({ z: p.z, kind: 2, ref: p });
    });

    list.push({ z: SHIP_Z, kind: 3, ref: null });

    enemyBullets.forEach(b => {
      if (!b.dead) list.push({ z: b.z, kind: 4, ref: b });
    });

    list.sort((a, b) => b.z - a.z || a.kind - b.kind);

    list.forEach(item => {
      if (item.kind === 1) drawAlien(item.ref);
      if (item.kind === 2) drawPower(item.ref);
      if (item.kind === 3) drawShip();
      if (item.kind === 4) drawEnemyBullet(item.ref);
    });

    bullets.forEach(b => {
      if (!b.dead) drawBullet(b);
    });
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

    ctx.shadowBlur = 16 * pr.s + 4;
    ctx.shadowColor = main;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (o.type === 'boss') {
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2 + t * 0.2;
        const x1 = Math.cos(a) * r * 0.4;
        const y1 = Math.sin(a) * r * 0.25;
        const x2 = Math.cos(a) * r * 1.2 + Math.sin(t + i) * r * 0.1;
        const y2 = Math.sin(a) * r * 0.6 + Math.cos(t + i) * r * 0.08;

        ctx.strokeStyle = dark;
        ctx.lineWidth = r * 0.08;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.quadraticCurveTo((x1 + x2) / 2, (y1 + y2) / 2 - r * 0.15, x2, y2);
        ctx.stroke();
      }

      const bossGrad = ctx.createRadialGradient(0, -r * 0.15, r * 0.1, 0, 0, r);
      bossGrad.addColorStop(0, light);
      bossGrad.addColorStop(0.45, main);
      bossGrad.addColorStop(1, dark);

      ctx.fillStyle = bossGrad;

      ctx.beginPath();
      ctx.ellipse(0, 0, r * 0.95, r * 0.62, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = light;
      ctx.lineWidth = Math.max(1.5, r * 0.04);
      ctx.stroke();

      const lookX = clamp((ship.worldX - o.worldX) * r * 0.18, -r * 0.12, r * 0.12);

      ctx.fillStyle = '#fff';

      ctx.beginPath();
      ctx.ellipse(lookX, -r * 0.05, r * 0.22, r * 0.16, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#111';

      ctx.beginPath();
      ctx.arc(lookX, -r * 0.05, r * 0.07, 0, Math.PI * 2);
      ctx.fill();

      const pulse = 0.75 + Math.sin(t * 4) * 0.25;

      ctx.shadowBlur = 30;
      ctx.shadowColor = light;
      ctx.fillStyle = light;

      ctx.beginPath();
      ctx.arc(0, r * 0.22, r * 0.12 * pulse, 0, Math.PI * 2);
      ctx.fill();

      if (o.flash > 0 || o.bossPhase === 'dash') {
        ctx.globalAlpha = 0.25 + 0.25 * Math.abs(Math.sin(animTime * 30));
        ctx.fillStyle = 'rgba(255,60,60,0.35)';

        ctx.beginPath();
        ctx.ellipse(0, 0, r * 0.95, r * 0.62, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.globalAlpha = 1;
      }
    } else if (o.type === 'bit') {
      ctx.rotate(Math.sin(t * 2) * 0.2);

      ctx.fillStyle = main;

      ctx.beginPath();
      ctx.moveTo(0, -r);
      ctx.lineTo(r * 0.7, 0);
      ctx.lineTo(0, r);
      ctx.lineTo(-r * 0.7, 0);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = light;
      ctx.lineWidth = Math.max(1, r * 0.08);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, r);
      ctx.lineTo(0, r * 1.6);
      ctx.stroke();
    } else if (o.type === 'wasp') {
      ctx.fillStyle = main;

      ctx.beginPath();
      ctx.moveTo(0, -r);
      ctx.lineTo(r * 0.5, r * 0.2);
      ctx.lineTo(r * 0.8, r * 0.5);
      ctx.lineTo(0, r * 0.3);
      ctx.lineTo(-r * 0.8, r * 0.5);
      ctx.lineTo(-r * 0.5, r * 0.2);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = light;
      ctx.lineWidth = Math.max(1, r * 0.07);
      ctx.stroke();

      ctx.fillStyle = dark;

      ctx.beginPath();
      ctx.arc(0, -r * 0.15, r * 0.18, 0, Math.PI * 2);
      ctx.fill();
    } else if (o.type === 'orbiter') {
      ctx.fillStyle = dark;

      ctx.beginPath();

      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2;
        const x = Math.cos(a) * r * 0.8;
        const y = Math.sin(a) * r * 0.8;

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = main;
      ctx.lineWidth = Math.max(1.5, r * 0.08);
      ctx.stroke();

      ctx.save();
      ctx.rotate(t);

      ctx.strokeStyle = light;
      ctx.lineWidth = Math.max(1.5, r * 0.06);

      ctx.beginPath();
      ctx.arc(0, 0, r * 0.98, 0, Math.PI * 1.2);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(0, 0, r * 0.98, Math.PI, Math.PI * 2.2);
      ctx.stroke();

      ctx.restore();

      ctx.fillStyle = light;

      ctx.beginPath();
      ctx.arc(0, 0, r * 0.18, 0, Math.PI * 2);
      ctx.fill();
    } else if (o.type === 'angler') {
      const bodyGrad = ctx.createRadialGradient(-r * 0.2, -r * 0.2, r * 0.1, 0, 0, r);
      bodyGrad.addColorStop(0, light);
      bodyGrad.addColorStop(0.5, main);
      bodyGrad.addColorStop(1, dark);

      ctx.fillStyle = bodyGrad;

      ctx.beginPath();
      ctx.ellipse(0, 0, r * 0.85, r * 0.65, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = main;
      ctx.lineWidth = Math.max(1.5, r * 0.07);
      ctx.stroke();

      ctx.strokeStyle = light;
      ctx.lineWidth = Math.max(1, r * 0.05);

      ctx.beginPath();
      ctx.moveTo(0, -r * 0.55);
      ctx.quadraticCurveTo(r * 0.2, -r * 1.0, r * 0.35, -r * 0.95);
      ctx.stroke();

      ctx.fillStyle = '#fff';

      ctx.beginPath();
      ctx.arc(r * 0.35, -r * 0.95, r * 0.08, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#0a0a0a';

      ctx.beginPath();
      ctx.arc(r * 0.35, -r * 0.95, r * 0.035, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#050505';

      ctx.beginPath();
      ctx.arc(0, r * 0.15, r * 0.35, 0, Math.PI);
      ctx.fill();

      ctx.fillStyle = '#fff';

      for (let i = -2; i <= 2; i++) {
        ctx.beginPath();
        ctx.moveTo(i * r * 0.14, r * 0.15);
        ctx.lineTo(i * r * 0.14 + r * 0.03, r * 0.32);
        ctx.lineTo(i * r * 0.14 + r * 0.06, r * 0.15);
        ctx.closePath();
        ctx.fill();
      }
    } else if (o.type === 'reaper') {
      ctx.rotate(Math.sin(t * 3) * 0.15);

      ctx.fillStyle = main;

      ctx.beginPath();
      ctx.moveTo(-r * 0.9, 0);
      ctx.quadraticCurveTo(0, -r * 1.1, r * 0.9, 0);
      ctx.quadraticCurveTo(0, -r * 0.3, -r * 0.9, 0);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = light;
      ctx.lineWidth = Math.max(1, r * 0.07);
      ctx.stroke();

      ctx.fillStyle = '#fff';

      ctx.beginPath();
      ctx.arc(0, -r * 0.15, r * 0.12, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#111';

      ctx.beginPath();
      ctx.arc(0, -r * 0.15, r * 0.05, 0, Math.PI * 2);
      ctx.fill();
    }

    if (o.maxHp > 1 && o.type !== 'boss') {
      const bw = r * 1.5;
      const bh = Math.max(2, r * 0.12);
      const by = -r * 1.35;
      const pct = o.hp / o.maxHp;

      ctx.shadowBlur = 0;

      ctx.fillStyle = 'rgba(0,0,0,0.55)';
      ctx.fillRect(-bw / 2, by, bw, bh);

      ctx.fillStyle = pct > 0.5 ? '#0f8' : (pct > 0.25 ? '#ff0' : '#f33');
      ctx.fillRect(-bw / 2, by, bw * pct, bh);
    }

    ctx.restore();
  }

  function drawPower(pu) {
    const def = POWER_TYPES[pu.type];
    const pr = project(pu.z, pu.worldX);
    const size = Math.max(9, 30 * pr.s);

    ctx.save();

    ctx.translate(pr.x, pr.y);
    ctx.rotate(pu.rot);

    ctx.shadowBlur = 20 * pr.s + 4;
    ctx.shadowColor = def.color;
    ctx.strokeStyle = def.color;
    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.lineWidth = Math.max(1, 2 * pr.s);

    ctx.beginPath();
    ctx.moveTo(0, -size);
    ctx.lineTo(size, 0);
    ctx.lineTo(0, size);
    ctx.lineTo(-size, 0);
    ctx.closePath();

    ctx.fill();
    ctx.stroke();

    ctx.rotate(-pu.rot);

    ctx.fillStyle = def.color;
    ctx.font = `bold ${Math.max(9, 15 * pr.s)}px Orbitron, monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(def.label, 0, 1);

    ctx.restore();
  }

  function drawEnemyBullet(b) {
    const pr = project(b.z, b.worldX);
    const tail = project(b.z + 110, b.worldX);

    ctx.save();

    ctx.globalCompositeOperation = 'lighter';
    ctx.shadowBlur = 14;
    ctx.shadowColor = `hsl(${b.hue},100%,60%)`;

    ctx.strokeStyle = `hsla(${b.hue},100%,60%,0.85)`;
    ctx.lineWidth = Math.max(2, 5 * pr.s);

    ctx.beginPath();
    ctx.moveTo(tail.x, tail.y);
    ctx.lineTo(pr.x, pr.y);
    ctx.stroke();

    ctx.fillStyle = '#fff';

    ctx.beginPath();
    ctx.arc(pr.x, pr.y, Math.max(2, 3.5 * pr.s), 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  function drawBullet(b) {
    const cur = projectBulletAtZ(b, b.z);
    const origin = projectBulletAtZ(b, SHIP_Z);
    const tailZ = b.z > SHIP_Z + 140 ? b.z - 140 : SHIP_Z;
    const tail = projectBulletAtZ(b, tailZ);

    ctx.save();

    ctx.globalCompositeOperation = 'lighter';
    ctx.shadowBlur = 16;
    ctx.shadowColor = '#0ff';

    const beam = ctx.createLinearGradient(origin.x, origin.y, cur.x, cur.y);
    beam.addColorStop(0, 'rgba(0,255,255,0)');
    beam.addColorStop(1, 'rgba(0,255,255,0.16)');

    ctx.strokeStyle = beam;
    ctx.lineWidth = Math.max(1.5, 3 * cur.s);

    ctx.beginPath();
    ctx.moveTo(origin.x, origin.y);
    ctx.lineTo(cur.x, cur.y);
    ctx.stroke();

    const bolt = ctx.createLinearGradient(tail.x, tail.y, cur.x, cur.y);
    bolt.addColorStop(0, 'rgba(0,255,255,0)');
    bolt.addColorStop(1, 'rgba(190,255,255,0.98)');

    ctx.strokeStyle = bolt;
    ctx.lineWidth = Math.max(2, 6 * cur.s);

    ctx.beginPath();
    ctx.moveTo(tail.x, tail.y);
    ctx.lineTo(cur.x, cur.y);
    ctx.stroke();

    ctx.fillStyle = '#dff';

    ctx.beginPath();
    ctx.arc(cur.x, cur.y, Math.max(2, 4 * cur.s), 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  function drawLightnings() {
    if (lightnings.length === 0) return;

    ctx.save();

    ctx.globalCompositeOperation = 'lighter';

    lightnings.forEach(l => {
      const a = l.life / l.maxLife;

      ctx.strokeStyle = `hsla(${l.hue},100%,75%,${a})`;
      ctx.lineWidth = 3;
      ctx.shadowBlur = 12;
      ctx.shadowColor = `hsla(${l.hue},100%,70%,${a})`;

      ctx.beginPath();
      ctx.moveTo(l.x1, l.y1);

      const segs = 5;

      for (let i = 1; i < segs; i++) {
        const t = i / segs;
        const x = l.x1 + (l.x2 - l.x1) * t + rand(-12, 12) * a;
        const y = l.y1 + (l.y2 - l.y1) * t + rand(-12, 12) * a;
        ctx.lineTo(x, y);
      }

      ctx.lineTo(l.x2, l.y2);
      ctx.stroke();
    });

    ctx.restore();
  }

  function drawParticles() {
    ctx.save();

    ctx.globalCompositeOperation = 'lighter';

    particles.forEach(p => {
      const a = p.life / p.maxLife;

      ctx.fillStyle = `hsla(${p.hue},100%,65%,${a})`;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.restore();
  }

  function drawBossBar() {
    const boss = aliens.find(a => a.type === 'boss' && !a.dead);
    if (!boss) return;

    const bw = Math.min(W * 0.56, 520);
    const bh = Math.max(10, H * 0.024);
    const bx = (W - bw) / 2;
    const by = Math.max(48, H * 0.08);
    const pct = clamp(boss.hp / boss.maxHp, 0, 1);

    ctx.save();

    ctx.fillStyle = 'rgba(0,0,0,0.55)';
    ctx.fillRect(bx, by, bw, bh);

    const grad = ctx.createLinearGradient(bx, 0, bx + bw, 0);
    grad.addColorStop(0, '#f33');
    grad.addColorStop(0.5, '#f0f');
    grad.addColorStop(1, '#0ff');

    ctx.fillStyle = grad;
    ctx.fillRect(bx, by, bw * pct, bh);

    ctx.strokeStyle = 'rgba(255,255,255,0.5)';
    ctx.lineWidth = 1;
    ctx.strokeRect(bx, by, bw, bh);

    ctx.fillStyle = '#fff';
    ctx.font = `bold ${Math.max(10, H * 0.02)}px Orbitron, monospace`;
    ctx.textAlign = 'center';
    ctx.shadowBlur = 8;
    ctx.shadowColor = '#f0f';

    ctx.fillText('KRAKEN NÚCLEO', W / 2, by - 6);

    ctx.restore();
  }

  function drawHackOverlay() {
    if (effects.hack <= 0) return;

    ctx.save();

    const a = 0.08 + 0.04 * Math.sin(animTime * 20);

    ctx.fillStyle = `rgba(0,255,255,${a})`;
    ctx.fillRect(0, 0, W, H);

    for (let i = 0; i < 6; i++) {
      const y = (animTime * 300 + i * 137) % H;

      ctx.fillStyle = 'rgba(255,0,255,0.05)';
      ctx.fillRect(0, y, W, rand(2, 8));
    }

    ctx.restore();
  }

  function drawShip() {
    if (ship.invuln > 0 && Math.floor(animTime * 18) % 2 === 0) return;

    const sr = getShipRender();

    ctx.save();

    ctx.globalAlpha = 0.3;
    ctx.fillStyle = '#000';

    ctx.beginPath();
    ctx.ellipse(sr.x, sr.baseY, 42 * sr.sc, 12 * sr.sc, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

    ctx.save();

    ctx.translate(sr.x + ship.bank * 8 * sr.sc, sr.y);
    ctx.rotate(ship.bank * 0.36);
    ctx.transform(1, 0, ship.bank * 0.16, 1, 0, 0);
    ctx.scale(sr.sc, sr.sc);

    ctx.shadowBlur = 25;
    ctx.shadowColor = '#0ff';

    const bodyGrad = ctx.createLinearGradient(0, -72, 0, 36);
    bodyGrad.addColorStop(0, '#032830');
    bodyGrad.addColorStop(0.35, '#0aa');
    bodyGrad.addColorStop(0.75, '#0ff');
    bodyGrad.addColorStop(1, '#f0f');

    ctx.fillStyle = bodyGrad;
    ctx.strokeStyle = '#0ff';
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(0, -72);
    ctx.lineTo(7, -36);
    ctx.lineTo(13, -10);
    ctx.lineTo(46, 20);
    ctx.lineTo(20, 27);
    ctx.lineTo(14, 36);
    ctx.lineTo(-14, 36);
    ctx.lineTo(-20, 27);
    ctx.lineTo(-46, 20);
    ctx.lineTo(-13, -10);
    ctx.lineTo(-7, -36);
    ctx.closePath();

    ctx.fill();
    ctx.stroke();

    ctx.shadowBlur = 12;
    ctx.shadowColor = '#f0f';
    ctx.fillStyle = 'rgba(255,0,255,0.65)';

    ctx.beginPath();
    ctx.moveTo(0, -34);
    ctx.lineTo(6, -18);
    ctx.lineTo(0, 2);
    ctx.lineTo(-6, -18);
    ctx.closePath();
    ctx.fill();

    const boosting = autofire || firing;
    const flameLen = (20 + Math.sin(animTime * 40) * 6) * (boosting ? 1.45 : 0.75);

    ctx.shadowBlur = 18;
    ctx.shadowColor = '#f80';
    ctx.fillStyle = boosting ? '#ffbf00' : '#ff7700';

    ctx.beginPath();
    ctx.moveTo(-16, 36);
    ctx.lineTo(-12, 36 + flameLen);
    ctx.lineTo(-8, 36);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(8, 36);
    ctx.lineTo(12, 36 + flameLen);
    ctx.lineTo(16, 36);
    ctx.closePath();
    ctx.fill();

    ctx.shadowBlur = 14;
    ctx.shadowColor = '#0ff';
    ctx.strokeStyle = '#0ff';
    ctx.lineWidth = 3;

    ctx.beginPath();
    ctx.moveTo(0, -58);
    ctx.lineTo(0, -72);
    ctx.stroke();

    if (ship.muzzle > 0) {
      const a = ship.muzzle / 0.06;

      ctx.globalAlpha = a;
      ctx.shadowBlur = 25;
      ctx.shadowColor = '#0ff';
      ctx.fillStyle = 'rgba(180,255,255,0.95)';

      ctx.beginPath();
      ctx.arc(0, -72, 9, 0, Math.PI * 2);
      ctx.fill();

      if (effects.triple > 0) {
        ctx.beginPath();
        ctx.arc(-22, 6, 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(22, 6, 6, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
    }

    if (effects.shield > 0) {
      ctx.shadowBlur = 20;
      ctx.shadowColor = '#0ff';
      ctx.strokeStyle = 'rgba(0,255,255,0.75)';
      ctx.lineWidth = 2.5;

      ctx.beginPath();
      ctx.ellipse(0, -8, 56, 48, 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.restore();
  }

  function drawTexts() {
    texts.forEach(t => {
      const a = t.life / t.maxLife;

      ctx.save();

      ctx.globalAlpha = a;
      ctx.fillStyle = t.color;
      ctx.font = `bold ${t.size}px Orbitron, monospace`;
      ctx.textAlign = 'center';
      ctx.shadowBlur = 10;
      ctx.shadowColor = t.color;

      ctx.fillText(t.text, t.x, t.y);

      ctx.restore();
    });
  }

  function loop(ts) {
    requestAnimationFrame(loop);

    if (!state.last) state.last = ts;

    let dt = (ts - state.last) / 1000;
    state.last = ts;
    dt = Math.min(dt, 0.033);

    animTime += dt;

    if (state.mode === 'playing') {
      update(dt);
    }

    draw();
  }

  resize();
  requestAnimationFrame(loop);

  playBtn.addEventListener('click', startGame);

  retryBtn.addEventListener('click', () => {
    if (redirectTimeout) clearTimeout(redirectTimeout);
    window.location.href = 'navy_project.html';
  });

  restartBtn.addEventListener('click', () => {
    pauseOverlay.classList.add('hidden');
    startGame();
  });

  resumeBtn.addEventListener('click', togglePause);
  pauseBtn.addEventListener('click', togglePause);

  nextLevelBtn.addEventListener('click', () => {
    window.location.href = 'navy_project.html';
  });

  document.querySelectorAll('.diff-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      difficulty = btn.dataset.diff;
      savePref('navyDifficulty', difficulty);
      updateDifficultyButtons();
    });
  });

  autofireBtn.addEventListener('click', () => {
    autofire = !autofire;
    savePref('navyAutofire', autofire ? 'on' : 'off');
    updateAutofireButton();
  });

  musicBtn.addEventListener('click', () => {
    setMusicEnabled(!musicEnabled);
  });

  hudMusicBtn.addEventListener('click', () => {
    setMusicEnabled(!musicEnabled);
  });

  const leftBtn = $('leftBtn');
  const rightBtn = $('rightBtn');
  const fireBtn = $('fireBtn');

  function bindHold(el, down, up) {
    el.addEventListener('pointerdown', e => {
      e.preventDefault();

      if (el.setPointerCapture) el.setPointerCapture(e.pointerId);

      down();
    });

    el.addEventListener('pointerup', e => {
      e.preventDefault();
      up();
    });

    el.addEventListener('pointercancel', e => {
      e.preventDefault();
      up();
    });
  }

  bindHold(leftBtn, () => moveDir = -1, () => {
    if (moveDir === -1) moveDir = 0;
  });

  bindHold(rightBtn, () => moveDir = 1, () => {
    if (moveDir === 1) moveDir = 0;
  });

  bindHold(fireBtn, () => firing = true, () => firing = false);

  function setPointer(e) {
    ship.targetWorldX = clamp((e.clientX - W / 2) / roadHalf, -1, 1);
  }

  cvs.addEventListener('pointerdown', e => {
    if (state.mode !== 'playing') return;

    dragging = true;

    if (cvs.setPointerCapture) cvs.setPointerCapture(e.pointerId);

    setPointer(e);
  });

  cvs.addEventListener('pointermove', e => {
    if (dragging) setPointer(e);
  });

  ['pointerup', 'pointercancel'].forEach(evt => {
    cvs.addEventListener(evt, () => {
      dragging = false;
    });
  });

  window.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') {
      moveDir = -1;
      e.preventDefault();
    }

    if (e.key === 'ArrowRight') {
      moveDir = 1;
      e.preventDefault();
    }

    if (e.key === ' ' || e.key === 'ArrowUp') {
      firing = true;
      e.preventDefault();
    }

    if (e.key === 'p' || e.key === 'P' || e.key === 'Escape') {
      togglePause();
    }
  });

  window.addEventListener('keyup', e => {
    if (e.key === 'ArrowLeft' && moveDir === -1) moveDir = 0;
    if (e.key === 'ArrowRight' && moveDir === 1) moveDir = 0;

    if (e.key === ' ' || e.key === 'ArrowUp') firing = false;
  });

  document.addEventListener('contextmenu', e => e.preventDefault());
  document.addEventListener('gesturestart', e => e.preventDefault());

  document.addEventListener('visibilitychange', () => {
    if (document.hidden && state.mode === 'playing') togglePause();
  });

  updateHUD();
  updateMusicButtons();
  updateDifficultyButtons();
  updateAutofireButton();
})();