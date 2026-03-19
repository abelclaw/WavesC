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
  initDoubleSiltPhotonBuildup();
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
    ctx.fillStyle = WCOLORS.textDim; ctx.font = '9px system-ui, sans-serif';
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
    ctx.fillStyle = WCOLORS.textDim; ctx.font = '9px system-ui, sans-serif'; ctx.textAlign = 'left';
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
    ctx.fillStyle = WCOLORS.textDim; ctx.font = '9px system-ui, sans-serif'; ctx.textAlign = 'center';
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
    ctx.fillStyle = WCOLORS.textDim; ctx.font = '9px system-ui, sans-serif';
    ctx.fillText(dampLabel, cx, springY0 + springZoneH + 10);
  }

  function tick() {
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
// 1. DRIVEN OSCILLATOR — live simulation + amplitude/phase curves
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

  // Layout: left = spring-mass, center = x(t) plot, right = amplitude/phase curves
  const springX = 50, massEqY = H / 2, maxDisp = 60;
  const plotL = 130, plotR = W * 0.48, plotT = 25, plotB = H - 25;
  const plotW = plotR - plotL, plotH = plotB - plotT;
  const ampL = W * 0.54, ampR = W - 15, ampT = 25, ampB = H * 0.48;
  const phL = ampL, phR = ampR, phT = H * 0.55, phB = H - 15;

  // Steady-state solution: x(t) = (F0/m) * [A cos(wd t) + B sin(wd t)]
  function getAB(w0, wd, gamma) {
    const denom = (w0 * w0 - wd * wd) * (w0 * w0 - wd * wd) + (gamma * wd) * (gamma * wd);
    const A = (w0 * w0 - wd * wd) / denom;
    const B = (gamma * wd) / denom;
    return { A, B, amp: Math.sqrt(A * A + B * B), phase: -Math.atan2(B, A) };
  }

  function tick() {
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

    // --- Spring-mass with driving force (left) ---
    const massY = massEqY + x * maxDisp * 8;
    const forceY = massEqY + force * maxDisp * 0.4;

    // Wall
    ctx.fillStyle = WCOLORS.axis;
    ctx.fillRect(springX - 25, 15, 55, 4);
    ctx.strokeStyle = WCOLORS.textDim; ctx.lineWidth = 1;
    for (let i = 0; i < 5; i++) {
      ctx.beginPath(); ctx.moveTo(springX - 20 + i * 11, 15); ctx.lineTo(springX - 25 + i * 11, 10); ctx.stroke();
    }

    // Spring
    ctx.strokeStyle = WCOLORS.teal; ctx.lineWidth = 2;
    const sTop = 19;
    const sLen = Math.max(massY - 14 - sTop, 15);
    ctx.beginPath(); ctx.moveTo(springX, sTop);
    const seg = sLen / 14;
    let cy = sTop + seg;
    ctx.lineTo(springX, cy);
    for (let i = 0; i < 6; i++) {
      ctx.lineTo(springX + ((i % 2 === 0) ? 10 : -10), cy + seg);
      cy += 2 * seg;
      ctx.lineTo(springX, cy);
    }
    ctx.lineTo(springX, massY - 14);
    ctx.stroke();

    // Mass
    const bW = 36, bH = 24;
    ctx.fillStyle = WCOLORS.teal;
    ctx.beginPath(); ctx.roundRect(springX - bW / 2, massY - bH / 2, bW, bH, 4); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.font = 'bold 11px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('m', springX, massY + 4);

    // Driving force arrow
    const fLen = force * 25;
    if (Math.abs(fLen) > 2) {
      ctx.strokeStyle = WCOLORS.amber; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.moveTo(springX, massY + bH / 2 + 5);
      ctx.lineTo(springX, massY + bH / 2 + 5 + fLen); ctx.stroke();
      ctx.fillStyle = WCOLORS.amber;
      const dir = Math.sign(fLen);
      ctx.beginPath();
      ctx.moveTo(springX, massY + bH / 2 + 5 + fLen);
      ctx.lineTo(springX - 4, massY + bH / 2 + 5 + fLen - dir * 6);
      ctx.lineTo(springX + 4, massY + bH / 2 + 5 + fLen - dir * 6);
      ctx.closePath(); ctx.fill();
      ctx.font = '9px system-ui'; ctx.textAlign = 'left';
      ctx.fillText('F', springX + 8, massY + bH / 2 + 5 + fLen / 2 + 3);
    }

    // --- x(t) plot (center) ---
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

    ctx.fillStyle = WCOLORS.amber; ctx.font = '9px system-ui'; ctx.textAlign = 'left';
    ctx.fillText('F(t)', plotL + 3, plotT + 10);
    ctx.fillStyle = WCOLORS.teal;
    ctx.fillText('x(t)', plotL + 3, plotT + 22);

    // --- Amplitude vs wd curve (upper right) ---
    const ampW = ampR - ampL, ampH = ampB - ampT;
    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(ampL, ampT); ctx.lineTo(ampL, ampB); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(ampL, ampB); ctx.lineTo(ampR, ampB); ctx.stroke();
    ctx.fillStyle = WCOLORS.textDim; ctx.font = '9px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('|x|', ampL - 10, ampT + 3);
    ctx.fillText('\u03C9', ampR - 4, ampB + 12);
    ctx.save(); ctx.font = '7px system-ui'; ctx.fillText('d', ampR + 4, ampB + 14); ctx.restore();

    // Sweep amplitude curve
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
    ctx.fillStyle = WCOLORS.textDim; ctx.font = '8px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('\u03C9\u2080', w0px, ampB + 12);

    // --- Phase vs wd curve (lower right) ---
    const phW = phR - phL, phH = phB - phT;
    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(phL, phT); ctx.lineTo(phL, phB); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(phL, phB); ctx.lineTo(phR, phB); ctx.stroke();
    ctx.fillStyle = WCOLORS.textDim; ctx.font = '9px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('Phase', phL - 14, phT + 3);
    ctx.fillText('\u03C9', phR - 4, phB + 12);
    ctx.save(); ctx.font = '7px system-ui'; ctx.fillText('d', phR + 4, phB + 14); ctx.restore();

    // Phase labels
    ctx.fillStyle = WCOLORS.textDim; ctx.font = '8px system-ui'; ctx.textAlign = 'right';
    ctx.fillText('0\u00B0', phL - 3, phT + 4);
    ctx.fillText('\u221290\u00B0', phL - 3, (phT + phB) / 2 + 3);
    ctx.fillText('\u2212180\u00B0', phL - 3, phB + 3);

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
// 2. TRANSIENT DECAY — homogeneous + inhomogeneous
// =========================================================================
function initTransientDecay() {
  const canvas = document.getElementById('scene-transient-decay');
  if (!canvas) return;
  const setup = wSetupCanvas(canvas);
  if (!setup) return;
  const { ctx, W, H } = setup;

  let t = 0;
  const w0 = 5, wd = 4, gamma = 0.8, F0 = 1;
  const plotL = 50, plotR = W - 20, plotT = 25, plotB = H - 25;
  const plotW = plotR - plotL, plotH = plotB - plotT;
  const midY = (plotT + plotB) / 2;
  const tMax = 12;

  function getAB() {
    const denom = (w0 * w0 - wd * wd) ** 2 + (gamma * wd) ** 2;
    return { A: (w0 * w0 - wd * wd) / denom, B: (gamma * wd) / denom };
  }

  const { A, B } = getAB();
  const wu = Math.sqrt(w0 * w0 - (gamma / 2) ** 2);

  // Transient chosen so total x(0) = 0, x'(0) = 0
  const xSS0 = A; // steady-state at t=0
  const vSS0 = wd * B; // d/dt of steady-state at t=0
  // Transient: x_h = e^{-gamma/2 t} [C1 cos(wu t) + C2 sin(wu t)]
  const C1 = -xSS0;
  const C2 = -(vSS0 + (gamma / 2) * C1) / wu;

  function xTotal(tc) {
    const ss = A * Math.cos(wd * tc) + B * Math.sin(wd * tc);
    const tr = Math.exp(-gamma / 2 * tc) * (C1 * Math.cos(wu * tc) + C2 * Math.sin(wu * tc));
    return { total: ss + tr, ss, tr };
  }

  function tick() {
    t += 0.02;
    if (t > tMax) t = 0;
    draw();
    requestAnimationFrame(tick);
  }

  function draw() {
    wClear(ctx, W, H);

    // Axes
    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(plotL, plotT); ctx.lineTo(plotL, plotB); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(plotL, midY); ctx.lineTo(plotR, midY); ctx.stroke();
    ctx.fillStyle = WCOLORS.text; ctx.font = '11px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('x(t)', plotL - 14, plotT - 4);
    ctx.fillText('t', plotR + 10, midY + 3);

    const scale = plotH * 0.35;
    const nPts = 400;

    // Envelope of transient
    ctx.strokeStyle = WCOLORS.textDim + '30'; ctx.lineWidth = 1; ctx.setLineDash([4, 4]);
    ctx.beginPath();
    for (let i = 0; i <= nPts; i++) {
      const tc = (i / nPts) * tMax;
      const env = Math.sqrt(C1 * C1 + C2 * C2) * Math.exp(-gamma / 2 * tc);
      const px = plotL + (i / nPts) * plotW;
      const py = midY - env * scale;
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.stroke();
    ctx.beginPath();
    for (let i = 0; i <= nPts; i++) {
      const tc = (i / nPts) * tMax;
      const env = -Math.sqrt(C1 * C1 + C2 * C2) * Math.exp(-gamma / 2 * tc);
      const px = plotL + (i / nPts) * plotW;
      const py = midY - env * scale;
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // Full curves
    // Steady-state (faded)
    ctx.strokeStyle = WCOLORS.amber + '60'; ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (let i = 0; i <= nPts; i++) {
      const tc = (i / nPts) * tMax;
      const { ss } = xTotal(tc);
      const px = plotL + (i / nPts) * plotW;
      i === 0 ? ctx.moveTo(px, midY - ss * scale) : ctx.lineTo(px, midY - ss * scale);
    }
    ctx.stroke();

    // Transient (faded)
    ctx.strokeStyle = WCOLORS.red + '50'; ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (let i = 0; i <= nPts; i++) {
      const tc = (i / nPts) * tMax;
      const { tr } = xTotal(tc);
      const px = plotL + (i / nPts) * plotW;
      i === 0 ? ctx.moveTo(px, midY - tr * scale) : ctx.lineTo(px, midY - tr * scale);
    }
    ctx.stroke();

    // Total up to current time (bold)
    const curIdx = Math.floor((t / tMax) * nPts);
    ctx.strokeStyle = WCOLORS.teal; ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let i = 0; i <= curIdx; i++) {
      const tc = (i / nPts) * tMax;
      const { total } = xTotal(tc);
      const px = plotL + (i / nPts) * plotW;
      i === 0 ? ctx.moveTo(px, midY - total * scale) : ctx.lineTo(px, midY - total * scale);
    }
    ctx.stroke();

    // Current dot
    const { total: curX } = xTotal(t);
    const dotPx = plotL + (t / tMax) * plotW;
    const dotPy = midY - curX * scale;
    ctx.fillStyle = WCOLORS.teal;
    ctx.beginPath(); ctx.arc(dotPx, dotPy, 5, 0, Math.PI * 2); ctx.fill();

    // Legend
    ctx.font = '10px system-ui'; ctx.textAlign = 'left';
    ctx.fillStyle = WCOLORS.teal; ctx.fillText('\u2014 Total x(t)', plotL + 10, plotB + 12);
    ctx.fillStyle = WCOLORS.amber; ctx.fillText('\u2014 Steady state', plotL + 100, plotB + 12);
    ctx.fillStyle = WCOLORS.red; ctx.fillText('\u2014 Transient', plotL + 210, plotB + 12);

    // Title
    ctx.fillStyle = WCOLORS.text; ctx.font = '12px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('Transient dies away \u2192 only steady state survives', plotL + plotW / 2, plotT - 6);
  }

  tick();
}

// =========================================================================
// 3. PHASE LAG — force vs response comparison
// =========================================================================
function initPhaseLag() {
  const canvas = document.getElementById('scene-phase-lag');
  if (!canvas) return;
  const setup = wSetupCanvas(canvas);
  if (!setup) return;
  const { ctx, W, H } = setup;

  let t = 0;
  const plotL = 50, plotR = W - 20, plotT = 30, plotB = H - 30;
  const plotW = plotR - plotL, plotH = plotB - plotT;
  const midY = (plotT + plotB) / 2;

  // Embed a slider if the canvas has a parent scene
  let wdSlider = document.getElementById('phase-lag-wd');
  if (!wdSlider) {
    // Create controls dynamically after the canvas
    const parent = canvas.parentElement;
    if (parent) {
      const controls = document.createElement('div');
      controls.className = 'scene-controls';
      controls.innerHTML = '<label>\u03C9<sub>d</sub>: <input type="range" id="phase-lag-wd" min="0.5" max="10" step="0.1" value="3"><span class="scene-val" id="phase-lag-wd-val">3.0</span></label>';
      parent.appendChild(controls);
      wdSlider = document.getElementById('phase-lag-wd');
    }
  }

  const w0 = 5, gamma = 0.5;

  function getAB(wd) {
    const denom = (w0 * w0 - wd * wd) ** 2 + (gamma * wd) ** 2;
    return { A: (w0 * w0 - wd * wd) / denom, B: (gamma * wd) / denom };
  }

  function tick() {
    const wd = parseFloat(wdSlider?.value || 3);
    document.getElementById('phase-lag-wd-val')?.replaceChildren(document.createTextNode(wd.toFixed(1)));

    t += 0.025;
    const { A, B } = getAB(wd);
    const amp = Math.sqrt(A * A + B * B);
    const phase = -Math.atan2(B, A);

    draw(wd, A, B, amp, phase);
    requestAnimationFrame(tick);
  }

  function draw(wd, A, B, amp, phase) {
    wClear(ctx, W, H);

    // Axes
    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(plotL, plotT); ctx.lineTo(plotL, plotB); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(plotL, midY); ctx.lineTo(plotR, midY); ctx.stroke();

    const nCycles = 3;
    const tRange = nCycles * 2 * Math.PI / wd;
    const scale = plotH * 0.4;

    // Force (driving)
    ctx.strokeStyle = WCOLORS.amber; ctx.lineWidth = 2;
    ctx.beginPath();
    for (let px = 0; px <= plotW; px++) {
      const tc = (px / plotW) * tRange + t;
      const f = Math.cos(wd * tc);
      const py = midY - f * scale * 0.5;
      px === 0 ? ctx.moveTo(plotL + px, py) : ctx.lineTo(plotL + px, py);
    }
    ctx.stroke();

    // Response
    const normAmp = Math.min(amp * 20, 1);
    ctx.strokeStyle = WCOLORS.teal; ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let px = 0; px <= plotW; px++) {
      const tc = (px / plotW) * tRange + t;
      const x = (A * Math.cos(wd * tc) + B * Math.sin(wd * tc)) * 20;
      const py = midY - x * scale;
      px === 0 ? ctx.moveTo(plotL + px, py) : ctx.lineTo(plotL + px, py);
    }
    ctx.stroke();

    // Phase info
    const phaseDeg = (phase * 180 / Math.PI);
    const inPhase = wd < w0;
    ctx.fillStyle = WCOLORS.text; ctx.font = '13px system-ui'; ctx.textAlign = 'center';
    ctx.fillText(inPhase ? 'In phase (\u03C9_d < \u03C9\u2080)' : 'Out of phase (\u03C9_d > \u03C9\u2080)', plotL + plotW / 2, plotT - 6);

    ctx.fillStyle = WCOLORS.text; ctx.font = '11px system-ui'; ctx.textAlign = 'left';
    ctx.fillText('Phase lag: ' + phaseDeg.toFixed(1) + '\u00B0', plotL + 10, plotB + 14);
    ctx.fillText('\u03C9_d = ' + wd.toFixed(1) + '   \u03C9\u2080 = ' + w0.toFixed(1), plotL + plotW * 0.5, plotB + 14);

    // Legend
    ctx.fillStyle = WCOLORS.amber; ctx.font = '10px system-ui'; ctx.textAlign = 'right';
    ctx.fillText('F(t) (driving force)', plotR, plotT + 10);
    ctx.fillStyle = WCOLORS.teal;
    ctx.fillText('x(t) (response)', plotR, plotT + 24);
  }

  wdSlider?.addEventListener('input', () => { t = 0; });
  tick();
}

// =========================================================================
// 4. POWER ABSORPTION — elastic vs absorptive
// =========================================================================
function initPowerAbsorption() {
  const canvas = document.getElementById('scene-power-absorption');
  if (!canvas) return;
  const setup = wSetupCanvas(canvas);
  if (!setup) return;
  const { ctx, W, H } = setup;

  let t = 0;
  const plotL = 50, plotR = W - 20, plotT = 30, plotB = H - 30;
  const plotW = plotR - plotL, plotH = plotB - plotT;
  const midY = (plotT + plotB) / 2;

  // Create controls
  let wdSlider = document.getElementById('power-wd');
  if (!wdSlider) {
    const parent = canvas.parentElement;
    if (parent) {
      const controls = document.createElement('div');
      controls.className = 'scene-controls';
      controls.innerHTML = '<label>\u03C9<sub>d</sub>: <input type="range" id="power-wd" min="0.5" max="10" step="0.1" value="5"><span class="scene-val" id="power-wd-val">5.0</span></label>' +
        '<label>\u03B3: <input type="range" id="power-gamma" min="0.1" max="4" step="0.1" value="1"><span class="scene-val" id="power-gamma-val">1.0</span></label>';
      parent.appendChild(controls);
      wdSlider = document.getElementById('power-wd');
    }
  }
  const gammaSlider = document.getElementById('power-gamma');
  const w0 = 5;

  function tick() {
    const wd = parseFloat(wdSlider?.value || 5);
    const gamma = parseFloat(gammaSlider?.value || 1);
    document.getElementById('power-wd-val')?.replaceChildren(document.createTextNode(wd.toFixed(1)));
    document.getElementById('power-gamma-val')?.replaceChildren(document.createTextNode(gamma.toFixed(1)));

    t += 0.02;

    const denom = (w0 * w0 - wd * wd) ** 2 + (gamma * wd) ** 2;
    const A = (w0 * w0 - wd * wd) / denom;
    const B = (gamma * wd) / denom;

    draw(wd, gamma, A, B);
    requestAnimationFrame(tick);
  }

  function draw(wd, gamma, A, B) {
    wClear(ctx, W, H);

    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(plotL, plotT); ctx.lineTo(plotL, plotB); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(plotL, midY); ctx.lineTo(plotR, midY); ctx.stroke();

    const tRange = 3 * 2 * Math.PI / wd;
    const pScale = plotH * 0.3;

    // Power = F * dx/dt = F0 cos(wd t) * wd [-A sin(wd t) + B cos(wd t)]
    // P_elastic = -F0^2 wd A sin(wd t) cos(wd t) = -(F0^2 wd A / 2) sin(2 wd t)
    // P_absorptive = F0^2 wd B cos^2(wd t)
    for (let px = 0; px <= plotW; px++) {
      const tc = (px / plotW) * tRange + t;

      const pElastic = -wd * A * Math.sin(wd * tc) * Math.cos(wd * tc);
      const pAbsorptive = wd * B * Math.cos(wd * tc) * Math.cos(wd * tc);
      const pTotal = pElastic + pAbsorptive;

      const pxCoord = plotL + px;

      // Elastic (fills alternating)
      if (px % 2 === 0) {
        ctx.fillStyle = pElastic > 0 ? 'rgba(37,99,235,0.15)' : 'rgba(37,99,235,0.08)';
        const barH = pElastic * pScale * 10;
        ctx.fillRect(pxCoord, midY - Math.max(barH, 0), 2, Math.abs(barH));
      }
    }

    // Elastic curve
    ctx.strokeStyle = WCOLORS.blue; ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (let px = 0; px <= plotW; px++) {
      const tc = (px / plotW) * tRange + t;
      const pEl = -wd * A * Math.sin(wd * tc) * Math.cos(wd * tc);
      const py = midY - pEl * pScale * 10;
      px === 0 ? ctx.moveTo(plotL + px, py) : ctx.lineTo(plotL + px, py);
    }
    ctx.stroke();

    // Absorptive curve
    ctx.strokeStyle = WCOLORS.red; ctx.lineWidth = 2;
    ctx.beginPath();
    for (let px = 0; px <= plotW; px++) {
      const tc = (px / plotW) * tRange + t;
      const pAb = wd * B * Math.cos(wd * tc) ** 2;
      const py = midY - pAb * pScale * 10;
      px === 0 ? ctx.moveTo(plotL + px, py) : ctx.lineTo(plotL + px, py);
    }
    ctx.stroke();

    // Average power line
    const avgP = wd * B * 0.5;
    const avgPy = midY - avgP * pScale * 10;
    ctx.strokeStyle = WCOLORS.red; ctx.lineWidth = 1; ctx.setLineDash([4, 4]);
    ctx.beginPath(); ctx.moveTo(plotL, avgPy); ctx.lineTo(plotR, avgPy); ctx.stroke();
    ctx.setLineDash([]);

    // Labels
    ctx.fillStyle = WCOLORS.text; ctx.font = '12px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('Power P(t) = F \u00B7 dx/dt', plotL + plotW / 2, plotT - 6);

    ctx.font = '10px system-ui'; ctx.textAlign = 'left';
    ctx.fillStyle = WCOLORS.blue; ctx.fillText('\u2014 Elastic (averages to 0)', plotL + 5, plotB + 14);
    ctx.fillStyle = WCOLORS.red; ctx.fillText('\u2014 Absorptive (always \u2265 0)', plotL + plotW * 0.45, plotB + 14);
    ctx.fillStyle = WCOLORS.textDim; ctx.textAlign = 'right';
    ctx.fillText('\u27E8P\u27E9 = ' + (avgP * 10).toFixed(2), plotR, avgPy - 5);
  }

  wdSlider?.addEventListener('input', () => { t = 0; });
  gammaSlider?.addEventListener('input', () => { t = 0; });
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
    ctx.fillStyle = WCOLORS.textDim; ctx.font = '9px system-ui'; ctx.textAlign = 'right';
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
    ctx.fillText('\u03C9_d', plotR + 10, plotB + 4);

    // Q value and info
    const Q = w0 / gamma;
    ctx.fillStyle = WCOLORS.text; ctx.font = '12px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('Lorentzian resonance: Q = \u03C9\u2080/\u03B3 = ' + Q.toFixed(1), plotL + plotW / 2, plotT - 8);

    // Tick marks on x-axis
    ctx.fillStyle = WCOLORS.textDim; ctx.font = '9px system-ui';
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
    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(plotL, plotMidY); ctx.lineTo(plotR, plotMidY); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(plotL, plotT); ctx.lineTo(plotL, plotB); ctx.stroke();

    ctx.fillStyle = WCOLORS.text; ctx.font = '10px system-ui, sans-serif'; ctx.textAlign = 'right';
    ctx.fillText('0', plotL - 4, plotMidY + 3);
    ctx.textAlign = 'center';
    ctx.fillText('t', plotR + 10, plotMidY + 4);

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

    // Legend
    ctx.fillStyle = WCOLORS.teal; ctx.font = '11px system-ui, sans-serif'; ctx.textAlign = 'left';
    ctx.fillText('x₁(t)', plotR - 80, plotT + 12);
    ctx.fillStyle = WCOLORS.blue;
    ctx.fillText('x₂(t)', plotR - 40, plotT + 12);
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

    // Frequency
    ctx.fillStyle = WCOLORS.textDim; ctx.font = '12px system-ui, sans-serif';
    ctx.fillText(omega, xOff + panelW / 2, H - 14);
  }

  function tick() {
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

    // Labels
    const beatFreq = omegaBeat / Math.PI;
    ctx.fillStyle = WCOLORS.text; ctx.font = '12px system-ui, sans-serif'; ctx.textAlign = 'left';
    ctx.fillText('κ/k = ' + kappaRatio.toFixed(2), 10, 18);
    ctx.fillStyle = WCOLORS.amber; ctx.textAlign = 'right';
    ctx.fillText('f_beat = (ω_a − ω_s)/(2π) = ' + beatFreq.toFixed(3) + ' Hz', W - 10, 18);

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

  function draw() {
    const kappaRatio = parseFloat(kappaSlider?.value || 0.3);
    const k = 4, m = 1, kappa = kappaRatio * k;

    wClear(ctx, W, H);

    // Matrix entries
    const a11 = (k + kappa) / m;
    const a12 = -kappa / m;
    // Eigenvalues: (a11 + a11)/2 ± sqrt((a11-a11)^2/4 + a12^2) => a11 ± |a12|
    const lambdaS = a11 + a12; // = k/m (symmetric)
    const lambdaA = a11 - a12; // = (k + 2κ)/m (antisymmetric)

    // Left side: matrix display
    const matX = 30, matY = 40;

    ctx.fillStyle = WCOLORS.text; ctx.font = 'bold 14px system-ui, sans-serif'; ctx.textAlign = 'left';
    ctx.fillText('Equation of motion matrix  M⁻¹K:', matX, matY);

    // Draw matrix brackets
    const mxL = matX + 10, mxR = matX + 200, myT = matY + 15, myB = matY + 75;
    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 2;
    // Left bracket
    ctx.beginPath();
    ctx.moveTo(mxL + 10, myT); ctx.lineTo(mxL, myT); ctx.lineTo(mxL, myB); ctx.lineTo(mxL + 10, myB);
    ctx.stroke();
    // Right bracket
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

    // Right side: eigenvector plot
    const plotCx = W - 130, plotCy = H / 2 + 10;
    const plotR = 80;

    // Axes
    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(plotCx - plotR - 10, plotCy); ctx.lineTo(plotCx + plotR + 10, plotCy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(plotCx, plotCy - plotR - 10); ctx.lineTo(plotCx, plotCy + plotR + 10); ctx.stroke();

    ctx.fillStyle = WCOLORS.text; ctx.font = '11px system-ui, sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('x₁', plotCx + plotR + 15, plotCy + 4);
    ctx.fillText('x₂', plotCx, plotCy - plotR - 15);

    // Eigenvector 1 (symmetric): (1, 1) / sqrt(2)
    const ev1x = plotR * 0.7, ev1y = -plotR * 0.7;
    ctx.strokeStyle = WCOLORS.teal; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(plotCx, plotCy); ctx.lineTo(plotCx + ev1x, plotCy + ev1y); ctx.stroke();
    // Arrowhead
    drawArrowHead(ctx, plotCx + ev1x, plotCy + ev1y, Math.atan2(ev1y, ev1x), WCOLORS.teal);
    ctx.fillStyle = WCOLORS.teal; ctx.font = 'bold 12px system-ui, sans-serif';
    ctx.fillText('ξ_s = (1,1)', plotCx + ev1x + 5, plotCy + ev1y - 8);

    // Eigenvector 2 (antisymmetric): (1, -1) / sqrt(2)
    const ev2x = plotR * 0.7, ev2y = plotR * 0.7;
    ctx.strokeStyle = WCOLORS.red; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(plotCx, plotCy); ctx.lineTo(plotCx + ev2x, plotCy + ev2y); ctx.stroke();
    drawArrowHead(ctx, plotCx + ev2x, plotCy + ev2y, Math.atan2(ev2y, ev2x), WCOLORS.red);
    ctx.fillStyle = WCOLORS.red; ctx.font = 'bold 12px system-ui, sans-serif';
    ctx.fillText('ξ_a = (1,−1)', plotCx + ev2x + 5, plotCy + ev2y + 16);

    // Eigenvalue display
    const evY = H - 50;
    ctx.fillStyle = WCOLORS.text; ctx.font = 'bold 13px system-ui, sans-serif'; ctx.textAlign = 'left';
    ctx.fillText('Eigenvalues (ω²):', matX, evY);

    ctx.fillStyle = WCOLORS.teal; ctx.font = '13px system-ui, sans-serif';
    ctx.fillText('ω²_s = k/m = ' + lambdaS.toFixed(2) + '   →  ω_s = ' + Math.sqrt(lambdaS).toFixed(2), matX, evY + 22);
    ctx.fillStyle = WCOLORS.red;
    ctx.fillText('ω²_a = (k+2κ)/m = ' + lambdaA.toFixed(2) + '   →  ω_a = ' + Math.sqrt(lambdaA).toFixed(2), matX, evY + 44);

    // κ/k label
    ctx.fillStyle = WCOLORS.text; ctx.font = '12px system-ui, sans-serif'; ctx.textAlign = 'right';
    ctx.fillText('κ/k = ' + kappaRatio.toFixed(2), W - 10, 20);
  }

  function drawArrowHead(ctx, x, y, angle, color) {
    const size = 8;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x - size * Math.cos(angle - 0.4), y - size * Math.sin(angle - 0.4));
    ctx.lineTo(x - size * Math.cos(angle + 0.4), y - size * Math.sin(angle + 0.4));
    ctx.closePath();
    ctx.fill();
  }

  kappaSlider?.addEventListener('input', draw);
  draw();
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
    ctx.fillText(modeLabel, W / 2, 18);

    // Frequency values
    ctx.fillStyle = WCOLORS.textDim; ctx.font = '11px system-ui, sans-serif'; ctx.textAlign = 'left';
    ctx.fillText('ω_s = ' + omegaS.toFixed(2), 10, H - 5);
    ctx.fillText('ω_a = ' + omegaA.toFixed(2), 120, H - 5);

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
      return 1 - xn / Math.PI; // goes from 1 to -1
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
      ctx.lineWidth = 0.8; ctx.globalAlpha = 0.35;
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
    ctx.fillText(typeName + ' wave — ' + nTerms + ' term' + (nTerms > 1 ? 's' : ''), W / 2, 18);

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
      const yVal = 1 - xn / Math.PI;
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
    ctx.fillText('Coefficients b_n', (barL + barR) / 2, plotT - 8);

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
        ctx.fillStyle = WCOLORS.textDim; ctx.font = '8px system-ui, sans-serif'; ctx.textAlign = 'center';
        ctx.fillText(n.toString(), bx + barWidth / 2, plotMidY + (bn > 0 ? 12 : -4));
      }
    }

    // Formula
    ctx.fillStyle = WCOLORS.textDim; ctx.font = '11px system-ui, sans-serif'; ctx.textAlign = 'left';
    ctx.fillText('b_n = (−1)^(n+1) · 2/(πn)', barL, plotB + 14);

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

  const pluckSlider = document.getElementById('pluck-position');
  const speedSlider = document.getElementById('pluck-speed');

  let t = 0;
  const nModes = 12; // number of modes to include

  function tick() {
    const pluckPos = parseFloat(pluckSlider?.value || 0.33); // fractional position along string
    const speed = parseFloat(speedSlider?.value || 1);
    const dt = 0.02 * speed;
    t += dt;

    wClear(ctx, W, H);

    const L = 1; // string length (normalized)

    // Plucked string coefficients: A_n = (2h L^2)/(n^2 π^2 d(L-d)) * sin(nπd/L)
    // where d = pluck position, h = amplitude
    const d = pluckPos * L;
    const h = 1;
    const coeffs = [];
    for (let n = 1; n <= nModes; n++) {
      const An = (2 * h * L * L) / (n * n * Math.PI * Math.PI * d * (L - d)) * Math.sin(n * Math.PI * d / L);
      coeffs.push(An);
    }

    // --- Top: animated string ---
    const strL = 50, strR = W - 50;
    const strY = 80;
    const strW = strR - strL;
    const strHalfH = 50;

    // Fixed ends (walls)
    ctx.fillStyle = WCOLORS.axis;
    ctx.fillRect(strL - 5, strY - 20, 5, 40);
    ctx.fillRect(strR, strY - 20, 5, 40);

    // Equilibrium line
    ctx.strokeStyle = WCOLORS.grid; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(strL, strY); ctx.lineTo(strR, strY); ctx.stroke();

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

    // Animated string
    ctx.strokeStyle = WCOLORS.teal; ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let px = 0; px <= strW; px += 1) {
      const x = px / strW; // 0 to 1
      let y = 0;
      for (let n = 0; n < nModes; n++) {
        const omega_n = (n + 1) * Math.PI; // ω_n = nπc/L, c=1, L=1
        y += coeffs[n] * Math.sin((n + 1) * Math.PI * x) * Math.cos(omega_n * t);
      }
      const py = strY - y * strHalfH;
      px === 0 ? ctx.moveTo(strL + px, py) : ctx.lineTo(strL + px, py);
    }
    ctx.stroke();

    // --- Bottom: individual mode contributions ---
    const modesT = 145, modesB = H - 15;
    const modesH = modesB - modesT;
    const modeMidY = (modesT + modesB) / 2;
    const modeHalfH = modesH / 2 * 0.8;

    // Axes
    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(strL, modeMidY); ctx.lineTo(strR, modeMidY); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(strL, modesT); ctx.lineTo(strL, modesB); ctx.stroke();

    ctx.fillStyle = WCOLORS.text; ctx.font = '11px system-ui, sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('Individual mode contributions', (strL + strR) / 2, modesT - 5);

    // Show first few modes individually (translucent)
    const showModes = Math.min(5, nModes);
    const modeColors = [WCOLORS.teal, WCOLORS.blue, WCOLORS.amber, WCOLORS.red, WCOLORS.orange];
    for (let n = 0; n < showModes; n++) {
      const omega_n = (n + 1) * Math.PI;
      ctx.strokeStyle = modeColors[n % modeColors.length];
      ctx.lineWidth = 1; ctx.globalAlpha = 0.5;
      ctx.beginPath();
      for (let px = 0; px <= strW; px += 2) {
        const x = px / strW;
        const y = coeffs[n] * Math.sin((n + 1) * Math.PI * x) * Math.cos(omega_n * t);
        const py = modeMidY - y * modeHalfH;
        px === 0 ? ctx.moveTo(strL + px, py) : ctx.lineTo(strL + px, py);
      }
      ctx.stroke();
      ctx.globalAlpha = 1.0;
    }

    // Legend for modes
    ctx.font = '9px system-ui, sans-serif'; ctx.textAlign = 'left';
    for (let n = 0; n < showModes; n++) {
      ctx.fillStyle = modeColors[n % modeColors.length];
      ctx.fillText('n=' + (n + 1), strR + 5, modesT + 10 + n * 13);
    }

    // Title
    ctx.fillStyle = WCOLORS.text; ctx.font = '12px system-ui, sans-serif'; ctx.textAlign = 'left';
    ctx.fillText('Pluck at x/L = ' + pluckPos.toFixed(2), 10, 18);

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
    ctx.fillStyle = WCOLORS.textDim; ctx.font = '9px system-ui'; ctx.textAlign = 'right';
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
    ctx.fillStyle = WCOLORS.textDim; ctx.font = '9px system-ui';
    ctx.fillText('\u03C9', dL - 14, botT + 6);
    ctx.fillText('p', dR + 10, botB + 4);

    ctx.font = '9px system-ui'; ctx.textAlign = 'left';
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

      ctx.fillStyle = WCOLORS.red; ctx.font = '9px system-ui'; ctx.textAlign = 'left';
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

  let posSlider = document.getElementById('stw-pos');
  if (!posSlider) {
    const parent = canvas.parentElement;
    if (parent) {
      const controls = document.createElement('div');
      controls.className = 'scene-controls';
      controls.innerHTML =
        '<label>Segment position: <input type="range" id="stw-pos" min="0.1" max="0.9" step="0.01" value="0.5"><span class="scene-val" id="stw-pos-val">0.50</span></label>' +
        '<label>Amplitude: <input type="range" id="stw-amp" min="0.2" max="1.5" step="0.1" value="0.8"><span class="scene-val" id="stw-amp-val">0.8</span></label>';
      parent.appendChild(controls);
      posSlider = document.getElementById('stw-pos');
    }
  }
  const ampSlider = document.getElementById('stw-amp');

  function tick() {
    const segPos = parseFloat(posSlider?.value || 0.5);
    const A = parseFloat(ampSlider?.value || 0.8);
    document.getElementById('stw-pos-val')?.replaceChildren(document.createTextNode(segPos.toFixed(2)));
    document.getElementById('stw-amp-val')?.replaceChildren(document.createTextNode(A.toFixed(1)));

    t += 0.03;
    wClear(ctx, W, H);

    const stringL = 50, stringR = W - 50;
    const stringW = stringR - stringL;
    const midY = H / 2;
    const maxAmp = 60 * A;

    // Wave: Gaussian-modulated sinusoid traveling right
    const v = 2.0;
    const sigma = 0.12;
    function waveY(xFrac, time) {
      const center = ((v * time) % 2.0) - 0.3;
      const dx = xFrac - center;
      return maxAmp * Math.exp(-dx * dx / (2 * sigma * sigma)) * Math.sin(15 * xFrac - 8 * time);
    }

    function waveDY(xFrac, time) {
      const eps = 0.002;
      return (waveY(xFrac + eps, time) - waveY(xFrac - eps, time)) / (2 * eps * stringW);
    }

    function waveD2Y(xFrac, time) {
      const eps = 0.002;
      return (waveY(xFrac + eps, time) - 2 * waveY(xFrac, time) + waveY(xFrac - eps, time)) / ((eps * stringW) * (eps * stringW));
    }

    // Draw string
    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i <= 300; i++) {
      const frac = i / 300;
      const y = waveY(frac, t);
      const px = stringL + frac * stringW;
      i === 0 ? ctx.moveTo(px, midY - y) : ctx.lineTo(px, midY - y);
    }
    ctx.stroke();

    // Equilibrium line
    ctx.strokeStyle = WCOLORS.textDim; ctx.lineWidth = 0.5; ctx.setLineDash([3, 3]);
    ctx.beginPath(); ctx.moveTo(stringL, midY); ctx.lineTo(stringR, midY); ctx.stroke();
    ctx.setLineDash([]);

    // Highlighted segment
    const segFrac = segPos;
    const segPixel = stringL + segFrac * stringW;
    const segY = waveY(segFrac, t);
    const d2y = waveD2Y(segFrac, t);

    ctx.strokeStyle = WCOLORS.red; ctx.lineWidth = 4;
    ctx.beginPath();
    for (let i = -15; i <= 15; i++) {
      const localFrac = segFrac + (i / 300);
      if (localFrac < 0 || localFrac > 1) continue;
      const y = waveY(localFrac, t);
      const px = stringL + localFrac * stringW;
      if (i === -15) ctx.moveTo(px, midY - y); else ctx.lineTo(px, midY - y);
    }
    ctx.stroke();

    // Tension force arrows at ends
    const arrowLen = 40;
    const leftFrac = segFrac - 15 / 300;
    const rightFrac = segFrac + 15 / 300;
    const leftY = waveY(leftFrac, t);
    const rightY = waveY(rightFrac, t);
    const leftSlope = waveDY(leftFrac, t);
    const rightSlope = waveDY(rightFrac, t);

    // Left end
    const leftPx = stringL + leftFrac * stringW;
    const leftPy = midY - leftY;
    const lAngle = Math.atan(-leftSlope * stringW);
    ctx.strokeStyle = WCOLORS.blue; ctx.lineWidth = 2;
    const lDx = -Math.cos(lAngle) * arrowLen;
    const lDy = Math.sin(lAngle) * arrowLen;
    ctx.beginPath(); ctx.moveTo(leftPx, leftPy); ctx.lineTo(leftPx + lDx, leftPy + lDy); ctx.stroke();
    ctx.fillStyle = WCOLORS.blue;
    const lAx = leftPx + lDx, lAy = leftPy + lDy;
    ctx.beginPath();
    ctx.moveTo(lAx, lAy);
    ctx.lineTo(lAx + 8 * Math.cos(lAngle + 0.4), lAy - 8 * Math.sin(lAngle + 0.4));
    ctx.lineTo(lAx + 8 * Math.cos(lAngle - 0.4), lAy - 8 * Math.sin(lAngle - 0.4));
    ctx.closePath(); ctx.fill();

    // Right end
    const rightPx = stringL + rightFrac * stringW;
    const rightPy = midY - rightY;
    const rAngle = Math.atan(-rightSlope * stringW);
    const rDx = Math.cos(rAngle) * arrowLen;
    const rDy = -Math.sin(rAngle) * arrowLen;
    ctx.strokeStyle = WCOLORS.blue; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(rightPx, rightPy); ctx.lineTo(rightPx + rDx, rightPy + rDy); ctx.stroke();
    ctx.fillStyle = WCOLORS.blue;
    const rAx = rightPx + rDx, rAy = rightPy + rDy;
    ctx.beginPath();
    ctx.moveTo(rAx, rAy);
    ctx.lineTo(rAx - 8 * Math.cos(rAngle + 0.4), rAy + 8 * Math.sin(rAngle + 0.4));
    ctx.lineTo(rAx - 8 * Math.cos(rAngle - 0.4), rAy + 8 * Math.sin(rAngle - 0.4));
    ctx.closePath(); ctx.fill();

    // Net transverse force (proportional to curvature)
    const netForce = d2y * 8000;
    const clampedForce = Math.max(-40, Math.min(40, netForce));
    if (Math.abs(clampedForce) > 2) {
      ctx.strokeStyle = WCOLORS.red; ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(segPixel, midY - segY);
      ctx.lineTo(segPixel, midY - segY - clampedForce);
      ctx.stroke();
      ctx.fillStyle = WCOLORS.red;
      const tipY = midY - segY - clampedForce;
      const dir = clampedForce > 0 ? -1 : 1;
      ctx.beginPath();
      ctx.moveTo(segPixel, tipY);
      ctx.lineTo(segPixel - 5, tipY + dir * 8);
      ctx.lineTo(segPixel + 5, tipY + dir * 8);
      ctx.closePath(); ctx.fill();
    }

    // Labels
    ctx.fillStyle = WCOLORS.text; ctx.font = '12px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('Transverse Wave on a String', W / 2, 16);

    ctx.font = '10px system-ui';
    ctx.fillStyle = WCOLORS.blue; ctx.textAlign = 'left';
    ctx.fillText('T (tension)', 10, H - 25);
    ctx.fillStyle = WCOLORS.red;
    ctx.fillText('F_net \u221D curvature \u2202\u00B2y/\u2202x\u00B2', 10, H - 10);

    const curvature = d2y * 1000;
    ctx.fillStyle = WCOLORS.textDim; ctx.font = '10px system-ui'; ctx.textAlign = 'right';
    const curvLabel = Math.abs(curvature) < 0.5 ? 'Flat (no net force)' : ('Curved: F_net ' + (curvature > 0 ? '\u2191' : '\u2193'));
    ctx.fillText(curvLabel, W - 10, H - 10);

    requestAnimationFrame(tick);
  }

  posSlider?.addEventListener('input', () => {});
  ampSlider?.addEventListener('input', () => {});
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

  let wlSlider = document.getElementById('swl-wl');
  if (!wlSlider) {
    const parent = canvas.parentElement;
    if (parent) {
      const controls = document.createElement('div');
      controls.className = 'scene-controls';
      controls.innerHTML =
        '<label>Wavelength: <input type="range" id="swl-wl" min="40" max="200" step="5" value="100"><span class="scene-val" id="swl-wl-val">100</span></label>';
      parent.appendChild(controls);
      wlSlider = document.getElementById('swl-wl');
    }
  }

  let t = 0;
  const gridCols = 50;
  const gridRows = 10;

  function tick() {
    const wavelength = parseFloat(wlSlider?.value || 100);
    document.getElementById('swl-wl-val')?.replaceChildren(document.createTextNode(wavelength.toFixed(0)));

    t += 0.05;
    wClear(ctx, W, H);

    const gridL = 30;
    const gridR = W - 30;
    const gridT = 40;
    const gridB = H - 50;
    const gridW = gridR - gridL;
    const gridH = gridB - gridT;

    const k = 2 * Math.PI / wavelength;
    const omega = k * 80;
    const ampDisp = 8;

    ctx.fillStyle = WCOLORS.text; ctx.font = '12px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('Longitudinal Sound Wave: Compression & Rarefaction', W / 2, 16);

    // Molecules
    for (let row = 0; row < gridRows; row++) {
      const baseY = gridT + (row + 0.5) * gridH / gridRows;
      for (let col = 0; col < gridCols; col++) {
        const baseX = gridL + (col + 0.5) * gridW / gridCols;
        const disp = ampDisp * Math.sin(k * baseX - omega * t);
        const density = -k * ampDisp * Math.cos(k * baseX - omega * t);
        const normDens = density / (k * ampDisp);

        const r = Math.round(15 + 20 * normDens);
        const g = Math.round(42 + 30 * normDens);
        const b = Math.round(46 + 30 * normDens);
        const alpha = 0.4 + 0.5 * (1 + normDens) / 2;
        const radius = 2.2 + 0.8 * (1 + normDens) / 2;

        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
        ctx.beginPath();
        ctx.arc(baseX + disp, baseY, radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Density color bar
    const barL = gridL + 20, barR = gridR - 20, barY = gridB + 14, barH = 10;
    for (let px = barL; px <= barR; px++) {
      const frac = (px - barL) / (barR - barL);
      const val = Math.sin(k * (gridL + frac * gridW) - omega * t);
      const dens = -val;
      const normD = (dens + 1) / 2;
      const cR = Math.round(15 + 40 * normD);
      const cG = Math.round(42 + 60 * normD);
      const cB = Math.round(46 + 60 * normD);
      ctx.fillStyle = `rgb(${cR}, ${cG}, ${cB})`;
      ctx.fillRect(px, barY, 1, barH);
    }

    ctx.fillStyle = WCOLORS.textDim; ctx.font = '9px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('Compression', barL + 30, barY + barH + 12);
    ctx.fillText('Rarefaction', barR - 30, barY + barH + 12);

    // Wavelength bracket
    if (wavelength < gridW - 20) {
      const bY = gridT - 5;
      const bL2 = gridL + gridW * 0.3;
      const bR2 = bL2 + wavelength;
      if (bR2 < gridR) {
        ctx.strokeStyle = WCOLORS.amber; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(bL2, bY); ctx.lineTo(bR2, bY); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(bL2, bY - 4); ctx.lineTo(bL2, bY + 4); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(bR2, bY - 4); ctx.lineTo(bR2, bY + 4); ctx.stroke();
        ctx.fillStyle = WCOLORS.amber; ctx.font = '10px system-ui'; ctx.textAlign = 'center';
        ctx.fillText('\u03BB = ' + wavelength.toFixed(0) + ' px', (bL2 + bR2) / 2, bY - 6);
      }
    }

    requestAnimationFrame(tick);
  }

  wlSlider?.addEventListener('input', () => {});
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
      ctx.fillRect(stringL - 6, midY - 30, 5, 60);
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
      ctx.fillRect(stringR + 1, midY - 30, 5, 60);
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
      ctx.beginPath(); ctx.arc(stringR + 2, freeY, 5, 0, Math.PI * 2); ctx.stroke();
    }
    if (bcType === 2) {
      const leftFreeY = midY - modeShape(0, n, bcType) * cosT * maxAmp;
      const rightFreeY = midY - modeShape(1, n, bcType) * cosT * maxAmp;
      ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(stringL - 2, midY - 50); ctx.lineTo(stringL - 2, midY + 50); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(stringR + 2, midY - 50); ctx.lineTo(stringR + 2, midY + 50); ctx.stroke();
      ctx.strokeStyle = WCOLORS.teal; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(stringL - 2, leftFreeY, 5, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.arc(stringR + 2, rightFreeY, 5, 0, Math.PI * 2); ctx.stroke();
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

    ctx.fillStyle = WCOLORS.teal; ctx.font = '11px system-ui';
    ctx.fillText(modeFreqLabel(n, bcType), W / 2, H - 8);

    ctx.font = '9px system-ui'; ctx.textAlign = 'left';
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
        ctx.strokeStyle = WCOLORS.grid; ctx.lineWidth = 0.5;
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

        // Frequency label
        ctx.fillStyle = WCOLORS.textDim; ctx.font = '9px system-ui'; ctx.textAlign = 'center';
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
    ctx.fillStyle = WCOLORS.text; ctx.font = '10px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('Neck air = mass', springX, massBlockY - 20);
    ctx.fillText('Body air = spring', springX, springBot2 + 18);

    ctx.fillStyle = WCOLORS.textDim; ctx.font = '9px system-ui'; ctx.textAlign = 'left';
    ctx.fillText('A (neck area)', bottleX + neckW / 2 + 5, neckTop + neckH / 2);
    ctx.fillText('L (neck length)', bottleX + neckW / 2 + 5, neckTop + neckH / 2 + 12);
    ctx.fillText('V (body volume)', bottleX + bodyW / 2 + 5, bottleCenterY);

    ctx.fillStyle = WCOLORS.text; ctx.font = '12px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('Helmholtz Resonator', W / 2, 16);

    ctx.fillStyle = WCOLORS.teal; ctx.font = '11px system-ui';
    ctx.fillText('f = (c\u209B/2\u03C0)\u221A(A/VL) = ' + fRes.toFixed(1) + ' Hz', W / 2, H - 8);

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

  let t = 0;

  function tick() {
    const df = parseFloat(dfSlider?.value || 3);
    document.getElementById('bd-df-val')?.replaceChildren(document.createTextNode(df.toFixed(1)));

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

    ctx.font = '9px system-ui'; ctx.textAlign = 'left';
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
      ctx.fillStyle = WCOLORS.textDim; ctx.font = '9px system-ui'; ctx.textAlign = 'right';
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

  let t = 0;

  function tick() {
    const ratio = parseFloat(ratioSlider?.value || 1.5);
    document.getElementById('cd-ratio-val')?.replaceChildren(document.createTextNode(ratio.toFixed(2)));

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
      ctx.beginPath(); ctx.moveTo(px, specBot); ctx.lineTo(px, specTop + 10); ctx.stroke();
      ctx.globalAlpha = 1;

      ctx.fillStyle = WCOLORS.teal; ctx.font = '8px system-ui'; ctx.textAlign = 'center';
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

      ctx.strokeStyle = matched ? '#16a34a' : (nearBeat ? WCOLORS.red : WCOLORS.amber);
      ctx.lineWidth = matched ? 3 : 1.5;
      ctx.globalAlpha = matched ? 1 : 0.6;
      ctx.setLineDash(matched ? [] : [3, 2]);
      ctx.beginPath(); ctx.moveTo(px, specBot); ctx.lineTo(px, specTop + 25); ctx.stroke();
      ctx.setLineDash([]);
      ctx.globalAlpha = 1;

      ctx.fillStyle = WCOLORS.amber; ctx.font = '8px system-ui'; ctx.textAlign = 'center';
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
    ctx.fillStyle = '#16a34a'; ctx.fillText('\u25CF aligned', specL, specTop + 6);
    ctx.fillStyle = WCOLORS.red; ctx.fillText('\u25CF near-beat', specL + 55, specTop + 6);

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

  let selected = 1;

  intervals.forEach((iv, i) => {
    document.getElementById('ha-btn-' + i)?.addEventListener('click', () => {
      selected = i;
      draw();
    });
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
    ctx.fillStyle = WCOLORS.textDim; ctx.font = '9px system-ui'; ctx.textAlign = 'center';
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

      ctx.fillStyle = WCOLORS.textDim; ctx.font = '8px system-ui'; ctx.textAlign = 'center';
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

      ctx.fillStyle = WCOLORS.textDim; ctx.font = '8px system-ui'; ctx.textAlign = 'center';
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

  document.getElementById('cof-et')?.addEventListener('click', () => { tuning = 0; updateBtns(); draw(); });
  document.getElementById('cof-py')?.addEventListener('click', () => { tuning = 1; updateBtns(); draw(); });
  const noteSlider = document.getElementById('cof-note');
  noteSlider?.addEventListener('input', () => { highlighted = parseInt(noteSlider.value); draw(); });

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
      const radius = isHL ? 16 : 12;
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

      ctx.strokeStyle = WCOLORS.red; ctx.lineWidth = 2;
      const startA = -Math.PI / 2;
      const endA = overshootAngle;
      ctx.beginPath();
      ctx.arc(cx, cy, R + 20, Math.min(startA, endA), Math.max(startA, endA));
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
    ctx.fillStyle = WCOLORS.textDim; ctx.font = '8px system-ui'; ctx.textAlign = 'center';
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
      ctx.font = '9px system-ui';
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

  function tick() {
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
    const pulseSpeed = 0.8;
    const pulseX = ((t * pulseSpeed * (W - 80) / (2 * Math.PI)) % (W + 100)) - 50;
    const pulseWidth = 60;

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

  const transY = H * 0.28;
  const longY = H * 0.72;

  function tick() {
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

    const k = 0.3;
    const omega = 2;

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
    ctx.font = '9px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('disp.', arrowX1, transY - 24);

    // Propagation arrow (horizontal)
    const propArrowY = transY + 35;
    ctx.strokeStyle = WCOLORS.red; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(W / 2 - 40, propArrowY); ctx.lineTo(W / 2 + 40, propArrowY); ctx.stroke();
    ctx.fillStyle = WCOLORS.red;
    ctx.beginPath(); ctx.moveTo(W / 2 + 40, propArrowY); ctx.lineTo(W / 2 + 34, propArrowY - 4); ctx.lineTo(W / 2 + 34, propArrowY + 4); ctx.closePath(); ctx.fill();
    ctx.font = '9px system-ui'; ctx.fillText('propagation →', W / 2, propArrowY + 13);

    // --- Longitudinal ---
    ctx.strokeStyle = WCOLORS.grid; ctx.lineWidth = 1; ctx.setLineDash([3, 3]);
    ctx.beginPath(); ctx.moveTo(60, longY); ctx.lineTo(W - 60, longY); ctx.stroke();
    ctx.setLineDash([]);

    for (let i = 0; i < N; i++) {
      const eqX = 70 + i * spacing;
      const dx = amp * 0.7 * Math.sin(k * eqX - omega * t);
      const px = eqX + dx;

      // Color by compression/rarefaction
      const density = -amp * 0.7 * k * Math.cos(k * eqX - omega * t);
      const c = density > 0 ? WCOLORS.blue : WCOLORS.red;
      ctx.fillStyle = c;
      ctx.globalAlpha = 0.4 + 0.6 * Math.min(Math.abs(density) / (amp * 0.7 * k), 1);
      ctx.beginPath(); ctx.arc(px, longY, 4, 0, 2 * Math.PI); ctx.fill();
      ctx.globalAlpha = 1;
    }

    // Displacement arrow (horizontal)
    ctx.strokeStyle = WCOLORS.amber; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(arrowX1 - 15, longY); ctx.lineTo(arrowX1 + 15, longY); ctx.stroke();
    ctx.fillStyle = WCOLORS.amber;
    ctx.beginPath(); ctx.moveTo(arrowX1 + 15, longY); ctx.lineTo(arrowX1 + 9, longY - 4); ctx.lineTo(arrowX1 + 9, longY + 4); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(arrowX1 - 15, longY); ctx.lineTo(arrowX1 - 9, longY - 4); ctx.lineTo(arrowX1 - 9, longY + 4); ctx.closePath(); ctx.fill();
    ctx.font = '9px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('disp.', arrowX1, longY - 10);

    // Propagation arrow
    const propArrowY2 = longY + 25;
    ctx.strokeStyle = WCOLORS.red; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(W / 2 - 40, propArrowY2); ctx.lineTo(W / 2 + 40, propArrowY2); ctx.stroke();
    ctx.fillStyle = WCOLORS.red;
    ctx.beginPath(); ctx.moveTo(W / 2 + 40, propArrowY2); ctx.lineTo(W / 2 + 34, propArrowY2 - 4); ctx.lineTo(W / 2 + 34, propArrowY2 + 4); ctx.closePath(); ctx.fill();
    ctx.font = '9px system-ui'; ctx.fillText('propagation →', W / 2, propArrowY2 + 13);

    // Compression/rarefaction labels
    ctx.fillStyle = WCOLORS.blue; ctx.font = '9px system-ui'; ctx.textAlign = 'left';
    ctx.fillText('● compression', 20, H - 8);
    ctx.fillStyle = WCOLORS.red; ctx.fillText('● rarefaction', 120, H - 8);
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
    ctx.fillStyle = WCOLORS.red; ctx.font = '9px system-ui'; ctx.textAlign = 'left';
    ctx.fillText('Hot', lx + 3, groundY - 5);
    ctx.fillStyle = WCOLORS.blue;
    ctx.fillText('Cold', lx + 3, panelT + 15);

    // Speed labels
    ctx.fillStyle = WCOLORS.textDim; ctx.font = '9px system-ui'; ctx.textAlign = 'right';
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
    ctx.fillStyle = WCOLORS.red; ctx.font = '9px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('Shadow zone', lx + panelW * 0.75, groundY - 15);

    // Source marker
    ctx.fillStyle = WCOLORS.amber;
    ctx.beginPath(); ctx.arc(srcX, srcY, 5, 0, 2 * Math.PI); ctx.fill();
    ctx.fillStyle = WCOLORS.text; ctx.font = '8px system-ui'; ctx.textAlign = 'center';
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
    ctx.fillStyle = WCOLORS.blue; ctx.font = '9px system-ui'; ctx.textAlign = 'left';
    ctx.fillText('Cool', rx + 3, groundY - 5);
    ctx.fillStyle = WCOLORS.red;
    ctx.fillText('Warm', rx + 3, panelT + 15);

    // Speed labels
    ctx.fillStyle = WCOLORS.textDim; ctx.font = '9px system-ui'; ctx.textAlign = 'right';
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
    ctx.fillStyle = WCOLORS.text; ctx.font = '8px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('src', srcX2, srcY2 + 14);

    // Sound travels far label
    ctx.fillStyle = WCOLORS.teal; ctx.font = '9px system-ui'; ctx.textAlign = 'center';
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
      const eVal = Math.sin(2 * Math.PI * kk * 1.5 - t * 2);
      const p = to2D(kk, eVal * 0.7, 0);
      if (i === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
    }
    ctx.stroke();

    // E field arrows at intervals
    const nArrows = 16;
    for (let i = 0; i <= nArrows; i++) {
      const kk = -1 + 2 * i / nArrows;
      const eVal = Math.sin(2 * Math.PI * kk * 1.5 - t * 2);
      const base = to2D(kk, 0, 0);
      const tip = to2D(kk, eVal * 0.7, 0);
      ctx.strokeStyle = WCOLORS.blue; ctx.lineWidth = 1; ctx.globalAlpha = 0.5;
      ctx.beginPath(); ctx.moveTo(base.x, base.y); ctx.lineTo(tip.x, tip.y); ctx.stroke();
      ctx.globalAlpha = 1;
    }

    // Draw B field wave (red, horizontal oscillations, 90deg from E but in phase)
    ctx.strokeStyle = WCOLORS.red; ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i <= nPts; i++) {
      const kk = -1 + 2 * i / nPts;
      const bVal = Math.sin(2 * Math.PI * kk * 1.5 - t * 2);
      const p = to2D(kk, 0, bVal * 0.7);
      if (i === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
    }
    ctx.stroke();

    // B field arrows at intervals
    for (let i = 0; i <= nArrows; i++) {
      const kk = -1 + 2 * i / nArrows;
      const bVal = Math.sin(2 * Math.PI * kk * 1.5 - t * 2);
      const base = to2D(kk, 0, 0);
      const tip = to2D(kk, 0, bVal * 0.7);
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

function initLinearPolarization() {
  const canvas = document.getElementById('scene-linear-polarization');
  if (!canvas) return;
  const setup = wSetupCanvas(canvas);
  if (!setup) return;
  const { ctx, W, H } = setup;

  let angleSlider = document.getElementById('linear-pol-angle');
  if (!angleSlider) {
    const parent = canvas.parentElement;
    if (parent) {
      const controls = document.createElement('div');
      controls.className = 'scene-controls';
      controls.innerHTML = '<label>Polarization angle θ: <input type="range" id="linear-pol-angle" min="0" max="180" step="1" value="0"><span class="scene-val" id="linear-pol-angle-val">0°</span></label>';
      parent.appendChild(controls);
      angleSlider = document.getElementById('linear-pol-angle');
    }
  }

  let t = 0;

  function tick() {
    t += 0.04;
    wClear(ctx, W, H);
    draw();
    requestAnimationFrame(tick);
  }

  function draw() {
    const theta = parseFloat(angleSlider?.value || 0) * Math.PI / 180;
    document.getElementById('linear-pol-angle-val')?.replaceChildren(document.createTextNode((theta * 180 / Math.PI).toFixed(0) + '°'));

    ctx.fillStyle = WCOLORS.text; ctx.font = 'bold 12px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('Linear polarization', W / 2, 16);

    // --- Wave view (left side) ---
    const waveL = 30, waveR = W * 0.6, waveY = H / 2;
    const nPts = 80;
    const amp = 35;
    const k = 0.12;

    // Propagation axis
    ctx.strokeStyle = WCOLORS.textDim; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(waveL, waveY); ctx.lineTo(waveR, waveY); ctx.stroke();

    // E-field arrows along wave
    const cosT = Math.cos(theta), sinT = Math.sin(theta);
    const nArrows = 20;
    ctx.strokeStyle = WCOLORS.teal; ctx.lineWidth = 1.5;
    for (let i = 0; i <= nArrows; i++) {
      const x = waveL + i * (waveR - waveL) / nArrows;
      const val = amp * Math.sin(k * x - t * 2);
      const ey = val * cosT;
      // For the wave view, show only vertical component visually
      ctx.beginPath(); ctx.moveTo(x, waveY); ctx.lineTo(x, waveY - ey); ctx.stroke();
    }

    // Wave curve (projected vertical component)
    ctx.strokeStyle = WCOLORS.teal; ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i <= nPts; i++) {
      const x = waveL + i * (waveR - waveL) / nPts;
      const val = amp * Math.sin(k * x - t * 2) * cosT;
      if (i === 0) ctx.moveTo(x, waveY - val); else ctx.lineTo(x, waveY - val);
    }
    ctx.stroke();

    // Propagation arrow
    ctx.fillStyle = WCOLORS.textDim; ctx.font = '10px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('propagation →', (waveL + waveR) / 2, waveY + 25);

    // --- Cross-section view (right side) ---
    const cxPos = W * 0.8, cyPos = H / 2;
    const radius = Math.min(H / 2 - 30, 50);

    // Circle outline
    ctx.strokeStyle = WCOLORS.grid; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(cxPos, cyPos, radius, 0, 2 * Math.PI); ctx.stroke();

    // Axes
    ctx.strokeStyle = WCOLORS.textDim; ctx.lineWidth = 0.5;
    ctx.beginPath(); ctx.moveTo(cxPos - radius - 10, cyPos); ctx.lineTo(cxPos + radius + 10, cyPos); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cxPos, cyPos - radius - 10); ctx.lineTo(cxPos, cyPos + radius + 10); ctx.stroke();

    // E-vector direction line (the fixed direction of oscillation)
    const lineLen = radius + 5;
    ctx.strokeStyle = WCOLORS.teal; ctx.lineWidth = 2; ctx.setLineDash([4, 3]);
    ctx.beginPath();
    ctx.moveTo(cxPos - lineLen * Math.sin(theta), cyPos - lineLen * Math.cos(theta));
    ctx.lineTo(cxPos + lineLen * Math.sin(theta), cyPos + lineLen * Math.cos(theta));
    ctx.stroke();
    ctx.setLineDash([]);

    // Current E-vector tip
    const eNow = Math.sin(-t * 2);
    const tipX = cxPos + eNow * radius * Math.sin(theta);
    const tipY = cyPos - eNow * radius * Math.cos(theta);

    // E arrow from center
    ctx.strokeStyle = WCOLORS.teal; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(cxPos, cyPos); ctx.lineTo(tipX, tipY); ctx.stroke();
    ctx.fillStyle = WCOLORS.teal;
    ctx.beginPath(); ctx.arc(tipX, tipY, 4, 0, 2 * Math.PI); ctx.fill();

    // Labels
    ctx.fillStyle = WCOLORS.teal; ctx.font = 'bold 11px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('E', tipX + 12, tipY - 5);
    ctx.fillStyle = WCOLORS.textDim; ctx.font = '10px system-ui';
    ctx.fillText('End-on view', cxPos, cyPos + radius + 25);
    ctx.fillText('(tip traces a line)', cxPos, cyPos + radius + 38);

    ctx.fillStyle = WCOLORS.text; ctx.font = '10px system-ui'; ctx.textAlign = 'left';
    ctx.fillText('θ = ' + (theta * 180 / Math.PI).toFixed(0) + '°', cxPos - radius, cyPos - radius - 12);
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

  // Toggle button
  const parent = canvas.parentElement;
  let toggleBtn = document.getElementById('circ-pol-toggle');
  if (!toggleBtn && parent) {
    const controls = document.createElement('div');
    controls.className = 'scene-controls';
    controls.innerHTML = '<button id="circ-pol-toggle" style="padding:3px 14px;font-size:11px;cursor:pointer;">RCP (right-circular)</button>';
    parent.appendChild(controls);
    toggleBtn = document.getElementById('circ-pol-toggle');
  }
  toggleBtn?.addEventListener('click', () => {
    handedness *= -1;
    toggleBtn.textContent = handedness > 0 ? 'RCP (right-circular)' : 'LCP (left-circular)';
  });

  // 3D projection
  const cx = W * 0.35, cy = H / 2;
  const axisLen = W * 0.28;
  const projK = { x: 0.85, y: 0.3 };
  const projE = { x: 0, y: -1 };
  const projB = { x: -0.45, y: 0.2 };

  function to2D(kk, e, b) {
    return {
      x: cx + kk * projK.x * axisLen + e * projE.x * 40 + b * projB.x * 40,
      y: cy + kk * projK.y * axisLen + e * projE.y * 40 + b * projB.y * 40
    };
  }

  function tick() {
    t += 0.03;
    wClear(ctx, W, H);
    draw();
    requestAnimationFrame(tick);
  }

  function draw() {
    ctx.fillStyle = WCOLORS.text; ctx.font = 'bold 12px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('Circular polarization', W / 2, 16);

    // k axis
    const kStart = to2D(-1.1, 0, 0);
    const kEnd = to2D(1.2, 0, 0);
    ctx.strokeStyle = WCOLORS.textDim; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(kStart.x, kStart.y); ctx.lineTo(kEnd.x, kEnd.y); ctx.stroke();
    ctx.fillStyle = WCOLORS.text; ctx.font = 'bold 12px system-ui'; ctx.textAlign = 'left';
    ctx.fillText('k', kEnd.x + 5, kEnd.y);

    // Helical path of E-field tip
    const nPts = 200;
    ctx.strokeStyle = WCOLORS.teal; ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i <= nPts; i++) {
      const kk = -1 + 2 * i / nPts;
      const phase = 2 * Math.PI * kk * 1.5 - t * 2;
      const eVal = Math.cos(phase);
      const bVal = handedness * Math.sin(phase);
      const p = to2D(kk, eVal * 0.8, bVal * 0.8);
      if (i === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
    }
    ctx.stroke();

    // E-field arrows at intervals
    const nArrows = 20;
    for (let i = 0; i <= nArrows; i++) {
      const kk = -1 + 2 * i / nArrows;
      const phase = 2 * Math.PI * kk * 1.5 - t * 2;
      const eVal = Math.cos(phase);
      const bVal = handedness * Math.sin(phase);
      const base = to2D(kk, 0, 0);
      const tip = to2D(kk, eVal * 0.8, bVal * 0.8);
      ctx.strokeStyle = WCOLORS.teal; ctx.lineWidth = 0.8; ctx.globalAlpha = 0.35;
      ctx.beginPath(); ctx.moveTo(base.x, base.y); ctx.lineTo(tip.x, tip.y); ctx.stroke();
      ctx.globalAlpha = 1;
    }

    // --- Cross-section circle (right side) ---
    const cxR = W * 0.78, cyR = H / 2;
    const radius = Math.min(H / 2 - 35, 50);

    // Circle
    ctx.strokeStyle = WCOLORS.grid; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(cxR, cyR, radius, 0, 2 * Math.PI); ctx.stroke();

    // Axes
    ctx.strokeStyle = WCOLORS.textDim; ctx.lineWidth = 0.5;
    ctx.beginPath(); ctx.moveTo(cxR - radius - 8, cyR); ctx.lineTo(cxR + radius + 8, cyR); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cxR, cyR - radius - 8); ctx.lineTo(cxR, cyR + radius + 8); ctx.stroke();

    // Trail of tip positions
    ctx.strokeStyle = WCOLORS.teal; ctx.lineWidth = 1.5; ctx.globalAlpha = 0.3;
    ctx.beginPath();
    for (let i = 0; i <= 60; i++) {
      const phase = -t * 2 - i * 0.1;
      const ex = radius * 0.8 * Math.cos(phase);
      const ey = radius * 0.8 * handedness * Math.sin(phase);
      if (i === 0) ctx.moveTo(cxR + ex, cyR - ey); else ctx.lineTo(cxR + ex, cyR - ey);
    }
    ctx.stroke();
    ctx.globalAlpha = 1;

    // Current E vector
    const phase0 = -t * 2;
    const tipEx = radius * 0.8 * Math.cos(phase0);
    const tipEy = radius * 0.8 * handedness * Math.sin(phase0);

    ctx.strokeStyle = WCOLORS.teal; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(cxR, cyR); ctx.lineTo(cxR + tipEx, cyR - tipEy); ctx.stroke();
    ctx.fillStyle = WCOLORS.teal;
    ctx.beginPath(); ctx.arc(cxR + tipEx, cyR - tipEy, 4, 0, 2 * Math.PI); ctx.fill();

    // Rotation arrow hint
    const arrPhase = phase0 + 0.3 * handedness;
    const arrX = cxR + radius * 0.4 * Math.cos(arrPhase);
    const arrY = cyR - radius * 0.4 * handedness * Math.sin(arrPhase);
    ctx.fillStyle = WCOLORS.amber; ctx.font = '14px system-ui'; ctx.textAlign = 'center';
    ctx.fillText(handedness > 0 ? '↻' : '↺', arrX, arrY);

    // Labels
    ctx.fillStyle = WCOLORS.teal; ctx.font = 'bold 11px system-ui';
    ctx.fillText('E', cxR + tipEx + 10, cyR - tipEy);
    ctx.fillStyle = WCOLORS.textDim; ctx.font = '10px system-ui';
    ctx.fillText('End-on view', cxR, cyR + radius + 22);
    ctx.fillText(handedness > 0 ? 'Right-circular' : 'Left-circular', cxR, cyR + radius + 36);
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

  let thetaSlider = document.getElementById('malus-theta');
  if (!thetaSlider) {
    const parent = canvas.parentElement;
    if (parent) {
      const controls = document.createElement('div');
      controls.className = 'scene-controls';
      controls.innerHTML = '<label>Polarizer angle θ: <input type="range" id="malus-theta" min="0" max="90" step="1" value="0"><span class="scene-val" id="malus-theta-val">0°</span></label>';
      parent.appendChild(controls);
      thetaSlider = document.getElementById('malus-theta');
    }
  }

  let t = 0;

  function tick() {
    t += 0.03;
    wClear(ctx, W, H);
    draw();
    requestAnimationFrame(tick);
  }

  function draw() {
    const thetaDeg = parseFloat(thetaSlider?.value || 0);
    const theta = thetaDeg * Math.PI / 180;
    document.getElementById('malus-theta-val')?.replaceChildren(document.createTextNode(thetaDeg + '°'));

    const I = Math.cos(theta) * Math.cos(theta);

    ctx.fillStyle = WCOLORS.text; ctx.font = 'bold 12px system-ui'; ctx.textAlign = 'center';
    ctx.fillText("Malus' law: I = I₀ cos²θ", W / 2, 16);

    // --- Left: Polarizer diagram ---
    const diagCx = W * 0.22, diagCy = H * 0.48;

    // Incident light (vertical polarization)
    const waveX = 30;
    ctx.strokeStyle = WCOLORS.blue; ctx.lineWidth = 2;
    for (let y = diagCy - 30; y <= diagCy + 30; y += 15) {
      const osc = 8 * Math.sin(y * 0.2 - t * 3);
      ctx.beginPath(); ctx.moveTo(waveX, y); ctx.lineTo(waveX + osc, y); ctx.stroke();
    }
    ctx.fillStyle = WCOLORS.blue; ctx.font = '10px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('E₀ (vertical)', waveX + 5, diagCy - 40);

    // Polarizer
    const polX = diagCx;
    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 3;
    const polH = 55;
    ctx.beginPath();
    ctx.moveTo(polX + polH * Math.sin(theta), diagCy - polH * Math.cos(theta));
    ctx.lineTo(polX - polH * Math.sin(theta), diagCy + polH * Math.cos(theta));
    ctx.stroke();

    // Transmission axis
    ctx.strokeStyle = WCOLORS.amber; ctx.lineWidth = 1.5; ctx.setLineDash([4, 3]);
    ctx.beginPath();
    ctx.moveTo(polX - polH * 0.8 * Math.sin(theta), diagCy + polH * 0.8 * Math.cos(theta));
    ctx.lineTo(polX + polH * 0.8 * Math.sin(theta), diagCy - polH * 0.8 * Math.cos(theta));
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = WCOLORS.amber; ctx.font = '9px system-ui'; ctx.textAlign = 'left';
    ctx.fillText('axis', polX + polH * 0.8 * Math.sin(theta) + 4, diagCy - polH * 0.8 * Math.cos(theta));

    ctx.fillStyle = WCOLORS.text; ctx.font = '9px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('Polarizer', polX, diagCy + polH + 15);

    // Transmitted light
    const txX = polX + 40;
    const txAmp = 8 * Math.cos(theta);
    if (Math.abs(txAmp) > 0.5) {
      ctx.strokeStyle = WCOLORS.teal; ctx.lineWidth = 2;
      ctx.globalAlpha = I;
      for (let y = diagCy - 30; y <= diagCy + 30; y += 15) {
        const osc = txAmp * Math.sin(y * 0.2 - t * 3);
        ctx.beginPath(); ctx.moveTo(txX + 10, y); ctx.lineTo(txX + 10 + osc, y); ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }

    // Intensity bar
    const barL = W * 0.05, barR = W * 0.38, barY = H - 30, barH2 = 12;
    ctx.fillStyle = WCOLORS.grid;
    ctx.fillRect(barL, barY, barR - barL, barH2);
    const iColor = `rgba(15, 118, 110, ${0.3 + 0.7 * I})`;
    ctx.fillStyle = iColor;
    ctx.fillRect(barL, barY, (barR - barL) * I, barH2);
    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 0.5;
    ctx.strokeRect(barL, barY, barR - barL, barH2);
    ctx.fillStyle = WCOLORS.text; ctx.font = '10px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('I/I₀ = ' + I.toFixed(3), (barL + barR) / 2, barY - 4);

    // --- Right: I(θ) plot ---
    const plotL = W * 0.52, plotR = W - 20, plotT = 35, plotB = H - 20;
    const plotW = plotR - plotL, plotH2 = plotB - plotT;

    // Axes
    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(plotL, plotT); ctx.lineTo(plotL, plotB); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(plotL, plotB); ctx.lineTo(plotR, plotB); ctx.stroke();

    // Axis labels
    ctx.fillStyle = WCOLORS.textDim; ctx.font = '9px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('θ (degrees)', (plotL + plotR) / 2, plotB + 14);
    ctx.save(); ctx.translate(plotL - 14, (plotT + plotB) / 2); ctx.rotate(-Math.PI / 2);
    ctx.fillText('I / I₀', 0, 0); ctx.restore();

    // Tick marks
    for (let deg = 0; deg <= 90; deg += 30) {
      const x = plotL + (deg / 90) * plotW;
      ctx.beginPath(); ctx.moveTo(x, plotB); ctx.lineTo(x, plotB + 4); ctx.stroke();
      ctx.fillStyle = WCOLORS.textDim; ctx.font = '8px system-ui';
      ctx.fillText(deg + '°', x, plotB + 14);
    }
    for (let iv = 0; iv <= 1; iv += 0.5) {
      const y = plotB - iv * plotH2;
      ctx.beginPath(); ctx.moveTo(plotL - 3, y); ctx.lineTo(plotL, y); ctx.stroke();
      ctx.fillStyle = WCOLORS.textDim; ctx.font = '8px system-ui'; ctx.textAlign = 'right';
      ctx.fillText(iv.toFixed(1), plotL - 5, y + 3);
    }

    // cos²θ curve
    ctx.strokeStyle = WCOLORS.teal; ctx.lineWidth = 2;
    ctx.beginPath();
    for (let deg = 0; deg <= 90; deg += 1) {
      const x = plotL + (deg / 90) * plotW;
      const y = plotB - Math.cos(deg * Math.PI / 180) ** 2 * plotH2;
      if (deg === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Current point
    const currX = plotL + (thetaDeg / 90) * plotW;
    const currY = plotB - I * plotH2;
    ctx.fillStyle = WCOLORS.red;
    ctx.beginPath(); ctx.arc(currX, currY, 5, 0, 2 * Math.PI); ctx.fill();

    // Dashed lines to point
    ctx.strokeStyle = WCOLORS.red; ctx.lineWidth = 1; ctx.setLineDash([3, 3]);
    ctx.beginPath(); ctx.moveTo(currX, plotB); ctx.lineTo(currX, currY); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(plotL, currY); ctx.lineTo(currX, currY); ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = WCOLORS.text; ctx.font = 'bold 10px system-ui'; ctx.textAlign = 'left';
    ctx.fillText('I = I₀cos²(' + thetaDeg + '°) = ' + I.toFixed(3) + ' I₀', plotL + 5, plotT + 12);
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
    ctx.fillStyle = WCOLORS.textDim; ctx.font = '9px system-ui'; ctx.textAlign = 'left';
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
      ctx.fillStyle = WCOLORS.amber; ctx.font = '9px system-ui'; ctx.textAlign = 'left';
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
    ctx.fillText('θ_c = ' + critDeg + '° = arcsin(n₂/n₁)', boxX, boxY + 32);

    if (isTIR) {
      ctx.fillStyle = WCOLORS.red; ctx.font = 'bold 11px system-ui';
      ctx.fillText('θ₁ > θ_c → Total internal reflection!', boxX, boxY + 52);
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
    ctx.fillStyle = WCOLORS.textDim; ctx.font = '8px system-ui'; ctx.textAlign = 'right';
    ctx.fillText('θ_c', barX + barW2, barY2 - 4);
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

  function wavelengthToRGB(wl) {
    // Approximate visible spectrum to RGB
    let r = 0, g = 0, b = 0;
    if (wl >= 380 && wl < 440) { r = -(wl - 440) / 60; b = 1; }
    else if (wl >= 440 && wl < 490) { g = (wl - 440) / 50; b = 1; }
    else if (wl >= 490 && wl < 510) { g = 1; b = -(wl - 510) / 20; }
    else if (wl >= 510 && wl < 580) { r = (wl - 510) / 70; g = 1; }
    else if (wl >= 580 && wl < 645) { r = 1; g = -(wl - 645) / 65; }
    else if (wl >= 645 && wl <= 780) { r = 1; }
    // Intensity falloff at edges
    let factor = 1;
    if (wl >= 380 && wl < 420) factor = 0.3 + 0.7 * (wl - 380) / 40;
    else if (wl > 700 && wl <= 780) factor = 0.3 + 0.7 * (780 - wl) / 80;
    else if (wl < 380 || wl > 780) factor = 0;
    return [Math.round(r * factor * 255), Math.round(g * factor * 255), Math.round(b * factor * 255)];
  }

  function draw() {
    wClear(ctx, W, H);

    const d = parseFloat(thickSlider?.value || 250);
    document.getElementById('thinfilm-thickness-val')?.replaceChildren(document.createTextNode(d.toFixed(0)));

    ctx.fillStyle = WCOLORS.text; ctx.font = 'bold 12px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('Thin film interference', W / 2, 16);

    // --- Film diagram (left) ---
    const filmL = 30, filmR = W * 0.42;
    const filmT = 70, filmB = 160;
    const filmH = filmB - filmT;

    // Air above
    ctx.fillStyle = 'rgba(200,220,255,0.1)';
    ctx.fillRect(filmL, 30, filmR - filmL, filmT - 30);
    ctx.fillStyle = WCOLORS.textDim; ctx.font = '9px system-ui'; ctx.textAlign = 'left';
    ctx.fillText('n = 1.0 (air)', filmL + 3, 45);

    // Film
    ctx.fillStyle = 'rgba(15, 118, 110, 0.15)';
    ctx.fillRect(filmL, filmT, filmR - filmL, filmH);
    ctx.strokeStyle = WCOLORS.teal; ctx.lineWidth = 1.5;
    ctx.strokeRect(filmL, filmT, filmR - filmL, filmH);
    ctx.fillStyle = WCOLORS.teal; ctx.font = '10px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('n = ' + nFilm.toFixed(1), (filmL + filmR) / 2, (filmT + filmB) / 2 + 4);
    ctx.fillText('d = ' + d.toFixed(0) + ' nm', (filmL + filmR) / 2, (filmT + filmB) / 2 + 18);

    // Substrate below
    ctx.fillStyle = 'rgba(100,100,120,0.1)';
    ctx.fillRect(filmL, filmB, filmR - filmL, 30);
    ctx.fillStyle = WCOLORS.textDim; ctx.font = '9px system-ui'; ctx.textAlign = 'left';
    ctx.fillText('n = 1.5 (glass)', filmL + 3, filmB + 20);

    // Thickness dimension
    ctx.strokeStyle = WCOLORS.amber; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(filmR + 8, filmT); ctx.lineTo(filmR + 8, filmB); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(filmR + 4, filmT); ctx.lineTo(filmR + 12, filmT); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(filmR + 4, filmB); ctx.lineTo(filmR + 12, filmB); ctx.stroke();
    ctx.fillStyle = WCOLORS.amber; ctx.font = '9px system-ui'; ctx.textAlign = 'left';
    ctx.fillText('d', filmR + 14, (filmT + filmB) / 2 + 3);

    // Incident ray
    const rayInX = filmL + 60;
    ctx.strokeStyle = WCOLORS.blue; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(rayInX - 20, 30); ctx.lineTo(rayInX, filmT); ctx.stroke();

    // Reflected ray 1 (from top surface, with phase flip)
    ctx.strokeStyle = WCOLORS.red; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(rayInX, filmT); ctx.lineTo(rayInX + 20, 30); ctx.stroke();
    ctx.fillStyle = WCOLORS.red; ctx.font = '8px system-ui'; ctx.textAlign = 'left';
    ctx.fillText('R₁ (π shift)', rayInX + 22, 38);

    // Ray into film
    ctx.strokeStyle = WCOLORS.blue; ctx.lineWidth = 1.5; ctx.globalAlpha = 0.6;
    ctx.beginPath(); ctx.moveTo(rayInX, filmT); ctx.lineTo(rayInX + 15, filmB); ctx.stroke();
    ctx.globalAlpha = 1;

    // Reflected ray 2 (from bottom surface)
    ctx.strokeStyle = WCOLORS.amber; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(rayInX + 15, filmB); ctx.lineTo(rayInX + 35, filmT); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(rayInX + 35, filmT); ctx.lineTo(rayInX + 55, 30); ctx.stroke();
    ctx.fillStyle = WCOLORS.amber; ctx.font = '8px system-ui';
    ctx.fillText('R₂ (no shift)', rayInX + 57, 38);

    // Path difference info
    ctx.fillStyle = WCOLORS.text; ctx.font = '10px system-ui'; ctx.textAlign = 'left';
    ctx.fillText('Path diff ≈ 2n·d = ' + (2 * nFilm * d).toFixed(0) + ' nm', filmL, filmB + 50);
    ctx.fillText('+ λ/2 shift (reflection from n₂ > n₁)', filmL, filmB + 65);

    // --- Color/spectrum view (right) ---
    const specL = W * 0.52, specR = W - 15;
    const specT = 35, specB = H - 20;
    const specW = specR - specL;

    // For each visible wavelength, compute constructive/destructive interference
    // Condition: 2*n*d + λ/2 = m*λ for constructive (including phase flip)
    // Reflectance: R ~ sin²(2πnd/λ) approximately
    const wlMin = 380, wlMax = 780;

    // Spectrum bar
    ctx.fillStyle = WCOLORS.textDim; ctx.font = '10px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('Reflected color', (specL + specR) / 2, specT - 5);

    // Draw spectrum with reflectance modulation
    let totalR = 0, totalG = 0, totalB = 0, totalW = 0;
    for (let i = 0; i < specW; i++) {
      const wl = wlMin + (wlMax - wlMin) * i / specW;
      const x = specL + i;
      // Phase difference including π shift from top reflection
      const delta = 2 * Math.PI * 2 * nFilm * d / wl + Math.PI;
      const reflectance = Math.sin(delta / 2) ** 2;
      const [r, g, b] = wavelengthToRGB(wl);

      // Unmodulated spectrum
      ctx.fillStyle = `rgb(${r},${g},${b})`;
      ctx.fillRect(x, specT, 1, 15);

      // Modulated (reflected)
      const mr = Math.round(r * reflectance);
      const mg = Math.round(g * reflectance);
      const mb = Math.round(b * reflectance);
      ctx.fillStyle = `rgb(${mr},${mg},${mb})`;
      ctx.fillRect(x, specT + 20, 1, 25);

      totalR += mr; totalG += mg; totalB += mb; totalW++;
    }

    // Labels
    ctx.fillStyle = WCOLORS.textDim; ctx.font = '8px system-ui'; ctx.textAlign = 'left';
    ctx.fillText('380nm', specL, specT + 55); ctx.textAlign = 'right';
    ctx.fillText('780nm', specR, specT + 55);
    ctx.fillStyle = WCOLORS.textDim; ctx.font = '9px system-ui'; ctx.textAlign = 'right';
    ctx.fillText('all λ', specL - 5, specT + 10);
    ctx.fillText('reflected', specL - 5, specT + 36);

    // Perceived reflected color swatch
    const avgR = Math.min(255, Math.round(totalR / totalW * 2.5));
    const avgG = Math.min(255, Math.round(totalG / totalW * 2.5));
    const avgB = Math.min(255, Math.round(totalB / totalW * 2.5));
    ctx.fillStyle = `rgb(${avgR},${avgG},${avgB})`;
    ctx.fillRect(specL, specT + 65, specW, 30);
    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 0.5;
    ctx.strokeRect(specL, specT + 65, specW, 30);
    ctx.fillStyle = WCOLORS.textDim; ctx.font = '9px system-ui'; ctx.textAlign = 'right';
    ctx.fillText('perceived', specL - 5, specT + 84);

    // Reflectance curve
    const plotT2 = specT + 110, plotB2 = specB;
    const plotH = plotB2 - plotT2;

    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(specL, plotT2); ctx.lineTo(specL, plotB2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(specL, plotB2); ctx.lineTo(specR, plotB2); ctx.stroke();

    ctx.fillStyle = WCOLORS.textDim; ctx.font = '8px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('Wavelength (nm)', (specL + specR) / 2, plotB2 + 12);
    ctx.save(); ctx.translate(specL - 10, (plotT2 + plotB2) / 2); ctx.rotate(-Math.PI / 2);
    ctx.fillText('R', 0, 0); ctx.restore();

    ctx.strokeStyle = WCOLORS.teal; ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i <= specW; i++) {
      const wl = wlMin + (wlMax - wlMin) * i / specW;
      const delta = 2 * Math.PI * 2 * nFilm * d / wl + Math.PI;
      const R = Math.sin(delta / 2) ** 2;
      const x = specL + i;
      const y = plotB2 - R * plotH;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Constructive peaks
    ctx.fillStyle = WCOLORS.text; ctx.font = '8px system-ui'; ctx.textAlign = 'center';
    for (let m = 1; m <= 10; m++) {
      // 2nd = mλ → λ = 2nd/m
      const wlPeak = 2 * nFilm * d / m;
      if (wlPeak >= wlMin && wlPeak <= wlMax) {
        const x = specL + (wlPeak - wlMin) / (wlMax - wlMin) * specW;
        ctx.fillStyle = WCOLORS.red;
        ctx.beginPath(); ctx.arc(x, plotT2 + 3, 3, 0, 2 * Math.PI); ctx.fill();
        ctx.fillText(Math.round(wlPeak), x, plotT2 - 3);
      }
    }
  }

  thickSlider?.addEventListener('input', draw);
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
      ctx.fillStyle = WCOLORS.textDim; ctx.font = '8px system-ui'; ctx.textAlign = 'center';
      ctx.fillText(deg + '°', x, plotB + 12);
    }
    for (let v = -1; v <= 1; v += 0.5) {
      const y = plotB - ((v + 1) / 2) * plotH;
      ctx.strokeStyle = WCOLORS.grid; ctx.lineWidth = 0.5;
      ctx.beginPath(); ctx.moveTo(plotL, y); ctx.lineTo(plotR, y); ctx.stroke();
      ctx.fillStyle = WCOLORS.textDim; ctx.font = '8px system-ui'; ctx.textAlign = 'right';
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
    ctx.fillText('θ_B = ' + brewsterAngle.toFixed(1) + '°', bx, plotT - 5);
    ctx.fillStyle = WCOLORS.teal;
    ctx.beginPath(); ctx.arc(bx, zeroY, 5, 0, 2 * Math.PI); ctx.fill();

    // Critical angle marker (for n < 1 going from dense to less dense)
    if (critAngle !== null) {
      const cx = plotL + (critAngle / 90) * plotW;
      ctx.strokeStyle = WCOLORS.amber; ctx.lineWidth = 1.5; ctx.setLineDash([4, 3]);
      ctx.beginPath(); ctx.moveTo(cx, plotT); ctx.lineTo(cx, plotB); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = WCOLORS.amber; ctx.font = 'bold 10px system-ui';
      ctx.fillText('θ_c = ' + critAngle.toFixed(1) + '°', cx, plotT - 5);
    }

    // Legend
    ctx.font = '11px system-ui'; ctx.textAlign = 'left';
    ctx.fillStyle = WCOLORS.blue; ctx.fillText('── rₛ (s-polarization)', plotL + 10, plotT + 15);
    ctx.fillStyle = WCOLORS.red; ctx.fillText('── rₚ (p-polarization)', plotL + 10, plotT + 30);
    ctx.fillStyle = WCOLORS.teal; ctx.fillText('⬤ Brewster angle (rₚ = 0)', plotL + 10, plotT + 45);

    // Info
    ctx.fillStyle = WCOLORS.text; ctx.font = '10px system-ui'; ctx.textAlign = 'right';
    ctx.fillText('n₂/n₁ = ' + n.toFixed(2), plotR, plotT + 15);
    ctx.fillText('θ_B = arctan(n₂/n₁) = ' + brewsterAngle.toFixed(1) + '°', plotR, plotT + 30);
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

    ctx.fillStyle = WCOLORS.textDim; ctx.font = '9px system-ui'; ctx.textAlign = 'center';
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

    ctx.fillStyle = WCOLORS.textDim; ctx.font = '9px system-ui'; ctx.textAlign = 'left';
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
      ctx.fillStyle = color; ctx.font = '9px system-ui'; ctx.textAlign = 'left';
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
