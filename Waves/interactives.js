// Helper: render text with sub/superscript notation on canvas.
// Parses "_x" / "_{...}" for subscripts, "^x" / "^{...}" for superscripts.
// Respects ctx.textAlign and current font.
function fillTextSub(ctx, text, x, y) {
  var parts = [];
  var i = 0;
  while (i < text.length) {
    if ((text[i] === '_' || text[i] === '^') && i + 1 < text.length) {
      var isSub = text[i] === '_';
      if (text[i + 1] === '{') {
        var close = text.indexOf('}', i + 2);
        if (close !== -1) {
          parts.push({ text: text.substring(i + 2, close), mode: isSub ? 'sub' : 'sup' });
          i = close + 1;
          continue;
        }
      }
      parts.push({ text: text[i + 1], mode: isSub ? 'sub' : 'sup' });
      i += 2;
      continue;
    }
    var start = i;
    while (i < text.length && !((text[i] === '_' || text[i] === '^') && i + 1 < text.length)) i++;
    parts.push({ text: text.substring(start, i), mode: 'normal' });
  }

  var savedFont = ctx.font;
  var fontMatch = savedFont.match(/(\d+(?:\.\d+)?)(px|pt)/);
  var fontSize = fontMatch ? parseFloat(fontMatch[1]) : 12;
  var smallSize = Math.round(fontSize * 0.7);
  var smallFont = savedFont.replace(/(\d+(?:\.\d+)?)(px|pt)/, smallSize + '$2');

  // Measure total width
  var totalWidth = 0;
  for (var p = 0; p < parts.length; p++) {
    ctx.font = parts[p].mode !== 'normal' ? smallFont : savedFont;
    totalWidth += ctx.measureText(parts[p].text).width;
  }

  var align = ctx.textAlign || 'start';
  var drawX = x;
  if (align === 'center') drawX = x - totalWidth / 2;
  else if (align === 'right' || align === 'end') drawX = x - totalWidth;

  var savedAlign = ctx.textAlign;
  ctx.textAlign = 'left';
  for (var p = 0; p < parts.length; p++) {
    var yOff = 0;
    if (parts[p].mode === 'sub') yOff = fontSize * 0.3;
    else if (parts[p].mode === 'sup') yOff = -fontSize * 0.35;
    ctx.font = parts[p].mode !== 'normal' ? smallFont : savedFont;
    ctx.fillText(parts[p].text, drawX, y + yOff);
    drawX += ctx.measureText(parts[p].text).width;
  }
  ctx.font = savedFont;
  ctx.textAlign = savedAlign;
}

// =========================================================================
// Shared Web Audio utilities for interactive sound playback
// =========================================================================
let _wavesAudioCtx = null;
function wGetAudioCtx() {
  if (!_wavesAudioCtx) _wavesAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (_wavesAudioCtx.state === 'suspended') _wavesAudioCtx.resume();
  return _wavesAudioCtx;
}

// Active audio state per interactive (keyed by id string)
const _wavesAudioActive = {};

// Play a set of sine-wave tones with optional harmonics.
// tones: array of { freq, gain?, harmonics? }
//   harmonics: array of { n, gain } — adds partials at n*freq
// id: string key to track/stop this sound
// duration: seconds (0 = sustained until stopped)
function wPlayTones(id, tones, duration) {
  wStopTones(id);
  const actx = wGetAudioCtx();
  const master = actx.createGain();
  master.gain.value = 0;
  master.connect(actx.destination);
  // Fade in
  master.gain.setTargetAtTime(0.25, actx.currentTime, 0.04);

  const nodes = [];
  for (const tone of tones) {
    const g = actx.createGain();
    g.gain.value = tone.gain ?? 1;
    g.connect(master);

    const partials = tone.harmonics || [{ n: 1, gain: 1 }];
    for (const p of partials) {
      const osc = actx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = tone.freq * p.n;
      const pg = actx.createGain();
      pg.gain.value = p.gain;
      osc.connect(pg);
      pg.connect(g);
      osc.start();
      nodes.push(osc);
    }
  }

  _wavesAudioActive[id] = { master, nodes, actx };

  if (duration > 0) {
    setTimeout(() => wStopTones(id), duration * 1000);
  }
}

// Update the frequency of active tones (for real-time slider control)
function wUpdateTones(id, tones) {
  const state = _wavesAudioActive[id];
  if (!state) return;
  let ni = 0;
  for (const tone of tones) {
    const partials = tone.harmonics || [{ n: 1, gain: 1 }];
    for (const p of partials) {
      if (ni < state.nodes.length) {
        state.nodes[ni].frequency.setTargetAtTime(tone.freq * p.n, state.actx.currentTime, 0.02);
      }
      ni++;
    }
  }
}

function wStopTones(id) {
  const state = _wavesAudioActive[id];
  if (!state) return;
  state.master.gain.setTargetAtTime(0, state.actx.currentTime, 0.05);
  setTimeout(() => {
    for (const osc of state.nodes) { try { osc.stop(); } catch(e){} }
    try { state.master.disconnect(); } catch(e){}
  }, 200);
  delete _wavesAudioActive[id];
}

function wIsPlaying(id) {
  return !!_wavesAudioActive[id];
}

// Play an arbitrary periodic waveform buffer (for Fourier chapter)
// samples: Float32Array or array of sample values (-1..1), played at given freq
function wPlayBuffer(id, samples, freq, duration) {
  wStopTones(id);
  const actx = wGetAudioCtx();
  const master = actx.createGain();
  master.gain.value = 0;
  master.connect(actx.destination);
  master.gain.setTargetAtTime(0.25, actx.currentTime, 0.04);

  // Create a periodic wave from samples via real/imag coefficients
  const N = samples.length;
  const nCoeffs = Math.min(N / 2, 64);
  const real = new Float32Array(nCoeffs + 1);
  const imag = new Float32Array(nCoeffs + 1);
  real[0] = 0; imag[0] = 0;
  for (let k = 1; k <= nCoeffs; k++) {
    let re = 0, im = 0;
    for (let j = 0; j < N; j++) {
      const angle = -2 * Math.PI * k * j / N;
      re += samples[j] * Math.cos(angle);
      im += samples[j] * Math.sin(angle);
    }
    real[k] = re / N;
    imag[k] = im / N;
  }

  const wave = actx.createPeriodicWave(real, imag, { disableNormalization: false });
  const osc = actx.createOscillator();
  osc.setPeriodicWave(wave);
  osc.frequency.value = freq || 220;
  osc.connect(master);
  osc.start();

  _wavesAudioActive[id] = { master, nodes: [osc], actx };
  if (duration > 0) {
    setTimeout(() => wStopTones(id), duration * 1000);
  }
}

// Create a play/stop toggle button and append to a controls container
function wMakePlayBtn(parentEl, id, label, onPlay, onStop) {
  const btn = document.createElement('button');
  btn.className = 'scene-btn w-play-btn';
  btn.id = id;
  btn.textContent = label || '\u25B6 Play';
  btn.addEventListener('click', () => {
    if (wIsPlaying(id)) {
      wStopTones(id);
      btn.textContent = label || '\u25B6 Play';
      btn.style.background = '';
      if (onStop) onStop();
    } else {
      if (onPlay) onPlay();
      btn.textContent = '\u25A0 Stop';
      btn.style.background = '#dc2626';
    }
  });
  parentEl.appendChild(btn);
  return btn;
}

// Polyfill for CanvasRenderingContext2D.roundRect (Safari < 16, older browsers)
if (typeof CanvasRenderingContext2D !== 'undefined' && !CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, radii) {
    var r = typeof radii === 'number' ? radii : (Array.isArray(radii) ? radii[0] : 0);
    this.moveTo(x + r, y);
    this.arcTo(x + w, y, x + w, y + h, r);
    this.arcTo(x + w, y + h, x, y + h, r);
    this.arcTo(x, y + h, x, y, r);
    this.arcTo(x, y, x + w, y, r);
    this.closePath();
  };
}

// =========================================================================
// LECTURE 1 INTERACTIVE SCENES
// =========================================================================

function initSceneInteractives() {
  // Lecture 1
  initSHMSpring();
  initSHMOscillator();
  initDampedOscillator();
  initDampingRegimes();
  initEulerCircle();
  // Lecture 2
  initDrivenOscillator();
  initTransientDecay();
  initPhaseLag();
  initPowerAbsorption();
  initResonanceCurve();
  // Chapter 3
  initCoupledOscillators();
  initNormalModes();
  initBeats();
  initEigenvalueSolver();
  // Chapter 4
  initTwoMassNormalModes();
  initThreeMassNormalModes();
  initNMassChain();
  // Chapter 5
  initFourierDecomposition();
  initFourierSawtooth();
  initPluckedString();
  // Chapter 4 (continued)
  initNMassModesNumerical();
  initDispersionRelationDiscrete();
  initContinuumLimit();
  initTravelingVsStanding();
  // Chapter 6
  initStringTransverseWave();
  initSoundWaveLongitudinal();
  initBoundaryConditionsDemo();
  initStandingWaveModes();
  initHelmholtzResonator();
  // Chapter 7
  initBeatsDemo();
  initConsonanceDissonance();
  initHarmonicAlignment();
  initCircleOfFifths();
  initScaleComparison();
  // Chapter 17 - Color
  initColorMatchingMetamers();
  initCieTristimulusCurves();
  initCieColorSpaceGamut();
  initBlackbodyPlanckianLocus();
  initHsvColorExplorer();
  initAdditiveSubtractiveMixing();
  initRodConeSensitivity();
  // Chapter 18 - Antennas
  initMonopoleRadiationPattern();
  initTwoSourceInterference();
  initPhasedArrayRadiation();
  initInterferometerResolution();
  // Chapter 19 - Diffraction
  initHuygensPrincipleDemo();
  initDiffractionGratingPattern();
  initSingleSlitDiffraction();
  initFourierOpticsDemo();
  // Chapter 20 - Quantum Mechanics
  initPhotoelectricEffectDemo();
  initDoubleSlitPhotonBuildup();
  initHydrogenEnergyLevels();
  initQuantumWavepacketDispersion();
  // Chapter 21 - Doppler Effect
  initDopplerMovingSource();
  initDopplerAngle();
  initSonicBoomMachCone();
  initRelativisticDopplerRedshift();
  initDopplerSpectroscopyExoplanet();
  // Chapter 12 - Waves (Muller)
  initWaveTransportEnergy();
  initTransverseLongitudinalDemo();
  initSoundRefractionAtmosphere();
  // Chapter 13 - Light
  initEmPlaneWave();
  // Chapter 14 - Polarization
  initPhononPolarizations();
  initLinearPolarization();
  initCircularPolarization();
  initMalusLaw();
  // Chapter 15 - Refraction
  initSnellsLawDemo();
  initTotalInternalReflection();
  initThinFilmInterference();
  initBrewsterAngle();
  // Chapter 16 - Prisms & Scattering
  initRayleighScattering();
  initPrismDispersion();
  // Chapter 8 - Fourier Transforms
  initViolinSpectrum();
  initFourierTransformDerivation();
  initUnderdampedFourierTransform();
  initFourierMagnitudePhase();
  initFourierFiltering();
  initDiracDeltaVisualization();
  // Chapter 9 - Reflection & Transmission
  initStringJunction();
  initMassCollisionImpedance();
  initComplexImpedance();
  // Chapter 10 - Power
  initImpedanceMaterials();
  initWaveEnergyString();
  initPowerReflectionTransmission();
  initDecibelScale();
  initPlaneWave3d();
  // Chapter 11 - Wavepackets
  initInterferenceDemo();
  initGaussianWavepacket();
  initAmplitudeModulation();
  initDispersionRelations();
  initPhaseVelocityDemo();
  initGroupVelocityDemo();
  initWavepacketDispersion();
}

// Color palette matching WavesC theme
const WCOLORS = {
  bg: '#faf5ec',
  axis: '#1f2a2e',
  grid: 'rgba(31,42,46,0.08)',
  teal: '#0f766e',
  amber: '#d97706',
  orange: '#b45309',
  text: '#1f2a2e',
  textDim: '#596166',
  red: '#dc2626',
  blue: '#2563eb',
};

function wSetupCanvas(canvas) {
  if (!canvas) return null;
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  const w = rect.width || canvas.width || 600;
  const h = rect.height || canvas.height || 280;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  canvas.style.width = w + 'px';
  canvas.style.height = h + 'px';
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  return { ctx, W: w, H: h };
}

function wClear(ctx, W, H) {
  ctx.fillStyle = WCOLORS.bg;
  ctx.fillRect(0, 0, W, H);
}

// =========================================================================
// 1. SHM SPRING LAB
// =========================================================================
function initSHMSpring() {
  const canvas = document.getElementById('scene-shm-spring');
  if (!canvas) return;
  const setup = wSetupCanvas(canvas);
  if (!setup) return;
  const { ctx, W, H } = setup;

  const kSlider = document.getElementById('shm-k');
  const mSlider = document.getElementById('shm-m');

  // Physics state
  let x = 0.4; // displacement (normalized, -1 to 1)
  let v = 0;   // velocity
  let t = 0;
  let trail = []; // x(t) history for plot
  const maxTrail = 300;
  let dragging = false;

  // Spring drawing region (left side)
  const springX = 70, springW = 100;
  const springTop = 30, springBot = H - 50;
  const eqY = (springTop + springBot) / 2;
  const maxDisp = (springBot - springTop) / 2 - 30; // max pixel displacement

  // Plot region (right side)
  const plotL = 210, plotR = W - 20, plotT = 30, plotB = H - 50;
  const plotW = plotR - plotL, plotH = plotB - plotT;
  const plotMidY = (plotT + plotB) / 2;

  // Mouse interaction
  canvas.addEventListener('mousedown', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    // Check if clicking near the mass block
    const massY = eqY + x * maxDisp;
    if (mx > springX - 40 && mx < springX + 40 && Math.abs(my - massY) < 30) {
      dragging = true;
      v = 0;
      trail = [];
      t = 0;
    }
  });
  canvas.addEventListener('mousemove', (e) => {
    if (!dragging) return;
    const rect = canvas.getBoundingClientRect();
    const my = e.clientY - rect.top;
    x = Math.max(-1, Math.min(1, (my - eqY) / maxDisp));
  });
  canvas.addEventListener('mouseup', () => { dragging = false; });
  canvas.addEventListener('mouseleave', () => { dragging = false; });

  // Touch support
  canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const mx = touch.clientX - rect.left;
    const my = touch.clientY - rect.top;
    const massY = eqY + x * maxDisp;
    if (mx > springX - 50 && mx < springX + 50 && Math.abs(my - massY) < 40) {
      dragging = true; v = 0; trail = []; t = 0;
    }
  }, { passive: false });
  canvas.addEventListener('touchmove', (e) => {
    if (!dragging) return;
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const my = e.touches[0].clientY - rect.top;
    x = Math.max(-1, Math.min(1, (my - eqY) / maxDisp));
  }, { passive: false });
  canvas.addEventListener('touchend', () => { dragging = false; });

  function tick() {
    if (!canvas.isConnected) return;
    const k = parseFloat(kSlider?.value || 4);
    const m = parseFloat(mSlider?.value || 1);
    const omega0 = Math.sqrt(k / m);
    const dt = 0.02;

    // Update readouts
    document.getElementById('shm-k-val')?.replaceChildren(document.createTextNode(k.toFixed(1)));
    document.getElementById('shm-m-val')?.replaceChildren(document.createTextNode(m.toFixed(1)));
    document.getElementById('shm-omega-val')?.replaceChildren(
      document.createTextNode('\u03C9\u2080 = ' + omega0.toFixed(2) + '    T = ' + (2 * Math.PI / omega0).toFixed(2))
    );

    if (!dragging) {
      // Verlet-ish integration: a = -omega0^2 * x
      const a = -omega0 * omega0 * x;
      v += a * dt;
      x += v * dt;
      t += dt;
    }

    // Record trail
    trail.push({ t: t, x: x });
    if (trail.length > maxTrail) trail.shift();

    draw(k, m, omega0);
    requestAnimationFrame(tick);
  }

  function drawSpring(ctx, x1, y1, x2, y2, coils) {
    const dx = x2 - x1, dy = y2 - y1;
    const len = Math.sqrt(dx * dx + dy * dy);
    const ux = dx / len, uy = dy / len;
    const nx = -uy, ny = ux;
    const coilW = 12;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    const segLen = len / (coils * 2 + 2);
    let cx = x1 + ux * segLen, cy = y1 + uy * segLen;
    ctx.lineTo(cx, cy);
    for (let i = 0; i < coils; i++) {
      const midX = cx + ux * segLen, midY = cy + uy * segLen;
      ctx.lineTo(midX + nx * coilW * ((i % 2 === 0) ? 1 : -1), midY + ny * coilW * ((i % 2 === 0) ? 1 : -1));
      cx = midX + ux * segLen; cy = midY + uy * segLen;
      ctx.lineTo(cx, cy);
    }
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }

  function draw(k, m, omega0) {
    wClear(ctx, W, H);

    const massY = eqY + x * maxDisp;

    // --- Spring + mass (left side) ---
    // Ceiling
    ctx.fillStyle = WCOLORS.axis;
    ctx.fillRect(springX - 35, springTop - 8, 70, 6);
    // Hatching on ceiling
    ctx.strokeStyle = WCOLORS.textDim; ctx.lineWidth = 1;
    for (let i = 0; i < 7; i++) {
      const lx = springX - 30 + i * 10;
      ctx.beginPath(); ctx.moveTo(lx, springTop - 8); ctx.lineTo(lx - 5, springTop - 14); ctx.stroke();
    }

    // Spring coils
    ctx.strokeStyle = WCOLORS.teal; ctx.lineWidth = 2;
    drawSpring(ctx, springX, springTop, springX, massY - 15, 8);

    // Mass block
    const blockW = 44, blockH = 30;
    ctx.fillStyle = WCOLORS.teal;
    ctx.beginPath();
    ctx.roundRect(springX - blockW / 2, massY - blockH / 2, blockW, blockH, 4);
    ctx.fill();
    ctx.fillStyle = '#fff'; ctx.font = 'bold 13px system-ui, sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('m', springX, massY + 5);

    // Equilibrium line
    ctx.strokeStyle = WCOLORS.textDim; ctx.lineWidth = 1; ctx.setLineDash([4, 4]);
    ctx.beginPath(); ctx.moveTo(springX - 40, eqY); ctx.lineTo(springX + 40, eqY); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = WCOLORS.textDim; ctx.font = '10px system-ui, sans-serif'; ctx.textAlign = 'left';
    ctx.fillText('x = 0', springX + 28, eqY - 4);

    // Displacement arrow
    if (Math.abs(x) > 0.05) {
      ctx.strokeStyle = WCOLORS.amber; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(springX + 30, eqY); ctx.lineTo(springX + 30, massY); ctx.stroke();
      // Arrowhead
      const dir = x > 0 ? 1 : -1;
      ctx.fillStyle = WCOLORS.amber;
      ctx.beginPath();
      ctx.moveTo(springX + 30, massY);
      ctx.lineTo(springX + 25, massY - dir * 8);
      ctx.lineTo(springX + 35, massY - dir * 8);
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = WCOLORS.amber; ctx.font = '11px system-ui, sans-serif'; ctx.textAlign = 'left';
      ctx.fillText('x', springX + 38, (eqY + massY) / 2 + 4);
    }

    // Force arrow
    if (Math.abs(x) > 0.05) {
      const forceDir = -Math.sign(x);
      const forceLen = Math.min(Math.abs(x) * 40, 35);
      ctx.strokeStyle = WCOLORS.red; ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(springX - 30, massY);
      ctx.lineTo(springX - 30, massY + forceDir * forceLen);
      ctx.stroke();
      ctx.fillStyle = WCOLORS.red;
      ctx.beginPath();
      ctx.moveTo(springX - 30, massY + forceDir * forceLen);
      ctx.lineTo(springX - 25, massY + forceDir * (forceLen - 8));
      ctx.lineTo(springX - 35, massY + forceDir * (forceLen - 8));
      ctx.closePath(); ctx.fill();
      ctx.font = '10px system-ui, sans-serif'; ctx.textAlign = 'right';
      ctx.fillText('F = \u2212kx', springX - 38, massY + forceDir * forceLen / 2 + 4);
    }

    // Drag hint
    if (trail.length < 5) {
      ctx.fillStyle = WCOLORS.textDim; ctx.font = '11px system-ui, sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('Drag the mass \u2195', springX, springBot + 14);
    }

    // --- x(t) plot (right side) ---
    // Axes
    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(plotL, plotT); ctx.lineTo(plotL, plotB); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(plotL, plotMidY); ctx.lineTo(plotR, plotMidY); ctx.stroke();

    // Axis labels
    ctx.fillStyle = WCOLORS.text; ctx.font = '11px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('x(t)', plotL - 14, plotT - 4);
    ctx.fillText('t', plotR + 8, plotMidY + 4);

    // Zero line label
    ctx.fillStyle = WCOLORS.textDim; ctx.font = '11px system-ui, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('0', plotL - 4, plotMidY + 3);

    // Grid lines
    ctx.strokeStyle = WCOLORS.grid; ctx.lineWidth = 0.5;
    for (let gy = -1; gy <= 1; gy += 0.5) {
      if (gy === 0) continue;
      const py = plotMidY - gy * (plotH / 2) * 0.85;
      ctx.beginPath(); ctx.moveTo(plotL, py); ctx.lineTo(plotR, py); ctx.stroke();
    }

    // Trail
    if (trail.length > 1) {
      const tRange = Math.max(trail[trail.length - 1].t - trail[0].t, 5);
      ctx.strokeStyle = WCOLORS.teal; ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i < trail.length; i++) {
        const px = plotL + ((trail[i].t - trail[0].t) / tRange) * plotW;
        const py = plotMidY - trail[i].x * (plotH / 2) * 0.85;
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Current point
      const lastPt = trail[trail.length - 1];
      const lx = plotL + ((lastPt.t - trail[0].t) / tRange) * plotW;
      const ly = plotMidY - lastPt.x * (plotH / 2) * 0.85;
      ctx.fillStyle = WCOLORS.amber;
      ctx.beginPath(); ctx.arc(lx, ly, 4, 0, Math.PI * 2); ctx.fill();
    }

    // Info display
    ctx.fillStyle = WCOLORS.teal; ctx.font = '12px system-ui, sans-serif'; ctx.textAlign = 'left';
    ctx.fillText('\u03C9\u2080 = \u221A(k/m) = ' + omega0.toFixed(2) + ' rad/s', plotL + 10, plotB + 16);
    ctx.fillText('T = ' + (2 * Math.PI / omega0).toFixed(2) + ' s', plotL + plotW * 0.6, plotB + 16);
  }

  kSlider?.addEventListener('input', () => { trail = []; t = 0; });
  mSlider?.addEventListener('input', () => { trail = []; t = 0; });
  tick();
}

// =========================================================================
// 2. SHM OSCILLATOR - PHASOR + WAVE
// =========================================================================
function initSHMOscillator() {
  const canvas = document.getElementById('scene-shm-oscillator');
  if (!canvas) return;
  const setup = wSetupCanvas(canvas);
  if (!setup) return;
  const { ctx, W, H } = setup;

  const ampSlider = document.getElementById('osc-amp');
  const omegaSlider = document.getElementById('osc-omega');
  const phiSlider = document.getElementById('osc-phi');

  let t = 0;

  // Phasor circle (left)
  const pcx = 100, pcy = H / 2, pR = 65;
  // Wave plot (right)
  const waveL = 210, waveR = W - 15, waveT = 30, waveB = H - 30;
  const waveMidY = (waveT + waveB) / 2;
  const waveW = waveR - waveL, waveH = waveB - waveT;

  function tick() {
    if (!canvas.isConnected) return;
    const A = parseFloat(ampSlider?.value || 1);
    const omega = parseFloat(omegaSlider?.value || 2);
    const phi = parseFloat(phiSlider?.value || 0);
    const dt = 0.025;
    t += dt;

    document.getElementById('osc-amp-val')?.replaceChildren(document.createTextNode(A.toFixed(2)));
    document.getElementById('osc-omega-val')?.replaceChildren(document.createTextNode(omega.toFixed(1)));
    document.getElementById('osc-phi-val')?.replaceChildren(document.createTextNode(phi.toFixed(2)));

    draw(A, omega, phi);
    requestAnimationFrame(tick);
  }

  function draw(A, omega, phi) {
    wClear(ctx, W, H);
    const angle = omega * t + phi;
    const xPhasor = A * Math.cos(angle);
    const yPhasor = -A * Math.sin(angle); // screen coords (y down)

    // --- Phasor circle ---
    // Circle
    ctx.strokeStyle = WCOLORS.grid; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(pcx, pcy, pR * A, 0, Math.PI * 2); ctx.stroke();
    // Axes
    ctx.strokeStyle = 'rgba(31,42,46,0.15)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(pcx - pR - 10, pcy); ctx.lineTo(pcx + pR + 10, pcy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(pcx, pcy - pR - 10); ctx.lineTo(pcx, pcy + pR + 10); ctx.stroke();

    // Phasor arrow
    const tipX = pcx + xPhasor * pR;
    const tipY = pcy + yPhasor * pR;
    ctx.strokeStyle = WCOLORS.teal; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(pcx, pcy); ctx.lineTo(tipX, tipY); ctx.stroke();
    ctx.fillStyle = WCOLORS.teal;
    ctx.beginPath(); ctx.arc(tipX, tipY, 5, 0, Math.PI * 2); ctx.fill();

    // Angle arc
    ctx.strokeStyle = WCOLORS.amber; ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(pcx, pcy, 20, 0, -angle, angle > 0);
    ctx.stroke();
    // Angle label
    const labelAngle = -angle / 2;
    ctx.fillStyle = WCOLORS.amber; ctx.font = '10px system-ui, sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('\u03C9t+\u03C6', pcx + 30 * Math.cos(labelAngle), pcy + 30 * Math.sin(labelAngle) + 3);

    // Projection line (horizontal from phasor tip to wave)
    const projY = tipY;
    ctx.strokeStyle = WCOLORS.amber; ctx.lineWidth = 1; ctx.setLineDash([3, 3]);
    ctx.beginPath(); ctx.moveTo(tipX, tipY); ctx.lineTo(waveL, projY); ctx.stroke();
    ctx.setLineDash([]);

    // Projection dot on wave axis
    ctx.fillStyle = WCOLORS.amber;
    ctx.beginPath(); ctx.arc(waveL, projY, 4, 0, Math.PI * 2); ctx.fill();

    // Labels
    ctx.fillStyle = WCOLORS.text; ctx.font = '11px system-ui, sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('Phasor', pcx, pcy + pR + 24);
    ctx.fillStyle = WCOLORS.textDim; ctx.font = '10px system-ui, sans-serif';
    ctx.fillText('Re', pcx + pR + 16, pcy + 3);
    ctx.fillText('Im', pcx + 3, pcy - pR - 8);

    // --- Wave plot ---
    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(waveL, waveT); ctx.lineTo(waveL, waveB); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(waveL, waveMidY); ctx.lineTo(waveR, waveMidY); ctx.stroke();

    // Draw sine wave (show a few periods)
    const nPeriods = 3;
    const totalPhase = nPeriods * 2 * Math.PI;
    ctx.strokeStyle = WCOLORS.teal; ctx.lineWidth = 2;
    ctx.beginPath();
    for (let px = 0; px <= waveW; px++) {
      const phase = (px / waveW) * totalPhase;
      const val = A * Math.sin(phase + phi);
      const py = waveMidY - val * (waveH / 2) * 0.85;
      px === 0 ? ctx.moveTo(waveL + px, py) : ctx.lineTo(waveL + px, py);
    }
    ctx.stroke();

    // Current time marker on wave
    const tPhase = (omega * t) % totalPhase;
    const tPx = waveL + (tPhase / totalPhase) * waveW;
    const tVal = A * Math.sin(omega * t + phi);
    const tPy = waveMidY - tVal * (waveH / 2) * 0.85;
    ctx.fillStyle = WCOLORS.amber;
    ctx.beginPath(); ctx.arc(tPx, tPy, 5, 0, Math.PI * 2); ctx.fill();

    // Amplitude markers
    ctx.strokeStyle = 'rgba(31,42,46,0.12)'; ctx.setLineDash([3, 3]); ctx.lineWidth = 1;
    const ampPy = waveMidY - A * (waveH / 2) * 0.85;
    ctx.beginPath(); ctx.moveTo(waveL, ampPy); ctx.lineTo(waveR, ampPy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(waveL, 2 * waveMidY - ampPy); ctx.lineTo(waveR, 2 * waveMidY - ampPy); ctx.stroke();
    ctx.setLineDash([]);

    // Labels
    ctx.fillStyle = WCOLORS.amber; ctx.font = '10px system-ui, sans-serif'; ctx.textAlign = 'right';
    ctx.fillText('A', waveL - 6, ampPy + 3);
    ctx.fillText('\u2212A', waveL - 6, 2 * waveMidY - ampPy + 3);

    ctx.fillStyle = WCOLORS.text; ctx.font = '11px system-ui, sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('x(t) = A sin(\u03C9t + \u03C6)', waveL + waveW / 2, waveT - 6);
    ctx.fillText('t', waveR + 10, waveMidY + 4);
  }

  tick();
}

// =========================================================================
// 3. DAMPED OSCILLATOR EXPLORER
// =========================================================================
function initDampedOscillator() {
  const canvas = document.getElementById('scene-damped-oscillator');
  if (!canvas) return;
  const setup = wSetupCanvas(canvas);
  if (!setup) return;
  const { ctx, W, H } = setup;

  const gammaSlider = document.getElementById('damp-gamma');
  const massSlider = document.getElementById('damp-mass');
  const k = 25; // fixed spring constant

  // Physics state (real simulation)
  let x = 0, v = 0; // displacement and velocity
  let trail = []; // {t, x} for plot
  let t = 0;
  const maxTrail = 400;
  let dragging = false;
  let released = false; // has the user released at least once?

  // Layout
  const massX = 55, massEqY = H / 2, massMaxDisp = 70;
  const plotL = 140, plotR = W * 0.62, plotT = 30, plotB = H - 30;
  const plotW = plotR - plotL, plotH = plotB - plotT;
  const midY = (plotT + plotB) / 2;
  const rootCx = W * 0.82, rootCy = H / 2, rootR = 55;
  const bW = 36, bH = 28;

  // Drag interaction
  function getMouseY(e) {
    const rect = canvas.getBoundingClientRect();
    return (e.clientY || e.touches[0].clientY) - rect.top;
  }
  function startDrag(e) {
    const rect = canvas.getBoundingClientRect();
    const mx = (e.clientX || e.touches[0].clientX) - rect.left;
    const my = getMouseY(e);
    const massY = massEqY + x * massMaxDisp;
    if (mx > massX - 40 && mx < massX + 45 && Math.abs(my - massY) < 30) {
      dragging = true; v = 0; trail = []; t = 0;
    }
  }
  function moveDrag(e) {
    if (!dragging) return;
    const my = getMouseY(e);
    x = Math.max(-1, Math.min(1, (my - massEqY) / massMaxDisp));
  }
  function endDrag() {
    if (dragging) { dragging = false; released = true; trail = []; t = 0; }
  }

  canvas.addEventListener('mousedown', startDrag);
  canvas.addEventListener('mousemove', moveDrag);
  canvas.addEventListener('mouseup', endDrag);
  canvas.addEventListener('mouseleave', endDrag);
  canvas.addEventListener('touchstart', (e) => { e.preventDefault(); startDrag(e); }, { passive: false });
  canvas.addEventListener('touchmove', (e) => { if (dragging) { e.preventDefault(); moveDrag(e); } }, { passive: false });
  canvas.addEventListener('touchend', endDrag);

  function tick() {
    if (!canvas.isConnected) return;
    const gamma = parseFloat(gammaSlider?.value || 2);
    const m = parseFloat(massSlider?.value || 1);
    const omega0 = Math.sqrt(k / m);
    const dt = 0.018;

    document.getElementById('damp-gamma-val')?.replaceChildren(document.createTextNode(gamma.toFixed(1)));
    document.getElementById('damp-mass-val')?.replaceChildren(document.createTextNode(m.toFixed(1)));
    document.getElementById('damp-omega-val')?.replaceChildren(
      document.createTextNode('\u03C9\u2080 = \u221A(k/m) = ' + omega0.toFixed(2))
    );

    if (!dragging) {
      // Damped harmonic oscillator: a = -omega0^2 * x - gamma * v
      const a = -omega0 * omega0 * x - gamma * v;
      v += a * dt;
      x += v * dt;
      t += dt;

      // Record trail
      trail.push({ t, x });
      if (trail.length > maxTrail) trail.shift();
    }

    draw(gamma, m, omega0);
    requestAnimationFrame(tick);
  }

  function draw(gamma, m, omega0) {
    wClear(ctx, W, H);
    const Q = omega0 / Math.max(gamma, 0.01);
    const ratio = gamma / (2 * omega0);

    let regime, regimeColor;
    if (ratio < 0.99) { regime = 'Underdamped'; regimeColor = WCOLORS.teal; }
    else if (ratio < 1.01) { regime = 'Critically damped'; regimeColor = WCOLORS.amber; }
    else { regime = 'Overdamped'; regimeColor = WCOLORS.orange; }

    const massY = massEqY + x * massMaxDisp;

    // --- Spring-mass-dashpot ---
    // Ceiling
    ctx.fillStyle = WCOLORS.axis;
    ctx.fillRect(massX - 25, 18, 55, 5);
    ctx.strokeStyle = WCOLORS.textDim; ctx.lineWidth = 1;
    for (let i = 0; i < 5; i++) {
      ctx.beginPath(); ctx.moveTo(massX - 20 + i * 11, 18); ctx.lineTo(massX - 25 + i * 11, 12); ctx.stroke();
    }

    // Spring
    ctx.strokeStyle = regimeColor; ctx.lineWidth = 2;
    const springTop = 23, nCoils = 7;
    const springLen = Math.max(massY - 14 - springTop, 20);
    ctx.beginPath(); ctx.moveTo(massX, springTop);
    const segH = springLen / (nCoils * 2 + 2);
    let cy = springTop + segH;
    ctx.lineTo(massX, cy);
    for (let i = 0; i < nCoils; i++) {
      const dir = (i % 2 === 0) ? 1 : -1;
      ctx.lineTo(massX + dir * 12, cy + segH);
      cy += 2 * segH;
      ctx.lineTo(massX, cy);
    }
    ctx.lineTo(massX, massY - 14);
    ctx.stroke();

    // Dashpot
    const dpX = massX + 28, dpW = 8;
    ctx.strokeStyle = 'rgba(31,42,46,0.3)'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(dpX, springTop); ctx.lineTo(dpX, massEqY - 15); ctx.stroke();
    ctx.strokeRect(dpX - dpW / 2, massEqY - 15, dpW, 20);
    ctx.beginPath(); ctx.moveTo(dpX, massEqY + 5); ctx.lineTo(dpX, massY); ctx.stroke();

    // Mass block
    ctx.fillStyle = dragging ? WCOLORS.amber : regimeColor;
    ctx.beginPath(); ctx.roundRect(massX - bW / 2, massY - bH / 2, bW, bH, 4); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.font = 'bold 12px system-ui, sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('m', massX, massY + 4);

    // Equilibrium line
    ctx.strokeStyle = WCOLORS.textDim; ctx.lineWidth = 1; ctx.setLineDash([3, 3]);
    ctx.beginPath(); ctx.moveTo(massX - 25, massEqY); ctx.lineTo(massX + 30, massEqY); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = WCOLORS.textDim; ctx.font = '11px system-ui, sans-serif'; ctx.textAlign = 'left';
    ctx.fillText('eq', massX + 22, massEqY - 3);

    // Drag hint
    if (!released && trail.length < 3) {
      ctx.fillStyle = WCOLORS.textDim; ctx.font = '11px system-ui, sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('Drag the mass \u2195', massX, H - 8);
    }

    // --- x(t) plot ---
    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(plotL, plotT); ctx.lineTo(plotL, plotB); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(plotL, midY); ctx.lineTo(plotR, midY); ctx.stroke();
    ctx.fillStyle = WCOLORS.text; ctx.font = '11px system-ui, sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('x(t)', plotL - 14, plotT - 4);
    ctx.fillText('t', plotR + 8, midY + 4);

    // Trail
    if (trail.length > 1) {
      const tRange = Math.max(trail[trail.length - 1].t - trail[0].t, 4);
      ctx.strokeStyle = regimeColor; ctx.lineWidth = 2.5;
      ctx.beginPath();
      for (let i = 0; i < trail.length; i++) {
        const px = plotL + ((trail[i].t - trail[0].t) / tRange) * plotW;
        const py = midY - trail[i].x * (plotH / 2) * 0.85;
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Current dot
      const last = trail[trail.length - 1];
      const lx = plotL + ((last.t - trail[0].t) / tRange) * plotW;
      const ly = midY - last.x * (plotH / 2) * 0.85;
      ctx.fillStyle = WCOLORS.amber;
      ctx.beginPath(); ctx.arc(lx, ly, 5, 0, Math.PI * 2); ctx.fill();

      // Connecting line
      ctx.strokeStyle = 'rgba(217,119,6,0.25)'; ctx.lineWidth = 1; ctx.setLineDash([3, 3]);
      ctx.beginPath(); ctx.moveTo(massX + bW / 2 + 2, massY); ctx.lineTo(lx, ly); ctx.stroke();
      ctx.setLineDash([]);
    }

    // Regime label and Q
    ctx.fillStyle = regimeColor; ctx.font = 'bold 13px system-ui, sans-serif'; ctx.textAlign = 'left';
    ctx.fillText(regime, plotL + 5, plotB + 16);
    ctx.fillStyle = WCOLORS.text; ctx.font = '12px system-ui, sans-serif';
    ctx.fillText('Q = ' + Q.toFixed(1), plotL + plotW * 0.5, plotB + 16);

    // --- Root diagram ---
    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(rootCx - rootR - 15, rootCy); ctx.lineTo(rootCx + rootR + 15, rootCy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(rootCx, rootCy - rootR - 15); ctx.lineTo(rootCx, rootCy + rootR + 15); ctx.stroke();
    ctx.fillStyle = WCOLORS.textDim; ctx.font = '11px system-ui, sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('Re', rootCx + rootR + 12, rootCy - 6);
    ctx.fillText('Im', rootCx + 8, rootCy - rootR - 8);

    ctx.strokeStyle = WCOLORS.grid; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(rootCx, rootCy, rootR * omega0 / (omega0 + 2), 0, Math.PI * 2); ctx.stroke();

    const scale = rootR / (omega0 + 2);
    if (ratio < 1) {
      const re = -gamma / 2;
      const im = Math.sqrt(omega0 * omega0 - (gamma / 2) * (gamma / 2));
      ctx.fillStyle = WCOLORS.teal;
      ctx.beginPath(); ctx.arc(rootCx + re * scale, rootCy - im * scale, 6, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(rootCx + re * scale, rootCy + im * scale, 6, 0, Math.PI * 2); ctx.fill();
    } else if (ratio > 1) {
      const r1 = -gamma / 2 + Math.sqrt((gamma / 2) * (gamma / 2) - omega0 * omega0);
      const r2 = -gamma / 2 - Math.sqrt((gamma / 2) * (gamma / 2) - omega0 * omega0);
      ctx.fillStyle = WCOLORS.orange;
      ctx.beginPath(); ctx.arc(rootCx + r1 * scale, rootCy, 6, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(rootCx + r2 * scale, rootCy, 6, 0, Math.PI * 2); ctx.fill();
    } else {
      ctx.fillStyle = WCOLORS.amber;
      ctx.beginPath(); ctx.arc(rootCx + (-gamma / 2) * scale, rootCy, 7, 0, Math.PI * 2); ctx.fill();
    }

    ctx.fillStyle = WCOLORS.text; ctx.font = '11px system-ui, sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('Roots of \u03B1\u00B2 + \u03B3\u03B1 + \u03C9\u2080\u00B2 = 0', rootCx, rootCy + rootR + 28);
  }

  gammaSlider?.addEventListener('input', () => { v = 0; trail = []; t = 0; });
  massSlider?.addEventListener('input', () => { v = 0; trail = []; t = 0; });
  tick();
}

// =========================================================================
// 4. DAMPING REGIMES - RACE TO EQUILIBRIUM
// =========================================================================
function initDampingRegimes() {
  const canvas = document.getElementById('scene-damping-regimes');
  if (!canvas) return;
  const setup = wSetupCanvas(canvas);
  if (!setup) return;
  const { ctx, W, H } = setup;

  const omega0Slider = document.getElementById('regime-omega0');
  const goBtn = document.getElementById('regime-go');

  let t = 0;
  let running = false;
  let done = false;
  const tMax = 5;
  const nPts = 500;
  const x0 = 1;

  // Layout: three spring-mass systems on top, plot below
  const springZoneH = 130;
  const springY0 = 10; // top of spring zone
  const springSpacing = W / 3;
  const springEqY = springY0 + springZoneH * 0.45; // equilibrium line
  const springMaxDisp = 40;

  const plotL = 50, plotR = W - 25, plotT = springZoneH + 20, plotB = H - 30;
  const plotW = plotR - plotL, plotH = plotB - plotT;
  const midY = (plotT + plotB) / 2;

  function xt(omega0, gamma, tc) {
    const r = gamma / (2 * omega0);
    if (r < 1) {
      const wu = Math.sqrt(omega0 * omega0 - (gamma / 2) * (gamma / 2));
      return x0 * Math.exp(-gamma * tc / 2) * (Math.cos(wu * tc) + (gamma / (2 * wu)) * Math.sin(wu * tc));
    } else if (r > 1) {
      const r1 = -gamma / 2 + Math.sqrt((gamma / 2) * (gamma / 2) - omega0 * omega0);
      const r2 = -gamma / 2 - Math.sqrt((gamma / 2) * (gamma / 2) - omega0 * omega0);
      const A = x0 * r2 / (r2 - r1);
      const B = -x0 * r1 / (r2 - r1);
      return A * Math.exp(r1 * tc) + B * Math.exp(r2 * tc);
    } else {
      return x0 * (1 + gamma * tc / 2) * Math.exp(-gamma * tc / 2);
    }
  }

  function drawSpringMass(cx, eqY, disp, color, label, dampLabel) {
    const massY = eqY + disp * springMaxDisp;
    const ceilY = springY0 + 8;
    const bW = 32, bH = 24;

    // Ceiling
    ctx.fillStyle = WCOLORS.axis;
    ctx.fillRect(cx - 22, ceilY, 44, 4);
    ctx.strokeStyle = WCOLORS.textDim; ctx.lineWidth = 1;
    for (let i = 0; i < 4; i++) {
      ctx.beginPath(); ctx.moveTo(cx - 16 + i * 10, ceilY); ctx.lineTo(cx - 21 + i * 10, ceilY - 5); ctx.stroke();
    }

    // Spring
    ctx.strokeStyle = color; ctx.lineWidth = 1.8;
    const sTop = ceilY + 4;
    const sLen = Math.max(massY - bH / 2 - sTop, 15);
    const nCoils = 6;
    ctx.beginPath(); ctx.moveTo(cx, sTop);
    const seg = sLen / (nCoils * 2 + 2);
    let cy = sTop + seg;
    ctx.lineTo(cx, cy);
    for (let i = 0; i < nCoils; i++) {
      const dir = (i % 2 === 0) ? 1 : -1;
      ctx.lineTo(cx + dir * 10, cy + seg);
      cy += 2 * seg;
      ctx.lineTo(cx, cy);
    }
    ctx.lineTo(cx, massY - bH / 2);
    ctx.stroke();

    // Dashpot (small, beside spring)
    const dpX = cx + 18, dpW = 6;
    ctx.strokeStyle = color + '50'; ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.moveTo(dpX, sTop); ctx.lineTo(dpX, eqY - 10); ctx.stroke();
    ctx.strokeRect(dpX - dpW / 2, eqY - 10, dpW, 14);
    ctx.beginPath(); ctx.moveTo(dpX, eqY + 4); ctx.lineTo(dpX, massY); ctx.stroke();

    // Mass block
    ctx.fillStyle = color;
    ctx.beginPath(); ctx.roundRect(cx - bW / 2, massY - bH / 2, bW, bH, 3); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.font = 'bold 10px system-ui, sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('m', cx, massY + 3);

    // Eq line
    ctx.strokeStyle = WCOLORS.textDim + '40'; ctx.lineWidth = 1; ctx.setLineDash([2, 2]);
    ctx.beginPath(); ctx.moveTo(cx - 22, eqY); ctx.lineTo(cx + 22, eqY); ctx.stroke();
    ctx.setLineDash([]);

    // Labels
    ctx.fillStyle = color; ctx.font = '10px system-ui, sans-serif'; ctx.textAlign = 'center';
    ctx.fillText(label, cx, springY0 + springZoneH - 2);
    ctx.fillStyle = WCOLORS.textDim; ctx.font = '11px system-ui, sans-serif';
    ctx.fillText(dampLabel, cx, springY0 + springZoneH + 10);
  }

  function tick() {
    if (!canvas.isConnected) return;
    if (running) {
      t += 0.012;
      if (t >= tMax) {
        t = tMax;
        running = false;
        done = true;
        if (goBtn) goBtn.textContent = '\u25B6 Go';
      }
    }
    draw();
    requestAnimationFrame(tick);
  }

  function draw() {
    wClear(ctx, W, H);
    const omega0 = parseFloat(omega0Slider?.value || 5);
    document.getElementById('regime-omega0-val')?.replaceChildren(document.createTextNode(omega0.toFixed(1)));

    const gammaUD = omega0 * 0.5;
    const gammaC = 2 * omega0;
    const gammaOD = omega0 * 5;

    const curves = [
      { gamma: gammaUD, color: WCOLORS.teal, label: 'Underdamped', dampLabel: '\u03B3 = ' + gammaUD.toFixed(1) },
      { gamma: gammaC, color: WCOLORS.amber, label: 'Critical', dampLabel: '\u03B3 = ' + gammaC.toFixed(1) },
      { gamma: gammaOD, color: WCOLORS.orange, label: 'Overdamped', dampLabel: '\u03B3 = ' + gammaOD.toFixed(1) },
    ];

    // --- Three spring-mass systems ---
    for (let i = 0; i < 3; i++) {
      const cx = springSpacing * (i + 0.5);
      const curVal = xt(omega0, curves[i].gamma, t);
      drawSpringMass(cx, springEqY, curVal, curves[i].color, curves[i].label, curves[i].dampLabel);
    }

    // Divider
    ctx.strokeStyle = WCOLORS.grid; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(plotL, plotT - 8); ctx.lineTo(plotR, plotT - 8); ctx.stroke();

    // --- x(t) plot ---
    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(plotL, plotT); ctx.lineTo(plotL, plotB); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(plotL, midY); ctx.lineTo(plotR, midY); ctx.stroke();
    ctx.fillStyle = WCOLORS.text; ctx.font = '11px system-ui, sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('x(t)', plotL - 16, plotT - 2);
    ctx.fillText('t', plotR + 10, midY + 4);

    // Full curves (faint)
    for (const curve of curves) {
      ctx.strokeStyle = curve.color + '25'; ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (let i = 0; i <= nPts; i++) {
        const tc = (i / nPts) * tMax;
        const val = xt(omega0, curve.gamma, tc);
        const py = midY - val * (plotH / 2) * 0.85;
        const px = plotL + (i / nPts) * plotW;
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.stroke();
    }

    // Traced portions
    const curIdx = Math.floor((t / tMax) * nPts);
    for (const curve of curves) {
      ctx.strokeStyle = curve.color; ctx.lineWidth = 2.5;
      ctx.beginPath();
      for (let i = 0; i <= curIdx; i++) {
        const tc = (i / nPts) * tMax;
        const val = xt(omega0, curve.gamma, tc);
        const py = midY - val * (plotH / 2) * 0.85;
        const px = plotL + (i / nPts) * plotW;
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Dot
      const curVal = xt(omega0, curve.gamma, t);
      const dotPx = plotL + (t / tMax) * plotW;
      const dotPy = midY - curVal * (plotH / 2) * 0.85;
      ctx.fillStyle = curve.color;
      ctx.beginPath(); ctx.arc(dotPx, dotPy, 4, 0, Math.PI * 2); ctx.fill();
    }

    // omega0 label
    ctx.fillStyle = WCOLORS.text; ctx.font = '11px system-ui, sans-serif'; ctx.textAlign = 'right';
    ctx.fillText('\u03C9\u2080 = ' + omega0.toFixed(1), plotR, plotT - 2);
  }

  goBtn?.addEventListener('click', () => {
    t = 0; running = true; done = false;
    goBtn.textContent = '\u23F8 Stop';
  });
  omega0Slider?.addEventListener('input', () => { t = 0; running = false; done = false; if (goBtn) goBtn.textContent = '\u25B6 Go'; });
  draw();
  tick();
}

// =========================================================================
// EULER CIRCLE — unit circle phasor with real/imaginary projections
// =========================================================================
function initEulerCircle() {
  const canvas = document.getElementById('scene-euler-circle');
  if (!canvas) return;
  const setup = wSetupCanvas(canvas);
  if (!setup) return;
  const { ctx, W, H } = setup;

  let omega = 1.5;   // angular frequency
  let t = 0;
  let dragging = false;
  let trail = [];
  const maxTrail = 200;

  // Layout
  const cx = W * 0.3;          // circle center x
  const cy = H * 0.5;          // circle center y
  const R = Math.min(W * 0.22, H * 0.38);  // circle radius

  // Real-part plot on the right
  const plotL = W * 0.58, plotR = W - 15;
  const plotT = 30, plotB = H - 30;
  const plotW = plotR - plotL;
  const plotH = plotB - plotT;
  const plotMidY = (plotT + plotB) / 2;

  // Mouse: drag angle
  canvas.addEventListener('mousedown', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const dx = mx - cx, dy = my - cy;
    if (Math.sqrt(dx * dx + dy * dy) < R + 30) {
      dragging = true;
    }
  });
  canvas.addEventListener('mousemove', (e) => {
    if (!dragging) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    t = Math.atan2(-(my - cy), mx - cx) / omega;
  });
  canvas.addEventListener('mouseup', () => { dragging = false; });
  canvas.addEventListener('mouseleave', () => { dragging = false; });

  // Touch support
  canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const dx = touch.clientX - rect.left - cx;
    const dy = touch.clientY - rect.top - cy;
    if (Math.sqrt(dx * dx + dy * dy) < R + 40) dragging = true;
  }, { passive: false });
  canvas.addEventListener('touchmove', (e) => {
    if (!dragging) return;
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const my = e.touches[0].clientY - rect.top;
    const mx = e.touches[0].clientX - rect.left;
    t = Math.atan2(-(my - cy), mx - cx) / omega;
  }, { passive: false });
  canvas.addEventListener('touchend', () => { dragging = false; });

  function draw() {
    wClear(ctx, W, H);

    const theta = omega * t;
    const px = cx + R * Math.cos(theta);
    const py = cy - R * Math.sin(theta);  // canvas y is flipped

    // --- Unit circle ---
    // Axes
    ctx.strokeStyle = WCOLORS.grid;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cx - R - 20, cy); ctx.lineTo(cx + R + 20, cy);
    ctx.moveTo(cx, cy - R - 20); ctx.lineTo(cx, cy + R + 20);
    ctx.stroke();

    // Circle
    ctx.strokeStyle = 'rgba(31,42,46,0.2)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, 2 * Math.PI);
    ctx.stroke();

    // Axis labels
    ctx.font = '12px Georgia, serif';
    ctx.fillStyle = WCOLORS.textDim;
    ctx.textAlign = 'center';
    ctx.fillText('Re', cx + R + 16, cy + 14);
    ctx.fillText('Im', cx + 4, cy - R - 10);

    // Angle arc
    if (Math.abs(theta % (2 * Math.PI)) > 0.05) {
      ctx.strokeStyle = WCOLORS.amber;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      const arcR = R * 0.25;
      // Draw arc from 0 to theta (canvas convention: angles go clockwise)
      if (theta >= 0) {
        ctx.arc(cx, cy, arcR, 0, -theta, true);
      } else {
        ctx.arc(cx, cy, arcR, 0, -theta, false);
      }
      ctx.stroke();
      // Theta label
      const labelAngle = -theta / 2;
      ctx.fillStyle = WCOLORS.amber;
      ctx.font = '13px Georgia, serif';
      ctx.fillText('\u03B8', cx + arcR * 1.4 * Math.cos(labelAngle), cy + arcR * 1.4 * Math.sin(labelAngle) + 4);
    }

    // Projection lines (dashed)
    ctx.setLineDash([4, 4]);
    // cos projection (horizontal)
    ctx.strokeStyle = WCOLORS.teal;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(px, py); ctx.lineTo(px, cy);
    ctx.stroke();
    // sin projection (vertical)
    ctx.strokeStyle = WCOLORS.red;
    ctx.beginPath();
    ctx.moveTo(px, py); ctx.lineTo(cx, py);
    ctx.stroke();
    ctx.setLineDash([]);

    // cos component on real axis
    ctx.strokeStyle = WCOLORS.teal;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(cx, cy); ctx.lineTo(px, cy);
    ctx.stroke();
    // Label
    ctx.fillStyle = WCOLORS.teal;
    ctx.font = '11px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText('cos \u03B8', (cx + px) / 2, cy + 16);

    // sin component on imaginary axis
    ctx.strokeStyle = WCOLORS.red;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(cx, cy); ctx.lineTo(cx, py);
    ctx.stroke();
    ctx.fillStyle = WCOLORS.red;
    ctx.fillText('sin \u03B8', cx - 26, (cy + py) / 2 + 4);

    // Phasor arrow
    ctx.strokeStyle = WCOLORS.axis;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy); ctx.lineTo(px, py);
    ctx.stroke();
    // Arrowhead
    const aLen = 8, aAngle = 0.35;
    const pAngle = Math.atan2(py - cy, px - cx);
    ctx.fillStyle = WCOLORS.axis;
    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.lineTo(px - aLen * Math.cos(pAngle - aAngle), py - aLen * Math.sin(pAngle - aAngle));
    ctx.lineTo(px - aLen * Math.cos(pAngle + aAngle), py - aLen * Math.sin(pAngle + aAngle));
    ctx.closePath();
    ctx.fill();

    // Dot at phasor tip
    ctx.fillStyle = WCOLORS.amber;
    ctx.beginPath();
    ctx.arc(px, py, 5, 0, 2 * Math.PI);
    ctx.fill();

    // e^{i theta} label near dot
    ctx.fillStyle = WCOLORS.axis;
    ctx.font = '13px Georgia, serif';
    ctx.textAlign = 'left';
    const lx = px + 10, ly = py - 10;
    ctx.fillText('e', lx, ly);
    ctx.font = '10px Georgia, serif';
    ctx.fillText('i\u03B8', lx + 8, ly - 6);

    // --- Right plot: Re(e^{i omega t}) = cos(omega t) vs t ---
    // Record trail
    trail.push({ time: t, val: Math.cos(theta) });
    if (trail.length > maxTrail) trail.shift();

    // Plot axes
    ctx.strokeStyle = WCOLORS.axis;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(plotL, plotMidY); ctx.lineTo(plotR, plotMidY);
    ctx.moveTo(plotL, plotT); ctx.lineTo(plotL, plotB);
    ctx.stroke();

    // Labels
    ctx.fillStyle = WCOLORS.textDim;
    ctx.font = '11px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText('t', plotR - 2, plotMidY + 16);
    ctx.textAlign = 'right';
    ctx.fillText('cos(\u03B8)', plotL - 4, plotT + 4);

    // Guide lines at +1 and -1
    ctx.strokeStyle = WCOLORS.grid;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(plotL, plotT + 10); ctx.lineTo(plotR, plotT + 10);
    ctx.moveTo(plotL, plotB - 10); ctx.lineTo(plotR, plotB - 10);
    ctx.stroke();
    ctx.setLineDash([]);

    // Plot the trail
    if (trail.length > 1) {
      const tMin = trail[0].time;
      const tMax = trail[trail.length - 1].time;
      const tRange = Math.max(tMax - tMin, 0.01);

      ctx.strokeStyle = WCOLORS.teal;
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i < trail.length; i++) {
        const sx = plotL + ((trail[i].time - tMin) / tRange) * plotW;
        const sy = plotMidY - trail[i].val * (plotH / 2 - 10);
        if (i === 0) ctx.moveTo(sx, sy);
        else ctx.lineTo(sx, sy);
      }
      ctx.stroke();

      // Current point
      const lastPt = trail[trail.length - 1];
      const curX = plotR;
      const curY = plotMidY - lastPt.val * (plotH / 2 - 10);
      ctx.fillStyle = WCOLORS.teal;
      ctx.beginPath();
      ctx.arc(curX, curY, 4, 0, 2 * Math.PI);
      ctx.fill();

      // Connecting line from circle to plot
      ctx.strokeStyle = 'rgba(15,118,110,0.2)';
      ctx.setLineDash([3, 4]);
      ctx.beginPath();
      ctx.moveTo(px, cy); ctx.lineTo(curX, curY);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Title
    ctx.fillStyle = WCOLORS.axis;
    ctx.font = '13px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText('Euler\'s formula: e\u2071\u1D48 = cos \u03B8 + i sin \u03B8', cx, 16);
  }

  function tick() {
    if (!canvas.isConnected) return;
    if (!dragging) {
      t += 0.02;
    }
    draw();
    requestAnimationFrame(tick);
  }

  tick();
}

// =========================================================================
// LECTURE 2 INTERACTIVE SCENES
// =========================================================================

// =========================================================================
// 1. DRIVEN OSCILLATOR — flywheel cam drives spring-mass + amplitude/phase curves
// =========================================================================
function initDrivenOscillator() {
  const canvas = document.getElementById('scene-driven-oscillator');
  if (!canvas) return;
  const setup = wSetupCanvas(canvas);
  if (!setup) return;
  const { ctx, W, H } = setup;

  const wdSlider = document.getElementById('driven-wd');
  const w0Slider = document.getElementById('driven-w0');
  const gammaSlider = document.getElementById('driven-gamma');

  let t = 0;
  let trail = [];
  const maxTrail = 300;

  // Steady-state solution
  function getAB(w0, wd, gamma) {
    const denom = (w0 * w0 - wd * wd) * (w0 * w0 - wd * wd) + (gamma * wd) * (gamma * wd);
    const A = (w0 * w0 - wd * wd) / denom;
    const B = (gamma * wd) / denom;
    return { A, B, amp: Math.sqrt(A * A + B * B), phase: -Math.atan2(B, A) };
  }

  // Layout: top = flywheel + spring-mass, bottom-left = x(t), bottom-right = amp & phase
  const trackY = H * 0.24;
  const camCx = 60, camCy = trackY, camR = 24;
  const wallX = W * 0.46;
  const massW = 32, massH = 24;
  const massEqX = W * 0.30;
  const maxDisp = 40;

  const plotL = 20, plotR = W * 0.46, plotT = H * 0.52, plotB = H - 14;
  const plotW = plotR - plotL, plotH = plotB - plotT;

  const ampL = W * 0.54, ampR = W - 15, ampT = H * 0.08, ampB = H * 0.48;
  const phL = ampL, phR = ampR, phT = H * 0.55, phB = H - 15;

  function drawHorizSpring(x1, x2, y, coils, coilAmp) {
    const len = x2 - x1;
    if (len <= 0) return;
    ctx.beginPath(); ctx.moveTo(x1, y);
    const segLen = len / (coils * 2 + 2);
    let cx = x1 + segLen;
    ctx.lineTo(cx, y);
    for (let i = 0; i < coils; i++) {
      const midX = cx + segLen;
      ctx.lineTo(midX, y + coilAmp * ((i % 2 === 0) ? 1 : -1));
      cx = midX + segLen;
      ctx.lineTo(cx, y);
    }
    ctx.lineTo(x2, y); ctx.stroke();
  }

  function tick() {
    if (!canvas.isConnected) return;
    const wd = parseFloat(wdSlider?.value || 3);
    const w0 = parseFloat(w0Slider?.value || 5);
    const gamma = parseFloat(gammaSlider?.value || 0.2);
    const dt = 0.025;
    t += dt;

    document.getElementById('driven-wd-val')?.replaceChildren(document.createTextNode(wd.toFixed(2)));
    document.getElementById('driven-w0-val')?.replaceChildren(document.createTextNode(w0.toFixed(1)));
    document.getElementById('driven-gamma-val')?.replaceChildren(document.createTextNode(gamma.toFixed(1)));

    // Position resonance marker on wd slider
    const resMarker = document.getElementById('driven-res-marker');
    if (resMarker && wdSlider) {
      const min = parseFloat(wdSlider.min), max = parseFloat(wdSlider.max);
      const pct = ((w0 - min) / (max - min)) * 100;
      const sliderRect = wdSlider.getBoundingClientRect();
      const labelRect = wdSlider.parentElement.getBoundingClientRect();
      const offset = sliderRect.left - labelRect.left + (pct / 100) * sliderRect.width;
      resMarker.style.left = offset + 'px';
      resMarker.style.display = (w0 >= min && w0 <= max) ? '' : 'none';
    }

    const { A, B } = getAB(w0, wd, gamma);
    const x = A * Math.cos(wd * t) + B * Math.sin(wd * t);
    const force = Math.cos(wd * t);

    trail.push({ t, x, force });
    if (trail.length > maxTrail) trail.shift();

    draw(wd, w0, gamma, x, force);
    requestAnimationFrame(tick);
  }

  function draw(wd, w0, gamma, x, force) {
    wClear(ctx, W, H);

    // === FLYWHEEL CAM MECHANISM (top) ===
    const camAngle = wd * t;
    const pinX = camCx + camR * 0.7 * Math.cos(camAngle);
    const pinY = camCy - camR * 0.7 * Math.sin(camAngle);
    const massX = massEqX + x * maxDisp * 8;

    // Motor housing
    ctx.fillStyle = '#e8e0d4'; ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 1.5;
    const motorW = 22, motorH = camR * 2 + 12;
    ctx.fillRect(camCx - camR - motorW, camCy - motorH / 2, motorW, motorH);
    ctx.strokeRect(camCx - camR - motorW, camCy - motorH / 2, motorW, motorH);

    ctx.save();
    ctx.fillStyle = WCOLORS.textDim; ctx.font = '7px system-ui'; ctx.textAlign = 'center';
    ctx.translate(camCx - camR - motorW / 2, camCy);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('MOTOR', 0, 3);
    ctx.restore();

    // Flywheel
    ctx.beginPath(); ctx.arc(camCx, camCy, camR, 0, 2 * Math.PI);
    ctx.fillStyle = '#d4cfc6'; ctx.fill();
    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 2; ctx.stroke();

    // Spokes
    ctx.strokeStyle = 'rgba(31,42,46,0.18)'; ctx.lineWidth = 1;
    for (let s = 0; s < 4; s++) {
      const sa = camAngle + s * Math.PI / 2;
      ctx.beginPath(); ctx.moveTo(camCx, camCy);
      ctx.lineTo(camCx + camR * 0.88 * Math.cos(sa), camCy - camR * 0.88 * Math.sin(sa));
      ctx.stroke();
    }

    // Center axle
    ctx.beginPath(); ctx.arc(camCx, camCy, 3, 0, 2 * Math.PI);
    ctx.fillStyle = WCOLORS.axis; ctx.fill();

    // Crank pin
    ctx.beginPath(); ctx.arc(pinX, pinY, 3.5, 0, 2 * Math.PI);
    ctx.fillStyle = WCOLORS.amber; ctx.fill();
    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 1; ctx.stroke();

    // Push rod
    const rodEndX = massX - massW / 2 - 2;
    ctx.strokeStyle = WCOLORS.amber; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(pinX, pinY); ctx.lineTo(rodEndX, trackY); ctx.stroke();
    ctx.beginPath(); ctx.arc(rodEndX, trackY, 2.5, 0, 2 * Math.PI);
    ctx.fillStyle = WCOLORS.amber; ctx.fill();

    // Track
    ctx.strokeStyle = WCOLORS.textDim; ctx.lineWidth = 1;
    const groundY = trackY + massH / 2 + 2;
    ctx.beginPath(); ctx.moveTo(camCx + camR + 6, groundY); ctx.lineTo(wallX, groundY); ctx.stroke();
    for (let hx = camCx + camR + 12; hx < wallX; hx += 10) {
      ctx.beginPath(); ctx.moveTo(hx, groundY); ctx.lineTo(hx - 3, groundY + 5); ctx.stroke();
    }

    // Mass block
    ctx.fillStyle = WCOLORS.teal;
    ctx.fillRect(massX - massW / 2, trackY - massH / 2, massW, massH);
    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 1.5;
    ctx.strokeRect(massX - massW / 2, trackY - massH / 2, massW, massH);
    ctx.fillStyle = '#fff'; ctx.font = 'bold 11px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('m', massX, trackY + 4);

    // Spring (mass to wall)
    ctx.strokeStyle = WCOLORS.teal; ctx.lineWidth = 2;
    drawHorizSpring(massX + massW / 2, wallX - 4, trackY, 8, 8);

    // Right wall
    ctx.fillStyle = WCOLORS.axis;
    ctx.fillRect(wallX - 4, trackY - 22, 5, 44);
    ctx.strokeStyle = WCOLORS.textDim; ctx.lineWidth = 1;
    for (let i = 0; i < 4; i++) {
      const hy = trackY - 18 + i * 10;
      ctx.beginPath(); ctx.moveTo(wallX + 1, hy); ctx.lineTo(wallX + 6, hy - 4); ctx.stroke();
    }

    // Equilibrium marker
    ctx.strokeStyle = WCOLORS.textDim + '50'; ctx.lineWidth = 1; ctx.setLineDash([3, 3]);
    ctx.beginPath(); ctx.moveTo(massEqX, trackY - massH / 2 - 5); ctx.lineTo(massEqX, trackY + massH / 2 + 8); ctx.stroke();
    ctx.setLineDash([]);

    // Force arrow above mass
    const arrowLen = force * 22;
    if (Math.abs(arrowLen) > 2) {
      const arrowY = trackY - massH / 2 - 8;
      ctx.strokeStyle = WCOLORS.amber; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(massX, arrowY); ctx.lineTo(massX + arrowLen, arrowY); ctx.stroke();
      const dir = arrowLen > 0 ? 1 : -1;
      ctx.fillStyle = WCOLORS.amber;
      ctx.beginPath();
      ctx.moveTo(massX + arrowLen, arrowY);
      ctx.lineTo(massX + arrowLen - dir * 5, arrowY - 3);
      ctx.lineTo(massX + arrowLen - dir * 5, arrowY + 3);
      ctx.closePath(); ctx.fill();
      ctx.font = '9px system-ui'; ctx.textAlign = 'center';
      ctx.fillText('F', massX + arrowLen / 2, arrowY - 4);
    }

    // === x(t) TRAIL PLOT (bottom left) ===
    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(plotL, plotT); ctx.lineTo(plotL, plotB); ctx.stroke();
    const midY = (plotT + plotB) / 2;
    ctx.beginPath(); ctx.moveTo(plotL, midY); ctx.lineTo(plotR, midY); ctx.stroke();
    ctx.fillStyle = WCOLORS.textDim; ctx.font = '10px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('x(t)', plotL - 12, plotT - 2);
    ctx.fillText('t', plotR + 8, midY + 3);

    if (trail.length > 1) {
      const tRange = Math.max(trail[trail.length - 1].t - trail[0].t, 3);
      // Force trace (faded)
      ctx.strokeStyle = WCOLORS.amber + '40'; ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (let i = 0; i < trail.length; i++) {
        const px = plotL + ((trail[i].t - trail[0].t) / tRange) * plotW;
        const py = midY - trail[i].force * plotH * 0.15;
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Response trace
      ctx.strokeStyle = WCOLORS.teal; ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i < trail.length; i++) {
        const px = plotL + ((trail[i].t - trail[0].t) / tRange) * plotW;
        const py = midY - trail[i].x * plotH * 0.4 * 8;
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.stroke();
    }

    ctx.fillStyle = WCOLORS.amber; ctx.font = '11px system-ui'; ctx.textAlign = 'left';
    ctx.fillText('F(t)', plotL + 3, plotT + 10);
    ctx.fillStyle = WCOLORS.teal;
    ctx.fillText('x(t)', plotL + 3, plotT + 22);

    // === AMPLITUDE vs wd CURVE (right upper) ===
    const ampW = ampR - ampL, ampH = ampB - ampT;
    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(ampL, ampT); ctx.lineTo(ampL, ampB); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(ampL, ampB); ctx.lineTo(ampR, ampB); ctx.stroke();
    ctx.fillStyle = WCOLORS.textDim; ctx.font = '11px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('|x|', ampL - 10, ampT + 3);
    ctx.fillText('\u03c9', ampR - 4, ampB + 12);
    ctx.save(); ctx.font = '7px system-ui'; ctx.fillText('d', ampR + 4, ampB + 14); ctx.restore();

    const wMax = 10;
    let maxAmp = 0;
    for (let i = 0; i <= 200; i++) {
      const w = (i / 200) * wMax;
      const a = getAB(w0, w, gamma).amp;
      if (a > maxAmp) maxAmp = a;
    }
    if (maxAmp < 0.001) maxAmp = 1;

    ctx.strokeStyle = WCOLORS.teal; ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i <= 200; i++) {
      const w = (i / 200) * wMax;
      const a = getAB(w0, w, gamma).amp;
      const px = ampL + (w / wMax) * ampW;
      const py = ampB - (a / maxAmp) * ampH * 0.9;
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Current wd marker
    const curAmp = getAB(w0, wd, gamma).amp;
    const dotX = ampL + (wd / wMax) * ampW;
    const dotY = ampB - (curAmp / maxAmp) * ampH * 0.9;
    ctx.fillStyle = WCOLORS.amber;
    ctx.beginPath(); ctx.arc(dotX, dotY, 5, 0, Math.PI * 2); ctx.fill();

    // w0 line
    const w0px = ampL + (w0 / wMax) * ampW;
    ctx.strokeStyle = WCOLORS.textDim; ctx.lineWidth = 1; ctx.setLineDash([3, 3]);
    ctx.beginPath(); ctx.moveTo(w0px, ampT); ctx.lineTo(w0px, ampB); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = WCOLORS.textDim; ctx.font = '10px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('\u03c9\u2080', w0px, ampB + 12);

    // === PHASE vs wd CURVE (right lower) ===
    const phW = phR - phL, phH = phB - phT;
    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(phL, phT); ctx.lineTo(phL, phB); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(phL, phB); ctx.lineTo(phR, phB); ctx.stroke();
    ctx.fillStyle = WCOLORS.textDim; ctx.font = '11px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('Phase', phL - 14, phT + 3);
    ctx.fillText('\u03c9', phR - 4, phB + 12);
    ctx.save(); ctx.font = '7px system-ui'; ctx.fillText('d', phR + 4, phB + 14); ctx.restore();

    // Phase labels
    ctx.fillStyle = WCOLORS.textDim; ctx.font = '10px system-ui'; ctx.textAlign = 'right';
    ctx.fillText('0\u00b0', phL - 3, phT + 4);
    ctx.fillText('\u221290\u00b0', phL - 3, (phT + phB) / 2 + 3);
    ctx.fillText('\u2212180\u00b0', phL - 3, phB + 3);

    // Guideline at -90
    ctx.strokeStyle = WCOLORS.grid; ctx.lineWidth = 1; ctx.setLineDash([3, 3]);
    ctx.beginPath(); ctx.moveTo(phL, (phT + phB) / 2); ctx.lineTo(phR, (phT + phB) / 2); ctx.stroke();
    ctx.setLineDash([]);

    // Phase curve
    ctx.strokeStyle = WCOLORS.red; ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i <= 200; i++) {
      const w = (i / 200) * wMax;
      const ph = getAB(w0, Math.max(w, 0.01), gamma).phase;
      const px = phL + (w / wMax) * phW;
      const py = phT + (-ph / Math.PI) * phH;
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Current phase marker
    const curPh = getAB(w0, wd, gamma).phase;
    const phDotX = phL + (wd / wMax) * phW;
    const phDotY = phT + (-curPh / Math.PI) * phH;
    ctx.fillStyle = WCOLORS.amber;
    ctx.beginPath(); ctx.arc(phDotX, phDotY, 5, 0, Math.PI * 2); ctx.fill();

    // w0 line on phase plot
    ctx.strokeStyle = WCOLORS.textDim; ctx.lineWidth = 1; ctx.setLineDash([3, 3]);
    ctx.beginPath(); ctx.moveTo(w0px, phT); ctx.lineTo(w0px, phB); ctx.stroke();
    ctx.setLineDash([]);
  }

  wdSlider?.addEventListener('input', () => { trail = []; t = 0; });
  w0Slider?.addEventListener('input', () => { trail = []; t = 0; });
  gammaSlider?.addEventListener('input', () => { trail = []; t = 0; });
  tick();
}

// =========================================================================
// 2. TRANSIENT DECAY — driven oscillator with transient from initial conditions
// =========================================================================
function initTransientDecay() {
  const canvas = document.getElementById('scene-transient-decay');
  if (!canvas) return;
  const setup = wSetupCanvas(canvas);
  if (!setup) return;
  const { ctx, W, H } = setup;

  let t = 0;
  let w0 = 5, wd = 4, gamma = 0.8;
  const tMax = 14;

  // Layout: flywheel+spring-mass across top, plot below
  const mechH = 90;            // height of mechanical diagram
  const mechY = mechH / 2 + 6; // vertical center of mechanism

  // Flywheel cam
  const camCx = 50, camCy = mechY, camR = 20;

  // Mass + spring (to the right of cam)
  const massEqX = 190, massW2 = 26, massH2 = 24;
  const wallX = W * 0.48;      // right wall
  const maxDisp = 40;

  // Plot region (below mechanism, use remaining height generously)
  const plotL = 46, plotR = W - 14, plotT = mechH + 18, plotB = H - 18;
  const plotW = plotR - plotL, plotH = plotB - plotT;
  const midY = (plotT + plotB) / 2;

  // Sliders
  const wdSlider = document.getElementById('transient-wd');
  const w0Slider = document.getElementById('transient-w0');
  const gammaSlider = document.getElementById('transient-gamma');
  const wdVal = document.getElementById('transient-wd-val');
  const w0Val = document.getElementById('transient-w0-val');
  const gammaVal = document.getElementById('transient-gamma-val');
  const restartBtn = document.getElementById('transient-restart');

  // Driven oscillator math: x_total = x_ss + x_transient
  // x_ss = A cos(wd t) + B sin(wd t)
  // x_tr = e^{-gamma/2 t} (C1 cos(wu t) + C2 sin(wu t))
  // General IC: x(0) = x0, v(0) = 0
  //   => C1 = x0 - A,  C2 = -(B wd + gamma/2 C1) / wu
  let A, B, wu, C1, C2;
  let x0 = 0;       // initial displacement set by drag (in same units as A,B)
  let dragging = false;

  function recompute() {
    const denom = (w0 * w0 - wd * wd) ** 2 + (gamma * wd) ** 2;
    A = (w0 * w0 - wd * wd) / denom;
    B = (gamma * wd) / denom;
    const wuSq = w0 * w0 - (gamma / 2) ** 2;
    wu = wuSq > 0 ? Math.sqrt(wuSq) : 0.01;
    C1 = x0 - A;
    C2 = -(B * wd + (gamma / 2) * C1) / wu;
  }

  recompute();

  function xSS(tc) {
    return A * Math.cos(wd * tc) + B * Math.sin(wd * tc);
  }

  function xTr(tc) {
    return Math.exp(-gamma / 2 * tc) * (C1 * Math.cos(wu * tc) + C2 * Math.sin(wu * tc));
  }

  function xTotal(tc) {
    return xSS(tc) + xTr(tc);
  }

  function onSliderChange() {
    wd = parseFloat(wdSlider.value);
    w0 = parseFloat(w0Slider.value);
    gamma = parseFloat(gammaSlider.value);
    wdVal.textContent = wd.toFixed(1);
    w0Val.textContent = w0.toFixed(1);
    gammaVal.textContent = gamma.toFixed(1);
    x0 = 0;
    recompute();
    t = 0;
  }

  if (wdSlider) wdSlider.addEventListener('input', onSliderChange);
  if (w0Slider) w0Slider.addEventListener('input', onSliderChange);
  if (gammaSlider) gammaSlider.addEventListener('input', onSliderChange);
  if (restartBtn) restartBtn.addEventListener('click', () => { x0 = 0; recompute(); t = 0; });

  // --- Drag the mass to set initial displacement ---
  // The pixel-to-physics scale factor used in draw
  const pixPerUnit = maxDisp * 6;

  function canvasCoords(e) {
    const rect = canvas.getBoundingClientRect();
    return {
      mx: (e.touches ? e.touches[0].clientX : e.clientX) - rect.left,
      my: (e.touches ? e.touches[0].clientY : e.clientY) - rect.top
    };
  }

  function onDown(e) {
    // Compute current mass pixel position
    const xNow = dragging ? x0 : xTotal(t);
    const massPx = massEqX + xNow * pixPerUnit;
    const { mx, my } = canvasCoords(e);
    if (Math.abs(mx - massPx) < massW2 + 10 && Math.abs(my - mechY) < massH2 + 10) {
      dragging = true;
      e.preventDefault();
    }
  }

  function onMove(e) {
    if (!dragging) return;
    const { mx } = canvasCoords(e);
    x0 = (mx - massEqX) / pixPerUnit;
    // Clamp so mass stays between cam and wall
    const minX = (camCx + camR + 20 - massEqX) / pixPerUnit;
    const maxX = (wallX - 20 - massEqX) / pixPerUnit;
    x0 = Math.max(minX, Math.min(maxX, x0));
    e.preventDefault();
  }

  function onUp() {
    if (!dragging) return;
    dragging = false;
    recompute();   // set C1, C2 from new x0
    t = 0;         // restart with these initial conditions
  }

  canvas.addEventListener('mousedown', onDown);
  canvas.addEventListener('mousemove', onMove);
  canvas.addEventListener('mouseup', onUp);
  canvas.addEventListener('mouseleave', onUp);
  canvas.addEventListener('touchstart', onDown, { passive: false });
  canvas.addEventListener('touchmove', onMove, { passive: false });
  canvas.addEventListener('touchend', onUp);

  // Horizontal spring helper
  function drawSpringH(x1, x2, y, coils, coilH) {
    const len = x2 - x1;
    ctx.beginPath();
    ctx.moveTo(x1, y);
    const segLen = len / (coils * 2 + 2);
    let cx = x1 + segLen;
    ctx.lineTo(cx, y);
    for (let i = 0; i < coils; i++) {
      const mx = cx + segLen;
      ctx.lineTo(mx, y + coilH * ((i % 2 === 0) ? 1 : -1));
      cx = mx + segLen;
      ctx.lineTo(cx, y);
    }
    ctx.lineTo(x2, y);
    ctx.stroke();
  }

  function tick() {
    if (!canvas.isConnected) return;
    if (!dragging) {
      t += 0.025;
      if (t > tMax) t = 0;
    }
    draw();
    requestAnimationFrame(tick);
  }

  function draw() {
    wClear(ctx, W, H);

    const xNow = dragging ? x0 : xTotal(t);
    const massX = massEqX + xNow * pixPerUnit;
    const camAngle = wd * t;

    // === MECHANISM (top) ===
    const groundY = mechY + massH2 / 2 + 3;

    // Motor housing
    ctx.fillStyle = '#e8e0d4'; ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 1.5;
    const motorW = 18, motorH2 = camR * 2 + 10;
    ctx.fillRect(camCx - camR - motorW, camCy - motorH2 / 2, motorW, motorH2);
    ctx.strokeRect(camCx - camR - motorW, camCy - motorH2 / 2, motorW, motorH2);
    ctx.save();
    ctx.fillStyle = WCOLORS.textDim; ctx.font = '6px system-ui'; ctx.textAlign = 'center';
    ctx.translate(camCx - camR - motorW / 2, camCy);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('MOTOR', 0, 3);
    ctx.restore();

    // Flywheel disc
    ctx.beginPath(); ctx.arc(camCx, camCy, camR, 0, 2 * Math.PI);
    ctx.fillStyle = '#d4cfc6'; ctx.fill();
    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 1.5; ctx.stroke();

    // Spokes
    ctx.strokeStyle = 'rgba(31,42,46,0.18)'; ctx.lineWidth = 1;
    for (let s = 0; s < 4; s++) {
      const sa = camAngle + s * Math.PI / 2;
      ctx.beginPath(); ctx.moveTo(camCx, camCy);
      ctx.lineTo(camCx + camR * 0.85 * Math.cos(sa), camCy - camR * 0.85 * Math.sin(sa));
      ctx.stroke();
    }

    // Center axle
    ctx.beginPath(); ctx.arc(camCx, camCy, 2.5, 0, 2 * Math.PI);
    ctx.fillStyle = WCOLORS.axis; ctx.fill();

    // Crank pin
    const pinX = camCx + camR * 0.65 * Math.cos(camAngle);
    const pinY = camCy - camR * 0.65 * Math.sin(camAngle);
    ctx.beginPath(); ctx.arc(pinX, pinY, 3, 0, 2 * Math.PI);
    ctx.fillStyle = WCOLORS.amber; ctx.fill();
    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 1; ctx.stroke();

    // Push rod from pin to mass
    const rodEndX = massX - massW2 / 2 - 2;
    ctx.strokeStyle = WCOLORS.amber; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(pinX, pinY); ctx.lineTo(rodEndX, mechY); ctx.stroke();
    ctx.beginPath(); ctx.arc(rodEndX, mechY, 2, 0, 2 * Math.PI);
    ctx.fillStyle = WCOLORS.amber; ctx.fill();

    // Ground / track
    ctx.strokeStyle = WCOLORS.textDim; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(camCx + camR + 4, groundY); ctx.lineTo(wallX, groundY); ctx.stroke();
    for (let hx = camCx + camR + 10; hx < wallX; hx += 8) {
      ctx.beginPath(); ctx.moveTo(hx, groundY); ctx.lineTo(hx - 3, groundY + 4); ctx.stroke();
    }

    // Mass block (amber highlight when dragging)
    ctx.fillStyle = dragging ? WCOLORS.amber : WCOLORS.teal;
    ctx.fillRect(massX - massW2 / 2, mechY - massH2 / 2, massW2, massH2);
    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 1;
    ctx.strokeRect(massX - massW2 / 2, mechY - massH2 / 2, massW2, massH2);
    ctx.fillStyle = '#fff'; ctx.font = 'bold 10px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('m', massX, mechY + 4);

    // Spring (mass to right wall)
    ctx.strokeStyle = WCOLORS.teal; ctx.lineWidth = 2;
    drawSpringH(massX + massW2 / 2, wallX - 3, mechY, 7, 7);

    // Right wall
    ctx.fillStyle = WCOLORS.axis;
    ctx.fillRect(wallX - 3, mechY - 20, 4, 40);
    ctx.strokeStyle = WCOLORS.textDim; ctx.lineWidth = 1;
    for (let i = 0; i < 4; i++) {
      const hy = mechY - 16 + i * 9;
      ctx.beginPath(); ctx.moveTo(wallX + 1, hy); ctx.lineTo(wallX + 6, hy + 5); ctx.stroke();
    }

    // ωd label under flywheel
    ctx.fillStyle = WCOLORS.textDim; ctx.font = '9px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('\u03c9', camCx - 2, camCy + camR + 13);
    ctx.font = '7px system-ui';
    ctx.fillText('d', camCx + 5, camCy + camR + 15);

    // Drag instruction (right of mechanism)
    ctx.font = '10px system-ui'; ctx.textAlign = 'left';
    if (dragging) {
      ctx.fillStyle = WCOLORS.amber;
      ctx.fillText('release to set initial condition', wallX + 12, mechY - 4);
      ctx.fillText('x(0) = ' + x0.toFixed(2), wallX + 12, mechY + 10);
    } else {
      ctx.fillStyle = WCOLORS.textDim;
      ctx.fillText('drag mass \u2194 to set x(0)', wallX + 12, mechY + 3);
    }

    // === PLOT (below) ===
    // Axes
    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(plotL, plotT); ctx.lineTo(plotL, plotB); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(plotL, midY); ctx.lineTo(plotR, midY); ctx.stroke();
    ctx.fillStyle = WCOLORS.text; ctx.font = '11px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('x(t)', plotL - 16, plotT - 2);
    ctx.fillText('t', plotR + 10, midY + 3);

    // Compute scale from max possible amplitude
    const ssAmp = Math.sqrt(A * A + B * B);
    const trAmp = Math.sqrt(C1 * C1 + C2 * C2);
    const peakEst = ssAmp + trAmp;
    const scale = (plotH / 2 - 4) / Math.max(peakEst, 0.01);
    const nPts = 500;

    // Envelope of transient
    ctx.strokeStyle = WCOLORS.textDim + '25'; ctx.lineWidth = 1; ctx.setLineDash([4, 4]);
    for (let sign = -1; sign <= 1; sign += 2) {
      ctx.beginPath();
      for (let i = 0; i <= nPts; i++) {
        const tc = (i / nPts) * tMax;
        const env = sign * trAmp * Math.exp(-gamma / 2 * tc);
        // Shift envelope around steady state amplitude
        const px = plotL + (i / nPts) * plotW;
        i === 0 ? ctx.moveTo(px, midY - env * scale) : ctx.lineTo(px, midY - env * scale);
      }
      ctx.stroke();
    }
    ctx.setLineDash([]);

    // Steady-state (faded amber)
    ctx.strokeStyle = WCOLORS.amber + '55'; ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (let i = 0; i <= nPts; i++) {
      const tc = (i / nPts) * tMax;
      const px = plotL + (i / nPts) * plotW;
      const py = midY - xSS(tc) * scale;
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Transient only (faded red)
    ctx.strokeStyle = WCOLORS.red + '40'; ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (let i = 0; i <= nPts; i++) {
      const tc = (i / nPts) * tMax;
      const px = plotL + (i / nPts) * plotW;
      const py = midY - xTr(tc) * scale;
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Total x(t) up to current time (bold teal)
    const curIdx = Math.floor((t / tMax) * nPts);
    ctx.strokeStyle = WCOLORS.teal; ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let i = 0; i <= curIdx; i++) {
      const tc = (i / nPts) * tMax;
      const px = plotL + (i / nPts) * plotW;
      const py = midY - xTotal(tc) * scale;
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Tracking dot
    const dotPx = plotL + (t / tMax) * plotW;
    const dotPy = midY - xNow * scale;
    ctx.fillStyle = WCOLORS.teal;
    ctx.beginPath(); ctx.arc(dotPx, dotPy, 4, 0, Math.PI * 2); ctx.fill();

    // Legend
    ctx.font = '10px system-ui'; ctx.textAlign = 'left';
    const legY = plotB + 10;
    ctx.fillStyle = WCOLORS.teal; ctx.fillText('\u2014 Total x(t)', plotL + 4, legY);
    ctx.fillStyle = WCOLORS.amber; ctx.fillText('\u2014 Steady state', plotL + 100, legY);
    ctx.fillStyle = WCOLORS.red; ctx.fillText('\u2014 Transient', plotL + 220, legY);
  }

  tick();
}

// =========================================================================
// 3. PHASE LAG — spinning cam drives a spring-mass system
// =========================================================================
function initPhaseLag() {
  const canvas = document.getElementById('scene-phase-lag');
  if (!canvas) return;
  const setup = wSetupCanvas(canvas);
  if (!setup) return;
  const { ctx, W, H } = setup;

  let t = 0;

  // Embed a slider if the canvas has a parent scene
  let wdSlider = document.getElementById('phase-lag-wd');
  if (!wdSlider) {
    const parent = canvas.parentElement;
    if (parent) {
      const controls = document.createElement('div');
      controls.className = 'scene-controls';
      controls.innerHTML = '<label style="position:relative"><span>\u03c9<sub>d</sub>:</span> <input type="range" id="phase-lag-wd" min="0.5" max="10" step="0.1" value="3"><span class="scene-val" id="phase-lag-wd-val">3.0</span><span id="phase-lag-res-marker" style="position:absolute;bottom:-2px;pointer-events:none;font-size:8px;color:var(--w-amber,#f59e0b);transform:translateX(-50%)" title="\u03c9\u2080">\u25b2</span></label>';
      parent.appendChild(controls);
      wdSlider = document.getElementById('phase-lag-wd');
    }
  }

  const w0 = 5, gamma = 0.5;

  function getAB(wd) {
    const denom = (w0 * w0 - wd * wd) ** 2 + (gamma * wd) ** 2;
    return { A: (w0 * w0 - wd * wd) / denom, B: (gamma * wd) / denom };
  }

  // Layout
  const trackY = H * 0.38;
  const camCx = 70, camCy = trackY;
  const camR = 30;
  const wallX = W - 28;
  const massW = 36, massH = 28;
  const massEqX = W * 0.50;
  const maxDisp = 55;

  // Waveform plot at the bottom
  const plotL = 50, plotR = W - 20, plotT = H * 0.68, plotB = H - 14;
  const plotW = plotR - plotL, plotH = plotB - plotT;
  const plotMidY = (plotT + plotB) / 2;

  function drawHorizSpring(x1, x2, y, coils, coilAmp) {
    const len = x2 - x1;
    if (len <= 0) return;
    ctx.beginPath();
    ctx.moveTo(x1, y);
    const segLen = len / (coils * 2 + 2);
    let cx = x1 + segLen;
    ctx.lineTo(cx, y);
    for (let i = 0; i < coils; i++) {
      const midX = cx + segLen;
      ctx.lineTo(midX, y + coilAmp * ((i % 2 === 0) ? 1 : -1));
      cx = midX + segLen;
      ctx.lineTo(cx, y);
    }
    ctx.lineTo(x2, y);
    ctx.stroke();
  }

  function tick() {
    if (!canvas.isConnected) return;
    const wd = parseFloat(wdSlider?.value || 3);
    document.getElementById('phase-lag-wd-val')?.replaceChildren(document.createTextNode(wd.toFixed(1)));

    // Position resonance marker on wd slider
    const resMarker = document.getElementById('phase-lag-res-marker');
    if (resMarker && wdSlider) {
      const min = parseFloat(wdSlider.min), max = parseFloat(wdSlider.max);
      const pct = ((w0 - min) / (max - min)) * 100;
      const sliderRect = wdSlider.getBoundingClientRect();
      const labelRect = wdSlider.parentElement.getBoundingClientRect();
      const offset = sliderRect.left - labelRect.left + (pct / 100) * sliderRect.width;
      resMarker.style.left = offset + 'px';
      resMarker.style.display = (w0 >= min && w0 <= max) ? '' : 'none';
    }

    t += 0.025;
    const { A, B } = getAB(wd);
    const amp = Math.sqrt(A * A + B * B);
    const phase = -Math.atan2(B, A);

    draw(wd, A, B, amp, phase);
    requestAnimationFrame(tick);
  }

  function draw(wd, A, B, amp, phase) {
    wClear(ctx, W, H);

    const camAngle = wd * t;
    const pinX = camCx + camR * 0.7 * Math.cos(camAngle);
    const pinY = camCy - camR * 0.7 * Math.sin(camAngle);
    const forceNow = Math.cos(camAngle);
    const respNow = (A * Math.cos(wd * t) + B * Math.sin(wd * t)) * 20;
    const massX = massEqX + respNow * maxDisp;

    // === CAM MECHANISM ===

    // Motor housing
    ctx.fillStyle = '#e8e0d4'; ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 1.5;
    const motorW = 28, motorH = camR * 2 + 14;
    ctx.fillRect(camCx - camR - motorW, camCy - motorH / 2, motorW, motorH);
    ctx.strokeRect(camCx - camR - motorW, camCy - motorH / 2, motorW, motorH);

    ctx.save();
    ctx.fillStyle = WCOLORS.textDim; ctx.font = '8px system-ui'; ctx.textAlign = 'center';
    ctx.translate(camCx - camR - motorW / 2, camCy);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('MOTOR', 0, 3);
    ctx.restore();

    // Flywheel
    ctx.beginPath(); ctx.arc(camCx, camCy, camR, 0, 2 * Math.PI);
    ctx.fillStyle = '#d4cfc6'; ctx.fill();
    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 2; ctx.stroke();

    // Spokes
    ctx.strokeStyle = 'rgba(31,42,46,0.18)'; ctx.lineWidth = 1;
    for (let s = 0; s < 4; s++) {
      const sa = camAngle + s * Math.PI / 2;
      ctx.beginPath(); ctx.moveTo(camCx, camCy);
      ctx.lineTo(camCx + camR * 0.88 * Math.cos(sa), camCy - camR * 0.88 * Math.sin(sa));
      ctx.stroke();
    }

    // Center axle
    ctx.beginPath(); ctx.arc(camCx, camCy, 4, 0, 2 * Math.PI);
    ctx.fillStyle = WCOLORS.axis; ctx.fill();

    // Crank pin
    ctx.beginPath(); ctx.arc(pinX, pinY, 4, 0, 2 * Math.PI);
    ctx.fillStyle = WCOLORS.amber; ctx.fill();
    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 1; ctx.stroke();

    // Push rod from pin to mass
    const rodEndX = massX - massW / 2 - 3;
    ctx.strokeStyle = WCOLORS.amber; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(pinX, pinY); ctx.lineTo(rodEndX, trackY); ctx.stroke();
    ctx.beginPath(); ctx.arc(rodEndX, trackY, 3, 0, 2 * Math.PI);
    ctx.fillStyle = WCOLORS.amber; ctx.fill();

    // === TRACK ===
    ctx.strokeStyle = WCOLORS.textDim; ctx.lineWidth = 1;
    const groundY = trackY + massH / 2 + 2;
    ctx.beginPath(); ctx.moveTo(camCx + camR + 8, groundY); ctx.lineTo(wallX, groundY); ctx.stroke();
    for (let hx = camCx + camR + 14; hx < wallX; hx += 12) {
      ctx.beginPath(); ctx.moveTo(hx, groundY); ctx.lineTo(hx - 4, groundY + 6); ctx.stroke();
    }

    // === MASS BLOCK ===
    ctx.fillStyle = WCOLORS.teal;
    ctx.fillRect(massX - massW / 2, trackY - massH / 2, massW, massH);
    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 1.5;
    ctx.strokeRect(massX - massW / 2, trackY - massH / 2, massW, massH);
    ctx.fillStyle = '#fff'; ctx.font = 'bold 13px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('m', massX, trackY + 5);

    // === SPRING (mass to wall) ===
    ctx.strokeStyle = WCOLORS.teal; ctx.lineWidth = 2;
    drawHorizSpring(massX + massW / 2, wallX - 4, trackY, 10, 10);

    // Right wall
    ctx.fillStyle = WCOLORS.axis;
    ctx.fillRect(wallX - 4, trackY - 28, 6, 56);
    ctx.strokeStyle = WCOLORS.textDim; ctx.lineWidth = 1;
    for (let i = 0; i < 5; i++) {
      const hy = trackY - 24 + i * 11;
      ctx.beginPath(); ctx.moveTo(wallX + 2, hy); ctx.lineTo(wallX + 8, hy - 5); ctx.stroke();
    }

    // Equilibrium marker
    ctx.strokeStyle = WCOLORS.textDim + '50'; ctx.lineWidth = 1; ctx.setLineDash([3, 3]);
    ctx.beginPath(); ctx.moveTo(massEqX, trackY - massH / 2 - 6); ctx.lineTo(massEqX, trackY + massH / 2 + 10); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = WCOLORS.textDim; ctx.font = '8px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('eq', massEqX, groundY + 14);

    // Force arrow above mass
    const arrowLen = forceNow * 28;
    if (Math.abs(arrowLen) > 2) {
      const arrowY = trackY - massH / 2 - 10;
      ctx.strokeStyle = WCOLORS.amber; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(massX, arrowY); ctx.lineTo(massX + arrowLen, arrowY); ctx.stroke();
      const dir = arrowLen > 0 ? 1 : -1;
      ctx.fillStyle = WCOLORS.amber;
      ctx.beginPath();
      ctx.moveTo(massX + arrowLen, arrowY);
      ctx.lineTo(massX + arrowLen - dir * 6, arrowY - 3);
      ctx.lineTo(massX + arrowLen - dir * 6, arrowY + 3);
      ctx.closePath(); ctx.fill();
      ctx.font = '10px system-ui'; ctx.textAlign = 'center';
      ctx.fillText('F(t)', massX + arrowLen / 2, arrowY - 5);
    }

    // === BOTTOM WAVEFORM TRACES ===
    ctx.strokeStyle = WCOLORS.grid; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(plotL, plotT - 6); ctx.lineTo(plotR, plotT - 6); ctx.stroke();

    ctx.strokeStyle = WCOLORS.textDim; ctx.lineWidth = 0.5;
    ctx.beginPath(); ctx.moveTo(plotL, plotMidY); ctx.lineTo(plotR, plotMidY); ctx.stroke();

    const nCycles = 3;
    const tRange = nCycles * 2 * Math.PI / wd;
    const scale = plotH * 0.38;

    // Force trace
    ctx.strokeStyle = WCOLORS.amber; ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (let px = 0; px <= plotW; px++) {
      const tc = (px / plotW) * tRange + t;
      const f = Math.cos(wd * tc);
      const py = plotMidY - f * scale * 0.5;
      px === 0 ? ctx.moveTo(plotL + px, py) : ctx.lineTo(plotL + px, py);
    }
    ctx.stroke();

    // Response trace
    ctx.strokeStyle = WCOLORS.teal; ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (let px = 0; px <= plotW; px++) {
      const tc = (px / plotW) * tRange + t;
      const x = (A * Math.cos(wd * tc) + B * Math.sin(wd * tc)) * 20;
      const py = plotMidY - x * scale;
      px === 0 ? ctx.moveTo(plotL + px, py) : ctx.lineTo(plotL + px, py);
    }
    ctx.stroke();

    // Phase info text
    const phaseDeg = (phase * 180 / Math.PI);
    const inPhase = wd < w0;
    ctx.fillStyle = WCOLORS.text; ctx.font = '12px system-ui'; ctx.textAlign = 'left';
    fillTextSub(ctx, inPhase ? 'In phase (\u03c9_d < \u03c9\u2080)' : 'Out of phase (\u03c9_d > \u03c9\u2080)', plotL, plotT - 10);
    ctx.fillStyle = WCOLORS.textDim; ctx.font = '10px system-ui'; ctx.textAlign = 'right';
    ctx.fillText('Phase: ' + phaseDeg.toFixed(0) + '\u00b0', plotR, plotT - 10);

    // Legend
    ctx.font = '9px system-ui'; ctx.textAlign = 'right';
    ctx.fillStyle = WCOLORS.amber;
    ctx.fillText('F(t)', plotR, plotMidY - scale * 0.5 - 2);
    ctx.fillStyle = WCOLORS.teal;
    ctx.fillText('x(t)', plotR, plotMidY + scale * 0.5 + 8);
  }

  wdSlider?.addEventListener('input', () => { t = 0; });
  tick();
}

// =========================================================================
// 4. POWER ABSORPTION — energy flow visualization
// =========================================================================
function initPowerAbsorption() {
  const canvas = document.getElementById('scene-power-absorption');
  if (!canvas) return;
  const setup = wSetupCanvas(canvas);
  if (!setup) return;
  const { ctx, W, H } = setup;

  let t = 0;
  const w0 = 5;

  // Layout: left panel (oscillator) | right panel (cumulative energy plot)
  const divX = Math.round(W * 0.38);
  const panR_L = divX + 16, panR_R = W - 16, panR_T = 32, panR_B = H - 28;
  const panR_W = panR_R - panR_L, panR_H = panR_B - panR_T;

  // Oscillator panel geometry
  const oscCx = divX / 2, oscCy = H * 0.46;
  const wallX = 20, massR = 14;
  const springRestLen = oscCx - wallX - massR - 10;

  // Create controls
  let wdSlider = document.getElementById('power-wd');
  if (!wdSlider) {
    const parent = canvas.parentElement;
    if (parent) {
      const controls = document.createElement('div');
      controls.className = 'scene-controls';
      controls.innerHTML = '<label><span>\u03c9<sub>d</sub>:</span> <input type="range" id="power-wd" min="0.5" max="10" step="0.1" value="5"><span class="scene-val" id="power-wd-val">5.0</span></label>' +
        '<label><span>\u03b3:</span> <input type="range" id="power-gamma" min="0.1" max="4" step="0.1" value="1"><span class="scene-val" id="power-gamma-val">1.0</span></label>';
      parent.appendChild(controls);
      wdSlider = document.getElementById('power-wd');
    }
  }
  const gammaSlider = document.getElementById('power-gamma');

  // Cumulative energy history (ring buffer)
  const histLen = 300;
  let cumAbs = new Float64Array(histLen);
  let cumEl = new Float64Array(histLen);
  let histIdx = 0;
  let totalAbs = 0, totalEl = 0;
  let prevWd = -1, prevGamma = -1;

  function resetHistory() {
    cumAbs = new Float64Array(histLen);
    cumEl = new Float64Array(histLen);
    histIdx = 0;
    totalAbs = 0;
    totalEl = 0;
    t = 0;
  }

  // Draw a zigzag spring from (x1,y) to (x2,y)
  function drawSpring(x1, x2, y, coils) {
    const len = x2 - x1;
    const coilW = len / coils;
    const amp = 6;
    ctx.beginPath();
    ctx.moveTo(x1, y);
    for (let i = 0; i < coils; i++) {
      const cx = x1 + (i + 0.25) * coilW;
      const cx2 = x1 + (i + 0.75) * coilW;
      ctx.lineTo(cx, y - amp);
      ctx.lineTo(cx2, y + amp);
    }
    ctx.lineTo(x2, y);
    ctx.strokeStyle = WCOLORS.textDim;
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  // Draw an arrow from (x1,y) to (x2,y)
  function drawArrow(x1, y, x2, color, label) {
    const len = x2 - x1;
    if (Math.abs(len) < 2) return;
    const headLen = Math.min(6, Math.abs(len) * 0.4);
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(x1, y);
    ctx.lineTo(x2, y);
    ctx.stroke();
    const dir = Math.sign(len);
    ctx.beginPath();
    ctx.moveTo(x2, y);
    ctx.lineTo(x2 - dir * headLen, y - 4);
    ctx.lineTo(x2 - dir * headLen, y + 4);
    ctx.closePath();
    ctx.fill();
    if (label) {
      ctx.font = '10px system-ui';
      ctx.textAlign = 'center';
      ctx.fillText(label, (x1 + x2) / 2, y - 8);
    }
  }

  function tick() {
    if (!canvas.isConnected) return;
    const wd = parseFloat(wdSlider?.value || 5);
    const gamma = parseFloat(gammaSlider?.value || 1);
    document.getElementById('power-wd-val')?.replaceChildren(document.createTextNode(wd.toFixed(1)));
    document.getElementById('power-gamma-val')?.replaceChildren(document.createTextNode(gamma.toFixed(1)));

    if (wd !== prevWd || gamma !== prevGamma) {
      resetHistory();
      prevWd = wd;
      prevGamma = gamma;
    }

    const dt = 0.03;
    t += dt;

    const denom = (w0 * w0 - wd * wd) ** 2 + (gamma * wd) ** 2;
    const A = (w0 * w0 - wd * wd) / denom;
    const B = (gamma * wd) / denom;

    // Instantaneous power components
    const pAb = wd * B * Math.cos(wd * t) ** 2;
    const pEl = -wd * A * Math.sin(wd * t) * Math.cos(wd * t);

    // Accumulate
    totalAbs += pAb * dt;
    totalEl += pEl * dt;
    cumAbs[histIdx % histLen] = totalAbs;
    cumEl[histIdx % histLen] = totalEl;
    histIdx++;

    draw(wd, gamma, A, B, pAb, pEl);
    requestAnimationFrame(tick);
  }

  function draw(wd, gamma, A, B, pAb, pEl) {
    wClear(ctx, W, H);

    // --- LEFT PANEL: Animated oscillator ---
    const xDisp = A * Math.cos(wd * t) + B * Math.sin(wd * t);
    const vel = -A * wd * Math.sin(wd * t) + B * wd * Math.cos(wd * t);
    const force = Math.cos(wd * t);

    const maxDisp = Math.sqrt(A * A + B * B);
    const dispScale = maxDisp > 0 ? (springRestLen * 0.35) / maxDisp : 1;
    const massX = oscCx + xDisp * dispScale;

    // Wall
    ctx.fillStyle = WCOLORS.textDim;
    ctx.fillRect(wallX - 4, oscCy - 30, 4, 60);
    for (let i = 0; i < 6; i++) {
      ctx.beginPath();
      ctx.moveTo(wallX - 4, oscCy - 28 + i * 10);
      ctx.lineTo(wallX - 10, oscCy - 22 + i * 10);
      ctx.strokeStyle = WCOLORS.textDim;
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Spring
    drawSpring(wallX, massX - massR, oscCy, 8);

    // Mass
    ctx.beginPath();
    ctx.arc(massX, oscCy, massR, 0, 2 * Math.PI);
    ctx.fillStyle = WCOLORS.bg;
    ctx.fill();
    ctx.strokeStyle = WCOLORS.axis;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = WCOLORS.axis;
    ctx.font = '10px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText('m', massX, oscCy + 4);

    // Force arrow (red)
    const fScale = 30;
    drawArrow(massX, oscCy - 22, massX + force * fScale, WCOLORS.red, 'F');

    // Velocity arrow (blue)
    const vScale = maxDisp > 0 ? 25 / (maxDisp * wd) : 1;
    drawArrow(massX, oscCy + 22, massX + vel * vScale, WCOLORS.blue, 'v');

    // Power meter bar
    const meterY = H * 0.78;
    const meterH = 10;
    const meterW = divX - 40;
    const meterX = 20;
    const pTotal = pAb + pEl;
    const refP = 1 / gamma;
    const maxP = refP * 2.2;

    ctx.fillStyle = WCOLORS.textDim;
    ctx.font = '9px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText('P(t) = F \u00b7 v', meterX + meterW / 2, meterY - 14);

    ctx.fillStyle = 'rgba(31,42,46,0.06)';
    ctx.fillRect(meterX, meterY, meterW, meterH);

    const barFrac = Math.min(Math.abs(pTotal) / maxP, 1);
    const barW = barFrac * meterW;
    if (pTotal >= 0) {
      ctx.fillStyle = 'rgba(34,197,94,0.6)';
      ctx.fillRect(meterX, meterY, barW, meterH);
    } else {
      ctx.fillStyle = 'rgba(239,68,68,0.4)';
      ctx.fillRect(meterX + meterW - barW, meterY, barW, meterH);
    }
    ctx.strokeStyle = WCOLORS.axis;
    ctx.lineWidth = 1;
    ctx.strokeRect(meterX, meterY, meterW, meterH);

    ctx.font = '8px system-ui';
    ctx.fillStyle = 'rgba(34,197,94,0.9)';
    ctx.textAlign = 'left';
    ctx.fillText('energy in \u2192', meterX, meterY + meterH + 10);
    ctx.fillStyle = 'rgba(239,68,68,0.7)';
    ctx.textAlign = 'right';
    ctx.fillText('\u2190 energy out', meterX + meterW, meterY + meterH + 10);

    // Panel title
    ctx.fillStyle = WCOLORS.text;
    ctx.font = '11px system-ui';
    ctx.textAlign = 'center';
    fillTextSub(ctx, 'Driven oscillator (\u03c9_0 = ' + w0.toFixed(0) + ')', divX / 2, 16);

    // Divider
    ctx.strokeStyle = WCOLORS.grid;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(divX, 8);
    ctx.lineTo(divX, H - 8);
    ctx.stroke();

    // --- RIGHT PANEL: Cumulative energy plot ---
    const n = Math.min(histIdx, histLen);
    if (n < 2) return;

    // Auto-scale
    let minE = 0, maxE = 0;
    for (let i = 0; i < n; i++) {
      const idx = (histIdx - n + i) % histLen;
      const a = cumAbs[idx];
      const e = cumEl[idx];
      if (a > maxE) maxE = a;
      if (a + e > maxE) maxE = a + e;
      if (e < minE) minE = e;
      if (e > maxE) maxE = e;
    }
    const eRange = Math.max(maxE - minE, 0.01);
    maxE += eRange * 0.15;
    minE -= eRange * 0.15;
    const eScale = panR_H / (maxE - minE);

    // Axes
    ctx.strokeStyle = WCOLORS.axis;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(panR_L, panR_T);
    ctx.lineTo(panR_L, panR_B);
    ctx.lineTo(panR_R, panR_B);
    ctx.stroke();

    // Zero line
    const zeroY = panR_B - (0 - minE) * eScale;
    if (zeroY > panR_T && zeroY < panR_B) {
      ctx.strokeStyle = WCOLORS.grid;
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(panR_L, zeroY);
      ctx.lineTo(panR_R, zeroY);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = WCOLORS.textDim;
      ctx.font = '8px system-ui';
      ctx.textAlign = 'right';
      ctx.fillText('0', panR_L - 3, zeroY + 3);
    }

    // Absorptive cumulative fill
    ctx.beginPath();
    ctx.moveTo(panR_L, panR_B - (0 - minE) * eScale);
    for (let i = 0; i < n; i++) {
      const idx = (histIdx - n + i) % histLen;
      const px = panR_L + (i / (n - 1)) * panR_W;
      const py = panR_B - (cumAbs[idx] - minE) * eScale;
      ctx.lineTo(px, py);
    }
    ctx.lineTo(panR_L + panR_W, panR_B - (0 - minE) * eScale);
    ctx.closePath();
    ctx.fillStyle = 'rgba(239,68,68,0.15)';
    ctx.fill();

    // Absorptive line
    ctx.strokeStyle = WCOLORS.red;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let i = 0; i < n; i++) {
      const idx = (histIdx - n + i) % histLen;
      const px = panR_L + (i / (n - 1)) * panR_W;
      const py = panR_B - (cumAbs[idx] - minE) * eScale;
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Elastic cumulative line
    ctx.strokeStyle = WCOLORS.blue;
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i < n; i++) {
      const idx = (histIdx - n + i) % histLen;
      const px = panR_L + (i / (n - 1)) * panR_W;
      const py = panR_B - (cumEl[idx] - minE) * eScale;
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Axis labels
    ctx.fillStyle = WCOLORS.textDim;
    ctx.font = '10px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText('time \u2192', panR_L + panR_W / 2, panR_B + 16);
    ctx.save();
    ctx.translate(panR_L - 12, panR_T + panR_H / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('cumulative energy', 0, 0);
    ctx.restore();

    // Panel title
    ctx.fillStyle = WCOLORS.text;
    ctx.font = '11px system-ui';
    ctx.textAlign = 'center';
    fillTextSub(ctx, 'Energy absorbed over time', panR_L + panR_W / 2, 16);

    // Legend
    const legY = panR_T + 14;
    ctx.font = '10px system-ui';
    ctx.textAlign = 'left';
    ctx.fillStyle = WCOLORS.red;
    ctx.fillText('\u2014 Absorptive (grows steadily)', panR_L + 6, legY);
    ctx.fillStyle = WCOLORS.blue;
    ctx.fillText('\u2014 Elastic (oscillates around zero)', panR_L + 6, legY + 14);

    // Near-resonance callout
    const nearRes = Math.abs(parseFloat(wdSlider?.value || 5) - w0) < 0.3;
    if (nearRes) {
      ctx.fillStyle = WCOLORS.amber;
      ctx.font = '9px system-ui';
      ctx.textAlign = 'right';
      fillTextSub(ctx, '\u2605 \u03c9_d \u2248 \u03c9_0 : fastest energy absorption', panR_R, legY + 28);
    }
  }

  wdSlider?.addEventListener('input', resetHistory);
  gammaSlider?.addEventListener('input', resetHistory);
  tick();
}
// =========================================================================
// 5. RESONANCE CURVE — Lorentzian power absorption
// =========================================================================
function initResonanceCurve() {
  const canvas = document.getElementById('scene-resonance-curve');
  if (!canvas) return;
  const setup = wSetupCanvas(canvas);
  if (!setup) return;
  const { ctx, W, H } = setup;

  const plotL = 60, plotR = W - 20, plotT = 30, plotB = H - 30;
  const plotW = plotR - plotL, plotH = plotB - plotT;

  // Create controls
  let gammaSlider = document.getElementById('res-gamma');
  if (!gammaSlider) {
    const parent = canvas.parentElement;
    if (parent) {
      const controls = document.createElement('div');
      controls.className = 'scene-controls';
      controls.innerHTML = '<label>\u03B3: <input type="range" id="res-gamma" min="0.1" max="4" step="0.1" value="0.5"><span class="scene-val" id="res-gamma-val">0.5</span></label>' +
        '<label>\u03C9<sub>0</sub>: <input type="range" id="res-w0" min="2" max="8" step="0.1" value="5"><span class="scene-val" id="res-w0-val">5.0</span></label>';
      parent.appendChild(controls);
      gammaSlider = document.getElementById('res-gamma');
    }
  }
  const w0Slider = document.getElementById('res-w0');

  function avgPower(w0, wd, gamma) {
    const denom = (w0 * w0 - wd * wd) ** 2 + (gamma * wd) ** 2;
    return (gamma * wd * wd) / denom;
  }

  function draw() {
    const gamma = parseFloat(gammaSlider?.value || 0.5);
    const w0 = parseFloat(w0Slider?.value || 5);
    document.getElementById('res-gamma-val')?.replaceChildren(document.createTextNode(gamma.toFixed(1)));
    document.getElementById('res-w0-val')?.replaceChildren(document.createTextNode(w0.toFixed(1)));

    wClear(ctx, W, H);

    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(plotL, plotT); ctx.lineTo(plotL, plotB); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(plotL, plotB); ctx.lineTo(plotR, plotB); ctx.stroke();

    const wMax = 10;
    let maxP = 0;
    for (let i = 0; i <= 300; i++) {
      const w = (i / 300) * wMax;
      const p = avgPower(w0, w, gamma);
      if (p > maxP) maxP = p;
    }
    if (maxP < 0.001) maxP = 1;

    // Main curve
    ctx.strokeStyle = WCOLORS.teal; ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let i = 0; i <= 300; i++) {
      const w = (i / 300) * wMax;
      const p = avgPower(w0, w, gamma);
      const px = plotL + (w / wMax) * plotW;
      const py = plotB - (p / maxP) * plotH * 0.9;
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Half-max line
    const halfMaxP = maxP / 2;
    const halfY = plotB - (halfMaxP / maxP) * plotH * 0.9;
    ctx.strokeStyle = WCOLORS.textDim; ctx.lineWidth = 1; ctx.setLineDash([4, 4]);
    ctx.beginPath(); ctx.moveTo(plotL, halfY); ctx.lineTo(plotR, halfY); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = WCOLORS.textDim; ctx.font = '11px system-ui'; ctx.textAlign = 'right';
    ctx.fillText('\u00BD max', plotL - 4, halfY + 3);

    // FWHM bracket
    // Half-power frequencies: approximately w0 +/- gamma/2
    const wHalf1 = Math.max(0, w0 - gamma / 2);
    const wHalf2 = w0 + gamma / 2;
    const px1 = plotL + (wHalf1 / wMax) * plotW;
    const px2 = plotL + (wHalf2 / wMax) * plotW;
    ctx.strokeStyle = WCOLORS.amber; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(px1, halfY + 3); ctx.lineTo(px2, halfY + 3); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(px1, halfY); ctx.lineTo(px1, halfY + 8); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(px2, halfY); ctx.lineTo(px2, halfY + 8); ctx.stroke();
    ctx.fillStyle = WCOLORS.amber; ctx.font = '10px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('\u0394\u03C9 = \u03B3', (px1 + px2) / 2, halfY + 18);

    // Peak marker
    const peakPx = plotL + (w0 / wMax) * plotW;
    const peakPy = plotB - plotH * 0.9;
    ctx.fillStyle = WCOLORS.amber;
    ctx.beginPath(); ctx.arc(peakPx, peakPy, 5, 0, Math.PI * 2); ctx.fill();

    // w0 label
    ctx.strokeStyle = WCOLORS.textDim; ctx.lineWidth = 1; ctx.setLineDash([3, 3]);
    ctx.beginPath(); ctx.moveTo(peakPx, plotT); ctx.lineTo(peakPx, plotB); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = WCOLORS.textDim; ctx.font = '10px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('\u03C9\u2080', peakPx, plotB + 14);

    // Axis labels
    ctx.fillStyle = WCOLORS.text; ctx.font = '11px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('\u27E8P\u27E9', plotL - 20, plotT - 4);
    fillTextSub(ctx, 'ω_d', plotR + 10, plotB + 4);

    // Q value and info
    const Q = w0 / gamma;
    ctx.fillStyle = WCOLORS.text; ctx.font = '12px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('Lorentzian resonance: Q = \u03C9\u2080/\u03B3 = ' + Q.toFixed(1), plotL + plotW / 2, plotT - 8);

    // Tick marks on x-axis
    ctx.fillStyle = WCOLORS.textDim; ctx.font = '11px system-ui';
    for (let w = 0; w <= wMax; w += 2) {
      const tx = plotL + (w / wMax) * plotW;
      ctx.beginPath(); ctx.moveTo(tx, plotB); ctx.lineTo(tx, plotB + 4); ctx.strokeStyle = WCOLORS.axis; ctx.stroke();
      ctx.fillText(w.toString(), tx, plotB + 14);
    }
  }

  gammaSlider?.addEventListener('input', draw);
  w0Slider?.addEventListener('input', draw);
  draw();
}

// =========================================================================
// CHAPTER 3 INTERACTIVES: COUPLED OSCILLATORS
// =========================================================================

// =========================================================================
// 1. COUPLED OSCILLATORS (Drag to displace)
// =========================================================================
function initCoupledOscillators() {
  const canvas = document.getElementById('scene-coupled-oscillators');
  if (!canvas) return;
  const setup = wSetupCanvas(canvas);
  if (!setup) return;
  const { ctx, W, H } = setup;

  const kappaSlider = document.getElementById('coupled-kappa');

  // Layout
  const wallL = 40, wallR = W - 40;
  const springRegionY = 70;
  const eq1 = wallL + (wallR - wallL) * 0.33;
  const eq2 = wallL + (wallR - wallL) * 0.67;
  const maxDisp = 60;

  // Plot region for traces
  const plotT = 150, plotB = H - 20, plotL = 50, plotR = W - 20;
  const plotMidY = (plotT + plotB) / 2;
  const plotH = plotB - plotT;

  // State
  let x1 = 0.5, x2 = 0, v1 = 0, v2 = 0;
  let t = 0;
  let trail1 = [], trail2 = [];
  const maxTrail = 400;
  let dragging = 0; // 0=none, 1=mass1, 2=mass2

  function getMousePos(e) {
    const rect = canvas.getBoundingClientRect();
    const cl = e.touches ? e.touches[0] : e;
    return { mx: cl.clientX - rect.left, my: cl.clientY - rect.top };
  }

  function hitTest(mx, my) {
    const m1x = eq1 + x1 * maxDisp;
    const m2x = eq2 + x2 * maxDisp;
    if (Math.abs(mx - m1x) < 25 && Math.abs(my - springRegionY) < 25) return 1;
    if (Math.abs(mx - m2x) < 25 && Math.abs(my - springRegionY) < 25) return 2;
    return 0;
  }

  canvas.addEventListener('mousedown', (e) => {
    const { mx, my } = getMousePos(e);
    dragging = hitTest(mx, my);
    if (dragging) { v1 = 0; v2 = 0; trail1 = []; trail2 = []; t = 0; }
  });
  canvas.addEventListener('mousemove', (e) => {
    if (!dragging) return;
    const { mx } = getMousePos(e);
    if (dragging === 1) x1 = Math.max(-1, Math.min(1, (mx - eq1) / maxDisp));
    if (dragging === 2) x2 = Math.max(-1, Math.min(1, (mx - eq2) / maxDisp));
  });
  canvas.addEventListener('mouseup', () => { dragging = 0; });
  canvas.addEventListener('mouseleave', () => { dragging = 0; });
  canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const { mx, my } = getMousePos(e);
    dragging = hitTest(mx, my);
    if (dragging) { v1 = 0; v2 = 0; trail1 = []; trail2 = []; t = 0; }
  }, { passive: false });
  canvas.addEventListener('touchmove', (e) => {
    if (!dragging) return;
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const mx = e.touches[0].clientX - rect.left;
    if (dragging === 1) x1 = Math.max(-1, Math.min(1, (mx - eq1) / maxDisp));
    if (dragging === 2) x2 = Math.max(-1, Math.min(1, (mx - eq2) / maxDisp));
  }, { passive: false });
  canvas.addEventListener('touchend', () => { dragging = 0; });

  function drawZigzagSpring(x1p, y1p, x2p, y2p, coils) {
    const dx = x2p - x1p, dy = y2p - y1p;
    const len = Math.sqrt(dx * dx + dy * dy);
    if (len < 1) return;
    const ux = dx / len, uy = dy / len;
    const nx = -uy, ny = ux;
    const amplitude = 8;
    ctx.beginPath();
    ctx.moveTo(x1p, y1p);
    const seg = len / (coils * 2 + 2);
    let cx = x1p + ux * seg, cy = y1p + uy * seg;
    ctx.lineTo(cx, cy);
    for (let i = 0; i < coils * 2; i++) {
      cx += ux * seg; cy += uy * seg;
      const side = (i % 2 === 0) ? 1 : -1;
      ctx.lineTo(cx + nx * amplitude * side, cy + ny * amplitude * side);
    }
    cx += ux * seg; cy += uy * seg;
    ctx.lineTo(cx, cy);
    ctx.lineTo(x2p, y2p);
    ctx.stroke();
  }

  function tick() {
    if (!canvas.isConnected) return;
    const kappaRatio = parseFloat(kappaSlider?.value || 0.3);
    const k = 4, m = 1;
    const kappa = kappaRatio * k;
    const dt = 0.018;

    if (!dragging) {
      const a1 = (-k * x1 - kappa * (x1 - x2)) / m;
      const a2 = (-k * x2 - kappa * (x2 - x1)) / m;
      v1 += a1 * dt; v2 += a2 * dt;
      x1 += v1 * dt; x2 += v2 * dt;
      t += dt;
    }

    trail1.push({ t, x: x1 }); trail2.push({ t, x: x2 });
    if (trail1.length > maxTrail) { trail1.shift(); trail2.shift(); }

    draw(kappaRatio);
    requestAnimationFrame(tick);
  }

  function draw(kappaRatio) {
    wClear(ctx, W, H);

    const m1x = eq1 + x1 * maxDisp;
    const m2x = eq2 + x2 * maxDisp;
    const y = springRegionY;

    // Walls
    ctx.fillStyle = WCOLORS.axis;
    ctx.fillRect(wallL - 6, y - 30, 6, 60);
    ctx.fillRect(wallR, y - 30, 6, 60);
    // Hatching
    ctx.strokeStyle = WCOLORS.textDim; ctx.lineWidth = 1;
    for (let i = 0; i < 6; i++) {
      const ly = y - 25 + i * 10;
      ctx.beginPath(); ctx.moveTo(wallL - 6, ly); ctx.lineTo(wallL - 12, ly + 6); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(wallR + 6, ly); ctx.lineTo(wallR + 12, ly + 6); ctx.stroke();
    }

    // Springs
    ctx.strokeStyle = WCOLORS.teal; ctx.lineWidth = 2;
    drawZigzagSpring(wallL, y, m1x - 18, y, 6);
    ctx.strokeStyle = WCOLORS.amber; ctx.lineWidth = 2;
    drawZigzagSpring(m1x + 18, y, m2x - 18, y, 6);
    ctx.strokeStyle = WCOLORS.teal; ctx.lineWidth = 2;
    drawZigzagSpring(m2x + 18, y, wallR, y, 6);

    // Masses
    const blockW = 34, blockH = 34;
    ctx.fillStyle = WCOLORS.teal;
    ctx.beginPath(); ctx.roundRect(m1x - blockW / 2, y - blockH / 2, blockW, blockH, 5); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.font = 'bold 13px system-ui, sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('m₁', m1x, y + 5);

    ctx.fillStyle = WCOLORS.blue;
    ctx.beginPath(); ctx.roundRect(m2x - blockW / 2, y - blockH / 2, blockW, blockH, 5); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.font = 'bold 13px system-ui, sans-serif';
    ctx.fillText('m₂', m2x, y + 5);

    // Labels
    ctx.fillStyle = WCOLORS.text; ctx.font = '11px system-ui, sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('k', (wallL + m1x) / 2, y - 28);
    ctx.fillStyle = WCOLORS.amber; ctx.fillText('κ', (m1x + m2x) / 2, y - 28);
    ctx.fillStyle = WCOLORS.text; ctx.fillText('k', (m2x + wallR) / 2, y - 28);

    // Equilibrium markers
    ctx.strokeStyle = WCOLORS.textDim; ctx.lineWidth = 1; ctx.setLineDash([3, 3]);
    ctx.beginPath(); ctx.moveTo(eq1, y + 22); ctx.lineTo(eq1, y + 32); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(eq2, y + 22); ctx.lineTo(eq2, y + 32); ctx.stroke();
    ctx.setLineDash([]);

    // Kappa label
    ctx.fillStyle = WCOLORS.text; ctx.font = '12px system-ui, sans-serif'; ctx.textAlign = 'left';
    ctx.fillText('κ/k = ' + kappaRatio.toFixed(2), 10, 20);

    // Drag hint
    if (trail1.length < 5) {
      ctx.fillStyle = WCOLORS.textDim; ctx.font = '11px system-ui, sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('Drag either mass ↔', W / 2, y + 50);
    }

    // --- Trace plot ---
    // Dashed zero-displacement reference line
    ctx.strokeStyle = WCOLORS.textDim; ctx.lineWidth = 0.8; ctx.setLineDash([4, 3]);
    ctx.beginPath(); ctx.moveTo(plotL, plotMidY); ctx.lineTo(plotR, plotMidY); ctx.stroke();
    ctx.setLineDash([]);

    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(plotL, plotMidY); ctx.lineTo(plotR, plotMidY); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(plotL, plotT); ctx.lineTo(plotL, plotB); ctx.stroke();

    ctx.fillStyle = WCOLORS.text; ctx.font = '10px system-ui, sans-serif'; ctx.textAlign = 'right';
    ctx.fillText('0', plotL - 4, plotMidY + 3);
    ctx.fillStyle = WCOLORS.text; ctx.font = '11px system-ui, sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('t', plotR + 12, plotMidY + 4);

    if (trail1.length > 1) {
      const tRange = Math.max(trail1[trail1.length - 1].t - trail1[0].t, 4);
      const tOff = trail1[0].t;
      const pw = plotR - plotL;
      const ph2 = (plotH / 2) * 0.85;

      // x1 trace
      ctx.strokeStyle = WCOLORS.teal; ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (let i = 0; i < trail1.length; i++) {
        const px = plotL + ((trail1[i].t - tOff) / tRange) * pw;
        const py = plotMidY - trail1[i].x * ph2;
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.stroke();

      // x2 trace
      ctx.strokeStyle = WCOLORS.blue; ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (let i = 0; i < trail2.length; i++) {
        const px = plotL + ((trail2[i].t - tOff) / tRange) * pw;
        const py = plotMidY - trail2[i].x * ph2;
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.stroke();
    }

    // Legend box
    const legX = plotR - 90, legY = plotT + 2, legW2 = 86, legH2 = 30;
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.fillRect(legX, legY, legW2, legH2);
    ctx.strokeStyle = WCOLORS.grid; ctx.lineWidth = 1;
    ctx.strokeRect(legX, legY, legW2, legH2);
    // x1 line sample + label
    ctx.strokeStyle = WCOLORS.teal; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(legX + 6, legY + 10); ctx.lineTo(legX + 22, legY + 10); ctx.stroke();
    ctx.fillStyle = WCOLORS.teal; ctx.font = '11px system-ui, sans-serif'; ctx.textAlign = 'left';
    ctx.fillText('x\u2081', legX + 26, legY + 14);
    // x2 line sample + label
    ctx.strokeStyle = WCOLORS.blue; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(legX + 48, legY + 10); ctx.lineTo(legX + 64, legY + 10); ctx.stroke();
    ctx.fillStyle = WCOLORS.blue;
    ctx.fillText('x\u2082', legX + 68, legY + 14);
  }

  tick();
}

// =========================================================================
// 2. NORMAL MODES (symmetric + antisymmetric)
// =========================================================================
function initNormalModes() {
  const canvas = document.getElementById('scene-normal-modes');
  if (!canvas) return;
  const setup = wSetupCanvas(canvas);
  if (!setup) return;
  const { ctx, W, H } = setup;

  const kappaSlider = document.getElementById('normal-modes-kappa');

  let t = 0;
  const amplitude = 0.6;

  function drawZigzagSpring(x1p, y1p, x2p, y2p, coils) {
    const dx = x2p - x1p, dy = y2p - y1p;
    const len = Math.sqrt(dx * dx + dy * dy);
    if (len < 1) return;
    const ux = dx / len, uy = dy / len;
    const nx = -uy, ny = ux;
    const amp = 6;
    ctx.beginPath();
    ctx.moveTo(x1p, y1p);
    const seg = len / (coils * 2 + 2);
    let cx = x1p + ux * seg, cy = y1p + uy * seg;
    ctx.lineTo(cx, cy);
    for (let i = 0; i < coils * 2; i++) {
      cx += ux * seg; cy += uy * seg;
      const side = (i % 2 === 0) ? 1 : -1;
      ctx.lineTo(cx + nx * amp * side, cy + ny * amp * side);
    }
    cx += ux * seg; cy += uy * seg;
    ctx.lineTo(cx, cy);
    ctx.lineTo(x2p, y2p);
    ctx.stroke();
  }

  function drawPanel(xOff, panelW, y, label, d1, d2, omega, kappaRatio) {
    const wallL = xOff + 15, wallR = xOff + panelW - 15;
    const eq1 = wallL + (wallR - wallL) * 0.33;
    const eq2 = wallL + (wallR - wallL) * 0.67;
    const maxD = 35;
    const m1x = eq1 + d1 * maxD, m2x = eq2 + d2 * maxD;

    // Panel border
    ctx.strokeStyle = WCOLORS.grid; ctx.lineWidth = 1;
    ctx.strokeRect(xOff + 2, 10, panelW - 4, H - 20);

    // Walls
    ctx.fillStyle = WCOLORS.axis;
    ctx.fillRect(wallL - 4, y - 22, 4, 44);
    ctx.fillRect(wallR, y - 22, 4, 44);

    // Springs
    ctx.strokeStyle = WCOLORS.teal; ctx.lineWidth = 1.5;
    drawZigzagSpring(wallL, y, m1x - 13, y, 5);
    ctx.strokeStyle = WCOLORS.amber; ctx.lineWidth = 1.5;
    drawZigzagSpring(m1x + 13, y, m2x - 13, y, 5);
    ctx.strokeStyle = WCOLORS.teal; ctx.lineWidth = 1.5;
    drawZigzagSpring(m2x + 13, y, wallR, y, 5);

    // Masses
    const bw = 24, bh = 24;
    ctx.fillStyle = WCOLORS.teal;
    ctx.beginPath(); ctx.roundRect(m1x - bw / 2, y - bh / 2, bw, bh, 4); ctx.fill();
    ctx.fillStyle = WCOLORS.blue;
    ctx.beginPath(); ctx.roundRect(m2x - bw / 2, y - bh / 2, bw, bh, 4); ctx.fill();

    // Arrows showing direction
    const arrowLen = Math.abs(d1) * 18;
    if (arrowLen > 2) {
      ctx.strokeStyle = WCOLORS.red; ctx.lineWidth = 2;
      // Arrow for mass 1
      ctx.beginPath(); ctx.moveTo(m1x, y + bh / 2 + 6);
      ctx.lineTo(m1x + Math.sign(d1) * arrowLen, y + bh / 2 + 6); ctx.stroke();
      ctx.fillStyle = WCOLORS.red; ctx.beginPath();
      ctx.moveTo(m1x + Math.sign(d1) * arrowLen, y + bh / 2 + 6);
      ctx.lineTo(m1x + Math.sign(d1) * (arrowLen - 5), y + bh / 2 + 2);
      ctx.lineTo(m1x + Math.sign(d1) * (arrowLen - 5), y + bh / 2 + 10);
      ctx.closePath(); ctx.fill();
      // Arrow for mass 2
      ctx.strokeStyle = WCOLORS.red; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(m2x, y + bh / 2 + 6);
      ctx.lineTo(m2x + Math.sign(d2) * arrowLen, y + bh / 2 + 6); ctx.stroke();
      ctx.fillStyle = WCOLORS.red; ctx.beginPath();
      ctx.moveTo(m2x + Math.sign(d2) * arrowLen, y + bh / 2 + 6);
      ctx.lineTo(m2x + Math.sign(d2) * (arrowLen - 5), y + bh / 2 + 2);
      ctx.lineTo(m2x + Math.sign(d2) * (arrowLen - 5), y + bh / 2 + 10);
      ctx.closePath(); ctx.fill();
    }

    // Label
    ctx.fillStyle = WCOLORS.text; ctx.font = 'bold 13px system-ui, sans-serif'; ctx.textAlign = 'center';
    ctx.fillText(label, xOff + panelW / 2, 28);

    // Equilibrium reference lines (dashed vertical at wall positions)
    ctx.strokeStyle = WCOLORS.textDim; ctx.lineWidth = 0.7; ctx.setLineDash([3, 3]);
    ctx.beginPath(); ctx.moveTo(eq1, y - bh / 2 - 10); ctx.lineTo(eq1, y + bh / 2 + 10); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(eq2, y - bh / 2 - 10); ctx.lineTo(eq2, y + bh / 2 + 10); ctx.stroke();
    ctx.setLineDash([]);

    // Frequency
    ctx.fillStyle = WCOLORS.teal; ctx.font = 'bold 13px system-ui, sans-serif';
    ctx.fillText(omega, xOff + panelW / 2, H - 14);
  }

  function tick() {
    if (!canvas.isConnected) return;
    const kappaRatio = parseFloat(kappaSlider?.value || 0.3);
    const k = 4, m = 1;
    const omegaS = Math.sqrt(k / m);
    const omegaA = Math.sqrt((k + 2 * kappaRatio * k) / m);
    const dt = 0.025;
    t += dt;

    wClear(ctx, W, H);

    const panelW = W / 2;
    const y = H / 2 + 5;

    // Symmetric mode: both move same direction
    const dSym = amplitude * Math.cos(omegaS * t);
    drawPanel(0, panelW, y, 'Symmetric mode', dSym, dSym, 'ω_s = ' + omegaS.toFixed(2), kappaRatio);

    // Antisymmetric mode: opposite directions
    const dAnti = amplitude * Math.cos(omegaA * t);
    drawPanel(panelW, panelW, y, 'Antisymmetric mode', dAnti, -dAnti, 'ω_a = ' + omegaA.toFixed(2), kappaRatio);

    // κ/k label
    ctx.fillStyle = WCOLORS.text; ctx.font = '12px system-ui, sans-serif'; ctx.textAlign = 'left';
    ctx.fillText('κ/k = ' + kappaRatio.toFixed(2), 10, H - 2);

    requestAnimationFrame(tick);
  }

  tick();
}

// =========================================================================
// 3. BEATS (energy transfer between coupled oscillators)
// =========================================================================
function initBeats() {
  const canvas = document.getElementById('scene-beats');
  if (!canvas) return;
  const setup = wSetupCanvas(canvas);
  if (!setup) return;
  const { ctx, W, H } = setup;

  const kappaSlider = document.getElementById('beats-kappa');

  let t = 0;
  const A0 = 0.8;

  function tick() {
    if (!canvas.isConnected) return;
    const kappaRatio = parseFloat(kappaSlider?.value || 0.15);
    const k = 4, m = 1;
    const omegaS = Math.sqrt(k / m);
    const omegaA = Math.sqrt((k + 2 * kappaRatio * k) / m);
    const omegaAvg = (omegaS + omegaA) / 2;
    const omegaBeat = (omegaA - omegaS) / 2;
    const dt = 0.03;
    t += dt;

    wClear(ctx, W, H);

    const plotL = 50, plotR = W - 20;
    const plotW = plotR - plotL;
    const panelH = (H - 60) / 2;
    const tMax = 30;

    for (let panel = 0; panel < 2; panel++) {
      const pTop = 30 + panel * (panelH + 15);
      const pMid = pTop + panelH / 2;

      // Axes
      ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(plotL, pTop); ctx.lineTo(plotL, pTop + panelH); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(plotL, pMid); ctx.lineTo(plotR, pMid); ctx.stroke();

      // Labels
      ctx.fillStyle = WCOLORS.text; ctx.font = '11px system-ui, sans-serif'; ctx.textAlign = 'center';
      ctx.fillText(panel === 0 ? 'x₁(t)' : 'x₂(t)', plotL - 20, pTop + 8);
      ctx.fillText('t', plotR + 10, pMid + 4);

      // Draw waveform
      const waveColor = panel === 0 ? WCOLORS.teal : WCOLORS.blue;
      ctx.strokeStyle = waveColor; ctx.lineWidth = 1.8;
      ctx.beginPath();
      const halfH = (panelH / 2) * 0.85;
      for (let px = 0; px <= plotW; px += 1) {
        const tSample = (px / plotW) * tMax;
        let val;
        if (panel === 0) {
          val = A0 * Math.cos(omegaBeat * tSample) * Math.cos(omegaAvg * tSample);
        } else {
          val = A0 * Math.sin(omegaBeat * tSample) * Math.sin(omegaAvg * tSample);
        }
        const py = pMid - val * halfH;
        px === 0 ? ctx.moveTo(plotL + px, py) : ctx.lineTo(plotL + px, py);
      }
      ctx.stroke();

      // Beat envelope
      ctx.strokeStyle = waveColor; ctx.lineWidth = 1; ctx.setLineDash([4, 3]);
      ctx.globalAlpha = 0.5;
      for (let sign = -1; sign <= 1; sign += 2) {
        ctx.beginPath();
        for (let px = 0; px <= plotW; px += 2) {
          const tSample = (px / plotW) * tMax;
          let env;
          if (panel === 0) {
            env = sign * A0 * Math.cos(omegaBeat * tSample);
          } else {
            env = sign * A0 * Math.sin(omegaBeat * tSample);
          }
          const py = pMid - env * halfH;
          px === 0 ? ctx.moveTo(plotL + px, py) : ctx.lineTo(plotL + px, py);
        }
        ctx.stroke();
      }
      ctx.setLineDash([]); ctx.globalAlpha = 1.0;

      // Moving time marker
      const tNow = t % tMax;
      const markerX = plotL + (tNow / tMax) * plotW;
      ctx.strokeStyle = WCOLORS.red; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(markerX, pTop); ctx.lineTo(markerX, pTop + panelH); ctx.stroke();
    }

    // Header
    ctx.fillStyle = WCOLORS.text; ctx.font = 'bold 13px system-ui, sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('Energy Transfer via Beats', W / 2, 14);

    // Panel labels
    ctx.fillStyle = WCOLORS.teal; ctx.font = 'bold 12px system-ui, sans-serif'; ctx.textAlign = 'left';
    ctx.fillText('x₁', plotL - 40, 30 + panelH / 2 + 4);
    ctx.fillStyle = WCOLORS.blue;
    ctx.fillText('x₂', plotL - 40, 30 + panelH + 15 + panelH / 2 + 4);

    // Labels
    const beatFreq = omegaBeat / Math.PI;
    ctx.fillStyle = WCOLORS.text; ctx.font = '11px system-ui, sans-serif'; ctx.textAlign = 'left';
    ctx.fillText('κ/k = ' + kappaRatio.toFixed(2), 10, H - 6);
    ctx.fillStyle = WCOLORS.amber; ctx.font = 'bold 13px system-ui, sans-serif'; ctx.textAlign = 'right';
    fillTextSub(ctx, 'f_{beat} = (ω_a − ω_s)/(2π) = ' + beatFreq.toFixed(3) + ' Hz', W - 10, H - 6);

    requestAnimationFrame(tick);
  }

  tick();
}

// =========================================================================
// 4. EIGENVALUE SOLVER (visual 2×2 eigenproblem)
// =========================================================================
function initEigenvalueSolver() {
  const canvas = document.getElementById('scene-eigenvalue-solver');
  if (!canvas) return;
  const setup = wSetupCanvas(canvas);
  if (!setup) return;
  const { ctx, W, H } = setup;

  const kappaSlider = document.getElementById('eigen-kappa');
  let t = 0;

  function draw() {
    const kappaRatio = parseFloat(kappaSlider?.value || 0.3);
    const k = 4, m = 1, kappa = kappaRatio * k;

    wClear(ctx, W, H);

    // Matrix entries
    const a11 = (k + kappa) / m;
    const a12 = -kappa / m;
    const lambdaS = a11 + a12; // = k/m (symmetric)
    const lambdaA = a11 - a12; // = (k + 2κ)/m (antisymmetric)
    const omegaS = Math.sqrt(lambdaS);
    const omegaA = Math.sqrt(lambdaA);

    // Left side: matrix display
    const matX = 30, matY = 40;

    ctx.fillStyle = WCOLORS.text; ctx.font = 'bold 14px system-ui, sans-serif'; ctx.textAlign = 'left';
    ctx.fillText('Equation of motion matrix  M⁻¹K:', matX, matY);

    // Draw matrix brackets
    const mxL = matX + 10, mxR = matX + 200, myT = matY + 15, myB = matY + 75;
    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(mxL + 10, myT); ctx.lineTo(mxL, myT); ctx.lineTo(mxL, myB); ctx.lineTo(mxL + 10, myB);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(mxR - 10, myT); ctx.lineTo(mxR, myT); ctx.lineTo(mxR, myB); ctx.lineTo(mxR - 10, myB);
    ctx.stroke();

    // Matrix entries
    ctx.fillStyle = WCOLORS.teal; ctx.font = '14px system-ui, sans-serif'; ctx.textAlign = 'center';
    const cx1 = mxL + 55, cx2 = mxR - 55;
    const ry1 = myT + 22, ry2 = myB - 10;
    ctx.fillText('(k+κ)/m', cx1, ry1);
    ctx.fillStyle = WCOLORS.amber;
    ctx.fillText('−κ/m', cx2, ry1);
    ctx.fillStyle = WCOLORS.amber;
    ctx.fillText('−κ/m', cx1, ry2);
    ctx.fillStyle = WCOLORS.teal;
    ctx.fillText('(k+κ)/m', cx2, ry2);

    // Numerical values
    ctx.fillStyle = WCOLORS.textDim; ctx.font = '11px system-ui, sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('= ' + a11.toFixed(1), cx1, ry1 + 16);
    ctx.fillText('= ' + a12.toFixed(1), cx2, ry1 + 16);
    ctx.fillText('= ' + a12.toFixed(1), cx1, ry2 + 16);
    ctx.fillText('= ' + a11.toFixed(1), cx2, ry2 + 16);

    // Right side: animated eigenvector phase space
    const plotCx = W - 130, plotCy = H / 2 + 10;
    const plotR = 80;

    // Grid lines
    ctx.strokeStyle = WCOLORS.grid; ctx.lineWidth = 0.5;
    for (let g = -plotR; g <= plotR; g += plotR / 2) {
      if (Math.abs(g) < 1) continue;
      ctx.beginPath(); ctx.moveTo(plotCx + g, plotCy - plotR); ctx.lineTo(plotCx + g, plotCy + plotR); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(plotCx - plotR, plotCy + g); ctx.lineTo(plotCx + plotR, plotCy + g); ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(plotCx - plotR - 10, plotCy); ctx.lineTo(plotCx + plotR + 10, plotCy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(plotCx, plotCy - plotR - 10); ctx.lineTo(plotCx, plotCy + plotR + 10); ctx.stroke();

    ctx.fillStyle = WCOLORS.text; ctx.font = 'bold 12px system-ui, sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('x₁', plotCx + plotR + 18, plotCy + 4);
    ctx.fillText('x₂', plotCx, plotCy - plotR - 16);

    // Draw faint eigenvector direction lines
    ctx.setLineDash([4, 4]);
    ctx.lineWidth = 1; ctx.globalAlpha = 0.3;
    ctx.strokeStyle = WCOLORS.teal;
    ctx.beginPath(); ctx.moveTo(plotCx - plotR * 0.85, plotCy + plotR * 0.85); ctx.lineTo(plotCx + plotR * 0.85, plotCy - plotR * 0.85); ctx.stroke();
    ctx.strokeStyle = WCOLORS.red;
    ctx.beginPath(); ctx.moveTo(plotCx - plotR * 0.85, plotCy - plotR * 0.85); ctx.lineTo(plotCx + plotR * 0.85, plotCy + plotR * 0.85); ctx.stroke();
    ctx.globalAlpha = 1.0;
    ctx.setLineDash([]);

    // Animate dots oscillating along eigenvector directions
    const amp = plotR * 0.7;
    const inv = 1 / Math.sqrt(2);

    // Symmetric mode: dot oscillates along (1,1) direction
    const phaseS = Math.sin(omegaS * t * 0.5);
    const sx = amp * inv * phaseS;
    const sy = -amp * inv * phaseS;
    ctx.fillStyle = WCOLORS.teal;
    ctx.globalAlpha = 0.12;
    for (let i = 6; i >= 1; i--) {
      const tp = Math.sin(omegaS * (t - i * 0.03) * 0.5);
      const tx = amp * inv * tp, ty = -amp * inv * tp;
      ctx.beginPath(); ctx.arc(plotCx + tx, plotCy + ty, 5 - i * 0.5, 0, 2 * Math.PI); ctx.fill();
    }
    ctx.globalAlpha = 1.0;
    ctx.beginPath(); ctx.arc(plotCx + sx, plotCy + sy, 7, 0, 2 * Math.PI); ctx.fill();

    // Antisymmetric mode: dot oscillates along (1,-1) direction
    const phaseA = Math.sin(omegaA * t * 0.5);
    const ax = amp * inv * phaseA;
    const ay = amp * inv * phaseA;
    ctx.fillStyle = WCOLORS.red;
    ctx.globalAlpha = 0.12;
    for (let i = 6; i >= 1; i--) {
      const tp = Math.sin(omegaA * (t - i * 0.03) * 0.5);
      const tx = amp * inv * tp, ty = amp * inv * tp;
      ctx.beginPath(); ctx.arc(plotCx + tx, plotCy + ty, 5 - i * 0.5, 0, 2 * Math.PI); ctx.fill();
    }
    ctx.globalAlpha = 1.0;
    ctx.beginPath(); ctx.arc(plotCx + ax, plotCy + ay, 7, 0, 2 * Math.PI); ctx.fill();

    // Labels for eigenvectors
    ctx.font = 'bold 11px system-ui, sans-serif'; ctx.textAlign = 'left';
    ctx.fillStyle = WCOLORS.teal;
    fillTextSub(ctx, 'ξ_s (1,1)', plotCx + plotR * 0.5, plotCy - plotR * 0.78);
    ctx.fillStyle = WCOLORS.red;
    fillTextSub(ctx, 'ξ_a (1,−1)', plotCx + plotR * 0.5, plotCy + plotR * 0.88);

    // Eigenvalue display
    const evY = H - 50;
    ctx.fillStyle = WCOLORS.text; ctx.font = 'bold 13px system-ui, sans-serif'; ctx.textAlign = 'left';
    ctx.fillText('Eigenvalues (ω²):', matX, evY);

    ctx.fillStyle = WCOLORS.teal; ctx.font = '13px system-ui, sans-serif';
    fillTextSub(ctx, 'ω²_s = k/m = ' + lambdaS.toFixed(2) + '   →  ω_s = ' + omegaS.toFixed(2), matX, evY + 22);
    ctx.fillStyle = WCOLORS.red;
    fillTextSub(ctx, 'ω²_a = (k+2κ)/m = ' + lambdaA.toFixed(2) + '   →  ω_a = ' + omegaA.toFixed(2), matX, evY + 44);

    // κ/k label
    ctx.fillStyle = WCOLORS.text; ctx.font = '12px system-ui, sans-serif'; ctx.textAlign = 'right';
    ctx.fillText('κ/k = ' + kappaRatio.toFixed(2), W - 10, 20);
  }

  function animate() {
    t += 0.04;
    draw();
    requestAnimationFrame(animate);
  }

  kappaSlider?.addEventListener('input', () => {});
  animate();
}

// =========================================================================
// CHAPTER 4 INTERACTIVES: NORMAL MODES OF N-MASS SYSTEMS
// =========================================================================

// =========================================================================
// 5. TWO-MASS NORMAL MODES (mode shapes + animation)
// =========================================================================
function initTwoMassNormalModes() {
  const canvas = document.getElementById('scene-two-mass-normal-modes');
  if (!canvas) return;
  const setup = wSetupCanvas(canvas);
  if (!setup) return;
  const { ctx, W, H } = setup;

  let mode = 'both'; // 'sym', 'anti', 'both'
  let t = 0;

  // Check for mode buttons
  const btnSym = document.getElementById('two-mass-sym');
  const btnAnti = document.getElementById('two-mass-anti');
  const btnBoth = document.getElementById('two-mass-both');
  btnSym?.addEventListener('click', () => { mode = 'sym'; updateButtons(); });
  btnAnti?.addEventListener('click', () => { mode = 'anti'; updateButtons(); });
  btnBoth?.addEventListener('click', () => { mode = 'both'; updateButtons(); });

  function updateButtons() {
    [btnSym, btnAnti, btnBoth].forEach(b => { if (b) b.style.fontWeight = 'normal'; });
    if (mode === 'sym' && btnSym) btnSym.style.fontWeight = 'bold';
    if (mode === 'anti' && btnAnti) btnAnti.style.fontWeight = 'bold';
    if (mode === 'both' && btnBoth) btnBoth.style.fontWeight = 'bold';
  }
  updateButtons();

  function drawZigzagSpring(x1p, y1p, x2p, y2p, coils) {
    const dx = x2p - x1p, dy = y2p - y1p;
    const len = Math.sqrt(dx * dx + dy * dy);
    if (len < 1) return;
    const ux = dx / len, uy = dy / len;
    const nx = -uy, ny = ux;
    const amp = 6;
    ctx.beginPath();
    ctx.moveTo(x1p, y1p);
    const seg = len / (coils * 2 + 2);
    let cx = x1p + ux * seg, cy = y1p + uy * seg;
    ctx.lineTo(cx, cy);
    for (let i = 0; i < coils * 2; i++) {
      cx += ux * seg; cy += uy * seg;
      const side = (i % 2 === 0) ? 1 : -1;
      ctx.lineTo(cx + nx * amp * side, cy + ny * amp * side);
    }
    cx += ux * seg; cy += uy * seg;
    ctx.lineTo(cx, cy);
    ctx.lineTo(x2p, y2p);
    ctx.stroke();
  }

  function tick() {
    if (!canvas.isConnected) return;
    t += 0.025;
    wClear(ctx, W, H);

    const k = 4, kappa = 1.2;
    const omegaS = Math.sqrt(k);
    const omegaA = Math.sqrt(k + 2 * kappa);
    const amp = 0.7;

    let d1 = 0, d2 = 0;
    if (mode === 'sym') {
      d1 = amp * Math.cos(omegaS * t);
      d2 = d1;
    } else if (mode === 'anti') {
      d1 = amp * Math.cos(omegaA * t);
      d2 = -d1;
    } else {
      d1 = 0.5 * amp * Math.cos(omegaS * t) + 0.5 * amp * Math.cos(omegaA * t);
      d2 = 0.5 * amp * Math.cos(omegaS * t) - 0.5 * amp * Math.cos(omegaA * t);
    }

    // --- Top half: physical spring-mass system ---
    const sprY = 65;
    const wallL = 40, wallR = W - 40;
    const eq1 = wallL + (wallR - wallL) * 0.33;
    const eq2 = wallL + (wallR - wallL) * 0.67;
    const maxD = 40;
    const m1x = eq1 + d1 * maxD, m2x = eq2 + d2 * maxD;

    // Walls
    ctx.fillStyle = WCOLORS.axis;
    ctx.fillRect(wallL - 5, sprY - 20, 5, 40);
    ctx.fillRect(wallR, sprY - 20, 5, 40);

    // Springs
    ctx.strokeStyle = WCOLORS.teal; ctx.lineWidth = 1.5;
    drawZigzagSpring(wallL, sprY, m1x - 14, sprY, 5);
    ctx.strokeStyle = WCOLORS.amber; ctx.lineWidth = 1.5;
    drawZigzagSpring(m1x + 14, sprY, m2x - 14, sprY, 5);
    ctx.strokeStyle = WCOLORS.teal; ctx.lineWidth = 1.5;
    drawZigzagSpring(m2x + 14, sprY, wallR, sprY, 5);

    // Masses
    ctx.fillStyle = WCOLORS.teal;
    ctx.beginPath(); ctx.arc(m1x, sprY, 14, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = WCOLORS.blue;
    ctx.beginPath(); ctx.arc(m2x, sprY, 14, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.font = 'bold 11px system-ui, sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('1', m1x, sprY + 4);
    ctx.fillText('2', m2x, sprY + 4);

    // --- Bottom half: mode shape plot ---
    const plotT = 120, plotB = H - 25;
    const plotL = 80, plotR2 = W - 80;
    const plotMidY = (plotT + plotB) / 2;
    const plotHalfH = (plotB - plotT) / 2 * 0.8;

    // Axes
    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(plotL, plotMidY); ctx.lineTo(plotR2, plotMidY); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(plotL, plotT); ctx.lineTo(plotL, plotB); ctx.stroke();

    ctx.fillStyle = WCOLORS.text; ctx.font = '11px system-ui, sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('Mass index', (plotL + plotR2) / 2, plotB + 16);
    ctx.save(); ctx.translate(plotL - 18, plotMidY); ctx.rotate(-Math.PI / 2);
    ctx.fillText('Displacement', 0, 0); ctx.restore();

    // Mass positions on x-axis
    const mx1 = plotL + (plotR2 - plotL) * 0.33;
    const mx2 = plotL + (plotR2 - plotL) * 0.67;

    ctx.fillStyle = WCOLORS.textDim; ctx.font = '10px system-ui, sans-serif';
    ctx.fillText('1', mx1, plotB + 6);
    ctx.fillText('2', mx2, plotB + 6);

    // Plot mode shape: dots connected
    const py1 = plotMidY - d1 * plotHalfH;
    const py2 = plotMidY - d2 * plotHalfH;

    // Connect with line
    ctx.strokeStyle = WCOLORS.teal; ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(plotL, plotMidY); // wall
    ctx.lineTo(mx1, py1);
    ctx.lineTo(mx2, py2);
    ctx.lineTo(plotR2, plotMidY); // wall
    ctx.stroke();

    // Dots
    ctx.fillStyle = WCOLORS.teal;
    ctx.beginPath(); ctx.arc(mx1, py1, 6, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = WCOLORS.blue;
    ctx.beginPath(); ctx.arc(mx2, py2, 6, 0, Math.PI * 2); ctx.fill();

    // Wall dots
    ctx.fillStyle = WCOLORS.axis;
    ctx.beginPath(); ctx.arc(plotL, plotMidY, 4, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(plotR2, plotMidY, 4, 0, Math.PI * 2); ctx.fill();

    // Mode label
    ctx.fillStyle = WCOLORS.text; ctx.font = 'bold 13px system-ui, sans-serif'; ctx.textAlign = 'center';
    const modeLabel = mode === 'sym' ? 'Symmetric mode (ω_s)' : mode === 'anti' ? 'Antisymmetric mode (ω_a)' : 'Superposition of both modes';
    fillTextSub(ctx, modeLabel, W / 2, 18);

    // Frequency values
    ctx.fillStyle = WCOLORS.textDim; ctx.font = '11px system-ui, sans-serif'; ctx.textAlign = 'left';
    fillTextSub(ctx, 'ω_s = ' + omegaS.toFixed(2), 10, H - 5);
    fillTextSub(ctx, 'ω_a = ' + omegaA.toFixed(2), 120, H - 5);

    requestAnimationFrame(tick);
  }

  tick();
}

// =========================================================================
// 6. THREE-MASS NORMAL MODES
// =========================================================================
function initThreeMassNormalModes() {
  const canvas = document.getElementById('scene-three-mass-normal-modes');
  if (!canvas) return;
  const setup = wSetupCanvas(canvas);
  if (!setup) return;
  const { ctx, W, H } = setup;

  let t = 0;

  // Mode shapes for 3 masses between walls (normalized)
  // Mode 1: sin(π/4), sin(2π/4), sin(3π/4) = (1, √2, 1)/2
  // Mode 2: sin(2π/4), sin(4π/4), sin(6π/4) = (1, 0, -1)/√2
  // Mode 3: sin(3π/4), sin(6π/4), sin(9π/4) = (1, -√2, 1)/2
  const modes = [
    { shape: [1, Math.SQRT2, 1], omega: 2 * Math.sin(Math.PI / 8), label: 'Mode 1', color: WCOLORS.teal },
    { shape: [1, 0, -1], omega: 2 * Math.sin(2 * Math.PI / 8), label: 'Mode 2', color: WCOLORS.blue },
    { shape: [1, -Math.SQRT2, 1], omega: 2 * Math.sin(3 * Math.PI / 8), label: 'Mode 3', color: WCOLORS.red },
  ];
  // Normalize
  modes.forEach(m => {
    const norm = Math.sqrt(m.shape.reduce((s, v) => s + v * v, 0));
    m.shape = m.shape.map(v => v / norm);
  });

  function drawZigzagSpring(x1p, y1p, x2p, y2p, coils) {
    const dx = x2p - x1p, dy = y2p - y1p;
    const len = Math.sqrt(dx * dx + dy * dy);
    if (len < 1) return;
    const ux = dx / len, uy = dy / len;
    const nx = -uy, ny = ux;
    const amp = 5;
    ctx.beginPath();
    ctx.moveTo(x1p, y1p);
    const seg = len / (coils * 2 + 2);
    let cx = x1p + ux * seg, cy = y1p + uy * seg;
    ctx.lineTo(cx, cy);
    for (let i = 0; i < coils * 2; i++) {
      cx += ux * seg; cy += uy * seg;
      const side = (i % 2 === 0) ? 1 : -1;
      ctx.lineTo(cx + nx * amp * side, cy + ny * amp * side);
    }
    cx += ux * seg; cy += uy * seg;
    ctx.lineTo(cx, cy);
    ctx.lineTo(x2p, y2p);
    ctx.stroke();
  }

  function tick() {
    if (!canvas.isConnected) return;
    t += 0.022;
    wClear(ctx, W, H);

    const panelH = (H - 20) / 3;

    for (let mi = 0; mi < 3; mi++) {
      const m = modes[mi];
      const pTop = 10 + mi * panelH;
      const pMid = pTop + panelH / 2;
      const cosT = Math.cos(m.omega * t);
      const disps = m.shape.map(s => s * 0.65 * cosT);

      // Spring-mass system on left
      const sysL = 30, sysR = W * 0.48;
      const wallL = sysL, wallR = sysR;
      const positions = [0.25, 0.5, 0.75];
      const maxD = 25;

      // Walls
      ctx.fillStyle = WCOLORS.axis;
      ctx.fillRect(wallL - 4, pMid - 15, 4, 30);
      ctx.fillRect(wallR, pMid - 15, 4, 30);

      // Springs and masses
      const massXs = positions.map((p, i) => wallL + (wallR - wallL) * p + disps[i] * maxD);

      ctx.strokeStyle = m.color; ctx.lineWidth = 1.2;
      drawZigzagSpring(wallL, pMid, massXs[0] - 10, pMid, 4);
      for (let j = 0; j < 2; j++) {
        drawZigzagSpring(massXs[j] + 10, pMid, massXs[j + 1] - 10, pMid, 4);
      }
      drawZigzagSpring(massXs[2] + 10, pMid, wallR, pMid, 4);

      ctx.fillStyle = m.color;
      massXs.forEach(mx => {
        ctx.beginPath(); ctx.arc(mx, pMid, 10, 0, Math.PI * 2); ctx.fill();
      });

      // Mode shape plot on right
      const plotL = W * 0.55, plotR2 = W - 20;
      const plotHalfH = (panelH / 2) * 0.65;

      ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 0.5;
      ctx.beginPath(); ctx.moveTo(plotL, pMid); ctx.lineTo(plotR2, pMid); ctx.stroke();

      // Mode shape with displacement at this instant
      const mxPositions = [plotL, ...positions.map(p => plotL + (plotR2 - plotL) * p), plotR2];
      const mxDisps = [0, ...disps, 0];

      ctx.strokeStyle = m.color; ctx.lineWidth = 2;
      ctx.beginPath();
      for (let j = 0; j < mxPositions.length; j++) {
        const px = mxPositions[j];
        const py = pMid - mxDisps[j] * plotHalfH;
        j === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Dots
      for (let j = 1; j <= 3; j++) {
        ctx.fillStyle = m.color;
        ctx.beginPath();
        ctx.arc(mxPositions[j], pMid - mxDisps[j] * plotHalfH, 5, 0, Math.PI * 2);
        ctx.fill();
      }
      // Wall dots
      ctx.fillStyle = WCOLORS.axis;
      ctx.beginPath(); ctx.arc(plotL, pMid, 3, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(plotR2, pMid, 3, 0, Math.PI * 2); ctx.fill();

      // Labels
      ctx.fillStyle = m.color; ctx.font = 'bold 11px system-ui, sans-serif'; ctx.textAlign = 'left';
      ctx.fillText(m.label + '  ω = ' + m.omega.toFixed(2), sysL, pTop + 12);
    }

    requestAnimationFrame(tick);
  }

  tick();
}

// =========================================================================
// 7. N-MASS CHAIN (variable N, mode selector, tridiagonal matrix)
// =========================================================================
function initNMassChain() {
  const canvas = document.getElementById('scene-n-mass-chain');
  if (!canvas) return;
  const setup = wSetupCanvas(canvas);
  if (!setup) return;
  const { ctx, W, H } = setup;

  const nSlider = document.getElementById('nchain-n');
  const modeSlider = document.getElementById('nchain-mode');

  let t = 0;

  function tick() {
    if (!canvas.isConnected) return;
    t += 0.025;
    const N = parseInt(nSlider?.value || 5);
    let modeNum = parseInt(modeSlider?.value || 1);
    if (modeNum > N) modeNum = N;
    if (modeSlider) modeSlider.max = N;

    // Eigenfrequency for mode p: omega_p = 2*sin(p*pi/(2*(N+1)))
    const omegaP = 2 * Math.sin(modeNum * Math.PI / (2 * (N + 1)));

    // Mode shape: u_j = sin(j * p * pi / (N+1))
    const shape = [];
    for (let j = 1; j <= N; j++) {
      shape.push(Math.sin(j * modeNum * Math.PI / (N + 1)));
    }
    // Normalize
    const maxShape = Math.max(...shape.map(Math.abs), 0.001);

    wClear(ctx, W, H);

    // --- Top: animated chain ---
    const chainY = 60;
    const chainL = 50, chainR = W - 50;
    const chainW = chainR - chainL;
    const maxD = 25;

    // Wall
    ctx.fillStyle = WCOLORS.axis;
    ctx.fillRect(chainL - 5, chainY - 20, 5, 40);
    ctx.fillRect(chainR, chainY - 20, 5, 40);

    const cosT = Math.cos(omegaP * t);
    const massPositions = [];
    for (let j = 0; j < N; j++) {
      const eqX = chainL + chainW * (j + 1) / (N + 1);
      const disp = (shape[j] / maxShape) * maxD * cosT * 0.7;
      massPositions.push(eqX + disp);
    }

    // Draw springs (simple lines for many masses)
    ctx.strokeStyle = WCOLORS.teal; ctx.lineWidth = 1.5;
    const allPos = [chainL, ...massPositions, chainR];
    for (let j = 0; j < allPos.length - 1; j++) {
      // Simple zigzag
      const x1 = allPos[j] + (j > 0 ? 8 : 0);
      const x2 = allPos[j + 1] - (j < allPos.length - 2 ? 8 : 0);
      const segs = 6;
      ctx.beginPath();
      ctx.moveTo(x1, chainY);
      for (let s = 1; s < segs; s++) {
        const frac = s / segs;
        const sx = x1 + (x2 - x1) * frac;
        const sy = chainY + (s % 2 === 1 ? 5 : -5);
        ctx.lineTo(sx, sy);
      }
      ctx.lineTo(x2, chainY);
      ctx.stroke();
    }

    // Masses
    ctx.fillStyle = WCOLORS.teal;
    const radius = Math.max(4, Math.min(10, 80 / N));
    massPositions.forEach(mx => {
      ctx.beginPath(); ctx.arc(mx, chainY, radius, 0, Math.PI * 2); ctx.fill();
    });

    // --- Middle: mode shape plot ---
    const plotT = 110, plotB = 190;
    const plotL = 50, plotR2 = W * 0.55;
    const plotMidY = (plotT + plotB) / 2;
    const plotHalfH = (plotB - plotT) / 2 * 0.85;

    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(plotL, plotMidY); ctx.lineTo(plotR2, plotMidY); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(plotL, plotT); ctx.lineTo(plotL, plotB); ctx.stroke();

    ctx.fillStyle = WCOLORS.text; ctx.font = '11px system-ui, sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('Mode shape (mode ' + modeNum + ')', (plotL + plotR2) / 2, plotT - 5);

    // Plot shape with walls at zero
    ctx.strokeStyle = WCOLORS.blue; ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(plotL, plotMidY);
    for (let j = 0; j < N; j++) {
      const px = plotL + (plotR2 - plotL) * (j + 1) / (N + 1);
      const py = plotMidY - (shape[j] / maxShape) * plotHalfH;
      ctx.lineTo(px, py);
    }
    ctx.lineTo(plotR2, plotMidY);
    ctx.stroke();

    // Dots
    ctx.fillStyle = WCOLORS.blue;
    for (let j = 0; j < N; j++) {
      const px = plotL + (plotR2 - plotL) * (j + 1) / (N + 1);
      const py = plotMidY - (shape[j] / maxShape) * plotHalfH;
      ctx.beginPath(); ctx.arc(px, py, 4, 0, Math.PI * 2); ctx.fill();
    }

    // --- Right: tridiagonal matrix ---
    const matL = W * 0.6, matT = 105;
    ctx.fillStyle = WCOLORS.text; ctx.font = 'bold 12px system-ui, sans-serif'; ctx.textAlign = 'left';
    ctx.fillText('K/m matrix (' + N + '×' + N + '):', matL, matT);

    const cellSize = Math.min(14, 100 / N);
    const matStartX = matL + 5;
    const matStartY = matT + 10;
    const dispN = Math.min(N, 10); // display at most 10x10

    for (let i = 0; i < dispN; i++) {
      for (let j = 0; j < dispN; j++) {
        let val = 0;
        if (i === j) val = 2; // diagonal
        else if (Math.abs(i - j) === 1) val = -1; // off-diagonal

        let color = WCOLORS.bg;
        if (val === 2) color = WCOLORS.teal;
        else if (val === -1) color = WCOLORS.amber;

        if (val !== 0) {
          ctx.fillStyle = color;
          ctx.globalAlpha = 0.7;
          ctx.fillRect(matStartX + j * cellSize, matStartY + i * cellSize, cellSize - 1, cellSize - 1);
          ctx.globalAlpha = 1.0;
        } else {
          ctx.fillStyle = 'rgba(31,42,46,0.04)';
          ctx.fillRect(matStartX + j * cellSize, matStartY + i * cellSize, cellSize - 1, cellSize - 1);
        }
      }
    }

    if (N > 10) {
      ctx.fillStyle = WCOLORS.textDim; ctx.font = '10px system-ui, sans-serif';
      ctx.fillText('(showing 10×10 of ' + N + '×' + N + ')', matL, matStartY + dispN * cellSize + 14);
    }

    // Legend
    ctx.fillStyle = WCOLORS.teal; ctx.font = '10px system-ui, sans-serif'; ctx.textAlign = 'left';
    const legY = matStartY + dispN * cellSize + 30;
    ctx.fillRect(matL, legY, 10, 10); ctx.fillText(' = 2 (diagonal)', matL + 14, legY + 9);
    ctx.fillStyle = WCOLORS.amber;
    ctx.fillRect(matL, legY + 16, 10, 10); ctx.fillText(' = −1 (off-diag)', matL + 14, legY + 25);

    // Info
    ctx.fillStyle = WCOLORS.text; ctx.font = '12px system-ui, sans-serif'; ctx.textAlign = 'left';
    ctx.fillText('N = ' + N + '    Mode ' + modeNum + '/' + N + '    ω = ' + omegaP.toFixed(3), 10, 18);

    requestAnimationFrame(tick);
  }

  tick();
}

// =========================================================================
// CHAPTER 5 INTERACTIVES: FOURIER ANALYSIS
// =========================================================================

// =========================================================================
// 8. FOURIER DECOMPOSITION (interactive series builder)
// =========================================================================
function initFourierDecomposition() {
  const canvas = document.getElementById('scene-fourier-decomposition');
  if (!canvas) return;
  const setup = wSetupCanvas(canvas);
  if (!setup) return;
  const { ctx, W, H } = setup;

  const termsSlider = document.getElementById('fourier-terms');
  const btnSquare = document.getElementById('fourier-square');
  const btnTriangle = document.getElementById('fourier-triangle');
  const btnSawtooth = document.getElementById('fourier-sawtooth');

  let waveType = 'square';

  btnSquare?.addEventListener('click', () => { waveType = 'square'; updateBtns(); });
  btnTriangle?.addEventListener('click', () => { waveType = 'triangle'; updateBtns(); });
  btnSawtooth?.addEventListener('click', () => { waveType = 'sawtooth'; updateBtns(); });

  function updateBtns() {
    [btnSquare, btnTriangle, btnSawtooth].forEach(b => { if (b) b.style.fontWeight = 'normal'; });
    const active = waveType === 'square' ? btnSquare : waveType === 'triangle' ? btnTriangle : btnSawtooth;
    if (active) active.style.fontWeight = 'bold';
    draw();
  }

  // Target function (period 2π, range roughly -1 to 1)
  function targetFunc(x) {
    // Normalize x to [0, 2π]
    const xn = ((x % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
    if (waveType === 'square') {
      return xn < Math.PI ? 1 : -1;
    } else if (waveType === 'triangle') {
      if (xn < Math.PI) return -1 + 2 * xn / Math.PI;
      return 3 - 2 * xn / Math.PI;
    } else { // sawtooth
      return (((xn + Math.PI) % (2 * Math.PI)) / Math.PI) - 1; // rising sawtooth, discontinuity at π
    }
  }

  // Fourier coefficients
  function fourierTerm(n, x) {
    if (waveType === 'square') {
      // Square wave: sum of (4/π) * sin((2k-1)x)/(2k-1), k=1,2,...
      if (n % 2 === 0) return 0;
      return (4 / (Math.PI * n)) * Math.sin(n * x);
    } else if (waveType === 'triangle') {
      // Triangle: sum of (8/(π²n²)) * sin(nπ/2) * cos(nx)... using standard
      // Triangle wave: (8/π²) * sum (-1)^k * sin((2k+1)x) / (2k+1)^2
      if (n % 2 === 0) return 0;
      const k = (n - 1) / 2;
      return (8 / (Math.PI * Math.PI * n * n)) * Math.pow(-1, k) * Math.sin(n * x);
    } else { // sawtooth
      // Sawtooth: (2/π) * sum (-1)^(n+1) * sin(nx)/n
      return (2 / Math.PI) * Math.pow(-1, n + 1) * Math.sin(n * x) / n;
    }
  }

  function draw() {
    const nTerms = parseInt(termsSlider?.value || 5);
    wClear(ctx, W, H);

    const plotL = 50, plotR = W - 20;
    const plotT = 30, plotB = H - 30;
    const plotMidY = (plotT + plotB) / 2;
    const plotW = plotR - plotL;
    const plotHalfH = (plotB - plotT) / 2 * 0.85;
    const xMin = -0.5, xMax = 2.5 * Math.PI;
    const xRange = xMax - xMin;

    // Axes
    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(plotL, plotMidY); ctx.lineTo(plotR, plotMidY); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(plotL, plotT); ctx.lineTo(plotL, plotB); ctx.stroke();

    // Grid
    ctx.strokeStyle = WCOLORS.grid; ctx.lineWidth = 0.5;
    for (let v = -1; v <= 1; v += 0.5) {
      if (v === 0) continue;
      const gy = plotMidY - v * plotHalfH;
      ctx.beginPath(); ctx.moveTo(plotL, gy); ctx.lineTo(plotR, gy); ctx.stroke();
    }
    // π marks
    ctx.fillStyle = WCOLORS.textDim; ctx.font = '10px system-ui, sans-serif'; ctx.textAlign = 'center';
    for (let k = 0; k <= 2; k++) {
      const px = plotL + (k * Math.PI - xMin) / xRange * plotW;
      ctx.beginPath(); ctx.moveTo(px, plotMidY - 3); ctx.lineTo(px, plotMidY + 3);
      ctx.strokeStyle = WCOLORS.axis; ctx.stroke();
      ctx.fillText(k === 0 ? '0' : k === 1 ? 'π' : '2π', px, plotMidY + 14);
    }

    // Target function (dashed)
    ctx.strokeStyle = WCOLORS.textDim; ctx.lineWidth = 1.5; ctx.setLineDash([5, 4]);
    ctx.beginPath();
    for (let px = 0; px <= plotW; px += 1) {
      const xVal = xMin + (px / plotW) * xRange;
      const yVal = targetFunc(xVal);
      const py = plotMidY - yVal * plotHalfH;
      px === 0 ? ctx.moveTo(plotL + px, py) : ctx.lineTo(plotL + px, py);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // Individual harmonics (light)
    const maxShow = Math.min(nTerms, 8);
    const harmColors = [WCOLORS.teal, WCOLORS.blue, WCOLORS.amber, WCOLORS.red, WCOLORS.orange, '#7c3aed', '#059669', '#db2777'];
    for (let n = 1; n <= maxShow; n++) {
      // Check if this term contributes
      let hasContrib = false;
      for (let px = 0; px <= plotW; px += 10) {
        const xVal = xMin + (px / plotW) * xRange;
        if (Math.abs(fourierTerm(n, xVal)) > 0.001) { hasContrib = true; break; }
      }
      if (!hasContrib) continue;

      ctx.strokeStyle = harmColors[(n - 1) % harmColors.length];
      ctx.lineWidth = 1.0; ctx.globalAlpha = 0.4;
      ctx.beginPath();
      for (let px = 0; px <= plotW; px += 2) {
        const xVal = xMin + (px / plotW) * xRange;
        const yVal = fourierTerm(n, xVal);
        const py = plotMidY - yVal * plotHalfH;
        px === 0 ? ctx.moveTo(plotL + px, py) : ctx.lineTo(plotL + px, py);
      }
      ctx.stroke();
      ctx.globalAlpha = 1.0;
    }

    // Sum (bold)
    ctx.strokeStyle = WCOLORS.teal; ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let px = 0; px <= plotW; px += 1) {
      const xVal = xMin + (px / plotW) * xRange;
      let sum = 0;
      for (let n = 1; n <= nTerms; n++) {
        sum += fourierTerm(n, xVal);
      }
      const py = plotMidY - sum * plotHalfH;
      px === 0 ? ctx.moveTo(plotL + px, py) : ctx.lineTo(plotL + px, py);
    }
    ctx.stroke();

    // Title & info
    ctx.fillStyle = WCOLORS.text; ctx.font = 'bold 13px system-ui, sans-serif'; ctx.textAlign = 'center';
    const typeName = waveType.charAt(0).toUpperCase() + waveType.slice(1);
    ctx.fillText('Fourier Series Approximation: ' + typeName + ' wave — ' + nTerms + ' term' + (nTerms > 1 ? 's' : ''), W / 2, 18);

    // Legend
    ctx.fillStyle = WCOLORS.textDim; ctx.font = '10px system-ui, sans-serif'; ctx.textAlign = 'right';
    ctx.setLineDash([4, 3]); ctx.strokeStyle = WCOLORS.textDim; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(plotR - 90, plotT + 8); ctx.lineTo(plotR - 60, plotT + 8); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillText('Target', plotR, plotT + 12);
    ctx.strokeStyle = WCOLORS.teal; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(plotR - 90, plotT + 22); ctx.lineTo(plotR - 60, plotT + 22); ctx.stroke();
    ctx.fillText('Sum', plotR, plotT + 26);
  }

  termsSlider?.addEventListener('input', draw);
  updateBtns();
}

// =========================================================================
// 9. FOURIER SAWTOOTH (with coefficient bar chart + Gibbs)
// =========================================================================
function initFourierSawtooth() {
  const canvas = document.getElementById('scene-fourier-sawtooth');
  if (!canvas) return;
  const setup = wSetupCanvas(canvas);
  if (!setup) return;
  const { ctx, W, H } = setup;

  const termsSlider = document.getElementById('sawtooth-terms');

  function draw() {
    const nTerms = parseInt(termsSlider?.value || 10);
    wClear(ctx, W, H);

    // Layout: waveform on left, bar chart on right
    const waveL = 50, waveR = W * 0.58;
    const barL = W * 0.64, barR = W - 15;
    const plotT = 35, plotB = H - 30;
    const plotMidY = (plotT + plotB) / 2;
    const plotHalfH = (plotB - plotT) / 2 * 0.85;
    const waveW = waveR - waveL;
    const xMin = -0.3, xMax = 2.3 * Math.PI;
    const xRange = xMax - xMin;

    // --- Waveform plot ---
    // Axes
    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(waveL, plotMidY); ctx.lineTo(waveR, plotMidY); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(waveL, plotT); ctx.lineTo(waveL, plotB); ctx.stroke();

    // Target sawtooth (dashed)
    ctx.strokeStyle = WCOLORS.textDim; ctx.lineWidth = 1.5; ctx.setLineDash([5, 4]);
    ctx.beginPath();
    for (let px = 0; px <= waveW; px += 1) {
      const xVal = xMin + (px / waveW) * xRange;
      const xn = ((xVal % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
      const yVal = (((xn + Math.PI) % (2 * Math.PI)) / Math.PI) - 1;
      const py = plotMidY - yVal * plotHalfH;
      px === 0 ? ctx.moveTo(waveL + px, py) : ctx.lineTo(waveL + px, py);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // Fourier sum
    ctx.strokeStyle = WCOLORS.teal; ctx.lineWidth = 2.5;
    ctx.beginPath();
    let gibbsMax = 0, gibbsX = 0, gibbsY = 0;
    for (let px = 0; px <= waveW; px += 1) {
      const xVal = xMin + (px / waveW) * xRange;
      let sum = 0;
      for (let n = 1; n <= nTerms; n++) {
        sum += (2 / Math.PI) * Math.pow(-1, n + 1) * Math.sin(n * xVal) / n;
      }
      const py = plotMidY - sum * plotHalfH;
      px === 0 ? ctx.moveTo(waveL + px, py) : ctx.lineTo(waveL + px, py);

      // Track Gibbs overshoot near x=0+
      const xn = ((xVal % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
      if (xn > 0 && xn < 0.5 && Math.abs(sum) > gibbsMax) {
        gibbsMax = Math.abs(sum);
        gibbsX = waveL + px;
        gibbsY = py;
      }
    }
    ctx.stroke();

    // Gibbs annotation
    if (nTerms >= 3 && gibbsMax > 1.05) {
      ctx.fillStyle = WCOLORS.red; ctx.font = '10px system-ui, sans-serif'; ctx.textAlign = 'left';
      ctx.beginPath(); ctx.arc(gibbsX, gibbsY, 3, 0, Math.PI * 2); ctx.fill();
      ctx.fillText('Gibbs (~9%)', gibbsX + 6, gibbsY - 4);
    }

    ctx.fillStyle = WCOLORS.text; ctx.font = '11px system-ui, sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('Sawtooth convergence', (waveL + waveR) / 2, plotT - 8);

    // --- Bar chart: coefficients b_n = (-1)^(n+1) * 2/(πn) ---
    const barW = barR - barL;
    const maxBars = Math.min(nTerms, 20);
    const barGap = 2;
    const barWidth = Math.max(3, (barW - (maxBars - 1) * barGap) / maxBars);

    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(barL, plotMidY); ctx.lineTo(barR, plotMidY); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(barL, plotT); ctx.lineTo(barL, plotB); ctx.stroke();

    ctx.fillStyle = WCOLORS.text; ctx.font = '11px system-ui, sans-serif'; ctx.textAlign = 'center';
    fillTextSub(ctx, 'Coefficients b_n', (barL + barR) / 2, plotT - 8);

    // y-axis label
    ctx.save();
    ctx.translate(barL - 8, plotMidY);
    ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = WCOLORS.textDim; ctx.font = '10px system-ui, sans-serif'; ctx.textAlign = 'center';
    fillTextSub(ctx, 'b_n', 0, 0);
    ctx.restore();

    const maxCoeff = 2 / Math.PI; // b_1
    for (let n = 1; n <= maxBars; n++) {
      const bn = (2 / Math.PI) * Math.pow(-1, n + 1) / n;
      const barH = (bn / maxCoeff) * plotHalfH * 0.9;
      const bx = barL + 5 + (n - 1) * (barWidth + barGap);

      ctx.fillStyle = bn > 0 ? WCOLORS.teal : WCOLORS.red;
      ctx.globalAlpha = 0.8;
      ctx.fillRect(bx, plotMidY - Math.max(0, barH), barWidth, Math.abs(barH));
      ctx.globalAlpha = 1.0;

      // Label for first few
      if (maxBars <= 12 || n <= 5 || n === maxBars) {
        ctx.fillStyle = WCOLORS.textDim; ctx.font = '10px system-ui, sans-serif'; ctx.textAlign = 'center';
        ctx.fillText(n.toString(), bx + barWidth / 2, plotMidY + (bn > 0 ? 12 : -4));
      }
    }

    // Formula
    ctx.fillStyle = WCOLORS.textDim; ctx.font = '11px system-ui, sans-serif'; ctx.textAlign = 'left';
    fillTextSub(ctx, 'b_n = (−1)^{(n+1)} · 2/(πn)', barL, plotB + 14);

    // Info
    ctx.fillStyle = WCOLORS.text; ctx.font = '12px system-ui, sans-serif'; ctx.textAlign = 'left';
    ctx.fillText('N = ' + nTerms + ' terms', 10, 18);
  }

  termsSlider?.addEventListener('input', draw);
  draw();
}

// =========================================================================
// 10. PLUCKED STRING (animate string modes)
// =========================================================================
function initPluckedString() {
  const canvas = document.getElementById('scene-plucked-string');
  if (!canvas) return;
  const setup = wSetupCanvas(canvas);
  if (!setup) return;
  const { ctx, W, H } = setup;

  const dampingSlider = document.getElementById('pluck-damping');
  const speedSlider = document.getElementById('pluck-speed');

  let t = 0;
  let pluckPos = 0.25;
  let plucked = false;
  let dragging = false;
  let dragY = 0;
  const nModes = 12;

  // String geometry constants
  const strL = 50, strR = W - 50;
  const strY = 80;
  const strW = strR - strL;
  const strHalfH = 50;

  function getStringPos(e) {
    const rect = canvas.getBoundingClientRect();
    // Use CSS-pixel coordinates to match drawing coords (ctx is already scaled by dpr)
    const cx = (e.clientX - rect.left) * (W / rect.width);
    const cy = (e.clientY - rect.top) * (H / rect.height);
    const frac = (cx - strL) / strW;
    return { cx, cy, frac: Math.max(0.05, Math.min(0.95, frac)) };
  }

  canvas.addEventListener('mousedown', function(e) {
    const { cx, cy, frac } = getStringPos(e);
    if (cx >= strL && cx <= strR && cy >= strY - 60 && cy <= strY + 60) {
      dragging = true;
      pluckPos = frac;
      dragY = cy;
      plucked = false;
      canvas.style.cursor = 'grabbing';
    }
  });

  canvas.addEventListener('mousemove', function(e) {
    const { cx, cy, frac } = getStringPos(e);
    if (dragging) {
      pluckPos = frac;
      dragY = cy;
    } else if (cx >= strL && cx <= strR && cy >= strY - 60 && cy <= strY + 60) {
      canvas.style.cursor = 'pointer';
    } else {
      canvas.style.cursor = 'default';
    }
  });

  canvas.addEventListener('mouseup', function() {
    if (dragging) {
      dragging = false;
      plucked = true;
      t = 0;
      canvas.style.cursor = 'pointer';
    }
  });

  canvas.addEventListener('mouseleave', function() {
    if (dragging) {
      dragging = false;
      plucked = true;
      t = 0;
      canvas.style.cursor = 'default';
    }
  });

  // Touch support
  canvas.addEventListener('touchstart', function(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const { cx, cy, frac } = getStringPos(touch);
    if (cx >= strL && cx <= strR) {
      dragging = true;
      pluckPos = frac;
      dragY = cy;
      plucked = false;
    }
  }, { passive: false });

  canvas.addEventListener('touchmove', function(e) {
    e.preventDefault();
    if (dragging) {
      const touch = e.touches[0];
      const { frac, cy } = getStringPos(touch);
      pluckPos = frac;
      dragY = cy;
    }
  }, { passive: false });

  canvas.addEventListener('touchend', function(e) {
    e.preventDefault();
    if (dragging) {
      dragging = false;
      plucked = true;
      t = 0;
    }
  }, { passive: false });

  function tick() {
    if (!canvas.isConnected) return;
    const damping = parseFloat(dampingSlider?.value || 0);
    const speed = parseFloat(speedSlider?.value || 1);

    document.getElementById('pluck-damping-val')?.replaceChildren(document.createTextNode(damping.toFixed(2)));
    document.getElementById('pluck-speed-val')?.replaceChildren(document.createTextNode(speed.toFixed(1)));

    if (plucked) {
      const dt = 0.02 * speed;
      t += dt;
    }

    wClear(ctx, W, H);

    const L = 1;

    // Plucked string coefficients
    const d = pluckPos * L;
    const h = 1;
    const coeffs = [];
    for (let n = 1; n <= nModes; n++) {
      const An = (2 * h * L * L) / (n * n * Math.PI * Math.PI * d * (L - d)) * Math.sin(n * Math.PI * d / L);
      coeffs.push(An);
    }

    // Envelope decay: each mode decays as exp(-damping * n * t)
    const envelopes = [];
    for (let n = 0; n < nModes; n++) {
      envelopes.push(Math.exp(-damping * (n + 1) * t));
    }

    // Check if string has essentially stopped
    const maxEnv = Math.max(...envelopes);
    const isAtRest = plucked && maxEnv < 0.005;
    if (isAtRest) {
      plucked = false;
      t = 0;
    }

    // --- Top: animated string ---
    // Fixed ends (walls)
    ctx.fillStyle = WCOLORS.axis;
    ctx.fillRect(strL - 5, strY - 20, 5, 40);
    ctx.fillRect(strR, strY - 20, 5, 40);

    // Equilibrium line
    ctx.strokeStyle = WCOLORS.grid; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(strL, strY); ctx.lineTo(strR, strY); ctx.stroke();

    if (dragging) {
      // Show the string being pulled by the user
      const pluckX = strL + pluckPos * strW;
      const pullAmount = Math.max(-strHalfH, Math.min(strHalfH, strY - dragY));

      // Draw pulled string shape
      ctx.strokeStyle = WCOLORS.amber; ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(strL, strY);
      ctx.lineTo(pluckX, strY - pullAmount);
      ctx.lineTo(strR, strY);
      ctx.stroke();

      // Pluck point indicator
      ctx.fillStyle = WCOLORS.amber;
      ctx.beginPath();
      ctx.arc(pluckX, strY - pullAmount, 5, 0, Math.PI * 2);
      ctx.fill();

      // Label
      ctx.fillStyle = WCOLORS.text; ctx.font = '12px system-ui, sans-serif'; ctx.textAlign = 'left';
      ctx.fillText('Pulling at x/L = ' + pluckPos.toFixed(2) + ' \u2014 release to pluck!', 10, 18);

    } else if (plucked && !isAtRest) {
      // Pluck position marker
      const pluckX = strL + pluckPos * strW;
      ctx.strokeStyle = WCOLORS.amber; ctx.lineWidth = 1; ctx.setLineDash([3, 3]);
      ctx.beginPath(); ctx.moveTo(pluckX, strY - 35); ctx.lineTo(pluckX, strY + 35); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = WCOLORS.amber; ctx.font = '10px system-ui, sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('pluck', pluckX, strY - 38);

      // Initial shape (dashed)
      ctx.strokeStyle = WCOLORS.textDim; ctx.lineWidth = 1; ctx.setLineDash([4, 3]);
      ctx.beginPath();
      ctx.moveTo(strL, strY);
      ctx.lineTo(pluckX, strY - strHalfH * h);
      ctx.lineTo(strR, strY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Animated string with decay
      ctx.strokeStyle = WCOLORS.teal; ctx.lineWidth = 2.5;
      ctx.beginPath();
      for (let px = 0; px <= strW; px += 1) {
        const x = px / strW;
        let y = 0;
        for (let n = 0; n < nModes; n++) {
          const omega_n = (n + 1) * Math.PI;
          y += coeffs[n] * envelopes[n] * Math.sin((n + 1) * Math.PI * x) * Math.cos(omega_n * t);
        }
        const py = strY - y * strHalfH;
        px === 0 ? ctx.moveTo(strL + px, py) : ctx.lineTo(strL + px, py);
      }
      ctx.stroke();

      // Title
      ctx.fillStyle = WCOLORS.text; ctx.font = '12px system-ui, sans-serif'; ctx.textAlign = 'left';
      ctx.fillText('Pluck at x/L = ' + pluckPos.toFixed(2), 10, 18);

    } else {
      // At rest — draw flat string and prompt
      ctx.strokeStyle = WCOLORS.teal; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.moveTo(strL, strY); ctx.lineTo(strR, strY); ctx.stroke();

      // Prompt text
      ctx.fillStyle = WCOLORS.amber; ctx.font = '13px system-ui, sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('Click and drag the string to pluck it', (strL + strR) / 2, strY - 35);

      // Small down arrow hint
      ctx.beginPath();
      ctx.moveTo((strL + strR) / 2 - 6, strY - 18);
      ctx.lineTo((strL + strR) / 2, strY - 10);
      ctx.lineTo((strL + strR) / 2 + 6, strY - 18);
      ctx.strokeStyle = WCOLORS.amber; ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    // --- Bottom: Fourier coefficient histogram ---
    const histT = 150, histB = H - 20;
    const histH = histB - histT;
    const histL = strL + 20, histR = strR - 20;
    const histW = histR - histL;

    // Title
    ctx.fillStyle = WCOLORS.text; ctx.font = '11px system-ui, sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('Fourier coefficients |b\u2099|', (strL + strR) / 2, histT - 5);

    // Find max coefficient for scaling
    const absCoeffs = coeffs.map(c => Math.abs(c));
    const maxCoeff = Math.max(...absCoeffs, 0.01);

    // Bar dimensions
    const barGap = 4;
    const barW = (histW - barGap * (nModes - 1)) / nModes;
    const modeColors = [WCOLORS.teal, WCOLORS.blue, WCOLORS.amber, WCOLORS.red, WCOLORS.orange];

    // Baseline
    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(histL, histB); ctx.lineTo(histR, histB); ctx.stroke();

    // Y-axis
    ctx.beginPath(); ctx.moveTo(histL, histT); ctx.lineTo(histL, histB); ctx.stroke();

    // Draw bars
    for (let n = 0; n < nModes; n++) {
      const effAmp = plucked ? absCoeffs[n] * envelopes[n] : absCoeffs[n];
      const barH = (effAmp / maxCoeff) * (histH - 10);
      const x = histL + n * (barW + barGap);

      // Bar fill
      ctx.fillStyle = modeColors[n % modeColors.length];
      ctx.globalAlpha = 0.7;
      ctx.fillRect(x, histB - barH, barW, barH);
      ctx.globalAlpha = 1.0;

      // Bar outline
      ctx.strokeStyle = modeColors[n % modeColors.length];
      ctx.lineWidth = 1;
      ctx.strokeRect(x, histB - barH, barW, barH);

      // Mode label
      ctx.fillStyle = WCOLORS.textDim; ctx.font = '9px system-ui, sans-serif'; ctx.textAlign = 'center';
      ctx.fillText(String(n + 1), x + barW / 2, histB + 11);
    }

    // Axis label
    ctx.fillStyle = WCOLORS.textDim; ctx.font = '9px system-ui, sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('mode n', (histL + histR) / 2, histB + 22);

    requestAnimationFrame(tick);
  }

  tick();
}

// =========================================================================
// CHAPTER 4 (continued): N-Mass Normal Modes (Numerical)
// =========================================================================
function initNMassModesNumerical() {
  const canvas = document.getElementById('scene-n-mass-modes-numerical');
  if (!canvas) return;
  const setup = wSetupCanvas(canvas);
  if (!setup) return;
  const { ctx, W, H } = setup;

  // Create controls
  let nSlider = document.getElementById('nmm-n');
  if (!nSlider) {
    const parent = canvas.parentElement;
    if (parent) {
      const controls = document.createElement('div');
      controls.className = 'scene-controls';
      controls.innerHTML =
        '<label>N: <input type="range" id="nmm-n" min="4" max="20" step="1" value="8"><span class="scene-val" id="nmm-n-val">8</span></label>' +
        '<label>Mode j: <input type="range" id="nmm-j" min="1" max="8" step="1" value="1"><span class="scene-val" id="nmm-j-val">1</span></label>';
      parent.appendChild(controls);
      nSlider = document.getElementById('nmm-n');
    }
  }
  const jSlider = document.getElementById('nmm-j');

  let t = 0;

  function tick() {
    if (!canvas.isConnected) return;
    const N = parseInt(nSlider?.value || 8);
    const j = Math.min(parseInt(jSlider?.value || 1), N);
    if (jSlider) jSlider.max = N;
    if (parseInt(jSlider?.value || 1) > N && jSlider) jSlider.value = N;

    document.getElementById('nmm-n-val')?.replaceChildren(document.createTextNode(N));
    document.getElementById('nmm-j-val')?.replaceChildren(document.createTextNode(j));

    const omega0 = 1;
    const omegaJ = 2 * omega0 * Math.sin(j * Math.PI / (2 * (N + 1)));

    t += 0.03;

    wClear(ctx, W, H);

    const margin = 50;
    const chainL = margin + 10;
    const chainR = W - margin - 10;
    const chainW = chainR - chainL;
    const midY = H / 2;
    const maxAmp = 50;
    const amplitude = Math.cos(omegaJ * t);

    // Draw walls
    ctx.fillStyle = WCOLORS.axis;
    ctx.fillRect(chainL - 8, midY - 40, 6, 80);
    ctx.fillRect(chainR + 2, midY - 40, 6, 80);
    ctx.strokeStyle = WCOLORS.textDim; ctx.lineWidth = 1;
    for (let i = 0; i < 6; i++) {
      const wy = midY - 35 + i * 14;
      ctx.beginPath(); ctx.moveTo(chainL - 8, wy); ctx.lineTo(chainL - 14, wy + 7); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(chainR + 8, wy); ctx.lineTo(chainR + 14, wy + 7); ctx.stroke();
    }

    // Compute mode shape displacements
    const positions = [];
    for (let n = 1; n <= N; n++) {
      const yDisp = Math.sin(n * j * Math.PI / (N + 1)) * amplitude * maxAmp;
      const xPos = chainL + (n / (N + 1)) * chainW;
      positions.push({ x: xPos, y: midY + yDisp });
    }

    // Connecting lines (springs)
    ctx.strokeStyle = WCOLORS.teal; ctx.lineWidth = 1.5; ctx.globalAlpha = 0.5;
    ctx.beginPath();
    ctx.moveTo(chainL, midY);
    for (let i = 0; i < positions.length; i++) {
      ctx.lineTo(positions[i].x, positions[i].y);
    }
    ctx.lineTo(chainR, midY);
    ctx.stroke();
    ctx.globalAlpha = 1;

    // Equilibrium dashed line
    ctx.strokeStyle = WCOLORS.textDim; ctx.lineWidth = 0.5; ctx.setLineDash([3, 3]);
    ctx.beginPath(); ctx.moveTo(chainL, midY); ctx.lineTo(chainR, midY); ctx.stroke();
    ctx.setLineDash([]);

    // Masses
    for (let i = 0; i < positions.length; i++) {
      const p = positions[i];
      ctx.fillStyle = WCOLORS.teal;
      ctx.beginPath(); ctx.arc(p.x, p.y, 6, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(p.x, p.y, 6, 0, Math.PI * 2); ctx.stroke();
    }

    // Mode shape envelope (ghost)
    ctx.strokeStyle = WCOLORS.amber; ctx.lineWidth = 1; ctx.setLineDash([4, 3]); ctx.globalAlpha = 0.5;
    ctx.beginPath();
    ctx.moveTo(chainL, midY);
    for (let n = 1; n <= N; n++) {
      const yEnv = Math.sin(n * j * Math.PI / (N + 1)) * maxAmp;
      const xPos = chainL + (n / (N + 1)) * chainW;
      ctx.lineTo(xPos, midY + yEnv);
    }
    ctx.lineTo(chainR, midY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(chainL, midY);
    for (let n = 1; n <= N; n++) {
      const yEnv = -Math.sin(n * j * Math.PI / (N + 1)) * maxAmp;
      const xPos = chainL + (n / (N + 1)) * chainW;
      ctx.lineTo(xPos, midY + yEnv);
    }
    ctx.lineTo(chainR, midY);
    ctx.stroke();
    ctx.setLineDash([]); ctx.globalAlpha = 1;

    // Labels
    ctx.fillStyle = WCOLORS.text; ctx.font = '12px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('Normal Mode ' + j + ' of ' + N + ' masses', W / 2, 20);

    ctx.fillStyle = WCOLORS.teal; ctx.font = '11px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('\u03C9\u2C7C = 2\u03C9\u2080 sin(j\u03C0/2(N+1)) = ' + omegaJ.toFixed(3) + ' \u03C9\u2080', W / 2, H - 10);

    requestAnimationFrame(tick);
  }

  nSlider?.addEventListener('input', () => {});
  jSlider?.addEventListener('input', () => {});
  tick();
}

// =========================================================================
// CHAPTER 4 (continued): Dispersion Relation (Discrete)
// =========================================================================
function initDispersionRelationDiscrete() {
  const canvas = document.getElementById('scene-dispersion-relation-discrete');
  if (!canvas) return;
  const setup = wSetupCanvas(canvas);
  if (!setup) return;
  const { ctx, W, H } = setup;

  let nSlider = document.getElementById('drd-n');
  if (!nSlider) {
    const parent = canvas.parentElement;
    if (parent) {
      const controls = document.createElement('div');
      controls.className = 'scene-controls';
      controls.innerHTML =
        '<label>N: <input type="range" id="drd-n" min="4" max="20" step="1" value="8"><span class="scene-val" id="drd-n-val">8</span></label>' +
        '<label>Highlight mode: <input type="range" id="drd-mode" min="1" max="8" step="1" value="1"><span class="scene-val" id="drd-mode-val">1</span></label>';
      parent.appendChild(controls);
      nSlider = document.getElementById('drd-n');
    }
  }
  const modeSlider = document.getElementById('drd-mode');

  const plotL = 60, plotR = W - 30, plotT = 35, plotB = H - 35;
  const plotW = plotR - plotL, plotH = plotB - plotT;

  function draw() {
    const N = parseInt(nSlider?.value || 8);
    const selMode = Math.min(parseInt(modeSlider?.value || 1), N);
    if (modeSlider) modeSlider.max = N;
    if (parseInt(modeSlider?.value || 1) > N && modeSlider) modeSlider.value = N;

    document.getElementById('drd-n-val')?.replaceChildren(document.createTextNode(N));
    document.getElementById('drd-mode-val')?.replaceChildren(document.createTextNode(selMode));

    wClear(ctx, W, H);

    // Axes
    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(plotL, plotT); ctx.lineTo(plotL, plotB); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(plotL, plotB); ctx.lineTo(plotR, plotB); ctx.stroke();

    const pMax = Math.PI * 1.15;
    const omegaMax = 2.3;

    // Brillouin zone boundary at p = pi
    const bzX = plotL + (Math.PI / pMax) * plotW;
    ctx.strokeStyle = WCOLORS.red; ctx.lineWidth = 1; ctx.setLineDash([5, 3]);
    ctx.beginPath(); ctx.moveTo(bzX, plotT); ctx.lineTo(bzX, plotB); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = WCOLORS.red; ctx.font = '10px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('p = \u03C0', bzX, plotB + 14);
    ctx.fillText('Brillouin zone', bzX, plotT - 6);

    // Continuous dispersion curve
    ctx.strokeStyle = WCOLORS.teal; ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let i = 0; i <= 300; i++) {
      const p = (i / 300) * pMax;
      const omega = 2 * Math.abs(Math.sin(p / 2));
      const px = plotL + (p / pMax) * plotW;
      const py = plotB - (omega / omegaMax) * plotH;
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Linear approximation
    ctx.strokeStyle = WCOLORS.amber; ctx.lineWidth = 1.5; ctx.setLineDash([6, 4]);
    ctx.beginPath();
    for (let i = 0; i <= 200; i++) {
      const p = (i / 200) * pMax;
      const omega = p;
      if (omega > omegaMax) break;
      const px = plotL + (p / pMax) * plotW;
      const py = plotB - (omega / omegaMax) * plotH;
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // Discrete allowed values
    for (let j = 1; j <= N; j++) {
      const p = j * Math.PI / (N + 1);
      const omega = 2 * Math.abs(Math.sin(p / 2));
      const px = plotL + (p / pMax) * plotW;
      const py = plotB - (omega / omegaMax) * plotH;

      const isSelected = (j === selMode);
      ctx.fillStyle = isSelected ? WCOLORS.red : WCOLORS.teal;
      ctx.beginPath(); ctx.arc(px, py, isSelected ? 7 : 4, 0, Math.PI * 2); ctx.fill();
      if (isSelected) {
        ctx.strokeStyle = WCOLORS.red; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(px, py, 7, 0, Math.PI * 2); ctx.stroke();
        ctx.fillStyle = WCOLORS.red; ctx.font = '10px system-ui'; ctx.textAlign = 'left';
        ctx.fillText('j=' + j + ', \u03C9=' + omega.toFixed(2) + '\u03C9\u2080', px + 10, py - 4);
      }
    }

    // Axis labels
    ctx.fillStyle = WCOLORS.text; ctx.font = '11px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('\u03C9 / \u03C9\u2080', plotL - 30, plotT - 6);
    ctx.fillText('p (wave number)', plotL + plotW / 2, plotB + 28);

    // Y-axis ticks
    ctx.fillStyle = WCOLORS.textDim; ctx.font = '11px system-ui'; ctx.textAlign = 'right';
    for (let v = 0; v <= 2; v += 0.5) {
      const py = plotB - (v / omegaMax) * plotH;
      ctx.beginPath(); ctx.moveTo(plotL - 3, py); ctx.lineTo(plotL, py); ctx.strokeStyle = WCOLORS.axis; ctx.stroke();
      ctx.fillText(v.toFixed(1), plotL - 6, py + 3);
    }

    // Legend
    ctx.font = '10px system-ui'; ctx.textAlign = 'left';
    ctx.fillStyle = WCOLORS.teal; ctx.fillText('\u2014 \u03C9 = 2\u03C9\u2080|sin(p/2)|', plotL + 5, plotT + 14);
    ctx.fillStyle = WCOLORS.amber; ctx.fillText('-- \u03C9 = \u03C9\u2080p (linear)', plotL + 5, plotT + 28);

    // Title
    ctx.fillStyle = WCOLORS.text; ctx.font = '12px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('Dispersion Relation: Discrete Chain', W / 2, 16);
  }

  nSlider?.addEventListener('input', draw);
  modeSlider?.addEventListener('input', draw);
  draw();
}

// =========================================================================
// CHAPTER 4 (continued): Continuum Limit
// =========================================================================
function initContinuumLimit() {
  const canvas = document.getElementById('scene-continuum-limit');
  if (!canvas) return;
  const setup = wSetupCanvas(canvas);
  if (!setup) return;
  const { ctx, W, H } = setup;

  let nSlider = document.getElementById('cl-n');
  if (!nSlider) {
    const parent = canvas.parentElement;
    if (parent) {
      const controls = document.createElement('div');
      controls.className = 'scene-controls';
      controls.innerHTML =
        '<label>N: <input type="range" id="cl-n" min="3" max="100" step="1" value="6"><span class="scene-val" id="cl-n-val">6</span></label>' +
        '<label>Mode: <input type="range" id="cl-mode" min="1" max="4" step="1" value="1"><span class="scene-val" id="cl-mode-val">1</span></label>';
      parent.appendChild(controls);
      nSlider = document.getElementById('cl-n');
    }
  }
  const modeSlider = document.getElementById('cl-mode');

  let t = 0;

  const topH = H * 0.5;
  const botT = H * 0.55;
  const botB = H - 15;

  function tick() {
    if (!canvas.isConnected) return;
    const N = parseInt(nSlider?.value || 6);
    const j = Math.min(parseInt(modeSlider?.value || 1), Math.min(N, 4));
    if (modeSlider) modeSlider.max = Math.min(N, 4);

    document.getElementById('cl-n-val')?.replaceChildren(document.createTextNode(N));
    document.getElementById('cl-mode-val')?.replaceChildren(document.createTextNode(j));

    t += 0.03;

    const omega0 = 1;
    const omegaJ = 2 * omega0 * Math.sin(j * Math.PI / (2 * (N + 1)));
    const amplitude = Math.cos(omegaJ * t);

    wClear(ctx, W, H);

    const margin = 40;
    const chainL = margin + 20;
    const chainR = W - margin - 20;
    const chainW = chainR - chainL;
    const midY = topH / 2 + 10;
    const maxAmp = topH * 0.35;

    // === Top: Mode shape ===
    ctx.fillStyle = WCOLORS.text; ctx.font = '12px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('Mode ' + j + ' with N = ' + N + ' masses', W / 2, 16);

    // Walls
    ctx.fillStyle = WCOLORS.axis;
    ctx.fillRect(chainL - 6, midY - 25, 4, 50);
    ctx.fillRect(chainR + 2, midY - 25, 4, 50);

    // Equilibrium line
    ctx.strokeStyle = WCOLORS.textDim; ctx.lineWidth = 0.5; ctx.setLineDash([3, 3]);
    ctx.beginPath(); ctx.moveTo(chainL, midY); ctx.lineTo(chainR, midY); ctx.stroke();
    ctx.setLineDash([]);

    // Continuous sine curve (what it converges to)
    ctx.strokeStyle = WCOLORS.amber; ctx.lineWidth = 1.5; ctx.globalAlpha = 0.4;
    ctx.beginPath();
    for (let i = 0; i <= 200; i++) {
      const frac = i / 200;
      const yDisp = Math.sin(frac * j * Math.PI) * amplitude * maxAmp;
      const px = chainL + frac * chainW;
      i === 0 ? ctx.moveTo(px, midY + yDisp) : ctx.lineTo(px, midY + yDisp);
    }
    ctx.stroke();
    ctx.globalAlpha = 1;

    // Discrete masses with connecting lines
    const positions = [];
    for (let n = 1; n <= N; n++) {
      const frac = n / (N + 1);
      const yDisp = Math.sin(n * j * Math.PI / (N + 1)) * amplitude * maxAmp;
      positions.push({ x: chainL + frac * chainW, y: midY + yDisp });
    }

    ctx.strokeStyle = WCOLORS.teal; ctx.lineWidth = N > 30 ? 1.5 : 1; ctx.globalAlpha = 0.6;
    ctx.beginPath();
    ctx.moveTo(chainL, midY);
    for (const p of positions) ctx.lineTo(p.x, p.y);
    ctx.lineTo(chainR, midY);
    ctx.stroke();
    ctx.globalAlpha = 1;

    if (N <= 50) {
      const radius = Math.max(2, 6 - N * 0.08);
      for (const p of positions) {
        ctx.fillStyle = WCOLORS.teal;
        ctx.beginPath(); ctx.arc(p.x, p.y, radius, 0, Math.PI * 2); ctx.fill();
      }
    }

    // === Bottom: Dispersion comparison ===
    const dL = 60, dR = W - 30;
    const dW = dR - dL, dH = botB - botT;
    const pMax = Math.PI * 1.1;
    const omMax = 2.3;

    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(dL, botT); ctx.lineTo(dL, botB); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(dL, botB); ctx.lineTo(dR, botB); ctx.stroke();

    // Discrete dispersion
    ctx.strokeStyle = WCOLORS.teal; ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i <= 200; i++) {
      const p = (i / 200) * pMax;
      const om = 2 * Math.abs(Math.sin(p / 2));
      const px = dL + (p / pMax) * dW;
      const py = botB - (om / omMax) * dH;
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Linear dispersion (continuum limit)
    ctx.strokeStyle = WCOLORS.amber; ctx.lineWidth = 1.5; ctx.setLineDash([5, 3]);
    ctx.beginPath();
    for (let i = 0; i <= 200; i++) {
      const p = (i / 200) * pMax;
      const om = p;
      if (om > omMax) break;
      const px = dL + (p / pMax) * dW;
      const py = botB - (om / omMax) * dH;
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    for (let jj = 1; jj <= Math.min(N, 4); jj++) {
      const p = jj * Math.PI / (N + 1);
      const om = 2 * Math.abs(Math.sin(p / 2));
      const px = dL + (p / pMax) * dW;
      const py = botB - (om / omMax) * dH;
      ctx.fillStyle = (jj === j) ? WCOLORS.red : WCOLORS.teal;
      ctx.beginPath(); ctx.arc(px, py, (jj === j) ? 5 : 3, 0, Math.PI * 2); ctx.fill();
    }

    ctx.fillStyle = WCOLORS.text; ctx.font = '10px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('Dispersion: discrete vs continuum', dL + dW / 2, botT - 4);
    ctx.fillStyle = WCOLORS.textDim; ctx.font = '11px system-ui';
    ctx.fillText('\u03C9', dL - 14, botT + 6);
    ctx.fillText('p', dR + 10, botB + 4);

    ctx.font = '11px system-ui'; ctx.textAlign = 'left';
    ctx.fillStyle = WCOLORS.teal; ctx.fillText('discrete', dR - 80, botT + 12);
    ctx.fillStyle = WCOLORS.amber; ctx.fillText('linear', dR - 80, botT + 24);

    requestAnimationFrame(tick);
  }

  nSlider?.addEventListener('input', () => {});
  modeSlider?.addEventListener('input', () => {});
  tick();
}

// =========================================================================
// CHAPTER 4 (continued): Traveling vs Standing Waves
// =========================================================================
function initTravelingVsStanding() {
  const canvas = document.getElementById('scene-traveling-vs-standing');
  if (!canvas) return;
  const setup = wSetupCanvas(canvas);
  if (!setup) return;
  const { ctx, W, H } = setup;

  let kSlider = document.getElementById('tvs-k');
  if (!kSlider) {
    const parent = canvas.parentElement;
    if (parent) {
      const controls = document.createElement('div');
      controls.className = 'scene-controls';
      controls.innerHTML =
        '<label>k: <input type="range" id="tvs-k" min="1" max="6" step="0.5" value="2"><span class="scene-val" id="tvs-k-val">2.0</span></label>' +
        '<button id="tvs-mode-btn" style="margin-left:10px;padding:2px 10px;font-size:11px;cursor:pointer;">Show: Both</button>';
      parent.appendChild(controls);
      kSlider = document.getElementById('tvs-k');
    }
  }
  const modeBtn = document.getElementById('tvs-mode-btn');

  let viewMode = 0; // 0 = both, 1 = traveling only, 2 = standing only
  const modeLabels = ['Both', 'Traveling', 'Standing'];
  modeBtn?.addEventListener('click', () => {
    viewMode = (viewMode + 1) % 3;
    if (modeBtn) modeBtn.textContent = 'Show: ' + modeLabels[viewMode];
  });

  let t = 0;

  function tick() {
    if (!canvas.isConnected) return;
    const k = parseFloat(kSlider?.value || 2);
    const omega = k * 1.5;
    document.getElementById('tvs-k-val')?.replaceChildren(document.createTextNode(k.toFixed(1)));

    t += 0.03;

    wClear(ctx, W, H);

    const showTrav = (viewMode === 0 || viewMode === 1);
    const showStand = (viewMode === 0 || viewMode === 2);

    let travL, travR, standL, standR;
    if (viewMode === 0) {
      travL = 30; travR = W / 2 - 15;
      standL = W / 2 + 15; standR = W - 30;
    } else if (viewMode === 1) {
      travL = 30; travR = W - 30;
      standL = 0; standR = 0;
    } else {
      standL = 30; standR = W - 30;
      travL = 0; travR = 0;
    }

    const midY = H / 2;
    const amp = 50;
    const steps = 200;

    // --- Traveling wave ---
    if (showTrav) {
      const twW = travR - travL;
      ctx.fillStyle = WCOLORS.text; ctx.font = '11px system-ui'; ctx.textAlign = 'center';
      ctx.fillText('Traveling Wave: f(x \u2212 vt)', (travL + travR) / 2, 20);

      ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(travL, midY); ctx.lineTo(travR, midY); ctx.stroke();

      // Ghost (previous positions)
      for (let g = 1; g <= 3; g++) {
        const tg = t - g * 0.15;
        ctx.strokeStyle = WCOLORS.teal; ctx.lineWidth = 1; ctx.globalAlpha = 0.15;
        ctx.beginPath();
        for (let i = 0; i <= steps; i++) {
          const frac = i / steps;
          const x = frac * 2 * Math.PI * 3 / k;
          const y = Math.sin(k * x - omega * tg) * amp;
          const px = travL + frac * twW;
          i === 0 ? ctx.moveTo(px, midY - y) : ctx.lineTo(px, midY - y);
        }
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      ctx.strokeStyle = WCOLORS.teal; ctx.lineWidth = 2.5;
      ctx.beginPath();
      for (let i = 0; i <= steps; i++) {
        const frac = i / steps;
        const x = frac * 2 * Math.PI * 3 / k;
        const y = Math.sin(k * x - omega * t) * amp;
        const px = travL + frac * twW;
        i === 0 ? ctx.moveTo(px, midY - y) : ctx.lineTo(px, midY - y);
      }
      ctx.stroke();

      // Direction arrow
      ctx.fillStyle = WCOLORS.amber; ctx.strokeStyle = WCOLORS.amber; ctx.lineWidth = 2;
      const arrowX = (travL + travR) / 2;
      ctx.beginPath(); ctx.moveTo(arrowX - 20, H - 25); ctx.lineTo(arrowX + 20, H - 25); ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(arrowX + 20, H - 25);
      ctx.lineTo(arrowX + 12, H - 30);
      ctx.lineTo(arrowX + 12, H - 20);
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = WCOLORS.amber; ctx.font = '10px system-ui'; ctx.textAlign = 'center';
      ctx.fillText('v = \u03C9/k', arrowX, H - 10);
    }

    // --- Standing wave ---
    if (showStand) {
      const swW = standR - standL;
      ctx.fillStyle = WCOLORS.text; ctx.font = '11px system-ui'; ctx.textAlign = 'center';
      ctx.fillText('Standing Wave: 2cos(kx)cos(\u03C9t)', (standL + standR) / 2, 20);

      ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(standL, midY); ctx.lineTo(standR, midY); ctx.stroke();

      // Envelope
      ctx.strokeStyle = WCOLORS.amber; ctx.lineWidth = 1; ctx.setLineDash([4, 3]); ctx.globalAlpha = 0.4;
      ctx.beginPath();
      for (let i = 0; i <= steps; i++) {
        const frac = i / steps;
        const x = frac * 2 * Math.PI * 3 / k;
        const y = 2 * Math.cos(k * x) * amp;
        const px = standL + frac * swW;
        i === 0 ? ctx.moveTo(px, midY - y) : ctx.lineTo(px, midY - y);
      }
      ctx.stroke();
      ctx.beginPath();
      for (let i = 0; i <= steps; i++) {
        const frac = i / steps;
        const x = frac * 2 * Math.PI * 3 / k;
        const y = -2 * Math.cos(k * x) * amp;
        const px = standL + frac * swW;
        i === 0 ? ctx.moveTo(px, midY - y) : ctx.lineTo(px, midY - y);
      }
      ctx.stroke();
      ctx.setLineDash([]); ctx.globalAlpha = 1;

      ctx.strokeStyle = WCOLORS.blue; ctx.lineWidth = 2.5;
      ctx.beginPath();
      for (let i = 0; i <= steps; i++) {
        const frac = i / steps;
        const x = frac * 2 * Math.PI * 3 / k;
        const y = 2 * Math.cos(k * x) * Math.cos(omega * t) * amp;
        const px = standL + frac * swW;
        i === 0 ? ctx.moveTo(px, midY - y) : ctx.lineTo(px, midY - y);
      }
      ctx.stroke();

      // Nodes
      const xMax = 2 * Math.PI * 3 / k;
      for (let n = 0; n < 20; n++) {
        const xNode = (Math.PI / 2 + n * Math.PI) / k;
        if (xNode > xMax) break;
        const px = standL + (xNode / xMax) * swW;
        ctx.fillStyle = WCOLORS.red;
        ctx.beginPath(); ctx.arc(px, midY, 4, 0, Math.PI * 2); ctx.fill();
      }

      ctx.fillStyle = WCOLORS.red; ctx.font = '11px system-ui'; ctx.textAlign = 'left';
      ctx.fillText('\u25CF nodes', standL + 5, H - 10);
    }

    // Divider
    if (viewMode === 0) {
      ctx.strokeStyle = WCOLORS.textDim; ctx.lineWidth = 1; ctx.setLineDash([4, 4]);
      ctx.beginPath(); ctx.moveTo(W / 2, 30); ctx.lineTo(W / 2, H - 5); ctx.stroke();
      ctx.setLineDash([]);
    }

    requestAnimationFrame(tick);
  }

  kSlider?.addEventListener('input', () => {});
  tick();
}

// =========================================================================
// CHAPTER 6: String Transverse Wave
// =========================================================================
function initStringTransverseWave() {
  const canvas = document.getElementById('scene-string-transverse-wave');
  if (!canvas) return;
  const setup = wSetupCanvas(canvas);
  if (!setup) return;
  const { ctx, W, H } = setup;

  let t = 0;

  const freqSlider = document.getElementById('stw-freq');
  const ampSlider = document.getElementById('stw-amp');
  const speedSlider = document.getElementById('stw-speed');

  // Speaker position (left-center)
  const srcX = 45;
  const srcY = H / 2;

  // Build a grid of air molecule equilibrium positions
  const spacingX = 8;
  const spacingY = 8;
  const particles = [];
  for (let y = 20; y < H - 15; y += spacingY) {
    for (let x = 70; x < W - 10; x += spacingX) {
      particles.push({ eqX: x, eqY: y });
    }
  }

  function tick() {
    if (!canvas.isConnected) return;
    const freq = parseFloat(freqSlider?.value || 1.2);
    const A = parseFloat(ampSlider?.value || 0.8);
    const speed = parseFloat(speedSlider?.value || 0.015);
    document.getElementById('stw-freq-val')?.replaceChildren(document.createTextNode(freq.toFixed(1)));
    document.getElementById('stw-amp-val')?.replaceChildren(document.createTextNode(A.toFixed(1)));
    document.getElementById('stw-speed-val')?.replaceChildren(document.createTextNode((speed / 0.03).toFixed(2) + 'x'));

    t += speed;
    wClear(ctx, W, H);

    const k = freq * 0.06;
    const omega = freq * 2.0;
    const maxDisp = 5 * A;
    const waveSpeed = omega / k;
    const wavefront = waveSpeed * t;

    // Draw speaker body
    ctx.fillStyle = '#4a6670';
    ctx.fillRect(10, srcY - 30, 28, 60);

    // Speaker cone
    ctx.fillStyle = WCOLORS.amber;
    const coneDisp = 3 * A * Math.sin(omega * t);
    ctx.beginPath();
    ctx.moveTo(38, srcY - 25);
    ctx.lineTo(srcX + coneDisp, srcY - 15);
    ctx.lineTo(srcX + coneDisp, srcY + 15);
    ctx.lineTo(38, srcY + 25);
    ctx.closePath();
    ctx.fill();

    // Draw particles
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      const dx = p.eqX - srcX;
      const dy = p.eqY - srcY;
      const r = Math.sqrt(dx * dx + dy * dy);
      if (r < 5) continue;

      // Unit vector from source
      const ux = dx / r;
      const uy = dy / r;

      let disp = 0;
      let normDens = 0;

      if (r < wavefront) {
        // Amplitude falls off as 1/sqrt(r) in 2D
        const envelope = Math.min(1, (wavefront - r) / (2 * Math.PI / k * 0.8));
        const falloff = 1 / Math.sqrt(1 + r * 0.01);
        disp = maxDisp * A * falloff * envelope * Math.sin(k * r - omega * t);
        normDens = falloff * envelope * Math.cos(k * r - omega * t);
      }

      // Displace radially
      const px = p.eqX + ux * disp;
      const py = p.eqY + uy * disp;

      // Color: brighter in compression, dimmer in rarefaction
      const brightness = 0.35 + 0.5 * (1 + normDens) / 2;
      const radius = 1.8 + 1.0 * (1 + normDens) / 2;

      const cr = Math.round(100 * brightness);
      const cg = Math.round(190 * brightness);
      const cb = Math.round(210 * brightness);

      ctx.fillStyle = `rgba(${cr}, ${cg}, ${cb}, ${brightness})`;
      ctx.beginPath();
      ctx.arc(px, py, radius, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw faint circular wavefront indicators
    const wl = 2 * Math.PI / k;
    ctx.strokeStyle = 'rgba(255, 180, 50, 0.15)';
    ctx.lineWidth = 1;
    for (let n = 0; n < 30; n++) {
      const rr = (omega * t / k - n * wl);
      if (rr < 10 || rr > W) continue;
      ctx.beginPath();
      ctx.arc(srcX, srcY, rr, -Math.PI * 0.45, Math.PI * 0.45);
      ctx.stroke();
    }

    // Title
    ctx.fillStyle = WCOLORS.text; ctx.font = '12px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('Spherical Wave from a Point Source', W / 2, 14);

    // Labels
    ctx.font = '10px system-ui'; ctx.textAlign = 'left';
    ctx.fillStyle = WCOLORS.textDim;
    ctx.fillText('Amplitude ~ 1/\u221Ar', 10, H - 10);
    ctx.textAlign = 'right';
    ctx.fillText('Compression (bright)  \u2022  Rarefaction (dim)', W - 10, H - 10);

    requestAnimationFrame(tick);
  }

  tick();
}

// =========================================================================
// CHAPTER 6: Sound Wave (Longitudinal)
// =========================================================================
function initSoundWaveLongitudinal() {
  const canvas = document.getElementById('scene-sound-wave-longitudinal');
  if (!canvas) return;
  const setup = wSetupCanvas(canvas);
  if (!setup) return;
  const { ctx, W, H } = setup;

  const wlSlider = document.getElementById('swl-wl');
  const freqSlider = document.getElementById('swl-freq');

  let t = 0;
  let paused = false;
  const pauseBtn = document.getElementById('swl-pause');
  pauseBtn?.addEventListener('click', () => {
    paused = !paused;
    pauseBtn.textContent = paused ? 'Play' : 'Pause';
  });

  const ampDisp = 7; // max radial displacement in px

  // Pre-build dot positions: concentric semicircular arcs of dots
  // Each arc is at a fixed equilibrium radius; dots are spaced along the arc
  const numArcs = 40;       // number of concentric arcs
  const arcSpacing = 12;    // px between arcs (equilibrium)
  const dotAngularGap = 12; // px gap between dots along each arc
  const angleSpan = 0.9;    // half-angle in radians (~52°)

  const dots = []; // { eqR, angle } — equilibrium radius and angle
  for (let i = 0; i < numArcs; i++) {
    const eqR = 15 + i * arcSpacing;
    // Number of dots on this arc: arc length / gap
    const arcLen = 2 * angleSpan * eqR;
    const nDots = Math.max(3, Math.round(arcLen / dotAngularGap));
    for (let j = 0; j < nDots; j++) {
      const angle = -angleSpan + (2 * angleSpan) * (j + 0.5) / nDots;
      dots.push({ eqR, angle });
    }
  }

  function tick() {
    if (!canvas.isConnected) return;
    const wl = parseFloat(wlSlider?.value || 100);  // wavelength in px
    const freq = parseFloat(freqSlider?.value || 1.0);
    const phaseSpeed = wl * freq;  // v = λf, derived
    document.getElementById('swl-wl-val')?.replaceChildren(document.createTextNode(wl));
    document.getElementById('swl-freq-val')?.replaceChildren(document.createTextNode(freq.toFixed(1)));

    if (!paused) t += 0.02;
    wClear(ctx, W, H);

    const airL = 30;
    const airR = W - 10;
    const airT = 28;
    const airB = H - 20;

    const k = 2 * Math.PI / wl;
    const omega = 2 * Math.PI * freq;

    // Title
    ctx.fillStyle = WCOLORS.text; ctx.font = '12px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('Radial Longitudinal Sound Wave', W / 2, 16);

    // Speaker positioned at left, vertically centered
    const spkW = 28;  // speaker cabinet width
    const spkH = 60;  // speaker cabinet height
    const spkX = 8;   // left edge of cabinet
    const srcCY = (airT + airB) / 2;
    const srcCX = spkX + spkW + 6; // source point = just past the cone

    // Pulsing cone displacement
    const coneDisp = 4 * Math.sin(omega * t);

    // Speaker cabinet
    ctx.fillStyle = '#3a3a3a';
    ctx.strokeStyle = '#555';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(spkX, srcCY - spkH / 2, spkW, spkH, 3);
    ctx.fill();
    ctx.stroke();

    // Speaker cone (trapezoidal, pulsing outward)
    const coneBase = spkX + spkW;
    const coneTip = coneBase + 10 + coneDisp;
    ctx.fillStyle = '#666';
    ctx.beginPath();
    ctx.moveTo(coneBase, srcCY - 20);
    ctx.lineTo(coneTip, srcCY - 6);
    ctx.lineTo(coneTip, srcCY + 6);
    ctx.lineTo(coneBase, srcCY + 20);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#888';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Speaker magnet circle (decorative, on the cabinet)
    ctx.fillStyle = '#2a2a2a';
    ctx.beginPath();
    ctx.arc(spkX + spkW / 2, srcCY, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#555';
    ctx.beginPath();
    ctx.arc(spkX + spkW / 2, srcCY, 10, 0, Math.PI * 2);
    ctx.stroke();

    // Inner dust cap
    ctx.fillStyle = '#444';
    ctx.beginPath();
    ctx.arc(spkX + spkW / 2, srcCY, 4, 0, Math.PI * 2);
    ctx.fill();

    // Speaker label
    ctx.fillStyle = WCOLORS.textDim; ctx.font = '9px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('Speaker', spkX + spkW / 2, srcCY + spkH / 2 + 12);

    // Wavefront radius
    const wavefrontR = phaseSpeed * t;

    // Clip to drawing region (right of speaker)
    ctx.save();
    ctx.beginPath();
    ctx.rect(srcCX - 2, airT, airR - srcCX + 4, airB - airT);
    ctx.clip();

    // Draw each dot displaced radially
    for (let i = 0; i < dots.length; i++) {
      const { eqR, angle } = dots[i];

      // Radial displacement: longitudinal oscillation along the radial direction
      let disp = 0;
      let normDens = 0;
      if (eqR < wavefrontR) {
        const distBehindFront = wavefrontR - eqR;
        const envelope = Math.min(1, distBehindFront / (wl * 0.8));
        disp = ampDisp * envelope * Math.sin(k * eqR - omega * t);
        // Density ~ -d(displacement)/dr = compression indicator
        normDens = envelope * Math.cos(k * eqR - omega * t);
      }

      const r = eqR + disp;
      const x = srcCX + r * Math.cos(angle);
      const y = srcCY + r * Math.sin(angle);

      // Brightness from density: compression = bright, rarefaction = dim
      const brightness = 0.3 + 0.6 * (1 + normDens) / 2;
      const dotSize = 1.8 + 1.0 * (1 + normDens) / 2;

      const cr = Math.round(90 * brightness);
      const cg = Math.round(200 * brightness);
      const cb = Math.round(220 * brightness);

      ctx.fillStyle = `rgba(${cr}, ${cg}, ${cb}, ${0.5 + 0.5 * brightness})`;
      ctx.beginPath();
      ctx.arc(x, y, dotSize, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();

    // Legend
    ctx.font = '10px system-ui'; ctx.textAlign = 'right';
    ctx.fillStyle = WCOLORS.textDim;
    ctx.fillText('Bright = compression   Dim = rarefaction', airR, H - 4);

    requestAnimationFrame(tick);
  }

  wlSlider?.addEventListener('input', () => {});
  freqSlider?.addEventListener('input', () => {});
  tick();
}

// =========================================================================
// CHAPTER 6: Boundary Conditions Demo
// =========================================================================
function initBoundaryConditionsDemo() {
  const canvas = document.getElementById('scene-boundary-conditions-demo');
  if (!canvas) return;
  const setup = wSetupCanvas(canvas);
  if (!setup) return;
  const { ctx, W, H } = setup;

  let modeSlider = document.getElementById('bcd-mode');
  if (!modeSlider) {
    const parent = canvas.parentElement;
    if (parent) {
      const controls = document.createElement('div');
      controls.className = 'scene-controls';
      controls.innerHTML =
        '<button id="bcd-ff" class="scene-btn active" style="font-size:11px;padding:2px 8px;cursor:pointer;">Both Fixed</button>' +
        '<button id="bcd-fo" class="scene-btn" style="font-size:11px;padding:2px 8px;cursor:pointer;margin-left:4px;">Fixed-Free</button>' +
        '<button id="bcd-oo" class="scene-btn" style="font-size:11px;padding:2px 8px;cursor:pointer;margin-left:4px;">Both Free</button>' +
        '<label style="margin-left:10px;">Mode n: <input type="range" id="bcd-mode" min="1" max="6" step="1" value="1"><span class="scene-val" id="bcd-mode-val">1</span></label>';
      parent.appendChild(controls);
      modeSlider = document.getElementById('bcd-mode');
    }
  }

  let bcType = 0;
  const bcLabels = ['Both Fixed', 'Fixed-Free', 'Both Free'];
  document.getElementById('bcd-ff')?.addEventListener('click', () => { bcType = 0; updateBtns(); });
  document.getElementById('bcd-fo')?.addEventListener('click', () => { bcType = 1; updateBtns(); });
  document.getElementById('bcd-oo')?.addEventListener('click', () => { bcType = 2; updateBtns(); });

  function updateBtns() {
    ['bcd-ff', 'bcd-fo', 'bcd-oo'].forEach((id, i) => {
      const el = document.getElementById(id);
      if (el) el.style.fontWeight = (i === bcType) ? 'bold' : 'normal';
    });
  }

  let t = 0;

  function modeShape(xFrac, n, bc) {
    if (bc === 0) return Math.sin(n * Math.PI * xFrac);
    if (bc === 1) return Math.sin((n - 0.5) * Math.PI * xFrac);
    return Math.cos(n * Math.PI * xFrac);
  }

  function modeFreqLabel(n, bc) {
    if (bc === 0) return 'f = ' + n + ' f\u2081';
    if (bc === 1) return 'f = ' + (2 * n - 1) + '/2 f\u2081';
    return 'f = ' + n + ' f\u2081';
  }

  function tick() {
    if (!canvas.isConnected) return;
    const n = parseInt(modeSlider?.value || 1);
    document.getElementById('bcd-mode-val')?.replaceChildren(document.createTextNode(n));

    t += 0.04;
    wClear(ctx, W, H);

    const stringL = 60, stringR = W - 60;
    const stringW = stringR - stringL;
    const midY = H / 2;
    const maxAmp = 60;

    let omegaN;
    if (bcType === 0) omegaN = n;
    else if (bcType === 1) omegaN = (n - 0.5);
    else omegaN = n;

    const cosT = Math.cos(omegaN * t);

    // Boundary indicators
    if (bcType === 0 || bcType === 1) {
      ctx.fillStyle = WCOLORS.axis;
      ctx.fillRect(stringL - 8, midY - 35, 7, 70);
      for (let i = 0; i < 4; i++) {
        ctx.strokeStyle = WCOLORS.textDim; ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(stringL - 6, midY - 25 + i * 16);
        ctx.lineTo(stringL - 12, midY - 20 + i * 16);
        ctx.stroke();
      }
    }
    if (bcType === 0) {
      ctx.fillStyle = WCOLORS.axis;
      ctx.fillRect(stringR + 1, midY - 35, 7, 70);
      for (let i = 0; i < 4; i++) {
        ctx.strokeStyle = WCOLORS.textDim; ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(stringR + 6, midY - 25 + i * 16);
        ctx.lineTo(stringR + 12, midY - 20 + i * 16);
        ctx.stroke();
      }
    }
    if (bcType === 1) {
      ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 2;
      const freeY = midY - modeShape(1.0, n, bcType) * cosT * maxAmp;
      ctx.beginPath(); ctx.moveTo(stringR + 2, midY - 50); ctx.lineTo(stringR + 2, midY + 50); ctx.stroke();
      ctx.strokeStyle = WCOLORS.teal; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(stringR + 2, freeY, 8, 0, Math.PI * 2); ctx.stroke();
    }
    if (bcType === 2) {
      const leftFreeY = midY - modeShape(0, n, bcType) * cosT * maxAmp;
      const rightFreeY = midY - modeShape(1, n, bcType) * cosT * maxAmp;
      ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(stringL - 2, midY - 50); ctx.lineTo(stringL - 2, midY + 50); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(stringR + 2, midY - 50); ctx.lineTo(stringR + 2, midY + 50); ctx.stroke();
      ctx.strokeStyle = WCOLORS.teal; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.arc(stringL - 2, leftFreeY, 8, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.arc(stringR + 2, rightFreeY, 8, 0, Math.PI * 2); ctx.stroke();
    }

    // Equilibrium line
    ctx.strokeStyle = WCOLORS.textDim; ctx.lineWidth = 0.5; ctx.setLineDash([3, 3]);
    ctx.beginPath(); ctx.moveTo(stringL, midY); ctx.lineTo(stringR, midY); ctx.stroke();
    ctx.setLineDash([]);

    // Mode shape envelope
    ctx.strokeStyle = WCOLORS.amber; ctx.lineWidth = 1; ctx.setLineDash([4, 3]); ctx.globalAlpha = 0.35;
    for (let sign = -1; sign <= 1; sign += 2) {
      ctx.beginPath();
      for (let i = 0; i <= 200; i++) {
        const frac = i / 200;
        const y = sign * modeShape(frac, n, bcType) * maxAmp;
        const px = stringL + frac * stringW;
        i === 0 ? ctx.moveTo(px, midY - y) : ctx.lineTo(px, midY - y);
      }
      ctx.stroke();
    }
    ctx.setLineDash([]); ctx.globalAlpha = 1;

    // Animated mode
    ctx.strokeStyle = WCOLORS.teal; ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let i = 0; i <= 300; i++) {
      const frac = i / 300;
      const y = modeShape(frac, n, bcType) * cosT * maxAmp;
      const px = stringL + frac * stringW;
      i === 0 ? ctx.moveTo(px, midY - y) : ctx.lineTo(px, midY - y);
    }
    ctx.stroke();

    // Mark nodes
    for (let i = 1; i <= 300; i++) {
      const frac1 = (i - 1) / 300;
      const frac2 = i / 300;
      const y1 = modeShape(frac1, n, bcType);
      const y2 = modeShape(frac2, n, bcType);
      if (y1 * y2 < 0) {
        const zerFrac = frac1 + (0 - y1) / (y2 - y1) * (frac2 - frac1);
        const px = stringL + zerFrac * stringW;
        ctx.fillStyle = WCOLORS.red;
        ctx.beginPath(); ctx.arc(px, midY, 4, 0, Math.PI * 2); ctx.fill();
      }
    }
    // Antinodes
    for (let i = 2; i <= 298; i++) {
      const frac0 = (i - 1) / 300, frac1 = i / 300, frac2 = (i + 1) / 300;
      const y0 = Math.abs(modeShape(frac0, n, bcType));
      const y1 = Math.abs(modeShape(frac1, n, bcType));
      const y2 = Math.abs(modeShape(frac2, n, bcType));
      if (y1 > y0 && y1 > y2 && y1 > 0.5) {
        const px = stringL + frac1 * stringW;
        ctx.strokeStyle = WCOLORS.amber; ctx.lineWidth = 1;
        ctx.setLineDash([2, 2]);
        ctx.beginPath(); ctx.moveTo(px, midY - maxAmp * 1.1); ctx.lineTo(px, midY + maxAmp * 1.1); ctx.stroke();
        ctx.setLineDash([]);
      }
    }

    // Labels
    ctx.fillStyle = WCOLORS.text; ctx.font = '12px system-ui'; ctx.textAlign = 'center';
    ctx.fillText(bcLabels[bcType] + '  |  Mode n = ' + n, W / 2, 18);

    // Prominent mode number label
    ctx.fillStyle = WCOLORS.amber; ctx.font = 'bold 16px system-ui'; ctx.textAlign = 'right';
    ctx.fillText('n = ' + n, W - 20, 20);

    ctx.fillStyle = WCOLORS.teal; ctx.font = '11px system-ui';
    ctx.fillText(modeFreqLabel(n, bcType), W / 2, H - 8);

    ctx.font = '11px system-ui'; ctx.textAlign = 'left';
    ctx.fillStyle = WCOLORS.red; ctx.fillText('\u25CF node', stringL, H - 8);
    ctx.fillStyle = WCOLORS.amber; ctx.fillText('\u2502 antinode', stringL + 55, H - 8);

    requestAnimationFrame(tick);
  }

  modeSlider?.addEventListener('input', () => {});
  tick();
}

// =========================================================================
// CHAPTER 6: Standing Wave Modes (Three rows)
// =========================================================================
function initStandingWaveModes() {
  const canvas = document.getElementById('scene-standing-wave-modes');
  if (!canvas) return;
  const setup = wSetupCanvas(canvas);
  if (!setup) return;
  const { ctx, W, H } = setup;

  let t = 0;

  const configs = [
    { label: 'Both Fixed', bc: 'ff' },
    { label: 'Fixed-Free', bc: 'fo' },
    { label: 'Both Free', bc: 'oo' }
  ];
  const numModes = 4;

  function modeShape(xFrac, n, bc) {
    if (bc === 'ff') return Math.sin(n * Math.PI * xFrac);
    if (bc === 'fo') return Math.sin((n - 0.5) * Math.PI * xFrac);
    return Math.cos(n * Math.PI * xFrac);
  }

  function freqLabel(n, bc) {
    if (bc === 'ff') return n + 'f\u2081';
    if (bc === 'fo') return (2 * n - 1) + '/2 f\u2081';
    return n + 'f\u2081';
  }

  function tick() {
    if (!canvas.isConnected) return;
    t += 0.03;
    wClear(ctx, W, H);

    const rowH = (H - 20) / 3;
    const modeW = (W - 100) / numModes;
    const labelW = 70;

    for (let r = 0; r < 3; r++) {
      const cfg = configs[r];
      const rowTop = 10 + r * rowH;
      const midY = rowTop + rowH / 2;
      const amp = rowH * 0.32;

      ctx.fillStyle = WCOLORS.text; ctx.font = '10px system-ui'; ctx.textAlign = 'right';
      ctx.fillText(cfg.label, labelW - 5, midY + 4);

      if (r > 0) {
        ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(0, rowTop); ctx.lineTo(W, rowTop); ctx.stroke();
      }

      for (let m = 0; m < numModes; m++) {
        const n = m + 1;
        const modeL = labelW + m * modeW + 10;
        const modeR = modeL + modeW - 20;
        const mW = modeR - modeL;

        let omegaN;
        if (cfg.bc === 'ff') omegaN = n;
        else if (cfg.bc === 'fo') omegaN = (n - 0.5);
        else omegaN = n;

        const cosT = Math.cos(omegaN * t);

        // Equilibrium
        ctx.strokeStyle = WCOLORS.grid; ctx.lineWidth = 0.5;
        ctx.beginPath(); ctx.moveTo(modeL, midY); ctx.lineTo(modeR, midY); ctx.stroke();

        // Animated wave
        ctx.strokeStyle = WCOLORS.teal; ctx.lineWidth = 1.5;
        ctx.beginPath();
        for (let i = 0; i <= 100; i++) {
          const frac = i / 100;
          const y = modeShape(frac, n, cfg.bc) * cosT * amp;
          const px = modeL + frac * mW;
          i === 0 ? ctx.moveTo(px, midY - y) : ctx.lineTo(px, midY - y);
        }
        ctx.stroke();

        // Envelope
        ctx.strokeStyle = WCOLORS.amber; ctx.lineWidth = 0.7; ctx.globalAlpha = 0.3;
        for (let sign = -1; sign <= 1; sign += 2) {
          ctx.beginPath();
          for (let i = 0; i <= 100; i++) {
            const frac = i / 100;
            const y = sign * modeShape(frac, n, cfg.bc) * amp;
            const px = modeL + frac * mW;
            i === 0 ? ctx.moveTo(px, midY - y) : ctx.lineTo(px, midY - y);
          }
          ctx.stroke();
        }
        ctx.globalAlpha = 1;

        // Boundary markers
        if (cfg.bc === 'ff' || cfg.bc === 'fo') {
          ctx.fillStyle = WCOLORS.axis;
          ctx.fillRect(modeL - 3, midY - 8, 3, 16);
        }
        if (cfg.bc === 'ff') {
          ctx.fillRect(modeR, midY - 8, 3, 16);
        }
        if (cfg.bc === 'fo') {
          ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.arc(modeR, midY - modeShape(1, n, cfg.bc) * cosT * amp, 3, 0, Math.PI * 2); ctx.stroke();
        }
        if (cfg.bc === 'oo') {
          ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.arc(modeL, midY - modeShape(0, n, cfg.bc) * cosT * amp, 3, 0, Math.PI * 2); ctx.stroke();
          ctx.beginPath(); ctx.arc(modeR, midY - modeShape(1, n, cfg.bc) * cosT * amp, 3, 0, Math.PI * 2); ctx.stroke();
        }

        // Mode number label
        ctx.fillStyle = WCOLORS.text; ctx.font = 'bold 10px system-ui'; ctx.textAlign = 'center';
        ctx.fillText('n=' + n, modeL + mW / 2, midY - amp - 6);

        // Frequency label
        ctx.fillStyle = WCOLORS.textDim; ctx.font = '11px system-ui'; ctx.textAlign = 'center';
        ctx.fillText(freqLabel(n, cfg.bc), modeL + mW / 2, midY + amp + 14);
      }
    }

    requestAnimationFrame(tick);
  }

  tick();
}

// =========================================================================
// CHAPTER 6: Helmholtz Resonator
// =========================================================================
function initHelmholtzResonator() {
  const canvas = document.getElementById('scene-helmholtz-resonator');
  if (!canvas) return;
  const setup = wSetupCanvas(canvas);
  if (!setup) return;
  const { ctx, W, H } = setup;

  let aSlider = document.getElementById('hr-a');
  if (!aSlider) {
    const parent = canvas.parentElement;
    if (parent) {
      const controls = document.createElement('div');
      controls.className = 'scene-controls';
      controls.innerHTML =
        '<label>Neck area A: <input type="range" id="hr-a" min="1" max="10" step="0.5" value="4"><span class="scene-val" id="hr-a-val">4.0</span></label>' +
        '<label>Volume V: <input type="range" id="hr-v" min="20" max="200" step="5" value="80"><span class="scene-val" id="hr-v-val">80</span></label>' +
        '<label>Neck length L: <input type="range" id="hr-l" min="1" max="15" step="0.5" value="5"><span class="scene-val" id="hr-l-val">5.0</span></label>';
      parent.appendChild(controls);
      aSlider = document.getElementById('hr-a');
    }
  }
  const vSlider = document.getElementById('hr-v');
  const lSlider = document.getElementById('hr-l');

  let t = 0;

  // Seeded random for stable molecule positions
  function seededRandom(seed) {
    let s = seed;
    return function() {
      s = (s * 16807 + 0) % 2147483647;
      return s / 2147483647;
    };
  }

  function tick() {
    if (!canvas.isConnected) return;
    const A = parseFloat(aSlider?.value || 4);
    const V = parseFloat(vSlider?.value || 80);
    const L = parseFloat(lSlider?.value || 5);
    document.getElementById('hr-a-val')?.replaceChildren(document.createTextNode(A.toFixed(1)));
    document.getElementById('hr-v-val')?.replaceChildren(document.createTextNode(V.toFixed(0)));
    document.getElementById('hr-l-val')?.replaceChildren(document.createTextNode(L.toFixed(1)));

    const cs = 343;
    const fRes = (cs / (2 * Math.PI)) * Math.sqrt(A / (V * L));

    t += 0.04;
    wClear(ctx, W, H);

    const bottleX = W * 0.3;
    const bottleCenterY = H * 0.55;

    const neckW = 10 + A * 3;
    const neckH = 15 + L * 4;
    const bodyW = 100 * Math.sqrt(V / 80);
    const bodyH = bodyW * 0.8;

    const neckTop = bottleCenterY - bodyH / 2 - neckH;
    const neckBot = bottleCenterY - bodyH / 2;
    const bodyBot = bottleCenterY + bodyH / 2;

    const omega = fRes * 0.01;
    const neckDisp = 8 * Math.sin(omega * t);

    // Bottle shape
    ctx.fillStyle = 'rgba(15, 118, 110, 0.12)';
    ctx.strokeStyle = WCOLORS.teal; ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(bottleX - neckW / 2, neckTop);
    ctx.lineTo(bottleX - neckW / 2, neckBot);
    ctx.quadraticCurveTo(bottleX - bodyW / 2 - 10, neckBot, bottleX - bodyW / 2, neckBot + bodyH * 0.3);
    ctx.lineTo(bottleX - bodyW / 2, bodyBot - 10);
    ctx.quadraticCurveTo(bottleX - bodyW / 2, bodyBot, bottleX - bodyW / 4, bodyBot);
    ctx.lineTo(bottleX + bodyW / 4, bodyBot);
    ctx.quadraticCurveTo(bottleX + bodyW / 2, bodyBot, bottleX + bodyW / 2, bodyBot - 10);
    ctx.lineTo(bottleX + bodyW / 2, neckBot + bodyH * 0.3);
    ctx.quadraticCurveTo(bottleX + bodyW / 2 + 10, neckBot, bottleX + neckW / 2, neckBot);
    ctx.lineTo(bottleX + neckW / 2, neckTop);
    ctx.fill();
    ctx.stroke();

    // Air molecules in neck
    const rng = seededRandom(42);
    const numNeckMols = Math.max(3, Math.round(A * 1.5));
    ctx.fillStyle = WCOLORS.blue;
    for (let i = 0; i < numNeckMols; i++) {
      const frac = (i + 0.5) / numNeckMols;
      const mx = bottleX + (rng() * 0.6 - 0.3) * neckW * 0.5;
      const my = neckTop + frac * neckH + neckDisp;
      ctx.globalAlpha = 0.7;
      ctx.beginPath(); ctx.arc(mx, my, 2.5, 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalAlpha = 1;

    // Body air compression indicator
    const bodyComp = Math.sin(omega * t);
    const bodyAlpha = 0.15 + 0.15 * bodyComp;
    ctx.fillStyle = `rgba(15, 118, 110, ${bodyAlpha})`;
    ctx.fillRect(bottleX - bodyW / 2 + 5, neckBot + 5, bodyW - 10, bodyH - 10);

    // Spring analogy (right half)
    const springX = W * 0.7;
    const springTop2 = neckTop + 10;
    const springBot2 = bodyBot - 10;
    const springMid = (springTop2 + springBot2) / 2;
    const massBlockY = springMid - 30 + neckDisp * 2;

    // Spring coils
    ctx.strokeStyle = WCOLORS.amber; ctx.lineWidth = 1.5;
    const sCoils = 6;
    const sW2 = 15;
    ctx.beginPath();
    ctx.moveTo(springX, springBot2);
    const totalSpringLen = springBot2 - massBlockY - 15;
    const sSegLen = totalSpringLen / (sCoils * 2 + 2);
    let sy = springBot2 - sSegLen;
    ctx.lineTo(springX, sy);
    for (let i = 0; i < sCoils; i++) {
      const midPt = sy - sSegLen;
      ctx.lineTo(springX + sW2 * ((i % 2 === 0) ? 1 : -1), midPt);
      sy = midPt - sSegLen;
      ctx.lineTo(springX, sy);
    }
    ctx.lineTo(springX, massBlockY + 15);
    ctx.stroke();

    // Mass block
    ctx.fillStyle = WCOLORS.blue;
    ctx.fillRect(springX - 18, massBlockY - 12, 36, 24);
    ctx.fillStyle = '#fff'; ctx.font = '10px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('m', springX, massBlockY + 4);

    // Wall
    ctx.fillStyle = WCOLORS.axis;
    ctx.fillRect(springX - 20, springBot2, 40, 4);

    // Labels
    ctx.fillStyle = WCOLORS.text; ctx.font = 'bold 11px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('Neck air → mass m', springX, massBlockY - 22);
    ctx.fillText('Body air → spring k', springX, springBot2 + 20);

    ctx.fillStyle = WCOLORS.textDim; ctx.font = '11px system-ui'; ctx.textAlign = 'left';
    ctx.fillText('A (neck area)', bottleX + neckW / 2 + 5, neckTop + neckH / 2);
    ctx.fillText('L (neck length)', bottleX + neckW / 2 + 5, neckTop + neckH / 2 + 12);
    ctx.fillText('V (body volume)', bottleX + bodyW / 2 + 5, bottleCenterY);

    ctx.fillStyle = WCOLORS.text; ctx.font = '12px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('Helmholtz Resonator', W / 2, 16);

    // Resonant frequency formula (prominent)
    ctx.fillStyle = WCOLORS.teal; ctx.font = 'bold 13px system-ui';
    ctx.fillText('f\u2080 = (c\u209B / 2\u03C0) \u00B7 \u221A(A / VL)', W / 2, H - 22);
    ctx.fillStyle = WCOLORS.amber; ctx.font = 'bold 14px system-ui';
    ctx.fillText('= ' + fRes.toFixed(1) + ' Hz', W / 2, H - 6);

    requestAnimationFrame(tick);
  }

  aSlider?.addEventListener('input', () => {});
  vSlider?.addEventListener('input', () => {});
  lSlider?.addEventListener('input', () => {});
  tick();
}

// =========================================================================
// CHAPTER 7: Beats Demo
// =========================================================================
function initBeatsDemo() {
  const canvas = document.getElementById('scene-beats-demo');
  if (!canvas) return;
  const setup = wSetupCanvas(canvas);
  if (!setup) return;
  const { ctx, W, H } = setup;

  let dfSlider = document.getElementById('bd-df');
  if (!dfSlider) {
    const parent = canvas.parentElement;
    if (parent) {
      const controls = document.createElement('div');
      controls.className = 'scene-controls';
      controls.innerHTML =
        '<label>\u0394f (Hz): <input type="range" id="bd-df" min="0" max="30" step="0.5" value="3"><span class="scene-val" id="bd-df-val">3.0</span></label>';
      parent.appendChild(controls);
      dfSlider = document.getElementById('bd-df');
    }
  }

  // Play button (append to existing controls)
  {
    const controls = dfSlider?.closest('.scene-controls') || canvas.parentElement;
    if (controls && !document.getElementById('bd-play')) {
      wMakePlayBtn(controls, 'bd-play', '\u25B6 Listen', () => {
        const df = parseFloat(dfSlider?.value || 3);
        wPlayTones('bd-play', [
          { freq: 440, gain: 0.5 },
          { freq: 440 + df, gain: 0.5 }
        ], 0);
      });
    }
  }

  let t = 0;

  function tick() {
    if (!canvas.isConnected) return;
    const df = parseFloat(dfSlider?.value || 3);
    document.getElementById('bd-df-val')?.replaceChildren(document.createTextNode(df.toFixed(1)));
    // Update live audio if playing
    if (wIsPlaying('bd-play')) {
      wUpdateTones('bd-play', [
        { freq: 440, gain: 0.5 },
        { freq: 440 + df, gain: 0.5 }
      ]);
    }

    t += 0.015;
    wClear(ctx, W, H);

    const f1 = 40;
    const f2 = f1 + df;
    const omega1 = 2 * Math.PI * f1 * 0.01;
    const omega2 = 2 * Math.PI * f2 * 0.01;

    const plotL = 30, plotR = W - 20;
    const plotW = plotR - plotL;
    const topY = H * 0.25;
    const botY = H * 0.68;
    const ampSmall = 25;
    const ampBig = 45;
    const xRange = 12;

    ctx.fillStyle = WCOLORS.text; ctx.font = '12px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('Beat Pattern: f\u2081 = ' + f1 + ' Hz, f\u2082 = ' + f2.toFixed(1) + ' Hz', W / 2, 14);

    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 0.5;
    ctx.beginPath(); ctx.moveTo(plotL, topY); ctx.lineTo(plotR, topY); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(plotL, botY); ctx.lineTo(plotR, botY); ctx.stroke();

    const steps = 500;
    // Wave 1
    ctx.strokeStyle = WCOLORS.teal; ctx.lineWidth = 1; ctx.globalAlpha = 0.35;
    ctx.beginPath();
    for (let i = 0; i <= steps; i++) {
      const tLocal = t + (i / steps) * xRange;
      const y = Math.sin(omega1 * tLocal) * ampSmall;
      const px = plotL + (i / steps) * plotW;
      i === 0 ? ctx.moveTo(px, topY - y) : ctx.lineTo(px, topY - y);
    }
    ctx.stroke();
    // Wave 2
    ctx.strokeStyle = WCOLORS.amber; ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 0; i <= steps; i++) {
      const tLocal = t + (i / steps) * xRange;
      const y = Math.sin(omega2 * tLocal) * ampSmall;
      const px = plotL + (i / steps) * plotW;
      i === 0 ? ctx.moveTo(px, topY - y) : ctx.lineTo(px, topY - y);
    }
    ctx.stroke();
    ctx.globalAlpha = 1;

    ctx.font = '11px system-ui'; ctx.textAlign = 'left';
    ctx.fillStyle = WCOLORS.teal; ctx.globalAlpha = 0.6; ctx.fillText('f\u2081', plotL + 3, topY - ampSmall - 3);
    ctx.fillStyle = WCOLORS.amber; ctx.fillText('f\u2082', plotL + 20, topY - ampSmall - 3);
    ctx.globalAlpha = 1;

    // Sum
    ctx.strokeStyle = WCOLORS.teal; ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let i = 0; i <= steps; i++) {
      const tLocal = t + (i / steps) * xRange;
      const y = (Math.sin(omega1 * tLocal) + Math.sin(omega2 * tLocal)) * ampBig / 2;
      const px = plotL + (i / steps) * plotW;
      i === 0 ? ctx.moveTo(px, botY - y) : ctx.lineTo(px, botY - y);
    }
    ctx.stroke();

    // Beat envelope
    if (df > 0.1) {
      const omegaBeat = Math.PI * df * 0.01;
      ctx.strokeStyle = WCOLORS.red; ctx.lineWidth = 1.5; ctx.setLineDash([5, 3]);
      ctx.beginPath();
      for (let i = 0; i <= steps; i++) {
        const tLocal = t + (i / steps) * xRange;
        const env = Math.cos(omegaBeat * tLocal) * ampBig;
        const px = plotL + (i / steps) * plotW;
        i === 0 ? ctx.moveTo(px, botY - env) : ctx.lineTo(px, botY - env);
      }
      ctx.stroke();
      ctx.beginPath();
      for (let i = 0; i <= steps; i++) {
        const tLocal = t + (i / steps) * xRange;
        const env = -Math.cos(omegaBeat * tLocal) * ampBig;
        const px = plotL + (i / steps) * plotW;
        i === 0 ? ctx.moveTo(px, botY - env) : ctx.lineTo(px, botY - env);
      }
      ctx.stroke();
      ctx.setLineDash([]);
    }

    ctx.fillStyle = WCOLORS.text; ctx.font = '10px system-ui'; ctx.textAlign = 'left';
    ctx.fillText('Sum: beat pattern', plotL + 3, botY - ampBig - 8);

    ctx.fillStyle = WCOLORS.red; ctx.font = '11px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('Beat frequency = |f\u2081 \u2212 f\u2082| = ' + df.toFixed(1) + ' Hz', W / 2, H - 8);

    if (df > 0.1) {
      ctx.fillStyle = WCOLORS.textDim; ctx.font = '11px system-ui'; ctx.textAlign = 'right';
      ctx.fillText('envelope', plotR - 5, botY - ampBig - 3);
    }

    requestAnimationFrame(tick);
  }

  dfSlider?.addEventListener('input', () => {});
  tick();
}

// =========================================================================
// CHAPTER 7: Consonance & Dissonance
// =========================================================================
function initConsonanceDissonance() {
  const canvas = document.getElementById('scene-consonance-dissonance');
  if (!canvas) return;
  const setup = wSetupCanvas(canvas);
  if (!setup) return;
  const { ctx, W, H } = setup;

  let ratioSlider = document.getElementById('cd-ratio');
  if (!ratioSlider) {
    const parent = canvas.parentElement;
    if (parent) {
      const controls = document.createElement('div');
      controls.className = 'scene-controls';
      controls.innerHTML =
        '<label>Frequency ratio: <input type="range" id="cd-ratio" min="1.0" max="2.0" step="0.01" value="1.5"><span class="scene-val" id="cd-ratio-val">1.50</span></label>';
      parent.appendChild(controls);
      ratioSlider = document.getElementById('cd-ratio');
    }
  }

  // Play button (append to existing controls)
  {
    const controls = ratioSlider?.closest('.scene-controls') || canvas.parentElement;
    if (controls && !document.getElementById('cd-play')) {
      wMakePlayBtn(controls, 'cd-play', '\u25B6 Listen', () => {
        const ratio = parseFloat(ratioSlider?.value || 1.5);
        const f1 = 262;
        const harmonics = [];
        for (let n = 1; n <= 6; n++) harmonics.push({ n, gain: 1 / (n * 0.7) });
        wPlayTones('cd-play', [
          { freq: f1, gain: 0.4, harmonics },
          { freq: f1 * ratio, gain: 0.4, harmonics }
        ], 0);
      });
    }
  }

  let t = 0;

  function tick() {
    if (!canvas.isConnected) return;
    const ratio = parseFloat(ratioSlider?.value || 1.5);
    document.getElementById('cd-ratio-val')?.replaceChildren(document.createTextNode(ratio.toFixed(2)));
    // Update live audio if playing
    if (wIsPlaying('cd-play')) {
      const f1 = 262;
      const harmonics = [];
      for (let n = 1; n <= 6; n++) harmonics.push({ n, gain: 1 / (n * 0.7) });
      wUpdateTones('cd-play', [
        { freq: f1, gain: 0.4, harmonics },
        { freq: f1 * ratio, gain: 0.4, harmonics }
      ]);
    }

    t += 0.02;
    wClear(ctx, W, H);

    const f1 = 100;
    const f2 = f1 * ratio;
    const numHarmonics = 8;
    const tolerance = 0.04;

    const specL = 50, specR = W - 20;
    const specW = specR - specL;
    const specH = H * 0.4;
    const specTop = 30;
    const specBot = specTop + specH;

    const fMax = f1 * (numHarmonics + 1);

    // Axis
    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(specL, specBot); ctx.lineTo(specR, specBot); ctx.stroke();

    // Harmonics of f1
    for (let n = 1; n <= numHarmonics; n++) {
      const f = f1 * n;
      if (f > fMax) break;
      const px = specL + (f / fMax) * specW;

      let matched = false;
      let nearBeat = false;
      for (let m = 1; m <= numHarmonics; m++) {
        const f2h = f2 * m;
        const diff = Math.abs(f - f2h) / f;
        if (diff < 0.005) { matched = true; break; }
        if (diff < tolerance && diff >= 0.005) { nearBeat = true; }
      }

      ctx.strokeStyle = matched ? '#16a34a' : (nearBeat ? WCOLORS.red : WCOLORS.teal);
      ctx.lineWidth = matched ? 3 : 2;
      ctx.globalAlpha = matched ? 1 : 0.7;
      const barTopN = specBot - (specH - 10) / n;
      ctx.beginPath(); ctx.moveTo(px, specBot); ctx.lineTo(px, barTopN); ctx.stroke();
      ctx.globalAlpha = 1;

      ctx.fillStyle = WCOLORS.teal; ctx.font = '10px system-ui'; ctx.textAlign = 'center';
      ctx.fillText(n + 'f\u2081', px, specBot + 10);
    }

    // Harmonics of f2
    for (let m = 1; m <= numHarmonics; m++) {
      const f = f2 * m;
      if (f > fMax) break;
      const px = specL + (f / fMax) * specW;

      let matched = false;
      let nearBeat = false;
      for (let n = 1; n <= numHarmonics; n++) {
        const f1h = f1 * n;
        const diff = Math.abs(f - f1h) / f;
        if (diff < 0.005) { matched = true; break; }
        if (diff < tolerance && diff >= 0.005) { nearBeat = true; }
      }

      const barTop2 = specBot - (specH - 10) / m;
      ctx.strokeStyle = matched ? '#16a34a' : (nearBeat ? WCOLORS.red : WCOLORS.amber);
      ctx.lineWidth = matched ? 3 : 1.5;
      ctx.globalAlpha = matched ? 1 : 0.6;
      ctx.setLineDash(matched ? [] : [3, 2]);
      ctx.beginPath(); ctx.moveTo(px, specBot); ctx.lineTo(px, barTop2); ctx.stroke();
      ctx.setLineDash([]);
      ctx.globalAlpha = 1;

      ctx.fillStyle = WCOLORS.amber; ctx.font = '10px system-ui'; ctx.textAlign = 'center';
      ctx.fillText(m + 'f\u2082', px, specTop + 6);
    }

    // Combined waveform
    const waveTop = specBot + 25;
    const waveMid = waveTop + (H - waveTop - 20) / 2;
    const waveAmp = (H - waveTop - 30) / 2 * 0.8;

    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 0.5;
    ctx.beginPath(); ctx.moveTo(specL, waveMid); ctx.lineTo(specR, waveMid); ctx.stroke();

    const omega1 = 2 * Math.PI * f1 * 0.003;
    const omega2 = 2 * Math.PI * f2 * 0.003;
    ctx.strokeStyle = WCOLORS.teal; ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i <= 400; i++) {
      const tLocal = t + (i / 400) * 8;
      const y = (Math.sin(omega1 * tLocal) + Math.sin(omega2 * tLocal)) / 2 * waveAmp;
      const px = specL + (i / 400) * specW;
      i === 0 ? ctx.moveTo(px, waveMid - y) : ctx.lineTo(px, waveMid - y);
    }
    ctx.stroke();

    // Title
    ctx.fillStyle = WCOLORS.text; ctx.font = '12px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('Harmonic Series: f\u2082/f\u2081 = ' + ratio.toFixed(2), W / 2, 16);

    // Identify interval
    const intervals = [
      { r: 1.0, name: 'Unison' }, { r: 1.125, name: 'Maj 2nd (9/8)' },
      { r: 1.2, name: 'Min 3rd (6/5)' }, { r: 1.25, name: 'Maj 3rd (5/4)' },
      { r: 1.333, name: 'Perfect 4th (4/3)' }, { r: 1.5, name: 'Perfect 5th (3/2)' },
      { r: 1.667, name: 'Maj 6th (5/3)' }, { r: 1.8, name: 'Min 7th (9/5)' },
      { r: 2.0, name: 'Octave' }
    ];
    let closestName = '';
    let closestDist = 1;
    for (const iv of intervals) {
      const d = Math.abs(ratio - iv.r);
      if (d < closestDist) { closestDist = d; closestName = iv.name; }
    }
    if (closestDist < 0.03) {
      ctx.fillStyle = WCOLORS.teal; ctx.font = '10px system-ui'; ctx.textAlign = 'right';
      ctx.fillText('\u2248 ' + closestName, W - 25, 16);
    }

    // Legend
    ctx.font = '9px system-ui'; ctx.textAlign = 'left';
    ctx.fillStyle = WCOLORS.teal; ctx.fillText('\u2502 f\u2081 harmonics', specL, specTop + 6);
    ctx.fillStyle = WCOLORS.amber; ctx.fillText('\u2502 f\u2082 harmonics', specL + 72, specTop + 6);
    ctx.fillStyle = '#16a34a'; ctx.fillText('\u25CF aligned', specL + 150, specTop + 6);
    ctx.fillStyle = WCOLORS.red; ctx.fillText('\u25CF near-beat', specL + 195, specTop + 6);

    requestAnimationFrame(tick);
  }

  ratioSlider?.addEventListener('input', () => {});
  tick();
}

// =========================================================================
// CHAPTER 7: Harmonic Alignment
// =========================================================================
function initHarmonicAlignment() {
  const canvas = document.getElementById('scene-harmonic-alignment');
  if (!canvas) return;
  const setup = wSetupCanvas(canvas);
  if (!setup) return;
  const { ctx, W, H } = setup;

  const intervals = [
    { name: 'Octave', ratio: 2 / 1, label: '2:1' },
    { name: 'Fifth', ratio: 3 / 2, label: '3:2' },
    { name: 'Fourth', ratio: 4 / 3, label: '4:3' },
    { name: 'Maj 3rd', ratio: 5 / 4, label: '5:4' },
    { name: 'Min 3rd', ratio: 6 / 5, label: '6:5' }
  ];

  let btnContainer = document.getElementById('ha-btns');
  if (!btnContainer) {
    const parent = canvas.parentElement;
    if (parent) {
      const controls = document.createElement('div');
      controls.className = 'scene-controls';
      controls.id = 'ha-btns';
      let html = '';
      intervals.forEach((iv, i) => {
        html += '<button id="ha-btn-' + i + '" style="font-size:11px;padding:2px 8px;cursor:pointer;margin-right:4px;">' + iv.name + '</button>';
      });
      controls.innerHTML = html;
      parent.appendChild(controls);
      btnContainer = controls;
    }
  }

  // Play button (append to existing controls)
  if (btnContainer && !document.getElementById('ha-play')) {
    wMakePlayBtn(btnContainer, 'ha-play', '\u25B6 Listen', () => {
      const iv = intervals[selected];
      const f1 = 262;
      const harmonics = [];
      for (let n = 1; n <= 6; n++) harmonics.push({ n, gain: 1 / n });
      wPlayTones('ha-play', [
        { freq: f1, gain: 0.4, harmonics },
        { freq: f1 * iv.ratio, gain: 0.4, harmonics }
      ], 3);
    });
  }

  let selected = 1;

  function selectInterval(i) {
    selected = i;
    draw();
    // Play the interval
    const f1 = 262;
    const harmonics = [];
    for (let n = 1; n <= 6; n++) harmonics.push({ n, gain: 1 / n });
    wPlayTones('ha-play', [
      { freq: f1, gain: 0.4, harmonics },
      { freq: f1 * intervals[i].ratio, gain: 0.4, harmonics }
    ], 3);
    const btn = document.getElementById('ha-play');
    if (btn) { btn.textContent = '\u25A0 Stop'; btn.style.background = '#dc2626'; }
  }

  intervals.forEach((iv, i) => {
    const oldBtn = document.getElementById('ha-btn-' + i);
    if (oldBtn) {
      // Clone to remove any stale listeners from prior init calls
      const newBtn = oldBtn.cloneNode(true);
      oldBtn.parentNode.replaceChild(newBtn, oldBtn);
      newBtn.addEventListener('click', () => selectInterval(i));
    }
  });

  function draw() {
    wClear(ctx, W, H);
    const iv = intervals[selected];
    const numH = 12;

    const barL = 60, barR = W - 30;
    const barW = barR - barL;
    const barH = 20;
    const bar1Y = H * 0.25;
    const bar2Y = H * 0.45;
    const alignY = H * 0.7;

    const f1 = 100;
    const f2 = f1 * iv.ratio;
    const fMax = f1 * (numH + 1);

    // Update button styles
    intervals.forEach((_, i) => {
      const btn = document.getElementById('ha-btn-' + i);
      if (btn) btn.style.fontWeight = (i === selected) ? 'bold' : 'normal';
    });

    ctx.fillStyle = WCOLORS.text; ctx.font = '12px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('Harmonic Alignment: ' + iv.name + ' (' + iv.label + ')', W / 2, 18);

    // Frequency axis
    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(barL, alignY + 10); ctx.lineTo(barR, alignY + 10); ctx.stroke();
    ctx.fillStyle = WCOLORS.textDim; ctx.font = '11px system-ui'; ctx.textAlign = 'center';
    for (let tickVal = 0; tickVal <= Math.floor(fMax / 100); tickVal++) {
      const px = barL + (tickVal * 100 / fMax) * barW;
      ctx.beginPath(); ctx.moveTo(px, alignY + 10); ctx.lineTo(px, alignY + 14); ctx.strokeStyle = WCOLORS.axis; ctx.stroke();
      ctx.fillText((tickVal * 100) + '', px, alignY + 24);
    }

    // Note 1 bars
    ctx.fillStyle = WCOLORS.text; ctx.font = '10px system-ui'; ctx.textAlign = 'right';
    ctx.fillText('Note 1 (' + f1 + ' Hz)', barL - 5, bar1Y + 5);

    for (let n = 1; n <= numH; n++) {
      const f = f1 * n;
      if (f > fMax) break;
      const px = barL + (f / fMax) * barW;

      let aligned = false;
      for (let m = 1; m <= numH; m++) {
        if (Math.abs(f - f2 * m) / f < 0.005) { aligned = true; break; }
      }

      ctx.fillStyle = aligned ? '#16a34a' : WCOLORS.teal;
      ctx.fillRect(px - 3, bar1Y - barH / 2, 6, barH);

      ctx.fillStyle = WCOLORS.textDim; ctx.font = '10px system-ui'; ctx.textAlign = 'center';
      ctx.fillText(n + '', px, bar1Y - barH / 2 - 3);
    }

    // Note 2 bars
    ctx.fillStyle = WCOLORS.text; ctx.font = '10px system-ui'; ctx.textAlign = 'right';
    ctx.fillText('Note 2 (' + f2.toFixed(0) + ' Hz)', barL - 5, bar2Y + 5);

    for (let m = 1; m <= numH; m++) {
      const f = f2 * m;
      if (f > fMax) break;
      const px = barL + (f / fMax) * barW;

      let aligned = false;
      for (let n = 1; n <= numH; n++) {
        if (Math.abs(f - f1 * n) / f < 0.005) { aligned = true; break; }
      }

      ctx.fillStyle = aligned ? '#16a34a' : WCOLORS.amber;
      ctx.fillRect(px - 3, bar2Y - barH / 2, 6, barH);

      ctx.fillStyle = WCOLORS.textDim; ctx.font = '10px system-ui'; ctx.textAlign = 'center';
      ctx.fillText(m + '', px, bar2Y + barH / 2 + 10);
    }

    // Alignment lines
    ctx.strokeStyle = '#16a34a'; ctx.lineWidth = 1; ctx.setLineDash([3, 2]); ctx.globalAlpha = 0.5;
    for (let n = 1; n <= numH; n++) {
      const fh = f1 * n;
      if (fh > fMax) break;
      for (let m = 1; m <= numH; m++) {
        const fh2 = f2 * m;
        if (Math.abs(fh - fh2) / fh < 0.005) {
          const px = barL + (fh / fMax) * barW;
          ctx.beginPath(); ctx.moveTo(px, bar1Y + barH / 2); ctx.lineTo(px, bar2Y - barH / 2); ctx.stroke();
        }
      }
    }
    ctx.setLineDash([]); ctx.globalAlpha = 1;

    // Combined axis view
    ctx.fillStyle = WCOLORS.text; ctx.font = '10px system-ui'; ctx.textAlign = 'left';
    ctx.fillText('Combined on frequency axis:', barL, alignY - 5);

    for (let n = 1; n <= numH; n++) {
      const f = f1 * n;
      if (f > fMax) break;
      const px = barL + (f / fMax) * barW;
      ctx.fillStyle = WCOLORS.teal; ctx.globalAlpha = 0.6;
      ctx.fillRect(px - 2, alignY - 10, 4, 20);
      ctx.globalAlpha = 1;
    }
    for (let m = 1; m <= numH; m++) {
      const f = f2 * m;
      if (f > fMax) break;
      const px = barL + (f / fMax) * barW;
      ctx.fillStyle = WCOLORS.amber; ctx.globalAlpha = 0.6;
      ctx.fillRect(px - 2, alignY - 10, 4, 20);
      ctx.globalAlpha = 1;
    }

    ctx.fillStyle = WCOLORS.teal; ctx.font = '11px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('Ratio = ' + iv.label + ' = ' + iv.ratio.toFixed(4), W / 2, H - 6);
  }

  draw();
}

// =========================================================================
// CHAPTER 7: Circle of Fifths
// =========================================================================
function initCircleOfFifths() {
  const canvas = document.getElementById('scene-circle-of-fifths');
  if (!canvas) return;
  const setup = wSetupCanvas(canvas);
  if (!setup) return;
  const { ctx, W, H } = setup;

  const noteNames = ['C', 'G', 'D', 'A', 'E', 'B', 'F\u266F/G\u266D', 'D\u266D', 'A\u266D', 'E\u266D', 'B\u266D', 'F'];

  let tuning = 0; // 0 = equal, 1 = pythagorean
  let highlighted = 0;

  let btnET = document.getElementById('cof-et');
  if (!btnET) {
    const parent = canvas.parentElement;
    if (parent) {
      const controls = document.createElement('div');
      controls.className = 'scene-controls';
      controls.innerHTML =
        '<button id="cof-et" style="font-size:11px;padding:2px 8px;cursor:pointer;font-weight:bold;">Equal Tempered</button>' +
        '<button id="cof-py" style="font-size:11px;padding:2px 8px;cursor:pointer;margin-left:4px;">Pythagorean</button>' +
        '<label style="margin-left:10px;">Note: <input type="range" id="cof-note" min="0" max="11" step="1" value="0"><span class="scene-val" id="cof-note-val">C</span></label>';
      parent.appendChild(controls);
      btnET = document.getElementById('cof-et');
    }
  }

  // Play button (append to existing controls)
  {
    const controls = btnET?.closest('.scene-controls') || canvas.parentElement;
    if (controls && !document.getElementById('cof-play')) {
      wMakePlayBtn(controls, 'cof-play', '\u25B6 Play Note', () => {
        const freq = cofGetFreq(highlighted, tuning);
        const harmonics = [];
        for (let n = 1; n <= 5; n++) harmonics.push({ n, gain: 1 / n });
        wPlayTones('cof-play', [{ freq, gain: 0.6, harmonics }], 2);
      });
    }
  }

  // fifths-based note order: C, G, D, A, E, B, F#, Db, Ab, Eb, Bb, F
  // Each step is a fifth (7 semitones ET, or ratio 3/2 Pythagorean)
  function cofGetFreq(noteIdx, tuningMode) {
    const baseFreq = 262; // C4
    if (tuningMode === 0) {
      // Equal tempered: each fifth = 7 semitones
      const semitones = (noteIdx * 7) % 12;
      return baseFreq * Math.pow(2, semitones / 12);
    } else {
      // Pythagorean: each fifth = 3/2
      return baseFreq * Math.pow(3 / 2, noteIdx) / Math.pow(2, Math.floor(noteIdx * Math.log2(3 / 2)));
    }
  }

  let cycleTimer = null;
  function stopCycle() {
    if (cycleTimer) { clearInterval(cycleTimer); cycleTimer = null; }
  }
  function startCycle() {
    stopCycle();
    highlighted = 0;
    const noteSldr = document.getElementById('cof-note');
    if (noteSldr) noteSldr.value = '0';
    draw();
    playCurrentNote();
    cycleTimer = setInterval(() => {
      highlighted++;
      if (highlighted > 11) { highlighted = 11; stopCycle(); return; }
      const noteSldr = document.getElementById('cof-note');
      if (noteSldr) noteSldr.value = String(highlighted);
      draw();
      playCurrentNote();
    }, 600);
  }
  function playCurrentNote() {
    const freq = cofGetFreq(highlighted, tuning);
    const harmonics = [];
    for (let n = 1; n <= 5; n++) harmonics.push({ n, gain: 1 / n });
    wPlayTones('cof-play', [{ freq, gain: 0.6, harmonics }], 0.5);
    const btn = document.getElementById('cof-play');
    if (btn) { btn.textContent = '\u25A0 Stop'; btn.style.background = '#dc2626'; }
  }

  // Clone buttons to remove stale listeners from prior init calls
  function freshBtn(id) {
    const old = document.getElementById(id);
    if (!old) return null;
    const btn = old.cloneNode(true);
    old.parentNode.replaceChild(btn, old);
    return btn;
  }
  const etBtn = freshBtn('cof-et');
  const pyBtn = freshBtn('cof-py');
  etBtn?.addEventListener('click', () => { tuning = 0; updateBtns(); startCycle(); });
  pyBtn?.addEventListener('click', () => { tuning = 1; updateBtns(); startCycle(); });
  const noteSlider = freshBtn('cof-note') || document.getElementById('cof-note');
  noteSlider?.addEventListener('input', () => {
    stopCycle();
    highlighted = parseInt(noteSlider.value);
    draw();
    playCurrentNote();
  });

  // Click on note circles in the canvas
  canvas.style.cursor = 'pointer';
  canvas.addEventListener('click', (e) => {
    stopCycle();
    const rect = canvas.getBoundingClientRect();
    const mx = (e.clientX - rect.left);
    const my = (e.clientY - rect.top);
    const cx = W / 2;
    const cy = H / 2 + 5;
    const R = Math.min(W, H) * 0.35;

    // Compute current note positions
    const angles = [];
    if (tuning === 0) {
      for (let i = 0; i < 12; i++) angles.push(-Math.PI / 2 + i * (2 * Math.PI / 12));
    } else {
      const pyCents = 1200 * Math.log2(3 / 2);
      for (let i = 0; i < 12; i++) {
        const totalCents = i * pyCents;
        angles.push(-Math.PI / 2 + (totalCents % 1200) / 1200 * (2 * Math.PI));
      }
    }

    let closest = -1, closestDist = Infinity;
    for (let i = 0; i < 12; i++) {
      const nx = cx + R * Math.cos(angles[i]);
      const ny = cy + R * Math.sin(angles[i]);
      const d = Math.hypot(mx - nx, my - ny);
      if (d < 25 && d < closestDist) { closest = i; closestDist = d; }
    }
    if (closest >= 0) {
      highlighted = closest;
      const noteSldr = document.getElementById('cof-note');
      if (noteSldr) noteSldr.value = String(highlighted);
      draw();
      playCurrentNote();
    }
  });

  function updateBtns() {
    const et = document.getElementById('cof-et');
    const py = document.getElementById('cof-py');
    if (et) et.style.fontWeight = tuning === 0 ? 'bold' : 'normal';
    if (py) py.style.fontWeight = tuning === 1 ? 'bold' : 'normal';
  }

  function draw() {
    document.getElementById('cof-note-val')?.replaceChildren(document.createTextNode(noteNames[highlighted]));

    wClear(ctx, W, H);

    const cx = W / 2;
    const cy = H / 2 + 5;
    const R = Math.min(W, H) * 0.35;

    ctx.fillStyle = WCOLORS.text; ctx.font = '12px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('Circle of Fifths (' + (tuning === 0 ? 'Equal Tempered' : 'Pythagorean') + ')', W / 2, 16);

    // Circle
    ctx.strokeStyle = WCOLORS.grid; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.stroke();

    // Angular positions
    const angles = [];
    if (tuning === 0) {
      for (let i = 0; i < 12; i++) {
        angles.push(-Math.PI / 2 + i * (2 * Math.PI / 12));
      }
    } else {
      const pyCents = 1200 * Math.log2(3 / 2);
      for (let i = 0; i < 12; i++) {
        const totalCents = i * pyCents;
        const angle = -Math.PI / 2 + (totalCents % 1200) / 1200 * (2 * Math.PI);
        angles.push(angle);
      }
    }

    // Connecting lines
    ctx.strokeStyle = WCOLORS.teal; ctx.lineWidth = 1.5; ctx.globalAlpha = 0.3;
    for (let i = 0; i < 12; i++) {
      const a1 = angles[i];
      const a2 = angles[(i + 1) % 12];
      const x1 = cx + R * Math.cos(a1);
      const y1 = cy + R * Math.sin(a1);
      const x2 = cx + R * Math.cos(a2);
      const y2 = cy + R * Math.sin(a2);
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    }
    ctx.globalAlpha = 1;

    // Highlight path
    if (highlighted > 0) {
      ctx.strokeStyle = WCOLORS.amber; ctx.lineWidth = 2.5; ctx.globalAlpha = 0.6;
      for (let i = 0; i < highlighted; i++) {
        const a1 = angles[i];
        const a2 = angles[i + 1];
        const x1 = cx + R * Math.cos(a1);
        const y1 = cy + R * Math.sin(a1);
        const x2 = cx + R * Math.cos(a2);
        const y2 = cy + R * Math.sin(a2);
        ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }

    // Note markers
    for (let i = 0; i < 12; i++) {
      const a = angles[i];
      const x = cx + R * Math.cos(a);
      const y = cy + R * Math.sin(a);

      const isHL = (i === highlighted);
      const radius = isHL ? 20 : 15;
      ctx.fillStyle = isHL ? WCOLORS.teal : '#fff';
      ctx.strokeStyle = isHL ? WCOLORS.teal : WCOLORS.axis;
      ctx.lineWidth = isHL ? 2.5 : 1.5;
      ctx.beginPath(); ctx.arc(x, y, radius, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

      ctx.fillStyle = isHL ? '#fff' : WCOLORS.text;
      ctx.font = (isHL ? 'bold ' : '') + '11px system-ui';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(noteNames[i], x, y);
    }
    ctx.textBaseline = 'alphabetic';

    // Pythagorean comma
    if (tuning === 1) {
      const overshootCents = 12 * 1200 * Math.log2(3 / 2) - 7 * 1200;
      const overshootAngle = -Math.PI / 2 + overshootCents / 1200 * (2 * Math.PI);

      ctx.strokeStyle = WCOLORS.red; ctx.lineWidth = 4;
      const startA = -Math.PI / 2;
      const endA = overshootAngle;
      ctx.beginPath();
      ctx.arc(cx, cy, R + 24, Math.min(startA, endA), Math.max(startA, endA));
      ctx.stroke();

      ctx.fillStyle = WCOLORS.red; ctx.font = '10px system-ui'; ctx.textAlign = 'left';
      ctx.fillText('Pythagorean comma', cx + R * 0.3, H - 22);
      ctx.fillText('(' + overshootCents.toFixed(1) + ' cents)', cx + R * 0.3, H - 10);
    }

    if (tuning === 0) {
      ctx.fillStyle = WCOLORS.textDim; ctx.font = '10px system-ui'; ctx.textAlign = 'center';
      ctx.fillText('Circle closes exactly: 12 fifths = 7 octaves', W / 2, H - 10);
    }
  }

  draw();
}

// =========================================================================
// CHAPTER 7: Scale Comparison
// =========================================================================
function initScaleComparison() {
  const canvas = document.getElementById('scene-scale-comparison');
  if (!canvas) return;
  const setup = wSetupCanvas(canvas);
  if (!setup) return;
  const { ctx, W, H } = setup;

  const justRatios = [1, 9/8, 5/4, 4/3, 3/2, 5/3, 15/8, 2];
  const justNames = ['C', 'D', 'E', 'F', 'G', 'A', 'B', "C'"];
  const pythRatios = [1, 9/8, 81/64, 4/3, 3/2, 27/16, 243/128, 2];
  const eqSemitones = [0, 2, 4, 5, 7, 9, 11, 12];
  const eqRatios = eqSemitones.map(s => Math.pow(2, s / 12));

  let hoveredNote = -1;

  // Add play controls
  {
    const parent = canvas.parentElement;
    if (parent && !document.getElementById('sc-play-just')) {
      const controls = document.createElement('div');
      controls.className = 'scene-controls';
      controls.innerHTML = '<span style="font-size:11px;color:var(--muted);">Click a note to hear it \u2014 Play scale:</span>';
      wMakePlayBtn(controls, 'sc-play-just', '\u25B6 Just', () => scPlayScale(justRatios, 'sc-play-just'));
      wMakePlayBtn(controls, 'sc-play-pyth', '\u25B6 Pythagorean', () => scPlayScale(pythRatios, 'sc-play-pyth'));
      wMakePlayBtn(controls, 'sc-play-et', '\u25B6 Equal Tempered', () => scPlayScale(eqRatios, 'sc-play-et'));
      parent.appendChild(controls);
    }
  }

  function scPlayScale(ratios, btnId) {
    const baseFreq = 262;
    let i = 0;
    function playNext() {
      if (i >= ratios.length || (i > 0 && !wIsPlaying(btnId))) {
        wStopTones(btnId);
        const btn = document.getElementById(btnId);
        if (btn) { btn.textContent = btn.textContent.replace('\u25A0 Stop', '\u25B6 ' + btn.dataset.label); btn.style.background = ''; }
        return;
      }
      wPlayTones(btnId, [{ freq: baseFreq * ratios[i], gain: 0.6, harmonics: [{n:1,gain:1},{n:2,gain:0.4},{n:3,gain:0.2}] }], 0);
      i++;
      setTimeout(playNext, 400);
    }
    const btn = document.getElementById(btnId);
    if (btn) btn.dataset.label = btn.textContent.replace('\u25A0 Stop', '').trim();
    playNext();
  }

  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    hoveredNote = -1;
    const barL = 80, barR = W - 30;
    const barW = barR - barL;
    for (let i = 0; i < 8; i++) {
      const cents = 1200 * Math.log2(justRatios[i]);
      const px = barL + (cents / 1200) * barW;
      if (Math.abs(mx - px) < 12 && my > 30 && my < H - 30) {
        hoveredNote = i;
        break;
      }
    }
    draw();
  });
  canvas.addEventListener('mouseleave', () => { hoveredNote = -1; draw(); });

  // Click to play individual note
  canvas.addEventListener('click', (e) => {
    if (hoveredNote < 0) return;
    const rect = canvas.getBoundingClientRect();
    const my = e.clientY - rect.top;
    const rowH = (H - 80) / 3;
    // Determine which scale row was clicked
    let ratios = justRatios;
    const scaleY = [55, 55 + rowH, 55 + 2 * rowH];
    if (my > scaleY[2] - 20) ratios = eqRatios;
    else if (my > scaleY[1] - 20) ratios = pythRatios;
    const baseFreq = 262;
    wPlayTones('sc-note', [{ freq: baseFreq * ratios[hoveredNote], gain: 0.6, harmonics: [{n:1,gain:1},{n:2,gain:0.4},{n:3,gain:0.2}] }], 1);
  });
  canvas.style.cursor = 'pointer';

  function draw() {
    wClear(ctx, W, H);

    const barL = 80, barR = W - 30;
    const barW = barR - barL;
    const rowH = (H - 80) / 3;
    const scales = [
      { name: 'Just', ratios: justRatios, color: WCOLORS.teal, y: 55 },
      { name: 'Pythagorean', ratios: pythRatios, color: WCOLORS.amber, y: 55 + rowH },
      { name: 'Equal Tempered', ratios: eqRatios, color: WCOLORS.blue, y: 55 + 2 * rowH }
    ];

    ctx.fillStyle = WCOLORS.text; ctx.font = '12px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('Scale Comparison: Just vs Pythagorean vs Equal Tempered', W / 2, 16);

    // Axes
    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 1;
    for (const sc of scales) {
      ctx.beginPath(); ctx.moveTo(barL, sc.y); ctx.lineTo(barR, sc.y); ctx.stroke();
    }

    // Cent ticks
    ctx.fillStyle = WCOLORS.textDim; ctx.font = '10px system-ui'; ctx.textAlign = 'center';
    for (let c = 0; c <= 1200; c += 200) {
      const px = barL + (c / 1200) * barW;
      for (const sc of scales) {
        ctx.strokeStyle = WCOLORS.grid; ctx.lineWidth = 0.5;
        ctx.beginPath(); ctx.moveTo(px, sc.y - 15); ctx.lineTo(px, sc.y + 15); ctx.stroke();
      }
      ctx.fillStyle = WCOLORS.textDim;
      ctx.fillText(c + '\u00A2', px, H - 5);
    }
    ctx.fillText('cents', barR + 5, H - 5);

    // Notes
    for (let si = 0; si < scales.length; si++) {
      const sc = scales[si];

      ctx.fillStyle = sc.color; ctx.font = '10px system-ui'; ctx.textAlign = 'right';
      ctx.fillText(sc.name, barL - 8, sc.y + 4);

      for (let i = 0; i < 8; i++) {
        const cents = 1200 * Math.log2(sc.ratios[i]);
        const px = barL + (cents / 1200) * barW;

        const isHovered = (hoveredNote === i);
        ctx.fillStyle = sc.color;
        ctx.globalAlpha = isHovered ? 1 : 0.8;

        ctx.fillRect(px - 2, sc.y - 12, 4, 24);

        if (si === 0) {
          ctx.fillStyle = WCOLORS.text; ctx.font = (isHovered ? 'bold ' : '') + '9px system-ui'; ctx.textAlign = 'center';
          ctx.fillText(justNames[i], px, 40);
        }

        ctx.globalAlpha = 1;
      }
    }

    // Hover info
    if (hoveredNote >= 0 && hoveredNote < 8) {
      const justCents = 1200 * Math.log2(justRatios[hoveredNote]);
      const pythCents = 1200 * Math.log2(pythRatios[hoveredNote]);
      const eqCents = 1200 * Math.log2(eqRatios[hoveredNote]);

      const px = barL + (justCents / 1200) * barW;
      ctx.strokeStyle = WCOLORS.textDim; ctx.lineWidth = 0.5; ctx.setLineDash([3, 3]);
      ctx.beginPath(); ctx.moveTo(px, 45); ctx.lineTo(px, H - 20); ctx.stroke();
      ctx.setLineDash([]);

      const boxX = Math.min(px + 15, W - 160);
      const boxY = scales[0].y + 20;
      ctx.fillStyle = 'rgba(250, 245, 236, 0.95)';
      ctx.fillRect(boxX, boxY, 150, 68);
      ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 0.5;
      ctx.strokeRect(boxX, boxY, 150, 68);

      ctx.fillStyle = WCOLORS.text; ctx.font = 'bold 10px system-ui'; ctx.textAlign = 'left';
      ctx.fillText(justNames[hoveredNote], boxX + 5, boxY + 14);
      ctx.font = '11px system-ui';
      ctx.fillStyle = WCOLORS.teal;
      ctx.fillText('Just: ' + justCents.toFixed(1) + '\u00A2  (ratio ' + justRatios[hoveredNote].toFixed(4) + ')', boxX + 5, boxY + 28);
      ctx.fillStyle = WCOLORS.amber;
      ctx.fillText('Pyth: ' + pythCents.toFixed(1) + '\u00A2  (\u0394' + (pythCents - justCents).toFixed(1) + '\u00A2)', boxX + 5, boxY + 42);
      ctx.fillStyle = WCOLORS.blue;
      ctx.fillText('ET:    ' + eqCents.toFixed(1) + '\u00A2  (\u0394' + (eqCents - justCents).toFixed(1) + '\u00A2)', boxX + 5, boxY + 56);
    } else {
      ctx.fillStyle = WCOLORS.textDim; ctx.font = '10px system-ui'; ctx.textAlign = 'center';
      ctx.fillText('Hover over a note to see frequency ratios and deviations', W / 2, 40);
    }
  }

  draw();
}

// =========================================================================
// CHAPTER 12 - WAVES (MULLER)
// =========================================================================

function initWaveTransportEnergy() {
  const canvas = document.getElementById('scene-wave-transport-energy');
  if (!canvas) return;
  const setup = wSetupCanvas(canvas);
  if (!setup) return;
  const { ctx, W, H } = setup;

  const N = 40;
  const spacing = (W - 80) / (N - 1);
  const baseY = H / 2;
  const amp = 40;
  let t = 0;

  let pulseSpeed = 0.8, pulseWidth = 60;
  const speedSlider = document.getElementById('wte-speed');
  const widthSlider = document.getElementById('wte-width');
  const speedVal = document.getElementById('wte-speed-val');
  const widthVal = document.getElementById('wte-width-val');
  function onWteInput() {
    pulseSpeed = parseFloat(speedSlider.value);
    pulseWidth = parseFloat(widthSlider.value);
    speedVal.textContent = pulseSpeed.toFixed(1);
    widthVal.textContent = pulseWidth.toFixed(0);
  }
  if (speedSlider) speedSlider.addEventListener('input', onWteInput);
  if (widthSlider) widthSlider.addEventListener('input', onWteInput);

  function tick() {
    if (!canvas.isConnected) return;
    t += 0.03;
    wClear(ctx, W, H);
    draw();
    requestAnimationFrame(tick);
  }

  function draw() {
    // Title
    ctx.fillStyle = WCOLORS.text; ctx.font = 'bold 12px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('Energy transport by a wave pulse', W / 2, 18);

    // Pulse center moves across canvas and wraps
    const pulseX = ((t * pulseSpeed * (W - 80) / (2 * Math.PI)) % (W + 100)) - 50;

    // Draw equilibrium line
    ctx.strokeStyle = WCOLORS.grid; ctx.lineWidth = 1; ctx.setLineDash([4, 4]);
    ctx.beginPath(); ctx.moveTo(30, baseY); ctx.lineTo(W - 30, baseY); ctx.stroke();
    ctx.setLineDash([]);

    // Draw particles
    for (let i = 0; i < N; i++) {
      const px = 40 + i * spacing;
      const dist = px - pulseX;
      const envelope = Math.exp(-(dist * dist) / (2 * pulseWidth * pulseWidth));
      const dy = amp * envelope * Math.sin(dist * 0.08);

      // Particle
      const radius = 5;
      ctx.fillStyle = envelope > 0.05 ? WCOLORS.teal : WCOLORS.textDim;
      ctx.globalAlpha = 0.3 + 0.7 * Math.max(envelope, 0.2);
      ctx.beginPath(); ctx.arc(px, baseY + dy, radius, 0, 2 * Math.PI); ctx.fill();
      ctx.globalAlpha = 1;

      // Vertical displacement line
      if (Math.abs(dy) > 1) {
        ctx.strokeStyle = WCOLORS.teal; ctx.lineWidth = 1; ctx.globalAlpha = 0.3;
        ctx.beginPath(); ctx.moveTo(px, baseY); ctx.lineTo(px, baseY + dy); ctx.stroke();
        ctx.globalAlpha = 1;
      }
    }

    // Draw envelope curve
    ctx.strokeStyle = WCOLORS.amber; ctx.lineWidth = 1.5; ctx.setLineDash([3, 3]);
    ctx.beginPath();
    let started = false;
    for (let x = 30; x < W - 30; x += 2) {
      const dist = x - pulseX;
      const env = amp * Math.exp(-(dist * dist) / (2 * pulseWidth * pulseWidth));
      if (env > 0.5) {
        if (!started) { ctx.moveTo(x, baseY - env); started = true; }
        else ctx.lineTo(x, baseY - env);
      }
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // Energy arrow
    const arrowY = H - 35;
    if (pulseX > 30 && pulseX < W - 50) {
      ctx.strokeStyle = WCOLORS.red; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.moveTo(pulseX - 30, arrowY); ctx.lineTo(pulseX + 30, arrowY); ctx.stroke();
      ctx.fillStyle = WCOLORS.red;
      ctx.beginPath();
      ctx.moveTo(pulseX + 30, arrowY);
      ctx.lineTo(pulseX + 22, arrowY - 5);
      ctx.lineTo(pulseX + 22, arrowY + 5);
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = WCOLORS.red; ctx.font = 'bold 11px system-ui'; ctx.textAlign = 'center';
      ctx.fillText('Energy →', pulseX, arrowY - 10);
    }

    // Labels
    ctx.fillStyle = WCOLORS.textDim; ctx.font = '10px system-ui'; ctx.textAlign = 'left';
    ctx.fillText('Particles oscillate in place', 10, H - 8);
    ctx.textAlign = 'right';
    ctx.fillText('Energy moves forward with pulse', W - 10, H - 8);
  }

  tick();
}

// =========================================================================
function initTransverseLongitudinalDemo() {
  const canvas = document.getElementById('scene-transverse-longitudinal-demo');
  if (!canvas) return;
  const setup = wSetupCanvas(canvas);
  if (!setup) return;
  const { ctx, W, H } = setup;

  const N = 30;
  const spacing = (W - 140) / (N - 1);
  const amp = 18;
  let t = 0;

  let omega = 2, k = 0.3;
  const omegaSlider = document.getElementById('tld-omega');
  const kSlider = document.getElementById('tld-k');
  const omegaVal = document.getElementById('tld-omega-val');
  const kVal = document.getElementById('tld-k-val');
  function onTldInput() {
    omega = parseFloat(omegaSlider.value);
    k = parseFloat(kSlider.value);
    omegaVal.textContent = omega.toFixed(1);
    kVal.textContent = k.toFixed(2);
  }
  if (omegaSlider) omegaSlider.addEventListener('input', onTldInput);
  if (kSlider) kSlider.addEventListener('input', onTldInput);

  const transY = H * 0.28;
  const longY = H * 0.72;

  function tick() {
    if (!canvas.isConnected) return;
    t += 0.04;
    wClear(ctx, W, H);
    draw();
    requestAnimationFrame(tick);
  }

  function draw() {
    // Dividing line
    ctx.strokeStyle = WCOLORS.grid; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(20, H / 2); ctx.lineTo(W - 20, H / 2); ctx.stroke();

    // Section labels
    ctx.fillStyle = WCOLORS.text; ctx.font = 'bold 12px system-ui'; ctx.textAlign = 'left';
    ctx.fillText('Transverse wave (e.g. rope)', 20, 18);
    ctx.fillText('Longitudinal wave (e.g. sound)', 20, H / 2 + 18);

    // --- Transverse ---
    // Equilibrium line
    ctx.strokeStyle = WCOLORS.grid; ctx.lineWidth = 1; ctx.setLineDash([3, 3]);
    ctx.beginPath(); ctx.moveTo(60, transY); ctx.lineTo(W - 60, transY); ctx.stroke();
    ctx.setLineDash([]);

    // Particles & wave curve
    ctx.strokeStyle = WCOLORS.teal; ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i < N; i++) {
      const px = 70 + i * spacing;
      const dy = amp * Math.sin(k * px - omega * t);
      if (i === 0) ctx.moveTo(px, transY + dy);
      else ctx.lineTo(px, transY + dy);
    }
    ctx.stroke();

    for (let i = 0; i < N; i++) {
      const px = 70 + i * spacing;
      const dy = amp * Math.sin(k * px - omega * t);
      ctx.fillStyle = WCOLORS.teal;
      ctx.beginPath(); ctx.arc(px, transY + dy, 4, 0, 2 * Math.PI); ctx.fill();
    }

    // Displacement arrow (vertical)
    const arrowX1 = W - 50;
    ctx.strokeStyle = WCOLORS.amber; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(arrowX1, transY - 20); ctx.lineTo(arrowX1, transY + 20); ctx.stroke();
    ctx.fillStyle = WCOLORS.amber;
    ctx.beginPath(); ctx.moveTo(arrowX1, transY - 20); ctx.lineTo(arrowX1 - 4, transY - 14); ctx.lineTo(arrowX1 + 4, transY - 14); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(arrowX1, transY + 20); ctx.lineTo(arrowX1 - 4, transY + 14); ctx.lineTo(arrowX1 + 4, transY + 14); ctx.closePath(); ctx.fill();
    ctx.font = '11px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('disp.', arrowX1, transY - 24);

    // Propagation arrow (horizontal)
    const propArrowY = transY + 35;
    ctx.strokeStyle = WCOLORS.red; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(W / 2 - 40, propArrowY); ctx.lineTo(W / 2 + 40, propArrowY); ctx.stroke();
    ctx.fillStyle = WCOLORS.red;
    ctx.beginPath(); ctx.moveTo(W / 2 + 40, propArrowY); ctx.lineTo(W / 2 + 34, propArrowY - 4); ctx.lineTo(W / 2 + 34, propArrowY + 4); ctx.closePath(); ctx.fill();
    ctx.font = '11px system-ui'; ctx.fillText('propagation →', W / 2, propArrowY + 13);

    // --- Longitudinal (large accordion bellows) ---
    // Big, dramatic bellows with few folds and its OWN wave number so
    // only ~1.5 wavelengths are visible. This makes the compression
    // zone clearly propagate instead of everything shaking.

    const nCreases = 14;
    const bLeft = 50, bRight = W - 50;
    const bLen = bRight - bLeft;
    const creaseSpacing = bLen / (nCreases - 1);
    const bMaxH = 34;       // max half-height of pleat bulge
    const bMinH = 3;        // min half-height when fully compressed
    // Use a separate wave number: ~1.5 wavelengths across the bellows
    const kB = 1.5 * 2 * Math.PI / bLen;
    const bAmp = creaseSpacing * 0.9;  // large displacement

    // Compute displaced x for each crease point
    const cx = [];
    for (let i = 0; i < nCreases; i++) {
      const eqX = bLeft + i * creaseSpacing;
      cx.push(eqX + bAmp * Math.sin(kB * eqX - omega * t));
    }

    // Draw each pleat as a big puffy lens shape
    for (let i = 0; i < nCreases - 1; i++) {
      const x0 = cx[i], x1 = cx[i + 1];
      const midX = (x0 + x1) / 2;
      const span = Math.abs(x1 - x0);

      // Bulge height: big when stretched, flat when compressed
      const eqSpan = creaseSpacing;
      const stretchRatio = span / eqSpan;
      const bulge = Math.max(bMinH, Math.min(bMaxH, bMaxH * stretchRatio * 0.6));

      // --- Gradient fill for 3D rounded volume ---
      const grad = ctx.createLinearGradient(midX, longY - bulge, midX, longY + bulge);
      grad.addColorStop(0,   'rgba(160,225,215,0.7)');   // bright highlight top
      grad.addColorStop(0.2, 'rgba(40,160,148,0.6)');
      grad.addColorStop(0.45,'rgba(15,118,110,0.5)');
      grad.addColorStop(0.55,'rgba(15,118,110,0.5)');
      grad.addColorStop(0.8, 'rgba(10,90,82,0.6)');
      grad.addColorStop(1,   'rgba(5,55,50,0.7)');       // dark shadow bottom

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(x0, longY);
      ctx.quadraticCurveTo(midX, longY - bulge, x1, longY);
      ctx.quadraticCurveTo(midX, longY + bulge, x0, longY);
      ctx.closePath();
      ctx.fill();

      // Top outline — lighter
      ctx.strokeStyle = 'rgba(80,190,175,0.8)';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(x0, longY);
      ctx.quadraticCurveTo(midX, longY - bulge, x1, longY);
      ctx.stroke();

      // Bottom outline — darker
      ctx.strokeStyle = 'rgba(8,70,65,0.8)';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(x0, longY);
      ctx.quadraticCurveTo(midX, longY + bulge, x1, longY);
      ctx.stroke();

      // Specular highlight arc across the top of each pleat
      if (bulge > 10) {
        const hlY = longY - bulge * 0.5;
        const hlW = span * 0.35;
        ctx.strokeStyle = 'rgba(220,250,245,0.6)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(midX - hlW, hlY + 1);
        ctx.quadraticCurveTo(midX, hlY - 2, midX + hlW, hlY + 1);
        ctx.stroke();
      }
    }

    // Crease lines at each pinch point
    for (let i = 0; i < nCreases; i++) {
      // Height of crease tick matches adjacent pleat edges
      let h = 5;
      if (i > 0) {
        const s = Math.abs(cx[i] - cx[i - 1]);
        const r = s / creaseSpacing;
        h = Math.max(h, bMaxH * r * 0.6);
      }
      if (i < nCreases - 1) {
        const s = Math.abs(cx[i + 1] - cx[i]);
        const r = s / creaseSpacing;
        h = Math.max(h, bMaxH * r * 0.6);
      }
      h = Math.min(h, bMaxH);
      ctx.strokeStyle = 'rgba(15,118,110,0.9)';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(cx[i], longY - h);
      ctx.lineTo(cx[i], longY + h);
      ctx.stroke();
    }

    // End plates — thick solid bars
    const plateW = 8, plateH = bMaxH + 6;
    ctx.fillStyle = '#0d6b63';
    ctx.beginPath();
    ctx.roundRect(cx[0] - plateW - 1, longY - plateH, plateW, plateH * 2, 3);
    ctx.fill();
    ctx.beginPath();
    ctx.roundRect(cx[nCreases - 1] + 1, longY - plateH, plateW, plateH * 2, 3);
    ctx.fill();
    // Plate highlights
    ctx.fillStyle = 'rgba(160,225,215,0.3)';
    ctx.fillRect(cx[0] - plateW, longY - plateH + 2, plateW - 2, 4);
    ctx.fillRect(cx[nCreases - 1] + 2, longY - plateH + 2, plateW - 2, 4);

    // Propagation arrow
    const propArrowY2 = longY + bMaxH + 16;
    ctx.strokeStyle = WCOLORS.red; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(W / 2 - 40, propArrowY2); ctx.lineTo(W / 2 + 40, propArrowY2); ctx.stroke();
    ctx.fillStyle = WCOLORS.red;
    ctx.beginPath(); ctx.moveTo(W / 2 + 40, propArrowY2); ctx.lineTo(W / 2 + 34, propArrowY2 - 4); ctx.lineTo(W / 2 + 34, propArrowY2 + 4); ctx.closePath(); ctx.fill();
    ctx.font = '11px system-ui'; ctx.textAlign = 'center'; ctx.fillText('propagation →', W / 2, propArrowY2 + 13);

  }

  tick();
}

// =========================================================================
function initSoundRefractionAtmosphere() {
  const canvas = document.getElementById('scene-sound-refraction-atmosphere');
  if (!canvas) return;
  const setup = wSetupCanvas(canvas);
  if (!setup) return;
  const { ctx, W, H } = setup;

  function draw() {
    wClear(ctx, W, H);

    const panelW = W / 2 - 15;
    const panelH = H - 40;
    const panelT = 30;
    const groundY = panelT + panelH - 20;

    // --- Daytime panel (left) ---
    const lx = 10;

    // Temperature gradient (hot at bottom, cold at top)
    for (let y = panelT; y < groundY; y++) {
      const frac = (y - panelT) / (groundY - panelT);
      const r = Math.round(255 * (0.3 + 0.5 * frac));
      const g = Math.round(200 * (0.5 + 0.3 * frac));
      const b = Math.round(255 * (0.8 - 0.3 * frac));
      ctx.fillStyle = `rgba(${r},${g},${b},0.15)`;
      ctx.fillRect(lx, y, panelW, 1);
    }

    // Ground
    ctx.fillStyle = '#8B7355';
    ctx.fillRect(lx, groundY, panelW, 5);

    // Title
    ctx.fillStyle = WCOLORS.text; ctx.font = 'bold 11px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('Daytime (hot ground)', lx + panelW / 2, 18);

    // Temperature labels
    ctx.fillStyle = WCOLORS.red; ctx.font = '11px system-ui'; ctx.textAlign = 'left';
    ctx.fillText('Hot', lx + 3, groundY - 5);
    ctx.fillStyle = WCOLORS.blue;
    ctx.fillText('Cold', lx + 3, panelT + 15);

    // Speed labels
    ctx.fillStyle = WCOLORS.textDim; ctx.font = '11px system-ui'; ctx.textAlign = 'right';
    ctx.fillText('v fast', lx + panelW - 3, groundY - 5);
    ctx.fillText('v slow', lx + panelW - 3, panelT + 15);

    // Sound rays bending UPWARD (away from ground) - daytime
    const srcX = lx + 20;
    const srcY = groundY - 10;
    ctx.strokeStyle = WCOLORS.teal; ctx.lineWidth = 2;
    const angles = [0.15, 0.35, 0.55, 0.75, 0.95];
    for (const a of angles) {
      ctx.beginPath();
      ctx.moveTo(srcX, srcY);
      const steps = 40;
      for (let s = 1; s <= steps; s++) {
        const frac = s / steps;
        const x = srcX + frac * (panelW - 40);
        // Ray curves upward in daytime
        const y = srcY - frac * a * (groundY - panelT) * 0.6 - frac * frac * a * 30;
        if (y < panelT) break;
        ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    // Shadow zone
    ctx.fillStyle = 'rgba(220, 38, 38, 0.1)';
    ctx.fillRect(lx + panelW * 0.55, groundY - 40, panelW * 0.4, 40);
    ctx.fillStyle = WCOLORS.red; ctx.font = '11px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('Shadow zone', lx + panelW * 0.75, groundY - 15);

    // Source marker
    ctx.fillStyle = WCOLORS.amber;
    ctx.beginPath(); ctx.arc(srcX, srcY, 5, 0, 2 * Math.PI); ctx.fill();
    ctx.fillStyle = WCOLORS.text; ctx.font = '10px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('src', srcX, srcY + 14);

    // --- Evening panel (right) ---
    const rx = W / 2 + 5;

    // Temperature gradient (cool at bottom, warm at top)
    for (let y = panelT; y < groundY; y++) {
      const frac = (y - panelT) / (groundY - panelT);
      const r = Math.round(255 * (0.5 - 0.2 * frac));
      const g = Math.round(200 * (0.5 + 0.1 * frac));
      const b = Math.round(255 * (0.5 + 0.4 * frac));
      ctx.fillStyle = `rgba(${r},${g},${b},0.15)`;
      ctx.fillRect(rx, y, panelW, 1);
    }

    // Ground
    ctx.fillStyle = '#8B7355';
    ctx.fillRect(rx, groundY, panelW, 5);

    // Title
    ctx.fillStyle = WCOLORS.text; ctx.font = 'bold 11px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('Evening (cool ground)', rx + panelW / 2, 18);

    // Temperature labels
    ctx.fillStyle = WCOLORS.blue; ctx.font = '11px system-ui'; ctx.textAlign = 'left';
    ctx.fillText('Cool', rx + 3, groundY - 5);
    ctx.fillStyle = WCOLORS.red;
    ctx.fillText('Warm', rx + 3, panelT + 15);

    // Speed labels
    ctx.fillStyle = WCOLORS.textDim; ctx.font = '11px system-ui'; ctx.textAlign = 'right';
    ctx.fillText('v slow', rx + panelW - 3, groundY - 5);
    ctx.fillText('v fast', rx + panelW - 3, panelT + 15);

    // Sound rays bending DOWNWARD (toward ground) - evening
    const srcX2 = rx + 20;
    const srcY2 = groundY - 10;
    ctx.strokeStyle = WCOLORS.teal; ctx.lineWidth = 2;
    for (const a of angles) {
      ctx.beginPath();
      ctx.moveTo(srcX2, srcY2);
      const steps = 40;
      for (let s = 1; s <= steps; s++) {
        const frac = s / steps;
        const x = srcX2 + frac * (panelW - 40);
        // Ray initially goes up then curves back down
        const yUp = -a * (groundY - panelT) * 0.4 * frac;
        const yCurve = a * 0.6 * (groundY - panelT) * frac * frac;
        const y = srcY2 + yUp + yCurve;
        if (y > groundY) break;
        ctx.lineTo(x, Math.min(y, groundY));
      }
      ctx.stroke();
    }

    // Source marker
    ctx.fillStyle = WCOLORS.amber;
    ctx.beginPath(); ctx.arc(srcX2, srcY2, 5, 0, 2 * Math.PI); ctx.fill();
    ctx.fillStyle = WCOLORS.text; ctx.font = '10px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('src', srcX2, srcY2 + 14);

    // Sound travels far label
    ctx.fillStyle = WCOLORS.teal; ctx.font = '11px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('Sound carried far', rx + panelW * 0.65, groundY - 5);

    // Bottom note
    ctx.fillStyle = WCOLORS.textDim; ctx.font = '10px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('Sound bends toward regions of slower wave speed', W / 2, H - 5);
  }

  draw();
}

// =========================================================================
// CHAPTER 13 - LIGHT
// =========================================================================

function initEmPlaneWave() {
  const canvas = document.getElementById('scene-em-plane-wave');
  if (!canvas) return;
  const setup = wSetupCanvas(canvas);
  if (!setup) return;
  const { ctx, W, H } = setup;

  let t = 0;
  let emFreq = 1.5, emAmp = 0.7;
  const freqSlider = document.getElementById('empw-freq');
  const ampSlider = document.getElementById('empw-amp');
  const freqVal = document.getElementById('empw-freq-val');
  const ampVal = document.getElementById('empw-amp-val');
  function onEmpwInput() {
    emFreq = parseFloat(freqSlider.value);
    emAmp = parseFloat(ampSlider.value);
    freqVal.textContent = emFreq.toFixed(1);
    ampVal.textContent = emAmp.toFixed(2);
  }
  if (freqSlider) freqSlider.addEventListener('input', onEmpwInput);
  if (ampSlider) ampSlider.addEventListener('input', onEmpwInput);

  const cx = W / 2, cy = H / 2;

  // 3D-like projection parameters
  const axisLen = W * 0.38;
  const projX = { x: 0.85, y: 0.35 };  // k direction (propagation)
  const projY = { x: 0, y: -1 };        // E direction (vertical)
  const projZ = { x: -0.5, y: 0.2 };    // B direction (horizontal-ish)

  function to2D(kk, e, b) {
    return {
      x: cx + kk * projX.x * axisLen + e * projY.x * 50 + b * projZ.x * 50,
      y: cy + kk * projX.y * axisLen + e * projY.y * 50 + b * projZ.y * 50
    };
  }

  function tick() {
    if (!canvas.isConnected) return;
    t += 0.03;
    wClear(ctx, W, H);
    draw();
    requestAnimationFrame(tick);
  }

  function drawArrow(x1, y1, x2, y2, color, lw) {
    ctx.strokeStyle = color; ctx.lineWidth = lw || 2;
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    const dx = x2 - x1, dy = y2 - y1;
    const len = Math.sqrt(dx * dx + dy * dy);
    if (len < 3) return;
    const ux = dx / len, uy = dy / len;
    const hs = 6;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - ux * hs - uy * hs * 0.4, y2 - uy * hs + ux * hs * 0.4);
    ctx.lineTo(x2 - ux * hs + uy * hs * 0.4, y2 - uy * hs - ux * hs * 0.4);
    ctx.closePath(); ctx.fill();
  }

  function draw() {
    // Title
    ctx.fillStyle = WCOLORS.text; ctx.font = 'bold 12px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('Electromagnetic plane wave', W / 2, 16);

    // k axis (propagation)
    const kStart = to2D(-1, 0, 0);
    const kEnd = to2D(1.15, 0, 0);
    drawArrow(kStart.x, kStart.y, kEnd.x, kEnd.y, WCOLORS.textDim, 1.5);
    ctx.fillStyle = WCOLORS.text; ctx.font = 'bold 13px system-ui'; ctx.textAlign = 'left';
    ctx.fillText('k', kEnd.x + 5, kEnd.y - 2);

    // Draw E field wave (blue, vertical oscillations)
    const nPts = 100;
    ctx.strokeStyle = WCOLORS.blue; ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i <= nPts; i++) {
      const kk = -1 + 2 * i / nPts;
      const eVal = Math.sin(2 * Math.PI * kk * emFreq - t * 2);
      const p = to2D(kk, eVal * emAmp, 0);
      if (i === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
    }
    ctx.stroke();

    // E field arrows at intervals
    const nArrows = 16;
    for (let i = 0; i <= nArrows; i++) {
      const kk = -1 + 2 * i / nArrows;
      const eVal = Math.sin(2 * Math.PI * kk * emFreq - t * 2);
      const base = to2D(kk, 0, 0);
      const tip = to2D(kk, eVal * emAmp, 0);
      ctx.strokeStyle = WCOLORS.blue; ctx.lineWidth = 1; ctx.globalAlpha = 0.5;
      ctx.beginPath(); ctx.moveTo(base.x, base.y); ctx.lineTo(tip.x, tip.y); ctx.stroke();
      ctx.globalAlpha = 1;
    }

    // Draw B field wave (red, horizontal oscillations, 90deg from E but in phase)
    ctx.strokeStyle = WCOLORS.red; ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i <= nPts; i++) {
      const kk = -1 + 2 * i / nPts;
      const bVal = Math.sin(2 * Math.PI * kk * emFreq - t * 2);
      const p = to2D(kk, 0, bVal * emAmp);
      if (i === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
    }
    ctx.stroke();

    // B field arrows at intervals
    for (let i = 0; i <= nArrows; i++) {
      const kk = -1 + 2 * i / nArrows;
      const bVal = Math.sin(2 * Math.PI * kk * emFreq - t * 2);
      const base = to2D(kk, 0, 0);
      const tip = to2D(kk, 0, bVal * emAmp);
      ctx.strokeStyle = WCOLORS.red; ctx.lineWidth = 1; ctx.globalAlpha = 0.5;
      ctx.beginPath(); ctx.moveTo(base.x, base.y); ctx.lineTo(tip.x, tip.y); ctx.stroke();
      ctx.globalAlpha = 1;
    }

    // Labels
    const eLabel = to2D(0, 1, 0);
    ctx.fillStyle = WCOLORS.blue; ctx.font = 'bold 14px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('E', eLabel.x - 15, eLabel.y - 5);

    const bLabel = to2D(0, 0, 1);
    ctx.fillStyle = WCOLORS.red; ctx.font = 'bold 14px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('B', bLabel.x - 15, bLabel.y + 15);

    // Legend
    ctx.font = '10px system-ui'; ctx.textAlign = 'left';
    ctx.fillStyle = WCOLORS.blue; ctx.fillText('E field (vertical)', 10, H - 20);
    ctx.fillStyle = WCOLORS.red; ctx.fillText('B field (horizontal)', 10, H - 6);
    ctx.fillStyle = WCOLORS.textDim; ctx.textAlign = 'right';
    ctx.fillText('E ⊥ B ⊥ k', W - 10, H - 6);
  }

  tick();
}

// =========================================================================
// CHAPTER 14 - POLARIZATION
// =========================================================================

function initPhononPolarizations() {
  const canvas = document.getElementById('scene-phonon-polarizations');
  if (!canvas) return;
  const setup = wSetupCanvas(canvas);
  if (!setup) return;
  const { ctx, W, H } = setup;

  let mode = 'longitudinal'; // 'longitudinal', 'transverse-x', 'transverse-y'
  let t = 0;

  // Create buttons
  const parent = canvas.parentElement;
  let controls = document.getElementById('phonon-pol-controls');
  if (!controls && parent) {
    controls = document.createElement('div');
    controls.className = 'scene-controls';
    controls.id = 'phonon-pol-controls';
    controls.innerHTML =
      '<button id="phonon-btn-long" class="phonon-pol-btn phonon-pol-btn-active" style="padding:3px 12px;font-size:11px;cursor:pointer;margin-right:6px;">Longitudinal</button>' +
      '<button id="phonon-btn-tx" class="phonon-pol-btn" style="padding:3px 12px;font-size:11px;cursor:pointer;margin-right:6px;">Transverse (x)</button>' +
      '<button id="phonon-btn-ty" class="phonon-pol-btn" style="padding:3px 12px;font-size:11px;cursor:pointer;">Transverse (y)</button>';
    parent.appendChild(controls);
  }

  function setActive(id) {
    document.querySelectorAll('.phonon-pol-btn').forEach(b => {
      b.style.fontWeight = b.id === id ? 'bold' : 'normal';
      b.style.background = b.id === id ? '#0f766e' : '';
      b.style.color = b.id === id ? '#fff' : '';
    });
  }

  document.getElementById('phonon-btn-long')?.addEventListener('click', () => { mode = 'longitudinal'; setActive('phonon-btn-long'); });
  document.getElementById('phonon-btn-tx')?.addEventListener('click', () => { mode = 'transverse-x'; setActive('phonon-btn-tx'); });
  document.getElementById('phonon-btn-ty')?.addEventListener('click', () => { mode = 'transverse-y'; setActive('phonon-btn-ty'); });
  setActive('phonon-btn-long');

  // Lattice parameters
  const nRows = 7;
  const nCols = 9;
  const spacingX = W / (nCols + 1);
  const spacingY = H / (nRows + 2);
  const amp = spacingX * 0.28;
  const k = 2 * Math.PI / (spacingX * 3.5);
  const omega = 2.2;
  const atomR = Math.min(spacingX, spacingY) * 0.16;

  // 3D isometric projection for depth effect
  // "into screen" (y-axis in physics) is rendered as slight diagonal offset
  const depthX = 0.35;
  const depthY = 0.25;

  function tick() {
    if (!canvas.isConnected) return;
    t += 0.03;
    wClear(ctx, W, H);
    draw();
    requestAnimationFrame(tick);
  }

  function draw() {
    ctx.fillStyle = WCOLORS.text; ctx.font = 'bold 12px system-ui'; ctx.textAlign = 'center';
    const labels = { 'longitudinal': 'Longitudinal phonon (displacement ∥ k)', 'transverse-x': 'Transverse phonon (displacement ⊥ k, horizontal)', 'transverse-y': 'Transverse phonon (displacement ⊥ k, vertical)' };
    ctx.fillText(labels[mode], W / 2, 16);

    // Propagation arrow
    ctx.fillStyle = WCOLORS.textDim; ctx.font = '10px system-ui'; ctx.textAlign = 'left';
    ctx.fillText('k →', W - 50, H - 10);

    // Draw bonds and atoms
    const positions = [];
    for (let row = 0; row < nRows; row++) {
      positions[row] = [];
      for (let col = 0; col < nCols; col++) {
        const baseX = spacingX * (col + 1);
        const baseY = spacingY * (row + 1.5);
        const phase = k * baseX - omega * t;
        const disp = amp * Math.sin(phase);

        let dx = 0, dy = 0;
        if (mode === 'longitudinal') {
          dx = disp; // displacement along propagation (z mapped to screen-x)
        } else if (mode === 'transverse-x') {
          // horizontal transverse: displacement perpendicular in screen plane
          // show as "into/out of screen" with size+opacity change
          const d = disp;
          dx = d * depthX;
          dy = d * depthY;
        } else {
          dy = disp; // vertical transverse
        }

        positions[row][col] = { x: baseX + dx, y: baseY + dy };
      }
    }

    // Draw horizontal bonds
    ctx.strokeStyle = WCOLORS.grid; ctx.lineWidth = 1;
    for (let row = 0; row < nRows; row++) {
      for (let col = 0; col < nCols - 1; col++) {
        const a = positions[row][col], b = positions[row][col + 1];
        ctx.globalAlpha = 0.5;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      }
    }
    // Draw vertical bonds
    for (let row = 0; row < nRows - 1; row++) {
      for (let col = 0; col < nCols; col++) {
        const a = positions[row][col], b = positions[row + 1][col];
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      }
    }
    ctx.globalAlpha = 1;

    // Draw atoms
    for (let row = 0; row < nRows; row++) {
      for (let col = 0; col < nCols; col++) {
        const p = positions[row][col];
        const baseX = spacingX * (col + 1);
        const phase = k * baseX - omega * t;
        const disp = Math.sin(phase);

        // Color atoms by displacement for visual clarity
        let r, g, b;
        if (mode === 'longitudinal') {
          // Teal for positive displacement, amber for negative
          const f = (disp + 1) / 2; // 0 to 1
          r = Math.round(15 + f * (217 - 15));
          g = Math.round(118 + f * (119 - 118));
          b = Math.round(110 + f * (6 - 110));
        } else if (mode === 'transverse-x') {
          // Blue-ish for into screen, red-ish for out
          const f = (disp + 1) / 2;
          r = Math.round(37 + f * (220 - 37));
          g = Math.round(99 + f * (38 - 99));
          b = Math.round(235 + f * (38 - 235));
        } else {
          const f = (disp + 1) / 2;
          r = Math.round(15 + f * (217 - 15));
          g = Math.round(118 + f * (119 - 118));
          b = Math.round(110 + f * (6 - 110));
        }

        // Size variation for transverse-x to suggest depth
        let drawR = atomR;
        if (mode === 'transverse-x') {
          drawR = atomR * (1 + 0.25 * disp);
        }

        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.beginPath(); ctx.arc(p.x, p.y, drawR, 0, 2 * Math.PI); ctx.fill();
        ctx.strokeStyle = 'rgba(0,0,0,0.15)'; ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }

    // Draw displacement arrows on a few atoms in the middle row
    const midRow = Math.floor(nRows / 2);
    const arrowCols = [2, 4, 6];
    for (const col of arrowCols) {
      const baseX = spacingX * (col + 1);
      const baseY = spacingY * (midRow + 1.5);
      const phase = k * baseX - omega * t;
      const disp = amp * Math.sin(phase);
      const p = positions[midRow][col];

      if (Math.abs(disp) > amp * 0.15) {
        ctx.strokeStyle = WCOLORS.red; ctx.lineWidth = 1.5;
        ctx.beginPath();
        if (mode === 'longitudinal') {
          ctx.moveTo(baseX, baseY - atomR - 3);
          ctx.lineTo(baseX + disp, baseY - atomR - 3);
          // arrowhead
          const sign = disp > 0 ? 1 : -1;
          ctx.lineTo(baseX + disp - sign * 4, baseY - atomR - 7);
          ctx.moveTo(baseX + disp, baseY - atomR - 3);
          ctx.lineTo(baseX + disp - sign * 4, baseY - atomR + 1);
        } else if (mode === 'transverse-y') {
          ctx.moveTo(baseX + atomR + 3, baseY);
          ctx.lineTo(baseX + atomR + 3, baseY + disp);
          const sign = disp > 0 ? 1 : -1;
          ctx.lineTo(baseX + atomR - 1, baseY + disp - sign * 4);
          ctx.moveTo(baseX + atomR + 3, baseY + disp);
          ctx.lineTo(baseX + atomR + 7, baseY + disp - sign * 4);
        } else {
          // transverse-x: draw a circle+dot or circle+cross for into/out of screen
          const cx = baseX - atomR - 8;
          const cy = baseY;
          const cr = 5;
          ctx.beginPath(); ctx.arc(cx, cy, cr, 0, 2 * Math.PI); ctx.stroke();
          if (disp > 0) {
            // out of screen: dot
            ctx.fillStyle = WCOLORS.red;
            ctx.beginPath(); ctx.arc(cx, cy, 1.5, 0, 2 * Math.PI); ctx.fill();
          } else {
            // into screen: cross
            ctx.beginPath(); ctx.moveTo(cx - 3, cy - 3); ctx.lineTo(cx + 3, cy + 3); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(cx + 3, cy - 3); ctx.lineTo(cx - 3, cy + 3); ctx.stroke();
          }
        }
        ctx.stroke();
      }
    }
  }

  tick();
}

// =========================================================================
function initLinearPolarization() {
  const canvas = document.getElementById('scene-linear-polarization');
  if (!canvas) return;
  const setup = wSetupCanvas(canvas);
  if (!setup) return;
  const { ctx, W, H } = setup;

  let angleSlider = document.getElementById('linear-pol-angle');

  let t = 0;

  // 3D oblique projection parameters
  const cx = W * 0.38, cy = H / 2;
  const axisLen = W * 0.30;
  const amp = 50;
  // projK: propagation direction (into screen, angled right-down)
  const projK = { x: 0.85, y: 0.30 };
  // projE: "up" direction on screen (electric field default vertical)
  const projE = { x: 0, y: -1 };
  // projB: "sideways" direction (magnetic field, into screen perspective)
  const projB = { x: -0.45, y: 0.20 };

  function to2D(kk, e, b) {
    return {
      x: cx + kk * projK.x * axisLen + e * projE.x * amp + b * projB.x * amp,
      y: cy + kk * projK.y * axisLen + e * projE.y * amp + b * projB.y * amp
    };
  }

  function drawArrowhead(fx, fy, tx, ty, color, size) {
    const dx = tx - fx, dy = ty - fy;
    const len = Math.sqrt(dx * dx + dy * dy);
    if (len < 2) return;
    const ux = dx / len, uy = dy / len;
    const px = -uy, py = ux;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(tx, ty);
    ctx.lineTo(tx - ux * size + px * size * 0.4, ty - uy * size + py * size * 0.4);
    ctx.lineTo(tx - ux * size - px * size * 0.4, ty - uy * size - py * size * 0.4);
    ctx.closePath();
    ctx.fill();
  }

  function tick() {
    if (!canvas.isConnected) return;
    t += 0.03;
    wClear(ctx, W, H);
    draw();
    requestAnimationFrame(tick);
  }

  function draw() {
    const theta = parseFloat(angleSlider?.value || 0) * Math.PI / 180;
    const valEl = document.getElementById('linear-pol-angle-val');
    if (valEl) valEl.textContent = Math.round(theta * 180 / Math.PI) + '°';

    const cosT = Math.cos(theta), sinT = Math.sin(theta);
    const nWave = 1.5; // number of wavelengths visible

    // --- Draw propagation (k) axis ---
    const kStart = to2D(-1.15, 0, 0);
    const kEnd = to2D(1.25, 0, 0);
    ctx.strokeStyle = WCOLORS.textDim; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(kStart.x, kStart.y); ctx.lineTo(kEnd.x, kEnd.y); ctx.stroke();
    ctx.fillStyle = WCOLORS.text; ctx.font = 'bold 12px system-ui'; ctx.textAlign = 'left';
    ctx.fillText('k', kEnd.x + 5, kEnd.y);

    // --- E-field (teal): oscillates in the plane defined by theta ---
    // E direction in 3D: cosT * "up" + sinT * "sideways"
    const nPts = 200;
    const nArrows = 22;

    // E-field envelope curve
    ctx.strokeStyle = WCOLORS.teal; ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i <= nPts; i++) {
      const kk = -1 + 2 * i / nPts;
      const phase = 2 * Math.PI * kk * nWave - t * 2;
      const val = Math.sin(phase);
      const eComp = val * cosT; // vertical component
      const bComp = val * sinT; // sideways component (for rotated E)
      const p = to2D(kk, eComp * 0.85, bComp * 0.85);
      if (i === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
    }
    ctx.stroke();

    // E-field arrows
    for (let i = 0; i <= nArrows; i++) {
      const kk = -1 + 2 * i / nArrows;
      const phase = 2 * Math.PI * kk * nWave - t * 2;
      const val = Math.sin(phase);
      const eComp = val * cosT;
      const bComp = val * sinT;
      const base = to2D(kk, 0, 0);
      const tip = to2D(kk, eComp * 0.85, bComp * 0.85);
      ctx.strokeStyle = WCOLORS.teal; ctx.lineWidth = 1; ctx.globalAlpha = 0.4;
      ctx.beginPath(); ctx.moveTo(base.x, base.y); ctx.lineTo(tip.x, tip.y); ctx.stroke();
      ctx.globalAlpha = 1;
    }

    // --- B-field (amber): perpendicular to E and k ---
    // B is rotated 90° from E in the transverse plane: -sinT * "up" + cosT * "sideways"
    ctx.strokeStyle = WCOLORS.amber; ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i <= nPts; i++) {
      const kk = -1 + 2 * i / nPts;
      const phase = 2 * Math.PI * kk * nWave - t * 2;
      const val = Math.sin(phase);
      const eComp = -val * sinT; // vertical component of B
      const bComp = val * cosT;  // sideways component of B
      const p = to2D(kk, eComp * 0.55, bComp * 0.55);
      if (i === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
    }
    ctx.stroke();

    // B-field arrows
    for (let i = 0; i <= nArrows; i++) {
      const kk = -1 + 2 * i / nArrows;
      const phase = 2 * Math.PI * kk * nWave - t * 2;
      const val = Math.sin(phase);
      const eComp = -val * sinT;
      const bComp = val * cosT;
      const base = to2D(kk, 0, 0);
      const tip = to2D(kk, eComp * 0.55, bComp * 0.55);
      ctx.strokeStyle = WCOLORS.amber; ctx.lineWidth = 1; ctx.globalAlpha = 0.3;
      ctx.beginPath(); ctx.moveTo(base.x, base.y); ctx.lineTo(tip.x, tip.y); ctx.stroke();
      ctx.globalAlpha = 1;
    }

    // --- Snapshot arrows at k=0 with arrowheads ---
    const phase0 = -t * 2;
    const val0 = Math.sin(phase0);
    // E arrow
    const eBase = to2D(0, 0, 0);
    const eTip = to2D(0, val0 * cosT * 0.85, val0 * sinT * 0.85);
    ctx.strokeStyle = WCOLORS.teal; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(eBase.x, eBase.y); ctx.lineTo(eTip.x, eTip.y); ctx.stroke();
    drawArrowhead(eBase.x, eBase.y, eTip.x, eTip.y, WCOLORS.teal, 7);
    // B arrow
    const bTip = to2D(0, -val0 * sinT * 0.55, val0 * cosT * 0.55);
    ctx.strokeStyle = WCOLORS.amber; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(eBase.x, eBase.y); ctx.lineTo(bTip.x, bTip.y); ctx.stroke();
    drawArrowhead(eBase.x, eBase.y, bTip.x, bTip.y, WCOLORS.amber, 7);

    // --- Legend ---
    const lgX = W * 0.78, lgY = H * 0.30;
    ctx.font = 'bold 13px system-ui'; ctx.textAlign = 'left';
    ctx.fillStyle = WCOLORS.teal;
    ctx.fillText('E', lgX + 18, lgY);
    ctx.strokeStyle = WCOLORS.teal; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(lgX - 8, lgY - 4); ctx.lineTo(lgX + 12, lgY - 4); ctx.stroke();

    ctx.fillStyle = WCOLORS.amber;
    ctx.fillText('B/c', lgX + 18, lgY + 22);
    ctx.strokeStyle = WCOLORS.amber; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(lgX - 8, lgY + 18); ctx.lineTo(lgX + 12, lgY + 18); ctx.stroke();

    ctx.fillStyle = WCOLORS.textDim; ctx.font = '10px system-ui';
    ctx.fillText('θ = ' + Math.round(theta * 180 / Math.PI) + '°', lgX - 8, lgY + 44);

    // --- Cross-section view (right side) ---
    const cxR = W * 0.82, cyR = H * 0.68;
    const radius = 38;

    ctx.strokeStyle = WCOLORS.grid; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(cxR, cyR, radius, 0, 2 * Math.PI); ctx.stroke();

    // Axes
    ctx.strokeStyle = WCOLORS.textDim; ctx.lineWidth = 0.5;
    ctx.beginPath(); ctx.moveTo(cxR - radius - 6, cyR); ctx.lineTo(cxR + radius + 6, cyR); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cxR, cyR - radius - 6); ctx.lineTo(cxR, cyR + radius + 6); ctx.stroke();

    // E direction line (dashed)
    const eAng = -theta + Math.PI / 2; // angle from horizontal
    ctx.strokeStyle = WCOLORS.teal; ctx.lineWidth = 1.5; ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(cxR - (radius + 4) * Math.cos(eAng), cyR - (radius + 4) * Math.sin(eAng));
    ctx.lineTo(cxR + (radius + 4) * Math.cos(eAng), cyR + (radius + 4) * Math.sin(eAng));
    ctx.stroke();
    ctx.setLineDash([]);

    // B direction line (dashed) - perpendicular to E
    const bAng = eAng + Math.PI / 2;
    ctx.strokeStyle = WCOLORS.amber; ctx.lineWidth = 1.5; ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(cxR - (radius + 4) * Math.cos(bAng), cyR - (radius + 4) * Math.sin(bAng));
    ctx.lineTo(cxR + (radius + 4) * Math.cos(bAng), cyR + (radius + 4) * Math.sin(bAng));
    ctx.stroke();
    ctx.setLineDash([]);

    // Current E vector
    const eNow = Math.sin(phase0);
    const eTipX = cxR + eNow * radius * 0.8 * Math.cos(eAng);
    const eTipY = cyR + eNow * radius * 0.8 * Math.sin(eAng);
    ctx.strokeStyle = WCOLORS.teal; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(cxR, cyR); ctx.lineTo(eTipX, eTipY); ctx.stroke();
    ctx.fillStyle = WCOLORS.teal;
    ctx.beginPath(); ctx.arc(eTipX, eTipY, 3, 0, 2 * Math.PI); ctx.fill();

    // Current B vector
    const bTipX = cxR + eNow * radius * 0.8 * Math.cos(bAng);
    const bTipY = cyR + eNow * radius * 0.8 * Math.sin(bAng);
    ctx.strokeStyle = WCOLORS.amber; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(cxR, cyR); ctx.lineTo(bTipX, bTipY); ctx.stroke();
    ctx.fillStyle = WCOLORS.amber;
    ctx.beginPath(); ctx.arc(bTipX, bTipY, 3, 0, 2 * Math.PI); ctx.fill();

    // Labels
    ctx.font = 'bold 11px system-ui'; ctx.textAlign = 'center';
    ctx.fillStyle = WCOLORS.teal;
    ctx.fillText('E', eTipX + (eNow >= 0 ? 10 : -10), eTipY - 6);
    ctx.fillStyle = WCOLORS.amber;
    ctx.fillText('B', bTipX + (eNow >= 0 ? 10 : -10), bTipY - 6);
    ctx.fillStyle = WCOLORS.textDim; ctx.font = '10px system-ui';
    ctx.fillText('End-on view', cxR, cyR + radius + 18);
  }

  tick();
}

// =========================================================================
function initCircularPolarization() {
  const canvas = document.getElementById('scene-circular-polarization');
  if (!canvas) return;
  const setup = wSetupCanvas(canvas);
  if (!setup) return;
  const { ctx, W, H } = setup;

  let handedness = 1; // 1 = RCP, -1 = LCP
  let t = 0;

  let toggleBtn = document.getElementById('circ-pol-toggle');
  toggleBtn?.addEventListener('click', () => {
    handedness *= -1;
    toggleBtn.textContent = handedness > 0 ? 'RCP (right-circular)' : 'LCP (left-circular)';
  });

  // 3D oblique projection
  const cx = W * 0.38, cy = H / 2;
  const axisLen = W * 0.30;
  const amp = 45;
  const projK = { x: 0.85, y: 0.30 };
  const projE = { x: 0, y: -1 };
  const projB = { x: -0.45, y: 0.20 };

  function to2D(kk, e, b) {
    return {
      x: cx + kk * projK.x * axisLen + e * projE.x * amp + b * projB.x * amp,
      y: cy + kk * projK.y * axisLen + e * projE.y * amp + b * projB.y * amp
    };
  }

  function drawArrowhead(fx, fy, tx, ty, color, size) {
    const dx = tx - fx, dy = ty - fy;
    const len = Math.sqrt(dx * dx + dy * dy);
    if (len < 2) return;
    const ux = dx / len, uy = dy / len;
    const px = -uy, py = ux;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(tx, ty);
    ctx.lineTo(tx - ux * size + px * size * 0.4, ty - uy * size + py * size * 0.4);
    ctx.lineTo(tx - ux * size - px * size * 0.4, ty - uy * size - py * size * 0.4);
    ctx.closePath();
    ctx.fill();
  }

  function tick() {
    if (!canvas.isConnected) return;
    t += 0.03;
    wClear(ctx, W, H);
    draw();
    requestAnimationFrame(tick);
  }

  function draw() {
    const nWave = 1.5;
    const nPts = 200;
    const nArrows = 22;

    // k axis
    const kStart = to2D(-1.15, 0, 0);
    const kEnd = to2D(1.25, 0, 0);
    ctx.strokeStyle = WCOLORS.textDim; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(kStart.x, kStart.y); ctx.lineTo(kEnd.x, kEnd.y); ctx.stroke();
    ctx.fillStyle = WCOLORS.text; ctx.font = 'bold 12px system-ui'; ctx.textAlign = 'left';
    ctx.fillText('k', kEnd.x + 5, kEnd.y);

    // --- E-field helix (teal) ---
    ctx.strokeStyle = WCOLORS.teal; ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i <= nPts; i++) {
      const kk = -1 + 2 * i / nPts;
      const phase = 2 * Math.PI * kk * nWave - t * 2;
      const eUp = Math.cos(phase);
      const eSide = handedness * Math.sin(phase);
      const p = to2D(kk, eUp * 0.8, eSide * 0.8);
      if (i === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
    }
    ctx.stroke();

    // E arrows
    for (let i = 0; i <= nArrows; i++) {
      const kk = -1 + 2 * i / nArrows;
      const phase = 2 * Math.PI * kk * nWave - t * 2;
      const eUp = Math.cos(phase);
      const eSide = handedness * Math.sin(phase);
      const base = to2D(kk, 0, 0);
      const tip = to2D(kk, eUp * 0.8, eSide * 0.8);
      ctx.strokeStyle = WCOLORS.teal; ctx.lineWidth = 1; ctx.globalAlpha = 0.35;
      ctx.beginPath(); ctx.moveTo(base.x, base.y); ctx.lineTo(tip.x, tip.y); ctx.stroke();
      ctx.globalAlpha = 1;
    }

    // --- B-field helix (amber) - perpendicular to E ---
    ctx.strokeStyle = WCOLORS.amber; ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i <= nPts; i++) {
      const kk = -1 + 2 * i / nPts;
      const phase = 2 * Math.PI * kk * nWave - t * 2;
      const bUp = -handedness * Math.sin(phase);
      const bSide = Math.cos(phase);
      const p = to2D(kk, bUp * 0.5, bSide * 0.5);
      if (i === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
    }
    ctx.stroke();

    // B arrows
    for (let i = 0; i <= nArrows; i++) {
      const kk = -1 + 2 * i / nArrows;
      const phase = 2 * Math.PI * kk * nWave - t * 2;
      const bUp = -handedness * Math.sin(phase);
      const bSide = Math.cos(phase);
      const base = to2D(kk, 0, 0);
      const tip = to2D(kk, bUp * 0.5, bSide * 0.5);
      ctx.strokeStyle = WCOLORS.amber; ctx.lineWidth = 1; ctx.globalAlpha = 0.25;
      ctx.beginPath(); ctx.moveTo(base.x, base.y); ctx.lineTo(tip.x, tip.y); ctx.stroke();
      ctx.globalAlpha = 1;
    }

    // --- Snapshot arrows at k=0 ---
    const phase0 = -t * 2;
    const eBase = to2D(0, 0, 0);

    // E arrow
    const eTip = to2D(0, Math.cos(phase0) * 0.8, handedness * Math.sin(phase0) * 0.8);
    ctx.strokeStyle = WCOLORS.teal; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(eBase.x, eBase.y); ctx.lineTo(eTip.x, eTip.y); ctx.stroke();
    drawArrowhead(eBase.x, eBase.y, eTip.x, eTip.y, WCOLORS.teal, 7);

    // B arrow
    const bTip = to2D(0, -handedness * Math.sin(phase0) * 0.5, Math.cos(phase0) * 0.5);
    ctx.strokeStyle = WCOLORS.amber; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(eBase.x, eBase.y); ctx.lineTo(bTip.x, bTip.y); ctx.stroke();
    drawArrowhead(eBase.x, eBase.y, bTip.x, bTip.y, WCOLORS.amber, 7);

    // --- Legend ---
    const lgX = W * 0.78, lgY = H * 0.22;
    ctx.font = 'bold 13px system-ui'; ctx.textAlign = 'left';
    ctx.fillStyle = WCOLORS.teal;
    ctx.fillText('E', lgX + 18, lgY);
    ctx.strokeStyle = WCOLORS.teal; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(lgX - 8, lgY - 4); ctx.lineTo(lgX + 12, lgY - 4); ctx.stroke();

    ctx.fillStyle = WCOLORS.amber;
    ctx.fillText('B/c', lgX + 18, lgY + 20);
    ctx.strokeStyle = WCOLORS.amber; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(lgX - 8, lgY + 16); ctx.lineTo(lgX + 12, lgY + 16); ctx.stroke();

    ctx.fillStyle = WCOLORS.textDim; ctx.font = '10px system-ui';
    ctx.fillText(handedness > 0 ? 'Right-circular' : 'Left-circular', lgX - 8, lgY + 40);

    // --- Cross-section circle (right side) ---
    const cxR = W * 0.82, cyR = H * 0.68;
    const radius = 38;

    ctx.strokeStyle = WCOLORS.grid; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(cxR, cyR, radius, 0, 2 * Math.PI); ctx.stroke();

    // Axes
    ctx.strokeStyle = WCOLORS.textDim; ctx.lineWidth = 0.5;
    ctx.beginPath(); ctx.moveTo(cxR - radius - 6, cyR); ctx.lineTo(cxR + radius + 6, cyR); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cxR, cyR - radius - 6); ctx.lineTo(cxR, cyR + radius + 6); ctx.stroke();

    // E trail (circle)
    ctx.strokeStyle = WCOLORS.teal; ctx.lineWidth = 1.5; ctx.globalAlpha = 0.2;
    ctx.beginPath(); ctx.arc(cxR, cyR, radius * 0.75, 0, 2 * Math.PI); ctx.stroke();
    ctx.globalAlpha = 1;

    // B trail (smaller circle)
    ctx.strokeStyle = WCOLORS.amber; ctx.lineWidth = 1.5; ctx.globalAlpha = 0.15;
    ctx.beginPath(); ctx.arc(cxR, cyR, radius * 0.48, 0, 2 * Math.PI); ctx.stroke();
    ctx.globalAlpha = 1;

    // Current E vector in cross section
    const csEx = radius * 0.75 * Math.cos(phase0);
    const csEy = radius * 0.75 * handedness * Math.sin(phase0);
    ctx.strokeStyle = WCOLORS.teal; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(cxR, cyR); ctx.lineTo(cxR + csEx, cyR - csEy); ctx.stroke();
    ctx.fillStyle = WCOLORS.teal;
    ctx.beginPath(); ctx.arc(cxR + csEx, cyR - csEy, 3, 0, 2 * Math.PI); ctx.fill();

    // Current B vector in cross section (perpendicular to E)
    const csBx = radius * 0.48 * (-handedness * Math.sin(phase0));
    const csBy = radius * 0.48 * Math.cos(phase0);
    ctx.strokeStyle = WCOLORS.amber; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(cxR, cyR); ctx.lineTo(cxR + csBx, cyR - csBy); ctx.stroke();
    ctx.fillStyle = WCOLORS.amber;
    ctx.beginPath(); ctx.arc(cxR + csBx, cyR - csBy, 3, 0, 2 * Math.PI); ctx.fill();

    // Rotation arrow
    const arrPhase = phase0 + 0.4 * handedness;
    const arrX = cxR + radius * 0.35 * Math.cos(arrPhase);
    const arrY = cyR - radius * 0.35 * handedness * Math.sin(arrPhase);
    ctx.fillStyle = WCOLORS.textDim; ctx.font = '14px system-ui'; ctx.textAlign = 'center';
    ctx.fillText(handedness > 0 ? '↻' : '↺', arrX, arrY);

    // Labels
    ctx.font = 'bold 11px system-ui';
    ctx.fillStyle = WCOLORS.teal;
    ctx.fillText('E', cxR + csEx + 10, cyR - csEy - 4);
    ctx.fillStyle = WCOLORS.amber;
    ctx.fillText('B', cxR + csBx + 10, cyR - csBy - 4);
    ctx.fillStyle = WCOLORS.textDim; ctx.font = '10px system-ui';
    ctx.fillText('End-on view', cxR, cyR + radius + 18);
  }

  tick();
}

// =========================================================================
function initMalusLaw() {
  const canvas = document.getElementById('scene-malus-law');
  if (!canvas) return;
  const setup = wSetupCanvas(canvas);
  if (!setup) return;
  const { ctx, W, H } = setup;

  let thetaDeg = 30;
  let dragging = false;
  let t = 0;

  const cy = H * 0.46;
  const lightSourceX = 30;
  const pol1X = W * 0.22;
  const pol2X = W * 0.50;
  const screenX = W * 0.78;
  const polR = 48;

  let dragStartX = 0;
  let dragStartTheta = 0;

  canvas.addEventListener('mousedown', (e) => {
    dragging = true;
    dragStartX = e.clientX;
    dragStartTheta = thetaDeg;
    canvas.style.cursor = 'ew-resize';
  });
  canvas.addEventListener('mousemove', (e) => {
    if (!dragging) return;
    const dx = e.clientX - dragStartX;
    thetaDeg = Math.round(Math.max(0, Math.min(90, dragStartTheta + dx * 0.5)));
  });
  canvas.addEventListener('mouseup', () => { dragging = false; canvas.style.cursor = ''; });
  canvas.addEventListener('mouseleave', () => { dragging = false; canvas.style.cursor = ''; });
  canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    dragging = true;
    dragStartX = e.touches[0].clientX;
    dragStartTheta = thetaDeg;
  }, { passive: false });
  canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    if (!dragging) return;
    const dx = e.touches[0].clientX - dragStartX;
    thetaDeg = Math.round(Math.max(0, Math.min(90, dragStartTheta + dx * 0.5)));
  }, { passive: false });
  canvas.addEventListener('touchend', () => { dragging = false; });

  function tick() {
    if (!canvas.isConnected) return;
    t += 0.04;
    wClear(ctx, W, H);
    draw();
    requestAnimationFrame(tick);
  }

  function drawPolaroidDisc(cx, cyy, r, axisAngleRad, label, highlight) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cyy, r, 0, 2 * Math.PI);
    ctx.fillStyle = highlight ? 'rgba(100,120,140,0.18)' : 'rgba(100,120,140,0.12)';
    ctx.fill();
    ctx.strokeStyle = highlight ? WCOLORS.teal : WCOLORS.axis;
    ctx.lineWidth = highlight ? 2.5 : 1.5;
    ctx.stroke();

    // Transmission axis
    ctx.strokeStyle = highlight ? WCOLORS.teal : WCOLORS.amber;
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 4]);
    ctx.beginPath();
    ctx.moveTo(cx + r * 0.9 * Math.sin(axisAngleRad), cyy - r * 0.9 * Math.cos(axisAngleRad));
    ctx.lineTo(cx - r * 0.9 * Math.sin(axisAngleRad), cyy + r * 0.9 * Math.cos(axisAngleRad));
    ctx.stroke();
    ctx.setLineDash([]);

    // Slit texture
    ctx.strokeStyle = 'rgba(80,100,110,0.15)';
    ctx.lineWidth = 1;
    for (let off = -r * 0.7; off <= r * 0.7; off += 8) {
      const perpX = Math.cos(axisAngleRad) * off;
      const perpY = Math.sin(axisAngleRad) * off;
      const halfLen = Math.sqrt(Math.max(0, r * r * 0.65 - off * off));
      const dx = Math.sin(axisAngleRad) * halfLen;
      const dy = -Math.cos(axisAngleRad) * halfLen;
      ctx.beginPath();
      ctx.moveTo(cx + perpX - dx, cyy + perpY - dy);
      ctx.lineTo(cx + perpX + dx, cyy + perpY + dy);
      ctx.stroke();
    }

    ctx.fillStyle = WCOLORS.text;
    ctx.font = '11px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText(label, cx, cyy + r + 16);
    ctx.restore();
  }

  function draw() {
    const theta = thetaDeg * Math.PI / 180;
    const I = Math.cos(theta) * Math.cos(theta);

    ctx.fillStyle = WCOLORS.text; ctx.font = 'bold 12px system-ui'; ctx.textAlign = 'center';
    ctx.fillText("Malus' Law: I = I₀ cos²θ", W / 2, 16);

    // ---- Unpolarized light source ----
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath(); ctx.arc(lightSourceX, cy, 10, 0, 2 * Math.PI); ctx.fill();
    ctx.strokeStyle = '#d97706'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(lightSourceX, cy, 10, 0, 2 * Math.PI); ctx.stroke();
    ctx.strokeStyle = 'rgba(245,158,11,0.5)'; ctx.lineWidth = 1;
    for (let a = 0; a < Math.PI * 2; a += Math.PI / 5) {
      ctx.beginPath();
      ctx.moveTo(lightSourceX + 12 * Math.cos(a), cy + 12 * Math.sin(a));
      ctx.lineTo(lightSourceX + 18 * Math.cos(a), cy + 18 * Math.sin(a));
      ctx.stroke();
    }
    ctx.fillStyle = WCOLORS.text; ctx.font = '10px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('Unpolarized', lightSourceX, cy + 28);
    ctx.fillText('light', lightSourceX, cy + 39);

    // ---- Beam: source → polarizer 1 (unpolarized) ----
    const seg1L = lightSourceX + 20, seg1R = pol1X - polR - 4;
    ctx.lineWidth = 1.5;
    for (let i = 0; i < 6; i++) {
      const frac = (i + 0.5) / 6;
      const bx = seg1L + frac * (seg1R - seg1L);
      const angle = (i * Math.PI / 6) + t * 0.5;
      const amp = 8 * Math.sin(t * 3 - i * 1.2);
      const dx = amp * Math.cos(angle);
      const dy = amp * Math.sin(angle);
      const hue = (i * 40 + 200) % 360;
      ctx.strokeStyle = `hsla(${hue}, 60%, 50%, 0.6)`;
      ctx.beginPath();
      ctx.moveTo(bx - dx, cy - dy);
      ctx.lineTo(bx + dx, cy + dy);
      ctx.stroke();
    }
    ctx.strokeStyle = 'rgba(31,42,46,0.15)'; ctx.lineWidth = 1;
    ctx.setLineDash([3, 5]);
    ctx.beginPath(); ctx.moveTo(seg1L, cy); ctx.lineTo(seg1R, cy); ctx.stroke();
    ctx.setLineDash([]);

    // ---- First polarizer (fixed vertical) ----
    drawPolaroidDisc(pol1X, cy, polR, 0, 'Polarizer', false);

    // ---- Beam: polarizer 1 → analyzer (vertically polarized) ----
    const seg2L = pol1X + polR + 4, seg2R = pol2X - polR - 4;
    ctx.strokeStyle = WCOLORS.blue; ctx.lineWidth = 2;
    for (let i = 0; i < 5; i++) {
      const frac = (i + 0.5) / 5;
      const bx = seg2L + frac * (seg2R - seg2L);
      const amp = 10 * Math.sin(t * 3 - i * 1.5);
      ctx.beginPath();
      ctx.moveTo(bx, cy - amp);
      ctx.lineTo(bx, cy + amp);
      ctx.stroke();
    }
    ctx.strokeStyle = 'rgba(31,42,46,0.15)'; ctx.lineWidth = 1;
    ctx.setLineDash([3, 5]);
    ctx.beginPath(); ctx.moveTo(seg2L, cy); ctx.lineTo(seg2R, cy); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = WCOLORS.blue; ctx.font = '10px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('I₀ (vertical)', (seg2L + seg2R) / 2, cy - 18);

    // ---- Analyzer (rotatable) ----
    drawPolaroidDisc(pol2X, cy, polR, theta, 'Analyzer (θ=' + thetaDeg + '°)', true);

    // Angle arc
    if (thetaDeg > 2) {
      ctx.strokeStyle = WCOLORS.teal; ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(pol2X, cy, polR * 0.45, -Math.PI / 2, -Math.PI / 2 + theta);
      ctx.stroke();
      const midAng = -Math.PI / 2 + theta / 2;
      ctx.fillStyle = WCOLORS.teal; ctx.font = 'bold 12px system-ui'; ctx.textAlign = 'center';
      ctx.fillText('θ', pol2X + (polR * 0.55) * Math.cos(midAng), cy + (polR * 0.55) * Math.sin(midAng) + 4);
    }

    if (!dragging) {
      ctx.fillStyle = WCOLORS.textDim; ctx.font = '9px system-ui'; ctx.textAlign = 'center';
      ctx.fillText('drag left / right to rotate analyzer', pol2X, cy + polR + 28);
    }

    // ---- Beam: analyzer → screen ----
    const seg3L = pol2X + polR + 4, seg3R = screenX - 10;
    if (I > 0.005) {
      ctx.lineWidth = 2;
      for (let i = 0; i < 5; i++) {
        const frac = (i + 0.5) / 5;
        const bx = seg3L + frac * (seg3R - seg3L);
        const amp = 10 * Math.cos(theta) * Math.sin(t * 3 - i * 1.5);
        const dx = amp * Math.sin(theta);
        const dy = -amp * Math.cos(theta);
        ctx.strokeStyle = `rgba(15,118,110,${0.3 + 0.7 * I})`;
        ctx.beginPath();
        ctx.moveTo(bx - dx, cy - dy);
        ctx.lineTo(bx + dx, cy + dy);
        ctx.stroke();
      }
    }
    ctx.strokeStyle = 'rgba(31,42,46,0.15)'; ctx.lineWidth = 1;
    ctx.setLineDash([3, 5]);
    ctx.beginPath(); ctx.moveTo(seg3L, cy); ctx.lineTo(seg3R, cy); ctx.stroke();
    ctx.setLineDash([]);

    // ---- Detection screen ----
    const scrW = 16, scrH = polR * 2 + 10;
    if (I > 0.01) {
      const glowR = 25 + 20 * I;
      const grad = ctx.createRadialGradient(screenX + scrW / 2, cy, 2, screenX + scrW / 2, cy, glowR);
      grad.addColorStop(0, `rgba(15,118,110,${0.4 * I})`);
      grad.addColorStop(1, 'rgba(15,118,110,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(screenX - glowR + scrW / 2, cy - glowR, glowR * 2, glowR * 2);
    }
    const screenBright = Math.floor(230 + 25 * I);
    ctx.fillStyle = `rgb(${screenBright},${screenBright},${screenBright})`;
    ctx.fillRect(screenX, cy - scrH / 2, scrW, scrH);
    ctx.fillStyle = `rgba(15,118,110,${0.35 * I})`;
    ctx.fillRect(screenX, cy - scrH / 2, scrW, scrH);
    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 1;
    ctx.strokeRect(screenX, cy - scrH / 2, scrW, scrH);
    ctx.fillStyle = WCOLORS.text; ctx.font = '10px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('Screen', screenX + scrW / 2, cy + scrH / 2 + 14);

    // ---- Intensity readout ----
    const readoutY = H - 28;
    ctx.fillStyle = WCOLORS.text; ctx.font = '12px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('I = I₀ cos²(' + thetaDeg + '°) = ' + I.toFixed(3) + ' I₀', W / 2, readoutY);

    const barW2 = W * 0.5, barH2 = 10;
    const barL2 = (W - barW2) / 2, barY2 = readoutY + 6;
    ctx.fillStyle = WCOLORS.grid;
    ctx.fillRect(barL2, barY2, barW2, barH2);
    ctx.fillStyle = `rgba(15,118,110,${0.3 + 0.7 * I})`;
    ctx.fillRect(barL2, barY2, barW2 * I, barH2);
    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 0.5;
    ctx.strokeRect(barL2, barY2, barW2, barH2);
  }

  tick();
}

// =========================================================================
// CHAPTER 15 - REFRACTION
// =========================================================================

function initSnellsLawDemo() {
  const canvas = document.getElementById('scene-snells-law-demo');
  if (!canvas) return;
  const setup = wSetupCanvas(canvas);
  if (!setup) return;
  const { ctx, W, H } = setup;

  let theta1Slider = document.getElementById('snell-theta1');
  let nRatioSlider = document.getElementById('snell-nratio');
  if (!theta1Slider) {
    const parent = canvas.parentElement;
    if (parent) {
      const controls = document.createElement('div');
      controls.className = 'scene-controls';
      controls.innerHTML =
        '<label>θ₁: <input type="range" id="snell-theta1" min="0" max="85" step="1" value="30"><span class="scene-val" id="snell-theta1-val">30°</span></label>' +
        '<label style="margin-left:15px;">n₂/n₁: <input type="range" id="snell-nratio" min="0.5" max="3" step="0.05" value="1.5"><span class="scene-val" id="snell-nratio-val">1.50</span></label>';
      parent.appendChild(controls);
      theta1Slider = document.getElementById('snell-theta1');
      nRatioSlider = document.getElementById('snell-nratio');
    }
  }

  function draw() {
    wClear(ctx, W, H);

    const theta1Deg = parseFloat(theta1Slider?.value || 30);
    const nRatio = parseFloat(nRatioSlider?.value || 1.5);
    document.getElementById('snell-theta1-val')?.replaceChildren(document.createTextNode(theta1Deg + '°'));
    document.getElementById('snell-nratio-val')?.replaceChildren(document.createTextNode(nRatio.toFixed(2)));

    const theta1 = theta1Deg * Math.PI / 180;
    const sinTheta2 = Math.sin(theta1) / nRatio;
    const tir = Math.abs(sinTheta2) > 1;
    const theta2 = tir ? Math.PI / 2 : Math.asin(sinTheta2);

    ctx.fillStyle = WCOLORS.text; ctx.font = 'bold 12px system-ui'; ctx.textAlign = 'center';
    ctx.fillText("Snell's law: n₁ sin θ₁ = n₂ sin θ₂", W / 2, 16);

    const intfY = H / 2;
    const hitX = W * 0.45;

    // Medium 1 (top)
    ctx.fillStyle = 'rgba(37, 99, 235, 0.06)';
    ctx.fillRect(0, 28, W, intfY - 28);
    ctx.fillStyle = WCOLORS.blue; ctx.font = '11px system-ui'; ctx.textAlign = 'left';
    ctx.fillText('n₁ = 1.00', 10, 45);

    // Medium 2 (bottom)
    ctx.fillStyle = 'rgba(37, 99, 235, 0.14)';
    ctx.fillRect(0, intfY, W, H - intfY);
    ctx.fillStyle = WCOLORS.blue; ctx.font = '11px system-ui';
    ctx.fillText('n₂ = ' + nRatio.toFixed(2), 10, intfY + 20);

    // Interface
    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0, intfY); ctx.lineTo(W, intfY); ctx.stroke();

    // Normal (dashed)
    ctx.strokeStyle = WCOLORS.textDim; ctx.lineWidth = 1; ctx.setLineDash([4, 4]);
    ctx.beginPath(); ctx.moveTo(hitX, intfY - 100); ctx.lineTo(hitX, intfY + 100); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = WCOLORS.textDim; ctx.font = '11px system-ui'; ctx.textAlign = 'left';
    ctx.fillText('normal', hitX + 4, intfY - 92);

    // Incident ray
    const rayLen = 100;
    const incX = hitX - rayLen * Math.sin(theta1);
    const incY = intfY - rayLen * Math.cos(theta1);
    ctx.strokeStyle = WCOLORS.teal; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(incX, incY); ctx.lineTo(hitX, intfY); ctx.stroke();
    // Arrowhead
    ctx.fillStyle = WCOLORS.teal;
    const aDir = Math.atan2(intfY - incY, hitX - incX);
    ctx.beginPath();
    ctx.moveTo(hitX - 15 * Math.cos(aDir), intfY - 15 * Math.sin(aDir));
    ctx.lineTo(hitX - 15 * Math.cos(aDir) - 6 * Math.cos(aDir - 0.4), intfY - 15 * Math.sin(aDir) - 6 * Math.sin(aDir - 0.4));
    ctx.lineTo(hitX - 15 * Math.cos(aDir) - 6 * Math.cos(aDir + 0.4), intfY - 15 * Math.sin(aDir) - 6 * Math.sin(aDir + 0.4));
    ctx.closePath(); ctx.fill();

    // Refracted ray
    if (!tir) {
      const refX = hitX + rayLen * Math.sin(theta2);
      const refY = intfY + rayLen * Math.cos(theta2);
      ctx.strokeStyle = WCOLORS.amber; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.moveTo(hitX, intfY); ctx.lineTo(refX, refY); ctx.stroke();
      ctx.fillStyle = WCOLORS.amber;
      const rDir = Math.atan2(refY - intfY, refX - hitX);
      ctx.beginPath();
      ctx.moveTo(refX, refY);
      ctx.lineTo(refX - 8 * Math.cos(rDir - 0.3), refY - 8 * Math.sin(rDir - 0.3));
      ctx.lineTo(refX - 8 * Math.cos(rDir + 0.3), refY - 8 * Math.sin(rDir + 0.3));
      ctx.closePath(); ctx.fill();
    }

    // Reflected ray (always present, stronger at TIR)
    const reflX = hitX + rayLen * Math.sin(theta1);
    const reflY = intfY - rayLen * Math.cos(theta1);
    ctx.strokeStyle = WCOLORS.red; ctx.lineWidth = tir ? 2.5 : 1.5;
    ctx.globalAlpha = tir ? 1 : 0.4;
    ctx.beginPath(); ctx.moveTo(hitX, intfY); ctx.lineTo(reflX, reflY); ctx.stroke();
    ctx.globalAlpha = 1;

    // Angle arcs
    const arcR = 30;
    // θ₁ arc
    ctx.strokeStyle = WCOLORS.teal; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(hitX, intfY, arcR, -Math.PI / 2, -Math.PI / 2 + theta1); ctx.stroke();
    ctx.fillStyle = WCOLORS.teal; ctx.font = '11px system-ui'; ctx.textAlign = 'left';
    ctx.fillText('θ₁=' + theta1Deg + '°', hitX + arcR + 5, intfY - arcR + 10);

    // θ₂ arc
    if (!tir) {
      ctx.strokeStyle = WCOLORS.amber; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(hitX, intfY, arcR, Math.PI / 2 - theta2, Math.PI / 2); ctx.stroke();
      const theta2Deg = (theta2 * 180 / Math.PI).toFixed(1);
      ctx.fillStyle = WCOLORS.amber; ctx.font = '11px system-ui';
      ctx.fillText('θ₂=' + theta2Deg + '°', hitX + arcR + 5, intfY + arcR + 5);
    }

    // Equation
    ctx.fillStyle = WCOLORS.text; ctx.font = '11px system-ui'; ctx.textAlign = 'center';
    if (tir) {
      ctx.fillStyle = WCOLORS.red;
      ctx.fillText('Total internal reflection! sin θ₂ > 1', W / 2, H - 10);
    } else {
      const t2d = (theta2 * 180 / Math.PI).toFixed(1);
      ctx.fillText('n₁ sin(' + theta1Deg + '°) = n₂ sin(' + t2d + '°)  →  ' +
        (Math.sin(theta1)).toFixed(3) + ' = ' + (nRatio * Math.sin(theta2)).toFixed(3), W / 2, H - 10);
    }

    // Labels
    ctx.font = '10px system-ui'; ctx.textAlign = 'right';
    ctx.fillStyle = WCOLORS.teal; ctx.fillText('incident', incX + 40, incY + 5);
    if (!tir) {
      ctx.fillStyle = WCOLORS.amber; ctx.textAlign = 'left';
      const refX = hitX + rayLen * Math.sin(theta2);
      const refY = intfY + rayLen * Math.cos(theta2);
      ctx.fillText('refracted', refX - 30, refY - 5);
    }
    ctx.fillStyle = WCOLORS.red; ctx.textAlign = 'left'; ctx.globalAlpha = tir ? 1 : 0.5;
    ctx.fillText('reflected', reflX - 20, reflY + 5);
    ctx.globalAlpha = 1;
  }

  theta1Slider?.addEventListener('input', draw);
  nRatioSlider?.addEventListener('input', draw);
  draw();
}

// =========================================================================
function initTotalInternalReflection() {
  const canvas = document.getElementById('scene-total-internal-reflection');
  if (!canvas) return;
  const setup = wSetupCanvas(canvas);
  if (!setup) return;
  const { ctx, W, H } = setup;

  let angleSlider = document.getElementById('tir-angle');
  if (!angleSlider) {
    const parent = canvas.parentElement;
    if (parent) {
      const controls = document.createElement('div');
      controls.className = 'scene-controls';
      controls.innerHTML = '<label>Angle of incidence: <input type="range" id="tir-angle" min="0" max="85" step="0.5" value="30"><span class="scene-val" id="tir-angle-val">30°</span></label>';
      parent.appendChild(controls);
      angleSlider = document.getElementById('tir-angle');
    }
  }

  const n1 = 1.5, n2 = 1.0; // glass to air
  const critAngle = Math.asin(n2 / n1);
  const critDeg = (critAngle * 180 / Math.PI).toFixed(1);

  function draw() {
    wClear(ctx, W, H);

    const angleDeg = parseFloat(angleSlider?.value || 30);
    const theta1 = angleDeg * Math.PI / 180;
    document.getElementById('tir-angle-val')?.replaceChildren(document.createTextNode(angleDeg + '°'));

    const sinTheta2 = n1 * Math.sin(theta1) / n2;
    const isTIR = sinTheta2 > 1;

    ctx.fillStyle = WCOLORS.text; ctx.font = 'bold 12px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('Total internal reflection', W / 2, 16);

    const intfY = H * 0.45;
    const hitX = W * 0.4;

    // Dense medium (bottom, glass)
    ctx.fillStyle = 'rgba(37, 99, 235, 0.12)';
    ctx.fillRect(0, intfY, W, H - intfY);
    ctx.fillStyle = WCOLORS.blue; ctx.font = '10px system-ui'; ctx.textAlign = 'left';
    ctx.fillText('n₁ = ' + n1.toFixed(1) + ' (glass)', 8, intfY + 18);

    // Light medium (top, air)
    ctx.fillStyle = 'rgba(37, 99, 235, 0.03)';
    ctx.fillRect(0, 28, W, intfY - 28);
    ctx.fillStyle = WCOLORS.blue; ctx.font = '10px system-ui';
    ctx.fillText('n₂ = ' + n2.toFixed(1) + ' (air)', 8, 42);

    // Interface
    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0, intfY); ctx.lineTo(W, intfY); ctx.stroke();

    // Normal
    ctx.strokeStyle = WCOLORS.textDim; ctx.lineWidth = 1; ctx.setLineDash([4, 4]);
    ctx.beginPath(); ctx.moveTo(hitX, intfY - 90); ctx.lineTo(hitX, intfY + 90); ctx.stroke();
    ctx.setLineDash([]);

    const rayLen = 85;

    // Incident ray (from below)
    const incX = hitX - rayLen * Math.sin(theta1);
    const incY = intfY + rayLen * Math.cos(theta1);
    ctx.strokeStyle = WCOLORS.teal; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(incX, incY); ctx.lineTo(hitX, intfY); ctx.stroke();

    // Reflected ray
    const reflX = hitX + rayLen * Math.sin(theta1);
    const reflY = intfY + rayLen * Math.cos(theta1);
    const reflAlpha = isTIR ? 1 : 0.2 + 0.8 * (angleDeg / 90);
    ctx.strokeStyle = WCOLORS.red; ctx.lineWidth = isTIR ? 2.5 : 1.5;
    ctx.globalAlpha = reflAlpha;
    ctx.beginPath(); ctx.moveTo(hitX, intfY); ctx.lineTo(reflX, reflY); ctx.stroke();
    ctx.globalAlpha = 1;

    // Refracted ray (if not TIR)
    if (!isTIR) {
      const theta2 = Math.asin(sinTheta2);
      const refX = hitX + rayLen * Math.sin(theta2);
      const refY = intfY - rayLen * Math.cos(theta2);
      ctx.strokeStyle = WCOLORS.amber; ctx.lineWidth = 2;
      ctx.globalAlpha = 1 - (angleDeg / (critAngle * 180 / Math.PI));
      ctx.beginPath(); ctx.moveTo(hitX, intfY); ctx.lineTo(refX, refY); ctx.stroke();
      ctx.globalAlpha = 1;
    } else {
      // Evanescent wave hint
      ctx.strokeStyle = WCOLORS.amber; ctx.lineWidth = 1.5; ctx.setLineDash([2, 3]);
      ctx.globalAlpha = 0.4;
      for (let d = 0; d < 40; d += 2) {
        const decay = Math.exp(-d * 0.08);
        ctx.globalAlpha = 0.4 * decay;
        ctx.beginPath();
        ctx.moveTo(hitX - 25 + d, intfY - d);
        ctx.lineTo(hitX + 25 + d, intfY - d);
        ctx.stroke();
      }
      ctx.globalAlpha = 1; ctx.setLineDash([]);
      ctx.fillStyle = WCOLORS.amber; ctx.font = '11px system-ui'; ctx.textAlign = 'left';
      ctx.fillText('evanescent wave', hitX + 30, intfY - 20);
    }

    // Angle arcs
    const arcR = 25;
    ctx.strokeStyle = WCOLORS.teal; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(hitX, intfY, arcR, Math.PI / 2, Math.PI / 2 + theta1); ctx.stroke();

    // Critical angle indicator
    ctx.strokeStyle = WCOLORS.red; ctx.lineWidth = 1; ctx.setLineDash([3, 3]);
    ctx.beginPath(); ctx.arc(hitX, intfY, arcR + 8, Math.PI / 2, Math.PI / 2 + critAngle); ctx.stroke();
    ctx.setLineDash([]);

    // Info box (right side)
    const boxX = W * 0.58, boxY = intfY + 15;
    ctx.fillStyle = WCOLORS.text; ctx.font = '11px system-ui'; ctx.textAlign = 'left';
    ctx.fillText('θ₁ = ' + angleDeg + '°', boxX, boxY + 15);
    fillTextSub(ctx, 'θ_c = ' + critDeg + '° = arcsin(n₂/n₁)', boxX, boxY + 32);

    if (isTIR) {
      ctx.fillStyle = WCOLORS.red; ctx.font = 'bold 11px system-ui';
      fillTextSub(ctx, 'θ₁ > θ_c → Total internal reflection!', boxX, boxY + 52);
    } else {
      const theta2 = Math.asin(sinTheta2);
      ctx.fillStyle = WCOLORS.amber;
      ctx.fillText('θ₂ = ' + (theta2 * 180 / Math.PI).toFixed(1) + '°', boxX, boxY + 52);
    }

    // Progress bar showing how close to TIR
    const barX = boxX, barW2 = W - boxX - 20, barY2 = boxY + 62, barH2 = 8;
    ctx.fillStyle = WCOLORS.grid; ctx.fillRect(barX, barY2, barW2, barH2);
    const frac = angleDeg / (critAngle * 180 / Math.PI);
    const barColor = frac >= 1 ? WCOLORS.red : WCOLORS.teal;
    ctx.fillStyle = barColor;
    ctx.fillRect(barX, barY2, Math.min(frac, 1) * barW2, barH2);
    // Critical angle marker
    ctx.strokeStyle = WCOLORS.red; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(barX + barW2, barY2 - 2); ctx.lineTo(barX + barW2, barY2 + barH2 + 2); ctx.stroke();
    ctx.fillStyle = WCOLORS.textDim; ctx.font = '10px system-ui'; ctx.textAlign = 'right';
    fillTextSub(ctx, 'θ_c', barX + barW2, barY2 - 4);
  }

  angleSlider?.addEventListener('input', draw);
  draw();
}

// =========================================================================
function initThinFilmInterference() {
  const canvas = document.getElementById('scene-thin-film-interference');
  if (!canvas) return;
  const setup = wSetupCanvas(canvas);
  if (!setup) return;
  const { ctx, W, H } = setup;

  let thickSlider = document.getElementById('thinfilm-thickness');
  if (!thickSlider) {
    const parent = canvas.parentElement;
    if (parent) {
      const controls = document.createElement('div');
      controls.className = 'scene-controls';
      controls.innerHTML = '<label>Film thickness d (nm): <input type="range" id="thinfilm-thickness" min="50" max="800" step="5" value="250"><span class="scene-val" id="thinfilm-thickness-val">250</span></label>';
      parent.appendChild(controls);
      thickSlider = document.getElementById('thinfilm-thickness');
    }
  }

  const nFilm = 1.4;
  let t = 0;

  function wavelengthToRGB(wl) {
    let r = 0, g = 0, b = 0;
    if (wl >= 380 && wl < 440) { r = -(wl - 440) / 60; b = 1; }
    else if (wl >= 440 && wl < 490) { g = (wl - 440) / 50; b = 1; }
    else if (wl >= 490 && wl < 510) { g = 1; b = -(wl - 510) / 20; }
    else if (wl >= 510 && wl < 580) { r = (wl - 510) / 70; g = 1; }
    else if (wl >= 580 && wl < 645) { r = 1; g = -(wl - 645) / 65; }
    else if (wl >= 645 && wl <= 780) { r = 1; }
    let factor = 1;
    if (wl >= 380 && wl < 420) factor = 0.3 + 0.7 * (wl - 380) / 40;
    else if (wl > 700 && wl <= 780) factor = 0.3 + 0.7 * (780 - wl) / 80;
    else if (wl < 380 || wl > 780) factor = 0;
    return [Math.round(r * factor * 255), Math.round(g * factor * 255), Math.round(b * factor * 255)];
  }

  function getReflectedColor(d) {
    let tR = 0, tG = 0, tB = 0, tW = 0;
    for (let wl = 380; wl <= 780; wl += 2) {
      const delta = 2 * Math.PI * 2 * nFilm * d / wl + Math.PI;
      const refl = Math.sin(delta / 2) ** 2;
      const [r, g, b] = wavelengthToRGB(wl);
      tR += r * refl; tG += g * refl; tB += b * refl; tW++;
    }
    return [
      Math.min(255, Math.round(tR / tW * 2.5)),
      Math.min(255, Math.round(tG / tW * 2.5)),
      Math.min(255, Math.round(tB / tW * 2.5))
    ];
  }

  function draw() {
    wClear(ctx, W, H);
    t += 0.03;

    const d = parseFloat(thickSlider?.value || 250);
    document.getElementById('thinfilm-thickness-val')?.replaceChildren(document.createTextNode(d.toFixed(0)));

    const midX = W * 0.48;

    // Film height scales with thickness: 12px at 50nm, 140px at 800nm
    const filmMinH = 12, filmMaxH = 140;
    const filmH = filmMinH + (filmMaxH - filmMinH) * (d - 50) / (800 - 50);
    const filmCenterY = H * 0.52;
    const filmT = filmCenterY - filmH / 2;
    const filmB = filmCenterY + filmH / 2;
    const filmL = 18, filmR = midX - 20;
    const filmW = filmR - filmL;

    const beamX = filmL + filmW * 0.35;
    const beamWidth = 14;
    const [avgR, avgG, avgB] = getReflectedColor(d);
    const reflColor = `rgb(${avgR},${avgG},${avgB})`;

    // Find dominant reflected wavelength
    let bestWL = 550, bestBright = 0;
    for (let wl = 380; wl <= 780; wl += 5) {
      const delta = 2 * Math.PI * 2 * nFilm * d / wl + Math.PI;
      const refl = Math.sin(delta / 2) ** 2;
      const [rr, gg, bb] = wavelengthToRGB(wl);
      const bright = (rr + gg + bb) * refl;
      if (bright > bestBright) { bestBright = bright; bestWL = wl; }
    }

    // --- Substrate below film ---
    ctx.fillStyle = 'rgba(100,100,120,0.08)';
    ctx.fillRect(filmL, filmB, filmW, H - filmB - 8);

    // --- Film (height scales with d) ---
    const filmGrad = ctx.createLinearGradient(0, filmT, 0, filmB);
    filmGrad.addColorStop(0, 'rgba(15, 118, 110, 0.25)');
    filmGrad.addColorStop(0.5, 'rgba(15, 118, 110, 0.10)');
    filmGrad.addColorStop(1, 'rgba(15, 118, 110, 0.25)');
    ctx.fillStyle = filmGrad;
    ctx.fillRect(filmL, filmT, filmW, filmH);
    ctx.strokeStyle = WCOLORS.teal; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(filmL, filmT); ctx.lineTo(filmR, filmT); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(filmL, filmB); ctx.lineTo(filmR, filmB); ctx.stroke();

    // Labels
    ctx.fillStyle = WCOLORS.textDim; ctx.font = '11px system-ui'; ctx.textAlign = 'left';
    ctx.fillText('n = 1.0 (air)', filmL + 2, filmT - 8);
    ctx.fillStyle = WCOLORS.teal; ctx.font = '11px system-ui';
    if (filmH > 28) {
      ctx.textAlign = 'center';
      ctx.fillText('n = ' + nFilm.toFixed(1), (filmL + filmR) / 2, filmCenterY + 4);
    } else {
      ctx.textAlign = 'left';
      ctx.fillText('n = ' + nFilm.toFixed(1), filmR + 16, filmCenterY + 4);
    }
    ctx.fillStyle = WCOLORS.textDim; ctx.font = '11px system-ui'; ctx.textAlign = 'left';
    ctx.fillText('n = 1.5 (glass)', filmL + 2, Math.min(filmB + 16, H - 12));

    // Thickness dimension arrow
    const dimX = filmR + 5;
    ctx.strokeStyle = WCOLORS.amber; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(dimX, filmT); ctx.lineTo(dimX, filmB); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(dimX - 3, filmT + 4); ctx.lineTo(dimX, filmT); ctx.lineTo(dimX + 3, filmT + 4); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(dimX - 3, filmB - 4); ctx.lineTo(dimX, filmB); ctx.lineTo(dimX + 3, filmB - 4); ctx.stroke();
    ctx.fillStyle = WCOLORS.amber; ctx.font = '10px system-ui'; ctx.textAlign = 'left';
    ctx.fillText('d=' + d.toFixed(0) + 'nm', dimX + 4, filmCenterY + 4);

    // --- Incoming white light beam (rainbow stripes) ---
    const inTopY = 16;
    const hitY = filmT;
    const rainbowWLs = [650, 600, 570, 530, 490, 460, 420];
    const nStripes = rainbowWLs.length;
    for (let i = 0; i < nStripes; i++) {
      const frac = (i + 0.5) / nStripes;
      const sx = beamX - beamWidth / 2 + beamWidth * frac;
      const [cr, cg, cb] = wavelengthToRGB(rainbowWLs[i]);
      ctx.strokeStyle = `rgba(${cr},${cg},${cb},0.55)`;
      ctx.lineWidth = beamWidth / nStripes + 0.5;
      ctx.beginPath(); ctx.moveTo(sx - 6, inTopY); ctx.lineTo(sx, hitY); ctx.stroke();
    }
    // White glow
    ctx.strokeStyle = 'rgba(255,255,255,0.2)'; ctx.lineWidth = beamWidth * 0.4;
    ctx.beginPath(); ctx.moveTo(beamX - 3, inTopY); ctx.lineTo(beamX, hitY); ctx.stroke();

    // Animated wave fronts in incoming beam
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(beamX - beamWidth / 2 - 8, inTopY);
    ctx.lineTo(beamX - beamWidth / 2, hitY);
    ctx.lineTo(beamX + beamWidth / 2, hitY);
    ctx.lineTo(beamX + beamWidth / 2 + 2, inTopY);
    ctx.closePath(); ctx.clip();
    const wfSpacing = 12;
    const beamLen = hitY - inTopY;
    ctx.strokeStyle = 'rgba(255,255,255,0.35)'; ctx.lineWidth = 1;
    for (let yy = (t * 40) % wfSpacing; yy < beamLen; yy += wfSpacing) {
      const fy = inTopY + yy;
      const frac2 = yy / beamLen;
      const cx = beamX - 3 * (1 - frac2);
      ctx.beginPath(); ctx.moveTo(cx - beamWidth * 0.6, fy); ctx.lineTo(cx + beamWidth * 0.6, fy); ctx.stroke();
    }
    ctx.restore();

    ctx.fillStyle = WCOLORS.text; ctx.font = '10px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('white light', beamX - 3, inTopY - 2);

    // --- Reflected beam (colored) ---
    const reflEndX = beamX + 55;
    const reflTopY = 16;
    ctx.strokeStyle = reflColor; ctx.lineWidth = beamWidth * 0.65; ctx.globalAlpha = 0.75;
    ctx.beginPath(); ctx.moveTo(beamX, hitY); ctx.lineTo(reflEndX, reflTopY); ctx.stroke();
    ctx.globalAlpha = 1;

    // Animated wave fronts in reflected beam
    ctx.save();
    const rDx = reflEndX - beamX, rDy = reflTopY - hitY;
    const rLen = Math.sqrt(rDx * rDx + rDy * rDy);
    const rnx = -rDy / rLen, rny = rDx / rLen;
    ctx.beginPath();
    ctx.moveTo(beamX - 12, hitY - 12); ctx.lineTo(reflEndX - 12, reflTopY - 12);
    ctx.lineTo(reflEndX + 15, reflTopY + 8); ctx.lineTo(beamX + 15, hitY + 8);
    ctx.closePath(); ctx.clip();
    ctx.strokeStyle = 'rgba(255,255,255,0.4)'; ctx.lineWidth = 1;
    for (let s = (t * 40) % 10; s < rLen; s += 10) {
      const f3 = s / rLen;
      const px = beamX + rDx * f3, py = hitY + rDy * f3;
      ctx.beginPath();
      ctx.moveTo(px + rnx * beamWidth * 0.45, py + rny * beamWidth * 0.45);
      ctx.lineTo(px - rnx * beamWidth * 0.45, py - rny * beamWidth * 0.45);
      ctx.stroke();
    }
    ctx.restore();

    ctx.fillStyle = reflColor; ctx.font = 'bold 11px system-ui'; ctx.textAlign = 'left';
    ctx.fillText('reflected', reflEndX + 4, reflTopY + 10);
    ctx.font = '10px system-ui';
    ctx.fillText(Math.round(bestWL) + ' nm', reflEndX + 4, reflTopY + 23);

    // Ray paths inside film (dashed)
    const ray2X = beamX + 8 * (filmH / 50);
    ctx.strokeStyle = 'rgba(15,118,110,0.3)'; ctx.lineWidth = 1.5; ctx.setLineDash([3, 3]);
    ctx.beginPath(); ctx.moveTo(beamX, filmT); ctx.lineTo(ray2X, filmB); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(ray2X, filmB); ctx.lineTo(beamX + 16 * (filmH / 50), filmT); ctx.stroke();
    ctx.setLineDash([]);

    // Transmitted beam (dim)
    ctx.strokeStyle = 'rgba(180,180,180,0.3)'; ctx.lineWidth = beamWidth * 0.4;
    ctx.beginPath(); ctx.moveTo(ray2X, filmB); ctx.lineTo(ray2X + 4, H - 8); ctx.stroke();
    ctx.fillStyle = WCOLORS.textDim; ctx.font = '9px system-ui'; ctx.textAlign = 'left';
    ctx.fillText('transmitted', ray2X + 8, H - 12);

    // Path difference annotation
    ctx.fillStyle = WCOLORS.text; ctx.font = '10px system-ui'; ctx.textAlign = 'left';
    ctx.fillText('2nd = ' + (2 * nFilm * d).toFixed(0) + ' nm  (+λ/2 shift)', filmL, H - 5);

    // ===================== Right half: spectrum =====================
    const specL = midX + 8, specR = W - 10;
    const specW2 = specR - specL;
    const wlMin = 380, wlMax = 780;

    ctx.fillStyle = WCOLORS.text; ctx.font = 'bold 11px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('Reflected spectrum', (specL + specR) / 2, 28);

    // Input spectrum (all wavelengths)
    const barY1 = 38;
    for (let i = 0; i < specW2; i++) {
      const wl = wlMin + (wlMax - wlMin) * i / specW2;
      const [r, g, b] = wavelengthToRGB(wl);
      ctx.fillStyle = `rgb(${r},${g},${b})`;
      ctx.fillRect(specL + i, barY1, 1, 12);
    }
    ctx.fillStyle = WCOLORS.textDim; ctx.font = '10px system-ui'; ctx.textAlign = 'right';
    ctx.fillText('in', specL - 4, barY1 + 10);

    // Reflected spectrum (modulated)
    const barY2 = barY1 + 17;
    for (let i = 0; i < specW2; i++) {
      const wl = wlMin + (wlMax - wlMin) * i / specW2;
      const delta = 2 * Math.PI * 2 * nFilm * d / wl + Math.PI;
      const refl = Math.sin(delta / 2) ** 2;
      const [r, g, b] = wavelengthToRGB(wl);
      ctx.fillStyle = `rgb(${Math.round(r * refl)},${Math.round(g * refl)},${Math.round(b * refl)})`;
      ctx.fillRect(specL + i, barY2, 1, 16);
    }
    ctx.fillStyle = WCOLORS.textDim; ctx.font = '10px system-ui'; ctx.textAlign = 'right';
    ctx.fillText('out', specL - 4, barY2 + 12);

    ctx.fillStyle = WCOLORS.textDim; ctx.font = '9px system-ui';
    ctx.textAlign = 'left'; ctx.fillText('380', specL, barY2 + 28);
    ctx.textAlign = 'right'; ctx.fillText('780 nm', specR, barY2 + 28);

    // Perceived color swatch
    const swY = barY2 + 33;
    ctx.fillStyle = reflColor;
    ctx.fillRect(specL, swY, specW2, 22);
    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 0.5;
    ctx.strokeRect(specL, swY, specW2, 22);
    ctx.fillStyle = WCOLORS.textDim; ctx.font = '10px system-ui'; ctx.textAlign = 'right';
    ctx.fillText('eye sees', specL - 4, swY + 15);

    // Reflectance curve R(lambda)
    const plotT2 = swY + 34;
    const plotB2 = H - 16;
    const plotH2 = plotB2 - plotT2;

    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(specL, plotT2); ctx.lineTo(specL, plotB2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(specL, plotB2); ctx.lineTo(specR, plotB2); ctx.stroke();

    ctx.fillStyle = WCOLORS.textDim; ctx.font = '9px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('λ (nm)', (specL + specR) / 2, plotB2 + 13);
    ctx.save(); ctx.translate(specL - 8, (plotT2 + plotB2) / 2); ctx.rotate(-Math.PI / 2);
    ctx.fillText('R', 0, 0); ctx.restore();

    // Grid + color background
    for (let wl = 400; wl <= 750; wl += 50) {
      const x = specL + (wl - wlMin) / (wlMax - wlMin) * specW2;
      ctx.strokeStyle = WCOLORS.grid; ctx.lineWidth = 0.5;
      ctx.beginPath(); ctx.moveTo(x, plotT2); ctx.lineTo(x, plotB2); ctx.stroke();
      ctx.fillStyle = WCOLORS.textDim; ctx.font = '8px system-ui'; ctx.textAlign = 'center';
      ctx.fillText(wl, x, plotB2 + 9);
    }
    for (let i = 0; i < specW2; i++) {
      const wl = wlMin + (wlMax - wlMin) * i / specW2;
      const [r, g, b] = wavelengthToRGB(wl);
      ctx.fillStyle = `rgba(${r},${g},${b},0.06)`;
      ctx.fillRect(specL + i, plotT2, 1, plotH2);
    }

    // Reflectance curve
    ctx.strokeStyle = WCOLORS.teal; ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i <= specW2; i++) {
      const wl = wlMin + (wlMax - wlMin) * i / specW2;
      const delta = 2 * Math.PI * 2 * nFilm * d / wl + Math.PI;
      const R = Math.sin(delta / 2) ** 2;
      const x = specL + i, y = plotB2 - R * plotH2;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Constructive peak markers
    ctx.font = '9px system-ui'; ctx.textAlign = 'center';
    for (let m = 1; m <= 10; m++) {
      const wlPeak = 2 * nFilm * d / m;
      if (wlPeak >= wlMin && wlPeak <= wlMax) {
        const x = specL + (wlPeak - wlMin) / (wlMax - wlMin) * specW2;
        const [pr, pg, pb] = wavelengthToRGB(wlPeak);
        ctx.fillStyle = `rgb(${pr},${pg},${pb})`;
        ctx.beginPath(); ctx.arc(x, plotT2 + 4, 4, 0, 2 * Math.PI); ctx.fill();
        ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 0.5; ctx.stroke();
        ctx.fillStyle = WCOLORS.text;
        ctx.fillText(Math.round(wlPeak), x, plotT2 - 3);
      }
    }

    requestAnimationFrame(draw);
  }

  draw();
}
// =========================================================================
function initBrewsterAngle() {
  const canvas = document.getElementById('scene-brewster-angle');
  if (!canvas) return;
  const setup = wSetupCanvas(canvas);
  if (!setup) return;
  const { ctx, W, H } = setup;

  let nSlider = document.getElementById('brewster-n');
  if (!nSlider) {
    const parent = canvas.parentElement;
    if (parent) {
      const controls = document.createElement('div');
      controls.className = 'scene-controls';
      controls.innerHTML = '<label>n₂/n₁: <input type="range" id="brewster-n" min="1.0" max="3.0" step="0.05" value="1.5"><span class="scene-val" id="brewster-n-val">1.50</span></label>';
      parent.appendChild(controls);
      nSlider = document.getElementById('brewster-n');
    }
  }

  function draw() {
    wClear(ctx, W, H);

    const n = parseFloat(nSlider?.value || 1.5);
    document.getElementById('brewster-n-val')?.replaceChildren(document.createTextNode(n.toFixed(2)));

    const brewsterAngle = Math.atan(n) * 180 / Math.PI;
    const critAngle = n > 1 ? null : Math.asin(n) * 180 / Math.PI;

    ctx.fillStyle = WCOLORS.text; ctx.font = 'bold 12px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('Fresnel reflection coefficients', W / 2, 16);

    // Plot region
    const plotL = 55, plotR = W - 20, plotT = 35, plotB = H - 30;
    const plotW = plotR - plotL, plotH = plotB - plotT;

    // Axes
    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(plotL, plotT); ctx.lineTo(plotL, plotB); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(plotL, plotB); ctx.lineTo(plotR, plotB); ctx.stroke();

    // Axis labels
    ctx.fillStyle = WCOLORS.textDim; ctx.font = '10px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('Angle of incidence (degrees)', (plotL + plotR) / 2, plotB + 20);
    ctx.save(); ctx.translate(15, (plotT + plotB) / 2); ctx.rotate(-Math.PI / 2);
    ctx.fillText('Reflection coefficient', 0, 0); ctx.restore();

    // Grid and tick marks
    for (let deg = 0; deg <= 90; deg += 15) {
      const x = plotL + (deg / 90) * plotW;
      ctx.strokeStyle = WCOLORS.grid; ctx.lineWidth = 0.5;
      ctx.beginPath(); ctx.moveTo(x, plotT); ctx.lineTo(x, plotB); ctx.stroke();
      ctx.fillStyle = WCOLORS.textDim; ctx.font = '10px system-ui'; ctx.textAlign = 'center';
      ctx.fillText(deg + '°', x, plotB + 12);
    }
    for (let v = -1; v <= 1; v += 0.5) {
      const y = plotB - ((v + 1) / 2) * plotH;
      ctx.strokeStyle = WCOLORS.grid; ctx.lineWidth = 0.5;
      ctx.beginPath(); ctx.moveTo(plotL, y); ctx.lineTo(plotR, y); ctx.stroke();
      ctx.fillStyle = WCOLORS.textDim; ctx.font = '10px system-ui'; ctx.textAlign = 'right';
      ctx.fillText(v.toFixed(1), plotL - 5, y + 3);
    }

    // Zero line
    const zeroY = plotB - plotH / 2;
    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 0.5;
    ctx.beginPath(); ctx.moveTo(plotL, zeroY); ctx.lineTo(plotR, zeroY); ctx.stroke();

    // Fresnel equations
    // rs = (n1 cosθ1 - n2 cosθ2) / (n1 cosθ1 + n2 cosθ2)
    // rp = (n2 cosθ1 - n1 cosθ2) / (n2 cosθ1 + n1 cosθ2)
    // where n1=1, n2=n, sinθ2 = sinθ1/n

    function fresnel(thetaDeg) {
      const theta = thetaDeg * Math.PI / 180;
      const cosT1 = Math.cos(theta);
      const sinT1 = Math.sin(theta);
      const sinT2 = sinT1 / n;
      if (Math.abs(sinT2) > 1) return { rs: 1, rp: 1, tir: true };
      const cosT2 = Math.sqrt(1 - sinT2 * sinT2);
      const rs = (cosT1 - n * cosT2) / (cosT1 + n * cosT2);
      const rp = (n * cosT1 - cosT2) / (n * cosT1 + cosT2);
      return { rs, rp, tir: false };
    }

    // Plot rs (s-polarization)
    ctx.strokeStyle = WCOLORS.blue; ctx.lineWidth = 2;
    ctx.beginPath();
    for (let deg = 0; deg <= 90; deg += 0.5) {
      const { rs } = fresnel(deg);
      const x = plotL + (deg / 90) * plotW;
      const y = plotB - ((rs + 1) / 2) * plotH;
      if (deg === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Plot rp (p-polarization)
    ctx.strokeStyle = WCOLORS.red; ctx.lineWidth = 2;
    ctx.beginPath();
    for (let deg = 0; deg <= 90; deg += 0.5) {
      const { rp } = fresnel(deg);
      const x = plotL + (deg / 90) * plotW;
      const y = plotB - ((rp + 1) / 2) * plotH;
      if (deg === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Brewster angle marker
    const bx = plotL + (brewsterAngle / 90) * plotW;
    ctx.strokeStyle = WCOLORS.teal; ctx.lineWidth = 1.5; ctx.setLineDash([4, 3]);
    ctx.beginPath(); ctx.moveTo(bx, plotT); ctx.lineTo(bx, plotB); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = WCOLORS.teal; ctx.font = 'bold 10px system-ui'; ctx.textAlign = 'center';
    fillTextSub(ctx, 'θ_B = ' + brewsterAngle.toFixed(1) + '°', bx, plotT - 5);
    ctx.fillStyle = WCOLORS.teal;
    ctx.beginPath(); ctx.arc(bx, zeroY, 5, 0, 2 * Math.PI); ctx.fill();

    // Critical angle marker (for n < 1 going from dense to less dense)
    if (critAngle !== null) {
      const cx = plotL + (critAngle / 90) * plotW;
      ctx.strokeStyle = WCOLORS.amber; ctx.lineWidth = 1.5; ctx.setLineDash([4, 3]);
      ctx.beginPath(); ctx.moveTo(cx, plotT); ctx.lineTo(cx, plotB); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = WCOLORS.amber; ctx.font = 'bold 10px system-ui';
      fillTextSub(ctx, 'θ_c = ' + critAngle.toFixed(1) + '°', cx, plotT - 5);
    }

    // Legend
    ctx.font = '11px system-ui'; ctx.textAlign = 'left';
    ctx.fillStyle = WCOLORS.blue; ctx.fillText('── rₛ (s-polarization)', plotL + 10, plotT + 15);
    ctx.fillStyle = WCOLORS.red; ctx.fillText('── rₚ (p-polarization)', plotL + 10, plotT + 30);
    ctx.fillStyle = WCOLORS.teal; ctx.fillText('⬤ Brewster angle (rₚ = 0)', plotL + 10, plotT + 45);

    // Info
    ctx.fillStyle = WCOLORS.text; ctx.font = '10px system-ui'; ctx.textAlign = 'right';
    ctx.fillText('n₂/n₁ = ' + n.toFixed(2), plotR, plotT + 15);
    fillTextSub(ctx, 'θ_B = arctan(n₂/n₁) = ' + brewsterAngle.toFixed(1) + '°', plotR, plotT + 30);
  }

  nSlider?.addEventListener('input', draw);
  draw();
}

// =========================================================================
// CHAPTER 16 - PRISMS & SCATTERING
// =========================================================================

function initRayleighScattering() {
  const canvas = document.getElementById('scene-rayleigh-scattering');
  if (!canvas) return;
  const setup = wSetupCanvas(canvas);
  if (!setup) return;
  const { ctx, W, H } = setup;

  function wavelengthToRGB(wl) {
    let r = 0, g = 0, b = 0;
    if (wl >= 380 && wl < 440) { r = -(wl - 440) / 60; b = 1; }
    else if (wl >= 440 && wl < 490) { g = (wl - 440) / 50; b = 1; }
    else if (wl >= 490 && wl < 510) { g = 1; b = -(wl - 510) / 20; }
    else if (wl >= 510 && wl < 580) { r = (wl - 510) / 70; g = 1; }
    else if (wl >= 580 && wl < 645) { r = 1; g = -(wl - 645) / 65; }
    else if (wl >= 645 && wl <= 780) { r = 1; }
    let factor = 1;
    if (wl >= 380 && wl < 420) factor = 0.3 + 0.7 * (wl - 380) / 40;
    else if (wl > 700 && wl <= 780) factor = 0.3 + 0.7 * (780 - wl) / 80;
    else if (wl < 380 || wl > 780) factor = 0;
    return [Math.round(r * factor * 255), Math.round(g * factor * 255), Math.round(b * factor * 255)];
  }

  function draw() {
    wClear(ctx, W, H);

    ctx.fillStyle = WCOLORS.text; ctx.font = 'bold 12px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('Rayleigh scattering: intensity ~ 1/λ⁴', W / 2, 16);

    // --- Top: scattering intensity plot ---
    const plotL = 60, plotR = W - 20, plotT = 35, plotB = H * 0.45;
    const plotW = plotR - plotL, plotH = plotB - plotT;

    // Axes
    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(plotL, plotT); ctx.lineTo(plotL, plotB); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(plotL, plotB); ctx.lineTo(plotR, plotB); ctx.stroke();

    ctx.fillStyle = WCOLORS.textDim; ctx.font = '11px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('Wavelength (nm)', (plotL + plotR) / 2, plotB + 14);
    ctx.save(); ctx.translate(plotL - 18, (plotT + plotB) / 2); ctx.rotate(-Math.PI / 2);
    ctx.fillText('Scattering intensity', 0, 0); ctx.restore();

    // 1/λ⁴ curve with spectrum coloring
    const wlMin = 380, wlMax = 780;
    const maxIntensity = 1 / (380 ** 4); // normalize to blue end

    // Fill under curve with spectrum colors
    for (let i = 0; i < plotW; i++) {
      const wl = wlMin + (wlMax - wlMin) * i / plotW;
      const intensity = (1 / (wl ** 4)) / maxIntensity;
      const [r, g, b] = wavelengthToRGB(wl);
      const x = plotL + i;
      const barTop = plotB - intensity * plotH;
      ctx.fillStyle = `rgba(${r},${g},${b},0.4)`;
      ctx.fillRect(x, barTop, 1, plotB - barTop);
    }

    // 1/λ⁴ curve
    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i <= plotW; i++) {
      const wl = wlMin + (wlMax - wlMin) * i / plotW;
      const intensity = (1 / (wl ** 4)) / maxIntensity;
      const x = plotL + i;
      const y = plotB - intensity * plotH;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Wavelength ticks
    for (let wl = 400; wl <= 750; wl += 50) {
      const x = plotL + (wl - wlMin) / (wlMax - wlMin) * plotW;
      ctx.strokeStyle = WCOLORS.textDim; ctx.lineWidth = 0.5;
      ctx.beginPath(); ctx.moveTo(x, plotB); ctx.lineTo(x, plotB + 4); ctx.stroke();
      ctx.fillStyle = WCOLORS.textDim; ctx.font = '7px system-ui'; ctx.textAlign = 'center';
      ctx.fillText(wl, x, plotB + 22);
    }

    // Blue/red annotations
    ctx.fillStyle = WCOLORS.blue; ctx.font = 'bold 10px system-ui'; ctx.textAlign = 'left';
    ctx.fillText('Blue scatters ~5.5x', plotL + 5, plotT + 15);
    ctx.fillText('more than red', plotL + 5, plotT + 27);

    // --- Bottom: sky explanation ---
    const secT = H * 0.55;

    // Visible spectrum bar
    const barL = 60, barR = W - 20, barY = secT + 10, barH2 = 20;
    for (let i = 0; i < barR - barL; i++) {
      const wl = wlMin + (wlMax - wlMin) * i / (barR - barL);
      const [r, g, b] = wavelengthToRGB(wl);
      ctx.fillStyle = `rgb(${r},${g},${b})`;
      ctx.fillRect(barL + i, barY, 1, barH2);
    }
    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 0.5;
    ctx.strokeRect(barL, barY, barR - barL, barH2);

    // Scattering strength overlay
    for (let i = 0; i < barR - barL; i++) {
      const wl = wlMin + (wlMax - wlMin) * i / (barR - barL);
      const intensity = (1 / (wl ** 4)) / maxIntensity;
      const dotH = intensity * 15;
      ctx.fillStyle = WCOLORS.axis; ctx.globalAlpha = 0.3;
      ctx.fillRect(barL + i, barY - dotH, 1, dotH);
    }
    ctx.globalAlpha = 1;

    ctx.fillStyle = WCOLORS.textDim; ctx.font = '11px system-ui'; ctx.textAlign = 'left';
    ctx.fillText('violet/blue', barL, barY + barH2 + 12);
    ctx.textAlign = 'right';
    ctx.fillText('red', barR, barY + barH2 + 12);
    ctx.textAlign = 'center';
    ctx.fillText('← strongly scattered                     weakly scattered →', (barL + barR) / 2, barY + barH2 + 25);

    // Sky blue / sunset explanation
    const expY = secT + 75;
    // Blue sky swatch
    ctx.fillStyle = '#6BB3E0';
    ctx.fillRect(barL, expY, 60, 25);
    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 0.5;
    ctx.strokeRect(barL, expY, 60, 25);
    ctx.fillStyle = WCOLORS.text; ctx.font = '10px system-ui'; ctx.textAlign = 'left';
    ctx.fillText('Blue sky: scattered blue light', barL + 68, expY + 10);
    ctx.fillText('reaches your eyes from all directions', barL + 68, expY + 22);

    // Sunset swatch
    const sunY = expY + 35;
    ctx.fillStyle = '#E8723A';
    ctx.fillRect(barL, sunY, 60, 25);
    ctx.strokeRect(barL, sunY, 60, 25);
    ctx.fillStyle = WCOLORS.text;
    ctx.fillText('Red sunset: blue scattered away', barL + 68, sunY + 10);
    ctx.fillText('along long path, red light remains', barL + 68, sunY + 22);
  }

  draw();
}

// =========================================================================
function initPrismDispersion() {
  const canvas = document.getElementById('scene-prism-dispersion');
  if (!canvas) return;
  const setup = wSetupCanvas(canvas);
  if (!setup) return;
  const { ctx, W, H } = setup;

  let apexSlider = document.getElementById('prism-apex');
  if (!apexSlider) {
    const parent = canvas.parentElement;
    if (parent) {
      const controls = document.createElement('div');
      controls.className = 'scene-controls';
      controls.innerHTML = '<label>Apex angle: <input type="range" id="prism-apex" min="30" max="75" step="1" value="60"><span class="scene-val" id="prism-apex-val">60°</span></label>';
      parent.appendChild(controls);
      apexSlider = document.getElementById('prism-apex');
    }
  }

  function wavelengthToRGB(wl) {
    let r = 0, g = 0, b = 0;
    if (wl >= 380 && wl < 440) { r = -(wl - 440) / 60; b = 1; }
    else if (wl >= 440 && wl < 490) { g = (wl - 440) / 50; b = 1; }
    else if (wl >= 490 && wl < 510) { g = 1; b = -(wl - 510) / 20; }
    else if (wl >= 510 && wl < 580) { r = (wl - 510) / 70; g = 1; }
    else if (wl >= 580 && wl < 645) { r = 1; g = -(wl - 645) / 65; }
    else if (wl >= 645 && wl <= 780) { r = 1; }
    let factor = 1;
    if (wl >= 380 && wl < 420) factor = 0.3 + 0.7 * (wl - 380) / 40;
    else if (wl > 700 && wl <= 780) factor = 0.3 + 0.7 * (780 - wl) / 80;
    else if (wl < 380 || wl > 780) factor = 0;
    return `rgb(${Math.round(r * factor * 255)},${Math.round(g * factor * 255)},${Math.round(b * factor * 255)})`;
  }

  // Cauchy dispersion: n(λ) ≈ A + B/λ²
  function cauchyN(wlNm) {
    const A = 1.52, B = 4500;
    return A + B / (wlNm * wlNm);
  }

  function draw() {
    wClear(ctx, W, H);

    const apexDeg = parseFloat(apexSlider?.value || 60);
    const apex = apexDeg * Math.PI / 180;
    document.getElementById('prism-apex-val')?.replaceChildren(document.createTextNode(apexDeg + '°'));

    ctx.fillStyle = WCOLORS.text; ctx.font = 'bold 12px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('Prism dispersion', W / 2, 16);

    // Prism geometry (equilateral-ish triangle)
    const prismCx = W * 0.38, prismCy = H * 0.52;
    const prismSize = Math.min(W, H) * 0.28;

    // Triangle vertices: top, bottom-left, bottom-right
    const topX = prismCx, topY = prismCy - prismSize * Math.cos(apex / 2) * 0.8;
    const blX = prismCx - prismSize * Math.sin(apex / 2);
    const blY = prismCy + prismSize * 0.4;
    const brX = prismCx + prismSize * Math.sin(apex / 2);
    const brY = prismCy + prismSize * 0.4;

    // Draw prism
    ctx.fillStyle = 'rgba(200, 220, 255, 0.3)';
    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(topX, topY);
    ctx.lineTo(blX, blY);
    ctx.lineTo(brX, brY);
    ctx.closePath();
    ctx.fill(); ctx.stroke();

    // Entry point on left face
    const entryFrac = 0.5;
    const entryX = topX + (blX - topX) * entryFrac;
    const entryY = topY + (blY - topY) * entryFrac;

    // Incident white beam
    const beamLen = 80;
    const incidentAngle = Math.PI * 0.15;
    const beamStartX = entryX - beamLen * Math.cos(incidentAngle);
    const beamStartY = entryY - beamLen * Math.sin(incidentAngle);

    ctx.strokeStyle = '#888'; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(beamStartX, beamStartY); ctx.lineTo(entryX, entryY); ctx.stroke();
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(beamStartX, beamStartY); ctx.lineTo(entryX, entryY); ctx.stroke();
    ctx.fillStyle = WCOLORS.text; ctx.font = '10px system-ui'; ctx.textAlign = 'right';
    ctx.fillText('White light', beamStartX + 5, beamStartY - 8);

    // Exit point on right face
    const exitFrac = 0.5;
    const exitX = topX + (brX - topX) * exitFrac;
    const exitY = topY + (brY - topY) * exitFrac;

    // Right face normal direction
    const rfDx = brX - topX, rfDy = brY - topY;
    const rfLen = Math.sqrt(rfDx * rfDx + rfDy * rfDy);
    const normalX = rfDy / rfLen, normalY = -rfDx / rfLen;

    // Dispersed rays
    const colors = [
      { wl: 400, name: 'Violet', label: '400nm' },
      { wl: 450, name: 'Blue',   label: '450nm' },
      { wl: 500, name: 'Cyan',   label: '500nm' },
      { wl: 550, name: 'Green',  label: '550nm' },
      { wl: 580, name: 'Yellow', label: '580nm' },
      { wl: 620, name: 'Orange', label: '620nm' },
      { wl: 700, name: 'Red',    label: '700nm' },
    ];

    // Draw path through prism (simplified) and exit rays
    const rayLen2 = 120;
    const baseDeviation = apex * 0.6; // approximate minimum deviation

    for (let i = 0; i < colors.length; i++) {
      const c = colors[i];
      const n = cauchyN(c.wl);
      // More dispersion for shorter wavelengths
      const deviation = baseDeviation + (n - 1.52) * 8;
      const spread = (i - 3) * 0.035 * (apexDeg / 60);

      // Exit direction
      const exitAngle = -0.3 + spread + deviation * 0.15;
      const endX = exitX + rayLen2 * Math.cos(exitAngle);
      const endY = exitY + rayLen2 * Math.sin(exitAngle);

      const color = wavelengthToRGB(c.wl);
      ctx.strokeStyle = color; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.moveTo(exitX, exitY); ctx.lineTo(endX, endY); ctx.stroke();

      // Label
      ctx.fillStyle = color; ctx.font = '11px system-ui'; ctx.textAlign = 'left';
      ctx.fillText(c.name + ' ' + c.label, endX + 5, endY + 3);
    }

    // Internal beam (white fanning into colors)
    ctx.strokeStyle = 'rgba(150,150,150,0.4)'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(entryX, entryY); ctx.lineTo(exitX, exitY); ctx.stroke();

    // Apex angle arc
    const arcR = 20;
    const leftAngle = Math.atan2(blY - topY, blX - topX);
    const rightAngle = Math.atan2(brY - topY, brX - topX);
    ctx.strokeStyle = WCOLORS.amber; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(topX, topY, arcR, leftAngle, rightAngle); ctx.stroke();
    ctx.fillStyle = WCOLORS.amber; ctx.font = '10px system-ui'; ctx.textAlign = 'center';
    ctx.fillText(apexDeg + '°', topX, topY + arcR + 14);

    // Note
    ctx.fillStyle = WCOLORS.textDim; ctx.font = '10px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('Shorter wavelengths refract more (higher n)', W / 2, H - 8);
  }

  apexSlider?.addEventListener('input', draw);
  draw();
}

// =========================================================================
// CHAPTER 8: Fourier Transforms
// =========================================================================

// =========================================================================
// 1. Violin Spectrum
// =========================================================================
function initViolinSpectrum() {
  const canvas = document.getElementById('scene-violin-spectrum');
  if (!canvas) return;
  if (canvas._vsInit) return;
  canvas._vsInit = true;
  const setup = wSetupCanvas(canvas);
  if (!setup) return;
  const { ctx, W, H } = setup;

  const nHarmonics = 8;

  // Instrument presets: amplitude and Q per harmonic (n=1..8)
  const presets = {
    violin:   { label: 'Violin',   amps: [1, 0.72, 0.5, 0.38, 0.28, 0.2, 0.14, 0.1],
                                    Qs:   [30, 30, 30, 30, 30, 30, 30, 30] },
    flute:    { label: 'Flute',    amps: [1, 0.12, 0.04, 0.01, 0, 0, 0, 0],
                                    Qs:   [50, 50, 50, 50, 50, 50, 50, 50] },
    clarinet: { label: 'Clarinet', amps: [1, 0.05, 0.72, 0.04, 0.38, 0.02, 0.18, 0.01],
                                    Qs:   [35, 35, 35, 35, 35, 35, 35, 35] },
    trumpet:  { label: 'Trumpet',  amps: [0.8, 1, 0.9, 0.65, 0.45, 0.3, 0.18, 0.1],
                                    Qs:   [25, 25, 25, 25, 25, 25, 25, 25] },
    oboe:     { label: 'Oboe',     amps: [1, 0.55, 0.8, 0.48, 0.55, 0.35, 0.25, 0.18],
                                    Qs:   [40, 40, 40, 40, 40, 40, 40, 40] },
    sawtooth: { label: 'Sawtooth', amps: [1, 0.5, 0.33, 0.25, 0.2, 0.17, 0.14, 0.13],
                                    Qs:   [60, 60, 60, 60, 60, 60, 60, 60] },
    square:   { label: 'Square',   amps: [1, 0, 0.33, 0, 0.2, 0, 0.14, 0],
                                    Qs:   [60, 60, 60, 60, 60, 60, 60, 60] },
    bell:     { label: 'Bell',     amps: [0.6, 1, 0.4, 0.8, 0.15, 0.5, 0.1, 0.3],
                                    Qs:   [15, 12, 15, 12, 15, 12, 15, 12] },
  };

  // State: per-harmonic amplitude (0..1) and Q (5..100)
  let amps = presets.violin.amps.slice();
  let Qs = presets.violin.Qs.slice();
  let activePreset = 'violin';

  // Live audio state: track per-harmonic gain nodes for smooth updates
  let liveGainNodes = null; // array of GainNode, one per harmonic (indices 0..7)
  let liveOscNodes = null;
  let liveMaster = null;
  let liveActx = null;

  // Setup controls
  let f0Slider = document.getElementById('violin-f0');
  if (!f0Slider) {
    const parent = canvas.parentElement;
    if (parent) {
      const controls = document.createElement('div');
      controls.className = 'scene-controls';
      controls.innerHTML =
        '<label>f\u2080: <input type="range" id="violin-f0" min="100" max="800" step="10" value="440"><span class="scene-val" id="violin-f0-val">440 Hz</span></label>';
      parent.appendChild(controls);
      f0Slider = document.getElementById('violin-f0');
    }
  }

  // Remove old Q slider if present
  const oldQSlider = document.getElementById('violin-q');
  if (oldQSlider) {
    const label = oldQSlider.closest('label');
    if (label) label.remove();
  }

  // Preset buttons
  {
    const parent = canvas.parentElement;
    if (parent && !document.getElementById('vs-preset-violin')) {
      const presetRow = document.createElement('div');
      presetRow.className = 'scene-controls';
      presetRow.innerHTML = '<span style="font-size:11px;color:var(--muted);">Presets:</span>';
      for (const key in presets) {
        const btn = document.createElement('button');
        btn.className = 'scene-btn';
        btn.id = 'vs-preset-' + key;
        btn.textContent = presets[key].label;
        btn.style.fontSize = '11px';
        btn.style.padding = '2px 10px';
        btn.addEventListener('click', () => {
          drag = null;
          hovered = null;
          amps = presets[key].amps.slice();
          Qs = presets[key].Qs.slice();
          activePreset = key;
          updatePresetBtns();
          draw();
          syncLiveAudio();
        });
        presetRow.appendChild(btn);
      }
      parent.appendChild(presetRow);
      updatePresetBtns();
    }
  }

  function updatePresetBtns() {
    for (const key in presets) {
      const btn = document.getElementById('vs-preset-' + key);
      if (btn) {
        btn.style.fontWeight = (key === activePreset) ? 'bold' : 'normal';
        btn.style.opacity = (key === activePreset) ? '1' : '0.65';
      }
    }
  }

  // Play button — onPlay starts audio, onStop clears live state
  {
    const controls = f0Slider?.closest('.scene-controls') || canvas.parentElement;
    if (controls && !document.getElementById('violin-play')) {
      wMakePlayBtn(controls, 'violin-play', '\u25B6 Listen', () => {
        startAudio();
      }, () => {
        // wStopTones already handled oscillator cleanup; just clear local refs
        liveGainNodes = null;
        liveOscNodes = null;
        liveMaster = null;
        liveActx = null;
      });
    }
  }

  // Start audio with per-harmonic oscillators+gains so we can update smoothly
  function startAudio() {
    stopLiveAudio();
    const actx = wGetAudioCtx();
    const master = actx.createGain();
    master.gain.value = 0;
    master.connect(actx.destination);
    master.gain.setTargetAtTime(0.25, actx.currentTime, 0.04);

    const f0 = parseFloat(f0Slider?.value || 440);
    const gains = [];
    const oscs = [];
    for (let n = 1; n <= nHarmonics; n++) {
      const osc = actx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = f0 * n;
      const g = actx.createGain();
      g.gain.value = amps[n - 1] * 0.5;
      osc.connect(g);
      g.connect(master);
      osc.start();
      oscs.push(osc);
      gains.push(g);
    }

    liveGainNodes = gains;
    liveOscNodes = oscs;
    liveMaster = master;
    liveActx = actx;

    // Also register with the global audio tracker so wMakePlayBtn stop works
    _wavesAudioActive['violin-play'] = { master, nodes: oscs, actx };
  }

  function stopLiveAudio() {
    if (liveMaster) {
      const now = liveActx?.currentTime || 0;
      liveMaster.gain.setTargetAtTime(0, now, 0.05);
      const oscs = liveOscNodes;
      const m = liveMaster;
      setTimeout(() => {
        for (const osc of oscs) { try { osc.stop(); } catch(e){} }
        try { m.disconnect(); } catch(e){}
      }, 200);
    }
    liveGainNodes = null;
    liveOscNodes = null;
    liveMaster = null;
    liveActx = null;
    delete _wavesAudioActive['violin-play'];
  }

  // Smoothly update gains and frequencies on existing oscillators (no click/pop)
  // If audio isn't playing yet, start it so the user hears changes immediately
  function syncLiveAudio() {
    if (!liveGainNodes || !liveActx) {
      startAudio();
      // Style the play button as active
      const btn = document.getElementById('violin-play');
      if (btn) { btn.textContent = '\u25A0 Stop'; btn.style.background = '#dc2626'; }
      return;
    }
    const now = liveActx.currentTime;
    const f0 = parseFloat(f0Slider?.value || 440);
    for (let n = 1; n <= nHarmonics; n++) {
      liveGainNodes[n - 1].gain.setTargetAtTime(amps[n - 1] * 0.5, now, 0.02);
      liveOscNodes[n - 1].frequency.setTargetAtTime(f0 * n, now, 0.02);
    }
  }

  // Plot geometry
  const plotL = 60, plotR = W - 20, plotT = 30, plotB = H - 40;
  const plotW = plotR - plotL, plotH = plotB - plotT;

  function lorentzian(f, fc, gamma) {
    const df = f - fc;
    return (gamma * gamma / 4) / (df * df + gamma * gamma / 4);
  }

  // Get pixel positions of the three drag handles for harmonic n
  function getHandles(n) {
    const f0 = parseFloat(f0Slider?.value || 440);
    const fMax = f0 * (nHarmonics + 0.5);
    const fc = n * f0;
    const Q = Qs[n - 1];
    const gamma = fc / Q;
    const amp = amps[n - 1];

    // Center x of this harmonic
    const cx = plotL + (fc / fMax) * plotW;
    // Top of peak (amplitude handle)
    const cy = plotB - amp * plotH * 0.88;

    // Half-max width in pixels: at half-max of Lorentzian, df = gamma/2
    const halfWidthHz = gamma / 2;
    const halfWidthPx = (halfWidthHz / fMax) * plotW;
    // Clamp minimum visual width so handles are always grabbable
    const hw = Math.max(halfWidthPx, 8);

    // Width handles sit at half-height of the peak
    const midY = plotB - amp * plotH * 0.88 * 0.5;

    return {
      top: { x: cx, y: cy },                         // amplitude handle
      left: { x: cx - hw, y: midY },                 // width handle (left)
      right: { x: cx + hw, y: midY },                // width handle (right)
      cx, halfWidthPx: hw
    };
  }

  // Drag state: { type: 'amp'|'width', n: harmonic number }
  let drag = null;
  let hovered = null; // same shape

  function hitTest(mx, my) {
    const R = 10; // hit radius
    // Check width handles first (they're smaller targets)
    for (let n = nHarmonics; n >= 1; n--) {
      if (amps[n - 1] < 0.01) continue;
      const h = getHandles(n);
      // Left width handle
      if ((mx - h.left.x) ** 2 + (my - h.left.y) ** 2 < R * R)
        return { type: 'width', n };
      // Right width handle
      if ((mx - h.right.x) ** 2 + (my - h.right.y) ** 2 < R * R)
        return { type: 'width', n };
    }
    // Then amplitude handles (top circles)
    for (let n = nHarmonics; n >= 1; n--) {
      const h = getHandles(n);
      if ((mx - h.top.x) ** 2 + (my - h.top.y) ** 2 < R * R)
        return { type: 'amp', n };
      // Also allow clicking anywhere along the vertical center line of a harmonic
      if (Math.abs(mx - h.cx) < 8 && my >= plotT - 5 && my <= plotB + 5)
        return { type: 'amp', n };
    }
    return null;
  }

  function canvasCoords(e, touch) {
    const rect = canvas.getBoundingClientRect();
    const src = touch || e;
    const dpr = window.devicePixelRatio || 1;
    return {
      x: (src.clientX - rect.left) * (canvas.width / rect.width) / dpr,
      y: (src.clientY - rect.top) * (canvas.height / rect.height) / dpr
    };
  }

  function applyDrag(mx, my) {
    if (!drag) return;
    if (drag.type === 'amp') {
      amps[drag.n - 1] = Math.max(0, Math.min(1, (plotB - my) / (plotH * 0.88)));
    } else {
      // Width drag: map horizontal distance from center to Q
      const f0 = parseFloat(f0Slider?.value || 440);
      const fMax = f0 * (nHarmonics + 0.5);
      const fc = drag.n * f0;
      const cx = plotL + (fc / fMax) * plotW;
      const dx = Math.abs(mx - cx);
      // dx in pixels → halfWidthHz → gamma → Q
      const halfWidthHz = Math.max(5, dx / plotW * fMax);
      const gamma = halfWidthHz * 2;
      const Q = Math.max(5, Math.min(100, fc / gamma));
      Qs[drag.n - 1] = Q;
    }
    activePreset = '';
    updatePresetBtns();
    draw();
    syncLiveAudio();
  }

  canvas.addEventListener('mousedown', (e) => {
    const { x, y } = canvasCoords(e);
    const hit = hitTest(x, y);
    if (hit) {
      drag = hit;
      applyDrag(x, y);
      e.preventDefault();
    }
  });

  canvas.addEventListener('mousemove', (e) => {
    const { x, y } = canvasCoords(e);
    if (drag) {
      applyDrag(x, y);
    } else {
      const hit = hitTest(x, y);
      if (hit?.type !== hovered?.type || hit?.n !== hovered?.n) {
        hovered = hit;
        canvas.style.cursor = hit ? (hit.type === 'amp' ? 'ns-resize' : 'ew-resize') : 'default';
        draw();
      }
    }
  });

  // Use document-level mouseup so drag clears even if mouse leaves canvas
  document.addEventListener('mouseup', () => { drag = null; });
  canvas.addEventListener('mouseleave', () => {
    hovered = null;
    canvas.style.cursor = 'default';
    draw();
  });

  // Touch support
  canvas.addEventListener('touchstart', (e) => {
    const { x, y } = canvasCoords(e, e.touches[0]);
    const hit = hitTest(x, y);
    if (hit) { drag = hit; applyDrag(x, y); e.preventDefault(); }
  }, { passive: false });

  canvas.addEventListener('touchmove', (e) => {
    if (drag) {
      const { x, y } = canvasCoords(e, e.touches[0]);
      applyDrag(x, y);
      e.preventDefault();
    }
  }, { passive: false });

  canvas.addEventListener('touchend', () => { drag = null; });

  function draw() {
    const f0 = parseFloat(f0Slider?.value || 440);
    document.getElementById('violin-f0-val')?.replaceChildren(document.createTextNode(f0.toFixed(0) + ' Hz'));

    wClear(ctx, W, H);

    const fMax = f0 * (nHarmonics + 0.5);

    // Axes
    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(plotL, plotB); ctx.lineTo(plotR, plotB); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(plotL, plotB); ctx.lineTo(plotL, plotT); ctx.stroke();

    // Axis labels
    ctx.fillStyle = WCOLORS.textDim; ctx.font = '10px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('Frequency (Hz)', plotL + plotW / 2, H - 4);
    ctx.save(); ctx.translate(plotL - 40, plotT + plotH / 2); ctx.rotate(-Math.PI / 2);
    ctx.fillText('Amplitude', 0, 0); ctx.restore();

    // Frequency grid lines
    for (let n = 1; n <= nHarmonics; n++) {
      const fx = plotL + (n * f0 / fMax) * plotW;
      ctx.strokeStyle = WCOLORS.grid; ctx.lineWidth = 0.5;
      ctx.beginPath(); ctx.moveTo(fx, plotB); ctx.lineTo(fx, plotT); ctx.stroke();
      ctx.fillStyle = WCOLORS.textDim; ctx.font = '10px system-ui'; ctx.textAlign = 'center';
      ctx.fillText((n * f0).toFixed(0), fx, plotB + 12);
    }

    // Compute full spectrum from Lorentzian peaks with per-harmonic Q
    const nPts = 600;
    let maxVal = 0;
    const vals = [];
    for (let i = 0; i < nPts; i++) {
      const f = fMax * i / nPts;
      let val = 0;
      for (let n = 1; n <= nHarmonics; n++) {
        const fc = n * f0;
        const gamma = fc / Qs[n - 1];
        val += amps[n - 1] * lorentzian(f, fc, gamma);
      }
      vals.push(val);
      if (val > maxVal) maxVal = val;
    }
    if (maxVal < 0.001) maxVal = 1;

    // Draw filled spectrum curve
    ctx.beginPath();
    for (let i = 0; i < nPts; i++) {
      const fx = plotL + plotW * i / nPts;
      const fy = plotB - (vals[i] / maxVal) * plotH * 0.88;
      i === 0 ? ctx.moveTo(fx, fy) : ctx.lineTo(fx, fy);
    }
    ctx.strokeStyle = WCOLORS.teal; ctx.lineWidth = 2;
    ctx.stroke();
    ctx.lineTo(plotL + plotW, plotB);
    ctx.lineTo(plotL, plotB);
    ctx.closePath();
    ctx.fillStyle = 'rgba(15,118,110,0.08)';
    ctx.fill();

    // Draw drag handles for each harmonic
    for (let n = 1; n <= nHarmonics; n++) {
      const h = getHandles(n);
      const isAmpHover = hovered?.n === n && hovered?.type === 'amp';
      const isWidthHover = hovered?.n === n && hovered?.type === 'width';
      const isAmpDrag = drag?.n === n && drag?.type === 'amp';
      const isWidthDrag = drag?.n === n && drag?.type === 'width';
      const isTopActive = isAmpHover || isAmpDrag;
      const isSideActive = isWidthHover || isWidthDrag;

      // Amplitude handle (circle at peak top)
      const topR = isTopActive ? 7 : 5;
      ctx.beginPath();
      ctx.arc(h.top.x, h.top.y, topR, 0, Math.PI * 2);
      ctx.fillStyle = isTopActive ? WCOLORS.amber : WCOLORS.teal;
      ctx.fill();
      ctx.strokeStyle = isTopActive ? '#fff' : 'rgba(255,255,255,0.5)';
      ctx.lineWidth = isTopActive ? 2 : 1;
      ctx.stroke();

      // Label above
      ctx.fillStyle = isTopActive ? WCOLORS.amber : WCOLORS.text;
      ctx.font = (isTopActive ? 'bold ' : '') + '10px system-ui';
      ctx.textAlign = 'center';
      ctx.fillText('n=' + n, h.top.x, h.top.y - topR - 3);

      // Width handles (only visible if amplitude > 0)
      if (amps[n - 1] > 0.02) {
        const sideR = isSideActive ? 5.5 : 3.5;
        const sideColor = isSideActive ? WCOLORS.amber : 'rgba(245,158,11,0.6)';

        // Dashed line connecting left-right handles through center
        ctx.setLineDash([3, 3]);
        ctx.strokeStyle = isSideActive ? WCOLORS.amber : 'rgba(245,158,11,0.3)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(h.left.x, h.left.y);
        ctx.lineTo(h.right.x, h.right.y);
        ctx.stroke();
        ctx.setLineDash([]);

        // Left handle
        ctx.beginPath();
        ctx.arc(h.left.x, h.left.y, sideR, 0, Math.PI * 2);
        ctx.fillStyle = sideColor;
        ctx.fill();
        if (isSideActive) { ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.5; ctx.stroke(); }

        // Right handle
        ctx.beginPath();
        ctx.arc(h.right.x, h.right.y, sideR, 0, Math.PI * 2);
        ctx.fillStyle = sideColor;
        ctx.fill();
        if (isSideActive) { ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.5; ctx.stroke(); }
      }
    }

    // Title
    const titleText = activePreset ? presets[activePreset].label + ' Spectrum' : 'Custom Spectrum';
    ctx.fillStyle = WCOLORS.text; ctx.font = 'bold 12px system-ui'; ctx.textAlign = 'center';
    ctx.fillText(titleText, plotL + plotW / 2, 18);

    // Hint
    ctx.fillStyle = WCOLORS.textDim; ctx.font = '9px system-ui'; ctx.textAlign = 'right';
    ctx.fillText('Drag peaks \u2195 or widths \u2194', plotR, 18);
  }

  f0Slider?.addEventListener('input', () => {
    draw();
    syncLiveAudio();
  });
  draw();
  updatePresetBtns();
}

// =========================================================================
// 2. Fourier Transform Derivation (discrete → continuous)
// =========================================================================
function initFourierTransformDerivation() {
  const canvas = document.getElementById('scene-fourier-transform-derivation');
  if (!canvas) return;
  const setup = wSetupCanvas(canvas);
  if (!setup) return;
  const { ctx, W, H } = setup;

  let lSlider = document.getElementById('ftd-L');
  if (!lSlider) {
    const parent = canvas.parentElement;
    if (parent) {
      const controls = document.createElement('div');
      controls.className = 'scene-controls';
      controls.innerHTML =
        '<label>L: <input type="range" id="ftd-L" min="1" max="20" step="0.5" value="3"><span class="scene-val" id="ftd-L-val">3.0</span></label>';
      parent.appendChild(controls);
      lSlider = document.getElementById('ftd-L');
    }
  }

  function gaussian(x, sigma) {
    return Math.exp(-x * x / (2 * sigma * sigma));
  }

  function gaussianFT(k, sigma) {
    // FT of Gaussian is Gaussian: sigma_k = 1/sigma
    return Math.exp(-k * k * sigma * sigma / 2);
  }

  function draw() {
    const L = parseFloat(lSlider?.value || 3);
    document.getElementById('ftd-L-val')?.replaceChildren(document.createTextNode(L.toFixed(1)));

    wClear(ctx, W, H);

    const midW = W / 2;
    const sigma = 1.0;

    // Left panel: discrete spectrum
    const lL = 40, lR = midW - 20, lT = 40, lB = H - 40;
    const lW = lR - lL, lH = lB - lT;

    // Right panel: continuous FT
    const rL = midW + 20, rR = W - 20, rT = 40, rB = H - 40;
    const rW = rR - rL, rH = rB - rT;

    // Titles
    ctx.fillStyle = WCOLORS.text; ctx.font = 'bold 11px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('Discrete (Fourier Series), L = ' + L.toFixed(1), lL + lW / 2, 18);
    ctx.fillText('Continuous (Fourier Transform)', rL + rW / 2, 18);

    // k range
    const kMax = 8;

    // Left axes
    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(lL, lB); ctx.lineTo(lR, lB); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(lL, lB); ctx.lineTo(lL, lT); ctx.stroke();

    // Draw discrete bars at k_n = n * 2π/L
    const dk = 2 * Math.PI / L;
    const barWidth = Math.max(2, Math.min(8, dk / kMax * lW * 0.4));
    ctx.fillStyle = WCOLORS.teal;
    for (let n = -Math.ceil(kMax / dk); n <= Math.ceil(kMax / dk); n++) {
      const k = n * dk;
      if (Math.abs(k) > kMax) continue;
      const amp = gaussianFT(k, sigma);
      const bx = lL + (k + kMax) / (2 * kMax) * lW;
      const bh = amp * lH * 0.85;
      ctx.fillRect(bx - barWidth / 2, lB - bh, barWidth, bh);
    }

    // Draw continuous envelope on left (dashed)
    ctx.strokeStyle = WCOLORS.amber; ctx.lineWidth = 1.5; ctx.setLineDash([4, 3]);
    ctx.beginPath();
    for (let i = 0; i <= 200; i++) {
      const k = -kMax + 2 * kMax * i / 200;
      const amp = gaussianFT(k, sigma);
      const px = lL + (k + kMax) / (2 * kMax) * lW;
      const py = lB - amp * lH * 0.85;
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.stroke(); ctx.setLineDash([]);

    // Right axes
    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(rL, rB); ctx.lineTo(rR, rB); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(rL, rB); ctx.lineTo(rL, rT); ctx.stroke();

    // Draw continuous FT on right
    ctx.strokeStyle = WCOLORS.amber; ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i <= 200; i++) {
      const k = -kMax + 2 * kMax * i / 200;
      const amp = gaussianFT(k, sigma);
      const px = rL + (k + kMax) / (2 * kMax) * rW;
      const py = rB - amp * rH * 0.85;
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Fill under continuous
    ctx.lineTo(rR, rB); ctx.lineTo(rL, rB); ctx.closePath();
    ctx.fillStyle = 'rgba(217,119,6,0.1)'; ctx.fill();

    // Axis labels
    ctx.fillStyle = WCOLORS.textDim; ctx.font = '10px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('k (wavenumber)', lL + lW / 2, lB + 18);
    ctx.fillText('k (wavenumber)', rL + rW / 2, rB + 18);
    ctx.fillText('|c\u2099|', lL - 8, lT + 10);
    ctx.fillText('|F\u0302(k)|', rL - 8, rT + 10);

    // Math note
    ctx.fillStyle = WCOLORS.textDim; ctx.font = '10px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('Spacing \u0394k = 2\u03C0/L = ' + dk.toFixed(2), lL + lW / 2, lB + 32);
    ctx.fillText('As L \u2192 \u221E, bars merge into continuous curve', W / 2, H - 5);
  }

  lSlider?.addEventListener('input', draw);
  draw();
}

// =========================================================================
// 3. Underdamped Fourier Transform
// =========================================================================
function initUnderdampedFourierTransform() {
  const canvas = document.getElementById('scene-underdamped-fourier-transform');
  if (!canvas) return;
  const setup = wSetupCanvas(canvas);
  if (!setup) return;
  const { ctx, W, H } = setup;

  let gammaSlider = document.getElementById('uft-gamma');
  if (!gammaSlider) {
    const parent = canvas.parentElement;
    if (parent) {
      const controls = document.createElement('div');
      controls.className = 'scene-controls';
      controls.innerHTML =
        '<label>\u03B3: <input type="range" id="uft-gamma" min="0.1" max="3" step="0.1" value="0.5"><span class="scene-val" id="uft-gamma-val">0.5</span></label>' +
        '<label>\u03C9\u2080: <input type="range" id="uft-omega0" min="2" max="10" step="0.5" value="5"><span class="scene-val" id="uft-omega0-val">5.0</span></label>';
      parent.appendChild(controls);
      gammaSlider = document.getElementById('uft-gamma');
    }
  }
  const omega0Slider = document.getElementById('uft-omega0');

  function draw() {
    const gamma = parseFloat(gammaSlider?.value || 0.5);
    const omega0 = parseFloat(omega0Slider?.value || 5);
    document.getElementById('uft-gamma-val')?.replaceChildren(document.createTextNode(gamma.toFixed(1)));
    document.getElementById('uft-omega0-val')?.replaceChildren(document.createTextNode(omega0.toFixed(1)));

    wClear(ctx, W, H);

    const midW = W / 2;

    // Left panel: x(t)
    const lL = 50, lR = midW - 15, lT = 35, lB = H - 35;
    const lW = lR - lL, lH = lB - lT;
    const lMid = (lT + lB) / 2;

    // Right panel: |F(ω)|²
    const rL = midW + 25, rR = W - 20, rT = 35, rB = H - 35;
    const rW = rR - rL, rH = rB - rT;

    // Titles
    ctx.fillStyle = WCOLORS.text; ctx.font = 'bold 11px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('Time Domain: x(t) = e^(\u2013\u03B3t/2) cos(\u03C9\u2080t)', lL + lW / 2, 18);
    ctx.fillText('Power Spectrum: |F(\u03C9)|\u00B2', rL + rW / 2, 18);

    // Left axes
    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(lL, lB); ctx.lineTo(lR, lB); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(lL, lMid); ctx.lineTo(lR, lMid); ctx.stroke();
    ctx.strokeStyle = WCOLORS.grid; ctx.lineWidth = 0.5;
    ctx.beginPath(); ctx.moveTo(lL, lT + lH * 0.25); ctx.lineTo(lR, lT + lH * 0.25); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(lL, lT + lH * 0.75); ctx.lineTo(lR, lT + lH * 0.75); ctx.stroke();

    // Draw x(t)
    const tMax = 10;
    ctx.strokeStyle = WCOLORS.teal; ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i <= 300; i++) {
      const t = tMax * i / 300;
      const x = Math.exp(-gamma * t / 2) * Math.cos(omega0 * t);
      const px = lL + (t / tMax) * lW;
      const py = lMid - x * lH * 0.4;
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Draw envelope
    ctx.strokeStyle = WCOLORS.amber; ctx.lineWidth = 1; ctx.setLineDash([4, 3]);
    ctx.beginPath();
    for (let i = 0; i <= 300; i++) {
      const t = tMax * i / 300;
      const env = Math.exp(-gamma * t / 2);
      const px = lL + (t / tMax) * lW;
      const py = lMid - env * lH * 0.4;
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.stroke();
    ctx.beginPath();
    for (let i = 0; i <= 300; i++) {
      const t = tMax * i / 300;
      const env = -Math.exp(-gamma * t / 2);
      const px = lL + (t / tMax) * lW;
      const py = lMid - env * lH * 0.4;
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.stroke(); ctx.setLineDash([]);

    // Label the envelope
    ctx.fillStyle = WCOLORS.amber; ctx.font = '9px system-ui'; ctx.textAlign = 'left';
    ctx.fillText('envelope: e^(\u2013\u03B3t/2)', lL + 5, lT + 12);

    // Right axes
    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(rL, rB); ctx.lineTo(rR, rB); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(rL, rB); ctx.lineTo(rL, rT); ctx.stroke();

    // Draw |F(ω)|² = Lorentzian centered at ω₀ with width γ
    const omegaMax = omega0 * 2.5;
    let maxPow = 0;
    const powVals = [];
    for (let i = 0; i <= 300; i++) {
      const omega = omegaMax * i / 300;
      const dw = omega - omega0;
      const pow = 1 / (dw * dw + gamma * gamma / 4);
      powVals.push(pow);
      if (pow > maxPow) maxPow = pow;
    }

    ctx.strokeStyle = WCOLORS.blue; ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i <= 300; i++) {
      const px = rL + (i / 300) * rW;
      const py = rB - (powVals[i] / maxPow) * rH * 0.85;
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Fill under
    ctx.lineTo(rR, rB); ctx.lineTo(rL, rB); ctx.closePath();
    ctx.fillStyle = 'rgba(37,99,235,0.08)'; ctx.fill();

    // Mark peak and width
    const peakX = rL + (omega0 / omegaMax) * rW;
    ctx.strokeStyle = WCOLORS.red; ctx.lineWidth = 1; ctx.setLineDash([3, 3]);
    ctx.beginPath(); ctx.moveTo(peakX, rB); ctx.lineTo(peakX, rT); ctx.stroke();
    ctx.setLineDash([]);

    // Width markers
    const halfPeakY = rB - rH * 0.85 * 0.5;
    const leftHalf = rL + ((omega0 - gamma / 2) / omegaMax) * rW;
    const rightHalf = rL + ((omega0 + gamma / 2) / omegaMax) * rW;
    if (leftHalf > rL) {
      ctx.strokeStyle = WCOLORS.amber; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(leftHalf, halfPeakY); ctx.lineTo(rightHalf, halfPeakY); ctx.stroke();
      // Arrow heads
      ctx.beginPath(); ctx.moveTo(leftHalf, halfPeakY - 3); ctx.lineTo(leftHalf, halfPeakY + 3); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(rightHalf, halfPeakY - 3); ctx.lineTo(rightHalf, halfPeakY + 3); ctx.stroke();
      ctx.fillStyle = WCOLORS.amber; ctx.font = '10px system-ui'; ctx.textAlign = 'center';
      ctx.fillText('\u03B3', (leftHalf + rightHalf) / 2, halfPeakY - 6);
    }

    // Axis labels
    ctx.fillStyle = WCOLORS.textDim; ctx.font = '10px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('t', lL + lW / 2, lB + 16);
    ctx.fillText('\u03C9', rL + rW / 2, rB + 16);
    ctx.fillText('\u03C9\u2080', peakX, rB + 16);
  }

  gammaSlider?.addEventListener('input', draw);
  omega0Slider?.addEventListener('input', draw);
  draw();
}

// =========================================================================
// 4. Fourier Magnitude & Phase (2D Image Swap)
// =========================================================================
function initFourierMagnitudePhase() {
  const container = document.getElementById('fmp-container');
  if (!container) return;

  const N = 128; // image size (must be power of 2 for FFT)

  // --- Image cache ---
  const imageCache = {};

  // Photo-based images (loaded from files)
  const photoImages = ['cat', 'panda', 'einstein', 'sunflower', 'butterfly', 'guitar'];

  // --- Load an image file and extract NxN grayscale pixels ---
  function loadImageFile(name) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const oc = document.createElement('canvas');
        oc.width = N; oc.height = N;
        const g = oc.getContext('2d');
        // Draw centered and cropped to square
        const s = Math.min(img.width, img.height);
        const sx = (img.width - s) / 2, sy = (img.height - s) / 2;
        g.drawImage(img, sx, sy, s, s, 0, 0, N, N);
        const imgData = g.getImageData(0, 0, N, N);
        const pixels = new Float64Array(N * N);
        for (let i = 0; i < N * N; i++) {
          // Convert to grayscale using luminance weights
          const r = imgData.data[i * 4];
          const gr = imgData.data[i * 4 + 1];
          const b = imgData.data[i * 4 + 2];
          pixels[i] = (0.299 * r + 0.587 * gr + 0.114 * b) / 255;
        }
        resolve(pixels);
      };
      img.onerror = () => {
        // Fallback to procedural star if image fails to load
        resolve(makeProceduralImage('star'));
      };
      img.src = 'images/' + name + '.png';
    });
  }

  // --- Procedural image generators (draw white on black, N×N) ---
  function makeProceduralImage(type) {
    const oc = document.createElement('canvas');
    oc.width = N; oc.height = N;
    const g = oc.getContext('2d');
    g.fillStyle = '#000'; g.fillRect(0, 0, N, N);
    g.fillStyle = '#fff'; g.strokeStyle = '#fff';
    const cx = N / 2, cy = N / 2;

    if (type === 'star') {
      g.beginPath();
      for (let i = 0; i < 10; i++) {
        const r = (i % 2 === 0) ? N * 0.42 : N * 0.18;
        const a = Math.PI / 2 + i * Math.PI / 5;
        const x = cx + r * Math.cos(a), y = cy - r * Math.sin(a);
        i === 0 ? g.moveTo(x, y) : g.lineTo(x, y);
      }
      g.closePath(); g.fill();
    } else if (type === 'checkerboard') {
      const sq = N / 8;
      for (let r = 0; r < 8; r++)
        for (let c = 0; c < 8; c++)
          if ((r + c) % 2 === 0) g.fillRect(c * sq, r * sq, sq, sq);
    }

    const imgData = g.getImageData(0, 0, N, N);
    const pixels = new Float64Array(N * N);
    for (let i = 0; i < N * N; i++) pixels[i] = imgData.data[i * 4] / 255;
    return pixels;
  }

  // --- Get image pixels (async, uses cache) ---
  async function getImage(type) {
    if (imageCache[type]) return imageCache[type];
    let pixels;
    if (photoImages.includes(type)) {
      pixels = await loadImageFile(type);
    } else {
      pixels = makeProceduralImage(type);
    }
    imageCache[type] = pixels;
    return pixels;
  }

  // --- Cooley-Tukey radix-2 FFT (1D, in-place) ---
  function fft1d(re, im, invert) {
    const n = re.length;
    for (let i = 1, j = 0; i < n; i++) {
      let bit = n >> 1;
      for (; j & bit; bit >>= 1) j ^= bit;
      j ^= bit;
      if (i < j) {
        [re[i], re[j]] = [re[j], re[i]];
        [im[i], im[j]] = [im[j], im[i]];
      }
    }
    for (let len = 2; len <= n; len <<= 1) {
      const halfLen = len >> 1;
      const angle = (invert ? -1 : 1) * 2 * Math.PI / len;
      const wRe = Math.cos(angle), wIm = Math.sin(angle);
      for (let i = 0; i < n; i += len) {
        let curRe = 1, curIm = 0;
        for (let j = 0; j < halfLen; j++) {
          const uRe = re[i + j], uIm = im[i + j];
          const vRe = re[i + j + halfLen] * curRe - im[i + j + halfLen] * curIm;
          const vIm = re[i + j + halfLen] * curIm + im[i + j + halfLen] * curRe;
          re[i + j] = uRe + vRe; im[i + j] = uIm + vIm;
          re[i + j + halfLen] = uRe - vRe; im[i + j + halfLen] = uIm - vIm;
          const tmpRe = curRe * wRe - curIm * wIm;
          curIm = curRe * wIm + curIm * wRe;
          curRe = tmpRe;
        }
      }
    }
    if (invert) {
      for (let i = 0; i < n; i++) { re[i] /= n; im[i] /= n; }
    }
  }

  // --- 2D FFT (separable: rows then columns) ---
  function fft2d(pixels, invert) {
    const re = new Float64Array(N * N);
    const im = new Float64Array(N * N);
    if (!invert) for (let i = 0; i < N * N; i++) re[i] = pixels[i];
    else { re.set(pixels.re); im.set(pixels.im); }

    const rowRe = new Float64Array(N), rowIm = new Float64Array(N);
    for (let y = 0; y < N; y++) {
      for (let x = 0; x < N; x++) { rowRe[x] = re[y * N + x]; rowIm[x] = im[y * N + x]; }
      fft1d(rowRe, rowIm, invert);
      for (let x = 0; x < N; x++) { re[y * N + x] = rowRe[x]; im[y * N + x] = rowIm[x]; }
    }
    const colRe = new Float64Array(N), colIm = new Float64Array(N);
    for (let x = 0; x < N; x++) {
      for (let y = 0; y < N; y++) { colRe[y] = re[y * N + x]; colIm[y] = im[y * N + x]; }
      fft1d(colRe, colIm, invert);
      for (let y = 0; y < N; y++) { re[y * N + x] = colRe[y]; im[y * N + x] = colIm[y]; }
    }
    return { re, im };
  }

  function decompose(ft) {
    const mag = new Float64Array(N * N);
    const phase = new Float64Array(N * N);
    for (let i = 0; i < N * N; i++) {
      mag[i] = Math.sqrt(ft.re[i] * ft.re[i] + ft.im[i] * ft.im[i]);
      phase[i] = Math.atan2(ft.im[i], ft.re[i]);
    }
    return { mag, phase };
  }

  function recombine(mag, phase) {
    const re = new Float64Array(N * N);
    const im = new Float64Array(N * N);
    for (let i = 0; i < N * N; i++) {
      re[i] = mag[i] * Math.cos(phase[i]);
      im[i] = mag[i] * Math.sin(phase[i]);
    }
    return { re, im };
  }

  function renderToCanvas(canvasId, pixels, logMag) {
    const cvs = document.getElementById(canvasId);
    if (!cvs) return;
    cvs.width = N; cvs.height = N;
    const g = cvs.getContext('2d');
    const imgData = g.createImageData(N, N);

    if (logMag) {
      const shifted = new Float64Array(N * N);
      for (let y = 0; y < N; y++)
        for (let x = 0; x < N; x++) {
          const sy = (y + N / 2) % N, sx = (x + N / 2) % N;
          shifted[y * N + x] = pixels[sy * N + sx];
        }
      let maxVal = 0;
      const logArr = new Float64Array(N * N);
      for (let i = 0; i < N * N; i++) {
        logArr[i] = Math.log(1 + shifted[i]);
        if (logArr[i] > maxVal) maxVal = logArr[i];
      }
      if (maxVal === 0) maxVal = 1;
      for (let i = 0; i < N * N; i++) {
        const v = Math.round(255 * logArr[i] / maxVal);
        imgData.data[i * 4] = v;
        imgData.data[i * 4 + 1] = v;
        imgData.data[i * 4 + 2] = v;
        imgData.data[i * 4 + 3] = 255;
      }
    } else {
      let mn = Infinity, mx = -Infinity;
      for (let i = 0; i < N * N; i++) {
        if (pixels[i] < mn) mn = pixels[i];
        if (pixels[i] > mx) mx = pixels[i];
      }
      const range = mx - mn || 1;
      for (let i = 0; i < N * N; i++) {
        const v = Math.round(255 * (pixels[i] - mn) / range);
        imgData.data[i * 4] = v;
        imgData.data[i * 4 + 1] = v;
        imgData.data[i * 4 + 2] = v;
        imgData.data[i * 4 + 3] = 255;
      }
    }
    g.putImageData(imgData, 0, 0);
  }

  // --- Main update (async for image loading) ---
  let updating = false;
  async function update() {
    if (updating) return;
    updating = true;
    const selA = document.getElementById('fmp-selA');
    const selB = document.getElementById('fmp-selB');
    const typeA = selA ? selA.value : 'cat';
    const typeB = selB ? selB.value : 'panda';

    const [pixA, pixB] = await Promise.all([getImage(typeA), getImage(typeB)]);

    renderToCanvas('fmp-imgA', pixA, false);
    renderToCanvas('fmp-imgB', pixB, false);

    const ftA = fft2d(pixA, false);
    const ftB = fft2d(pixB, false);
    const dA = decompose(ftA);
    const dB = decompose(ftB);

    renderToCanvas('fmp-magA', dA.mag, true);
    renderToCanvas('fmp-magB', dB.mag, true);

    const swapAB = recombine(dA.mag, dB.phase);
    const resultAB = fft2d(swapAB, true);
    renderToCanvas('fmp-swapAB', resultAB.re, false);

    const swapBA = recombine(dB.mag, dA.phase);
    const resultBA = fft2d(swapBA, true);
    renderToCanvas('fmp-swapBA', resultBA.re, false);
    updating = false;
  }

  document.getElementById('fmp-selA')?.addEventListener('change', update);
  document.getElementById('fmp-selB')?.addEventListener('change', update);
  update();
}

// =========================================================================
// 5. Fourier Filtering
// =========================================================================
function initFourierFiltering() {
  const canvas = document.getElementById('scene-fourier-filtering');
  if (!canvas) return;
  const setup = wSetupCanvas(canvas);
  if (!setup) return;
  const { ctx, W, H } = setup;

  let cutoffSlider = document.getElementById('ff-cutoff');
  if (!cutoffSlider) {
    const parent = canvas.parentElement;
    if (parent) {
      const controls = document.createElement('div');
      controls.className = 'scene-controls';
      controls.innerHTML =
        '<label>Cutoff frequency: <input type="range" id="ff-cutoff" min="1" max="30" step="1" value="8"><span class="scene-val" id="ff-cutoff-val">8</span></label>';
      parent.appendChild(controls);
      cutoffSlider = document.getElementById('ff-cutoff');
    }
  }

  // Play buttons (append to existing controls)
  {
    const controls = cutoffSlider?.closest('.scene-controls') || canvas.parentElement;
    if (controls && !document.getElementById('ff-play-orig')) {
      wMakePlayBtn(controls, 'ff-play-orig', '\u25B6 Original', () => {
        ffPlaySignal('ff-play-orig', null);
      });
      wMakePlayBtn(controls, 'ff-play-lp', '\u25B6 Low-pass', () => {
        ffPlaySignal('ff-play-lp', 'lp');
      });
      wMakePlayBtn(controls, 'ff-play-hp', '\u25B6 High-pass', () => {
        ffPlaySignal('ff-play-hp', 'hp');
      });
    }
  }

  function ffPlaySignal(id, filterType) {
    const cutoff = parseInt(cutoffSlider?.value || 8);
    const N2 = 256;
    const sig = new Array(N2);
    for (let i = 0; i < N2; i++) {
      const t = i / N2;
      sig[i] = Math.sin(2 * Math.PI * 3 * t) + 0.5 * Math.sin(2 * Math.PI * 7 * t) +
               0.8 * Math.sin(2 * Math.PI * 20 * t) + 0.4 * Math.sin(2 * Math.PI * 25 * t);
    }
    if (filterType) {
      // Simple DFT filter
      const re = new Array(N2).fill(0), im = new Array(N2).fill(0);
      for (let k = 0; k < N2; k++) {
        for (let j = 0; j < N2; j++) {
          const angle = -2 * Math.PI * k * j / N2;
          re[k] += sig[j] * Math.cos(angle);
          im[k] += sig[j] * Math.sin(angle);
        }
      }
      for (let k = 0; k < N2; k++) {
        const freq = Math.min(k, N2 - k);
        if (filterType === 'lp' && freq > cutoff) { re[k] = 0; im[k] = 0; }
        if (filterType === 'hp' && freq <= cutoff) { re[k] = 0; im[k] = 0; }
      }
      for (let j = 0; j < N2; j++) {
        sig[j] = 0;
        for (let k = 0; k < N2; k++) {
          const angle = 2 * Math.PI * k * j / N2;
          sig[j] += re[k] * Math.cos(angle) - im[k] * Math.sin(angle);
        }
        sig[j] /= N2;
      }
    }
    wPlayBuffer(id, sig, 220, 3);
  }

  const N = 256;
  // Build composite signal: low freq + high freq + noise
  const signal = new Array(N);
  for (let i = 0; i < N; i++) {
    const t = i / N;
    signal[i] = Math.sin(2 * Math.PI * 3 * t) + 0.5 * Math.sin(2 * Math.PI * 7 * t) +
                0.8 * Math.sin(2 * Math.PI * 20 * t) + 0.4 * Math.sin(2 * Math.PI * 25 * t);
  }

  // Simple DFT / IDFT
  function dft(sig) {
    const n = sig.length;
    const re = new Array(n).fill(0);
    const im = new Array(n).fill(0);
    for (let k = 0; k < n; k++) {
      for (let j = 0; j < n; j++) {
        const angle = -2 * Math.PI * k * j / n;
        re[k] += sig[j] * Math.cos(angle);
        im[k] += sig[j] * Math.sin(angle);
      }
    }
    return { re, im };
  }
  function idft(re, im) {
    const n = re.length;
    const sig = new Array(n).fill(0);
    for (let j = 0; j < n; j++) {
      for (let k = 0; k < n; k++) {
        const angle = 2 * Math.PI * k * j / n;
        sig[j] += re[k] * Math.cos(angle) - im[k] * Math.sin(angle);
      }
      sig[j] /= n;
    }
    return sig;
  }

  const ft = dft(signal);

  function drawSig(arr, x0, y0, w, h, color, label) {
    const maxV = Math.max(...arr.map(Math.abs), 0.001);
    const mid = y0 + h / 2;
    ctx.strokeStyle = WCOLORS.grid; ctx.lineWidth = 0.5;
    ctx.beginPath(); ctx.moveTo(x0, mid); ctx.lineTo(x0 + w, mid); ctx.stroke();
    ctx.strokeStyle = color; ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (let i = 0; i < arr.length; i++) {
      const px = x0 + w * i / arr.length;
      const py = mid - (arr[i] / maxV) * h * 0.4;
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.stroke();
    ctx.font = 'bold 10px system-ui'; ctx.textAlign = 'right';
    const labelX = x0 + w - 3;
    const labelY = y0 + 12;
    const lw = ctx.measureText(label).width;
    ctx.fillStyle = 'rgba(0,0,0,0.55)';
    ctx.fillRect(labelX - lw - 3, labelY - 10, lw + 6, 13);
    ctx.fillStyle = color;
    ctx.fillText(label, labelX, labelY);
  }

  function draw() {
    const cutoff = parseInt(cutoffSlider?.value || 8);
    document.getElementById('ff-cutoff-val')?.replaceChildren(document.createTextNode(cutoff.toString()));

    wClear(ctx, W, H);

    // Apply filters
    const lpRe = ft.re.slice(), lpIm = ft.im.slice();
    const hpRe = ft.re.slice(), hpIm = ft.im.slice();
    for (let k = 0; k < N; k++) {
      const freq = Math.min(k, N - k);
      if (freq > cutoff) { lpRe[k] = 0; lpIm[k] = 0; }
      if (freq <= cutoff) { hpRe[k] = 0; hpIm[k] = 0; }
    }
    const lpSig = idft(lpRe, lpIm);
    const hpSig = idft(hpRe, hpIm);

    const rowH = (H - 20) / 3 - 5;
    const plotL = 20, plotW = W - 40;

    drawSig(signal, plotL, 5, plotW, rowH, WCOLORS.axis, 'Original (low + high freq)');
    drawSig(lpSig, plotL, 10 + rowH, plotW, rowH, WCOLORS.teal, 'Low-pass (f \u2264 ' + cutoff + ')');
    drawSig(hpSig, plotL, 15 + 2 * rowH, plotW, rowH, WCOLORS.amber, 'High-pass (f > ' + cutoff + ')');

    // Draw cutoff indicator
    ctx.fillStyle = WCOLORS.textDim; ctx.font = '10px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('Adjust cutoff to separate frequency components', W / 2, H - 2);
  }

  cutoffSlider?.addEventListener('input', draw);
  draw();
}

// =========================================================================
// 6. Dirac Delta Visualization
// =========================================================================
function initDiracDeltaVisualization() {
  const canvas = document.getElementById('scene-dirac-delta-visualization');
  if (!canvas) return;
  const setup = wSetupCanvas(canvas);
  if (!setup) return;
  const { ctx, W, H } = setup;

  let sigmaSlider = document.getElementById('dd-sigma');
  if (!sigmaSlider) {
    const parent = canvas.parentElement;
    if (parent) {
      const controls = document.createElement('div');
      controls.className = 'scene-controls';
      controls.innerHTML =
        '<label>\u03C3: <input type="range" id="dd-sigma" min="0.02" max="1.5" step="0.02" value="0.5"><span class="scene-val" id="dd-sigma-val">0.50</span></label>';
      parent.appendChild(controls);
      sigmaSlider = document.getElementById('dd-sigma');
    }
  }

  function draw() {
    const sigma = parseFloat(sigmaSlider?.value || 0.5);
    document.getElementById('dd-sigma-val')?.replaceChildren(document.createTextNode(sigma.toFixed(2)));

    wClear(ctx, W, H);

    const midW = W / 2;

    // Left panel: Gaussian approaching delta
    const lL = 50, lR = midW - 20, lT = 35, lB = H - 35;
    const lW = lR - lL, lH = lB - lT;

    // Right panel: FT (should be flat)
    const rL = midW + 30, rR = W - 20, rT = 35, rB = H - 35;
    const rW = rR - rL, rH = rB - rT;

    // Titles
    ctx.fillStyle = WCOLORS.text; ctx.font = 'bold 11px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('Gaussian \u2192 \u03B4(x) as \u03C3 \u2192 0', lL + lW / 2, 18);
    ctx.fillText('Fourier Transform', rL + rW / 2, 18);

    // Left axes
    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(lL, lB); ctx.lineTo(lR, lB); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(lL + lW / 2, lB); ctx.lineTo(lL + lW / 2, lT); ctx.stroke();

    // Draw multiple Gaussians in light colors for reference
    const sigmas = [1.5, 1.0, 0.5, 0.2];
    const xRange = 4;
    sigmas.forEach(s => {
      if (Math.abs(s - sigma) < 0.05) return;
      ctx.strokeStyle = 'rgba(31,42,46,0.12)'; ctx.lineWidth = 1;
      ctx.beginPath();
      for (let i = 0; i <= 200; i++) {
        const x = -xRange + 2 * xRange * i / 200;
        const g = (1 / (s * Math.sqrt(2 * Math.PI))) * Math.exp(-x * x / (2 * s * s));
        const maxDisplay = 1 / (0.02 * Math.sqrt(2 * Math.PI));
        const px = lL + (x + xRange) / (2 * xRange) * lW;
        const py = lB - Math.min(g / maxDisplay, 1) * lH * 0.9;
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.stroke();
    });

    // Draw current Gaussian
    const maxDisplay = 1 / (0.02 * Math.sqrt(2 * Math.PI));
    ctx.strokeStyle = WCOLORS.teal; ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let i = 0; i <= 400; i++) {
      const x = -xRange + 2 * xRange * i / 400;
      const g = (1 / (sigma * Math.sqrt(2 * Math.PI))) * Math.exp(-x * x / (2 * sigma * sigma));
      const px = lL + (x + xRange) / (2 * xRange) * lW;
      const py = lB - Math.min(g / maxDisplay, 1) * lH * 0.9;
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Area = 1 label
    ctx.fillStyle = WCOLORS.amber; ctx.font = 'bold 11px system-ui'; ctx.textAlign = 'left';
    ctx.fillText('Area = 1', lL + 5, lT + 15);

    // Right axes
    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(rL, rB); ctx.lineTo(rR, rB); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(rL, rB); ctx.lineTo(rL, rT); ctx.stroke();

    // FT of Gaussian: exp(-σ²k²/2), as σ→0 this → 1 (flat)
    const kMax = 10;
    ctx.strokeStyle = WCOLORS.blue; ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i <= 200; i++) {
      const k = -kMax + 2 * kMax * i / 200;
      const ft = Math.exp(-sigma * sigma * k * k / 2);
      const px = rL + (k + kMax) / (2 * kMax) * rW;
      const py = rB - ft * rH * 0.8;
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Reference line at 1
    ctx.strokeStyle = WCOLORS.grid; ctx.lineWidth = 1; ctx.setLineDash([4, 3]);
    const refY = rB - rH * 0.8;
    ctx.beginPath(); ctx.moveTo(rL, refY); ctx.lineTo(rR, refY); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = WCOLORS.textDim; ctx.font = '11px system-ui'; ctx.textAlign = 'right';
    ctx.fillText('1', rL - 4, refY + 4);

    // Axis labels
    ctx.fillStyle = WCOLORS.textDim; ctx.font = '10px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('x', lL + lW / 2, lB + 16);
    ctx.fillText('k', rL + rW / 2, rB + 16);
    ctx.fillText('\u03B4(x): FT is constant', rL + rW / 2, rB + 30);
  }

  sigmaSlider?.addEventListener('input', draw);
  draw();
}

// =========================================================================
// CHAPTER 9: Reflection & Transmission
// =========================================================================

// =========================================================================
// 7. String Junction (combined physical + decomposed views)
// =========================================================================
function initStringJunction() {
  const canvas = document.getElementById('scene-string-junction');
  if (!canvas) return;
  const setup = wSetupCanvas(canvas);
  if (!setup) return;
  const { ctx, W, H } = setup;

  const zSlider = document.getElementById('sj-z');
  const zValSpan = document.getElementById('sj-z-val');
  const btns = {
    physical: document.getElementById('sj-physical'),
    decomposed: document.getElementById('sj-decomposed'),
    both: document.getElementById('sj-both'),
    'phase-flip': document.getElementById('sj-phase-flip'),
  };
  const btnRestart = document.getElementById('sj-restart');

  let mode = 'physical';
  let t = 0;

  function setMode(m) {
    mode = m;
    t = 0;
    Object.values(btns).forEach(b => b && b.classList.remove('active'));
    if (btns[m]) btns[m].classList.add('active');
  }

  Object.entries(btns).forEach(([m, b]) => b && b.addEventListener('click', () => setMode(m)));
  if (btnRestart) btnRestart.addEventListener('click', () => { t = 0; });
  setMode('physical');

  function tick() {
    if (!canvas.isConnected) return;
    const zRatio = parseFloat(zSlider?.value || 2);
    if (zValSpan) zValSpan.textContent = zRatio.toFixed(1);

    t += 0.02;
    wClear(ctx, W, H);

    const midY = H / 2;
    const jx = W / 2;
    const amp = 40;
    const stringL = 30, stringR = W - 30;
    const sigma = 30;
    const speed = 60;

    // R = (Z₁−Z₂)/(Z₁+Z₂), T = 2Z₁/(Z₁+Z₂), satisfying 1+R = T
    const r = (1 - zRatio) / (1 + zRatio);
    const tr = 2 / (1 + zRatio);
    const thick1 = 2;
    const thick2 = 2 + 5 * Math.sqrt(zRatio);
    const pulseCenter = stringL + speed * t;
    const transSpeed = speed / Math.sqrt(zRatio);
    const delay = (jx - stringL) / speed;
    const transCenter = jx + transSpeed * (t - delay);

    function gaussPulse(x, center, s) {
      return Math.exp(-(x - center) * (x - center) / (2 * s * s));
    }

    // No hasHit gating — all three waves always present.
    // Boundary condition 1+R=T guarantees leftY(jx)=rightY(jx) at all times.
    // Gaussian tails are negligible before the pulse visually reaches the junction.
    function leftY(x) {
      return midY
        - amp * gaussPulse(x, pulseCenter, sigma)
        - amp * r * gaussPulse(x, 2 * jx - pulseCenter, sigma);
    }
    function rightY(x) {
      return midY
        - amp * tr * gaussPulse(x, transCenter, sigma / Math.sqrt(zRatio));
    }

    const junctionY = leftY(jx);

    // --- Physical string view ---
    const showString = mode === 'physical' || mode === 'both' || mode === 'phase-flip';
    const showDecomposed = mode === 'decomposed' || mode === 'both';

    // --- Physical string (used by physical, both, phase-flip) ---
    if (showString) {
      const alpha = mode === 'both' ? 0.3 : 1;
      ctx.globalAlpha = alpha;
      ctx.lineCap = 'round';

      // Precompute y for the entire string as one continuous curve
      const yVals = new Float32Array(stringR - stringL + 1);
      for (let x = stringL; x <= stringR; x++) {
        yVals[x - stringL] = x <= jx ? leftY(x) : rightY(x);
      }

      // Draw thick right half first (jx to stringR)
      ctx.strokeStyle = WCOLORS.teal; ctx.lineWidth = Math.max(2, thick2);
      ctx.beginPath();
      ctx.moveTo(jx, yVals[jx - stringL]);
      for (let x = jx + 1; x <= stringR; x++) ctx.lineTo(x, yVals[x - stringL]);
      ctx.stroke();

      // Draw thin left half on top (stringL to jx), sharing the junction pixel
      ctx.strokeStyle = WCOLORS.teal; ctx.lineWidth = thick1;
      ctx.beginPath();
      ctx.moveTo(stringL, yVals[0]);
      for (let x = stringL + 1; x <= jx; x++) ctx.lineTo(x, yVals[x - stringL]);
      ctx.stroke();

      // Junction marker
      ctx.fillStyle = WCOLORS.red;
      ctx.beginPath(); ctx.arc(jx, junctionY, 4, 0, Math.PI * 2); ctx.fill();

      ctx.lineCap = 'butt';
      ctx.globalAlpha = 1;
    }

    // --- Labels for physical mode ---
    if (mode === 'physical') {
      ctx.fillStyle = WCOLORS.teal; ctx.font = 'bold 11px system-ui';
      ctx.textAlign = 'left'; ctx.fillText('String 1', stringL, 25);
      ctx.textAlign = 'right'; ctx.fillText('String 2', stringR, 25);
      ctx.fillStyle = WCOLORS.text; ctx.font = '10px system-ui'; ctx.textAlign = 'center';
      ctx.fillText('Junction (x = 0)', jx, midY + 55);
      ctx.font = 'bold 14px system-ui'; ctx.fillStyle = WCOLORS.teal;
      ctx.fillText('Z\u2081', jx - 40, midY + 40);
      ctx.fillText('Z\u2082', jx + 40, midY + 40);
    }

    // --- Phase flip labels ---
    if (mode === 'phase-flip') {
      const flipLabel = zRatio > 1.01
        ? 'Z\u2082/Z\u2081 > 1 \u2192 reflected pulse inverts'
        : zRatio < 0.99
          ? 'Z\u2082/Z\u2081 < 1 \u2192 no inversion'
          : 'Matched impedance \u2192 no reflection';
      ctx.fillStyle = WCOLORS.text; ctx.font = 'bold 12px system-ui'; ctx.textAlign = 'left';
      ctx.fillText(flipLabel, stringL, 22);

      // Annotation near reflected pulse
      const refCenter = 2 * jx - pulseCenter;
      if (refCenter > stringL && refCenter < jx && Math.abs(r) > 0.01) {
        ctx.fillStyle = r < 0 ? WCOLORS.red : WCOLORS.teal;
        ctx.font = 'bold 12px system-ui'; ctx.textAlign = 'center';
        ctx.fillText(r < 0 ? 'Phase flip!' : 'No flip', refCenter, midY - amp * Math.abs(r) - 12);
      }
    }

    // --- Decomposed view ---
    if (showDecomposed) {
      // Baseline
      ctx.strokeStyle = WCOLORS.grid; ctx.lineWidth = 0.5;
      ctx.beginPath(); ctx.moveTo(stringL, midY); ctx.lineTo(stringR, midY); ctx.stroke();

      // Junction dashed line
      ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 1; ctx.setLineDash([3, 3]);
      ctx.beginPath(); ctx.moveTo(jx, 25); ctx.lineTo(jx, H - 35); ctx.stroke();
      ctx.setLineDash([]);

      // Incident (teal)
      ctx.strokeStyle = WCOLORS.teal; ctx.lineWidth = 2.5;
      ctx.beginPath();
      for (let x = stringL; x <= jx; x++) {
        const y = midY - amp * gaussPulse(x, pulseCenter, sigma);
        x === stringL ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Reflected (amber)
      ctx.strokeStyle = WCOLORS.amber; ctx.lineWidth = 2.5;
      ctx.beginPath();
      for (let x = stringL; x <= jx; x++) {
        const y = midY - amp * r * gaussPulse(x, 2 * jx - pulseCenter, sigma);
        x === stringL ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Transmitted (blue)
      ctx.strokeStyle = WCOLORS.blue; ctx.lineWidth = 2.5;
      ctx.beginPath();
      for (let x = jx; x <= stringR; x++) {
        const y = midY - amp * tr * gaussPulse(x, transCenter, sigma / Math.sqrt(zRatio));
        x === jx ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Legend
      ctx.font = 'bold 11px system-ui'; ctx.textAlign = 'left';
      const legY = 20;
      ctx.fillStyle = WCOLORS.teal; ctx.fillRect(stringL, legY - 2, 14, 4); ctx.fillText('Incident', stringL + 18, legY + 3);
      ctx.fillStyle = WCOLORS.amber; ctx.fillRect(stringL + 90, legY - 2, 14, 4); ctx.fillText('Reflected', stringL + 108, legY + 3);
      ctx.fillStyle = WCOLORS.blue; ctx.fillRect(stringL + 185, legY - 2, 14, 4); ctx.fillText('Transmitted', stringL + 203, legY + 3);
    }

    // Coefficients (always shown)
    ctx.fillStyle = WCOLORS.text; ctx.font = 'bold 11px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('R = (Z\u2081\u2013Z\u2082)/(Z\u2081+Z\u2082) = ' + r.toFixed(3) + '     T = 2Z\u2081/(Z\u2081+Z\u2082) = ' + tr.toFixed(3), W / 2, H - 12);
    if (r < 0) {
      ctx.fillStyle = WCOLORS.red; ctx.font = '10px system-ui';
      ctx.fillText('(phase flip on reflection)', W / 2, H - 26);
    }

    if (pulseCenter > stringR + sigma * 3) t = 0;
    requestAnimationFrame(tick);
  }

  tick();
}

// =========================================================================
// 10. Mass Collision & Impedance Matching
// =========================================================================
function initMassCollisionImpedance() {
  const canvas = document.getElementById('scene-mass-collision-impedance');
  if (!canvas) return;
  const setup = wSetupCanvas(canvas);
  if (!setup) return;
  const { ctx, W, H } = setup;

  let mRatioSlider = document.getElementById('mci-ratio');
  if (!mRatioSlider) {
    const parent = canvas.parentElement;
    if (parent) {
      const controls = document.createElement('div');
      controls.className = 'scene-controls';
      controls.innerHTML =
        '<label>m\u2082/m\u2081: <input type="range" id="mci-ratio" min="0.1" max="10" step="0.1" value="1"><span class="scene-val" id="mci-ratio-val">1.0</span></label>';
      parent.appendChild(controls);
      mRatioSlider = document.getElementById('mci-ratio');
    }
  }

  let t = 0;

  function tick() {
    if (!canvas.isConnected) return;
    const mRatio = parseFloat(mRatioSlider?.value || 1);
    document.getElementById('mci-ratio-val')?.replaceChildren(document.createTextNode(mRatio.toFixed(1)));

    t += 0.02;
    wClear(ctx, W, H);

    // Elastic collision: v1' = (1-m2/m1)/(1+m2/m1) * v1, v2' = 2/(1+m2/m1) * v1
    const v1i = 2; // initial speed of mass 1
    const v1f = (1 - mRatio) / (1 + mRatio) * v1i;
    const v2f = 2 / (1 + mRatio) * v1i;
    const energyTransfer = mRatio * v2f * v2f / (v1i * v1i); // fraction of KE transferred

    // Top: animation
    const animY = H * 0.3;
    const collisionX = W * 0.45;
    const m1Radius = 15;
    const m2Radius = 15 * Math.pow(mRatio, 1 / 3);

    const period = 5;
    const tMod = t % period;
    const collisionTime = 2;
    const hasCollided = tMod > collisionTime;

    let x1, x2;
    if (!hasCollided) {
      x1 = 50 + v1i * 50 * tMod;
      x2 = collisionX + m2Radius + m1Radius;
    } else {
      const dt = tMod - collisionTime;
      x1 = collisionX - m1Radius + v1f * 50 * dt;
      x2 = collisionX + m2Radius + v2f * 50 * dt;
    }

    // Draw masses
    ctx.fillStyle = WCOLORS.teal;
    ctx.beginPath(); ctx.arc(x1, animY, m1Radius, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.font = 'bold 10px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('m\u2081', x1, animY + 4);

    ctx.fillStyle = WCOLORS.amber;
    ctx.beginPath(); ctx.arc(x2, animY, m2Radius, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.font = 'bold 10px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('m\u2082', x2, animY + 4);

    // Velocity arrows (before collision)
    if (!hasCollided) {
      ctx.strokeStyle = WCOLORS.teal; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(x1 + m1Radius + 5, animY); ctx.lineTo(x1 + m1Radius + 25, animY); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x1 + m1Radius + 25, animY); ctx.lineTo(x1 + m1Radius + 20, animY - 5); ctx.moveTo(x1 + m1Radius + 25, animY); ctx.lineTo(x1 + m1Radius + 20, animY + 5); ctx.stroke();
    }

    // Bottom: bar chart of energy transfer
    const barY = H * 0.55;
    const barH = H * 0.3;
    const barW = W * 0.6;
    const barL = (W - barW) / 2;

    ctx.fillStyle = WCOLORS.text; ctx.font = 'bold 11px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('Energy Transfer Fraction', W / 2, barY - 5);

    // Bar background
    ctx.fillStyle = WCOLORS.grid; ctx.fillRect(barL, barY, barW, barH);

    // Transferred energy bar
    ctx.fillStyle = WCOLORS.teal;
    ctx.fillRect(barL, barY, barW * energyTransfer, barH);

    // Reflected energy bar
    ctx.fillStyle = WCOLORS.amber;
    ctx.fillRect(barL + barW * energyTransfer, barY, barW * (1 - energyTransfer), barH);

    // Labels
    ctx.fillStyle = '#fff'; ctx.font = 'bold 11px system-ui'; ctx.textAlign = 'center';
    if (energyTransfer > 0.15) {
      ctx.fillText('Transmitted: ' + (energyTransfer * 100).toFixed(0) + '%', barL + barW * energyTransfer / 2, barY + barH / 2 + 4);
    }
    if (1 - energyTransfer > 0.15) {
      ctx.fillText('Reflected: ' + ((1 - energyTransfer) * 100).toFixed(0) + '%', barL + barW * energyTransfer + barW * (1 - energyTransfer) / 2, barY + barH / 2 + 4);
    }

    // Note
    ctx.fillStyle = WCOLORS.textDim; ctx.font = '10px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('Maximum transfer at m\u2082/m\u2081 = 1 (impedance matched)', W / 2, barY + barH + 18);

    requestAnimationFrame(tick);
  }

  tick();
}



// =========================================================================
// 11. Complex Impedance
// =========================================================================
function initComplexImpedance() {
  const canvas = document.getElementById('scene-complex-impedance');
  if (!canvas) return;
  const setup = wSetupCanvas(canvas);
  if (!setup) return;
  const { ctx, W, H } = setup;

  let wSlider = document.getElementById('ci-w');
  if (!wSlider) {
    const parent = canvas.parentElement;
    if (parent) {
      const controls = document.createElement('div');
      controls.className = 'scene-controls';
      controls.innerHTML =
        '<label>\u03C9: <input type="range" id="ci-w" min="0.3" max="6" step="0.02" value="1"><span class="scene-val" id="ci-w-val">1.00</span></label>' +
        '<label>m: <input type="range" id="ci-m" min="0.2" max="4" step="0.1" value="1"><span class="scene-val" id="ci-m-val">1.0</span></label>' +
        '<label>\u03B3: <input type="range" id="ci-g" min="0" max="3" step="0.05" value="0.3"><span class="scene-val" id="ci-g-val">0.3</span></label>' +
        '<label>k: <input type="range" id="ci-k" min="0.5" max="10" step="0.5" value="4"><span class="scene-val" id="ci-k-val">4.0</span></label>';
      parent.appendChild(controls);
      wSlider = document.getElementById('ci-w');
    }
  }
  const mSlider = document.getElementById('ci-m');
  const gSlider = document.getElementById('ci-g');
  const kSlider = document.getElementById('ci-k');

  let t = 0;

  // ── LAYOUT ──
  const divY = H * 0.42; // horizontal divider between top and bottom rows

  // Top-left: driven oscillator animation
  const oscW = W * 0.48, oscH = divY;
  const trackY = oscH * 0.45;
  const camCx = 48, camCy = trackY, camR = 18;
  const wallX = oscW - 10;
  const massW = 26, massH = 20;
  const massEqX = oscW * 0.48;
  const maxDisp = 36;

  // Top-right: phasor diagram
  const cpCx = W * 0.74, cpCy = divY * 0.52;
  const cpR = Math.min(W * 0.18, divY * 0.38);

  // Bottom-left: |Z| plot
  const zL = 20, zR = W * 0.48, zT = divY + 20, zB = H - 12;
  const zW = zR - zL, zH = zB - zT;

  // Bottom-right: phase plot
  const phL = W * 0.56, phR = W - 16, phT = divY + 20, phB = H - 12;
  const phW = phR - phL, phH = phB - phT;

  const wMin = 0.3, wMax = 6;

  // Steady-state solution (same as Chapter 2)
  function getAB(w0, wd, gamma) {
    const denom = (w0 * w0 - wd * wd) * (w0 * w0 - wd * wd) + (gamma * wd) * (gamma * wd);
    const A = (w0 * w0 - wd * wd) / denom;
    const B = (gamma * wd) / denom;
    return { A, B, amp: Math.sqrt(A * A + B * B) };
  }

  function drawHorizSpring(x1, x2, y, coils, amp) {
    const len = x2 - x1;
    if (len <= 0) return;
    ctx.beginPath(); ctx.moveTo(x1, y);
    const seg = len / (coils * 2 + 2);
    let cx = x1 + seg;
    ctx.lineTo(cx, y);
    for (let i = 0; i < coils; i++) {
      const mx = cx + seg;
      ctx.lineTo(mx, y + amp * ((i % 2 === 0) ? 1 : -1));
      cx = mx + seg; ctx.lineTo(cx, y);
    }
    ctx.lineTo(x2, y); ctx.stroke();
  }

  function drawArrow(x0, y0, x1, y1, color, lw) {
    ctx.strokeStyle = color; ctx.lineWidth = lw;
    ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
    const a = Math.atan2(y1 - y0, x1 - x0), aL = 6;
    ctx.fillStyle = color; ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x1 - aL * Math.cos(a - 0.4), y1 - aL * Math.sin(a - 0.4));
    ctx.lineTo(x1 - aL * Math.cos(a + 0.4), y1 - aL * Math.sin(a + 0.4));
    ctx.closePath(); ctx.fill();
  }

  function tick() {
    if (!canvas.isConnected) return;
    const omega = parseFloat(wSlider?.value || 2);
    const m = parseFloat(mSlider?.value || 1);
    const gamma = parseFloat(gSlider?.value || 0.3);
    const k = parseFloat(kSlider?.value || 4);
    const omega0 = Math.sqrt(k / m);
    const dt = 0.025;
    t += dt;

    document.getElementById('ci-w-val')?.replaceChildren(document.createTextNode(omega.toFixed(2)));
    document.getElementById('ci-m-val')?.replaceChildren(document.createTextNode(m.toFixed(1)));
    document.getElementById('ci-g-val')?.replaceChildren(document.createTextNode(gamma.toFixed(2)));
    document.getElementById('ci-k-val')?.replaceChildren(document.createTextNode(k.toFixed(1)));

    // Impedance
    const Zm = m * omega;
    const Zk = -k / omega;
    const reZ = gamma;
    const imZ = Zm + Zk;
    const absZ = Math.sqrt(reZ * reZ + imZ * imZ);
    const phase = Math.atan2(imZ, reZ);

    // Steady-state oscillator position
    const { A, B } = getAB(omega0, omega, gamma);
    const x = A * Math.cos(omega * t) + B * Math.sin(omega * t);
    const force = Math.cos(omega * t);

    draw(omega, m, gamma, k, omega0, reZ, imZ, absZ, phase, Zm, Zk, x, force);
    requestAnimationFrame(tick);
  }

  function draw(omega, m, gamma, k, omega0, reZ, imZ, absZ, phase, Zm, Zk, x, force) {
    wClear(ctx, W, H);

    // ── TOP-LEFT: Driven oscillator (compact, from Ch.2) ──
    ctx.fillStyle = WCOLORS.text; ctx.font = 'bold 11px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('Driven oscillator', oscW / 2, 12);

    const camAngle = omega * t;
    const massX = massEqX + x * maxDisp * 8;

    // Flywheel
    ctx.beginPath(); ctx.arc(camCx, camCy, camR, 0, 2 * Math.PI);
    ctx.fillStyle = '#d4cfc6'; ctx.fill();
    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 1.5; ctx.stroke();
    for (let s = 0; s < 4; s++) {
      const sa = camAngle + s * Math.PI / 2;
      ctx.strokeStyle = 'rgba(31,42,46,0.18)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(camCx, camCy);
      ctx.lineTo(camCx + camR * 0.85 * Math.cos(sa), camCy - camR * 0.85 * Math.sin(sa));
      ctx.stroke();
    }
    ctx.beginPath(); ctx.arc(camCx, camCy, 2.5, 0, 2 * Math.PI);
    ctx.fillStyle = WCOLORS.axis; ctx.fill();

    // Crank pin + push rod
    const pinX = camCx + camR * 0.65 * Math.cos(camAngle);
    const pinY = camCy - camR * 0.65 * Math.sin(camAngle);
    ctx.beginPath(); ctx.arc(pinX, pinY, 2.5, 0, 2 * Math.PI);
    ctx.fillStyle = WCOLORS.amber; ctx.fill();
    const rodEndX = massX - massW / 2 - 2;
    ctx.strokeStyle = WCOLORS.amber; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(pinX, pinY); ctx.lineTo(rodEndX, trackY); ctx.stroke();

    // Track
    const groundY = trackY + massH / 2 + 2;
    ctx.strokeStyle = WCOLORS.textDim; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(camCx + camR + 4, groundY); ctx.lineTo(wallX, groundY); ctx.stroke();

    // Mass block
    ctx.fillStyle = WCOLORS.teal;
    ctx.beginPath(); ctx.roundRect(massX - massW / 2, trackY - massH / 2, massW, massH, 3); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.font = 'bold 9px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('m', massX, trackY + 3);

    // Spring to wall
    ctx.strokeStyle = WCOLORS.teal; ctx.lineWidth = 1.5;
    drawHorizSpring(massX + massW / 2, wallX - 3, trackY, 7, 6);

    // Wall
    ctx.fillStyle = WCOLORS.axis;
    ctx.fillRect(wallX - 3, trackY - 18, 4, 36);

    // Force arrow
    const arrowLen = force * 16;
    if (Math.abs(arrowLen) > 2) {
      const arrowY = trackY - massH / 2 - 7;
      ctx.strokeStyle = WCOLORS.amber; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(massX, arrowY); ctx.lineTo(massX + arrowLen, arrowY); ctx.stroke();
      const dir = arrowLen > 0 ? 1 : -1;
      ctx.fillStyle = WCOLORS.amber; ctx.beginPath();
      ctx.moveTo(massX + arrowLen, arrowY);
      ctx.lineTo(massX + arrowLen - dir * 4, arrowY - 2.5);
      ctx.lineTo(massX + arrowLen - dir * 4, arrowY + 2.5);
      ctx.closePath(); ctx.fill();
    }

    // ── Impedance readout below oscillator ──
    const readoutY = trackY + massH / 2 + 18;
    ctx.font = 'bold 11px system-ui'; ctx.textAlign = 'left';

    // Color-coded |Z| bar showing relative contributions
    const barX = 10, barW = oscW - 20, barH = 10;
    const barY2 = readoutY + 16;
    const absIm = Math.abs(imZ);
    const totalParts = gamma + absIm + 0.001; // avoid /0
    const gammaFrac = gamma / totalParts;
    const imFrac = absIm / totalParts;

    // Background
    ctx.fillStyle = WCOLORS.grid;
    ctx.fillRect(barX, barY2, barW, barH);

    // Damping portion (teal)
    ctx.fillStyle = WCOLORS.teal;
    ctx.fillRect(barX, barY2, barW * gammaFrac, barH);

    // Reactive portion — blue if stiffness-dominated, amber if mass-dominated
    ctx.fillStyle = omega < omega0 ? WCOLORS.blue : WCOLORS.amber;
    ctx.fillRect(barX + barW * gammaFrac, barY2, barW * imFrac, barH);

    // Labels
    ctx.font = '9px system-ui';
    if (gammaFrac > 0.12) {
      ctx.fillStyle = '#fff'; ctx.textAlign = 'center';
      ctx.fillText('\u03B3', barX + barW * gammaFrac / 2, barY2 + 8);
    }
    if (imFrac > 0.15) {
      ctx.fillStyle = '#fff'; ctx.textAlign = 'center';
      const imLabel = omega < omega0 ? 'k/\u03C9' : 'm\u03C9';
      ctx.fillText(imLabel, barX + barW * gammaFrac + barW * imFrac / 2, barY2 + 8);
    }

    // |Z| value and regime
    ctx.fillStyle = WCOLORS.red; ctx.font = 'bold 11px system-ui'; ctx.textAlign = 'left';
    ctx.fillText('|Z| = ' + absZ.toFixed(2), barX, readoutY + 10);

    const nearRes = Math.abs(omega - omega0) / omega0 < 0.08;
    ctx.textAlign = 'right';
    if (nearRes) {
      ctx.fillStyle = WCOLORS.red;
      ctx.fillText('RESONANCE: Z \u2248 \u03B3', barX + barW, readoutY + 10);
    } else if (omega < omega0) {
      ctx.fillStyle = WCOLORS.blue;
      ctx.fillText('stiffness-dominated', barX + barW, readoutY + 10);
    } else {
      ctx.fillStyle = WCOLORS.amber;
      ctx.fillText('mass-dominated', barX + barW, readoutY + 10);
    }

    // ω₀ readout
    ctx.fillStyle = WCOLORS.textDim; ctx.font = '9px system-ui'; ctx.textAlign = 'left';
    ctx.fillText('\u03C9\u2080 = ' + omega0.toFixed(2), barX, barY2 + barH + 11);

    // ── TOP-RIGHT: Phasor diagram ──
    ctx.fillStyle = WCOLORS.text; ctx.font = 'bold 11px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('Impedance phasor', cpCx, 12);

    // Fixed scale across full ω range
    let maxZ = 0;
    for (let i = 0; i <= 100; i++) {
      const w = wMin + (wMax - wMin) * i / 100;
      const im = m * w - k / w;
      const az = Math.sqrt(gamma * gamma + im * im);
      if (az > maxZ) maxZ = az;
    }
    const zScale = cpR * 0.85 / Math.max(maxZ, 0.5);

    // Grid circles
    ctx.strokeStyle = WCOLORS.grid; ctx.lineWidth = 0.5;
    const gridStep = Math.pow(10, Math.floor(Math.log10(maxZ)));
    const niceStep = maxZ / gridStep > 4 ? gridStep * 2 : gridStep;
    for (let r = niceStep; r * zScale < cpR + 5; r += niceStep) {
      ctx.beginPath(); ctx.arc(cpCx, cpCy, r * zScale, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = WCOLORS.textDim; ctx.font = '7px system-ui'; ctx.textAlign = 'left';
      ctx.fillText(r.toFixed(1), cpCx + 3, cpCy - r * zScale - 1);
    }

    // Axes
    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 0.8;
    ctx.beginPath(); ctx.moveTo(cpCx - cpR - 6, cpCy); ctx.lineTo(cpCx + cpR + 6, cpCy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cpCx, cpCy + cpR + 6); ctx.lineTo(cpCx, cpCy - cpR - 6); ctx.stroke();
    ctx.fillStyle = WCOLORS.textDim; ctx.font = '9px system-ui';
    ctx.textAlign = 'left'; ctx.fillText('Re', cpCx + cpR + 8, cpCy + 3);
    ctx.textAlign = 'center'; ctx.fillText('Im', cpCx, cpCy - cpR - 9);

    // Ghost trace of Z locus
    ctx.strokeStyle = 'rgba(220,38,38,0.12)'; ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (let i = 0; i <= 200; i++) {
      const w = wMin + (wMax - wMin) * i / 200;
      const im = m * w - k / w;
      const px = cpCx + gamma * zScale;
      const py = cpCy - im * zScale;
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Component arrows: Zk (down), Zm (up from Zk tip), γ (right)
    const ox = cpCx, oy = cpCy;
    const zkEndY = oy - Zk * zScale;
    drawArrow(ox, oy, ox, zkEndY, WCOLORS.blue, 2);
    const zmEndY = zkEndY - Zm * zScale;
    drawArrow(ox, zkEndY, ox, zmEndY, WCOLORS.amber, 2);
    if (gamma > 0.01) {
      const gEndX = ox + gamma * zScale;
      drawArrow(ox, zmEndY, gEndX, zmEndY, WCOLORS.teal, 2);
    }

    // Total Z vector
    const tipX = cpCx + reZ * zScale;
    const tipY = cpCy - imZ * zScale;
    ctx.strokeStyle = WCOLORS.red; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(cpCx, cpCy); ctx.lineTo(tipX, tipY); ctx.stroke();
    ctx.fillStyle = WCOLORS.red;
    ctx.beginPath(); ctx.arc(tipX, tipY, 3.5, 0, Math.PI * 2); ctx.fill();

    // Phase arc
    if (absZ * zScale > 10) {
      const arcR = Math.min(absZ * zScale * 0.3, 20);
      ctx.strokeStyle = WCOLORS.red; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(cpCx, cpCy, arcR, 0, -phase, phase > 0); ctx.stroke();
      ctx.fillStyle = WCOLORS.red; ctx.font = '9px system-ui'; ctx.textAlign = 'left';
      const la = -phase / 2;
      ctx.fillText('\u03C6', cpCx + (arcR + 5) * Math.cos(la), cpCy + (arcR + 5) * Math.sin(la) + 3);
    }

    // Component labels
    ctx.font = '9px system-ui';
    ctx.fillStyle = WCOLORS.blue; ctx.textAlign = 'right';
    ctx.fillText('Z\u2096', ox - 5, (oy + zkEndY) / 2 + 3);
    ctx.fillStyle = WCOLORS.amber; ctx.textAlign = 'right';
    ctx.fillText('Z\u2098', ox - 5, (zkEndY + zmEndY) / 2 + 3);
    if (gamma > 0.01) {
      ctx.fillStyle = WCOLORS.teal; ctx.textAlign = 'center';
      ctx.fillText('\u03B3', ox + gamma * zScale / 2, zmEndY - 6);
    }

    // ── Divider ──
    ctx.strokeStyle = WCOLORS.grid; ctx.lineWidth = 0.5;
    ctx.beginPath(); ctx.moveTo(10, divY + 4); ctx.lineTo(W - 10, divY + 4); ctx.stroke();

    // ── BOTTOM-LEFT: |Z| vs ω ──
    ctx.fillStyle = WCOLORS.text; ctx.font = 'bold 10px system-ui'; ctx.textAlign = 'left';
    ctx.fillText('|Z|  vs  \u03C9', zL, zT - 5);
    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(zL, zB); ctx.lineTo(zR, zB); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(zL, zT); ctx.lineTo(zL, zB); ctx.stroke();

    let maxAbsZ = 0;
    for (let i = 0; i <= 200; i++) {
      const w = wMin + (wMax - wMin) * i / 200;
      const az = Math.sqrt(gamma * gamma + Math.pow(m * w - k / w, 2));
      if (az > maxAbsZ) maxAbsZ = az;
    }
    maxAbsZ = Math.max(maxAbsZ, 1);

    // Fill
    ctx.fillStyle = 'rgba(220,38,38,0.06)';
    ctx.beginPath(); ctx.moveTo(zL, zB);
    for (let i = 0; i <= 200; i++) {
      const w = wMin + (wMax - wMin) * i / 200;
      const az = Math.sqrt(gamma * gamma + Math.pow(m * w - k / w, 2));
      ctx.lineTo(zL + (i / 200) * zW, zB - (az / maxAbsZ) * zH * 0.9);
    }
    ctx.lineTo(zR, zB); ctx.closePath(); ctx.fill();

    // Line
    ctx.strokeStyle = WCOLORS.red; ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (let i = 0; i <= 200; i++) {
      const w = wMin + (wMax - wMin) * i / 200;
      const az = Math.sqrt(gamma * gamma + Math.pow(m * w - k / w, 2));
      const px = zL + (i / 200) * zW;
      const py = zB - (az / maxAbsZ) * zH * 0.9;
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Current dot
    const zDotX = zL + ((omega - wMin) / (wMax - wMin)) * zW;
    const zDotY = zB - (absZ / maxAbsZ) * zH * 0.9;
    ctx.fillStyle = WCOLORS.red;
    ctx.beginPath(); ctx.arc(zDotX, zDotY, 4, 0, Math.PI * 2); ctx.fill();

    // ω₀ marker
    const resWx = zL + ((omega0 - wMin) / (wMax - wMin)) * zW;
    ctx.strokeStyle = WCOLORS.red; ctx.lineWidth = 0.8; ctx.setLineDash([2, 2]);
    ctx.beginPath(); ctx.moveTo(resWx, zT); ctx.lineTo(resWx, zB); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = WCOLORS.red; ctx.font = '8px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('\u03C9\u2080', resWx, zB + 10);

    // min = γ line
    if (gamma > 0.01) {
      const minY = zB - (gamma / maxAbsZ) * zH * 0.9;
      ctx.strokeStyle = WCOLORS.teal; ctx.lineWidth = 0.5; ctx.setLineDash([3, 3]);
      ctx.beginPath(); ctx.moveTo(zL, minY); ctx.lineTo(zR, minY); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = WCOLORS.teal; ctx.font = '8px system-ui'; ctx.textAlign = 'right';
      ctx.fillText('min = \u03B3', zR, minY - 2);
    }

    // ── BOTTOM-RIGHT: Phase vs ω ──
    ctx.fillStyle = WCOLORS.text; ctx.font = 'bold 10px system-ui'; ctx.textAlign = 'left';
    ctx.fillText('phase \u03C6  vs  \u03C9', phL, phT - 5);
    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(phL, phB); ctx.lineTo(phR, phB); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(phL, phT); ctx.lineTo(phL, phB); ctx.stroke();

    const phMid = (phT + phB) / 2;
    ctx.strokeStyle = WCOLORS.grid; ctx.lineWidth = 0.5;
    ctx.beginPath(); ctx.moveTo(phL, phMid); ctx.lineTo(phR, phMid); ctx.stroke();

    ctx.fillStyle = WCOLORS.textDim; ctx.font = '7px system-ui'; ctx.textAlign = 'right';
    ctx.fillText('+\u03C0/2', phL - 3, phT + 5);
    ctx.fillText('0', phL - 3, phMid + 3);
    ctx.fillText('\u2013\u03C0/2', phL - 3, phB - 1);

    ctx.strokeStyle = WCOLORS.teal; ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (let i = 0; i <= 200; i++) {
      const w = wMin + (wMax - wMin) * i / 200;
      const im = m * w - k / w;
      const ph = Math.atan2(im, gamma);
      const px = phL + (i / 200) * phW;
      const py = phMid - (ph / (Math.PI / 2)) * phH * 0.45;
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Current dot
    const phDotX = phL + ((omega - wMin) / (wMax - wMin)) * phW;
    const phDotY = phMid - (phase / (Math.PI / 2)) * phH * 0.45;
    ctx.fillStyle = WCOLORS.teal;
    ctx.beginPath(); ctx.arc(phDotX, phDotY, 4, 0, Math.PI * 2); ctx.fill();

    // ω₀ markers
    const resPhx = phL + ((omega0 - wMin) / (wMax - wMin)) * phW;
    ctx.strokeStyle = WCOLORS.red; ctx.lineWidth = 0.8; ctx.setLineDash([2, 2]);
    ctx.beginPath(); ctx.moveTo(resPhx, phT); ctx.lineTo(resPhx, phB); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = WCOLORS.red; ctx.font = '8px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('\u03C9\u2080', resPhx, phB + 10);

    // ω axis labels
    ctx.fillStyle = WCOLORS.textDim; ctx.font = '9px system-ui'; ctx.textAlign = 'right';
    ctx.fillText('\u03C9', zR + 1, zB + 10);
    ctx.fillText('\u03C9', phR + 1, phB + 10);
  }

  tick();
}

// =========================================================================
// CHAPTER 10: Power
// =========================================================================

// =========================================================================
// 12. Impedance Materials Bar Chart
// =========================================================================
function initImpedanceMaterials() {
  const canvas = document.getElementById('scene-impedance-materials');
  if (!canvas) return;
  const setup = wSetupCanvas(canvas);
  if (!setup) return;
  const { ctx, W, H } = setup;

  // Acoustic impedance in MRayl (10^6 kg/(m²·s))
  const materials = [
    { name: 'Air', Z: 0.000413, color: WCOLORS.blue },
    { name: 'Rubber', Z: 1.5, color: WCOLORS.amber },
    { name: 'Water', Z: 1.48, color: WCOLORS.blue },
    { name: 'Soft tissue', Z: 1.63, color: WCOLORS.teal },
    { name: 'Bone', Z: 7.8, color: WCOLORS.orange },
    { name: 'Aluminum', Z: 17.0, color: WCOLORS.textDim },
    { name: 'Steel', Z: 46.0, color: WCOLORS.axis },
  ];

  let hovered = -1;
  let hovered2 = -1;

  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const barL = 100, barT = 40;
    const barH = (H - 80) / materials.length;
    const newHover = Math.floor((my - barT) / barH);
    if (newHover >= 0 && newHover < materials.length && mx > barL) {
      if (hovered === -1) hovered = newHover;
      else if (newHover !== hovered) hovered2 = newHover;
    }
    draw();
  });

  function draw() {
    wClear(ctx, W, H);

    ctx.fillStyle = WCOLORS.text; ctx.font = 'bold 12px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('Acoustic Impedance of Materials', W / 2, 20);

    const barL = 100, barR = W - 80, barT = 40;
    const barW = barR - barL;
    const barH = (H - 80) / materials.length;
    const maxZ = Math.max(...materials.map(m => m.Z));

    // Use log scale
    const logMax = Math.log10(maxZ);
    const logMin = Math.log10(0.0003);
    const logRange = logMax - logMin;

    materials.forEach((mat, i) => {
      const y = barT + i * barH;
      const logZ = Math.log10(mat.Z);
      const w = ((logZ - logMin) / logRange) * barW;

      ctx.fillStyle = mat.color;
      ctx.globalAlpha = (i === hovered || i === hovered2) ? 1.0 : 0.7;
      ctx.fillRect(barL, y + 4, w, barH - 8);
      ctx.globalAlpha = 1.0;

      // Label
      ctx.fillStyle = WCOLORS.text; ctx.font = 'bold 12px system-ui'; ctx.textAlign = 'right';
      ctx.fillText(mat.name, barL - 5, y + barH / 2 + 4);

      // Value
      ctx.fillStyle = WCOLORS.textDim; ctx.font = '11px system-ui'; ctx.textAlign = 'left';
      ctx.fillText(mat.Z.toFixed(mat.Z < 1 ? 4 : 1) + ' MRayl', barL + w + 5, y + barH / 2 + 4);
    });

    // Show reflection coefficient between hovered pair
    if (hovered >= 0 && hovered2 >= 0 && hovered !== hovered2) {
      const Z1 = materials[hovered].Z;
      const Z2 = materials[hovered2].Z;
      const R = Math.pow((Z2 - Z1) / (Z2 + Z1), 2);
      const T = 1 - R;

      ctx.fillStyle = WCOLORS.text; ctx.font = 'bold 11px system-ui'; ctx.textAlign = 'center';
      ctx.fillText(materials[hovered].name + ' \u2192 ' + materials[hovered2].name +
        ':  R (power) = ' + (R * 100).toFixed(1) + '%   T (power) = ' + (T * 100).toFixed(1) + '%', W / 2, H - 10);
    } else {
      ctx.fillStyle = WCOLORS.textDim; ctx.font = '11px system-ui'; ctx.textAlign = 'center';
      ctx.fillText('Hover over two materials to see power reflectance R = [(Z\u2082\u2013Z\u2081)/(Z\u2082+Z\u2081)]\u00B2', W / 2, H - 10);
    }
  }

  canvas.addEventListener('mouseleave', () => { hovered = -1; hovered2 = -1; draw(); });
  canvas.addEventListener('click', () => { hovered = -1; hovered2 = -1; draw(); });
  draw();
}

// =========================================================================
// 13. Wave Energy on a String
// =========================================================================
function initWaveEnergyString() {
  const canvas = document.getElementById('scene-wave-energy-string');
  if (!canvas) return;
  const setup = wSetupCanvas(canvas);
  if (!setup) return;
  const { ctx, W, H } = setup;

  let t = 0;
  let omega = 4, k = 4;

  const omegaSlider = document.getElementById('wes-omega');
  const kSlider = document.getElementById('wes-k');
  const omegaVal = document.getElementById('wes-omega-val');
  const kVal = document.getElementById('wes-k-val');
  function onWesInput() {
    omega = parseFloat(omegaSlider.value);
    k = parseFloat(kSlider.value);
    omegaVal.textContent = omega.toFixed(1);
    kVal.textContent = k.toFixed(1);
  }
  if (omegaSlider) omegaSlider.addEventListener('input', onWesInput);
  if (kSlider) kSlider.addEventListener('input', onWesInput);

  function tick() {
    if (!canvas.isConnected) return;
    t += 0.03;
    wClear(ctx, W, H);

    const plotL = 40, plotR = W - 20;
    const plotW = plotR - plotL;
    const amp = 1;

    // Top: traveling wave
    const waveT = 25, waveB = H * 0.35;
    const waveH = waveB - waveT;
    const waveMid = (waveT + waveB) / 2;

    ctx.fillStyle = WCOLORS.text; ctx.font = 'bold 11px system-ui'; ctx.textAlign = 'left';
    ctx.fillText('Traveling wave: y(x,t) = A sin(kx \u2013 \u03C9t)', plotL, waveT - 5);

    // Wave axis
    ctx.strokeStyle = WCOLORS.grid; ctx.lineWidth = 0.5;
    ctx.beginPath(); ctx.moveTo(plotL, waveMid); ctx.lineTo(plotR, waveMid); ctx.stroke();

    ctx.strokeStyle = WCOLORS.teal; ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let i = 0; i <= 300; i++) {
      const x = plotL + plotW * i / 300;
      const xNorm = (x - plotL) / plotW * 4 * Math.PI;
      const y = waveMid - amp * Math.sin(k * xNorm - omega * t) * waveH * 0.35;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Bottom: KE and PE density
    const enT = H * 0.45, enB = H - 20;
    const enH = enB - enT;
    const enMid = (enT + enB) / 2;

    ctx.fillStyle = WCOLORS.text; ctx.font = 'bold 11px system-ui'; ctx.textAlign = 'left';
    ctx.fillText('Energy densities', plotL, enT - 5);

    // Zero line
    ctx.strokeStyle = WCOLORS.grid; ctx.lineWidth = 0.5;
    ctx.beginPath(); ctx.moveTo(plotL, enB); ctx.lineTo(plotR, enB); ctx.stroke();

    // KE density ∝ (∂y/∂t)² = A²ω²cos²(kx - ωt)
    // PE density ∝ (∂y/∂x)² = A²k²cos²(kx - ωt)
    // For traveling wave, they're equal (with appropriate scaling)

    ctx.strokeStyle = WCOLORS.teal; ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i <= 300; i++) {
      const x = plotL + plotW * i / 300;
      const xNorm = (x - plotL) / plotW * 4 * Math.PI;
      const cosVal = Math.cos(k * xNorm - omega * t);
      const ke = cosVal * cosVal;
      const y = enB - ke * enH * 0.8;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();

    // PE density (slightly offset for visibility, but identical)
    ctx.strokeStyle = WCOLORS.amber; ctx.lineWidth = 2; ctx.setLineDash([5, 3]);
    ctx.beginPath();
    for (let i = 0; i <= 300; i++) {
      const x = plotL + plotW * i / 300;
      const xNorm = (x - plotL) / plotW * 4 * Math.PI;
      const cosVal = Math.cos(k * xNorm - omega * t);
      const pe = cosVal * cosVal;
      const y = enB - pe * enH * 0.8;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke(); ctx.setLineDash([]);

    // Legend
    ctx.font = '10px system-ui'; ctx.textAlign = 'left';
    ctx.fillStyle = WCOLORS.teal; ctx.fillRect(plotR - 150, enT + 5, 15, 3);
    ctx.fillText('KE density', plotR - 130, enT + 10);
    ctx.fillStyle = WCOLORS.amber; ctx.fillRect(plotR - 150, enT + 20, 15, 3);
    ctx.fillText('PE density', plotR - 130, enT + 25);

    ctx.fillStyle = WCOLORS.textDim; ctx.font = '10px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('For a traveling wave: KE = PE everywhere (equal partition)', plotL + plotW / 2, enB + 14);

    requestAnimationFrame(tick);
  }

  tick();
}

// =========================================================================
// 14. Power Reflection & Transmission
// =========================================================================
function initPowerReflectionTransmission() {
  const canvas = document.getElementById('scene-power-reflection-transmission');
  if (!canvas) return;
  const setup = wSetupCanvas(canvas);
  if (!setup) return;
  const { ctx, W, H } = setup;

  let zSlider = document.getElementById('prt-z');
  if (!zSlider) {
    const parent = canvas.parentElement;
    if (parent) {
      const controls = document.createElement('div');
      controls.className = 'scene-controls';
      controls.innerHTML =
        '<label>Z\u2082/Z\u2081: <input type="range" id="prt-z" min="0.1" max="5" step="0.05" value="1"><span class="scene-val" id="prt-z-val">1.0</span></label>';
      parent.appendChild(controls);
      zSlider = document.getElementById('prt-z');
    }
  }

  function draw() {
    const zRatio = parseFloat(zSlider?.value || 1);
    document.getElementById('prt-z-val')?.replaceChildren(document.createTextNode(zRatio.toFixed(2)));

    wClear(ctx, W, H);

    // Left: R and T curves
    const plotL = 60, plotR = W * 0.6, plotT = 35, plotB = H - 40;
    const plotW = plotR - plotL, plotH = plotB - plotT;

    // Right: stacked bar
    const barL = W * 0.7, barR = W - 30, barT = 35, barB = H - 40;
    const barW = barR - barL, barH = barB - barT;

    ctx.fillStyle = WCOLORS.text; ctx.font = 'bold 11px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('Power reflection R and transmission T', plotL + plotW / 2, 18);

    // Axes
    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(plotL, plotB); ctx.lineTo(plotR, plotB); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(plotL, plotT); ctx.lineTo(plotL, plotB); ctx.stroke();

    // Grid
    for (let v = 0.25; v < 1; v += 0.25) {
      const y = plotB - v * plotH;
      ctx.strokeStyle = WCOLORS.grid; ctx.lineWidth = 0.5;
      ctx.beginPath(); ctx.moveTo(plotL, y); ctx.lineTo(plotR, y); ctx.stroke();
      ctx.fillStyle = WCOLORS.textDim; ctx.font = '11px system-ui'; ctx.textAlign = 'right';
      ctx.fillText(v.toFixed(2), plotL - 4, y + 3);
    }

    const zMax = 5;
    // R curve
    ctx.strokeStyle = WCOLORS.red; ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 1; i <= 200; i++) {
      const z = zMax * i / 200;
      const R = Math.pow((z - 1) / (z + 1), 2);
      const px = plotL + (z / zMax) * plotW;
      const py = plotB - R * plotH;
      i === 1 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.stroke();

    // T curve
    ctx.strokeStyle = WCOLORS.blue; ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 1; i <= 200; i++) {
      const z = zMax * i / 200;
      const T = 4 * z / Math.pow(z + 1, 2);
      const px = plotL + (z / zMax) * plotW;
      const py = plotB - T * plotH;
      i === 1 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Current position marker
    const curR = Math.pow((zRatio - 1) / (zRatio + 1), 2);
    const curT = 1 - curR;
    const curX = plotL + (zRatio / zMax) * plotW;
    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 1; ctx.setLineDash([3, 3]);
    ctx.beginPath(); ctx.moveTo(curX, plotT); ctx.lineTo(curX, plotB); ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = WCOLORS.red;
    ctx.beginPath(); ctx.arc(curX, plotB - curR * plotH, 5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = WCOLORS.blue;
    ctx.beginPath(); ctx.arc(curX, plotB - curT * plotH, 5, 0, Math.PI * 2); ctx.fill();

    // Z₂/Z₁ = 1 marker
    const matchX = plotL + (1 / zMax) * plotW;
    ctx.fillStyle = WCOLORS.textDim; ctx.font = '11px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('1', matchX, plotB + 12);

    // Axis labels
    ctx.fillStyle = WCOLORS.textDim; ctx.font = '10px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('Z\u2082/Z\u2081', plotL + plotW / 2, plotB + 28);

    // Legend
    ctx.font = '10px system-ui'; ctx.textAlign = 'left';
    ctx.fillStyle = WCOLORS.red; ctx.fillRect(plotL + 10, plotT + 5, 15, 3);
    ctx.fillText('R (reflected)', plotL + 30, plotT + 10);
    ctx.fillStyle = WCOLORS.blue; ctx.fillRect(plotL + 10, plotT + 20, 15, 3);
    ctx.fillText('T (transmitted)', plotL + 30, plotT + 25);

    // Stacked bar
    ctx.fillStyle = WCOLORS.text; ctx.font = 'bold 10px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('R + T = 1', barL + barW / 2, barT - 8);

    ctx.fillStyle = WCOLORS.blue;
    ctx.fillRect(barL, barT, barW, barH * curT);
    ctx.fillStyle = WCOLORS.red;
    ctx.fillRect(barL, barT + barH * curT, barW, barH * curR);

    ctx.fillStyle = '#fff'; ctx.font = 'bold 10px system-ui'; ctx.textAlign = 'center';
    if (curT > 0.1) ctx.fillText('T=' + (curT * 100).toFixed(0) + '%', barL + barW / 2, barT + barH * curT / 2 + 4);
    if (curR > 0.1) ctx.fillText('R=' + (curR * 100).toFixed(0) + '%', barL + barW / 2, barT + barH * curT + barH * curR / 2 + 4);
  }

  zSlider?.addEventListener('input', draw);
  draw();
}

// =========================================================================
// 15. Decibel Scale
// =========================================================================
function initDecibelScale() {
  const canvas = document.getElementById('scene-decibel-scale');
  if (!canvas) return;
  const setup = wSetupCanvas(canvas);
  if (!setup) return;
  const { ctx, W, H } = setup;

  // Remove old slider controls if present
  var oldControls = canvas.parentElement?.querySelector('.scene-controls');
  if (oldControls) oldControls.remove();

  var sounds = [
    { name: 'Breathing',    dB: 10,  color: WCOLORS.teal },
    { name: 'Whisper',      dB: 30,  color: WCOLORS.teal },
    { name: 'Conversation', dB: 60,  color: WCOLORS.amber },
    { name: 'Traffic',      dB: 80,  color: WCOLORS.amber },
    { name: 'Vacuum cleaner', dB: 90, color: WCOLORS.orange },
    { name: 'Concert',      dB: 120, color: WCOLORS.red },
    { name: 'Jet engine',   dB: 150, color: WCOLORS.red },
  ];

  var selectedIdx = 5; // start with Concert (120 dB)
  var listenerDist = 4; // meters from source (1-64)
  var dragging = false; // 'listener' or 'source' or false
  var maxDist = 64;

  // Spatial view geometry
  var spY = 210; // vertical center of spatial view
  var srcX = 55; // source position
  var farX = W - 20; // max listener x
  var spSpan = farX - srcX;

  function distToX(d) { return srcX + (Math.log2(Math.max(1, d)) / Math.log2(maxDist)) * spSpan; }
  function xToDist(x) { return Math.pow(2, ((x - srcX) / spSpan) * Math.log2(maxDist)); }

  function dbColor(db) {
    if (db <= 40) return WCOLORS.teal;
    if (db <= 70) return WCOLORS.amber;
    if (db <= 100) return WCOLORS.orange;
    return WCOLORS.red;
  }

  function draw() {
    wClear(ctx, W, H);
    var src = sounds[selectedIdx];
    var dbDrop = 20 * Math.log10(Math.max(1, listenerDist));
    var heardDb = Math.max(0, src.dB - dbDrop);

    // === TOP: Horizontal dB scale with source buttons ===
    var barL = 50, barR = W - 15, barY = 38, barH = 14;
    var barW = barR - barL;
    var dbMax = 160;

    // Title
    ctx.fillStyle = WCOLORS.text; ctx.font = 'bold 12px system-ui'; ctx.textAlign = 'left';
    ctx.fillText('Decibel scale', 10, 16);

    // Gradient bar
    var grad = ctx.createLinearGradient(barL, 0, barR, 0);
    grad.addColorStop(0, WCOLORS.teal);
    grad.addColorStop(0.4, WCOLORS.amber);
    grad.addColorStop(0.65, WCOLORS.orange);
    grad.addColorStop(0.85, WCOLORS.red);
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(barL, barY, barW, barH, 3);
    ctx.fill();

    // dB ticks and labels
    ctx.fillStyle = WCOLORS.text; ctx.font = '9px system-ui'; ctx.textAlign = 'center';
    for (var db = 0; db <= 150; db += 30) {
      var tx = barL + (db / dbMax) * barW;
      ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 0.5;
      ctx.beginPath(); ctx.moveTo(tx, barY + barH); ctx.lineTo(tx, barY + barH + 4); ctx.stroke();
      ctx.fillStyle = WCOLORS.text;
      ctx.fillText(db, tx, barY + barH + 13);
    }
    ctx.fillText('dB', barR + 2, barY + barH + 13);

    // Pain threshold marker
    var painX = barL + (130 / dbMax) * barW;
    ctx.strokeStyle = WCOLORS.red; ctx.lineWidth = 1.5; ctx.setLineDash([3, 2]);
    ctx.beginPath(); ctx.moveTo(painX, barY - 2); ctx.lineTo(painX, barY + barH + 2); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = WCOLORS.red; ctx.font = '8px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('pain', painX, barY - 4);

    // Source buttons along the bar — stagger labels to avoid overlap
    // First pass: unselected dots only
    for (var si = 0; si < sounds.length; si++) {
      if (si === selectedIdx) continue;
      var s = sounds[si];
      var sx = barL + (s.dB / dbMax) * barW;
      var r = 4;
      ctx.strokeStyle = WCOLORS.grid; ctx.lineWidth = 0.5;
      ctx.beginPath(); ctx.moveTo(sx, barY - 2); ctx.lineTo(sx, barY - 12); ctx.stroke();
      ctx.fillStyle = 'rgba(31,42,46,0.2)';
      ctx.beginPath(); ctx.arc(sx, barY - 12 - r, r, 0, Math.PI * 2); ctx.fill();
      // Stagger: even indices above, odd below (relative to dot)
      ctx.fillStyle = WCOLORS.textDim; ctx.font = '8px system-ui'; ctx.textAlign = 'center';
      var labelY = (si % 2 === 0) ? barY - 24 : barY - 26;
      ctx.fillText(s.name, sx, labelY);
    }
    // Second pass: selected dot (drawn on top, bigger)
    var selS = sounds[selectedIdx];
    var selX = barL + (selS.dB / dbMax) * barW;
    var selR = 7;
    ctx.strokeStyle = selS.color; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(selX, barY - 2); ctx.lineTo(selX, barY - 12 - selR); ctx.stroke();
    ctx.fillStyle = selS.color;
    ctx.beginPath(); ctx.arc(selX, barY - 12 - selR, selR, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.fillStyle = WCOLORS.text; ctx.font = 'bold 10px system-ui'; ctx.textAlign = 'center';
    ctx.fillText(selS.name, selX, barY - 16 - 2 * selR);

    // Heard-level indicator on bar (triangle pointing up into bar)
    var heardX = barL + (heardDb / dbMax) * barW;
    ctx.fillStyle = dbColor(heardDb);
    ctx.beginPath();
    ctx.moveTo(heardX - 4, barY + barH + 2); ctx.lineTo(heardX + 4, barY + barH + 2);
    ctx.lineTo(heardX, barY + barH - 2); ctx.closePath(); ctx.fill();

    // === MIDDLE: Info readout ===
    var infoY = 78;
    ctx.fillStyle = WCOLORS.text; ctx.font = 'bold 11px system-ui'; ctx.textAlign = 'left';
    ctx.fillText(src.name + ' at source: ' + src.dB + ' dB', 10, infoY);

    if (listenerDist > 1.05) {
      ctx.fillStyle = WCOLORS.textDim; ctx.font = '11px system-ui';
      ctx.fillText('At ' + listenerDist.toFixed(1) + ' m:  ' + heardDb.toFixed(1) + ' dB', 10, infoY + 16);
      ctx.fillText('(\u221220 log\u2081\u2080(' + listenerDist.toFixed(1) + ') = \u2212' + dbDrop.toFixed(1) + ' dB)', 210, infoY + 16);
    } else {
      ctx.fillStyle = WCOLORS.textDim; ctx.font = '11px system-ui';
      ctx.fillText('Drag the listener to see how dB drops with distance', 10, infoY + 16);
    }

    // Intensity comparison
    ctx.font = '10px system-ui'; ctx.fillStyle = WCOLORS.textDim; ctx.textAlign = 'left';
    fillTextSub(ctx, 'I_{source} = I_0 \u00D7 10^{' + (src.dB / 10).toFixed(0) + '}', W - 200, infoY);
    if (listenerDist > 1.05) {
      fillTextSub(ctx, 'I_{heard} = I_0 \u00D7 10^{' + (heardDb / 10).toFixed(1) + '}', W - 200, infoY + 15);
    }

    // === BOTTOM: Spatial view - source and listener ===

    // Ground line
    ctx.strokeStyle = WCOLORS.grid; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(srcX - 15, spY + 35); ctx.lineTo(farX + 10, spY + 35); ctx.stroke();

    // Distance doubling markers + "-6 dB" annotations
    ctx.font = '8px system-ui'; ctx.textAlign = 'center';
    for (var exp = 0; exp <= 6; exp++) {
      var d = Math.pow(2, exp);
      if (d > maxDist) break;
      var dx = distToX(d);
      ctx.strokeStyle = WCOLORS.grid; ctx.lineWidth = 0.5;
      ctx.beginPath(); ctx.moveTo(dx, spY + 30); ctx.lineTo(dx, spY + 38); ctx.stroke();
      ctx.fillStyle = WCOLORS.textDim;
      ctx.fillText(d + 'm', dx, spY + 48);
      if (exp > 0) {
        var prevDx = distToX(Math.pow(2, exp - 1));
        var midX = (prevDx + dx) / 2;
        ctx.fillStyle = WCOLORS.orange; ctx.font = 'bold 8px system-ui';
        ctx.fillText('\u22126 dB', midX, spY + 58);
        ctx.font = '8px system-ui';
      }
    }

    // Expanding wavefront arcs from source (animated)
    var time = Date.now() / 1000;
    for (var ri = 0; ri < 5; ri++) {
      var phase = ((time * 0.6 + ri / 5) % 1);
      var ringR = phase * 120;
      var alpha = 0.3 * (1 - phase);
      ctx.strokeStyle = 'rgba(15,118,110,' + alpha + ')';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(srcX, spY, ringR, -Math.PI * 0.45, Math.PI * 0.45);
      ctx.stroke();
    }

    // Source icon (speaker shape)
    ctx.fillStyle = src.color;
    ctx.fillRect(srcX - 10, spY - 8, 8, 16);
    ctx.beginPath();
    ctx.moveTo(srcX - 2, spY - 8); ctx.lineTo(srcX + 8, spY - 15);
    ctx.lineTo(srcX + 8, spY + 15); ctx.lineTo(srcX - 2, spY + 8);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = WCOLORS.text; ctx.font = '9px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('source', srcX, spY + 28);

    // Listener position
    var lx = distToX(listenerDist);
    var earSize = 6 + 8 * (heardDb / 150);
    ctx.fillStyle = dbColor(heardDb);
    ctx.beginPath(); ctx.arc(lx, spY, earSize, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.fillStyle = WCOLORS.text; ctx.font = 'bold 10px system-ui'; ctx.textAlign = 'center';
    ctx.fillText(heardDb.toFixed(0) + ' dB', lx, spY - earSize - 5);
    ctx.fillStyle = WCOLORS.textDim; ctx.font = '9px system-ui';
    ctx.fillText('listener', lx, spY + 28);

    // Dashed connection line source to listener
    ctx.strokeStyle = dbColor(heardDb); ctx.lineWidth = 1; ctx.setLineDash([4, 4]);
    ctx.beginPath(); ctx.moveTo(srcX + 10, spY); ctx.lineTo(lx - earSize - 2, spY); ctx.stroke();
    ctx.setLineDash([]);

    // Intensity falloff bars between source and listener
    if (listenerDist > 1.5) {
      var nBars = Math.min(8, Math.floor((lx - srcX - 20) / 15));
      for (var bi = 0; bi < nBars; bi++) {
        var frac = (bi + 1) / (nBars + 1);
        var bx = srcX + 15 + frac * (lx - srcX - 25);
        var bDist = xToDist(bx);
        var bDb = Math.max(0, src.dB - 20 * Math.log10(bDist));
        var bH = 2 + 20 * (bDb / 150);
        var bAlpha = 0.15 + 0.2 * (bDb / 150);
        ctx.fillStyle = 'rgba(15,118,110,' + bAlpha + ')';
        ctx.fillRect(bx - 1.5, spY - bH / 2, 3, bH);
      }
    }

    // Key insight box
    var boxX = W - 225, boxY = 112, boxW = 215, boxH = 50;
    ctx.fillStyle = 'rgba(15,118,110,0.06)';
    ctx.beginPath(); ctx.roundRect(boxX, boxY, boxW, boxH, 4); ctx.fill();
    ctx.strokeStyle = 'rgba(15,118,110,0.2)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.roundRect(boxX, boxY, boxW, boxH, 4); ctx.stroke();
    ctx.fillStyle = WCOLORS.text; ctx.font = 'bold 10px system-ui'; ctx.textAlign = 'left';
    ctx.fillText('Why logarithmic?', boxX + 8, boxY + 14);
    ctx.fillStyle = WCOLORS.textDim; ctx.font = '9px system-ui';
    var ratio = Math.pow(10, src.dB / 10);
    ctx.fillText(src.name + ' is 10^' + (src.dB / 10).toFixed(0) + ' = ' +
      ratio.toExponential(0) + '\u00D7 more intense', boxX + 8, boxY + 28);
    ctx.fillText('than the threshold of hearing.', boxX + 8, boxY + 40);

    requestAnimationFrame(draw);
  }

  // Find nearest source to an x position on the bar
  function nearestSource(mx) {
    var bL = 50, bR = W - 15, dbM = 160, bW = bR - bL;
    var bestIdx = 0, bestDist = Infinity;
    for (var i = 0; i < sounds.length; i++) {
      var x = bL + (sounds[i].dB / dbM) * bW;
      var d = Math.abs(mx - x);
      if (d < bestDist) { bestDist = d; bestIdx = i; }
    }
    return bestIdx;
  }

  // Hit test: is click in the source bar area (top region)?
  function inSourceArea(my) { return my < 65; }

  function getCanvasPos(e) {
    var rect = canvas.getBoundingClientRect();
    var touch = e.touches ? e.touches[0] : e;
    return { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
  }

  function onDown(e) {
    var pos = getCanvasPos(e);
    if (inSourceArea(pos.y)) {
      dragging = 'source';
      selectedIdx = nearestSource(pos.x);
    } else if (pos.y > 100 && pos.y < H) {
      dragging = 'listener';
      updateListener(pos.x);
    }
  }

  function onMove(e) {
    if (!dragging) return;
    e.preventDefault();
    var pos = getCanvasPos(e);
    if (dragging === 'source') {
      selectedIdx = nearestSource(pos.x);
    } else {
      updateListener(pos.x);
    }
  }

  function onUp() { dragging = false; }

  function updateListener(mx) {
    var clamped = Math.max(srcX, Math.min(farX, mx));
    listenerDist = Math.max(1, Math.min(maxDist, xToDist(clamped)));
  }

  canvas.addEventListener('mousedown', onDown);
  canvas.addEventListener('mousemove', onMove);
  canvas.addEventListener('mouseup', onUp);
  canvas.addEventListener('mouseleave', onUp);
  canvas.addEventListener('touchstart', onDown, { passive: true });
  canvas.addEventListener('touchmove', onMove, { passive: false });
  canvas.addEventListener('touchend', onUp);

  draw();
}

// =========================================================================
// 16. 3D Plane Wave
// =========================================================================
function initPlaneWave3d() {
  const canvas = document.getElementById('scene-plane-wave-3d');
  if (!canvas) return;
  const setup = wSetupCanvas(canvas);
  if (!setup) return;
  const { ctx, W, H } = setup;

  let angleSlider = document.getElementById('pw3d-angle');
  if (!angleSlider) {
    const parent = canvas.parentElement;
    if (parent) {
      const controls = document.createElement('div');
      controls.className = 'scene-controls';
      controls.innerHTML =
        '<label>Propagation angle: <input type="range" id="pw3d-angle" min="0" max="90" step="5" value="30"><span class="scene-val" id="pw3d-angle-val">30\u00B0</span></label>';
      parent.appendChild(controls);
      angleSlider = document.getElementById('pw3d-angle');
    }
  }

  let t = 0;

  function tick() {
    if (!canvas.isConnected) return;
    const angleDeg = parseFloat(angleSlider?.value || 30);
    const angle = angleDeg * Math.PI / 180;
    document.getElementById('pw3d-angle-val')?.replaceChildren(document.createTextNode(angleDeg.toFixed(0) + '\u00B0'));

    t += 0.03;
    wClear(ctx, W, H);

    // Simple isometric projection
    const cx = W / 2, cy = H / 2 + 20;
    const scale = 120;

    // Propagation direction
    const kx = Math.cos(angle);
    const ky = Math.sin(angle);

    // Isometric projection: (x,y,z) -> (screenX, screenY)
    function project(x, y, z) {
      const px = cx + (x - y) * 0.7 * scale;
      const py = cy + (x + y) * 0.35 * scale - z * 0.6 * scale;
      return { x: px, y: py };
    }

    // Draw coordinate axes
    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 1;
    const ox = project(0, 0, 0);
    const ax = project(1.2, 0, 0);
    const ay = project(0, 1.2, 0);
    const az = project(0, 0, 1.2);

    ctx.beginPath(); ctx.moveTo(ox.x, ox.y); ctx.lineTo(ax.x, ax.y); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(ox.x, ox.y); ctx.lineTo(ay.x, ay.y); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(ox.x, ox.y); ctx.lineTo(az.x, az.y); ctx.stroke();

    ctx.fillStyle = WCOLORS.text; ctx.font = '11px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('x', ax.x + 8, ax.y);
    ctx.fillText('y', ay.x - 8, ay.y);
    ctx.fillText('z', az.x, az.y - 8);

    // Draw wavefronts: planes perpendicular to k
    const nFronts = 8;
    const lambda = 0.35;
    const speed = 0.5;

    for (let i = 0; i < nFronts; i++) {
      const d = (i * lambda + speed * t) % (nFronts * lambda) - nFronts * lambda / 2;

      // Wavefront center along k direction
      const fx = d * kx;
      const fy = d * ky;

      // Draw a line representing the wavefront (perpendicular to k in the xy plane)
      const perpX = -ky;
      const perpY = kx;
      const halfLen = 0.8;

      // Draw at two z levels for 3D effect
      const alpha = Math.max(0.15, 1 - Math.abs(d) / (nFronts * lambda / 2));
      ctx.strokeStyle = WCOLORS.teal;
      ctx.globalAlpha = alpha;
      ctx.lineWidth = 2;

      // Bottom and top of wavefront
      for (let z = -0.4; z <= 0.4; z += 0.8) {
        const p1 = project(fx - perpX * halfLen, fy - perpY * halfLen, z);
        const p2 = project(fx + perpX * halfLen, fy + perpY * halfLen, z);
        ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
      }

      // Vertical edges
      const p1b = project(fx - perpX * halfLen, fy - perpY * halfLen, -0.4);
      const p1t = project(fx - perpX * halfLen, fy - perpY * halfLen, 0.4);
      const p2b = project(fx + perpX * halfLen, fy + perpY * halfLen, -0.4);
      const p2t = project(fx + perpX * halfLen, fy + perpY * halfLen, 0.4);
      ctx.beginPath(); ctx.moveTo(p1b.x, p1b.y); ctx.lineTo(p1t.x, p1t.y); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(p2b.x, p2b.y); ctx.lineTo(p2t.x, p2t.y); ctx.stroke();
      ctx.globalAlpha = 1;
    }

    // Draw k vector (arrow)
    const kLen = 0.8;
    const kStart = project(0, 0, 0);
    const kEnd = project(kx * kLen, ky * kLen, 0);
    ctx.strokeStyle = WCOLORS.red; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(kStart.x, kStart.y); ctx.lineTo(kEnd.x, kEnd.y); ctx.stroke();

    // Arrowhead
    const arrLen = 8, arrAngle = 0.4;
    const dx = kEnd.x - kStart.x, dy = kEnd.y - kStart.y;
    const arrNorm = Math.sqrt(dx * dx + dy * dy);
    const ux = dx / arrNorm, uy = dy / arrNorm;
    ctx.beginPath();
    ctx.moveTo(kEnd.x, kEnd.y);
    ctx.lineTo(kEnd.x - arrLen * (ux * Math.cos(arrAngle) - uy * Math.sin(arrAngle)),
               kEnd.y - arrLen * (uy * Math.cos(arrAngle) + ux * Math.sin(arrAngle)));
    ctx.moveTo(kEnd.x, kEnd.y);
    ctx.lineTo(kEnd.x - arrLen * (ux * Math.cos(-arrAngle) - uy * Math.sin(-arrAngle)),
               kEnd.y - arrLen * (uy * Math.cos(-arrAngle) + ux * Math.sin(-arrAngle)));
    ctx.stroke();

    ctx.fillStyle = WCOLORS.red; ctx.font = 'bold 13px system-ui'; ctx.textAlign = 'left';
    ctx.fillText('k', kEnd.x + 5, kEnd.y - 5);

    // Title and note
    ctx.fillStyle = WCOLORS.text; ctx.font = 'bold 11px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('3D Plane Wave: constant-phase surfaces', W / 2, 16);
    ctx.fillStyle = WCOLORS.textDim; ctx.font = '10px system-ui';
    ctx.fillText('Wavefronts are perpendicular to k', W / 2, H - 8);

    requestAnimationFrame(tick);
  }

  tick();
}

// =========================================================================
// CHAPTER 11: Wavepackets
// =========================================================================

// =========================================================================
// 17. Interference Demo
// =========================================================================
function initInterferenceDemo() {
  const canvas = document.getElementById('scene-interference-demo');
  if (!canvas) return;
  const setup = wSetupCanvas(canvas);
  if (!setup) return;
  const { ctx, W, H } = setup;

  let sepSlider = document.getElementById('intdemo-sep');
  if (!sepSlider) {
    const parent = canvas.parentElement;
    if (parent) {
      const controls = document.createElement('div');
      controls.className = 'scene-controls';
      controls.innerHTML =
        '<label>d/\u03BB: <input type="range" id="intdemo-sep" min="0.5" max="6" step="0.25" value="2"><span class="scene-val" id="intdemo-sep-val">2.0</span></label>';
      parent.appendChild(controls);
      sepSlider = document.getElementById('intdemo-sep');
    }
  }

  let t = 0;

  function tick() {
    if (!canvas.isConnected) return;
    const dOverLambda = parseFloat(sepSlider?.value || 2);
    document.getElementById('intdemo-sep-val')?.replaceChildren(document.createTextNode(dOverLambda.toFixed(2)));

    t += 0.04;
    wClear(ctx, W, H);

    const lambda = 30; // pixels
    const d = dOverLambda * lambda;
    const k = 2 * Math.PI / lambda;
    const omega = 2;

    // Source positions (left side)
    const srcX = W * 0.15;
    const srcY1 = H / 2 - d / 2;
    const srcY2 = H / 2 + d / 2;

    // Draw sources
    ctx.fillStyle = WCOLORS.red;
    ctx.beginPath(); ctx.arc(srcX, srcY1, 5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(srcX, srcY2, 5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = WCOLORS.text; ctx.font = '11px system-ui'; ctx.textAlign = 'right';
    ctx.fillText('S\u2081', srcX - 8, srcY1 + 3);
    ctx.fillText('S\u2082', srcX - 8, srcY2 + 3);

    // Draw circular wavefronts from each source
    const maxR = W * 0.85;
    const nRings = Math.floor(maxR / lambda);

    for (let ring = 0; ring < nRings; ring++) {
      const r = ((ring * lambda + omega * t * lambda / (2 * Math.PI)) % (nRings * lambda));
      if (r < 1) continue;
      const alpha = Math.max(0.05, 0.3 * (1 - r / maxR));

      ctx.strokeStyle = WCOLORS.teal; ctx.lineWidth = 1; ctx.globalAlpha = alpha;
      ctx.beginPath(); ctx.arc(srcX, srcY1, r, -Math.PI / 2, Math.PI / 2); ctx.stroke();

      ctx.strokeStyle = WCOLORS.amber;
      ctx.beginPath(); ctx.arc(srcX, srcY2, r, -Math.PI / 2, Math.PI / 2); ctx.stroke();
      ctx.globalAlpha = 1;
    }

    // Draw interference pattern on a "screen" at right
    const screenX = W * 0.85;
    const screenT = 20, screenB = H - 20;

    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(screenX, screenT); ctx.lineTo(screenX, screenB); ctx.stroke();

    // Calculate intensity pattern
    ctx.strokeStyle = WCOLORS.text; ctx.lineWidth = 2;
    ctx.beginPath();
    for (let py = screenT; py <= screenB; py++) {
      const dy = py - H / 2;
      const r1 = Math.sqrt((screenX - srcX) * (screenX - srcX) + (dy + d / 2) * (dy + d / 2));
      const r2 = Math.sqrt((screenX - srcX) * (screenX - srcX) + (dy - d / 2) * (dy - d / 2));
      const phase1 = k * r1 - omega * t;
      const phase2 = k * r2 - omega * t;
      const amp = Math.cos(phase1) + Math.cos(phase2);
      const intensity = amp * amp / 4;
      const barW = intensity * 30;
      py === screenT ? ctx.moveTo(screenX + barW, py) : ctx.lineTo(screenX + barW, py);
    }
    ctx.stroke();

    // Labels
    ctx.fillStyle = WCOLORS.text; ctx.font = 'bold 11px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('Two-source interference', W / 2, 14);
    ctx.fillStyle = WCOLORS.textDim; ctx.font = '10px system-ui';
    ctx.fillText('Screen', screenX + 15, screenT - 5);

    requestAnimationFrame(tick);
  }

  tick();
}

// =========================================================================
// 18. Gaussian Wavepacket
// =========================================================================
function initGaussianWavepacket() {
  const canvas = document.getElementById('scene-gaussian-wavepacket');
  if (!canvas) return;
  const setup = wSetupCanvas(canvas);
  if (!setup) return;
  const { ctx, W, H } = setup;

  let sigmaSlider = document.getElementById('gwp-sigma');
  if (!sigmaSlider) {
    const parent = canvas.parentElement;
    if (parent) {
      const controls = document.createElement('div');
      controls.className = 'scene-controls';
      controls.innerHTML =
        '<label>\u03C3\u2093: <input type="range" id="gwp-sigma" min="0.3" max="3" step="0.1" value="1"><span class="scene-val" id="gwp-sigma-val">1.0</span></label>';
      parent.appendChild(controls);
      sigmaSlider = document.getElementById('gwp-sigma');
    }
  }

  function draw() {
    const sigmaX = parseFloat(sigmaSlider?.value || 1);
    const sigmaK = 1 / (2 * sigmaX);
    document.getElementById('gwp-sigma-val')?.replaceChildren(document.createTextNode(sigmaX.toFixed(1)));

    wClear(ctx, W, H);

    const midW = W / 2;

    // Left: x-space
    const lL = 40, lR = midW - 15, lT = 35, lB = H - 35;
    const lW = lR - lL, lH = lB - lT;
    const lMid = (lT + lB) / 2;

    // Right: k-space
    const rL = midW + 25, rR = W - 20, rT = 35, rB = H - 35;
    const rW = rR - rL, rH = rB - rT;

    // Titles
    ctx.fillStyle = WCOLORS.text; ctx.font = 'bold 11px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('Position Space (x)', lL + lW / 2, 18);
    ctx.fillText('Momentum Space (k)', rL + rW / 2, 18);

    // Left axes
    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(lL, lB); ctx.lineTo(lR, lB); ctx.stroke();
    ctx.strokeStyle = WCOLORS.grid; ctx.lineWidth = 0.5;
    ctx.beginPath(); ctx.moveTo(lL, lMid); ctx.lineTo(lR, lMid); ctx.stroke();

    // Draw Gaussian * cos(k0 * x)
    const xRange = 8;
    const k0 = 5;
    ctx.strokeStyle = WCOLORS.teal; ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i <= 300; i++) {
      const x = -xRange + 2 * xRange * i / 300;
      const env = Math.exp(-x * x / (2 * sigmaX * sigmaX));
      const val = env * Math.cos(k0 * x);
      const px = lL + (x + xRange) / (2 * xRange) * lW;
      const py = lMid - val * lH * 0.4;
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Draw envelope
    ctx.strokeStyle = WCOLORS.amber; ctx.lineWidth = 1; ctx.setLineDash([4, 3]);
    ctx.beginPath();
    for (let i = 0; i <= 300; i++) {
      const x = -xRange + 2 * xRange * i / 300;
      const env = Math.exp(-x * x / (2 * sigmaX * sigmaX));
      const px = lL + (x + xRange) / (2 * xRange) * lW;
      const py = lMid - env * lH * 0.4;
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.stroke();
    ctx.beginPath();
    for (let i = 0; i <= 300; i++) {
      const x = -xRange + 2 * xRange * i / 300;
      const env = -Math.exp(-x * x / (2 * sigmaX * sigmaX));
      const px = lL + (x + xRange) / (2 * xRange) * lW;
      const py = lMid - env * lH * 0.4;
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.stroke(); ctx.setLineDash([]);

    // Right axes
    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(rL, rB); ctx.lineTo(rR, rB); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(rL, rB); ctx.lineTo(rL, rT); ctx.stroke();

    // FT: Gaussian centered at k0 with width sigmaK
    const kRange = 15;
    ctx.strokeStyle = WCOLORS.blue; ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i <= 300; i++) {
      const kk = kRange * i / 300;
      const ft = Math.exp(-(kk - k0) * (kk - k0) / (2 * sigmaK * sigmaK));
      const px = rL + (kk / kRange) * rW;
      const py = rB - ft * rH * 0.85;
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Fill under
    ctx.lineTo(rR, rB); ctx.lineTo(rL, rB); ctx.closePath();
    ctx.fillStyle = 'rgba(37,99,235,0.08)'; ctx.fill();

    // Mark widths
    // sigmaX on left
    const sigXpx = sigmaX / xRange * lW / 2;
    const centerL = lL + lW / 2;
    ctx.strokeStyle = WCOLORS.red; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(centerL - sigXpx, lMid + lH * 0.35); ctx.lineTo(centerL + sigXpx, lMid + lH * 0.35); ctx.stroke();
    ctx.fillStyle = WCOLORS.red; ctx.font = '10px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('\u0394x = ' + sigmaX.toFixed(1), centerL, lMid + lH * 0.35 + 14);

    // sigmaK on right
    const k0px = rL + (k0 / kRange) * rW;
    const sigKpx = sigmaK / kRange * rW;
    ctx.strokeStyle = WCOLORS.red; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(k0px - sigKpx, rB - rH * 0.85 * 0.6); ctx.lineTo(k0px + sigKpx, rB - rH * 0.85 * 0.6); ctx.stroke();
    ctx.fillStyle = WCOLORS.red; ctx.font = '10px system-ui';
    ctx.fillText('\u0394k = ' + sigmaK.toFixed(2), k0px, rB - rH * 0.85 * 0.6 + 14);

    // Uncertainty relation - prominent display
    const product = sigmaX * sigmaK;
    ctx.fillStyle = 'rgba(15,118,110,0.12)';
    ctx.fillRect(W / 2 - 110, H - 24, 220, 20);
    ctx.fillStyle = WCOLORS.text; ctx.font = 'bold 14px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('\u0394x \u00B7 \u0394k = ' + product.toFixed(2) + '  \u2265  \u00BD', W / 2, H - 8);

    // Axis labels
    ctx.fillStyle = WCOLORS.textDim; ctx.font = '10px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('x', lL + lW / 2, lB + 14);
    ctx.fillText('k', rL + rW / 2, rB + 14);
  }

  sigmaSlider?.addEventListener('input', draw);
  draw();
}

// =========================================================================
// 19. Amplitude Modulation — Bandwidth & Information
// =========================================================================
function initAmplitudeModulation() {
  const canvas = document.getElementById('scene-amplitude-modulation');
  if (!canvas) return;
  const setup = wSetupCanvas(canvas);
  if (!setup) return;
  const { ctx, W, H } = setup;

  let sigmaSlider = document.getElementById('am-sigma');
  if (!sigmaSlider) {
    const parent = canvas.parentElement;
    if (parent) {
      const controls = document.createElement('div');
      controls.className = 'scene-controls';
      controls.innerHTML =
        '<label>\u03C3<sub>t</sub> (pulse width): <input type="range" id="am-sigma" min="0.3" max="3.0" step="0.1" value="1.0"><span class="scene-val" id="am-sigma-val">1.0</span></label>' +
        '<label>f<sub>c</sub> (carrier): <input type="range" id="am-fc" min="8" max="40" step="1" value="20"><span class="scene-val" id="am-fc-val">20</span></label>' +
        '<button id="am-pause" class="scene-btn" style="font-size:11px;padding:2px 10px;cursor:pointer;">Pause</button>' +
        '<button id="am-send" class="scene-btn" style="font-size:11px;padding:2px 10px;cursor:pointer;">Send Pulse</button>' +
        '<button id="am-reset" class="scene-btn" style="font-size:11px;padding:2px 10px;cursor:pointer;">Reset</button>';
      parent.appendChild(controls);
      sigmaSlider = document.getElementById('am-sigma');
    }
  }
  const fcSlider = document.getElementById('am-fc');
  const pauseBtn = document.getElementById('am-pause');
  const sendBtn = document.getElementById('am-send');
  const resetBtn = document.getElementById('am-reset');

  // Pulses are launched by the user and travel rightward across a fixed window
  var tWindow = 25; // total time span visible in the top panel
  var pulses = [];  // { t0: launch time (in sim time), amp: amplitude }
  var simTime = 0;
  var paused = false;
  var lastTime = null;
  var pulseSpeed = 3.0; // how fast pulses move across the window (units/sec)

  // Randomize amplitude for next pulse
  var ampChoices = [0.2, 0.4, 0.5, 0.6, 0.8, 0.9, 1.0];
  function randomAmp() { return ampChoices[Math.floor(Math.random() * ampChoices.length)]; }

  // Pre-fill a few pulses so it's not empty on load
  for (var pp = 0; pp < 5; pp++) {
    pulses.push({ t0: -pp * 3.0, amp: randomAmp() });
  }

  pauseBtn?.addEventListener('click', function() {
    paused = !paused;
    if (paused) lastTime = null;
    pauseBtn.textContent = paused ? 'Play' : 'Pause';
  });

  sendBtn?.addEventListener('click', function() {
    pulses.push({ t0: simTime, amp: randomAmp() });
  });

  resetBtn?.addEventListener('click', function() {
    pulses.length = 0;
    simTime = 0;
    lastTime = null;
    for (var pp2 = 0; pp2 < 5; pp2++) {
      pulses.push({ t0: -pp2 * 3.0, amp: randomAmp() });
    }
  });

  function tick(now) {
    if (!paused) {
      if (lastTime !== null) {
        var dt = (now - lastTime) / 1000;
        simTime += dt * pulseSpeed;
      }
      lastTime = now;
    }
    draw();
    requestAnimationFrame(tick);
  }

  function draw() {
    var sigmaT = parseFloat(sigmaSlider?.value || 1);
    var fc = parseFloat(fcSlider?.value || 20);
    var sigmaF = 1 / (2 * Math.PI * sigmaT);
    document.getElementById('am-sigma-val')?.replaceChildren(document.createTextNode(sigmaT.toFixed(1)));
    document.getElementById('am-fc-val')?.replaceChildren(document.createTextNode(fc.toFixed(0)));

    wClear(ctx, W, H);

    // ===== LAYOUT =====
    var topH = H * 0.48;
    var gap = H * 0.04;
    var botY = topH + gap;

    // Top panel: pulse train on a fixed window — pulses move right to left
    var tL = 50, tR = W - 15, tT = 30, tB = topH - 5;
    var tW = tR - tL, tH2 = tB - tT;
    var tMid = (tT + tB) / 2;

    // Bottom-left: single wavepacket close-up
    var bL = 50, bR = W * 0.46, bT = botY + 20, bB = H - 10;
    var bW = bR - bL, bH2 = bB - bT;
    var bMid = (bT + bB) / 2;

    // Bottom-right: frequency spectrum
    var fL = W * 0.54, fR2 = W - 15, fT = botY + 20, fB = H - 10;
    var fW2 = fR2 - fL, fH2 = fB - fT;

    // ===== TOP: PULSE TRAIN =====
    ctx.fillStyle = WCOLORS.text; ctx.font = 'bold 11px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('AM Signal: Wavepackets Encoding Information', tL + tW / 2, 16);

    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(tL, tB); ctx.lineTo(tR, tB); ctx.stroke();
    ctx.strokeStyle = WCOLORS.grid; ctx.lineWidth = 0.5;
    ctx.beginPath(); ctx.moveTo(tL, tMid); ctx.lineTo(tR, tMid); ctx.stroke();

    // The visible window: positions 0..tWindow mapped to tL..tR
    // Each pulse position = simTime - pulse.t0 (how far it has traveled)
    // Pulse enters from the left (pos=0) and moves right (pos increases)

    // Check for overlap between adjacent pulses
    var overlapDetected = false;
    var visiblePulses = [];
    for (var pi = 0; pi < pulses.length; pi++) {
      var pos = simTime - pulses[pi].t0;
      if (pos > -sigmaT * 4 && pos < tWindow + sigmaT * 4) {
        visiblePulses.push({ pos: pos, amp: pulses[pi].amp });
      }
    }
    visiblePulses.sort(function(a, b) { return a.pos - b.pos; });
    for (var vi = 0; vi < visiblePulses.length - 1; vi++) {
      if (visiblePulses[vi + 1].pos - visiblePulses[vi].pos < 2.5 * sigmaT) {
        overlapDetected = true;
        break;
      }
    }

    // Draw envelopes (dashed)
    ctx.setLineDash([4, 3]);
    ctx.strokeStyle = overlapDetected ? 'rgba(220,38,38,0.4)' : WCOLORS.amber;
    ctx.lineWidth = 1;
    for (var qi = 0; qi < visiblePulses.length; qi++) {
      var ppos = visiblePulses[qi].pos;
      var pamp = visiblePulses[qi].amp;
      for (var sign = -1; sign <= 1; sign += 2) {
        ctx.beginPath();
        var started = false;
        for (var i = 0; i <= tW; i++) {
          var x = tWindow * i / tW;
          var dd = x - ppos;
          var env = sign * pamp * Math.exp(-dd * dd / (2 * sigmaT * sigmaT));
          if (Math.abs(env) < 0.005) continue;
          var px = tL + i;
          var py = tMid - env * tH2 * 0.4;
          if (!started) { ctx.moveTo(px, py); started = true; }
          else ctx.lineTo(px, py);
        }
        if (started) ctx.stroke();
      }
    }
    ctx.setLineDash([]);

    // Draw AM signal (sum of all visible pulses)
    ctx.strokeStyle = WCOLORS.teal; ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (var i2 = 0; i2 <= tW; i2++) {
      var x2 = tWindow * i2 / tW;
      var val = 0;
      for (var qj = 0; qj < visiblePulses.length; qj++) {
        var dd2 = x2 - visiblePulses[qj].pos;
        val += visiblePulses[qj].amp * Math.exp(-dd2 * dd2 / (2 * sigmaT * sigmaT)) * Math.cos(2 * Math.PI * fc * dd2);
      }
      var px2 = tL + i2;
      var py2 = tMid - val * tH2 * 0.4;
      i2 === 0 ? ctx.moveTo(px2, py2) : ctx.lineTo(px2, py2);
    }
    ctx.stroke();

    // Amplitude labels above visible pulses
    ctx.font = '9px system-ui'; ctx.textAlign = 'center';
    for (var qk = 0; qk < visiblePulses.length; qk++) {
      var lpx = tL + visiblePulses[qk].pos / tWindow * tW;
      if (lpx < tL + 10 || lpx > tR - 10) continue;
      ctx.fillStyle = WCOLORS.textDim;
      ctx.fillText('A=' + visiblePulses[qk].amp.toFixed(1), lpx, tT + 2);
    }

    if (overlapDetected) {
      ctx.fillStyle = WCOLORS.red; ctx.font = 'bold 10px system-ui'; ctx.textAlign = 'right';
      ctx.fillText('Pulses overlap! Information lost.', tR, tT + 2);
    }

    if (paused) {
      ctx.fillStyle = WCOLORS.textDim; ctx.font = 'bold 10px system-ui'; ctx.textAlign = 'left';
      ctx.fillText('PAUSED', tL + 2, tT + 2);
    }

    ctx.fillStyle = WCOLORS.textDim; ctx.font = '10px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('t', tL + tW / 2, tB + 12);

    // Direction arrow on time axis
    ctx.strokeStyle = WCOLORS.textDim; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(tR - 20, tB + 6); ctx.lineTo(tR - 5, tB + 6); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(tR - 5, tB + 6); ctx.lineTo(tR - 10, tB + 3); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(tR - 5, tB + 6); ctx.lineTo(tR - 10, tB + 9); ctx.stroke();

    // ===== BOTTOM LEFT: SINGLE WAVEPACKET =====
    ctx.fillStyle = WCOLORS.text; ctx.font = 'bold 11px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('Single Wavepacket', bL + bW / 2, botY + 14);

    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(bL, bB); ctx.lineTo(bR, bB); ctx.stroke();
    ctx.strokeStyle = WCOLORS.grid; ctx.lineWidth = 0.5;
    ctx.beginPath(); ctx.moveTo(bL, bMid); ctx.lineTo(bR, bMid); ctx.stroke();

    var xRange = Math.max(sigmaT * 5, 3);

    // Envelope (dashed)
    ctx.setLineDash([4, 3]);
    ctx.strokeStyle = WCOLORS.amber; ctx.lineWidth = 1.5;
    for (var s2 = -1; s2 <= 1; s2 += 2) {
      ctx.beginPath();
      for (var j = 0; j <= 300; j++) {
        var tt = -xRange + 2 * xRange * j / 300;
        var ev = s2 * Math.exp(-tt * tt / (2 * sigmaT * sigmaT));
        var ppx = bL + bW * j / 300;
        var ppy = bMid - ev * bH2 * 0.38;
        j === 0 ? ctx.moveTo(ppx, ppy) : ctx.lineTo(ppx, ppy);
      }
      ctx.stroke();
    }
    ctx.setLineDash([]);

    // Carrier inside envelope
    ctx.strokeStyle = WCOLORS.teal; ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (var j2 = 0; j2 <= 300; j2++) {
      var tt2 = -xRange + 2 * xRange * j2 / 300;
      var v2 = Math.exp(-tt2 * tt2 / (2 * sigmaT * sigmaT)) * Math.cos(2 * Math.PI * fc * tt2);
      var ppx2 = bL + bW * j2 / 300;
      var ppy2 = bMid - v2 * bH2 * 0.38;
      j2 === 0 ? ctx.moveTo(ppx2, ppy2) : ctx.lineTo(ppx2, ppy2);
    }
    ctx.stroke();

    // sigma_t annotation
    var sigPx = sigmaT / xRange * bW / 2;
    var centerBL = bL + bW / 2;
    var annY = bMid + bH2 * 0.32;
    ctx.strokeStyle = WCOLORS.red; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(centerBL - sigPx, annY); ctx.lineTo(centerBL + sigPx, annY); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(centerBL - sigPx, annY - 4); ctx.lineTo(centerBL - sigPx, annY + 4); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(centerBL + sigPx, annY - 4); ctx.lineTo(centerBL + sigPx, annY + 4); ctx.stroke();
    ctx.fillStyle = WCOLORS.red; ctx.font = '10px system-ui'; ctx.textAlign = 'center';
    fillTextSub(ctx, '\u03C3_t = ' + sigmaT.toFixed(1), centerBL, annY + 14);

    ctx.fillStyle = WCOLORS.textDim; ctx.font = '10px system-ui';
    ctx.fillText('t', bL + bW / 2, bB + 12);

    // ===== BOTTOM RIGHT: FREQUENCY SPECTRUM =====
    ctx.fillStyle = WCOLORS.text; ctx.font = 'bold 11px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('Frequency Spectrum', fL + fW2 / 2, botY + 14);

    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(fL, fB); ctx.lineTo(fR2, fB); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(fL, fB); ctx.lineTo(fL, fT); ctx.stroke();

    var fMax = fc + Math.max(sigmaF * 5, 5);
    var fMin = Math.max(0, fc - Math.max(sigmaF * 5, 5));
    var fRng = fMax - fMin;

    // Gaussian peak
    ctx.strokeStyle = WCOLORS.blue; ctx.lineWidth = 2;
    ctx.beginPath();
    for (var k = 0; k <= 300; k++) {
      var f = fMin + fRng * k / 300;
      var ft = Math.exp(-(f - fc) * (f - fc) / (2 * sigmaF * sigmaF));
      var fpx = fL + fW2 * k / 300;
      var fpy = fB - ft * fH2 * 0.8;
      k === 0 ? ctx.moveTo(fpx, fpy) : ctx.lineTo(fpx, fpy);
    }
    ctx.stroke();

    // Fill under curve
    ctx.lineTo(fL + fW2, fB); ctx.lineTo(fL, fB); ctx.closePath();
    ctx.fillStyle = 'rgba(37,99,235,0.08)'; ctx.fill();

    // Mark f_c
    var fcPx = fL + (fc - fMin) / fRng * fW2;
    ctx.strokeStyle = WCOLORS.teal; ctx.lineWidth = 1; ctx.setLineDash([3, 3]);
    ctx.beginPath(); ctx.moveTo(fcPx, fB); ctx.lineTo(fcPx, fT + 10); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = WCOLORS.teal; ctx.font = '10px system-ui'; ctx.textAlign = 'center';
    fillTextSub(ctx, 'f_c = ' + fc, fcPx, fB + 12);

    // Bandwidth annotation
    var bwPx = sigmaF / fRng * fW2;
    var bwY = fB - fH2 * 0.8 * Math.exp(-0.5);
    ctx.strokeStyle = WCOLORS.red; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(fcPx - bwPx, bwY); ctx.lineTo(fcPx + bwPx, bwY); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(fcPx - bwPx, bwY - 4); ctx.lineTo(fcPx - bwPx, bwY + 4); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(fcPx + bwPx, bwY - 4); ctx.lineTo(fcPx + bwPx, bwY + 4); ctx.stroke();
    ctx.fillStyle = WCOLORS.red; ctx.font = '10px system-ui'; ctx.textAlign = 'center';
    fillTextSub(ctx, '\u0394f = ' + sigmaF.toFixed(2), fcPx, bwY - 6);

    ctx.fillStyle = WCOLORS.textDim; ctx.font = '10px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('f', fL + fW2 / 2, fB + 12);

    // ===== KEY RELATION =====
    var relY = botY + 6;
    ctx.fillStyle = 'rgba(15,118,110,0.10)';
    ctx.fillRect(W / 2 - 135, relY - 10, 270, 18);
    ctx.fillStyle = WCOLORS.text; ctx.font = 'bold 12px system-ui'; ctx.textAlign = 'center';
    fillTextSub(ctx, 'Bandwidth: \u0394f = 1/(2\u03C0\u03C3_t) = ' + sigmaF.toFixed(2), W / 2, relY + 3);
  }

  sigmaSlider?.addEventListener('input', draw);
  fcSlider?.addEventListener('input', draw);
  requestAnimationFrame(tick);
}

// =========================================================================
// 20. Dispersion Relations
// =========================================================================
function initDispersionRelations() {
  const curveCanvas = document.getElementById('scene-disp-curve');
  const waveCanvas = document.getElementById('scene-disp-wave');
  if (!curveCanvas || !waveCanvas) return;
  const cs = wSetupCanvas(curveCanvas);
  const ws = wSetupCanvas(waveCanvas);
  if (!cs || !ws) return;
  const { ctx: cCtx, W: cW, H: cH } = cs;
  const { ctx: wCtx, W: wW, H: wH } = ws;

  const k0Slider = document.getElementById('disp-k0');
  const vpvgEl = document.getElementById('disp-vp-vg');
  const radios = document.querySelectorAll('input[name="disp-rel"]');

  const relations = [
    { name: 'Non-dispersive', fn: k => k, color: WCOLORS.teal },
    { name: 'Deep water', fn: k => Math.sqrt(k * 2), color: WCOLORS.amber },
    { name: 'Capillary', fn: k => Math.pow(k, 1.5) * 0.7, color: WCOLORS.blue },
    { name: 'Plasma', fn: k => Math.sqrt(1 + k * k), color: WCOLORS.red },
  ];

  let selected = 0;
  let t = 0;

  function getSelected() {
    for (const r of radios) { if (r.checked) return parseInt(r.value); }
    return 0;
  }

  function getVpVg(rel, k0) {
    const omega0 = rel.fn(k0);
    const vp = omega0 / k0;
    const dk = 0.001;
    const vg = (rel.fn(k0 + dk) - rel.fn(k0 - dk)) / (2 * dk);
    const d2 = (rel.fn(k0 + dk) - 2 * omega0 + rel.fn(k0 - dk)) / (dk * dk);
    return { omega0, vp, vg, d2 };
  }

  function drawCurve() {
    const k0 = parseFloat(k0Slider?.value || 2);
    const rel = relations[selected];
    document.getElementById('disp-k0-val')?.replaceChildren(document.createTextNode(k0.toFixed(1)));

    wClear(cCtx, cW, cH);

    const plotL = 40, plotR = cW - 12, plotT = 28, plotB = cH - 24;
    const plotW = plotR - plotL, plotH = plotB - plotT;
    const kMax = 5.5, omegaMax = 6;

    cCtx.fillStyle = WCOLORS.text; cCtx.font = 'bold 11px system-ui'; cCtx.textAlign = 'center';
    cCtx.fillText('ω(k) curve', plotL + plotW / 2, 14);

    // Axes
    cCtx.strokeStyle = WCOLORS.axis; cCtx.lineWidth = 1;
    cCtx.beginPath(); cCtx.moveTo(plotL, plotB); cCtx.lineTo(plotR, plotB); cCtx.stroke();
    cCtx.beginPath(); cCtx.moveTo(plotL, plotT); cCtx.lineTo(plotL, plotB); cCtx.stroke();

    cCtx.fillStyle = WCOLORS.textDim; cCtx.font = '10px system-ui'; cCtx.textAlign = 'center';
    cCtx.fillText('k', plotL + plotW / 2, plotB + 18);
    cCtx.save(); cCtx.translate(plotL - 24, plotT + plotH / 2); cCtx.rotate(-Math.PI / 2);
    cCtx.fillText('ω', 0, 0); cCtx.restore();

    // Ghost all other curves lightly
    relations.forEach((r, idx) => {
      if (idx === selected) return;
      cCtx.strokeStyle = r.color; cCtx.lineWidth = 1; cCtx.globalAlpha = 0.15;
      cCtx.beginPath();
      for (let i = 0; i <= 200; i++) {
        const k = kMax * i / 200;
        const omega = r.fn(k);
        if (omega > omegaMax) break;
        const px = plotL + (k / kMax) * plotW;
        const py = plotB - (omega / omegaMax) * plotH;
        i === 0 ? cCtx.moveTo(px, py) : cCtx.lineTo(px, py);
      }
      cCtx.stroke();
      cCtx.globalAlpha = 1;
    });

    // Draw selected curve prominently
    cCtx.strokeStyle = rel.color; cCtx.lineWidth = 2.5;
    cCtx.beginPath();
    for (let i = 0; i <= 200; i++) {
      const k = kMax * i / 200;
      const omega = rel.fn(k);
      if (omega > omegaMax) break;
      const px = plotL + (k / kMax) * plotW;
      const py = plotB - (omega / omegaMax) * plotH;
      i === 0 ? cCtx.moveTo(px, py) : cCtx.lineTo(px, py);
    }
    cCtx.stroke();

    const { omega0, vp, vg } = getVpVg(rel, k0);
    if (omega0 > omegaMax) return;

    const px = plotL + (k0 / kMax) * plotW;
    const py = plotB - (omega0 / omegaMax) * plotH;

    // vp line: from origin through (k0, omega0)
    cCtx.strokeStyle = WCOLORS.red; cCtx.lineWidth = 1.2; cCtx.setLineDash([3, 4]);
    cCtx.globalAlpha = 0.7;
    cCtx.beginPath(); cCtx.moveTo(plotL, plotB);
    const vpEndOmega = vp * kMax;
    cCtx.lineTo(plotL + plotW, plotB - Math.min(vpEndOmega / omegaMax, 1) * plotH);
    cCtx.stroke();
    cCtx.setLineDash([]); cCtx.globalAlpha = 1;

    // vg tangent line
    cCtx.strokeStyle = WCOLORS.blue; cCtx.lineWidth = 1.5; cCtx.setLineDash([6, 3]);
    cCtx.globalAlpha = 0.8;
    const tangentSpan = 1.8;
    const tgK1 = Math.max(0, k0 - tangentSpan), tgK2 = Math.min(kMax, k0 + tangentSpan);
    const tgOm1 = omega0 + vg * (tgK1 - k0), tgOm2 = omega0 + vg * (tgK2 - k0);
    const tgPx1 = plotL + (tgK1 / kMax) * plotW, tgPy1 = plotB - (tgOm1 / omegaMax) * plotH;
    const tgPx2 = plotL + (tgK2 / kMax) * plotW, tgPy2 = plotB - (tgOm2 / omegaMax) * plotH;
    cCtx.beginPath();
    cCtx.moveTo(tgPx1, Math.max(plotT, Math.min(plotB, tgPy1)));
    cCtx.lineTo(tgPx2, Math.max(plotT, Math.min(plotB, tgPy2)));
    cCtx.stroke();
    cCtx.setLineDash([]); cCtx.globalAlpha = 1;

    // Dot on curve
    cCtx.fillStyle = rel.color;
    cCtx.beginPath(); cCtx.arc(px, py, 5, 0, Math.PI * 2); cCtx.fill();
    cCtx.strokeStyle = '#fff'; cCtx.lineWidth = 1.5;
    cCtx.beginPath(); cCtx.arc(px, py, 5, 0, Math.PI * 2); cCtx.stroke();

    // Legend for vp / vg lines
    const legY = plotT + 6;
    cCtx.font = '10px system-ui'; cCtx.textAlign = 'left';
    cCtx.strokeStyle = WCOLORS.red; cCtx.lineWidth = 1.2; cCtx.setLineDash([3, 4]);
    cCtx.beginPath(); cCtx.moveTo(plotL + 4, legY); cCtx.lineTo(plotL + 18, legY); cCtx.stroke();
    cCtx.setLineDash([]);
    cCtx.fillStyle = WCOLORS.red;
    cCtx.fillText('vₚ = ω/k', plotL + 21, legY + 3);
    cCtx.strokeStyle = WCOLORS.blue; cCtx.lineWidth = 1.5; cCtx.setLineDash([6, 3]);
    cCtx.beginPath(); cCtx.moveTo(plotL + 4, legY + 14); cCtx.lineTo(plotL + 18, legY + 14); cCtx.stroke();
    cCtx.setLineDash([]);
    cCtx.fillStyle = WCOLORS.blue;
    cCtx.fillText('vᵍ = dω/dk', plotL + 21, legY + 17);

    // Update readout
    if (vpvgEl) {
      const ratio = vg / vp;
      vpvgEl.textContent = 'vₚ = ' + vp.toFixed(2) + '    vᵍ = ' + vg.toFixed(2) + '    vᵍ/vₚ = ' + ratio.toFixed(2);
    }
  }

  function drawWave() {
    const k0 = parseFloat(k0Slider?.value || 2);
    const rel = relations[selected];
    const { omega0, vp, vg, d2 } = getVpVg(rel, k0);

    wClear(wCtx, wW, wH);

    wCtx.fillStyle = WCOLORS.text; wCtx.font = 'bold 11px system-ui'; wCtx.textAlign = 'center';
    wCtx.fillText('Wavepacket at this k₀', wW / 2, 14);

    const midY = wH / 2;
    const amp = wH * 0.28;
    const margin = 10;

    // Zero line
    wCtx.strokeStyle = WCOLORS.grid; wCtx.lineWidth = 0.5;
    wCtx.beginPath(); wCtx.moveTo(margin, midY); wCtx.lineTo(wW - margin, midY); wCtx.stroke();

    const sigma = 3.0;
    const xMin = -20, xMax = 20;
    const nPts = 400;

    // Compute spreading envelope width
    const spreadFactor = 1 + (d2 * d2 * t * t) / (sigma * sigma * sigma * sigma);
    const sigmaT = sigma * Math.sqrt(spreadFactor);
    const ampScale = 1 / Math.sqrt(Math.sqrt(spreadFactor));

    // Draw envelope (dashed)
    wCtx.strokeStyle = rel.color; wCtx.lineWidth = 1; wCtx.setLineDash([4, 3]);
    wCtx.globalAlpha = 0.5;
    for (let sign = -1; sign <= 1; sign += 2) {
      wCtx.beginPath();
      for (let i = 0; i <= nPts; i++) {
        const x = xMin + (xMax - xMin) * i / nPts;
        const envArgT = (x - vg * t) / sigmaT;
        const env = Math.exp(-0.5 * envArgT * envArgT) * ampScale;
        const px = margin + ((x - xMin) / (xMax - xMin)) * (wW - 2 * margin);
        const py = midY - sign * env * amp;
        i === 0 ? wCtx.moveTo(px, py) : wCtx.lineTo(px, py);
      }
      wCtx.stroke();
    }
    wCtx.setLineDash([]); wCtx.globalAlpha = 1;

    // Draw wavepacket
    wCtx.strokeStyle = rel.color; wCtx.lineWidth = 1.8;
    wCtx.beginPath();
    for (let i = 0; i <= nPts; i++) {
      const x = xMin + (xMax - xMin) * i / nPts;
      const envArgT = (x - vg * t) / sigmaT;
      const env = Math.exp(-0.5 * envArgT * envArgT) * ampScale;
      const carrier = Math.cos(k0 * x - omega0 * t);
      const y = env * carrier;
      const px = margin + ((x - xMin) / (xMax - xMin)) * (wW - 2 * margin);
      const py = midY - y * amp;
      i === 0 ? wCtx.moveTo(px, py) : wCtx.lineTo(px, py);
    }
    wCtx.stroke();

    // Labels
    wCtx.font = '10px system-ui'; wCtx.textAlign = 'left';
    wCtx.fillStyle = WCOLORS.red; wCtx.globalAlpha = 0.8;
    wCtx.fillText('vₚ → crests', margin, wH - 28);
    wCtx.fillStyle = WCOLORS.blue;
    wCtx.fillText('vᵍ → envelope', margin, wH - 14);
    wCtx.globalAlpha = 1;

    // Spreading indicator
    if (Math.abs(d2) > 0.01 && spreadFactor > 1.05) {
      wCtx.fillStyle = WCOLORS.textDim; wCtx.font = '10px system-ui'; wCtx.textAlign = 'right';
      wCtx.fillText('spreading ×' + Math.sqrt(spreadFactor).toFixed(1), wW - margin, wH - 14);
    }

    // vg direction arrow at envelope center
    const envCenterX = vg * t;
    if (envCenterX > xMin && envCenterX < xMax) {
      const arrowPx = margin + ((envCenterX - xMin) / (xMax - xMin)) * (wW - 2 * margin);
      const arrowY = wH - 42;
      wCtx.strokeStyle = WCOLORS.blue; wCtx.lineWidth = 2;
      wCtx.beginPath();
      wCtx.moveTo(arrowPx, arrowY); wCtx.lineTo(arrowPx + 15, arrowY);
      wCtx.lineTo(arrowPx + 10, arrowY - 4); wCtx.moveTo(arrowPx + 15, arrowY);
      wCtx.lineTo(arrowPx + 10, arrowY + 4);
      wCtx.stroke();
    }
  }

  function animate() {
    t += 0.04;
    if (t > 25) t = 0;
    drawCurve();
    drawWave();
    requestAnimationFrame(animate);
  }

  function onInput() {
    selected = getSelected();
    t = 0;
  }

  k0Slider?.addEventListener('input', onInput);
  radios.forEach(r => r.addEventListener('change', onInput));

  animate();
}

// =========================================================================
// 21. Phase Velocity Demo
// =========================================================================
function initPhaseVelocityDemo() {
  const canvas = document.getElementById('scene-phase-velocity-demo');
  if (!canvas) return;
  const setup = wSetupCanvas(canvas);
  if (!setup) return;
  const { ctx, W, H } = setup;

  let t = 0;
  let k0 = 3, dk = 0.4;

  const k0Slider = document.getElementById('pvd-k0');
  const dkSlider = document.getElementById('pvd-dk');
  const k0Val = document.getElementById('pvd-k0-val');
  const dkVal = document.getElementById('pvd-dk-val');
  function onPvdInput() {
    k0 = parseFloat(k0Slider.value);
    dk = parseFloat(dkSlider.value);
    k0Val.textContent = k0.toFixed(1);
    dkVal.textContent = dk.toFixed(1);
  }
  if (k0Slider) k0Slider.addEventListener('input', onPvdInput);
  if (dkSlider) dkSlider.addEventListener('input', onPvdInput);

  function tick() {
    if (!canvas.isConnected) return;
    t += 0.02;
    wClear(ctx, W, H);

    const plotL = 30, plotR = W - 20;
    const plotW = plotR - plotL;
    const midY = H / 2;
    const amp = 35;

    ctx.fillStyle = WCOLORS.text; ctx.font = 'bold 11px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('Phase velocity: crests move at vp = \u03C9/k', W / 2, 16);

    // Superpose waves with deep-water dispersion: ω = √(gk)
    const g = 9.8;
    const nComponents = 7;

    // Draw individual components lightly
    for (let n = 0; n < nComponents; n++) {
      const k = k0 + (n - nComponents / 2) * dk;
      const omega = Math.sqrt(g * Math.abs(k));
      const vp = omega / k;

      ctx.strokeStyle = WCOLORS.teal; ctx.lineWidth = 0.8; ctx.globalAlpha = 0.2;
      ctx.beginPath();
      for (let i = 0; i <= 400; i++) {
        const x = (i / 400) * 20;
        const val = Math.cos(k * x - omega * t);
        const px = plotL + plotW * i / 400;
        const py = midY - val * amp * 0.3;
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.stroke();
      ctx.globalAlpha = 1;
    }

    // Draw sum (bold)
    ctx.strokeStyle = WCOLORS.teal; ctx.lineWidth = 2.5;
    ctx.beginPath();
    let maxSum = 0;
    const sumVals = [];
    for (let i = 0; i <= 400; i++) {
      const x = (i / 400) * 20;
      let sum = 0;
      for (let n = 0; n < nComponents; n++) {
        const k = k0 + (n - nComponents / 2) * dk;
        const omega = Math.sqrt(g * Math.abs(k));
        const envelope = Math.exp(-((n - nComponents / 2) * dk) * ((n - nComponents / 2) * dk) / (2 * 0.8 * 0.8));
        sum += envelope * Math.cos(k * x - omega * t);
      }
      sumVals.push(sum);
      if (Math.abs(sum) > maxSum) maxSum = Math.abs(sum);
    }
    for (let i = 0; i <= 400; i++) {
      const px = plotL + plotW * i / 400;
      const py = midY - (sumVals[i] / Math.max(maxSum, 0.1)) * amp;
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Compute envelope via running-max of |sumVals|
    const omega0 = Math.sqrt(g * k0);
    const vp = omega0 / k0;
    const vg = 0.5 * Math.sqrt(g / k0); // dω/dk at k0 for deep water
    const absVals = sumVals.map(v => Math.abs(v));
    const lambdaPx = Math.round((2 * Math.PI / k0) / 20 * 400);
    const halfWin = Math.max(Math.floor(lambdaPx / 2), 3);
    const envVals = [];
    for (let i = 0; i <= 400; i++) {
      let mx = 0;
      for (let j = Math.max(0, i - halfWin); j <= Math.min(400, i + halfWin); j++) {
        if (absVals[j] > mx) mx = absVals[j];
      }
      envVals.push(mx);
    }

    // Draw envelope (dashed amber)
    ctx.strokeStyle = WCOLORS.amber; ctx.lineWidth = 1.5; ctx.setLineDash([4, 3]);
    ctx.beginPath();
    for (let i = 0; i <= 400; i++) {
      const px = plotL + plotW * i / 400;
      const py = midY - (envVals[i] / Math.max(maxSum, 0.1)) * amp;
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.stroke();
    ctx.beginPath();
    for (let i = 0; i <= 400; i++) {
      const px = plotL + plotW * i / 400;
      const py = midY + (envVals[i] / Math.max(maxSum, 0.1)) * amp;
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // Mark envelope peak (group velocity) — amber arrow above
    let envPeakIdx = 0;
    for (let i = 1; i <= 400; i++) {
      if (envVals[i] > envVals[envPeakIdx]) envPeakIdx = i;
    }
    const envPx = plotL + plotW * envPeakIdx / 400;
    const envPy = midY - (envVals[envPeakIdx] / Math.max(maxSum, 0.1)) * amp;
    if (envPx > plotL + 10 && envPx < plotR - 10) {
      ctx.fillStyle = WCOLORS.amber;
      ctx.beginPath();
      ctx.moveTo(envPx, envPy - 3);
      ctx.lineTo(envPx - 5, envPy - 14);
      ctx.lineTo(envPx + 5, envPy - 14);
      ctx.fill();
      ctx.font = 'bold 11px system-ui'; ctx.textAlign = 'center';
      ctx.fillText('envelope (vg = ' + vg.toFixed(2) + ')', envPx, envPy - 17);
    }

    // Mark the actual crest nearest the envelope peak — red arrow below
    const peaks = [];
    for (let i = 1; i < sumVals.length - 1; i++) {
      if (sumVals[i] > sumVals[i - 1] && sumVals[i] >= sumVals[i + 1] && sumVals[i] > 0) {
        peaks.push(i);
      }
    }
    if (peaks.length > 0) {
      let best = peaks[0];
      for (const p of peaks) {
        if (Math.abs(p - envPeakIdx) < Math.abs(best - envPeakIdx)) best = p;
      }
      const crestPx = plotL + plotW * best / 400;
      const crestPy = midY - (sumVals[best] / Math.max(maxSum, 0.1)) * amp;
      ctx.fillStyle = WCOLORS.red;
      ctx.beginPath();
      ctx.moveTo(crestPx, crestPy + 3);
      ctx.lineTo(crestPx - 5, crestPy + 14);
      ctx.lineTo(crestPx + 5, crestPy + 14);
      ctx.fill();
      ctx.font = '11px system-ui'; ctx.textAlign = 'center';
      ctx.fillText('crest (vp = ' + vp.toFixed(2) + ')', crestPx, crestPy + 26);
    }

    // Axis
    ctx.strokeStyle = WCOLORS.grid; ctx.lineWidth = 0.5;
    ctx.beginPath(); ctx.moveTo(plotL, midY); ctx.lineTo(plotR, midY); ctx.stroke();

    // Info
    ctx.fillStyle = WCOLORS.textDim; ctx.font = '10px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('Deep water: \u03C9 = \u221A(gk)  \u2192  vp = \u221A(g/k),  vg = \u00BD vp', W / 2, H - 10);
    ctx.fillText('Crests (red) overtake the envelope (amber) because vp > vg', W / 2, H - 25);

    requestAnimationFrame(tick);
  }

  tick();
}

// =========================================================================
// 22. Group Velocity Demo
// =========================================================================
function initGroupVelocityDemo() {
  const canvas = document.getElementById('scene-group-velocity-demo');
  if (!canvas) return;
  const setup = wSetupCanvas(canvas);
  if (!setup) return;
  const { ctx, W, H } = setup;

  let dispSlider = document.getElementById('gvd-disp');
  if (!dispSlider) {
    const parent = canvas.parentElement;
    if (parent) {
      const controls = document.createElement('div');
      controls.className = 'scene-controls';
      controls.innerHTML =
        '<label>Dispersion: <input type="range" id="gvd-disp" min="0" max="2" step="0.1" value="1"><span class="scene-val" id="gvd-disp-val">1.0</span></label>';
      parent.appendChild(controls);
      dispSlider = document.getElementById('gvd-disp');
    }
  }

  let t = 0;

  function tick() {
    if (!canvas.isConnected) return;
    const dispersion = parseFloat(dispSlider?.value || 1);
    document.getElementById('gvd-disp-val')?.replaceChildren(document.createTextNode(dispersion.toFixed(1)));

    t += 0.025;
    wClear(ctx, W, H);

    const plotL = 30, plotR = W - 20;
    const plotW = plotR - plotL;
    const midY = H / 2;
    const amp = 45;

    ctx.fillStyle = WCOLORS.text; ctx.font = 'bold 11px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('Group velocity: envelope moves at vg = d\u03C9/dk', W / 2, 16);

    // ω(k) = c*k + α*(k² − k0*k)  →  vp(k0)=c, vg(k0)=c+α*k0
    const k0 = 4, c = 1.5;
    const alpha = dispersion * 0.3;

    function omega(k) {
      return c * k + alpha * (k * k - k0 * k);
    }

    const vp = c;                       // ω(k0)/k0 = c
    const vg = c + alpha * k0;          // dω/dk at k0 = c + α*(2k0−k0)

    // Build wavepacket
    const sigmaK = 0.6;
    const nK = 30;
    const xRange = 25;

    const sumVals = [];
    let maxV = 0;
    for (let i = 0; i <= 400; i++) {
      const x = (i / 400) * xRange;
      let sum = 0;
      for (let n = 0; n < nK; n++) {
        const k = k0 + (n - nK / 2) * 0.1;
        const w = omega(k);
        const weight = Math.exp(-((k - k0) * (k - k0)) / (2 * sigmaK * sigmaK));
        sum += weight * Math.cos(k * x - w * t);
      }
      sumVals.push(sum);
      if (Math.abs(sum) > maxV) maxV = Math.abs(sum);
    }

    // Draw wavepacket
    ctx.strokeStyle = WCOLORS.teal; ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i <= 400; i++) {
      const px = plotL + plotW * i / 400;
      const py = midY - (sumVals[i] / Math.max(maxV, 0.1)) * amp;
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Draw envelope approximation
    const envVals = [];
    for (let i = 0; i <= 400; i++) {
      const x = (i / 400) * xRange;
      const envCenter = vg * t;
      const env = Math.exp(-((x - envCenter) * (x - envCenter)) / (2 * 2 * 2));
      envVals.push(env);
    }
    let maxEnv = Math.max(...envVals);
    ctx.strokeStyle = WCOLORS.amber; ctx.lineWidth = 1.5; ctx.setLineDash([4, 3]);
    ctx.beginPath();
    for (let i = 0; i <= 400; i++) {
      const px = plotL + plotW * i / 400;
      const py = midY - (envVals[i] / Math.max(maxEnv, 0.01)) * amp;
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.stroke();
    ctx.beginPath();
    for (let i = 0; i <= 400; i++) {
      const px = plotL + plotW * i / 400;
      const py = midY + (envVals[i] / Math.max(maxEnv, 0.01)) * amp;
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.stroke(); ctx.setLineDash([]);

    // Mark envelope peak (vg) — find actual peak of envelope
    const envPeakIdx = envVals.indexOf(Math.max(...envVals));
    const envPeakPx = plotL + plotW * envPeakIdx / 400;
    const envPeakPy = midY - (envVals[envPeakIdx] / Math.max(maxEnv, 0.01)) * amp;
    if (envPeakPx > plotL && envPeakPx < plotR) {
      ctx.fillStyle = WCOLORS.amber;
      ctx.beginPath();
      ctx.moveTo(envPeakPx, envPeakPy - 3);
      ctx.lineTo(envPeakPx - 6, envPeakPy - 14);
      ctx.lineTo(envPeakPx + 6, envPeakPy - 14);
      ctx.fill();
      ctx.font = 'bold 11px system-ui'; ctx.textAlign = 'center';
      ctx.fillText('vg (group)', envPeakPx, envPeakPy - 17);
    }

    // Mark actual crest nearest the envelope peak (vp)
    const peaks = [];
    for (let i = 1; i < sumVals.length - 1; i++) {
      if (sumVals[i] > sumVals[i - 1] && sumVals[i] >= sumVals[i + 1] && sumVals[i] > 0) {
        peaks.push(i);
      }
    }
    if (peaks.length > 0) {
      let best = peaks[0];
      for (const p of peaks) {
        if (Math.abs(p - envPeakIdx) < Math.abs(best - envPeakIdx)) best = p;
      }
      const crestPx = plotL + plotW * best / 400;
      const crestPy = midY - (sumVals[best] / Math.max(maxV, 0.1)) * amp;
      ctx.fillStyle = WCOLORS.red;
      ctx.beginPath();
      ctx.moveTo(crestPx, crestPy + 3);
      ctx.lineTo(crestPx - 6, crestPy + 14);
      ctx.lineTo(crestPx + 6, crestPy + 14);
      ctx.fill();
      ctx.font = 'bold 11px system-ui'; ctx.textAlign = 'center';
      ctx.fillText('vp (phase)', crestPx, crestPy + 26);
    }

    // Baseline
    ctx.strokeStyle = WCOLORS.grid; ctx.lineWidth = 0.5;
    ctx.beginPath(); ctx.moveTo(plotL, midY); ctx.lineTo(plotR, midY); ctx.stroke();

    // Info and annotation
    ctx.fillStyle = WCOLORS.textDim; ctx.font = 'bold 11px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('vp = \u03C9/k = ' + vp.toFixed(2) + '    vg = d\u03C9/dk = ' + vg.toFixed(2) + (Math.abs(vp - vg) > 0.05 ? '  (vp \u2260 vg!)' : '  (vp = vg)'), W / 2, H - 18);
    ctx.fillStyle = WCOLORS.textDim; ctx.font = '10px system-ui';
    ctx.fillText('Envelope (energy) travels at vg; crests travel at vp', W / 2, H - 5);

    // Reset
    if (vg * t > xRange * 1.2) t = 0;

    requestAnimationFrame(tick);
  }

  tick();
}

// =========================================================================
// 23. Wavepacket Dispersion (non-dispersive vs dispersive)
// =========================================================================
function initWavepacketDispersion() {
  const canvas = document.getElementById('scene-wavepacket-dispersion');
  if (!canvas) return;
  const setup = wSetupCanvas(canvas);
  if (!setup) return;
  const { ctx, W, H } = setup;

  let dispSlider = document.getElementById('wpdisp-d');
  if (!dispSlider) {
    const parent = canvas.parentElement;
    if (parent) {
      const controls = document.createElement('div');
      controls.className = 'scene-controls';
      controls.innerHTML =
        '<label>Dispersion \u03B1: <input type="range" id="wpdisp-d" min="0" max="0.5" step="0.02" value="0.15"><span class="scene-val" id="wpdisp-d-val">0.15</span></label>';
      parent.appendChild(controls);
      dispSlider = document.getElementById('wpdisp-d');
    }
  }

  let t = 0;

  function tick() {
    if (!canvas.isConnected) return;
    const alpha = parseFloat(dispSlider?.value || 0.15);
    document.getElementById('wpdisp-d-val')?.replaceChildren(document.createTextNode(alpha.toFixed(2)));

    t += 0.03;
    wClear(ctx, W, H);

    const plotL = 30, plotR = W - 20, plotW = plotR - plotL;
    const topT = 25, topB = H / 2 - 10;
    const botT = H / 2 + 15, botB = H - 15;
    const topH = topB - topT, botH = botB - botT;
    const topMid = (topT + topB) / 2;
    const botMid = (botT + botB) / 2;
    const amp = 0.35;

    ctx.fillStyle = WCOLORS.text; ctx.font = 'bold 11px system-ui'; ctx.textAlign = 'left';
    ctx.fillText('Non-dispersive (\u03C9 = ck)', plotL, topT - 3);
    ctx.fillText('Dispersive (\u03C9 = ck + \u03B1k\u00B2)', plotL, botT - 3);

    // Build packets
    const k0 = 5, c = 1.5, sigmaK = 0.8;
    const nK = 25;
    const xRange = 30;

    // Non-dispersive
    const ndVals = [];
    let ndMax = 0;
    for (let i = 0; i <= 400; i++) {
      const x = (i / 400) * xRange;
      let sum = 0;
      for (let n = 0; n < nK; n++) {
        const k = k0 + (n - nK / 2) * 0.15;
        const w = c * k; // linear dispersion
        const weight = Math.exp(-((k - k0) * (k - k0)) / (2 * sigmaK * sigmaK));
        sum += weight * Math.cos(k * x - w * t);
      }
      ndVals.push(sum);
      if (Math.abs(sum) > ndMax) ndMax = Math.abs(sum);
    }

    // Dispersive
    const dVals = [];
    let dMax = 0;
    for (let i = 0; i <= 400; i++) {
      const x = (i / 400) * xRange;
      let sum = 0;
      for (let n = 0; n < nK; n++) {
        const k = k0 + (n - nK / 2) * 0.15;
        const w = c * k + alpha * k * k;
        const weight = Math.exp(-((k - k0) * (k - k0)) / (2 * sigmaK * sigmaK));
        sum += weight * Math.cos(k * x - w * t);
      }
      dVals.push(sum);
      if (Math.abs(sum) > dMax) dMax = Math.abs(sum);
    }

    // Draw non-dispersive
    ctx.strokeStyle = WCOLORS.grid; ctx.lineWidth = 0.5;
    ctx.beginPath(); ctx.moveTo(plotL, topMid); ctx.lineTo(plotR, topMid); ctx.stroke();
    ctx.strokeStyle = WCOLORS.teal; ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i <= 400; i++) {
      const px = plotL + plotW * i / 400;
      const py = topMid - (ndVals[i] / Math.max(ndMax, 0.1)) * topH * amp;
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Draw dispersive
    ctx.strokeStyle = WCOLORS.grid; ctx.lineWidth = 0.5;
    ctx.beginPath(); ctx.moveTo(plotL, botMid); ctx.lineTo(plotR, botMid); ctx.stroke();
    ctx.strokeStyle = WCOLORS.amber; ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i <= 400; i++) {
      const px = plotL + plotW * i / 400;
      const py = botMid - (dVals[i] / Math.max(dMax, 0.1)) * botH * amp;
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Width measurement on dispersive packet
    // Find half-max indices of envelope
    const absD = dVals.map(v => Math.abs(v));
    const dPeak = Math.max(...absD);
    const halfMax = dPeak * 0.5;
    let leftIdx = -1, rightIdx = -1;
    for (let i = 0; i < absD.length; i++) {
      if (absD[i] >= halfMax && leftIdx < 0) leftIdx = i;
      if (absD[i] >= halfMax) rightIdx = i;
    }
    if (leftIdx >= 0 && rightIdx > leftIdx) {
      const lx = plotL + plotW * leftIdx / 400;
      const rx = plotL + plotW * rightIdx / 400;
      const widthY = botMid + botH * amp + 8;
      ctx.strokeStyle = WCOLORS.red; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(lx, widthY); ctx.lineTo(rx, widthY); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(lx, widthY - 4); ctx.lineTo(lx, widthY + 4); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(rx, widthY - 4); ctx.lineTo(rx, widthY + 4); ctx.stroke();
      ctx.fillStyle = WCOLORS.red; ctx.font = '9px system-ui'; ctx.textAlign = 'center';
      ctx.fillText('\u0394x', (lx + rx) / 2, widthY - 4);
    }

    // Divider
    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 0.5;
    ctx.beginPath(); ctx.moveTo(plotL, H / 2 + 2); ctx.lineTo(plotR, H / 2 + 2); ctx.stroke();

    // Annotations
    ctx.fillStyle = WCOLORS.teal; ctx.font = 'bold 10px system-ui'; ctx.textAlign = 'right';
    ctx.fillText('Shape preserved', plotR, topT + 14);
    ctx.fillStyle = WCOLORS.amber;
    ctx.fillText('Pulse broadens with time', plotR, botT + 14);

    // Reset
    if (c * t > xRange * 1.3) t = 0;

    requestAnimationFrame(tick);
  }

  tick();
}

// =========================================================================
// CHAPTER 17 - COLOR
// =========================================================================

// Helper: wavelength (nm) to approximate RGB color
function wavelengthToRGB(wavelength) {
  let r = 0, g = 0, b = 0;
  if (wavelength >= 380 && wavelength < 440) {
    r = -(wavelength - 440) / (440 - 380);
    g = 0;
    b = 1;
  } else if (wavelength >= 440 && wavelength < 490) {
    r = 0;
    g = (wavelength - 440) / (490 - 440);
    b = 1;
  } else if (wavelength >= 490 && wavelength < 510) {
    r = 0;
    g = 1;
    b = -(wavelength - 510) / (510 - 490);
  } else if (wavelength >= 510 && wavelength < 580) {
    r = (wavelength - 510) / (580 - 510);
    g = 1;
    b = 0;
  } else if (wavelength >= 580 && wavelength < 645) {
    r = 1;
    g = -(wavelength - 645) / (645 - 580);
    b = 0;
  } else if (wavelength >= 645 && wavelength <= 780) {
    r = 1;
    g = 0;
    b = 0;
  }
  // Intensity falloff at edges
  let factor = 1.0;
  if (wavelength >= 380 && wavelength < 420) factor = 0.3 + 0.7 * (wavelength - 380) / (420 - 380);
  else if (wavelength >= 700 && wavelength <= 780) factor = 0.3 + 0.7 * (780 - wavelength) / (780 - 700);
  else if (wavelength < 380 || wavelength > 780) factor = 0;
  return [Math.round(r * factor * 255), Math.round(g * factor * 255), Math.round(b * factor * 255)];
}

function wavelengthToCSS(wl) {
  const [r, g, b] = wavelengthToRGB(wl);
  return 'rgb(' + r + ',' + g + ',' + b + ')';
}

// Draw a visible spectrum bar on a canvas context
function drawSpectrumBar(ctx, x, y, w, h) {
  for (let i = 0; i < w; i++) {
    const wl = 380 + (i / w) * 400;
    ctx.fillStyle = wavelengthToCSS(wl);
    ctx.fillRect(x + i, y, 1, h);
  }
}

// CIE 1931 color matching functions (sampled every 10nm, 380-780)
function getCIEData() {
  const wavelengths = [];
  for (let w = 380; w <= 780; w += 5) wavelengths.push(w);
  // Approximate CIE 1931 x-bar, y-bar, z-bar (sampled)
  const xbar = [], ybar = [], zbar = [];
  for (let i = 0; i < wavelengths.length; i++) {
    const w = wavelengths[i];
    // Gaussian approximation to CIE curves
    const x1 = 1.056 * Math.exp(-0.5 * Math.pow((w - 599.8) / 37.9, 2));
    const x2 = 0.362 * Math.exp(-0.5 * Math.pow((w - 442.0) / 16.0, 2));
    const x3 = -0.065 * Math.exp(-0.5 * Math.pow((w - 501.1) / 20.4, 2));
    xbar.push(x1 + x2 + x3);
    const y1 = 0.821 * Math.exp(-0.5 * Math.pow((w - 568.8) / 46.9, 2));
    const y2 = 0.286 * Math.exp(-0.5 * Math.pow((w - 530.9) / 16.3, 2));
    ybar.push(y1 + y2);
    const z1 = 1.217 * Math.exp(-0.5 * Math.pow((w - 437.0) / 11.8, 2));
    const z2 = 0.681 * Math.exp(-0.5 * Math.pow((w - 459.0) / 26.0, 2));
    zbar.push(z1 + z2);
  }
  return { wavelengths, xbar, ybar, zbar };
}

// =========================================================================
// 1. Color Matching Metamers
// =========================================================================
function initColorMatchingMetamers() {
  const canvas = document.getElementById('scene-color-matching-metamers');
  if (!canvas) return;
  const setup = wSetupCanvas(canvas);
  if (!setup) return;
  const { ctx, W, H } = setup;

  let rVal = 128, gVal = 128, bVal = 128;
  let targetWL = 550;
  let draggingSlider = null;

  const sliderX = 30, sliderW = W * 0.4 - 50;
  const sliderY = [40, 75, 110, 170];
  const swatchW = 120, swatchH = 100;

  function getSliderVal(mx, minV, maxV) {
    const t = Math.max(0, Math.min(1, (mx - sliderX) / sliderW));
    return minV + t * (maxV - minV);
  }

  canvas.addEventListener('mousedown', function(e) {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left, my = e.clientY - rect.top;
    for (let i = 0; i < 4; i++) {
      if (Math.abs(my - sliderY[i]) < 12 && mx >= sliderX - 5 && mx <= sliderX + sliderW + 5) {
        draggingSlider = i;
        break;
      }
    }
    if (draggingSlider !== null) handleSliderDrag(mx);
  });
  canvas.addEventListener('mousemove', function(e) {
    if (draggingSlider === null) return;
    const rect = canvas.getBoundingClientRect();
    handleSliderDrag(e.clientX - rect.left);
  });
  canvas.addEventListener('mouseup', function() { draggingSlider = null; });
  canvas.addEventListener('mouseleave', function() { draggingSlider = null; });

  canvas.addEventListener('touchstart', function(e) {
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const mx = e.touches[0].clientX - rect.left, my = e.touches[0].clientY - rect.top;
    for (let i = 0; i < 4; i++) {
      if (Math.abs(my - sliderY[i]) < 15 && mx >= sliderX - 5 && mx <= sliderX + sliderW + 5) {
        draggingSlider = i;
        break;
      }
    }
    if (draggingSlider !== null) handleSliderDrag(mx);
  }, { passive: false });
  canvas.addEventListener('touchmove', function(e) {
    if (draggingSlider === null) return;
    e.preventDefault();
    handleSliderDrag(e.touches[0].clientX - canvas.getBoundingClientRect().left);
  }, { passive: false });
  canvas.addEventListener('touchend', function() { draggingSlider = null; });

  function handleSliderDrag(mx) {
    if (draggingSlider === 0) rVal = Math.round(getSliderVal(mx, 0, 255));
    else if (draggingSlider === 1) gVal = Math.round(getSliderVal(mx, 0, 255));
    else if (draggingSlider === 2) bVal = Math.round(getSliderVal(mx, 0, 255));
    else if (draggingSlider === 3) targetWL = Math.round(getSliderVal(mx, 380, 700));
    draw();
  }

  function drawSlider(y, val, minV, maxV, color, label) {
    const t = (val - minV) / (maxV - minV);
    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(sliderX, y); ctx.lineTo(sliderX + sliderW, y); ctx.stroke();
    // Fill bar with color
    ctx.fillStyle = color;
    ctx.fillRect(sliderX, y - 3, sliderW * t, 6);
    // Thumb
    ctx.beginPath();
    ctx.arc(sliderX + sliderW * t, y, 7, 0, Math.PI * 2);
    ctx.fillStyle = color; ctx.fill();
    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 1; ctx.stroke();
    // Label
    ctx.fillStyle = WCOLORS.text; ctx.font = '11px system-ui'; ctx.textAlign = 'right';
    ctx.fillText(label + ': ' + Math.round(val), sliderX + sliderW + 45, y + 4);
  }

  function draw() {
    wClear(ctx, W, H);

    ctx.fillStyle = WCOLORS.text; ctx.font = 'bold 12px system-ui'; ctx.textAlign = 'left';
    ctx.fillText('RGB Mixer', sliderX, 22);

    drawSlider(sliderY[0], rVal, 0, 255, '#dc2626', 'R');
    drawSlider(sliderY[1], gVal, 0, 255, '#16a34a', 'G');
    drawSlider(sliderY[2], bVal, 0, 255, '#2563eb', 'B');

    ctx.fillStyle = WCOLORS.text; ctx.font = 'bold 12px system-ui'; ctx.textAlign = 'left';
    ctx.fillText('Target wavelength', sliderX, sliderY[3] - 15);

    // Draw spectrum track for wavelength slider
    for (let i = 0; i < sliderW; i++) {
      const wl = 380 + (i / sliderW) * 320;
      ctx.fillStyle = wavelengthToCSS(wl);
      ctx.fillRect(sliderX + i, sliderY[3] - 3, 1, 6);
    }
    const wlT = (targetWL - 380) / 320;
    ctx.beginPath();
    ctx.arc(sliderX + sliderW * wlT, sliderY[3], 7, 0, Math.PI * 2);
    ctx.fillStyle = wavelengthToCSS(targetWL); ctx.fill();
    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.fillStyle = WCOLORS.text; ctx.font = '11px system-ui'; ctx.textAlign = 'right';
    ctx.fillText(targetWL + ' nm', sliderX + sliderW + 45, sliderY[3] + 4);

    // Swatches
    const sxLeft = W * 0.5;
    const sxRight = W * 0.5 + swatchW + 20;
    const sy = 30;

    // Mixed color swatch
    ctx.fillStyle = 'rgb(' + rVal + ',' + gVal + ',' + bVal + ')';
    ctx.fillRect(sxLeft, sy, swatchW, swatchH);
    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 1;
    ctx.strokeRect(sxLeft, sy, swatchW, swatchH);
    ctx.fillStyle = WCOLORS.text; ctx.font = 'bold 11px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('Your Mix', sxLeft + swatchW / 2, sy + swatchH + 16);

    // Target swatch
    ctx.fillStyle = wavelengthToCSS(targetWL);
    ctx.fillRect(sxRight, sy, swatchW, swatchH);
    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 1;
    ctx.strokeRect(sxRight, sy, swatchW, swatchH);
    ctx.fillStyle = WCOLORS.text; ctx.font = 'bold 11px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('Target (' + targetWL + ' nm)', sxRight + swatchW / 2, sy + swatchH + 16);

    // Check if close match
    const [tr, tg, tb] = wavelengthToRGB(targetWL);
    const dist = Math.sqrt(Math.pow(rVal - tr, 2) + Math.pow(gVal - tg, 2) + Math.pow(bVal - tb, 2));
    if (dist < 40) {
      ctx.fillStyle = WCOLORS.teal; ctx.font = 'bold 13px system-ui'; ctx.textAlign = 'center';
      ctx.fillText('Metamer! Different spectra, same perceived color', W * 0.65, sy + swatchH + 40);
    }

    // Explanation
    ctx.fillStyle = WCOLORS.textDim; ctx.font = '10px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('Mix RGB to visually match the monochromatic target', W / 2, H - 10);
  }

  draw();
}

// =========================================================================
// 2. CIE Tristimulus Curves
// =========================================================================
function initCieTristimulusCurves() {
  const canvas = document.getElementById('scene-cie-tristimulus-curves');
  if (!canvas) return;
  const setup = wSetupCanvas(canvas);
  if (!setup) return;
  const { ctx, W, H } = setup;

  const cie = getCIEData();
  const plotL = 55, plotR = W - 20, plotT = 25, plotB = H - 40;
  const plotW = plotR - plotL, plotH = plotB - plotT;

  function draw() {
    wClear(ctx, W, H);

    // Spectrum bar on x-axis
    drawSpectrumBar(ctx, plotL, plotB, plotW, 12);

    // Axes
    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(plotL, plotT); ctx.lineTo(plotL, plotB); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(plotL, plotB); ctx.lineTo(plotR, plotB); ctx.stroke();

    // Y-axis labels
    ctx.fillStyle = WCOLORS.text; ctx.font = '10px system-ui'; ctx.textAlign = 'right';
    const maxVal = 2.0;
    for (let v = 0; v <= maxVal; v += 0.5) {
      const py = plotB - (v / maxVal) * plotH;
      ctx.fillText(v.toFixed(1), plotL - 5, py + 3);
      ctx.strokeStyle = WCOLORS.grid; ctx.lineWidth = 0.5;
      ctx.beginPath(); ctx.moveTo(plotL, py); ctx.lineTo(plotR, py); ctx.stroke();
    }

    // X-axis labels
    ctx.fillStyle = WCOLORS.text; ctx.font = '10px system-ui'; ctx.textAlign = 'center';
    for (let wl = 400; wl <= 750; wl += 50) {
      const px = plotL + ((wl - 380) / 400) * plotW;
      ctx.fillText(wl, px, plotB + 26);
    }
    ctx.fillText('Wavelength (nm)', (plotL + plotR) / 2, H - 4);

    // Plot curves
    const curves = [
      { data: cie.xbar, color: '#dc2626', label: 'x\u0304(\u03BB)', peakIdx: 0 },
      { data: cie.ybar, color: '#16a34a', label: 'y\u0304(\u03BB)', peakIdx: 0 },
      { data: cie.zbar, color: '#2563eb', label: 'z\u0304(\u03BB)', peakIdx: 0 }
    ];

    curves.forEach(function(curve) {
      ctx.strokeStyle = curve.color; ctx.lineWidth = 2.5;
      ctx.beginPath();
      let maxV = 0, maxI = 0;
      for (let i = 0; i < cie.wavelengths.length; i++) {
        const px = plotL + ((cie.wavelengths[i] - 380) / 400) * plotW;
        const py = plotB - (Math.max(0, curve.data[i]) / maxVal) * plotH;
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        if (curve.data[i] > maxV) { maxV = curve.data[i]; maxI = i; }
      }
      ctx.stroke();

      // Label at peak
      const peakX = plotL + ((cie.wavelengths[maxI] - 380) / 400) * plotW;
      const peakY = plotB - (maxV / maxVal) * plotH;
      ctx.fillStyle = curve.color; ctx.font = 'bold 11px system-ui'; ctx.textAlign = 'center';
      ctx.fillText(curve.label, peakX, peakY - 8);
    });

    // Title
    ctx.fillStyle = WCOLORS.text; ctx.font = 'bold 12px system-ui'; ctx.textAlign = 'left';
    ctx.fillText('CIE 1931 Color Matching Functions', plotL, plotT - 8);
  }

  draw();
}

// =========================================================================
// 3. CIE Color Space with Gamut
// =========================================================================
function initCieColorSpaceGamut() {
  const canvas = document.getElementById('scene-cie-color-space-gamut');
  if (!canvas) return;
  const setup = wSetupCanvas(canvas);
  if (!setup) return;
  const { ctx, W, H } = setup;

  const cie = getCIEData();
  // Compute chromaticity coords for spectral locus
  const spectralX = [], spectralY = [];
  for (let i = 0; i < cie.wavelengths.length; i++) {
    const X = cie.xbar[i], Y = cie.ybar[i], Z = cie.zbar[i];
    const sum = X + Y + Z;
    if (sum > 0.001) {
      spectralX.push(X / sum);
      spectralY.push(Y / sum);
    } else {
      spectralX.push(0);
      spectralY.push(0);
    }
  }

  const plotL = 55, plotB = H - 35, plotT = 20;
  const plotSize = Math.min(W - 80, H - 60);
  const plotR = plotL + plotSize;

  function toScreen(cx, cy) {
    return { x: plotL + cx * plotSize * 1.15, y: plotB - cy * plotSize * 1.3 };
  }

  // XYZ to linear sRGB
  function xyzToLinearRGB(X, Y, Z) {
    return [
       3.2406 * X - 1.5372 * Y - 0.4986 * Z,
      -0.9689 * X + 1.8758 * Y + 0.0415 * Z,
       0.0557 * X - 0.2040 * Y + 1.0570 * Z
    ];
  }

  function gammaCorrect(c) {
    return c > 0.0031308 ? 1.055 * Math.pow(c, 1/2.4) - 0.055 : 12.92 * c;
  }

  // Convert xy chromaticity to displayable RGB with proper gamut mapping
  function xyToDisplayRGB(cx, cy) {
    if (cy < 0.001) return [0, 0, 0];
    const xn = cx / cy;
    const zn = (1 - cx - cy) / cy;
    var rgb = xyzToLinearRGB(xn, 1, zn);
    var maxComp = Math.max(rgb[0], rgb[1], rgb[2]);
    var minComp = Math.min(rgb[0], rgb[1], rgb[2]);
    if (maxComp <= 0) return [0, 0, 0];

    var scale;
    if (minComp < 0) {
      // Out of gamut: desaturate toward D65 white point until in gamut
      var wx = 0.3127, wy = 0.3290;
      var lo = 0, hi = 1;
      for (var iter = 0; iter < 16; iter++) {
        var t = (lo + hi) / 2;
        var mx = wx + t * (cx - wx);
        var my = wy + t * (cy - wy);
        var mxn = mx / my, mzn = (1 - mx - my) / my;
        var mrgb = xyzToLinearRGB(mxn, 1, mzn);
        if (Math.min(mrgb[0], mrgb[1], mrgb[2]) >= 0 && Math.max(mrgb[0], mrgb[1], mrgb[2]) > 0) lo = t;
        else hi = t;
      }
      var ft = lo;
      var fmx = wx + ft * (cx - wx);
      var fmy = wy + ft * (cy - wy);
      rgb = xyzToLinearRGB(fmx / fmy, 1, (1 - fmx - fmy) / fmy);
      maxComp = Math.max(rgb[0], rgb[1], rgb[2]);
      scale = maxComp > 0 ? 1 / maxComp : 0;
    } else {
      scale = 1 / maxComp;
    }

    return [
      gammaCorrect(Math.max(0, Math.min(1, rgb[0] * scale))),
      gammaCorrect(Math.max(0, Math.min(1, rgb[1] * scale))),
      gammaCorrect(Math.max(0, Math.min(1, rgb[2] * scale)))
    ];
  }

  function draw() {
    wClear(ctx, W, H);

    // Draw axes
    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(plotL, plotT); ctx.lineTo(plotL, plotB); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(plotL, plotB); ctx.lineTo(plotR + 20, plotB); ctx.stroke();

    ctx.fillStyle = WCOLORS.text; ctx.font = '10px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('x', (plotL + plotR) / 2, H - 5);
    ctx.save(); ctx.translate(12, (plotT + plotB) / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('y', 0, 0);
    ctx.restore();

    // Axis tick labels
    for (let v = 0; v <= 0.8; v += 0.2) {
      const p = toScreen(v, 0);
      ctx.fillStyle = WCOLORS.textDim; ctx.font = '11px system-ui'; ctx.textAlign = 'center';
      ctx.fillText(v.toFixed(1), p.x, plotB + 13);
      const p2 = toScreen(0, v);
      ctx.textAlign = 'right';
      ctx.fillText(v.toFixed(1), plotL - 5, p2.y + 3);
    }

    // Build spectral locus clipping path
    ctx.beginPath();
    let started = false;
    for (let i = 0; i < spectralX.length; i++) {
      if (spectralX[i] === 0 && spectralY[i] === 0) continue;
      const p = toScreen(spectralX[i], spectralY[i]);
      if (!started) { ctx.moveTo(p.x, p.y); started = true; }
      else ctx.lineTo(p.x, p.y);
    }
    ctx.closePath();

    // Fill with properly gamut-mapped colors
    // Use offscreen canvas since putImageData ignores clip
    ctx.save();
    ctx.clip();
    const fillL = Math.floor(plotL);
    const fillT2 = Math.floor(plotT);
    const fillW = Math.ceil(plotR + 20) - fillL;
    const fillH = Math.ceil(plotB) - fillT2;
    const offCanvas = document.createElement('canvas');
    offCanvas.width = fillW; offCanvas.height = fillH;
    const offCtx = offCanvas.getContext('2d');
    const imgData = offCtx.createImageData(fillW, fillH);
    const data = imgData.data;
    for (let py = 0; py < fillH; py++) {
      for (let px = 0; px < fillW; px++) {
        const cx = (fillL + px - plotL) / (plotSize * 1.15);
        const cy = (plotB - (fillT2 + py)) / (plotSize * 1.3);
        if (cx < 0 || cy < 0.005 || cx > 0.85 || cy > 0.9) continue;
        const rgb = xyToDisplayRGB(cx, cy);
        const idx = (py * fillW + px) * 4;
        data[idx]     = Math.round(rgb[0] * 255);
        data[idx + 1] = Math.round(rgb[1] * 255);
        data[idx + 2] = Math.round(rgb[2] * 255);
        data[idx + 3] = 255;
      }
    }
    offCtx.putImageData(imgData, 0, 0);
    ctx.drawImage(offCanvas, fillL, fillT2);
    ctx.restore();

    // Spectral locus outline
    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 1.5;
    ctx.beginPath();
    started = false;
    for (let i = 0; i < spectralX.length; i++) {
      if (spectralX[i] === 0 && spectralY[i] === 0) continue;
      const p = toScreen(spectralX[i], spectralY[i]);
      if (!started) { ctx.moveTo(p.x, p.y); started = true; }
      else ctx.lineTo(p.x, p.y);
    }
    ctx.closePath();
    ctx.stroke();

    // Wavelength labels on spectral locus
    const labelWLs = [460, 480, 500, 520, 540, 560, 580, 600, 700];
    ctx.fillStyle = WCOLORS.text; ctx.font = '10px system-ui';
    for (let k = 0; k < labelWLs.length; k++) {
      const idx = Math.round((labelWLs[k] - 380) / 5);
      if (idx >= 0 && idx < spectralX.length && (spectralX[idx] > 0 || spectralY[idx] > 0)) {
        const p = toScreen(spectralX[idx], spectralY[idx]);
        const cx = 0.33, cy = 0.33;
        const dx = spectralX[idx] - cx, dy = spectralY[idx] - cy;
        const len = Math.sqrt(dx*dx + dy*dy);
        ctx.textAlign = 'center';
        ctx.fillText(labelWLs[k], p.x + (dx/len)*18, p.y - (dy/len)*12);
      }
    }

    // sRGB gamut triangle
    const srgbR = toScreen(0.64, 0.33);
    const srgbG = toScreen(0.30, 0.60);
    const srgbB = toScreen(0.15, 0.06);
    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(srgbR.x, srgbR.y);
    ctx.lineTo(srgbG.x, srgbG.y);
    ctx.lineTo(srgbB.x, srgbB.y);
    ctx.closePath();
    ctx.stroke();

    // Label gamut vertices
    ctx.fillStyle = WCOLORS.text; ctx.font = 'bold 10px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText('R', srgbR.x + 12, srgbR.y + 4);
    ctx.fillText('G', srgbG.x, srgbG.y - 8);
    ctx.fillText('B', srgbB.x - 10, srgbB.y + 4);

    ctx.fillStyle = WCOLORS.textDim; ctx.font = '10px system-ui'; ctx.textAlign = 'left';
    ctx.fillText('sRGB gamut', srgbR.x + 5, srgbR.y + 18);

    // White point D65
    const wp = toScreen(0.3127, 0.3290);
    ctx.beginPath(); ctx.arc(wp.x, wp.y, 3, 0, Math.PI * 2);
    ctx.fillStyle = '#fff'; ctx.fill();
    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 1; ctx.stroke();
    ctx.fillStyle = WCOLORS.text; ctx.font = '11px system-ui'; ctx.textAlign = 'left';
    ctx.fillText('D65', wp.x + 6, wp.y + 3);

    // Title
    ctx.fillStyle = WCOLORS.text; ctx.font = 'bold 12px system-ui'; ctx.textAlign = 'left';
    ctx.fillText('CIE 1931 Chromaticity Diagram', plotL, plotT - 5);
  }

  draw();
}

// =========================================================================
// 4. Blackbody Planckian Locus
// =========================================================================
function initBlackbodyPlanckianLocus() {
  const canvas = document.getElementById('scene-blackbody-planckian-locus');
  if (!canvas) return;
  const setup = wSetupCanvas(canvas);
  if (!setup) return;
  const { ctx, W, H } = setup;

  let temperature = 5500;
  let draggingSlider = false;
  const sliderX = 30, sliderW = W - 80, sliderY = H - 20;

  // Planckian locus points (pre-computed xy chromaticity for various temps)
  function planckianXY(T) {
    // Approximate Planckian locus using CIE formulas
    let x, y;
    if (T >= 1667 && T <= 4000) {
      x = -0.2661239e9/(T*T*T) - 0.2343589e6/(T*T) + 0.8776956e3/T + 0.179910;
    } else {
      x = -3.0258469e9/(T*T*T) + 2.1070379e6/(T*T) + 0.2226347e3/T + 0.24039;
    }
    if (T >= 1667 && T <= 2222) {
      y = -1.1063814*x*x*x - 1.34811020*x*x + 2.18555832*x - 0.20219683;
    } else if (T <= 4000) {
      y = -0.9549476*x*x*x - 1.37418593*x*x + 2.09137015*x - 0.16748867;
    } else {
      y = 3.0817580*x*x*x - 5.87338670*x*x + 3.75112997*x - 0.37001483;
    }
    return { x: x, y: y };
  }

  function blackbodyRGB(T) {
    // Approximate blackbody color
    let r, g, b;
    const t = T / 100;
    if (t <= 66) {
      r = 255;
      g = Math.max(0, Math.min(255, 99.4708025861 * Math.log(t) - 161.1195681661));
      b = t <= 19 ? 0 : Math.max(0, Math.min(255, 138.5177312231 * Math.log(t - 10) - 305.0447927307));
    } else {
      r = Math.max(0, Math.min(255, 329.698727446 * Math.pow(t - 60, -0.1332047592)));
      g = Math.max(0, Math.min(255, 288.1221695283 * Math.pow(t - 60, -0.0755148492)));
      b = 255;
    }
    return 'rgb(' + Math.round(r) + ',' + Math.round(g) + ',' + Math.round(b) + ')';
  }

  canvas.addEventListener('mousedown', function(e) {
    const rect = canvas.getBoundingClientRect();
    const my = e.clientY - rect.top;
    if (Math.abs(my - sliderY) < 15) { draggingSlider = true; handleDrag(e.clientX - rect.left); }
  });
  canvas.addEventListener('mousemove', function(e) {
    if (!draggingSlider) return;
    handleDrag(e.clientX - canvas.getBoundingClientRect().left);
  });
  canvas.addEventListener('mouseup', function() { draggingSlider = false; });
  canvas.addEventListener('mouseleave', function() { draggingSlider = false; });
  canvas.addEventListener('touchstart', function(e) {
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    if (Math.abs(e.touches[0].clientY - rect.top - sliderY) < 20) {
      draggingSlider = true;
      handleDrag(e.touches[0].clientX - rect.left);
    }
  }, { passive: false });
  canvas.addEventListener('touchmove', function(e) {
    if (!draggingSlider) return;
    e.preventDefault();
    handleDrag(e.touches[0].clientX - canvas.getBoundingClientRect().left);
  }, { passive: false });
  canvas.addEventListener('touchend', function() { draggingSlider = false; });

  function handleDrag(mx) {
    const t = Math.max(0, Math.min(1, (mx - sliderX) / sliderW));
    temperature = Math.round(1000 + t * 9000);
    draw();
  }

  // Tabulated CIE 1931 spectral locus (xy chromaticity), 380-700nm at 5nm
  var spectralLocus = [
    {x:0.1741,y:0.0050},{x:0.1740,y:0.0050},{x:0.1738,y:0.0049},
    {x:0.1736,y:0.0049},{x:0.1733,y:0.0048},{x:0.1730,y:0.0048},
    {x:0.1726,y:0.0048},{x:0.1721,y:0.0048},{x:0.1714,y:0.0051},
    {x:0.1703,y:0.0058},{x:0.1689,y:0.0069},{x:0.1669,y:0.0086},
    {x:0.1644,y:0.0109},{x:0.1611,y:0.0138},{x:0.1566,y:0.0177},
    {x:0.1510,y:0.0227},{x:0.1440,y:0.0297},{x:0.1355,y:0.0399},
    {x:0.1241,y:0.0578},{x:0.1096,y:0.0868},{x:0.0913,y:0.1327},
    {x:0.0687,y:0.2007},{x:0.0454,y:0.2950},{x:0.0235,y:0.4127},
    {x:0.0082,y:0.5384},{x:0.0039,y:0.6548},{x:0.0139,y:0.7502},
    {x:0.0389,y:0.8120},{x:0.0743,y:0.8338},{x:0.1142,y:0.8262},
    {x:0.1547,y:0.8059},{x:0.1929,y:0.7816},{x:0.2296,y:0.7543},
    {x:0.2658,y:0.7243},{x:0.3016,y:0.6923},{x:0.3373,y:0.6589},
    {x:0.3731,y:0.6245},{x:0.4087,y:0.5896},{x:0.4441,y:0.5547},
    {x:0.4788,y:0.5202},{x:0.5125,y:0.4866},{x:0.5448,y:0.4544},
    {x:0.5752,y:0.4242},{x:0.6029,y:0.3965},{x:0.6270,y:0.3725},
    {x:0.6482,y:0.3514},{x:0.6658,y:0.3340},{x:0.6801,y:0.3197},
    {x:0.6915,y:0.3083},{x:0.7006,y:0.2993},{x:0.7079,y:0.2920},
    {x:0.7140,y:0.2859},{x:0.7190,y:0.2809},{x:0.7230,y:0.2770},
    {x:0.7260,y:0.2740},{x:0.7283,y:0.2717},{x:0.7300,y:0.2700},
    {x:0.7311,y:0.2689},{x:0.7320,y:0.2680},{x:0.7327,y:0.2673},
    {x:0.7334,y:0.2666},{x:0.7340,y:0.2660},{x:0.7344,y:0.2656},
    {x:0.7346,y:0.2654},{x:0.7347,y:0.2653}
  ];

  var plotL = 55, plotB2 = H - 45, plotT = 15;
  var plotSize = Math.min(W * 0.55, H - 80);

  function toScreen(cx, cy) {
    return { x: plotL + cx * plotSize * 1.15, y: plotB2 - cy * plotSize * 1.3 };
  }

  function xyToRGB(cx, cy) {
    var Y2 = 1.0, X2 = (Y2 / cy) * cx, Z2 = (Y2 / cy) * (1 - cx - cy);
    var r2 = 3.2406*X2 - 1.5372*Y2 - 0.4986*Z2;
    var g2 = -0.9689*X2 + 1.8758*Y2 + 0.0415*Z2;
    var b2 = 0.0557*X2 - 0.2040*Y2 + 1.0570*Z2;
    function gm(v){return v<=0.0031308?12.92*v:1.055*Math.pow(v,1/2.4)-0.055;}
    r2=gm(Math.max(0,r2));g2=gm(Math.max(0,g2));b2=gm(Math.max(0,b2));
    var mx2=Math.max(r2,g2,b2,1);
    return 'rgb('+Math.round(255*r2/mx2)+','+Math.round(255*g2/mx2)+','+Math.round(255*b2/mx2)+')';
  }

  function isInsideLocus(px, py) {
    var pts = spectralLocus, inside = false;
    for (var i = 0, j = pts.length - 1; i < pts.length; j = i++) {
      var xi=pts[i].x,yi=pts[i].y,xj=pts[j].x,yj=pts[j].y;
      if ((yi>py)!==(yj>py) && px<(xj-xi)*(py-yi)/(yj-yi)+xi) inside=!inside;
    }
    return inside;
  }

  var offscreen = document.createElement('canvas');
  offscreen.width = W; offscreen.height = H;
  var offCtx = offscreen.getContext('2d');
  for (var px = 0; px < W; px += 2) {
    for (var py = plotT; py < plotB2; py += 2) {
      var cx2 = (px - plotL) / (plotSize * 1.15);
      var cy2 = (plotB2 - py) / (plotSize * 1.3);
      if (cx2>=0 && cx2<=0.8 && cy2>0.005 && cy2<=0.9 && isInsideLocus(cx2, cy2)) {
        offCtx.fillStyle = xyToRGB(cx2, cy2);
        offCtx.fillRect(px, py, 2, 2);
      }
    }
  }

  function draw() {
    wClear(ctx, W, H);

    ctx.drawImage(offscreen, 0, 0);

    ctx.strokeStyle = WCOLORS.textDim; ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (var i = 0; i < spectralLocus.length; i++) {
      var p = toScreen(spectralLocus[i].x, spectralLocus[i].y);
      if (i === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
    }
    ctx.closePath();
    ctx.stroke();

    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(plotL, plotT); ctx.lineTo(plotL, plotB2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(plotL, plotB2); ctx.lineTo(plotL + plotSize * 1.15, plotB2); ctx.stroke();

    ctx.fillStyle = WCOLORS.textDim; ctx.font = '11px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('x', plotL + plotSize * 0.5, plotB2 + 12);
    ctx.textAlign = 'right';
    ctx.fillText('y', plotL - 6, plotT + plotSize * 0.3);

    // Planckian locus
    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 2;
    ctx.beginPath();
    for (let T = 1000; T <= 10000; T += 50) {
      const p = planckianXY(T);
      const s = toScreen(p.x, p.y);
      if (T === 1000) ctx.moveTo(s.x, s.y); else ctx.lineTo(s.x, s.y);
    }
    ctx.stroke();

    // Temperature markers on locus
    const markers = [
      { T: 2856, label: 'A (2856K)' },
      { T: 6504, label: 'D65 (6504K)' },
      { T: 3000, label: '' },
      { T: 5000, label: '' }
    ];
    markers.forEach(function(m) {
      const p = planckianXY(m.T);
      const s = toScreen(p.x, p.y);
      ctx.beginPath(); ctx.arc(s.x, s.y, 3, 0, Math.PI * 2);
      ctx.fillStyle = WCOLORS.axis; ctx.fill();
      if (m.label) {
        ctx.fillStyle = WCOLORS.text; ctx.font = '11px system-ui'; ctx.textAlign = 'left';
        ctx.fillText(m.label, s.x + 6, s.y - 4);
      }
    });

    // Current temperature on locus
    const curP = planckianXY(temperature);
    const curS = toScreen(curP.x, curP.y);
    ctx.beginPath(); ctx.arc(curS.x, curS.y, 6, 0, Math.PI * 2);
    ctx.fillStyle = blackbodyRGB(temperature); ctx.fill();
    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 1.5; ctx.stroke();

    // Color swatch
    const swX = W - 140, swY = 20, swW = 120, swH = 70;
    ctx.fillStyle = blackbodyRGB(temperature);
    ctx.fillRect(swX, swY, swW, swH);
    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 1;
    ctx.strokeRect(swX, swY, swW, swH);
    ctx.fillStyle = WCOLORS.text; ctx.font = 'bold 12px system-ui'; ctx.textAlign = 'center';
    ctx.fillText(temperature + ' K', swX + swW/2, swY + swH + 16);

    // Slider
    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(sliderX, sliderY); ctx.lineTo(sliderX + sliderW, sliderY); ctx.stroke();
    // Color gradient on slider
    for (let i = 0; i < sliderW; i++) {
      const T = 1000 + (i / sliderW) * 9000;
      ctx.fillStyle = blackbodyRGB(T);
      ctx.fillRect(sliderX + i, sliderY - 3, 1, 6);
    }
    const st = (temperature - 1000) / 9000;
    ctx.beginPath();
    ctx.arc(sliderX + sliderW * st, sliderY, 7, 0, Math.PI * 2);
    ctx.fillStyle = blackbodyRGB(temperature); ctx.fill();
    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 1.5; ctx.stroke();

    ctx.fillStyle = WCOLORS.textDim; ctx.font = '11px system-ui';
    ctx.textAlign = 'left'; ctx.fillText('1000K', sliderX, sliderY - 10);
    ctx.textAlign = 'right'; ctx.fillText('10000K', sliderX + sliderW, sliderY - 10);

    // Title
    ctx.fillStyle = WCOLORS.text; ctx.font = 'bold 12px system-ui'; ctx.textAlign = 'left';
    ctx.fillText('Planckian Locus', plotL, plotT - 2);
  }

  draw();
}


// =========================================================================
// 5. HSV Color Explorer — color wheel + dual HSB / RGB sliders
// =========================================================================
function initHsvColorExplorer() {
  const canvas = document.getElementById('scene-hsv-color-explorer');
  if (!canvas) return;
  const setup = wSetupCanvas(canvas);
  if (!setup) return;
  const { ctx, W, H } = setup;

  // State: HSB is the source of truth
  let hue = 0, sat = 1.0, bri = 1.0;
  let dragging = null; // 'wheel', 'hsb0'..'hsb2', 'rgb0'..'rgb2'

  // --- Conversion helpers ---
  function hsbToRGBArray(h, s, b) {
    const c = b * s, x = c * (1 - Math.abs((h / 60) % 2 - 1)), m = b - c;
    let r, g, bl;
    if (h < 60)       { r = c; g = x; bl = 0; }
    else if (h < 120) { r = x; g = c; bl = 0; }
    else if (h < 180) { r = 0; g = c; bl = x; }
    else if (h < 240) { r = 0; g = x; bl = c; }
    else if (h < 300) { r = x; g = 0; bl = c; }
    else              { r = c; g = 0; bl = x; }
    return [Math.round((r + m) * 255), Math.round((g + m) * 255), Math.round((bl + m) * 255)];
  }
  function hsbToCSS(h, s, b) {
    const [r, g, bl] = hsbToRGBArray(h, s, b);
    return 'rgb(' + r + ',' + g + ',' + bl + ')';
  }
  function rgbToHSB(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
    let h = 0;
    if (d > 0) {
      if (max === r)      h = 60 * (((g - b) / d) % 6);
      else if (max === g) h = 60 * ((b - r) / d + 2);
      else                h = 60 * ((r - g) / d + 4);
    }
    if (h < 0) h += 360;
    const s = max === 0 ? 0 : d / max;
    return [h, s, max];
  }

  // --- Layout ---
  // Color wheel in center
  const wheelCX = W * 0.5, wheelCY = H * 0.36;
  const wheelR = Math.min(W * 0.19, H * 0.28);

  // Sliders
  const sliderH = 10, thumbR = 7, sliderGap = 40;
  const sliderTop = H * 0.08;

  // HSB column: left of wheel
  const hsbW = W * 0.22;
  const hsbX = 32;

  // RGB column: right of wheel
  const rgbW = W * 0.22;
  const rgbX = W - 18 - rgbW;

  const hsbSliders = [
    { label: 'H', y: sliderTop },
    { label: 'S', y: sliderTop + sliderGap },
    { label: 'B', y: sliderTop + sliderGap * 2 }
  ];
  const rgbSliders = [
    { label: 'R', y: sliderTop, color: '#dc2626' },
    { label: 'G', y: sliderTop + sliderGap, color: '#16a34a' },
    { label: 'B', y: sliderTop + sliderGap * 2, color: '#2563eb' }
  ];

  // Swatch + readouts below wheel
  const swatchY = wheelCY + wheelR + 14;
  const swatchW = 60, swatchH = 36;
  const swatchX = wheelCX - swatchW / 2;

  // --- Hit-test helpers ---
  function hitSlider(mx, my, sx, sw, sy) {
    return my >= sy - thumbR - 4 && my <= sy + sliderH + thumbR + 4 && mx >= sx - thumbR && mx <= sx + sw + thumbR;
  }
  function clampFrac(mx, sx, sw) {
    return Math.max(0, Math.min(1, (mx - sx) / sw));
  }

  // --- Input handling ---
  function handleDown(mx, my) {
    // Check wheel first
    const dx = mx - wheelCX, dy = my - wheelCY;
    if (Math.sqrt(dx * dx + dy * dy) <= wheelR + 5) {
      dragging = 'wheel';
      handleWheelDrag(mx, my);
      return;
    }
    // HSB sliders
    for (let i = 0; i < 3; i++) {
      if (hitSlider(mx, my, hsbX, hsbW, hsbSliders[i].y)) { dragging = 'hsb' + i; handleSliderDrag(mx); return; }
    }
    // RGB sliders
    for (let i = 0; i < 3; i++) {
      if (hitSlider(mx, my, rgbX, rgbW, rgbSliders[i].y)) { dragging = 'rgb' + i; handleSliderDrag(mx); return; }
    }
  }

  function handleWheelDrag(mx, my) {
    const dx = mx - wheelCX, dy = my - wheelCY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist <= wheelR) {
      hue = (Math.atan2(dy, dx) * 180 / Math.PI + 360) % 360;
      sat = Math.min(1, dist / wheelR);
    }
    draw();
  }

  function handleSliderDrag(mx) {
    if (!dragging || dragging === 'wheel') return;
    if (dragging === 'hsb0') { hue = clampFrac(mx, hsbX, hsbW) * 360; }
    else if (dragging === 'hsb1') { sat = clampFrac(mx, hsbX, hsbW); }
    else if (dragging === 'hsb2') { bri = clampFrac(mx, hsbX, hsbW); }
    else if (dragging.startsWith('rgb')) {
      const [r, g, b] = hsbToRGBArray(hue, sat, bri);
      const idx = parseInt(dragging[3]);
      const v = Math.round(clampFrac(mx, rgbX, rgbW) * 255);
      const newRGB = [r, g, b]; newRGB[idx] = v;
      const [nh, ns, nb] = rgbToHSB(newRGB[0], newRGB[1], newRGB[2]);
      hue = nh; sat = ns; bri = nb;
    }
    draw();
  }

  function handleMove(mx, my) {
    if (!dragging) return;
    if (dragging === 'wheel') handleWheelDrag(mx, my);
    else handleSliderDrag(mx);
  }

  canvas.addEventListener('mousedown', function(e) {
    const rect = canvas.getBoundingClientRect();
    handleDown(e.clientX - rect.left, e.clientY - rect.top);
  });
  canvas.addEventListener('mousemove', function(e) {
    if (!dragging) return;
    const rect = canvas.getBoundingClientRect();
    handleMove(e.clientX - rect.left, e.clientY - rect.top);
  });
  canvas.addEventListener('mouseup', function() { dragging = null; });
  canvas.addEventListener('mouseleave', function() { dragging = null; });

  canvas.addEventListener('touchstart', function(e) {
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    handleDown(e.touches[0].clientX - rect.left, e.touches[0].clientY - rect.top);
  }, { passive: false });
  canvas.addEventListener('touchmove', function(e) {
    e.preventDefault();
    if (!dragging) return;
    const rect = canvas.getBoundingClientRect();
    handleMove(e.touches[0].clientX - rect.left, e.touches[0].clientY - rect.top);
  }, { passive: false });
  canvas.addEventListener('touchend', function() { dragging = null; });

  // --- Drawing ---
  function drawSlider(sx, sw, sy, frac, gradFn, label, labelColor) {
    // Track gradient
    for (let i = 0; i <= sw; i++) {
      ctx.fillStyle = gradFn(i / sw);
      ctx.fillRect(sx + i, sy, 1, sliderH);
    }
    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 1;
    ctx.strokeRect(sx, sy, sw, sliderH);

    // Thumb
    const tx = sx + frac * sw, ty = sy + sliderH / 2;
    ctx.beginPath(); ctx.arc(tx, ty, thumbR, 0, Math.PI * 2);
    ctx.fillStyle = gradFn(frac); ctx.fill();
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.stroke();
    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 1; ctx.stroke();

    // Label
    ctx.fillStyle = labelColor || WCOLORS.text;
    ctx.font = 'bold 12px system-ui';
    ctx.textAlign = 'right';
    ctx.fillText(label, sx - 6, sy + sliderH / 2 + 4);
  }

  function draw() {
    wClear(ctx, W, H);
    const [r, g, b] = hsbToRGBArray(hue, sat, bri);
    const currentCSS = 'rgb(' + r + ',' + g + ',' + b + ')';

    // --- Color wheel (center) ---
    for (let angle = 0; angle < 360; angle += 1) {
      for (let rd = 0; rd <= wheelR; rd += 2) {
        const s = rd / wheelR;
        ctx.fillStyle = hsbToCSS(angle, s, bri);
        const rad = angle * Math.PI / 180;
        ctx.fillRect(wheelCX + Math.cos(rad) * rd - 1, wheelCY + Math.sin(rad) * rd - 1, 3, 3);
      }
    }
    // Wheel border
    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(wheelCX, wheelCY, wheelR, 0, Math.PI * 2); ctx.stroke();

    // Selection dot on wheel
    const selRad = hue * Math.PI / 180;
    const selR = sat * wheelR;
    const selX = wheelCX + Math.cos(selRad) * selR;
    const selY = wheelCY + Math.sin(selRad) * selR;
    ctx.beginPath(); ctx.arc(selX, selY, 6, 0, Math.PI * 2);
    ctx.fillStyle = currentCSS; ctx.fill();
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 2.5; ctx.stroke();
    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 1; ctx.stroke();

    // --- HSB sliders (left) ---
    ctx.font = 'bold 10px system-ui'; ctx.fillStyle = WCOLORS.textDim; ctx.textAlign = 'left';
    ctx.fillText('HSB', hsbX, sliderTop - 12);

    drawSlider(hsbX, hsbW, hsbSliders[0].y, hue / 360, function(f) {
      return hsbToCSS(f * 360, 1, 1);
    }, 'H', WCOLORS.text);
    drawSlider(hsbX, hsbW, hsbSliders[1].y, sat, function(f) {
      return hsbToCSS(hue, f, bri);
    }, 'S', WCOLORS.text);
    drawSlider(hsbX, hsbW, hsbSliders[2].y, bri, function(f) {
      return hsbToCSS(hue, sat, f);
    }, 'B', WCOLORS.text);

    // HSB readouts
    ctx.font = '10px monospace'; ctx.fillStyle = WCOLORS.textDim; ctx.textAlign = 'left';
    ctx.fillText(Math.round(hue) + '\u00B0', hsbX + hsbW + 5, hsbSliders[0].y + sliderH / 2 + 4);
    ctx.fillText(Math.round(sat * 100) + '%', hsbX + hsbW + 5, hsbSliders[1].y + sliderH / 2 + 4);
    ctx.fillText(Math.round(bri * 100) + '%', hsbX + hsbW + 5, hsbSliders[2].y + sliderH / 2 + 4);

    // --- RGB sliders (right) ---
    ctx.font = 'bold 10px system-ui'; ctx.fillStyle = WCOLORS.textDim; ctx.textAlign = 'left';
    ctx.fillText('RGB', rgbX, sliderTop - 12);

    drawSlider(rgbX, rgbW, rgbSliders[0].y, r / 255, function(f) {
      return 'rgb(' + Math.round(f * 255) + ',' + g + ',' + b + ')';
    }, 'R', '#dc2626');
    drawSlider(rgbX, rgbW, rgbSliders[1].y, g / 255, function(f) {
      return 'rgb(' + r + ',' + Math.round(f * 255) + ',' + b + ')';
    }, 'G', '#16a34a');
    drawSlider(rgbX, rgbW, rgbSliders[2].y, b / 255, function(f) {
      return 'rgb(' + r + ',' + g + ',' + Math.round(f * 255) + ')';
    }, 'B', '#2563eb');

    // RGB readouts
    ctx.font = '10px monospace'; ctx.fillStyle = WCOLORS.textDim; ctx.textAlign = 'left';
    ctx.fillText(r.toString(), rgbX + rgbW + 5, rgbSliders[0].y + sliderH / 2 + 4);
    ctx.fillText(g.toString(), rgbX + rgbW + 5, rgbSliders[1].y + sliderH / 2 + 4);
    ctx.fillText(b.toString(), rgbX + rgbW + 5, rgbSliders[2].y + sliderH / 2 + 4);

    // --- Swatch + hex below wheel ---
    const cr = 6;
    ctx.beginPath();
    ctx.moveTo(swatchX + cr, swatchY); ctx.lineTo(swatchX + swatchW - cr, swatchY);
    ctx.quadraticCurveTo(swatchX + swatchW, swatchY, swatchX + swatchW, swatchY + cr);
    ctx.lineTo(swatchX + swatchW, swatchY + swatchH - cr);
    ctx.quadraticCurveTo(swatchX + swatchW, swatchY + swatchH, swatchX + swatchW - cr, swatchY + swatchH);
    ctx.lineTo(swatchX + cr, swatchY + swatchH);
    ctx.quadraticCurveTo(swatchX, swatchY + swatchH, swatchX, swatchY + swatchH - cr);
    ctx.lineTo(swatchX, swatchY + cr);
    ctx.quadraticCurveTo(swatchX, swatchY, swatchX + cr, swatchY);
    ctx.closePath();
    ctx.fillStyle = currentCSS; ctx.fill();
    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 1; ctx.stroke();

    // Hex
    const hex = '#' + [r, g, b].map(function(c) { return c.toString(16).padStart(2, '0'); }).join('');
    ctx.fillStyle = WCOLORS.text; ctx.font = 'bold 12px monospace'; ctx.textAlign = 'center';
    ctx.fillText(hex.toUpperCase(), wheelCX, swatchY + swatchH + 16);

    // Hint
    ctx.fillStyle = WCOLORS.textDim; ctx.font = '10px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('Click wheel or drag any slider \u2014 everything stays linked', W / 2, H - 6);
  }

  draw();
}
// =========================================================================
// 6. Additive vs Subtractive Mixing
// =========================================================================
function initAdditiveSubtractiveMixing() {
  const canvas = document.getElementById('scene-additive-subtractive-mixing');
  if (!canvas) return;
  const setup = wSetupCanvas(canvas);
  if (!setup) return;
  const { ctx, W, H } = setup;

  function draw() {
    wClear(ctx, W, H);

    const midX = W / 2;
    const addCX = midX * 0.5, subCX = midX * 1.5;
    const cy = H * 0.5;
    const r = Math.min(W * 0.15, H * 0.3);
    const offset = r * 0.5;

    // Title
    ctx.fillStyle = WCOLORS.text; ctx.font = 'bold 13px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('Additive (Light)', addCX, 18);
    ctx.fillText('Subtractive (Pigment)', subCX, 18);

    // Additive mixing (RGB) - use screen blending
    ctx.globalCompositeOperation = 'lighter';
    // Red circle
    ctx.fillStyle = 'rgb(255,0,0)';
    ctx.beginPath(); ctx.arc(addCX, cy - offset * 0.6, r, 0, Math.PI * 2); ctx.fill();
    // Green circle
    ctx.fillStyle = 'rgb(0,255,0)';
    ctx.beginPath(); ctx.arc(addCX - offset * 0.87, cy + offset * 0.5, r, 0, Math.PI * 2); ctx.fill();
    // Blue circle
    ctx.fillStyle = 'rgb(0,0,255)';
    ctx.beginPath(); ctx.arc(addCX + offset * 0.87, cy + offset * 0.5, r, 0, Math.PI * 2); ctx.fill();
    ctx.globalCompositeOperation = 'source-over';

    // Additive outlines
    ctx.strokeStyle = 'rgba(0,0,0,0.3)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(addCX, cy - offset * 0.6, r, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(addCX - offset * 0.87, cy + offset * 0.5, r, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(addCX + offset * 0.87, cy + offset * 0.5, r, 0, Math.PI * 2); ctx.stroke();

    // Labels for additive
    ctx.fillStyle = '#fff'; ctx.font = 'bold 11px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('R', addCX, cy - offset * 0.6 - r * 0.4);
    ctx.fillText('G', addCX - offset * 0.87 - r * 0.3, cy + offset * 0.5 + r * 0.5);
    ctx.fillText('B', addCX + offset * 0.87 + r * 0.3, cy + offset * 0.5 + r * 0.5);

    // Subtractive mixing (CMY) - use multiply blending
    ctx.globalCompositeOperation = 'multiply';
    ctx.fillStyle = 'rgb(0,255,255)';
    ctx.beginPath(); ctx.arc(subCX, cy - offset * 0.6, r, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgb(255,0,255)';
    ctx.beginPath(); ctx.arc(subCX - offset * 0.87, cy + offset * 0.5, r, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgb(255,255,0)';
    ctx.beginPath(); ctx.arc(subCX + offset * 0.87, cy + offset * 0.5, r, 0, Math.PI * 2); ctx.fill();
    ctx.globalCompositeOperation = 'source-over';

    // Subtractive outlines
    ctx.strokeStyle = 'rgba(0,0,0,0.3)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(subCX, cy - offset * 0.6, r, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(subCX - offset * 0.87, cy + offset * 0.5, r, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(subCX + offset * 0.87, cy + offset * 0.5, r, 0, Math.PI * 2); ctx.stroke();

    // Labels for subtractive
    ctx.fillStyle = WCOLORS.text; ctx.font = 'bold 11px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('C', subCX, cy - offset * 0.6 - r * 0.4);
    ctx.fillText('M', subCX - offset * 0.87 - r * 0.3, cy + offset * 0.5 + r * 0.5);
    ctx.fillText('Y', subCX + offset * 0.87 + r * 0.3, cy + offset * 0.5 + r * 0.5);

    // Bottom labels
    ctx.fillStyle = WCOLORS.textDim; ctx.font = '10px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('R+G+B = White', addCX, H - 10);
    ctx.fillText('C+M+Y = Black', subCX, H - 10);

    // Divider
    ctx.strokeStyle = WCOLORS.grid; ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath(); ctx.moveTo(midX, 30); ctx.lineTo(midX, H - 25); ctx.stroke();
    ctx.setLineDash([]);
  }

  draw();
}

// =========================================================================
// 7. Eye Anatomy Diagram
// =========================================================================
function initEyeAnatomyDiagram() {
  const canvas = document.getElementById('scene-eye-anatomy-diagram');
  if (!canvas) return;
  const setup = wSetupCanvas(canvas);
  if (!setup) return;
  const { ctx, W, H } = setup;

  function draw() {
    wClear(ctx, W, H);

    // Center of the eyeball
    const cx = W * 0.42, cy = H * 0.48;
    const R = Math.min(W, H) * 0.38; // eyeball radius

    // --- Sclera (white outer shell) ---
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(cx, cy, R, R * 0.95, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#f5f0e8';
    ctx.fill();
    ctx.strokeStyle = WCOLORS.axis;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();

    // --- Choroid layer (dark lining inside sclera on back half) ---
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(cx, cy, R * 0.95, R * 0.90, 0, 0.45, Math.PI * 2 - 0.45);
    ctx.strokeStyle = '#8b4513';
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.restore();

    // --- Retina (inner lining, back portion) ---
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(cx, cy, R * 0.88, R * 0.83, 0, 0.55, Math.PI * 2 - 0.55);
    ctx.strokeStyle = '#d4a574';
    ctx.lineWidth = 5;
    ctx.stroke();
    ctx.restore();

    // --- Vitreous humor (fill interior) ---
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(cx, cy, R * 0.85, R * 0.80, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(200, 220, 240, 0.3)';
    ctx.fill();
    ctx.restore();

    // --- Cornea (front bulge) ---
    var corneaExtent = R * 0.38;
    var corneaDepth = R * 0.22;
    ctx.save();
    ctx.beginPath();
    // Bulging arc on the left side of the eye
    var corneaX = cx - R;
    ctx.moveTo(corneaX, cy - corneaExtent);
    ctx.quadraticCurveTo(corneaX - corneaDepth, cy, corneaX, cy + corneaExtent);
    ctx.strokeStyle = '#4488cc';
    ctx.lineWidth = 3;
    ctx.stroke();
    // Fill the cornea area
    ctx.beginPath();
    ctx.moveTo(corneaX, cy - corneaExtent);
    ctx.quadraticCurveTo(corneaX - corneaDepth, cy, corneaX, cy + corneaExtent);
    // Close back through the sclera arc
    ctx.arc(cx, cy, R, Math.atan2(corneaExtent, -(R)), Math.atan2(-corneaExtent, -(R)), true);
    ctx.closePath();
    ctx.fillStyle = 'rgba(180, 210, 240, 0.35)';
    ctx.fill();
    ctx.restore();

    // --- Aqueous humor (between cornea and lens) ---
    ctx.save();
    var aqL = corneaX - corneaDepth * 0.4;
    var aqR = cx - R * 0.62;
    ctx.beginPath();
    ctx.ellipse((aqL + aqR) / 2, cy, (aqR - aqL) / 2, corneaExtent * 0.7, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(180, 220, 250, 0.25)';
    ctx.fill();
    ctx.restore();

    // --- Iris (colored ring with pupil hole) ---
    var irisX = cx - R * 0.72;
    var irisHalfH = R * 0.35;
    var pupilHalfH = R * 0.13;
    // Upper iris
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(irisX, cy - irisHalfH);
    ctx.lineTo(irisX, cy - pupilHalfH);
    var irisGrad = ctx.createLinearGradient(irisX, cy - irisHalfH, irisX, cy - pupilHalfH);
    irisGrad.addColorStop(0, '#5a8f3c');
    irisGrad.addColorStop(1, '#3d6b2e');
    ctx.strokeStyle = irisGrad;
    ctx.lineWidth = 5;
    ctx.stroke();
    // Lower iris
    ctx.beginPath();
    ctx.moveTo(irisX, cy + pupilHalfH);
    ctx.lineTo(irisX, cy + irisHalfH);
    ctx.stroke();
    ctx.restore();

    // --- Pupil (dark opening) ---
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(irisX, cy - pupilHalfH);
    ctx.lineTo(irisX, cy + pupilHalfH);
    ctx.strokeStyle = '#111';
    ctx.lineWidth = 5;
    ctx.stroke();
    ctx.restore();

    // --- Lens (biconvex shape) ---
    var lensX = cx - R * 0.55;
    var lensW = R * 0.22;
    var lensH = R * 0.32;
    ctx.save();
    ctx.beginPath();
    // Left convex surface
    ctx.moveTo(lensX, cy - lensH);
    ctx.quadraticCurveTo(lensX - lensW * 0.6, cy, lensX, cy + lensH);
    // Right convex surface
    ctx.quadraticCurveTo(lensX + lensW, cy, lensX, cy - lensH);
    ctx.closePath();
    ctx.fillStyle = 'rgba(220, 230, 245, 0.6)';
    ctx.fill();
    ctx.strokeStyle = '#6699bb';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();

    // --- Ciliary body (attaches to lens, top and bottom) ---
    ctx.save();
    ctx.strokeStyle = '#8b6b4a';
    ctx.lineWidth = 3;
    // Top
    ctx.beginPath();
    ctx.moveTo(lensX - lensW * 0.2, cy - lensH);
    ctx.quadraticCurveTo(lensX - lensW * 0.8, cy - lensH - R * 0.12, irisX + 3, cy - irisHalfH);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(lensX + lensW * 0.5, cy - lensH);
    ctx.lineTo(cx - R * 0.65, cy - R * 0.55);
    ctx.stroke();
    // Bottom
    ctx.beginPath();
    ctx.moveTo(lensX - lensW * 0.2, cy + lensH);
    ctx.quadraticCurveTo(lensX - lensW * 0.8, cy + lensH + R * 0.12, irisX + 3, cy + irisHalfH);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(lensX + lensW * 0.5, cy + lensH);
    ctx.lineTo(cx - R * 0.65, cy + R * 0.55);
    ctx.stroke();
    ctx.restore();

    // --- Fovea (small pit on back of retina, slightly below center) ---
    var foveaAngle = 0.08; // slightly below optical axis
    var foveaX = cx + R * 0.86 * Math.cos(foveaAngle);
    var foveaY = cy + R * 0.86 * Math.sin(foveaAngle);
    ctx.save();
    ctx.beginPath();
    ctx.arc(foveaX, foveaY, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#cc8833';
    ctx.fill();
    ctx.restore();

    // --- Macula (region around fovea) ---
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(foveaX - 2, foveaY, 18, 12, 0, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(204, 136, 51, 0.5)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([3, 3]);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();

    // --- Optic nerve (exits back of eye, slightly below center) ---
    var onAngle = 0.35;
    var onX = cx + R * Math.cos(onAngle);
    var onY = cy + R * Math.sin(onAngle);
    ctx.save();
    // Nerve bundle exiting
    ctx.beginPath();
    ctx.moveTo(onX - 4, onY - 10);
    ctx.quadraticCurveTo(onX + R * 0.25, onY + R * 0.08, onX + R * 0.32, onY + R * 0.25);
    ctx.quadraticCurveTo(onX + R * 0.22, onY + R * 0.12, onX + 6, onY + 8);
    ctx.closePath();
    ctx.fillStyle = '#c4a66a';
    ctx.fill();
    ctx.strokeStyle = '#8b7340';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();

    // --- Blind spot (where optic nerve meets retina) ---
    ctx.save();
    ctx.beginPath();
    ctx.arc(onX, onY, 6, 0, Math.PI * 2);
    ctx.fillStyle = '#ddc880';
    ctx.fill();
    ctx.restore();

    // --- Light rays entering the eye ---
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 200, 50, 0.5)';
    ctx.lineWidth = 1.5;
    var rayStartX = corneaX - corneaDepth - 40;
    for (var ri = -2; ri <= 2; ri++) {
      var rayY = cy + ri * 18;
      ctx.beginPath();
      ctx.moveTo(rayStartX, rayY);
      // Ray hits cornea
      ctx.lineTo(corneaX - corneaDepth * 0.5, cy + ri * 14);
      ctx.stroke();
      // Refracted through lens to fovea
      ctx.beginPath();
      ctx.setLineDash([4, 3]);
      ctx.moveTo(corneaX - corneaDepth * 0.5, cy + ri * 14);
      ctx.lineTo(foveaX - 5, foveaY);
      ctx.stroke();
      ctx.setLineDash([]);
    }
    // Arrowheads on incoming rays
    for (var ri = -2; ri <= 2; ri++) {
      var rayY = cy + ri * 18;
      ctx.beginPath();
      ctx.moveTo(rayStartX + 8, rayY - 3);
      ctx.lineTo(rayStartX + 14, rayY);
      ctx.lineTo(rayStartX + 8, rayY + 3);
      ctx.fillStyle = 'rgba(255, 200, 50, 0.7)';
      ctx.fill();
    }
    ctx.restore();

    // --- Labels with leader lines ---
    ctx.font = '11px system-ui';
    ctx.textAlign = 'left';

    function label(text, tx, ty, ptX, ptY, align) {
      ctx.save();
      ctx.fillStyle = WCOLORS.text;
      ctx.textAlign = align || 'left';
      ctx.font = '11px system-ui';
      // Leader line
      ctx.beginPath();
      ctx.moveTo(ptX, ptY);
      ctx.lineTo(tx, ty);
      ctx.strokeStyle = 'rgba(150,150,150,0.6)';
      ctx.lineWidth = 1;
      ctx.stroke();
      // Dot at structure
      ctx.beginPath();
      ctx.arc(ptX, ptY, 2, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(150,150,150,0.8)';
      ctx.fill();
      // Text
      ctx.fillStyle = WCOLORS.text;
      ctx.fillText(text, tx, ty);
      ctx.restore();
    }

    // Cornea
    label('Cornea', corneaX - corneaDepth - 30, cy - corneaExtent - 14, corneaX - corneaDepth * 0.5, cy - corneaExtent * 0.5, 'center');

    // Pupil
    label('Pupil', irisX - 40, cy - pupilHalfH - 30, irisX, cy, 'center');

    // Iris
    label('Iris', irisX - 55, cy + irisHalfH + 22, irisX, cy + irisHalfH * 0.7, 'center');

    // Lens
    label('Lens', lensX - 10, cy - lensH - 18, lensX, cy - lensH + 5, 'center');

    // Vitreous humor
    ctx.save();
    ctx.fillStyle = WCOLORS.text;
    ctx.font = 'italic 11px system-ui';
    ctx.textAlign = 'center';
    ctx.globalAlpha = 0.6;
    ctx.fillText('Vitreous', cx + R * 0.1, cy - 8);
    ctx.fillText('humor', cx + R * 0.1, cy + 8);
    ctx.globalAlpha = 1.0;
    ctx.restore();

    // Retina
    label('Retina', cx + R * 0.55, cy - R * 0.78, cx + R * 0.6, cy - R * 0.62, 'left');

    // Fovea
    label('Fovea', foveaX + 20, foveaY - 28, foveaX, foveaY, 'left');

    // Macula
    label('Macula', foveaX + 24, foveaY + 24, foveaX - 10, foveaY + 10, 'left');

    // Optic nerve
    label('Optic nerve', onX + R * 0.12, onY + R * 0.32, onX + R * 0.15, onY + R * 0.12, 'left');

    // Blind spot
    label('Blind spot', onX + 18, onY - 20, onX, onY, 'left');

    // Ciliary body
    label('Ciliary body', cx - R * 0.85, cy + R * 0.72, cx - R * 0.6, cy + R * 0.5, 'left');

    // Aqueous humor
    label('Aqueous humor', corneaX - corneaDepth - 10, cy + corneaExtent + 36, (aqL + aqR) / 2, cy + corneaExtent * 0.4, 'center');

    // Optical axis (dashed line)
    ctx.save();
    ctx.beginPath();
    ctx.setLineDash([6, 4]);
    ctx.moveTo(rayStartX, cy);
    ctx.lineTo(cx + R * 0.9, cy);
    ctx.strokeStyle = 'rgba(150,150,150,0.35)';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();

    // Title
    ctx.fillStyle = WCOLORS.text;
    ctx.font = 'bold 12px system-ui';
    ctx.textAlign = 'left';
    ctx.fillText('Cross-Section of the Human Eye', 10, 18);
  }

  draw();
}

// =========================================================================
// 8. Rod and Cone Sensitivity
// =========================================================================
function initRodConeSensitivity() {
  const canvas = document.getElementById('scene-rod-cone-sensitivity');
  if (!canvas) return;
  const setup = wSetupCanvas(canvas);
  if (!setup) return;
  const { ctx, W, H } = setup;

  const plotL = 55, plotR = W - 20, plotT = 30, plotB = H - 40;
  const plotW = plotR - plotL, plotH = plotB - plotT;

  // Approximate spectral sensitivity curves using Gaussians
  function sCone(wl) { return Math.exp(-0.5 * Math.pow((wl - 420) / 22, 2)); }
  function mCone(wl) { return Math.exp(-0.5 * Math.pow((wl - 534) / 40, 2)); }
  function lCone(wl) { return Math.exp(-0.5 * Math.pow((wl - 564) / 45, 2)); }
  function rod(wl)   { return Math.exp(-0.5 * Math.pow((wl - 498) / 35, 2)); }

  function draw() {
    wClear(ctx, W, H);

    // Spectrum bar
    drawSpectrumBar(ctx, plotL, plotB, plotW, 10);

    // Axes
    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(plotL, plotT); ctx.lineTo(plotL, plotB); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(plotL, plotB); ctx.lineTo(plotR, plotB); ctx.stroke();

    ctx.fillStyle = WCOLORS.text; ctx.font = '10px system-ui'; ctx.textAlign = 'center';
    for (let wl = 400; wl <= 700; wl += 50) {
      const px = plotL + ((wl - 380) / 400) * plotW;
      ctx.fillText(wl, px, plotB + 24);
    }
    ctx.fillText('Wavelength (nm)', (plotL + plotR) / 2, H - 4);

    ctx.textAlign = 'right';
    ctx.fillText('Relative', plotL - 5, plotT + 8);
    ctx.fillText('sensitivity', plotL - 5, plotT + 20);

    // Curves
    const curves = [
      { fn: rod,   color: '#888888', label: 'Rods',     peakWL: 498 },
      { fn: sCone, color: '#2563eb', label: 'S-cones',  peakWL: 420 },
      { fn: mCone, color: '#16a34a', label: 'M-cones',  peakWL: 534 },
      { fn: lCone, color: '#dc2626', label: 'L-cones',  peakWL: 564 }
    ];

    curves.forEach(function(curve) {
      ctx.strokeStyle = curve.color; ctx.lineWidth = 2.5;
      // Fill under curve
      if (curve.color.charAt(0) === '#') {
        // Convert hex to rgba
        const hex = curve.color;
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        ctx.fillStyle = 'rgba(' + r + ',' + g + ',' + b + ',0.1)';
      } else {
        ctx.fillStyle = curve.color.replace(')', ',0.1)').replace('rgb', 'rgba');
      }
      ctx.beginPath();
      let firstPx = plotL;
      for (let wl = 380; wl <= 780; wl += 2) {
        const px = plotL + ((wl - 380) / 400) * plotW;
        const py = plotB - curve.fn(wl) * plotH * 0.9;
        if (wl === 380) { ctx.moveTo(px, plotB); ctx.lineTo(px, py); firstPx = px; }
        else ctx.lineTo(px, py);
      }
      ctx.lineTo(plotR, plotB);
      ctx.closePath();
      ctx.fill();
      ctx.globalAlpha = 1.0;

      // Line
      ctx.beginPath();
      for (let wl = 380; wl <= 780; wl += 2) {
        const px = plotL + ((wl - 380) / 400) * plotW;
        const py = plotB - curve.fn(wl) * plotH * 0.9;
        if (wl === 380) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.strokeStyle = curve.color; ctx.lineWidth = 2;
      ctx.stroke();

      // Label at peak
      const peakPx = plotL + ((curve.peakWL - 380) / 400) * plotW;
      const peakPy = plotB - curve.fn(curve.peakWL) * plotH * 0.9;
      ctx.fillStyle = curve.color; ctx.font = 'bold 10px system-ui'; ctx.textAlign = 'center';
      ctx.fillText(curve.label, peakPx, peakPy - 8);
      ctx.font = '10px system-ui';
      ctx.fillText(curve.peakWL + 'nm', peakPx, peakPy - 20);
    });

    // Title
    ctx.fillStyle = WCOLORS.text; ctx.font = 'bold 12px system-ui'; ctx.textAlign = 'left';
    ctx.fillText('Photoreceptor Spectral Sensitivity', plotL, plotT - 12);
  }

  draw();
}

// =========================================================================
// CHAPTER 18 - ANTENNAS
// =========================================================================

// =========================================================================
// 8. Monopole/Dipole Radiation Pattern
// =========================================================================
function initMonopoleRadiationPattern() {
  const canvas = document.getElementById('scene-monopole-radiation-pattern');
  if (!canvas) return;
  const setup = wSetupCanvas(canvas);
  if (!setup) return;
  const { ctx, W, H } = setup;

  let time = 0;
  let patExp = 2;
  const cx = W * 0.4, cy = H * 0.5;
  const maxR = Math.min(W * 0.35, H * 0.42);

  const expSlider = document.getElementById('mrp-exp');
  const expVal = document.getElementById('mrp-exp-val');
  function onMrpInput() {
    patExp = parseInt(expSlider.value);
    expVal.textContent = patExp;
  }
  if (expSlider) expSlider.addEventListener('input', onMrpInput);

  function tick() {
    if (!canvas.isConnected) return;
    time += 0.03;
    wClear(ctx, W, H);

    // Grid circles
    ctx.strokeStyle = WCOLORS.grid; ctx.lineWidth = 0.5;
    for (let r = maxR * 0.25; r <= maxR; r += maxR * 0.25) {
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
    }

    // Expanding wavefronts (sin^n theta modulated)
    for (let wf = 0; wf < 5; wf++) {
      const phase = (time * 50 + wf * 60) % (maxR * 1.3);
      if (phase > maxR * 1.2) continue;
      const alpha = Math.max(0, 1 - phase / (maxR * 1.2));
      ctx.strokeStyle = 'rgba(15,118,110,' + (alpha * 0.5) + ')';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let a = 0; a <= 360; a += 2) {
        const rad = a * Math.PI / 180;
        const sinTheta = Math.abs(Math.sin(rad));
        const r = phase * Math.pow(sinTheta, patExp);
        const px = cx + Math.cos(rad) * r;
        const py = cy + Math.sin(rad) * r;
        if (a === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.stroke();
    }

    // sin^n(theta) radiation pattern
    ctx.strokeStyle = WCOLORS.teal; ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let a = 0; a <= 360; a += 1) {
      const rad = a * Math.PI / 180;
      const sinTheta = Math.sin(rad);
      const r = maxR * Math.pow(Math.abs(sinTheta), patExp);
      const px = cx + Math.cos(rad) * r;
      const py = cy + Math.sin(rad) * r;
      if (a === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.stroke();

    // Fill pattern
    ctx.fillStyle = 'rgba(15,118,110,0.08)';
    ctx.beginPath();
    for (let a = 0; a <= 360; a += 1) {
      const rad = a * Math.PI / 180;
      const sinTheta = Math.sin(rad);
      const r = maxR * Math.pow(Math.abs(sinTheta), patExp);
      if (a === 0) ctx.moveTo(cx + r, cy); else ctx.lineTo(cx + Math.cos(rad) * r, cy + Math.sin(rad) * r);
    }
    ctx.closePath();
    ctx.fill();

    // Dipole antenna (vertical line at center)
    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(cx, cy - 25); ctx.lineTo(cx, cy + 25); ctx.stroke();
    // Gap in middle
    ctx.fillStyle = WCOLORS.bg; ctx.fillRect(cx - 3, cy - 3, 6, 6);
    ctx.strokeStyle = WCOLORS.amber; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(cx, cy, 3, 0, Math.PI * 2); ctx.stroke();

    // Null labels
    ctx.fillStyle = WCOLORS.red; ctx.font = '10px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('null', cx, cy - maxR * 0.15 - 30);
    ctx.fillText('null', cx, cy + maxR * 0.15 + 38);

    // Max labels
    ctx.fillStyle = WCOLORS.teal; ctx.font = '10px system-ui';
    ctx.textAlign = 'left'; ctx.fillText('max', cx + maxR + 5, cy + 4);
    ctx.textAlign = 'right'; ctx.fillText('max', cx - maxR - 5, cy + 4);

    // Formula
    ctx.fillStyle = WCOLORS.text; ctx.font = '12px system-ui'; ctx.textAlign = 'left';
    const supDigits = ['\u2070','\u00B9','\u00B2','\u00B3','\u2074','\u2075','\u2076'];
    ctx.fillText('P(\u03B8) \u221D sin' + (supDigits[patExp] || patExp) + '\u03B8', W * 0.75, 25);

    // Angle label
    ctx.fillStyle = WCOLORS.textDim; ctx.font = '10px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('\u03B8 measured from dipole axis', cx, H - 8);

    // Title
    ctx.fillStyle = WCOLORS.text; ctx.font = 'bold 12px system-ui'; ctx.textAlign = 'left';
    ctx.fillText('Radiation Pattern', 10, 18);

    requestAnimationFrame(tick);
  }

  tick();
}

// =========================================================================
// 9. Two-Source Interference
// =========================================================================
function initTwoSourceInterference() {
  const canvas = document.getElementById('scene-two-source-interference');
  if (!canvas) return;
  const setup = wSetupCanvas(canvas);
  if (!setup) return;
  const { ctx, W, H } = setup;

  let dOverLambda = 2.0;
  let draggingSlider = false;
  let time = 0;
  const sliderX = 20, sliderW = W * 0.35, sliderY = H - 18;

  canvas.addEventListener('mousedown', function(e) {
    const rect = canvas.getBoundingClientRect();
    if (Math.abs(e.clientY - rect.top - sliderY) < 15) {
      draggingSlider = true;
      handleDrag(e.clientX - rect.left);
    }
  });
  canvas.addEventListener('mousemove', function(e) {
    if (!draggingSlider) return;
    handleDrag(e.clientX - canvas.getBoundingClientRect().left);
  });
  canvas.addEventListener('mouseup', function() { draggingSlider = false; });
  canvas.addEventListener('mouseleave', function() { draggingSlider = false; });
  canvas.addEventListener('touchstart', function(e) {
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    if (Math.abs(e.touches[0].clientY - rect.top - sliderY) < 20) {
      draggingSlider = true;
      handleDrag(e.touches[0].clientX - rect.left);
    }
  }, { passive: false });
  canvas.addEventListener('touchmove', function(e) {
    if (!draggingSlider) return; e.preventDefault();
    handleDrag(e.touches[0].clientX - canvas.getBoundingClientRect().left);
  }, { passive: false });
  canvas.addEventListener('touchend', function() { draggingSlider = false; });

  function handleDrag(mx) {
    const t = Math.max(0, Math.min(1, (mx - sliderX) / sliderW));
    dOverLambda = 0.5 + t * 4.5;
  }

  function tick() {
    if (!canvas.isConnected) return;
    time += 0.04;
    wClear(ctx, W, H);

    const lambda = 30;
    const d = dOverLambda * lambda;
    const s1x = W * 0.15, s1y = H * 0.4 - d/2;
    const s2x = W * 0.15, s2y = H * 0.4 + d/2;

    // Draw interference field
    const fieldW = W * 0.55, fieldH = H - 50;
    const fieldX = W * 0.05, fieldY = 15;

    for (let px = 0; px < fieldW; px += 4) {
      for (let py = 0; py < fieldH; py += 4) {
        const x = fieldX + px, y = fieldY + py;
        const r1 = Math.sqrt(Math.pow(x - s1x, 2) + Math.pow(y - s1y, 2));
        const r2 = Math.sqrt(Math.pow(x - s2x, 2) + Math.pow(y - s2y, 2));
        const k = 2 * Math.PI / lambda;
        const wave = Math.cos(k * r1 - time * 3) + Math.cos(k * r2 - time * 3);
        const intensity = wave * wave / 4;
        const c = Math.round(intensity * 200);
        ctx.fillStyle = 'rgb(' + (255 - c) + ',' + (255 - c) + ',' + (255 - Math.round(intensity * 150)) + ')';
        ctx.fillRect(x, y, 4, 4);
      }
    }

    // Source markers
    ctx.fillStyle = WCOLORS.red;
    ctx.beginPath(); ctx.arc(s1x, s1y, 4, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(s2x, s2y, 4, 0, Math.PI * 2); ctx.fill();

    // Radiation pattern (polar plot on right)
    const polCX = W * 0.8, polCY = H * 0.4;
    const polR = Math.min(W * 0.15, H * 0.3);

    ctx.strokeStyle = WCOLORS.grid; ctx.lineWidth = 0.5;
    ctx.beginPath(); ctx.arc(polCX, polCY, polR, 0, Math.PI * 2); ctx.stroke();

    ctx.strokeStyle = WCOLORS.teal; ctx.lineWidth = 2;
    ctx.beginPath();
    for (let a = 0; a <= 360; a += 1) {
      const theta = a * Math.PI / 180;
      const arg = Math.PI * dOverLambda * Math.sin(theta);
      const I = Math.abs(arg) < 0.001 ? 1 : Math.pow(Math.cos(arg), 2);
      const r = polR * I;
      const px = polCX + Math.cos(theta) * r;
      const py = polCY + Math.sin(theta) * r;
      if (a === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.stroke();

    ctx.fillStyle = WCOLORS.text; ctx.font = '10px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('Radiation pattern', polCX, polCY + polR + 18);

    // Slider
    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(sliderX, sliderY); ctx.lineTo(sliderX + sliderW, sliderY); ctx.stroke();
    const st = (dOverLambda - 0.5) / 4.5;
    ctx.beginPath(); ctx.arc(sliderX + sliderW * st, sliderY, 6, 0, Math.PI * 2);
    ctx.fillStyle = WCOLORS.teal; ctx.fill();
    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 1; ctx.stroke();
    ctx.fillStyle = WCOLORS.text; ctx.font = '11px system-ui'; ctx.textAlign = 'left';
    ctx.fillText('d/\u03BB = ' + dOverLambda.toFixed(1), sliderX + sliderW + 10, sliderY + 4);

    // Title
    ctx.fillStyle = WCOLORS.text; ctx.font = 'bold 12px system-ui'; ctx.textAlign = 'left';
    ctx.fillText('Two-Source Interference', 10, 12);

    requestAnimationFrame(tick);
  }

  tick();
}

// =========================================================================
// 10. Phased Array Radiation
// =========================================================================
function initPhasedArrayRadiation() {
  const canvas = document.getElementById('scene-phased-array-radiation');
  if (!canvas) return;
  const setup = wSetupCanvas(canvas);
  if (!setup) return;
  const { ctx, W, H } = setup;

  let N = 5, dOverLambda = 0.5, delta = 0;
  let draggingSlider = null;

  const sliders = [
    { y: H - 50, label: 'N', min: 2, max: 10, getVal: function() { return N; }, setVal: function(v) { N = Math.round(v); } },
    { y: H - 32, label: 'd/\u03BB', min: 0.2, max: 2, getVal: function() { return dOverLambda; }, setVal: function(v) { dOverLambda = v; } },
    { y: H - 14, label: '\u03B4', min: -Math.PI, max: Math.PI, getVal: function() { return delta; }, setVal: function(v) { delta = v; } }
  ];
  const sliderX = 30, sliderW = W * 0.4;

  canvas.addEventListener('mousedown', function(e) {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left, my = e.clientY - rect.top;
    for (let i = 0; i < sliders.length; i++) {
      if (Math.abs(my - sliders[i].y) < 10 && mx >= sliderX - 5 && mx <= sliderX + sliderW + 5) {
        draggingSlider = i; handleDrag(mx); break;
      }
    }
  });
  canvas.addEventListener('mousemove', function(e) {
    if (draggingSlider === null) return;
    handleDrag(e.clientX - canvas.getBoundingClientRect().left);
  });
  canvas.addEventListener('mouseup', function() { draggingSlider = null; });
  canvas.addEventListener('mouseleave', function() { draggingSlider = null; });
  canvas.addEventListener('touchstart', function(e) {
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const mx = e.touches[0].clientX - rect.left, my = e.touches[0].clientY - rect.top;
    for (let i = 0; i < sliders.length; i++) {
      if (Math.abs(my - sliders[i].y) < 14 && mx >= sliderX - 5 && mx <= sliderX + sliderW + 5) {
        draggingSlider = i; handleDrag(mx); break;
      }
    }
  }, { passive: false });
  canvas.addEventListener('touchmove', function(e) {
    if (draggingSlider === null) return; e.preventDefault();
    handleDrag(e.touches[0].clientX - canvas.getBoundingClientRect().left);
  }, { passive: false });
  canvas.addEventListener('touchend', function() { draggingSlider = null; });

  function handleDrag(mx) {
    const s = sliders[draggingSlider];
    const t = Math.max(0, Math.min(1, (mx - sliderX) / sliderW));
    s.setVal(s.min + t * (s.max - s.min));
    draw();
  }

  function arrayFactor(theta) {
    const psi = 2 * Math.PI * dOverLambda * Math.sin(theta) + delta;
    if (Math.abs(psi) < 1e-10) return 1;
    const af = Math.sin(N * psi / 2) / (N * Math.sin(psi / 2));
    return af * af;
  }

  function draw() {
    wClear(ctx, W, H);

    // Draw array on left
    const arrX = W * 0.15, arrCY = H * 0.35;
    const spacing = Math.min(25, (H * 0.5) / N);
    ctx.fillStyle = WCOLORS.text; ctx.font = '10px system-ui'; ctx.textAlign = 'center';
    for (let i = 0; i < N; i++) {
      const y = arrCY - (N - 1) * spacing / 2 + i * spacing;
      ctx.fillStyle = WCOLORS.teal;
      ctx.beginPath(); ctx.arc(arrX, y, 4, 0, Math.PI * 2); ctx.fill();
    }
    ctx.fillStyle = WCOLORS.textDim; ctx.font = '11px system-ui';
    ctx.fillText(N + ' sources', arrX, arrCY + N * spacing / 2 + 15);

    // Polar plot on right
    const polCX = W * 0.65, polCY = H * 0.35;
    const polR = Math.min(W * 0.28, H * 0.3);

    // Grid
    ctx.strokeStyle = WCOLORS.grid; ctx.lineWidth = 0.5;
    for (let r = polR * 0.33; r <= polR; r += polR * 0.33) {
      ctx.beginPath(); ctx.arc(polCX, polCY, r, 0, Math.PI * 2); ctx.stroke();
    }

    // Pattern
    ctx.strokeStyle = WCOLORS.teal; ctx.lineWidth = 2;
    ctx.fillStyle = 'rgba(15,118,110,0.1)';
    ctx.beginPath();
    for (let a = 0; a <= 360; a += 1) {
      const theta = a * Math.PI / 180;
      const r = polR * arrayFactor(theta);
      const px = polCX + Math.cos(theta) * r;
      const py = polCY + Math.sin(theta) * r;
      if (a === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Beam direction indicator
    const beamAngle = -Math.asin(Math.max(-1, Math.min(1, -delta / (2 * Math.PI * dOverLambda))));
    if (!isNaN(beamAngle)) {
      ctx.strokeStyle = WCOLORS.amber; ctx.lineWidth = 1; ctx.setLineDash([4, 3]);
      ctx.beginPath();
      ctx.moveTo(polCX, polCY);
      ctx.lineTo(polCX + Math.cos(beamAngle) * polR * 1.1, polCY + Math.sin(beamAngle) * polR * 1.1);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = WCOLORS.amber; ctx.font = '11px system-ui'; ctx.textAlign = 'left';
      ctx.fillText('beam', polCX + Math.cos(beamAngle) * polR * 0.7 + 5, polCY + Math.sin(beamAngle) * polR * 0.7);
    }

    // Sliders
    sliders.forEach(function(s, i) {
      ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(sliderX, s.y); ctx.lineTo(sliderX + sliderW, s.y); ctx.stroke();
      const t = (s.getVal() - s.min) / (s.max - s.min);
      ctx.beginPath(); ctx.arc(sliderX + sliderW * t, s.y, 5, 0, Math.PI * 2);
      ctx.fillStyle = WCOLORS.teal; ctx.fill();
      ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 1; ctx.stroke();
      ctx.fillStyle = WCOLORS.text; ctx.font = '10px system-ui'; ctx.textAlign = 'left';
      const valStr = i === 0 ? Math.round(s.getVal()) : i === 2 ? (s.getVal() / Math.PI).toFixed(2) + '\u03C0' : s.getVal().toFixed(2);
      ctx.fillText(s.label + ' = ' + valStr, sliderX + sliderW + 10, s.y + 4);
    });

    // Title
    ctx.fillStyle = WCOLORS.text; ctx.font = 'bold 12px system-ui'; ctx.textAlign = 'left';
    ctx.fillText('Phased Array Radiation Pattern', 10, 16);
  }

  draw();
}

// =========================================================================
// 11. Interferometer Resolution
// =========================================================================
function initInterferometerResolution() {
  const canvas = document.getElementById('scene-interferometer-resolution');
  if (!canvas) return;
  const setup = wSetupCanvas(canvas);
  if (!setup) return;
  const { ctx, W, H } = setup;

  let dOverLambda = 5;
  let draggingSlider = false;
  const sliderX = 30, sliderW = W * 0.5, sliderY = H - 18;

  canvas.addEventListener('mousedown', function(e) {
    const rect = canvas.getBoundingClientRect();
    if (Math.abs(e.clientY - rect.top - sliderY) < 15) { draggingSlider = true; handleDrag(e.clientX - rect.left); }
  });
  canvas.addEventListener('mousemove', function(e) { if (!draggingSlider) return; handleDrag(e.clientX - canvas.getBoundingClientRect().left); });
  canvas.addEventListener('mouseup', function() { draggingSlider = false; });
  canvas.addEventListener('mouseleave', function() { draggingSlider = false; });
  canvas.addEventListener('touchstart', function(e) { e.preventDefault(); const rect = canvas.getBoundingClientRect(); if (Math.abs(e.touches[0].clientY - rect.top - sliderY) < 20) { draggingSlider = true; handleDrag(e.touches[0].clientX - rect.left); } }, { passive: false });
  canvas.addEventListener('touchmove', function(e) { if (!draggingSlider) return; e.preventDefault(); handleDrag(e.touches[0].clientX - canvas.getBoundingClientRect().left); }, { passive: false });
  canvas.addEventListener('touchend', function() { draggingSlider = false; });

  function handleDrag(mx) {
    const t = Math.max(0, Math.min(1, (mx - sliderX) / sliderW));
    dOverLambda = 1 + t * 19;
    draw();
  }

  function draw() {
    wClear(ctx, W, H);

    // Two antennas
    const antY = H * 0.3;
    const sep = Math.min(W * 0.3, dOverLambda * 8);
    const a1x = W * 0.3 - sep / 2, a2x = W * 0.3 + sep / 2;

    // Ground line
    ctx.strokeStyle = WCOLORS.textDim; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(a1x - 20, antY + 20); ctx.lineTo(a2x + 20, antY + 20); ctx.stroke();

    // Antennas
    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(a1x, antY + 20); ctx.lineTo(a1x, antY - 15); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(a2x, antY + 20); ctx.lineTo(a2x, antY - 15); ctx.stroke();
    // Dishes
    ctx.strokeStyle = WCOLORS.teal; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(a1x, antY - 15, 8, Math.PI * 1.2, Math.PI * 1.8); ctx.stroke();
    ctx.beginPath(); ctx.arc(a2x, antY - 15, 8, Math.PI * 1.2, Math.PI * 1.8); ctx.stroke();

    // d label
    ctx.strokeStyle = WCOLORS.amber; ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    ctx.beginPath(); ctx.moveTo(a1x, antY + 30); ctx.lineTo(a2x, antY + 30); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = WCOLORS.amber; ctx.font = '11px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('d', (a1x + a2x) / 2, antY + 44);

    // Fringe pattern
    const plotL2 = W * 0.55, plotR2 = W - 15, plotT2 = 30, plotB2 = H * 0.7;
    const pW = plotR2 - plotL2, pH = plotB2 - plotT2;

    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(plotL2, plotB2); ctx.lineTo(plotR2, plotB2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(plotL2, plotT2); ctx.lineTo(plotL2, plotB2); ctx.stroke();

    ctx.fillStyle = WCOLORS.text; ctx.font = '10px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('\u03B8', (plotL2 + plotR2) / 2, plotB2 + 14);
    ctx.textAlign = 'right';
    ctx.fillText('I', plotL2 - 5, plotT2 + 5);

    // cos^2 fringe
    ctx.strokeStyle = WCOLORS.teal; ctx.lineWidth = 2;
    ctx.beginPath();
    for (let px = 0; px <= pW; px++) {
      const theta = (px / pW - 0.5) * Math.PI * 0.8;
      const I = Math.pow(Math.cos(Math.PI * dOverLambda * Math.sin(theta)), 2);
      const py2 = plotB2 - I * pH * 0.9;
      if (px === 0) ctx.moveTo(plotL2 + px, py2); else ctx.lineTo(plotL2 + px, py2);
    }
    ctx.stroke();

    // Resolution
    const deltaTheta = 1 / dOverLambda;
    ctx.fillStyle = WCOLORS.text; ctx.font = '11px system-ui'; ctx.textAlign = 'left';
    ctx.fillText('\u0394\u03B8 = \u03BB/d = ' + (1/dOverLambda).toFixed(3) + ' rad', plotL2, plotB2 + 30);
    ctx.fillText('= ' + (180 / (Math.PI * dOverLambda)).toFixed(2) + '\u00B0', plotL2 + 130, plotB2 + 30);

    // Slider
    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(sliderX, sliderY); ctx.lineTo(sliderX + sliderW, sliderY); ctx.stroke();
    const st = (dOverLambda - 1) / 19;
    ctx.beginPath(); ctx.arc(sliderX + sliderW * st, sliderY, 6, 0, Math.PI * 2);
    ctx.fillStyle = WCOLORS.teal; ctx.fill();
    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 1; ctx.stroke();
    ctx.fillStyle = WCOLORS.text; ctx.font = '11px system-ui'; ctx.textAlign = 'left';
    ctx.fillText('d/\u03BB = ' + dOverLambda.toFixed(1), sliderX + sliderW + 10, sliderY + 4);

    ctx.fillStyle = WCOLORS.text; ctx.font = 'bold 12px system-ui'; ctx.textAlign = 'left';
    ctx.fillText('Two-Antenna Interferometer', 10, 18);
  }

  draw();
}

// =========================================================================
// CHAPTER 19 - DIFFRACTION
// =========================================================================

// =========================================================================
// 12. Huygens Principle Demo
// =========================================================================
function initHuygensPrincipleDemo() {
  const canvas = document.getElementById('scene-huygens-principle-demo');
  if (!canvas) return;
  const setup = wSetupCanvas(canvas);
  if (!setup) return;
  const { ctx, W, H } = setup;

  let slitWidth = 3.0; // in wavelengths
  let time = 0;
  let draggingSlider = false;
  const sliderX = 20, sliderW = W * 0.3, sliderY = H - 16;

  canvas.addEventListener('mousedown', function(e) {
    const rect = canvas.getBoundingClientRect();
    if (Math.abs(e.clientY - rect.top - sliderY) < 15) { draggingSlider = true; handleDrag(e.clientX - rect.left); }
  });
  canvas.addEventListener('mousemove', function(e) { if (!draggingSlider) return; handleDrag(e.clientX - canvas.getBoundingClientRect().left); });
  canvas.addEventListener('mouseup', function() { draggingSlider = false; });
  canvas.addEventListener('mouseleave', function() { draggingSlider = false; });
  canvas.addEventListener('touchstart', function(e) { e.preventDefault(); const rect = canvas.getBoundingClientRect(); if (Math.abs(e.touches[0].clientY - rect.top - sliderY) < 20) { draggingSlider = true; handleDrag(e.touches[0].clientX - rect.left); } }, { passive: false });
  canvas.addEventListener('touchmove', function(e) { if (!draggingSlider) return; e.preventDefault(); handleDrag(e.touches[0].clientX - canvas.getBoundingClientRect().left); }, { passive: false });
  canvas.addEventListener('touchend', function() { draggingSlider = false; });

  function handleDrag(mx) {
    slitWidth = 0.5 + Math.max(0, Math.min(1, (mx - sliderX) / sliderW)) * 7.5;
  }

  function tick() {
    if (!canvas.isConnected) return;
    time += 0.06;
    wClear(ctx, W, H);

    const lambda = 20;
    const barrierX = W * 0.35;
    const slitHalf = slitWidth * lambda / 2;
    const slitCY = H * 0.45;

    // Barrier
    ctx.fillStyle = WCOLORS.axis;
    ctx.fillRect(barrierX - 3, 0, 6, slitCY - slitHalf);
    ctx.fillRect(barrierX - 3, slitCY + slitHalf, 6, H - slitCY - slitHalf);

    // Incoming plane waves (left side)
    ctx.strokeStyle = 'rgba(15,118,110,0.3)'; ctx.lineWidth = 1.5;
    for (let wf = 0; wf < 12; wf++) {
      const x = barrierX - ((time * 15 + wf * lambda) % (barrierX));
      if (x > 5 && x < barrierX - 5) {
        ctx.beginPath(); ctx.moveTo(x, 10); ctx.lineTo(x, H - 30); ctx.stroke();
      }
    }

    // Huygens wavelets from slit
    const nSources = Math.max(3, Math.round(slitWidth * 3));
    for (let i = 0; i < nSources; i++) {
      const sy = slitCY - slitHalf + (i + 0.5) * (2 * slitHalf / nSources);
      // Draw expanding circles
      for (let wf = 0; wf < 6; wf++) {
        const r = (time * 15 + wf * lambda) % (W * 0.7);
        if (r < 5) continue;
        const alpha = Math.max(0, 0.2 * (1 - r / (W * 0.7)));
        ctx.strokeStyle = 'rgba(15,118,110,' + alpha + ')';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(barrierX, sy, r, -Math.PI / 2, Math.PI / 2);
        ctx.stroke();
      }
      // Source dot
      ctx.fillStyle = WCOLORS.amber;
      ctx.beginPath(); ctx.arc(barrierX, sy, 2, 0, Math.PI * 2); ctx.fill();
    }

    // Composite wavefront envelope (diffracted)
    ctx.strokeStyle = WCOLORS.teal; ctx.lineWidth = 2;
    for (let wf = 0; wf < 4; wf++) {
      const baseR = (time * 15 + wf * lambda) % (W * 0.6);
      if (baseR < 10) continue;
      const alpha = Math.max(0, 0.6 * (1 - baseR / (W * 0.6)));
      ctx.strokeStyle = 'rgba(15,118,110,' + alpha + ')';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let a = -85; a <= 85; a += 2) {
        const rad = a * Math.PI / 180;
        // Envelope: constructive interference pattern
        const sinc = Math.abs(slitWidth) < 1e-10 ? 1 : Math.sin(Math.PI * slitWidth * Math.sin(rad)) / (Math.PI * slitWidth * Math.sin(rad));
        const amp = Math.abs(sinc);
        const r = baseR * (0.3 + 0.7 * amp);
        const px = barrierX + Math.cos(rad) * r;
        const py = slitCY + Math.sin(rad) * r;
        if (a === -85) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();
    }

    // Slider
    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(sliderX, sliderY); ctx.lineTo(sliderX + sliderW, sliderY); ctx.stroke();
    const st = (slitWidth - 0.5) / 7.5;
    ctx.beginPath(); ctx.arc(sliderX + sliderW * st, sliderY, 5, 0, Math.PI * 2);
    ctx.fillStyle = WCOLORS.teal; ctx.fill();
    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 1; ctx.stroke();
    ctx.fillStyle = WCOLORS.text; ctx.font = '11px system-ui'; ctx.textAlign = 'left';
    ctx.fillText('slit width = ' + slitWidth.toFixed(1) + '\u03BB', sliderX + sliderW + 10, sliderY + 4);

    ctx.fillStyle = WCOLORS.text; ctx.font = 'bold 12px system-ui'; ctx.textAlign = 'left';
    ctx.fillText('Huygens Principle', 10, 16);
    ctx.fillStyle = WCOLORS.textDim; ctx.font = '10px system-ui';
    ctx.fillText('Each point in the slit acts as a new source', W * 0.45, 16);

    requestAnimationFrame(tick);
  }

  tick();
}

// =========================================================================
// 13. Diffraction Grating Pattern
// =========================================================================
function initDiffractionGratingPattern() {
  const canvas = document.getElementById('scene-diffraction-grating-pattern');
  if (!canvas) return;
  const setup = wSetupCanvas(canvas);
  if (!setup) return;
  const { ctx, W, H } = setup;

  let N = 5, dOverLambda = 2.0;
  let draggingSlider = null;
  const sliderX = 30, sliderW = W * 0.35;
  const sliders = [
    { y: H - 32, label: 'N', min: 2, max: 50, getVal: function() { return N; }, setVal: function(v) { N = Math.round(v); } },
    { y: H - 14, label: 'd/\u03BB', min: 1, max: 5, getVal: function() { return dOverLambda; }, setVal: function(v) { dOverLambda = v; } }
  ];

  canvas.addEventListener('mousedown', function(e) {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left, my = e.clientY - rect.top;
    for (let i = 0; i < sliders.length; i++) {
      if (Math.abs(my - sliders[i].y) < 10) { draggingSlider = i; handleDrag(mx); break; }
    }
  });
  canvas.addEventListener('mousemove', function(e) { if (draggingSlider === null) return; handleDrag(e.clientX - canvas.getBoundingClientRect().left); });
  canvas.addEventListener('mouseup', function() { draggingSlider = null; });
  canvas.addEventListener('mouseleave', function() { draggingSlider = null; });
  canvas.addEventListener('touchstart', function(e) { e.preventDefault(); const rect = canvas.getBoundingClientRect(); const mx = e.touches[0].clientX - rect.left, my = e.touches[0].clientY - rect.top; for (let i = 0; i < sliders.length; i++) { if (Math.abs(my - sliders[i].y) < 14) { draggingSlider = i; handleDrag(mx); break; } } }, { passive: false });
  canvas.addEventListener('touchmove', function(e) { if (draggingSlider === null) return; e.preventDefault(); handleDrag(e.touches[0].clientX - canvas.getBoundingClientRect().left); }, { passive: false });
  canvas.addEventListener('touchend', function() { draggingSlider = null; });

  function handleDrag(mx) {
    const s = sliders[draggingSlider];
    const t = Math.max(0, Math.min(1, (mx - sliderX) / sliderW));
    s.setVal(s.min + t * (s.max - s.min));
    draw();
  }

  function draw() {
    wClear(ctx, W, H);

    const plotL2 = 50, plotR2 = W - 20, plotT2 = 30, plotB2 = H - 60;
    const pW = plotR2 - plotL2, pH = plotB2 - plotT2;

    // Axes
    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(plotL2, plotT2); ctx.lineTo(plotL2, plotB2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(plotL2, plotB2); ctx.lineTo(plotR2, plotB2); ctx.stroke();

    ctx.fillStyle = WCOLORS.text; ctx.font = '10px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('sin \u03B8', (plotL2 + plotR2) / 2, plotB2 + 14);
    ctx.textAlign = 'right';
    ctx.fillText('I/I\u2080', plotL2 - 5, plotT2 + 5);

    // Tick marks on x-axis
    for (let v = -1; v <= 1; v += 0.5) {
      const px = plotL2 + (v + 1) / 2 * pW;
      ctx.fillStyle = WCOLORS.textDim; ctx.font = '11px system-ui'; ctx.textAlign = 'center';
      ctx.fillText(v.toFixed(1), px, plotB2 + 12);
      ctx.strokeStyle = WCOLORS.grid; ctx.lineWidth = 0.5;
      ctx.beginPath(); ctx.moveTo(px, plotT2); ctx.lineTo(px, plotB2); ctx.stroke();
    }

    // Calculate and plot intensity
    ctx.strokeStyle = WCOLORS.teal; ctx.lineWidth = 2;
    ctx.beginPath();
    let maxI = 0;
    const intensities = [];
    for (let px = 0; px <= pW; px++) {
      const sinTheta = (px / pW) * 2 - 1;
      const psi = 2 * Math.PI * dOverLambda * sinTheta;
      let I;
      if (Math.abs(Math.sin(psi / 2)) < 1e-8) {
        I = 1;
      } else {
        const af = Math.sin(N * psi / 2) / (N * Math.sin(psi / 2));
        I = af * af;
      }
      intensities.push(I);
      if (I > maxI) maxI = I;
    }

    // Normalize and draw
    for (let px = 0; px <= pW; px++) {
      const py = plotB2 - (intensities[px] / Math.max(maxI, 0.01)) * pH * 0.9;
      if (px === 0) ctx.moveTo(plotL2 + px, py); else ctx.lineTo(plotL2 + px, py);
    }
    ctx.stroke();

    // Fill under curve
    ctx.lineTo(plotR2, plotB2);
    ctx.lineTo(plotL2, plotB2);
    ctx.closePath();
    ctx.fillStyle = 'rgba(15,118,110,0.08)';
    ctx.fill();

    // Mark principal maxima
    ctx.fillStyle = WCOLORS.amber; ctx.font = '11px system-ui'; ctx.textAlign = 'center';
    for (let m = -3; m <= 3; m++) {
      const sinTheta = m / dOverLambda;
      if (Math.abs(sinTheta) <= 1) {
        const px = plotL2 + (sinTheta + 1) / 2 * pW;
        ctx.beginPath(); ctx.arc(px, plotB2, 3, 0, Math.PI * 2); ctx.fill();
        ctx.fillText('m=' + m, px, plotT2 - 3);
      }
    }

    // Sliders
    sliders.forEach(function(s, i) {
      ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(sliderX, s.y); ctx.lineTo(sliderX + sliderW, s.y); ctx.stroke();
      const t = (s.getVal() - s.min) / (s.max - s.min);
      ctx.beginPath(); ctx.arc(sliderX + sliderW * t, s.y, 5, 0, Math.PI * 2);
      ctx.fillStyle = WCOLORS.teal; ctx.fill();
      ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 1; ctx.stroke();
      ctx.fillStyle = WCOLORS.text; ctx.font = '10px system-ui'; ctx.textAlign = 'left';
      const valStr = i === 0 ? Math.round(s.getVal()) : s.getVal().toFixed(1);
      ctx.fillText(s.label + ' = ' + valStr, sliderX + sliderW + 10, s.y + 4);
    });

    ctx.fillStyle = WCOLORS.text; ctx.font = 'bold 12px system-ui'; ctx.textAlign = 'left';
    ctx.fillText('Diffraction Grating: N-Slit Pattern', 50, 20);
  }

  draw();
}

// =========================================================================
// 14. Single Slit Diffraction
// =========================================================================
function initSingleSlitDiffraction() {
  const canvas = document.getElementById('scene-single-slit-diffraction');
  if (!canvas) return;
  const setup = wSetupCanvas(canvas);
  if (!setup) return;
  const { ctx, W, H } = setup;

  let aOverLambda = 3.0;
  let draggingSlider = false;
  const sliderX = 20, sliderW = W * 0.35, sliderY = H - 16;

  canvas.addEventListener('mousedown', function(e) {
    const rect = canvas.getBoundingClientRect();
    if (Math.abs(e.clientY - rect.top - sliderY) < 15) { draggingSlider = true; handleDrag(e.clientX - rect.left); }
  });
  canvas.addEventListener('mousemove', function(e) { if (!draggingSlider) return; handleDrag(e.clientX - canvas.getBoundingClientRect().left); });
  canvas.addEventListener('mouseup', function() { draggingSlider = false; });
  canvas.addEventListener('mouseleave', function() { draggingSlider = false; });
  canvas.addEventListener('touchstart', function(e) { e.preventDefault(); const rect = canvas.getBoundingClientRect(); if (Math.abs(e.touches[0].clientY - rect.top - sliderY) < 20) { draggingSlider = true; handleDrag(e.touches[0].clientX - rect.left); } }, { passive: false });
  canvas.addEventListener('touchmove', function(e) { if (!draggingSlider) return; e.preventDefault(); handleDrag(e.touches[0].clientX - canvas.getBoundingClientRect().left); }, { passive: false });
  canvas.addEventListener('touchend', function() { draggingSlider = false; });

  function handleDrag(mx) {
    aOverLambda = 0.5 + Math.max(0, Math.min(1, (mx - sliderX) / sliderW)) * 9.5;
    draw();
  }

  function sinc2(x) {
    if (Math.abs(x) < 1e-8) return 1;
    return Math.pow(Math.sin(x) / x, 2);
  }

  function draw() {
    wClear(ctx, W, H);

    // Slit diagram on left
    const slitX = 60, slitH = H * 0.6;
    const slitOpenH = Math.min(slitH * 0.8, aOverLambda * 10);
    const slitCY = H * 0.42;

    ctx.fillStyle = WCOLORS.axis;
    ctx.fillRect(slitX - 3, 20, 6, slitCY - slitOpenH / 2 - 20);
    ctx.fillRect(slitX - 3, slitCY + slitOpenH / 2, 6, H - 40 - slitCY - slitOpenH / 2);

    // Slit width label
    ctx.strokeStyle = WCOLORS.amber; ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    ctx.beginPath(); ctx.moveTo(slitX + 10, slitCY - slitOpenH / 2); ctx.lineTo(slitX + 10, slitCY + slitOpenH / 2); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = WCOLORS.amber; ctx.font = '10px system-ui'; ctx.textAlign = 'left';
    ctx.fillText('a', slitX + 14, slitCY + 3);

    // Incoming arrows
    ctx.strokeStyle = WCOLORS.teal; ctx.lineWidth = 1;
    for (let y = slitCY - slitOpenH / 2 + 5; y < slitCY + slitOpenH / 2; y += 12) {
      ctx.beginPath(); ctx.moveTo(15, y); ctx.lineTo(slitX - 5, y); ctx.stroke();
      ctx.fillStyle = WCOLORS.teal;
      ctx.beginPath();
      ctx.moveTo(slitX - 5, y);
      ctx.lineTo(slitX - 10, y - 3);
      ctx.lineTo(slitX - 10, y + 3);
      ctx.closePath(); ctx.fill();
    }

    // Pattern plot on right
    const plotL2 = W * 0.3, plotR2 = W - 15, plotT2 = 25, plotB2 = H - 35;
    const pW = plotR2 - plotL2, pH = plotB2 - plotT2;

    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(plotL2, plotT2); ctx.lineTo(plotL2, plotB2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(plotL2, plotB2); ctx.lineTo(plotR2, plotB2); ctx.stroke();

    ctx.fillStyle = WCOLORS.text; ctx.font = '10px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('sin \u03B8', (plotL2 + plotR2) / 2, plotB2 + 13);

    // Plot sinc^2 pattern
    ctx.strokeStyle = WCOLORS.teal; ctx.lineWidth = 2;
    ctx.beginPath();
    for (let px = 0; px <= pW; px++) {
      const sinTheta = (px / pW - 0.5) * 2;
      const beta = Math.PI * aOverLambda * sinTheta;
      const I = sinc2(beta);
      const py = plotB2 - I * pH * 0.9;
      if (px === 0) ctx.moveTo(plotL2 + px, py); else ctx.lineTo(plotL2 + px, py);
    }
    ctx.stroke();

    // Mark first minima
    if (aOverLambda >= 1) {
      const sinMin = 1 / aOverLambda;
      if (sinMin <= 1) {
        const pxPlus = plotL2 + (0.5 + sinMin / 2) * pW;
        const pxMinus = plotL2 + (0.5 - sinMin / 2) * pW;
        ctx.strokeStyle = WCOLORS.red; ctx.lineWidth = 1; ctx.setLineDash([3, 3]);
        ctx.beginPath(); ctx.moveTo(pxPlus, plotT2); ctx.lineTo(pxPlus, plotB2); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(pxMinus, plotT2); ctx.lineTo(pxMinus, plotB2); ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = WCOLORS.red; ctx.font = '11px system-ui'; ctx.textAlign = 'center';
        ctx.fillText('\u03BB/a', pxPlus, plotT2 - 3);
        ctx.fillText('\u2212\u03BB/a', pxMinus, plotT2 - 3);
      }
    }

    // Intensity bar below pattern
    for (let px = 0; px <= pW; px++) {
      const sinTheta = (px / pW - 0.5) * 2;
      const beta = Math.PI * aOverLambda * sinTheta;
      const I = sinc2(beta);
      const bright = Math.round(I * 255);
      ctx.fillStyle = 'rgb(' + bright + ',' + bright + ',' + bright + ')';
      ctx.fillRect(plotL2 + px, plotB2 + 2, 1, 8);
    }

    // Slider
    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(sliderX, sliderY); ctx.lineTo(sliderX + sliderW, sliderY); ctx.stroke();
    const st = (aOverLambda - 0.5) / 9.5;
    ctx.beginPath(); ctx.arc(sliderX + sliderW * st, sliderY, 5, 0, Math.PI * 2);
    ctx.fillStyle = WCOLORS.teal; ctx.fill();
    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 1; ctx.stroke();
    ctx.fillStyle = WCOLORS.text; ctx.font = '11px system-ui'; ctx.textAlign = 'left';
    ctx.fillText('a/\u03BB = ' + aOverLambda.toFixed(1), sliderX + sliderW + 10, sliderY + 4);

    ctx.fillStyle = WCOLORS.text; ctx.font = 'bold 12px system-ui'; ctx.textAlign = 'left';
    ctx.fillText('Single Slit Diffraction', 10, 16);
  }

  draw();
}

// =========================================================================
// 15. Fourier Optics Demo
// =========================================================================
function initFourierOpticsDemo() {
  const canvas = document.getElementById('scene-fourier-optics-demo');
  if (!canvas) return;
  const setup = wSetupCanvas(canvas);
  if (!setup) return;
  const { ctx, W, H } = setup;

  let apertureType = 0; // 0=single, 1=double, 2=grating
  const types = ['Single Slit', 'Double Slit', 'Grating (5 slits)'];

  canvas.addEventListener('click', function(e) {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left, my = e.clientY - rect.top;
    // Check button area
    if (my > H - 30 && my < H - 5) {
      for (let i = 0; i < 3; i++) {
        const bx = 20 + i * (W / 3);
        if (mx > bx && mx < bx + W / 3 - 10) {
          apertureType = i;
          draw();
          break;
        }
      }
    }
  });

  function draw() {
    wClear(ctx, W, H);

    const apL = 30, apR = W * 0.4, apT = 30, apB = H - 45;
    const apW2 = apR - apL, apH = apB - apT;
    const patL = W * 0.55, patR = W - 15, patT = 30, patB = H - 45;
    const patW2 = patR - patL, patH = patB - patT;

    // Aperture function
    function aperture(y) {
      const yNorm = (y - 0.5) * 10; // -5 to 5
      if (apertureType === 0) {
        return Math.abs(yNorm) < 1 ? 1 : 0;
      } else if (apertureType === 1) {
        return (Math.abs(yNorm - 1.5) < 0.4 || Math.abs(yNorm + 1.5) < 0.4) ? 1 : 0;
      } else {
        for (let n = -2; n <= 2; n++) {
          if (Math.abs(yNorm - n * 1.5) < 0.25) return 1;
        }
        return 0;
      }
    }

    // Draw aperture
    ctx.fillStyle = WCOLORS.text; ctx.font = 'bold 11px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('Aperture', (apL + apR) / 2, apT - 8);

    for (let py = 0; py < apH; py++) {
      const y = py / apH;
      const a = aperture(y);
      if (a > 0) {
        ctx.fillStyle = WCOLORS.teal;
      } else {
        ctx.fillStyle = '#d4c9b8';
      }
      ctx.fillRect(apL, apT + py, apW2, 1);
    }
    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 1;
    ctx.strokeRect(apL, apT, apW2, apH);

    // Compute diffraction pattern (|FT|^2)
    ctx.fillStyle = WCOLORS.text; ctx.font = 'bold 11px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('|FT|\u00B2 Pattern', (patL + patR) / 2, patT - 8);

    // Numerical DFT
    const nPts = 256;
    const pattern = [];
    let maxP = 0;
    for (let k = 0; k < nPts; k++) {
      let reSum = 0, imSum = 0;
      for (let n = 0; n < nPts; n++) {
        const a = aperture(n / nPts);
        const phase = -2 * Math.PI * (k - nPts / 2) * n / nPts;
        reSum += a * Math.cos(phase);
        imSum += a * Math.sin(phase);
      }
      const I = (reSum * reSum + imSum * imSum) / (nPts * nPts);
      pattern.push(I);
      if (I > maxP) maxP = I;
    }

    // Draw pattern as image
    for (let py = 0; py < patH; py++) {
      const k = Math.floor(py / patH * nPts);
      const I = pattern[k] / Math.max(maxP, 0.001);
      const bright = Math.round(I * 255);
      ctx.fillStyle = 'rgb(' + bright + ',' + bright + ',' + bright + ')';
      ctx.fillRect(patL, patT + py, patW2, 1);
    }
    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 1;
    ctx.strokeRect(patL, patT, patW2, patH);

    // Also draw 1D plot overlay
    ctx.strokeStyle = WCOLORS.amber; ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (let py = 0; py < patH; py++) {
      const k = Math.floor(py / patH * nPts);
      const I = pattern[k] / Math.max(maxP, 0.001);
      const px = patL + I * patW2 * 0.8;
      if (py === 0) ctx.moveTo(px, patT + py); else ctx.lineTo(px, patT + py);
    }
    ctx.stroke();

    // Arrow between
    ctx.strokeStyle = WCOLORS.amber; ctx.lineWidth = 2;
    const arrowY = (apT + apB) / 2;
    ctx.beginPath(); ctx.moveTo(apR + 10, arrowY); ctx.lineTo(patL - 10, arrowY); ctx.stroke();
    ctx.fillStyle = WCOLORS.amber;
    ctx.beginPath();
    ctx.moveTo(patL - 10, arrowY);
    ctx.lineTo(patL - 18, arrowY - 5);
    ctx.lineTo(patL - 18, arrowY + 5);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = WCOLORS.amber; ctx.font = '10px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('FT', (apR + patL) / 2, arrowY - 8);

    // Buttons
    for (let i = 0; i < 3; i++) {
      const bx = 20 + i * (W / 3);
      const bw = W / 3 - 15;
      const active = apertureType === i;
      ctx.fillStyle = active ? WCOLORS.teal : '#e5e0d6';
      ctx.beginPath();
      var br = 4, bx2 = bx, by2 = H - 28, bw2 = bw, bh2 = 22;
      ctx.moveTo(bx2 + br, by2);
      ctx.arcTo(bx2 + bw2, by2, bx2 + bw2, by2 + bh2, br);
      ctx.arcTo(bx2 + bw2, by2 + bh2, bx2, by2 + bh2, br);
      ctx.arcTo(bx2, by2 + bh2, bx2, by2, br);
      ctx.arcTo(bx2, by2, bx2 + bw2, by2, br);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = active ? '#fff' : WCOLORS.text;
      ctx.font = '10px system-ui'; ctx.textAlign = 'center';
      ctx.fillText(types[i], bx + bw / 2, H - 13);
    }

    ctx.fillStyle = WCOLORS.text; ctx.font = 'bold 12px system-ui'; ctx.textAlign = 'left';
    ctx.fillText('Fourier Optics', 10, 18);
  }

  draw();
}

// =========================================================================
// CHAPTER 20 - QUANTUM MECHANICS
// =========================================================================

// =========================================================================
// 16. Photoelectric Effect
// =========================================================================
function initPhotoelectricEffectDemo() {
  const canvas = document.getElementById('scene-photoelectric-effect-demo');
  if (!canvas) return;
  const setup = wSetupCanvas(canvas);
  if (!setup) return;
  const { ctx, W, H } = setup;

  let frequency = 8e14; // Hz
  let draggingSlider = false;
  let particles = [];
  let time = 0;
  const sliderX = 20, sliderW = W * 0.5, sliderY = H - 16;
  const phi = 4.2; // work function in eV (like aluminum)
  const h = 6.626e-34;
  const eV = 1.602e-19;

  canvas.addEventListener('mousedown', function(e) {
    const rect = canvas.getBoundingClientRect();
    if (Math.abs(e.clientY - rect.top - sliderY) < 15) { draggingSlider = true; handleDrag(e.clientX - rect.left); }
  });
  canvas.addEventListener('mousemove', function(e) { if (!draggingSlider) return; handleDrag(e.clientX - canvas.getBoundingClientRect().left); });
  canvas.addEventListener('mouseup', function() { draggingSlider = false; });
  canvas.addEventListener('mouseleave', function() { draggingSlider = false; });
  canvas.addEventListener('touchstart', function(e) { e.preventDefault(); const rect = canvas.getBoundingClientRect(); if (Math.abs(e.touches[0].clientY - rect.top - sliderY) < 20) { draggingSlider = true; handleDrag(e.touches[0].clientX - rect.left); } }, { passive: false });
  canvas.addEventListener('touchmove', function(e) { if (!draggingSlider) return; e.preventDefault(); handleDrag(e.touches[0].clientX - canvas.getBoundingClientRect().left); }, { passive: false });
  canvas.addEventListener('touchend', function() { draggingSlider = false; });

  function handleDrag(mx) {
    const t = Math.max(0, Math.min(1, (mx - sliderX) / sliderW));
    frequency = 3e14 + t * 17e14;
  }

  function tick() {
    if (!canvas.isConnected) return;
    time += 0.03;
    wClear(ctx, W, H);

    const photonEnergy = h * frequency / eV; // in eV
    const KE = Math.max(0, photonEnergy - phi);
    const aboveThreshold = photonEnergy > phi;

    // Metal surface
    const metalX = 20, metalY = 50, metalW = W * 0.3, metalH = H * 0.5;
    ctx.fillStyle = '#9ca3af';
    ctx.fillRect(metalX, metalY, metalW, metalH);
    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 1;
    ctx.strokeRect(metalX, metalY, metalW, metalH);
    ctx.fillStyle = WCOLORS.text; ctx.font = '10px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('Metal surface', metalX + metalW / 2, metalY + metalH + 14);
    ctx.fillText('\u03C6 = ' + phi.toFixed(1) + ' eV', metalX + metalW / 2, metalY + metalH + 26);

    // Light beam (photons hitting surface)
    const wl = 3e8 / frequency * 1e9; // nm
    const lightColor = (wl >= 380 && wl <= 780) ? wavelengthToCSS(wl) : (wl < 380 ? '#7c3aed' : '#dc2626');

    // Incoming photon arrows
    for (let i = 0; i < 4; i++) {
      const py = metalY + 15 + i * (metalH - 30) / 3;
      const phase = (time * 3 + i) % 1;
      const px = metalX + metalW + 10 + (1 - phase) * 80;
      ctx.strokeStyle = lightColor; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(px + 15, py - 8); ctx.lineTo(px, py); ctx.lineTo(px + 15, py + 8); ctx.stroke();
      // Wavy line
      ctx.beginPath();
      for (let dx = 0; dx < 40; dx += 2) {
        const waveY = py + Math.sin(dx * 0.5 + time * 10) * 3;
        if (dx === 0) ctx.moveTo(px + 15 + dx, waveY); else ctx.lineTo(px + 15 + dx, waveY);
      }
      ctx.stroke();
    }

    // Ejected electrons
    if (aboveThreshold) {
      if (Math.random() < 0.1) {
        particles.push({
          x: metalX + Math.random() * metalW * 0.8,
          y: metalY + Math.random() * metalH,
          vx: -2 - Math.random() * KE * 2,
          vy: (Math.random() - 0.5) * 3,
          life: 1.0
        });
      }
    }
    if (particles.length > 500) {
      particles = particles.slice(particles.length - 500);
    }
    particles.forEach(function(p) {
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 0.015;
    });
    particles = particles.filter(function(p) { return p.life > 0 && p.x > -10; });

    particles.forEach(function(p) {
      ctx.fillStyle = 'rgba(37,99,235,' + p.life + ')';
      ctx.beginPath(); ctx.arc(p.x, p.y, 3, 0, Math.PI * 2); ctx.fill();
    });

    // Status text
    if (aboveThreshold) {
      ctx.fillStyle = WCOLORS.teal; ctx.font = 'bold 11px system-ui'; ctx.textAlign = 'left';
      ctx.fillText('Electrons ejected!', metalX, metalY - 8);
      ctx.fillText('KE = ' + KE.toFixed(2) + ' eV', metalX, metalY - 22);
    } else {
      ctx.fillStyle = WCOLORS.red; ctx.font = 'bold 11px system-ui'; ctx.textAlign = 'left';
      ctx.fillText('Below threshold \u2014 no emission', metalX, metalY - 8);
    }

    // KE vs frequency plot
    const plotL2 = W * 0.58, plotR2 = W - 15, plotT2 = 25, plotB2 = H * 0.6;
    const pW = plotR2 - plotL2, pH = plotB2 - plotT2;

    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(plotL2, plotT2); ctx.lineTo(plotL2, plotB2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(plotL2, plotB2); ctx.lineTo(plotR2, plotB2); ctx.stroke();

    ctx.fillStyle = WCOLORS.text; ctx.font = '11px system-ui';
    ctx.textAlign = 'center'; ctx.fillText('frequency (10\u00B9\u2074 Hz)', (plotL2 + plotR2) / 2, plotB2 + 13);
    ctx.textAlign = 'right'; ctx.fillText('KE (eV)', plotL2 - 3, plotT2 + 5);

    // Plot line: KE = hf - phi (only for f > threshold)
    const fThreshold = phi * eV / h;
    const fMax = 20e14;
    const keMax = h * fMax / eV - phi;

    // Threshold line
    const threshPx = plotL2 + (fThreshold / fMax) * pW;
    ctx.strokeStyle = WCOLORS.red; ctx.lineWidth = 1; ctx.setLineDash([3, 3]);
    ctx.beginPath(); ctx.moveTo(threshPx, plotT2); ctx.lineTo(threshPx, plotB2); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = WCOLORS.red; ctx.font = '10px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('f\u2080', threshPx, plotB2 + 22);

    // KE line
    ctx.strokeStyle = WCOLORS.teal; ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(plotL2, plotB2);
    ctx.lineTo(threshPx, plotB2);
    for (let f = fThreshold; f <= fMax; f += fMax / 100) {
      const ke = h * f / eV - phi;
      const px = plotL2 + (f / fMax) * pW;
      const py = plotB2 - (ke / keMax) * pH * 0.85;
      ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Current frequency marker
    const curPx = plotL2 + (frequency / fMax) * pW;
    const curKE2 = Math.max(0, h * frequency / eV - phi);
    const curPy = plotB2 - (curKE2 / keMax) * pH * 0.85;
    ctx.beginPath(); ctx.arc(curPx, aboveThreshold ? curPy : plotB2, 5, 0, Math.PI * 2);
    ctx.fillStyle = lightColor; ctx.fill();
    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 1; ctx.stroke();

    // Formula
    ctx.fillStyle = WCOLORS.text; ctx.font = '11px system-ui'; ctx.textAlign = 'left';
    ctx.fillText('KE = hf \u2212 \u03C6', plotL2, plotT2 - 5);

    // Slider
    for (let i = 0; i < sliderW; i++) {
      const f = 3e14 + (i / sliderW) * 17e14;
      const wl2 = 3e8 / f * 1e9;
      ctx.fillStyle = (wl2 >= 380 && wl2 <= 780) ? wavelengthToCSS(wl2) : (wl2 < 380 ? '#7c3aed' : '#991b1b');
      ctx.fillRect(sliderX + i, sliderY - 3, 1, 6);
    }
    const st = (frequency - 3e14) / 17e14;
    ctx.beginPath(); ctx.arc(sliderX + sliderW * st, sliderY, 6, 0, Math.PI * 2);
    ctx.fillStyle = lightColor; ctx.fill();
    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.fillStyle = WCOLORS.text; ctx.font = '10px system-ui'; ctx.textAlign = 'left';
    ctx.fillText('f = ' + (frequency / 1e14).toFixed(1) + '\u00D710\u00B9\u2074 Hz  (\u03BB=' + Math.round(3e8/frequency*1e9) + 'nm)', sliderX + sliderW + 10, sliderY + 4);

    ctx.fillStyle = WCOLORS.text; ctx.font = 'bold 12px system-ui'; ctx.textAlign = 'left';
    ctx.fillText('Photoelectric Effect', 10, 18);

    requestAnimationFrame(tick);
  }

  tick();
}

// =========================================================================
// 17. Double Slit Photon Buildup
// =========================================================================
function initDoubleSlitPhotonBuildup() {
  const canvas = document.getElementById('scene-double-slit-photon-buildup');
  if (!canvas) return;
  const setup = wSetupCanvas(canvas);
  if (!setup) return;
  const { ctx, W, H } = setup;

  // --- Layout geometry ---
  const laserX = 30;
  const barrierX = W * 0.28;
  const screenX = W * 0.68;
  const histX = screenX + 14;
  const histW = W - histX - 10;
  const regionT = 35, regionB = H - 50;
  const regionH = regionB - regionT;
  const midY = regionT + regionH / 2;

  // Slit geometry (pixels)
  const slitSep = regionH * 0.22;
  const slitHalfW = regionH * 0.035;
  const slit1Y = midY - slitSep / 2;
  const slit2Y = midY + slitSep / 2;
  const barrierW = 6;

  // --- Double slit probability ---
  const dParam = 5, aParam = 1.5;
  function prob(yNorm) {
    var t = (yNorm - 0.5) * 20;
    var sincArg = Math.PI * aParam * t;
    var cosArg = Math.PI * dParam * t;
    var env = Math.abs(sincArg) < 1e-6 ? 1 : Math.pow(Math.sin(sincArg) / sincArg, 2);
    return env * Math.pow(Math.cos(cosArg), 2);
  }

  // Build CDF for importance sampling
  var nBins = 500;
  var cdf = [0];
  for (var i = 1; i <= nBins; i++) cdf.push(cdf[i - 1] + prob(i / nBins));
  var cdfTotal = cdf[nBins];
  for (var i = 0; i <= nBins; i++) cdf[i] /= cdfTotal;

  function sampleY() {
    var u = Math.random(), lo = 0, hi = nBins;
    while (lo < hi) { var m = (lo + hi) >> 1; if (cdf[m] < u) lo = m + 1; else hi = m; }
    return lo / nBins;
  }

  // --- State ---
  var detectedDots = [];
  var flyingPhotons = [];
  var speed = 3;
  var frameCount = 0;
  var draggingSlider = false;
  var sliderX2 = 20, sliderW2 = W * 0.22, sliderY2 = H - 20;

  function emitPhoton() {
    var targetYNorm = sampleY();
    var targetYpx = regionT + targetYNorm * regionH;
    var d1 = Math.abs(targetYpx - slit1Y);
    var d2 = Math.abs(targetYpx - slit2Y);
    var goSlit1 = Math.random() < d2 / (d1 + d2 + 0.01);
    var slitY = goSlit1 ? slit1Y : slit2Y;
    var slitOffset = (Math.random() - 0.5) * slitHalfW * 1.6;
    flyingPhotons.push({
      x: laserX + 20, y: midY + (Math.random() - 0.5) * 2,
      slitY: slitY + slitOffset, targetY: targetYpx,
      targetYNorm: targetYNorm, stage: 0, life: 0,
      glow: 0.7 + Math.random() * 0.3
    });
  }

  function updatePhoton(p) {
    p.life++;
    var spd = 4.5;
    if (p.stage === 0) {
      var dx = barrierX - p.x, dy = p.slitY - p.y;
      var dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < spd + 1) { p.x = barrierX + barrierW / 2 + 1; p.y = p.slitY; p.stage = 1; }
      else { p.x += (dx / dist) * spd; p.y += (dy / dist) * spd; }
    } else if (p.stage === 1) {
      var dx = screenX - p.x, dy = p.targetY - p.y;
      var dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < spd + 1) { p.stage = 2; detectedDots.push({ y: p.targetYNorm }); }
      else { p.x += (dx / dist) * spd; p.y += (dy / dist) * spd; }
    }
  }

  // --- Events ---
  canvas.addEventListener('mousedown', function(e) {
    var rect = canvas.getBoundingClientRect();
    var mx = e.clientX - rect.left, my = e.clientY - rect.top;
    if (Math.abs(my - sliderY2) < 15 && mx >= sliderX2 && mx <= sliderX2 + sliderW2 + 10) {
      draggingSlider = true; handleDrag(mx);
    }
  });
  canvas.addEventListener('mousemove', function(e) {
    if (!draggingSlider) return;
    handleDrag(e.clientX - canvas.getBoundingClientRect().left);
  });
  canvas.addEventListener('mouseup', function() { draggingSlider = false; });
  canvas.addEventListener('mouseleave', function() { draggingSlider = false; });
  canvas.addEventListener('touchstart', function(e) {
    e.preventDefault(); var rect = canvas.getBoundingClientRect();
    var mx = e.touches[0].clientX - rect.left, my = e.touches[0].clientY - rect.top;
    if (Math.abs(my - sliderY2) < 20) { draggingSlider = true; handleDrag(mx); }
  }, { passive: false });
  canvas.addEventListener('touchmove', function(e) {
    if (!draggingSlider) return; e.preventDefault();
    handleDrag(e.touches[0].clientX - canvas.getBoundingClientRect().left);
  }, { passive: false });
  canvas.addEventListener('touchend', function() { draggingSlider = false; });

  function handleDrag(mx) {
    speed = Math.round(1 + Math.max(0, Math.min(1, (mx - sliderX2) / sliderW2)) * 14);
  }

  var resetBtnX = W - 68, resetBtnY = H - 36, resetBtnW = 60, resetBtnH = 22;
  canvas.addEventListener('click', function(e) {
    var rect = canvas.getBoundingClientRect();
    var mx = e.clientX - rect.left, my = e.clientY - rect.top;
    if (mx > resetBtnX && mx < resetBtnX + resetBtnW && my > resetBtnY && my < resetBtnY + resetBtnH) {
      detectedDots = []; flyingPhotons = [];
    }
  });

  // --- Drawing ---

  function drawLaser() {
    var lx = laserX - 8, ly = midY - 14, lw = 30, lh = 28;
    var grad = ctx.createLinearGradient(lx, ly, lx, ly + lh);
    grad.addColorStop(0, '#555'); grad.addColorStop(0.5, '#888'); grad.addColorStop(1, '#444');
    ctx.fillStyle = grad;
    ctx.beginPath(); ctx.roundRect(lx, ly, lw, lh, 3); ctx.fill();
    ctx.strokeStyle = '#333'; ctx.lineWidth = 1; ctx.stroke();
    ctx.fillStyle = '#222'; ctx.fillRect(laserX + 18, midY - 6, 5, 12);
    var glowGrad = ctx.createRadialGradient(laserX + 22, midY, 0, laserX + 22, midY, 12);
    glowGrad.addColorStop(0, 'rgba(15,200,150,0.3)'); glowGrad.addColorStop(1, 'rgba(15,200,150,0)');
    ctx.fillStyle = glowGrad;
    ctx.beginPath(); ctx.arc(laserX + 22, midY, 12, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = WCOLORS.textDim; ctx.font = '9px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('LASER', laserX + 8, midY + 26);
  }

  function drawBarrier() {
    ctx.fillStyle = '#2a2a2e';
    ctx.fillRect(barrierX - barrierW / 2, regionT - 5, barrierW, slit1Y - slitHalfW - regionT + 5);
    ctx.fillRect(barrierX - barrierW / 2, slit1Y + slitHalfW, barrierW, (slit2Y - slitHalfW) - (slit1Y + slitHalfW));
    ctx.fillRect(barrierX - barrierW / 2, slit2Y + slitHalfW, barrierW, regionB + 5 - slit2Y - slitHalfW);
    // 3D edges
    ctx.fillStyle = 'rgba(255,255,255,0.12)';
    ctx.fillRect(barrierX - barrierW / 2, regionT - 5, 1, regionB - regionT + 10);
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.fillRect(barrierX + barrierW / 2 - 1, regionT - 5, 1, regionB - regionT + 10);
    // Slit glow
    for (var s = 0; s < 2; s++) {
      var sy = s === 0 ? slit1Y : slit2Y;
      var glowG = ctx.createRadialGradient(barrierX, sy, 0, barrierX, sy, slitHalfW * 3);
      glowG.addColorStop(0, 'rgba(15,200,180,0.15)'); glowG.addColorStop(1, 'rgba(15,200,180,0)');
      ctx.fillStyle = glowG;
      ctx.fillRect(barrierX - barrierW * 2, sy - slitHalfW * 3, barrierW * 4, slitHalfW * 6);
      ctx.fillStyle = 'rgba(200,240,230,0.5)';
      ctx.fillRect(barrierX - barrierW / 2, sy - slitHalfW, barrierW, slitHalfW * 2);
    }
    ctx.fillStyle = WCOLORS.textDim; ctx.font = '9px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('BARRIER', barrierX, regionB + 18);
  }

  function drawScreen() {
    var sGrad = ctx.createLinearGradient(screenX - 3, 0, screenX + 3, 0);
    sGrad.addColorStop(0, 'rgba(100,120,110,0.15)');
    sGrad.addColorStop(0.5, 'rgba(200,220,210,0.1)');
    sGrad.addColorStop(1, 'rgba(100,120,110,0.15)');
    ctx.fillStyle = sGrad;
    ctx.fillRect(screenX - 3, regionT - 2, 6, regionH + 4);
    ctx.strokeStyle = 'rgba(31,42,46,0.3)'; ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(screenX - 3, regionT - 2); ctx.lineTo(screenX - 3, regionB + 2);
    ctx.moveTo(screenX + 3, regionT - 2); ctx.lineTo(screenX + 3, regionB + 2);
    ctx.stroke();

    var maxDots = 20000;
    if (detectedDots.length > maxDots) detectedDots = detectedDots.slice(detectedDots.length - maxDots);
    for (var i = 0; i < detectedDots.length; i++) {
      var py = regionT + detectedDots[i].y * regionH;
      var age = detectedDots.length - i;
      var alpha = age < 10 ? 1.0 : 0.7;
      var radius = age < 5 ? 2.0 : 1.2;
      if (age < 5) {
        ctx.fillStyle = 'rgba(15,220,180,' + (alpha * 0.5) + ')';
        ctx.beginPath(); ctx.arc(screenX, py, radius + 2, 0, Math.PI * 2); ctx.fill();
      }
      ctx.fillStyle = 'rgba(15,118,110,' + alpha + ')';
      ctx.beginPath(); ctx.arc(screenX, py, radius, 0, Math.PI * 2); ctx.fill();
    }
    ctx.fillStyle = WCOLORS.textDim; ctx.font = '9px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('DETECTOR', screenX, regionB + 18);
  }

  function drawHistogram() {
    if (detectedDots.length === 0) return;
    var nH = 80, bins = new Array(nH).fill(0);
    for (var i = 0; i < detectedDots.length; i++) {
      var bin = Math.min(nH - 1, Math.floor(detectedDots[i].y * nH));
      bins[bin]++;
    }
    var maxBin = Math.max(1, Math.max.apply(null, bins));
    for (var i = 0; i < nH; i++) {
      var bh = (bins[i] / maxBin) * histW;
      var by = regionT + (i / nH) * regionH;
      var binH = regionH / nH;
      var intensity = bins[i] / maxBin;
      var g = Math.round(118 + intensity * 100);
      var b = Math.round(110 + intensity * 70);
      ctx.fillStyle = 'rgba(15,' + g + ',' + b + ',' + (0.15 + intensity * 0.5) + ')';
      ctx.fillRect(histX, by, bh, binH - 0.5);
    }
    // Theoretical envelope
    ctx.strokeStyle = 'rgba(15,118,110,0.4)'; ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    for (var i = 0; i <= nH; i++) {
      var yN = i / nH, p = prob(yN);
      var px = histX + p * histW, py = regionT + yN * regionH;
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.stroke(); ctx.setLineDash([]);
  }

  function drawFlyingPhotons() {
    for (var i = 0; i < flyingPhotons.length; i++) {
      var p = flyingPhotons[i];
      var glowR = 5 + p.glow * 3;
      var glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowR);
      glow.addColorStop(0, 'rgba(15,230,180,' + (0.6 * p.glow) + ')');
      glow.addColorStop(0.4, 'rgba(15,180,150,' + (0.2 * p.glow) + ')');
      glow.addColorStop(1, 'rgba(15,180,150,0)');
      ctx.fillStyle = glow;
      ctx.beginPath(); ctx.arc(p.x, p.y, glowR, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = 'rgba(180,255,240,' + (0.9 * p.glow) + ')';
      ctx.beginPath(); ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2); ctx.fill();
    }
  }

  function drawBeamPath() {
    var beamGrad = ctx.createLinearGradient(laserX + 22, 0, barrierX - barrierW / 2, 0);
    beamGrad.addColorStop(0, 'rgba(15,200,170,0.08)'); beamGrad.addColorStop(1, 'rgba(15,200,170,0.02)');
    ctx.fillStyle = beamGrad;
    ctx.fillRect(laserX + 22, midY - 3, barrierX - barrierW / 2 - laserX - 22, 6);
    for (var s = 0; s < 2; s++) {
      var sy = s === 0 ? slit1Y : slit2Y;
      ctx.fillStyle = 'rgba(15,200,170,0.015)';
      ctx.beginPath();
      ctx.moveTo(barrierX + barrierW / 2, sy - slitHalfW);
      ctx.lineTo(barrierX + barrierW / 2, sy + slitHalfW);
      ctx.lineTo(screenX, regionB); ctx.lineTo(screenX, regionT);
      ctx.closePath(); ctx.fill();
    }
  }

  function drawLabels() {
    ctx.fillStyle = WCOLORS.text; ctx.font = 'bold 12px system-ui'; ctx.textAlign = 'left';
    ctx.fillText('Double-Slit Experiment: Photon-by-Photon', 10, 18);
    ctx.font = '11px system-ui'; ctx.fillStyle = WCOLORS.teal; ctx.textAlign = 'left';
    ctx.fillText('Detected: ' + detectedDots.length, screenX - 40, regionT - 10);
    // Slit separation annotation
    ctx.strokeStyle = 'rgba(31,42,46,0.25)'; ctx.lineWidth = 0.5;
    var annX2 = barrierX + barrierW / 2 + 8;
    ctx.beginPath(); ctx.moveTo(annX2, slit1Y); ctx.lineTo(annX2, slit2Y); ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(annX2 - 2, slit1Y); ctx.lineTo(annX2 + 2, slit1Y);
    ctx.moveTo(annX2 - 2, slit2Y); ctx.lineTo(annX2 + 2, slit2Y);
    ctx.stroke();
    ctx.fillStyle = WCOLORS.textDim; ctx.font = '9px system-ui'; ctx.textAlign = 'left';
    ctx.fillText('d', annX2 + 3, midY + 3);
  }

  function drawControls() {
    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(sliderX2, sliderY2); ctx.lineTo(sliderX2 + sliderW2, sliderY2); ctx.stroke();
    var st = (speed - 1) / 14;
    ctx.beginPath(); ctx.arc(sliderX2 + sliderW2 * st, sliderY2, 5, 0, Math.PI * 2);
    ctx.fillStyle = WCOLORS.teal; ctx.fill();
    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 1; ctx.stroke();
    ctx.fillStyle = WCOLORS.text; ctx.font = '10px system-ui'; ctx.textAlign = 'left';
    ctx.fillText('Rate: ' + speed + ' photons/frame', sliderX2 + sliderW2 + 10, sliderY2 + 4);
    ctx.fillStyle = WCOLORS.red;
    ctx.beginPath(); ctx.roundRect(resetBtnX, resetBtnY, resetBtnW, resetBtnH, 4); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.font = '10px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('Reset', resetBtnX + resetBtnW / 2, resetBtnY + 15);
  }

  // --- Main loop ---
  function tick() {
    if (!canvas.isConnected) return;
    frameCount++;
    for (var i = 0; i < speed; i++) emitPhoton();
    for (var i = flyingPhotons.length - 1; i >= 0; i--) {
      updatePhoton(flyingPhotons[i]);
      if (flyingPhotons[i].stage === 2) flyingPhotons.splice(i, 1);
    }
    if (flyingPhotons.length > 200) flyingPhotons = flyingPhotons.slice(flyingPhotons.length - 200);
    wClear(ctx, W, H);
    drawBeamPath(); drawLaser(); drawBarrier(); drawScreen();
    drawHistogram(); drawFlyingPhotons(); drawLabels(); drawControls();
    requestAnimationFrame(tick);
  }

  tick();
}


// =========================================================================
// 18. Hydrogen Energy Levels
// =========================================================================
function initHydrogenEnergyLevels() {
  const canvas = document.getElementById('scene-hydrogen-energy-levels');
  if (!canvas) return;
  const setup = wSetupCanvas(canvas);
  if (!setup) return;
  const { ctx, W, H } = setup;

  // Layout: energy diagram left, vertical spectrum strip right
  const plotL = 80, plotR = W * 0.62, plotT = 45, plotB = H - 55;
  const pH = plotB - plotT;
  const specL = W * 0.70, specR = W - 20, specT = plotT, specB = plotB;

  function energy(n) { return -13.6 / (n * n); }

  function wavelengthFromTransition(nFrom, nTo) {
    const dE = Math.abs(energy(nFrom) - energy(nTo));
    return Math.round(1240 / dE);
  }

  const seriesData = {
    lyman:    { to: 1, label: 'Lyman', names: ['L\u03B1','L\u03B2','L\u03B3','L\u03B4'], region: 'UV' },
    balmer:   { to: 2, label: 'Balmer', names: ['H\u03B1','H\u03B2','H\u03B3','H\u03B4'], region: 'visible' },
    paschen:  { to: 3, label: 'Paschen', names: ['P\u03B1','P\u03B2','P\u03B3','P\u03B4'], region: 'IR' },
    brackett: { to: 4, label: 'Brackett', names: ['Br\u03B1','Br\u03B2','Br\u03B3','Br\u03B4'], region: 'IR' },
  };

  const seriesSelect = document.getElementById('hel-series');

  function getTransitions() {
    const key = seriesSelect ? seriesSelect.value : 'balmer';
    const s = seriesData[key];
    const trans = [];
    for (let i = 0; i < 4; i++) {
      const from = s.to + 1 + i;
      if (from > 7) break;
      trans.push({ from, to: s.to, name: s.names[i], wl: wavelengthFromTransition(from, s.to) });
    }
    return { transitions: trans, series: s, key };
  }

  // Sqrt-compressed scale so upper levels (n=2..7) aren't jammed together
  function energyToY(E) {
    var t = (E + 13.6) / 13.6; // 0 at ground, 1 at ionization
    t = Math.sqrt(t);
    return plotB - t * pH;
  }

  function draw() {
    wClear(ctx, W, H);
    const { transitions, series } = getTransitions();

    // Title
    ctx.fillStyle = WCOLORS.text; ctx.font = 'bold 14px system-ui'; ctx.textAlign = 'left';
    ctx.fillText('Hydrogen Energy Levels \u2014 ' + series.label + ' Series', 15, 28);

    // Energy axis line
    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(plotL - 5, plotT - 5); ctx.lineTo(plotL - 5, plotB + 5); ctx.stroke();

    // Rotated axis label
    ctx.save();
    ctx.translate(14, (plotT + plotB) / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = WCOLORS.textDim; ctx.font = '12px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('Energy (eV)', 0, 0);
    ctx.restore();

    // Grid ticks
    ctx.fillStyle = WCOLORS.textDim; ctx.font = '11px system-ui'; ctx.textAlign = 'right';
    [-14, -12, -10, -8, -6, -4, -2, 0].forEach(function(e) {
      var y = energyToY(e);
      ctx.fillText(e + '', plotL - 12, y + 4);
      ctx.strokeStyle = WCOLORS.grid; ctx.lineWidth = 0.4;
      ctx.beginPath(); ctx.moveTo(plotL - 5, y); ctx.lineTo(plotR, y); ctx.stroke();
    });

    // Energy levels n=1..7
    var maxN = Math.max(5, transitions[transitions.length - 1].from);
    for (var n = 1; n <= Math.min(maxN, 7); n++) {
      var E = energy(n);
      var y = energyToY(E);

      ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(plotL, y); ctx.lineTo(plotR, y); ctx.stroke();

      ctx.fillStyle = WCOLORS.text; ctx.font = '13px system-ui'; ctx.textAlign = 'right';
      ctx.fillText('n = ' + n, plotL - 12, y - 7);

      ctx.fillStyle = WCOLORS.textDim; ctx.font = '12px system-ui'; ctx.textAlign = 'left';
      ctx.fillText(E.toFixed(2) + ' eV', plotR + 6, y + 4);
    }

    // Ionization level
    var yInf = energyToY(0);
    ctx.strokeStyle = WCOLORS.textDim; ctx.lineWidth = 1; ctx.setLineDash([5, 5]);
    ctx.beginPath(); ctx.moveTo(plotL, yInf); ctx.lineTo(plotR, yInf); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = WCOLORS.textDim; ctx.font = '12px system-ui'; ctx.textAlign = 'left';
    ctx.fillText('n = \u221E  (0 eV)', plotR + 6, yInf + 4);

    // Transition arrows
    var arrowZone = plotR - plotL;
    var arrowStart = plotL + arrowZone * 0.25;
    var arrowSpacing = arrowZone * 0.14;

    transitions.forEach(function(trans, i) {
      var yFrom = energyToY(energy(trans.from));
      var yTo = energyToY(energy(trans.to));
      var x = arrowStart + i * arrowSpacing;
      var color = (trans.wl >= 380 && trans.wl <= 780) ? wavelengthToCSS(trans.wl) : WCOLORS.textDim;

      ctx.strokeStyle = color; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.moveTo(x, yFrom); ctx.lineTo(x, yTo + 8); ctx.stroke();

      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(x, yTo);
      ctx.lineTo(x - 5, yTo + 12);
      ctx.lineTo(x + 5, yTo + 12);
      ctx.closePath(); ctx.fill();

      ctx.fillStyle = color; ctx.font = 'bold 12px system-ui'; ctx.textAlign = 'center';
      ctx.fillText(trans.name, x, yFrom - 8);
      ctx.font = '11px system-ui';
      ctx.fillText(trans.wl + ' nm', x, yFrom - 22);
    });

    // Vertical spectrum strip on right
    var specW = specR - specL;
    var specH = specB - specT;

    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(specL, specT, specW, specH);

    // Faint continuous spectrum background
    for (var py = 0; py < specH; py++) {
      var wl = 380 + (py / specH) * 400;
      ctx.fillStyle = wavelengthToCSS(wl);
      ctx.globalAlpha = 0.15;
      ctx.fillRect(specL, specT + py, specW, 1);
    }
    ctx.globalAlpha = 1.0;

    // Bright emission lines
    transitions.forEach(function(trans) {
      if (trans.wl >= 380 && trans.wl <= 780) {
        var py2 = ((trans.wl - 380) / 400) * specH;
        var lineColor = wavelengthToCSS(trans.wl);
        ctx.shadowColor = lineColor; ctx.shadowBlur = 8;
        ctx.fillStyle = lineColor;
        ctx.fillRect(specL + 2, specT + py2 - 1.5, specW - 4, 3);
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#fff'; ctx.font = '10px system-ui'; ctx.textAlign = 'right';
        ctx.fillText(trans.name + ' ' + trans.wl + ' nm', specL - 4, specT + py2 + 4);
      }
    });

    // Spectrum wavelength labels
    ctx.fillStyle = WCOLORS.textDim; ctx.font = '10px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('380 nm', (specL + specR) / 2, specT - 5);
    ctx.fillText('780 nm', (specL + specR) / 2, specB + 13);

    // Rotated spectrum title
    ctx.save();
    ctx.translate(specR + 14, (specT + specB) / 2);
    ctx.rotate(Math.PI / 2);
    ctx.fillStyle = WCOLORS.textDim; ctx.font = '11px system-ui'; ctx.textAlign = 'center';
    ctx.fillText(series.region === 'visible' ? 'Emission Spectrum' : series.label + ' (' + series.region + ')', 0, 0);
    ctx.restore();

    // Note for non-visible series
    if (series.region !== 'visible') {
      ctx.fillStyle = WCOLORS.textDim; ctx.font = '11px system-ui'; ctx.textAlign = 'center';
      ctx.fillText('Lines outside', (specL + specR) / 2, specB + 26);
      ctx.fillText('visible range', (specL + specR) / 2, specB + 39);
    }
  }

  if (seriesSelect) seriesSelect.addEventListener('change', draw);
  draw();
}

// =========================================================================
// 19. Quantum Wavepacket Dispersion
// =========================================================================
function initQuantumWavepacketDispersion() {
  const canvas = document.getElementById('scene-quantum-wavepacket-dispersion');
  if (!canvas) return;
  const setup = wSetupCanvas(canvas);
  if (!setup) return;
  const { ctx, W, H } = setup;

  var sigma0 = 0.4;
  var time = 0;
  var draggingSlider = false;

  // Physics
  var k0 = 15;        // carrier wavevector
  var xMax = 3.0;     // position range [-xMax, xMax]
  var dkMax = 4.5;    // momentum range [-dkMax, dkMax]

  // Layout — top: position Re(psi), bottom: momentum |psi~|^2
  var posT = 34, posB = 200, posMidY = 117;
  var posL = 10, posR = W - 10, posPW = posR - posL;
  var momT = 222, momB = 305, momH2 = momB - momT;
  var momL = Math.round(W * 0.15), momR = Math.round(W * 0.85), momPW = momR - momL;
  var sliderX = 10, sliderW = Math.round(W * 0.28), sliderY = H - 15;

  // Events
  canvas.addEventListener('mousedown', function(e) {
    var rect = canvas.getBoundingClientRect();
    var mx = e.clientX - rect.left, my = e.clientY - rect.top;
    if (Math.abs(my - sliderY) < 15 && mx >= sliderX && mx <= sliderX + sliderW) {
      draggingSlider = true; handleDrag(mx);
    } else if (my > posT && my < posB) {
      time = 0;
    }
  });
  canvas.addEventListener('mousemove', function(e) {
    if (!draggingSlider) return;
    handleDrag(e.clientX - canvas.getBoundingClientRect().left);
  });
  canvas.addEventListener('mouseup', function() { draggingSlider = false; });
  canvas.addEventListener('mouseleave', function() { draggingSlider = false; });
  canvas.addEventListener('touchstart', function(e) {
    e.preventDefault();
    var rect = canvas.getBoundingClientRect();
    var tx = e.touches[0].clientX - rect.left, ty = e.touches[0].clientY - rect.top;
    if (Math.abs(ty - sliderY) < 20 && tx >= sliderX - 5 && tx <= sliderX + sliderW + 5) {
      draggingSlider = true; handleDrag(tx);
    } else if (ty > posT && ty < posB) {
      time = 0;
    }
  }, { passive: false });
  canvas.addEventListener('touchmove', function(e) {
    if (!draggingSlider) return; e.preventDefault();
    handleDrag(e.touches[0].clientX - canvas.getBoundingClientRect().left);
  }, { passive: false });
  canvas.addEventListener('touchend', function() { draggingSlider = false; });

  function handleDrag(mx) {
    sigma0 = 0.2 + Math.max(0, Math.min(1, (mx - sliderX) / sliderW)) * 1.0;
    time = 0;
  }

  function tick() {
    if (!canvas.isConnected) return;
    time += 0.006;
    wClear(ctx, W, H);

    var tau = 2 * sigma0 * sigma0;
    var tRatio = time / tau;
    var sigmaT = sigma0 * Math.sqrt(1 + tRatio * tRatio);
    var sigmaK = 1 / (2 * sigma0);
    var halfH = (posB - posT) / 2;
    var ampScale = halfH * 0.82;

    // === Title ===
    ctx.fillStyle = WCOLORS.text; ctx.font = 'bold 12px system-ui'; ctx.textAlign = 'left';
    ctx.fillText('Quantum Wavepacket Spreading', 10, 16);
    ctx.fillStyle = WCOLORS.textDim; ctx.font = '9px system-ui'; ctx.textAlign = 'right';
    ctx.fillText('click waveform to reset', W - 10, 16);

    // === POSITION SPACE ===
    ctx.fillStyle = WCOLORS.text; ctx.font = '11px system-ui'; ctx.textAlign = 'left';
    ctx.fillText('Position space:  Re(\u03C8(x, t))', posL + 5, posT - 6);

    // Center axis
    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(posL, posMidY); ctx.lineTo(posR, posMidY); ctx.stroke();
    ctx.fillStyle = WCOLORS.textDim; ctx.font = '10px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('x', (posL + posR) / 2, posB + 10);

    // Amplitude decay from spreading
    var decayFactor = Math.pow(1 + tRatio * tRatio, -0.25);
    var px, x, env, a0;

    // Ghost initial envelope (amber dashed) — after some spreading
    if (tRatio > 0.15) {
      ctx.strokeStyle = 'rgba(217,119,6,0.3)'; ctx.lineWidth = 1; ctx.setLineDash([4, 3]);
      ctx.beginPath();
      for (px = 0; px <= posPW; px++) {
        x = (px / posPW - 0.5) * 2 * xMax;
        a0 = Math.exp(-x * x / (4 * sigma0 * sigma0));
        ctx.lineTo(posL + px, posMidY - a0 * ampScale);
      }
      ctx.stroke();
      ctx.beginPath();
      for (px = 0; px <= posPW; px++) {
        x = (px / posPW - 0.5) * 2 * xMax;
        a0 = Math.exp(-x * x / (4 * sigma0 * sigma0));
        ctx.lineTo(posL + px, posMidY + a0 * ampScale);
      }
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Current envelope (teal dashed)
    ctx.strokeStyle = 'rgba(15,118,110,0.3)'; ctx.lineWidth = 1; ctx.setLineDash([3, 3]);
    ctx.beginPath();
    for (px = 0; px <= posPW; px++) {
      x = (px / posPW - 0.5) * 2 * xMax;
      env = decayFactor * Math.exp(-x * x / (4 * sigmaT * sigmaT));
      ctx.lineTo(posL + px, posMidY - env * ampScale);
    }
    ctx.stroke();
    ctx.beginPath();
    for (px = 0; px <= posPW; px++) {
      x = (px / posPW - 0.5) * 2 * xMax;
      env = decayFactor * Math.exp(-x * x / (4 * sigmaT * sigmaT));
      ctx.lineTo(posL + px, posMidY + env * ampScale);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // Re(psi) — oscillating wavefunction with carrier and chirp
    // Phase: k0*x + chirp. Chirp = x^2*(t/tau)/(4*sigma(t)^2)
    // The chirp makes outer parts oscillate faster (higher local momentum = spreading outward)
    ctx.strokeStyle = WCOLORS.teal; ctx.lineWidth = 2;
    ctx.beginPath();
    for (px = 0; px <= posPW; px++) {
      x = (px / posPW - 0.5) * 2 * xMax;
      env = decayFactor * Math.exp(-x * x / (4 * sigmaT * sigmaT));
      var chirp = x * x * tRatio / (4 * sigmaT * sigmaT);
      var phase = k0 * x + chirp;
      var rePsi = env * Math.cos(phase);
      var py = posMidY - rePsi * ampScale;
      if (px === 0) ctx.moveTo(posL, py); else ctx.lineTo(posL + px, py);
    }
    ctx.stroke();

    // Width indicator below position panel
    var sxPx = (sigmaT / xMax) * (posPW / 2);
    var cPx = posL + posPW / 2;
    if (sxPx > 3 && sxPx < posPW * 0.45) {
      ctx.strokeStyle = WCOLORS.teal; ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(cPx - sxPx, posB + 2); ctx.lineTo(cPx + sxPx, posB + 2); ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cPx - sxPx, posB - 1); ctx.lineTo(cPx - sxPx, posB + 5);
      ctx.moveTo(cPx + sxPx, posB - 1); ctx.lineTo(cPx + sxPx, posB + 5);
      ctx.stroke();
      ctx.fillStyle = WCOLORS.teal; ctx.font = '9px system-ui'; ctx.textAlign = 'center';
      ctx.fillText('\u03C3\u2093(t)', cPx, posB + 14);
    }

    // t/tau display
    ctx.fillStyle = WCOLORS.textDim; ctx.font = '10px system-ui'; ctx.textAlign = 'right';
    ctx.fillText('t/\u03C4 = ' + tRatio.toFixed(1), posR - 5, posT + 10);

    // === Separator ===
    ctx.strokeStyle = WCOLORS.grid; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(posL + 20, momT - 8); ctx.lineTo(posR - 20, momT - 8); ctx.stroke();

    // === MOMENTUM SPACE ===
    ctx.fillStyle = WCOLORS.text; ctx.font = '11px system-ui'; ctx.textAlign = 'left';
    ctx.fillText('Momentum space:  |\u03C8\u0303(k)|\u00B2', momL - 5, momT - 14);
    ctx.fillStyle = WCOLORS.textDim; ctx.font = '9px system-ui'; ctx.textAlign = 'right';
    ctx.fillText('(constant in time \u2014 set at t = 0)', momR + 5, momT - 14);

    // Bottom axis
    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(momL, momB); ctx.lineTo(momR, momB); ctx.stroke();

    // Center tick and label
    var mCtr = momL + momPW / 2;
    ctx.beginPath(); ctx.moveTo(mCtr, momB); ctx.lineTo(mCtr, momB + 4); ctx.stroke();
    ctx.fillStyle = WCOLORS.textDim; ctx.font = '10px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('k\u2080', mCtr, momB + 13);
    ctx.fillText('k', (momL + momR) / 2, momB + 13);

    // Momentum distribution (peak-normalized)
    var momScale = momH2 * 0.85;

    // Filled
    ctx.fillStyle = 'rgba(217,119,6,0.15)';
    ctx.beginPath(); ctx.moveTo(momL, momB);
    for (px = 0; px <= momPW; px++) {
      var dk = (px / momPW - 0.5) * 2 * dkMax;
      var val = Math.exp(-dk * dk / (2 * sigmaK * sigmaK));
      ctx.lineTo(momL + px, momB - val * momScale);
    }
    ctx.lineTo(momR, momB); ctx.closePath(); ctx.fill();

    // Outline
    ctx.strokeStyle = WCOLORS.amber; ctx.lineWidth = 2;
    ctx.beginPath();
    for (px = 0; px <= momPW; px++) {
      var dk2 = (px / momPW - 0.5) * 2 * dkMax;
      val = Math.exp(-dk2 * dk2 / (2 * sigmaK * sigmaK));
      ctx.lineTo(momL + px, momB - val * momScale);
    }
    ctx.stroke();

    // Width indicator
    var skPx = (sigmaK / dkMax) * (momPW / 2);
    if (skPx > 3 && skPx < momPW * 0.45) {
      ctx.strokeStyle = WCOLORS.amber; ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(mCtr - skPx, momB + 3); ctx.lineTo(mCtr + skPx, momB + 3); ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(mCtr - skPx, momB); ctx.lineTo(mCtr - skPx, momB + 6);
      ctx.moveTo(mCtr + skPx, momB); ctx.lineTo(mCtr + skPx, momB + 6);
      ctx.stroke();
    }

    // === INFO BAR ===
    var infoY = H - 30;
    ctx.fillStyle = WCOLORS.teal; ctx.font = '10px system-ui'; ctx.textAlign = 'left';
    ctx.fillText('\u03C3\u2093(t) = ' + sigmaT.toFixed(2), sliderW + 55, infoY);
    ctx.fillStyle = WCOLORS.amber;
    ctx.fillText('\u03C3\u2096 = ' + sigmaK.toFixed(2), sliderW + 55, infoY + 14);
    // Uncertainty product
    var product = sigmaT * sigmaK;
    ctx.fillStyle = WCOLORS.text; ctx.font = '10px system-ui';
    ctx.fillText('\u03C3\u2093\u00B7\u03C3\u2096 = ' + product.toFixed(2) + '  (\u2265 \u00BD)', W * 0.55, infoY);
    ctx.fillStyle = WCOLORS.textDim;
    ctx.fillText('\u03C4 = 2\u03C3\u2080\u00B2 = ' + tau.toFixed(3), W * 0.55, infoY + 14);

    // === SLIDER ===
    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(sliderX, sliderY); ctx.lineTo(sliderX + sliderW, sliderY); ctx.stroke();
    var st = (sigma0 - 0.2) / 1.0;
    ctx.beginPath(); ctx.arc(sliderX + sliderW * st, sliderY, 5, 0, Math.PI * 2);
    ctx.fillStyle = WCOLORS.teal; ctx.fill();
    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 1; ctx.stroke();
    ctx.fillStyle = WCOLORS.text; ctx.font = '10px system-ui'; ctx.textAlign = 'left';
    ctx.fillText('\u03C3\u2080 = ' + sigma0.toFixed(2), sliderX + sliderW + 8, sliderY + 4);
    // Slider end labels
    ctx.fillStyle = WCOLORS.textDim; ctx.font = '9px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('narrow', sliderX, sliderY - 8);
    ctx.fillText('wide', sliderX + sliderW, sliderY - 8);

    requestAnimationFrame(tick);
  }

  tick();
}

// =========================================================================
// CHAPTER 21 - DOPPLER EFFECT
// =========================================================================

// =========================================================================
// 20. Doppler Moving Source
// =========================================================================
function initDopplerMovingSource() {
  const canvas = document.getElementById('scene-doppler-moving-source');
  if (!canvas) return;
  const setup = wSetupCanvas(canvas);
  if (!setup) return;
  const { ctx, W, H } = setup;

  let beta = 0.4; // v/c
  let time = 0;
  let draggingSlider = false;
  const sliderX = 20, sliderW = W * 0.4, sliderY = H - 16;
  let waveHistory = [];

  canvas.addEventListener('mousedown', function(e) {
    const rect = canvas.getBoundingClientRect();
    if (Math.abs(e.clientY - rect.top - sliderY) < 15) { draggingSlider = true; handleDrag(e.clientX - rect.left); }
  });
  canvas.addEventListener('mousemove', function(e) { if (!draggingSlider) return; handleDrag(e.clientX - canvas.getBoundingClientRect().left); });
  canvas.addEventListener('mouseup', function() { draggingSlider = false; });
  canvas.addEventListener('mouseleave', function() { draggingSlider = false; });
  canvas.addEventListener('touchstart', function(e) { e.preventDefault(); const rect = canvas.getBoundingClientRect(); if (Math.abs(e.touches[0].clientY - rect.top - sliderY) < 20) { draggingSlider = true; handleDrag(e.touches[0].clientX - rect.left); } }, { passive: false });
  canvas.addEventListener('touchmove', function(e) { if (!draggingSlider) return; e.preventDefault(); handleDrag(e.touches[0].clientX - canvas.getBoundingClientRect().left); }, { passive: false });
  canvas.addEventListener('touchend', function() { draggingSlider = false; });

  function handleDrag(mx) {
    const newBeta = Math.max(0, Math.min(0.9, (mx - sliderX) / sliderW * 0.9));
    if (Math.abs(newBeta - beta) > 0.01) {
      beta = newBeta;
      waveHistory = [];
      time = 0;
    }
  }

  const cy = H * 0.45;
  const waveSpeed = 2.5;
  const emitInterval = 18;

  function tick() {
    if (!canvas.isConnected) return;
    time += 1;

    // Source position
    const sourceX = W * 0.3 + (time * beta * waveSpeed) % (W * 0.5);

    // Emit waves periodically
    if (time % emitInterval === 0) {
      waveHistory.push({ x: sourceX, y: cy, r: 0, born: time });
    }

    wClear(ctx, W, H);

    // Draw wavefronts
    waveHistory.forEach(function(w) {
      w.r += waveSpeed;
      const age = time - w.born;
      const alpha = Math.max(0, 0.5 * (1 - w.r / (W * 0.8)));
      if (alpha <= 0) return;
      ctx.strokeStyle = 'rgba(15,118,110,' + alpha + ')';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(w.x, w.y, w.r, 0, Math.PI * 2);
      ctx.stroke();
    });

    // Remove old waves
    waveHistory = waveHistory.filter(function(w) { return w.r < W; });

    // Source
    ctx.fillStyle = WCOLORS.red;
    ctx.beginPath(); ctx.arc(sourceX, cy, 8, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 1; ctx.stroke();

    // Velocity arrow
    if (beta > 0.01) {
      ctx.strokeStyle = WCOLORS.amber; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(sourceX + 12, cy); ctx.lineTo(sourceX + 12 + beta * 40, cy); ctx.stroke();
      ctx.fillStyle = WCOLORS.amber;
      ctx.beginPath();
      ctx.moveTo(sourceX + 12 + beta * 40, cy);
      ctx.lineTo(sourceX + 8 + beta * 40, cy - 4);
      ctx.lineTo(sourceX + 8 + beta * 40, cy + 4);
      ctx.closePath(); ctx.fill();
      ctx.font = '10px system-ui'; ctx.textAlign = 'center';
      ctx.fillText('v', sourceX + 12 + beta * 20, cy - 10);
    }

    // Labels
    ctx.fillStyle = WCOLORS.teal; ctx.font = '10px system-ui';
    ctx.textAlign = 'left'; ctx.fillText('compressed', W * 0.7, 25);
    ctx.textAlign = 'right'; ctx.fillText('stretched', W * 0.15, 25);

    // Formula
    ctx.fillStyle = WCOLORS.text; ctx.font = '11px system-ui'; ctx.textAlign = 'left';
    const fAhead = (1 / (1 - beta)).toFixed(2);
    const fBehind = (1 / (1 + beta)).toFixed(2);
    ctx.fillText('f(ahead) = f\u2080/(1\u2212\u03B2) = ' + fAhead + 'f\u2080', W * 0.55, H - 40);
    ctx.fillText('f(behind) = f\u2080/(1+\u03B2) = ' + fBehind + 'f\u2080', W * 0.55, H - 26);

    // Slider
    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(sliderX, sliderY); ctx.lineTo(sliderX + sliderW, sliderY); ctx.stroke();
    const st = beta / 0.9;
    ctx.beginPath(); ctx.arc(sliderX + sliderW * st, sliderY, 6, 0, Math.PI * 2);
    ctx.fillStyle = WCOLORS.teal; ctx.fill();
    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 1; ctx.stroke();
    ctx.fillStyle = WCOLORS.text; ctx.font = '11px system-ui'; ctx.textAlign = 'left';
    ctx.fillText('v/c = ' + beta.toFixed(2), sliderX + sliderW + 10, sliderY + 4);

    ctx.fillStyle = WCOLORS.text; ctx.font = 'bold 12px system-ui'; ctx.textAlign = 'left';
    ctx.fillText('Doppler: Moving Source', 10, 18);

    requestAnimationFrame(tick);
  }

  tick();
}

// =========================================================================
// 21. Doppler Angle
// =========================================================================
function initDopplerAngle() {
  const canvas = document.getElementById('scene-doppler-angle');
  if (!canvas) return;
  const setup = wSetupCanvas(canvas);
  if (!setup) return;
  const { ctx, W, H } = setup;

  let time = 0;
  let sourceSpeed = 0.5; // fraction of wave speed
  const observerX = W * 0.5, observerY = H * 0.25;
  let freqHistory = [];

  const speedSlider = document.getElementById('da-speed');
  const speedVal = document.getElementById('da-speed-val');
  function onDaInput() {
    sourceSpeed = parseFloat(speedSlider.value);
    speedVal.textContent = sourceSpeed.toFixed(2);
    freqHistory = [];
    time = 0;
  }
  if (speedSlider) speedSlider.addEventListener('input', onDaInput);

  function tick() {
    if (!canvas.isConnected) return;
    time += 0.03;
    wClear(ctx, W, H);

    // Source moves along horizontal line
    const sourceY = H * 0.55;
    const travelRange = W * 0.8;
    const sourceX = W * 0.1 + ((time * 40) % travelRange);

    // Angle from source to observer
    const dx = observerX - sourceX;
    const dy = observerY - sourceY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const cosTheta = -dx / dist; // negative because source moves in +x
    const fReceived = 1 / (1 + sourceSpeed * cosTheta);

    freqHistory.push({ t: time, f: fReceived, sx: sourceX });
    if (freqHistory.length > 300) freqHistory.shift();

    // Draw scene
    // Source path
    ctx.strokeStyle = WCOLORS.grid; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(W * 0.1, sourceY); ctx.lineTo(W * 0.9, sourceY); ctx.stroke();

    // Observer
    ctx.fillStyle = WCOLORS.blue;
    ctx.beginPath(); ctx.arc(observerX, observerY, 6, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = WCOLORS.text; ctx.font = '10px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('Observer', observerX, observerY - 10);

    // Line from source to observer
    ctx.strokeStyle = WCOLORS.textDim; ctx.lineWidth = 1; ctx.setLineDash([3, 3]);
    ctx.beginPath(); ctx.moveTo(sourceX, sourceY); ctx.lineTo(observerX, observerY); ctx.stroke();
    ctx.setLineDash([]);

    // Source
    ctx.fillStyle = WCOLORS.red;
    ctx.beginPath(); ctx.arc(sourceX, sourceY, 7, 0, Math.PI * 2); ctx.fill();
    // Arrow
    ctx.strokeStyle = WCOLORS.amber; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(sourceX + 10, sourceY); ctx.lineTo(sourceX + 30, sourceY); ctx.stroke();
    ctx.fillStyle = WCOLORS.amber;
    ctx.beginPath();
    ctx.moveTo(sourceX + 30, sourceY);
    ctx.lineTo(sourceX + 25, sourceY - 4);
    ctx.lineTo(sourceX + 25, sourceY + 4);
    ctx.closePath(); ctx.fill();

    // Color code the received frequency
    const fColor = fReceived > 1.05 ? WCOLORS.blue : (fReceived < 0.95 ? WCOLORS.red : WCOLORS.text);
    ctx.fillStyle = fColor; ctx.font = 'bold 11px system-ui'; ctx.textAlign = 'left';
    ctx.fillText('f/f\u2080 = ' + fReceived.toFixed(3), W * 0.05, 20);

    // f vs time plot
    const plotL2 = W * 0.1, plotR2 = W - 15, plotT2 = H * 0.68, plotB2 = H - 10;
    const pW = plotR2 - plotL2, pH2 = plotB2 - plotT2;

    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(plotL2, plotT2); ctx.lineTo(plotL2, plotB2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(plotL2, plotB2); ctx.lineTo(plotR2, plotB2); ctx.stroke();

    // f=f0 reference
    const f0Y = plotB2 - 0.5 * pH2;
    ctx.strokeStyle = WCOLORS.grid; ctx.lineWidth = 0.5;
    ctx.beginPath(); ctx.moveTo(plotL2, f0Y); ctx.lineTo(plotR2, f0Y); ctx.stroke();
    ctx.fillStyle = WCOLORS.textDim; ctx.font = '11px system-ui'; ctx.textAlign = 'right';
    ctx.fillText('f\u2080', plotL2 - 3, f0Y + 3);

    ctx.fillStyle = WCOLORS.text; ctx.font = '11px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('time', (plotL2 + plotR2) / 2, plotB2 + 10);
    ctx.textAlign = 'right';
    ctx.fillText('f', plotL2 - 3, plotT2 + 5);

    // Plot frequency history
    if (freqHistory.length > 1) {
      ctx.strokeStyle = WCOLORS.teal; ctx.lineWidth = 2;
      ctx.beginPath();
      const tRange = freqHistory[freqHistory.length - 1].t - freqHistory[0].t;
      for (let i = 0; i < freqHistory.length; i++) {
        const px = plotL2 + ((freqHistory[i].t - freqHistory[0].t) / Math.max(tRange, 1)) * pW;
        const py = plotB2 - ((freqHistory[i].f - 0.5) / 1.0) * pH2;
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();
    }

    ctx.fillStyle = WCOLORS.text; ctx.font = 'bold 12px system-ui'; ctx.textAlign = 'right';
    ctx.fillText('Doppler: Source Passing Observer', W - 10, 18);

    requestAnimationFrame(tick);
  }

  tick();
}

// =========================================================================
// 22. Sonic Boom / Mach Cone
// =========================================================================
function initSonicBoomMachCone() {
  const canvas = document.getElementById('scene-sonic-boom-mach-cone');
  if (!canvas) return;
  const setup = wSetupCanvas(canvas);
  if (!setup) return;
  const { ctx, W, H } = setup;

  let mach = 1.5;
  let time = 0;
  let draggingSlider = false;
  const sliderX = 20, sliderW = W * 0.4, sliderY = H - 16;
  let waveHistory = [];

  canvas.addEventListener('mousedown', function(e) {
    const rect = canvas.getBoundingClientRect();
    if (Math.abs(e.clientY - rect.top - sliderY) < 15) { draggingSlider = true; handleDrag(e.clientX - rect.left); }
  });
  canvas.addEventListener('mousemove', function(e) { if (!draggingSlider) return; handleDrag(e.clientX - canvas.getBoundingClientRect().left); });
  canvas.addEventListener('mouseup', function() { draggingSlider = false; });
  canvas.addEventListener('mouseleave', function() { draggingSlider = false; });
  canvas.addEventListener('touchstart', function(e) { e.preventDefault(); const rect = canvas.getBoundingClientRect(); if (Math.abs(e.touches[0].clientY - rect.top - sliderY) < 20) { draggingSlider = true; handleDrag(e.touches[0].clientX - rect.left); } }, { passive: false });
  canvas.addEventListener('touchmove', function(e) { if (!draggingSlider) return; e.preventDefault(); handleDrag(e.touches[0].clientX - canvas.getBoundingClientRect().left); }, { passive: false });
  canvas.addEventListener('touchend', function() { draggingSlider = false; });

  function handleDrag(mx) {
    const newMach = 0.5 + Math.max(0, Math.min(1, (mx - sliderX) / sliderW)) * 2.5;
    if (Math.abs(newMach - mach) > 0.02) {
      mach = newMach;
      waveHistory = [];
      time = 0;
    }
  }

  const cy = H * 0.45;
  const soundSpeed = 2.0;
  const emitInterval = 12;

  function tick() {
    if (!canvas.isConnected) return;
    time += 1;

    const sourceSpeed = mach * soundSpeed;
    const sourceX = (W * 0.15 + time * sourceSpeed) % (W * 1.2) - W * 0.1;

    if (time % emitInterval === 0) {
      waveHistory.push({ x: sourceX, y: cy, r: 0 });
    }

    wClear(ctx, W, H);

    // Draw wavefronts
    waveHistory.forEach(function(w) {
      w.r += soundSpeed;
      const alpha = Math.max(0, 0.5 * (1 - w.r / (W * 0.8)));
      if (alpha <= 0) return;
      ctx.strokeStyle = 'rgba(15,118,110,' + alpha + ')';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(w.x, w.y, w.r, 0, Math.PI * 2);
      ctx.stroke();
    });
    waveHistory = waveHistory.filter(function(w) { return w.r < W * 1.2; });

    // Mach cone (only if supersonic)
    if (mach > 1.0) {
      const halfAngle = Math.asin(1 / mach);
      ctx.strokeStyle = WCOLORS.red; ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(sourceX, cy);
      ctx.lineTo(sourceX - W * 0.6, cy - Math.tan(halfAngle) * W * 0.6);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(sourceX, cy);
      ctx.lineTo(sourceX - W * 0.6, cy + Math.tan(halfAngle) * W * 0.6);
      ctx.stroke();

      // Label half-angle
      ctx.fillStyle = WCOLORS.red; ctx.font = '10px system-ui'; ctx.textAlign = 'left';
      const angleStr = (halfAngle * 180 / Math.PI).toFixed(1);
      ctx.fillText('\u03B8 = arcsin(1/M) = ' + angleStr + '\u00B0', sourceX - 130, cy - 8);
    } else if (Math.abs(mach - 1) < 0.05) {
      ctx.fillStyle = WCOLORS.amber; ctx.font = 'bold 11px system-ui'; ctx.textAlign = 'center';
      ctx.fillText('Wavefronts pile up at M = 1!', W / 2, 25);
    }

    // Source
    ctx.fillStyle = mach > 1 ? WCOLORS.red : WCOLORS.teal;
    ctx.beginPath(); ctx.arc(sourceX, cy, 7, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 1; ctx.stroke();

    // Info
    ctx.fillStyle = WCOLORS.text; ctx.font = '11px system-ui'; ctx.textAlign = 'left';
    const regime = mach < 1 ? 'Subsonic' : (mach > 1 ? 'Supersonic' : 'Sonic');
    ctx.fillText(regime, W * 0.6, sliderY + 3);

    // Slider
    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(sliderX, sliderY); ctx.lineTo(sliderX + sliderW, sliderY); ctx.stroke();
    const st = (mach - 0.5) / 2.5;
    ctx.beginPath(); ctx.arc(sliderX + sliderW * st, sliderY, 6, 0, Math.PI * 2);
    ctx.fillStyle = mach > 1 ? WCOLORS.red : WCOLORS.teal; ctx.fill();
    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 1; ctx.stroke();
    ctx.fillStyle = WCOLORS.text; ctx.font = '11px system-ui'; ctx.textAlign = 'left';
    ctx.fillText('M = ' + mach.toFixed(2), sliderX + sliderW + 10, sliderY + 4);

    ctx.fillStyle = WCOLORS.text; ctx.font = 'bold 12px system-ui'; ctx.textAlign = 'left';
    ctx.fillText('Mach Cone', 10, 18);

    requestAnimationFrame(tick);
  }

  tick();
}

// =========================================================================
// 23. Relativistic Doppler Redshift
// =========================================================================
function initRelativisticDopplerRedshift() {
  const canvas = document.getElementById('scene-relativistic-doppler-redshift');
  if (!canvas) return;
  const setup = wSetupCanvas(canvas);
  if (!setup) return;
  const { ctx, W, H } = setup;

  let betaVal = 0.3;
  let draggingSlider = false;
  const sliderX = 30, sliderW = W * 0.5, sliderY = H - 16;

  canvas.addEventListener('mousedown', function(e) {
    const rect = canvas.getBoundingClientRect();
    if (Math.abs(e.clientY - rect.top - sliderY) < 15) { draggingSlider = true; handleDrag(e.clientX - rect.left); }
  });
  canvas.addEventListener('mousemove', function(e) { if (!draggingSlider) return; handleDrag(e.clientX - canvas.getBoundingClientRect().left); });
  canvas.addEventListener('mouseup', function() { draggingSlider = false; });
  canvas.addEventListener('mouseleave', function() { draggingSlider = false; });
  canvas.addEventListener('touchstart', function(e) { e.preventDefault(); const rect = canvas.getBoundingClientRect(); if (Math.abs(e.touches[0].clientY - rect.top - sliderY) < 20) { draggingSlider = true; handleDrag(e.touches[0].clientX - rect.left); } }, { passive: false });
  canvas.addEventListener('touchmove', function(e) { if (!draggingSlider) return; e.preventDefault(); handleDrag(e.touches[0].clientX - canvas.getBoundingClientRect().left); }, { passive: false });
  canvas.addEventListener('touchend', function() { draggingSlider = false; });

  function handleDrag(mx) {
    betaVal = Math.max(0.01, Math.min(0.95, (mx - sliderX) / sliderW * 0.95));
    draw();
  }

  function draw() {
    wClear(ctx, W, H);

    const f0_wl = 550; // reference wavelength (green)

    // Approaching: blueshift
    const fRatioApproach = Math.sqrt((1 + betaVal) / (1 - betaVal));
    const wlApproach = f0_wl / fRatioApproach;
    // Receding: redshift
    const fRatioRecede = Math.sqrt((1 - betaVal) / (1 + betaVal));
    const wlRecede = f0_wl / fRatioRecede;

    const cy = H * 0.35;
    const observerX = W * 0.5;

    // Observer
    ctx.fillStyle = WCOLORS.axis;
    ctx.beginPath(); ctx.arc(observerX, cy, 8, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = WCOLORS.text; ctx.font = '10px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('Observer', observerX, cy + 22);

    // Approaching source (left)
    const appX = W * 0.15;
    ctx.fillStyle = WCOLORS.blue;
    ctx.beginPath(); ctx.arc(appX, cy, 7, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = WCOLORS.blue; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(appX + 10, cy); ctx.lineTo(appX + 35, cy); ctx.stroke();
    ctx.fillStyle = WCOLORS.blue;
    ctx.beginPath(); ctx.moveTo(appX + 35, cy); ctx.lineTo(appX + 30, cy - 4); ctx.lineTo(appX + 30, cy + 4); ctx.closePath(); ctx.fill();

    // Approaching color swatch
    const swW = 70, swH = 40;
    ctx.fillStyle = (wlApproach >= 380 && wlApproach <= 780) ? wavelengthToCSS(wlApproach) : '#7c3aed';
    ctx.fillRect(appX - swW/2, cy - 60, swW, swH);
    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 1;
    ctx.strokeRect(appX - swW/2, cy - 60, swW, swH);
    ctx.fillStyle = WCOLORS.blue; ctx.font = '11px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('Approaching', appX, cy - 65);
    ctx.fillText(Math.round(wlApproach) + ' nm', appX, cy + 36);
    ctx.fillText('Blueshift', appX, cy + 48);

    // Receding source (right)
    const recX = W * 0.85;
    ctx.fillStyle = WCOLORS.red;
    ctx.beginPath(); ctx.arc(recX, cy, 7, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = WCOLORS.red; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(recX - 10, cy); ctx.lineTo(recX - 35, cy); ctx.stroke();

    // Receding color swatch
    ctx.fillStyle = (wlRecede >= 380 && wlRecede <= 780) ? wavelengthToCSS(wlRecede) : '#991b1b';
    ctx.fillRect(recX - swW/2, cy - 60, swW, swH);
    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 1;
    ctx.strokeRect(recX - swW/2, cy - 60, swW, swH);
    ctx.fillStyle = WCOLORS.red; ctx.font = '11px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('Receding', recX, cy - 65);
    ctx.fillText(Math.round(wlRecede) + ' nm', recX, cy + 36);
    ctx.fillText('Redshift', recX, cy + 48);

    // Rest color swatch (center)
    ctx.fillStyle = wavelengthToCSS(f0_wl);
    ctx.fillRect(observerX - swW/2, cy - 60, swW, swH);
    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 1;
    ctx.strokeRect(observerX - swW/2, cy - 60, swW, swH);
    ctx.fillStyle = WCOLORS.text; ctx.font = '11px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('Rest: ' + f0_wl + ' nm', observerX, cy - 65);

    // Formula
    ctx.fillStyle = WCOLORS.text; ctx.font = '12px system-ui'; ctx.textAlign = 'center';
    ctx.fillText("f' = f\u2080\u221A((1\u2212\u03B2)/(1+\u03B2))  (receding)", W / 2, H * 0.7);
    ctx.fillText("f' = f\u2080\u221A((1+\u03B2)/(1\u2212\u03B2))  (approaching)", W / 2, H * 0.7 + 18);

    // Slider
    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(sliderX, sliderY); ctx.lineTo(sliderX + sliderW, sliderY); ctx.stroke();
    const st = betaVal / 0.95;
    ctx.beginPath(); ctx.arc(sliderX + sliderW * st, sliderY, 6, 0, Math.PI * 2);
    ctx.fillStyle = WCOLORS.teal; ctx.fill();
    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 1; ctx.stroke();
    ctx.fillStyle = WCOLORS.text; ctx.font = '11px system-ui'; ctx.textAlign = 'left';
    ctx.fillText('\u03B2 = v/c = ' + betaVal.toFixed(2), sliderX + sliderW + 10, sliderY + 4);

    ctx.fillStyle = WCOLORS.text; ctx.font = 'bold 12px system-ui'; ctx.textAlign = 'left';
    ctx.fillText('Relativistic Doppler Effect', 10, 18);
  }

  draw();
}

// =========================================================================
// 24. Doppler Spectroscopy Exoplanet
// =========================================================================
function initDopplerSpectroscopyExoplanet() {
  const canvas = document.getElementById('scene-doppler-spectroscopy-exoplanet');
  if (!canvas) return;
  const setup = wSetupCanvas(canvas);
  if (!setup) return;
  const { ctx, W, H } = setup;

  let time = 0;
  let planetMassRatio = 0.001; // planet/star mass ratio
  let period = 4; // orbital period in seconds
  let draggingSlider = null;

  const sliders = [
    { y: H - 32, label: 'Planet mass', min: 0.0003, max: 0.01, getVal: function() { return planetMassRatio; }, setVal: function(v) { planetMassRatio = v; } },
    { y: H - 14, label: 'Period', min: 1, max: 8, getVal: function() { return period; }, setVal: function(v) { period = v; } }
  ];
  const sliderX = 20, sliderW = W * 0.3;

  canvas.addEventListener('mousedown', function(e) {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left, my = e.clientY - rect.top;
    for (let i = 0; i < sliders.length; i++) {
      if (Math.abs(my - sliders[i].y) < 10 && mx >= sliderX - 5 && mx <= sliderX + sliderW + 5) {
        draggingSlider = i; handleDrag(mx); break;
      }
    }
  });
  canvas.addEventListener('mousemove', function(e) { if (draggingSlider === null) return; handleDrag(e.clientX - canvas.getBoundingClientRect().left); });
  canvas.addEventListener('mouseup', function() { draggingSlider = null; });
  canvas.addEventListener('mouseleave', function() { draggingSlider = null; });
  canvas.addEventListener('touchstart', function(e) { e.preventDefault(); const rect = canvas.getBoundingClientRect(); const mx = e.touches[0].clientX - rect.left, my = e.touches[0].clientY - rect.top; for (let i = 0; i < sliders.length; i++) { if (Math.abs(my - sliders[i].y) < 14) { draggingSlider = i; handleDrag(mx); break; } } }, { passive: false });
  canvas.addEventListener('touchmove', function(e) { if (draggingSlider === null) return; e.preventDefault(); handleDrag(e.touches[0].clientX - canvas.getBoundingClientRect().left); }, { passive: false });
  canvas.addEventListener('touchend', function() { draggingSlider = null; });

  function handleDrag(mx) {
    const s = sliders[draggingSlider];
    const t = Math.max(0, Math.min(1, (mx - sliderX) / sliderW));
    s.setVal(s.min + t * (s.max - s.min));
  }

  const orbitCX = W * 0.22, orbitCY = H * 0.35;
  const orbitR = Math.min(W * 0.15, H * 0.25);

  function tick() {
    if (!canvas.isConnected) return;
    time += 0.02;
    wClear(ctx, W, H);

    const omega = 2 * Math.PI / period;
    const phase = omega * time;

    // Star wobble radius (proportional to planet mass ratio)
    const starWobble = orbitR * planetMassRatio * 10;

    // Positions
    const planetX = orbitCX + orbitR * Math.cos(phase);
    const planetY = orbitCY + orbitR * Math.sin(phase) * 0.4; // perspective
    const starX = orbitCX - starWobble * Math.cos(phase);
    const starY = orbitCY - starWobble * Math.sin(phase) * 0.4;

    // Orbit paths
    ctx.strokeStyle = WCOLORS.grid; ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.ellipse(orbitCX, orbitCY, orbitR, orbitR * 0.4, 0, 0, Math.PI * 2);
    ctx.stroke();

    if (starWobble > 1) {
      ctx.strokeStyle = 'rgba(220,38,38,0.3)'; ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(orbitCX, orbitCY, starWobble, starWobble * 0.4, 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Center of mass
    ctx.fillStyle = WCOLORS.textDim;
    ctx.beginPath(); ctx.arc(orbitCX, orbitCY, 2, 0, Math.PI * 2); ctx.fill();

    // Planet
    ctx.fillStyle = WCOLORS.blue;
    ctx.beginPath(); ctx.arc(planetX, planetY, 5, 0, Math.PI * 2); ctx.fill();

    // Star
    ctx.fillStyle = WCOLORS.amber;
    ctx.beginPath(); ctx.arc(starX, starY, 12, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#b45309'; ctx.lineWidth = 1; ctx.stroke();

    ctx.fillStyle = WCOLORS.text; ctx.font = '11px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('Star', starX, starY + 22);
    ctx.fillText('Planet', planetX, planetY + 14);

    // Radial velocity (component toward observer = x component)
    const vRadial = Math.sin(phase) * planetMassRatio * 100; // arbitrary scale

    // Spectral line (shifts back and forth)
    const specY = H * 0.13, specH = 35;
    const specL = W * 0.45, specR = W - 15;
    const specW2 = specR - specL;

    drawSpectrumBar(ctx, specL, specY, specW2, specH);

    // Absorption line that shifts
    const lineShift = vRadial * specW2 * 0.02;
    const lineX = specL + specW2 * 0.5 + lineShift;
    ctx.strokeStyle = '#000'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(lineX, specY); ctx.lineTo(lineX, specY + specH); ctx.stroke();

    // Reference line
    ctx.strokeStyle = 'rgba(255,255,255,0.5)'; ctx.lineWidth = 1; ctx.setLineDash([3, 3]);
    ctx.beginPath(); ctx.moveTo(specL + specW2 * 0.5, specY - 5); ctx.lineTo(specL + specW2 * 0.5, specY + specH + 5); ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = WCOLORS.text; ctx.font = '11px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('Spectral line shifts with star\u2019s radial velocity', (specL + specR) / 2, specY - 5);

    // Radial velocity curve
    const plotL2 = W * 0.45, plotR2 = W - 15, plotT2 = specY + specH + 15, plotB2 = H - 50;
    const pW = plotR2 - plotL2, pH = plotB2 - plotT2;

    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(plotL2, plotT2); ctx.lineTo(plotL2, plotB2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(plotL2, plotB2); ctx.lineTo(plotR2, plotB2); ctx.stroke();

    const midY2 = (plotT2 + plotB2) / 2;
    ctx.strokeStyle = WCOLORS.grid; ctx.lineWidth = 0.5;
    ctx.beginPath(); ctx.moveTo(plotL2, midY2); ctx.lineTo(plotR2, midY2); ctx.stroke();

    ctx.fillStyle = WCOLORS.text; ctx.font = '11px system-ui';
    ctx.textAlign = 'center'; ctx.fillText('time', (plotL2 + plotR2) / 2, plotB2 + 12);
    ctx.textAlign = 'right'; fillTextSub(ctx, 'v_r', plotL2 - 5, plotT2 + 5);

    // Draw sinusoidal RV curve
    ctx.strokeStyle = WCOLORS.teal; ctx.lineWidth = 2;
    ctx.beginPath();
    for (let px = 0; px <= pW; px++) {
      const t2 = (px / pW) * period * 2;
      const v = Math.sin(omega * t2) * planetMassRatio * 100;
      const py = midY2 - v * pH * 0.03;
      if (px === 0) ctx.moveTo(plotL2 + px, py); else ctx.lineTo(plotL2 + px, py);
    }
    ctx.stroke();

    // Current position on RV curve
    const curT = (time % (period * 2));
    const curPx = plotL2 + (curT / (period * 2)) * pW;
    const curPy = midY2 - vRadial * pH * 0.03;
    ctx.beginPath(); ctx.arc(curPx, curPy, 4, 0, Math.PI * 2);
    ctx.fillStyle = WCOLORS.red; ctx.fill();

    // Sliders
    sliders.forEach(function(s, i) {
      ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(sliderX, s.y); ctx.lineTo(sliderX + sliderW, s.y); ctx.stroke();
      const t = (s.getVal() - s.min) / (s.max - s.min);
      ctx.beginPath(); ctx.arc(sliderX + sliderW * t, s.y, 5, 0, Math.PI * 2);
      ctx.fillStyle = WCOLORS.teal; ctx.fill();
      ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 1; ctx.stroke();
      ctx.fillStyle = WCOLORS.text; ctx.font = '10px system-ui'; ctx.textAlign = 'left';
      const valStr = i === 0 ? (s.getVal() * 1000).toFixed(1) + ' M_J' : s.getVal().toFixed(1) + ' s';
      ctx.fillText(s.label + ': ' + valStr, sliderX + sliderW + 10, s.y + 4);
    });

    ctx.fillStyle = WCOLORS.text; ctx.font = 'bold 12px system-ui'; ctx.textAlign = 'left';
    ctx.fillText('Doppler Spectroscopy: Exoplanet Detection', 10, 18);

    requestAnimationFrame(tick);
  }

  tick();
}
